import { cast } from "../../utils";
import { PartialExpr } from "../ir";
import { Value } from "../logic/constraint";
import {
  cvalue,
  ErrInvalidArity,
  ErrNoBranchMatched,
  ErrUnexpectedType,
  Machine,
  State,
  _push,
  _throw,
} from "../vm";
import { ProcedureBranch } from "./procedure";
import { CrochetType } from "./types";
import {
  bfalse,
  btrue,
  CrochetPartial,
  CrochetRecord,
  CrochetValue,
  PartialValue,
} from "./value";

export function from_bool(x: boolean): CrochetValue {
  return x ? btrue : bfalse;
}

export async function* safe_cast(x: any, type: CrochetType): Machine {
  if (type.accepts(x)) {
    return x;
  } else {
    return yield _throw(new ErrUnexpectedType(type, x));
  }
}

export async function* invoke(
  state: State,
  name: string,
  args: CrochetValue[]
): Machine {
  const procedure = state.world.procedures.lookup(name);
  const branch0 = procedure.select(args);
  let branch: ProcedureBranch;
  if (branch0 == null) {
    branch = cast(
      yield _throw(new ErrNoBranchMatched(procedure, args)),
      ProcedureBranch
    );
  } else {
    branch = branch0;
  }
  const result = cvalue(yield _push(branch.procedure.invoke(state, args)));
  return result;
}

export async function* apply(
  state: State,
  fn: CrochetPartial,
  args: PartialValue[]
) {
  if (fn.arity !== args.length) {
    return _throw(new ErrInvalidArity(fn, args.length));
  } else {
    const new_fn = fn.merge(args);
    if (new_fn.is_saturated) {
      return yield _push(invoke(state, new_fn.name, new_fn.concrete_args));
    } else {
      return new_fn;
    }
  }
}
