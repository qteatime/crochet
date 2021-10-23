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
  const is_node = typeof process != "undefined";

  function now() {
    if (is_node) {
      return process.hrtime.bigint();
    } else {
      const us = performance.now();
      const integral = Math.trunc(us) * 1000;
      const fractional = Math.round((us - Math.trunc(us)) * 1000);
      return BigInt(integral) + BigInt(fractional);
    }
  }

  ffi.defmachine("debug.write", function* (text) {
    console.log(ffi.text_to_string(text));
    yield ffi.push_transcript("debug", ffi.text_to_string(text));
    return ffi.nothing;
  });

  ffi.defmachine("debug.write-inspect", function* (value) {
    console.debug("[INSPECT]", value);
    yield ffi.push_transcript("inspect", value);
    return ffi.nothing;
  });

  ffi.defmachine("debug.time", function* (label, computation) {
    const us_start = now();
    const result = yield ffi.apply(computation, []);
    const us_end = now();
    const diff = us_end - us_start;
    yield ffi.push_transcript(
      "time",
      `[${ffi.text_to_string(label)}] ${format_time_diff(diff)}`
    );
    return result;
  });
};
