import { Machine } from "./run";

export type Frame = MachineFrame;

interface IFrame {}

export class MachineFrame {
  constructor(readonly parent: Frame | null, readonly machine: Machine) {}
}
