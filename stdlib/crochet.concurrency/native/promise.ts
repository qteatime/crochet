import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  class Deferred<A, B, S> {
    private _resolve: (_: A) => void;
    private _reject: (_: B) => void;
    state: S;
    promise: Promise<A>;
    is_cancelled: boolean;
    is_resolved: boolean;

    constructor(state: S) {
      this.state = state;
      this.is_resolved = false;
      this.is_cancelled = false;
      this._resolve = null as any;
      this._reject = null as any;
      this.promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }

    cancel(x: any) {
      if (this.is_resolved || this.is_cancelled) return;
      this.is_cancelled = true;
      this._reject(x);
    }

    resolve(x: A) {
      if (this.is_resolved || this.is_cancelled) return;
      this.is_resolved = true;
      this._resolve(x);
    }

    reject(x: B) {
      if (this.is_resolved || this.is_cancelled) return;
      this.is_resolved = true;
      this._reject(x);
    }
  }

  function get_deferred(x0: CrochetValue) {
    const x = ffi.unbox(x0);
    if (x instanceof Deferred) {
      return x;
    } else {
      throw ffi.panic("invalid-type", "Expected a native deferred");
    }
  }

  ffi.defun("promise.defer", (state) => {
    return ffi.box(new Deferred(state));
  });

  ffi.defun("promise-is-resolved", (x) => {
    return ffi.boolean(get_deferred(x).is_resolved);
  });

  ffi.defun("promise.is-cancelled", (x) => {
    return ffi.boolean(get_deferred(x).is_cancelled);
  });

  ffi.defun("promise.state", (x) => {
    return get_deferred(x).state;
  });

  ffi.defun("promise.cancel", (x, v) => {
    get_deferred(x).cancel(v);
    return ffi.nothing;
  });

  ffi.defun("promise.resolve", (x, v) => {
    get_deferred(x).resolve(v);
    return ffi.nothing;
  });

  ffi.defun("promise.reject", (x, v) => {
    get_deferred(x).reject(v);
    return ffi.nothing;
  });

  ffi.defun("promise.then", (x, f, g) => {
    get_deferred(x).promise.then(
      (value) => {
        return ffi.run_asynchronously(function* () {
          return yield ffi.apply(f, [value]);
        });
      },
      (reason) => {
        return ffi.run_asynchronously(function* () {
          return yield ffi.apply(g, [reason]);
        });
      }
    );
    return ffi.nothing;
  });

  ffi.defmachine("promise.wait", function* (x) {
    const result = yield ffi.await(get_deferred(x).promise);
    return result;
  });

  ffi.defun("promise.spawn", (fn) => {
    ffi.run_asynchronously(function* () {
      yield ffi.apply(fn, []);
      return ffi.nothing;
    });
    return ffi.nothing;
  });
};
