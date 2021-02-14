import { ForeignInterface } from "../vm-js/primitives";
import { CrochetVM } from "../vm-js/vm";
import { and, not, or } from "./boolean";
import { equals, not_equals, to_text } from "./core";
import {
  add,
  divide,
  greater_than,
  greater_than_or_equal,
  less_than,
  less_than_or_equal,
  multiply,
  remainder,
  subtract,
} from "./numeric";
import { concat, title_case } from "./text";
import { first } from "./stream";

export function add_prelude(vm: CrochetVM, ffi: ForeignInterface) {
  const root = vm.root_env;

  ffi.add("builtin:equals", 2, equals);
  vm.add_foreign_command(
    root,
    "_ === _",
    ["This", "That"],
    [0, 1],
    "builtin:equals"
  );

  ffi.add("builtin:not-equals", 2, not_equals);
  vm.add_foreign_command(
    root,
    "_ =/= _",
    ["This", "That"],
    [0, 1],
    "builtin:not-equals"
  );

  ffi.add("builtin:to-text", 1, to_text);
  vm.add_foreign_command(root, "_ as-text", ["This"], [0], "builtin:to-text");

  ffi.add("builtin:less-than", 2, less_than);
  vm.add_foreign_command(
    root,
    "_ < _",
    ["This", "That"],
    [0, 1],
    "builtin:less-than"
  );

  ffi.add("builtin:less-than-or-equal", 2, less_than_or_equal);
  vm.add_foreign_command(
    root,
    "_ <= _",
    ["This", "That"],
    [0, 1],
    "builtin:less-than-or-equal"
  );

  ffi.add("builtin:greater-than", 2, greater_than);
  vm.add_foreign_command(
    root,
    "_ > _",
    ["This", "That"],
    [0, 1],
    "builtin:greater-than"
  );

  ffi.add("builtin:greater-than-or-equal", 2, greater_than_or_equal);
  vm.add_foreign_command(
    root,
    "_ >= _",
    ["This", "That"],
    [0, 1],
    "builtin:greater-than-or-equal"
  );

  ffi.add("builtin:add", 2, add);
  vm.add_foreign_command(
    root,
    "_ + _",
    ["This", "That"],
    [0, 1],
    "builtin:add"
  );

  ffi.add("builtin:subtract", 2, subtract);
  vm.add_foreign_command(
    root,
    "_ - _",
    ["This", "That"],
    [0, 1],
    "builtin:subtract"
  );

  ffi.add("builtin:multiply", 2, multiply);
  vm.add_foreign_command(
    root,
    "_ * _",
    ["This", "That"],
    [0, 1],
    "builtin:multiply"
  );

  ffi.add("builtin:divide", 2, divide);
  vm.add_foreign_command(
    root,
    "_ / _",
    ["This", "That"],
    [0, 1],
    "builtin:divide"
  );

  ffi.add("builtin:remainder", 2, remainder);
  vm.add_foreign_command(
    root,
    "_ remainder-of-dividing-by:",
    ["This", "That"],
    [0, 1],
    "builtin:remainder"
  );

  ffi.add("builtin:concat", 2, concat);
  vm.add_foreign_command(
    root,
    "_ ++ _",
    ["This", "That"],
    [0, 1],
    "builtin:concat"
  );

  ffi.add("builtin:title-case", 1, title_case);
  vm.add_foreign_command(
    root,
    "_ title-case",
    ["This"],
    [0],
    "builtin:title-case"
  );

  ffi.add("builtin:and", 2, and);
  vm.add_foreign_command(
    root,
    "_ and:",
    ["This", "That"],
    [0, 1],
    "builtin:and"
  );

  ffi.add("builtin:or", 2, or);
  vm.add_foreign_command(root, "_ or:", ["This", "That"], [0, 1], "builtin:or");

  ffi.add("builtin:not", 1, not);
  vm.add_foreign_command(root, "_ bnot", ["This"], [0], "builtin:not");

  ffi.add("builtin:first", 1, first);
  vm.add_foreign_command(root, "_ first", ["Stream"], [0], "builtin:first");
}
