import * as Path from "path";
import { array, optional, parse, spec, string, union } from "../../utils";
import { Capabilities, Capability, CrochetCapability } from "./capability";
import { Dependency } from "./dependency";
import { Target } from "./target";
import { File } from "./file";

export interface PackageData {
  name: string;
  sources: File[];
  native_sources: File[];
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

  sources_for(target: Target) {
    return this.data.sources
      .filter((x) => x.is_valid(target))
      .map((x) => this.resolve(x.filename));
  }

  native_sources_for(target: Target) {
    return this.data.native_sources
      .filter((x) => x.is_valid(target))
      .map((x) => this.resolve(x.filename));
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

  restricted_to(target: Target) {
    return new RestrictedCrochetPackage(target, this);
  }

  static get spec() {
    return spec(
      {
        name: string,
        sources: array(File),
        native_sources: optional(array(File), []),
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

export class RestrictedCrochetPackage extends CrochetPackage {
  constructor(readonly target: Target, pkg: CrochetPackage) {
    super(pkg.filename, (pkg as any).data);
  }

  get sources() {
    return this.sources_for(this.target);
  }

  get native_sources() {
    return this.native_sources_for(this.target);
  }
}
