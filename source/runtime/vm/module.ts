import * as Path from "path";
import { Bag, logger } from "../../utils";
import { RestrictedCrochetPackage } from "../pkg";
import { CrochetType, CrochetValue } from "../primitives";
import { CrochetTest, World } from "../world";

export class CrochetModule {
  readonly local_types = new Bag<string, CrochetType>("type");
  readonly local_values = new Bag<string, CrochetValue>("local");
  readonly open_namespaces: Set<string>;

  constructor(
    readonly world: World,
    readonly filename: string,
    readonly pkg: RestrictedCrochetPackage
  ) {
    this.open_namespaces = new Set([pkg.name, "crochet.core"]);
  }

  get relative_filename() {
    return this.pkg.relative_filename(this.filename);
  }

  namespace_allowed(ns: string) {
    return this.pkg.dependencies.some((x) => x.name === ns);
  }

  open_namespace(ns: string) {
    if (!this.namespace_allowed(ns)) {
      throw new Error(
        `Module ${this.relative_filename} is not allowed to open namespace ${ns} because it is not declared as a dependency in package ${this.pkg.name}`
      );
    }
    this.open_namespaces.add(ns);
  }

  private namespaced(ns: string, name: string) {
    return `${ns}::${name}`;
  }

  try_lookup_type(name: string) {
    const local = this.local_types.try_lookup(name);
    if (local != null) {
      return local;
    } else {
      for (const ns of this.open_namespaces) {
        const type = this.world.types.try_lookup(this.namespaced(ns, name));
        if (type != null) {
          return type;
        }
      }
      return null;
    }
  }

  lookup_type(name: string) {
    const type = this.try_lookup_type(name);
    if (type == null) {
      const opened = [...this.open_namespaces].join(", ");
      throw new Error(
        `No type ${name} is accessible from module ${this.relative_filename} in package ${this.pkg.name}.\nOpened packages: ${opened}`
      );
    } else {
      return type;
    }
  }

  add_type(name: string, type: CrochetType, local: boolean) {
    if (local) {
      logger.debug(
        `Adding local type ${name} in module ${this.relative_filename}`
      );
      this.local_types.add(name, type);
    } else {
      const ns_name = this.namespaced(this.pkg.name, name);
      logger.debug(
        `Adding namespaced type ${ns_name} from module ${this.relative_filename}`
      );
      this.world.types.add(ns_name, type);
    }
  }

  try_lookup_value(name: string) {
    const local = this.local_values.try_lookup(name);
    if (local != null) {
      return local;
    } else {
      for (const ns of this.open_namespaces) {
        const type = this.world.globals.try_lookup(this.namespaced(ns, name));
        if (type != null) {
          return type;
        }
      }
      return null;
    }
  }

  lookup_value(name: string) {
    const value = this.try_lookup_value(name);
    if (value == null) {
      const opened = [...this.open_namespaces].join(", ");
      throw new Error(
        `No definition ${name} is accessible from module ${this.relative_filename} in package ${this.pkg.name}.\nOpened packages: ${opened}`
      );
    } else {
      return value;
    }
  }

  add_value(name: string, value: CrochetValue, local: boolean) {
    if (local) {
      logger.debug(
        `Adding local value ${name} in module ${this.relative_filename}`
      );
      this.local_values.add(name, value);
    } else {
      const ns_name = this.namespaced(this.pkg.name, name);
      logger.debug(
        `Adding namespaced value ${ns_name} from module ${this.relative_filename}`
      );
      this.world.globals.add(ns_name, value);
    }
  }

  add_test(test: CrochetTest) {
    this.world.tests.push(test);
  }
}
