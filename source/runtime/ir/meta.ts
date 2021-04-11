import type { Meta } from "../../generated/crochet-grammar";
export { Meta };

export abstract class Metadata {
  abstract source_slice: string;
}

export class Interval extends Metadata {
  constructor(readonly info: Meta) {
    super();
  }

  get source_slice() {
    return this.info.source_slice;
  }
}

export class GeneratedNode extends Metadata {
  get source_slice() {
    return `(source unavailable)`;
  }
}

export const generated_node = new GeneratedNode();
