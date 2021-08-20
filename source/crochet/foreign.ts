import * as Collection from "../collection";
import type { Set as ISet, Map as IMap, List as IList } from "../collection";
import { XorShift } from "../utils/xorshift";
import {
  CrochetModule,
  CrochetPackage,
  CrochetType,
  CrochetValue,
  Environment,
  ErrNativePanic,
  Location,
  Machine,
  NativeFunction,
  NativeTag,
  NSApply,
  NSAwait,
  NSInvoke,
  NSTranscriptWrite,
  run_native_sync,
  Tag,
  Universe,
  Values,
} from "../vm";

export type { Machine, CrochetValue };
export type { ISet, IList, IMap };

export class ForeignInterface {
  #universe: Universe;
  #package: CrochetPackage;
  #module: CrochetModule;

  constructor(universe: Universe, pkg: CrochetPackage, filename: string) {
    this.#universe = universe;
    this.#package = pkg;
    this.#module = new CrochetModule(pkg, filename, null);
  }

  defun(name: string, fn: (...args: CrochetValue[]) => CrochetValue) {
    this.#package.native_functions.define(
      name,
      new NativeFunction(NativeTag.NATIVE_SYNCHRONOUS, name, this.#package, fn)
    );
  }

  defmachine(
    name: string,
    fn: (...args: CrochetValue[]) => Machine<CrochetValue>
  ) {
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

  box(x: unknown) {
    return Values.box(this.#universe, x);
  }

  // FIXME: this shouldn't be available to non-trusted packages
  static_text(x: string) {
    return Values.make_static_text(this.#universe, x);
  }

  list(x: CrochetValue[]) {
    return Values.make_list(this.#universe, x);
  }

  record(x: Map<string, CrochetValue>) {
    return Values.make_record_from_map(this.#universe, x);
  }

  interpolation(xs: CrochetValue[]) {
    return Values.make_interpolation(this.#universe, xs);
  }

  concat_interpolation(x: CrochetValue, y: CrochetValue) {
    Values.assert_tag(Tag.INTERPOLATION, x);
    Values.assert_tag(Tag.INTERPOLATION, y);
    return Values.make_interpolation(
      this.#universe,
      x.payload.concat(y.payload)
    );
  }

  cell(x: CrochetValue) {
    return Values.make_cell(this.#universe, x);
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

  await(value: Promise<CrochetValue>) {
    return new NSAwait(value);
  }

  run_synchronous(fn: () => Machine<CrochetValue>) {
    const env = new Environment(null, null, this.#module, null);
    return run_native_sync(this.#universe, env, this.#package, fn());
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

  list_to_array(x: CrochetValue): CrochetValue[] {
    return Values.get_array(x);
  }

  interpolation_to_parts(x: CrochetValue): (string | CrochetValue)[] {
    return Values.get_interpolation_parts(x);
  }

  normalise_interpolation(x: CrochetValue): CrochetValue {
    return Values.normalise_interpolation(this.#universe, x);
  }

  deref_cell(x: CrochetValue): CrochetValue {
    return Values.deref_cell(x);
  }

  update_cell(x: CrochetValue, old_value: CrochetValue, value: CrochetValue) {
    return Values.update_cell(x, old_value, value);
  }

  record_to_map(x: CrochetValue) {
    return Values.get_map(x);
  }

  action_choice(x: CrochetValue) {
    const choice = Values.get_action_choice(x);
    return {
      score: choice.score,
      action: Values.make_action(choice.action, choice.env),
    };
  }

  unbox(x: CrochetValue) {
    return Values.unbox(x);
  }

  // == Operations
  intrinsic_equals(x: CrochetValue, y: CrochetValue) {
    return Values.equals(x, y);
  }

  panic_untraced(tag: string, message: string) {
    throw new ErrNativePanic(tag, message, false);
  }

  panic(tag: string, message: string) {
    throw new ErrNativePanic(tag, message);
  }

  // == Tests
  is_crochet_value(x: any): x is CrochetValue {
    return x instanceof CrochetValue;
  }

  is_interpolation(x: CrochetValue) {
    return x.tag === Tag.INTERPOLATION;
  }

  is_list(x: CrochetValue) {
    return x.tag === Tag.LIST;
  }

  is_thunk_forced(x: CrochetValue) {
    return Values.is_thunk_forced(x);
  }

  // == Conversions
  to_plain_native(x: CrochetValue): unknown {
    return Values.to_plain_object(x);
  }

  from_plain_native(x: unknown): CrochetValue {
    return Values.from_plain_object(this.#universe, x);
  }

  // == Reflection
  type_name(x: CrochetValue) {
    return Location.type_name(x.type);
  }

  to_debug_string(x: CrochetValue) {
    return Location.simple_value(x);
  }

  lookup_type(name: string) {
    return this.#module.types.try_lookup(name);
  }

  lookup_type_namespaced(namespace: string, name: string) {
    return this.#module.types.try_lookup_namespaced(namespace, name);
  }

  instantiate(type: CrochetType, args: CrochetValue[]) {
    return Values.instantiate(type, args);
  }

  action_fired<T extends Tag>(action: CrochetValue<T>, value: CrochetValue) {
    Values.assert_tag(Tag.ACTION, action);
    return action.payload.action.fired.has(value);
  }

  // == Collection features
  get collection() {
    return Collection;
  }

  // == Etc
  xorshift(seed: number, inc: number) {
    return new XorShift(seed, inc);
  }

  xorshift_random() {
    return XorShift.new_random();
  }

  push_transcript(tag: string, x: CrochetValue | string) {
    return new NSTranscriptWrite(tag, x);
  }
}
