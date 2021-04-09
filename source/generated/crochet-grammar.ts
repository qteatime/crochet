// This file is generated from Linguist
import * as Ohm from "ohm-js";
const OhmUtil = require("ohm-js/src/util");
import { inspect as $inspect } from "util";

const inspect = Symbol.for("nodejs.util.inspect.custom");

type Result<A> = { ok: true; value: A } | { ok: false; error: string };

export abstract class Node {}

export class Meta {
  constructor(readonly interval: Ohm.Interval) {}

  static has_instance(x: any) {
    return x instanceof Meta;
  }

  get position() {
    const { lineNum, colNum } = OhmUtil.getLineAndColumn(
      (this.interval as any).sourceString,
      this.interval.startIdx
    );
    return {
      line: lineNum,
      column: colNum,
    };
  }

  get range() {
    return {
      start: this.interval.startIdx,
      end: this.interval.endIdx,
    };
  }

  get source_slice() {
    return this.interval.contents;
  }

  get formatted_position_message() {
    return this.interval.getLineAndColumnMessage();
  }

  [inspect]() {
    return this.position;
  }
}

function $meta(x: Ohm.Node): Meta {
  return new Meta(x.source);
}

type Typed = ((_: any) => boolean) | { has_instance(x: any): boolean };

function $check_type(f: Typed) {
  return (x: any) => {
    if (typeof (f as any).has_instance === "function") {
      return (f as any).has_instance(x);
    } else {
      return (f as any)(x);
    }
  };
}

function $is_type(t: string) {
  return (x: any) => {
    return typeof x === t;
  };
}

function $is_array(f: Typed) {
  return (x: any) => {
    return Array.isArray(x) && x.every($check_type(f));
  };
}

function $is_maybe(f: Typed) {
  return (x: any) => {
    return x === null || $check_type(f)(x);
  };
}

function $is_null(x: any) {
  return x === null;
}

function $assert_type<T>(x: any, t: string, f: Typed): asserts x is T {
  if (!$check_type(f)(x)) {
    throw new TypeError(`Expected ${t}, but got ${$inspect(x)}`);
  }
}

// == Type definitions ==============================================

export class Program extends Node {
  readonly tag!: "Program";

  constructor(readonly pos: Meta, readonly declarations: Declaration[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Program" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Declaration[]>(
      declarations,
      "Declaration[]",
      $is_array(Declaration)
    );
  }

  static has_instance(x: any) {
    return x instanceof Program;
  }
}

type $p_Declaration<$T> = {
  Relation(pos: Meta, signature: Signature<RelationPart>): $T;

  DefinePredicate(
    pos: Meta,
    signature: Signature<Name>,
    clauses: PredicateClause[]
  ): $T;

  Do(pos: Meta, body: Statement[]): $T;

  ForeignCommand(
    pos: Meta,
    signature: Signature<Parameter>,
    contract: Contract,
    body: FFI,
    ttest: TrailingTest | null
  ): $T;

  Command(
    pos: Meta,
    signature: Signature<Parameter>,
    contract: Contract,
    body: Statement[],
    ttest: TrailingTest | null
  ): $T;

  Define(pos: Meta, name: Name, value: Expression): $T;

  AbstractType(pos: Meta, typ: TypeDef): $T;

  EnumType(pos: Meta, name: Name, variants: Name[]): $T;

  SingletonType(pos: Meta, typ: TypeDef, init: TypeInit[]): $T;

  ForeignType(pos: Meta, name: Name, foreign_name: Namespace): $T;

  Type(pos: Meta, typ: TypeDef, fields: Parameter[]): $T;

  Scene(pos: Meta, name: Name, body: Statement[]): $T;

  Action(
    pos: Meta,
    typeRestriction: TypeApp,
    title: Expression,
    tags: Name[],
    pred: Predicate,
    rank: Rank,
    body: Statement[]
  ): $T;

  When(pos: Meta, pred: Predicate, body: Statement[]): $T;

  Context(pos: Meta, name: Name, items: Declaration[]): $T;

  Open(pos: Meta, ns: Namespace): $T;

  Local(pos: Meta, decl: Declaration): $T;

  Test(pos: Meta, title: String, body: Statement[]): $T;
};

export abstract class Declaration extends Node {
  abstract tag:
    | "Relation"
    | "DefinePredicate"
    | "Do"
    | "ForeignCommand"
    | "Command"
    | "Define"
    | "AbstractType"
    | "EnumType"
    | "SingletonType"
    | "ForeignType"
    | "Type"
    | "Scene"
    | "Action"
    | "When"
    | "Context"
    | "Open"
    | "Local"
    | "Test";
  abstract match<$T>(p: $p_Declaration<$T>): $T;

  static get Relation() {
    return $$Declaration$_Relation;
  }

  static get DefinePredicate() {
    return $$Declaration$_DefinePredicate;
  }

  static get Do() {
    return $$Declaration$_Do;
  }

  static get ForeignCommand() {
    return $$Declaration$_ForeignCommand;
  }

  static get Command() {
    return $$Declaration$_Command;
  }

  static get Define() {
    return $$Declaration$_Define;
  }

  static get AbstractType() {
    return $$Declaration$_AbstractType;
  }

  static get EnumType() {
    return $$Declaration$_EnumType;
  }

  static get SingletonType() {
    return $$Declaration$_SingletonType;
  }

  static get ForeignType() {
    return $$Declaration$_ForeignType;
  }

  static get Type() {
    return $$Declaration$_Type;
  }

  static get Scene() {
    return $$Declaration$_Scene;
  }

  static get Action() {
    return $$Declaration$_Action;
  }

  static get When() {
    return $$Declaration$_When;
  }

  static get Context() {
    return $$Declaration$_Context;
  }

  static get Open() {
    return $$Declaration$_Open;
  }

  static get Local() {
    return $$Declaration$_Local;
  }

  static get Test() {
    return $$Declaration$_Test;
  }

  static has_instance(x: any) {
    return x instanceof Declaration;
  }
}

export class $$Declaration$_Relation extends Declaration {
  readonly tag!: "Relation";

  constructor(readonly pos: Meta, readonly signature: Signature<RelationPart>) {
    super();
    Object.defineProperty(this, "tag", { value: "Relation" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<RelationPart>>(
      signature,
      "Signature<RelationPart>",
      Signature
    );
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Relation(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Relation;
  }
}

export class $$Declaration$_DefinePredicate extends Declaration {
  readonly tag!: "DefinePredicate";

  constructor(
    readonly pos: Meta,
    readonly signature: Signature<Name>,
    readonly clauses: PredicateClause[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "DefinePredicate" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Name>>(signature, "Signature<Name>", Signature);
    $assert_type<PredicateClause[]>(
      clauses,
      "PredicateClause[]",
      $is_array(PredicateClause)
    );
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.DefinePredicate(this.pos, this.signature, this.clauses);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_DefinePredicate;
  }
}

export class $$Declaration$_Do extends Declaration {
  readonly tag!: "Do";

  constructor(readonly pos: Meta, readonly body: Statement[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Do" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Do(this.pos, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Do;
  }
}

export class $$Declaration$_ForeignCommand extends Declaration {
  readonly tag!: "ForeignCommand";

  constructor(
    readonly pos: Meta,
    readonly signature: Signature<Parameter>,
    readonly contract: Contract,
    readonly body: FFI,
    readonly ttest: TrailingTest | null
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "ForeignCommand" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Parameter>>(
      signature,
      "Signature<Parameter>",
      Signature
    );
    $assert_type<Contract>(contract, "Contract", Contract);
    $assert_type<FFI>(body, "FFI", FFI);
    $assert_type<TrailingTest | null>(
      ttest,
      "(TrailingTest | null)",
      $is_maybe(TrailingTest)
    );
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.ForeignCommand(
      this.pos,
      this.signature,
      this.contract,
      this.body,
      this.ttest
    );
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_ForeignCommand;
  }
}

export class $$Declaration$_Command extends Declaration {
  readonly tag!: "Command";

  constructor(
    readonly pos: Meta,
    readonly signature: Signature<Parameter>,
    readonly contract: Contract,
    readonly body: Statement[],
    readonly ttest: TrailingTest | null
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Command" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Parameter>>(
      signature,
      "Signature<Parameter>",
      Signature
    );
    $assert_type<Contract>(contract, "Contract", Contract);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
    $assert_type<TrailingTest | null>(
      ttest,
      "(TrailingTest | null)",
      $is_maybe(TrailingTest)
    );
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Command(
      this.pos,
      this.signature,
      this.contract,
      this.body,
      this.ttest
    );
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Command;
  }
}

export class $$Declaration$_Define extends Declaration {
  readonly tag!: "Define";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly value: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Define" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Define(this.pos, this.name, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Define;
  }
}

export class $$Declaration$_AbstractType extends Declaration {
  readonly tag!: "AbstractType";

  constructor(readonly pos: Meta, readonly typ: TypeDef) {
    super();
    Object.defineProperty(this, "tag", { value: "AbstractType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeDef>(typ, "TypeDef", TypeDef);
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.AbstractType(this.pos, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_AbstractType;
  }
}

export class $$Declaration$_EnumType extends Declaration {
  readonly tag!: "EnumType";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly variants: Name[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "EnumType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name[]>(variants, "Name[]", $is_array(Name));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.EnumType(this.pos, this.name, this.variants);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_EnumType;
  }
}

export class $$Declaration$_SingletonType extends Declaration {
  readonly tag!: "SingletonType";

  constructor(
    readonly pos: Meta,
    readonly typ: TypeDef,
    readonly init: TypeInit[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "SingletonType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeDef>(typ, "TypeDef", TypeDef);
    $assert_type<TypeInit[]>(init, "TypeInit[]", $is_array(TypeInit));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.SingletonType(this.pos, this.typ, this.init);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_SingletonType;
  }
}

export class $$Declaration$_ForeignType extends Declaration {
  readonly tag!: "ForeignType";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly foreign_name: Namespace
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "ForeignType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Namespace>(foreign_name, "Namespace", Namespace);
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.ForeignType(this.pos, this.name, this.foreign_name);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_ForeignType;
  }
}

export class $$Declaration$_Type extends Declaration {
  readonly tag!: "Type";

  constructor(
    readonly pos: Meta,
    readonly typ: TypeDef,
    readonly fields: Parameter[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Type" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeDef>(typ, "TypeDef", TypeDef);
    $assert_type<Parameter[]>(fields, "Parameter[]", $is_array(Parameter));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Type(this.pos, this.typ, this.fields);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Type;
  }
}

export class $$Declaration$_Scene extends Declaration {
  readonly tag!: "Scene";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Scene" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Scene(this.pos, this.name, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Scene;
  }
}

export class $$Declaration$_Action extends Declaration {
  readonly tag!: "Action";

  constructor(
    readonly pos: Meta,
    readonly typeRestriction: TypeApp,
    readonly title: Expression,
    readonly tags: Name[],
    readonly pred: Predicate,
    readonly rank: Rank,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Action" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typeRestriction, "TypeApp", TypeApp);
    $assert_type<Expression>(title, "Expression", Expression);
    $assert_type<Name[]>(tags, "Name[]", $is_array(Name));
    $assert_type<Predicate>(pred, "Predicate", Predicate);
    $assert_type<Rank>(rank, "Rank", Rank);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Action(
      this.pos,
      this.typeRestriction,
      this.title,
      this.tags,
      this.pred,
      this.rank,
      this.body
    );
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Action;
  }
}

export class $$Declaration$_When extends Declaration {
  readonly tag!: "When";

  constructor(
    readonly pos: Meta,
    readonly pred: Predicate,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "When" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(pred, "Predicate", Predicate);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.When(this.pos, this.pred, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_When;
  }
}

export class $$Declaration$_Context extends Declaration {
  readonly tag!: "Context";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly items: Declaration[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Context" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Declaration[]>(items, "Declaration[]", $is_array(Declaration));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Context(this.pos, this.name, this.items);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Context;
  }
}

export class $$Declaration$_Open extends Declaration {
  readonly tag!: "Open";

  constructor(readonly pos: Meta, readonly ns: Namespace) {
    super();
    Object.defineProperty(this, "tag", { value: "Open" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Namespace>(ns, "Namespace", Namespace);
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Open(this.pos, this.ns);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Open;
  }
}

export class $$Declaration$_Local extends Declaration {
  readonly tag!: "Local";

  constructor(readonly pos: Meta, readonly decl: Declaration) {
    super();
    Object.defineProperty(this, "tag", { value: "Local" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Declaration>(decl, "Declaration", Declaration);
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Local(this.pos, this.decl);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Local;
  }
}

export class $$Declaration$_Test extends Declaration {
  readonly tag!: "Test";

  constructor(
    readonly pos: Meta,
    readonly title: String,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Test" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<String>(title, "String", String);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Declaration<$T>): $T {
    return p.Test(this.pos, this.title, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Declaration$_Test;
  }
}

export class TrailingTest extends Node {
  readonly tag!: "TrailingTest";

  constructor(readonly pos: Meta, readonly body: Statement[]) {
    super();
    Object.defineProperty(this, "tag", { value: "TrailingTest" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  static has_instance(x: any) {
    return x instanceof TrailingTest;
  }
}

export class Contract extends Node {
  readonly tag!: "Contract";

  constructor(
    readonly pos: Meta,
    readonly ret: TypeApp | null,
    readonly pre: ContractCondition[],
    readonly post: ContractCondition[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Contract" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp | null>(ret, "(TypeApp | null)", $is_maybe(TypeApp));
    $assert_type<ContractCondition[]>(
      pre,
      "ContractCondition[]",
      $is_array(ContractCondition)
    );
    $assert_type<ContractCondition[]>(
      post,
      "ContractCondition[]",
      $is_array(ContractCondition)
    );
  }

  static has_instance(x: any) {
    return x instanceof Contract;
  }
}

export class ContractCondition extends Node {
  readonly tag!: "ContractCondition";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly expr: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "ContractCondition" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Expression>(expr, "Expression", Expression);
  }

  static has_instance(x: any) {
    return x instanceof ContractCondition;
  }
}

export class TypeDef extends Node {
  readonly tag!: "TypeDef";

  constructor(readonly parent: TypeApp | null, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "TypeDef" });
    $assert_type<TypeApp | null>(
      parent,
      "(TypeApp | null)",
      $is_maybe(TypeApp)
    );
    $assert_type<Name>(name, "Name", Name);
  }

  static has_instance(x: any) {
    return x instanceof TypeDef;
  }
}

export class FFI extends Node {
  readonly tag!: "FFI";

  constructor(
    readonly pos: Meta,
    readonly name: Namespace,
    readonly args: Name[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "FFI" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Namespace>(name, "Namespace", Namespace);
    $assert_type<Name[]>(args, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof FFI;
  }
}

type $p_Rank<$T> = {
  Expr(expr: Expression): $T;

  Unranked(pos: Meta): $T;
};

export abstract class Rank extends Node {
  abstract tag: "Expr" | "Unranked";
  abstract match<$T>(p: $p_Rank<$T>): $T;

  static get Expr() {
    return $$Rank$_Expr;
  }

  static get Unranked() {
    return $$Rank$_Unranked;
  }

  static has_instance(x: any) {
    return x instanceof Rank;
  }
}

export class $$Rank$_Expr extends Rank {
  readonly tag!: "Expr";

  constructor(readonly expr: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Expr" });
    $assert_type<Expression>(expr, "Expression", Expression);
  }

  match<$T>(p: $p_Rank<$T>): $T {
    return p.Expr(this.expr);
  }

  static has_instance(x: any) {
    return x instanceof $$Rank$_Expr;
  }
}

export class $$Rank$_Unranked extends Rank {
  readonly tag!: "Unranked";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Unranked" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Rank<$T>): $T {
    return p.Unranked(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Rank$_Unranked;
  }
}

type $p_TypeInit<$T> = {
  Fact(pos: Meta, sig: PartialSignature<Expression>): $T;

  Command(
    pos: Meta,
    sig: PartialSignature<Parameter>,
    contract: Contract,
    body: Statement[],
    ttest: TrailingTest | null
  ): $T;

  ForeignCommand(
    pos: Meta,
    signature: PartialSignature<Parameter>,
    contract: Contract,
    body: FFI,
    ttest: TrailingTest | null
  ): $T;
};

export abstract class TypeInit extends Node {
  abstract tag: "Fact" | "Command" | "ForeignCommand";
  abstract match<$T>(p: $p_TypeInit<$T>): $T;

  static get Fact() {
    return $$TypeInit$_Fact;
  }

  static get Command() {
    return $$TypeInit$_Command;
  }

  static get ForeignCommand() {
    return $$TypeInit$_ForeignCommand;
  }

  static has_instance(x: any) {
    return x instanceof TypeInit;
  }
}

export class $$TypeInit$_Fact extends TypeInit {
  readonly tag!: "Fact";

  constructor(readonly pos: Meta, readonly sig: PartialSignature<Expression>) {
    super();
    Object.defineProperty(this, "tag", { value: "Fact" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<PartialSignature<Expression>>(
      sig,
      "PartialSignature<Expression>",
      PartialSignature
    );
  }

  match<$T>(p: $p_TypeInit<$T>): $T {
    return p.Fact(this.pos, this.sig);
  }

  static has_instance(x: any) {
    return x instanceof $$TypeInit$_Fact;
  }
}

export class $$TypeInit$_Command extends TypeInit {
  readonly tag!: "Command";

  constructor(
    readonly pos: Meta,
    readonly sig: PartialSignature<Parameter>,
    readonly contract: Contract,
    readonly body: Statement[],
    readonly ttest: TrailingTest | null
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Command" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<PartialSignature<Parameter>>(
      sig,
      "PartialSignature<Parameter>",
      PartialSignature
    );
    $assert_type<Contract>(contract, "Contract", Contract);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
    $assert_type<TrailingTest | null>(
      ttest,
      "(TrailingTest | null)",
      $is_maybe(TrailingTest)
    );
  }

  match<$T>(p: $p_TypeInit<$T>): $T {
    return p.Command(this.pos, this.sig, this.contract, this.body, this.ttest);
  }

  static has_instance(x: any) {
    return x instanceof $$TypeInit$_Command;
  }
}

export class $$TypeInit$_ForeignCommand extends TypeInit {
  readonly tag!: "ForeignCommand";

  constructor(
    readonly pos: Meta,
    readonly signature: PartialSignature<Parameter>,
    readonly contract: Contract,
    readonly body: FFI,
    readonly ttest: TrailingTest | null
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "ForeignCommand" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<PartialSignature<Parameter>>(
      signature,
      "PartialSignature<Parameter>",
      PartialSignature
    );
    $assert_type<Contract>(contract, "Contract", Contract);
    $assert_type<FFI>(body, "FFI", FFI);
    $assert_type<TrailingTest | null>(
      ttest,
      "(TrailingTest | null)",
      $is_maybe(TrailingTest)
    );
  }

  match<$T>(p: $p_TypeInit<$T>): $T {
    return p.ForeignCommand(
      this.pos,
      this.signature,
      this.contract,
      this.body,
      this.ttest
    );
  }

  static has_instance(x: any) {
    return x instanceof $$TypeInit$_ForeignCommand;
  }
}

type $p_Parameter<$T> = {
  Untyped(pos: Meta, name: Name): $T;

  Typed(pos: Meta, name: Name, typ: TypeApp): $T;

  TypedOnly(pos: Meta, typ: TypeApp): $T;
};

export abstract class Parameter extends Node {
  abstract tag: "Untyped" | "Typed" | "TypedOnly";
  abstract match<$T>(p: $p_Parameter<$T>): $T;

  static get Untyped() {
    return $$Parameter$_Untyped;
  }

  static get Typed() {
    return $$Parameter$_Typed;
  }

  static get TypedOnly() {
    return $$Parameter$_TypedOnly;
  }

  static has_instance(x: any) {
    return x instanceof Parameter;
  }
}

export class $$Parameter$_Untyped extends Parameter {
  readonly tag!: "Untyped";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Untyped" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Parameter<$T>): $T {
    return p.Untyped(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Parameter$_Untyped;
  }
}

export class $$Parameter$_Typed extends Parameter {
  readonly tag!: "Typed";

  constructor(readonly pos: Meta, readonly name: Name, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "Typed" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_Parameter<$T>): $T {
    return p.Typed(this.pos, this.name, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Parameter$_Typed;
  }
}

export class $$Parameter$_TypedOnly extends Parameter {
  readonly tag!: "TypedOnly";

  constructor(readonly pos: Meta, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "TypedOnly" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_Parameter<$T>): $T {
    return p.TypedOnly(this.pos, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Parameter$_TypedOnly;
  }
}

type $p_TypeApp<$T> = {
  Named(pos: Meta, name: Name): $T;

  Static(pos: Meta, typ: TypeApp): $T;

  Any(pos: Meta): $T;
};

export abstract class TypeApp extends Node {
  abstract tag: "Named" | "Static" | "Any";
  abstract match<$T>(p: $p_TypeApp<$T>): $T;

  static get Named() {
    return $$TypeApp$_Named;
  }

  static get Static() {
    return $$TypeApp$_Static;
  }

  static get Any() {
    return $$TypeApp$_Any;
  }

  static has_instance(x: any) {
    return x instanceof TypeApp;
  }
}

export class $$TypeApp$_Named extends TypeApp {
  readonly tag!: "Named";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Named" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_TypeApp<$T>): $T {
    return p.Named(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$TypeApp$_Named;
  }
}

export class $$TypeApp$_Static extends TypeApp {
  readonly tag!: "Static";

  constructor(readonly pos: Meta, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "Static" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_TypeApp<$T>): $T {
    return p.Static(this.pos, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$TypeApp$_Static;
  }
}

export class $$TypeApp$_Any extends TypeApp {
  readonly tag!: "Any";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Any" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_TypeApp<$T>): $T {
    return p.Any(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$TypeApp$_Any;
  }
}

export class PredicateClause extends Node {
  readonly tag!: "PredicateClause";

  constructor(
    readonly pos: Meta,
    readonly predicate: Predicate,
    readonly effect: PredicateEffect
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "PredicateClause" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(predicate, "Predicate", Predicate);
    $assert_type<PredicateEffect>(effect, "PredicateEffect", PredicateEffect);
  }

  static has_instance(x: any) {
    return x instanceof PredicateClause;
  }
}

type $p_PredicateEffect<$T> = {
  Trivial(): $T;
};

export abstract class PredicateEffect extends Node {
  abstract tag: "Trivial";
  abstract match<$T>(p: $p_PredicateEffect<$T>): $T;

  static get Trivial() {
    return $$PredicateEffect$_Trivial;
  }

  static has_instance(x: any) {
    return x instanceof PredicateEffect;
  }
}

export class $$PredicateEffect$_Trivial extends PredicateEffect {
  readonly tag!: "Trivial";

  constructor() {
    super();
    Object.defineProperty(this, "tag", { value: "Trivial" });
  }

  match<$T>(p: $p_PredicateEffect<$T>): $T {
    return p.Trivial();
  }

  static has_instance(x: any) {
    return x instanceof $$PredicateEffect$_Trivial;
  }
}

type $p_Statement<$T> = {
  Fact(pos: Meta, signature: Signature<Expression>): $T;

  Forget(pos: Meta, signature: Signature<Expression>): $T;

  Goto(pos: Meta, name: Name): $T;

  Call(pos: Meta, name: Name): $T;

  Let(pos: Meta, name: Name, value: Expression): $T;

  Simulate(
    pos: Meta,
    actors: Expression,
    context: SimulationContext,
    goal: SimulationGoal,
    signals: Signal[]
  ): $T;

  Assert(pos: Meta, expr: Expression): $T;

  Expr(value: Expression): $T;
};

export abstract class Statement extends Node {
  abstract tag:
    | "Fact"
    | "Forget"
    | "Goto"
    | "Call"
    | "Let"
    | "Simulate"
    | "Assert"
    | "Expr";
  abstract match<$T>(p: $p_Statement<$T>): $T;

  static get Fact() {
    return $$Statement$_Fact;
  }

  static get Forget() {
    return $$Statement$_Forget;
  }

  static get Goto() {
    return $$Statement$_Goto;
  }

  static get Call() {
    return $$Statement$_Call;
  }

  static get Let() {
    return $$Statement$_Let;
  }

  static get Simulate() {
    return $$Statement$_Simulate;
  }

  static get Assert() {
    return $$Statement$_Assert;
  }

  static get Expr() {
    return $$Statement$_Expr;
  }

  static has_instance(x: any) {
    return x instanceof Statement;
  }
}

export class $$Statement$_Fact extends Statement {
  readonly tag!: "Fact";

  constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
    super();
    Object.defineProperty(this, "tag", { value: "Fact" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Expression>>(
      signature,
      "Signature<Expression>",
      Signature
    );
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Fact(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Fact;
  }
}

export class $$Statement$_Forget extends Statement {
  readonly tag!: "Forget";

  constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
    super();
    Object.defineProperty(this, "tag", { value: "Forget" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Expression>>(
      signature,
      "Signature<Expression>",
      Signature
    );
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Forget(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Forget;
  }
}

export class $$Statement$_Goto extends Statement {
  readonly tag!: "Goto";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Goto" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Goto(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Goto;
  }
}

export class $$Statement$_Call extends Statement {
  readonly tag!: "Call";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Call" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Call(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Call;
  }
}

export class $$Statement$_Let extends Statement {
  readonly tag!: "Let";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly value: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Let" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Let(this.pos, this.name, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Let;
  }
}

export class $$Statement$_Simulate extends Statement {
  readonly tag!: "Simulate";

  constructor(
    readonly pos: Meta,
    readonly actors: Expression,
    readonly context: SimulationContext,
    readonly goal: SimulationGoal,
    readonly signals: Signal[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Simulate" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(actors, "Expression", Expression);
    $assert_type<SimulationContext>(
      context,
      "SimulationContext",
      SimulationContext
    );
    $assert_type<SimulationGoal>(goal, "SimulationGoal", SimulationGoal);
    $assert_type<Signal[]>(signals, "Signal[]", $is_array(Signal));
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Simulate(
      this.pos,
      this.actors,
      this.context,
      this.goal,
      this.signals
    );
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Simulate;
  }
}

export class $$Statement$_Assert extends Statement {
  readonly tag!: "Assert";

  constructor(readonly pos: Meta, readonly expr: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Assert" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(expr, "Expression", Expression);
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Assert(this.pos, this.expr);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Assert;
  }
}

export class $$Statement$_Expr extends Statement {
  readonly tag!: "Expr";

  constructor(readonly value: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Expr" });
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Statement<$T>): $T {
    return p.Expr(this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Statement$_Expr;
  }
}

type $p_SimulationContext<$T> = {
  Global(): $T;

  Named(pos: Meta, name: Name): $T;
};

export abstract class SimulationContext extends Node {
  abstract tag: "Global" | "Named";
  abstract match<$T>(p: $p_SimulationContext<$T>): $T;

  static get Global() {
    return $$SimulationContext$_Global;
  }

  static get Named() {
    return $$SimulationContext$_Named;
  }

  static has_instance(x: any) {
    return x instanceof SimulationContext;
  }
}

export class $$SimulationContext$_Global extends SimulationContext {
  readonly tag!: "Global";

  constructor() {
    super();
    Object.defineProperty(this, "tag", { value: "Global" });
  }

  match<$T>(p: $p_SimulationContext<$T>): $T {
    return p.Global();
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationContext$_Global;
  }
}

export class $$SimulationContext$_Named extends SimulationContext {
  readonly tag!: "Named";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Named" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_SimulationContext<$T>): $T {
    return p.Named(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationContext$_Named;
  }
}

export class Signal extends Node {
  readonly tag!: "Signal";

  constructor(
    readonly pos: Meta,
    readonly signature: Signature<Parameter>,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Signal" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Parameter>>(
      signature,
      "Signature<Parameter>",
      Signature
    );
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  static has_instance(x: any) {
    return x instanceof Signal;
  }
}

type $p_Expression<$T> = {
  New(pos: Meta, typ: Name, fields: Expression[]): $T;

  Invoke(pos: Meta, signature: Signature<Expression>): $T;

  Global(pos: Meta, name: Name): $T;

  Variable(pos: Meta, name: Name): $T;

  Self(pos: Meta): $T;

  List(pos: Meta, values: Expression[]): $T;

  Record(pos: Meta, pairs: Pair<RecordField, Expression>[]): $T;

  Cast(pos: Meta, typ: TypeApp, value: Expression): $T;

  Search(pos: Meta, predicate: Predicate): $T;

  MatchSearch(pos: Meta, cases: MatchSearchCase[]): $T;

  Project(pos: Meta, object: Expression, field: RecordField): $T;

  Select(pos: Meta, object: Expression, fields: Projection[]): $T;

  For(pos: Meta, comprehension: ForExpression): $T;

  Block(pos: Meta, body: Statement[]): $T;

  Apply(pos: Meta, partial: Expression, values: Expression[]): $T;

  Pipe(pos: Meta, left: Expression, right: Expression): $T;

  PipeInvoke(
    pos: Meta,
    left: Expression,
    right: PartialSignature<Expression>
  ): $T;

  Interpolate(pos: Meta, value: Interpolation<Expression>): $T;

  Condition(pos: Meta, cases: ConditionCase[]): $T;

  HasType(pos: Meta, value: Expression, typ: TypeApp): $T;

  Force(pos: Meta, value: Expression): $T;

  Lazy(pos: Meta, value: Expression): $T;

  Hole(pos: Meta): $T;

  Return(pos: Meta): $T;

  Type(pos: Meta, typ: TypeApp): $T;

  Lambda(pos: Meta, params: Name[], body: Expression): $T;

  IntrinsicEqual(pos: Meta, left: Expression, right: Expression): $T;

  Parens(pos: Meta, value: Expression): $T;

  Lit(value: Literal): $T;
};

export abstract class Expression extends Node {
  abstract tag:
    | "New"
    | "Invoke"
    | "Global"
    | "Variable"
    | "Self"
    | "List"
    | "Record"
    | "Cast"
    | "Search"
    | "MatchSearch"
    | "Project"
    | "Select"
    | "For"
    | "Block"
    | "Apply"
    | "Pipe"
    | "PipeInvoke"
    | "Interpolate"
    | "Condition"
    | "HasType"
    | "Force"
    | "Lazy"
    | "Hole"
    | "Return"
    | "Type"
    | "Lambda"
    | "IntrinsicEqual"
    | "Parens"
    | "Lit";
  abstract match<$T>(p: $p_Expression<$T>): $T;

  static get New() {
    return $$Expression$_New;
  }

  static get Invoke() {
    return $$Expression$_Invoke;
  }

  static get Global() {
    return $$Expression$_Global;
  }

  static get Variable() {
    return $$Expression$_Variable;
  }

  static get Self() {
    return $$Expression$_Self;
  }

  static get List() {
    return $$Expression$_List;
  }

  static get Record() {
    return $$Expression$_Record;
  }

  static get Cast() {
    return $$Expression$_Cast;
  }

  static get Search() {
    return $$Expression$_Search;
  }

  static get MatchSearch() {
    return $$Expression$_MatchSearch;
  }

  static get Project() {
    return $$Expression$_Project;
  }

  static get Select() {
    return $$Expression$_Select;
  }

  static get For() {
    return $$Expression$_For;
  }

  static get Block() {
    return $$Expression$_Block;
  }

  static get Apply() {
    return $$Expression$_Apply;
  }

  static get Pipe() {
    return $$Expression$_Pipe;
  }

  static get PipeInvoke() {
    return $$Expression$_PipeInvoke;
  }

  static get Interpolate() {
    return $$Expression$_Interpolate;
  }

  static get Condition() {
    return $$Expression$_Condition;
  }

  static get HasType() {
    return $$Expression$_HasType;
  }

  static get Force() {
    return $$Expression$_Force;
  }

  static get Lazy() {
    return $$Expression$_Lazy;
  }

  static get Hole() {
    return $$Expression$_Hole;
  }

  static get Return() {
    return $$Expression$_Return;
  }

  static get Type() {
    return $$Expression$_Type;
  }

  static get Lambda() {
    return $$Expression$_Lambda;
  }

  static get IntrinsicEqual() {
    return $$Expression$_IntrinsicEqual;
  }

  static get Parens() {
    return $$Expression$_Parens;
  }

  static get Lit() {
    return $$Expression$_Lit;
  }

  static has_instance(x: any) {
    return x instanceof Expression;
  }
}

export class $$Expression$_New extends Expression {
  readonly tag!: "New";

  constructor(
    readonly pos: Meta,
    readonly typ: Name,
    readonly fields: Expression[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "New" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(typ, "Name", Name);
    $assert_type<Expression[]>(fields, "Expression[]", $is_array(Expression));
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.New(this.pos, this.typ, this.fields);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_New;
  }
}

export class $$Expression$_Invoke extends Expression {
  readonly tag!: "Invoke";

  constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
    super();
    Object.defineProperty(this, "tag", { value: "Invoke" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Expression>>(
      signature,
      "Signature<Expression>",
      Signature
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Invoke(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Invoke;
  }
}

export class $$Expression$_Global extends Expression {
  readonly tag!: "Global";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Global" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Global(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Global;
  }
}

export class $$Expression$_Variable extends Expression {
  readonly tag!: "Variable";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Variable" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Variable(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Variable;
  }
}

export class $$Expression$_Self extends Expression {
  readonly tag!: "Self";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Self" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Self(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Self;
  }
}

export class $$Expression$_List extends Expression {
  readonly tag!: "List";

  constructor(readonly pos: Meta, readonly values: Expression[]) {
    super();
    Object.defineProperty(this, "tag", { value: "List" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression[]>(values, "Expression[]", $is_array(Expression));
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.List(this.pos, this.values);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_List;
  }
}

export class $$Expression$_Record extends Expression {
  readonly tag!: "Record";

  constructor(
    readonly pos: Meta,
    readonly pairs: Pair<RecordField, Expression>[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Record" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Pair<RecordField, Expression>[]>(
      pairs,
      "Pair<RecordField, Expression>[]",
      $is_array(Pair)
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Record(this.pos, this.pairs);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Record;
  }
}

export class $$Expression$_Cast extends Expression {
  readonly tag!: "Cast";

  constructor(
    readonly pos: Meta,
    readonly typ: TypeApp,
    readonly value: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Cast" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Cast(this.pos, this.typ, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Cast;
  }
}

export class $$Expression$_Search extends Expression {
  readonly tag!: "Search";

  constructor(readonly pos: Meta, readonly predicate: Predicate) {
    super();
    Object.defineProperty(this, "tag", { value: "Search" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(predicate, "Predicate", Predicate);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Search(this.pos, this.predicate);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Search;
  }
}

export class $$Expression$_MatchSearch extends Expression {
  readonly tag!: "MatchSearch";

  constructor(readonly pos: Meta, readonly cases: MatchSearchCase[]) {
    super();
    Object.defineProperty(this, "tag", { value: "MatchSearch" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<MatchSearchCase[]>(
      cases,
      "MatchSearchCase[]",
      $is_array(MatchSearchCase)
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.MatchSearch(this.pos, this.cases);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_MatchSearch;
  }
}

export class $$Expression$_Project extends Expression {
  readonly tag!: "Project";

  constructor(
    readonly pos: Meta,
    readonly object: Expression,
    readonly field: RecordField
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Project" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(object, "Expression", Expression);
    $assert_type<RecordField>(field, "RecordField", RecordField);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Project(this.pos, this.object, this.field);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Project;
  }
}

export class $$Expression$_Select extends Expression {
  readonly tag!: "Select";

  constructor(
    readonly pos: Meta,
    readonly object: Expression,
    readonly fields: Projection[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Select" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(object, "Expression", Expression);
    $assert_type<Projection[]>(fields, "Projection[]", $is_array(Projection));
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Select(this.pos, this.object, this.fields);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Select;
  }
}

export class $$Expression$_For extends Expression {
  readonly tag!: "For";

  constructor(readonly pos: Meta, readonly comprehension: ForExpression) {
    super();
    Object.defineProperty(this, "tag", { value: "For" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<ForExpression>(comprehension, "ForExpression", ForExpression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.For(this.pos, this.comprehension);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_For;
  }
}

export class $$Expression$_Block extends Expression {
  readonly tag!: "Block";

  constructor(readonly pos: Meta, readonly body: Statement[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Block" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Block(this.pos, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Block;
  }
}

export class $$Expression$_Apply extends Expression {
  readonly tag!: "Apply";

  constructor(
    readonly pos: Meta,
    readonly partial: Expression,
    readonly values: Expression[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Apply" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(partial, "Expression", Expression);
    $assert_type<Expression[]>(values, "Expression[]", $is_array(Expression));
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Apply(this.pos, this.partial, this.values);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Apply;
  }
}

export class $$Expression$_Pipe extends Expression {
  readonly tag!: "Pipe";

  constructor(
    readonly pos: Meta,
    readonly left: Expression,
    readonly right: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Pipe" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(left, "Expression", Expression);
    $assert_type<Expression>(right, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Pipe(this.pos, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Pipe;
  }
}

export class $$Expression$_PipeInvoke extends Expression {
  readonly tag!: "PipeInvoke";

  constructor(
    readonly pos: Meta,
    readonly left: Expression,
    readonly right: PartialSignature<Expression>
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "PipeInvoke" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(left, "Expression", Expression);
    $assert_type<PartialSignature<Expression>>(
      right,
      "PartialSignature<Expression>",
      PartialSignature
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.PipeInvoke(this.pos, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_PipeInvoke;
  }
}

export class $$Expression$_Interpolate extends Expression {
  readonly tag!: "Interpolate";

  constructor(readonly pos: Meta, readonly value: Interpolation<Expression>) {
    super();
    Object.defineProperty(this, "tag", { value: "Interpolate" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Interpolation<Expression>>(
      value,
      "Interpolation<Expression>",
      Interpolation
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Interpolate(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Interpolate;
  }
}

export class $$Expression$_Condition extends Expression {
  readonly tag!: "Condition";

  constructor(readonly pos: Meta, readonly cases: ConditionCase[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Condition" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<ConditionCase[]>(
      cases,
      "ConditionCase[]",
      $is_array(ConditionCase)
    );
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Condition(this.pos, this.cases);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Condition;
  }
}

export class $$Expression$_HasType extends Expression {
  readonly tag!: "HasType";

  constructor(
    readonly pos: Meta,
    readonly value: Expression,
    readonly typ: TypeApp
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "HasType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(value, "Expression", Expression);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.HasType(this.pos, this.value, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_HasType;
  }
}

export class $$Expression$_Force extends Expression {
  readonly tag!: "Force";

  constructor(readonly pos: Meta, readonly value: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Force" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Force(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Force;
  }
}

export class $$Expression$_Lazy extends Expression {
  readonly tag!: "Lazy";

  constructor(readonly pos: Meta, readonly value: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Lazy" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Lazy(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Lazy;
  }
}

export class $$Expression$_Hole extends Expression {
  readonly tag!: "Hole";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Hole" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Hole(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Hole;
  }
}

export class $$Expression$_Return extends Expression {
  readonly tag!: "Return";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Return" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Return(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Return;
  }
}

export class $$Expression$_Type extends Expression {
  readonly tag!: "Type";

  constructor(readonly pos: Meta, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "Type" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Type(this.pos, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Type;
  }
}

export class $$Expression$_Lambda extends Expression {
  readonly tag!: "Lambda";

  constructor(
    readonly pos: Meta,
    readonly params: Name[],
    readonly body: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Lambda" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name[]>(params, "Name[]", $is_array(Name));
    $assert_type<Expression>(body, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Lambda(this.pos, this.params, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Lambda;
  }
}

export class $$Expression$_IntrinsicEqual extends Expression {
  readonly tag!: "IntrinsicEqual";

  constructor(
    readonly pos: Meta,
    readonly left: Expression,
    readonly right: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "IntrinsicEqual" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(left, "Expression", Expression);
    $assert_type<Expression>(right, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.IntrinsicEqual(this.pos, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_IntrinsicEqual;
  }
}

export class $$Expression$_Parens extends Expression {
  readonly tag!: "Parens";

  constructor(readonly pos: Meta, readonly value: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Parens" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Parens(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Parens;
  }
}

export class $$Expression$_Lit extends Expression {
  readonly tag!: "Lit";

  constructor(readonly value: Literal) {
    super();
    Object.defineProperty(this, "tag", { value: "Lit" });
    $assert_type<Literal>(value, "Literal", Literal);
  }

  match<$T>(p: $p_Expression<$T>): $T {
    return p.Lit(this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Expression$_Lit;
  }
}

type $p_ForExpression<$T> = {
  Map(pos: Meta, name: Name, stream: Expression, body: ForExpression): $T;

  If(pos: Meta, condition: Expression, body: ForExpression): $T;

  Do(pos: Meta, body: Expression): $T;
};

export abstract class ForExpression extends Node {
  abstract tag: "Map" | "If" | "Do";
  abstract match<$T>(p: $p_ForExpression<$T>): $T;

  static get Map() {
    return $$ForExpression$_Map;
  }

  static get If() {
    return $$ForExpression$_If;
  }

  static get Do() {
    return $$ForExpression$_Do;
  }

  static has_instance(x: any) {
    return x instanceof ForExpression;
  }
}

export class $$ForExpression$_Map extends ForExpression {
  readonly tag!: "Map";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly stream: Expression,
    readonly body: ForExpression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Map" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Expression>(stream, "Expression", Expression);
    $assert_type<ForExpression>(body, "ForExpression", ForExpression);
  }

  match<$T>(p: $p_ForExpression<$T>): $T {
    return p.Map(this.pos, this.name, this.stream, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$ForExpression$_Map;
  }
}

export class $$ForExpression$_If extends ForExpression {
  readonly tag!: "If";

  constructor(
    readonly pos: Meta,
    readonly condition: Expression,
    readonly body: ForExpression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "If" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(condition, "Expression", Expression);
    $assert_type<ForExpression>(body, "ForExpression", ForExpression);
  }

  match<$T>(p: $p_ForExpression<$T>): $T {
    return p.If(this.pos, this.condition, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$ForExpression$_If;
  }
}

export class $$ForExpression$_Do extends ForExpression {
  readonly tag!: "Do";

  constructor(readonly pos: Meta, readonly body: Expression) {
    super();
    Object.defineProperty(this, "tag", { value: "Do" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(body, "Expression", Expression);
  }

  match<$T>(p: $p_ForExpression<$T>): $T {
    return p.Do(this.pos, this.body);
  }

  static has_instance(x: any) {
    return x instanceof $$ForExpression$_Do;
  }
}

export class MatchSearchCase extends Node {
  readonly tag!: "MatchSearchCase";

  constructor(
    readonly pos: Meta,
    readonly predicate: Predicate,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "MatchSearchCase" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(predicate, "Predicate", Predicate);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  static has_instance(x: any) {
    return x instanceof MatchSearchCase;
  }
}

export class ConditionCase extends Node {
  readonly tag!: "ConditionCase";

  constructor(
    readonly pos: Meta,
    readonly guard: Expression,
    readonly body: Statement[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "ConditionCase" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Expression>(guard, "Expression", Expression);
    $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
  }

  static has_instance(x: any) {
    return x instanceof ConditionCase;
  }
}

type $p_RecordField<$T> = {
  FName(value: Name): $T;

  FText(value: String): $T;
};

export abstract class RecordField extends Node {
  abstract tag: "FName" | "FText";
  abstract match<$T>(p: $p_RecordField<$T>): $T;

  static get FName() {
    return $$RecordField$_FName;
  }

  static get FText() {
    return $$RecordField$_FText;
  }

  static has_instance(x: any) {
    return x instanceof RecordField;
  }
}

export class $$RecordField$_FName extends RecordField {
  readonly tag!: "FName";

  constructor(readonly value: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "FName" });
    $assert_type<Name>(value, "Name", Name);
  }

  match<$T>(p: $p_RecordField<$T>): $T {
    return p.FName(this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$RecordField$_FName;
  }
}

export class $$RecordField$_FText extends RecordField {
  readonly tag!: "FText";

  constructor(readonly value: String) {
    super();
    Object.defineProperty(this, "tag", { value: "FText" });
    $assert_type<String>(value, "String", String);
  }

  match<$T>(p: $p_RecordField<$T>): $T {
    return p.FText(this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$RecordField$_FText;
  }
}

export class Projection extends Node {
  readonly tag!: "Projection";

  constructor(
    readonly pos: Meta,
    readonly name: RecordField,
    readonly alias: RecordField
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Projection" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<RecordField>(name, "RecordField", RecordField);
    $assert_type<RecordField>(alias, "RecordField", RecordField);
  }

  static has_instance(x: any) {
    return x instanceof Projection;
  }
}

export class Interpolation<T> extends Node {
  readonly tag!: "Interpolation";

  constructor(readonly pos: Meta, readonly parts: InterpolationPart<T>[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Interpolation" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<InterpolationPart<T>[]>(
      parts,
      "InterpolationPart<T>[]",
      $is_array(InterpolationPart)
    );
  }

  static has_instance(x: any) {
    return x instanceof Interpolation;
  }
}

type $p_InterpolationPart<T, $T> = {
  Escape(pos: Meta, character: string): $T;

  Static(pos: Meta, text: string): $T;

  Dynamic(pos: Meta, value: T): $T;
};

export abstract class InterpolationPart<T> extends Node {
  abstract tag: "Escape" | "Static" | "Dynamic";
  abstract match<$T>(p: $p_InterpolationPart<T, $T>): $T;

  static get Escape() {
    return $$InterpolationPart$_Escape;
  }

  static get Static() {
    return $$InterpolationPart$_Static;
  }

  static get Dynamic() {
    return $$InterpolationPart$_Dynamic;
  }

  static has_instance(x: any) {
    return x instanceof InterpolationPart;
  }
}

export class $$InterpolationPart$_Escape<T> extends InterpolationPart<T> {
  readonly tag!: "Escape";

  constructor(readonly pos: Meta, readonly character: string) {
    super();
    Object.defineProperty(this, "tag", { value: "Escape" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(character, "string", $is_type("string"));
  }

  match<$T>(p: $p_InterpolationPart<T, $T>): $T {
    return p.Escape(this.pos, this.character);
  }

  static has_instance(x: any) {
    return x instanceof $$InterpolationPart$_Escape;
  }
}

export class $$InterpolationPart$_Static<T> extends InterpolationPart<T> {
  readonly tag!: "Static";

  constructor(readonly pos: Meta, readonly text: string) {
    super();
    Object.defineProperty(this, "tag", { value: "Static" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(text, "string", $is_type("string"));
  }

  match<$T>(p: $p_InterpolationPart<T, $T>): $T {
    return p.Static(this.pos, this.text);
  }

  static has_instance(x: any) {
    return x instanceof $$InterpolationPart$_Static;
  }
}

export class $$InterpolationPart$_Dynamic<T> extends InterpolationPart<T> {
  readonly tag!: "Dynamic";

  constructor(readonly pos: Meta, readonly value: T) {
    super();
    Object.defineProperty(this, "tag", { value: "Dynamic" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_InterpolationPart<T, $T>): $T {
    return p.Dynamic(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$InterpolationPart$_Dynamic;
  }
}

type $p_Literal<$T> = {
  False(pos: Meta): $T;

  True(pos: Meta): $T;

  Nothing(pos: Meta): $T;

  Text(pos: Meta, value: String): $T;

  Integer(pos: Meta, digits: string): $T;

  Float(pos: Meta, digits: string): $T;
};

export abstract class Literal extends Node {
  abstract tag: "False" | "True" | "Nothing" | "Text" | "Integer" | "Float";
  abstract match<$T>(p: $p_Literal<$T>): $T;

  static get False() {
    return $$Literal$_False;
  }

  static get True() {
    return $$Literal$_True;
  }

  static get Nothing() {
    return $$Literal$_Nothing;
  }

  static get Text() {
    return $$Literal$_Text;
  }

  static get Integer() {
    return $$Literal$_Integer;
  }

  static get Float() {
    return $$Literal$_Float;
  }

  static has_instance(x: any) {
    return x instanceof Literal;
  }
}

export class $$Literal$_False extends Literal {
  readonly tag!: "False";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "False" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.False(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_False;
  }
}

export class $$Literal$_True extends Literal {
  readonly tag!: "True";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "True" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.True(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_True;
  }
}

export class $$Literal$_Nothing extends Literal {
  readonly tag!: "Nothing";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Nothing" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.Nothing(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_Nothing;
  }
}

export class $$Literal$_Text extends Literal {
  readonly tag!: "Text";

  constructor(readonly pos: Meta, readonly value: String) {
    super();
    Object.defineProperty(this, "tag", { value: "Text" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<String>(value, "String", String);
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.Text(this.pos, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_Text;
  }
}

export class $$Literal$_Integer extends Literal {
  readonly tag!: "Integer";

  constructor(readonly pos: Meta, readonly digits: string) {
    super();
    Object.defineProperty(this, "tag", { value: "Integer" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(digits, "string", $is_type("string"));
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.Integer(this.pos, this.digits);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_Integer;
  }
}

export class $$Literal$_Float extends Literal {
  readonly tag!: "Float";

  constructor(readonly pos: Meta, readonly digits: string) {
    super();
    Object.defineProperty(this, "tag", { value: "Float" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(digits, "string", $is_type("string"));
  }

  match<$T>(p: $p_Literal<$T>): $T {
    return p.Float(this.pos, this.digits);
  }

  static has_instance(x: any) {
    return x instanceof $$Literal$_Float;
  }
}

type $p_SimulationGoal<$T> = {
  ActionQuiescence(pos: Meta): $T;

  EventQuiescence(pos: Meta): $T;

  TotalQuiescence(pos: Meta): $T;

  CustomGoal(pos: Meta, pred: Predicate): $T;
};

export abstract class SimulationGoal extends Node {
  abstract tag:
    | "ActionQuiescence"
    | "EventQuiescence"
    | "TotalQuiescence"
    | "CustomGoal";
  abstract match<$T>(p: $p_SimulationGoal<$T>): $T;

  static get ActionQuiescence() {
    return $$SimulationGoal$_ActionQuiescence;
  }

  static get EventQuiescence() {
    return $$SimulationGoal$_EventQuiescence;
  }

  static get TotalQuiescence() {
    return $$SimulationGoal$_TotalQuiescence;
  }

  static get CustomGoal() {
    return $$SimulationGoal$_CustomGoal;
  }

  static has_instance(x: any) {
    return x instanceof SimulationGoal;
  }
}

export class $$SimulationGoal$_ActionQuiescence extends SimulationGoal {
  readonly tag!: "ActionQuiescence";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "ActionQuiescence" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_SimulationGoal<$T>): $T {
    return p.ActionQuiescence(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationGoal$_ActionQuiescence;
  }
}

export class $$SimulationGoal$_EventQuiescence extends SimulationGoal {
  readonly tag!: "EventQuiescence";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "EventQuiescence" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_SimulationGoal<$T>): $T {
    return p.EventQuiescence(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationGoal$_EventQuiescence;
  }
}

export class $$SimulationGoal$_TotalQuiescence extends SimulationGoal {
  readonly tag!: "TotalQuiescence";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "TotalQuiescence" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_SimulationGoal<$T>): $T {
    return p.TotalQuiescence(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationGoal$_TotalQuiescence;
  }
}

export class $$SimulationGoal$_CustomGoal extends SimulationGoal {
  readonly tag!: "CustomGoal";

  constructor(readonly pos: Meta, readonly pred: Predicate) {
    super();
    Object.defineProperty(this, "tag", { value: "CustomGoal" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(pred, "Predicate", Predicate);
  }

  match<$T>(p: $p_SimulationGoal<$T>): $T {
    return p.CustomGoal(this.pos, this.pred);
  }

  static has_instance(x: any) {
    return x instanceof $$SimulationGoal$_CustomGoal;
  }
}

type $p_Predicate<$T> = {
  And(pos: Meta, left: Predicate, right: Predicate): $T;

  Or(pos: Meta, left: Predicate, right: Predicate): $T;

  Not(pos: Meta, pred: Predicate): $T;

  Has(pos: Meta, signature: Signature<Pattern>): $T;

  Sample(pos: Meta, size: Literal, pool: SamplingPool): $T;

  Constrain(pos: Meta, pred: Predicate, constraint: Expression): $T;

  Let(pos: Meta, name: Name, value: Expression): $T;

  Typed(pos: Meta, name: Name, typ: TypeApp): $T;

  Always(pos: Meta): $T;

  Parens(pos: Meta, pred: Predicate): $T;
};

export abstract class Predicate extends Node {
  abstract tag:
    | "And"
    | "Or"
    | "Not"
    | "Has"
    | "Sample"
    | "Constrain"
    | "Let"
    | "Typed"
    | "Always"
    | "Parens";
  abstract match<$T>(p: $p_Predicate<$T>): $T;

  static get And() {
    return $$Predicate$_And;
  }

  static get Or() {
    return $$Predicate$_Or;
  }

  static get Not() {
    return $$Predicate$_Not;
  }

  static get Has() {
    return $$Predicate$_Has;
  }

  static get Sample() {
    return $$Predicate$_Sample;
  }

  static get Constrain() {
    return $$Predicate$_Constrain;
  }

  static get Let() {
    return $$Predicate$_Let;
  }

  static get Typed() {
    return $$Predicate$_Typed;
  }

  static get Always() {
    return $$Predicate$_Always;
  }

  static get Parens() {
    return $$Predicate$_Parens;
  }

  static has_instance(x: any) {
    return x instanceof Predicate;
  }
}

export class $$Predicate$_And extends Predicate {
  readonly tag!: "And";

  constructor(
    readonly pos: Meta,
    readonly left: Predicate,
    readonly right: Predicate
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "And" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(left, "Predicate", Predicate);
    $assert_type<Predicate>(right, "Predicate", Predicate);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.And(this.pos, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_And;
  }
}

export class $$Predicate$_Or extends Predicate {
  readonly tag!: "Or";

  constructor(
    readonly pos: Meta,
    readonly left: Predicate,
    readonly right: Predicate
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Or" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(left, "Predicate", Predicate);
    $assert_type<Predicate>(right, "Predicate", Predicate);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Or(this.pos, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Or;
  }
}

export class $$Predicate$_Not extends Predicate {
  readonly tag!: "Not";

  constructor(readonly pos: Meta, readonly pred: Predicate) {
    super();
    Object.defineProperty(this, "tag", { value: "Not" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(pred, "Predicate", Predicate);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Not(this.pos, this.pred);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Not;
  }
}

export class $$Predicate$_Has extends Predicate {
  readonly tag!: "Has";

  constructor(readonly pos: Meta, readonly signature: Signature<Pattern>) {
    super();
    Object.defineProperty(this, "tag", { value: "Has" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Pattern>>(
      signature,
      "Signature<Pattern>",
      Signature
    );
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Has(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Has;
  }
}

export class $$Predicate$_Sample extends Predicate {
  readonly tag!: "Sample";

  constructor(
    readonly pos: Meta,
    readonly size: Literal,
    readonly pool: SamplingPool
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Sample" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Literal>(size, "Literal", Literal);
    $assert_type<SamplingPool>(pool, "SamplingPool", SamplingPool);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Sample(this.pos, this.size, this.pool);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Sample;
  }
}

export class $$Predicate$_Constrain extends Predicate {
  readonly tag!: "Constrain";

  constructor(
    readonly pos: Meta,
    readonly pred: Predicate,
    readonly constraint: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Constrain" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(pred, "Predicate", Predicate);
    $assert_type<Expression>(constraint, "Expression", Expression);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Constrain(this.pos, this.pred, this.constraint);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Constrain;
  }
}

export class $$Predicate$_Let extends Predicate {
  readonly tag!: "Let";

  constructor(
    readonly pos: Meta,
    readonly name: Name,
    readonly value: Expression
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Let" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Expression>(value, "Expression", Expression);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Let(this.pos, this.name, this.value);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Let;
  }
}

export class $$Predicate$_Typed extends Predicate {
  readonly tag!: "Typed";

  constructor(readonly pos: Meta, readonly name: Name, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "Typed" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Typed(this.pos, this.name, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Typed;
  }
}

export class $$Predicate$_Always extends Predicate {
  readonly tag!: "Always";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Always" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Always(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Always;
  }
}

export class $$Predicate$_Parens extends Predicate {
  readonly tag!: "Parens";

  constructor(readonly pos: Meta, readonly pred: Predicate) {
    super();
    Object.defineProperty(this, "tag", { value: "Parens" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Predicate>(pred, "Predicate", Predicate);
  }

  match<$T>(p: $p_Predicate<$T>): $T {
    return p.Parens(this.pos, this.pred);
  }

  static has_instance(x: any) {
    return x instanceof $$Predicate$_Parens;
  }
}

type $p_SamplingPool<$T> = {
  Relation(pos: Meta, signature: Signature<Pattern>): $T;

  Type(pos: Meta, name: Name, typ: TypeApp): $T;
};

export abstract class SamplingPool extends Node {
  abstract tag: "Relation" | "Type";
  abstract match<$T>(p: $p_SamplingPool<$T>): $T;

  static get Relation() {
    return $$SamplingPool$_Relation;
  }

  static get Type() {
    return $$SamplingPool$_Type;
  }

  static has_instance(x: any) {
    return x instanceof SamplingPool;
  }
}

export class $$SamplingPool$_Relation extends SamplingPool {
  readonly tag!: "Relation";

  constructor(readonly pos: Meta, readonly signature: Signature<Pattern>) {
    super();
    Object.defineProperty(this, "tag", { value: "Relation" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Signature<Pattern>>(
      signature,
      "Signature<Pattern>",
      Signature
    );
  }

  match<$T>(p: $p_SamplingPool<$T>): $T {
    return p.Relation(this.pos, this.signature);
  }

  static has_instance(x: any) {
    return x instanceof $$SamplingPool$_Relation;
  }
}

export class $$SamplingPool$_Type extends SamplingPool {
  readonly tag!: "Type";

  constructor(readonly pos: Meta, readonly name: Name, readonly typ: TypeApp) {
    super();
    Object.defineProperty(this, "tag", { value: "Type" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
  }

  match<$T>(p: $p_SamplingPool<$T>): $T {
    return p.Type(this.pos, this.name, this.typ);
  }

  static has_instance(x: any) {
    return x instanceof $$SamplingPool$_Type;
  }
}

type $p_Pattern<$T> = {
  HasType(pos: Meta, typ: TypeApp, name: Pattern): $T;

  Global(pos: Meta, name: Name): $T;

  Variable(pos: Meta, name: Name): $T;

  Self(pos: Meta): $T;

  Wildcard(pos: Meta): $T;

  Lit(lit: Literal): $T;
};

export abstract class Pattern extends Node {
  abstract tag: "HasType" | "Global" | "Variable" | "Self" | "Wildcard" | "Lit";
  abstract match<$T>(p: $p_Pattern<$T>): $T;

  static get HasType() {
    return $$Pattern$_HasType;
  }

  static get Global() {
    return $$Pattern$_Global;
  }

  static get Variable() {
    return $$Pattern$_Variable;
  }

  static get Self() {
    return $$Pattern$_Self;
  }

  static get Wildcard() {
    return $$Pattern$_Wildcard;
  }

  static get Lit() {
    return $$Pattern$_Lit;
  }

  static has_instance(x: any) {
    return x instanceof Pattern;
  }
}

export class $$Pattern$_HasType extends Pattern {
  readonly tag!: "HasType";

  constructor(
    readonly pos: Meta,
    readonly typ: TypeApp,
    readonly name: Pattern
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "HasType" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
    $assert_type<Pattern>(name, "Pattern", Pattern);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.HasType(this.pos, this.typ, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_HasType;
  }
}

export class $$Pattern$_Global extends Pattern {
  readonly tag!: "Global";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Global" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.Global(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_Global;
  }
}

export class $$Pattern$_Variable extends Pattern {
  readonly tag!: "Variable";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Variable" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.Variable(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_Variable;
  }
}

export class $$Pattern$_Self extends Pattern {
  readonly tag!: "Self";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Self" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.Self(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_Self;
  }
}

export class $$Pattern$_Wildcard extends Pattern {
  readonly tag!: "Wildcard";

  constructor(readonly pos: Meta) {
    super();
    Object.defineProperty(this, "tag", { value: "Wildcard" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.Wildcard(this.pos);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_Wildcard;
  }
}

export class $$Pattern$_Lit extends Pattern {
  readonly tag!: "Lit";

  constructor(readonly lit: Literal) {
    super();
    Object.defineProperty(this, "tag", { value: "Lit" });
    $assert_type<Literal>(lit, "Literal", Literal);
  }

  match<$T>(p: $p_Pattern<$T>): $T {
    return p.Lit(this.lit);
  }

  static has_instance(x: any) {
    return x instanceof $$Pattern$_Lit;
  }
}

type $p_Signature<T, $T> = {
  Unary(pos: Meta, self: T, name: Name): $T;

  Binary(pos: Meta, op: Name, left: T, right: T): $T;

  Keyword(pos: Meta, self: T, pairs: Pair<Name, T>[]): $T;

  KeywordSelfless(pos: Meta, pairs: Pair<Name, T>[]): $T;
};

export abstract class Signature<T> extends Node {
  abstract tag: "Unary" | "Binary" | "Keyword" | "KeywordSelfless";
  abstract match<$T>(p: $p_Signature<T, $T>): $T;

  static get Unary() {
    return $$Signature$_Unary;
  }

  static get Binary() {
    return $$Signature$_Binary;
  }

  static get Keyword() {
    return $$Signature$_Keyword;
  }

  static get KeywordSelfless() {
    return $$Signature$_KeywordSelfless;
  }

  static has_instance(x: any) {
    return x instanceof Signature;
  }
}

export class $$Signature$_Unary<T> extends Signature<T> {
  readonly tag!: "Unary";

  constructor(readonly pos: Meta, readonly self: T, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Unary" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_Signature<T, $T>): $T {
    return p.Unary(this.pos, this.self, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$Signature$_Unary;
  }
}

export class $$Signature$_Binary<T> extends Signature<T> {
  readonly tag!: "Binary";

  constructor(
    readonly pos: Meta,
    readonly op: Name,
    readonly left: T,
    readonly right: T
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Binary" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(op, "Name", Name);
  }

  match<$T>(p: $p_Signature<T, $T>): $T {
    return p.Binary(this.pos, this.op, this.left, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$Signature$_Binary;
  }
}

export class $$Signature$_Keyword<T> extends Signature<T> {
  readonly tag!: "Keyword";

  constructor(
    readonly pos: Meta,
    readonly self: T,
    readonly pairs: Pair<Name, T>[]
  ) {
    super();
    Object.defineProperty(this, "tag", { value: "Keyword" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Pair<Name, T>[]>(pairs, "Pair<Name, T>[]", $is_array(Pair));
  }

  match<$T>(p: $p_Signature<T, $T>): $T {
    return p.Keyword(this.pos, this.self, this.pairs);
  }

  static has_instance(x: any) {
    return x instanceof $$Signature$_Keyword;
  }
}

export class $$Signature$_KeywordSelfless<T> extends Signature<T> {
  readonly tag!: "KeywordSelfless";

  constructor(readonly pos: Meta, readonly pairs: Pair<Name, T>[]) {
    super();
    Object.defineProperty(this, "tag", { value: "KeywordSelfless" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Pair<Name, T>[]>(pairs, "Pair<Name, T>[]", $is_array(Pair));
  }

  match<$T>(p: $p_Signature<T, $T>): $T {
    return p.KeywordSelfless(this.pos, this.pairs);
  }

  static has_instance(x: any) {
    return x instanceof $$Signature$_KeywordSelfless;
  }
}

type $p_PartialSignature<T, $T> = {
  Unary(pos: Meta, name: Name): $T;

  Binary(pos: Meta, op: Name, right: T): $T;

  Keyword(pos: Meta, pairs: Pair<Name, T>[]): $T;
};

export abstract class PartialSignature<T> extends Node {
  abstract tag: "Unary" | "Binary" | "Keyword";
  abstract match<$T>(p: $p_PartialSignature<T, $T>): $T;

  static get Unary() {
    return $$PartialSignature$_Unary;
  }

  static get Binary() {
    return $$PartialSignature$_Binary;
  }

  static get Keyword() {
    return $$PartialSignature$_Keyword;
  }

  static has_instance(x: any) {
    return x instanceof PartialSignature;
  }
}

export class $$PartialSignature$_Unary<T> extends PartialSignature<T> {
  readonly tag!: "Unary";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Unary" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_PartialSignature<T, $T>): $T {
    return p.Unary(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$PartialSignature$_Unary;
  }
}

export class $$PartialSignature$_Binary<T> extends PartialSignature<T> {
  readonly tag!: "Binary";

  constructor(readonly pos: Meta, readonly op: Name, readonly right: T) {
    super();
    Object.defineProperty(this, "tag", { value: "Binary" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(op, "Name", Name);
  }

  match<$T>(p: $p_PartialSignature<T, $T>): $T {
    return p.Binary(this.pos, this.op, this.right);
  }

  static has_instance(x: any) {
    return x instanceof $$PartialSignature$_Binary;
  }
}

export class $$PartialSignature$_Keyword<T> extends PartialSignature<T> {
  readonly tag!: "Keyword";

  constructor(readonly pos: Meta, readonly pairs: Pair<Name, T>[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Keyword" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Pair<Name, T>[]>(pairs, "Pair<Name, T>[]", $is_array(Pair));
  }

  match<$T>(p: $p_PartialSignature<T, $T>): $T {
    return p.Keyword(this.pos, this.pairs);
  }

  static has_instance(x: any) {
    return x instanceof $$PartialSignature$_Keyword;
  }
}

type $p_RelationPart<$T> = {
  Many(pos: Meta, name: Name): $T;

  One(pos: Meta, name: Name): $T;
};

export abstract class RelationPart extends Node {
  abstract tag: "Many" | "One";
  abstract match<$T>(p: $p_RelationPart<$T>): $T;

  static get Many() {
    return $$RelationPart$_Many;
  }

  static get One() {
    return $$RelationPart$_One;
  }

  static has_instance(x: any) {
    return x instanceof RelationPart;
  }
}

export class $$RelationPart$_Many extends RelationPart {
  readonly tag!: "Many";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Many" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_RelationPart<$T>): $T {
    return p.Many(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$RelationPart$_Many;
  }
}

export class $$RelationPart$_One extends RelationPart {
  readonly tag!: "One";

  constructor(readonly pos: Meta, readonly name: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "One" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
  }

  match<$T>(p: $p_RelationPart<$T>): $T {
    return p.One(this.pos, this.name);
  }

  static has_instance(x: any) {
    return x instanceof $$RelationPart$_One;
  }
}

export class Pair<K, V> extends Node {
  readonly tag!: "Pair";

  constructor(readonly pos: Meta, readonly key: K, readonly value: V) {
    super();
    Object.defineProperty(this, "tag", { value: "Pair" });
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  static has_instance(x: any) {
    return x instanceof Pair;
  }
}

export class Name extends Node {
  readonly tag!: "Name";

  constructor(readonly pos: Meta, readonly name: string) {
    super();
    Object.defineProperty(this, "tag", { value: "Name" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(name, "string", $is_type("string"));
  }

  static has_instance(x: any) {
    return x instanceof Name;
  }
}

export class Namespace extends Node {
  readonly tag!: "Namespace";

  constructor(readonly pos: Meta, readonly names: string[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Namespace" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string[]>(names, "string[]", $is_array($is_type("string")));
  }

  static has_instance(x: any) {
    return x instanceof Namespace;
  }
}

export class String extends Node {
  readonly tag!: "String";

  constructor(readonly pos: Meta, readonly text: string) {
    super();
    Object.defineProperty(this, "tag", { value: "String" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(text, "string", $is_type("string"));
  }

  static has_instance(x: any) {
    return x instanceof String;
  }
}

// == Grammar definition ============================================
export const grammar = Ohm.grammar(
  '\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\nrepl  = declaration  -- alt1\n | statement  -- alt2\n\n\ndeclaration  = relationDeclaration  -- alt1\n | predicateDeclaration  -- alt2\n | doDeclaration  -- alt3\n | commandDeclaration  -- alt4\n | typeDeclaration  -- alt5\n | defineDeclaration  -- alt6\n | sceneDeclaration  -- alt7\n | actionDeclaration  -- alt8\n | whenDeclaration  -- alt9\n | contextDeclaration  -- alt10\n | openDeclaration  -- alt11\n | localDeclaration  -- alt12\n | testDeclaration  -- alt13\n\n\ntestDeclaration  = test_ string do_ statements end_  -- alt1\n\n\ntrailingTest  = oneTrailingTest  -- alt1\n | s<";">  -- alt2\n\n\noneTrailingTest  = test_ statements end_  -- alt1\n\n\nlocalDeclaration  = local_ defineDeclaration  -- alt1\n | local_ typeDeclaration  -- alt2\n\n\nopenDeclaration  = open_ namespace s<";">  -- alt1\n\n\nrelationDeclaration  = relation_ logicSignature<relationPart> s<";">  -- alt1\n\n\nrelationPart  = name s<"*">  -- alt1\n | name  -- alt2\n\n\npredicateDeclaration  = predicate_ logicSignature<name> block<predicateClause>  -- alt1\n\n\npredicateClause  = when_ predicate s<";">  -- alt1\n | always_ predicate s<";">  -- alt2\n\n\ndoDeclaration  = prelude_ statements end_  -- alt1\n\n\ncommandDeclaration  = command_ signature<parameter> contractDefinition s<"="> foreign_ foreignBody trailingTest  -- alt1\n | command_ signature<parameter> contractDefinition s<"="> expression trailingTest  -- alt2\n | command_ signature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt3\n | command_ signature<parameter> contractDefinition do_ statements end_  -- alt4\n\n\ncontractDefinition  = retContractDefinition preContractDefinition postContractDefinition  -- alt1\n\n\nretContractDefinition  = s<"->"> typeAppPrimary  -- alt1\n |   -- alt2\n\n\npreContractDefinition  = requires_ list1<contractCondition, s<";">>  -- alt1\n |   -- alt2\n\n\npostContractDefinition  = ensures_ list1<contractCondition, s<";">>  -- alt1\n |   -- alt2\n\n\ncontractCondition  = atom s<"::"> expression  -- alt1\n\n\nforeignBody  = namespace s<"("> list0<name, s<",">> s<")">  -- alt1\n\n\nparameter  = name  -- alt1\n | s<"("> name is_ typeApp s<")">  -- alt2\n | typeAppStatic  -- alt3\n\n\ntypeApp  = typeAppStatic  -- alt1\n\n\ntypeAppStatic  = s<"#"> typeAppPrimary  -- alt1\n | typeAppPrimary  -- alt2\n\n\ntypeAppPrimary  = typeName  -- alt1\n\n\ntypeName  = atom  -- alt1\n | nothing_  -- alt2\n | true_  -- alt3\n | false_  -- alt4\n\n\ntypeDeclaration  = enum_ typeName s<"="> nonemptyListOf<typeName, s<",">> s<";">  -- alt1\n | abstract_ basicType s<";">  -- alt2\n | singleton_ basicType typeInitBlock  -- alt3\n | type_ basicType typeFields s<";">  -- alt4\n | type_ typeName s<"="> foreign_ namespace s<";">  -- alt5\n\n\nbasicType  = atom typeDefParent  -- alt1\n\n\ntypeDefParent  = is_ typeApp  -- alt1\n |   -- alt2\n\n\ntypeInitBlock  = with_ typeInit* end_  -- alt1\n | s<";">  -- alt2\n\n\ntypeFields  = s<"("> list1<typeField, s<",">> s<")">  -- alt1\n |   -- alt2\n\n\ntypeField  = typeFieldName is_ typeApp  -- alt1\n | typeFieldName  -- alt2\n\n\ntypeFieldName  = name  -- alt1\n | atom  -- alt2\n\n\ntypeInit  = partialLogicSignature<invokePostfix> s<";">  -- alt1\n | command_ partialSignature<parameter> contractDefinition s<"="> foreignBody trailingTest  -- alt2\n | command_ partialSignature<parameter> contractDefinition s<"="> expression trailingTest  -- alt3\n | command_ partialSignature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt4\n | command_ partialSignature<parameter> contractDefinition do_ statements end_  -- alt5\n\n\ndefineDeclaration  = define_ atom s<"="> atomicExpression s<";">  -- alt1\n\n\nsceneDeclaration  = scene_ atom do_ statements end_  -- alt1\n\n\nactionDeclaration  = action_ actionTitle actionType actionTags actionPredicate actionRank do_ statements end_  -- alt1\n\n\nactionType  = for_ typeApp  -- alt1\n |   -- alt2\n\n\nactionTitle  = interpolateText<expression>  -- alt1\n\n\nactionTags  = tags_ list1<atom, s<",">>  -- alt1\n |   -- alt2\n\n\nactionPredicate  = when_ predicate  -- alt1\n |   -- alt2\n\n\nactionRank  = rank_ expression  -- alt1\n |   -- alt2\n\n\nwhenDeclaration  = when_ predicate do_ statements end_  -- alt1\n\n\ncontextDeclaration  = context_ atom with_ contextItem* end_  -- alt1\n\n\ncontextItem  = actionDeclaration  -- alt1\n | whenDeclaration  -- alt2\n\n\npredicate  = predicateBinary  -- alt1\n\n\npredicateBinary  = predicateAnd  -- alt1\n | predicateOr  -- alt2\n | predicateNot  -- alt3\n\n\npredicateAnd  = predicateNot s<","> predicateAnd1  -- alt1\n\n\npredicateAnd1  = predicateNot s<","> predicateAnd1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateOr  = predicateNot s<"|"> predicateOr1  -- alt1\n\n\npredicateOr1  = predicateNot s<"|"> predicateOr1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateNot  = not_ predicateConstrain  -- alt1\n | predicateConstrain  -- alt2\n\n\npredicateConstrain  = predicateLet if_ expression  -- alt1\n | if_ expression  -- alt2\n | predicateLet  -- alt3\n | predicateSample  -- alt4\n | predicateType  -- alt5\n | predicatePrimary  -- alt6\n\n\npredicateType  = name is_ typeApp  -- alt1\n\n\npredicateLet  = let_ name s<"="> expression  -- alt1\n\n\npredicateSample  = sample_ integer of_ samplingPool  -- alt1\n\n\nsamplingPool  = logicSignature<pattern>  -- alt1\n | name is_ typeApp  -- alt2\n\n\npredicatePrimary  = always_  -- alt1\n | logicSignature<pattern>  -- alt2\n | s<"("> predicate s<")">  -- alt3\n\n\npattern  = s<"("> patternComplex s<")">  -- alt1\n | atom  -- alt2\n | self_  -- alt3\n | literal  -- alt4\n | patternName  -- alt5\n\n\npatternComplex  = patternName is_ typeApp  -- alt1\n\n\npatternName  = s<"_">  -- alt1\n | name  -- alt2\n\n\nstatement  = letStatement  -- alt1\n | factStatement  -- alt2\n | forgetStatement  -- alt3\n | gotoStatement  -- alt4\n | callStatement  -- alt5\n | simulateStatement  -- alt6\n | assertStatement  -- alt7\n | expression  -- alt8\n\n\nletStatement  = let_ name s<"="> expression  -- alt1\n\n\nfactStatement  = fact_ logicSignature<primaryExpression>  -- alt1\n\n\nforgetStatement  = forget_ logicSignature<primaryExpression>  -- alt1\n\n\ngotoStatement  = goto_ atom  -- alt1\n\n\ncallStatement  = call_ atom  -- alt1\n\n\nsimulateStatement  = simulate_ for_ expression simulateContext until_ simulateGoal signal*  -- alt1\n\n\nsimulateContext  = in_ atom  -- alt1\n |   -- alt2\n\n\nsimulateGoal  = action_ quiescence_  -- alt1\n | event_ quiescence_  -- alt2\n | quiescence_  -- alt3\n | predicate  -- alt4\n\n\nsignal  = on_ signature<parameter> do_ statements end_  -- alt1\n\n\nassertStatement  = assert_ expression  -- alt1\n\n\nexpression  = searchExpression  -- alt1\n | lazyExpression  -- alt2\n | forceExpression  -- alt3\n | pipeExpression  -- alt4\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\nlazyExpression  = lazy_ expression  -- alt1\n\n\nforceExpression  = force_ expression  -- alt1\n\n\nexpressionBlock  = do_ statements end_  -- alt1\n\n\npipeExpression  = pipeExpression s<"|>"> invokeInfixExpression  -- alt1\n | pipeExpression s<"|"> partialSignature<invokeInfixExpression>  -- alt2\n | invokeInfixExpression  -- alt3\n\n\ninvokeInfixExpression  = invokeMixfix s<"=:="> invokeMixfix  -- alt1\n | invokeInfixExpression infix_symbol invokeMixfix  -- alt2\n | invokeMixfix  -- alt3\n\n\ninvokeMixfix  = castExpression signaturePair<invokePostfix>+  -- alt1\n | signaturePair<invokePostfix>+  -- alt2\n | castExpression  -- alt3\n\n\ncastExpression  = invokePrePost as_ typeAppPrimary  -- alt1\n | invokePrePost is_ typeAppPrimary  -- alt2\n | invokePrePost  -- alt3\n\n\ninvokePrePost  = invokePrefix  -- alt1\n | invokePostfix  -- alt2\n\n\ninvokePrefix  = not applyExpression  -- alt1\n\n\ninvokePostfix  = invokePostfix atom  -- alt1\n | applyExpression  -- alt2\n\n\napplyExpression  = applyExpression s<"("> list1<expression, s<",">> s<")">  -- alt1\n | memberExpression  -- alt2\n\n\nmemberExpression  = memberExpression s<"."> recordField  -- alt1\n | memberExpression s<"."> memberSelection  -- alt2\n | primaryExpression  -- alt3\n\n\nmemberSelection  = s<"("> list1<fieldSelection, s<",">> s<")">  -- alt1\n\n\nfieldSelection  = recordField as_ recordField  -- alt1\n | recordField  -- alt2\n\n\nprimaryExpression  = matchSearchExpression  -- alt1\n | conditionExpression  -- alt2\n | forExpression  -- alt3\n | newExpression<expression>  -- alt4\n | interpolateText<expression>  -- alt5\n | literalExpression  -- alt6\n | recordExpression<expression>  -- alt7\n | listExpression<expression>  -- alt8\n | lambdaExpression  -- alt9\n | expressionBlock  -- alt10\n | hole  -- alt11\n | s<"#"> typeAppPrimary  -- alt12\n | return_  -- alt13\n | self_  -- alt14\n | atom  -- alt15\n | name  -- alt16\n | s<"("> expression s<")">  -- alt17\n\n\nconditionExpression  = condition_ conditionCase+ end_  -- alt1\n\n\nconditionCase  = when_ expression eblock  -- alt1\n | always_ eblock  -- alt2\n\n\nmatchSearchExpression  = match_ matchSearchCase+ end_  -- alt1\n\n\nmatchSearchCase  = when_ predicate eblock  -- alt1\n | always_ eblock  -- alt2\n\n\nforExpression  = for_ forExprMap  -- alt1\n\n\nforExprMap  = name in_ expression forExprMap1  -- alt1\n\n\nforExprMap1  = s<","> forExprMap  -- alt1\n | if_ expression forExprDo  -- alt2\n | forExprDo  -- alt3\n\n\nforExprDo  = expressionBlock  -- alt1\n\n\nnewExpression<e>  = new_ atom newFields<e>  -- alt1\n\n\nnewFields<e>  = s<"("> list1<e, s<",">> s<")">  -- alt1\n |   -- alt2\n\n\nlistExpression<e>  = s<"["> list0<e, s<",">> s<"]">  -- alt1\n\n\nrecordExpression<e>  = s<"["> s<"->"> s<"]">  -- alt1\n | s<"["> list1<recordPair<e>, s<",">> s<"]">  -- alt2\n\n\nrecordPair<e>  = recordField s<"->"> e  -- alt1\n\n\nrecordField  = (name | atom)  -- alt1\n | string  -- alt2\n\n\nliteralExpression  = literal  -- alt1\n\n\nlambdaExpression  = s<"{"> expression s<"}">  -- alt1\n | s<"{"> list1<name, s<",">> in_ expression s<"}">  -- alt2\n\n\natomicExpression  = atom  -- alt1\n | newExpression<atomicExpression>  -- alt2\n | literalExpression  -- alt3\n | recordExpression<atomicExpression>  -- alt4\n | listExpression<atomicExpression>  -- alt5\n\n\ninterpolateText<t>  = s<"\\""> interpolatePart<t>* "\\""  -- alt1\n\n\ninterpolatePart<p>  = "\\\\" any  -- alt1\n | "[" s<p> s<"]">  -- alt2\n | ~"\\"" any  -- alt3\n\n\nliteral  = text  -- alt1\n | float  -- alt2\n | integer  -- alt3\n | boolean  -- alt4\n | nothing  -- alt5\n\n\nnothing  = nothing_  -- alt1\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = string  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\nfloat  = s<t_float>  -- alt1\n\n\nstring  = s<t_text>  -- alt1\n\n\nhole  = s<"_"> ~name_rest  -- alt1\n\n\natom  = s<"\'"> t_atom  -- alt1\n | ~reserved s<t_atom> ~":"  -- alt2\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nand  = and_  -- alt1\n\n\nor  = or_  -- alt1\n\n\nnamespace  = s<nonemptyListOf<t_atom, s<".">>>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n | signaturePair<t>+  -- alt3\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\npartialLogicSignature<t>  = signaturePair<t>+  -- alt1\n | atom  -- alt2\n\n\npartialSignature<t>  = signaturePair<t>+  -- alt1\n | infix_symbol t  -- alt2\n | atom  -- alt3\n | not  -- alt4\n\n\nsignature<t>  = t infix_symbol t  -- alt1\n | t signaturePair<t>+  -- alt2\n | t atom  -- alt3\n | not t  -- alt4\n | signaturePair<t>+  -- alt5\n\n\nstatementBlock<t>  = do_ list0<t, s<";">> end_  -- alt1\n\n\nlist0<t, s>  = listOf<t, s> s?  -- alt1\n\n\nlist1<t, s>  = nonemptyListOf<t, s> s?  -- alt1\n\n\nblock<t>  = do_ t* end_  -- alt1\n\n\nstatements  = list0<statement, s<";">>  -- alt1\n\n\neblock  = do_ statements end_  -- alt1\n | s<"=>"> expression s<";">  -- alt2\n\n\ns<p>  = space* p  -- alt1\n\n\nheader (a file header) = space* "%" hs* "crochet" nl  -- alt1\n\n\nhs  = " "  -- alt1\n | "\\t"  -- alt2\n\n\nnl  = "\\n"  -- alt1\n | "\\r"  -- alt2\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = "//" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\nsemi  = s<";">  -- alt1\n\n\natom_start  = "a".."z"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom ":"  -- alt1\n\n\nname_start  = "A".."Z"  -- alt1\n | "_"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = t_any_infix ~infix_character  -- alt1\n | and_  -- alt2\n | or_  -- alt3\n\n\nt_any_infix  = "++"  -- alt1\n | "+"  -- alt2\n | "<-"  -- alt3\n | "-"  -- alt4\n | "**"  -- alt5\n | "*"  -- alt6\n | "/"  -- alt7\n | "<="  -- alt8\n | "<"  -- alt9\n | ">="  -- alt10\n | ">"  -- alt11\n | "==="  -- alt12\n | "=/="  -- alt13\n | "%"  -- alt14\n\n\ninfix_character  = "+"  -- alt1\n | "-"  -- alt2\n | "*"  -- alt3\n | "/"  -- alt4\n | "<"  -- alt5\n | ">"  -- alt6\n | "="  -- alt7\n | "%"  -- alt8\n\n\ndec_digit  = "0".."9"  -- alt1\n | "_"  -- alt2\n\n\nt_integer (an integer) = ~"_" "-"? dec_digit+  -- alt1\n\n\nt_float (a floating point number) = ~"_" "-"? dec_digit+ "." dec_digit+  -- alt1\n\n\ntext_character  = "\\\\" "\\""  -- alt1\n | ~"\\"" any  -- alt2\n\n\nt_text (a text) = "\\"" text_character* "\\""  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<"relation">  -- alt1\n\n\npredicate_  = kw<"predicate">  -- alt1\n\n\nwhen_  = kw<"when">  -- alt1\n\n\ndo_  = kw<"do">  -- alt1\n\n\ncommand_  = kw<"command">  -- alt1\n\n\ntype_  = kw<"type">  -- alt1\n\n\nenum_  = kw<"enum">  -- alt1\n\n\ndefine_  = kw<"define">  -- alt1\n\n\nsingleton_  = kw<"singleton">  -- alt1\n\n\nscene_  = kw<"scene">  -- alt1\n\n\naction_  = kw<"action">  -- alt1\n\n\nlet_  = kw<"let">  -- alt1\n\n\nreturn_  = kw<"return">  -- alt1\n\n\nfact_  = kw<"fact">  -- alt1\n\n\nforget_  = kw<"forget">  -- alt1\n\n\nnew_  = kw<"new">  -- alt1\n\n\nsearch_  = kw<"search">  -- alt1\n\n\nif_  = kw<"if">  -- alt1\n\n\nthen_  = kw<"then">  -- alt1\n\n\nelse_  = kw<"else">  -- alt1\n\n\ngoto_  = kw<"goto">  -- alt1\n\n\ncall_  = kw<"call">  -- alt1\n\n\nsimulate_  = kw<"simulate">  -- alt1\n\n\nmatch_  = kw<"match">  -- alt1\n\n\ntrue_  = kw<"true">  -- alt1\n\n\nfalse_  = kw<"false">  -- alt1\n\n\nnot_  = kw<"not">  -- alt1\n\n\nand_  = kw<"and">  -- alt1\n\n\nor_  = kw<"or">  -- alt1\n\n\nis_  = kw<"is">  -- alt1\n\n\nself_  = kw<"self">  -- alt1\n\n\nas_  = kw<"as">  -- alt1\n\n\nevent_  = kw<"event">  -- alt1\n\n\nquiescence_  = kw<"quiescence">  -- alt1\n\n\nfor_  = kw<"for">  -- alt1\n\n\nuntil_  = kw<"until">  -- alt1\n\n\nin_  = kw<"in">  -- alt1\n\n\nforeign_  = kw<"foreign">  -- alt1\n\n\non_  = kw<"on">  -- alt1\n\n\nalways_  = kw<"always">  -- alt1\n\n\ncondition_  = kw<"condition">  -- alt1\n\n\nend_  = kw<"end">  -- alt1\n\n\nprelude_  = kw<"prelude">  -- alt1\n\n\nwith_  = kw<"with">  -- alt1\n\n\ntags_  = kw<"tags">  -- alt1\n\n\nrank_  = kw<"rank">  -- alt1\n\n\nabstract_  = kw<"abstract">  -- alt1\n\n\nlazy_  = kw<"lazy">  -- alt1\n\n\nforce_  = kw<"force">  -- alt1\n\n\ncontext_  = kw<"context">  -- alt1\n\n\nsample_  = kw<"sample">  -- alt1\n\n\nof_  = kw<"of">  -- alt1\n\n\nopen_  = kw<"open">  -- alt1\n\n\nlocal_  = kw<"local">  -- alt1\n\n\ntest_  = kw<"test">  -- alt1\n\n\nassert_  = kw<"assert">  -- alt1\n\n\nrequires_  = kw<"requires">  -- alt1\n\n\nensures_  = kw<"ensures">  -- alt1\n\n\nnothing_  = kw<"nothing">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | command_  -- alt5\n | scene_  -- alt6\n | action_  -- alt7\n | type_  -- alt8\n | enum_  -- alt9\n | define_  -- alt10\n | singleton_  -- alt11\n | goto_  -- alt12\n | call_  -- alt13\n | let_  -- alt14\n | return_  -- alt15\n | fact_  -- alt16\n | forget_  -- alt17\n | new_  -- alt18\n | search_  -- alt19\n | if_  -- alt20\n | simulate_  -- alt21\n | true_  -- alt22\n | false_  -- alt23\n | not_  -- alt24\n | and_  -- alt25\n | or_  -- alt26\n | is_  -- alt27\n | self_  -- alt28\n | as_  -- alt29\n | event_  -- alt30\n | quiescence_  -- alt31\n | for_  -- alt32\n | until_  -- alt33\n | in_  -- alt34\n | foreign_  -- alt35\n | on_  -- alt36\n | always_  -- alt37\n | match_  -- alt38\n | then_  -- alt39\n | else_  -- alt40\n | condition_  -- alt41\n | end_  -- alt42\n | prelude_  -- alt43\n | with_  -- alt44\n | tags_  -- alt45\n | rank_  -- alt46\n | abstract_  -- alt47\n | lazy_  -- alt48\n | force_  -- alt49\n | context_  -- alt50\n | sample_  -- alt51\n | of_  -- alt52\n | open_  -- alt53\n | local_  -- alt54\n | test_  -- alt55\n | assert_  -- alt56\n | requires_  -- alt57\n | ensures_  -- alt58\n | nothing_  -- alt59\n\r\n  }\r\n  '
);

// == Parsing =======================================================
export function parse(source: string, rule: string): Result<Program> {
  const result = grammar.match(source, rule);
  if (result.failed()) {
    return { ok: false, error: result.message as string };
  } else {
    const ast = toAst(result);
    $assert_type<Program>(ast, "Program", Program);
    return { ok: true, value: ast };
  }
}

export const semantics = grammar.createSemantics();
export const toAstVisitor = {
  _terminal(this: Ohm.Node): any {
    return this.primitiveValue;
  },

  _iter(this: any, children: Ohm.Node): any {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST();
      }
    }
    return children.map((x: any) => x.toAST());
  },

  nonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
    return [first.toAST(), ...rest.toAST()];
  },

  emptyListOf(): any {
    return [];
  },

  NonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
    return [first.toAST(), ...rest.toAST()];
  },

  EmptyListOf(): any {
    return [];
  },

  program(x: Ohm.Node): any {
    return x.toAST();
  },

  program_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    ds$0: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node
  ): any {
    const ds = ds$0.toAST();
    return new Program($meta(this), ds);
  },

  repl(x: Ohm.Node): any {
    return x.toAST();
  },

  repl_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  repl_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration(x: Ohm.Node): any {
    return x.toAST();
  },

  declaration_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt9(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt10(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt11(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt12(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  declaration_alt13(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  testDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  testDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    _3: Ohm.Node,
    b$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Test($meta(this), s, b);
  },

  trailingTest(x: Ohm.Node): any {
    return x.toAST();
  },

  trailingTest_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  trailingTest_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return null;
  },

  oneTrailingTest(x: Ohm.Node): any {
    return x.toAST();
  },

  oneTrailingTest_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    b$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const b = b$0.toAST();
    return new TrailingTest($meta(this), b);
  },

  localDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  localDeclaration_alt1(this: Ohm.Node, _1: Ohm.Node, d$0: Ohm.Node): any {
    const d = d$0.toAST();
    return new Declaration.Local($meta(this), d);
  },

  localDeclaration_alt2(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new Declaration.Local($meta(this), t);
  },

  openDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  openDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    ns$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const ns = ns$0.toAST();
    return new Declaration.Open($meta(this), ns);
  },

  relationDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  relationDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const s = s$0.toAST();
    return new Declaration.Relation($meta(this), s);
  },

  relationPart(x: Ohm.Node): any {
    return x.toAST();
  },

  relationPart_alt1(this: Ohm.Node, n$0: Ohm.Node, _2: Ohm.Node): any {
    const n = n$0.toAST();
    return new RelationPart.Many($meta(this), n);
  },

  relationPart_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new RelationPart.One($meta(this), n);
  },

  predicateDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    l$0: Ohm.Node,
    c$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const c = c$0.toAST();
    return new Declaration.DefinePredicate($meta(this), l, c);
  },

  predicateClause(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateClause_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const p = p$0.toAST();
    return new PredicateClause($meta(this), p, new PredicateEffect.Trivial());
  },

  predicateClause_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const p = p$0.toAST();
    return new PredicateClause(
      $meta(this),
      new Predicate.Always($meta(this)),
      new PredicateEffect.Trivial()
    );
  },

  doDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  doDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return new Declaration.Do($meta(this), xs);
  },

  commandDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  commandDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    _5: Ohm.Node,
    b$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    const t = t$0.toAST();
    return new Declaration.ForeignCommand($meta(this), s, c, b, t);
  },

  commandDeclaration_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    e$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const e = e$0.toAST();
    const t = t$0.toAST();
    return new Declaration.Command(
      $meta(this),
      s,
      c,
      [new Statement.Expr(e)],
      t
    );
  },

  commandDeclaration_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    b$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    const t = t$0.toAST();
    return new Declaration.Command($meta(this), s, c, b, t);
  },

  commandDeclaration_alt4(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    b$0: Ohm.Node,
    _6: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Command($meta(this), s, c, b, null);
  },

  contractDefinition(x: Ohm.Node): any {
    return x.toAST();
  },

  contractDefinition_alt1(
    this: Ohm.Node,
    ret$0: Ohm.Node,
    pre$0: Ohm.Node,
    post$0: Ohm.Node
  ): any {
    const ret = ret$0.toAST();
    const pre = pre$0.toAST();
    const post = post$0.toAST();
    return new Contract($meta(this), ret, pre, post);
  },

  retContractDefinition(x: Ohm.Node): any {
    return x.toAST();
  },

  retContractDefinition_alt1(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return t;
  },

  retContractDefinition_alt2(this: Ohm.Node): any {
    return null;
  },

  preContractDefinition(x: Ohm.Node): any {
    return x.toAST();
  },

  preContractDefinition_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    cs$0: Ohm.Node
  ): any {
    const cs = cs$0.toAST();
    return cs;
  },

  preContractDefinition_alt2(this: Ohm.Node): any {
    return [];
  },

  postContractDefinition(x: Ohm.Node): any {
    return x.toAST();
  },

  postContractDefinition_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    cs$0: Ohm.Node
  ): any {
    const cs = cs$0.toAST();
    return cs;
  },

  postContractDefinition_alt2(this: Ohm.Node): any {
    return [];
  },

  contractCondition(x: Ohm.Node): any {
    return x.toAST();
  },

  contractCondition_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    e$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    return new ContractCondition($meta(this), n, e);
  },

  foreignBody(x: Ohm.Node): any {
    return x.toAST();
  },

  foreignBody_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    xs$0: Ohm.Node,
    _4: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const xs = xs$0.toAST();
    return new FFI($meta(this), n, xs);
  },

  parameter(x: Ohm.Node): any {
    return x.toAST();
  },

  parameter_alt1(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Parameter.Untyped($meta(this), n);
  },

  parameter_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    t$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const t = t$0.toAST();
    return new Parameter.Typed($meta(this), n, t);
  },

  parameter_alt3(this: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new Parameter.TypedOnly($meta(this), t);
  },

  typeApp(x: Ohm.Node): any {
    return x.toAST();
  },

  typeApp_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeAppStatic(x: Ohm.Node): any {
    return x.toAST();
  },

  typeAppStatic_alt1(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new TypeApp.Static($meta(this), t);
  },

  typeAppStatic_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeAppPrimary(x: Ohm.Node): any {
    return x.toAST();
  },

  typeAppPrimary_alt1(this: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new TypeApp.Named($meta(this), t);
  },

  typeName(x: Ohm.Node): any {
    return x.toAST();
  },

  typeName_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeName_alt2(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  typeName_alt3(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  typeName_alt4(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  typeDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  typeDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    _3: Ohm.Node,
    vs$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const vs = vs$0.toAST();
    return new Declaration.EnumType($meta(this), t, vs);
  },

  typeDeclaration_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const t = t$0.toAST();
    return new Declaration.AbstractType($meta(this), t);
  },

  typeDeclaration_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    i$0: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const i = i$0.toAST();
    return new Declaration.SingletonType($meta(this), t, i);
  },

  typeDeclaration_alt4(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    fs$0: Ohm.Node,
    _4: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const fs = fs$0.toAST();
    return new Declaration.Type($meta(this), t, fs);
  },

  typeDeclaration_alt5(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node,
    ns$0: Ohm.Node,
    _6: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const ns = ns$0.toAST();
    return new Declaration.ForeignType($meta(this), n, ns);
  },

  basicType(x: Ohm.Node): any {
    return x.toAST();
  },

  basicType_alt1(this: Ohm.Node, n$0: Ohm.Node, p$0: Ohm.Node): any {
    const n = n$0.toAST();
    const p = p$0.toAST();
    return new TypeDef(p, n);
  },

  typeDefParent(x: Ohm.Node): any {
    return x.toAST();
  },

  typeDefParent_alt1(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return t;
  },

  typeDefParent_alt2(this: Ohm.Node): any {
    return null;
  },

  typeInitBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  typeInitBlock_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    x$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const x = x$0.toAST();
    return x;
  },

  typeInitBlock_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return [];
  },

  typeFields(x: Ohm.Node): any {
    return x.toAST();
  },

  typeFields_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    fs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const fs = fs$0.toAST();
    return fs;
  },

  typeFields_alt2(this: Ohm.Node): any {
    return [];
  },

  typeField(x: Ohm.Node): any {
    return x.toAST();
  },

  typeField_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const t = t$0.toAST();
    return new Parameter.Typed($meta(this), n, t);
  },

  typeField_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Parameter.Untyped($meta(this), n);
  },

  typeFieldName(x: Ohm.Node): any {
    return x.toAST();
  },

  typeFieldName_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeFieldName_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeInit(x: Ohm.Node): any {
    return x.toAST();
  },

  typeInit_alt1(this: Ohm.Node, s$0: Ohm.Node, _2: Ohm.Node): any {
    const s = s$0.toAST();
    return new TypeInit.Fact($meta(this), s);
  },

  typeInit_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    b$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    const t = t$0.toAST();
    return new TypeInit.ForeignCommand($meta(this), s, c, b, t);
  },

  typeInit_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    e$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const e = e$0.toAST();
    const t = t$0.toAST();
    return new TypeInit.Command($meta(this), s, c, [new Statement.Expr(e)], t);
  },

  typeInit_alt4(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    b$0: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    const t = t$0.toAST();
    return new TypeInit.Command($meta(this), s, c, b, t);
  },

  typeInit_alt5(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    c$0: Ohm.Node,
    _4: Ohm.Node,
    b$0: Ohm.Node,
    _6: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const c = c$0.toAST();
    const b = b$0.toAST();
    return new TypeInit.Command($meta(this), s, c, b, null);
  },

  defineDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  defineDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    e$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    return new Declaration.Define($meta(this), n, e);
  },

  sceneDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  sceneDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    b$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Scene($meta(this), n, b);
  },

  actionDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  actionDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    typ$0: Ohm.Node,
    tags$0: Ohm.Node,
    p$0: Ohm.Node,
    r$0: Ohm.Node,
    _7: Ohm.Node,
    b$0: Ohm.Node,
    _9: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const typ = typ$0.toAST();
    const tags = tags$0.toAST();
    const p = p$0.toAST();
    const r = r$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Action($meta(this), typ, t, tags, p, r, b);
  },

  actionType(x: Ohm.Node): any {
    return x.toAST();
  },

  actionType_alt1(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return t;
  },

  actionType_alt2(this: Ohm.Node): any {
    return new TypeApp.Any($meta(this));
  },

  actionTitle(x: Ohm.Node): any {
    return x.toAST();
  },

  actionTitle_alt1(this: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new Expression.Interpolate($meta(this), t);
  },

  actionTags(x: Ohm.Node): any {
    return x.toAST();
  },

  actionTags_alt1(this: Ohm.Node, _1: Ohm.Node, es$0: Ohm.Node): any {
    const es = es$0.toAST();
    return es;
  },

  actionTags_alt2(this: Ohm.Node): any {
    return [];
  },

  actionPredicate(x: Ohm.Node): any {
    return x.toAST();
  },

  actionPredicate_alt1(this: Ohm.Node, _1: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return p;
  },

  actionPredicate_alt2(this: Ohm.Node): any {
    return new Predicate.Always($meta(this));
  },

  actionRank(x: Ohm.Node): any {
    return x.toAST();
  },

  actionRank_alt1(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Rank.Expr(e);
  },

  actionRank_alt2(this: Ohm.Node): any {
    return new Rank.Unranked($meta(this));
  },

  whenDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  whenDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    _3: Ohm.Node,
    b$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const b = b$0.toAST();
    return new Declaration.When($meta(this), p, b);
  },

  contextDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  contextDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    xs$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const xs = xs$0.toAST();
    return new Declaration.Context($meta(this), n, xs);
  },

  contextItem(x: Ohm.Node): any {
    return x.toAST();
  },

  contextItem_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  contextItem_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicate(x: Ohm.Node): any {
    return x.toAST();
  },

  predicate_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateBinary(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateBinary_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateBinary_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateBinary_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateAnd(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateAnd_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Predicate.And($meta(this), l, r);
  },

  predicateAnd1(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateAnd1_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Predicate.And($meta(this), l, r);
  },

  predicateAnd1_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateOr(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateOr_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Predicate.Or($meta(this), l, r);
  },

  predicateOr1(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateOr1_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Predicate.Or($meta(this), l, r);
  },

  predicateOr1_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateNot(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateNot_alt1(this: Ohm.Node, _1: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return new Predicate.Not($meta(this), p);
  },

  predicateNot_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateConstrain(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateConstrain_alt1(
    this: Ohm.Node,
    p$0: Ohm.Node,
    _2: Ohm.Node,
    c$0: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const c = c$0.toAST();
    return new Predicate.Constrain($meta(this), p, c);
  },

  predicateConstrain_alt2(this: Ohm.Node, _1: Ohm.Node, c$0: Ohm.Node): any {
    const c = c$0.toAST();
    return new Predicate.Constrain(
      $meta(this),
      new Predicate.Always($meta(this)),
      c
    );
  },

  predicateConstrain_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateConstrain_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateConstrain_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateConstrain_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateType(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateType_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const t = t$0.toAST();
    return new Predicate.Typed($meta(this), n, t);
  },

  predicateLet(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateLet_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    e$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    return new Predicate.Let($meta(this), n, e);
  },

  predicateSample(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateSample_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    p$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const p = p$0.toAST();
    return new Predicate.Sample($meta(this), n, p);
  },

  samplingPool(x: Ohm.Node): any {
    return x.toAST();
  },

  samplingPool_alt1(this: Ohm.Node, r$0: Ohm.Node): any {
    const r = r$0.toAST();
    return new SamplingPool.Relation($meta(this), r);
  },

  samplingPool_alt2(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const t = t$0.toAST();
    return new SamplingPool.Type($meta(this), l, t);
  },

  predicatePrimary(x: Ohm.Node): any {
    return x.toAST();
  },

  predicatePrimary_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return new Predicate.Always($meta(this));
  },

  predicatePrimary_alt2(this: Ohm.Node, r$0: Ohm.Node): any {
    const r = r$0.toAST();
    return new Predicate.Has($meta(this), r);
  },

  predicatePrimary_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const p = p$0.toAST();
    return new Predicate.Parens($meta(this), p);
  },

  pattern(x: Ohm.Node): any {
    return x.toAST();
  },

  pattern_alt1(this: Ohm.Node, _1: Ohm.Node, c$0: Ohm.Node, _3: Ohm.Node): any {
    const c = c$0.toAST();
    return c;
  },

  pattern_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Pattern.Global($meta(this), n);
  },

  pattern_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return new Pattern.Self($meta(this));
  },

  pattern_alt4(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Pattern.Lit(l);
  },

  pattern_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  patternComplex(x: Ohm.Node): any {
    return x.toAST();
  },

  patternComplex_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const t = t$0.toAST();
    return new Pattern.HasType($meta(this), t, n);
  },

  patternName(x: Ohm.Node): any {
    return x.toAST();
  },

  patternName_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return new Pattern.Wildcard($meta(this));
  },

  patternName_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Pattern.Variable($meta(this), n);
  },

  statement(x: Ohm.Node): any {
    return x.toAST();
  },

  statement_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  statement_alt8(this: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Statement.Expr(e);
  },

  letStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  letStatement_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    e$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    return new Statement.Let($meta(this), n, e);
  },

  factStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  factStatement_alt1(this: Ohm.Node, _1: Ohm.Node, s$0: Ohm.Node): any {
    const s = s$0.toAST();
    return new Statement.Fact($meta(this), s);
  },

  forgetStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  forgetStatement_alt1(this: Ohm.Node, _1: Ohm.Node, s$0: Ohm.Node): any {
    const s = s$0.toAST();
    return new Statement.Forget($meta(this), s);
  },

  gotoStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  gotoStatement_alt1(this: Ohm.Node, _1: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Statement.Goto($meta(this), n);
  },

  callStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  callStatement_alt1(this: Ohm.Node, _1: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Statement.Call($meta(this), n);
  },

  simulateStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  simulateStatement_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    _2: Ohm.Node,
    e$0: Ohm.Node,
    c$0: Ohm.Node,
    _5: Ohm.Node,
    g$0: Ohm.Node,
    s$0: Ohm.Node
  ): any {
    const e = e$0.toAST();
    const c = c$0.toAST();
    const g = g$0.toAST();
    const s = s$0.toAST();
    return new Statement.Simulate($meta(this), e, c, g, s);
  },

  simulateContext(x: Ohm.Node): any {
    return x.toAST();
  },

  simulateContext_alt1(this: Ohm.Node, _1: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new SimulationContext.Named($meta(this), n);
  },

  simulateContext_alt2(this: Ohm.Node): any {
    return new SimulationContext.Global();
  },

  simulateGoal(x: Ohm.Node): any {
    return x.toAST();
  },

  simulateGoal_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return new SimulationGoal.ActionQuiescence($meta(this));
  },

  simulateGoal_alt2(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return new SimulationGoal.EventQuiescence($meta(this));
  },

  simulateGoal_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return new SimulationGoal.TotalQuiescence($meta(this));
  },

  simulateGoal_alt4(this: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return new SimulationGoal.CustomGoal($meta(this), p);
  },

  signal(x: Ohm.Node): any {
    return x.toAST();
  },

  signal_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    _3: Ohm.Node,
    b$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new Signal($meta(this), s, b);
  },

  assertStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  assertStatement_alt1(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Statement.Assert($meta(this), e);
  },

  expression(x: Ohm.Node): any {
    return x.toAST();
  },

  expression_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  expression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  expression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  expression_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  searchExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  searchExpression_alt1(this: Ohm.Node, _1: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return new Expression.Search($meta(this), p);
  },

  lazyExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  lazyExpression_alt1(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Expression.Lazy($meta(this), e);
  },

  forceExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  forceExpression_alt1(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Expression.Force($meta(this), e);
  },

  expressionBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  expressionBlock_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    b$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const b = b$0.toAST();
    return new Expression.Block($meta(this), b);
  },

  pipeExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  pipeExpression_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Expression.Pipe($meta(this), l, r);
  },

  pipeExpression_alt2(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Expression.PipeInvoke($meta(this), l, r);
  },

  pipeExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  invokeInfixExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  invokeInfixExpression_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Expression.IntrinsicEqual($meta(this), l, r);
  },

  invokeInfixExpression_alt2(
    this: Ohm.Node,
    l$0: Ohm.Node,
    op$0: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const op = op$0.toAST();
    const r = r$0.toAST();
    return new Expression.Invoke(
      $meta(this),
      new Signature.Binary($meta(this), op, l, r)
    );
  },

  invokeInfixExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  invokeMixfix(x: Ohm.Node): any {
    return x.toAST();
  },

  invokeMixfix_alt1(this: Ohm.Node, s$0: Ohm.Node, ps$0: Ohm.Node): any {
    const s = s$0.toAST();
    const ps = ps$0.toAST();
    return new Expression.Invoke(
      $meta(this),
      new Signature.Keyword($meta(this), s, ps)
    );
  },

  invokeMixfix_alt2(this: Ohm.Node, ps$0: Ohm.Node): any {
    const ps = ps$0.toAST();
    return new Expression.Invoke(
      $meta(this),
      new Signature.KeywordSelfless($meta(this), ps)
    );
  },

  invokeMixfix_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  castExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  castExpression_alt1(
    this: Ohm.Node,
    s$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const t = t$0.toAST();
    return new Expression.Cast($meta(this), t, s);
  },

  castExpression_alt2(
    this: Ohm.Node,
    s$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const t = t$0.toAST();
    return new Expression.HasType($meta(this), s, t);
  },

  castExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  invokePrePost(x: Ohm.Node): any {
    return x.toAST();
  },

  invokePrePost_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  invokePrePost_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  invokePrefix(x: Ohm.Node): any {
    return x.toAST();
  },

  invokePrefix_alt1(this: Ohm.Node, n$0: Ohm.Node, p$0: Ohm.Node): any {
    const n = n$0.toAST();
    const p = p$0.toAST();
    return new Expression.Invoke(
      $meta(this),
      new Signature.Unary($meta(this), p, n)
    );
  },

  invokePostfix(x: Ohm.Node): any {
    return x.toAST();
  },

  invokePostfix_alt1(this: Ohm.Node, s$0: Ohm.Node, n$0: Ohm.Node): any {
    const s = s$0.toAST();
    const n = n$0.toAST();
    return new Expression.Invoke(
      $meta(this),
      new Signature.Unary($meta(this), s, n)
    );
  },

  invokePostfix_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  applyExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  applyExpression_alt1(
    this: Ohm.Node,
    f$0: Ohm.Node,
    _2: Ohm.Node,
    xs$0: Ohm.Node,
    _4: Ohm.Node
  ): any {
    const f = f$0.toAST();
    const xs = xs$0.toAST();
    return new Expression.Apply($meta(this), f, xs);
  },

  applyExpression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  memberExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  memberExpression_alt1(
    this: Ohm.Node,
    o$0: Ohm.Node,
    _2: Ohm.Node,
    f$0: Ohm.Node
  ): any {
    const o = o$0.toAST();
    const f = f$0.toAST();
    return new Expression.Project($meta(this), o, f);
  },

  memberExpression_alt2(
    this: Ohm.Node,
    o$0: Ohm.Node,
    _2: Ohm.Node,
    p$0: Ohm.Node
  ): any {
    const o = o$0.toAST();
    const p = p$0.toAST();
    return new Expression.Select($meta(this), o, p);
  },

  memberExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  memberSelection(x: Ohm.Node): any {
    return x.toAST();
  },

  memberSelection_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return xs;
  },

  fieldSelection(x: Ohm.Node): any {
    return x.toAST();
  },

  fieldSelection_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    a$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const a = a$0.toAST();
    return new Projection($meta(this), n, a);
  },

  fieldSelection_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Projection($meta(this), n, n);
  },

  primaryExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  primaryExpression_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt5(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Expression.Interpolate($meta(this), x);
  },

  primaryExpression_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt9(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt10(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt11(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt12(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new Expression.Type($meta(this), t);
  },

  primaryExpression_alt13(this: Ohm.Node, _1: Ohm.Node): any {
    return new Expression.Return($meta(this));
  },

  primaryExpression_alt14(this: Ohm.Node, _1: Ohm.Node): any {
    return new Expression.Self($meta(this));
  },

  primaryExpression_alt15(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Global($meta(this), n);
  },

  primaryExpression_alt16(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Variable($meta(this), n);
  },

  primaryExpression_alt17(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const e = e$0.toAST();
    return new Expression.Parens($meta(this), e);
  },

  conditionExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  conditionExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    cs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const cs = cs$0.toAST();
    return new Expression.Condition($meta(this), cs);
  },

  conditionCase(x: Ohm.Node): any {
    return x.toAST();
  },

  conditionCase_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const e = e$0.toAST();
    const b = b$0.toAST();
    return new ConditionCase($meta(this), e, b);
  },

  conditionCase_alt2(this: Ohm.Node, _1: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return new ConditionCase(
      $meta(this),
      new Expression.Lit(new Literal.True($meta(this))),
      b
    );
  },

  matchSearchExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  matchSearchExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    c$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const c = c$0.toAST();
    return new Expression.MatchSearch($meta(this), c);
  },

  matchSearchCase(x: Ohm.Node): any {
    return x.toAST();
  },

  matchSearchCase_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const b = b$0.toAST();
    return new MatchSearchCase($meta(this), p, b);
  },

  matchSearchCase_alt2(this: Ohm.Node, _1: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return new MatchSearchCase(
      $meta(this),
      new Predicate.Always($meta(this)),
      b
    );
  },

  forExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  forExpression_alt1(this: Ohm.Node, _1: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return new Expression.For($meta(this), b);
  },

  forExprMap(x: Ohm.Node): any {
    return x.toAST();
  },

  forExprMap_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    e$0: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    const r = r$0.toAST();
    return new ForExpression.Map($meta(this), n, e, r);
  },

  forExprMap1(x: Ohm.Node): any {
    return x.toAST();
  },

  forExprMap1_alt1(this: Ohm.Node, _1: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return b;
  },

  forExprMap1_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const e = e$0.toAST();
    const b = b$0.toAST();
    return new ForExpression.If($meta(this), e, b);
  },

  forExprMap1_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  forExprDo(x: Ohm.Node): any {
    return x.toAST();
  },

  forExprDo_alt1(this: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return new ForExpression.Do($meta(this), b);
  },

  newExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  newExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    fs$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const fs = fs$0.toAST();
    return new Expression.New($meta(this), n, fs);
  },

  newFields(x: Ohm.Node): any {
    return x.toAST();
  },

  newFields_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    fs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const fs = fs$0.toAST();
    return fs;
  },

  newFields_alt2(this: Ohm.Node): any {
    return [];
  },

  listExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  listExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return new Expression.List($meta(this), xs);
  },

  recordExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  recordExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    _2: Ohm.Node,
    _3: Ohm.Node
  ): any {
    return new Expression.Record($meta(this), []);
  },

  recordExpression_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return new Expression.Record($meta(this), xs);
  },

  recordPair(x: Ohm.Node): any {
    return x.toAST();
  },

  recordPair_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    v$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const v = v$0.toAST();
    return new Pair($meta(this), n, v);
  },

  recordField(x: Ohm.Node): any {
    return x.toAST();
  },

  recordField_alt1(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new RecordField.FName(n);
  },

  recordField_alt2(this: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new RecordField.FText(t);
  },

  literalExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  literalExpression_alt1(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Expression.Lit(l);
  },

  lambdaExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  lambdaExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const e = e$0.toAST();
    return new Expression.Lambda($meta(this), [], e);
  },

  lambdaExpression_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    _3: Ohm.Node,
    e$0: Ohm.Node,
    _5: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const e = e$0.toAST();
    return new Expression.Lambda($meta(this), p, e);
  },

  atomicExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  atomicExpression_alt1(this: Ohm.Node, a$0: Ohm.Node): any {
    const a = a$0.toAST();
    return new Expression.Global($meta(this), a);
  },

  atomicExpression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  atomicExpression_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  atomicExpression_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  atomicExpression_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  interpolateText(x: Ohm.Node): any {
    return x.toAST();
  },

  interpolateText_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return new Interpolation($meta(this), xs);
  },

  interpolatePart(x: Ohm.Node): any {
    return x.toAST();
  },

  interpolatePart_alt1(this: Ohm.Node, _1: Ohm.Node, c$0: Ohm.Node): any {
    const c = c$0.toAST();
    return new InterpolationPart.Escape($meta(this), c);
  },

  interpolatePart_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    x$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const x = x$0.toAST();
    return new InterpolationPart.Dynamic($meta(this), x);
  },

  interpolatePart_alt3(this: Ohm.Node, c$0: Ohm.Node): any {
    const c = c$0.toAST();
    return new InterpolationPart.Static($meta(this), c);
  },

  literal(x: Ohm.Node): any {
    return x.toAST();
  },

  literal_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  literal_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  literal_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  literal_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  literal_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  nothing(x: Ohm.Node): any {
    return x.toAST();
  },

  nothing_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return new Literal.Nothing($meta(this));
  },

  boolean(x: Ohm.Node): any {
    return x.toAST();
  },

  boolean_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return new Literal.True($meta(this));
  },

  boolean_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return new Literal.False($meta(this));
  },

  text(x: Ohm.Node): any {
    return x.toAST();
  },

  text_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Literal.Text($meta(this), x);
  },

  integer(x: Ohm.Node): any {
    return x.toAST();
  },

  integer_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Literal.Integer($meta(this), x);
  },

  float(x: Ohm.Node): any {
    return x.toAST();
  },

  float_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Literal.Float($meta(this), x);
  },

  string(x: Ohm.Node): any {
    return x.toAST();
  },

  string_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new String($meta(this), x);
  },

  hole(x: Ohm.Node): any {
    return x.toAST();
  },

  hole_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Expression.Hole($meta(this));
  },

  atom(x: Ohm.Node): any {
    return x.toAST();
  },

  atom_alt1(this: Ohm.Node, _1: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  atom_alt2(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  name(x: Ohm.Node): any {
    return x.toAST();
  },

  name_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  keyword(x: Ohm.Node): any {
    return x.toAST();
  },

  keyword_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  infix_symbol(x: Ohm.Node): any {
    return x.toAST();
  },

  infix_symbol_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  not(x: Ohm.Node): any {
    return x.toAST();
  },

  not_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  and(x: Ohm.Node): any {
    return x.toAST();
  },

  and_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  or(x: Ohm.Node): any {
    return x.toAST();
  },

  or_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Name($meta(this), x);
  },

  namespace(x: Ohm.Node): any {
    return x.toAST();
  },

  namespace_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return new Namespace($meta(this), x);
  },

  logicSignature(x: Ohm.Node): any {
    return x.toAST();
  },

  logicSignature_alt1(this: Ohm.Node, s$0: Ohm.Node, kws$0: Ohm.Node): any {
    const s = s$0.toAST();
    const kws = kws$0.toAST();
    return new Signature.Keyword($meta(this), s, kws);
  },

  logicSignature_alt2(this: Ohm.Node, s$0: Ohm.Node, n$0: Ohm.Node): any {
    const s = s$0.toAST();
    const n = n$0.toAST();
    return new Signature.Unary($meta(this), s, n);
  },

  logicSignature_alt3(this: Ohm.Node, kws$0: Ohm.Node): any {
    const kws = kws$0.toAST();
    return new Signature.KeywordSelfless($meta(this), kws);
  },

  signaturePair(x: Ohm.Node): any {
    return x.toAST();
  },

  signaturePair_alt1(this: Ohm.Node, kw$0: Ohm.Node, v$0: Ohm.Node): any {
    const kw = kw$0.toAST();
    const v = v$0.toAST();
    return new Pair($meta(this), kw, v);
  },

  partialLogicSignature(x: Ohm.Node): any {
    return x.toAST();
  },

  partialLogicSignature_alt1(this: Ohm.Node, kws$0: Ohm.Node): any {
    const kws = kws$0.toAST();
    return new PartialSignature.Keyword($meta(this), kws);
  },

  partialLogicSignature_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new PartialSignature.Unary($meta(this), n);
  },

  partialSignature(x: Ohm.Node): any {
    return x.toAST();
  },

  partialSignature_alt1(this: Ohm.Node, kws$0: Ohm.Node): any {
    const kws = kws$0.toAST();
    return new PartialSignature.Keyword($meta(this), kws);
  },

  partialSignature_alt2(this: Ohm.Node, op$0: Ohm.Node, r$0: Ohm.Node): any {
    const op = op$0.toAST();
    const r = r$0.toAST();
    return new PartialSignature.Binary($meta(this), op, r);
  },

  partialSignature_alt3(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new PartialSignature.Unary($meta(this), n);
  },

  partialSignature_alt4(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new PartialSignature.Unary($meta(this), n);
  },

  signature(x: Ohm.Node): any {
    return x.toAST();
  },

  signature_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    op$0: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const op = op$0.toAST();
    const r = r$0.toAST();
    return new Signature.Binary($meta(this), op, l, r);
  },

  signature_alt2(this: Ohm.Node, s$0: Ohm.Node, kws$0: Ohm.Node): any {
    const s = s$0.toAST();
    const kws = kws$0.toAST();
    return new Signature.Keyword($meta(this), s, kws);
  },

  signature_alt3(this: Ohm.Node, s$0: Ohm.Node, n$0: Ohm.Node): any {
    const s = s$0.toAST();
    const n = n$0.toAST();
    return new Signature.Unary($meta(this), s, n);
  },

  signature_alt4(this: Ohm.Node, n$0: Ohm.Node, s$0: Ohm.Node): any {
    const n = n$0.toAST();
    const s = s$0.toAST();
    return new Signature.Unary($meta(this), s, n);
  },

  signature_alt5(this: Ohm.Node, kws$0: Ohm.Node): any {
    const kws = kws$0.toAST();
    return new Signature.KeywordSelfless($meta(this), kws);
  },

  statementBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  statementBlock_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const xs = xs$0.toAST();
    return xs;
  },

  list0(x: Ohm.Node): any {
    return x.toAST();
  },

  list0_alt1(this: Ohm.Node, xs$0: Ohm.Node, _2: Ohm.Node): any {
    const xs = xs$0.toAST();
    return xs;
  },

  list1(x: Ohm.Node): any {
    return x.toAST();
  },

  list1_alt1(this: Ohm.Node, xs$0: Ohm.Node, _2: Ohm.Node): any {
    const xs = xs$0.toAST();
    return xs;
  },

  block(x: Ohm.Node): any {
    return x.toAST();
  },

  block_alt1(this: Ohm.Node, _1: Ohm.Node, xs$0: Ohm.Node, _3: Ohm.Node): any {
    const xs = xs$0.toAST();
    return xs;
  },

  statements(x: Ohm.Node): any {
    return x.toAST();
  },

  statements_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  eblock(x: Ohm.Node): any {
    return x.toAST();
  },

  eblock_alt1(this: Ohm.Node, _1: Ohm.Node, b$0: Ohm.Node, _3: Ohm.Node): any {
    const b = b$0.toAST();
    return b;
  },

  eblock_alt2(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node, _3: Ohm.Node): any {
    const e = e$0.toAST();
    return [new Statement.Expr(e)];
  },

  s(x: Ohm.Node): any {
    return x.toAST();
  },

  s_alt1(this: Ohm.Node, _1: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return x;
  },

  header(x: Ohm.Node): any {
    return x.toAST();
  },

  header_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    _2: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node,
    _5: Ohm.Node
  ): any {
    return this.sourceString;
  },

  hs(x: Ohm.Node): any {
    return x.toAST();
  },

  hs_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  hs_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  nl(x: Ohm.Node): any {
    return x.toAST();
  },

  nl_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  nl_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  line(x: Ohm.Node): any {
    return x.toAST();
  },

  line_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  comment(x: Ohm.Node): any {
    return x.toAST();
  },

  comment_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  space(x: Ohm.Node): any {
    return x.toAST();
  },

  space_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  semi(x: Ohm.Node): any {
    return x.toAST();
  },

  semi_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  atom_start(x: Ohm.Node): any {
    return x.toAST();
  },

  atom_start_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  atom_rest(x: Ohm.Node): any {
    return x.toAST();
  },

  atom_rest_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  atom_rest_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  atom_rest_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_atom(x: Ohm.Node): any {
    return x.toAST();
  },

  t_atom_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  t_keyword(x: Ohm.Node): any {
    return x.toAST();
  },

  t_keyword_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  name_start(x: Ohm.Node): any {
    return x.toAST();
  },

  name_start_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  name_start_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  name_rest(x: Ohm.Node): any {
    return x.toAST();
  },

  name_rest_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  name_rest_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  name_rest_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_name(x: Ohm.Node): any {
    return x.toAST();
  },

  t_name_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol(x: Ohm.Node): any {
    return x.toAST();
  },

  t_infix_symbol_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix(x: Ohm.Node): any {
    return x.toAST();
  },

  t_any_infix_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt9(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt10(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt11(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt12(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt13(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_any_infix_alt14(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character(x: Ohm.Node): any {
    return x.toAST();
  },

  infix_character_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  infix_character_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  dec_digit(x: Ohm.Node): any {
    return x.toAST();
  },

  dec_digit_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  dec_digit_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_integer(x: Ohm.Node): any {
    return x.toAST();
  },

  t_integer_alt1(this: Ohm.Node, _2: Ohm.Node, _3: Ohm.Node): any {
    return this.sourceString;
  },

  t_float(x: Ohm.Node): any {
    return x.toAST();
  },

  t_float_alt1(
    this: Ohm.Node,
    _2: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node,
    _5: Ohm.Node
  ): any {
    return this.sourceString;
  },

  text_character(x: Ohm.Node): any {
    return x.toAST();
  },

  text_character_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  text_character_alt2(this: Ohm.Node, _2: Ohm.Node): any {
    return this.sourceString;
  },

  t_text(x: Ohm.Node): any {
    return x.toAST();
  },

  t_text_alt1(this: Ohm.Node, _1: Ohm.Node, _2: Ohm.Node, _3: Ohm.Node): any {
    return this.sourceString;
  },

  kw(x: Ohm.Node): any {
    return x.toAST();
  },

  kw_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return x;
  },

  relation_(x: Ohm.Node): any {
    return x.toAST();
  },

  relation__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicate_(x: Ohm.Node): any {
    return x.toAST();
  },

  predicate__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  when_(x: Ohm.Node): any {
    return x.toAST();
  },

  when__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  do_(x: Ohm.Node): any {
    return x.toAST();
  },

  do__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  command_(x: Ohm.Node): any {
    return x.toAST();
  },

  command__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  type_(x: Ohm.Node): any {
    return x.toAST();
  },

  type__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  enum_(x: Ohm.Node): any {
    return x.toAST();
  },

  enum__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  define_(x: Ohm.Node): any {
    return x.toAST();
  },

  define__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  singleton_(x: Ohm.Node): any {
    return x.toAST();
  },

  singleton__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  scene_(x: Ohm.Node): any {
    return x.toAST();
  },

  scene__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  action_(x: Ohm.Node): any {
    return x.toAST();
  },

  action__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  let_(x: Ohm.Node): any {
    return x.toAST();
  },

  let__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  return_(x: Ohm.Node): any {
    return x.toAST();
  },

  return__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  fact_(x: Ohm.Node): any {
    return x.toAST();
  },

  fact__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  forget_(x: Ohm.Node): any {
    return x.toAST();
  },

  forget__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  new_(x: Ohm.Node): any {
    return x.toAST();
  },

  new__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  search_(x: Ohm.Node): any {
    return x.toAST();
  },

  search__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  if_(x: Ohm.Node): any {
    return x.toAST();
  },

  if__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  then_(x: Ohm.Node): any {
    return x.toAST();
  },

  then__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  else_(x: Ohm.Node): any {
    return x.toAST();
  },

  else__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  goto_(x: Ohm.Node): any {
    return x.toAST();
  },

  goto__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  call_(x: Ohm.Node): any {
    return x.toAST();
  },

  call__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  simulate_(x: Ohm.Node): any {
    return x.toAST();
  },

  simulate__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  match_(x: Ohm.Node): any {
    return x.toAST();
  },

  match__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  true_(x: Ohm.Node): any {
    return x.toAST();
  },

  true__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  false_(x: Ohm.Node): any {
    return x.toAST();
  },

  false__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  not_(x: Ohm.Node): any {
    return x.toAST();
  },

  not__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  and_(x: Ohm.Node): any {
    return x.toAST();
  },

  and__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  or_(x: Ohm.Node): any {
    return x.toAST();
  },

  or__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  is_(x: Ohm.Node): any {
    return x.toAST();
  },

  is__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  self_(x: Ohm.Node): any {
    return x.toAST();
  },

  self__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  as_(x: Ohm.Node): any {
    return x.toAST();
  },

  as__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  event_(x: Ohm.Node): any {
    return x.toAST();
  },

  event__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  quiescence_(x: Ohm.Node): any {
    return x.toAST();
  },

  quiescence__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  for_(x: Ohm.Node): any {
    return x.toAST();
  },

  for__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  until_(x: Ohm.Node): any {
    return x.toAST();
  },

  until__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  in_(x: Ohm.Node): any {
    return x.toAST();
  },

  in__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  foreign_(x: Ohm.Node): any {
    return x.toAST();
  },

  foreign__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  on_(x: Ohm.Node): any {
    return x.toAST();
  },

  on__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  always_(x: Ohm.Node): any {
    return x.toAST();
  },

  always__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  condition_(x: Ohm.Node): any {
    return x.toAST();
  },

  condition__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  end_(x: Ohm.Node): any {
    return x.toAST();
  },

  end__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  prelude_(x: Ohm.Node): any {
    return x.toAST();
  },

  prelude__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  with_(x: Ohm.Node): any {
    return x.toAST();
  },

  with__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  tags_(x: Ohm.Node): any {
    return x.toAST();
  },

  tags__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  rank_(x: Ohm.Node): any {
    return x.toAST();
  },

  rank__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  abstract_(x: Ohm.Node): any {
    return x.toAST();
  },

  abstract__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  lazy_(x: Ohm.Node): any {
    return x.toAST();
  },

  lazy__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  force_(x: Ohm.Node): any {
    return x.toAST();
  },

  force__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  context_(x: Ohm.Node): any {
    return x.toAST();
  },

  context__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  sample_(x: Ohm.Node): any {
    return x.toAST();
  },

  sample__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  of_(x: Ohm.Node): any {
    return x.toAST();
  },

  of__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  open_(x: Ohm.Node): any {
    return x.toAST();
  },

  open__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  local_(x: Ohm.Node): any {
    return x.toAST();
  },

  local__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  test_(x: Ohm.Node): any {
    return x.toAST();
  },

  test__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  assert_(x: Ohm.Node): any {
    return x.toAST();
  },

  assert__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  requires_(x: Ohm.Node): any {
    return x.toAST();
  },

  requires__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  ensures_(x: Ohm.Node): any {
    return x.toAST();
  },

  ensures__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  nothing_(x: Ohm.Node): any {
    return x.toAST();
  },

  nothing__alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved(x: Ohm.Node): any {
    return x.toAST();
  },

  reserved_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt9(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt10(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt11(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt12(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt13(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt14(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt15(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt16(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt17(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt18(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt19(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt20(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt21(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt22(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt23(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt24(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt25(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt26(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt27(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt28(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt29(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt30(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt31(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt32(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt33(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt34(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt35(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt36(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt37(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt38(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt39(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt40(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt41(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt42(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt43(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt44(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt45(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt46(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt47(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt48(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt49(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt50(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt51(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt52(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt53(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt54(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt55(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt56(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt57(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt58(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  reserved_alt59(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },
};
semantics.addOperation("toAST()", toAstVisitor);

export function toAst(result: Ohm.MatchResult) {
  return semantics(result).toAST();
}

