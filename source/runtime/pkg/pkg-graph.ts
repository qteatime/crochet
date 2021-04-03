import { logger } from "../../utils";
import { Capabilities } from "./capability";
import { CrochetPackage, RestrictedCrochetPackage } from "./pkg";
import { Target } from "./target";

export interface IPackageResolution {
  get_package(name: string): Promise<CrochetPackage>;
}

export class PackageGraph {
  constructor(
    readonly target: Target,
    readonly packages: Map<string, RestrictedCrochetPackage>
  ) {}

  static async resolve(
    target: Target,
    resolver: IPackageResolution,
    pkg: CrochetPackage
  ): Promise<PackageGraph> {
    const packages = new Map<string, RestrictedCrochetPackage>();

    const resolve = async (pkg: CrochetPackage) => {
      for (const dep_meta of pkg.dependencies) {
        if (!packages.has(dep_meta.name)) {
          logger.debug(`Resolving package ${dep_meta.name} from ${pkg.name}`);
          const dep = await resolver.get_package(dep_meta.name);
          if (dep.name !== dep_meta.name) {
            throw new Error(
              `${pkg.name} includes a dependency on ${dep_meta.name}, but the loader returned the package ${dep.name}`
            );
          }
          packages.set(dep.name, dep.restricted_to(target));
          resolve(dep);
        }
      }
    };

    packages.set(pkg.name, pkg.restricted_to(target));
    await resolve(pkg);
    return new PackageGraph(target, packages);
  }

  get_package(name: string) {
    const pkg = this.packages.get(name);
    if (pkg == null) {
      throw new Error(`Package ${name} does not exist in the package graph`);
    }
    return pkg;
  }

  parents(name: string) {
    const visited = new Set<string>([name]);

    const collect = (pkg: RestrictedCrochetPackage) => {
      const result = [];
      for (const x of pkg.dependencies) {
        if (x.name === name) {
          result.push(x);
        }
        if (!visited.has(x.name)) {
          visited.add(x.name);
          result.push.apply(result, collect(this.get_package(x.name)));
        }
      }
      return result;
    };

    const pkg = this.get_package(name);
    return collect(pkg);
  }

  check_capabilities(name: string, capabilities: Capabilities) {
    const check = (
      visited: string[],
      parent: string,
      pkg: RestrictedCrochetPackage,
      capabilities: Capabilities
    ) => {
      const name = pkg.name;

      const missing = capabilities.require(pkg.required_capabilities);
      if (missing.size !== 0) {
        throw new Error(
          `${name} cannot be loaded from ${parent} because it does not have the capabilities: ${[
            ...missing,
          ].join(", ")}.\n${parent} has granted the capabilities: ${[
            ...capabilities.capabilities,
          ].join(", ")}`
        );
      }

      if (pkg.native_sources.length !== 0 && !capabilities.allows("native")) {
        throw new Error(
          `${pkg.name} (${
            pkg.filename
          }) defines native extensions, but has not been granted the 'native' capability..\n${parent} has granted the capabilities: ${[
            ...capabilities.capabilities,
          ].join(", ")}`
        );
      }

      for (const x of pkg.dependencies) {
        const dep = this.get_package(x.name);
        if (!visited.includes(x.name)) {
          const new_capabilities = capabilities.restrict(x.capabilities);
          check([x.name, ...visited], name, dep, new_capabilities);
        }
      }
    };

    logger.debug("Checking for capability violations");
    for (const [k, v] of this.packages.entries()) {
      logger.debug(
        `- ${k} requires: ${[...v.required_capabilities].join(", ")}`
      );
    }

    check([], "(root)", this.get_package(name), capabilities);
  }

  *serialise(root: string) {
    const self = this;
    const visited = new Set<string>([]);
    const collect = function* (
      pkg: RestrictedCrochetPackage
    ): Generator<RestrictedCrochetPackage> {
      const include = !visited.has(pkg.name);
      visited.add(pkg.name);
      for (const x of pkg.dependencies) {
        if (!visited.has(x.name)) {
          yield* collect(self.get_package(x.name));
        }
      }
      if (include) {
        yield pkg;
      }
    };

    yield* collect(this.get_package(root));
  }
}
