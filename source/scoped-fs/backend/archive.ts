import { CrochetArchive } from "../../archive/archive";
import { ScopedFSBackend } from "./core";

export class ArchiveFSMapper extends ScopedFSBackend {
  constructor(readonly archive: CrochetArchive, private archive_path: string) {
    super();
  }

  get name() {
    return `archive(${this.archive_path})`;
  }

  equals(other: ScopedFSBackend): boolean {
    return (
      other instanceof ArchiveFSMapper &&
      other.archive === this.archive &&
      other.archive_path === this.archive_path
    );
  }

  async read(path: string): Promise<Buffer> {
    return this.archive.read(path);
  }
}
