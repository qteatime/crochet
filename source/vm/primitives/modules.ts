import * as IR from "../../ir";
import { logger } from "../../utils/logger";
import { ErrArbitrary } from "../errors";
import { CrochetModule, CrochetValue, Universe } from "../intrinsics";
import { module_location } from "./location";
import { assert_open_allowed } from "./packages";

export function open(module: CrochetModule, namespace: string) {
  assert_open_allowed(module.pkg, namespace);
  module.open_prefixes.add(namespace);
}

export function define(
  module: CrochetModule,
  visibility: IR.Visibility,
  name: string,
  value: CrochetValue
) {
  const ns = get_define_namespace(module, visibility);
  logger.debug(
    `Defining ${IR.Visibility[visibility]} ${name} in ${module_location(
      module
    )}`
  );
  if (!ns.define(name, value)) {
    throw new ErrArbitrary(
      "duplicated-definition",
      `Duplicated definition ${name} in ${module_location(module)}`
    );
  }
}

export function get_define_namespace(
  module: CrochetModule,
  visibility: IR.Visibility
) {
  switch (visibility) {
    case IR.Visibility.LOCAL:
      return module.definitions;
    case IR.Visibility.GLOBAL:
      return module.pkg.definitions;
  }
}

export function get_type_namespace(
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

export function get_trait_namespace(module: CrochetModule) {
  return module.pkg.traits;
}

export function get_global(module: CrochetModule, name: string) {
  const value = module.definitions.try_lookup(name);
  if (value == null) {
    throw new ErrArbitrary(
      "undefined",
      `The definition ${name} is not accessible from ${module_location(module)}`
    );
  }
  return value;
}

export function get_specific_global(module: CrochetModule, name: string) {
  const global_name = module.pkg.definitions.prefixed(name);
  const value = module.pkg.world.definitions.try_lookup_local(global_name);
  if (value == null) {
    throw new ErrArbitrary(
      "undefined",
      `The definition ${name} is not accessible from package ${module.pkg.name}`
    );
  }
  return value;
}

export function replace_global(
  module: CrochetModule,
  name: string,
  old: CrochetValue,
  value: CrochetValue
) {
  const global_name = module.pkg.definitions.prefixed(name);
  const actual = module.pkg.world.definitions.try_lookup_local(global_name);
  if (old === actual) {
    module.pkg.world.definitions.overwrite(global_name, value);
  } else {
    throw new ErrArbitrary(
      "replace-not-allowed",
      `Replacing ${name} in ${module.pkg.name} is not allowed; the provided capability is not correct`
    );
  }
}
