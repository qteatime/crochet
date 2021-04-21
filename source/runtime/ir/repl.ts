import { invoke, type_name } from "../primitives";
import { cvalue, State, Thread } from "../vm";
import { Declaration } from "./declaration";
import { SBlock } from "./statement";

export abstract class REPLExpr {
  abstract evaluate(state: State): Promise<void>;
}

export class REPLDeclarations extends REPLExpr {
  constructor(readonly declarations: Declaration[]) {
    super();
  }

  async evaluate(state: State) {
    for (const x of this.declarations) {
      await x.apply(
        {
          filename: state.env.module.filename,
          module: state.env.module,
          package: state.env.module.pkg,
        },
        state
      );
    }
  }
}

export class REPLStatements extends REPLExpr {
  constructor(readonly statements: SBlock) {
    super();
  }

  async evaluate(state: State) {
    const machine = this.statements.evaluate(state);
    const result = cvalue(await Thread.for_machine(machine).run_and_wait());
    const repr_machine = invoke(state, "_ text:", [
      state.world.globals.lookup("crochet.core::representation"),
      result,
    ]);
    const repr = cvalue(await Thread.for_machine(repr_machine).run_and_wait());
    console.log(`(${type_name(result)}) ${repr.to_text(true)}`);
  }
}