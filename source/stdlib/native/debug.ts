import {
  box,
  CrochetNothing,
  CrochetText,
  CrochetUnknown,
  CrochetValue,
  ECAnd,
  ECInPackage,
  ECNamed,
  ECNot,
  ECOr,
  EntityConstraint,
  ForeignInterface,
  TCInvoke,
  TraceConstraint,
  TraceRef,
  _push,
} from "../../runtime";
import { cast } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function debug_transcript(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.debug:transcript")
    .defun("write", [CrochetValue, CrochetText], (self, text) => {
      console.log(text.value);
      return self;
    })
    .defun("write-inspect", [CrochetValue, CrochetValue], (self, value) => {
      console.log(value.to_text());
      return value;
    });
}

export function debug_trace(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.debug:trace-constraint")
    .defun("ec-named", [CrochetText], (text) => box(new ECNamed(text.value)))
    .defun("ec-package", [CrochetText], (text) =>
      box(new ECInPackage(text.value))
    )
    .defun("ec-and", [CrochetUnknown, CrochetUnknown], (a, b) =>
      box(
        new ECAnd(
          cast(a.value, EntityConstraint),
          cast(b.value, EntityConstraint)
        )
      )
    )
    .defun("ec-or", [CrochetUnknown, CrochetUnknown], (a, b) =>
      box(
        new ECOr(
          cast(a.value, EntityConstraint),
          cast(b.value, EntityConstraint)
        )
      )
    )
    .defun("ec-not", [CrochetUnknown], (a) =>
      box(new ECNot(cast(a.value, EntityConstraint)))
    )
    .defun("tc-invoke", [CrochetUnknown], (a) =>
      box(new TCInvoke(cast(a.value, EntityConstraint)))
    );

  new ForeignNamespace(ffi, "crochet.debug:trace")
    .defmachine(
      "start-tracing",
      [CrochetText, CrochetUnknown],
      function* (state, name, c) {
        const ref = state.world.tracer.start_tracing(
          name.value,
          cast(c.value, TraceConstraint)
        );
        return box(ref);
      }
    )
    .defmachine("stop-tracing", [CrochetUnknown], function* (state, ref) {
      state.world.tracer.stop_tracing(cast(ref.value, TraceRef));
      return CrochetNothing.instance;
    })
    .defmachine("clear-traces", [], function* (state) {
      state.world.tracer.clear_traces();
      return CrochetNothing.instance;
    });
}

export default [debug_transcript, debug_trace];
