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
  async add_archive(id: string, path: string, hash: string) {
    const data = await FS.readFile(path);
    const data_hash = hash_file(data).toString("hex");
    if (data_hash != hash) {
      throw new Error(
        `Cannot load archive ${path} for scope ${id}; integrity hash does not match ${hash}`
      );
    }
    const archive = CrochetArchive.decode(new BinaryReader(data));
    return this.add_scope(id, new ScopedFS(new ArchiveFSMapper(archive)));
  }

  async add_directory(id: string, root: string) {
    return this.add_scope(id, new ScopedFS(new NativeFSMapper(root)));
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
          new ScopedFS(new NativeFSMapper(Path.resolve(root, dir)), true)
        );
      }
    }
    return this;
  }
}
