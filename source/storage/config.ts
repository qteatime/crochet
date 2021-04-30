import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";
import { logger } from "../utils/logger";

interface Config {
  grants?: Grant[];
}

interface Grant {
  name: string;
  capabilities: string[];
}

export class StorageConfig {
  private data: Config;

  constructor(data: Config) {
    this.data = data;
  }

  get config_path() {
    return Path.join(OS.homedir(), ".crochet", "config");
  }

  ensure_root() {
    FS.mkdirSync(Path.dirname(this.config_path), { recursive: true });
  }

  static load() {
    const config = new StorageConfig({});
    config.load();
    return config;
  }

  load() {
    if (FS.existsSync(this.config_path)) {
      logger.debug(`Loading configuration from ${this.config_path}`);
      const data = FS.readFileSync(this.config_path, "utf8");
      this.data = JSON.parse(data);
    } else {
      this.data = {};
    }
  }

  save() {
    logger.debug(`Writing configuration to ${this.config_path}`);
    this.ensure_root();
    FS.writeFileSync(this.config_path, JSON.stringify(this.data));
  }

  grants(app: string) {
    return (this.data.grants ?? []).find((x) => x.name === app);
  }

  update_grants(app: string, grants: string[]) {
    const old = this.data.grants ?? [];
    this.data.grants = old
      .filter((x) => x.name !== app)
      .concat([
        {
          name: app,
          capabilities: grants,
        },
      ]);
    this.save();
  }
}
