import { difference, intersect } from "../utils/collections";
import { unreachable } from "../utils/utils";
import { Capability, Target, TargetTag } from "./ir";

export function target_compatible(self: Target, that: Target) {
  switch (self.tag) {
    case TargetTag.ANY:
      return true;

    case TargetTag.NODE:
      return that.tag === TargetTag.NODE || that.tag === TargetTag.ANY;

    case TargetTag.WEB:
      return that.tag === TargetTag.WEB || that.tag === TargetTag.ANY;

    default:
      throw unreachable(self, `Target`);
  }
}

export function describe_target(x: Target) {
  switch (x.tag) {
    case TargetTag.ANY:
      return "*";
    case TargetTag.NODE:
      return "node";
    case TargetTag.WEB:
      return "web";
    default:
      throw unreachable(x, "Target");
  }
}

export function missing_capabilities(
  total: Set<Capability>,
  required: Set<Capability>
) {
  return difference(required, total);
}

export function restrict_capabilities(
  current: Set<Capability>,
  required: Set<Capability>
) {
  return intersect(current, required);
}
