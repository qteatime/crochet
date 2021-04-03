import { AnyTarget } from ".";
import { anyOf, map_spec, spec, string } from "../../utils";
import { Target } from "./target";

export class File {
  constructor(readonly filename: string, readonly target: Target) {}

  is_valid(target: Target) {
    return this.target.accepts(target);
  }

  static get spec() {
    return anyOf([
      map_spec(string, (n) => new File(n, new AnyTarget())),
      spec(
        {
          filename: string,
          target: Target,
        },
        (x) => new File(x.filename, x.target)
      ),
    ]);
  }
}
