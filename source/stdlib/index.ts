import { State } from "../runtime";

import { funs } from "./native";

export async function load(state: State) {
  for (const ffi_fun of funs) {
    ffi_fun(state.world.ffi);
  }
}

import * as Html from "./native/html";
export { Html };
export * from "./ffi-def";
