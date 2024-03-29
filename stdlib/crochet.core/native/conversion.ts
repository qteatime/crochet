import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function parse_colour(colour: string) {
    const re =
      /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/;
    const match = colour.match(re);
    if (match == null) {
      throw ffi.panic("invalid-value", `Not a valid colour code: ${colour}`);
    } else {
      const [_, r, g, b, a] = match;
      return {
        red: parseInt(r, 16),
        green: parseInt(g, 16),
        blue: parseInt(b, 16),
        alpha: !a ? 255 : parseInt(a, 16),
      };
    }
  }

  ffi.defun("conversion.list-to-interpolation", (xs) => {
    return ffi.interpolation(ffi.list_to_array(xs));
  });

  ffi.defun("conversion.colour-code-to-components", (code0) => {
    const x = parse_colour(ffi.text_to_string(code0));
    return ffi.record(
      new Map([
        ["red", ffi.integer(BigInt(x.red))],
        ["green", ffi.integer(BigInt(x.green))],
        ["blue", ffi.integer(BigInt(x.blue))],
        ["alpha", ffi.integer(BigInt(x.alpha))],
      ])
    );
  });

  ffi.defun("conversion.map-to-record", (entries0) => {
    const entries = ffi.list_to_array(entries0).map((entry) => {
      const [k, v] = ffi.list_to_array(entry);
      return [ffi.text_to_string(k), v] as [string, CrochetValue];
    });
    return ffi.record(new Map(entries));
  });
};
