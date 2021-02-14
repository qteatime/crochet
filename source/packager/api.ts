import * as Fs from "fs";
import * as Path from "path";
import { anyOf, parse } from "../utils/spec";
import { WebPackage } from "./web";
import * as Mkdir from "mkdirp";

export class Packager {
  static fromJson(x: any): IPackager {
    return parse(x, Packager.spec);
  }

  static get spec() {
    return anyOf([WebPackage]);
  }
}

export class PkgApi {
  constructor(
    private wd: string,
    readonly root: string,
    readonly template_root: string
  ) {}

  project_path(filename: string) {
    return Path.join(this.wd, filename);
  }

  from_path(filename: string) {
    return Path.join(this.template_root, filename);
  }

  to_path(filename: string) {
    return Path.join(this.wd, this.root, filename);
  }

  with_root(d: string) {
    return new PkgApi(d, this.root, this.template_root);
  }

  read_project_file(filename: string) {
    return Fs.readFileSync(this.project_path(filename), "utf8");
  }

  read_template_file(filename: string) {
    return Fs.readFileSync(this.from_path(filename), "utf8");
  }

  private ensure_directory(filename: string) {
    const dirname = Path.dirname(filename);
    if (!Fs.existsSync(this.to_path(dirname))) {
      console.log(`Creating directory ${dirname}`);
      Mkdir.sync(this.to_path(dirname));
    }
  }

  write_file(filename: string, data: string) {
    this.ensure_directory(filename);
    console.log(`Creating ${filename}`);
    Fs.writeFileSync(this.to_path(filename), data);
  }

  copy(filename: string) {
    this.ensure_directory(filename);
    console.log(`Copying ${filename}`);
    Fs.copyFileSync(this.from_path(filename), this.to_path(filename));
  }

  copy_template(filename: string, env: { [key: string]: string }) {
    this.ensure_directory(filename);
    console.log(`Copying ${filename}`);
    const source = Fs.readFileSync(
      this.from_path(filename + ".template"),
      "utf8"
    );
    const target = this.template(source, env);
    Fs.writeFileSync(this.to_path(filename), target);
  }

  template(text: string, env: { [key: string]: string }) {
    return text.replace(/{{([a-z_]+)}}/g, (_, key) => {
      return env[key] || `(missing ${key})`;
    });
  }
}

export interface IPackager {
  name: string;
  description: string;
  run(root: string): void;
}
