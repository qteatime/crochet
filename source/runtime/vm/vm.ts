import * as Path from "path";
import { anyOf, array, equal, parse, spec, string } from "../../utils";
import * as Compiler from "../../compiler";
import { State } from "./state";
import { World } from "../world";
import { CrochetError } from "./run";

interface PackageData {
  target: "web" | "cli";
  name: string;
  sources: string[];
}

export class CrochetPackage {
  readonly root: string;
  constructor(readonly filename: string, private data: PackageData) {
    this.root = Path.resolve(Path.dirname(filename));
  }

  get sources() {
    return this.data.sources.map((x) => this.resolve(x));
  }

  resolve(source: string) {
    const resolved = Path.resolve(this.root, source);
    if (resolved.indexOf(this.root + "/") !== 0) {
      throw new Error(`${source} is outside of its package URL scope`);
    }
    return resolved;
  }

  static get spec() {
    return spec(
      {
        name: string,
        sources: array(string),
        target: anyOf([equal("web" as "web"), equal("cli" as "cli")]),
      },
      (x) => (filename: string) => new CrochetPackage(filename, x)
    );
  }

  static parse(x: any, filename: string) {
    return parse(x, this.spec)(filename);
  }
}

export abstract class CrochetVM {
  readonly world: World;

  constructor() {
    this.world = new World();
  }

  get ffi() {
    return this.world.ffi;
  }

  reseed(seed: number) {
    this.world.global_random.reseed(seed);
  }

  abstract read_file(filename: string): Promise<string>;
  abstract initialise(): Promise<void>;

  async load_crochet(filename: string) {
    const source = await this.read_file(filename);
    const ast = Compiler.parse(source);
    const ir = Compiler.compileProgram(ast);
    const state = State.root(this.world);
    await state.world.load_declarations(filename, ir, state.env);
  }

  async load_package(filename: string) {
    const source = await this.read_file(filename);
    const pkg = CrochetPackage.parse(JSON.parse(source), filename);

    for (const x of pkg.sources) {
      await this.load_crochet(x);
    }
  }

  async load(filename: string) {
    switch (Path.extname(filename)) {
      case ".json": {
        return await this.load_package(filename);
      }
      case ".crochet": {
        return await this.load_crochet(filename);
      }
      default:
        throw new Error(`Unsupported file ${filename}`);
    }
  }

  async run(scene: string) {
    return await this.world.run(scene);
  }

  async show_error(error: Error | CrochetError) {
    console.error(this.format_error(error));
  }

  format_error(error: Error | CrochetError) {
    return error.stack ?? error.message;
  }
}
