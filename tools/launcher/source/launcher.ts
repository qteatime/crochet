import * as FS from "fs";
import * as Path from "path";
import * as Express from "express";
import * as Package from "../../../build/pkg";
import * as Packager from "../../../build/node-cli/package";
import * as Spec from "../../../build/utils/spec";
import { CrochetForNode, build_file } from "../../../build/targets/node";
import { API } from "./api";
import { setup_app_server } from "./server";
import { App, AppState } from "./app";
import * as UUID from "uuid";
import { launch_code_editor, open_directory, trap } from "./helpers";

const launcher_root = Path.resolve(__dirname, "..");
const repo_root = Path.resolve(launcher_root, "../../");
const www = Path.resolve(launcher_root, "www");
const root = Path.resolve(launcher_root, "app/crochet.json");
const state = new AppState();

export async function setup_launcher_server(port: number) {
  const app = Express();
  const lapp = App.from_file(root);
  const api = new API(repo_root);
  api.ensure_projects_directory();

  await lapp.build();
  const rpkg = lapp.resolved_package;

  app.use("/api", Express.json());

  app.get("/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const source = rpkg.sources.find((x) => x.binary_image.includes(path));
    if (!source) {
      throw new Error(`Unknown image ${path}`);
    }
    try {
      await build_file(source, rpkg);
      res.sendFile(Path.resolve(source.binary_image));
    } catch (e: any) {
      console.error(e);
      res.status(500).send(e.stack ?? e);
    }
  });

  app.get("/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const source = rpkg.native_sources.find(
      (x) => x.relative_filename === "native/" + path
    );
    if (!source) {
      console.error(`Unknown native source ${path}`);
      res.status(404).send(`Unknown native source ${path}`);
    } else {
      res.sendFile(source.absolute_filename);
    }
  });

  app.get("/app/crochet.json", async (req, res) => {
    res.sendFile(Path.resolve(root));
  });

  app.get("/api/examples", async (req, res) => {
    res.send(api.examples());
  });

  app.get("/api/libraries", async (req, res) => {
    res.send(api.libraries());
  });

  app.get("/api/my-projects", async (req, res) => {
    res.send(api.my_projects());
  });

  app.get("/api/read/:id", async (req, res) => {
    const id = req.params.id;
    await trap(res, async () => {
      const capp = state.app(id);
      const file = FS.readFileSync(capp.pkg.filename, "utf-8");
      res.send({
        filename: capp.pkg.filename,
        meta: JSON.parse(file),
      });
    });
  });

  app.post("/api/create-project", async (req, res) => {
    const id = UUID.v4();
    const name = req.body.name;
    const title = req.body.title;
    const target = req.body.target;
    await trap(res, async () => {
      const pkg = {
        name: name,
        title: title,
        target: target,
        sources: ["source/main.crochet"],
        native_sources: [],
        dependencies: [],
        capabilities: {
          requires: [],
          provides: [],
        },
      };
      const file = api.create_project(pkg);
      const capp = App.from_file(file);
      await capp.build();
      state.define(id, capp);
      res.send({ id });
    });
  });

  app.post("/api/spawn", async (req, res) => {
    const id = UUID.v4();
    const pkg = req.body.package;
    await trap(res, async () => {
      const capp = App.from_file(Path.resolve(pkg));
      await capp.build();
      state.define(id, capp);
      res.send({ id });
    });
  });

  app.post("/api/package", async (req, res) => {
    const build_id = UUID.v4();
    await trap(res, async () => {
      const id = req.body.id;
      const capp = state.app(id);
      const pkg = capp.package_file;
      const target = Spec.parse(req.body.target, Package.target_spec);
      const out_dir = Path.join(Path.dirname(pkg), ".packages", build_id);
      await Packager.package_app(pkg, target, out_dir);
      res.send({ output: out_dir });
    });
  });

  app.post("/api/launch-directory", async (req, res) => {
    await trap(res, async () => {
      const id = req.body.id;
      const capp = state.app(id);
      const path = Path.dirname(capp.package_file);
      open_directory(path);
      res.send({});
    });
  });

  app.post("/api/launch-code-editor", async (req, res) => {
    await trap(res, async () => {
      const id = req.body.id;
      const capp = state.app(id);
      const path = Path.dirname(capp.package_file);
      launch_code_editor(path);
      res.send({});
    });
  });

  app.use("/", Express.static(www));
  app.use("/library", Express.static(Path.join(repo_root, "stdlib")));

  app.listen(port, () => {
    console.log(`Launcher server started at http://localhost:${port}`);
  });
}

setup_launcher_server(8000);
setup_app_server(8001, state);
