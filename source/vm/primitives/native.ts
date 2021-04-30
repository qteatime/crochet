import { Location } from ".";
import { ErrArbitrary } from "../../runtime";
import {
  Universe,
  CrochetModule,
  NativeTag,
  NativeFunction,
} from "../intrinsics";

export function native_tag_to_name(x: NativeTag) {
  return NativeTag[x].toLowerCase().replace(/_/g, "-");
}

export function assert_native_tag<T extends NativeTag>(
  tag: T,
  value: NativeFunction
): asserts value is NativeFunction<T> {
  if (value.tag != tag) {
    throw new ErrArbitrary(
      "invalid-native-function",
      `Expected a ${native_tag_to_name(
        tag
      )} native function, but got a ${native_tag_to_name(value.tag)} instead`
    );
  }
  return value as any;
}

export function get_native(module: CrochetModule, name: string) {
  const fn = module.pkg.native_functions.try_lookup(name);
  if (fn == null) {
    throw new ErrArbitrary(
      "undefined-foreign-function",
      `The foreign function ${name} is not accessible from ${Location.module_location(
        module
      )}`
    );
  }
  return fn;
}
