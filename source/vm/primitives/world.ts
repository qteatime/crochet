import { ResolvedPackage } from "../../pkg";
import * as Packages from "./packages";
import {
  CrochetPackage,
  CrochetPrelude,
  CrochetWorld,
  Universe,
} from "../intrinsics";

export function add_prelude(world: CrochetWorld, prelude: CrochetPrelude) {
  world.prelude.push(prelude);
}

export function get_or_make_package(universe: Universe, pkg: ResolvedPackage) {
  const world = universe.world;
  const result = world.packages.get(pkg.name);
  if (result != null) {
    return result;
  } else {
    const cpkg = new CrochetPackage(world, pkg);
    for (const dep of pkg.dependencies) {
      cpkg.dependencies.add(dep.name);
    }
    Packages.initialise_types(universe, cpkg);
    world.packages.set(pkg.name, cpkg);
    return cpkg;
  }
}
