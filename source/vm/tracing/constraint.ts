import { Values } from "../primitives";
import { CrochetValue, TraceSpan, CrochetType } from "../intrinsics";
import { TraceEvent, TraceTag } from "./events";

export type TraceConstraint =
  | TCLogTag
  | TCEventSpan
  | TCOr
  | TCAnd
  | TCNewType
  | TCInvoke;

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
