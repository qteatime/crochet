import { Error } from "./result";

export function lazy() {
  const nothing = new (class Nothing {})();

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const getter = descriptor.get;
    if (getter == null) {
      throw new Error(`@lazy applied to non-getter ${key}`);
    }

    let value = nothing;
    descriptor.get = function () {
      if (value === nothing) {
        value = getter.call(this);
      }
      return value;
    };
  };
}
