import type { ForeignInterface } from "../../../build/crochet";
import type { Activation, HandlerStack } from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("vm.current-activation", function* () {
    const activation = yield ffi.current_activation();
    return ffi.box(activation);
  });

  ffi.defmachine("vm.current-universe", function* () {
    const universe = yield ffi.current_universe();
    return ffi.box(universe);
  });

  ffi.defun("vm.parent-activation", (activation0) => {
    const activation = ffi.unbox(activation0) as Activation;
    if (activation.parent == null) {
      return ffi.nothing;
    } else {
      return ffi.box(activation.parent);
    }
  });

  ffi.defun("vm.activation-handlers", (activation0) => {
    const activation = ffi.unbox(activation0) as Activation;
    return ffi.box(activation.handlers);
  });

  ffi.defun("vm.activation-to-text", (activation0) => {
    const activation = ffi.unbox(activation0) as Activation;
    return ffi.text(ffi.formatter.simple_activation(activation));
  });

  ffi.defun("vm.handler-stack-to-text", (handlers0) => {
    const handlers = ffi.unbox(handlers0) as HandlerStack;
    return ffi.text(ffi.formatter.handler_stack(handlers));
  });
};
