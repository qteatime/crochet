import { CrochetModule } from "./intrinsics";

export class CrochetError extends Error {}

export class ErrArbitrary extends CrochetError {
  constructor(readonly tag: string, readonly message: string) {
    super(`${tag}: ${message}`);
  }
}
