import * as Path from "path";
import { hash_file } from "../binary-encode";
import type { BinaryReader, BinaryWriter } from "../binary/binary";
import { normalize_path } from "../utils/normalize-path";

const MAGIC = "CARC";
const VERSION = 1;

export class ArchiveFile {
  constructor(readonly path: string, readonly data: Buffer) {}
}

export class CrochetArchiveWriter {
  private files: ArchiveFile[] = [];

  add_file(path0: string, data: Buffer) {
    const path = normalize_path(path0);
    if (Path.isAbsolute(path0) || /(^|\/)\.\.($|\/)/.test(path)) {
      throw new Error(`Invalid path: ${path}`);
    }
    if (this.files.some((x) => x.path === path)) {
      throw new Error(`Duplicated path: ${path}`);
    }
    this.files.push(new ArchiveFile(path, data));
    return this;
  }

  write(target: BinaryWriter) {
    target.text(MAGIC);
    target.uint16(VERSION);
    target.array(this.files, (file) => {
      target.string(file.path);
      target.bytes(hash_file(file.data));
      target.bytes(file.data);
    });
  }
}

export class CrochetArchiveReader {
  read(source: BinaryReader) {
    source.text(MAGIC);
    const version = source.uint16();
    if (version !== VERSION) {
      throw new Error(
        `Unexpected version: Got ${version}, but expected ${VERSION}`
      );
    }
    return source.array((_) => {
      const path = source.string();
      const hash = source.bytes();
      const data = source.bytes();
      const got_hash = hash_file(data);
      if (!got_hash.equals(hash)) {
        throw new Error(
          `Corrupted archive entry: ${path}. Expected hash ${hash}, but got ${got_hash}`
        );
      }
      return new ArchiveFile(path, data);
    });
  }
}
