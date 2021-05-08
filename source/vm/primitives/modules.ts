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
