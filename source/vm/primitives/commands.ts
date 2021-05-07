import { zip } from "../../utils/utils";
import * as Types from "./types";
import * as Location from "./location";
import * as Environments from "./environments";
import {
  Activation,
  CrochetActivation,
  CrochetCommand,
  CrochetCommandBranch,
  CrochetType,
  CrochetValue,
  Universe,
  _return,
} from "../intrinsics";
import { ErrArbitrary } from "../errors";

export function add_branch(
  command: CrochetCommand,
  branch: CrochetCommandBranch
) {
  assert_no_ambiguity([branch, ...command.branches], branch.types);
  command.versions.push(command.branches);
  command.branches.push(branch);
  command.branches.sort((b1, b2) => compare_branches(b1, b2));
}

// == Invocation
export function select_branch(command: CrochetCommand, values: CrochetValue[]) {
  const types = values.map((x) => x.type);
  for (const branch of command.branches) {
    if (branch_accepts(branch, types)) {
      return branch;
    }
  }

  throw new ErrArbitrary(
    "no-branch-matched",
    [
      "No definitions of command ",
      command.name,
      " matched the signature ",
      Location.command_signature(command.name, types),
      "\n",
      "The following arguments were provided:\n",
      values.map((x) => `  - ${Location.simple_value(x)}`).join("\n"),
      "\n\n",
      "The following branches are defined for the command:\n",
      command.branches
        .map((x) => `  - ${Location.branch_name_location(x)}`)
        .join("\n"),
    ].join("")
  );
}

export function prepare_activation(
  parent_activation: Activation,
  branch: CrochetCommandBranch,
  values: CrochetValue[]
) {
  const env = Environments.extend(
    branch.env,
    values.length === 0 ? null : values[0]
  );
  for (const [k, v] of zip(branch.parameters, values)) {
    env.define(k, v);
  }

  const activation = new CrochetActivation(
    parent_activation,
    branch,
    env,
    _return,
    branch.body
  );
  return activation;
}

// == Assertions
export function assert_no_ambiguity(
  branches: CrochetCommandBranch[],
  types: CrochetType[]
) {
  const selected = [...select_exact(branches, types)];
  if (selected.length > 1) {
    const dups = selected.map((x) => `  - ${Location.branch_name_location(x)}`);

    throw new ErrArbitrary(
      "ambiguous-dispatch",
      `Multiple ${
        selected[0].name
      } commands are activated by the same types, making them ambiguous:\n${dups.join(
        "\n"
      )}`
    );
  }
}

// == Selection
export function* select_exact(
  branches: CrochetCommandBranch[],
  types: CrochetType[]
) {
  outer: for (const branch of branches) {
    for (const [bt, t] of zip(branch.types, types)) {
      if (bt !== t) continue outer;
    }
    yield branch;
  }
}

// == Testing
export function compare_branches(
  b1: CrochetCommandBranch,
  b2: CrochetCommandBranch
) {
  for (const [t1, t2] of zip(b1.types, b2.types)) {
    const r = Types.compare(t1, t2);
    if (r !== 0) {
      return r;
    }
  }
  return 0;
}

export function branch_accepts(
  branch: CrochetCommandBranch,
  types: CrochetType[]
) {
  if (branch.types.length !== types.length) {
    return false;
  }

  for (const [bt, t] of zip(branch.types, types)) {
    if (!Types.is_subtype(t, bt)) {
      return false;
    }
  }

  return true;
}

// == Lookup
export function get_or_make_command(
  universe: Universe,
  name: string,
  arity: number
) {
  const command = universe.world.commands.try_lookup(name);
  if (command == null) {
    const command = new CrochetCommand(name, arity);
    universe.world.commands.define(name, command);
    return command;
  } else {
    return command;
  }
}

export function get_command(universe: Universe, name: string) {
  const command = universe.world.commands.try_lookup(name);
  if (command == null) {
    throw new ErrArbitrary(
      "undefined-command",
      `The command ${name} is not defined`
    );
  }
  return command;
}
