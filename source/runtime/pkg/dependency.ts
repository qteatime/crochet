import { anyOf, array, map_spec, spec, string } from "../../utils";
import { Capability, CrochetCapability } from "./capability";

export class Dependency {
  constructor(
    readonly name: string,
    readonly capabilities: Set<Capability> | null
  ) {}

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
