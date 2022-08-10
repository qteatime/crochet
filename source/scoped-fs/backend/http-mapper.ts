import { ScopedFSBackend } from "./core";

export class HttpFsMapper extends ScopedFSBackend {
  constructor(readonly root: string) {
    super();
  }

  async read(path0: string) {
    const path = join_path(this.root, path0);
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Could not read ${path0} from scope ${this.root}`);
    }
    const data = await response.arrayBuffer();
    return Buffer.from(data);
  }
}

function join_path(base: string, path: string) {
  if (base === "") {
    return path;
  } else if (!base.endsWith("/")) {
    return base + "/" + path;
  } else {
    return base + path;
  }
}
