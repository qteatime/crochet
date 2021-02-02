export abstract class IRNode {}

export class Module extends IRNode {
  constructor(readonly declarations: Declaration[]) {
    super();
  }
}

//== Declaration
export abstract class Declaration extends IRNode {}

export class DefineScene extends Declaration {
  constructor(readonly name: string, readonly body: Operation[]) {
    super();
  }
}

export class Do extends Declaration {
  constructor(readonly body: Operation[]) {
    super();
  }
}

export class DefineCommand extends Declaration {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly body: Operation[]
  ) {
    super();
  }
}

export class DefineForeignCommand extends Declaration {
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
export abstract class Operation extends IRNode {}

export class PushInteger extends Operation {
  constructor(readonly value: bigint) {
    super();
  }
}

export class PushFloat extends Operation {
  constructor(readonly value: number) {
    super();
  }
}

export class PushText extends Operation {
  constructor(readonly value: string) {
    super();
  }
}

export class PushBoolean extends Operation {
  constructor(readonly value: boolean) {
    super();
  }
}

export class PushLocal extends Operation {
  constructor(readonly name: string) {
    super();
  }
}

export class Invoke extends Operation {
  constructor(readonly name: string, readonly arity: number) {
    super();
  }
}

export class Return extends Operation {}

export class Halt extends Operation {}
