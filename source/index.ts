import type * as IR from "./ir";
import type * as Compiler from "./compiler";
import type * as Binary from "./binary-serialisation";
import type * as VM from "./vm";
import type * as Package from "./pkg";

class Crochet {
  private _ir!: typeof IR;
  private _compiler!: typeof Compiler;
  private _binary!: typeof Binary;
  private _vm!: typeof VM;
  private _package!: typeof Package;

  get ir() {
    if (this._ir == null) {
      this._ir = require("./ir");
    }
    return this._ir;
  }

  get compiler() {
    if (this._compiler == null) {
      this._compiler = require("./compiler");
    }
    return this._compiler;
  }

  get binary() {
    if (this._binary == null) {
      this._binary = require("./binary-serialisation");
    }
    return this._binary;
  }

  get vm() {
    if (this._vm == null) {
      this._vm = require("./vm");
    }
    return this._vm;
  }

  get pkg() {
    if (this._package == null) {
      this._package = require("./pkg");
    }
    return this._package;
  }
}

export default new Crochet();
