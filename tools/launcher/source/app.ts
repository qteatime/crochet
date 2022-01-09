import * as FS from "fs";
import * as Path from "path";
import * as Package from "../../../build/pkg";
import * as Storage from "../../../build/storage";
import { CrochetForNode, build_file } from "../../../build/targets/node";
import * as DocTool from "../../../build/node-cli/docs";

export class App {
  constructor(readonly library_root: string, readonly pkg: Package.Package) {}

  static from_file(filename: string) {
    const source = FS.readFileSync(filename, "utf-8");
    const pkg = Package.parse_from_string(source, filename);
    const root = Path.dirname(filename);
    const library = Path.join(root, "library");
    return new App(library, pkg);
  }

  async build() {
    console.log("Building all dependencies...");
    const crochet = new CrochetForNode(false, [], new Set([]), false, true);
    await crochet.build(this.pkg.filename);
    for (const dep of this.pkg.meta.dependencies) {
      const dep_pkg = await crochet.fs.read_package(dep.name);
      await crochet.build(dep_pkg.filename);
    }
  }

  async docs() {
    const crochet = new CrochetForNode(false, [], new Set([]), false, true);
    const pkg = crochet.read_package_from_file(this.pkg.filename);
    const target = pkg.meta.target;
    await crochet.boot(pkg, target);
    const data = DocTool.generate_docs(pkg, crochet.system);
    const index = DocTool.template(pkg.meta.name, data);
    return index;
  }

  get resolved_package() {
    return new Package.ResolvedPackage(this.pkg, Package.target_web());
  }

  async binary(path: string) {
    const source = this.resolved_package.sources.find((x) =>
      Path.normalize(x.binary_image).includes(Path.normalize(path))
    );
    if (!source) {
      throw new Error(`Unknown binary path ${path}`);
    } else {
      return Path.resolve(source.binary_image);
    }
  }

  async native(path: string) {
    const source = this.resolved_package.native_sources.find(
      (x) =>
        Path.normalize(x.relative_filename) === Path.normalize("native/" + path)
    );
    if (!source) {
      throw new Error(`Unknown native source ${path}`);
    } else {
      return source.absolute_filename;
    }
  }

  get package_file() {
    return Path.resolve(this.pkg.filename);
  }

  previously_granted_capabilities() {
    const config = Storage.StorageConfig.load();
    const grants = config.grants(this.pkg.meta.name);
    return grants != null ? grants.capabilities : [];
  }

  update_granted_capabilities(capabilities: string[]) {
    const config = Storage.StorageConfig.load();
    config.update_grants(this.pkg.meta.name, capabilities);
  }
}

export class AppState {
  private apps = new Map<string, App>();

  app(id: string) {
    const x = this.apps.get(id);
    if (!x) {
      throw new Error(`Unknown capability ${x}`);
    }
    return x;
  }

  define(id: string, app: App) {
    if (this.apps.has(id)) {
      throw new Error(`Duplicated capability ${id}`);
    }
    this.apps.set(id, app);
  }
}
