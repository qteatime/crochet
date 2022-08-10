import { ArchiveFile, CrochetArchiveReader } from "./codec";
import * as Pkg from "../pkg";
import { BinaryReader } from "../binary";

export class CrochetArchive {
  readonly fs: Map<string, ArchiveFile>;

  private constructor(files: ArchiveFile[]) {
    this.fs = new Map();
    for (const file of files) {
      this.fs.set(file.path, file);
    }
  }

  read(path: string) {
    const file = this.fs.get(path);
    if (!file) {
      throw new Error(`File not found in archive: ${path}`);
    }
    return file.data;
  }

  get files() {
    return this.fs.values();
  }

  static decode(reader: BinaryReader) {
    const decoder = new CrochetArchiveReader();
    const files = decoder.read(reader);
    return new CrochetArchive(files);
  }
}
