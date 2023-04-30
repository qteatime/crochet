export type Op =
  | { op: "bool" }
  | { op: "int8" }
  | { op: "int16" }
  | { op: "int32" }
  | { op: "uint8" }
  | { op: "uint16" }
  | { op: "uint32" }
  | { op: "integer" }
  | { op: "float32" }
  | { op: "float64" }
  | { op: "text" }
  | { op: "bytes" }
  | { op: "constant"; value: Uint8Array }
  | { op: "array"; items: Op }
  | { op: "map"; keys: Op; values: Op }
  | { op: "optional"; value: Op }
  | { op: "record"; id: number }
  | { op: "tagged-choice"; mapping: Map<number, Op> };
