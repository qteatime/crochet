import * as Logic from "../vm-js/logic";

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
  | DefineActor
  | Do;

export class DefineScene extends AbstractDeclaration {
  readonly tag = "define-scene";

  constructor(readonly name: string, readonly body: Operation[]) {
    super();
  }
}

export class DefineActor extends AbstractDeclaration {
  readonly tag = "define-actor";

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
  abstract evaluate(): Logic.Component;
}

export class OneRelation extends RelationComponent {
  readonly tag = "one";

  constructor(readonly name: string) {
    super();
  }

  evaluate() {
    return new Logic.Component(new Logic.One(), this.name);
  }
}

export class ManyRelation extends RelationComponent {
  readonly tag = "many";

  constructor(readonly name: string) {
    super();
  }

  evaluate() {
    return new Logic.Component(new Logic.Many(), this.name);
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
  // Commands and environment
  | Invoke
  | Return
  | Let
  // Stack operations
  | Drop
  | PushInteger
  | PushFloat
  | PushText
  | PushLocal
  | PushBoolean
  | PushNothing
  | PushActor
  // Search
  | InsertFact
  | RemoveFact
  | RefineSearch
  | Search
  // Other control-flow
  | Goto
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

export class PushActor extends AbstractOperation {
  readonly tag = "push-actor";

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

export class RemoveFact extends AbstractOperation {
  readonly tag = "remove-fact";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }
}

// Note: this will change a lot :')
export class Search extends AbstractOperation {
  readonly tag = "search";

  constructor(readonly name: string, readonly patterns: Pattern[]) {
    super();
  }
}

export class RefineSearch extends AbstractOperation {
  readonly tag = "refine-search";

  constructor(readonly name: string, readonly patterns: Pattern[]) {
    super();
  }
}

export type Pattern =
  | IntegerPattern
  | FloatPattern
  | BooleanPattern
  | TextPattern
  | NothingPattern
  | VariablePattern
  | ActorPattern;

export abstract class AbstractPattern {
  abstract tag: string;
}

export class IntegerPattern extends AbstractPattern {
  readonly tag = "integer-pattern";
  constructor(readonly value: bigint) {
    super();
  }
}

export class FloatPattern extends AbstractPattern {
  readonly tag = "float-pattern";
  constructor(readonly value: number) {
    super();
  }
}

export class BooleanPattern extends AbstractPattern {
  readonly tag = "boolean-pattern";
  constructor(readonly value: boolean) {
    super();
  }
}

export class TextPattern extends AbstractPattern {
  readonly tag = "text-pattern";
  constructor(readonly value: string) {
    super();
  }
}

export class NothingPattern extends AbstractPattern {
  readonly tag = "nothing-pattern";
}

export class ActorPattern extends AbstractPattern {
  readonly tag = "actor-pattern";
  readonly arity = 0;
  constructor(readonly actor_name: string) {
    super();
  }
}

export class VariablePattern extends AbstractPattern {
  readonly tag = "variable-pattern";
  readonly arity = 0;
  constructor(readonly name: string) {
    super();
  }
}

// Search name [pattern...]
