import { CrochetArchive } from "../../archive/archive";
import type { ForeignInterface } from "../../crochet";
import { make_restricted_require } from "../../native-ffi/restricted-require";
import { ScopedFSBackend } from "./core";

export class ArchiveFSMapper extends ScopedFSBackend {
  constructor(readonly archive: CrochetArchive) {
    super();
  }

  async read(path: string): Promise<Buffer> {
    return this.archive.read(path);
  }
}
