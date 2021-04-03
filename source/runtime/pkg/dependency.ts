import { anyOf, array, map_spec, spec, string } from "../../utils";
import { Capabilities, Capability, CrochetCapability } from "./capability";

export class Dependency {
  constructor(
    readonly name: string,
    readonly raw_capabilities: Set<Capability> | null
  ) {}

  get capabilities() {
    if (this.raw_capabilities == null) {
      return Capabilities.safe.capabilities;
    } else {
      return this.raw_capabilities;
    }
  }

  static get spec() {
    return anyOf([
      map_spec(string, (x) => new Dependency(x, null)),
      spec(
        {
          name: string,
          capabilities: array(CrochetCapability),
        },
        (x) => new Dependency(x.name, new Set(x.capabilities))
      ),
    ]);
  }
}
