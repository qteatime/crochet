import type { CrochetValue } from "./intrinsics";
import type { TraceEntry } from "./primitives/stack-trace";
import { simple_value, block } from "./primitives/location";

export class CrochetError extends Error {}

export class ErrArbitrary extends CrochetError {
  constructor(readonly tag: string, readonly original_message: string) {
    super(`${tag}: ${original_message}`);
  }
}

export class ErrNativePanic extends CrochetError {
  constructor(
    readonly tag: string,
    readonly original_message: string,
    readonly include_trace = true,
    readonly data: CrochetValue | null = null
  ) {
    super(`${tag}: ${original_message}`);
    if (data != null) {
      const repr = simple_value(data);
      Object.defineProperty(this, "message", {
        value: this.message + `\n\nAdditional information:\n${block(2, repr)}`,
      });
    }
  }
}

export class CrochetEvaluationError extends CrochetError {
  static readonly show_native_trace = false;

  readonly source!: Error;
  readonly trace!: TraceEntry[];

  constructor(source: Error, trace: TraceEntry[], formatted_trace: string) {
    // let native_trace = source instanceof Error ? source.stack ?? "" : "";
    // if (native_trace != "") {
    //   const trace = native_trace.replace(/^.*?\n\s*at /, "");
    //   native_trace = `\n\nArising from the native code:\n${trace}`;
    // }

    const include_trace =
      source instanceof ErrNativePanic ? source.include_trace : true;
    const suffix = include_trace
      ? ["\n\n", "Arising from:\n", formatted_trace]
      : [];

    super([source.message, ...suffix].join(""));
    Object.defineProperty(this, "source", {
      value: source,
    });
    Object.defineProperty(this, "trace", {
      value: trace,
    });
  }
}
