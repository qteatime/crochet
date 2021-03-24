import { cast, unreachable } from "../../utils";
import { CrochetInteger, CrochetValue, from_bool } from "../primitives";

export enum UnaryOp {
  OP_NOT,
}

export enum BinOp {
  OP_AND,
  OP_OR,
  OP_ADD,
  OP_SUB,
  OP_MUL,
  OP_EQ,
  OP_NOT_EQ,
  OP_GT,
  OP_GTE,
  OP_LT,
  OP_LTE,
}

export function do_bin_op(op: BinOp, left: CrochetValue, right: CrochetValue) {
  switch (op) {
    case BinOp.OP_AND: {
      return from_bool(left.as_bool() && right.as_bool());
    }

    case BinOp.OP_OR: {
      return from_bool(left.as_bool() || right.as_bool());
    }

    case BinOp.OP_ADD:
    case BinOp.OP_SUB:
    case BinOp.OP_MUL:
    case BinOp.OP_GT:
    case BinOp.OP_GTE:
    case BinOp.OP_LT:
    case BinOp.OP_LTE: {
      const l = cast(left, CrochetInteger);
      const r = cast(right, CrochetInteger);
      switch (op) {
        case BinOp.OP_ADD:
          return new CrochetInteger(l.value + r.value);
        case BinOp.OP_SUB:
          return new CrochetInteger(l.value - r.value);
        case BinOp.OP_MUL:
          return new CrochetInteger(l.value * r.value);
        case BinOp.OP_GT:
          return from_bool(l.value > r.value);
        case BinOp.OP_GTE:
          return from_bool(l.value >= r.value);
        case BinOp.OP_LT:
          return from_bool(l.value < r.value);
        case BinOp.OP_LTE:
          return from_bool(l.value <= r.value);
      }
    }

    case BinOp.OP_EQ: {
      return from_bool(left.equals(right));
    }

    case BinOp.OP_NOT_EQ: {
      return from_bool(!left.equals(right));
    }

    default:
      throw unreachable(op, `binary operation`);
  }
}

export function do_unary_op(op: UnaryOp, value: CrochetValue) {
  switch (op) {
    case UnaryOp.OP_NOT: {
      return from_bool(!value.as_bool());
    }

    default:
      throw unreachable(op, `unary operation`);
  }
}
