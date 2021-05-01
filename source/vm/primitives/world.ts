import { CrochetPrelude, CrochetWorld } from "../intrinsics";

export function add_prelude(world: CrochetWorld, prelude: CrochetPrelude) {
  world.prelude.push(prelude);
}
