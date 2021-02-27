// This file is generated from Linguist
import * as Ohm from "ohm-js";
import { inspect as $inspect } from "util";

type Result<A> = { ok: true; value: A } | { ok: false; error: string };

export abstract class Node {}

export class Meta {
  constructor(
    readonly source: string,
    readonly position: { start_index: number; end_index: number }
  ) {}

  static has_instance(x: any) {
    return x instanceof Meta;
  }
}

function $meta(x: Ohm.Node): Meta {
  return new Meta(x.sourceString, {
    start_index: x.source.startIdx,
    end_index: x.source.endIdx,
  });
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
  readonly tag = "Program";

  constructor(readonly pos: Meta, readonly declarations: Declaration[]) {
    super();
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

  Predicate(
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
};

export abstract class Declaration extends Node {
  abstract tag:
    | "Relation"
    | "Predicate"
    | "Do"
    | "ForeignCommand"
    | "Command"
    | "Define"
    | "Role"
    | "SingletonType"
    | "Type"
    | "Enum"
    | "Scene";
  abstract match<$T>(p: $p_Declaration<$T>): $T;

  static get Relation() {
    return $Declaration.Relation;
  }

  static get Predicate() {
    return $Declaration.Predicate;
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

  static has_instance(x: any) {
    return x instanceof Declaration;
  }
}

const $Declaration = (function () {
  class Relation extends Declaration {
    readonly tag = "Relation";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<RelationPart>
    ) {
      super();
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

  class Predicate extends Declaration {
    readonly tag = "Predicate";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Name>,
      readonly clauses: PredicateClause[]
    ) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Name>>(signature, "Signature<Name>", Signature);
      $assert_type<PredicateClause[]>(
        clauses,
        "PredicateClause[]",
        $is_array(PredicateClause)
      );
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.Predicate(this.pos, this.signature, this.clauses);
    }

    static has_instance(x: any) {
      return x instanceof Predicate;
    }
  }

  class Do extends Declaration {
    readonly tag = "Do";

    constructor(readonly pos: Meta, readonly body: Statement[]) {
      super();
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
    readonly tag = "ForeignCommand";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Parameter>,
      readonly body: FFI
    ) {
      super();
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
    readonly tag = "Command";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Parameter>,
      readonly body: Statement[]
    ) {
      super();
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
    readonly tag = "Define";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly value: Expression
    ) {
      super();
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
    readonly tag = "Role";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "SingletonType";

    constructor(
      readonly pos: Meta,
      readonly typ: TypeDef,
      readonly init: TypeInit[]
    ) {
      super();
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
    readonly tag = "Type";

    constructor(readonly pos: Meta, readonly typ: TypeDef) {
      super();
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
    readonly tag = "Enum";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly values: Variant[]
    ) {
      super();
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
    readonly tag = "Scene";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly body: Statement[]
    ) {
      super();
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

  return {
    Relation,
    Predicate,
    Do,
    ForeignCommand,
    Command,
    Define,
    Role,
    SingletonType,
    Type,
    Enum,
    Scene,
  };
})();

export class TypeDef extends Node {
  readonly tag = "TypeDef";

  constructor(readonly name: Name, readonly roles: Name[]) {
    super();
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name[]>(roles, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof TypeDef;
  }
}

export class Variant extends Node {
  readonly tag = "Variant";

  constructor(readonly pos: Meta, readonly name: Name, readonly roles: Name[]) {
    super();
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name>(name, "Name", Name);
    $assert_type<Name[]>(roles, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof Variant;
  }
}

export class FFI extends Node {
  readonly tag = "FFI";

  constructor(
    readonly pos: Meta,
    readonly name: Namespace,
    readonly args: Name[]
  ) {
    super();
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
    readonly tag = "Fact";

    constructor(
      readonly pos: Meta,
      readonly sig: PartialSignature<Expression>
    ) {
      super();
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
    readonly tag = "Command";

    constructor(
      readonly pos: Meta,
      readonly sig: PartialSignature<Parameter>,
      readonly body: Statement[]
    ) {
      super();
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
    readonly tag = "ForeignCommand";

    constructor(
      readonly pos: Meta,
      readonly signature: PartialSignature<Parameter>,
      readonly body: FFI
    ) {
      super();
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
    readonly tag = "Untyped";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Typed";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly typ: TypeApp
    ) {
      super();
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
    readonly tag = "TypedOnly";

    constructor(readonly pos: Meta, readonly typ: TypeApp) {
      super();
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
    readonly tag = "Union";

    constructor(
      readonly pos: Meta,
      readonly left: TypeApp,
      readonly right: TypeApp
    ) {
      super();
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
    readonly tag = "Named";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Parens";

    constructor(readonly pos: Meta, readonly typ: TypeApp) {
      super();
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
  readonly tag = "PredicateClause";

  constructor(
    readonly pos: Meta,
    readonly predicate: Predicate,
    readonly effect: PredicateEffect
  ) {
    super();
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
    readonly tag = "Trivial";

    constructor() {
      super();
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

  Expr(value: Expression): $T;
};

export abstract class Statement extends Node {
  abstract tag: "Fact" | "Forget" | "Goto" | "Call" | "Let" | "Expr";
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

  static get Expr() {
    return $Statement.Expr;
  }

  static has_instance(x: any) {
    return x instanceof Statement;
  }
}

const $Statement = (function () {
  class Fact extends Statement {
    readonly tag = "Fact";

    constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
      super();
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
    readonly tag = "Forget";

    constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
      super();
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
    readonly tag = "Goto";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Call";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Let";

    constructor(
      readonly pos: Meta,
      readonly name: Name,
      readonly value: Expression
    ) {
      super();
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

  class Expr extends Statement {
    readonly tag = "Expr";

    constructor(readonly value: Expression) {
      super();
      $assert_type<Expression>(value, "Expression", Expression);
    }

    match<$T>(p: $p_Statement<$T>): $T {
      return p.Expr(this.value);
    }

    static has_instance(x: any) {
      return x instanceof Expr;
    }
  }

  return { Fact, Forget, Goto, Call, Let, Expr };
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
    readonly tag = "New";

    constructor(readonly pos: Meta, readonly typ: Name) {
      super();
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
    readonly tag = "NewVariant";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly variant: Name
    ) {
      super();
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
    readonly tag = "Invoke";

    constructor(readonly pos: Meta, readonly signature: Signature<Expression>) {
      super();
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
    readonly tag = "Global";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Variable";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Self";

    constructor(readonly pos: Meta) {
      super();
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
    readonly tag = "List";

    constructor(readonly pos: Meta, readonly values: Expression[]) {
      super();
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
    readonly tag = "Record";

    constructor(readonly pos: Meta, readonly pairs: Pair<Name, Expression>[]) {
      super();
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
    readonly tag = "Cast";

    constructor(
      readonly pos: Meta,
      readonly typ: TypeApp,
      readonly value: Expression
    ) {
      super();
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
    readonly tag = "Search";

    constructor(readonly pos: Meta, readonly predicate: Predicate) {
      super();
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

  class Parens extends Expression {
    readonly tag = "Parens";

    constructor(readonly pos: Meta, readonly value: Expression) {
      super();
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
    readonly tag = "Lit";

    constructor(readonly value: Literal) {
      super();
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
    Parens,
    Lit,
  };
})();

type $p_Literal<$T> = {
  False(pos: Meta): $T;

  True(pos: Meta): $T;

  Text(pos: Meta, value: string): $T;

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
    readonly tag = "False";

    constructor(readonly pos: Meta) {
      super();
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
    readonly tag = "True";

    constructor(readonly pos: Meta) {
      super();
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
    readonly tag = "Text";

    constructor(readonly pos: Meta, readonly value: string) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<string>(value, "string", $is_type("string"));
    }

    match<$T>(p: $p_Literal<$T>): $T {
      return p.Text(this.pos, this.value);
    }

    static has_instance(x: any) {
      return x instanceof Text;
    }
  }

  class Integer extends Literal {
    readonly tag = "Integer";

    constructor(readonly pos: Meta, readonly digits: string) {
      super();
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

export class Predicate extends Node {
  readonly tag = "Predicate";

  constructor(
    readonly pos: Meta,
    readonly relations: PredicateRelation[],
    readonly constraint: Constraint
  ) {
    super();
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<PredicateRelation[]>(
      relations,
      "PredicateRelation[]",
      $is_array(PredicateRelation)
    );
    $assert_type<Constraint>(constraint, "Constraint", Constraint);
  }

  static has_instance(x: any) {
    return x instanceof Predicate;
  }
}

type $p_PredicateRelation<$T> = {
  Not(pos: Meta, signature: Signature<Pattern>): $T;

  Has(pos: Meta, signature: Signature<Pattern>): $T;
};

export abstract class PredicateRelation extends Node {
  abstract tag: "Not" | "Has";
  abstract match<$T>(p: $p_PredicateRelation<$T>): $T;

  static get Not() {
    return $PredicateRelation.Not;
  }

  static get Has() {
    return $PredicateRelation.Has;
  }

  static has_instance(x: any) {
    return x instanceof PredicateRelation;
  }
}

const $PredicateRelation = (function () {
  class Not extends PredicateRelation {
    readonly tag = "Not";

    constructor(readonly pos: Meta, readonly signature: Signature<Pattern>) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Pattern>>(
        signature,
        "Signature<Pattern>",
        Signature
      );
    }

    match<$T>(p: $p_PredicateRelation<$T>): $T {
      return p.Not(this.pos, this.signature);
    }

    static has_instance(x: any) {
      return x instanceof Not;
    }
  }

  class Has extends PredicateRelation {
    readonly tag = "Has";

    constructor(readonly pos: Meta, readonly signature: Signature<Pattern>) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Pattern>>(
        signature,
        "Signature<Pattern>",
        Signature
      );
    }

    match<$T>(p: $p_PredicateRelation<$T>): $T {
      return p.Has(this.pos, this.signature);
    }

    static has_instance(x: any) {
      return x instanceof Has;
    }
  }

  return { Not, Has };
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
    readonly tag = "HasRole";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly name: Pattern
    ) {
      super();
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
    readonly tag = "HasType";

    constructor(
      readonly pos: Meta,
      readonly typ: TypeApp,
      readonly name: Pattern
    ) {
      super();
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
    readonly tag = "Variant";

    constructor(
      readonly pos: Meta,
      readonly typ: Name,
      readonly variant: Name
    ) {
      super();
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
    readonly tag = "Global";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Variable";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Wildcard";

    constructor(readonly pos: Meta) {
      super();
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
    readonly tag = "Lit";

    constructor(readonly lit: Literal) {
      super();
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
    readonly tag = "And";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
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
    readonly tag = "Or";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
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
    readonly tag = "Not";

    constructor(readonly pos: Meta, readonly value: Constraint) {
      super();
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
    readonly tag = "Equal";

    constructor(
      readonly pos: Meta,
      readonly left: Constraint,
      readonly right: Constraint
    ) {
      super();
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
    readonly tag = "Variable";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Parens";

    constructor(readonly pos: Meta, readonly value: Constraint) {
      super();
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
    readonly tag = "Lit";

    constructor(readonly lit: Literal) {
      super();
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
    readonly tag = "Unary";

    constructor(readonly pos: Meta, readonly self: T, readonly name: Name) {
      super();
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
    readonly tag = "Binary";

    constructor(
      readonly pos: Meta,
      readonly op: Name,
      readonly left: T,
      readonly right: T
    ) {
      super();
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
    readonly tag = "Keyword";

    constructor(
      readonly pos: Meta,
      readonly self: T,
      readonly pairs: Pair<Name, T>[]
    ) {
      super();
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
    readonly tag = "Unary";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "Binary";

    constructor(readonly pos: Meta, readonly op: Name, readonly right: T) {
      super();
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
    readonly tag = "Keyword";

    constructor(readonly pos: Meta, readonly pairs: Pair<Name, T>[]) {
      super();
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
    readonly tag = "Many";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
    readonly tag = "One";

    constructor(readonly pos: Meta, readonly name: Name) {
      super();
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
  readonly tag = "Pair";

  constructor(readonly pos: Meta, readonly key: K, readonly value: V) {
    super();
    $assert_type<Meta>(pos, "Meta", Meta);
  }

  static has_instance(x: any) {
    return x instanceof Pair;
  }
}

export class Name extends Node {
  readonly tag = "Name";

  constructor(readonly pos: Meta, readonly name: string) {
    super();
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<string>(name, "string", $is_type("string"));
  }

  static has_instance(x: any) {
    return x instanceof Name;
  }
}

export class Namespace extends Node {
  readonly tag = "Namespace";

  constructor(readonly pos: Meta, readonly names: Name[]) {
    super();
    $assert_type<Meta>(pos, "Meta", Meta);
    $assert_type<Name[]>(names, "Name[]", $is_array(Name));
  }

  static has_instance(x: any) {
    return x instanceof Namespace;
  }
}

// == Grammar definition ============================================
export const grammar = Ohm.grammar(
  '\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\ndeclaration  = relationDeclaration  -- alt1\n | predicateDeclaration  -- alt2\n | doDeclaration  -- alt3\n | commandDeclaration  -- alt4\n | roleDeclaration  -- alt5\n | typeDeclaration  -- alt6\n | enumDeclaration  -- alt7\n | defineDeclaration  -- alt8\n | sceneDeclaration  -- alt9\n\n\nrelationDeclaration  = relation_ logicSignature<relationPart> s<";">  -- alt1\n\n\nrelationPart  = name s<"*">  -- alt1\n | name  -- alt2\n\n\npredicateDeclaration  = predicate_ logicSignature<name> block<predicateClause>  -- alt1\n\n\npredicateClause  = when_ predicate s<";">  -- alt1\n\n\ndoDeclaration  = do_ statementBlock<statement>  -- alt1\n\n\ncommandDeclaration  = command_ signature<parameter> s<"="> foreignBody  -- alt1\n | command_ signature<parameter> statementBlock<statement>  -- alt2\n\n\nforeignBody  = namespace s<"("> listOf<name, s<",">> s<")"> s<";">  -- alt1\n\n\nparameter  = name  -- alt1\n | s<"("> name is_ typeApp s<")">  -- alt2\n | atom  -- alt3\n\n\ntypeApp  = typeAppUnion  -- alt1\n\n\ntypeAppUnion  = typeAppPrimary s<"|"> typeAppUnion  -- alt1\n | typeAppPrimary  -- alt2\n\n\ntypeAppPrimary  = atom  -- alt1\n | s<"("> typeApp s<")">  -- alt2\n\n\ntypeDeclaration  = singleton_ basicType typeInitBlock  -- alt1\n | basicType s<";">  -- alt2\n\n\nbasicType  = type_ atom roles  -- alt1\n\n\ntypeInitBlock  = block<typeInit>  -- alt1\n | s<";">  -- alt2\n\n\ntypeInit  = partialLogicSignature<invokePostfix> s<";">  -- alt1\n | command_ partialSignature<parameter> s<"="> foreignBody  -- alt2\n | command_ partialSignature<parameter> statementBlock<statement>  -- alt3\n\n\nroleDeclaration  = role_ atom s<";">  -- alt1\n\n\nenumDeclaration  = enum_ atom s<"="> s<"|">? nonemptyListOf<variant, s<"|">> s<";">  -- alt1\n\n\nvariant  = atom roles  -- alt1\n\n\nroles  = s<"::"> nonemptyListOf<atom, s<",">>  -- alt1\n |   -- alt2\n\n\ndefineDeclaration  = define_ atom s<"="> atomicExpression s<";">  -- alt1\n\n\nsceneDeclaration  = scene_ atom statementBlock<statement>  -- alt1\n\n\npredicate  = predicateRelations if_ constraint  -- alt1\n | predicateRelations  -- alt2\n\n\npredicateRelations  = nonemptyListOf<predicateRelation, s<",">>  -- alt1\n\n\npredicateRelation  = not_ logicSignature<pattern>  -- alt1\n | logicSignature<pattern>  -- alt2\n\n\npattern  = s<"("> patternComplex s<")">  -- alt1\n | atom s<"."> atom  -- alt2\n | atom  -- alt3\n | literal  -- alt4\n | patternName  -- alt5\n\n\npatternComplex  = patternName is_ typeApp  -- alt1\n | patternName s<"::"> atom  -- alt2\n\n\npatternName  = s<"_">  -- alt1\n | name  -- alt2\n\n\nconstraint  = constraint and_ constraint  -- alt1\n | constraint or_ constraint  -- alt2\n | constraint200  -- alt3\n\n\nconstraint200  = not_ constraint300  -- alt1\n | constraint300  -- alt2\n\n\nconstraint300  = constraint400 s<"==="> constraint400  -- alt1\n | constraint400  -- alt2\n\n\nconstraint400  = name  -- alt1\n | literal  -- alt2\n | s<"("> constraint s<")">  -- alt3\n\n\nstatement  = letStatement  -- alt1\n | factStatement  -- alt2\n | forgetStatement  -- alt3\n | gotoStatement  -- alt4\n | callStatement  -- alt5\n | expression  -- alt6\n\n\nletStatement  = let_ name s<"="> expression  -- alt1\n\n\nfactStatement  = fact_ logicSignature<invokePostfix>  -- alt1\n\n\nforgetStatement  = fact_ logicSignature<invokePostfix>  -- alt1\n\n\ngotoStatement  = goto_ atom  -- alt1\n\n\ncallStatement  = call_ atom  -- alt1\n\n\nexpression  = searchExpression  -- alt1\n | invokeInfixExpression  -- alt2\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\ninvokeInfixExpression  = invokeMixfix infix_symbol invokeInfixExpression  -- alt1\n | invokeMixfix  -- alt2\n\n\ninvokeMixfix  = castExpression signaturePair<invokePostfix>  -- alt1\n | castExpression  -- alt2\n\n\ncastExpression  = invokePostfix as_ typeAppPrimary  -- alt1\n | invokePostfix  -- alt2\n\n\ninvokePostfix  = invokePostfix atom  -- alt1\n | primaryExpression  -- alt2\n\n\nprimaryExpression  = newExpression  -- alt1\n | literalExpression  -- alt2\n | recordExpression<expression>  -- alt3\n | listExpression<expression>  -- alt4\n | self_  -- alt5\n | atom  -- alt6\n | name  -- alt7\n | s<"("> expression s<")">  -- alt8\n\n\nnewExpression  = new_ atom  -- alt1\n | atom s<"."> atom  -- alt2\n\n\nlistExpression<e>  = s<"["> listOf<e, s<",">> s<",">? s<"]">  -- alt1\n\n\nrecordExpression<e>  = s<"["> s<"->"> s<"]">  -- alt1\n | s<"["> nonemptyListOf<recordPair<e>, s<",">> s<",">? s<"]">  -- alt2\n\n\nrecordPair<e>  = name s<"->"> e  -- alt1\n\n\nliteralExpression  = literal  -- alt1\n\n\natomicExpression  = newExpression  -- alt1\n | literalExpression  -- alt2\n | recordExpression<atomicExpression>  -- alt3\n | listExpression<atomicExpression>  -- alt4\n\n\nliteral  = text  -- alt1\n | integer  -- alt2\n | boolean  -- alt3\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = s<t_text>  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\natom  = ~reserved s<t_atom> ~":"  -- alt1\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nnamespace  = nonemptyListOf<atom, s<".">>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\npartialLogicSignature<t>  = signaturePair<t>+  -- alt1\n | atom  -- alt2\n\n\npartialSignature<t>  = signaturePair<t>+  -- alt1\n | infix_symbol t  -- alt2\n | atom  -- alt3\n | not  -- alt4\n\n\nsignature<t>  = t signaturePair<t>+  -- alt1\n | t infix_symbol t  -- alt2\n | t atom  -- alt3\n | not t  -- alt4\n\n\nstatementBlock<t>  = s<"{"> listOf<t, s<";">> s<";">? s<"}">  -- alt1\n\n\nblock<t>  = s<"{"> t* s<"}">  -- alt1\n\n\ns<p>  = space* p  -- alt1\n\n\nheader (a file header) = space* "%" hs* "crochet" nl  -- alt1\n\n\nhs  = " "  -- alt1\n | "\\t"  -- alt2\n\n\nnl  = "\\n"  -- alt1\n | "\\r"  -- alt2\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = "//" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\natom_start  = "a".."z"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom ":"  -- alt1\n\n\nname_start  = "A".."Z"  -- alt1\n | "_"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = "+"  -- alt1\n | "-"  -- alt2\n | "*"  -- alt3\n | "/"  -- alt4\n | "<"  -- alt5\n | ">"  -- alt6\n | "<="  -- alt7\n | ">="  -- alt8\n | "==="  -- alt9\n | "=/="  -- alt10\n | and_  -- alt11\n | or_  -- alt12\n\n\ndec_digit  = "0".."9"  -- alt1\n | "_"  -- alt2\n\n\nt_integer (an integer) = ~"_" dec_digit+  -- alt1\n\n\ntext_character  = "\\\\" "\\""  -- alt1\n | ~"\\"" any  -- alt2\n\n\nt_text (a text) = "\\"" text_character* "\\""  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<"relation">  -- alt1\n\n\npredicate_  = kw<"predicate">  -- alt1\n\n\nwhen_  = kw<"when">  -- alt1\n\n\ndo_  = kw<"do">  -- alt1\n\n\ncommand_  = kw<"command">  -- alt1\n\n\ntype_  = kw<"type">  -- alt1\n\n\nrole_  = kw<"role">  -- alt1\n\n\nenum_  = kw<"enum">  -- alt1\n\n\ndefine_  = kw<"define">  -- alt1\n\n\nsingleton_  = kw<"singleton">  -- alt1\n\n\nscene_  = kw<"scene">  -- alt1\n\n\nlet_  = kw<"let">  -- alt1\n\n\nreturn_  = kw<"return">  -- alt1\n\n\nfact_  = kw<"fact">  -- alt1\n\n\nforget_  = kw<"forget">  -- alt1\n\n\nnew_  = kw<"new">  -- alt1\n\n\nsearch_  = kw<"search">  -- alt1\n\n\nif_  = kw<"if">  -- alt1\n\n\ngoto_  = kw<"goto">  -- alt1\n\n\ncall_  = kw<"call">  -- alt1\n\n\ntrue_  = kw<"true">  -- alt1\n\n\nfalse_  = kw<"false">  -- alt1\n\n\nnot_  = kw<"not">  -- alt1\n\n\nand_  = kw<"and">  -- alt1\n\n\nor_  = kw<"or">  -- alt1\n\n\nis_  = kw<"is">  -- alt1\n\n\nself_  = kw<"self">  -- alt1\n\n\nas_  = kw<"as">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | command_  -- alt5\n | scene_  -- alt6\n | type_  -- alt7\n | role_  -- alt8\n | enum_  -- alt9\n | define_  -- alt10\n | singleton_  -- alt11\n | goto_  -- alt12\n | call_  -- alt13\n | let_  -- alt14\n | return_  -- alt15\n | fact_  -- alt16\n | forget_  -- alt17\n | new_  -- alt18\n | search_  -- alt19\n | if_  -- alt20\n | true_  -- alt21\n | false_  -- alt22\n | not_  -- alt23\n | and_  -- alt24\n | or_  -- alt25\n | is_  -- alt26\n | self_  -- alt27\n | as_  -- alt28\n\r\n  }\r\n  '
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
    return new Declaration.Predicate($meta(this), l, c);
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

  predicate(x: Ohm.Node): any {
    return x.toAST();
  },

  predicate_alt1(
    this: Ohm.Node,
    rs$0: Ohm.Node,
    _2: Ohm.Node,
    c$0: Ohm.Node
  ): any {
    const rs = rs$0.toAST();
    const c = c$0.toAST();
    return new Predicate($meta(this), rs, c);
  },

  predicate_alt2(this: Ohm.Node, rs$0: Ohm.Node): any {
    const rs = rs$0.toAST();
    return new Predicate(
      $meta(this),
      rs,
      new Constraint.Lit(new Literal.True($meta(this)))
    );
  },

  predicateRelations(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateRelations_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  predicateRelation(x: Ohm.Node): any {
    return x.toAST();
  },

  predicateRelation_alt1(this: Ohm.Node, _1: Ohm.Node, s$0: Ohm.Node): any {
    const s = s$0.toAST();
    return new PredicateRelation.Not($meta(this), s);
  },

  predicateRelation_alt2(this: Ohm.Node, s$0: Ohm.Node): any {
    const s = s$0.toAST();
    return new PredicateRelation.Has($meta(this), s);
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

  constraint300_alt2(this: Ohm.Node, _1: Ohm.Node): any {
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

  statement_alt6(this: Ohm.Node, e$0: Ohm.Node): any {
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

  expression(x: Ohm.Node): any {
    return x.toAST();
  },

  expression_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  expression_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.children[0].toAST();
  },

  searchExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  searchExpression_alt1(this: Ohm.Node, _1: Ohm.Node, p$0: Ohm.Node): any {
    const p = p$0.toAST();
    return new Expression.Search($meta(this), p);
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
    return new Expression.Self($meta(this));
  },

  primaryExpression_alt6(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Global($meta(this), n);
  },

  primaryExpression_alt7(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Variable($meta(this), n);
  },

  primaryExpression_alt8(
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

  signature_alt1(this: Ohm.Node, s$0: Ohm.Node, kws$0: Ohm.Node): any {
    const s = s$0.toAST();
    const kws = kws$0.toAST();
    return new Signature.Keyword($meta(this), s, kws);
  },

  signature_alt2(
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

  t_infix_symbol_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt2(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt3(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt4(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt5(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt6(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt7(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt8(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt9(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt10(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt11(this: Ohm.Node, _1: Ohm.Node): any {
    return this.sourceString;
  },

  t_infix_symbol_alt12(this: Ohm.Node, _1: Ohm.Node): any {
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

  kw_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return (() => {
      throw new Error(`Undefined rule kw`);
    })();
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
};
semantics.addOperation("toAST()", toAstVisitor);

function toAst(result: Ohm.MatchResult) {
  return semantics(result).toAST();
}

