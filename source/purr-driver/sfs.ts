import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";

const pkg = require("../../package.json");

const app_data_base =
  OS.platform() === "darwin"
    ? Path.join(OS.homedir(), "Library")
    : OS.platform() === "win32"
    ? Path.join(OS.homedir(), "AppData", "Local")
    : Path.join(OS.homedir(), ".local", "share");

const app_data = Path.join(app_data_base, "crochet");

const root_dir = Path.join(__dirname, "../../");

export const sfs = {
  user_library() {
    return Path.join(app_data, "library");
  },

  examples() {
    return Path.join(root_dir, "examples");
  },

  stdlib() {
    return Path.join(root_dir, "stdlib");
  },
};
