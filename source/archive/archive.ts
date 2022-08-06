import { ArchiveFile, CrochetArchiveReader } from "./codec";
import * as Pkg from "../pkg";
import { BinaryReader } from "../binary";

export class CrochetArchive {
  private constructor(readonly files: ArchiveFile[]) {}

  static decode(reader: BinaryReader) {
    const decoder = new CrochetArchiveReader();
    const files = decoder.read(reader);
    return new CrochetArchive(files);
  }
}
