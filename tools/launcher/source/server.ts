import * as Path from "path";
import * as Express from "express";
import { AppState } from "./app";
import { trap } from "./helpers";

const launcher_root = Path.resolve(__dirname, "..");
const repo_root = Path.resolve(launcher_root, "../../");
const www = Path.resolve(repo_root, "www");

export async function setup_app_server(port: number, state: AppState) {
  const app = Express();

  async function get_binary(
    id: string,
    path: string,
    res: Express.Response<any, any>
  ) {
    try {
      const capp = state.app(id);
      const file = await capp.binary(path);
      res.sendFile(file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  }

  async function get_native(
    id: string,
    path: string,
    res: Express.Response<any, any>
  ) {
    try {
      const capp = state.app(id);
      const file = await capp.native(path);
      res.sendFile(file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  }

  async function get_package_json(id: string, res: Express.Response<any, any>) {
    try {
      const capp = state.app(id);
      res.sendFile(capp.package_file);
    } catch (e: any) {
      res.status(500).send(String(e));
    }
  }

  app.get("/:id/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    await get_binary(id, path, res);
  });

  app.get("/:id/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    await get_native(id, path, res);
  });

  app.get("/:id/app/crochet.json", async (req, res) => {
    const id = (req.params as any).id;
    await get_package_json(id, res);
  });

  app.get("/:id/ipc", (req, res) => {
    res.sendFile(Path.resolve(launcher_root, "www/ipc.html"));
  });

  app.get("/:id/run/", async (req, res) => {
    const id = req.params.id;
    await trap(res, async () => {
      const capp = state.app(id);
      await capp.build();
      res.sendFile(Path.resolve(www, "index.html"));
    });
  });

  app.get("/:id/run/app/.binary/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    await get_binary(id, path, res);
  });

  app.get("/:id/run/app/native/*", async (req, res) => {
    const path = (req.params as any)[0];
    const id = (req.params as any).id;
    await get_native(id, path, res);
  });

  app.get("/:id/run/app/crochet.json", async (req, res) => {
    const id = (req.params as any).id;
    await get_package_json(id, res);
  });

  app.use("/:id/run/library", Express.static(Path.join(repo_root, "stdlib")));
  app.use("/:id/run/", Express.static(www));

  app.get("/:id/crochet.js", (req, res) => {
    res.sendFile(Path.resolve(launcher_root, "www/crochet.js"));
  });

  app.get("/:id/crochet-ipc.js", (req, res) => {
    res.sendFile(Path.resolve(launcher_root, "www/crochet-ipc.js"));
  });

  app.use("/:id/library", Express.static(Path.join(repo_root, "stdlib")));

  app.listen(port, () => {
    console.log(`App server started at http://localhost:${port}`);
  });
}
