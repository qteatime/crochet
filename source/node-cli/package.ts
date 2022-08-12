import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import * as Build from "./build";
import * as Archive from "./archive";
import { NodeFS, read_package_from_file } from "../targets/node";
import { unreachable } from "../utils/utils";
import { random_uuid } from "../utils/uuid";
import { ScopedFS } from "../scoped-fs/api";
import { NativeFSMapper } from "../scoped-fs/backend/native-mapper";

type PkgData = {
  name: string;
  hash: string;
  path: string;
  token: string;
  tag: "archive" | "http";
};

export enum PackageType {
  BROWSER,
}

export function type_from_target(target: Package.Target) {
  switch (target.tag) {
    case Package.TargetTag.WEB:
      return PackageType.BROWSER;
    default:
      throw new Error(
        `${
          Package.TargetTag[target.tag]
        } is not supported as a packaging target.`
      );
  }
}

export async function package_app(
  filename: string,
  target0: Package.Target | null,
  out_dir0: string,
  capabilities: Set<string>
) {
  const fs = await NodeFS.from_directory(Path.dirname(filename));
  const pkg = read_package_from_file(filename);
  const target = target0 ?? pkg.meta.target;
  const rpkg = new Package.ResolvedPackage(pkg, target);
  const graph = await Package.build_package_graph(
    pkg,
    target,
    new Set(),
    await fs.to_package_map()
  );
  const out_dir = Path.join(out_dir0, pkg.meta.name);
  const package_type = type_from_target(target);
  const lib_dir = Path.join(out_dir, "library");

  if (FS.existsSync(out_dir)) {
    throw new Error(`Aborting. ${out_dir} is not empty`);
  }

  console.log(`Packaging ${pkg.meta.name} to ${out_dir}`);
  await mkdirp(out_dir);
  await mkdirp(lib_dir);
  const package_data = new Map<string, PkgData>();
  for (const dep of graph.serialise(rpkg)) {
    const scope = fs.get_scope(dep.name);
    const dep_dir = get_scope_root(scope);
    const dep_pkg = await scope.read_package("crochet.json");

    console.log(`--> Building ${dep_pkg.meta.name}`);
    await Build.build_from_file(
      Path.join(dep_dir, "crochet.json"),
      Package.target_any()
    );
    console.log(`--> Archiving ${dep_pkg.meta.name}`);
    const token = random_uuid();
    await mkdirp(Path.join(lib_dir, token));
    const { hash } = await Archive.archive_from_json(
      Path.join(dep_dir, "crochet.json"),
      Path.join(lib_dir, token, dep_pkg.meta.name + ".archive"),
      Package.target_any()
    );
    package_data.set(dep_pkg.meta.name, {
      name: dep_pkg.meta.name,
      hash: hash.toString("hex"),
      path: `library/${token}/${dep_pkg.meta.name}.archive`,
      token: token,
      tag: "archive",
    });
  }

  switch (package_type) {
    case PackageType.BROWSER: {
      await package_for_browser(
        pkg,
        filename,
        target,
        out_dir,
        lib_dir,
        package_data,
        capabilities
      );
      break;
    }

    default:
      throw unreachable(package_type, "Package Type");
  }

  console.log(`Done packaging.`);
}

export async function package_for_browser(
  pkg: Package.Package,
  filename: string,
  target: Package.Target,
  out_dir: string,
  lib_dir: string,
  package_data: Map<string, PkgData>,
  capabilities: Set<string>
) {
  console.log(`--> Copying Crochet's browser assets`);
  const www_dir = Path.join(__dirname, "../../www");
  await copy_tree(www_dir, out_dir);
  console.log(`--> Making index.html`);
  const index = template(Path.join(out_dir, "index.html"))({
    packages: [...package_data.values()],
    token: random_uuid(),
    capabilities: [...capabilities.values()],
    root_package: pkg.meta.name,
  });
  FS.writeFileSync(Path.join(out_dir, "index.html"), index);
  console.log(`--> Packaged to ${out_dir}`);
}

export async function copy_tree(from: string, to: string) {
  await mkdirp(to);
  for (const file of FS.readdirSync(from)) {
    if (/(^\.)/.test(file)) {
      console.log(
        `:: Skipping ${Path.join(from, file)} -- not copying special files`
      );
      continue;
    }

    const stat = FS.statSync(Path.join(from, file));
    if (stat.isFile()) {
      FS.copyFileSync(Path.join(from, file), Path.join(to, file));
    } else if (stat.isDirectory()) {
      await copy_tree(Path.join(from, file), Path.join(to, file));
    } else {
      throw new Error(`Unsupported resource type at ${Path.join(from, file)}`);
    }
  }
}

export async function mkdirp(path: string) {
  if (!FS.existsSync(path)) {
    FS.mkdirSync(path, { recursive: true });
  }
}

const template = (filename: string) => (config: unknown) => {
  const config_str = JSON.stringify(config).replace(/</g, "\\u003c");
  const source = FS.readFileSync(filename, "utf-8");
  return source.replace(/{{crochet_config}}/g, (_) => config_str);
};

function get_scope_root(scope: ScopedFS) {
  if (scope.backend instanceof NativeFSMapper) {
    return scope.backend.root;
  } else {
    throw new Error(`internal: Invalid scope backend for packaging`);
  }
}
