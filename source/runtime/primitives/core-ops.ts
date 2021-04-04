import { CrochetType, CrochetValue } from "./0-core";
import {
  cvalue,
  ErrInvalidArity,
  ErrNoBranchMatched,
  ErrUnexpectedType,
  Machine,
  State,
  _push,
} from "../vm";
import { ProcedureBranch } from "./procedure";
import {
  CrochetLambda,
  CrochetPartial,
  PartialConcrete,
  PartialValue,
} from "./partial";
import { False, True } from "./boolean";

export function from_bool(x: boolean): CrochetValue {
  return x ? True.instance : False.instance;
}

export function* safe_cast(x: any, type: CrochetType): Machine {
  if (type.accepts(x)) {
    return x;
  } else {
    throw new ErrUnexpectedType(type, x);
  }
}

export function* invoke(
  state: State,
  name: string,
  args: CrochetValue[]
): Machine {
  const procedure = state.world.procedures.lookup(name);
  const branch0 = procedure.select(args);
  let branch: ProcedureBranch;
  if (branch0 == null) {
    throw new ErrNoBranchMatched(procedure, args);
  } else {
    branch = branch0;
  }
  const result = cvalue(yield _push(branch.procedure.invoke(state, args)));
  return result;
}

export function* apply_partial(
  state: State,
  fn: CrochetPartial,
  args: PartialValue[]
): Machine {
  if (fn.arity !== args.length) {
    throw new ErrInvalidArity(fn, args.length);
  } else {
    const new_fn = fn.merge(args);
    if (new_fn.is_saturated) {
      return yield _push(invoke(state, new_fn.name, new_fn.concrete_args));
    } else {
      return new_fn;
    }
  }
}

export function* apply(
  state: State,
  fn: CrochetValue,
  args: CrochetValue[]
): Machine {
  if (fn instanceof CrochetPartial) {
    return yield _push(
      apply_partial(
        state,
        fn,
        args.map((x) => new PartialConcrete(x))
      )
    );
  } else if (fn instanceof CrochetLambda) {
    return yield _push(fn.apply(state, args));
  } else {
    throw new Error(`Expected a function, got ${fn.to_text()}`);
  }
}
