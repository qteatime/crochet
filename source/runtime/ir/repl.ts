import { cast } from "../../utils/utils";
import {
  ContractCondition,
  get_string,
  invoke,
  ProcedureBranch,
  TCrochetType,
} from "../primitives";
import { cvalue, State, Thread } from "../vm";
import { Declaration } from "./declaration";
import { SBlock } from "./statement";
import { Type } from "./type";

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
    const printer_type = cast(
      state.world.types.lookup("crochet.core::debug-printer"),
      TCrochetType
    );
    const printer = printer_type.instantiate([]);
    const repr_machine = invoke(state, "_ show: _", [printer, result]);
    const repr = cvalue(await Thread.for_machine(repr_machine).run_and_wait());
    console.log(get_string(repr));
  }
}

export abstract class REPLCommand extends REPLExpr {}

export class CmdRollback extends REPLCommand {
  constructor(readonly name: string) {
    super();
  }

  async evaluate(state: State) {
    const procedure = state.world.procedures.lookup(this.name);
    procedure.rollback();
  }
}

export class CmdHelpCommand extends REPLCommand {
  constructor(readonly name: string, readonly types: Type[]) {
    super();
  }

  async evaluate(state: State) {
    const procedure = state.world.procedures.lookup(this.name);
    const types = this.types.map((x) => x.realise(state));
    const branches = [...procedure.select_subtype(types)];

    console.log(`${procedure.name} (${branches.length} branches matched)`);
    console.log("");
    branches.forEach((x) => this.describe_branch(x));
  }

  describe_branch(x: ProcedureBranch) {
    console.log(x.full_repr);
    const contract = x.procedure.contract;
    this.describe_contract(contract.pre, "Requires:");
    this.describe_contract(contract.post, "Ensures:");

    console.log("");
    console.log(indent(2, x.procedure.documentation));
    console.log("");
    console.log("---");
  }

  describe_contract(contracts: ContractCondition[], header: string) {
    if (contracts.length !== 0) {
      console.log(header);
      for (const x of contracts) {
        console.log(`  ${x.tag} :: ${x.expr.position.source_slice}`);
      }
    }
  }
}

export class CmdHelpType extends REPLCommand {
  constructor(readonly type: Type) {
    super();
  }

  async evaluate(state: State) {
    const type = this.type.realise(state);
    console.log(`${type.type_name} (${type.location})`);
    console.log("");
    if (type.parent != null) {
      console.log(`Refines: ${type.parent.type_name}`);
    }
    if (type instanceof TCrochetType && type.fields.length !== 0) {
      console.log(`Fields:`);
      type.fields.forEach((x, i) => {
        console.log(`  - ${x} is ${type.types[i].type_name}`);
      });
    }
    console.log("");
    console.log(type.documentation);
    console.log("");
    console.log("---");

    const procedures = [...state.world.procedures.select_matching(type)];
    console.log(`${procedures.length} procedures defined on this type`);
    for (const [procedure, branches] of procedures) {
      console.log(`${procedure.name}`);
      for (const branch of branches) {
        console.log(`  ${branch.full_repr}`);
        console.log(`    ${short(branch.procedure.documentation)}`);
        console.log("");
      }
    }
  }
}

function short(s: string) {
  const line = s.split(/\r\n|\r|\n/)[0] || "";
  if (line.length > 65) {
    return `${line.slice(0, 65)}...`;
  } else {
    return line;
  }
}

function indent(n: number, x: string) {
  return x
    .split(/\r\n|\r|\n/)
    .map((x) => " ".repeat(n) + x)
    .join("\n");
}
