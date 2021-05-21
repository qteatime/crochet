import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import type * as Express from "express";
import { CrochetForNode, build_file } from "../targets/node";

const repo_root = Path.resolve(__dirname, "../../");

export default async (root: string, port: number) => {
  console.log("Building all dependencies...");
  const crochet = new CrochetForNode(false, [], new Set([]), false);
  const pkg = crochet.read_package_from_file(root);
  await crochet.build(root);
  for (const dep of pkg.meta.dependencies) {
    const dep_pkg = await crochet.fs.read_package(dep.name);
    await crochet.build(dep_pkg.filename);
  }

  const rpkg = new Package.ResolvedPackage(pkg, Package.target_web());

  // Set up server
  const express = require("express") as typeof Express;
  const app = express();

  app.get("/app/.binary/*", async (req, res) => {
    const path = req.params[0];
    const source = rpkg.sources.find((x) => x.binary_image.includes(path));
    if (!source) {
      throw new Error(`Unknown image ${path}`);
    }
    await build_file(source, rpkg);
    res.sendFile(Path.resolve(source.binary_image));
  });

  app.get("/app/crochet.json", async (req, res) => {
    res.sendFile(Path.resolve(root));
  });

  app.use("/", express.static(Path.join(repo_root, "www")));
  app.use("/library", express.static(Path.join(repo_root, "stdlib")));

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
};
