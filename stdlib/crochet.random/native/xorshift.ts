import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("xorshift.random-seed", () => {
    const rand = ffi.xorshift_random();
    return ffi.record(
      new Map([
        ["seed", ffi.integer(BigInt(rand.seed))],
        ["inc", ffi.integer(BigInt(Number(rand.inc)))],
      ])
    );
  });

  ffi.defun("xorshift.next-uniform", (seed0, inc0) => {
    const seed = Number(ffi.integer_to_bigint(seed0)) | 0;
    const inc = Number(ffi.integer_to_bigint(inc0)) | 0;
    const rand = ffi.xorshift(seed, inc);
    const value = rand.random();
    return ffi.record(
      new Map([
        ["value", ffi.float(value)],
        ["seed", ffi.integer(BigInt(rand.seed))],
        ["inc", ffi.integer(BigInt(rand.inc))],
      ])
    );
  });

  ffi.defun("xorshift.next-integer", (seed0, inc0, min0, max0) => {
    const seed = Number(ffi.integer_to_bigint(seed0)) | 0;
    const inc = Number(ffi.integer_to_bigint(inc0)) | 0;
    const min = Number(ffi.integer_to_bigint(min0));
    const max = Number(ffi.integer_to_bigint(max0));
    const rand = ffi.xorshift(seed, inc);
    const value = rand.random_integer(min, max);
    return ffi.record(
      new Map([
        ["value", ffi.integer(BigInt(value))],
        ["seed", ffi.integer(BigInt(rand.seed))],
        ["inc", ffi.integer(BigInt(rand.inc))],
      ])
    );
  });
};
