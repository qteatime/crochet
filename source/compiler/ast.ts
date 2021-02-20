export abstract class CrochetNode {}

export class Pair<K, V> extends CrochetNode {
  constructor(readonly key: K, readonly value: V) {
    super();
  }
}

// == Signatures ======================================================
export abstract class Signature<T> extends CrochetNode {
  abstract name: string;
  abstract values: T[];
}
export class KeywordSignature<T> extends Signature<T> {
  constructor(readonly self: T, readonly pairs: Pair<string, T>[]) {
    super();
  }

  get name() {
    return "_ " + this.pairs.map(x => x.key).join("");
  }

  get values() {
    return [this.self, ...this.pairs.map(x => x.value)];
  }
}

// == Multiplicity ====================================================
export abstract class MultiplicityType extends CrochetNode {}


// == Top level =======================================================
export class Program extends CrochetNode {
  constructor(readonly declarations: Declaration[]) {
    super();
  }
}

// == Declaration =====================================================
export abstract class Declaration extends CrochetNode {}

export class DoDeclaration extends Declaration {
  constructor(readonly body: Statement[]) {
    super();
  }
}

export class RelationDeclaration extends Declaration {
  constructor(readonly signature: Signature<MultiplicityType>) {
    super();
  }
}

// == Statement =======================================================
export abstract class Statement extends CrochetNode {}

export class ReturnStatement extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }
}

export class ExpressionStatement extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }
}

// == Expression ======================================================
export abstract class Expression extends CrochetNode {}

export class LiteralExpression extends Expression {
  constructor(readonly literal: Literal) {
    super();
  }
}

export class VariableExpression extends Expression {
  constructor(readonly name: string) {
    super();
  }
}

// == Literal =========================================================
export abstract class Literal extends CrochetNode {}

export class TextLiteral extends Literal {
  constructor(readonly value: string) {
    super();
  }
}

export class TrueLiteral extends Literal {}
export class FalseLiteral extends Literal {}