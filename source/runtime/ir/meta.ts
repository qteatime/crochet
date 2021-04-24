import type { Meta } from "../../generated/crochet-grammar";
export { Meta };

export abstract class Metadata {
  abstract source_slice: string;
  abstract annotated_source: string;
  abstract at_suffix: string;
  abstract at_line_suffix: string;
}

export class Interval extends Metadata {
  constructor(readonly info: Meta) {
    super();
  }

  get source_slice() {
    return this.info.source_slice;
  }

  get annotated_source() {
    return this.info.formatted_position_message;
  }

  get at_suffix() {
    return ` at line ${this.info.position.line}, column ${this.info.position.column}`;
  }

  get at_line_suffix() {
    return ` at line ${this.info.position.line}`;
  }
}

export class GeneratedNode extends Metadata {
  get source_slice() {
    return `(source unavailable)`;
  }

  get annotated_source() {
    return "(source unavailable)";
  }

  get at_suffix() {
    return "";
  }

  get at_line_suffix() {
    return "";
  }
}

export const generated_node = new GeneratedNode();
