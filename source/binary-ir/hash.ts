import { createHash } from "crypto";

export function hash_file(source: string): Buffer {
  return createHash("sha256").update(source).digest();
}
