import type { ForeignInterface } from "../../../build/crochet";
import type { Asset } from "../../../build/pkg";

export default (ffi: ForeignInterface) => {
  ffi.defun("pkg.name", (x) => {
    const pkg = ffi.get_underlying_package(x);
    return ffi.text(pkg.name);
  });

  ffi.defun("pkg.asset", (pkg0, path0) => {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = ffi.text_to_string(path0);
    const asset = pkg.metadata.assets.find((x) => x.relative_filename === path);
    if (asset == null) {
      throw ffi.panic("invalid-asset", `No asset ${path}`);
    }
    return ffi.record(
      new Map([
        ["path", ffi.text(asset.relative_filename)],
        ["mime", ffi.text(asset.mime_type)],
      ])
    );
  });

  ffi.defmachine("pkg.read-asset", function* (pkg0, path0) {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = ffi.text_to_string(path0);
    const buffer = yield ffi.await(
      ffi.read_file(pkg, path).then((x) => ffi.byte_array(x))
    );
    return buffer;
  });

  ffi.defmachine("pkg.read-asset-text", function* (pkg0, path0) {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = ffi.text_to_string(path0);
    const data = yield ffi.await(
      ffi.read_file_text(pkg, path).then((x) => ffi.text(x))
    );
    return data;
  });

  ffi.defun("pkg.make-browser-asset-url", (buffer0, type0) => {
    const buffer = ffi.to_uint8_array(buffer0);
    const type = ffi.text_to_string(type0);
    const blob = new Blob([buffer.buffer], { type: type });
    const url = URL.createObjectURL(blob);
    return ffi.text(url);
  });
};
