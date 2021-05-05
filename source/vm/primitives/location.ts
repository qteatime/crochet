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
  CrochetType,
  CrochetValue,
  Tag,
} from "../intrinsics";
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

export function command_signature(name: string, types: CrochetType[]) {
  let i = 0;
  return name.replace(/_/g, (_) => `(${type_name(types[i++])})`);
}

export function thunk_location(thunk: CrochetThunk) {
  const module = thunk.env.raw_module;
  if (module != null) {
    return `thunk, from ${module_location(module)}`;
  } else {
    return `thunk`;
  }
}

export function type_name(x: CrochetType) {
  if (x.module != null) {
    return `${x.name} (from ${x.module.pkg})`;
  } else {
    return x.name;
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
      return `"${x.payload
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
        return `<thunk ${simple_value(x)}>`;
      } else {
        return `<thunk>`;
      }
    }
    case Tag.TUPLE: {
      assert_tag(Tag.TUPLE, x);
      return `[${x.payload.map((x) => simple_value(x)).join(", ")}]`;
    }
    case Tag.TYPE: {
      assert_tag(Tag.TYPE, x);
      return `#${type_name(x.type)}`;
    }
    case Tag.UNKNOWN: {
      return `<unknown>`;
    }
    case Tag.CELL: {
      assert_tag(Tag.CELL, x);
      return `<cell ${simple_value(x.payload.value)}`;
    }
    default:
      throw unreachable(x.tag, "Value");
  }
}

export function simple_op(op: IR.Op) {
  const entries = Object.entries(op)
    .filter(([k, _]) => k !== "meta" && k !== "tag")
    .map((x) => inspect(x[1]));
  return `${IR.OpTag[op.tag]} ${entries.join(" ")}`;
}

export function simple_activation(x: Activation): string {
  switch (x.tag) {
    case ActivationTag.CROCHET_ACTIVATION: {
      return [
        `activation ${x.parent ? "+" : "0"} at ${x.instruction}\n`,
        x.block.ops.map((x) => "  " + simple_op(x) + "\n").join(""),
        "\nstack:\n",
        x.stack.map((x) => "  " + simple_value(x) + "\n").join(""),
      ].join("");
    }

    case ActivationTag.NATIVE_ACTIVATION: {
      return `native activation ${x.fn.name} in ${x.fn.pkg.name}`;
    }
  }
}
