import * as Path from "path";
import * as Express from "express";

const root = Path.join(__dirname, "../../www");

export function serve(filename: string, port: number) {
  const fullPath = Path.resolve(filename);

  const app = Express();
  app.use(Express.static(root));
  app.get("/game.crochet", (req, res) => {
    res.sendFile(fullPath);
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
