import { CrochetArchive } from "../../archive/archive";
import { ScopedFSBackend } from "./core";

export class ArchiveFSMapper extends ScopedFSBackend {
  constructor(readonly archive: CrochetArchive, private archive_path: string) {
    super();
  }

  get name() {
    return `archive(${this.archive_path})`;
  }

  async read(path: string): Promise<Buffer> {
    return this.archive.read(path);
  }
}
