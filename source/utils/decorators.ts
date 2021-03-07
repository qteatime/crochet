import { Error } from "./result";

export function lazy() {
  const cache = new WeakMap<object, any>();

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const getter = descriptor.get;
    if (getter == null) {
      throw new Error(`@lazy applied to non-getter ${key}`);
    }

    descriptor.get = function () {
      let value = cache.get(this);
      if (value == null) {
        value = getter.call(this);
        cache.set(this, value);
      }
      return value;
    };
  };
}
