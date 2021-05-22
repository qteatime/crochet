import { inspect } from "util";
import { unreachable, zip } from "../../utils/utils";
import { CrochetValue, Environments, Tag, Values } from "../../vm";
import {
  RBlock,
  RCircular,
  Repr,
  RFlow,
  RInterpolation,
  RKeyword,
  RList,
  RMap,
  RNumber,
  RSecret,
  RStatic,
  RTagged,
  RText,
  RTyped,
  space,
} from "./ast";
import { type_to_repr } from "./type";

export function value_to_repr(x: CrochetValue, seen: Set<CrochetValue>): Repr {
  if (seen.has(x)) {
    return new RCircular(x);
  }

  switch (x.tag) {
    case Tag.NOTHING:
      return new RKeyword("nothing");

    case Tag.INTEGER:
      Values.assert_tag(Tag.INTEGER, x);
      return new RNumber(x.payload);

    case Tag.FLOAT_64:
      Values.assert_tag(Tag.FLOAT_64, x);
      return new RNumber(x.payload);

    case Tag.TEXT:
      Values.assert_tag(Tag.TEXT, x);
      return new RText(x.payload);

    case Tag.TRUE:
      return new RKeyword("true");

    case Tag.FALSE:
      return new RKeyword("false");

    case Tag.INTERPOLATION: {
      Values.assert_tag(Tag.INTERPOLATION, x);
      const seen1 = see(x, seen);
      return new RInterpolation(
        x.payload.map((a) =>
          typeof a === "string"
            ? new RStatic(a)
            : new RFlow([
                new RStatic("["),
                value_to_repr(a, seen1),
                new RStatic("]"),
              ])
        )
      );
    }

    case Tag.TUPLE: {
      Values.assert_tag(Tag.TUPLE, x);
      const seen1 = see(x, seen);
      return new RList(x.payload.map((a) => value_to_repr(a, seen1)));
    }

    case Tag.RECORD: {
      Values.assert_tag(Tag.RECORD, x);
      const seen1 = see(x, seen);
      return new RMap(
        [...x.payload].map(([k, v]) => [
          new RStatic(k),
          value_to_repr(v, seen1),
        ])
      );
    }

    case Tag.INSTANCE: {
      Values.assert_tag(Tag.INSTANCE, x);
      const seen1 = see(x, seen);
      if (x.type.fields.length !== x.payload.length) {
        return new RTyped(
          type_to_repr(x.type),
          new RTagged(
            "corrupted",
            new RList(
              x.payload.map((a) => new RSecret(value_to_repr(a, seen1)))
            )
          )
        );
      } else {
        const pairs = [...zip(x.type.fields, x.payload)];
        return new RTyped(
          type_to_repr(x.type),
          new RMap(
            pairs.map(([k, v]) => [
              new RStatic(k),
              new RSecret(value_to_repr(v, seen1)),
            ])
          )
        );
      }
    }

    case Tag.LAMBDA: {
      Values.assert_tag(Tag.LAMBDA, x);
      return new RStatic(`<function-${x.payload.parameters.length}>`);
    }

    case Tag.PARTIAL: {
      Values.assert_tag(Tag.PARTIAL, x);
      return new RFlow([
        new RStatic("<"),
        new RKeyword("partial"),
        space,
        new RStatic(x.payload.name),
        new RStatic(">"),
      ]);
    }

    case Tag.THUNK: {
      Values.assert_tag(Tag.THUNK, x);
      if (x.payload.value == null) {
        return new RStatic(`<thunk>`);
      } else {
        const seen1 = see(x, seen);
        return new RFlow([
          new RStatic("<"),
          new RKeyword("thunk"),
          space,
          value_to_repr(x.payload.value, seen1),
          new RStatic(">"),
        ]);
      }
    }

    case Tag.CELL: {
      Values.assert_tag(Tag.CELL, x);
      const seen1 = see(x, seen);
      return new RFlow([
        new RStatic("<"),
        new RKeyword("cell"),
        space,
        value_to_repr(x.payload.value, seen1),
        new RStatic(">"),
      ]);
    }

    case Tag.TYPE: {
      Values.assert_tag(Tag.TYPE, x);
      return new RFlow([
        new RStatic("<"),
        new RKeyword("type"),
        space,
        type_to_repr(x.payload),
        new RStatic(">"),
      ]);
    }

    case Tag.ACTION: {
      Values.assert_tag(Tag.ACTION, x);
      const seen1 = see(x, seen);
      return new RFlow([
        new RKeyword("action:"),
        space,
        new RStatic(x.payload.action.name),
        new RBlock(
          new RTagged(
            "Bound values",
            new RMap(
              [...Environments.bound_values_up_to(null, x.payload.env)].map(
                ([k, v]) => [new RStatic(k), value_to_repr(v, seen1)]
              )
            )
          )
        ),
      ]);
    }

    case Tag.ACTION_CHOICE: {
      Values.assert_tag(Tag.ACTION_CHOICE, x);
      const seen1 = see(x, seen);
      return new RFlow([
        new RKeyword("choice:"),
        space,
        new RStatic(x.payload.action.name),
        space,
        new RKeyword("rank:"),
        space,
        new RNumber(x.payload.score),
        new RBlock(
          new RTagged(
            "Bound values",
            new RMap(
              [...Environments.bound_values_up_to(null, x.payload.env)].map(
                ([k, v]) => [new RStatic(k), value_to_repr(v, seen1)]
              )
            )
          )
        ),
      ]);
    }

    case Tag.UNKNOWN: {
      return new RTagged(
        "Unknown value",
        new RSecret(new RStatic(inspect(x.payload, false, 5, false)))
      );
    }

    default:
      throw unreachable(x.tag, "Value");
  }
}

function see(x: CrochetValue, seen: Set<CrochetValue>) {
  return new Set([...seen, x]);
}
