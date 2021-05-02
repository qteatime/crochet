import {
  CrochetModule,
  CrochetPackage,
  CrochetValue,
  NativeFunction,
  NativeTag,
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
      new NativeFunction(NativeTag.NATIVE_SYNCHRONOUS, fn)
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

  get nothing() {
    return Values.get_nothing(this.#universe);
  }

  get true() {
    return Values.get_true(this.#universe);
  }

  get false() {
    return Values.get_false(this.#universe);
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

  to_boolean(x: CrochetValue): boolean {
    return Values.get_boolean(x);
  }

  text_to_string(x: CrochetValue): string {
    return Values.text_to_string(x);
  }

  // == Operations
  intrinsic_equals(x: CrochetValue, y: CrochetValue) {
    return Values.equals(x, y);
  }
}
