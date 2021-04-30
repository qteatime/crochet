import * as Path from "path";
import * as Express from "express";
import { logger } from "../utils/logger";

const root = Path.join(__dirname, "../../www");
const stdlib = Path.join(__dirname, "../../stdlib");

export function serve(dirname: string, port: number) {
  const app = Express();
  app.use(Express.static(root));
  app.use("/game", Express.static(dirname));
  app.use("/library", Express.static(Path.join(dirname, "library")));
  app.use("/stdlib", Express.static(stdlib));

  app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`);
  });
}
