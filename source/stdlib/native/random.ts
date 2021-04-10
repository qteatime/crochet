import {
  CrochetFloat,
  CrochetInteger,
  CrochetRecord,
  CrochetValue,
  ForeignInterface,
} from "../../runtime";
import { XorShift } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function random_xorshift(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.random:xorshift")
    .defun("random-seed", [], () => {
      const rand = XorShift.new_random();
      return new CrochetRecord(
        new Map([
          ["seed", new CrochetInteger(BigInt(rand.seed))],
          ["inc", new CrochetInteger(BigInt(rand.inc))],
        ])
      );
    })
    .defun("next-uniform", [CrochetInteger, CrochetInteger], (seed, inc) => {
      const rand = new XorShift(Number(seed.value) | 0, Number(inc.value) | 0);
      const value = rand.random();
      return new CrochetRecord(
        new Map<string, CrochetValue>([
          ["value", new CrochetFloat(value)],
          ["seed", new CrochetInteger(BigInt(rand.seed))],
          ["inc", new CrochetInteger(BigInt(rand.inc))],
        ])
      );
    })
    .defun(
      "next-integer",
      [CrochetInteger, CrochetInteger, CrochetInteger, CrochetInteger],
      (seed, inc, min, max) => {
        const rand = new XorShift(
          Number(seed.value) | 0,
          Number(inc.value) | 0
        );
        const value = rand.random_integer(Number(min.value), Number(max.value));
        return new CrochetRecord(
          new Map([
            ["value", new CrochetInteger(BigInt(value))],
            ["seed", new CrochetInteger(BigInt(rand.seed))],
            ["inc", new CrochetInteger(BigInt(rand.inc))],
          ])
        );
      }
    );
}

export default [random_xorshift];
