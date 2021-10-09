import * as Path from "path";
import * as Express from "express";
import * as Package from "../../../build/pkg";
import { CrochetForNode, build_file } from "../../../build/targets/node";
import { API } from "./api";

const launcher_root = Path.resolve(__dirname, "..");
const repo_root = Path.resolve(launcher_root, "../../");
const www = Path.resolve(launcher_root, "www");
const root = Path.resolve(launcher_root, "app/crochet.json");

export async function setup_server(port: number) {
  const app = Express();
  const api = new API(repo_root);

  console.log("Building all dependencies...");
  const crochet = new CrochetForNode(false, [], new Set([]), false);
  const pkg = crochet.read_package_from_file(root);
  await crochet.build(root);
  for (const dep of pkg.meta.dependencies) {
    const dep_pkg = await crochet.fs.read_package(dep.name);
    await crochet.build(dep_pkg.filename);
  }

  const rpkg = new Package.ResolvedPackage(pkg, Package.target_web());

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

  app.get("/api/examples", async (req, res) => {
    res.send(api.examples());
  });

  app.use("/", Express.static(www));
  app.use("/library", Express.static(Path.join(repo_root, "stdlib")));

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

setup_server(8000);
