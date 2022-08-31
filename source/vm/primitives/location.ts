import { inspect } from "util";
import { CrochetActivation, NativeActivation } from "..";
import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import * as im from "immutable";
import {
  Activation,
  ActivationTag,
  CrochetLambda,
  CrochetPrelude,
  SimulationSignal,
  HandlerStack,
  NativeFunction,
  ActivationLocation,
  CrochetCommand,
  CrochetCommandBranch,
  CrochetModule,
  CrochetThunk,
  CrochetTrait,
  CrochetType,
  CrochetTypeConstraint,
  CrochetValue,
  Metadata,
  Tag,
} from "../intrinsics";
import { get_line_column } from "./meta";
import { assert_tag } from "./values";

export function module_location(x: CrochetModule) {
  return `module ${x.filename} in ${x.pkg.name}`;
}

export function branch_name(x: CrochetCommandBranch) {
  return command_signature(x.name, x.types);
}

export function branch_location(x: CrochetCommandBranch) {
  return module_location(x.module);
}

export function branch_name_location(x: CrochetCommandBranch) {
  return `${branch_name(x)}, from ${branch_location(x)}`;
}

export function from_suffix(x: CrochetModule | null) {
  if (x == null) {
    return "";
  } else {
    return `, from ${module_location(x)}`;
  }
}

export function from_suffix_newline(x: CrochetModule | null) {
  if (x == null) {
    return "";
  } else {
    return `\n    from ${module_location(x)}`;
  }
}

export function command_signature(
  name: string,
  types: CrochetTypeConstraint[] | CrochetType[]
) {
  let i = 0;
  return name.replace(/_/g, (_) => `(${type_or_constraint_name(types[i++])})`);
}

export function thunk_location(thunk: CrochetThunk) {
  const module = thunk.env.raw_module;
  if (module != null) {
    return `thunk, from ${module_location(module)}`;
  } else {
    return `thunk`;
  }
}

export function type_or_constraint_name(
  x: CrochetType | CrochetTypeConstraint
) {
  if (x instanceof CrochetType) {
    return type_name(x);
  } else if (x instanceof CrochetTypeConstraint) {
    return type_constraint_name(x);
  } else {
    throw unreachable(x, "type or constraint");
  }
}

export function type_constraint_name(x: CrochetTypeConstraint) {
  if (x.traits.length === 0) {
    return type_name(x.type);
  } else {
    return `${type_name(x.type)} has ${x.traits.map(trait_name).join(", ")}`;
  }
}

export function type_name(x: CrochetType) {
  if (x.module != null) {
    return `${x.module.pkg.name}/${x.name}`;
  } else {
    return x.name;
  }
}

export function trait_name(x: CrochetTrait) {
  if (x.module != null) {
    return `trait ${x.module.pkg.name}/${x.name}`;
  } else {
    return `trait ${x.name}`;
  }
}

export function simple_value(x: CrochetValue): string {
  return do_simple_value(x, 0, new Set());
}

function do_simple_value(
  x: CrochetValue,
  depth: number,
  visited: Set<CrochetValue>
): string {
  if (!is_primitive(x) && visited.has(x)) {
    return "[circular]";
  }
  if (depth > 5) {
    return "(...)";
  }
  visited.add(x);

  switch (x.tag) {
    case Tag.NOTHING:
      return "nothing";
    case Tag.FALSE:
      return "false";
    case Tag.TRUE:
      return "true";
    case Tag.INTEGER: {
      assert_tag(Tag.INTEGER, x);
      return x.payload.toString();
    }
    case Tag.FLOAT_64: {
      assert_tag(Tag.FLOAT_64, x);
      return x.payload.toString() + (Number.isInteger(x.payload) ? ".0" : "");
    }
    case Tag.INSTANCE: {
      assert_tag(Tag.INSTANCE, x);
      const fields = x.payload.map(
        (v, i) =>
          `${x.type.fields[i]} -> ${do_simple_value(v, depth + 1, visited)}`
      );
      if (fields.length > 0) {
        return `<${type_name(x.type)}>(\n${block(2, fields.join("\n"))}\n)`;
      } else {
        return `<${type_name(x.type)}>`;
      }
    }
    case Tag.INTERPOLATION: {
      assert_tag(Tag.INTERPOLATION, x);
      return `i"${x.payload
        .map((x) =>
          typeof x === "string"
            ? x
            : `[${do_simple_value(x, depth + 1, visited)}]`
        )
        .join("")}"`;
    }
    case Tag.LAMBDA: {
      assert_tag(Tag.LAMBDA, x);
      return `function(${x.payload.parameters.join(", ")})`;
    }
    case Tag.NATIVE_LAMBDA: {
      assert_tag(Tag.NATIVE_LAMBDA, x);
      return `<native-function-${x.payload.arity}>`;
    }
    case Tag.PARTIAL: {
      assert_tag(Tag.PARTIAL, x);
      return `<partial ${x.payload.name}>`;
    }
    case Tag.RECORD: {
      assert_tag(Tag.RECORD, x);
      if (x.payload.size === 0) {
        return "[->]";
      }
      const pairs = [...x.payload.entries()].map(
        ([k, v]) => `${k} -> ${do_simple_value(v, depth + 1, visited)}`
      );
      return `[\n${block(2, pairs.join(",\n"))}\n]`;
    }
    case Tag.TEXT: {
      return `"${x.payload}"`;
    }
    case Tag.THUNK: {
      assert_tag(Tag.THUNK, x);
      if (x.payload.value != null) {
        return `<thunk ${do_simple_value(
          x.payload.value,
          depth + 1,
          visited
        )}>`;
      } else {
        return `<thunk>`;
      }
    }
    case Tag.LIST: {
      assert_tag(Tag.LIST, x);
      return `[\n${block(
        2,
        x.payload.map((x) => do_simple_value(x, depth + 1, visited)).join(", ")
      )}\n]`;
    }
    case Tag.TYPE: {
      assert_tag(Tag.TYPE, x);
      return `${type_name(x.type)}`;
    }
    case Tag.UNKNOWN: {
      assert_tag(Tag.UNKNOWN, x);
      const repr =
        x.payload instanceof CrochetValue
          ? do_simple_value(x.payload, depth + 1, visited)
          : im.isImmutable(x.payload)
          ? immutable_repr(x.payload, depth + 1, visited)
          : `native ${maybe_native_class_name(x.payload)}`;
      return `<unknown>(${repr})`;
    }
    case Tag.CELL: {
      assert_tag(Tag.CELL, x);
      return `<cell ${do_simple_value(x.payload.value, depth + 1, visited)}>`;
    }
    case Tag.ACTION: {
      assert_tag(Tag.ACTION, x);
      return `<action ${x.payload.action.name}>`;
    }
    case Tag.ACTION_CHOICE: {
      assert_tag(Tag.ACTION_CHOICE, x);
      return `<action choice ${x.payload.action.name} - ${x.payload.score}>`;
    }
    case Tag.PROTECTED: {
      assert_tag(Tag.PROTECTED, x);
      return `<protected ${do_simple_value(
        x.payload.value,
        depth + 1,
        visited
      )}>`;
    }
    case Tag.ANY_PACKAGE: {
      assert_tag(Tag.ANY_PACKAGE, x);
      return `<package ${x.payload.name}>`;
    }
    case Tag.BYTE_ARRAY: {
      assert_tag(Tag.BYTE_ARRAY, x);
      const first_bytes = Array.from(x.payload)
        .slice(0, 16)
        .map((x) => x.toString(16).padStart(2, "0"))
        .join(" ");
      const suffix = x.payload.byteLength > 16 ? "..." : "";

      return `<byte-array: ${first_bytes}${suffix}, ${x.payload.length} bytes>`;
    }
    default:
      throw unreachable(x.tag, `Value ${x}`);
  }
}

function immutable_repr(x: unknown, depth: number, visited: Set<CrochetValue>) {
  if (im.isList(x)) {
    return `<native list>[\n${block(
      2,
      x
        .toArray()
        .map((x) => do_simple_value(x as any, depth + 1, visited))
        .join(", ")
    )}\n]`;
  } else if (im.isMap(x)) {
    if (x.size === 0) {
      return "<native map>[->]";
    }
    const pairs = [...x.entries()].map(
      ([k, v]) =>
        `${do_simple_value(k as any, depth + 1, visited)} -> ${do_simple_value(
          v as any,
          depth + 1,
          visited
        )}`
    );
    return `<native map>[\n${block(2, pairs.join(",\n"))}\n]`;
  } else if (im.isSet(x)) {
    return `<native set>[\n${block(
      2,
      x
        .toArray()
        .map((x) => do_simple_value(x as any, depth + 1, visited))
        .join(", ")
    )}\n]`;
  } else {
    return `<native collection>`;
  }
}

function is_primitive(x: CrochetValue) {
  switch (x.tag) {
    case Tag.NOTHING:
    case Tag.FALSE:
    case Tag.TRUE:
    case Tag.INTEGER:
    case Tag.FLOAT_64:
    case Tag.TEXT:
      return true;
    default:
      return false;
  }
}

export function simple_op(op: IR.Op, index: number | null): string {
  const entries = Object.entries(op)
    .filter(
      ([k, v]) =>
        !["meta", "tag", "handlers"].includes(k) &&
        !(v instanceof IR.BasicBlock)
    )
    .map((x) => inspect(x[1]));
  const bbs = Object.entries(op)
    .filter(([k, v]) => v instanceof IR.BasicBlock)
    .map(
      ([k, v]) =>
        `\n  ${k}:\n${(v as IR.BasicBlock).ops
          .map((op, i) => `  ${simple_op(op, i)}`)
          .join("\n")}\n`
    )
    .join("\n")
    .split(/\n/g)
    .map((x) => `    ${x}`)
    .join("\n");
  const hs = (
    op.tag === IR.OpTag.HANDLE
      ? [
          "\n",
          ...op.handlers.map((x) => {
            return simple_handler_case(x);
          }),
        ]
      : []
  )
    .join("\n")
    .split(/\n/g)
    .map((x) => `    ${x}`)
    .join("\n");

  return `${(index ?? "").toString().padStart(3)} ${
    IR.OpTag[op.tag]
  } ${entries.join(" ")}${bbs}${hs}`;
}

export function simple_handler_case(x: IR.HandlerCase) {
  switch (x.tag) {
    case IR.HandlerCaseTag.ON: {
      return (
        `on ${x.effect}.${x.variant} [${x.parameters.join(", ")}]:\n` +
        x.block.ops.map((x, i) => "  " + simple_op(x, i) + "\n").join("")
      );
    }

    case IR.HandlerCaseTag.USE: {
      return `use ${x.name}:\n${x.values.ops
        .map((x, i) => "  " + simple_op(x, i) + "\n")
        .join("")}`;
    }

    default:
      throw unreachable(x, "HandlerCase");
  }
}

export function simple_activation(x: Activation): string {
  switch (x.tag) {
    case ActivationTag.CROCHET_ACTIVATION: {
      return [
        `activation at ${x.instruction}\n`,
        x.block.ops.map((x, i) => "  " + simple_op(x, i) + "\n").join(""),
        "\nstack:\n",
        x.stack.map((x) => "  " + simple_value(x) + "\n").join(""),
      ].join("");
    }

    case ActivationTag.NATIVE_ACTIVATION: {
      if (x.location) {
        return `native activation ${x.location.name} in ${x.location.pkg.name}`;
      } else {
        return `native activation`;
      }
    }
  }
}

export function format_position_suffix(id: number, meta: Metadata | null) {
  if (meta == null) {
    return "";
  } else {
    const pos = get_line_column(id, meta);
    if (pos == null) {
      return "";
    } else {
      return ` at line ${pos.line}`;
    }
  }
}

export function op_block(xs: IR.Op[], padding: number) {
  return xs
    .map((x, i) => simple_op(x, i))
    .join("\n")
    .split(/\r\n|\r|\n/)
    .map((x) => " ".repeat(padding) + x)
    .join("\n");
}

export function activation_location(x: ActivationLocation): string {
  if (x == null) {
    return "(root)";
  } else if (x instanceof CrochetLambda) {
    return `function/${x.parameters.length} from ${
      x.env.raw_module ? module_location(x.env.raw_module) : "(no module)"
    }`;
  } else if (x instanceof CrochetCommandBranch) {
    return branch_name_location(x);
  } else if (x instanceof CrochetThunk) {
    return `thunk from ${
      x.env.raw_module ? module_location(x.env.raw_module) : "(no module)"
    }`;
  } else if (x instanceof CrochetPrelude) {
    return `prelude from ${module_location(x.env.raw_module!)}`;
  } else if (x instanceof NativeFunction) {
    return `native function ${x.name} from ${x.pkg.name}`;
  } else if (x instanceof SimulationSignal) {
    return `simulation signal ${x.name} from ${module_location(x.module)}`;
  } else {
    return "unknown";
  }
}

export function handler_stack(x: HandlerStack): string {
  const entries = x.handlers.map((x) =>
    [`  on ${type_name(x.guard)}\n`, `${op_block(x.body.ops, 4)}\n`].join("")
  );
  return [
    x.activation ? `at ${activation_location(x.activation?.location)}\n` : "",
    ...entries,
    ...(x.parent ? ["\n---\n", handler_stack(x.parent)] : []),
  ].join("");
}

export function find_good_transcript_write_location(activation0: Activation) {
  let activation: Activation | null = activation0;
  let depth = 0;

  while (activation != null && depth < 10) {
    depth += 1;

    // Skip native frames
    if (activation instanceof NativeActivation) {
      activation = activation.parent;
      continue;
    }

    // Skip potentially intermediary thunks/lambdas
    if (!(activation.location instanceof CrochetCommandBranch)) {
      activation = activation.parent;
      continue;
    }

    const module = activation.location.module;
    // Skip anything in crochet.debug package so we get more useful callers
    // (unless you're trying to find a bug *in* crochet.debug...)
    if (module != null && module.pkg.name === "crochet.debug") {
      activation = activation.parent;
      continue;
    }

    return activation.location;
  }

  return null;
}

export function block(indent: number, text: string) {
  return text
    .split(/\n/)
    .map((x) => " ".repeat(indent) + x)
    .join("\n");
}

function might_be_class(x: unknown) {
  if (typeof x === "function" && typeof x.prototype !== "undefined") {
    return true;
  } else {
    return false;
  }
}

function maybe_native_class_name(x: unknown) {
  if (might_be_class(x)) {
    return `class ${(x as any).name || "(Anonymous)"}`;
  } else if (x === null) {
    return "null";
  } else if (typeof x === "object" && might_be_class((x as any)?.constructor)) {
    return `instance ${(x as any)?.constructor?.name || "(Anonymous)"}`;
  } else {
    return typeof x;
  }
}
