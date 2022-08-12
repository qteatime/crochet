import * as Path from "path";
import * as FS from "fs/promises";
import * as SyncFS from "fs";
import * as Pkg from "../../pkg";
import { AggregatedFS } from "../../scoped-fs/aggregated-fs";
import { CrochetArchive } from "../../archive/archive";
import { BinaryReader } from "../../binary";
import { hash_file } from "../../binary-encode";
import { ScopedFS } from "../../scoped-fs/api";
import { ArchiveFSMapper } from "../../scoped-fs/backend/archive";
import { NativeFSMapper } from "../../scoped-fs/backend/native-mapper";

export class NodeFS extends AggregatedFS {
  static async with_stdlib() {
    const fs = new NodeFS();
    await fs.add_stdlib();
    return fs;
  }

  static async from_directory(path0: string) {
    const path = Path.resolve(path0);
    const json_path = Path.join(path, "crochet.json");
    const source = await FS.readFile(json_path, "utf-8");
    const pkg = Pkg.parse_from_string(source, json_path);

    const fs = new NodeFS();
    await fs.add_stdlib();
    await fs.add_directory(pkg.meta.name, path);
    return fs;
  }

  async add_archive(id: string, path: string, hash: string) {
    const data = await FS.readFile(path);
    const data_hash = hash_file(data).toString("hex");
    if (data_hash != hash) {
      throw new Error(
        `Cannot load archive ${path} for scope ${id}; integrity hash does not match ${hash}`
      );
    }
    const archive = CrochetArchive.decode(new BinaryReader(data));
    return this.add_scope(
      id,
      new ScopedFS(id, new ArchiveFSMapper(archive, path))
    );
  }

  async add_directory(id: string, root: string) {
    return this.add_scope(id, new ScopedFS(id, new NativeFSMapper(root)));
  }

  async add_stdlib() {
    const root = Path.resolve(__dirname, "../../../stdlib");
    const pkgs = await FS.readdir(root);
    for (const dir of pkgs) {
      const file = Path.join(root, dir, "crochet.json");
      if (SyncFS.existsSync(file)) {
        const source = await FS.readFile(file, "utf-8");
        const pkg = Pkg.parse_from_string(source, file);
        await this.add_scope(
          pkg.meta.name,
          new ScopedFS(
            pkg.meta.name,
            new NativeFSMapper(Path.resolve(root, dir)),
            true
          )
        );
      }
    }
    return this;
  }

  async to_package_map() {
    const result = new Map<string, Pkg.Package>();
    for (const { scope } of this.all_scopes()) {
      const pkg = await scope.read_package("crochet.json");
      result.set(pkg.meta.name, pkg);
    }
    return result;
  }
}

export function read_package_from_file(filename: string) {
  const source = SyncFS.readFileSync(filename, "utf-8");
  return Pkg.parse_from_string(source, filename);
}
