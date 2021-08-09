import { inspect } from "util";
import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import {
  Activation,
  ActivationTag,
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
    case Tag.INSTANCE:
      return `<${type_name(x.type)}>`;
    case Tag.INTERPOLATION: {
      assert_tag(Tag.INTERPOLATION, x);
      return `i"${x.payload
        .map((x) => (typeof x === "string" ? x : `[${simple_value(x)}]`))
        .join("")}"`;
    }
    case Tag.LAMBDA: {
      assert_tag(Tag.LAMBDA, x);
      return `function(${x.payload.parameters.join(", ")})`;
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
        ([k, v]) => `${k} -> ${simple_value(v)}`
      );
      return `[${pairs.join(", ")}]`;
    }
    case Tag.TEXT: {
      return `"${x.payload}"`;
    }
    case Tag.THUNK: {
      assert_tag(Tag.THUNK, x);
      if (x.payload.value != null) {
        return `<thunk ${simple_value(x.payload.value)}>`;
      } else {
        return `<thunk>`;
      }
    }
    case Tag.LIST: {
      assert_tag(Tag.LIST, x);
      return `[${x.payload.map((x) => simple_value(x)).join(", ")}]`;
    }
    case Tag.TYPE: {
      assert_tag(Tag.TYPE, x);
      return `${type_name(x.type)}`;
    }
    case Tag.UNKNOWN: {
      return `<unknown>`;
    }
    case Tag.CELL: {
      assert_tag(Tag.CELL, x);
      return `<cell ${simple_value(x.payload.value)}`;
    }
    case Tag.ACTION: {
      assert_tag(Tag.ACTION, x);
      return `<action ${x.payload.action.name}>`;
    }
    case Tag.ACTION_CHOICE: {
      assert_tag(Tag.ACTION_CHOICE, x);
      return `<action choice ${x.payload.action.name} - ${x.payload.score}>`;
    }
    default:
      throw unreachable(x.tag, `Value ${x}`);
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
            return (
              `on ${x.effect}.${x.variant} [${x.parameters.join(", ")}]:\n` +
              x.block.ops.map((x, i) => "  " + simple_op(x, i) + "\n").join("")
            );
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
