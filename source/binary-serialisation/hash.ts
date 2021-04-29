import { createHash } from "crypto";
import { BinaryReader } from "./binary";
import { MAGIC } from "./encode";

export function hash_file(source: string): Buffer {
  return createHash("sha256").update(source).digest();
}

export function read_hash(binary: Buffer) {
  const reader = new BinaryReader(binary);
  reader.text(MAGIC);
  const version = reader.uint8();
  const hash = reader.bytes();
  return { version, hash };
}
