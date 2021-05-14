import * as IR from "../ir";
//import { logger } from "../utils/logger";
const logger = {
  debug(...x: string[]) {},
};
import { unreachable } from "../utils/utils";
import { BinaryReader } from "./binary";
import { MAGIC, VERSION, Section } from "./encode";

type enum_values<T> = T extends { [key: string]: infer U } ? U : never;
type not<T, U> = T extends U ? never : T;

class CrochetIRDecoder extends BinaryReader {
  constructor(source: Buffer) {
    super(source);
  }

  get_header(): { hash: Buffer; version: number } {
    this.text(MAGIC);
    const version = this.uint16();
    const hash = this.bytes();
    return { hash, version };
  }

  assert_version(x: { version: number }) {
    this.expect(VERSION, x.version, "version");
  }

  expect<A>(expected: A, got: A, tag: string) {
    if (got === expected) {
      return got;
    } else {
      throw new Error(
        `Unexpected ${tag}. Got ${got}, but expected ${expected}`
      );
    }
  }

  decode_program(): IR.Program {
    const header = this.get_header();
    this.assert_version(header);

    const filename = this.string();
    const declarations = this.decode_declarations();
    const meta_table = this.decode_meta_table();
    return new IR.Program(
      filename,
      meta_table.source,
      meta_table.table,
      declarations
    );
  }

  decode_declarations() {
    this.expect(
      Section.DECLARATION,
      this.decode_enum_tag(Section, "section"),
      "Declaration section"
    );

    return this.array((_) => this.decode_declaration());
  }

  decode_declaration() {
    const t = IR.DeclarationTag;
    const tag = this.decode_enum_tag(t, "declaration");
    switch (tag) {
      case t.COMMAND: {
        return new IR.DCommand(
          this.decode_meta_id(),
          this.string(),
          this.string(),
          this.array((_) => this.string()),
          this.array((_) => this.decode_type()),
          this.decode_basic_block()
        );
      }

      case t.TYPE:
        return new IR.DType(
          this.decode_meta_id(),
          this.string(),
          this.decode_enum_tag(IR.Visibility, "visibility"),
          this.string(),
          this.decode_type(),
          this.array((_) => this.string()),
          this.array((_) => this.decode_type())
        );

      case t.SEAL:
        return new IR.DSeal(this.decode_meta_id(), this.string());

      case t.TEST:
        return new IR.DTest(
          this.decode_meta_id(),
          this.string(),
          this.decode_basic_block()
        );

      case t.DEFINE:
        return new IR.DDefine(
          this.decode_meta_id(),
          this.string(),
          this.decode_enum_tag(IR.Visibility, "Visibility"),
          this.string(),
          this.decode_basic_block()
        );

      case t.OPEN:
        return new IR.DOpen(this.decode_meta_id(), this.string());

      case t.PRELUDE:
        return new IR.DPrelude(
          this.decode_meta_id(),
          this.decode_basic_block()
        );

      case t.RELATION:
        return new IR.DRelation(
          this.decode_meta_id(),
          this.string(),
          this.string(),
          this.array(
            (_) =>
              new IR.RelationType(
                this.decode_meta_id(),
                this.decode_enum_tag(IR.RelationMultiplicity, "multiplicity")
              )
          )
        );

      case t.ACTION:
        return new IR.DAction(
          this.decode_meta_id(),
          this.string(),
          this.maybe(() => this.string()),
          this.string(),
          this.decode_type(),
          this.string(),
          this.decode_basic_block(),
          this.decode_predicate(),
          this.decode_basic_block()
        );

      case t.WHEN:
        return new IR.DWhen(
          this.decode_meta_id(),
          this.string(),
          this.maybe(() => this.string()),
          this.decode_predicate(),
          this.decode_basic_block()
        );

      case t.CONTEXT:
        return new IR.DContext(
          this.decode_meta_id(),
          this.string(),
          this.string()
        );

      case t.FOREIGN_TYPE:
        return new IR.DForeignType(
          this.decode_meta_id(),
          this.string(),
          this.decode_enum_tag(IR.Visibility, "visibility"),
          this.string(),
          this.string()
        );

      case t.EFFECT: {
        return new IR.DEffect(
          this.decode_meta_id(),
          this.string(),
          this.string(),
          this.array(
            (_) =>
              new IR.EffectCase(
                this.decode_meta_id(),
                this.string(),
                this.string(),
                this.array((_) => this.string()),
                this.array((_) => this.decode_type())
              )
          )
        );
      }

      default:
        throw unreachable(tag, "Declaration");
    }
  }

  decode_handler_case() {
    return new IR.HandlerCase(
      this.decode_meta_id(),
      this.string(),
      this.string(),
      this.array((_) => this.string()),
      this.decode_basic_block()
    );
  }

  decode_type() {
    const tag = this.decode_enum_tag(IR.TypeTag, "type");
    switch (tag) {
      case IR.TypeTag.ANY: {
        return new IR.AnyType();
      }

      case IR.TypeTag.UNKNOWN: {
        return new IR.UnknownType();
      }

      case IR.TypeTag.GLOBAL: {
        return new IR.GlobalType(
          this.decode_meta_id(),
          this.string(),
          this.string()
        );
      }

      case IR.TypeTag.LOCAL: {
        return new IR.LocalType(this.decode_meta_id(), this.string());
      }

      case IR.TypeTag.LOCAL_STATIC: {
        return new IR.StaticType(this.decode_meta_id(), this.string());
      }

      default:
        throw unreachable(tag, "Type");
    }
  }

  decode_basic_block() {
    return new IR.BasicBlock(this.array((_) => this.decode_op()));
  }

  decode_op(): IR.Op {
    const t = IR.OpTag;
    const tag = this.decode_enum_tag(IR.OpTag, "operation");
    switch (tag) {
      case t.DROP: {
        return new IR.Drop(this.decode_meta_id());
      }

      case t.LET:
        return new IR.Let(this.decode_meta_id(), this.string());

      case t.PUSH_VARIABLE:
        return new IR.PushVariable(this.decode_meta_id(), this.string());

      case t.PUSH_SELF:
        return new IR.PushSelf(this.decode_meta_id());

      case t.PUSH_GLOBAL:
        return new IR.PushGlobal(this.decode_meta_id(), this.string());

      case t.PUSH_LITERAL:
        return new IR.PushLiteral(this.decode_literal());

      case t.PUSH_RETURN:
        return new IR.PushReturn(this.decode_meta_id());

      case t.PUSH_TUPLE:
        return new IR.PushTuple(this.decode_meta_id(), this.uint32());

      case t.PUSH_NEW:
        return new IR.PushNew(
          this.decode_meta_id(),
          this.decode_type(),
          this.uint32()
        );

      case t.PUSH_STATIC_TYPE:
        return new IR.PushStaticType(
          this.decode_meta_id(),
          this.decode_type() as IR.StaticType
        );

      case t.PUSH_RECORD:
        return new IR.PushRecord(
          this.decode_meta_id(),
          this.array((_) => this.string())
        );

      case t.RECORD_AT_PUT:
        return new IR.RecordAtPut(this.decode_meta_id());

      case t.PROJECT:
        return new IR.Project(this.decode_meta_id());

      case t.PROJECT_STATIC:
        return new IR.ProjectStatic(this.decode_meta_id(), this.string());

      case t.PUSH_LAZY:
        return new IR.PushLazy(
          this.decode_meta_id(),
          this.decode_basic_block()
        );

      case t.FORCE:
        return new IR.Force(this.decode_meta_id());

      case t.INTERPOLATE:
        return new IR.Interpolate(
          this.decode_meta_id(),
          this.array((_) => this.maybe(() => this.string()))
        );

      case t.PUSH_LAMBDA:
        return new IR.PushLambda(
          this.decode_meta_id(),
          this.array((_) => this.string()),
          this.decode_basic_block()
        );

      case t.INVOKE_FOREIGN:
        return new IR.InvokeForeign(
          this.decode_meta_id(),
          this.string(),
          this.uint32()
        );

      case t.INVOKE:
        return new IR.Invoke(
          this.decode_meta_id(),
          this.string(),
          this.uint32()
        );

      case t.APPLY:
        return new IR.Apply(this.decode_meta_id(), this.uint32());

      case t.RETURN:
        return new IR.Return(this.decode_meta_id());

      case t.PUSH_PARTIAL:
        return new IR.PushPartial(
          this.decode_meta_id(),
          this.string(),
          this.uint32()
        );

      case t.ASSERT:
        return new IR.Assert(
          this.decode_meta_id(),
          this.decode_enum_tag(IR.AssertType, "assertion type"),
          this.string(),
          this.string(),
          this.maybe(() => [this.string(), this.array(() => this.string())])
        );

      case t.BRANCH:
        return new IR.Branch(
          this.decode_meta_id(),
          this.decode_basic_block(),
          this.decode_basic_block()
        );

      case t.TYPE_TEST:
        return new IR.TypeTest(this.decode_meta_id(), this.decode_type());

      case t.INTRINSIC_EQUAL:
        return new IR.IntrinsicEqual(this.decode_meta_id());

      case t.REGISTER_INSTANCE:
        return new IR.RegisterInstance(this.decode_meta_id());

      case t.SEARCH:
        return new IR.Search(this.decode_meta_id(), this.decode_predicate());

      case t.MATCH_SEARCH:
        return new IR.MatchSearch(
          this.decode_meta_id(),
          this.decode_basic_block(),
          this.decode_basic_block()
        );

      case t.FACT:
        return new IR.Fact(this.decode_meta_id(), this.string(), this.uint32());

      case t.FORGET:
        return new IR.Forget(
          this.decode_meta_id(),
          this.string(),
          this.uint32()
        );

      case t.SIMULATE:
        return new IR.Simulate(
          this.decode_meta_id(),
          this.maybe(() => this.string()),
          this.decode_simulation_goal(),
          this.array(
            (_) =>
              new IR.SimulationSignal(
                this.decode_meta_id(),
                this.array((_) => this.string()),
                this.string(),
                this.decode_basic_block()
              )
          )
        );

      case t.HANDLE: {
        return new IR.Handle(
          this.decode_meta_id(),
          this.decode_basic_block(),
          this.array((_) => this.decode_handler_case())
        );
      }

      case t.PERFORM: {
        return new IR.Perform(
          this.decode_meta_id(),
          this.string(),
          this.string(),
          this.uint32()
        );
      }

      case t.CONTINUE_WITH: {
        return new IR.ContinueWith(this.decode_meta_id());
      }

      case t.DSL: {
        return new IR.Dsl(
          this.decode_meta_id(),
          this.decode_type(),
          this.array((_) => this.decode_dsl_node())
        );
      }

      default:
        throw unreachable(tag, "Operation");
    }
  }

  decode_dsl_node(): IR.DslNode {
    const tag = this.decode_enum_tag(IR.DslNodeTag, "DSL Node");
    switch (tag) {
      case IR.DslNodeTag.NODE: {
        return new IR.DslAstNode(
          this.decode_dsl_meta(),
          this.string(),
          this.array((_) => this.decode_dsl_node()),
          this.map((_) => [this.string(), this.decode_dsl_node()])
        );
      }

      case IR.DslNodeTag.LITERAL: {
        return new IR.DslAstLiteral(
          this.decode_dsl_meta(),
          this.decode_literal()
        );
      }

      case IR.DslNodeTag.VARIABLE: {
        return new IR.DslAstVariable(this.decode_dsl_meta(), this.string());
      }

      case IR.DslNodeTag.EXPRESSION: {
        return new IR.DslAstExpression(
          this.decode_dsl_meta(),
          this.string(),
          this.decode_basic_block()
        );
      }

      case IR.DslNodeTag.LIST: {
        return new IR.DslAstNodeList(
          this.decode_dsl_meta(),
          this.array((_) => this.decode_dsl_node())
        );
      }

      default:
        throw unreachable(tag, `DSL Node`);
    }
  }

  decode_dsl_meta(): IR.DslMeta {
    const line = this.uint32();
    const column = this.uint32();

    return { line, column };
  }

  decode_simulation_goal() {
    const t = IR.SimulationGoalTag;
    const tag = this.decode_enum_tag(t, "simulation goal");
    switch (tag) {
      case t.ACTION_QUIESCENCE:
        return new IR.SGActionQuiescence(this.decode_meta_id());

      case t.EVENT_QUIESCENCE:
        return new IR.SGEventQuiescence(this.decode_meta_id());

      case t.TOTAL_QUIESCENCE:
        return new IR.SGTotalQuiescence(this.decode_meta_id());

      case t.PREDICATE:
        return new IR.SGPredicate(
          this.decode_meta_id(),
          this.decode_predicate()
        );

      default:
        throw unreachable(tag, "Simulation goal");
    }
  }

  decode_predicate(): IR.Predicate {
    const t = IR.PredicateTag;
    const tag = this.decode_enum_tag(IR.PredicateTag, "predicate");
    switch (tag) {
      case t.AND:
        return new IR.PAnd(
          this.decode_meta_id(),
          this.decode_predicate(),
          this.decode_predicate()
        );

      case t.OR:
        return new IR.POr(
          this.decode_meta_id(),
          this.decode_predicate(),
          this.decode_predicate()
        );

      case t.NOT:
        return new IR.PNot(this.decode_meta_id(), this.decode_predicate());

      case t.RELATION:
        return new IR.PRelation(
          this.decode_meta_id(),
          this.string(),
          this.array((_) => this.decode_pattern())
        );

      case t.SAMPLE_RELATION:
        return new IR.PSampleRelation(
          this.decode_meta_id(),
          this.uint32(),
          this.string(),
          this.array((_) => this.decode_pattern())
        );

      case t.SAMPLE_TYPE:
        return new IR.PSampleType(
          this.decode_meta_id(),
          this.uint32(),
          this.string(),
          this.decode_type()
        );

      case t.CONSTRAIN:
        return new IR.PConstrained(
          this.decode_meta_id(),
          this.decode_predicate(),
          this.decode_basic_block()
        );

      case t.LET:
        return new IR.PLet(
          this.decode_meta_id(),
          this.string(),
          this.decode_basic_block()
        );

      case t.TYPE:
        return new IR.PType(
          this.decode_meta_id(),
          this.string(),
          this.decode_type()
        );

      case t.ALWAYS:
        return new IR.PAlways(this.decode_meta_id());

      default:
        throw unreachable(tag, "Predicate");
    }
  }

  decode_pattern(): IR.Pattern {
    const t = IR.PatternTag;
    const tag = this.decode_enum_tag(IR.PatternTag, "pattern");
    switch (tag) {
      case t.HAS_TYPE:
        return new IR.TypePattern(
          this.decode_meta_id(),
          this.decode_type(),
          this.decode_pattern()
        );

      case t.LITERAL:
        return new IR.LiteralPattern(
          this.decode_meta_id(),
          this.decode_literal()
        );

      case t.GLOBAL:
        return new IR.GlobalPattern(this.decode_meta_id(), this.string());

      case t.SELF:
        return new IR.SelfPattern(this.decode_meta_id());

      case t.VARIABLE:
        return new IR.VariablePattern(this.decode_meta_id(), this.string());

      case t.WILDCARD:
        return new IR.WildcardPattern(this.decode_meta_id());

      default:
        throw unreachable(tag, "Pattern");
    }
  }

  decode_literal() {
    const t = IR.LiteralTag;
    const tag = this.decode_enum_tag(IR.LiteralTag, "literal");
    switch (tag) {
      case t.NOTHING:
        return new IR.LiteralNothing();
      case t.TRUE:
        return new IR.LiteralTrue();
      case t.FALSE:
        return new IR.LiteralFalse();
      case t.INTEGER:
        return new IR.LiteralInteger(this.bigint());
      case t.FLOAT_64:
        return new IR.LiteralFloat64(this.double());
      case t.TEXT:
        return new IR.LiteralText(this.string());

      default:
        throw unreachable(tag, "Literal");
    }
  }

  decode_meta_table() {
    this.expect(
      Section.SOURCE_INFO,
      this.decode_enum_tag(Section, "section"),
      "section"
    );
    const source = this.string();
    const table = this.map((_) => {
      const key = this.uint32();
      const start = this.uint32();
      const end = this.uint32();
      return [key, new IR.Interval({ start, end })];
    });

    return { source, table };
  }

  decode_meta_id() {
    return this.uint32();
  }

  decode_enum_tag<T extends { [key: string]: number | string }>(
    tags: T,
    name: string
  ): not<enum_values<T>, string> {
    const tag = this.uint8();
    if (tags[tag] == null) {
      throw new Error(`Invalid ${name} tag ${tag} at position ${this.offset}`);
    }

    logger.debug(`Read ${name} tag ${tag} (${tags[tag]})`);

    return tag as any;
  }
}

export function decode_header(buffer: Buffer) {
  return new CrochetIRDecoder(buffer).get_header();
}

export function decode_program(buffer: Buffer) {
  return new CrochetIRDecoder(buffer).decode_program();
}
