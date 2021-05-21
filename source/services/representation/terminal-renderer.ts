import { unreachable } from "../../utils/utils";
import { CrochetType, CrochetValue } from "../../vm";
import { Repr, ReprTag } from "./ast";
import { type_to_repr } from "./type";
import { value_to_repr } from "./value";

function pad(n: number, text: string) {
  return text
    .split(/\n/g)
    .map((x) => " ".repeat(n) + x)
    .join("\n");
}

export class TerminalRenderer {
  constructor(readonly disclose: boolean) {}

  render(x: Repr): string {
    switch (x.tag) {
      case ReprTag.TEXT: {
        return `"${x.value.replace(/"/g, '\\"')}"`;
      }

      case ReprTag.NUMBER: {
        return x.value.toString();
      }

      case ReprTag.KEYWORD: {
        return x.name;
      }

      case ReprTag.LIST: {
        const lines = x.items.map((a) => this.render(a)).join(",\n");
        return `[\n${pad(2, lines)}\n]`;
      }

      case ReprTag.MAP: {
        const lines = x.items
          .map(([k, v]) => `${this.render(k)} -> ${this.render(v)}`)
          .join(",\n");
        if (x.items.length === 0) {
          return `[->]`;
        } else {
          return `[\n${pad(2, lines)}\n]`;
        }
      }

      case ReprTag.INTERPOLATION: {
        return `"${x.parts.map((a) => this.render(a)).join("")}"`;
      }

      case ReprTag.STATIC_TEXT: {
        return x.text;
      }

      case ReprTag.FLOW: {
        return x.items.map((a) => this.render(a)).join("");
      }

      case ReprTag.BLOCK: {
        return `\n${pad(2, this.render(x.child))}\n`;
      }

      case ReprTag.STACK: {
        return x.items.map((a) => this.render(a)).join("\n");
      }

      case ReprTag.CIRCULAR: {
        return "(circular)";
      }

      case ReprTag.TYPED: {
        return `(${this.render(x.type)}) ${this.render(x.value)}`;
      }

      case ReprTag.TAGGED: {
        return `{${x.tag_name}} ${this.render(x.value)}`;
      }

      case ReprTag.SPACE: {
        return " ";
      }

      case ReprTag.SECRET: {
        if (this.disclose) {
          return this.render(x.value);
        } else {
          return "(***)";
        }
      }

      default:
        throw unreachable(x, "Representation");
    }
  }

  render_value(x: CrochetValue) {
    return this.render(value_to_repr(x, new Set()));
  }

  render_type(x: CrochetType) {
    return this.render(type_to_repr(x));
  }
}
