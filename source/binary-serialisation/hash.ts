import { createHash } from "crypto";
import { BinaryReader } from "./binary";
import { MAGIC } from "./encode";

export function hash_file(source: string): Buffer {
  return createHash("sha256").update(source).digest();
}
