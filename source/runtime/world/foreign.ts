import { Bag } from "../../utils/bag";
import { CrochetType, NativeProcedureFn } from "../primitives";

export class ForeignInterface {
  readonly methods = new Bag<string, NativeProcedureFn>("foreign function");
  readonly types = new Bag<string, CrochetType>("foreign type");
}
