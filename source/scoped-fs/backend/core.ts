import type { ForeignInterface } from "../../crochet";
import { make_restricted_require } from "../../native-ffi/restricted-require";

export abstract class ScopedFSBackend {
  abstract read(path: string): Promise<Buffer>;

  async make_native_module(
    path: string,
    source: string
  ): Promise<(ffi: ForeignInterface) => any> {
    const module = Object.create(null);
    module.exports = Object.create(null);
    new Function("require", "__filename", "module", "exports", source)(
      make_restricted_require(path),
      path,
      module,
      module.exports
    );

    if (typeof module.exports.default === "function") {
      return module.exports.default;
    } else {
      throw new Error(
        [
          `Native module ${path} `, // FIXME: include scope
          `does not expose a function in 'exports.default'.`,
        ].join("")
      );
    }
  }
}
