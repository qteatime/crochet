import { Universe, CrochetTest } from "../intrinsics";

export function add_test(universe: Universe, test: CrochetTest) {
  universe.world.tests.push(test);
}
