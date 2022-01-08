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
  } else {
    throw new ErrArbitrary(
      "no-type",
      `No type ${name} is accessible from ${Location.module_location(module)}`
    );
  }
}

export function get_trait(module: CrochetModule, name: string) {
  const value = module.traits.try_lookup(name);
  if (value != null) {
    return value;
  } else {
    throw new ErrArbitrary(
      "no-trait",
      `No trait ${name} is accessible from ${Location.module_location(module)}`
    );
  }
}

export function get_type_namespaced(
  module: CrochetModule,
  namespace: string,
  name: string
) {
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
) {
  switch (type.tag) {
    case IR.TypeTag.ANY:
      return universe.types.Any;

    case IR.TypeTag.UNKNOWN:
      return universe.types.Unknown;

    case IR.TypeTag.LOCAL: {
      return get_type(module, type.name);
    }

    case IR.TypeTag.LOCAL_STATIC: {
      const value = get_type(module, type.name);
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
) {
  switch (trait.tag) {
    case IR.TraitTag.LOCAL: {
      return get_trait(module, trait.name);
    }

    default:
      throw unreachable(trait as never, "Trait");
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
