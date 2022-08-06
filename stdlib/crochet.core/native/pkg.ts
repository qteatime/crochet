import type { ForeignInterface } from "../../../build/crochet";
import { Universe } from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  ffi.defun("pkg.name", (x) => {
    const pkg = ffi.get_underlying_package(x);
    return ffi.text(pkg.name);
  });

  ffi.defun("pkg.asset", (pkg0, path0) => {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = ffi.text_to_string(path0);
    const asset = pkg.metadata.assets.find((x) => x.path === path);
    if (asset == null) {
      throw ffi.panic("invalid-asset", `No asset ${path}`);
    }
    return ffi.text(asset.path);
  });

  ffi.defun("pkg.asset-location-node", (pkg0, path0) => {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = ffi.text_to_string(path0);
    const full_path = require("path").resolve(pkg.metadata.assets_root, path);
    if (!full_path.startsWith(pkg.metadata.assets_root)) {
      throw ffi.panic(
        "invalid-asset",
        `Asset ${path} does not have a valid path`
      );
    }
    return ffi.text(full_path);
  });

  ffi.defmachine("pkg.asset-location-web", function* (pkg0, path0) {
    const pkg = ffi.get_underlying_package(pkg0);
    const path = decodeURI(ffi.text_to_string(path0));
    if (/\b\.\.\b/.test(path)) {
      throw ffi.panic(
        "invalid-asset",
        `Asset ${path} does not have a valid path`
      );
    }
    const full_path = `assets/${pkg.token}/${path}`;
    return ffi.text(full_path);
  });
};
