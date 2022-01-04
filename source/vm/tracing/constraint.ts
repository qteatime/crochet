import { Values } from "../primitives";
import { CrochetValue, TraceSpan } from "../intrinsics";
import { TraceEvent, TraceTag } from "./events";

export enum ConstraintTag {
  EVENT_SPAN,
  LOG_TAG,
}

export type TraceConstraint = TCLogTag | TCEventSpan;

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
