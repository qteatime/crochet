import * as Path from "path";

import { Capability, file, File, Package, Target } from "./ir";
import { logger } from "../utils/logger";
import { union } from "../utils/collections";
import {
  describe_target,
  missing_capabilities,
  restrict_capabilities,
  target_compatible,
} from "./ops";

export interface IPackageResolution {
  get_package(name: string): Promise<Package>;
}

export class PackageGraph {
  constructor(
    readonly target: Target,
    readonly trusted: Set<Package>,
    readonly packages: Map<string, ResolvedPackage>
  ) {}

  get capability_requirements() {
    const capabilities = new Map<string, ResolvedPackage[]>();
    for (const pkg of this.packages.values()) {
      for (const cap of pkg.capabilities) {
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
      const missing = [...missing_capabilities(capabilities, pkg.capabilities)];
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
        native_allowed(pkg, capabilities)
      ) {
        throw new Error(
          [
            `${name} (${pkg.filename}) defines native extensions, `,
            `but has not been granted the 'native' capability.\n`,
            `${parent} has granted the capabilities: `,
            [...capabilities].join(", "),
          ].join("")
        );
      }

      // check dependencies recursively
      for (const x of pkg.dependencies) {
        const dep = self.get_package(x.name);
        if (!visited.includes(dep)) {
          const new_capabilities = restrict_capabilities(
            capabilities,
            dep.capabilities
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

  check(root: ResolvedPackage, capabilities: Set<Capability>) {
    this.check_target(root);
    this.check_capabilities(root, capabilities);
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

export class ResolvedFile {
  constructor(readonly pkg: ResolvedPackage, readonly file: File) {}

  with_basename(x: string) {
    const dir = Path.dirname(this.file.filename);
    return new ResolvedFile(
      this.pkg,
      file({ filename: Path.join(dir, x), target: this.file.target })
    );
  }

  get basename() {
    return Path.basename(this.relative_filename);
  }

  get relative_filename() {
    return this.file.filename;
  }

  get relative_basename() {
    const dir = Path.dirname(this.relative_filename);
    const base = Path.basename(this.relative_filename, ".crochet");
    return Path.join(dir, base);
  }

  get absolute_directory() {
    return Path.dirname(this.absolute_filename);
  }

  get absolute_filename() {
    return Path.resolve(this.pkg.root, this.relative_filename);
  }

  get crochet_file() {
    if (this.is_crochet) {
      return this;
    } else {
      return new ResolvedFile(
        this.pkg,
        file({
          filename: Path.join(this.file.filename + ".crochet"),
          target: this.file.target,
        })
      );
    }
  }

  get is_crochet() {
    return this.extension === ".crochet";
  }

  get binary_image() {
    return Path.join(this.pkg.binary_root, this.relative_basename + ".croc");
  }

  get extension() {
    return Path.extname(this.relative_filename);
  }
}

export class ResolvedPackage {
  constructor(readonly pkg: Package, readonly target: Target) {}

  get name() {
    return this.pkg.meta.name;
  }

  get filename() {
    return this.pkg.filename;
  }

  get root() {
    return Path.dirname(this.filename);
  }

  get binary_root() {
    return Path.join(this.root, ".binary");
  }

  get dependencies() {
    return this.pkg.meta.dependencies.filter((x) =>
      target_compatible(this.target, x.target)
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

  get provided_capabilities() {
    return this.pkg.meta.capabilities.provides;
  }

  get capabilities() {
    return union(this.required_capabilities, this.provided_capabilities);
  }
}

export async function build_package_graph(
  root: Package,
  target: Target,
  trusted: Set<Package>,
  resolver: IPackageResolution
) {
  async function resolve(pkg: ResolvedPackage) {
    for (const dep of pkg.dependencies) {
      if (!packages.has(dep.name)) {
        logger.debug(`Resolving package ${dep.name} from ${pkg.name}`);
        const dep_meta = await resolver.get_package(dep.name);
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
  await resolve(resolved_pkg);
  return new PackageGraph(target, trusted, packages);
}
