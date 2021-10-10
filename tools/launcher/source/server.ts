import * as Path from "path";
import * as Express from "express";
import { AppState } from "./app";

const launcher_root = Path.resolve(__dirname, "..");
const repo_root = Path.resolve(launcher_root, "../../");
const www = Path.resolve(repo_root, "www");

export async function setup_app_server(port: number, state: AppState) {
  const app = Express();

  app.get("/:id/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    try {
      const capp = state.app(id);
      const file = await capp.binary(path);
      res.sendFile(file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  });

  app.get("/:id/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    try {
      const capp = state.app(id);
      const file = await capp.native(path);
      res.sendFile(file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  });

  app.get("/:id/app/crochet.json", async (req, res) => {
    const id = (req.params as any).id;
    try {
      const capp = state.app(id);
      res.sendFile(capp.package_file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  });

  app.use("/:id/", Express.static(www));
  app.use("/:id/library", Express.static(Path.join(repo_root, "stdlib")));

  app.listen(port, () => {
    console.log(`App server started at http://localhost:${port}`);
  });
}
