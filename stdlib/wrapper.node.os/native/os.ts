import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("os.abort", () => {
    process.abort();
    return ffi.nothing;
  });

  ffi.defun("os.exit", (code) => {
    process.exit(Number(ffi.integer_to_bigint(code)));
    return ffi.nothing;
  });

  ffi.defun("os.arch", () => {
    return ffi.text(process.arch);
  });

  ffi.defun("os.argv", () => {
    const args0 = process.argv.slice(2);
    const split_index = args0.indexOf("--");
    const args = split_index < 0 ? [] : args0.slice(split_index + 1);
    return ffi.tuple(args.map((x) => ffi.text(x)));
  });

  ffi.defun("os.chdir", (dir) => {
    process.chdir(ffi.text_to_string(dir));
    return ffi.nothing;
  });

  ffi.defun("os.cwd", () => {
    return ffi.text(process.cwd());
  });

  ffi.defun("os.env", () => {
    const map = new Map<string, CrochetValue>();
    for (const [k, v] of Object.entries(process.env)) {
      if (v != null) {
        map.set(k, ffi.text(v));
      }
    }
    return ffi.record(map);
  });

  ffi.defun("os.platform", () => {
    return ffi.text(process.platform);
  });

  ffi.defun("os.pid", () => {
    return ffi.integer(BigInt(process.pid));
  });
};
