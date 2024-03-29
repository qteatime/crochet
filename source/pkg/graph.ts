import * as Path from "path";

import { Asset, Capability, file, File, Package, Target } from "./ir";
import { logger } from "../utils/logger";
import { intersect, union } from "../utils/collections";
import {
  describe_target,
  missing_capabilities,
  restrict_capabilities,
  target_compatible,
} from "./ops";
import { target_any } from ".";
const PosixPath = Path.posix;

export interface IPackageResolution {
  get_package(name: string): Promise<Package>;
}

export class PackageGraph {
  constructor(
    readonly root: ResolvedPackage,
    readonly target: Target,
    readonly trusted: Set<Package>,
    readonly packages: Map<string, ResolvedPackage>
  ) {}

  get capability_requirements() {
    const capabilities = new Map<string, ResolvedPackage[]>();
    for (const pkg of this.packages.values()) {
      for (const cap of pkg.required_capabilities) {
        const xs = capabilities.get(cap) ?? [];
        xs.push(pkg);
        capabilities.set(cap, xs);
      }
    }
    return capabilities;
  }

  get capability_providers() {
    const providers = new Map<string, ResolvedPackage[]>();
    for (const pkg of this.packages.values()) {
      for (const cap of pkg.provided_capabilities) {
        const xs = providers.get(cap) ?? [];
        xs.push(pkg);
        providers.set(cap, xs);
      }
    }
    return providers;
  }

  get_package(name: string) {
    const pkg = this.packages.get(name);
    if (pkg == null) {
      throw new Error(`Package ${name} does not exist in the package graph.`);
    }
    return pkg;
  }

  parents(root: ResolvedPackage): ResolvedPackage[] {
    const result = new Set<ResolvedPackage>();
    for (const pkg of this.packages.values()) {
      for (const dep of pkg.dependencies) {
        if (dep.name === root.name) {
          result.add(pkg);
        }
      }
    }
    return [...result];
  }

  check_target(root: ResolvedPackage) {
    logger.debug(
      `Checking for target violations (target: ${describe_target(this.target)})`
    );
    for (const pkg of this.serialise(root)) {
      logger.debug(
        `  - ${pkg.name} has target: ${describe_target(pkg.target)}`
      );
      if (!target_compatible(this.target, pkg.target)) {
        const parents = this.parents(pkg)
          .map((x) => x.name)
          .join(", ");
        throw new Error(
          [
            `Cannot load package ${pkg.name} `,
            `(included in ${parents}) `,
            `for target ${describe_target(this.target)} `,
            `because it requires the target ${describe_target(pkg.target)}`,
          ].join("")
        );
      }
    }
  }

  check_capabilities(root: ResolvedPackage, capabilities: Set<Capability>) {
    const self = this;

    function native_allowed(
      pkg: ResolvedPackage,
      capabilities: Set<Capability>
    ) {
      return capabilities.has("native") || self.trusted.has(pkg.pkg);
    }

    function check(
      visited: ResolvedPackage[],
      parent: string,
      pkg: ResolvedPackage,
      capabilities: Set<Capability>
    ) {
      const name = pkg.name;

      // check missing capabilities
      const missing = [
        ...missing_capabilities(capabilities, pkg.required_capabilities),
      ];
      if (missing.length !== 0) {
        throw new Error(
          [
            `${name} cannot be loaded from ${parent} `,
            `because it does not have the capabilities: `,
            missing.join(", "),
            `\n`,
            `${parent} has granted the capabilities: `,
            [...capabilities].join(", "),
          ].join("")
        );
      }

      // check native capabilities
      if (
        pkg.native_sources.length !== 0 &&
        !native_allowed(pkg, capabilities)
      ) {
        throw new Error(
          [
            `${name} defines native extensions, `,
            `but has not been granted the 'native' capability.\n`,
            `${parent} has granted the capabilities: `,
            [...capabilities].join(", "),
          ].join("")
        );
      }

      // check trusted capabilities
      if (pkg.trusted_capabilities.size > 0 && !self.trusted.has(pkg.pkg)) {
        throw new Error(
          [
            `${name} defines trusted capabilities, `,
            `but the package is not part of Crochet's Trusted Computing Base.\n`,
          ].join("")
        );
      }

      // commit required capabilities
      pkg.granted_capabilities.clear();
      for (const x of pkg.required_capabilities) {
        pkg.granted_capabilities.add(x);
      }
      for (const x of pkg.optional_capabilities) {
        if (capabilities.has(x)) {
          pkg.granted_capabilities.add(x);
        }
      }
      for (const x of pkg.trusted_capabilities) {
        pkg.granted_capabilities.add(x);
      }

      // check dependencies recursively
      for (const x of pkg.dependencies) {
        const dep = self.get_package(x.name);
        if (!visited.includes(dep)) {
          const new_capabilities = restrict_capabilities(
            capabilities,
            dep.accepted_capabilities
          );

          check([dep, ...visited], name, dep, new_capabilities);
        }
      }
    }

    logger.debug(
      [
        `Checking for capability violations `,
        `(capabilities: ${[...capabilities].join(", ")})`,
      ].join("")
    );
    for (const [k, v] of this.packages.entries()) {
      logger.debug(
        `  - ${k} requires: ${[...v.required_capabilities].join(", ")}`
      );
    }

    check([], `(root)`, root, capabilities);
  }

  check(
    root: ResolvedPackage,
    capabilities: Set<Capability>,
    safe_mode: boolean
  ) {
    this.check_target(root);
    if (!safe_mode) {
      this.check_capabilities(root, capabilities);
    }
  }

  commit_capabilities(root: ResolvedPackage, capabilities: Set<Capability>) {
    const self = this;

    function commit(pkg: ResolvedPackage, capabilities: Set<Capability>) {
      const granted = intersect(capabilities, pkg.required_capabilities);
      for (const cap of granted) {
        pkg.granted_capabilities.add(cap);
      }

      for (const dep of pkg.dependencies) {
        const dep_grants = intersect(capabilities, dep.capabilities);
        const dep_pkg = self.get_package(dep.name);
        commit(dep_pkg, dep_grants);
      }
    }

    commit(root, capabilities);
  }

  *serialise(root: ResolvedPackage) {
    function* collect(pkg: ResolvedPackage): Generator<ResolvedPackage> {
      const include = !visited.has(pkg);
      visited.add(pkg);
      for (const x of pkg.dependencies) {
        const dep = self.get_package(x.name);
        if (!visited.has(dep)) {
          yield* collect(dep);
        }
      }
      if (include) {
        yield pkg;
      }
    }

    const self = this;
    const visited = new Set<ResolvedPackage>();
    yield* collect(root);
  }
}

export class AssetFile {
  constructor(readonly pkg: ResolvedPackage, readonly asset: Asset) {}

  get relative_filename() {
    return this.asset.path;
  }

  get basename() {
    return PosixPath.basename(this.relative_filename);
  }

  get extension() {
    return PosixPath.extname(this.relative_filename);
  }

  get mime_type() {
    return this.asset.mime;
  }
}

export class ResolvedFile {
  constructor(readonly pkg: ResolvedPackage, readonly file: File) {}

  with_basename(x: string) {
    const dir = PosixPath.dirname(this.file.filename);
    return new ResolvedFile(
      this.pkg,
      file({ filename: PosixPath.join(dir, x), target: this.file.target })
    );
  }

  get basename() {
    return PosixPath.basename(this.relative_filename);
  }

  get relative_filename() {
    return this.file.filename;
  }

  get relative_basename() {
    const dir = PosixPath.dirname(this.relative_filename);
    const base = PosixPath.basename(this.relative_filename, ".crochet");
    return PosixPath.join(dir, base);
  }

  get crochet_file(): ResolvedFile {
    if (this.is_crochet) {
      return this;
    } else {
      return new ResolvedFile(
        this.pkg,
        file({
          filename: PosixPath.join(this.file.filename + ".crochet"),
          target: this.file.target,
        })
      );
    }
  }

  get is_crochet() {
    return this.extension === ".crochet";
  }

  get relative_binary_image() {
    return PosixPath.join(
      this.pkg.binary_dir,
      this.relative_basename + ".croc"
    );
  }

  get extension() {
    return PosixPath.extname(this.relative_filename);
  }
}

export class ResolvedPackage {
  readonly granted_capabilities = new Set<Capability>();

  constructor(readonly pkg: Package, readonly target: Target) {}

  get name() {
    return this.pkg.meta.name;
  }

  get filename() {
    return this.pkg.filename;
  }

  get binary_dir() {
    return ".binary";
  }

  get dependencies() {
    return this.pkg.meta.dependencies.filter((x) =>
      target_compatible(this.target, x.target)
    );
  }

  get readme() {
    return new ResolvedFile(
      this,
      file({ filename: "README.md", target: target_any() })
    );
  }

  get sources() {
    return this.pkg.meta.sources
      .filter((x) => target_compatible(this.target, x.target))
      .map((x) => new ResolvedFile(this, x));
  }

  get native_sources() {
    return this.pkg.meta.native_sources
      .filter((x) => target_compatible(this.target, x.target))
      .map((x) => new ResolvedFile(this, x));
  }

  get required_capabilities() {
    return this.pkg.meta.capabilities.requires;
  }

  get optional_capabilities() {
    return this.pkg.meta.capabilities.optional;
  }

  get accepted_capabilities() {
    return union(this.required_capabilities, this.optional_capabilities);
  }

  get provided_capabilities() {
    const provided = [...this.pkg.meta.capabilities.provides];
    return new Set(provided.map((x) => `${this.name}/${x.name}`));
  }

  get trusted_capabilities() {
    return this.pkg.meta.capabilities.trusted;
  }

  get assets() {
    return this.pkg.meta.assets.map((x) => {
      return new AssetFile(this, x);
    });
  }
}

export function build_package_graph(
  root: Package,
  target: Target,
  trusted: Set<Package>,
  package_map: Map<string, Package>
) {
  function resolve(pkg: ResolvedPackage) {
    for (const dep of pkg.dependencies) {
      if (!packages.has(dep.name)) {
        logger.debug(`Resolving package ${dep.name} from ${pkg.name}`);
        const dep_meta = package_map.get(dep.name);
        if (dep_meta == null) {
          throw new Error(`${dep.name} is not defined in the package map`);
        }
        if (dep.name !== dep_meta.meta.name) {
          throw new Error(
            `${pkg.name} includes a dependency on ${dep.name}, but the loader returned the package ${dep.name}`
          );
        }
        const resolved_dep = new ResolvedPackage(dep_meta, target);
        packages.set(resolved_dep.name, resolved_dep);
        resolve(resolved_dep);
      }
    }
  }

  const packages = new Map<string, ResolvedPackage>();
  const resolved_pkg = new ResolvedPackage(root, target);
  packages.set(resolved_pkg.name, resolved_pkg);
  resolve(resolved_pkg);
  return new PackageGraph(resolved_pkg, target, trusted, packages);
}
