import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("text.concat", (x, y) => {
    return ffi.text(ffi.text_to_string(x) + ffi.text_to_string(y));
  });

  ffi.defun("interpolation.concat", (x, y) => {
    return ffi.concat_interpolation(x, y);
  });

  ffi.defun("interpolation.parts", (x) => {
    return ffi.tuple(
      ffi.interpolation_to_parts(x).map((x) => {
        if (typeof x === "string") {
          return ffi.static_text(x);
        } else {
          return x;
        }
      })
    );
  });

  ffi.defun("interpolation.holes", (x) => {
    return ffi.tuple(
      ffi.interpolation_to_parts(x).filter((x) => typeof x !== "string") as any
    );
  });

  ffi.defun("interpolation.static-text", (x) => {
    return ffi.text(
      ffi
        .interpolation_to_parts(x)
        .map((x) => {
          if (typeof x === "string") {
            return x;
          } else {
            return "[_]";
          }
        })
        .join("")
    );
  });

  ffi.defun("interpolation.to-plain-text", (x) => {
    function flatten(x: any): string {
      return ffi
        .interpolation_to_parts(x)
        .map((x) => {
          if (typeof x === "string") {
            return x;
          } else if (ffi.is_interpolation(x)) {
            return flatten(x);
          } else {
            return ffi.text_to_string(x);
          }
        })
        .join("");
    }

    return ffi.text(flatten(x));
  });

  ffi.defun("interpolation.normalise", (x) => {
    return ffi.normalise_interpolation(x);
  });

  ffi.defun("text.repeat", (x0, n0) => {
    const x = ffi.text_to_string(x0);
    const n = Number(ffi.integer_to_bigint(n0));
    return ffi.text(x.repeat(n));
  });
};
