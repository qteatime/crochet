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

  ForeignCommand(
    pos: Meta,
    signature: Signature<Parameter>,
    foreign_name: Namespace,
    args: Name[]
  ): $T;

  Command(pos: Meta, signature: Signature<Parameter>, body: Statement[]): $T;
};

export abstract class Declaration extends Node {
  abstract tag: "Relation" | "Predicate" | "Do" | "ForeignCommand" | "Command";
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

  static has_instance(x: any) {
    return x instanceof Declaration;
  }
}

const $Declaration = {
  Relation: class Relation extends Declaration {
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
  },

  Predicate: class Predicate extends Declaration {
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
  },

  Do: class Do extends Declaration {
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
  },

  ForeignCommand: class ForeignCommand extends Declaration {
    readonly tag = "ForeignCommand";

    constructor(
      readonly pos: Meta,
      readonly signature: Signature<Parameter>,
      readonly foreign_name: Namespace,
      readonly args: Name[]
    ) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Signature<Parameter>>(
        signature,
        "Signature<Parameter>",
        Signature
      );
      $assert_type<Namespace>(foreign_name, "Namespace", Namespace);
      $assert_type<Name[]>(args, "Name[]", $is_array(Name));
    }

    match<$T>(p: $p_Declaration<$T>): $T {
      return p.ForeignCommand(
        this.pos,
        this.signature,
        this.foreign_name,
        this.args
      );
    }

    static has_instance(x: any) {
      return x instanceof ForeignCommand;
    }
  },

  Command: class Command extends Declaration {
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
  },
};

type $p_Parameter<$T> = {
  Untyped(pos: Meta, name: Name): $T;

  Typed(pos: Meta, name: Name, typ: TypeApp): $T;
};

export abstract class Parameter extends Node {
  abstract tag: "Untyped" | "Typed";
  abstract match<$T>(p: $p_Parameter<$T>): $T;

  static get Untyped() {
    return $Parameter.Untyped;
  }

  static get Typed() {
    return $Parameter.Typed;
  }

  static has_instance(x: any) {
    return x instanceof Parameter;
  }
}

const $Parameter = {
  Untyped: class Untyped extends Parameter {
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
  },

  Typed: class Typed extends Parameter {
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
  },
};

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

const $TypeApp = {
  Union: class Union extends TypeApp {
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
  },

  Named: class Named extends TypeApp {
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
  },

  Parens: class Parens extends TypeApp {
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
  },
};

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

const $PredicateEffect = {
  Trivial: class Trivial extends PredicateEffect {
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
  },
};

type $p_Statement<$T> = {
  Fact(pos: Meta, signature: Signature<Expression>): $T;

  Forget(pos: Meta, signature: Signature<Expression>): $T;

  Return(pos: Meta, value: Expression): $T;

  Let(pos: Meta, name: Name, value: Expression): $T;

  Expr(value: Expression): $T;
};

export abstract class Statement extends Node {
  abstract tag: "Fact" | "Forget" | "Return" | "Let" | "Expr";
  abstract match<$T>(p: $p_Statement<$T>): $T;

  static get Fact() {
    return $Statement.Fact;
  }

  static get Forget() {
    return $Statement.Forget;
  }

  static get Return() {
    return $Statement.Return;
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

const $Statement = {
  Fact: class Fact extends Statement {
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
  },

  Forget: class Forget extends Statement {
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
  },

  Return: class Return extends Statement {
    readonly tag = "Return";

    constructor(readonly pos: Meta, readonly value: Expression) {
      super();
      $assert_type<Meta>(pos, "Meta", Meta);
      $assert_type<Expression>(value, "Expression", Expression);
    }

    match<$T>(p: $p_Statement<$T>): $T {
      return p.Return(this.pos, this.value);
    }

    static has_instance(x: any) {
      return x instanceof Return;
    }
  },

  Let: class Let extends Statement {
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
  },

  Expr: class Expr extends Statement {
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
  },
};

type $p_Expression<$T> = {
  Parens(pos: Meta, value: Expression): $T;

  Variable(pos: Meta, name: Name): $T;

  Search(pos: Meta, predicate: Predicate): $T;

  Lit(value: Literal): $T;
};

export abstract class Expression extends Node {
  abstract tag: "Parens" | "Variable" | "Search" | "Lit";
  abstract match<$T>(p: $p_Expression<$T>): $T;

  static get Parens() {
    return $Expression.Parens;
  }

  static get Variable() {
    return $Expression.Variable;
  }

  static get Search() {
    return $Expression.Search;
  }

  static get Lit() {
    return $Expression.Lit;
  }

  static has_instance(x: any) {
    return x instanceof Expression;
  }
}

const $Expression = {
  Parens: class Parens extends Expression {
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
  },

  Variable: class Variable extends Expression {
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
  },

  Search: class Search extends Expression {
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
  },

  Lit: class Lit extends Expression {
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
  },
};

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

const $Literal = {
  False: class False extends Literal {
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
  },

  True: class True extends Literal {
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
  },

  Text: class Text extends Literal {
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
  },

  Integer: class Integer extends Literal {
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
  },
};

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

const $PredicateRelation = {
  Not: class Not extends PredicateRelation {
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
  },

  Has: class Has extends PredicateRelation {
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
  },
};

type $p_Pattern<$T> = {
  Variable(pos: Meta, name: Name): $T;

  Wildcard(pos: Meta): $T;

  Lit(lit: Literal): $T;
};

export abstract class Pattern extends Node {
  abstract tag: "Variable" | "Wildcard" | "Lit";
  abstract match<$T>(p: $p_Pattern<$T>): $T;

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

const $Pattern = {
  Variable: class Variable extends Pattern {
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
  },

  Wildcard: class Wildcard extends Pattern {
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
  },

  Lit: class Lit extends Pattern {
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
  },
};

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

const $Constraint = {
  And: class And extends Constraint {
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
  },

  Or: class Or extends Constraint {
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
  },

  Not: class Not extends Constraint {
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
  },

  Equal: class Equal extends Constraint {
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
  },

  Variable: class Variable extends Constraint {
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
  },

  Parens: class Parens extends Constraint {
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
  },

  Lit: class Lit extends Constraint {
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
  },
};

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

const $Signature = {
  Unary: class Unary<T> extends Signature<T> {
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
  },

  Binary: class Binary<T> extends Signature<T> {
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
  },

  Keyword: class Keyword<T> extends Signature<T> {
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
  },
};

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

const $RelationPart = {
  Many: class Many extends RelationPart {
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
  },

  One: class One extends RelationPart {
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
  },
};

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
  '\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\ndeclaration  = relationDeclaration  -- alt1\n | predicateDeclaration  -- alt2\n | doDeclaration  -- alt3\n | commandDeclaration  -- alt4\n\n\nrelationDeclaration  = relation_ logicSignature<relationPart> s<";">  -- alt1\n\n\nrelationPart  = name s<"*">  -- alt1\n | name  -- alt2\n\n\npredicateDeclaration  = predicate_ logicSignature<name> block<predicateClause>  -- alt1\n\n\npredicateClause  = when_ predicate ";"  -- alt1\n\n\ndoDeclaration  = do_ statementBlock<statement>  -- alt1\n\n\ncommandDeclaration  = command_ signature<parameter> s<"="> namespace s<"("> listOf<name, s<",">> s<")"> s<";">  -- alt1\n | command_ signature<parameter> statementBlock<statement>  -- alt2\n\n\nparameter  = name  -- alt1\n | s<"("> name is_ typeApp s<")">  -- alt2\n\n\ntypeApp  = typeAppUnion  -- alt1\n\n\ntypeAppUnion  = typeAppNamed s<"|"> typeAppUnion  -- alt1\n | typeAppNamed  -- alt2\n\n\ntypeAppNamed  = s<"#"> atom  -- alt1\n | s<"("> typeApp s<")">  -- alt2\n\n\npredicate  = predicateRelations if_ constraint  -- alt1\n | predicateRelations  -- alt2\n\n\npredicateRelations  = nonemptyListOf<predicateRelation, s<",">>  -- alt1\n\n\npredicateRelation  = not_ logicSignature<pattern>  -- alt1\n | logicSignature<pattern>  -- alt2\n\n\npattern  = s<"_">  -- alt1\n | name  -- alt2\n | literal  -- alt3\n\n\nconstraint  = constraint and_ constraint  -- alt1\n | constraint or_ constraint  -- alt2\n | constraint200  -- alt3\n\n\nconstraint200  = not_ constraint300  -- alt1\n | constraint300  -- alt2\n\n\nconstraint300  = constraint400 s<"==="> constraint400  -- alt1\n | constraint400  -- alt2\n\n\nconstraint400  = name  -- alt1\n | literal  -- alt2\n | "(" constraint ")"  -- alt3\n\n\nstatement  = letStatement  -- alt1\n | factStatement  -- alt2\n | forgetStatement  -- alt3\n | returnStatement  -- alt4\n | expression  -- alt5\n\n\nletStatement  = let_ name s<"="> expression  -- alt1\n\n\nfactStatement  = fact_ logicSignature<expression>  -- alt1\n\n\nforgetStatement  = fact_ logicSignature<expression>  -- alt1\n\n\nreturnStatement  = return_ expression  -- alt1\n\n\nexpression  = searchExpression  -- alt1\n | primaryExpression  -- alt2\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\nprimaryExpression  = literal  -- alt1\n | name  -- alt2\n | "(" expression ")"  -- alt3\n\n\nliteral  = text  -- alt1\n | boolean  -- alt2\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = s<t_text>  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\natom  = s<t_atom>  -- alt1\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nnamespace  = nonemptyListOf<atom, s<".">>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\nsignature<t>  = t signaturePair<t>+  -- alt1\n | t infix_symbol t  -- alt2\n | t atom  -- alt3\n | not T  -- alt4\n\n\nstatementBlock<t>  = s<"{"> listOf<t, s<";">> s<";">? s<"}">  -- alt1\n\n\nblock<t>  = s<"{"> t* s<"}">  -- alt1\n\n\ns<p>  = space* p  -- alt1\n\n\nheader (a file header) = space* "%" hs* "crochet" nl  -- alt1\n\n\nhs  = " "  -- alt1\n | "\\t"  -- alt2\n\n\nnl  = "\\n"  -- alt1\n | "\\r"  -- alt2\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = "//" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\natom_start  = "a".."z"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom ":"  -- alt1\n\n\nname_start  = "A".."Z"  -- alt1\n | "_"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = "+"  -- alt1\n | "-"  -- alt2\n | "*"  -- alt3\n | "/"  -- alt4\n | "<"  -- alt5\n | ">"  -- alt6\n | "<="  -- alt7\n | ">="  -- alt8\n | "==="  -- alt9\n | "=/="  -- alt10\n | and_  -- alt11\n | or_  -- alt12\n\n\ndec_digit  = "0".."9"  -- alt1\n | "_"  -- alt2\n\n\nt_integer (an integer) = ~"_" dec_digit+  -- alt1\n\n\ntext_character  = "\\\\" "\\""  -- alt1\n | ~"\\"" any  -- alt2\n\n\nt_text (a text) = "\\"" text_character* "\\""  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<"relation">  -- alt1\n\n\npredicate_  = kw<"predicate">  -- alt1\n\n\nwhen_  = kw<"when">  -- alt1\n\n\ndo_  = kw<"do">  -- alt1\n\n\nlet_  = kw<"let">  -- alt1\n\n\nreturn_  = kw<"return">  -- alt1\n\n\nfact_  = kw<"fact">  -- alt1\n\n\nforget_  = kw<"forget">  -- alt1\n\n\nsearch_  = kw<"search">  -- alt1\n\n\nif_  = kw<"if">  -- alt1\n\n\ntrue_  = kw<"true">  -- alt1\n\n\nfalse_  = kw<"false">  -- alt1\n\n\nnot_  = kw<"not">  -- alt1\n\n\nand_  = kw<"and">  -- alt1\n\n\nor_  = kw<"or">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | let_  -- alt5\n | return_  -- alt6\n | fact_  -- alt7\n | forget_  -- alt8\n | search_  -- alt9\n | if_  -- alt10\n | true_  -- alt11\n | false_  -- alt12\n | not_  -- alt13\n | and_  -- alt14\n | or_  -- alt15\n\r\n  }\r\n  '
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
    n$0: Ohm.Node,
    _5: Ohm.Node,
    xs$0: Ohm.Node,
    _7: Ohm.Node,
    _8: Ohm.Node
  ): any {
    const s = s$0.toAST();
    const n = n$0.toAST();
    const xs = xs$0.toAST();
    return new Declaration.ForeignCommand($meta(this), s, n, xs);
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

  typeAppNamed(x: Ohm.Node): any {
    return x.toAST();
  },

  typeAppNamed_alt1(this: Ohm.Node, _1: Ohm.Node, t$0: Ohm.Node): any {
    const t = t$0.toAST();
    return new TypeApp.Named($meta(this), t);
  },

  typeAppNamed_alt2(
    this: Ohm.Node,
    _1: Ohm.Node,
    t$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const t = t$0.toAST();
    return new TypeApp.Parens($meta(this), t);
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

  pattern_alt1(this: Ohm.Node, _1: Ohm.Node): any {
    return new Pattern.Wildcard($meta(this));
  },

  pattern_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Pattern.Variable($meta(this), n);
  },

  pattern_alt3(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Pattern.Lit(l);
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

  statement_alt5(this: Ohm.Node, e$0: Ohm.Node): any {
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

  returnStatement(x: Ohm.Node): any {
    return x.toAST();
  },

  returnStatement_alt1(this: Ohm.Node, _1: Ohm.Node, e$0: Ohm.Node): any {
    const e = e$0.toAST();
    return new Statement.Return($meta(this), e);
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

  primaryExpression(x: Ohm.Node): any {
    return x.toAST();
  },

  primaryExpression_alt1(this: Ohm.Node, l$0: Ohm.Node): any {
    const l = l$0.toAST();
    return new Expression.Lit(l);
  },

  primaryExpression_alt2(this: Ohm.Node, n$0: Ohm.Node): any {
    const n = n$0.toAST();
    return new Expression.Variable($meta(this), n);
  },

  primaryExpression_alt3(
    this: Ohm.Node,
    _1: Ohm.Node,
    e$0: Ohm.Node,
    _3: Ohm.Node
  ): any {
    const e = e$0.toAST();
    return new Expression.Parens($meta(this), e);
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
};
semantics.addOperation("toAST()", toAstVisitor);

function toAst(result: Ohm.MatchResult) {
  return semantics(result).toAST();
}

