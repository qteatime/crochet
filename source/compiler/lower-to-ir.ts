import * as Ast from "../generated/crochet-grammar";
import * as IR from "../ir";
import {
  compileNamespace,
  compileTypeApp,
  parseNumber,
  parseInteger,
  parseString,
  signatureName,
  signatureValues,
} from "./compiler";

type uint32 = number;
type range_key = string & { __range_key__: 0 };

const NO_INFO = 0;

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
    return new IR.Interval(meta.range, meta.position);
  }

  make_range_key(meta: Ast.Meta): range_key {
    return `${meta.range.start}:${meta.range.end}` as range_key;
  }
}

export class LowerToIR {
  constructor(readonly context: Context) {}

  documentation(x: Ast.Metadata) {
    return x.doc.join("\n");
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
            new IR.ProjectStatic(id, field.name)
          ]
        } else {
          return [
            ...field.expr,
            ...this.expression(object0),
            new IR.Project(id)
          ]
        }
      },

      Interpolate: (_, value) => {
        
      }

      MatchSearch: () => {

      }
    });
  }

  statement(x: Ast.Statement): IR.Op[] {
    return x.match<IR.Op[]>({
      Assert: (pos, expr) => {
        return [];
      },
    });
  }

  declaration(x: Ast.Declaration) {
    return x.match<IR.Declaration[]>({
      Command: (pos, cmeta, sig, contract, body, test) => {
        const id = this.context.register(pos);
        const name = signatureName(sig);
        const { types, parameters } = this.parameters(signatureValues(sig));

        return [
          new IR.DCommand(
            id,
            this.documentation(cmeta),
            name,
            parameters,
            types,
            body
          ),
        ];
      },
    });
  }

  declarations(xs: Ast.Declaration[]) {
    return xs.flatMap((x) => this.declaration(x));
  }
}

export function compile(
  filename: string,
  source: string,
  program: Ast.Program
) {
  const context = new Context(filename, source);
  return new LowerToIR(context).compile(program);
}
