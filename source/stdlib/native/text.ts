import { start } from "repl";
import {
  foreign_namespace,
  foreign,
  machine,
  CrochetInterpolation,
  CrochetStream,
  InterpolationDynamic,
  CrochetText,
  CrochetValue,
  from_bool,
  CrochetInteger,
  False,
  True,
} from "../../runtime";
import { cast } from "../../utils";

@foreign_namespace("crochet.core:interpolation")
export class InterpolationFfi {
  @foreign()
  @machine()
  static concat(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);
    const b = cast(b0, CrochetInterpolation);

    return new CrochetInterpolation(a.parts.concat(b.parts));
  }

  @foreign()
  @machine()
  static parts(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetStream(a.parts.map((x) => x.to_part()));
  }

  @foreign()
  @machine()
  static holes(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetStream(
      a.parts
        .filter((x) => x instanceof InterpolationDynamic)
        .map((x) => x.to_part())
    );
  }

  @foreign("static-text")
  @machine()
  static static_text(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetText(a.parts.map((x) => x.to_static()).join(""));
  }

  @foreign()
  @machine()
  static normalise(x0: CrochetValue) {
    const a = cast(x0, CrochetInterpolation);
    return a.normalize();
  }
}

@foreign_namespace("crochet.core:text")
export class TextFfi {
  @foreign()
  @machine()
  static concat(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const b = cast(b0, CrochetText);

    return new CrochetText(a.value + b.value);
  }

  @foreign()
  @machine()
  static lines(x0: CrochetValue) {
    const x = cast(x0, CrochetText);
    return new CrochetStream(
      x.value.split(/\r\n|\r|\n/).map((x) => new CrochetText(x))
    );
  }

  @foreign("code-points")
  @machine()
  static code_points(x0: CrochetValue) {
    const x = cast(x0, CrochetText);
    const points = [];
    for (const point of x.value) {
      points.push(new CrochetInteger(BigInt(point.codePointAt(0))));
    }
    return new CrochetStream(points);
  }

  @foreign("from-code-points")
  @machine()
  static from_code_points(x0: CrochetValue) {
    const x = cast(x0, CrochetStream);
    const points = x.values.map((a) => Number(cast(a, CrochetInteger).value));
    const text = String.fromCodePoint(...points);
    return new CrochetText(text);
  }

  @foreign("ascii-ends-with")
  @machine()
  static ascii_ends_with(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const b = cast(b0, CrochetText);
    return from_bool(a.value.endsWith(b.value));
  }

  @foreign("ascii-starts-with")
  @machine()
  static ascii_starts_with(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const b = cast(b0, CrochetText);
    return from_bool(a.value.startsWith(b.value));
  }

  @foreign("ascii-contains")
  @machine()
  static ascii_contains(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const b = cast(b0, CrochetText);
    return from_bool(a.value.includes(b.value));
  }

  @foreign("ascii-trim-start")
  @machine()
  static ascii_trim_start(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return new CrochetText(a.value.trimStart());
  }

  @foreign("ascii-trim-end")
  @machine()
  static ascii_trim_end(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return new CrochetText(a.value.trimEnd());
  }

  @foreign("ascii-trim")
  @machine()
  static ascii_trim(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return new CrochetText(a.value.trim());
  }

  @foreign("ascii-to-upper")
  @machine()
  static ascii_to_upper(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return new CrochetText(a.value.toUpperCase());
  }

  @foreign("ascii-to-lower")
  @machine()
  static ascii_to_lower(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return new CrochetText(a.value.toLowerCase());
  }

  @foreign("is-ascii")
  @machine()
  static is_ascii(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    for (const x of a.value) {
      if ((x.codePointAt(0) ?? 0) >= 128) {
        return False.instance;
      }
    }
    return True.instance;
  }

  @foreign("is-empty")
  @machine()
  static is_empty(a0: CrochetValue) {
    const a = cast(a0, CrochetText);
    return from_bool(a.value.length === 0);
  }

  @foreign("repeat")
  @machine()
  static repeat(a0: CrochetValue, n0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const n = cast(n0, CrochetInteger);
    return new CrochetText(a.value.repeat(Number(n.value)));
  }
}

export default [TextFfi, InterpolationFfi];
