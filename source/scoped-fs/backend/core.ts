import type { ForeignInterface } from "../../crochet";
import { make_restricted_require } from "../../native-ffi/restricted-require";

export abstract class ScopedFSBackend {
  abstract name: string;
  abstract read(path: string): Promise<Buffer>;

  equals(other: ScopedFSBackend): boolean {
    return false;
  }

  write(path: string, data: Buffer): Promise<void> {
    throw new Error(
      `Cannot write to ${path} in read-only file system ${this.name}.`
    );
  }

  async make_native_module(
    path: string,
    source: string
  ): Promise<(ffi: ForeignInterface) => any> {
    const module = Object.create(null);
    module.exports = Object.create(null);
    if ((process as any)?.browser === true) {
      new Function("exports", source)(module.exports);
    } else {
      new Function("require", "__filename", "module", "exports", source)(
        make_restricted_require(path),
        path,
        module,
        module.exports
      );
    }

    if (typeof module.exports.default === "function") {
      return module.exports.default;
    } else {
      throw new Error(
        [
          `Native module ${path} in ${this.name}`,
          `does not expose a function in 'exports.default'.`,
        ].join("")
      );
    }
  }
}
