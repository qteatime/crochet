import { visitParameterList } from "typescript";
import { delay } from "../utils/utils";
import { CrochetValue } from "../vm-js/intrinsics";
import { ForeignInterface } from "../vm-js/primitives";
import { CrochetVM, CrochetVMInterface } from "../vm-js/vm";
import { Display } from "./display";
import { h } from "./html";

type VMI = CrochetVMInterface;
type Value = CrochetValue;

export function add_primitives(
  vm: CrochetVM,
  ffi: ForeignInterface,
  primitives: Primitives
) {
  const root = vm.root_env;
  ffi.add("crochet.player:say", 1, primitives.say);
  vm.add_foreign_command(root, "say:", ["Text"], [0], "crochet.player:say");

  ffi.add("crochet.player:wait", 1, primitives.wait);
  vm.add_foreign_command(
    root,
    "wait:",
    ["Seconds"],
    [0],
    "crochet.player:wait"
  );

  ffi.add("crochet.player:show", 1, primitives.show);
  vm.add_foreign_command(
    root,
    "_ show",
    ["Element"],
    [0],
    "crochet.player:show"
  );

  ffi.add("crochet.player:title", 1, primitives.title);
  vm.add_foreign_command(
    root,
    "_ title",
    ["Element"],
    [0],
    "crochet.player:title"
  );

  ffi.add("crochet.player:monospace", 1, primitives.monospaced_text);
  vm.add_foreign_command(
    root,
    "_ monospaced-text",
    ["Element"],
    [0],
    "crochet.player:monospace"
  );

  ffi.add("crochet.player:text", 1, primitives.text);
  vm.add_foreign_command(
    root,
    "_ text",
    ["Element"],
    [0],
    "crochet.player:text"
  );

  ffi.add("crochet.player:divider", 0, primitives.divider);
  vm.add_foreign_command(root, "divider", [], [], "crochet.player:divider");

  ffi.add("crochet.player:new-page", 0, primitives.new_page);
  vm.add_foreign_command(root, "new-page", [], [], "crochet.player:new-page");
}

export class Primitives {
  constructor(readonly display: Display) {}

  say = async (vm: VMI, text: Value) => {
    vm.assert_text(text);
    await this.display.show(this.display.text(text.value));
    return vm.nothing;
  };

  wait = async (vm: VMI, time: Value) => {
    vm.assert_integer(time);
    await delay(Number(time.value * 1000n));
    return vm.nothing;
  };

  text = async (vm: VMI, text: Value) => {
    vm.assert_text(text);
    return vm.box(this.display.text(text.value));
  };

  show = async (vm: VMI, value: Value) => {
    vm.assert_box(value);
    const element = value.to_js();
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Expected an HTMLElement`);
    }
    await this.display.show(element);
    return vm.nothing;
  };

  monospaced_text = async (vm: VMI, text: Value) => {
    vm.assert_text(text);
    return vm.box(this.display.monospaced_text(text.value));
  };

  title = async (vm: VMI, text: Value) => {
    vm.assert_text(text);
    return vm.box(this.display.title(text.value));
  };

  divider = async (vm: VMI) => {
    return vm.box(this.display.divider());
  };

  new_page = async (vm: VMI) => {
    this.display.new_page();
    return vm.nothing;
  };
}
