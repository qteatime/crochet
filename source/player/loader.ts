import { CrochetVM } from "../vm-js/vm";
import * as IR from "../ir";

export async function load_program(url: string) {
  const response = await fetch(url);
  const json = await response.json();
  const ir = IR.fromJson(json);
  return ir;
}
