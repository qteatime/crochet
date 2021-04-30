import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { ErrArbitrary } from "../errors";
import { Universe, CrochetModule, CrochetType } from "../intrinsics";
import * as Location from "./location";

export function is_subtype(type: CrochetType, parent: CrochetType): boolean {
  if (type === parent) {
    return true;
  } else if (type.parent != null) {
    return is_subtype(type.parent, parent);
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
  const ns = get_namespace(module, visibility);
  if (!ns.define(name, type)) {
    throw new ErrArbitrary(
      "duplicated-type",
      `Duplicated definition of type ${name} in ${Location.module_location(
        module
      )}`
    );
  }
}

export function get_namespace(
  module: CrochetModule,
  visibility: IR.Visibility
) {
  switch (visibility) {
    case IR.Visibility.LOCAL:
      return module.types;
    case IR.Visibility.GLOBAL:
      return module.pkg.types;
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
