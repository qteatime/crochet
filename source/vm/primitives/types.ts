import { CrochetPackage } from "..";
import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { ErrArbitrary } from "../errors";
import {
  Universe,
  CrochetModule,
  CrochetType,
  CrochetTrait,
  CrochetValue,
  CrochetTypeConstraint,
} from "../intrinsics";
import * as Location from "./location";
import { get_trait_namespace, get_type_namespace } from "./modules";
import {
  get_namespace,
  try_resolve_trait_alias,
  try_resolve_type_alias,
} from "./namespaces";
import { assert_open_allowed } from "./packages";

export function is_subtype(type: CrochetType, parent: CrochetType): boolean {
  if (type === parent) {
    return true;
  } else if (type.parent != null) {
    return is_subtype(type.parent, parent);
  } else {
    return false;
  }
}

export function fulfills_constraint(
  constraint: CrochetTypeConstraint,
  type: CrochetType
) {
  return (
    is_subtype(type, constraint.type) &&
    constraint.traits.every((t) => has_trait(t, type))
  );
}

export function has_trait(trait: CrochetTrait, type: CrochetType): boolean {
  if (type.traits.has(trait)) {
    return true;
  } else if (type.parent != null) {
    return has_trait(trait, type.parent);
  } else {
    return false;
  }
}

export function get_static_type(universe: Universe, type: CrochetType) {
  if (type.is_static) {
    return type;
  }

  const cached = universe.type_cache.get(type);
  if (cached != null) {
    return cached;
  } else {
    const name = `#${type.name}`;
    const static_type = new CrochetType(
      type.module,
      name,
      "",
      universe.types.Type,
      [],
      [],
      true,
      null
    );
    universe.type_cache.set(type, static_type);
    universe.reverse_type_cache.set(static_type, type);
    return static_type;
  }
}

export function get_type(module: CrochetModule, name: string) {
  const value = module.types.try_lookup(name);
  if (value != null) {
    return value;
  }

  const missing = module.missing_types.try_lookup(name);
  if (missing != null) {
    return missing;
  }

  const placeholder = make_placeholder_type(module, name);
  module.missing_types.define(name, placeholder);
  return placeholder;
}

export function get_trait_namespaced(
  module: CrochetModule,
  namespace: string,
  name: string
) {
  assert_open_allowed(module.pkg, namespace);
  const value = module.traits.try_lookup_namespaced(namespace, name);
  if (value != null) {
    return value;
  } else {
    throw new ErrArbitrary(
      "undefined-trait",
      `The trait ${namespace}/${name} is not defined`
    );
  }
}

export function get_trait(module: CrochetModule, name: string) {
  const value = module.traits.try_lookup(name);
  if (value != null) {
    return value;
  }

  const missing = module.pkg.missing_traits.try_lookup(name);
  if (missing != null) {
    return missing;
  }

  const placeholder = make_placeholder_trait(module, name);
  module.pkg.missing_traits.define(name, placeholder);
  return placeholder;
}

export function get_type_namespaced(
  module: CrochetModule,
  namespace: string,
  name: string
) {
  assert_open_allowed(module.pkg, namespace);
  const value = module.types.try_lookup_namespaced(namespace, name);
  if (value != null) {
    return value;
  } else {
    throw new ErrArbitrary(
      "no-type",
      `No type ${namespace}/${name} is accessible from ${Location.module_location(
        module
      )}`
    );
  }
}

export function materialise_type(
  universe: Universe,
  module: CrochetModule,
  type: IR.Type
): CrochetType {
  switch (type.tag) {
    case IR.TypeTag.ANY:
      return universe.types.Any;

    case IR.TypeTag.UNKNOWN:
      return universe.types.Unknown;

    case IR.TypeTag.LOCAL: {
      const value = try_resolve_type_alias(
        module,
        module.default_namespace,
        type.name
      );
      if (value == null) {
        return get_type(module, type.name);
      } else {
        return materialise_type(universe, module, value);
      }
    }

    case IR.TypeTag.LOCAL_NAMESPACED: {
      const ns = get_namespace(module, type.namespace);
      const value = try_resolve_type_alias(module, ns, type.name);
      if (value == null) {
        throw new ErrArbitrary(
          "undefined-type",
          `The alias ${type.name} is not accessible from the namespace ${
            ns.name
          } in ${Location.module_location(module)}`
        );
      } else {
        return materialise_type(universe, module, value);
      }
    }

    case IR.TypeTag.LOCAL_STATIC: {
      const value = materialise_type(
        universe,
        module,
        new IR.LocalType(type.meta, type.name)
      );
      return get_static_type(universe, value);
    }

    case IR.TypeTag.GLOBAL_STATIC: {
      const value = get_type_namespaced(module, type.namespace, type.name);
      return get_static_type(universe, value);
    }

    case IR.TypeTag.GLOBAL: {
      return get_type_namespaced(module, type.namespace, type.name);
    }

    default:
      throw unreachable(type, "Type");
  }
}

export function materialise_type_constraint(
  universe: Universe,
  module: CrochetModule,
  constraint: IR.TypeConstraint
): CrochetTypeConstraint {
  switch (constraint.tag) {
    case IR.TypeConstraintTag.TYPE: {
      return new CrochetTypeConstraint(
        materialise_type(universe, module, constraint.type),
        []
      );
    }

    case IR.TypeConstraintTag.WITH_TRAIT: {
      const base = materialise_type_constraint(
        universe,
        module,
        constraint.type
      );
      return new CrochetTypeConstraint(base.type, [
        ...base.traits,
        ...constraint.traits.map((t) => materialise_trait(universe, module, t)),
      ]);
    }
  }
}

export function materialise_trait(
  universe: Universe,
  module: CrochetModule,
  trait: IR.Trait
): CrochetTrait {
  switch (trait.tag) {
    case IR.TraitTag.LOCAL: {
      const value = try_resolve_trait_alias(
        module,
        module.default_namespace,
        trait.name
      );
      if (value == null) {
        return get_trait(module, trait.name);
      } else {
        return materialise_trait(universe, module, value);
      }
    }

    case IR.TraitTag.GLOBAL: {
      return get_trait_namespaced(module, trait.namespace, trait.name);
    }

    case IR.TraitTag.NAMESPACED: {
      const ns = get_namespace(module, trait.namespace);
      const value = try_resolve_trait_alias(module, ns, trait.name);
      if (value == null) {
        throw new ErrArbitrary(
          "undefined-alias",
          `The alias ${
            trait.name
          } is not defined for any trait in the namespace ${
            ns.name
          } from ${Location.module_location(module)}`
        );
      }
      return materialise_trait(universe, module, value);
    }

    default:
      throw unreachable(trait, "Trait");
  }
}

export function get_foreign_type(
  universe: Universe,
  module: CrochetModule,
  name: string
) {
  const result = universe.world.native_types.try_lookup_namespaced(
    module.pkg.name,
    name
  );
  if (result == null) {
    throw new ErrArbitrary(
      "no-foreign-type",
      `No foreign type ${name} is accessible from ${Location.module_location(
        module
      )}`
    );
  }
  return result;
}

export function define_type(
  module: CrochetModule,
  name: string,
  type: CrochetType,
  visibility: IR.Visibility
) {
  const ns = get_type_namespace(module, visibility);
  if (!ns.define(name, type)) {
    throw new ErrArbitrary(
      "duplicated-type",
      `Duplicated definition of type ${name} in ${Location.module_location(
        module
      )}`
    );
  }
}

export function define_trait(
  module: CrochetModule,
  name: string,
  trait: CrochetTrait
) {
  const ns = get_trait_namespace(module);
  if (!ns.define(name, trait)) {
    throw new ErrArbitrary(
      "duplicated-trait",
      `Duplicated definition of trait ${name} in ${Location.module_location(
        module
      )}`
    );
  }
}

export function get_function_type(universe: Universe, arity: number) {
  const type = universe.types.Function[arity];
  if (type != null) {
    return type;
  } else {
    throw new ErrArbitrary(
      "invalid-function",
      `internal: Functions of arity ${arity} are not currently supported`
    );
  }
}

export function distance(type: CrochetType): number {
  if (type.parent == null) {
    return 0;
  } else {
    return 1 + distance(type.parent);
  }
}

export function compare(t1: CrochetType, t2: CrochetType): number {
  return distance(t2) - distance(t1);
}

export function compare_constraints(
  t1: CrochetTypeConstraint,
  t2: CrochetTypeConstraint
): number {
  return constraint_distance(t2) - constraint_distance(t1);
}

export function constraint_distance(t: CrochetTypeConstraint) {
  const d = distance(t.type) * 2;
  if (t.traits.length !== 0) {
    return d + 1;
  } else {
    return d;
  }
}

export function seal(type: CrochetType) {
  type.sealed = true;
}

export function* registered_instances(
  universe: Universe,
  type: CrochetType
): Generator<CrochetValue, any, any> {
  const instances = universe.registered_instances.get(type) ?? [];
  yield* instances;
  for (const sub_type of type.sub_types) {
    yield* registered_instances(universe, sub_type);
  }
}

export function resolve_field_layout(
  type: CrochetType,
  fields: string[],
  values: CrochetValue[]
) {
  if (fields.length !== values.length) {
    throw new Error(`internal: named instantiation with inconsistent values`);
  }
  if (fields.length !== type.fields.length) {
    const given = new Set(fields);
    const missing = type.fields.filter((x) => !given.has(x));
    throw new ErrArbitrary(
      "missing-fields",
      `Cannot construct ${Location.type_name(
        type
      )} because the following fields are missing: ${missing.join(", ")}`
    );
  }
  const results = new Array(type.fields.length);
  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i];
    const value = values[i];
    const index = type.layout.get(field);
    if (index == null) {
      throw new ErrArbitrary(
        "unknown-field",
        `The field ${field} does not exist in type ${Location.type_name(
          type
        )} (known fields: ${type.fields.join(", ")})`
      );
    } else {
      results[index] = value;
    }
  }
  return results;
}

export function resolve_field_layout_with_base(
  type: CrochetType,
  fields: string[],
  values: CrochetValue[],
  base: CrochetValue[]
) {
  if (fields.length !== values.length || base.length !== type.fields.length) {
    throw new Error(`internal: named instantiation with inconsistent values`);
  }
  const results = new Array(type.fields.length);
  for (let i = 0; i < results.length; ++i) {
    results[i] = base[i];
  }
  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i];
    const value = values[i];
    const index = type.layout.get(field);
    if (index == null) {
      throw new ErrArbitrary(
        "unknown-field",
        `The field ${field} does not exist in type ${Location.type_name(
          type
        )} (known fields: ${type.fields.join(", ")})`
      );
    } else {
      results[index] = value;
    }
  }
  return results;
}

export function make_placeholder_type(module: CrochetModule, name: string) {
  const type = new CrochetType(
    module,
    name,
    "(placeholder type)",
    null,
    [],
    [],
    false,
    null
  );
  type.is_placeholder = true;
  return type;
}

export function make_placeholder_trait(module: CrochetModule, name: string) {
  return new CrochetTrait(module, name, "(placeholder trait)", null);
}

export function try_get_placeholder_type(module: CrochetModule, name: string) {
  return module.missing_types.try_lookup(name);
}

export function try_get_placeholder_trait(module: CrochetModule, name: string) {
  return module.pkg.missing_traits.try_lookup(name);
}

export function fulfill_placeholder_type(
  module: CrochetModule,
  placeholder: CrochetType,
  type: CrochetType,
  visibility: IR.Visibility
) {
  const value = module.missing_types.try_lookup(type.name);
  if (value !== placeholder) {
    throw new ErrArbitrary("internal", `Invalid placeholder for ${type.name}.`);
  }

  module.missing_types.remove(type.name);
  if (visibility === IR.Visibility.GLOBAL) {
    module.pkg.missing_types.remove(type.name);
  }

  const p: { -readonly [k in keyof typeof type]: typeof type[k] } = placeholder;
  p.sealed = type.sealed;
  p.layout = type.layout;
  p.sub_types = type.sub_types;
  p.traits = type.traits;
  p.protected_by = type.protected_by;
  p.module = type.module;
  p.name = type.name;
  p.documentation = type.documentation;
  p.parent = type.parent;
  p.fields = type.fields;
  p.types = type.types;
  p.is_static = type.is_static;
  p.meta = type.meta;
  p.is_placeholder = false;

  return placeholder;
}

export function fulfill_placeholder_trait(
  module: CrochetModule,
  placeholder: CrochetTrait,
  trait: CrochetTrait
) {
  const value = module.pkg.missing_traits.try_lookup(trait.name);
  if (value !== placeholder) {
    throw new ErrArbitrary("internal", `Invalid placeholder for ${trait.name}`);
  }

  module.pkg.missing_traits.remove(trait.name);
  const p: { -readonly [k in keyof typeof trait]: typeof trait[k] } =
    placeholder;
  p.implemented_by = trait.implemented_by;
  p.protected_by = trait.protected_by;
  p.module = trait.module;
  p.name = trait.name;
  p.documentation = trait.documentation;
  p.meta = trait.meta;

  return placeholder;
}

export function promote_missing_types(module: CrochetModule) {
  for (const [name, type] of module.missing_types.own_bindings) {
    module.missing_types.remove(name);
    if (!module.pkg.missing_types.define(name, type)) {
      throw new ErrArbitrary("internal", `Duplicate placeholder ${name}`);
    }
  }
}

export function verify_package_types(pkg: CrochetPackage) {
  if (pkg.missing_types.own_bindings.size > 0) {
    throw new ErrArbitrary(
      "internal",
      `Package ${
        pkg.name
      } cannot be loaded because it's missing the following type definitions: ${[
        ...pkg.missing_types.own_bindings.keys(),
      ].join(", ")}`
    );
  }
}

export function verify_package_traits(pkg: CrochetPackage) {
  if (pkg.missing_traits.own_bindings.size > 0) {
    throw new ErrArbitrary(
      "internal",
      `Package ${
        pkg.name
      } cannot be loaded because it's missing the following trait definitions: ${[
        ...pkg.missing_traits.own_bindings.keys(),
      ].join(", ")}`
    );
  }
}
