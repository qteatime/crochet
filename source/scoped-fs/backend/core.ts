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
    new Function("require", "__filename", "module", source)(
      make_restricted_require(path),
      path,
      module
    );
    return module.exports;
  }
}
