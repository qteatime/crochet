import {
  CrochetCapability,
  CrochetModule,
  CrochetPackage,
  CrochetTrait,
  CrochetType,
  CrochetValue,
  ErrArbitrary,
  Tag,
  Universe,
} from "..";
import * as Location from "./location";
import * as Types from "./types";
import * as Values from "./values";
import * as Modules from "./modules";

export function define_capability(
  module: CrochetModule,
  capability: CrochetCapability
) {
  const ns = module.pkg.capabilities;
  if (!ns.define(capability.name, capability)) {
    throw new ErrArbitrary(
      "duplicated-capability",
      `Duplicated capability declaration ${
        capability.name
      } in ${Location.module_location(module)}`
    );
  }
  module.pkg.granted_capabilities.add(capability);
}

export function get_capability(module: CrochetModule, name: string) {
  const capability = module.pkg.capabilities.try_lookup(name);
  if (capability != null) {
    return capability;
  }

  const missing = module.pkg.missing_capabilities.try_lookup(name);
  if (missing != null) {
    return missing;
  }

  const placeholder = make_placeholder_capability(module, name);
  module.pkg.missing_capabilities.define(name, placeholder);
  return placeholder;
}

export function make_placeholder_capability(
  module: CrochetModule,
  name: string
) {
  return new CrochetCapability(module, name, "(placeholder capability)", null);
}

export function try_get_placeholder_capability(
  module: CrochetModule,
  name: string
) {
  return module.pkg.missing_capabilities.try_lookup(name);
}

export function fulfill_placeholder_capability(
  module: CrochetModule,
  placeholder: CrochetCapability,
  capability: CrochetCapability
) {
  const value = module.pkg.missing_capabilities.try_lookup(capability.name);
  if (value !== placeholder) {
    throw new ErrArbitrary(
      "internal",
      `Invalid placeholder for ${capability.name}`
    );
  }

  module.pkg.missing_capabilities.remove(capability.name);
  const p: { -readonly [k in keyof typeof capability]: typeof capability[k] } =
    placeholder;
  p.protecting = capability.protecting;
  p.module = capability.module;
  p.name = capability.name;
  p.documentation = capability.documentation;
  p.meta = capability.meta;

  return p;
}

export function verify_package_capabilities(pkg: CrochetPackage) {
  if (pkg.missing_capabilities.own_bindings.size > 0) {
    throw new ErrArbitrary(
      "internal",
      `Package ${
        pkg.name
      } cannot be loaded because it's missing the following capability definitions: ${[
        ...pkg.missing_capabilities.own_bindings.keys(),
      ].join(", ")}`
    );
  }
}

export function protect_type(
  universe: Universe,
  module: CrochetModule,
  name: string,
  capability: CrochetCapability
) {
  const type = Types.get_type(module, name);
  type.protected_by.add(capability);
  capability.protecting.add(type);
}

export function protect_trait(
  universe: Universe,
  module: CrochetModule,
  name: string,
  capability: CrochetCapability
) {
  const trait = Types.get_trait(module, name);
  trait.protected_by.add(capability);
  capability.protecting.add(trait);
}

export function protect_effect(
  universe: Universe,
  module: CrochetModule,
  name: string,
  capability: CrochetCapability
) {
  return protect_type(universe, module, name, capability);
}

export function protect_definition(
  universe: Universe,
  module: CrochetModule,
  name: string,
  capability: CrochetCapability
) {
  const global = Modules.get_specific_global(module, name);
  const protected_value = Values.protect(universe, global, capability);
  Modules.replace_global(module, name, global, protected_value);
  capability.protecting.add(global);
}

export function free_definition(
  module: CrochetModule,
  name: string,
  value: CrochetValue
) {
  switch (value.tag) {
    case Tag.PROTECTED: {
      Values.assert_tag(Tag.PROTECTED, value);
      assert_capabilities(
        module,
        value.payload.protected_by,
        "Accessing definition",
        name
      );
      return value.payload.value;
    }

    default: {
      return value;
    }
  }
}

export function free_type(module: CrochetModule, type: CrochetType) {
  assert_capabilities(module, type.protected_by, "Accessing type", type.name);
  return type;
}

export function free_trait(module: CrochetModule, trait: CrochetTrait) {
  assert_capabilities(
    module,
    trait.protected_by,
    "Accessing trait",
    trait.name
  );
  return trait;
}

export function free_effect(module: CrochetModule, effect: CrochetType) {
  assert_capabilities(
    module,
    effect.protected_by,
    "Accessing effect",
    effect.name
  );
  return effect;
}

export function assert_capabilities(
  module: CrochetModule,
  required: Set<CrochetCapability>,
  operation: string,
  name: string
) {
  if (required.size === 0) return;

  const granted = module.pkg.granted_capabilities;
  for (const r of required) {
    if (granted.has(r)) return;
  }
  const caps = [...required].map((x) => x.full_name);
  throw new ErrArbitrary(
    "lacking-capability",
    `${operation} ${name} cannot be done in ${Location.module_location(
      module
    )} because the package does not have any of the following required capabilities: ${caps.join(
      ", "
    )}`
  );
}

export function assert_projection_capability(
  universe: Universe,
  module: CrochetModule,
  value: CrochetValue,
  name: string
) {
  const type_pkg = value.type.module?.pkg;
  if (!type_pkg) {
    if (!universe.trusted_base.has(module.pkg)) {
      throw new ErrArbitrary(
        "lacking-capability",
        `Projecting ${name} from ${Location.type_name(
          value.type
        )} is not possible, as it's an intrinsic type. Intrinsic types can only be managed by the Crochet runtime for security.`
      );
    } else {
      return;
    }
  }

  if (module.pkg !== type_pkg) {
    throw new ErrArbitrary(
      "lacking-capability",
      `Projecting ${name} from ${Location.type_name(
        value.type
      )} is not possible in ${Location.module_location(
        module
      )}. Projecting values is only allowed inside of its declaring package---the package must expose commands if it wants fields to be accessible externally.`
    );
  }
}

export function assert_construct_capability(
  universe: Universe,
  module: CrochetModule,
  type: CrochetType
) {
  const type_pkg = type.module?.pkg;
  if (!type_pkg) {
    if (!universe.trusted_base.has(module.pkg)) {
      throw new ErrArbitrary(
        "lacking-capability",
        `Constructing ${Location.type_name(
          type
        )} is not possible, as it's an intrinsic type. Intrinsic types can only be constructed by the Crochet runtime for security.`
      );
    } else {
      return;
    }
  }

  if (module.pkg !== type_pkg) {
    throw new ErrArbitrary(
      "lacking-capability",
      `Constructing ${Location.type_name(
        type
      )} is not possible in ${Location.module_location(
        module
      )}. Constructing types directly is only allowed inside of its declaring package---the package must expose commands if it wants the type to be constructed externally.`
    );
  }
}
