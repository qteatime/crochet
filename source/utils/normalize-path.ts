import * as Path from "path";

export function normalize_path(x: string) {
  return x.split(Path.sep).join("/");
}
