import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function unbox_typed<T extends Function>(
    x0: CrochetValue,
    type: T
  ): T["prototype"] {
    const x = ffi.unbox(x0);
    if (x instanceof type) {
      return x as any;
    } else {
      throw ffi.panic("invalid-type", `Expected native ${type.name}`);
    }
  }

  ffi.defun("ev.time", (ev0) => {
    const ev = unbox_typed(ev0, Event);
    return ffi.integer(BigInt(Math.round(ev.timeStamp)));
  });

  ffi.defun("ev.cancel", (ev0) => {
    const ev = unbox_typed(ev0, Event);
    ev.stopPropagation();
    ev.preventDefault();
    return ffi.nothing;
  });

  ffi.defun("ev.navigate-state", (ev0) => {
    const ev = unbox_typed(ev0, PopStateEvent);
    try {
      if (
        ev.state != null &&
        ev.state instanceof Map &&
        ev.state.get("tag") === "agata-navigate"
      ) {
        return ffi.record(
          new Map([
            ["tag", ffi.text("agata-navigate")],
            ["uri", ffi.text(ev.state.get("uri"))],
          ])
        );
      } else {
        return ffi.nothing;
      }
    } catch (_) {
      return ffi.nothing;
    }
  });

  ffi.defun("ev.key-code", (ev) => {
    return ffi.text(unbox_typed(ev, KeyboardEvent).key);
  });

  ffi.defun("ev.key-alt", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).altKey);
  });

  ffi.defun("ev.key-ctrl", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).ctrlKey);
  });

  ffi.defun("ev.key-meta", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).metaKey);
  });

  ffi.defun("ev.key-shift", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).shiftKey);
  });

  ffi.defun("ev.key-repeat", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).repeat);
  });

  ffi.defun("ev.key-compose", (ev) => {
    return ffi.boolean(unbox_typed(ev, KeyboardEvent).isComposing);
  });
};
