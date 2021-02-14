import { spec, equal, array, string, optional } from "../utils/spec";
import { IPackager, PkgApi } from "./api";
import * as Compiler from "../compiler";
import * as Path from "path";

export class WebPackage implements IPackager {
  constructor(
    readonly api: PkgApi,
    readonly title: string,
    readonly source: string,
    readonly html: string | null,
    readonly assets: string[]
  ) {}

  name = "Web";
  description = "Packages the game for playing in a web browser";

  run(root: string) {
    const pkg = this.api.with_root(root);
    const ir = Compiler.compile_file(pkg.project_path(this.source));
    const json = Compiler.serialise(ir);
    pkg.write_file("game.json", json);
    pkg.copy("crochet.css");
    pkg.copy("crochet.js");

    const env = {
      title: this.title,
      files: JSON.stringify(["game.json"]),
    };
    if (this.html == null) {
      pkg.copy_template("index.html", env);
    } else {
      const data = pkg.template(pkg.read_project_file(this.html), env);
      pkg.write_file("index.html", data);
    }

    for (const asset of this.assets) {
      pkg.write_file(asset, pkg.read_project_file(asset));
    }
  }

  static get template_dir() {
    return Path.join(__dirname, "../../templates/web");
  }

  static get spec() {
    return spec(
      {
        package: equal("web"),
        title: string,
        source: string,
        output_directory: optional(string, "www"),
        html: optional<string | null>(string, null),
        assets: optional(array(string), []),
      },
      (x) => {
        const api = new PkgApi("", x.output_directory, WebPackage.template_dir);
        return new WebPackage(api, x.title, x.source, x.html, x.assets);
      }
    );
  }
}
