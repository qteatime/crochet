import { Metadata } from "../intrinsics";

export function get_line_column(id: number, meta: Metadata) {
  const interval = meta.table.get(id);
  if (interval == null) {
    return null;
  } else {
    const lines = meta.source
      .slice(0, interval.range.start)
      .split(/\r\n|\r|\n/);
    const last_line = lines[lines.length - 1] ?? "";
    return { line: lines.length, column: last_line.length + 1 };
  }
}

export function get_annotated_source(id: number, meta: Metadata) {
  const pos = get_line_column(id, meta);
  if (pos == null) {
    return null;
  } else {
    const lines = meta.source.split(/\r\n|\r|\n/);
    const line = lines[pos.line - 1];
    if (line == null) {
      return null;
    } else {
      return ` ${pos.line.toString().padStart(4)} | ${line}`;
    }
  }
}
