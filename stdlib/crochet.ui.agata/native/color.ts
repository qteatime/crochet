import type { ForeignInterface } from "../../../build/crochet";

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

  ffi.defun("color.parse-hex", (code0) => {
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
};
