import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("ws.open", (url, protocols0) => {
    const protocols = ffi
      .list_to_array(protocols0)
      .map((x) => ffi.text_to_string(x));
    const socket = new WebSocket(ffi.text_to_string(url), protocols);
    return ffi.box(socket);
  });

  ffi.defun("ws.listen", (ws0, event, fn) => {
    const ws = ffi.unbox_typed(WebSocket, ws0);
    ws.addEventListener(ffi.text_to_string(event), (ev) => {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(fn, [ffi.box(ev)]);
        return ffi.nothing;
      });
    });
    return ffi.nothing;
  });

  ffi.defun("ws.event-message", (ev) => {
    return ffi.text(ffi.unbox_typed(MessageEvent, ev).data);
  });

  ffi.defun("ws.state", (ws) => {
    return ffi.integer(BigInt(ffi.unbox_typed(WebSocket, ws).readyState));
  });

  ffi.defun("ws.send", (ws0, data) => {
    const ws = ffi.unbox_typed(WebSocket, ws0);
    ws.send(ffi.text_to_string(data));
    return ffi.nothing;
  });

  ffi.defun("ws.close", (ws0) => {
    const ws = ffi.unbox_typed(WebSocket, ws0);
    ws.close();
    return ffi.nothing;
  });

  ffi.defun("ws.protocol", (ws) => {
    return ffi.text(ffi.unbox_typed(WebSocket, ws).protocol);
  });
};
