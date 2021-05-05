import {
  CrochetModule,
  CrochetPackage,
  CrochetValue,
  ErrNativePanic,
  Machine,
  NativeFunction,
  NativeTag,
  NSApply,
  NSInvoke,
  Tag,
  Universe,
  Values,
} from "../vm";

export class ForeignInterface {
  #universe: Universe;
  #package: CrochetPackage;
  #module: CrochetModule;

  constructor(universe: Universe, pkg: CrochetPackage, filename: string) {
    this.#universe = universe;
    this.#package = pkg;
    this.#module = new CrochetModule(pkg, filename);
  }

  defun(name: string, fn: (...args: CrochetValue[]) => CrochetValue) {
    this.#package.native_functions.define(
      name,
      new NativeFunction(NativeTag.NATIVE_SYNCHRONOUS, name, this.#package, fn)
    );
  }

  defmachine(name: string, fn: (...args: CrochetValue[]) => Machine) {
    this.#package.native_functions.define(
      name,
      new NativeFunction(NativeTag.NATIVE_MACHINE, name, this.#package, fn)
    );
  }

  // == Constructors
  integer(x: bigint) {
    return Values.make_integer(this.#universe, x);
  }

  float(x: number) {
    return Values.make_float(this.#universe, x);
  }

  boolean(x: boolean) {
    return Values.make_boolean(this.#universe, x);
  }

  text(x: string) {
    return Values.make_text(this.#universe, x);
  }

  tuple(x: CrochetValue[]) {
    return Values.make_tuple(this.#universe, x);
  }

  record(x: Map<string, CrochetValue>) {
    return Values.make_record_from_map(this.#universe, x);
  }

  interpolation(xs: CrochetValue[]) {
    return Values.make_interpolation(this.#universe, xs);
  }

  get nothing() {
    return Values.get_nothing(this.#universe);
  }

  get true() {
    return Values.get_true(this.#universe);
  }

  get false() {
    return Values.get_false(this.#universe);
  }

  invoke(name: string, args: CrochetValue[]) {
    return new NSInvoke(name, args);
  }

  apply(fn: CrochetValue, args: CrochetValue[]) {
    return new NSApply(fn, args);
  }

  // == Destructors
  integer_to_bigint(x: CrochetValue): bigint {
    Values.assert_tag(Tag.INTEGER, x);
    return x.payload;
  }

  float_to_number(x: CrochetValue): number {
    Values.assert_tag(Tag.FLOAT_64, x);
    return x.payload;
  }

  to_js_boolean(x: CrochetValue): boolean {
    return Values.get_boolean(x);
  }

  text_to_string(x: CrochetValue): string {
    return Values.text_to_string(x);
  }

  tuple_to_array(x: CrochetValue): CrochetValue[] {
    return Values.get_array(x);
  }

  interpolation_to_parts(x: CrochetValue): (string | CrochetValue)[] {
    return Values.get_interpolation_parts(x);
  }

  // == Operations
  intrinsic_equals(x: CrochetValue, y: CrochetValue) {
    return Values.equals(x, y);
  }

  panic(tag: string, message: string) {
    throw new ErrNativePanic(tag, message);
  }
}
