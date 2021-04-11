import type {
  NativeProcedure,
  CrochetProcedure,
  CrochetValue,
} from "../primitives";
import { State } from "./state";

type Procedure = NativeProcedure | CrochetProcedure;

export class TraceRef {
  constructor(readonly name: string) {}
}

export class Tracer {
  private traces = new Map<TraceRef, TraceConstraint>();

  start_tracing(name: string, trace: TraceConstraint) {
    const ref = new TraceRef(name);
    this.traces.set(ref, trace);
    return ref;
  }

  stop_tracing(ref: TraceRef) {
    this.traces.delete(ref);
  }

  clear_traces() {
    this.traces = new Map();
  }

  procedure_call(state: State, proc: Procedure, args: CrochetValue[]) {
    for (const [tag, constraint] of this.traces.entries()) {
      constraint.procedure_call(this, tag.name, proc, state, args);
    }
  }

  procedure_return(state: State, proc: Procedure, result: CrochetValue) {
    for (const [tag, constraint] of this.traces.entries()) {
      constraint.procedure_return(this, tag.name, proc, state, result);
    }
  }

  show(tag: string, ...args: any[]) {
    console.log(`[${tag}]\n`, ...args);
    console.log("---");
  }
}

export abstract class TraceConstraint {
  procedure_call(
    tracer: Tracer,
    tag: string,
    p: Procedure,
    state: State,
    args: CrochetValue[]
  ): void {}

  procedure_return(
    tracer: Tracer,
    tag: string,
    p: Procedure,
    state: State,
    result: CrochetValue
  ): void {}
}

export class TCInvoke extends TraceConstraint {
  constructor(readonly entity: EntityConstraint) {
    super();
  }

  procedure_call(
    tracer: Tracer,
    tag: string,
    p: Procedure,
    state: State,
    args: CrochetValue[]
  ) {
    if (this.entity.for_procedure(p)) {
      tracer.show(
        tag,
        [
          `<invoke> ${p.full_name}\n`,
          `Arguments:\n`,
          args.map((x) => `  - ${x.to_text()}`).join("\n"),
        ].join("")
      );
    }
  }

  procedure_return(
    tracer: Tracer,
    tag: string,
    p: Procedure,
    state: State,
    result: CrochetValue
  ): void {
    if (this.entity.for_procedure(p)) {
      tracer.show(
        tag,
        [`<return> ${p.full_name}\n`, `Return: ${result.to_text()}`].join("")
      );
    }
  }
}

export abstract class EntityConstraint {
  for_procedure(n: Procedure): boolean {
    return false;
  }
}

export class ECNamed extends EntityConstraint {
  constructor(readonly name: string) {
    super();
  }
  for_procedure(p: Procedure) {
    return p.name === this.name;
  }
}

export class ECInPackage extends EntityConstraint {
  constructor(readonly pkg_name: string) {
    super();
  }
  for_procedure(p: Procedure) {
    return p.env.module.pkg.name === this.pkg_name;
  }
}

export class ECAnd extends EntityConstraint {
  constructor(
    readonly left: EntityConstraint,
    readonly right: EntityConstraint
  ) {
    super();
  }

  for_procedure(p: Procedure) {
    return this.left.for_procedure(p) && this.right.for_procedure(p);
  }
}

export class ECOr extends EntityConstraint {
  constructor(
    readonly left: EntityConstraint,
    readonly right: EntityConstraint
  ) {
    super();
  }

  for_procedure(p: Procedure) {
    return this.left.for_procedure(p) || this.right.for_procedure(p);
  }
}

export class ECNot extends EntityConstraint {
  constructor(readonly entity: EntityConstraint) {
    super();
  }

  for_procedure(p: Procedure) {
    return this.entity.for_procedure(p);
  }
}
