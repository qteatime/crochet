import * as Logic from "../vm-js/logic";
import {
  array,
  equal,
  spec,
  string,
  anyOf,
  parse,
  boolean,
  number,
  bigint_string,
  SpecFun,
} from "../utils/spec";

export abstract class IRNode {
  toJSON(): any {
    return { ...this };
  }
}

export class Module extends IRNode {
  constructor(readonly filename: string, readonly declarations: Declaration[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        filename: string,
        declarations: array(AbstractDeclaration),
      },
      (x) => {
        return new Module(x.filename, x.declarations);
      }
    );
  }

  static fromJson(x: any) {
    return parse(x, Module) as Module;
  }
}

//== Declaration
export abstract class AbstractDeclaration extends IRNode {
  abstract tag: string;

  static get spec(): SpecFun<Declaration> {
    return anyOf([
      DefineCommand,
      DefineForeignCommand,
      DefineRelation,
      DefineScene,
      DefineActor,
      DefineAction,
      DefineContext,
      Do,
    ]);
  }
}

export type Declaration =
  | DefineCommand
  | DefineForeignCommand
  | DefineRelation
  | DefineScene
  | DefineActor
  | DefineAction
  | DefineContext
  | Do;

export class DefineScene extends AbstractDeclaration {
  readonly tag = "define-scene";

  constructor(readonly name: string, readonly body: Operation[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("define-scene"),
        name: string,
        body: array(AbstractOperation),
      },
      (x) => new DefineScene(x.name, x.body)
    );
  }
}

export class DefineActor extends AbstractDeclaration {
  readonly tag = "define-actor";

  constructor(readonly name: string, readonly roles: string[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("define-actor"),
        name: string,
        roles: array(string),
      },
      (x) => new DefineActor(x.name, x.roles)
    );
  }
}

export class DefineAction extends AbstractDeclaration {
  readonly tag = "define-action";

  constructor(
    readonly repeatable: boolean,
    readonly title: SimpleInterpolation,
    readonly tags: string[],
    readonly predicate: Predicate,
    readonly body: Operation[]
  ) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("define-action"),
        repeatable: boolean,
        title: SimpleInterpolation,
        tags: array(string),
        predicate: Predicate,
        body: array(AbstractOperation),
      },
      (x) =>
        new DefineAction(x.repeatable, x.title, x.tags, x.predicate, x.body)
    );
  }
}

export class SimpleInterpolation {
  constructor(readonly parts: SimpleInterpolationPart[]) {}

  static_text() {
    return this.parts.map((x) => x.static_text()).join("");
  }

  static get spec() {
    return spec(
      {
        parts: array(AbstractSimpleInterpolationPart),
      },
      (x) => new SimpleInterpolation(x.parts)
    );
  }
}

export type SimpleInterpolationPart =
  | SimpleInterpolationStatic
  | SimpleInterpolationVariable;

export abstract class AbstractSimpleInterpolationPart {
  abstract tag: string;
  abstract static_text(): string;
  static get spec(): SpecFun<SimpleInterpolationPart> {
    return anyOf([SimpleInterpolationStatic, SimpleInterpolationVariable]);
  }
}

export class SimpleInterpolationStatic extends AbstractSimpleInterpolationPart {
  readonly tag = "static";
  constructor(readonly text: string) {
    super();
  }

  static_text() {
    return this.text;
  }

  static get spec() {
    return spec(
      {
        tag: equal("static"),
        text: string,
      },
      (x) => new SimpleInterpolationStatic(x.text)
    );
  }
}

export class SimpleInterpolationVariable extends AbstractSimpleInterpolationPart {
  readonly tag = "variable";
  constructor(readonly name: string) {
    super();
  }

  static_text() {
    return "_";
  }

  static get spec() {
    return spec(
      {
        tag: equal("variable"),
        name: string,
      },
      (x) => new SimpleInterpolationVariable(x.name)
    );
  }
}

export class DefineContext extends AbstractDeclaration {
  readonly tag = "define-context";

  constructor(readonly name: string, readonly hooks: HookDefinition[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("define-context"),
        name: string,
        hooks: array(HookDefinition),
      },
      (x) => new DefineContext(x.name, x.hooks)
    );
  }
}

export class HookDefinition {
  constructor(readonly predicate: Predicate, readonly body: Operation[]) {}

  static get spec() {
    return spec(
      {
        predicate: Predicate,
        body: array(AbstractOperation),
      },
      (x) => new HookDefinition(x.predicate, x.body)
    );
  }

  toJSON(): any {
    return { ...this };
  }
}

export class Predicate {
  constructor(
    readonly relations: PredicateRelation[],
    readonly constraint: Constraint
  ) {}

  variables() {
    return this.relations.flatMap((x) => x.variables());
  }

  static get spec() {
    return spec(
      {
        relations: array(PredicateRelation),
        constraint: AbstractConstraint,
      },
      (x) => new Predicate(x.relations, x.constraint)
    );
  }

  toJSON(): any {
    return { ...this };
  }
}

export class PredicateRelation {
  constructor(
    readonly name: string,
    readonly patterns: Pattern[],
    readonly negated: boolean
  ) {}

  variables() {
    if (this.negated) {
      return [];
    } else {
      return this.patterns.flatMap((x) => x.variables());
    }
  }

  static get spec() {
    return spec(
      {
        name: string,
        patterns: array(AbstractPattern),
        negated: boolean,
      },
      (x) => new PredicateRelation(x.name, x.patterns, x.negated)
    );
  }

  toJSON(): any {
    return { ...this };
  }
}

export type Constraint =
  | CAnd
  | COr
  | CNot
  | CEqual
  | CNotEqual
  | CLessThan
  | CGreaterThan
  | CVariable
  | CActor
  | CRole
  | CBoolean
  | CInteger;

export abstract class AbstractConstraint {
  abstract tag: string;

  static get spec(): SpecFun<Constraint> {
    return anyOf([
      CAnd,
      COr,
      CNot,
      CEqual,
      CNotEqual,
      CLessThan,
      CGreaterThan,
      CVariable,
      CActor,
      CRole,
      CBoolean,
      CInteger,
    ]);
  }

  toJSON(): any {
    return { ...this };
  }
}

export class CAnd extends AbstractConstraint {
  readonly tag = "and";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("and"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new CAnd(x.left, x.right)
    );
  }
}

export class COr extends AbstractConstraint {
  readonly tag = "or";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("or"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new COr(x.left, x.right)
    );
  }
}

export class CNot extends AbstractConstraint {
  readonly tag = "not";
  constructor(readonly expr: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("not"),
        expr: AbstractConstraint,
      },
      (x) => new CNot(x.expr)
    );
  }
}

export class CEqual extends AbstractConstraint {
  readonly tag = "equal";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("equal"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new CEqual(x.left, x.right)
    );
  }
}

export class CNotEqual extends AbstractConstraint {
  readonly tag = "not-equal";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("not-equal"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new CNotEqual(x.left, x.right)
    );
  }
}

export class CLessThan extends AbstractConstraint {
  readonly tag = "less-than";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("less-than"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new CLessThan(x.left, x.right)
    );
  }
}

export class CGreaterThan extends AbstractConstraint {
  readonly tag = "greater-than";
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("greater-than"),
        left: AbstractConstraint,
        right: AbstractConstraint,
      },
      (x) => new CGreaterThan(x.left, x.right)
    );
  }
}

export class CVariable extends AbstractConstraint {
  readonly tag = "variable";
  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("variable"),
        name: string,
      },
      (x) => new CVariable(x.name)
    );
  }
}

export class CBoolean extends AbstractConstraint {
  readonly tag = "boolean";
  constructor(readonly value: boolean) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("boolean"),
        value: boolean,
      },
      (x) => new CBoolean(x.value)
    );
  }
}

export class CActor extends AbstractConstraint {
  readonly tag = "actor";
  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("actor"),
        name: string,
      },
      (x) => new CActor(x.name)
    );
  }
}

export class CRole extends AbstractConstraint {
  readonly tag = "role";
  constructor(readonly expr: Constraint, readonly role: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("role"),
        expr: AbstractConstraint,
        role: string,
      },
      (x) => new CRole(x.expr, x.role)
    );
  }
}

export class CInteger extends AbstractConstraint {
  readonly tag = "integer";
  constructor(readonly value: bigint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("integer"),
        value: bigint_string,
      },
      (x) => new CInteger(x.value)
    );
  }

  toJSON() {
    return {
      tag: this.tag,
      value: this.value.toString(),
    };
  }
}

export class DefineRelation extends AbstractDeclaration {
  readonly tag = "define-relation";

  constructor(readonly name: string, readonly components: RelationComponent[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("define-relation"),
        name: string,
        components: array(RelationComponent),
      },
      (x) => new DefineRelation(x.name, x.components)
    );
  }
}

export abstract class RelationComponent {
  abstract tag: string;
  abstract evaluate(): Logic.Component;

  static get spec(): SpecFun<OneRelation | ManyRelation> {
    return anyOf([OneRelation, ManyRelation]);
  }

  toJSON(): any {
    return { ...this };
  }
}

export class OneRelation extends RelationComponent {
  readonly tag = "one";

  constructor(readonly name: string) {
    super();
  }

  evaluate() {
    return new Logic.Component(new Logic.One(), this.name);
  }

  static get spec() {
    return spec(
      {
        tag: equal("one"),
        name: string,
      },
      (x) => new OneRelation(x.name)
    );
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

  static get spec() {
    return spec(
      {
        tag: equal("many"),
        name: string,
      },
      (x) => new ManyRelation(x.name)
    );
  }
}

export class Do extends AbstractDeclaration {
  readonly tag = "do";

  constructor(readonly body: Operation[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("do"),
        body: array(AbstractOperation),
      },
      (x) => new Do(x.body)
    );
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

  static get spec() {
    return spec(
      {
        tag: equal("define-command"),
        name: string,
        parameters: array(string),
        body: array(AbstractOperation),
      },
      (x) => new DefineCommand(x.name, x.parameters, x.body)
    );
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

  static get spec() {
    return spec(
      {
        tag: equal("define-foreign-command"),
        name: string,
        parameters: array(string),
        foreign_name: string,
        args: array(number),
      },
      (x) =>
        new DefineForeignCommand(x.name, x.parameters, x.foreign_name, x.args)
    );
  }
}

//== Operation
export abstract class AbstractOperation extends IRNode {
  abstract tag: string;

  static get spec(): SpecFun<Operation> {
    return anyOf([
      Drop,
      PushInteger,
      PushFloat,
      PushText,
      PushLocal,
      PushBoolean,
      PushNothing,
      PushActor,
      Interpolate,
      TriggerContext,
      TriggerAction,
      InsertFact,
      RemoveFact,
      Search,
      Let,
      Invoke,
      Return,
      Branch,
      Block,
      Goto,
      Yield,
      Halt,
      Project,
      Match,
    ]);
  }
}

export type Operation =
  // Stack operations
  | Drop
  | PushInteger
  | PushFloat
  | PushText
  | PushLocal
  | PushBoolean
  | PushNothing
  | PushActor
  // Text operations
  | Interpolate
  // Search
  | TriggerContext
  | TriggerAction
  | InsertFact
  | RemoveFact
  | Search
  // Records and Streams
  | Project
  // Environment & Control-flow
  | Match
  | Let
  | Invoke
  | Return
  | Branch
  | Block
  | Goto
  | Yield
  | Halt;

export class PushInteger extends AbstractOperation {
  readonly tag = "push-integer";

  constructor(readonly value: bigint) {
    super();
  }

  toJSON(): any {
    return {
      tag: this.tag,
      value: this.value.toString(),
    };
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-integer"),
        value: bigint_string,
      },
      (x) => new PushInteger(x.value)
    );
  }
}

export class PushFloat extends AbstractOperation {
  readonly tag = "push-float";

  constructor(readonly value: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-float"),
        value: number,
      },
      (x) => new PushFloat(x.value)
    );
  }
}

export class PushText extends AbstractOperation {
  readonly tag = "push-text";

  constructor(readonly value: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-text"),
        value: string,
      },
      (x) => new PushText(x.value)
    );
  }
}

export class PushBoolean extends AbstractOperation {
  readonly tag = "push-boolean";

  constructor(readonly value: boolean) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-boolean"),
        value: boolean,
      },
      (x) => new PushBoolean(x.value)
    );
  }
}

export class PushNothing extends AbstractOperation {
  readonly tag = "push-nothing";

  static get spec() {
    return spec(
      {
        tag: equal("push-nothing"),
      },
      (x) => new PushNothing()
    );
  }
}

export class PushLocal extends AbstractOperation {
  readonly tag = "push-local";

  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-local"),
        name: string,
      },
      (x) => new PushLocal(x.name)
    );
  }
}

export class PushActor extends AbstractOperation {
  readonly tag = "push-actor";

  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("push-actor"),
        name: string,
      },
      (x) => new PushActor(x.name)
    );
  }
}

export class Invoke extends AbstractOperation {
  readonly tag = "invoke";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("invoke"),
        name: string,
        arity: number,
      },
      (x) => new Invoke(x.name, x.arity)
    );
  }
}

export class Return extends AbstractOperation {
  readonly tag = "return";

  static get spec() {
    return spec(
      {
        tag: equal("return"),
      },
      (x) => new Return()
    );
  }
}

export class Drop extends AbstractOperation {
  readonly tag = "drop";

  static get spec() {
    return spec(
      {
        tag: equal("drop"),
      },
      (x) => new Drop()
    );
  }
}

export class Halt extends AbstractOperation {
  readonly tag = "halt";

  static get spec() {
    return spec(
      {
        tag: equal("halt"),
      },
      (x) => new Halt()
    );
  }
}

export class Goto extends AbstractOperation {
  readonly tag = "goto";

  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("goto"),
        name: string,
      },
      (x) => new Goto(x.name)
    );
  }
}

export class Let extends AbstractOperation {
  readonly tag = "let";

  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("let"),
        name: string,
      },
      (x) => new Let(x.name)
    );
  }
}

export class InsertFact extends AbstractOperation {
  readonly tag = "insert-fact";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("insert-fact"),
        name: string,
        arity: number,
      },
      (x) => new InsertFact(x.name, x.arity)
    );
  }
}

export class RemoveFact extends AbstractOperation {
  readonly tag = "remove-fact";

  constructor(readonly name: string, readonly arity: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("remove-fact"),
        name: string,
        arity: number,
      },
      (x) => new RemoveFact(x.name, x.arity)
    );
  }
}

export class TriggerAction extends AbstractOperation {
  readonly tag = "trigger-action";

  static get spec() {
    return spec(
      {
        tag: equal("trigger-action"),
      },
      (x) => new TriggerAction()
    );
  }
}

export class Search extends AbstractOperation {
  readonly tag = "search";

  constructor(readonly predicate: Predicate) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("search"),
        predicate: Predicate,
      },
      (x) => new Search(x.predicate)
    );
  }
}

export class TriggerContext extends AbstractOperation {
  readonly tag = "trigger-context";

  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("trigger-context"),
        name: string,
      },
      (x) => new TriggerContext(x.name)
    );
  }
}

export class Branch extends AbstractOperation {
  readonly tag = "branch";

  constructor() {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("branch"),
      },
      (x) => new Branch()
    );
  }
}

export class Block extends AbstractOperation {
  readonly tag = "block";

  constructor(readonly parameters: string[], readonly body: Operation[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("block"),
        parameters: array(string),
        body: array(AbstractOperation),
      },
      (x) => new Block(x.parameters, x.body)
    );
  }
}

export class Interpolate extends AbstractOperation {
  readonly tag = "interpolate";

  constructor(readonly arity: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("interpolate"),
        arity: number,
      },
      (x) => new Interpolate(x.arity)
    );
  }
}

export class Yield extends AbstractOperation {
  readonly tag = "yield";

  static get spec() {
    return spec(
      {
        tag: equal("yield"),
      },
      (x) => new Yield()
    );
  }
}

export class Project extends AbstractOperation {
  readonly tag = "project";
  constructor(readonly name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("project"),
        name: string,
      },
      (x) => new Project(x.name)
    );
  }
}

export class Match extends AbstractOperation {
  readonly tag = "match";
  constructor(readonly clauses: MatchClause[]) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("match"),
        clauses: array(AbstractMatchClause),
      },
      (x) => new Match(x.clauses)
    );
  }
}

export type MatchClause = MatchPredicate | MatchDefault;

export abstract class AbstractMatchClause {
  abstract tag: string;
  static get spec(): SpecFun<MatchClause> {
    return anyOf([MatchPredicate, MatchDefault]);
  }
}

export class MatchPredicate extends AbstractMatchClause {
  readonly tag = "predicate";
  constructor(readonly predicate: Predicate) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("predicate"),
        predicate: Predicate,
      },
      (x) => new MatchPredicate(x.predicate)
    );
  }
}

export class MatchDefault extends AbstractMatchClause {
  readonly tag = "default";
  constructor() {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("default"),
      },
      (x) => new MatchDefault()
    );
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

  variables(): string[] {
    return [];
  }

  static get spec(): SpecFun<Pattern> {
    return anyOf([
      IntegerPattern,
      FloatPattern,
      BooleanPattern,
      TextPattern,
      NothingPattern,
      VariablePattern,
      ActorPattern,
    ]);
  }

  toJSON(): any {
    return { ...this };
  }
}

export class IntegerPattern extends AbstractPattern {
  readonly tag = "integer-pattern";
  constructor(readonly value: bigint) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("integer-pattern"),
        value: bigint_string,
      },
      (x) => new IntegerPattern(x.value)
    );
  }

  toJSON() {
    return {
      tag: this.tag,
      value: this.value.toString(),
    };
  }
}

export class FloatPattern extends AbstractPattern {
  readonly tag = "float-pattern";
  constructor(readonly value: number) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("float-pattern"),
        value: number,
      },
      (x) => new FloatPattern(x.value)
    );
  }
}

export class BooleanPattern extends AbstractPattern {
  readonly tag = "boolean-pattern";
  constructor(readonly value: boolean) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("boolean-pattern"),
        value: boolean,
      },
      (x) => new BooleanPattern(x.value)
    );
  }
}

export class TextPattern extends AbstractPattern {
  readonly tag = "text-pattern";
  constructor(readonly value: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("text-pattern"),
        value: string,
      },
      (x) => new TextPattern(x.value)
    );
  }
}

export class NothingPattern extends AbstractPattern {
  readonly tag = "nothing-pattern";

  static get spec() {
    return spec(
      {
        tag: equal("nothing-pattern"),
      },
      (x) => new NothingPattern()
    );
  }
}

export class ActorPattern extends AbstractPattern {
  readonly tag = "actor-pattern";
  constructor(readonly actor_name: string) {
    super();
  }

  static get spec() {
    return spec(
      {
        tag: equal("actor-pattern"),
        actor_name: string,
      },
      (x) => new ActorPattern(x.actor_name)
    );
  }
}

export class VariablePattern extends AbstractPattern {
  readonly tag = "variable-pattern";
  constructor(readonly name: string) {
    super();
  }

  variables() {
    return [this.name];
  }

  static get spec() {
    return spec(
      {
        tag: equal("variable-pattern"),
        name: string,
      },
      (x) => new VariablePattern(x.name)
    );
  }
}
