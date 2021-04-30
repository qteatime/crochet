import { CrochetCommand, CrochetCommandBranch, Universe } from "../intrinsics";

export function add_branch(
  command: CrochetCommand,
  branch: CrochetCommandBranch
) {
  command.branches.push(branch);
}

export function get_command(universe: Universe, name: string, arity: number) {
  const command = universe.world.commands.try_lookup(name);
  if (command == null) {
    return new CrochetCommand(name, arity);
  } else {
    return command;
  }
}
