import * as FS from "fs/promises";
import * as Path from "path";
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
}
