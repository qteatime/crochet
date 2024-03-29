import { Values } from "../primitives";
import {
  CrochetValue,
  TraceSpan,
  CrochetType,
  CrochetCommandBranch,
} from "../intrinsics";
import { TraceEvent, TraceTag } from "./events";
import { CrochetLambda, CrochetThunk } from "..";

export type TraceConstraint =
  | TCLogTag
  | TCEventSpan
  | TCOr
  | TCAnd
  | TCNewType
  | TCInvoke
  | TCInvokeReturn
  | TCLambdaApply
  | TCForceThunk
  | TCThunkReturn;

export abstract class BaseConstraint {
  abstract accepts(event: TraceEvent): boolean;
}

export class TCLogTag extends BaseConstraint {
  constructor(readonly tag: CrochetValue) {
    super();
  }

  accepts(event: TraceEvent) {
    return event.tag === TraceTag.LOG && Values.equals(event.log_tag, this.tag);
  }
}

export class TCEventSpan extends BaseConstraint {
  constructor(readonly span: TraceSpan) {
    super();
  }

  accepts(event: TraceEvent) {
    return event.location.span === this.span;
  }
}

export class TCOr extends BaseConstraint {
  constructor(readonly left: TraceConstraint, readonly right: TraceConstraint) {
    super();
  }

  accepts(event: TraceEvent): boolean {
    return this.left.accepts(event) || this.right.accepts(event);
  }
}

export class TCAnd extends BaseConstraint {
  constructor(readonly left: TraceConstraint, readonly right: TraceConstraint) {
    super();
  }

  accepts(event: TraceEvent): boolean {
    return this.left.accepts(event) && this.right.accepts(event);
  }
}

export class TCNewType extends BaseConstraint {
  constructor(readonly type: CrochetType) {
    super();
  }

  accepts(event: TraceEvent) {
    return event.tag === TraceTag.NEW && event.type === this.type;
  }
}

export class TCInvoke extends BaseConstraint {
  constructor(readonly name: string) {
    super();
  }

  accepts(event: TraceEvent) {
    return event.tag === TraceTag.INVOKE && event.command.name === this.name;
  }
}

export class TCInvokeReturn extends BaseConstraint {
  constructor(readonly name: string) {
    super();
  }

  accepts(event: TraceEvent) {
    const loc = event.location.location;
    return (
      event.tag === TraceTag.RETURN &&
      loc != null &&
      loc instanceof CrochetCommandBranch &&
      loc.name === this.name
    );
  }
}

export class TCLambdaApply extends BaseConstraint {
  accepts(event: TraceEvent) {
    return event.tag === TraceTag.APPLY_LAMBDA;
  }
}

export class TCLambdaReturn extends BaseConstraint {
  accepts(event: TraceEvent) {
    const loc = event.location.location;
    return (
      event.tag === TraceTag.RETURN &&
      loc != null &&
      loc instanceof CrochetLambda
    );
  }
}

export class TCForceThunk extends BaseConstraint {
  accepts(event: TraceEvent) {
    return event.tag === TraceTag.FORCE_THUNK;
  }
}

export class TCThunkReturn extends BaseConstraint {
  accepts(event: TraceEvent) {
    const loc = event.location.location;
    return (
      event.tag === TraceTag.RETURN &&
      loc != null &&
      loc instanceof CrochetThunk
    );
  }
}
