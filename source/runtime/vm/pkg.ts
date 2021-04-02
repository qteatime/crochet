import * as Path from "path";
import {
  anyOf,
  array,
  difference,
  equal,
  map_spec,
  optional,
  parse,
  spec,
  string,
  union,
} from "../../utils";

export type Capability = "native" | "timing" | "reflection" | "html";

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

export interface PackageData {
  target: ("web" | "cli" | "*")[];
  name: string;
  sources: string[];
  native_sources: string[];
  dependencies: Dependency[];
  capabilities: {
    requires: Set<Capability>;
    provides: Set<Capability>;
  };
}

export class Capabilities {
  constructor(readonly capabilities: Set<Capability>) {}

  static get all() {
    return new Capabilities(
      new Set(["native", "timing", "reflection", "html"])
    );
  }

  allows(capability: Capability) {
    return this.capabilities.has(capability);
  }

  require(set: Set<Capability>) {
    return difference(this.capabilities, set);
  }

  restrict(new_set: Set<Capability>) {
    const missing = this.require(new_set);
    if (missing.size !== 0) {
      throw new Error(
        `Missing capabilities: ${[...missing.values()].join(", ")}`
      );
    }
    return new Capabilities(new_set);
  }
}

export abstract class CrochetCapability {
  static get spec() {
    return anyOf([
      equal("native" as "native"),
      equal("timing" as "timing"),
      equal("reflection" as "reflection"),
      equal("html" as "html"),
    ]);
  }
}

export class CrochetPackage {
  readonly root: string;
  constructor(readonly filename: string, private data: PackageData) {
    this.root = Path.resolve(Path.dirname(filename));
  }

  get name() {
    return this.data.name;
  }

  get targets() {
    return this.data.target;
  }

  get sources() {
    return this.data.sources.map((x) => this.resolve(x));
  }

  get native_sources() {
    return this.data.native_sources.map((x) => this.resolve(x));
  }

  get dependencies() {
    return this.data.dependencies;
  }

  get capabilities() {
    return this.data.capabilities;
  }

  get required_capabilities() {
    return union(this.capabilities.provides, this.capabilities.requires);
  }

  allows(x: Capability) {
    return this.required_capabilities.has(x);
  }

  resolve(source: string) {
    const resolved = Path.resolve(this.root, source);
    if (resolved.indexOf(this.root + "/") !== 0) {
      throw new Error(
        `${source} is outside of its package(${this.name})'s scope`
      );
    }
    return resolved;
  }

  static get spec() {
    return spec(
      {
        name: string,
        sources: array(string),
        native_sources: optional(array(string), []),
        target: optional(
          array(
            anyOf([
              equal("web" as "web"),
              equal("cli" as "cli"),
              equal("*" as "*"),
            ])
          ),
          ["*" as "*"]
        ),
        dependencies: optional(array(Dependency), []),
        capabilities: optional(
          spec(
            {
              requires: array(CrochetCapability),
              provides: array(CrochetCapability),
            },
            (x) => ({
              requires: new Set<Capability>(x.requires),
              provides: new Set<Capability>(x.provides),
            })
          ),
          { requires: new Set<Capability>(), provides: new Set<Capability>() }
        ),
      },
      (x) => (filename: string) => new CrochetPackage(filename, x)
    );
  }

  static parse(x: any, filename: string) {
    return parse(x, this.spec)(filename);
  }

  static empty(
    filename: string,
    capabilities: Capabilities,
    dependencies: string[]
  ) {
    return new CrochetPackage(filename, {
      name: "(empty)",
      sources: [],
      target: ["*"],
      native_sources: [],
      dependencies: dependencies.map(
        (x) => new Dependency(x, capabilities.capabilities)
      ),
      capabilities: {
        requires: capabilities.capabilities,
        provides: new Set(),
      },
    });
  }
}
