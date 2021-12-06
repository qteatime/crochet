import type { CrochetValue, ForeignInterface } from "../../../build/crochet";
import type {
  Universe,
  CrochetWorld,
  CrochetPackage,
  CrochetModule,
  CrochetType,
  CrochetCommand,
  CrochetCommandBranch,
} from "../../../build/vm/intrinsics";
import type * as IR from "../../../build/ir";

export default (ffi: ForeignInterface) => {
  function get_universe(x: CrochetValue): Universe {
    return ffi.unbox(x) as Universe;
  }

  function get_world(x: CrochetValue): CrochetWorld {
    return ffi.unbox(x) as CrochetWorld;
  }

  function get_package(x: CrochetValue): CrochetPackage {
    return ffi.unbox(x) as CrochetPackage;
  }

  function get_type(x: CrochetValue): CrochetType {
    return ffi.unbox(x) as CrochetType;
  }

  function get_module(x: CrochetValue): CrochetModule {
    return ffi.unbox(x) as CrochetModule;
  }

  function get_command(x: CrochetValue): CrochetCommand {
    return ffi.unbox(x) as CrochetCommand;
  }

  function get_branch(x: CrochetValue): CrochetCommandBranch {
    return ffi.unbox(x) as CrochetCommandBranch;
  }

  function maybe<A>(x: null | undefined | A) {
    if (x == null) {
      return ffi.nothing;
    } else {
      return ffi.box(x);
    }
  }

  ffi.defmachine("vm.universe", function* () {
    return ffi.box(ffi.universe);
  });

  ffi.defun("universe.world", (universe) => {
    return ffi.box(get_universe(universe).world);
  });

  ffi.defun("world.packages", (world) => {
    return ffi.list(
      [...get_world(world).packages.values()].map((x) => ffi.box(x))
    );
  });

  ffi.defun("world.commands", (world) => {
    return ffi.list(
      [...get_world(world).commands.values()].map((x) => ffi.box(x))
    );
  });

  ffi.defun("pkg.name", (pkg) => {
    return ffi.text(get_package(pkg).name);
  });

  ffi.defun("pkg.file", (pkg) => {
    return ffi.text(get_package(pkg).filename);
  });

  ffi.defun("pkg.dependencies", (pkg) => {
    return ffi.list([...get_package(pkg).dependencies].map((x) => ffi.text(x)));
  });

  ffi.defun("pkg.types", (pkg) => {
    const types = [...get_package(pkg).types.values()];
    return ffi.list(types.map((x) => ffi.box(x)));
  });

  ffi.defun("pkg.world", (pkg) => {
    return ffi.box(get_package(pkg).world);
  });

  ffi.defun("typ.sealed", (typ) => {
    return ffi.boolean(get_type(typ).sealed);
  });

  ffi.defun("typ.name", (typ) => {
    return ffi.text(get_type(typ).name);
  });

  ffi.defun("typ.documentation", (typ) => {
    return ffi.text(get_type(typ).documentation);
  });

  ffi.defun("typ.parent", (typ) => {
    return maybe(get_type(typ).parent);
  });

  ffi.defun("typ.module", (typ) => {
    return maybe(get_type(typ).module);
  });

  ffi.defun("typ.is-static", (typ) => {
    return ffi.boolean(get_type(typ).is_static);
  });

  ffi.defun("module.pkg", (mod) => {
    return ffi.box(get_module(mod).pkg);
  });

  ffi.defun("cmd.name", (cmd) => {
    return ffi.text(get_command(cmd).name);
  });

  ffi.defun("cmd.arity", (cmd) => {
    return ffi.integer(BigInt(get_command(cmd).arity));
  });

  ffi.defun("cmd.branches", (cmd) => {
    return ffi.list(get_command(cmd).branches.map((x) => ffi.box(x)));
  });

  ffi.defun("branch.name", (branch) => {
    return ffi.text(get_branch(branch).name);
  });

  ffi.defun("branch.documentation", (branch) => {
    return ffi.text(get_branch(branch).documentation);
  });

  ffi.defun("branch.module", (branch) => {
    return ffi.box(get_branch(branch).module);
  });

  ffi.defun("branch.ir", (branch) => {
    return ffi.from_json(get_branch(branch).body);
  });
};
