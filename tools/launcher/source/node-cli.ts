import { start_servers } from "./launcher";

start_servers({ port: 8000 }).catch((e) => {
  console.error(e.stack ?? e);
  process.exit(1);
});
