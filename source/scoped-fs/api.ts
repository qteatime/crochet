import * as Path from "path";
import type { ForeignInterface } from "../crochet";
import { ScopedFSBackend } from "./backend/core";
import * as Pkg from "../pkg";
import { normalize_path } from "../utils/normalize-path";

export class ScopedFS {
  constructor(
    readonly name: string,
    readonly backend: ScopedFSBackend,
    readonly is_trusted = false
  ) {}

  async read(path: string): Promise<Buffer> {
    if (!is_relative(path)) {
      throw new Error(
        `Non-relative path ${JSON.stringify(
          path
        )} is not allowed in scoped file systems.`
      );
    }
    return await this.backend.read(normalize_path(path));
  }

  async read_text(path: string): Promise<string> {
    return (await this.read(path)).toString("utf-8");
  }

  async read_package(path: string): Promise<Pkg.Package> {
    const source = await this.read_text(path);
    const pkg = Pkg.parse_from_string(source, path);
    return pkg;
  }

  async read_native_module(
    path: string
  ): Promise<(ffi: ForeignInterface) => any> {
    const source = await this.read_text(path);
    return await this.backend.make_native_module(path, source);
  }
}

function is_relative(path: string) {
  return !Path.isAbsolute(path) && !/(^|\/)\.\.(\/|$)/.test(path);
}
