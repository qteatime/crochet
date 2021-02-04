import { Component, Many, One, VariablePattern } from "../vm-js/logic";

export abstract class IRNode {}

export class Module extends IRNode {
  constructor(readonly filename: string, readonly declarations: Declaration[]) {
    super();
  }
}

//== Declaration
export abstract class AbstractDeclaration extends IRNode {
  abstract tag: string;
}

export type Declaration =
  | DefineCommand
  | DefineForeignCommand
  | DefineRelation
  | DefineScene
  | DefineType
  | Do;

export class DefineScene extends AbstractDeclaration {
  readonly tag = "define-scene";

  constructor(readonly name: string, readonly body: Operation[]) {
    super();
  }
}

export class DefineType extends AbstractDeclaration {
  readonly tag = "define-type";

  constructor(readonly name: string) {
    super();
  }
}

export class DefineRelation extends AbstractDeclaration {
  readonly tag = "define-relation";

  constructor(readonly name: string, readonly components: RelationComponent[]) {
    super();
  }
}

export abstract class RelationComponent {
  abstract tag: string;
  abstract evaluate(): Component;
}

export class OneRelation extends RelationComponent {
  readonly tag = "one";

  constructor(readonly name: string) {
    super();
  }

  evaluate() {
    return new Component(new One(), new VariablePattern(this.name));
  }
}

export class ManyRelation extends RelationComponent {
  readonly tag = "many";

  constructor(readonly name: string) {
    super();
  }

  evaluate() {
    return new Component(new Many(), new VariablePattern(this.name));
  }
}

export class Do extends AbstractDeclaration {
  readonly tag = "do";

  constructor(readonly body: Operation[]) {
    super();
  }
}

export class DefineCommand extends AbstractDeclaration {
  readonly tag = "define-command";

  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly body: Operation[]
  ) {
    super();
  }
}

export class DefineForeignCommand extends AbstractDeclaration {
  readonly tag = "define-foreign-command";

  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly foreign_name: string,
    readonly args: number[]
  ) {
    super();
  }
}

//== Operation
export abstract class AbstractOperation extends IRNode {
  abstract tag: string;
}

export type Operation =
  | Drop
  | Goto
  | InsertFact
  | Instantiate
  | Invoke
  | Let
  | PushInteger
  | PushFloat
  | PushText
  | PushLocal
  | PushBoolean
  | PushNothing
  | Return
  | Halt;

export class PushInteger extends AbstractOperation {
  readonly tag = "push-integer";

  constructor(readonly value: bigint) {
    super();
  }
}

export class PushFloat extends AbstractOperation {
  readonly tag = "push-float";

  constructor(readonly value: number) {
    super();
  }
}

export class PushText extends AbstractOperation {
  readonly tag = "push-text";

  constructor(readonly value: string) {
    super();
  }
}

export class PushBoolean extends AbstractOperation {
  readonly tag = "push-boolean";

  constructor(readonly value: boolean) {
    super();
  }
}

export class PushNothing extends AbstractOperation {
  readonly tag = "push-nothing";
}

export class PushLocal extends AbstractOperation {
  readonly tag = "push-local";

  constructor(readonly name: string) {
    super();
  }
}

export class Invoke extends AbstractOperation {
  readonly tag = "invoke";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }
}

export class Return extends AbstractOperation {
  readonly tag = "return";
}

export class Drop extends AbstractOperation {
  readonly tag = "drop";
}

export class Halt extends AbstractOperation {
  readonly tag = "halt";
}

export class Goto extends AbstractOperation {
  readonly tag = "goto";

  constructor(readonly name: string) {
    super();
  }
}

export class Let extends AbstractOperation {
  readonly tag = "let";

  constructor(readonly name: string) {
    super();
  }
}

export class InsertFact extends AbstractOperation {
  readonly tag = "insert-fact";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }
}

export class Instantiate extends AbstractOperation {
  readonly tag = "instantiate";

  constructor(readonly type_name: string) {
    super();
  }
}
