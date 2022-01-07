import type { ForeignInterface } from "../../../build/crochet";
import type {
  Activation,
  HandlerStack,
  TraceEvent,
  TELog,
  CrochetValue,
  TENew,
  TEInvoke,
  TEReturn,
  TEApplyLambda,
  TEForceThunk,
} from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  function to_event_record(event: TraceEvent): null | CrochetValue {
    return ffi.match_trace_event(event, {
      LOG: (log0: TraceEvent) => {
        const log = log0 as TELog;
        if (typeof log.value === "string") {
          return ffi.record(
            new Map([
              ["tag", ffi.text("LOG_TEXT")],
              ["time", ffi.integer(log.time)],
              ["location", ffi.box(log.location)],
              ["log-tag", log.log_tag],
              ["message", ffi.text(log.value)],
            ])
          );
        } else {
          return ffi.record(
            new Map([
              ["tag", ffi.text("LOG")],
              ["time", ffi.integer(log.time)],
              ["location", ffi.box(log.location)],
              ["log-tag", log.log_tag],
              ["value", log.value],
            ])
          );
        }
      },
      NEW: (event) => {
        const x = event as TENew;
        return ffi.record(
          new Map([
            ["tag", ffi.text("NEW")],
            ["time", ffi.integer(x.time)],
            ["location", ffi.box(x.location)],
            ["crochet-type", ffi.box(x.type)],
            ["arguments", ffi.list(x.parameters)],
          ])
        );
      },
      INVOKE: (event) => {
        const x = event as TEInvoke;
        return ffi.record(
          new Map([
            ["tag", ffi.text("INVOKE")],
            ["time", ffi.integer(x.time)],
            ["location", ffi.box(x.location)],
            ["activation", ffi.box(x.activation)],
            ["branch", ffi.box(x.command)],
            ["arguments", ffi.list(x.args)],
          ])
        );
      },
      APPLY_LAMBDA: (event) => {
        const x = event as TEApplyLambda;
        return ffi.record(
          new Map([
            ["tag", ffi.text("APPLY")],
            ["time", ffi.integer(x.time)],
            ["location", ffi.box(x.location)],
            ["activation", ffi.box(x.activation)],
            ["lambda", x.lambda],
            ["arguments", ffi.list(x.args)],
          ])
        );
      },
      RETURN: (event) => {
        const x = event as TEReturn;
        return ffi.record(
          new Map([
            ["tag", ffi.text("RETURN")],
            ["time", ffi.integer(x.time)],
            ["location", ffi.box(x.location)],
            ["value", x.value],
          ])
        );
      },
      FORCE_THUNK: (event) => {
        const x = event as TEForceThunk;
        return ffi.record(
          new Map([
            ["tag", ffi.text("FORCE")],
            ["time", ffi.integer(x.time)],
            ["location", ffi.box(x.location)],
            ["activation", ffi.box(x.activation)],
            ["thunk", x.thunk],
          ])
        );
      },
      FACT: () => null,
      FORGET: () => null,
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

  ffi.defun("trace.tc-or", (l, r) => {
    return ffi.box(
      ffi.trace_constraint.or(ffi.unbox(l) as any, ffi.unbox(r) as any)
    );
  });

  ffi.defun("trace.tc-and", (l, r) => {
    return ffi.box(
      ffi.trace_constraint.and(ffi.unbox(l) as any, ffi.unbox(r) as any)
    );
  });

  ffi.defun("trace.tc-instantiate", (t) => {
    const st = ffi.static_type_to_type(ffi.get_type(t));
    if (st == null) {
      throw ffi.panic("internal", `No static type -> type mapping available`);
    }
    return ffi.box(ffi.trace_constraint.instantiate(st));
  });

  ffi.defun("trace.tc-invoke", (t) => {
    return ffi.box(ffi.trace_constraint.invoke(ffi.text_to_string(t)));
  });

  ffi.defun("trace.tc-invoke-return", (t) => {
    return ffi.box(ffi.trace_constraint.invoke_return(ffi.text_to_string(t)));
  });

  ffi.defun("trace.tc-lambda-apply", () => {
    return ffi.box(ffi.trace_constraint.lambda_apply());
  });

  ffi.defun("trace.tc-lambda-return", () => {
    return ffi.box(ffi.trace_constraint.lambda_return());
  });

  ffi.defun("trace.tc-thunk-force", () => {
    return ffi.box(ffi.trace_constraint.thunk_force());
  });

  ffi.defun("trace.tc-thunk-return", () => {
    return ffi.box(ffi.trace_constraint.thunk_return());
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
    return ffi.list(
      events
        .map(to_event_record)
        .filter((x) => x != null)
        .map((x) => x!)
    );
  });

  ffi.defun("trace.location-repr", (loc0) => {
    const loc = ffi.unbox(loc0) as any;
    const repr = ffi.location_debug_string(loc);
    return ffi.text(repr);
  });

  ffi.defun("trace.make-static-type", (t0) => {
    const t = ffi.unbox(t0) as any;
    return ffi.make_static_type(t);
  });

  ffi.defun("trace.type-fields", (t0) => {
    const t = ffi.unbox(t0) as any;
    const fields = ffi.get_type_fields(t);
    return ffi.list(fields.map((x) => ffi.text(x)));
  });
};
