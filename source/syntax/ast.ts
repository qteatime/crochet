type Name = string;

export class Signature {
  constructor(readonly name: Name, readonly parameters: Name[]) { }
}

export class UseSignature {
  constructor(readonly name: Name, readonly args: Expression[]) { }
}

export abstract class Node { }

export class Program extends Node {
  constructor(readonly declarations: Declaration[]) {
    super();
  }
}

//== Declaration
export abstract class Declaration extends Node { }

export class DScene extends Declaration {
  constructor(readonly name: Name, readonly body: Statement[]) {
    super();
  }
}

export class DDo extends Declaration {
  constructor(readonly body: Statement[]) {
    super();
  }
}

export class DFFICommand extends Declaration {
  constructor(
    readonly signature: Signature,
    readonly name: Name,
    readonly args: Name[]
  ) {
    super();
  }
}

export class DLocalCommand extends Declaration {
  constructor(readonly signature: Signature, readonly body: Statement[]) {
    super();
  }
}

//== Statement
export abstract class Statement extends Node { }

export class SExpression extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }
}

export class SReturn extends Statement {
  constructor(readonly value: Expression) {
    super();
  }
}

//== Expression
export abstract class Expression { }

export class EInvoke extends Statement {
  constructor(readonly command: UseSignature) {
    super();
  }
}

export class EText extends Expression {
  constructor(readonly value: string) {
    super();
  }
}

export class EInteger extends Expression {
  constructor(readonly value: bigint) {
    super();
  }
}

export class EFloat extends Expression {
  constructor(readonly value: number) {
    super();
  }
}

export class EBoolean extends Expression {
  constructor(readonly value: boolean) {
    super();
  }
}

export class EVariable extends Expression {
  constructor(readonly name: Name) {
    super();
  }
}
