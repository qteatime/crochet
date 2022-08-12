import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import * as Build from "./build";
import { CrochetForNode, build, build_file, NodeFS } from "../targets/node";
import { unreachable } from "../utils/utils";
import { random_uuid } from "../utils/uuid";

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
  out_dir0: string
) {
  const crochet = new CrochetForNode(
    { universe: random_uuid(), packages: new Map() },
    await NodeFS.from_directory(Path.dirname(filename)),
    new Set([]),
    false,
    false
  );
  const pkg = crochet.read_package_from_file(filename);
  const out_dir = Path.join(out_dir0, pkg.meta.name);
  const target = target0 ?? pkg.meta.target;
  const package_type = type_from_target(target);

  if (FS.existsSync(out_dir)) {
    throw new Error(`Aborting. ${out_dir} is not empty`);
  }

  console.log(`Packaging ${pkg.meta.name} to ${out_dir}`);
  await mkdirp(out_dir);
  const lib_path = Path.join(out_dir, "library");
  await mkdirp(lib_path);
  for (const dep of pkg.meta.dependencies) {
    const dep_pkg = await crochet.fs
      .get_scope(dep.name)
      .read_package("crochet.json");
    console.log(`--> Copying ${dep_pkg.meta.name}`);
    await copy_tree(
      Path.dirname(dep_pkg.filename),
      Path.join(lib_path, dep_pkg.meta.name)
    );
    console.log(`--> Building ${dep_pkg.meta.name}`);
    await Build.build_from_file(
      Path.join(lib_path, dep_pkg.meta.name, "crochet.json"),
      target
    );
  }

  const app_path = Path.join(out_dir, "app");
  await mkdirp(app_path);
  console.log(`--> Copying ${pkg.meta.name}`);
  await copy_tree(Path.dirname(pkg.filename), app_path);
  console.log(`--> Building ${pkg.meta.name}`);
  await Build.build_from_file(Path.join(app_path, "crochet.json"), target);

  switch (package_type) {
    case PackageType.BROWSER: {
      await package_for_browser(pkg, filename, target, out_dir);
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
  out_dir: string
) {
  console.log(`--> Copying Crochet's browser assets`);
  const www_dir = Path.join(__dirname, "../../www");
  await copy_tree(www_dir, out_dir);
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
