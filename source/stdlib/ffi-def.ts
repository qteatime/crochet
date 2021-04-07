import {
  CrochetFloat,
  CrochetType,
  CrochetValue,
  ForeignInterface,
  Machine,
  State,
  type_name,
} from "../runtime";
import { zip } from "../utils";

type Class<T> = {
  new (...args: any[]): T;
};

type AnyClass<T> = typeof CrochetValue | Class<T>;
type UnwrapClass<T> = T extends Class<infer U>
  ? U
  : T extends typeof CrochetValue
  ? CrochetValue
  : never;

type Instances<Cs> = Cs extends [infer A, ...infer Rs]
  ? [UnwrapClass<A>, ...Instances<Rs>]
  : Cs extends [infer A]
  ? [UnwrapClass<A>]
  : Cs extends []
  ? []
  : never;

export class ForeignNamespace {
  constructor(readonly ffi: ForeignInterface, readonly namespace: string) {}

  private namespaced(x: string) {
    return `${this.namespace}.${x}`;
  }

  deftype(name: string, type: CrochetType) {
    this.ffi.types.add(this.namespaced(name), type);
    return this;
  }

  defun<T extends AnyClass<any>[]>(
    name: string,
    types: [...T],
    fn: (...args: Instances<T>) => CrochetValue
  ) {
    this.ffi.methods.add(
      this.namespaced(name),
      function* (state: State, ...args: CrochetValue[]) {
        return fn(...(args as any));
      }
    );
    return this;
  }

  defmachine<T extends AnyClass<any>[]>(
    name: string,
    types: [...T],
    fn: (state: State, ...args: Instances<T>) => Machine
  ) {
    this.ffi.methods.add(this.namespaced(name), fn as any);
    return this;
  }
}
