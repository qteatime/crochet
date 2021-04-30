import * as Ast from "../generated/crochet-grammar";
import * as IR from "../ir";
import { cast } from "../utils/utils";
import {
  resolve_escape,
  parseNumber,
  parseInteger,
  parseString,
  signatureName,
  signatureValues,
  materialiseSignature,
  compileNamespace,
} from "./compiler";

type uint32 = number;
type range_key = string & { __range_key__: 0 };

const NO_INFO = 0;
const NO_METADATA = new Ast.Metadata([]);

class Context {
  private id2meta = new Map<uint32, IR.Interval>();
  private range2id = new Map<range_key, uint32>();
  private next_id = 1;

  constructor(readonly filename: string, readonly source: string) {}

  register(meta: Ast.Meta) {
    const key = this.make_range_key(meta);
    const id = this.range2id.get(key);
    if (id != null) {
      return id;
    } else {
      const interval = this.meta_to_interval(meta);
      const id = this.next_id;
      this.next_id += 1;
      this.id2meta.set(id, interval);
      this.range2id.set(key, id);
      return id;
    }
  }

  meta_to_interval(meta: Ast.Meta): IR.Interval {
    return new IR.Interval(meta.range);
  }

  make_range_key(meta: Ast.Meta): range_key {
    return `${meta.range.start}:${meta.range.end}` as range_key;
  }

  generate_meta_table() {
    return this.id2meta;
  }
}

// Interpolation pass
type InterpolationPart = IPEscape | IPStatic | IPDynamic;

abstract class InterpolationPartBase {
  merge(that: InterpolationPart): InterpolationPart | null {
    return null;
  }
  apply_indent(re: RegExp): InterpolationPart {
    return this as any;
  }
  trim_start(): InterpolationPart {
    return this as any;
  }
  trim_end(): InterpolationPart {
    return this as any;
  }
  resolve_escapes(): InterpolationPart {
    return this as any;
  }
  compile(): IR.Op[] {
    return [];
  }
  abstract static_compile(): string | null;
}

class IPStatic extends InterpolationPartBase {
  constructor(readonly value: string) {
    super();
  }
  merge(that: InterpolationPart) {
    if (that instanceof IPStatic) {
      return new IPStatic(this.value + that.value);
    } else {
      return null;
    }
  }

  apply_indent(re: RegExp) {
    return new IPStatic(this.value.replace(re, (_, nl) => nl));
  }

  trim_start() {
    return new IPStatic(
      this.value.replace(/^[ \t]*(\r\n|\r|\n)/g, (_, nl) => nl)
    );
  }

  trim_end() {
    return new IPStatic(
      this.value.replace(/(\r\n|\r|\n)[\t]*$/g, (_, nl) => nl)
    );
  }

  static_compile() {
    return this.value;
  }
}

class IPEscape extends InterpolationPartBase {
  constructor(readonly code: string) {
    super();
  }
  resolve_escapes() {
    return new IPStatic(resolve_escape(this.code));
  }

  static_compile(): null {
    throw new Error(`internal: Unresolved escape code in interpolation`);
  }
}

class IPDynamic extends InterpolationPartBase {
  constructor(readonly body: IR.Op[]) {
    super();
  }
  compile() {
    return this.body;
  }
  static_compile() {
    return null;
  }
}

function get_pos(x: Ast.Expression | Ast.TypeApp | Ast.Literal): Ast.Meta {
  if (x instanceof Ast.$$Expression$_Lit) {
    return get_pos(x.value);
  } else {
    return (x as any).pos;
  }
}

function is_saturated(args: Ast.Expression[]) {
  return args.every((x) => x.tag !== "Hole");
}

function non_holes(args: Ast.Expression[]) {
  return args.filter((x) => x.tag !== "Hole");
}

function saturated_bits(args: Ast.Expression[]) {
  return args.map((x) => x.tag !== "Hole");
}

export class LowerToIR {
  constructor(readonly context: Context) {}

  documentation(x: Ast.Metadata) {
    return x.doc.join("\n");
  }

  type_def(x: Ast.TypeDef) {}

  type_parent(x: Ast.TypeApp | null) {
    return x == null ? new IR.AnyType() : this.type(x);
  }

  type(x: Ast.TypeApp) {
    return x.match<IR.Type>({
      Any: (_) => new IR.AnyType(),
      Named: (pos, name) => {
        const id = this.context.register(pos);
        return new IR.LocalType(id, name.name);
      },
      Static: (pos, t) => {
        const id = this.context.register(pos);
        return t.match({
          Any: () => {
            throw new Error(`internal: invalid #any`);
          },
          Named: (_, n) => new IR.StaticType(id, n.name),
          Static: (_1, _2) => {
            throw new Error(`internal: invalid ##type`);
          },
        });
      },
    });
  }

  parameter(x: Ast.Parameter) {
    return x.match({
      Typed: (_, name, type) => {
        return {
          type: this.type(type),
          parameter: name.name,
        };
      },
      TypedOnly: (_, type) => {
        return {
          type: this.type(type),
          parameter: "_",
        };
      },
      Untyped: (_, name) => {
        return {
          type: new IR.AnyType(),
          parameter: name.name,
        };
      },
    });
  }

  parameters(xs0: Ast.Parameter[]) {
    const xs = xs0.map((x) => this.parameter(x));
    return {
      types: xs.map((x) => x.type),
      parameters: xs.map((x) => x.parameter),
    };
  }

  interpolation_part(x: Ast.InterpolationPart<Ast.Expression>) {
    return x.match<InterpolationPart>({
      Escape: (_, code) => {
        return new IPEscape(code);
      },
      Static: (_, text) => {
        return new IPStatic(text);
      },
      Dynamic: (_, expr) => {
        return new IPDynamic(this.expression(expr));
      },
    });
  }

  interpolation_parts(
    pos: Ast.Meta,
    xs: Ast.InterpolationPart<Ast.Expression>[]
  ) {
    const optimise_parts = (xs: InterpolationPart[]) => {
      if (xs.length === 0) {
        return [];
      } else {
        const [hd, ...tl] = xs;
        const result = tl.reduce(
          (prev, b) => {
            const merged = prev.now.merge(b);
            if (merged != null) {
              return { now: merged, list: prev.list };
            } else {
              prev.list.push(prev.now);
              return { now: b, list: prev.list };
            }
          },
          { now: hd, list: [] as InterpolationPart[] }
        );
        const list = result.list;
        list.push(result.now);
        return list;
      }
    };

    const column = pos.position.column;
    const indent = new RegExp(`(\r\n|\r|\n)[ \t]{0,${column}}`, "g");

    const parts0 = xs.map((x) => this.interpolation_part(x));
    const parts1 = optimise_parts(parts0);
    const parts2 = parts1.map((x) => x.apply_indent(indent));
    if (parts2.length > 0) {
      parts2[0] = parts2[0].trim_start();
      parts2[parts2.length - 1] = parts2[parts2.length - 1].trim_end();
    }
    const parts3 = parts2.map((x) => x.resolve_escapes());
    return optimise_parts(parts3);
  }

  literal(x: Ast.Literal): IR.Literal {
    return x.match<IR.Literal>({
      False: (_) => new IR.LiteralFalse(),
      True: (_) => new IR.LiteralTrue(),
      Float: (_, digits) => new IR.LiteralFloat64(parseNumber(digits)),
      Integer: (_, digits) => new IR.LiteralInteger(parseInteger(digits)),
      Text: (_, x) => new IR.LiteralText(parseString(x)),
      Nothing: (_) => new IR.LiteralNothing(),
    });
  }

  pattern(x: Ast.Pattern): IR.Pattern {
    return x.match<IR.Pattern>({
      Global: (pos, name) => {
        const id = this.context.register(pos);
        return new IR.GlobalPattern(id, name.name);
      },

      HasType: (pos, type, pattern) => {
        const id = this.context.register(pos);
        return new IR.TypePattern(id, this.type(type), this.pattern(pattern));
      },

      Lit: (lit) => {
        return new IR.LiteralPattern(NO_INFO, this.literal(lit));
      },

      Self: (pos) => {
        const id = this.context.register(pos);
        return new IR.SelfPattern(id);
      },

      Variable: (pos, name) => {
        const id = this.context.register(pos);
        return new IR.VariablePattern(id, name.name);
      },

      Wildcard: (pos) => {
        const id = this.context.register(pos);
        return new IR.WildcardPattern(id);
      },
    });
  }

  predicate(x: Ast.Predicate): IR.Predicate {
    return x.match<IR.Predicate>({
      Always: (pos) => {
        const id = this.context.register(pos);
        return new IR.PAlways(id);
      },

      And: (pos, left, right) => {
        const id = this.context.register(pos);
        return new IR.PAnd(id, this.predicate(left), this.predicate(right));
      },

      Constrain: (pos, pred, constraint) => {
        const id = this.context.register(pos);
        return new IR.PConstrained(
          id,
          this.predicate(pred),
          new IR.BasicBlock(this.expression(constraint))
        );
      },

      Has: (pos, sig) => {
        const id = this.context.register(pos);
        const patterns = signatureValues(sig);

        return new IR.PRelation(
          id,
          signatureName(sig),
          patterns.map((x) => this.pattern(x))
        );
      },

      Let: (pos, name, value) => {
        const id = this.context.register(pos);
        return new IR.PLet(
          id,
          name.name,
          new IR.BasicBlock(this.expression(value))
        );
      },

      Not: (pos, pred) => {
        const id = this.context.register(pos);
        return new IR.PNot(id, this.predicate(pred));
      },

      Or: (pos, left, right) => {
        const id = this.context.register(pos);
        return new IR.POr(id, this.predicate(left), this.predicate(right));
      },

      Parens: (_, pred) => {
        return this.predicate(pred);
      },

      Sample: (pos, size0, pool) => {
        const id = this.context.register(pos);
        const size1 = cast(this.literal(size0), IR.LiteralInteger);
        const size = Number(size1.value);

        return pool.match<IR.Predicate>({
          Relation: (_, sig) => {
            const patterns = signatureValues(sig);
            return new IR.PSampleRelation(
              id,
              size,
              signatureName(sig),
              patterns.map((x) => this.pattern(x))
            );
          },

          Type: (_, name, type) => {
            return new IR.PSampleType(id, size, name.name, this.type(type));
          },
        });
      },

      Typed: (pos, name, type) => {
        const id = this.context.register(pos);
        return new IR.PType(id, name.name, this.type(type));
      },
    });
  }

  relation_type(x: Ast.RelationPart): IR.RelationType {
    return x.match<IR.RelationType>({
      One: (pos, _) => {
        const id = this.context.register(pos);
        return new IR.RelationType(id, IR.RelationMultiplicity.ONE);
      },

      Many: (pos, _) => {
        const id = this.context.register(pos);
        return new IR.RelationType(id, IR.RelationMultiplicity.MANY);
      },
    });
  }

  relation_types(xs: Ast.RelationPart[]): IR.RelationType[] {
    return xs.map((x) => this.relation_type(x));
  }

  rank_function(x: Ast.Rank) {
    return x.match({
      Expr: (expr) => {
        return new IR.BasicBlock(this.expression(expr));
      },

      Unranked: (_) => {
        return new IR.BasicBlock([
          new IR.PushLiteral(new IR.LiteralInteger(1n)),
          new IR.Return(NO_INFO),
        ]);
      },
    });
  }

  simulation_context(x: Ast.SimulationContext) {
    return x.match({
      Global: () => null,
      Named: (_, name) => name.name,
    });
  }

  simulation_goal(x: Ast.SimulationGoal): IR.SimulationGoal {
    return x.match<IR.SimulationGoal>({
      ActionQuiescence: (pos) => {
        const id = this.context.register(pos);
        return new IR.SGActionQuiescence(id);
      },

      EventQuiescence: (pos) => {
        const id = this.context.register(pos);
        return new IR.SGEventQuiescence(id);
      },

      TotalQuiescence: (pos) => {
        const id = this.context.register(pos);
        return new IR.SGTotalQuiescence(id);
      },

      CustomGoal: (pos, pred) => {
        const id = this.context.register(pos);
        return new IR.SGPredicate(id, this.predicate(pred));
      },
    });
  }

  simulation_signal(x: Ast.Signal) {
    const id = this.context.register(x.pos);
    const { parameters } = this.parameters(signatureValues(x.signature));

    return new IR.SimulationSignal(
      id,
      parameters,
      signatureName(x.signature),
      this.statements(x.body)
    );
  }

  simulation_title(
    pos: Ast.Meta,
    type: IR.Type,
    name: string,
    title0: Ast.Expression | null
  ) {
    const id = this.context.register(pos);
    const title =
      title0 == null
        ? [new IR.PushLiteral(new IR.LiteralText(name))]
        : this.expression(title0);
    return [
      new IR.DCommand(
        id,
        "",
        "_ title",
        ["_"],
        [type],
        new IR.BasicBlock([...title, new IR.Return(id)])
      ),
    ];
  }

  record_field(x: Ast.RecordField) {
    return x.match<
      { static: true; name: string } | { static: false; expr: IR.Op[] }
    >({
      FName: (n) => ({
        static: true,
        name: n.name,
      }),

      FText: (n) => ({
        static: true,
        name: parseString(n),
      }),

      FComputed: (x) => ({
        static: false,
        expr: this.expression(x),
      }),
    });
  }

  record_pairs(xs0: Ast.Pair<Ast.RecordField, Ast.Expression>[]) {
    const xs1 = xs0.map((x) => {
      return {
        pos: x.pos,
        key: this.record_field(x.key),
        value: this.expression(x.value),
      };
    });

    const xs_static = xs1
      .filter((x) => x.key.static)
      .map((x) => ({
        key: (x.key as { static: true; name: string }).name,
        value: x.value,
      }));

    const xs_dynamic = xs1
      .filter((x) => !x.key.static)
      .map((x) => ({
        pos: this.context.register(x.pos),
        expr: (x.key as { static: false; expr: IR.Op[] }).expr,
        value: x.value,
      }));

    return { pairs: xs_static, dynamic_pairs: xs_dynamic };
  }

  comprehension(x: Ast.ForExpression): IR.Op[] {
    return x.match<IR.Op[]>({
      Map: (pos, name, stream, body) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(stream),
          new IR.PushLambda(
            id,
            [name.name],
            new IR.BasicBlock([...this.comprehension(body)])
          ),
          new IR.Invoke(id, "_ flat-map: _", 2),
        ];
      },

      If: (pos, condition, body) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(condition),
          new IR.Branch(
            id,
            new IR.BasicBlock(this.comprehension(body)),
            new IR.BasicBlock([new IR.PushTuple(id, 0)])
          ),
        ];
      },

      Do: (pos, body) => {
        const id = this.context.register(pos);

        return [...this.expression(body), new IR.PushTuple(id, 1)];
      },
    });
  }

  expression(x: Ast.Expression): IR.Op[] {
    return x.match<IR.Op[]>({
      Variable: (pos, name) => {
        const id = this.context.register(pos);
        return [new IR.PushVariable(id, name.name)];
      },

      Self: (pos) => {
        const id = this.context.register(pos);
        return [new IR.PushSelf(id)];
      },

      Global: (pos, name) => {
        const id = this.context.register(pos);
        return [new IR.PushGlobal(id, name.name)];
      },

      Lit: (lit) => {
        return [new IR.PushLiteral(this.literal(lit))];
      },

      Return: (pos) => {
        const id = this.context.register(pos);
        return [new IR.PushReturn(id)];
      },

      List: (pos, values) => {
        const id = this.context.register(pos);
        return [
          ...values.flatMap((x) => this.expression(x)),
          new IR.PushTuple(id, values.length),
        ];
      },

      New: (pos, type0, values) => {
        const id = this.context.register(pos);
        const type_id = this.context.register(type0.pos);
        const type = new IR.LocalType(type_id, type0.name);
        return [
          ...values.flatMap((x) => this.expression(x)),
          new IR.PushNew(id, type, values.length),
        ];
      },

      Type: (pos, type0) => {
        const id = this.context.register(pos);
        const type = this.type(type0) as IR.AnyStaticType;
        return [new IR.PushStaticType(id, type)];
      },

      Record: (pos, pairs0) => {
        const id = this.context.register(pos);
        const { pairs, dynamic_pairs } = this.record_pairs(pairs0);

        return [
          ...pairs.map((x) => x.value).flat(1),
          new IR.PushRecord(
            id,
            pairs.map((x) => x.key)
          ),
          ...dynamic_pairs.flatMap((x) => {
            return [...x.expr, ...x.value, new IR.RecordAtPut(x.pos)];
          }),
        ];
      },

      Project: (pos, object0, field0) => {
        const id = this.context.register(pos);
        const field = this.record_field(field0);

        if (field.static) {
          return [
            ...this.expression(object0),
            new IR.ProjectStatic(id, field.name),
          ];
        } else {
          return [
            ...field.expr,
            ...this.expression(object0),
            new IR.Project(id),
          ];
        }
      },

      Interpolate: (_, value) => {
        const id = this.context.register(value.pos);
        const parts = this.interpolation_parts(value.pos, value.parts);
        return [
          ...parts.flatMap((x) => x.compile()),
          new IR.Interpolate(
            id,
            parts.map((x) => x.static_compile())
          ),
        ];
      },

      Lazy: (pos, value) => {
        const id = this.context.register(pos);
        return [new IR.PushLazy(id, new IR.BasicBlock(this.expression(value)))];
      },

      Force: (pos, value) => {
        const id = this.context.register(pos);
        return [...this.expression(value), new IR.Force(id)];
      },

      Lambda: (pos, params, body) => {
        const id = this.context.register(pos);
        return [
          new IR.PushLambda(
            id,
            params.map((x) => x.name),
            new IR.BasicBlock(this.expression(body))
          ),
        ];
      },

      Invoke: (pos, sig) => {
        const id = this.context.register(pos);
        const args = signatureValues(sig);
        const name = signatureName(sig);

        if (is_saturated(args)) {
          return [
            ...args.flatMap((x) => this.expression(x)),
            new IR.Invoke(id, name, args.length),
          ];
        } else {
          return [
            ...non_holes(args).flatMap((x) => this.expression(x)),
            new IR.PushPartial(id, name),
            new IR.ApplyPartial(id, saturated_bits(args)),
          ];
        }
      },

      Apply: (pos, fn, args) => {
        const id = this.context.register(pos);

        if (is_saturated(args)) {
          return [
            ...args.flatMap((x) => this.expression(x)),
            ...this.expression(fn),
            new IR.Apply(id, args.length),
          ];
        } else {
          return [
            ...non_holes(args).flatMap((x) => this.expression(x)),
            new IR.ApplyPartial(id, saturated_bits(args)),
          ];
        }
      },

      Block: (_, body) => {
        return body.flatMap((x) => this.statement(x));
      },

      HasType: (pos, value, type) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(value),
          new IR.TypeTest(id, this.type(type)),
        ];
      },

      Hole: (_) => {
        throw new Error(
          `internal: Hole found outside of function application.`
        );
      },

      IntrinsicEqual: (pos, left, right) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(left),
          ...this.expression(right),
          new IR.IntrinsicEqual(id),
        ];
      },

      Parens: (_, value) => {
        return this.expression(value);
      },

      Pipe: (pos, arg, fn) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(arg),
          ...this.expression(fn),
          new IR.Apply(id, 1),
        ];
      },

      PipeInvoke: (pos, arg, sig0) => {
        const sig = materialiseSignature(arg, sig0);
        return this.expression(new Ast.Expression.Invoke(pos, sig));
      },

      Condition: (pos, cases) => {
        const id = this.context.register(pos);

        return cases.reduceRight(
          (previous: IR.Op[], x) => {
            const id = this.context.register(pos);

            return [
              ...this.expression(x.guard),
              new IR.Branch(
                id,
                this.statements(x.body),
                new IR.BasicBlock(previous)
              ),
            ];
          },
          [
            new IR.PushLiteral(new IR.LiteralFalse()),
            new IR.Assert(
              id,
              IR.AssertType.UNREACHABLE,
              "unreachable",
              "None of the conditions were true."
            ),
          ]
        );
      },

      ForeignInvoke: (pos, name, args) => {
        const id = this.context.register(pos);
        return [
          ...args.flatMap((x) => this.expression(x)),
          new IR.InvokeForeign(id, compileNamespace(name), args.length),
        ];
      },

      For: (pos, comprehension) => {
        return this.comprehension(comprehension);
      },

      Search: (pos, predicate) => {
        const id = this.context.register(pos);

        return [new IR.Search(id, this.predicate(predicate))];
      },

      MatchSearch: (pos, cases) => {
        const id = this.context.register(pos);
        return [
          new IR.MatchSearch(
            id,
            cases.map(
              (x) =>
                new IR.MatchSearchCase(
                  this.predicate(x.predicate),
                  this.statements(x.body)
                )
            )
          ),
        ];
      },

      Select: () => {
        throw new Error(`internal: select not supported`);
      },
    });
  }

  statements(xs: Ast.Statement[]) {
    return new IR.BasicBlock(xs.flatMap((x) => this.statement(x)));
  }

  statement(x: Ast.Statement): IR.Op[] {
    return x.match<IR.Op[]>({
      Assert: (pos, expr) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(expr),
          new IR.Assert(
            id,
            IR.AssertType.ASSERT,
            "assert",
            get_pos(expr).source_slice
          ),
        ];
      },

      Expr: (expr) => {
        const id = this.context.register(get_pos(expr));

        return [...this.expression(expr), new IR.Drop(id)];
      },

      Let: (pos, name, value) => {
        const id = this.context.register(pos);

        return [...this.expression(value), new IR.Let(id, name.name)];
      },

      Fact: (pos, sig) => {
        const id = this.context.register(pos);
        const exprs = signatureValues(sig);

        return [
          ...exprs.flatMap((x) => this.expression(x)),
          new IR.Fact(id, signatureName(sig), exprs.length),
        ];
      },

      Forget: (pos, sig) => {
        const id = this.context.register(pos);
        const exprs = signatureValues(sig);

        return [
          ...exprs.flatMap((x) => this.expression(x)),
          new IR.Forget(id, signatureName(sig), exprs.length),
        ];
      },

      Simulate: (pos, actors, context, goal, signals) => {
        const id = this.context.register(pos);

        return [
          ...this.expression(actors),
          new IR.Simulate(
            id,
            this.simulation_context(context),
            this.simulation_goal(goal),
            signals.flatMap((x) => this.simulation_signal(x))
          ),
        ];
      },
    });
  }

  expand_type_initialiser(
    type: Ast.TypeApp,
    name: Ast.Expression,
    x: Ast.TypeInit
  ) {
    return x.match<Ast.Statement | Ast.Declaration>({
      Fact: (pos, sig) => {
        return new Ast.Statement.Fact(pos, materialiseSignature(name, sig));
      },

      Command: (pos, cmeta, sig, contract, body, ttest) => {
        return new Ast.Declaration.Command(
          pos,
          cmeta,
          materialiseSignature(
            new Ast.Parameter.TypedOnly(get_pos(type), type),
            sig
          ),
          contract,
          body,
          ttest
        );
      },
    });
  }

  type_initialiser(
    pos: Ast.Meta,
    name: string,
    init0: Ast.TypeInit[],
    context: string | null
  ) {
    const id = this.context.register(pos);
    const type = new Ast.TypeApp.Named(pos, new Ast.Name(pos, name));
    const self = new Ast.Expression.Global(pos, new Ast.Name(pos, name));
    const init = init0.map((x) => this.expand_type_initialiser(type, self, x));
    const statements = init.filter(
      (x) => x instanceof Ast.Statement
    ) as Ast.Statement[];
    const commands = init.filter(
      (x) => x instanceof Ast.Declaration
    ) as Ast.Declaration[];

    return [
      ...commands.flatMap((x) => this.declaration(x, context)),
      new IR.DPrelude(id, this.statements(statements)),
    ];
  }

  singleton_type(
    pos: Ast.Meta,
    id: uint32,
    cmeta: Ast.Metadata,
    name: string,
    parent: IR.Type,
    init: Ast.TypeInit[],
    context: string | null
  ) {
    const type = new IR.LocalType(id, name);

    return [
      new IR.DType(
        id,
        this.documentation(cmeta),
        IR.Visibility.GLOBAL,
        name,
        parent,
        [],
        []
      ),
      new IR.DDefine(
        id,
        `See type:${name}`,
        name,
        new IR.BasicBlock([new IR.PushNew(id, type, 0)])
      ),
      new IR.DSeal(id, name),
      new IR.DPrelude(
        id,
        new IR.BasicBlock([
          new IR.PushGlobal(id, name),
          new IR.RegisterInstance(id),
        ])
      ),
      ...this.type_initialiser(pos, name, init, context),
    ];
  }

  contract_condition(kind: IR.AssertType, contract: Ast.ContractCondition) {
    const id = this.context.register(contract.pos);

    return [
      ...this.expression(contract.expr),
      new IR.Assert(
        id,
        kind,
        contract.name.name,
        get_pos(contract.expr).source_slice
      ),
    ];
  }

  contract_conditions(kind: IR.AssertType, xs: Ast.ContractCondition[]) {
    return xs.flatMap((x) => this.contract_condition(kind, x));
  }

  contract_return(ret: Ast.TypeApp | null) {
    if (ret == null) {
      return [];
    } else {
      const id = this.context.register(get_pos(ret));
      return [
        new IR.PushReturn(id),
        new IR.TypeTest(id, this.type(ret)),
        new IR.Assert(
          id,
          IR.AssertType.RETURN_TYPE,
          "return-type",
          `return is ${get_pos(ret).source_slice}`
        ),
      ];
    }
  }

  declaration(x: Ast.Declaration, context: string | null): IR.Declaration[] {
    return x.match<IR.Declaration[]>({
      Command: (pos, cmeta, sig, contract, body, test) => {
        const id = this.context.register(pos);
        const name = signatureName(sig);
        const { types, parameters } = this.parameters(signatureValues(sig));

        const result = [
          new IR.DCommand(
            id,
            this.documentation(cmeta),
            name,
            parameters,
            types,
            new IR.BasicBlock([
              ...this.contract_conditions(
                IR.AssertType.PRECONDITION,
                contract.pre
              ),
              ...body.flatMap((x) => this.statement(x)),
              new IR.Return(id),
              ...this.contract_return(contract.ret),
              ...this.contract_conditions(
                IR.AssertType.POSTCONDITION,
                contract.post
              ),
            ])
          ),
        ];

        if (test == null) {
          return result;
        } else {
          const test_id = this.context.register(test.pos);

          return [
            ...result,
            new IR.DTest(test_id, name, this.statements(test.body)),
          ];
        }
      },

      Define: (pos, cmeta, name, value) => {
        const id = this.context.register(pos);

        return [
          new IR.DDefine(
            id,
            this.documentation(cmeta),
            name.name,
            new IR.BasicBlock(this.expression(value))
          ),
        ];
      },

      Test: (pos, title, body) => {
        const id = this.context.register(pos);

        return [new IR.DTest(id, parseString(title), this.statements(body))];
      },

      Open: (pos, name) => {
        const id = this.context.register(pos);

        return [new IR.DOpen(id, compileNamespace(name))];
      },

      AbstractType: (pos, cmeta, type) => {
        const id = this.context.register(pos);

        return [
          new IR.DType(
            id,
            this.documentation(cmeta),
            IR.Visibility.GLOBAL,
            type.name.name,
            this.type_parent(type.parent),
            [],
            []
          ),
          new IR.DSeal(id, type.name.name),
        ];
      },

      Type: (pos, cmeta, type, fields0) => {
        const id = this.context.register(pos);
        const { types, parameters } = this.parameters(fields0);

        return [
          new IR.DType(
            id,
            this.documentation(cmeta),
            IR.Visibility.GLOBAL,
            type.name.name,
            this.type_parent(type.parent),
            parameters,
            types
          ),
        ];
      },

      SingletonType: (pos, cmeta, type, init) => {
        const id = this.context.register(pos);
        return this.singleton_type(
          pos,
          id,
          cmeta,
          type.name.name,
          this.type_parent(type.parent),
          init,
          context
        );
      },

      Do: (pos, body) => {
        const id = this.context.register(pos);
        return [new IR.DPrelude(id, this.statements(body))];
      },

      Local: (_, decl0) => {
        const decls = this.declaration(decl0, context);
        return decls.map((x) => {
          switch (x.tag) {
            case IR.DeclarationTag.TYPE: {
              if (x.visibility === IR.Visibility.GLOBAL) {
                return new IR.DType(
                  x.meta,
                  x.documentation,
                  IR.Visibility.LOCAL,
                  x.name,
                  x.parent,
                  x.fields,
                  x.types
                );
              }
            }

            default:
              return x;
          }
        });
      },

      EnumType: (pos, cmeta, name, variants0) => {
        const id = this.context.register(pos);
        const parent = new IR.LocalType(id, name.name);
        const variants = variants0.flatMap((v, i) => {
          const variant_id = this.context.register(v.pos);

          return [
            ...this.singleton_type(
              v.pos,
              variant_id,
              NO_METADATA,
              v.name,
              parent,
              [],
              context
            ),
            new IR.DCommand(
              variant_id,
              "",
              "_ to-enum-integer",
              ["_"],
              [new IR.LocalType(variant_id, v.name)],
              new IR.BasicBlock([
                new IR.PushLiteral(new IR.LiteralInteger(BigInt(i))),
                new IR.Return(variant_id),
              ])
            ),
          ];
        });

        return [
          new IR.DType(
            id,
            this.documentation(cmeta),
            IR.Visibility.GLOBAL,
            name.name,
            new IR.GlobalType(id, "crochet.core", "enum"),
            [],
            []
          ),
          ...variants,
          new IR.DDefine(
            id,
            `See type:${name.name}`,
            name.name,
            new IR.BasicBlock([
              new IR.PushNew(id, new IR.LocalType(id, name.name), 0),
            ])
          ),
          new IR.DSeal(id, name.name),
          // Generated commands
          new IR.DCommand(
            id,
            "",
            "_ lower-bound",
            ["_"],
            [parent],
            new IR.BasicBlock([
              new IR.PushGlobal(id, variants0[0].name),
              new IR.Return(id),
            ])
          ),
          new IR.DCommand(
            id,
            "",
            "_ upper-bound",
            ["_"],
            [parent],
            new IR.BasicBlock([
              new IR.PushGlobal(id, variants0[1].name),
              new IR.Return(id),
            ])
          ),
          new IR.DCommand(
            id,
            "",
            "_ from-enum-integer: _",
            ["_", "N"],
            [parent],
            new IR.BasicBlock([
              // TODO: generate this
            ])
          ),
        ];
      },

      ForeignType: (pos, cmeta, name, target) => {
        const id = this.context.register(pos);

        return [
          new IR.DForeignType(
            id,
            this.documentation(cmeta),
            IR.Visibility.GLOBAL,
            name.name,
            compileNamespace(target)
          ),
        ];
      },

      Relation: (pos, cmeta, sig) => {
        const id = this.context.register(pos);

        return [
          new IR.DRelation(
            id,
            this.documentation(cmeta),
            signatureName(sig),
            this.relation_types(signatureValues(sig))
          ),
        ];
      },

      Action: (pos, cmeta, self, name, title, pred, rank, body, init) => {
        const id = this.context.register(pos);
        const title_pos = title != null ? get_pos(title) : name.pos;
        const type_name = `action ${name.name}`;
        const type = new IR.LocalType(id, type_name);

        return [
          new IR.DAction(
            id,
            this.documentation(cmeta),
            context,
            name.name,
            this.type(self),
            this.rank_function(rank),
            this.predicate(pred),
            this.statements(body)
          ),
          ...this.simulation_title(title_pos, type, name.name, title),
          ...this.type_initialiser(pos, type_name, init, context),
        ];
      },

      When: (pos, cmeta, pred, body) => {
        const id = this.context.register(pos);

        return [
          new IR.DWhen(
            id,
            this.documentation(cmeta),
            context,
            this.predicate(pred),
            this.statements(body)
          ),
        ];
      },

      Context: (pos, cmeta, name, items) => {
        const id = this.context.register(pos);

        return [
          new IR.DContext(id, this.documentation(cmeta), name.name),
          ...this.declarations(items, name.name),
        ];
      },
    });
  }

  declarations(xs: Ast.Declaration[], context: string | null) {
    return xs.flatMap((x) => this.declaration(x, context));
  }
}

export function lowerToIR(
  filename: string,
  source: string,
  program: Ast.Program
) {
  const context = new Context(filename, source);
  const declarations = new LowerToIR(context).declarations(
    program.declarations,
    null
  );
  return new IR.Program(
    filename,
    source,
    context.generate_meta_table(),
    declarations
  );
}
