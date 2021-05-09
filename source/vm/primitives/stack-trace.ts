import { unreachable } from "../../utils/utils";
import {
  Activation,
  ActivationTag,
  CrochetCommandBranch,
  CrochetLambda,
  CrochetModule,
  CrochetPrelude,
  CrochetTest,
  CrochetThunk,
  ActivationLocation,
  NativeFunction,
} from "../intrinsics";
import {
  branch_location,
  branch_name,
  branch_name_location,
  command_signature,
  from_suffix,
  from_suffix_newline,
  module_location,
  thunk_location,
  type_name,
} from "./location";
import { get_annotated_source } from "./meta";

export class TraceEntry {
  constructor(
    readonly context: ActivationLocation,
    readonly module: CrochetModule | null,
    readonly meta: number | null
  ) {}
}

const MAX_DEPTH = 10;

export function collect_trace(
  activation: Activation | null,
  depth: number = 0
): TraceEntry[] {
  if (activation == null || depth > MAX_DEPTH) {
    return [];
  }

  switch (activation.tag) {
    case ActivationTag.CROCHET_ACTIVATION: {
      return [
        new TraceEntry(
          activation.location,
          activation.env.raw_module,
          activation.current?.meta ?? null
        ),
        ...collect_trace(activation.parent, depth + 1),
      ];
    }

    case ActivationTag.NATIVE_ACTIVATION: {
      return [
        new TraceEntry(activation.location, null, null),
        ...collect_trace(activation.parent, depth + 1),
      ];
    }

    default:
      throw unreachable(activation, "Activation");
  }
}

export function format_entries(entries: TraceEntry[]) {
  return entries.map(format_entry).join("\n");
}

export function format_entry(entry: TraceEntry) {
  return `  In ${format_location(entry.context)} ${format_slice(
    entry.module,
    entry.meta
  )}`;
}

export function format_location(location: ActivationLocation) {
  if (location instanceof CrochetLambda) {
    return `anonymous function(${location.parameters.join(
      ", "
    )})${from_suffix_newline(location.env.raw_module)}`;
  } else if (location instanceof CrochetCommandBranch) {
    return `${branch_name(location)}\n    from ${branch_location(location)}`;
  } else if (location instanceof CrochetThunk) {
    return thunk_location(location);
  } else if (location instanceof CrochetPrelude) {
    return `prelude${from_suffix_newline(location.env.raw_module)}`;
  } else if (location instanceof CrochetTest) {
    return `test "${location.title}"${from_suffix_newline(location.module)}`;
  } else if (location instanceof NativeFunction) {
    return `native ${location.name} in ${location.pkg.name}`;
  } else if (location == null) {
    return `(root)`;
  } else {
    throw unreachable(location, "Location");
  }
}

export function format_slice(
  module: CrochetModule | null,
  meta: number | null
) {
  if (module == null || meta == null || module.metadata == null) {
    return "\n";
  }
  const line = get_annotated_source(meta, module.metadata);
  if (line == null) {
    return "\n";
  } else {
    return `\n    ${line}\n`;
  }
}
