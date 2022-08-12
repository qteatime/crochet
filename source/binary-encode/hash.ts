import { BinaryLike, createHash } from "crypto";

export function hash_file(source: BinaryLike): Buffer {
  return createHash("sha256").update(source).digest();
}
