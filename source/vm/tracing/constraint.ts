import { Values } from "../primitives";
import { CrochetValue, TraceSpan } from "../intrinsics";
import { TraceEvent, TraceTag } from "./events";

export enum ConstraintTag {
  EVENT_SPAN,
  LOG_TAG,
  OR,
  AND,
}

export type TraceConstraint = TCLogTag | TCEventSpan | TCOr | TCAnd;

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
    return event.location === this.span;
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
