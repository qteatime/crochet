import { CrochetCapability, CrochetHandler } from ".";
import * as IR from "../ir";
import { unreachable } from "../utils/utils";
import { XorShift } from "../utils/xorshift";
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
  CrochetContext,
  Action,
  When,
  Metadata,
  CrochetTrait,
  CrochetTypeConstraint,
} from "./intrinsics";
import { Tree, Relation } from "./logic";
import {
  Commands,
  Effects,
  Modules,
  Tests,
  Types,
  World,
  Capability,
  Namespaces,
} from "./primitives";
import { Contexts } from "./simulation";
import { CrochetTrace } from "./tracing";

export function make_universe(token: string) {
  const world = new CrochetWorld();

  // Core types
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
  const Protected = new CrochetType(
    null,
    "protected",
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
  const Float_64 = new CrochetType(
    null,
    "float-64bit",
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

  const UnsafeArbitraryText = new CrochetType(
    null,
    "unsafe-arbitrary-text",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const UntrustedText = new CrochetType(
    null,
    "untrusted-text",
    "",
    UnsafeArbitraryText,
    [],
    [],
    false,
    null
  );
  const Text = new CrochetType(
    null,
    "text",
    "",
    UnsafeArbitraryText,
    [],
    [],
    false,
    null
  );
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
  const DynamicText = new CrochetType(
    null,
    "dynamic-text",
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
  const native_lambdas: CrochetType[] = [];
  for (let i = 0; i < 10; ++i) {
    const lambda = new CrochetType(
      null,
      `function-${i}`,
      "",
      Function,
      [],
      [],
      false,
      null
    );
    functions.push(lambda);
    const native_lambda = new CrochetType(
      null,
      `native-function-${i}`,
      "",
      lambda,
      [],
      [],
      false,
      null
    );
    native_lambdas.push(native_lambda);
  }

  const Thunk = new CrochetType(null, "thunk", "", Any, [], [], false, null);
  const Record = new CrochetType(null, "record", "", Any, [], [], false, null);
  const List = new CrochetType(null, "list", "", Any, [], [], false, null);
  const Enum = new CrochetType(null, "enum", "", Any, [], [], false, null);
  const Cell = new CrochetType(null, "cell", "", Any, [], [], false, null);
  const Type = new CrochetType(
    null,
    "static-type",
    "",
    Any,
    [],
    [],
    false,
    null
  );
  const Effect = new CrochetType(null, "effect", "", null, [], [], false, null);

  // Simulations
  const Action = new CrochetType(null, "action", "", Any, [], [], false, null);
  const ActionChoice = new CrochetType(
    null,
    "action-choice",
    "",
    Any,
    ["score", "action", "environment"],
    [
      new CrochetTypeConstraint(Integer, []),
      new CrochetTypeConstraint(Action, []),
      new CrochetTypeConstraint(Record, []),
    ],
    false,
    null
  );

  // Packages
  const Package = new CrochetType(
    null,
    "any-package",
    "",
    Any,
    [],
    [],
    false,
    null
  );

  world.native_types.define("crochet.core/core.static-type", Type);
  world.native_types.define("crochet.core/core.any", Any);
  world.native_types.define("crochet.core/core.protected", Protected);
  world.native_types.define("crochet.core/core.unknown", Unknown);
  world.native_types.define("crochet.core/core.nothing", Nothing);
  world.native_types.define("crochet.core/core.boolean", Boolean);
  world.native_types.define("crochet.core/core.true", True);
  world.native_types.define("crochet.core/core.false", False);
  world.native_types.define("crochet.core/core.numeric", Numeric);
  world.native_types.define("crochet.core/core.fractional", Fractional);
  world.native_types.define("crochet.core/core.integral", Integral);
  world.native_types.define("crochet.core/core.float-64bit", Float_64);
  world.native_types.define("crochet.core/core.integer", Integer);
  world.native_types.define(
    "crochet.core/core.unsafe-arbitrary-text",
    UnsafeArbitraryText
  );
  world.native_types.define("crochet.core/core.untrusted-text", UntrustedText);
  world.native_types.define("crochet.core/core.text", Text);
  world.native_types.define("crochet.core/core.static-text", StaticText);
  world.native_types.define("crochet.core/core.dynamic-text", DynamicText);
  world.native_types.define("crochet.core/core.interpolation", Interpolation);
  world.native_types.define("crochet.core/core.function", Function);
  for (const f of functions) {
    world.native_types.define(`crochet.core/core.${f.name}`, f);
  }
  world.native_types.define("crochet.core/core.thunk", Thunk);
  world.native_types.define("crochet.core/core.record", Record);
  world.native_types.define("crochet.core/core.list", List);
  world.native_types.define("crochet.core/core.enum", Enum);
  world.native_types.define("crochet.core/core.cell", Cell);
  world.native_types.define("crochet.core/core.action", Action);
  world.native_types.define("crochet.core/core.action", Action);
  world.native_types.define("crochet.core/core.action-choice", ActionChoice);
  world.native_types.define("crochet.core/core.package", Package);

  return new Universe(token, new CrochetTrace(), world, XorShift.new_random(), {
    Any,
    Unknown,
    Protected,
    Nothing,
    True,
    False,
    Integer,
    Float_64: Float_64,
    UnsafeArbitraryText,
    UntrustedText,
    Text,
    StaticText,
    DynamicText,
    Interpolation,
    Function: functions,
    NativeFunctions: native_lambdas,
    Thunk,
    Record,
    List: List,
    Enum,
    Type,
    Cell,
    Action,
    ActionChoice,
    Effect,
    Package,
  });
}

export function load_module(
  universe: Universe,
  pkg: CrochetPackage,
  program: IR.Program
) {
  const module = new CrochetModule(
    pkg,
    program.filename,
    new Metadata(program.source, program.meta_table)
  );

  let last_doc: { name: string; doc: string } | null = null;
  for (const x of program.declarations) {
    last_doc = load_declaration(universe, module, x, last_doc) ?? null;
  }
  Types.promote_missing_types(module);

  return module;
}

export function load_declaration(
  universe: Universe,
  module: CrochetModule,
  declaration: IR.Declaration,
  last_doc: { name: string; doc: string } | null
) {
  const t = IR.DeclarationTag;

  switch (declaration.tag) {
    case t.COMMAND: {
      const command = Commands.get_or_make_command(
        universe,
        declaration.name,
        declaration.parameters.length
      );
      const inferred_doc =
        last_doc == null
          ? ""
          : last_doc.name === declaration.name
          ? last_doc.doc
          : "";
      const doc = declaration.documentation.trim()
        ? declaration.documentation
        : inferred_doc;

      const branch = new CrochetCommandBranch(
        module,
        new Environment(null, null, module, null),
        declaration.name,
        doc,
        declaration.parameters,
        declaration.types.map((t) =>
          Types.materialise_type_constraint(universe, module, t)
        ),
        declaration.body,
        declaration.meta
      );

      Commands.add_branch(command, branch);
      return { name: declaration.name, doc: doc };
    }

    case t.TYPE: {
      const parent = Types.materialise_type_constraint(
        universe,
        module,
        declaration.parent
      ).type;
      const new_type = new CrochetType(
        module,
        declaration.name,
        declaration.documentation,
        parent,
        declaration.fields,
        declaration.types.map((t) =>
          Types.materialise_type_constraint(universe, module, t)
        ),
        false,
        declaration.meta
      );
      let type;
      const missing = Types.try_get_placeholder_type(module, declaration.name);
      if (missing != null) {
        type = Types.fulfill_placeholder_type(
          module,
          missing,
          new_type,
          declaration.visibility
        );
      } else {
        type = new_type;
      }

      parent.sub_types.push(type);

      Types.define_type(module, declaration.name, type, declaration.visibility);
      break;
    }

    case t.EFFECT: {
      const effect = universe.types.Effect;
      const parent = new CrochetType(
        module,
        Effects.effect_name(declaration.name),
        declaration.documentation,
        effect,
        [],
        [],
        false,
        declaration.meta
      );
      for (const c of declaration.cases) {
        const type = new CrochetType(
          module,
          Effects.variant_name(declaration.name, c.name),
          c.documentation,
          parent,
          c.parameters,
          c.types.map((t) =>
            Types.materialise_type_constraint(universe, module, t)
          ),
          false,
          c.meta
        );
        parent.sub_types.push(type);
        Types.define_type(module, type.name, type, IR.Visibility.GLOBAL);
      }
      Types.define_type(module, parent.name, parent, IR.Visibility.GLOBAL);
      Types.seal(parent);
      break;
    }

    case t.FOREIGN_TYPE: {
      const type = Types.get_foreign_type(universe, module, declaration.target);
      (type as any).documentation = declaration.documentation;
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
        new Environment(null, null, module, null),
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
      const env = new Environment(null, null, module, null);
      const prelude = new CrochetPrelude(env, declaration.body);
      World.add_prelude(universe.world, prelude);
      break;
    }

    case t.RELATION: {
      const type = Tree.materialise_type(declaration.type);
      const tree = Tree.materialise(type);
      Relation.define_concrete(
        module,
        declaration.meta,
        declaration.name,
        declaration.documentation,
        type,
        tree
      );
      break;
    }

    case t.CONTEXT: {
      const context = new CrochetContext(
        declaration.meta,
        module,
        declaration.name,
        declaration.documentation
      );
      Contexts.define_context(module, context);
      break;
    }

    case t.ACTION: {
      const actor = Types.materialise_type_constraint(
        universe,
        module,
        declaration.actor
      );
      const action_type = new CrochetType(
        module,
        `action ${declaration.name}`,
        "",
        universe.types.Action,
        [],
        [],
        false,
        null
      );
      Types.define_type(
        module,
        action_type.name,
        action_type,
        IR.Visibility.GLOBAL
      );
      const action = new Action(
        action_type,
        declaration.meta,
        module,
        declaration.name,
        declaration.documentation,
        actor,
        declaration.parameter,
        declaration.predicate,
        declaration.rank_function,
        declaration.body
      );
      const context = Contexts.lookup_context(module, declaration.context);
      Contexts.add_action(module, context, action);
      break;
    }

    case t.WHEN: {
      const event = new When(
        declaration.meta,
        module,
        declaration.documentation,
        declaration.predicate,
        declaration.body
      );
      const context = Contexts.lookup_context(module, declaration.context);
      Contexts.add_event(context, event);
      break;
    }

    case t.TRAIT: {
      const new_trait = new CrochetTrait(
        module,
        declaration.name,
        declaration.documentation,
        declaration.meta
      );
      let trait;
      const missing = Types.try_get_placeholder_trait(module, declaration.name);
      if (missing != null) {
        trait = Types.fulfill_placeholder_trait(module, missing, new_trait);
      } else {
        trait = new_trait;
      }

      Types.define_trait(module, declaration.name, trait);
      break;
    }

    case t.IMPLEMENT_TRAIT: {
      const type = Types.materialise_type(universe, module, declaration.type);
      const trait = Types.materialise_trait(
        universe,
        module,
        declaration.trait
      );

      type.traits.add(trait);
      trait.implemented_by.add(type);
      break;
    }

    case t.CAPABILITY: {
      const new_capability = new CrochetCapability(
        module,
        declaration.name,
        declaration.documentation,
        declaration.meta
      );
      let capability;
      const missing = Capability.try_get_placeholder_capability(
        module,
        declaration.name
      );
      if (missing != null) {
        capability = Capability.fulfill_placeholder_capability(
          module,
          missing,
          new_capability
        );
      } else {
        capability = new_capability;
      }
      Capability.define_capability(module, capability);
      break;
    }

    case t.PROTECT: {
      const et = IR.ProtectEntityTag;
      const entity = declaration.entity;
      const entity_type = declaration.type;
      const capability = Capability.get_capability(
        module,
        declaration.capability
      );
      switch (entity_type) {
        case et.TYPE: {
          Capability.protect_type(universe, module, entity, capability);
          break;
        }

        case et.EFFECT: {
          Capability.protect_effect(universe, module, entity, capability);
          break;
        }

        case et.TRAIT: {
          Capability.protect_trait(universe, module, entity, capability);
          break;
        }

        case et.DEFINE: {
          Capability.protect_definition(universe, module, entity, capability);
          break;
        }

        case et.HANDLER: {
          Capability.protect_handler(universe, module, entity, capability);
          break;
        }

        default: {
          throw unreachable(entity_type, "Entity type");
        }
      }
      break;
    }

    case t.HANDLER: {
      const env = new Environment(null, null, module, null);
      const new_handler = new CrochetHandler(
        module,
        env,
        declaration.documentation,
        declaration.name,
        declaration.parameters,
        declaration.types.map((t) =>
          Types.materialise_type_constraint(universe, module, t)
        ),
        declaration.body,
        declaration.handlers
      );
      Effects.define_handler(module, new_handler);
      break;
    }

    case t.DEFAULT_HANDLER: {
      const handler0 = Effects.get_handler(module, declaration.name);
      // this should always succeed
      const handler = Capability.free_handler(module, handler0);
      Effects.make_default_handler(universe, handler);
      break;
    }

    case t.ALIAS: {
      const ns = module.default_namespace;
      Namespaces.define_alias(module, ns, declaration.name, declaration.entity);
      break;
    }

    default:
      throw unreachable(declaration, `Declaration`);
  }
}
