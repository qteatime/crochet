import { CrochetArchive } from "../../archive/archive";
import { BinaryReader } from "../../binary";
import { hash_file } from "../../binary-encode";
import { AggregatedFS } from "../../scoped-fs/aggregated-fs";
import { ScopedFS } from "../../scoped-fs/api";
import { ArchiveFSMapper } from "../../scoped-fs/backend/archive";
import { HttpFsMapper } from "../../scoped-fs/backend/http-mapper";

export class BrowserFS extends AggregatedFS {
  async add_archive(id: string, path: string, hash: string) {
    const data = Buffer.from(await (await fetch(path)).arrayBuffer());
    const data_hash = hash_file(data).toString("hex");
    if (data_hash != hash) {
      throw new Error(
        `Cannot load archive ${path} for scope ${id}; integrity hash does not match ${hash}`
      );
    }
    const archive = CrochetArchive.decode(new BinaryReader(data));
    return this.add_scope(id, new ScopedFS(new ArchiveFSMapper(archive)));
  }

  async add_endpoint(id: string, root: string) {
    return this.add_scope(id, new ScopedFS(new HttpFsMapper(root)));
  }
}
