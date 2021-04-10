import {
  CrochetValue,
  CrochetType,
  ForeignInterface,
  CrochetInteger,
  CrochetText,
  CrochetFloat,
  TCrochetType,
  TCrochetAny,
  TCrochetInteger,
  TCrochetFloat,
  TCrochetBoolean,
  TCrochetNothing,
  TCrochetUnknown,
  TAnyFunction,
  TCrochetTuple,
  TCrochetText,
  TCrochetRecord,
  from_bool,
  CrochetTuple,
  CrochetRecord,
  invoke,
  apply,
  js_to_crochet,
  json_to_crochet,
  State,
  Machine,
  Thread,
  cvalue,
  _push,
  _await,
  CrochetNothing,
} from "./runtime";
import { CrochetPackage } from "./runtime/pkg";
import { ForeignNamespace } from "./stdlib";
import { cast } from "./utils";

export class Plugin {
  #ffi: ForeignInterface;
  #pkg: CrochetPackage;

  constructor(pkg: CrochetPackage, ffi: ForeignInterface) {
    this.#pkg = pkg;
    this.#ffi = ffi;
  }

  define_ffi(namespace: string) {
    return new ForeignNamespace(this.#ffi, `${this.#pkg.name}:${namespace}`);
  }

  get_integer(value: CrochetValue) {
    return cast(value, CrochetInteger).value;
  }

  get_text(value: CrochetValue) {
    return cast(value, CrochetText).value;
  }

  get_float(value: CrochetValue) {
    return cast(value, CrochetFloat).value;
  }

  get_bool(value: CrochetValue) {
    return value.as_bool();
  }

  from_bool(value: boolean) {
    return from_bool(value);
  }

  from_integer(value: bigint) {
    return new CrochetInteger(value);
  }

  from_number(value: number) {
    return new CrochetFloat(value);
  }

  from_string(value: string) {
    return new CrochetText(value);
  }

  from_array(value: CrochetValue[]) {
    return new CrochetTuple(value);
  }

  from_map(value: Map<string, CrochetValue>) {
    return new CrochetRecord(value);
  }

  nothing() {
    return CrochetNothing.instance;
  }

  from_js(value: unknown) {
    return js_to_crochet(value);
  }

  from_json(value: string) {
    return json_to_crochet(JSON.parse(value));
  }

  invoke(state: State, name: string, args: CrochetValue[]) {
    return invoke(state, name, args);
  }

  apply(state: State, fun: CrochetValue, args: CrochetValue[]) {
    return apply(state, fun, args);
  }

  run_sync(machine: Machine): CrochetValue {
    return cvalue(Thread.for_machine(machine).run_sync());
  }

  async run_async(machine: Machine): Promise<CrochetValue> {
    return cvalue(await Thread.for_machine(machine).run_and_wait());
  }

  push(machine: Machine) {
    return _push(machine);
  }

  await(promise: Promise<any>) {
    return _await(promise);
  }

  primitive_types = {
    integer: TCrochetInteger.type,
    float: TCrochetFloat.type,
    boolean: TCrochetBoolean.type,
    nothing: TCrochetNothing.type,
    unknown: TCrochetUnknown.type,
    function: TAnyFunction.type,
    tuple: TCrochetTuple.type,
    text: TCrochetText.type,
    record: TCrochetRecord.type,
  };
}
