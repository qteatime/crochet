import { ResolvedPackage } from "../../pkg";
import { CrochetPackage, CrochetPrelude, CrochetWorld } from "../intrinsics";

export function add_prelude(world: CrochetWorld, prelude: CrochetPrelude) {
  world.prelude.push(prelude);
}

export function get_or_make_package(world: CrochetWorld, pkg: ResolvedPackage) {
  const result = world.packages.get(pkg.name);
  if (result != null) {
    return result;
  } else {
    const cpkg = new CrochetPackage(world, pkg.name, pkg.filename);
    for (const dep of pkg.dependencies) {
      cpkg.dependencies.add(dep.name);
    }
    world.packages.set(pkg.name, cpkg);
    return cpkg;
  }
}
