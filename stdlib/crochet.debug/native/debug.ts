import type { ForeignInterface } from "../../../build/crochet";

export function format_time_diff(n: bigint) {
  const units: [bigint, string][] = [
    [1000n, "μs"],
    [1000n, "ms"],
    [1000n, "s"],
  ];

  let value = n;
  let suffix = "ns";
  for (const [divisor, unit] of units) {
    if (value > divisor) {
      value = value / divisor;
      suffix = unit;
    } else {
      break;
    }
  }

  return `${value}${suffix}`;
}

export default (ffi: ForeignInterface) => {
  ffi.defun("debug.write", (text) => {
    console.log(ffi.text_to_string(text));
    return ffi.nothing;
  });

  ffi.defmachine("debug.write-inspect", function* (value) {
    const printer_type = ffi.lookup_type_namespaced(
      "crochet.core",
      "debug-printer"
    );
    if (printer_type == null) {
      console.log(ffi.to_debug_string(value));
      return ffi.nothing;
    } else {
      const printer = ffi.instantiate(printer_type, []);
      const repr = yield ffi.invoke("_ show: _", [printer, value]);
      console.log(ffi.text_to_string(repr));
      return ffi.nothing;
    }
  });

  ffi.defmachine("debug.time", function* (label, computation) {
    const ns_start = process.hrtime.bigint();
    const result = yield ffi.apply(computation, []);
    const ns_end = process.hrtime.bigint();
    const diff = ns_end - ns_start;
    console.log(`[${ffi.text_to_string(label)}] ${format_time_diff(diff)}`);
    return result;
  });
};
