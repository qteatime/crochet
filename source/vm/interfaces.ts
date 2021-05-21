import type { ActivationLocation, CrochetValue } from "./intrinsics";

export interface ILocation {
  category: string;
  location: ActivationLocation;
}

export interface ITranscript {
  publish(tag: string, value: CrochetValue | string, location: ILocation): void;
}
