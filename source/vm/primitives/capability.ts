import {
  CrochetCapability,
  CrochetModule,
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
  if (capability == null) {
    throw new ErrArbitrary(
      "undefined-capability",
      `The capability ${name} is not defined in package ${module.pkg.name}`
    );
  }
  return capability;
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
