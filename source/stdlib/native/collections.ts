import {
  apply,
  box,
  CrochetInteger,
  CrochetTuple,
  CrochetValue,
  cvalue,
  equals_sync,
  ForeignInterface,
  Thread,
} from "../../runtime";
import { cast } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function coll_tuple(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.collections:tuple")
    .defun("reverse", [CrochetTuple], (xs) => {
      const source = xs.values;
      const result = [];
      for (let i = source.length - 1; i >= 0; i--) {
        result.push(source[i]);
      }
      return new CrochetTuple(result);
    })
    .defmachine("sort", [CrochetTuple, CrochetValue], function* (state, xs, f) {
      const result = xs.values.slice();
      result.sort((a, b) => {
        const call = apply(state, f, [a, b]);
        const order = cast(Thread.for_machine(call).run_sync(), CrochetInteger);
        return Number(order.value);
      });
      return new CrochetTuple(result);
    })
    .defmachine("unique", [CrochetTuple], function* (state, xs) {
      const result: CrochetValue[] = [];
      for (const x of xs.values) {
        if (!result.some((y) => equals_sync(state, x, y))) {
          result.push(x);
        }
      }
      return new CrochetTuple(result);
    });
}

export default [coll_tuple];
