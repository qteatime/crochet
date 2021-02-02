import * as IR from "../../ir/operations";

type Name = string;

export class Signature {
  constructor(readonly name: Name, readonly parameters: Name[]) {}
}

export class UseSignature {
  constructor(readonly name: Name, readonly args: Expression[]) {}
}

export abstract class Node {}

export class Program extends Node {
  constructor(readonly filename: string, readonly declarations: Declaration[]) {
    super();
  }

  compile() {
    return new IR.Module(this.filename, [...this._compile()]);
  }

  private *_compile() {
    for (const declaration of this.declarations) {
      yield* declaration.compile();
    }
  }
}

//== Declaration
export abstract class Declaration extends Node {
  abstract compile(): Generator<IR.Declaration>;
}

export class DScene extends Declaration {
  constructor(readonly name: Name, readonly body: Statement[]) {
    super();
  }

  *compile() {
    yield new IR.DefineScene(
      this.name,
      to_list(this.body.map((x) => x.compile()))
    );
  }
}

export class DDo extends Declaration {
  constructor(readonly body: Statement[]) {
    super();
  }

  *compile() {
    yield new IR.Do(to_list(this.body.map((x) => x.compile())));
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

  *compile() {
    const mapping = new Map(this.signature.parameters.map((x, i) => [x, i]));
    const args = this.args.map((x) => mapping.get(x) as number);
    yield new IR.DefineForeignCommand(
      this.signature.name,
      this.signature.parameters,
      this.name,
      args
    );
  }
}

export class DLocalCommand extends Declaration {
  constructor(readonly signature: Signature, readonly body: Statement[]) {
    super();
  }

  *compile() {
    yield new IR.DefineCommand(
      this.signature.name,
      this.signature.parameters,
      to_list(this.body.map((x) => x.compile()))
    );
  }
}

//== Statement
export abstract class Statement extends Node {
  abstract compile(): Generator<IR.Operation>;
}

export class SExpression extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }

  *compile() {
    yield* this.expr.compile();
    yield new IR.Drop();
  }
}

export class SGoto extends Statement {
  constructor(readonly name: string) {
    super();
  }

  *compile() {
    yield new IR.Goto(this.name);
  }
}

export class SReturn extends Statement {
  constructor(readonly value: Expression) {
    super();
  }

  *compile() {
    yield* this.value.compile();
    yield new IR.Return();
  }
}

//== Expression
export abstract class Expression {
  abstract compile(): Generator<IR.Operation>;
}

export class EInvoke extends Statement {
  constructor(readonly command: UseSignature) {
    super();
  }

  *compile() {
    for (const arg of this.command.args) {
      yield* arg.compile();
    }
    yield new IR.Invoke(this.command.name, this.command.args.length);
  }
}

export class EText extends Expression {
  constructor(readonly value: string) {
    super();
  }

  *compile() {
    yield new IR.PushText(this.value);
  }
}

export class EInteger extends Expression {
  constructor(readonly value: bigint) {
    super();
  }

  *compile() {
    yield new IR.PushInteger(this.value);
  }
}

export class EFloat extends Expression {
  constructor(readonly value: number) {
    super();
  }

  *compile() {
    yield new IR.PushFloat(this.value);
  }
}

export class EBoolean extends Expression {
  constructor(readonly value: boolean) {
    super();
  }

  *compile() {
    yield new IR.PushBoolean(this.value);
  }
}

export class ENothing extends Expression {
  *compile() {
    yield new IR.PushNothing();
  }
}

export class EVariable extends Expression {
  constructor(readonly name: Name) {
    super();
  }

  *compile() {
    yield new IR.PushLocal(this.name);
  }
}

//== Utilities
function to_list(xss: Generator<IR.Operation>[]): IR.Operation[] {
  const result = [];
  for (const xs of xss) {
    for (const x of xs) {
      result.push(x);
    }
  }
  result.push(new IR.Halt());
  return result;
}
