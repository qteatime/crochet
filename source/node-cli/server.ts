import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import * as REPL from "../node-repl";
import type * as Express from "express";
import { CrochetForNode, build_file } from "../targets/node";
import { random_uuid } from "../utils/uuid";
import { randomUUID } from "crypto";

const repo_root = Path.resolve(__dirname, "../../");

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
  const session_id = randomUUID();
  let repl: REPL.NodeRepl | null = null;

  const crochet = new CrochetForNode(
    { universe: random_uuid(), packages: new Map() },
    false,
    [],
    new Set([]),
    false,
    true
  );
  const pkg = crochet.read_package_from_file(root);
  for (const dep of pkg.meta.dependencies) {
    const dep_pkg = await crochet.fs.read_package(dep.name);
    await crochet.build(dep_pkg.filename);
  }
  const graph = await Package.build_package_graph(
    pkg,
    target,
    new Set(),
    (crochet.crochet as any).resolver
  );

  const rpkg = new Package.ResolvedPackage(pkg, target);

  // -- Set up server
  const express = require("express") as typeof Express;
  const app = express();

  const app_base_dir = Path.resolve(Path.dirname(pkg.filename));
  app.get("/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const resolved = Path.resolve(app_base_dir, ".binary", path);
    const source = rpkg.sources.find(
      (x) => Path.resolve(x.binary_image) === resolved
    );
    if (!source) {
      console.error(`Unknown image ${path}`);
      return res.status(500).send(`Unknown image ${path}`);
    }
    await build_file(source, rpkg);
    res.sendFile(Path.resolve(source.binary_image));
  });

  app.get("/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const resolved = Path.resolve(app_base_dir, "native", path);
    const source = rpkg.native_sources.find(
      (x) => Path.normalize(x.absolute_filename) === resolved
    );
    if (!source) {
      console.error(`Unknown native source ${path}`);
      return res.status(500).send(`Unknown native source ${path}`);
    }
    res.sendFile(source.absolute_filename);
  });

  app.get("/app/crochet.json", async (req, res) => {
    res.sendFile(Path.resolve(root));
  });

  async function try_build(res: Express.Response) {
    try {
      await crochet.build(root);
    } catch (e) {
      console.error(e);
      res.send(500);
    }
  }

  app.get("/", async (req, res) => {
    await try_build(res);
    const config = {
      session_id: session_id,
      token: random_uuid(),
      library_root: "/library",
      app_root: "/app/crochet.json",
      asset_root: "/assets",
      capabilities: [...pkg.meta.capabilities.requires.values()],
      package_tokens: Object.fromEntries([...pkg_tokens.entries()]),
    };
    res.send(index_template(config));
  });

  app.get("/playground", async (req, res) => {
    await try_build(res);
    const config = {
      session_id: session_id,
      kind: get_kind(target),
      token: random_uuid(),
      library_root: "/library",
      app_root: "/app/crochet.json",
      playground_root: "/library/crochet.debug.ui/crochet.json",
      asset_root: "/assets",
      capabilities: [...pkg.meta.capabilities.requires.values()],
      package_tokens: Object.fromEntries([...pkg_tokens.entries()]),
    };
    res.send(playground_template(config));
  });

  app.use("/", express.static(www));
  app.use("/library", express.static(Path.join(repo_root, "stdlib")));

  app.use("/playground/api", express.json());

  app.post("/playground/api/:id/make-page", async (req, res) => {
    if (req.params.id !== session_id) {
      return res.send(403);
    }

    try {
      const page = await repl!.make_page();
      res.send({ ok: true, page_id: page.id });
    } catch (e) {
      res.send({ ok: false, reason: String(e) });
    }
  });

  app.post("/playground/api/:id/pages/:page_id/run-code", async (req, res) => {
    if (req.params.id !== session_id) {
      return res.send(403);
    }

    try {
      const page = repl!.get_page(req.params.page_id);
      const result = await page.run_code(req.body.language, req.body.code);
      res.send({ ok: true, representations: result?.representations });
    } catch (e) {
      res.send({ ok: false, error: String(e) });
    }
  });

  // -- File system capabilities
  const pkg_tokens = new Map();
  for (const x of graph.serialise(rpkg)) {
    const assets = x.assets_root;
    const token = random_uuid();
    pkg_tokens.set(x.name, token);
    if (FS.existsSync(assets)) {
      console.log("Installing assets for", x.name);
      app.use(`/assets/${token}`, express.static(assets));
    }
  }

  if (target.tag === Package.TargetTag.NODE) {
    repl = await REPL.NodeRepl.bootstrap(
      root,
      target,
      capabilities,
      randomUUID(),
      session_id,
      pkg_tokens
    );
  }

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

  return url;
};
