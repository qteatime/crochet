import { CrochetValue } from "./value";

export abstract class CrochetUnit extends CrochetValue {
}

export abstract class CrochetTime extends CrochetUnit {}
export class CrochetMs extends CrochetTime {}
export class CrochetSeconds extends CrochetTime {}
export class CrochetMinutes extends CrochetTime {}
export class CrochetHours extends CrochetTime {}

export class CrochetInteger extends CrochetValue {
  constructor(readonly value: bigint, readonly unit: CrochetUnit | null) {
    super();
  }
}

export class CrochetFloat extends CrochetValue {
  constructor(readonly value: number, readonly unit: CrochetUnit | null) {
    super();
  }
}