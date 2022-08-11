import * as FS from "fs/promises";
import * as Path from "path";
import { ForeignInterface } from "../../crochet";
import { ScopedFSBackend } from "./core";

export class NativeFSMapper extends ScopedFSBackend {
  readonly root: string;
  constructor(root: string) {
    super();
    this.root = Path.resolve(root);
  }

  async read(path0: string) {
    const path = Path.resolve(this.root, path0);
    if (!path.startsWith(this.root)) {
      throw new Error(`Invalid path ${path0} in scope ${this.root}`);
    }
    return FS.readFile(path);
  }

  // FIXME: this is unsafe
  async make_native_module(
    path: string,
    source: string
  ): Promise<(ffi: ForeignInterface) => any> {
    const real_path = Path.resolve(this.root, path);
    const module = require(real_path);
    return module.default;
  }
}
