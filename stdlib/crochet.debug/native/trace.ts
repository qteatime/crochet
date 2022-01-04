import type { ForeignInterface } from "../../../build/crochet";
import type {
  Activation,
  HandlerStack,
  TraceEvent,
  TELog,
  CrochetValue,
} from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  function to_event_record(event: TraceEvent): null | CrochetValue {
    return ffi.match_trace_event(event, {
      FACT: () => null,
      FORGET: () => null,
      LOG: (log0: TraceEvent) => {
        const log = log0 as TELog;
        if (typeof log.value === "string") {
          return ffi.record(
            new Map([
              ["tag", ffi.text("LOG_TEXT")],
              ["log-tag", log.log_tag],
              ["location", ffi.box(log.location)],
              ["message", ffi.text(log.value)],
            ])
          );
        } else {
          return ffi.record(
            new Map([
              ["tag", ffi.text("LOG")],
              ["log-tag", log.log_tag],
              ["location", ffi.box(log.location)],
              ["value", log.value],
            ])
          );
        }
      },
      SIMULATION_ACTION: () => null,
      SIMULATION_ACTION_CHOICE: () => null,
      SIMULATION_EVENT: () => null,
      SIMULATION_GOAL_REACHED: () => null,
      SIMULATION_TURN: () => null,
    });
  }

  ffi.defun("trace.tc-has-tag", (tag) => {
    return ffi.box(ffi.trace_constraint.log_tag(tag));
  });

  ffi.defun("trace.tc-has-span", (span) => {
    return ffi.box(ffi.trace_constraint.event_span(ffi.unbox(span) as any));
  });

  ffi.defun("trace.make-recorder", (constraint) => {
    return ffi.box(ffi.make_trace_recorder(ffi.unbox(constraint) as any));
  });

  ffi.defun("trace.stop", (recorder) => {
    ffi.stop_recorder(ffi.unbox(recorder) as any);
    return ffi.nothing;
  });

  ffi.defun("trace.start", (recorder) => {
    ffi.start_recorder(ffi.unbox(recorder) as any);
    return ffi.nothing;
  });

  ffi.defun("trace.events", (recorder) => {
    const events = ffi.get_traced_events(ffi.unbox(recorder) as any);
    const result = ffi.list(
      events
        .map(to_event_record)
        .filter((x) => x != null)
        .map((x) => x!)
    );
    console.log("events", events);
    console.log("results", result);
    return result;
  });

  ffi.defun("trace.location-repr", (loc0) => {
    const loc = ffi.unbox(loc0) as any;
    const repr = ffi.location_debug_string(loc);
    return ffi.text(repr);
  });
};
