import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import type * as Express from "express";
import { CrochetForNode, build_file } from "../targets/node";

const repo_root = Path.resolve(__dirname, "../../");

export default async (root: string, port: number, www: string) => {
  console.log("Building all dependencies...");
  const crochet = new CrochetForNode(false, [], new Set([]), false, true);
  const pkg = crochet.read_package_from_file(root);
  await crochet.build(root);
  for (const dep of pkg.meta.dependencies) {
    const dep_pkg = await crochet.fs.read_package(dep.name);
    await crochet.build(dep_pkg.filename);
  }
  const graph = await Package.build_package_graph(
    pkg,
    Package.target_web(),
    new Set(),
    (crochet.crochet as any).resolver
  );

  const rpkg = new Package.ResolvedPackage(pkg, Package.target_web());

  // Set up server
  const express = require("express") as typeof Express;
  const app = express();

  app.get("/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const source = rpkg.sources.find((x) => x.binary_image.includes(path));
    if (!source) {
      throw new Error(`Unknown image ${path}`);
    }
    await build_file(source, rpkg);
    res.sendFile(Path.resolve(source.binary_image));
  });

  app.get("/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const source = rpkg.native_sources.find(
      (x) => x.relative_filename === "native/" + path
    );
    if (!source) {
      throw new Error(`Unknown native source ${path}`);
    }
    res.sendFile(source.absolute_filename);
  });

  app.get("/app/crochet.json", async (req, res) => {
    res.sendFile(Path.resolve(root));
  });

  app.use("/", express.static(www));
  app.use("/library", express.static(Path.join(repo_root, "stdlib")));

  for (const x of graph.serialise(rpkg)) {
    const assets = x.assets_root;
    if (FS.existsSync(assets)) {
      console.log("Installing assets for", x.name);
      app.use(`/assets/${encodeURIComponent(x.name)}`, express.static(assets));
    }
  }

  app.listen(port, () => {
    const caps = [...pkg.meta.capabilities.requires.values()].join(",");
    const url = new URL("http://localhost");
    url.port = String(port);
    url.searchParams.set("capabilities", caps);
    console.log(`Server started at ${url.toString()}`);
  });
};
