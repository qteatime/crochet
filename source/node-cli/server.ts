import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import * as Build from "./build";
import type * as Express from "express";
import { NodeFS, read_package_from_file } from "../targets/node";
import { random_uuid } from "../utils/uuid";
import { randomUUID } from "crypto";
import { ScopedFS } from "../scoped-fs/api";
import { NativeFSMapper } from "../scoped-fs/backend/native-mapper";

const stdlib_root = Path.resolve(__dirname, "../../stdlib");

function stdlib_packages(): {
  name: string;
  hash: string;
  filename: string;
}[] {
  return require("../../stdlib/_build/packages.json");
}

function get_kind(x: Package.Target) {
  switch (x.tag) {
    case Package.TargetTag.NODE:
      return "node";
    case Package.TargetTag.ANY:
      return "browser";
    case Package.TargetTag.WEB:
      return "browser";
    default:
      throw new Error(`Unknown target`);
  }
}

export default async (
  root: string,
  port: number,
  www: string,
  start_page: string,
  target: Package.Target,
  capabilities: Set<string>
) => {
  // -- Templating
  const template = (filename: string) => (config: unknown) => {
    const config_str = JSON.stringify(config).replace(/</g, "\\u003c");
    const source = FS.readFileSync(Path.join(www, filename), "utf-8");
    return source.replace(/{{crochet_config}}/g, (_) => config_str);
  };
  const index_template = template("index.html");
  const playground_template = template("playground.html");

  // -- Initialisation
  const fs = await NodeFS.from_directory(Path.dirname(root));
  const pkg = read_package_from_file(root);

  // -- Set up server
  const express = require("express") as typeof Express;
  const app = express();

  async function try_build(res: Express.Response) {
    try {
      await Build.build_from_file(root, Package.target_any());
      const pkg = read_package_from_file(root);
      const rpkg = new Package.ResolvedPackage(pkg, target);
      const graph = Package.build_package_graph(
        pkg,
        target,
        new Set(),
        await fs.to_package_map()
      );
      const packages = [];
      const stdlib = stdlib_packages();
      for (const dep of graph.serialise(rpkg)) {
        const scope = fs.get_scope(dep.name);
        const dir = get_scope_root(scope);
        const token = random_uuid();
        if (dir.startsWith(stdlib_root)) {
          const pkg = stdlib.find((x) => x.name === dep.name)!;
          app.get(`/library/${token}`, (req, res) => {
            res.sendFile(Path.resolve(stdlib_root, "_build", pkg.filename));
          });
          packages.push({
            name: dep.name,
            token: token,
            path: `/library/${token}`,
            hash: pkg.hash,
            tag: "archive",
          });
        } else {
          app.use(`/library/${token}`, express.static(dir));
          packages.push({
            name: dep.name,
            token: token,
            path: `/library/${token}`,
            tag: "http",
          });
        }
      }
      return packages;
    } catch (e) {
      console.error(e);
      res.send(500);
    }
  }

  app.get("/", async (req, res) => {
    const packages = await try_build(res);
    const config = {
      token: random_uuid(),
      root_package: pkg.meta.name,
      capabilities: [...capabilities.values()],
      packages: packages,
    };
    res.send(index_template(config));
  });

  app.get("/playground", async (req, res) => {
    const config = {
      // session_id: session_id,
      // kind: get_kind(target),
      // token: random_uuid(),
      // library_root: "/library",
      // app_root: "/app/crochet.json",
      // playground_root: "/library/crochet.debug.ui/crochet.json",
      // asset_root: "/assets",
      // capabilities: [...pkg.meta.capabilities.requires.values()],
      // package_tokens: Object.fromEntries([...pkg_tokens.entries()]),
    };
    res.send(playground_template(config));
  });

  app.use("/", express.static(www));

  // -- Starting servers
  const url = new URL("http://localhost");
  url.port = String(port);
  url.pathname = start_page;

  await new Promise((resolve) => {
    app.listen(port, "localhost", () => {
      console.log(`Server started at ${url.toString()}`);
      resolve(null);
    });
  });

  return {
    url,
    root: root,
    target: get_kind(target),
    capabilities: [...capabilities.values()],
  };
};

function get_scope_root(scope: ScopedFS) {
  if (scope.backend instanceof NativeFSMapper) {
    return Path.resolve(scope.backend.root);
  } else {
    throw new Error(`internal: not a valid scope backend`);
  }
}
