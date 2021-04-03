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
import { Capabilities, Capability, CrochetCapability } from "./capability";
import { Dependency } from "./dependency";
import { AnyTarget, Target } from "./target";

export interface PackageData {
  target: Target;
  name: string;
  sources: string[];
  native_sources: string[];
  dependencies: Dependency[];
  capabilities: {
    requires: Set<Capability>;
    provides: Set<Capability>;
  };
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
        target: Target,
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
      target: new AnyTarget(),
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
