import { anyOf, array, map_spec, spec, string } from "../../utils";
import { Capabilities, Capability, CrochetCapability } from "./capability";
import { AnyTarget, Target } from "./target";

export class Dependency {
  constructor(
    readonly name: string,
    readonly raw_capabilities: Set<Capability> | null,
    readonly target: Target
  ) {}

  get capabilities() {
    if (this.raw_capabilities == null) {
      return Capabilities.safe.capabilities;
    } else {
      return this.raw_capabilities;
    }
  }

  is_valid(x: Target) {
    return this.target.accepts(x);
  }

  static get spec() {
    return anyOf([
      map_spec(string, (x) => new Dependency(x, null, new AnyTarget())),
      spec(
        {
          name: string,
          capabilities: array(CrochetCapability),
          target: Target,
        },
        (x) => new Dependency(x.name, new Set(x.capabilities), x.target)
      ),
    ]);
  }
}
