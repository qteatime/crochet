import { State } from "../runtime";

import Ffis from "./native";

export async function load(state: State) {
  for (const ffi of Ffis) {
    state.world.ffi.add(ffi as any);
  }
}

import * as Html from "./native/html";
export { Html };
