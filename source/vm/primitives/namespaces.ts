import * as IR from "../../ir";
import { ErrArbitrary } from "../errors";
import { unreachable } from "../../utils/utils";
import {
  AliasTag,
  CrochetModule,
  Alias,
  CrochetNamespace,
} from "../intrinsics";
import {
  get_trait,
  get_trait_namespaced,
  get_type,
  get_type_namespaced,
} from "./types";
import { module_location } from "./location";
import { ConcreteAlias } from "..";

export function try_resolve_alias<A>(
  module: CrochetModule,
  repo: (_: CrochetNamespace) => Map<string, Alias<A>>,
  ns0: CrochetNamespace,
  name: string
) {
  let ns: CrochetNamespace | null = ns0;
  const visited = new Set<string>([ns0.name]);

  while (ns != null) {
    const real_name = repo(ns).get(name);
    // Undefined alias
    if (real_name == null) {
      return null;
    }

    switch (real_name.tag) {
      case AliasTag.CONCRETE:
        return real_name.entity;

      case AliasTag.LINK: {
        if (visited.has(real_name.namespace)) {
          throw new ErrArbitrary(
            "circular-alias",
            `Cannot resolve ${ns0}/${name} because the alias chain forms an infinite loop.`
          );
        }

        visited.add(real_name.namespace);
        ns = module.namespaces.try_lookup(real_name.namespace);
        continue;
      }

      default:
        throw unreachable(real_name, "Alias");
    }
  }

  // Global name
  if (ns == null) {
    return null;
  }
}

export function try_resolve_type_alias(
  module: CrochetModule,
  ns: CrochetNamespace,
  name: string
) {
  return try_resolve_alias(module, (x) => x.types, ns, name);
}

export function try_resolve_trait_alias(
  module: CrochetModule,
  ns: CrochetNamespace,
  name: string
) {
  return try_resolve_alias(module, (x) => x.traits, ns, name);
}

export function resolve_target(
  module: CrochetModule,
  target: IR.Entity
): Alias<any> {
  const t = IR.EntityTag;
  switch (target.tag) {
    case t.GLOBAL_TRAIT: {
      return new ConcreteAlias(
        new IR.GlobalTrait(IR.NO_METADATA, target.namespace, target.name)
      );
    }

    case t.GLOBAL_TYPE: {
      return new ConcreteAlias(
        new IR.GlobalType(IR.NO_METADATA, target.namespace, target.name)
      );
    }

    case t.LOCAL_TRAIT: {
      return new ConcreteAlias(new IR.LocalTrait(IR.NO_METADATA, target.name));
    }

    case t.LOCAL_TYPE: {
      return new ConcreteAlias(new IR.LocalType(IR.NO_METADATA, target.name));
    }

    default:
      throw unreachable(target, "Entity");
  }
}

export function resolve_repo(ns: CrochetNamespace, entity: IR.Entity) {
  const t = IR.EntityTag;
  switch (entity.tag) {
    case t.GLOBAL_TRAIT:
    case t.LOCAL_TRAIT: {
      return ns.traits;
    }

    case t.GLOBAL_TYPE:
    case t.LOCAL_TYPE: {
      return ns.types;
    }

    default:
      throw unreachable(entity, "Entity");
  }
}

export function define_alias(
  module: CrochetModule,
  ns: CrochetNamespace,
  name: string,
  target: IR.Entity
) {
  const value = resolve_target(module, target);
  const repo = resolve_repo(ns, target);
  if (repo.has(name)) {
    throw new ErrArbitrary(
      "duplicated-alias",
      `The alias ${name} is already defined in the ${
        ns.name
      } namespace of ${module_location(ns.module)}.`
    );
  }
  repo.set(name, value);
}

export function define_namespace(module: CrochetModule, ns: CrochetNamespace) {
  if (!module.namespaces.define(ns.name, ns)) {
    throw new ErrArbitrary(
      "duplicated-namespace",
      `The namespace ${ns.name} cannot be defined in ${module_location(
        module
      )} because it is already defined in the package ${module.pkg.name}`
    );
  }
}

export function get_namespace(module: CrochetModule, name: string) {
  const ns = module.namespaces.try_lookup(name);
  if (ns == null) {
    throw new ErrArbitrary(
      "undefined-namespace",
      `The namespace ${name} does not exist in ${module_location(module)}`
    );
  }
  return ns;
}
