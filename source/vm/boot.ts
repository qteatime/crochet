import * as IR from "../ir";
import { unreachable } from "../utils/utils";
import { Thread } from "./evaluation";
import {
  Universe,
  CrochetCommandBranch,
  CrochetModule,
  CrochetPackage,
  CrochetType,
  CrochetWorld,
  Environment,
  CrochetTest,
  CrochetPrelude,
} from "./intrinsics";
import { Commands, Modules, Tests, Types, World } from "./primitives";

export function make_universe() {
  const world = new CrochetWorld();

  const Any = new CrochetType(null, "any", "", null, [], [], false, null);
  const Unknown = new CrochetType(
    null,
    "unknown",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const Nothing = new CrochetType(
    null,
    "nothing",
    "",
    Any,
    [],
    [],
    false,
    null
  );

  const Boolean = new CrochetType(
    null,
    "boolean",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const True = new CrochetType(null, "true", "", Boolean, [], [], false, null);
  const False = new CrochetType(
    null,
    "false",
    "",
    Boolean,
    [],
    [],
    false,
    null
  );

  const Numeric = new CrochetType(
    null,
    "numeric",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const Fractional = new CrochetType(
    null,
    "fractional",
    "",
    Numeric,
    [],
    [],
    false,
    null
  );
  const Integral = new CrochetType(
    null,
    "integral",
    "",
    Numeric,
    [],
    [],
    false,
    null
  );
  const Float = new CrochetType(
    null,
    "float",
    "",
    Fractional,
    [],
    [],
    false,
    null
  );
  const Integer = new CrochetType(
    null,
    "integer",
    "",
    Integral,
    [],
    [],
    false,
    null
  );

  const Text = new CrochetType(null, "text", "", Any, [], [], false, null);
  const StaticText = new CrochetType(
    null,
    "static-text",
    "",
    Text,
    [],
    [],
    false,
    null
  );
  const Interpolation = new CrochetType(
    null,
    "interpolation",
    "",
    Any,
    [],
    [],
    false,
    null
  );

  const Function = new CrochetType(
    null,
    "function",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const functions: CrochetType[] = [];
  for (let i = 0; i < 10; ++i) {
    functions.push(
      new CrochetType(null, `function-${i}`, "", Function, [], [], false, null)
    );
  }

  const Thunk = new CrochetType(null, "thunk", "", Any, [], [], false, null);
  const Record = new CrochetType(null, "record", "", Any, [], [], false, null);
  const Tuple = new CrochetType(null, "tuple", "", Any, [], [], false, null);
  const Enum = new CrochetType(null, "enum", "", Any, [], [], false, null);
  const Cell = new CrochetType(null, "cell", "", Any, [], [], false, null);
  const Type = new CrochetType(null, "type", "", Any, [], [], false, null);

  world.native_types.define("crochet.core/core.any", Any);
  world.native_types.define("crochet.core/core.unknown", Unknown);
  world.native_types.define("crochet.core/core.nothing", Nothing);
  world.native_types.define("crochet.core/core.boolean", Boolean);
  world.native_types.define("crochet.core/core.true", True);
  world.native_types.define("crochet.core/core.false", False);
  world.native_types.define("crochet.core/core.numeric", Numeric);
  world.native_types.define("crochet.core/core.fractional", Fractional);
  world.native_types.define("crochet.core/core.integral", Integral);
  world.native_types.define("crochet.core/core.float", Float);
  world.native_types.define("crochet.core/core.integer", Integer);
  world.native_types.define("crochet.core/core.text", Text);
  world.native_types.define("crochet.core/core.static-text", StaticText);
  world.native_types.define("crochet.core/core.interpolation", Interpolation);
  world.native_types.define("crochet.core/core.function", Function);
  for (const f of functions) {
    world.native_types.define(`crochet.core/core.${f.name}`, f);
  }
  world.native_types.define("crochet.core/core.thunk", Thunk);
  world.native_types.define("crochet.core/core.record", Record);
  world.native_types.define("crochet.core/core.tuple", Tuple);
  world.native_types.define("crochet.core/core.enum", Enum);
  world.native_types.define("crochet.core/core.cell", Cell);

  return new Universe(world, {
    Any,
    Unknown,
    Nothing,
    True,
    False,
    Integer,
    Float,
    Text,
    StaticText,
    Interpolation,
    Function: functions,
    Thunk,
    Record,
    Tuple,
    Enum,
    Type,
  });
}

export function load_module(
  universe: Universe,
  pkg: CrochetPackage,
  program: IR.Program
) {
  const module = new CrochetModule(pkg, program.filename);
  const t = IR.DeclarationTag;

  for (const x of program.declarations) {
    switch (x.tag) {
      case t.COMMAND: {
        const command = Commands.get_or_make_command(
          universe,
          x.name,
          x.parameters.length
        );

        const branch = new CrochetCommandBranch(
          module,
          new Environment(null, null, module),
          x.name,
          x.documentation,
          x.parameters,
          x.types.map((t) => Types.materialise_type(universe, module, t)),
          x.body,
          x.meta
        );

        Commands.add_branch(command, branch);
        continue;
      }

      case t.TYPE: {
        const parent = Types.materialise_type(universe, module, x.parent);
        const type = new CrochetType(
          module,
          x.name,
          x.documentation,
          parent,
          x.fields,
          x.types.map((t) => Types.materialise_type(universe, module, t)),
          false,
          x.meta
        );

        Types.define_type(module, x.name, type, x.visibility);
        continue;
      }

      case t.FOREIGN_TYPE: {
        const type = Types.get_foreign_type(universe, module, x.target);
        Types.define_type(module, x.name, type, IR.Visibility.GLOBAL);
        continue;
      }

      case t.SEAL: {
        const type = Types.get_type(module, x.name);
        Types.seal(type);
        continue;
      }

      case t.TEST: {
        const test = new CrochetTest(
          module,
          new Environment(null, null, module),
          x.name,
          x.body
        );
        Tests.add_test(universe, test);
        continue;
      }

      case t.OPEN: {
        Modules.open(module, x.namespace);
        continue;
      }

      case t.DEFINE: {
        const value = Thread.run_sync(universe, module, x.body);
        Modules.define(module, x.visiblity, x.name, value);
        continue;
      }

      case t.PRELUDE: {
        const env = new Environment(null, null, module);
        const prelude = new CrochetPrelude(env, x.body);
        World.add_prelude(universe.world, prelude);
        continue;
      }

      default:
        throw unreachable(x as never, `Declaration`);
    }
  }

  return module;
}
