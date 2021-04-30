import * as IR from "../ir";
import { unreachable } from "../utils/utils";
import { Writer, BinaryWriter } from "./binary";
import { hash_file } from "./hash";

export const MAGIC = "CROC";
export const VERSION = 2;

export enum Section {
  DECLARATION = 1,
  SOURCE_INFO = 2,
}

class CrochetIREncoder extends BinaryWriter {
  constructor(target: Writer) {
    super(target);
  }

  encode_program(x: IR.Program) {
    this.text(MAGIC);
    this.uint16(VERSION);
    this.bytes(hash_file(x.source));
    this.string(x.filename);
    this.encode_declarations(x.declarations);
    this.encode_meta_table(x);
  }

  encode_meta_table(x: IR.Program) {
    this.encode_enum_tag(Section.SOURCE_INFO);
    this.string(x.source);
    this.map(x.meta_table, (id, pos) => {
      this.uint32(id);
      this.uint32(pos.range.start);
      this.uint32(pos.range.end);
    });
  }

  encode_declarations(xs: IR.Declaration[]) {
    this.encode_enum_tag(Section.DECLARATION);
    this.array(xs, (x) => this.encode_declaration(x));
  }

  encode_declaration(x: IR.Declaration) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.DeclarationTag.COMMAND: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.string(x.name);
        this.array(x.parameters, (param) => this.string(param));
        this.array(x.types, (type) => this.encode_type(type));
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.TYPE: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.encode_enum_tag(x.visibility);
        this.string(x.name);
        this.encode_type(x.parent);
        this.array(x.fields, (field) => this.string(field));
        this.array(x.types, (type) => this.encode_type(type));
        break;
      }

      case IR.DeclarationTag.SEAL: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.DeclarationTag.TEST: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.DEFINE: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.string(x.name);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.OPEN: {
        this.encode_meta_id(x.meta);
        this.string(x.namespace);
        break;
      }

      case IR.DeclarationTag.PRELUDE: {
        this.encode_meta_id(x.meta);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.RELATION: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.string(x.name);
        this.array(x.type, (type) => {
          this.encode_meta_id(type.meta);
          this.encode_enum_tag(type.multiplicity);
        });
        break;
      }

      case IR.DeclarationTag.ACTION: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.maybe(x.context, (c) => this.string(c));
        this.string(x.name);
        this.encode_type(x.actor);
        this.encode_basic_block(x.rank_function);
        this.encode_predicate(x.predicate);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.WHEN: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.maybe(x.context, (c) => this.string(c));
        this.encode_predicate(x.predicate);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.DeclarationTag.CONTEXT: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.string(x.name);
        break;
      }

      case IR.DeclarationTag.FOREIGN_TYPE: {
        this.encode_meta_id(x.meta);
        this.string(x.documentation);
        this.encode_enum_tag(x.visibility);
        this.string(x.name);
        this.string(x.target);
        break;
      }

      default:
        throw unreachable(x, `Declaration`);
    }
  }

  encode_basic_block(x: IR.BasicBlock) {
    this.array(x.ops, (op) => this.encode_op(op));
  }

  encode_op(x: IR.Op) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.OpTag.DROP: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.LET: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.OpTag.PUSH_VARIABLE: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.OpTag.PUSH_SELF: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.PUSH_GLOBAL: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.OpTag.PUSH_LITERAL: {
        this.encode_literal(x.value);
        break;
      }

      case IR.OpTag.PUSH_RETURN: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.PUSH_TUPLE: {
        this.encode_meta_id(x.meta);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.PUSH_NEW: {
        this.encode_meta_id(x.meta);
        this.encode_type(x.type);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.PUSH_STATIC_TYPE: {
        this.encode_meta_id(x.meta);
        this.encode_type(x.type);
        break;
      }

      case IR.OpTag.PUSH_RECORD: {
        this.encode_meta_id(x.meta);
        this.array(x.keys, (k) => this.string(k));
        break;
      }

      case IR.OpTag.RECORD_AT_PUT: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.PROJECT: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.PROJECT_STATIC: {
        this.encode_meta_id(x.meta);
        this.string(x.key);
        break;
      }

      case IR.OpTag.PUSH_LAZY: {
        this.encode_meta_id(x.meta);
        this.encode_basic_block(x.body);
        break;
      }

      case IR.OpTag.FORCE: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.INTERPOLATE: {
        this.encode_meta_id(x.meta);
        this.array(x.parts, (maybe_part) =>
          this.maybe(maybe_part, (part) => this.string(part))
        );
        break;
      }

      case IR.OpTag.PUSH_LAMBDA: {
        this.encode_meta_id(x.meta);
        this.array(x.parameters, (p) => this.string(p));
        this.encode_basic_block(x.body);
        break;
      }

      case IR.OpTag.INVOKE_FOREIGN: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.INVOKE: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.APPLY: {
        this.encode_meta_id(x.meta);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.APPLY_PARTIAL: {
        this.encode_meta_id(x.meta);
        this.array(x.parts, (part) => this.boolean(part));
        break;
      }

      case IR.OpTag.RETURN: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.PUSH_PARTIAL: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.ASSERT: {
        this.encode_meta_id(x.meta);
        this.encode_enum_tag(x.kind);
        this.string(x.assert_tag);
        this.string(x.message);
        break;
      }

      case IR.OpTag.BRANCH: {
        this.encode_meta_id(x.meta);
        this.encode_basic_block(x.consequent);
        this.encode_basic_block(x.alternate);
        break;
      }

      case IR.OpTag.TYPE_TEST: {
        this.encode_meta_id(x.meta);
        this.encode_type(x.type);
        break;
      }

      case IR.OpTag.INTRINSIC_EQUAL: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.REGISTER_INSTANCE: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.OpTag.SEARCH: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.predicate);
        break;
      }

      case IR.OpTag.MATCH_SEARCH: {
        this.encode_meta_id(x.meta);
        this.array(x.cases, (kase) => {
          this.encode_predicate(kase.predicate);
          this.encode_basic_block(kase.body);
        });
        break;
      }

      case IR.OpTag.FACT: {
        this.encode_meta_id(x.meta);
        this.string(x.relation);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.FORGET: {
        this.encode_meta_id(x.meta);
        this.string(x.relation);
        this.uint32(x.arity);
        break;
      }

      case IR.OpTag.SIMULATE: {
        this.encode_meta_id(x.meta);
        this.maybe(x.context, (context) => this.string(context));
        this.encode_simulation_goal(x.goal);
        this.array(x.signals, (signal) => {
          this.encode_meta_id(signal.meta);
          this.array(signal.parameters, (param) => this.string(param));
          this.string(signal.name);
          this.encode_basic_block(signal.body);
        });
        break;
      }

      default:
        throw unreachable(x, `Expression Op`);
    }
  }

  encode_simulation_goal(x: IR.SimulationGoal) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.SimulationGoalTag.ACTION_QUIESCENCE: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.SimulationGoalTag.EVENT_QUIESCENCE: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.SimulationGoalTag.TOTAL_QUIESCENCE: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.SimulationGoalTag.PREDICATE: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.predicate);
        break;
      }

      default:
        throw unreachable(x, `Simulation goal`);
    }
  }

  encode_predicate(x: IR.Predicate) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.PredicateTag.AND: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.left);
        this.encode_predicate(x.right);
        break;
      }

      case IR.PredicateTag.OR: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.left);
        this.encode_predicate(x.right);
        break;
      }

      case IR.PredicateTag.NOT: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.pred);
        break;
      }

      case IR.PredicateTag.RELATION: {
        this.encode_meta_id(x.meta);
        this.string(x.relation);
        this.array(x.patterns, (pattern) => this.encode_pattern(pattern));
        break;
      }

      case IR.PredicateTag.SAMPLE_RELATION: {
        this.encode_meta_id(x.meta);
        this.uint32(x.size);
        this.string(x.relation);
        this.array(x.patterns, (pattern) => this.encode_pattern(pattern));
        break;
      }

      case IR.PredicateTag.SAMPLE_TYPE: {
        this.encode_meta_id(x.meta);
        this.uint32(x.size);
        this.string(x.name);
        this.encode_type(x.type);
        break;
      }

      case IR.PredicateTag.CONSTRAIN: {
        this.encode_meta_id(x.meta);
        this.encode_predicate(x.predicate);
        this.encode_basic_block(x.constraint);
        break;
      }

      case IR.PredicateTag.LET: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.encode_basic_block(x.value);
        break;
      }

      case IR.PredicateTag.TYPE: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        this.encode_type(x.type);
        break;
      }

      case IR.PredicateTag.ALWAYS: {
        this.encode_meta_id(x.meta);
        break;
      }

      default:
        throw unreachable(x, `Predicate`);
    }
  }

  encode_pattern(x: IR.Pattern) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.PatternTag.HAS_TYPE: {
        this.encode_meta_id(x.meta);
        this.encode_type(x.type);
        this.encode_pattern(x.pattern);
        break;
      }

      case IR.PatternTag.LITERAL: {
        this.encode_meta_id(x.meta);
        this.encode_literal(x.literal);
        break;
      }

      case IR.PatternTag.GLOBAL: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.PatternTag.SELF: {
        this.encode_meta_id(x.meta);
        break;
      }

      case IR.PatternTag.VARIABLE: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.PatternTag.WILDCARD: {
        this.encode_meta_id(x.meta);
        break;
      }

      default:
        throw unreachable(x, `Pattern`);
    }
  }

  encode_literal(x: IR.Literal) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.LiteralTag.NOTHING: {
        break;
      }

      case IR.LiteralTag.TRUE: {
        break;
      }

      case IR.LiteralTag.FALSE: {
        break;
      }

      case IR.LiteralTag.INTEGER: {
        this.bigint(x.value);
        break;
      }

      case IR.LiteralTag.FLOAT_64: {
        this.double(x.value);
        break;
      }

      case IR.LiteralTag.TEXT: {
        this.string(x.value);
        break;
      }

      default:
        throw unreachable(x, `Literal`);
    }
  }

  encode_type(x: IR.Type) {
    this.encode_enum_tag(x.tag);
    switch (x.tag) {
      case IR.TypeTag.ANY: {
        break;
      }

      case IR.TypeTag.UNKNOWN: {
        break;
      }

      case IR.TypeTag.GLOBAL: {
        this.encode_meta_id(x.meta);
        this.string(x.namespace);
        this.string(x.name);
        break;
      }

      case IR.TypeTag.LOCAL: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      case IR.TypeTag.LOCAL_STATIC: {
        this.encode_meta_id(x.meta);
        this.string(x.name);
        break;
      }

      default:
        throw unreachable(x, `Type`);
    }
  }

  encode_meta_id(x: number) {
    this.uint32(x);
  }

  encode_enum_tag(x: number) {
    this.uint8(x);
  }
}

export function encode_program(program: IR.Program, writer: Writer) {
  const encoder = new CrochetIREncoder(writer);
  encoder.encode_program(program);
  return writer;
}
