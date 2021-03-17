import * as Path from "path";
import * as Express from "express";

const root = Path.join(__dirname, "../../www");

export function serve(dirname: string, port: number) {
  const app = Express();
  app.use(Express.static(root));
  app.use("/game", Express.static(dirname));

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
