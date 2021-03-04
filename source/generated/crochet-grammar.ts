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

  ForeignCommand(pos: Meta, signature: Signature<Parameter>, body: FFI): $T;

  Command(pos: Meta, signature: Signature<Parameter>, body: Statement[]): $T;

  Define(pos: Meta, name: Name, value: Expression): $T;

  Role(pos: Meta, name: Name): $T;

  SingletonType(pos: Meta, typ: TypeDef, init: TypeInit[]): $T;

  Type(pos: Meta, typ: TypeDef): $T;

  Enum(pos: Meta, name: Name, values: Variant[]): $T;

  Scene(pos: Meta, name: Name, body: Statement[]): $T;

  Action(pos: Meta, title: String, pred: Predicate, body: Statement[]): $T;

  When(pos: Meta, pred: Predicate, body: Statement[]): $T;
};

export abstract class Declaration extends Node {
  abstract tag:
    | "Relation"
    | "DefinePredicate"
    | "Do"
    | "ForeignCommand"
    | "Command"
    | "Define"
    | "Role"
    | "SingletonType"
    | "Type"
    | "Enum"
    | "Scene"
    | "Action"
    | "When";
  abstract match<$T>(p: $p_Declaration<$T>): $T;

  static get Relation() {
    return $Declaration.Relation;
  }

  static get DefinePredicate() {
    return $Declaration.DefinePredicate;
  }

  static get Do() {
    return $Declaration.Do;
  }

  static get ForeignCommand() {
    return $Declaration.ForeignCommand;
  }

  static get Command() {
    return $Declaration.Command;
  }

  static get Define() {
    return $Declaration.Define;
  }

  static get Role() {
    return $Declaration.Role;
  }

  static get SingletonType() {
    return $Declaration.SingletonType;
  }

  static get Type() {
    return $Declaration.Type;
  }

  static get Enum() {
    return $Declaration.Enum;
  }

  static get Scene() {
    return $Declaration.Scene;
  }

  static get Action() {
    return $Declaration.Action;
  }

  static get When() {
    return $Declaration.When;
  }

  static has_instance(x: any) {
    return x instanceof Declaration;
  }
}

const $Declaration = (function () {
  class Relation extends Declaration {
    readonly tag!: "Relation";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<RelationPart>
    ) {
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
      return x instanceof Relation;
    }
  }

  class DefinePredicate extends Declaration {
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
      return x instanceof DefinePredicate;
    }
  }

  class Do extends Declaration {
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
      return x instanceof Do;
    }
  }

  class ForeignCommand extends Declaration {
    readonly tag!: "ForeignCommand";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Parameter>,
      readonly body: FFI
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "ForeignCommand" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Parameter>>(
        signature,
        "Signature<Parameter>",
        Signature
      );
      $assert_type<FFI>(body, "FFI", FFI);
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.ForeignCommand(this.pos, this.signature, this.body);
    }

    static has_instance(x: any) {
      return x instanceof ForeignCommand;
    }
  }

  class Command extends Declaration {
    readonly tag!: "Command";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Parameter>,
      readonly body: Statement[]
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Command" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Parameter>>(
        signature,
        "Signature<Parameter>",
        Signature
      );
      $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Command(this.pos, this.signature, this.body);
    }

    static has_instance(x: any) {
      return x instanceof Command;
    }
  }

  class Define extends Declaration {
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
      return x instanceof Define;
    }
  }

  class Role extends Declaration {
    readonly tag!: "Role";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
      Object.defineProperty(this, "tag", { value: "Role" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(name, "Name", Name);
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Role(this.pos, this.name);
    }

    static has_instance(x: any) {
      return x instanceof Role;
    }
  }

  class SingletonType extends Declaration {
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
      return x instanceof SingletonType;
    }
  }

  class Type extends Declaration {
    readonly tag!: "Type";

    constructor(readonly pos: Meta, readonly typ: TypeDef) {
      super();
      Object.defineProperty(this, "tag", { value: "Type" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<TypeDef>(typ, "TypeDef", TypeDef);
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Type(this.pos, this.typ);
    }

    static has_instance(x: any) {
      return x instanceof Type;
    }
  }

  class Enum extends Declaration {
    readonly tag!: "Enum";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly values: Variant[]
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Enum" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(name, "Name", Name);
      $assert_type<Variant[]>(values, "Variant[]", $is_array(Variant));
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Enum(this.pos, this.name, this.values);
    }

    static has_instance(x: any) {
      return x instanceof Enum;
    }
  }

  class Scene extends Declaration {
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
      return x instanceof Scene;
    }
  }

  class Action extends Declaration {
    readonly tag!: "Action";

    constructor(
      readonly pos: Meta,
      readonly title: String,
      readonly pred: Predicate,
      readonly body: Statement[]
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Action" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<String>(title, "String", String);
      $assert_type<Predicate>(pred, "Predicate", Predicate);
      $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Action(this.pos, this.title, this.pred, this.body);
    }

    static has_instance(x: any) {
      return x instanceof Action;
    }
  }

  class When extends Declaration {
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
      return x instanceof When;
    }
  }

  return {
    Relation,
    DefinePredicate,
    Do,
    ForeignCommand,
    Command,
    Define,
    Role,
    SingletonType,
    Type,
    Enum,
    Scene,
    Action,
    When,
  };
})();

export class TypeDef extends Node {
  readonly tag!: "TypeDef";

  constructor(readonly name: Name, readonly roles: Name[]) {
    super();
    Object.defineProperty(this, "tag", { value: "TypeDef" });
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name[]>(roles, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof TypeDef;
  }
}

export class Variant extends Node {
  readonly tag!: "Variant";

  constructor(readonly pos: Meta, readonly name: Name, readonly roles: Name[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Variant" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name[]>(roles, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof Variant;
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

type $p_TypeInit<$T> = {
  Fact(pos: Meta, sig: PartialSignature<Expression>): $T;

  Command(pos: Meta, sig: PartialSignature<Parameter>, body: Statement[]): $T;

  ForeignCommand(
    pos: Meta,
    signature: PartialSignature<Parameter>,
    body: FFI
  ): $T;
};

export abstract class TypeInit extends Node {
  abstract tag: "Fact" | "Command" | "ForeignCommand";
  abstract match<$T>(p: $p_TypeInit<$T>): $T;

  static get Fact() {
    return $TypeInit.Fact;
  }

  static get Command() {
    return $TypeInit.Command;
  }

  static get ForeignCommand() {
    return $TypeInit.ForeignCommand;
  }

  static has_instance(x: any) {
    return x instanceof TypeInit;
  }
}

const $TypeInit = (function () {
  class Fact extends TypeInit {
    readonly tag!: "Fact";

    constructor(
      readonly pos: Meta,
      readonly sig: PartialSignature<Expression>
    ) {
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
      return x instanceof Fact;
    }
  }

  class Command extends TypeInit {
    readonly tag!: "Command";

    constructor(
      readonly pos: Meta,
      readonly sig: PartialSignature<Parameter>,
      readonly body: Statement[]
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Command" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<PartialSignature<Parameter>>(
        sig,
        "PartialSignature<Parameter>",
        PartialSignature
      );
      $assert_type<Statement[]>(body, "Statement[]", $is_array(Statement));
    }

    match<$T>(p: $p_TypeInit<$T>): $T {
      return p.Command(this.pos, this.sig, this.body);
    }

    static has_instance(x: any) {
      return x instanceof Command;
    }
  }

  class ForeignCommand extends TypeInit {
    readonly tag!: "ForeignCommand";

    constructor(
      readonly pos: Meta,
      readonly signature: PartialSignature<Parameter>,
      readonly body: FFI
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "ForeignCommand" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<PartialSignature<Parameter>>(
        signature,
        "PartialSignature<Parameter>",
        PartialSignature
      );
      $assert_type<FFI>(body, "FFI", FFI);
    }

    match<$T>(p: $p_TypeInit<$T>): $T {
      return p.ForeignCommand(this.pos, this.signature, this.body);
    }

    static has_instance(x: any) {
      return x instanceof ForeignCommand;
    }
  }

  return { Fact, Command, ForeignCommand };
})();

type $p_Parameter<$T> = {
  Untyped(pos: Meta, name: Name): $T;

  Typed(pos: Meta, name: Name, typ: TypeApp): $T;

  TypedOnly(pos: Meta, typ: TypeApp): $T;
};

export abstract class Parameter extends Node {
  abstract tag: "Untyped" | "Typed" | "TypedOnly";
  abstract match<$T>(p: $p_Parameter<$T>): $T;

  static get Untyped() {
    return $Parameter.Untyped;
  }

  static get Typed() {
    return $Parameter.Typed;
  }

  static get TypedOnly() {
    return $Parameter.TypedOnly;
  }

  static has_instance(x: any) {
    return x instanceof Parameter;
  }
}

const $Parameter = (function () {
  class Untyped extends Parameter {
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
      return x instanceof Untyped;
    }
  }

  class Typed extends Parameter {
    readonly tag!: "Typed";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly typ: TypeApp
    ) {
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
      return x instanceof Typed;
    }
  }

  class TypedOnly extends Parameter {
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
      return x instanceof TypedOnly;
    }
  }

  return { Untyped, Typed, TypedOnly };
})();

type $p_TypeApp<$T> = {
  Union(pos: Meta, left: TypeApp, right: TypeApp): $T;

  Named(pos: Meta, name: Name): $T;

  Parens(pos: Meta, typ: TypeApp): $T;
};

export abstract class TypeApp extends Node {
  abstract tag: "Union" | "Named" | "Parens";
  abstract match<$T>(p: $p_TypeApp<$T>): $T;

  static get Union() {
    return $TypeApp.Union;
  }

  static get Named() {
    return $TypeApp.Named;
  }

  static get Parens() {
    return $TypeApp.Parens;
  }

  static has_instance(x: any) {
    return x instanceof TypeApp;
  }
}

const $TypeApp = (function () {
  class Union extends TypeApp {
    readonly tag!: "Union";

    constructor(
      readonly pos: Meta,
      readonly left: TypeApp,
      readonly right: TypeApp
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Union" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<TypeApp>(left, "TypeApp", TypeApp);
      $assert_type<TypeApp>(right, "TypeApp", TypeApp);
    }

    match<$T>(p: $p_TypeApp<$T>): $T {
      return p.Union(this.pos, this.left, this.right);
    }

    static has_instance(x: any) {
      return x instanceof Union;
    }
  }

  class Named extends TypeApp {
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
      return x instanceof Named;
    }
  }

  class Parens extends TypeApp {
    readonly tag!: "Parens";

    constructor(readonly pos: Meta, readonly typ: TypeApp) {
      super();
      Object.defineProperty(this, "tag", { value: "Parens" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<TypeApp>(typ, "TypeApp", TypeApp);
    }

    match<$T>(p: $p_TypeApp<$T>): $T {
      return p.Parens(this.pos, this.typ);
    }

    static has_instance(x: any) {
      return x instanceof Parens;
    }
  }

  return { Union, Named, Parens };
})();

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
    return $PredicateEffect.Trivial;
  }

  static has_instance(x: any) {
    return x instanceof PredicateEffect;
  }
}

const $PredicateEffect = (function () {
  class Trivial extends PredicateEffect {
    readonly tag!: "Trivial";

    constructor() {
      super();
      Object.defineProperty(this, "tag", { value: "Trivial" });
    }

    match<$T>(p: $p_PredicateEffect<$T>): $T {
      return p.Trivial();
    }

    static has_instance(x: any) {
      return x instanceof Trivial;
    }
  }

  return { Trivial };
})();

type $p_Statement<$T> = {
  Fact(pos: Meta, signature: Signature<Expression>): $T;

  Forget(pos: Meta, signature: Signature<Expression>): $T;

  Goto(pos: Meta, name: Name): $T;

  Call(pos: Meta, name: Name): $T;

  Let(pos: Meta, name: Name, value: Expression): $T;

  SimulateGlobal(pos: Meta, actors: Expression, goal: SimulationGoal): $T;

  Expr(value: Expression): $T;
};

export abstract class Statement extends Node {
  abstract tag:
    | "Fact"
    | "Forget"
    | "Goto"
    | "Call"
    | "Let"
    | "SimulateGlobal"
    | "Expr";
  abstract match<$T>(p: $p_Statement<$T>): $T;

  static get Fact() {
    return $Statement.Fact;
  }

  static get Forget() {
    return $Statement.Forget;
  }

  static get Goto() {
    return $Statement.Goto;
  }

  static get Call() {
    return $Statement.Call;
  }

  static get Let() {
    return $Statement.Let;
  }

  static get SimulateGlobal() {
    return $Statement.SimulateGlobal;
  }

  static get Expr() {
    return $Statement.Expr;
  }

  static has_instance(x: any) {
    return x instanceof Statement;
  }
}

const $Statement = (function () {
  class Fact extends Statement {
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
      return x instanceof Fact;
    }
  }

  class Forget extends Statement {
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
      return x instanceof Forget;
    }
  }

  class Goto extends Statement {
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
      return x instanceof Goto;
    }
  }

  class Call extends Statement {
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
      return x instanceof Call;
    }
  }

  class Let extends Statement {
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
      return x instanceof Let;
    }
  }

  class SimulateGlobal extends Statement {
    readonly tag!: "SimulateGlobal";

    constructor(
      readonly pos: Meta,
      readonly actors: Expression,
      readonly goal: SimulationGoal
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "SimulateGlobal" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Expression>(actors, "Expression", Expression);
      $assert_type<SimulationGoal>(goal, "SimulationGoal", SimulationGoal);
    }

    match<$T>(p: $p_Statement<$T>): $T {
      return p.SimulateGlobal(this.pos, this.actors, this.goal);
    }

    static has_instance(x: any) {
      return x instanceof SimulateGlobal;
    }
  }

  class Expr extends Statement {
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
      return x instanceof Expr;
    }
  }

  return { Fact, Forget, Goto, Call, Let, SimulateGlobal, Expr };
})();

type $p_Expression<$T> = {
  New(pos: Meta, typ: Name): $T;

  NewVariant(pos: Meta, typ: Name, variant: Name): $T;

  Invoke(pos: Meta, signature: Signature<Expression>): $T;

  Global(pos: Meta, name: Name): $T;

  Variable(pos: Meta, name: Name): $T;

  Self(pos: Meta): $T;

  List(pos: Meta, values: Expression[]): $T;

  Record(pos: Meta, pairs: Pair<Name, Expression>[]): $T;

  Cast(pos: Meta, typ: TypeApp, value: Expression): $T;

  Search(pos: Meta, predicate: Predicate): $T;

  Project(pos: Meta, object: Expression, field: Name): $T;

  Select(pos: Meta, object: Expression, fields: Projection[]): $T;

  For(pos: Meta, stream: Expression, name: Name, body: Expression): $T;

  Block(pos: Meta, body: Statement[]): $T;

  Apply(pos: Meta, partial: Expression, values: Expression[]): $T;

  Interpolate(pos: Meta, parts: InterpolationPart[]): $T;

  Hole(pos: Meta): $T;

  Parens(pos: Meta, value: Expression): $T;

  Lit(value: Literal): $T;
};

export abstract class Expression extends Node {
  abstract tag:
    | "New"
    | "NewVariant"
    | "Invoke"
    | "Global"
    | "Variable"
    | "Self"
    | "List"
    | "Record"
    | "Cast"
    | "Search"
    | "Project"
    | "Select"
    | "For"
    | "Block"
    | "Apply"
    | "Interpolate"
    | "Hole"
    | "Parens"
    | "Lit";
  abstract match<$T>(p: $p_Expression<$T>): $T;

  static get New() {
    return $Expression.New;
  }

  static get NewVariant() {
    return $Expression.NewVariant;
  }

  static get Invoke() {
    return $Expression.Invoke;
  }

  static get Global() {
    return $Expression.Global;
  }

  static get Variable() {
    return $Expression.Variable;
  }

  static get Self() {
    return $Expression.Self;
  }

  static get List() {
    return $Expression.List;
  }

  static get Record() {
    return $Expression.Record;
  }

  static get Cast() {
    return $Expression.Cast;
  }

  static get Search() {
    return $Expression.Search;
  }

  static get Project() {
    return $Expression.Project;
  }

  static get Select() {
    return $Expression.Select;
  }

  static get For() {
    return $Expression.For;
  }

  static get Block() {
    return $Expression.Block;
  }

  static get Apply() {
    return $Expression.Apply;
  }

  static get Interpolate() {
    return $Expression.Interpolate;
  }

  static get Hole() {
    return $Expression.Hole;
  }

  static get Parens() {
    return $Expression.Parens;
  }

  static get Lit() {
    return $Expression.Lit;
  }

  static has_instance(x: any) {
    return x instanceof Expression;
  }
}

const $Expression = (function () {
  class New extends Expression {
    readonly tag!: "New";

    constructor(readonly pos: Meta, readonly typ: Name) {
      super();
      Object.defineProperty(this, "tag", { value: "New" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(typ, "Name", Name);
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.New(this.pos, this.typ);
    }

    static has_instance(x: any) {
      return x instanceof New;
    }
  }

  class NewVariant extends Expression {
    readonly tag!: "NewVariant";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly variant: Name
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "NewVariant" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(typ, "Name", Name);
      $assert_type<Name>(variant, "Name", Name);
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.NewVariant(this.pos, this.typ, this.variant);
    }

    static has_instance(x: any) {
      return x instanceof NewVariant;
    }
  }

  class Invoke extends Expression {
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
      return x instanceof Invoke;
    }
  }

  class Global extends Expression {
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
      return x instanceof Global;
    }
  }

  class Variable extends Expression {
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
      return x instanceof Variable;
    }
  }

  class Self extends Expression {
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
      return x instanceof Self;
    }
  }

  class List extends Expression {
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
      return x instanceof List;
    }
  }

  class Record extends Expression {
    readonly tag!: "Record";

    constructor(readonly pos: Meta, readonly pairs: Pair<Name, Expression>[]) {
      super();
      Object.defineProperty(this, "tag", { value: "Record" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Pair<Name, Expression>[]>(
        pairs,
        "Pair<Name, Expression>[]",
        $is_array(Pair)
      );
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.Record(this.pos, this.pairs);
    }

    static has_instance(x: any) {
      return x instanceof Record;
    }
  }

  class Cast extends Expression {
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
      return x instanceof Cast;
    }
  }

  class Search extends Expression {
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
      return x instanceof Search;
    }
  }

  class Project extends Expression {
    readonly tag!: "Project";

    constructor(
      readonly pos: Meta,
      readonly object: Expression,
      readonly field: Name
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Project" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Expression>(object, "Expression", Expression);
      $assert_type<Name>(field, "Name", Name);
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.Project(this.pos, this.object, this.field);
    }

    static has_instance(x: any) {
      return x instanceof Project;
    }
  }

  class Select extends Expression {
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
      return x instanceof Select;
    }
  }

  class For extends Expression {
    readonly tag!: "For";

    constructor(
      readonly pos: Meta,
      readonly stream: Expression,
      readonly name: Name,
      readonly body: Expression
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "For" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Expression>(stream, "Expression", Expression);
      $assert_type<Name>(name, "Name", Name);
      $assert_type<Expression>(body, "Expression", Expression);
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.For(this.pos, this.stream, this.name, this.body);
    }

    static has_instance(x: any) {
      return x instanceof For;
    }
  }

  class Block extends Expression {
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
      return x instanceof Block;
    }
  }

  class Apply extends Expression {
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
      return x instanceof Apply;
    }
  }

  class Interpolate extends Expression {
    readonly tag!: "Interpolate";

    constructor(readonly pos: Meta, readonly parts: InterpolationPart[]) {
      super();
      Object.defineProperty(this, "tag", { value: "Interpolate" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<InterpolationPart[]>(
        parts,
        "InterpolationPart[]",
        $is_array(InterpolationPart)
      );
    }

    match<$T>(p: $p_Expression<$T>): $T {
      return p.Interpolate(this.pos, this.parts);
    }

    static has_instance(x: any) {
      return x instanceof Interpolate;
    }
  }

  class Hole extends Expression {
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
      return x instanceof Hole;
    }
  }

  class Parens extends Expression {
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
      return x instanceof Parens;
    }
  }

  class Lit extends Expression {
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
      return x instanceof Lit;
    }
  }

  return {
    New,
    NewVariant,
    Invoke,
    Global,
    Variable,
    Self,
    List,
    Record,
    Cast,
    Search,
    Project,
    Select,
    For,
    Block,
    Apply,
    Interpolate,
    Hole,
    Parens,
    Lit,
  };
})();

export class Projection extends Node {
  readonly tag!: "Projection";

  constructor(readonly pos: Meta, readonly name: Name, readonly alias: Name) {
    super();
    Object.defineProperty(this, "tag", { value: "Projection" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name>(alias, "Name", Name);
  }

  static has_instance(x: any) {
    return x instanceof Projection;
  }
}

type $p_InterpolationPart<$T> = {
  Escape(pos: Meta, character: string): $T;

  Static(pos: Meta, text: string): $T;

  Dynamic(pos: Meta, value: Expression): $T;
};

export abstract class InterpolationPart extends Node {
  abstract tag: "Escape" | "Static" | "Dynamic";
  abstract match<$T>(p: $p_InterpolationPart<$T>): $T;

  static get Escape() {
    return $InterpolationPart.Escape;
  }

  static get Static() {
    return $InterpolationPart.Static;
  }

  static get Dynamic() {
    return $InterpolationPart.Dynamic;
  }

  static has_instance(x: any) {
    return x instanceof InterpolationPart;
  }
}

const $InterpolationPart = (function () {
  class Escape extends InterpolationPart {
    readonly tag!: "Escape";

    constructor(readonly pos: Meta, readonly character: string) {
      super();
      Object.defineProperty(this, "tag", { value: "Escape" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<string>(character, "string", $is_type("string"));
    }

    match<$T>(p: $p_InterpolationPart<$T>): $T {
      return p.Escape(this.pos, this.character);
    }

    static has_instance(x: any) {
      return x instanceof Escape;
    }
  }

  class Static extends InterpolationPart {
    readonly tag!: "Static";

    constructor(readonly pos: Meta, readonly text: string) {
      super();
      Object.defineProperty(this, "tag", { value: "Static" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<string>(text, "string", $is_type("string"));
    }

    match<$T>(p: $p_InterpolationPart<$T>): $T {
      return p.Static(this.pos, this.text);
    }

    static has_instance(x: any) {
      return x instanceof Static;
    }
  }

  class Dynamic extends InterpolationPart {
    readonly tag!: "Dynamic";

    constructor(readonly pos: Meta, readonly value: Expression) {
      super();
      Object.defineProperty(this, "tag", { value: "Dynamic" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Expression>(value, "Expression", Expression);
    }

    match<$T>(p: $p_InterpolationPart<$T>): $T {
      return p.Dynamic(this.pos, this.value);
    }

    static has_instance(x: any) {
      return x instanceof Dynamic;
    }
  }

  return { Escape, Static, Dynamic };
})();

type $p_Literal<$T> = {
  False(pos: Meta): $T;

  True(pos: Meta): $T;

  Text(pos: Meta, value: String): $T;

  Integer(pos: Meta, digits: string): $T;
};

export abstract class Literal extends Node {
  abstract tag: "False" | "True" | "Text" | "Integer";
  abstract match<$T>(p: $p_Literal<$T>): $T;

  static get False() {
    return $Literal.False;
  }

  static get True() {
    return $Literal.True;
  }

  static get Text() {
    return $Literal.Text;
  }

  static get Integer() {
    return $Literal.Integer;
  }

  static has_instance(x: any) {
    return x instanceof Literal;
  }
}

const $Literal = (function () {
  class False extends Literal {
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
      return x instanceof False;
    }
  }

  class True extends Literal {
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
      return x instanceof True;
    }
  }

  class Text extends Literal {
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
      return x instanceof Text;
    }
  }

  class Integer extends Literal {
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
      return x instanceof Integer;
    }
  }

  return { False, True, Text, Integer };
})();

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
    return $SimulationGoal.ActionQuiescence;
  }

  static get EventQuiescence() {
    return $SimulationGoal.EventQuiescence;
  }

  static get TotalQuiescence() {
    return $SimulationGoal.TotalQuiescence;
  }

  static get CustomGoal() {
    return $SimulationGoal.CustomGoal;
  }

  static has_instance(x: any) {
    return x instanceof SimulationGoal;
  }
}

const $SimulationGoal = (function () {
  class ActionQuiescence extends SimulationGoal {
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
      return x instanceof ActionQuiescence;
    }
  }

  class EventQuiescence extends SimulationGoal {
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
      return x instanceof EventQuiescence;
    }
  }

  class TotalQuiescence extends SimulationGoal {
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
      return x instanceof TotalQuiescence;
    }
  }

  class CustomGoal extends SimulationGoal {
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
      return x instanceof CustomGoal;
    }
  }

  return { ActionQuiescence, EventQuiescence, TotalQuiescence, CustomGoal };
})();

type $p_Predicate<$T> = {
  And(pos: Meta, left: Predicate, right: Predicate): $T;

  Or(pos: Meta, left: Predicate, right: Predicate): $T;

  Not(pos: Meta, pred: Predicate): $T;

  Has(pos: Meta, signature: Signature<Pattern>): $T;

  Constrain(pos: Meta, pred: Predicate, constraint: Constraint): $T;

  Parens(pos: Meta, pred: Predicate): $T;
};

export abstract class Predicate extends Node {
  abstract tag: "And" | "Or" | "Not" | "Has" | "Constrain" | "Parens";
  abstract match<$T>(p: $p_Predicate<$T>): $T;

  static get And() {
    return $Predicate.And;
  }

  static get Or() {
    return $Predicate.Or;
  }

  static get Not() {
    return $Predicate.Not;
  }

  static get Has() {
    return $Predicate.Has;
  }

  static get Constrain() {
    return $Predicate.Constrain;
  }

  static get Parens() {
    return $Predicate.Parens;
  }

  static has_instance(x: any) {
    return x instanceof Predicate;
  }
}

const $Predicate = (function () {
  class And extends Predicate {
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
      return x instanceof And;
    }
  }

  class Or extends Predicate {
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
      return x instanceof Or;
    }
  }

  class Not extends Predicate {
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
      return x instanceof Not;
    }
  }

  class Has extends Predicate {
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
      return x instanceof Has;
    }
  }

  class Constrain extends Predicate {
    readonly tag!: "Constrain";

    constructor(
      readonly pos: Meta,
      readonly pred: Predicate,
      readonly constraint: Constraint
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Constrain" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Predicate>(pred, "Predicate", Predicate);
      $assert_type<Constraint>(constraint, "Constraint", Constraint);
    }

    match<$T>(p: $p_Predicate<$T>): $T {
      return p.Constrain(this.pos, this.pred, this.constraint);
    }

    static has_instance(x: any) {
      return x instanceof Constrain;
    }
  }

  class Parens extends Predicate {
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
      return x instanceof Parens;
    }
  }

  return { And, Or, Not, Has, Constrain, Parens };
})();

type $p_Pattern<$T> = {
  HasRole(pos: Meta, typ: Name, name: Pattern): $T;

  HasType(pos: Meta, typ: TypeApp, name: Pattern): $T;

  Variant(pos: Meta, typ: Name, variant: Name): $T;

  Global(pos: Meta, name: Name): $T;

  Variable(pos: Meta, name: Name): $T;

  Wildcard(pos: Meta): $T;

  Lit(lit: Literal): $T;
};

export abstract class Pattern extends Node {
  abstract tag:
    | "HasRole"
    | "HasType"
    | "Variant"
    | "Global"
    | "Variable"
    | "Wildcard"
    | "Lit";
  abstract match<$T>(p: $p_Pattern<$T>): $T;

  static get HasRole() {
    return $Pattern.HasRole;
  }

  static get HasType() {
    return $Pattern.HasType;
  }

  static get Variant() {
    return $Pattern.Variant;
  }

  static get Global() {
    return $Pattern.Global;
  }

  static get Variable() {
    return $Pattern.Variable;
  }

  static get Wildcard() {
    return $Pattern.Wildcard;
  }

  static get Lit() {
    return $Pattern.Lit;
  }

  static has_instance(x: any) {
    return x instanceof Pattern;
  }
}

const $Pattern = (function () {
  class HasRole extends Pattern {
    readonly tag!: "HasRole";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly name: Pattern
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "HasRole" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(typ, "Name", Name);
      $assert_type<Pattern>(name, "Pattern", Pattern);
    }

    match<$T>(p: $p_Pattern<$T>): $T {
      return p.HasRole(this.pos, this.typ, this.name);
    }

    static has_instance(x: any) {
      return x instanceof HasRole;
    }
  }

  class HasType extends Pattern {
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
      return x instanceof HasType;
    }
  }

  class Variant extends Pattern {
    readonly tag!: "Variant";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly variant: Name
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Variant" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(typ, "Name", Name);
      $assert_type<Name>(variant, "Name", Name);
    }

    match<$T>(p: $p_Pattern<$T>): $T {
      return p.Variant(this.pos, this.typ, this.variant);
    }

    static has_instance(x: any) {
      return x instanceof Variant;
    }
  }

  class Global extends Pattern {
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
      return x instanceof Global;
    }
  }

  class Variable extends Pattern {
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
      return x instanceof Variable;
    }
  }

  class Wildcard extends Pattern {
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
      return x instanceof Wildcard;
    }
  }

  class Lit extends Pattern {
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
      return x instanceof Lit;
    }
  }

  return { HasRole, HasType, Variant, Global, Variable, Wildcard, Lit };
})();

type $p_Constraint<$T> = {
  And(pos: Meta, left: Constraint, right: Constraint): $T;

  Or(pos: Meta, left: Constraint, right: Constraint): $T;

  Not(pos: Meta, value: Constraint): $T;

  Equal(pos: Meta, left: Constraint, right: Constraint): $T;

  Variable(pos: Meta, name: Name): $T;

  Parens(pos: Meta, value: Constraint): $T;

  Lit(lit: Literal): $T;
};

export abstract class Constraint extends Node {
  abstract tag: "And" | "Or" | "Not" | "Equal" | "Variable" | "Parens" | "Lit";
  abstract match<$T>(p: $p_Constraint<$T>): $T;

  static get And() {
    return $Constraint.And;
  }

  static get Or() {
    return $Constraint.Or;
  }

  static get Not() {
    return $Constraint.Not;
  }

  static get Equal() {
    return $Constraint.Equal;
  }

  static get Variable() {
    return $Constraint.Variable;
  }

  static get Parens() {
    return $Constraint.Parens;
  }

  static get Lit() {
    return $Constraint.Lit;
  }

  static has_instance(x: any) {
    return x instanceof Constraint;
  }
}

const $Constraint = (function () {
  class And extends Constraint {
    readonly tag!: "And";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "And" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Constraint>(left, "Constraint", Constraint);
      $assert_type<Constraint>(right, "Constraint", Constraint);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.And(this.pos, this.left, this.right);
    }

    static has_instance(x: any) {
      return x instanceof And;
    }
  }

  class Or extends Constraint {
    readonly tag!: "Or";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Or" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Constraint>(left, "Constraint", Constraint);
      $assert_type<Constraint>(right, "Constraint", Constraint);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Or(this.pos, this.left, this.right);
    }

    static has_instance(x: any) {
      return x instanceof Or;
    }
  }

  class Not extends Constraint {
    readonly tag!: "Not";

    constructor(readonly pos: Meta, readonly value: Constraint) {
      super();
      Object.defineProperty(this, "tag", { value: "Not" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Constraint>(value, "Constraint", Constraint);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Not(this.pos, this.value);
    }

    static has_instance(x: any) {
      return x instanceof Not;
    }
  }

  class Equal extends Constraint {
    readonly tag!: "Equal";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
      Object.defineProperty(this, "tag", { value: "Equal" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Constraint>(left, "Constraint", Constraint);
      $assert_type<Constraint>(right, "Constraint", Constraint);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Equal(this.pos, this.left, this.right);
    }

    static has_instance(x: any) {
      return x instanceof Equal;
    }
  }

  class Variable extends Constraint {
    readonly tag!: "Variable";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
      Object.defineProperty(this, "tag", { value: "Variable" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Name>(name, "Name", Name);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Variable(this.pos, this.name);
    }

    static has_instance(x: any) {
      return x instanceof Variable;
    }
  }

  class Parens extends Constraint {
    readonly tag!: "Parens";

    constructor(readonly pos: Meta, readonly value: Constraint) {
      super();
      Object.defineProperty(this, "tag", { value: "Parens" });
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Constraint>(value, "Constraint", Constraint);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Parens(this.pos, this.value);
    }

    static has_instance(x: any) {
      return x instanceof Parens;
    }
  }

  class Lit extends Constraint {
    readonly tag!: "Lit";

    constructor(readonly lit: Literal) {
      super();
      Object.defineProperty(this, "tag", { value: "Lit" });
      $assert_type<Literal>(lit, "Literal", Literal);
    }

    match<$T>(p: $p_Constraint<$T>): $T {
      return p.Lit(this.lit);
    }

    static has_instance(x: any) {
      return x instanceof Lit;
    }
  }

  return { And, Or, Not, Equal, Variable, Parens, Lit };
})();

type $p_Signature<T, $T> = {
  Unary(pos: Meta, self: T, name: Name): $T;

  Binary(pos: Meta, op: Name, left: T, right: T): $T;

  Keyword(pos: Meta, self: T, pairs: Pair<Name, T>[]): $T;
};

export abstract class Signature<T> extends Node {
  abstract tag: "Unary" | "Binary" | "Keyword";
  abstract match<$T>(p: $p_Signature<T, $T>): $T;

  static get Unary() {
    return $Signature.Unary;
  }

  static get Binary() {
    return $Signature.Binary;
  }

  static get Keyword() {
    return $Signature.Keyword;
  }

  static has_instance(x: any) {
    return x instanceof Signature;
  }
}

const $Signature = (function () {
  class Unary<T> extends Signature<T> {
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
      return x instanceof Unary;
    }
  }

  class Binary<T> extends Signature<T> {
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
      return x instanceof Binary;
    }
  }

  class Keyword<T> extends Signature<T> {
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
      return x instanceof Keyword;
    }
  }

  return { Unary, Binary, Keyword };
})();

type $p_PartialSignature<T, $T> = {
  Unary(pos: Meta, name: Name): $T;

  Binary(pos: Meta, op: Name, right: T): $T;

  Keyword(pos: Meta, pairs: Pair<Name, T>[]): $T;
};

export abstract class PartialSignature<T> extends Node {
  abstract tag: "Unary" | "Binary" | "Keyword";
  abstract match<$T>(p: $p_PartialSignature<T, $T>): $T;

  static get Unary() {
    return $PartialSignature.Unary;
  }

  static get Binary() {
    return $PartialSignature.Binary;
  }

  static get Keyword() {
    return $PartialSignature.Keyword;
  }

  static has_instance(x: any) {
    return x instanceof PartialSignature;
  }
}

const $PartialSignature = (function () {
  class Unary<T> extends PartialSignature<T> {
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
      return x instanceof Unary;
    }
  }

  class Binary<T> extends PartialSignature<T> {
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
      return x instanceof Binary;
    }
  }

  class Keyword<T> extends PartialSignature<T> {
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
      return x instanceof Keyword;
    }
  }

  return { Unary, Binary, Keyword };
})();

type $p_RelationPart<$T> = {
  Many(pos: Meta, name: Name): $T;

  One(pos: Meta, name: Name): $T;
};

export abstract class RelationPart extends Node {
  abstract tag: "Many" | "One";
  abstract match<$T>(p: $p_RelationPart<$T>): $T;

  static get Many() {
    return $RelationPart.Many;
  }

  static get One() {
    return $RelationPart.One;
  }

  static has_instance(x: any) {
    return x instanceof RelationPart;
  }
}

const $RelationPart = (function () {
  class Many extends RelationPart {
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
      return x instanceof Many;
    }
  }

  class One extends RelationPart {
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
      return x instanceof One;
    }
  }

  return { Many, One };
})();

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

  constructor(readonly pos: Meta, readonly names: Name[]) {
    super();
    Object.defineProperty(this, "tag", { value: "Namespace" });
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name[]>(names, "Name[]", $is_array(Name));
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
  '\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\ndeclaration  = relationDeclaration  -- alt1\n | predicateDeclaration  -- alt2\n | doDeclaration  -- alt3\n | commandDeclaration  -- alt4\n | roleDeclaration  -- alt5\n | typeDeclaration  -- alt6\n | enumDeclaration  -- alt7\n | defineDeclaration  -- alt8\n | sceneDeclaration  -- alt9\n | actionDeclaration  -- alt10\n | whenDeclaration  -- alt11\n\n\nrelationDeclaration  = relation_ logicSignature<relationPart> s<";">  -- alt1\n\n\nrelationPart  = name s<"*">  -- alt1\n | name  -- alt2\n\n\npredicateDeclaration  = predicate_ logicSignature<name> block<predicateClause>  -- alt1\n\n\npredicateClause  = when_ predicate s<";">  -- alt1\n\n\ndoDeclaration  = do_ statementBlock<statement>  -- alt1\n\n\ncommandDeclaration  = command_ signature<parameter> s<"="> foreignBody  -- alt1\n | command_ signature<parameter> statementBlock<statement>  -- alt2\n\n\nforeignBody  = namespace s<"("> listOf<name, s<",">> s<")"> s<";">  -- alt1\n\n\nparameter  = name  -- alt1\n | s<"("> name is_ typeApp s<")">  -- alt2\n | atom  -- alt3\n\n\ntypeApp  = typeAppUnion  -- alt1\n\n\ntypeAppUnion  = typeAppPrimary s<"|"> typeAppUnion  -- alt1\n | typeAppPrimary  -- alt2\n\n\ntypeAppPrimary  = atom  -- alt1\n | s<"("> typeApp s<")">  -- alt2\n\n\ntypeDeclaration  = singleton_ basicType typeInitBlock  -- alt1\n | basicType s<";">  -- alt2\n\n\nbasicType  = type_ atom roles  -- alt1\n\n\ntypeInitBlock  = block<typeInit>  -- alt1\n | s<";">  -- alt2\n\n\ntypeInit  = partialLogicSignature<invokePostfix> s<";">  -- alt1\n | command_ partialSignature<parameter> s<"="> foreignBody  -- alt2\n | command_ partialSignature<parameter> statementBlock<statement>  -- alt3\n\n\nroleDeclaration  = role_ atom s<";">  -- alt1\n\n\nenumDeclaration  = enum_ atom s<"="> s<"|">? nonemptyListOf<variant, s<"|">> s<";">  -- alt1\n\n\nvariant  = atom roles  -- alt1\n\n\nroles  = s<"::"> nonemptyListOf<atom, s<",">>  -- alt1\n |   -- alt2\n\n\ndefineDeclaration  = define_ atom s<"="> atomicExpression s<";">  -- alt1\n\n\nsceneDeclaration  = scene_ atom statementBlock<statement>  -- alt1\n\n\nactionDeclaration  = action_ string when_ predicate statementBlock<statement>  -- alt1\n\n\nwhenDeclaration  = when_ predicate statementBlock<statement>  -- alt1\n\n\npredicate  = predicateBinary if_ constraint  -- alt1\n | predicateBinary  -- alt2\n\n\npredicateBinary  = predicateAnd  -- alt1\n | predicateOr  -- alt2\n | predicateNot  -- alt3\n\n\npredicateAnd  = predicateNot s<","> predicateAnd1  -- alt1\n\n\npredicateAnd1  = predicateNot s<","> predicateAnd1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateOr  = predicateNot s<"|"> predicateOr1  -- alt1\n\n\npredicateOr1  = predicateNot s<"|"> predicateOr1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateNot  = not_ predicatePrimary  -- alt1\n | predicatePrimary  -- alt2\n\n\npredicatePrimary  = logicSignature<pattern>  -- alt1\n | s<"("> predicate s<")">  -- alt2\n\n\npattern  = s<"("> patternComplex s<")">  -- alt1\n | atom s<"."> atom  -- alt2\n | atom  -- alt3\n | literal  -- alt4\n | patternName  -- alt5\n\n\npatternComplex  = patternName is_ typeApp  -- alt1\n | patternName s<"::"> atom  -- alt2\n\n\npatternName  = s<"_">  -- alt1\n | name  -- alt2\n\n\nconstraint  = constraint and constraint  -- alt1\n | constraint or constraint  -- alt2\n | constraint200  -- alt3\n\n\nconstraint200  = not_ constraint300  -- alt1\n | constraint300  -- alt2\n\n\nconstraint300  = constraint400 s<"==="> constraint400  -- alt1\n | constraint400 s<"=/="> constraint400  -- alt2\n | constraint400  -- alt3\n\n\nconstraint400  = name  -- alt1\n | literal  -- alt2\n | s<"("> constraint s<")">  -- alt3\n\n\nstatement  = letStatement  -- alt1\n | factStatement  -- alt2\n | forgetStatement  -- alt3\n | gotoStatement  -- alt4\n | callStatement  -- alt5\n | simulateStatement  -- alt6\n | expression  -- alt7\n\n\nletStatement  = let_ name s<"="> expression  -- alt1\n\n\nfactStatement  = fact_ logicSignature<primaryExpression>  -- alt1\n\n\nforgetStatement  = forget_ logicSignature<primaryExpression>  -- alt1\n\n\ngotoStatement  = goto_ atom  -- alt1\n\n\ncallStatement  = call_ atom  -- alt1\n\n\nsimulateStatement  = simulate_ for_ expression until_ simulateGoal  -- alt1\n\n\nsimulateGoal  = action_ quiescence_  -- alt1\n | event_ quiescence_  -- alt2\n | quiescence_  -- alt3\n | predicate  -- alt4\n\n\nexpression  = searchExpression  -- alt1\n | forExpression  -- alt2\n | invokeInfixExpression  -- alt3\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\nforExpression  = for_ name in_ expression expressionBlock  -- alt1\n\n\nexpressionBlock  = statementBlock<statement>  -- alt1\n\n\ninvokeInfixExpression  = invokeInfixExpression infix_symbol invokeMixfix  -- alt1\n | invokeMixfix  -- alt2\n\n\ninvokeMixfix  = castExpression signaturePair<invokePostfix>+  -- alt1\n | castExpression  -- alt2\n\n\ncastExpression  = invokePostfix as_ typeAppPrimary  -- alt1\n | invokePostfix  -- alt2\n\n\ninvokePostfix  = invokePostfix atom  -- alt1\n | applyExpression  -- alt2\n\n\napplyExpression  = applyExpression s<"("> nonemptyListOf<expression, s<",">> s<",">? s<")">  -- alt1\n | memberExpression  -- alt2\n\n\nmemberExpression  = memberExpression s<"."> name  -- alt1\n | memberExpression s<"."> memberSelection  -- alt2\n | primaryExpression  -- alt3\n\n\nmemberSelection  = s<"("> nonemptyListOf<fieldSelection, s<",">> s<",">? s<")">  -- alt1\n\n\nfieldSelection  = name as_ name  -- alt1\n | name  -- alt2\n\n\nprimaryExpression  = newExpression  -- alt1\n | interpolateText<expression>  -- alt2\n | literalExpression  -- alt3\n | recordExpression<expression>  -- alt4\n | listExpression<expression>  -- alt5\n | hole  -- alt6\n | self_  -- alt7\n | atom  -- alt8\n | name  -- alt9\n | s<"("> expression s<")">  -- alt10\n\n\nnewExpression  = new_ atom  -- alt1\n | atom s<"."> atom  -- alt2\n\n\nlistExpression<e>  = s<"["> listOf<e, s<",">> s<",">? s<"]">  -- alt1\n\n\nrecordExpression<e>  = s<"["> s<"->"> s<"]">  -- alt1\n | s<"["> nonemptyListOf<recordPair<e>, s<",">> s<",">? s<"]">  -- alt2\n\n\nrecordPair<e>  = name s<"->"> e  -- alt1\n\n\nliteralExpression  = literal  -- alt1\n\n\natomicExpression  = newExpression  -- alt1\n | literalExpression  -- alt2\n | recordExpression<atomicExpression>  -- alt3\n | listExpression<atomicExpression>  -- alt4\n\n\ninterpolateText<t>  = s<"\\""> interpolatePart<t>* "\\""  -- alt1\n\n\ninterpolatePart<p>  = "\\\\" any  -- alt1\n | "[" s<p> s<"]">  -- alt2\n | ~"\\"" any  -- alt3\n\n\nliteral  = text  -- alt1\n | integer  -- alt2\n | boolean  -- alt3\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = string  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\nstring  = s<t_text>  -- alt1\n\n\nhole  = s<"_"> ~name_rest  -- alt1\n\n\natom  = ~reserved s<t_atom> ~":"  -- alt1\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nand  = and_  -- alt1\n\n\nor  = or_  -- alt1\n\n\nnamespace  = nonemptyListOf<atom, s<".">>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\npartialLogicSignature<t>  = signaturePair<t>+  -- alt1\n | atom  -- alt2\n\n\npartialSignature<t>  = signaturePair<t>+  -- alt1\n | infix_symbol t  -- alt2\n | atom  -- alt3\n | not  -- alt4\n\n\nsignature<t>  = t infix_symbol t  -- alt1\n | t signaturePair<t>+  -- alt2\n | t atom  -- alt3\n | not t  -- alt4\n\n\nstatementBlock<t>  = s<"{"> listOf<t, s<";">> s<";">? s<"}">  -- alt1\n\n\nblock<t>  = s<"{"> t* s<"}">  -- alt1\n\n\ns<p>  = space* p  -- alt1\n\n\nheader (a file header) = space* "%" hs* "crochet" nl  -- alt1\n\n\nhs  = " "  -- alt1\n | "\\t"  -- alt2\n\n\nnl  = "\\n"  -- alt1\n | "\\r"  -- alt2\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = "//" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\natom_start  = "a".."z"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom ":"  -- alt1\n\n\nname_start  = "A".."Z"  -- alt1\n | "_"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = t_any_infix ~infix_character  -- alt1\n | and_  -- alt2\n | or_  -- alt3\n\n\nt_any_infix  = "++"  -- alt1\n | "+"  -- alt2\n | "-"  -- alt3\n | "*"  -- alt4\n | "/"  -- alt5\n | "<="  -- alt6\n | "<"  -- alt7\n | ">="  -- alt8\n | ">"  -- alt9\n | "==="  -- alt10\n | "=/="  -- alt11\n\n\ninfix_character  = "+"  -- alt1\n | "-"  -- alt2\n | "*"  -- alt3\n | "/"  -- alt4\n | "<"  -- alt5\n | ">"  -- alt6\n | "="  -- alt7\n\n\ndec_digit  = "0".."9"  -- alt1\n | "_"  -- alt2\n\n\nt_integer (an integer) = ~"_" dec_digit+  -- alt1\n\n\ntext_character  = "\\\\" "\\""  -- alt1\n | ~"\\"" any  -- alt2\n\n\nt_text (a text) = "\\"" text_character* "\\""  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<"relation">  -- alt1\n\n\npredicate_  = kw<"predicate">  -- alt1\n\n\nwhen_  = kw<"when">  -- alt1\n\n\ndo_  = kw<"do">  -- alt1\n\n\ncommand_  = kw<"command">  -- alt1\n\n\ntype_  = kw<"type">  -- alt1\n\n\nrole_  = kw<"role">  -- alt1\n\n\nenum_  = kw<"enum">  -- alt1\n\n\ndefine_  = kw<"define">  -- alt1\n\n\nsingleton_  = kw<"singleton">  -- alt1\n\n\nscene_  = kw<"scene">  -- alt1\n\n\naction_  = kw<"action">  -- alt1\n\n\nlet_  = kw<"let">  -- alt1\n\n\nreturn_  = kw<"return">  -- alt1\n\n\nfact_  = kw<"fact">  -- alt1\n\n\nforget_  = kw<"forget">  -- alt1\n\n\nnew_  = kw<"new">  -- alt1\n\n\nsearch_  = kw<"search">  -- alt1\n\n\nif_  = kw<"if">  -- alt1\n\n\ngoto_  = kw<"goto">  -- alt1\n\n\ncall_  = kw<"call">  -- alt1\n\n\nsimulate_  = kw<"simulate">  -- alt1\n\n\ntrue_  = kw<"true">  -- alt1\n\n\nfalse_  = kw<"false">  -- alt1\n\n\nnot_  = kw<"not">  -- alt1\n\n\nand_  = kw<"and">  -- alt1\n\n\nor_  = kw<"or">  -- alt1\n\n\nis_  = kw<"is">  -- alt1\n\n\nself_  = kw<"self">  -- alt1\n\n\nas_  = kw<"as">  -- alt1\n\n\nevent_  = kw<"event">  -- alt1\n\n\nquiescence_  = kw<"quiescence">  -- alt1\n\n\nfor_  = kw<"for">  -- alt1\n\n\nuntil_  = kw<"until">  -- alt1\n\n\nin_  = kw<"in">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | command_  -- alt5\n | scene_  -- alt6\n | action_  -- alt7\n | type_  -- alt8\n | role_  -- alt9\n | enum_  -- alt10\n | define_  -- alt11\n | singleton_  -- alt12\n | goto_  -- alt13\n | call_  -- alt14\n | let_  -- alt15\n | return_  -- alt16\n | fact_  -- alt17\n | forget_  -- alt18\n | new_  -- alt19\n | search_  -- alt20\n | if_  -- alt21\n | simulate_  -- alt22\n | true_  -- alt23\n | false_  -- alt24\n | not_  -- alt25\n | and_  -- alt26\n | or_  -- alt27\n | is_  -- alt28\n | self_  -- alt29\n | as_  -- alt30\n | event_  -- alt31\n | quiescence_  -- alt32\n | for_  -- alt33\n | until_  -- alt34\n | in_  -- alt35\n\r\n  }\r\n  '
);

// == Parsing =======================================================
export function parse(source: string, rule: string): Result<Program> {
  const result = grammar.match(source, rule);
  if (result.failed()) {
    return { ok: false, error: result.message as string };
  } else {
    const ast = toAst(result);
    $assert_type<Program>(ast, "Program", Program);
    return { ok: true, value: toAst(result) };
  }
}

export const semantics = grammar.createSemantics();
const toAstVisitor = {
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

  doDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  doDeclaration_alt1(this: Ohm.Node, _1: Ohm.Node, xs$0: Ohm.Node): any {
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
    _3: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new Declaration.ForeignCommand($meta(this), s, b);
  },

  commandDeclaration_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Command($meta(this), s, b);
  },

  foreignBody(x: Ohm.Node): any {
    return x.toAST();
  },

  foreignBody_alt1(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    xs$0: Ohm.Node,
    _4: Ohm.Node,
    _5: Ohm.Node
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
    return new Parameter.TypedOnly(
      $meta(this),
      new TypeApp.Named($meta(this), t)
    );
  },

  typeApp(x: Ohm.Node): any {
    return x.toAST();
  },

  typeApp_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeAppUnion(x: Ohm.Node): any {
    return x.toAST();
  },

  typeAppUnion_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new TypeApp.Union($meta(this), l, r);
  },

  typeAppUnion_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  typeAppPrimary(x: Ohm.Node): any {
    return x.toAST();
  },

  typeAppPrimary_alt1(this: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new TypeApp.Named($meta(this), t);
  },

  typeAppPrimary_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const t = t$0.toAST();
    return new TypeApp.Parens($meta(this), t);
  },

  typeDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  typeDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    i$0: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const i = i$0.toAST();
    return new Declaration.SingletonType($meta(this), t, i);
  },

  typeDeclaration_alt2(this: Ohm.Node, t$0: Ohm.Node, _2: Ohm.Node): any {
    const t = t$0.toAST();
    return new Declaration.Type($meta(this), t);
  },

  basicType(x: Ohm.Node): any {
    return x.toAST();
  },

  basicType_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const r = r$0.toAST();
    return new TypeDef(n, r);
  },

  typeInitBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  typeInitBlock_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
    const x = x$0.toAST();
    return x;
  },

  typeInitBlock_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return [];
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
    _3: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new TypeInit.ForeignCommand($meta(this), s, b);
  },

  typeInit_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    s$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const b = b$0.toAST();
    return new TypeInit.Command($meta(this), s, b);
  },

  roleDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  roleDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const n = n$0.toAST();
    return new Declaration.Role($meta(this), n);
  },

  enumDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  enumDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node,
    vs$0: Ohm.Node,
    _6: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const vs = vs$0.toAST();
    return new Declaration.Enum($meta(this), n, vs);
  },

  variant(x: Ohm.Node): any {
    return x.toAST();
  },

  variant_alt1(this: Ohm.Node, n$0: Ohm.Node, r$0: Ohm.Node): any {
    const n = n$0.toAST();
    const r = r$0.toAST();
    return new Variant($meta(this), n, r);
  },

  roles(x: Ohm.Node): any {
    return x.toAST();
  },

  roles_alt1(this: Ohm.Node, _1: Ohm.Node, r$0: Ohm.Node): any {
    const r = r$0.toAST();
    return r;
  },

  roles_alt2(this: Ohm.Node): any {
    return [];
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
    b$0: Ohm.Node
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
    _3: Ohm.Node,
    p$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const t = t$0.toAST();
    const p = p$0.toAST();
    const b = b$0.toAST();
    return new Declaration.Action($meta(this), t, p, b);
  },

  whenDeclaration(x: Ohm.Node): any {
    return x.toAST();
  },

  whenDeclaration_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    p$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const b = b$0.toAST();
    return new Declaration.When($meta(this), p, b);
  },

  predicate(x: Ohm.Node): any {
    return x.toAST();
  },

  predicate_alt1(
    this: Ohm.Node,
    p$0: Ohm.Node,
    _2: Ohm.Node,
    c$0: Ohm.Node
  ): any {
    const p = p$0.toAST();
    const c = c$0.toAST();
    return new Predicate.Constrain($meta(this), p, c);
  },

  predicate_alt2(this: Ohm.Node, _1: Ohm.Node): any {
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

  predicatePrimary(x: Ohm.Node): any {
    return x.toAST();
  },

  predicatePrimary_alt1(this: Ohm.Node, r$0: Ohm.Node): any {
    const r = r$0.toAST();
    return new Predicate.Has($meta(this), r);
  },

  predicatePrimary_alt2(
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

  pattern_alt2(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    v$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const v = v$0.toAST();
    return new Pattern.Variant($meta(this), n, v);
  },

  pattern_alt3(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Pattern.Global($meta(this), n);
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

  patternComplex_alt2(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    t$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const t = t$0.toAST();
    return new Pattern.HasRole($meta(this), t, n);
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

  constraint(x: Ohm.Node): any {
    return x.toAST();
  },

  constraint_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Constraint.And($meta(this), l, r);
  },

  constraint_alt2(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Constraint.Or($meta(this), l, r);
  },

  constraint_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  constraint200(x: Ohm.Node): any {
    return x.toAST();
  },

  constraint200_alt1(this: Ohm.Node, _1: Ohm.Node, c$0: Ohm.Node): any {
    const c = c$0.toAST();
    return new Constraint.Not($meta(this), c);
  },

  constraint200_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  constraint300(x: Ohm.Node): any {
    return x.toAST();
  },

  constraint300_alt1(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Constraint.Equal($meta(this), l, r);
  },

  constraint300_alt2(
    this: Ohm.Node,
    l$0: Ohm.Node,
    _2: Ohm.Node,
    r$0: Ohm.Node
  ): any {
    const l = l$0.toAST();
    const r = r$0.toAST();
    return new Constraint.Not(
      $meta(this),
      new Constraint.Equal($meta(this), l, r)
    );
  },

  constraint300_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  constraint400(x: Ohm.Node): any {
    return x.toAST();
  },

  constraint400_alt1(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Constraint.Variable($meta(this), n);
  },

  constraint400_alt2(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Constraint.Lit(l);
  },

  constraint400_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    c$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const c = c$0.toAST();
    return new Constraint.Parens($meta(this), c);
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

  statement_alt7(this: Ohm.Node, e$0: Ohm.Node): any {
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
    _4: Ohm.Node,
    g$0: Ohm.Node
  ): any {
    const e = e$0.toAST();
    const g = g$0.toAST();
    return new Statement.SimulateGlobal($meta(this), e, g);
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

  searchExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  searchExpression_alt1(this: Ohm.Node, _1: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return new Expression.Search($meta(this), p);
  },

  forExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  forExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    n$0: Ohm.Node,
    _3: Ohm.Node,
    e$0: Ohm.Node,
    b$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const e = e$0.toAST();
    const b = b$0.toAST();
    return new Expression.For($meta(this), e, n, b);
  },

  expressionBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  expressionBlock_alt1(this: Ohm.Node, b$0: Ohm.Node): any {
    const b = b$0.toAST();
    return new Expression.Block($meta(this), b);
  },

  invokeInfixExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  invokeInfixExpression_alt1(
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

  invokeInfixExpression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
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

  invokeMixfix_alt2(this: Ohm.Node, _1: Ohm.Node): any {
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

  castExpression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
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
    _4: Ohm.Node,
    _5: Ohm.Node
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
    _3: Ohm.Node,
    _4: Ohm.Node
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

  primaryExpression_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  primaryExpression_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return new Expression.Self($meta(this));
  },

  primaryExpression_alt8(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Global($meta(this), n);
  },

  primaryExpression_alt9(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Variable($meta(this), n);
  },

  primaryExpression_alt10(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const e = e$0.toAST();
    return new Expression.Parens($meta(this), e);
  },

  newExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  newExpression_alt1(this: Ohm.Node, _1: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.New($meta(this), n);
  },

  newExpression_alt2(
    this: Ohm.Node,
    n$0: Ohm.Node,
    _2: Ohm.Node,
    v$0: Ohm.Node
  ): any {
    const n = n$0.toAST();
    const v = v$0.toAST();
    return new Expression.NewVariant($meta(this), n, v);
  },

  listExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  listExpression_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node
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
    _3: Ohm.Node,
    _4: Ohm.Node
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

  literalExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  literalExpression_alt1(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Expression.Lit(l);
  },

  atomicExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  atomicExpression_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
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
    return new Expression.Interpolate($meta(this), xs);
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

  atom_alt1(this: Ohm.Node, x$0: Ohm.Node): any {
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

  statementBlock(x: Ohm.Node): any {
    return x.toAST();
  },

  statementBlock_alt1(
    this: Ohm.Node,
    _1: Ohm.Node,
    xs$0: Ohm.Node,
    _3: Ohm.Node,
    _4: Ohm.Node
  ): any {
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

  t_integer_alt1(this: Ohm.Node, _2: Ohm.Node): any {
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

  role_(x: Ohm.Node): any {
    return x.toAST();
  },

  role__alt1(this: Ohm.Node, _1: Ohm.Node): any {
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
};
semantics.addOperation("toAST()", toAstVisitor);

function toAst(result: Ohm.MatchResult) {
  return semantics(result).toAST();
}

