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
    Cell,
  });
}

export function load_module(
  universe: Universe,
  pkg: CrochetPackage,
  program: IR.Program
) {
  const module = new CrochetModule(pkg, program.filename);

  for (const x of program.declarations) {
    load_declaration(universe, module, x);
  }

  return module;
}

export function load_declaration(
  universe: Universe,
  module: CrochetModule,
  declaration: IR.Declaration
) {
  const t = IR.DeclarationTag;

  switch (declaration.tag) {
    case t.COMMAND: {
      const command = Commands.get_or_make_command(
        universe,
        declaration.name,
        declaration.parameters.length
      );

      const branch = new CrochetCommandBranch(
        module,
        new Environment(null, null, module),
        declaration.name,
        declaration.documentation,
        declaration.parameters,
        declaration.types.map((t) =>
          Types.materialise_type(universe, module, t)
        ),
        declaration.body,
        declaration.meta
      );

      Commands.add_branch(command, branch);
      break;
    }

    case t.TYPE: {
      const parent = Types.materialise_type(
        universe,
        module,
        declaration.parent
      );
      const type = new CrochetType(
        module,
        declaration.name,
        declaration.documentation,
        parent,
        declaration.fields,
        declaration.types.map((t) =>
          Types.materialise_type(universe, module, t)
        ),
        false,
        declaration.meta
      );

      Types.define_type(module, declaration.name, type, declaration.visibility);
      break;
    }

    case t.FOREIGN_TYPE: {
      const type = Types.get_foreign_type(universe, module, declaration.target);
      Types.define_type(module, declaration.name, type, IR.Visibility.GLOBAL);
      break;
    }

    case t.SEAL: {
      const type = Types.get_type(module, declaration.name);
      Types.seal(type);
      break;
    }

    case t.TEST: {
      const test = new CrochetTest(
        module,
        new Environment(null, null, module),
        declaration.name,
        declaration.body
      );
      Tests.add_test(universe, test);
      break;
    }

    case t.OPEN: {
      Modules.open(module, declaration.namespace);
      break;
    }

    case t.DEFINE: {
      const value = Thread.run_sync(universe, module, declaration.body);
      Modules.define(module, declaration.visibility, declaration.name, value);
      break;
    }

    case t.PRELUDE: {
      const env = new Environment(null, null, module);
      const prelude = new CrochetPrelude(env, declaration.body);
      World.add_prelude(universe.world, prelude);
      break;
    }

    default:
      throw unreachable(declaration as never, `Declaration`);
  }
}
