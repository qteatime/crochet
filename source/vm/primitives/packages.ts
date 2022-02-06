import { CrochetCapability, CrochetModule, CrochetType } from "..";
import { Visibility } from "../../ir";
import { ErrArbitrary } from "../errors";
import { CrochetPackage, Universe } from "../intrinsics";
import {
  define_capability,
  protect_definition,
  protect_type,
} from "./capability";
import { define } from "./modules";
import { define_type, seal } from "./types";
import { instantiate, make_package_value } from "./values";

export function is_open_allowed(pkg: CrochetPackage, namespace: string) {
  return pkg.dependencies.has(namespace);
}

export function assert_open_allowed(pkg: CrochetPackage, namespace: string) {
  if (!is_open_allowed(pkg, namespace)) {
    throw new ErrArbitrary(
      "no-open-capability",
      `Cannot open name ${namespace} from ${pkg.name} because it's not declared as a dependency`
    );
  }
}

export function initialise_types(universe: Universe, pkg: CrochetPackage) {
  const internal_module = new CrochetModule(pkg, "(internal)", null);

  // Internal type
  const package_type = new CrochetType(
    internal_module,
    "package",
    "",
    universe.types.Package,
    [],
    [],
    false,
    null
  );
  const package_value = make_package_value(universe, package_type, pkg);
  seal(package_type);
  define_type(internal_module, "package", package_type, Visibility.GLOBAL);
  define(internal_module, Visibility.GLOBAL, "package", package_value);

  // Internal capability
  const internal_cap = new CrochetCapability(
    internal_module,
    "internal",
    "Definitions internal to this package.",
    null
  );
  define_capability(internal_module, internal_cap);

  protect_type(universe, internal_module, "package", internal_cap);
  protect_definition(universe, internal_module, "package", internal_cap);
}
