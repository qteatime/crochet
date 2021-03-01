import { State } from "../vm";

export class Interpolation<T> {
  private parts: InterpolationPart<T>[] = [];
}

export type InterpolationPart<T> = StaticPart | DynamicPart<T>;

export class StaticPart {
  constructor(value: string) {}
}

export class DynamicPart<T> {
  constructor(value: T) {}
}
