import type { ForeignInterface } from "../../../build/crochet";
import type { CrochetValue, TraceSpan } from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("span.run", function* (desc, fun) {
    const result = yield ffi.with_span(
      ffi.text_to_string(desc),
      function* (span) {
        return yield ffi.apply(fun, [ffi.box(span)]);
      }
    );
    return result;
  });

  ffi.defun("span.name", (span) => {
    return ffi.text((ffi.unbox(span) as TraceSpan).description);
  });

  ffi.defun("span.parent", (span) => {
    const parent = (ffi.unbox(span) as TraceSpan).parent;
    if (parent == null) {
      return ffi.nothing;
    } else {
      return ffi.box(parent);
    }
  });

  ffi.defun("span.eq", (a, b) => {
    return ffi.boolean(ffi.unbox(a) === ffi.unbox(b));
  });
};
