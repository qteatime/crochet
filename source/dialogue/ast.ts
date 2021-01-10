import { CrochetBoolean } from "../runtime/intrinsics/boolean";
import { CrochetInteger } from "../runtime/intrinsics/number";
import { CrochetText } from "../runtime/intrinsics/text";
import { CrochetValue } from "../runtime/intrinsics/value";
import { Environment } from "./env";
import { Concatenate, Text, Element, from_primitive } from "../runtime/dialogue/algebra";
import { CrochetRecord } from "../runtime/intrinsics/record";

export abstract class Node {
  abstract eval(env: Environment): Element | CrochetValue;
}

export class TextNode extends Node {
  constructor(readonly value: string) {
    super();
  }

  eval(env: Environment) {
    return new CrochetText(this.value);
  }
}

export class NumberNode extends Node {
  eval(env: Environment): CrochetValue {
    return new CrochetInteger(this.value, null);
  }

  constructor(readonly value: bigint) {
    super();
  }
}

export class BooleanNode extends Node {
  eval(env: Environment): CrochetValue {
    return new CrochetBoolean(this.value);
  }

  constructor(readonly value: boolean) {
    super();
  }
}

export class IdentifierNode {
  constructor(readonly name: string) {
  }
}

export class ConcatenateNode extends Node {
  eval(env: Environment): Element {
    return new Concatenate(
      from_primitive(this.left.eval(env)),
      from_primitive(this.right.eval(env))
    );
  }

  constructor(readonly left: Node, readonly right: Node) {
    super();
  }
}

export class ApplicationNode extends Node {
  eval(env: Environment): Element | CrochetValue {
    const procedure = env.lookup_procedure(this.name.name);
    const args = this.args.map(x => x.eval(env));
    if (procedure == null) {
      throw new Error(`Undefined procedure ${this.name.name}`);
    } else {
      return procedure(...args);
    }
  }


  constructor(readonly name: IdentifierNode, readonly args: Node[]) {
    super();
  }
}

export class ProjectionNode extends Node {
  eval(env: Environment): Element | CrochetValue {
    const record = this.record.eval(env);
    if (record instanceof CrochetRecord) {
      const value = record.project(this.field.name);
      if (value == null) {
        throw new Error(`Field ${this.field.name} does not exist in the record.`);
      } else {
        return value;
      }
    } else {
      throw new TypeError(`Expected a record.`);
    }
  }


  constructor(readonly record: Node, readonly field: IdentifierNode) {
    super();
  }
}

export class LoadNode extends Node {
  eval(env: Environment): Element | CrochetValue {
    const value = env.lookup(this.name.name);
    if (value == null) {
      throw new Error(`Variable ${this.name.name} is not defined`);
    } else {
      return value;
    }
  }

  constructor(readonly name: IdentifierNode) {
    super();
  }
}