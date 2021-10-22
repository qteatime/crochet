(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./parser"), exports);
__exportStar(require("./lower-to-ir"), exports);

},{"./lower-to-ir":2,"./parser":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lower_to_repl = exports.lower_statements = exports.lower_declarations = exports.lower_to_ir = exports.LowerToIR = exports.from_enum_integer = void 0;
const Ast = require("../generated/crochet-grammar");
const IR = require("../ir");
const utils_1 = require("../utils/utils");
const utils_2 = require("./utils");
const NO_INFO = 0;
const NO_METADATA = new Ast.Metadata([]);
class Context {
    constructor(filename, source) {
        this.filename = filename;
        this.source = source;
        this.id2meta = new Map();
        this.range2id = new Map();
        this.next_id = 1;
        this.name_id = 1;
    }
    register(meta) {
        const key = this.make_range_key(meta);
        const id = this.range2id.get(key);
        if (id != null) {
            return id;
        }
        else {
            const interval = this.meta_to_interval(meta);
            const id = this.next_id;
            this.next_id += 1;
            this.id2meta.set(id, interval);
            this.range2id.set(key, id);
            return id;
        }
    }
    meta_to_interval(meta) {
        return new IR.Interval(meta.range);
    }
    make_range_key(meta) {
        return `${meta.range.start}:${meta.range.end}`;
    }
    generate_meta_table() {
        return this.id2meta;
    }
    fresh_name(prefix) {
        return `${prefix}$${this.name_id++}`;
    }
}
function constraint_to_type(constraint) {
    switch (constraint.tag) {
        case IR.TypeConstraintTag.TYPE:
            return constraint.type;
        case IR.TypeConstraintTag.WITH_TRAIT:
            return constraint_to_type(constraint.type);
        default:
            throw utils_1.unreachable(constraint, `Constraint`);
    }
}
class InterpolationPartBase {
    merge(that) {
        return null;
    }
    apply_indent(re) {
        return this;
    }
    trim_start() {
        return this;
    }
    trim_end() {
        return this;
    }
    resolve_escapes() {
        return this;
    }
    compile(on_static, on_dynamic) {
        return on_static(this.static_compile());
    }
}
class IPStatic extends InterpolationPartBase {
    constructor(value) {
        super();
        this.value = value;
    }
    merge(that) {
        if (that instanceof IPStatic) {
            return new IPStatic(this.value + that.value);
        }
        else {
            return null;
        }
    }
    apply_indent(re) {
        return new IPStatic(this.value.replace(re, (_, nl) => nl));
    }
    trim_start() {
        return new IPStatic(this.value.replace(/^[ \t]*(\r\n|\r|\n)/g, (_, nl) => nl));
    }
    trim_end() {
        return new IPStatic(this.value.replace(/(\r\n|\r|\n)[\t]*$/g, (_, nl) => nl));
    }
    static_compile() {
        return this.value;
    }
}
class IPEscape extends InterpolationPartBase {
    constructor(code) {
        super();
        this.code = code;
    }
    resolve_escapes() {
        return new IPStatic(utils_2.resolve_escape(this.code));
    }
    static_compile() {
        throw new Error(`internal: Unresolved escape code in interpolation`);
    }
}
class IPDynamic extends InterpolationPartBase {
    constructor(body) {
        super();
        this.body = body;
    }
    compile(on_static, on_dynamic) {
        return on_dynamic(this.body);
    }
    static_compile() {
        return null;
    }
}
function get_pos(x) {
    if (x instanceof Ast.$$Expression$_Lit) {
        return get_pos(x.value);
    }
    else {
        return x.pos;
    }
}
function is_saturated(args) {
    return args.every((x) => x.tag !== "Hole");
}
function non_holes(args) {
    return args.filter((x) => x.tag !== "Hole");
}
function holes(args) {
    return args.filter((x) => x.tag === "Hole");
}
function replace_signature_args(x, args) {
    return x.match({
        Binary: (p, op, l, r) => {
            return new Ast.Signature.Binary(p, op, args[0], args[1]);
        },
        Keyword: (p, s, ps) => {
            const [self, ...rest] = args;
            return new Ast.Signature.Keyword(p, self, ps.map((p, i) => new Ast.Pair(p.pos, p.key, rest[i])));
        },
        KeywordSelfless: (p, ps) => {
            return new Ast.Signature.KeywordSelfless(p, ps.map((p, i) => new Ast.Pair(p.pos, p.key, args[i])));
        },
        Unary: (p, self, name) => {
            return new Ast.Signature.Unary(p, args[0], name);
        },
    });
}
function from_enum_integer(meta, type, variants) {
    if (variants.length === 0) {
        throw new Error(`empty variants`);
    }
    else {
        const cond = variants.reduceRight((prev, x, i) => {
            return [
                new IR.PushVariable(meta, "N"),
                new IR.PushLiteral(new IR.LiteralInteger(BigInt(i + 1))),
                new IR.IntrinsicEqual(meta),
                new IR.Branch(meta, new IR.BasicBlock([
                    new IR.PushGlobal(meta, x.name),
                    new IR.Return(meta),
                ]), new IR.BasicBlock(prev)),
            ];
        }, [
            new IR.PushLiteral(new IR.LiteralFalse()),
            new IR.Assert(meta, IR.AssertType.UNREACHABLE, "invalid-variant-index", "Invalid variant index", null),
        ]);
        return new IR.DCommand(meta, "", "_ from-enum-integer: _", ["_", "N"], [
            new IR.TypeConstraintType(NO_INFO, type),
            new IR.TypeConstraintType(meta, new IR.LocalType(meta, "integer")),
        ], new IR.BasicBlock(cond));
    }
}
exports.from_enum_integer = from_enum_integer;
function is_implicit_return(xs) {
    if (xs.length === 0) {
        return false;
    }
    const x = xs[xs.length - 1];
    switch (x.tag) {
        case IR.OpTag.DROP:
        case IR.OpTag.LET:
        case IR.OpTag.ASSERT:
        case IR.OpTag.REGISTER_INSTANCE:
        case IR.OpTag.FACT:
        case IR.OpTag.FORGET:
        case IR.OpTag.SIMULATE:
            return false;
        default:
            return true;
    }
}
class LowerToIR {
    constructor(context) {
        this.context = context;
    }
    documentation(x) {
        return x.doc.join("\n");
    }
    type_def(x) { }
    type_parent(x) {
        return x == null
            ? new IR.TypeConstraintType(NO_INFO, new IR.AnyType())
            : this.type_constraint(x);
    }
    type(x) {
        return x.match({
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
                    Function: (_1, _2, _3) => {
                        throw new Error(`internal: invalid #(... -> ...)`);
                    },
                });
            },
            Function: (pos, args, _ret) => {
                const id = this.context.register(pos);
                return new IR.LocalType(id, `function-${args.length}`);
            },
        });
    }
    type_constraint(x) {
        return x.match({
            Type: (pos, t) => {
                const id = this.context.register(pos);
                return new IR.TypeConstraintType(id, this.type(t));
            },
            Has: (pos, type, traits) => {
                const id = this.context.register(pos);
                return new IR.TypeConstraintWithTrait(id, this.type_constraint(type), traits.map((x) => this.trait(x)));
            },
        });
    }
    trait(x) {
        return x.match({
            Named: (pos, name) => {
                const id = this.context.register(pos);
                return new IR.LocalTrait(id, name.name);
            },
        });
    }
    parameter(x) {
        return x.match({
            Typed: (_, name, type) => {
                return {
                    type: this.type_constraint(type),
                    parameter: name.name,
                };
            },
            TypedOnly: (_, type) => {
                return {
                    type: this.type_constraint(type),
                    parameter: "_",
                };
            },
            Untyped: (_, name) => {
                return {
                    type: new IR.TypeConstraintType(NO_INFO, new IR.AnyType()),
                    parameter: name.name,
                };
            },
        });
    }
    parameters(xs0) {
        const xs = xs0.map((x) => this.parameter(x));
        return {
            types: xs.map((x) => x.type),
            parameters: xs.map((x) => x.parameter),
        };
    }
    typeFields(fields) {
        const { types, parameters } = this.parameters(fields.map((x) => x.parameter));
        const globals = fields
            .filter((x) => x.visibility.match({
            Global: () => true,
            Local: () => false,
        }))
            .map((x) => this.parameter(x.parameter).parameter);
        return {
            globals,
            types,
            parameters,
        };
    }
    interpolation_part(x) {
        return x.match({
            Escape: (_, code) => {
                return new IPEscape(code);
            },
            Static: (_, text) => {
                return new IPStatic(text);
            },
            Dynamic: (_, expr) => {
                return new IPDynamic(expr);
            },
        });
    }
    interpolation_parts(pos, xs) {
        const optimise_parts = (xs) => {
            if (xs.length === 0) {
                return [];
            }
            else {
                const [hd, ...tl] = xs;
                const result = tl.reduce((prev, b) => {
                    const merged = prev.now.merge(b);
                    if (merged != null) {
                        return { now: merged, list: prev.list };
                    }
                    else {
                        prev.list.push(prev.now);
                        return { now: b, list: prev.list };
                    }
                }, { now: hd, list: [] });
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
    literal(x) {
        return x.match({
            False: (_) => new IR.LiteralFalse(),
            True: (_) => new IR.LiteralTrue(),
            Float: (_, digits) => new IR.LiteralFloat64(utils_2.parseNumber(digits)),
            Integer: (_, digits) => new IR.LiteralInteger(utils_2.parseInteger(digits)),
            Text: (_, x) => new IR.LiteralText(utils_2.parseString(x)),
            Nothing: (_) => new IR.LiteralNothing(),
        });
    }
    pattern(x) {
        return x.match({
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
            StaticType: (pos, type) => {
                const id = this.context.register(pos);
                return new IR.StaticTypePattern(id, this.type(type));
            },
        });
    }
    predicate(x) {
        return x.match({
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
                return new IR.PConstrained(id, this.predicate(pred), new IR.BasicBlock([...this.expression(constraint), new IR.Return(id)]));
            },
            Has: (pos, sig) => {
                const id = this.context.register(pos);
                const patterns = utils_2.signatureValues(sig);
                return new IR.PRelation(id, utils_2.signatureName(sig), patterns.map((x) => this.pattern(x)));
            },
            Let: (pos, name, value) => {
                const id = this.context.register(pos);
                return new IR.PLet(id, name.name, new IR.BasicBlock([...this.expression(value), new IR.Return(id)]));
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
                const size1 = utils_1.cast(this.literal(size0), IR.LiteralInteger);
                const size = Number(size1.value);
                return pool.match({
                    Relation: (_, sig) => {
                        const patterns = utils_2.signatureValues(sig);
                        return new IR.PSampleRelation(id, size, utils_2.signatureName(sig), patterns.map((x) => this.pattern(x)));
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
    relation_type(x) {
        return x.match({
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
    relation_types(xs) {
        return xs.map((x) => this.relation_type(x));
    }
    rank_function(x) {
        return x.match({
            Expr: (expr) => {
                return new IR.BasicBlock([
                    ...this.expression(expr),
                    new IR.Return(NO_INFO),
                ]);
            },
            Unranked: (_) => {
                return new IR.BasicBlock([
                    new IR.PushLiteral(new IR.LiteralInteger(1n)),
                    new IR.Return(NO_INFO),
                ]);
            },
        });
    }
    simulation_context(x) {
        return x.match({
            Global: () => null,
            Named: (_, name) => name.name,
        });
    }
    simulation_goal(x) {
        return x.match({
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
    simulation_signal(x) {
        const id = this.context.register(x.pos);
        const { parameters } = this.parameters(utils_2.signatureValues(x.signature));
        return new IR.SimulationSignal(id, parameters, utils_2.signatureName(x.signature), new IR.BasicBlock(this.fun_body(x.body)));
    }
    simulation_title(pos, type, name, title0) {
        const id = this.context.register(pos);
        const title = title0 == null
            ? [new IR.PushLiteral(new IR.LiteralText(name))]
            : this.expression(title0);
        return [
            new IR.DCommand(id, "", "_ title", ["_"], [new IR.TypeConstraintType(NO_INFO, type)], new IR.BasicBlock([...title, new IR.Return(id)])),
        ];
    }
    record_field(x) {
        return x.match({
            FName: (n) => ({
                static: true,
                name: n.name,
            }),
            FText: (n) => ({
                static: true,
                name: utils_2.parseString(n),
            }),
            FComputed: (x) => ({
                static: false,
                expr: this.expression(x),
            }),
        });
    }
    record_pairs(xs0) {
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
            key: x.key.name,
            value: x.value,
        }));
        const xs_dynamic = xs1
            .filter((x) => !x.key.static)
            .map((x) => ({
            pos: this.context.register(x.pos),
            expr: x.key.expr,
            value: x.value,
        }));
        return { pairs: xs_static, dynamic_pairs: xs_dynamic };
    }
    comprehension(x) {
        return x.match({
            Map: (pos, name, stream, body) => {
                const id = this.context.register(pos);
                return [
                    ...this.expression(stream),
                    new IR.PushLambda(id, [name.name], new IR.BasicBlock([...this.comprehension(body), new IR.Return(id)])),
                    new IR.Invoke(id, "_ flat-map: _", 2),
                ];
            },
            If: (pos, condition, body) => {
                const id = this.context.register(pos);
                return [
                    ...this.expression(condition),
                    new IR.Branch(id, new IR.BasicBlock(this.comprehension(body)), new IR.BasicBlock([new IR.PushList(id, 0)])),
                ];
            },
            Do: (pos, body) => {
                const id = this.context.register(pos);
                const result = this.expression(body);
                const ret = is_implicit_return(result)
                    ? [new IR.PushList(id, 1)]
                    : [new IR.PushList(id, 0)];
                return [...result, ...ret];
            },
        });
    }
    make_partial_lambda(meta, args, expr) {
        const concrete = non_holes(args);
        const missing = holes(args);
        const concrete_names0 = concrete.map((x) => [get_pos(x), this.context.fresh_name("arg")]);
        const missing_names0 = missing.map((x) => this.context.fresh_name("hole"));
        const missing_names = missing_names0.slice();
        const concrete_names = concrete_names0.slice();
        const params = [];
        for (const x of args) {
            if (x.tag === "Hole") {
                params.push(missing_names0.shift());
            }
            else {
                params.push(concrete_names0.shift()[1]);
            }
        }
        return [
            ...concrete.flatMap((x) => this.expression(x)),
            ...concrete_names
                .reverse()
                .map(([p, n]) => new IR.Let(this.context.register(p), n)),
            new IR.PushLambda(meta, missing_names, new IR.BasicBlock(expr(params))),
        ];
    }
    reify_subexpressions(x) {
        switch (x.tag) {
            case "IntrinsicEqual": {
                utils_1.force_cast(x);
                const l = this.context.fresh_name("expr");
                const lpos = get_pos(x.left);
                const lmeta = this.context.register(lpos);
                const r = this.context.fresh_name("expr");
                const rpos = get_pos(x.right);
                const rmeta = this.context.register(rpos);
                const x1 = new Ast.Expression.IntrinsicEqual(x.pos, new Ast.Expression.Variable(lpos, new Ast.Name(lpos, l)), new Ast.Expression.Variable(rpos, new Ast.Name(rpos, r)));
                return [
                    ["_ =:= _", [l, r]],
                    [
                        ...this.expression(x.left),
                        new IR.Let(lmeta, l),
                        ...this.expression(x.right),
                        new IR.Let(rmeta, r),
                        ...this.expression(x1),
                    ],
                ];
            }
            case "Invoke": {
                utils_1.force_cast(x);
                const args0 = utils_2.signatureValues(x.signature);
                const args = args0.map((x) => {
                    const p = get_pos(x);
                    const m = this.context.register(p);
                    const n = this.context.fresh_name("arg");
                    return {
                        meta: m,
                        expr: new Ast.Expression.Variable(p, new Ast.Name(p, n)),
                        ops: this.expression(x),
                        name: n,
                    };
                });
                const sig = replace_signature_args(x.signature, args.map((x) => x.expr));
                return [
                    [utils_2.signatureName(sig), args.map((x) => x.name)],
                    [
                        ...args0.flatMap((x) => this.expression(x)),
                        ...args
                            .slice()
                            .reverse()
                            .map((x) => new IR.Let(x.meta, x.name)),
                        ...this.expression(new Ast.Expression.Invoke(x.pos, sig)),
                    ],
                ];
            }
            default:
                return [null, this.expression(x)];
        }
    }
    expression(x) {
        return x.match({
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
                    new IR.PushList(id, values.length),
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
                const type = this.type(type0);
                return [new IR.PushStaticType(id, type)];
            },
            Record: (pos, pairs0) => {
                const id = this.context.register(pos);
                const { pairs, dynamic_pairs } = this.record_pairs(pairs0);
                return [
                    ...pairs.map((x) => x.value).flat(1),
                    new IR.PushRecord(id, pairs.map((x) => x.key)),
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
                }
                else {
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
                if (parts.length === 0) {
                    return [new IR.PushLiteral(new IR.LiteralText(""))];
                }
                else if (parts.length === 1 && parts[0] instanceof IPStatic) {
                    return [new IR.PushLiteral(new IR.LiteralText(parts[0].value))];
                }
                else {
                    return [
                        ...parts
                            .slice()
                            .reverse()
                            .flatMap((x) => x.compile(() => [], (u) => this.expression(u))),
                        new IR.Interpolate(id, parts.map((x) => x.static_compile())),
                    ];
                }
            },
            Lazy: (pos, value) => {
                const id = this.context.register(pos);
                return [
                    new IR.PushLazy(id, new IR.BasicBlock([...this.expression(value), new IR.Return(id)])),
                ];
            },
            Force: (pos, value) => {
                const id = this.context.register(pos);
                return [...this.expression(value), new IR.Force(id)];
            },
            Lambda: (pos, params, body) => {
                const id = this.context.register(pos);
                return [
                    new IR.PushLambda(id, params.map((x) => x.name), new IR.BasicBlock(this.fun_body(body))),
                ];
            },
            Invoke: (pos, sig) => {
                const id = this.context.register(pos);
                const args = utils_2.signatureValues(sig);
                const name = utils_2.signatureName(sig);
                if (is_saturated(args)) {
                    return [
                        ...args.flatMap((x) => this.expression(x)),
                        new IR.Invoke(id, name, args.length),
                    ];
                }
                else if (non_holes(args).length === 0) {
                    return [new IR.PushPartial(id, name, args.length)];
                }
                else {
                    return this.make_partial_lambda(id, args, (all) => [
                        ...all.map((x) => new IR.PushVariable(NO_INFO, x)),
                        new IR.Invoke(id, name, all.length),
                        new IR.Return(id),
                    ]);
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
                }
                else {
                    return this.make_partial_lambda(id, args, (all) => [
                        ...all.map((x) => new IR.PushVariable(NO_INFO, x)),
                        ...this.expression(fn),
                        new IR.Apply(id, all.length),
                        new IR.Return(id),
                    ]);
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
            HasTrait: (pos, value, trait) => {
                const id = this.context.register(pos);
                return [
                    ...this.expression(value),
                    new IR.TraitTest(id, this.trait(trait)),
                ];
            },
            Hole: (_) => {
                throw new Error(`internal: Hole found outside of function application.`);
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
                const sig = utils_2.materialiseSignature(arg, sig0);
                return this.expression(new Ast.Expression.Invoke(pos, sig));
            },
            Condition: (pos, cases) => {
                const id = this.context.register(pos);
                return cases.reduceRight((previous, x) => {
                    const id = this.context.register(x.pos);
                    return [
                        ...this.expression(x.guard),
                        new IR.Branch(id, this.statements(x.body), new IR.BasicBlock(previous)),
                    ];
                }, [
                    new IR.PushLiteral(new IR.LiteralFalse()),
                    new IR.Assert(id, IR.AssertType.UNREACHABLE, "unreachable", "None of the conditions were true.", null),
                ]);
            },
            ForeignInvoke: (pos, name, args) => {
                const id = this.context.register(pos);
                return [
                    ...args.flatMap((x) => this.expression(x)),
                    new IR.InvokeForeign(id, utils_2.compileNamespace(name), args.length),
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
                return cases.reduceRight((previous, x) => {
                    const id = this.context.register(x.pos);
                    return [
                        new IR.Search(id, this.predicate(x.predicate)),
                        new IR.MatchSearch(id, new IR.BasicBlock(this.fun_body(x.body)), new IR.BasicBlock(previous)),
                    ];
                }, [
                    new IR.PushLiteral(new IR.LiteralFalse()),
                    new IR.Assert(id, IR.AssertType.UNREACHABLE, "unreachable", "None of the cases matched", null),
                ]);
            },
            Select: () => {
                throw new Error(`internal: select not supported`);
            },
            Handle: (pos, body, handlers) => {
                const id = this.context.register(pos);
                return [
                    new IR.Handle(id, new IR.BasicBlock(this.fun_body(body)), this.handlers(handlers)),
                ];
            },
            Perform: (pos, effect, variant, args) => {
                const id = this.context.register(pos);
                return [
                    ...args.flatMap((x) => this.expression(x)),
                    new IR.Perform(id, effect.name, variant.name, args.length),
                ];
            },
            ContinueWith: (pos, value) => {
                const id = this.context.register(pos);
                return [...this.expression(value), new IR.ContinueWith(id)];
            },
            Dsl: (pos, language, ast) => {
                return [
                    new IR.Dsl(this.context.register(pos), this.type(language), ast.map((x) => this.dsl_node(x))),
                ];
            },
        });
    }
    dsl_node(x) {
        return x.match({
            Node: (pos, sig, attrs) => {
                const { name, values } = this.dsl_signature(sig);
                return new IR.DslAstNode(this.dsl_meta(pos), name, values.map((x) => this.dsl_node(x)), this.dsl_attributes(attrs));
            },
            Lit: (pos, x) => {
                return new IR.DslAstLiteral(this.dsl_meta(pos), this.literal(x));
            },
            Var: (pos, name) => {
                return new IR.DslAstVariable(this.dsl_meta(pos), name.name);
            },
            Dynamic: (pos, x) => {
                return new IR.DslAstExpression(this.dsl_meta(pos), pos.source_slice, new IR.BasicBlock([
                    ...this.expression(x),
                    new IR.Return(this.context.register(pos)),
                ]));
            },
            List: (pos, values) => {
                return new IR.DslAstNodeList(this.dsl_meta(pos), values.map((x) => this.dsl_node(x)));
            },
            Interpolation: (pos, value) => {
                const parts = this.interpolation_parts(pos, value.parts);
                if (parts.length === 0) {
                    return new IR.DslAstLiteral(this.dsl_meta(pos), new IR.LiteralText(""));
                }
                else if (parts.length === 1 && parts[0] instanceof IPStatic) {
                    return new IR.DslAstLiteral(this.dsl_meta(pos), new IR.LiteralText(parts[0].value));
                }
                else {
                    return new IR.DslAstInterpolation(this.dsl_meta(pos), parts.map((x) => x.compile((s) => new IR.DslInterpolationStatic(s), (x) => new IR.DslInterpolationDynamic(this.dsl_node(x)))));
                }
            },
        });
    }
    dsl_meta(x) {
        return x.position;
    }
    dsl_signature(xs) {
        const name = xs
            .map((x) => {
            if (x instanceof Ast.$$DslSignature$_Name) {
                return x.name.name;
            }
            else {
                return "_";
            }
        })
            .join(" ");
        const values = xs.flatMap((x) => {
            if (x instanceof Ast.$$DslSignature$_Child) {
                return [x.value];
            }
            else {
                return [];
            }
        });
        return { name, values };
    }
    dsl_attributes(xs) {
        const result = new Map();
        for (const x of xs) {
            result.set(x.key.name.replace(/^--/, ""), this.dsl_node(x.value));
        }
        return result;
    }
    handlers(handlers) {
        return handlers.map((x) => this.handler(x));
    }
    handler(handler) {
        return new IR.HandlerCase(this.context.register(handler.pos), handler.name.name, handler.variant.name, handler.args.map((x) => x.name), new IR.BasicBlock(this.fun_body(handler.body)));
    }
    statements(xs) {
        return new IR.BasicBlock(xs.flatMap((x) => this.statement(x)));
    }
    fun_body(xs) {
        if (xs.length === 0) {
            return [
                new IR.PushLiteral(new IR.LiteralNothing()),
                new IR.Return(NO_INFO),
            ];
        }
        else {
            const last = xs[xs.length - 1];
            let ret = [];
            if (last instanceof Ast.$$Statement$_Expr) {
                const id = this.context.register(get_pos(last.value));
                ret = [new IR.Return(id)];
            }
            return [...xs.flatMap((x) => this.statement(x)), ...ret];
        }
    }
    statement(x) {
        return x.match({
            Assert: (pos, expr) => {
                const id = this.context.register(pos);
                const [sub, ops] = this.reify_subexpressions(expr);
                return [
                    ...ops,
                    new IR.Assert(id, IR.AssertType.ASSERT, "assert", get_pos(expr).source_slice, sub),
                ];
            },
            Expr: (expr) => {
                const id = this.context.register(get_pos(expr));
                return [...this.expression(expr)];
            },
            Let: (pos, name, value) => {
                const id = this.context.register(pos);
                return [...this.expression(value), new IR.Let(id, name.name)];
            },
            Fact: (pos, sig) => {
                const id = this.context.register(pos);
                const exprs = utils_2.signatureValues(sig);
                return [
                    ...exprs.flatMap((x) => this.expression(x)),
                    new IR.Fact(id, utils_2.signatureName(sig), exprs.length),
                ];
            },
            Forget: (pos, sig) => {
                const id = this.context.register(pos);
                const exprs = utils_2.signatureValues(sig);
                return [
                    ...exprs.flatMap((x) => this.expression(x)),
                    new IR.Forget(id, utils_2.signatureName(sig), exprs.length),
                ];
            },
            Simulate: (pos, actors, context, goal, signals) => {
                const id = this.context.register(pos);
                return [
                    ...this.expression(actors),
                    new IR.Simulate(id, this.simulation_context(context), this.simulation_goal(goal), signals.flatMap((x) => this.simulation_signal(x))),
                    new IR.Drop(id),
                ];
            },
        });
    }
    expand_type_initialiser(type, name, x) {
        return x.match({
            Fact: (pos, sig) => {
                return new Ast.Statement.Fact(pos, utils_2.materialiseSignature(name, sig));
            },
            Command: (pos, cmeta, sig, contract, body, ttest) => {
                return new Ast.Declaration.Command(pos, cmeta, utils_2.materialiseSignature(new Ast.Parameter.TypedOnly(get_pos(type), type), sig), contract, body, ttest);
            },
        });
    }
    type_initialiser(pos, name, init0, context) {
        const id = this.context.register(pos);
        const type = new Ast.TypeApp.Named(pos, new Ast.Name(pos, name));
        const self = new Ast.Expression.Global(pos, new Ast.Name(pos, name));
        const init = init0.map((x) => this.expand_type_initialiser(new Ast.TypeConstraint.Type(pos, type), self, x));
        const statements = init.filter((x) => x instanceof Ast.Statement);
        const commands = init.filter((x) => x instanceof Ast.Declaration);
        return [
            ...commands.flatMap((x) => this.declaration(x, context)),
            new IR.DPrelude(id, this.statements(statements)),
        ];
    }
    singleton_type(pos, id, cmeta, name, parent, init, context) {
        const type = new IR.LocalType(id, name);
        return [
            new IR.DType(id, this.documentation(cmeta), IR.Visibility.GLOBAL, name, parent, [], []),
            new IR.DDefine(id, `See type:${name}`, IR.Visibility.GLOBAL, name, new IR.BasicBlock([new IR.PushNew(id, type, 0), new IR.Return(id)])),
            new IR.DSeal(id, name),
            new IR.DPrelude(id, new IR.BasicBlock([
                new IR.PushGlobal(id, name),
                new IR.RegisterInstance(id),
            ])),
            ...this.type_initialiser(pos, name, init, context),
        ];
    }
    contract_condition(kind, contract) {
        const id = this.context.register(contract.pos);
        const [sub, ops] = this.reify_subexpressions(contract.expr);
        return [
            ...ops,
            new IR.Assert(id, kind, contract.name.name, get_pos(contract.expr).source_slice, sub),
        ];
    }
    contract_conditions(kind, xs) {
        return xs.flatMap((x) => this.contract_condition(kind, x));
    }
    contract_return(ret) {
        if (ret == null) {
            return [];
        }
        else {
            const id = this.context.register(get_pos(ret));
            const constraint = this.type_constraint(ret);
            return [
                new IR.PushReturn(id),
                new IR.TypeTest(id, constraint_to_type(constraint)),
                new IR.Assert(id, IR.AssertType.RETURN_TYPE, "return-type", `return is ${get_pos(ret).source_slice}`, null),
            ];
        }
    }
    declaration(x, context) {
        return x.match({
            Command: (pos, cmeta, sig, contract, body, test) => {
                const id = this.context.register(pos);
                const name = utils_2.signatureName(sig);
                const { types, parameters } = this.parameters(utils_2.signatureValues(sig));
                const result = [
                    new IR.DCommand(id, this.documentation(cmeta), name, parameters, types, new IR.BasicBlock([
                        ...this.contract_conditions(IR.AssertType.PRECONDITION, contract.pre),
                        ...this.fun_body(body),
                        ...this.contract_return(contract.ret),
                        ...this.contract_conditions(IR.AssertType.POSTCONDITION, contract.post),
                    ])),
                ];
                if (test == null) {
                    return result;
                }
                else {
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
                    new IR.DDefine(id, this.documentation(cmeta), IR.Visibility.GLOBAL, name.name, new IR.BasicBlock([...this.expression(value), new IR.Return(id)])),
                ];
            },
            Test: (pos, title, body) => {
                const id = this.context.register(pos);
                return [new IR.DTest(id, utils_2.parseString(title), this.statements(body))];
            },
            Open: (pos, name) => {
                const id = this.context.register(pos);
                return [new IR.DOpen(id, utils_2.compileNamespace(name))];
            },
            AbstractType: (pos, cmeta, type) => {
                const id = this.context.register(pos);
                return [
                    new IR.DType(id, this.documentation(cmeta), IR.Visibility.GLOBAL, type.name.name, this.type_parent(type.parent), [], []),
                    new IR.DSeal(id, type.name.name),
                ];
            },
            Type: (pos, cmeta, type, fields0) => {
                const id = this.context.register(pos);
                const { globals, types, parameters } = this.typeFields(fields0);
                const constraint = new IR.TypeConstraintType(id, new IR.LocalType(id, type.name.name));
                return [
                    new IR.DType(id, this.documentation(cmeta), IR.Visibility.GLOBAL, type.name.name, this.type_parent(type.parent), parameters, types),
                    ...globals.map((x) => {
                        return new IR.DCommand(id, `Projects ${x}`, `_ ${x}`, ["_"], [constraint], new IR.BasicBlock([
                            new IR.PushSelf(id),
                            new IR.ProjectStatic(id, x),
                            new IR.Return(id),
                        ]));
                    }),
                ];
            },
            SingletonType: (pos, cmeta, type, init) => {
                const id = this.context.register(pos);
                return this.singleton_type(pos, id, cmeta, type.name.name, this.type_parent(type.parent), init, context);
            },
            Do: (pos, body) => {
                const id = this.context.register(pos);
                return [new IR.DPrelude(id, this.statements(body))];
            },
            Local: (_, decl0) => {
                const decls = this.declaration(decl0, context);
                return decls.map((x) => {
                    switch (x.tag) {
                        case IR.DeclarationTag.DEFINE: {
                            if (x.visibility === IR.Visibility.GLOBAL) {
                                return new IR.DDefine(x.meta, x.documentation, IR.Visibility.LOCAL, x.name, x.body);
                            }
                            else {
                                return x;
                            }
                        }
                        case IR.DeclarationTag.TYPE: {
                            if (x.visibility === IR.Visibility.GLOBAL) {
                                return new IR.DType(x.meta, x.documentation, IR.Visibility.LOCAL, x.name, x.parent, x.fields, x.types);
                            }
                            else {
                                return x;
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
                const parent_constraint = new IR.TypeConstraintType(id, parent);
                const variants = variants0.flatMap((v, i) => {
                    const variant_id = this.context.register(v.pos);
                    return [
                        ...this.singleton_type(v.pos, variant_id, NO_METADATA, v.name, parent_constraint, [], context),
                        new IR.DCommand(variant_id, "", "_ to-enum-integer", ["_"], [
                            new IR.TypeConstraintType(variant_id, new IR.LocalType(variant_id, v.name)),
                        ], new IR.BasicBlock([
                            new IR.PushLiteral(new IR.LiteralInteger(BigInt(i + 1))),
                            new IR.Return(variant_id),
                        ])),
                    ];
                });
                return [
                    new IR.DType(id, this.documentation(cmeta), IR.Visibility.GLOBAL, name.name, new IR.TypeConstraintType(id, new IR.GlobalType(id, "crochet.core", "enum")), [], []),
                    ...variants,
                    new IR.DDefine(id, `See type:${name.name}`, IR.Visibility.GLOBAL, name.name, new IR.BasicBlock([
                        new IR.PushNew(id, new IR.LocalType(id, name.name), 0),
                        new IR.Return(id),
                    ])),
                    new IR.DSeal(id, name.name),
                    // Generated commands
                    new IR.DCommand(id, "", "_ lower-bound", ["_"], [parent_constraint], new IR.BasicBlock([
                        new IR.PushGlobal(id, variants0[0].name),
                        new IR.Return(id),
                    ])),
                    new IR.DCommand(id, "", "_ upper-bound", ["_"], [parent_constraint], new IR.BasicBlock([
                        new IR.PushGlobal(id, variants0[variants0.length - 1].name),
                        new IR.Return(id),
                    ])),
                    from_enum_integer(id, parent, variants0),
                ];
            },
            ForeignType: (pos, cmeta, name, target) => {
                const id = this.context.register(pos);
                return [
                    new IR.DForeignType(id, this.documentation(cmeta), IR.Visibility.GLOBAL, name.name, utils_2.compileNamespace(target)),
                ];
            },
            Relation: (pos, cmeta, sig) => {
                const id = this.context.register(pos);
                return [
                    new IR.DRelation(id, this.documentation(cmeta), utils_2.signatureName(sig), this.relation_types(utils_2.signatureValues(sig))),
                ];
            },
            Action: (pos, cmeta, param, name, title, pred, rank, body, init) => {
                const id = this.context.register(pos);
                const title_pos = title != null ? get_pos(title) : name.pos;
                const type_name = `action ${name.name}`;
                const type = new IR.LocalType(id, type_name);
                const self = this.parameter(param);
                return [
                    new IR.DAction(id, this.documentation(cmeta), context, name.name, self.type, self.parameter, this.rank_function(rank), this.predicate(pred), this.statements(body)),
                    ...this.simulation_title(title_pos, type, name.name, title),
                    ...this.type_initialiser(pos, type_name, init, context),
                ];
            },
            When: (pos, cmeta, pred, body) => {
                const id = this.context.register(pos);
                return [
                    new IR.DWhen(id, this.documentation(cmeta), context, this.predicate(pred), this.statements(body)),
                ];
            },
            Context: (pos, cmeta, name, items) => {
                const id = this.context.register(pos);
                return [
                    new IR.DContext(id, this.documentation(cmeta), name.name),
                    ...this.declarations(items, name.name),
                ];
            },
            Effect: (pos, cmeta, name, cases) => {
                const id = this.context.register(pos);
                return [
                    new IR.DEffect(id, this.documentation(cmeta), name.name, cases.map((x) => {
                        const { types, parameters } = this.parameters(x.params);
                        return new IR.EffectCase(this.context.register(x.pos), this.documentation(x.cmeta), x.name.name, parameters, types);
                    })),
                ];
            },
            Trait: (pos, cmeta, name) => {
                const id = this.context.register(pos);
                return [new IR.DTrait(id, this.documentation(cmeta), name.name)];
            },
            ImplementTrait: (pos, type, trait) => {
                const id = this.context.register(pos);
                return [new IR.DImplementTrait(id, this.trait(trait), this.type(type))];
            },
            Capability: (pos, cmeta, name) => {
                const id = this.context.register(pos);
                return [new IR.DCapability(id, this.documentation(cmeta), name.name)];
            },
            Protect: (pos, capability, entity) => {
                const id = this.context.register(pos);
                const [type, entity_name] = entity.match({
                    Definition: (_, name) => {
                        return [IR.ProtectEntityTag.DEFINE, name.name];
                    },
                    Effect: (_, name) => {
                        return [IR.ProtectEntityTag.EFFECT, name.name];
                    },
                    Type: (_, name) => {
                        return [IR.ProtectEntityTag.TYPE, name.name];
                    },
                    Trait: (_, name) => {
                        return [IR.ProtectEntityTag.TRAIT, name.name];
                    },
                });
                return [new IR.DProtect(id, capability.name, type, entity_name)];
            },
        });
    }
    declarations(xs, context) {
        return xs.flatMap((x) => this.declaration(x, context));
    }
}
exports.LowerToIR = LowerToIR;
function lower_to_ir(filename, source, program) {
    const context = new Context(filename, source);
    const declarations = new LowerToIR(context).declarations(program.declarations, null);
    return new IR.Program(filename, source, context.generate_meta_table(), declarations);
}
exports.lower_to_ir = lower_to_ir;
function lower_declarations(source, xs) {
    const context = new Context("", source);
    const declarations = new LowerToIR(context).declarations(xs, null);
    return {
        declarations,
        meta: context.generate_meta_table(),
    };
}
exports.lower_declarations = lower_declarations;
function lower_statements(source, xs) {
    const context = new Context("", source);
    const block = new LowerToIR(context).statements(xs);
    return {
        block,
        meta: context.generate_meta_table(),
    };
}
exports.lower_statements = lower_statements;
function lower_to_repl(source, x) {
    return x.match({
        Declarations: (xs) => {
            const { declarations, meta } = lower_declarations(source, xs);
            return new IR.ReplDeclarations(declarations, source, meta);
        },
        Statements: (xs) => {
            const { block, meta } = lower_statements(source, xs);
            return new IR.ReplStatements(block, source, meta);
        },
        Command: (_) => {
            throw new Error(`Unsupported`);
        },
    });
}
exports.lower_to_repl = lower_to_repl;

},{"../generated/crochet-grammar":5,"../ir":9,"../utils/utils":18,"./utils":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_repl = exports.parse = void 0;
const Crochet = require("../generated/crochet-grammar");
function parse(source, filename) {
    const result = Crochet.parse(source, "program");
    if (result.ok) {
        return result.value;
    }
    else {
        throw new SyntaxError(`In ${filename}\n${result.error}`);
    }
}
exports.parse = parse;
function parse_repl(source, filename) {
    const matched = Crochet.grammar.match(source, "repl");
    if (matched.failed()) {
        throw new SyntaxError(`In ${filename}\n${matched.message}`);
    }
    else {
        return Crochet.toAst(matched);
    }
}
exports.parse_repl = parse_repl;

},{"../generated/crochet-grammar":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileProgram = exports.compileRepl = exports.compileNamespace = exports.materialiseSignature = exports.signatureValues = exports.signatureName = exports.resolve_escape = exports.parseString = exports.parseNumber = exports.parseInteger = void 0;
const crochet_grammar_1 = require("../generated/crochet-grammar");
// -- Utilities
function parseInteger(x) {
    return BigInt(x.replace(/_/g, ""));
}
exports.parseInteger = parseInteger;
function parseNumber(x) {
    return Number(x.replace(/_/g, ""));
}
exports.parseNumber = parseNumber;
function parseString(x) {
    const column = x.pos.position.column + 1;
    const indent = new RegExp(`(\r\n|\r|\n)[ \t]{0,${column}}`, "g");
    const text = x.text
        .replace(indent, (_, newline) => {
        return newline;
    })
        .replace(/^[ \t]*(\r\n|\r|\n)/g, (_, nl) => "")
        .replace(/(\r\n|\r|\n)[ \t]*$/g, (_, nl) => "")
        .replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, e) => {
        return resolve_escape(e);
    });
    return text.replace(/^"|"$/g, "");
}
exports.parseString = parseString;
function resolve_escape(escape) {
    if (escape.length === 1) {
        switch (escape) {
            case "b":
                return "\b";
            case "f":
                return "\f";
            case "n":
                return "\n";
            case "r":
                return "\r";
            case "t":
                return "\t";
            default:
                return escape;
        }
    }
    else if (escape.startsWith("u") && escape.length === 5) {
        return String.fromCodePoint(Number("0x" + escape.slice(1)));
    }
    else if (escape.startsWith("x") && escape.length === 3) {
        return String.fromCharCode(Number("0x" + escape.slice(1)));
    }
    else {
        throw new Error(`Invalid escape sequence \\${escape}`);
    }
}
exports.resolve_escape = resolve_escape;
function signatureName(sig) {
    return sig.match({
        Keyword(_meta, _self, pairs) {
            const names = pairs.map((x) => x.key.name + " _");
            return `_ ${names.join(" ")}`;
        },
        KeywordSelfless(_meta, pairs) {
            const names = pairs.map((x) => x.key.name + " _");
            return names.join(" ");
        },
        Unary(_meta, _self, name) {
            return `_ ${name.name}`;
        },
        Binary(_meta, op, _l, _r) {
            return `_ ${op.name} _`;
        },
    });
}
exports.signatureName = signatureName;
function signatureValues(sig) {
    return sig.match({
        Keyword(_meta, self, pairs) {
            return [self, ...pairs.map((x) => x.value)];
        },
        KeywordSelfless(_meta, pairs) {
            return pairs.map((x) => x.value);
        },
        Unary(_meta, self, _name) {
            return [self];
        },
        Binary(_meta, _op, l, r) {
            return [l, r];
        },
    });
}
exports.signatureValues = signatureValues;
function materialiseSignature(self, signature) {
    return signature.match({
        Unary(meta, name) {
            return new crochet_grammar_1.Signature.Unary(meta, self, name);
        },
        Binary(meta, op, right) {
            return new crochet_grammar_1.Signature.Binary(meta, op, self, right);
        },
        Keyword(meta, pairs) {
            return new crochet_grammar_1.Signature.Keyword(meta, self, pairs);
        },
    });
}
exports.materialiseSignature = materialiseSignature;
function compileNamespace(x) {
    return x.names.join(".");
}
exports.compileNamespace = compileNamespace;
function compileRepl(x) {
    throw new Error(`to be removed`);
}
exports.compileRepl = compileRepl;
function compileProgram(p) {
    throw new Error(`to be removed`);
}
exports.compileProgram = compileProgram;

},{"../generated/crochet-grammar":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$Parameter$_Typed = exports.$$Parameter$_Untyped = exports.Parameter = exports.$$TypeInit$_Command = exports.$$TypeInit$_Fact = exports.TypeInit = exports.$$Rank$_Unranked = exports.$$Rank$_Expr = exports.Rank = exports.$$FieldVisibility$_Global = exports.$$FieldVisibility$_Local = exports.FieldVisibility = exports.TypeField = exports.FFI = exports.TypeDef = exports.ContractCondition = exports.Contract = exports.TrailingTest = exports.Handler = exports.EffectCase = exports.$$ProtectEntity$_Definition = exports.$$ProtectEntity$_Effect = exports.$$ProtectEntity$_Trait = exports.$$ProtectEntity$_Type = exports.ProtectEntity = exports.$$Declaration$_Protect = exports.$$Declaration$_Capability = exports.$$Declaration$_Effect = exports.$$Declaration$_Test = exports.$$Declaration$_Local = exports.$$Declaration$_Open = exports.$$Declaration$_Context = exports.$$Declaration$_When = exports.$$Declaration$_Action = exports.$$Declaration$_ImplementTrait = exports.$$Declaration$_Trait = exports.$$Declaration$_Type = exports.$$Declaration$_SingletonType = exports.$$Declaration$_EnumType = exports.$$Declaration$_AbstractType = exports.$$Declaration$_Define = exports.$$Declaration$_Command = exports.$$Declaration$_Do = exports.$$Declaration$_Relation = exports.$$Declaration$_ForeignType = exports.Declaration = exports.Metadata = exports.Program = exports.Meta = exports.Node = void 0;
exports.$$Expression$_IntrinsicEqual = exports.$$Expression$_Lambda = exports.$$Expression$_Type = exports.$$Expression$_Return = exports.$$Expression$_Hole = exports.$$Expression$_Lazy = exports.$$Expression$_Force = exports.$$Expression$_HasTrait = exports.$$Expression$_HasType = exports.$$Expression$_Condition = exports.$$Expression$_Interpolate = exports.$$Expression$_PipeInvoke = exports.$$Expression$_Pipe = exports.$$Expression$_Apply = exports.$$Expression$_Block = exports.$$Expression$_For = exports.$$Expression$_Select = exports.$$Expression$_Project = exports.$$Expression$_MatchSearch = exports.$$Expression$_Search = exports.$$Expression$_Record = exports.$$Expression$_List = exports.$$Expression$_Self = exports.$$Expression$_Variable = exports.$$Expression$_Global = exports.$$Expression$_Invoke = exports.$$Expression$_New = exports.Expression = exports.Signal = exports.$$SimulationContext$_Named = exports.$$SimulationContext$_Global = exports.SimulationContext = exports.$$Statement$_Expr = exports.$$Statement$_Assert = exports.$$Statement$_Simulate = exports.$$Statement$_Let = exports.$$Statement$_Forget = exports.$$Statement$_Fact = exports.Statement = exports.$$Trait$_Named = exports.Trait = exports.$$TypeConstraint$_Has = exports.$$TypeConstraint$_Type = exports.TypeConstraint = exports.$$TypeApp$_Any = exports.$$TypeApp$_Function = exports.$$TypeApp$_Static = exports.$$TypeApp$_Named = exports.TypeApp = exports.$$Parameter$_TypedOnly = void 0;
exports.$$Predicate$_Not = exports.$$Predicate$_Or = exports.$$Predicate$_And = exports.Predicate = exports.$$SimulationGoal$_CustomGoal = exports.$$SimulationGoal$_TotalQuiescence = exports.$$SimulationGoal$_EventQuiescence = exports.$$SimulationGoal$_ActionQuiescence = exports.SimulationGoal = exports.$$Literal$_Float = exports.$$Literal$_Integer = exports.$$Literal$_Text = exports.$$Literal$_Nothing = exports.$$Literal$_True = exports.$$Literal$_False = exports.Literal = exports.$$InterpolationPart$_Dynamic = exports.$$InterpolationPart$_Static = exports.$$InterpolationPart$_Escape = exports.InterpolationPart = exports.Interpolation = exports.Projection = exports.$$RecordField$_FComputed = exports.$$RecordField$_FText = exports.$$RecordField$_FName = exports.RecordField = exports.ConditionCase = exports.MatchSearchCase = exports.$$ForExpression$_Do = exports.$$ForExpression$_If = exports.$$ForExpression$_Map = exports.ForExpression = exports.DslAttr = exports.$$DslSignature$_Child = exports.$$DslSignature$_Name = exports.DslSignature = exports.$$DslAst$_Dynamic = exports.$$DslAst$_Interpolation = exports.$$DslAst$_List = exports.$$DslAst$_Var = exports.$$DslAst$_Lit = exports.$$DslAst$_Node = exports.DslAst = exports.$$Expression$_Dsl = exports.$$Expression$_ContinueWith = exports.$$Expression$_Perform = exports.$$Expression$_Handle = exports.$$Expression$_Lit = exports.$$Expression$_Parens = exports.$$Expression$_ForeignInvoke = void 0;
exports.toAst = exports.toAstVisitor = exports.semantics = exports.parse = exports.grammar = exports.$$ReplCommand$_HelpType = exports.$$ReplCommand$_HelpCommand = exports.$$ReplCommand$_Rollback = exports.ReplCommand = exports.$$REPL$_Command = exports.$$REPL$_Statements = exports.$$REPL$_Declarations = exports.REPL = exports.String = exports.Namespace = exports.Name = exports.Pair = exports.$$RelationPart$_One = exports.$$RelationPart$_Many = exports.RelationPart = exports.$$PartialSignature$_Keyword = exports.$$PartialSignature$_Binary = exports.$$PartialSignature$_Unary = exports.PartialSignature = exports.$$Signature$_KeywordSelfless = exports.$$Signature$_Keyword = exports.$$Signature$_Binary = exports.$$Signature$_Unary = exports.Signature = exports.$$Pattern$_Lit = exports.$$Pattern$_Wildcard = exports.$$Pattern$_Self = exports.$$Pattern$_Variable = exports.$$Pattern$_Global = exports.$$Pattern$_StaticType = exports.$$Pattern$_HasType = exports.Pattern = exports.$$SamplingPool$_Type = exports.$$SamplingPool$_Relation = exports.SamplingPool = exports.$$Predicate$_Parens = exports.$$Predicate$_Always = exports.$$Predicate$_Typed = exports.$$Predicate$_Let = exports.$$Predicate$_Constrain = exports.$$Predicate$_Sample = exports.$$Predicate$_Has = void 0;
// This file is generated from Linguist
const Ohm = require("ohm-js");
const OhmUtil = require("ohm-js/src/util");
const util_1 = require("util");
const inspect = Symbol.for('nodejs.util.inspect.custom');
class Node {
}
exports.Node = Node;
class Meta {
    constructor(interval) {
        this.interval = interval;
    }
    static has_instance(x) {
        return x instanceof Meta;
    }
    get position() {
        const { lineNum, colNum } = OhmUtil.getLineAndColumn(this.interval.sourceString, this.interval.startIdx);
        return {
            line: lineNum,
            column: colNum,
        };
    }
    get range() {
        return {
            start: this.interval.startIdx,
            end: this.interval.endIdx,
        };
    }
    get source_slice() {
        return this.interval.contents;
    }
    get formatted_position_message() {
        return this.interval.getLineAndColumnMessage();
    }
    [inspect]() {
        return this.position;
    }
}
exports.Meta = Meta;
function $meta(x) {
    return new Meta(x.source);
}
function $check_type(f) {
    return (x) => {
        if (typeof f.has_instance === "function") {
            return f.has_instance(x);
        }
        else {
            return f(x);
        }
    };
}
function $is_type(t) {
    return (x) => {
        return typeof x === t;
    };
}
function $is_array(f) {
    return (x) => {
        return Array.isArray(x) && x.every($check_type(f));
    };
}
function $is_maybe(f) {
    return (x) => {
        return x === null || $check_type(f)(x);
    };
}
function $is_null(x) {
    return x === null;
}
function $assert_type(x, t, f) {
    if (!$check_type(f)(x)) {
        throw new TypeError(`Expected ${t}, but got ${util_1.inspect(x)}`);
    }
}
// == Type definitions ==============================================
class Program extends Node {
    constructor(pos, declarations) {
        super();
        this.pos = pos;
        this.declarations = declarations;
        Object.defineProperty(this, "tag", { value: "Program" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(declarations, "Declaration[]", $is_array(Declaration)));
    }
    static has_instance(x) {
        return x instanceof Program;
    }
}
exports.Program = Program;
class Metadata extends Node {
    constructor(doc) {
        super();
        this.doc = doc;
        Object.defineProperty(this, "tag", { value: "Metadata" });
        ($assert_type(doc, "string[]", $is_array($is_type("string"))));
    }
    static has_instance(x) {
        return x instanceof Metadata;
    }
}
exports.Metadata = Metadata;
class Declaration extends Node {
    static get ForeignType() {
        return $$Declaration$_ForeignType;
    }
    static get Relation() {
        return $$Declaration$_Relation;
    }
    static get Do() {
        return $$Declaration$_Do;
    }
    static get Command() {
        return $$Declaration$_Command;
    }
    static get Define() {
        return $$Declaration$_Define;
    }
    static get AbstractType() {
        return $$Declaration$_AbstractType;
    }
    static get EnumType() {
        return $$Declaration$_EnumType;
    }
    static get SingletonType() {
        return $$Declaration$_SingletonType;
    }
    static get Type() {
        return $$Declaration$_Type;
    }
    static get Trait() {
        return $$Declaration$_Trait;
    }
    static get ImplementTrait() {
        return $$Declaration$_ImplementTrait;
    }
    static get Action() {
        return $$Declaration$_Action;
    }
    static get When() {
        return $$Declaration$_When;
    }
    static get Context() {
        return $$Declaration$_Context;
    }
    static get Open() {
        return $$Declaration$_Open;
    }
    static get Local() {
        return $$Declaration$_Local;
    }
    static get Test() {
        return $$Declaration$_Test;
    }
    static get Effect() {
        return $$Declaration$_Effect;
    }
    static get Capability() {
        return $$Declaration$_Capability;
    }
    static get Protect() {
        return $$Declaration$_Protect;
    }
    static has_instance(x) {
        return x instanceof Declaration;
    }
}
exports.Declaration = Declaration;
class $$Declaration$_ForeignType extends Declaration {
    constructor(pos, cmeta, name, target) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.target = target;
        Object.defineProperty(this, "tag", { value: "ForeignType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(target, "Namespace", Namespace));
    }
    match(p) {
        return p.ForeignType(this.pos, this.cmeta, this.name, this.target);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_ForeignType;
    }
}
exports.$$Declaration$_ForeignType = $$Declaration$_ForeignType;
class $$Declaration$_Relation extends Declaration {
    constructor(pos, cmeta, signature) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Relation" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(signature, "Signature<RelationPart>", Signature));
    }
    match(p) {
        return p.Relation(this.pos, this.cmeta, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Relation;
    }
}
exports.$$Declaration$_Relation = $$Declaration$_Relation;
class $$Declaration$_Do extends Declaration {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Do" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.Do(this.pos, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Do;
    }
}
exports.$$Declaration$_Do = $$Declaration$_Do;
class $$Declaration$_Command extends Declaration {
    constructor(pos, cmeta, signature, contract, body, ttest) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        this.contract = contract;
        this.body = body;
        this.ttest = ttest;
        Object.defineProperty(this, "tag", { value: "Command" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(signature, "Signature<Parameter>", Signature));
        ($assert_type(contract, "Contract", Contract));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
        ($assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest)));
    }
    match(p) {
        return p.Command(this.pos, this.cmeta, this.signature, this.contract, this.body, this.ttest);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Command;
    }
}
exports.$$Declaration$_Command = $$Declaration$_Command;
class $$Declaration$_Define extends Declaration {
    constructor(pos, cmeta, name, value) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Define" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Define(this.pos, this.cmeta, this.name, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Define;
    }
}
exports.$$Declaration$_Define = $$Declaration$_Define;
class $$Declaration$_AbstractType extends Declaration {
    constructor(pos, cmeta, typ) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "AbstractType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(typ, "TypeDef", TypeDef));
    }
    match(p) {
        return p.AbstractType(this.pos, this.cmeta, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_AbstractType;
    }
}
exports.$$Declaration$_AbstractType = $$Declaration$_AbstractType;
class $$Declaration$_EnumType extends Declaration {
    constructor(pos, cmeta, name, variants) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.variants = variants;
        Object.defineProperty(this, "tag", { value: "EnumType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(variants, "Name[]", $is_array(Name)));
    }
    match(p) {
        return p.EnumType(this.pos, this.cmeta, this.name, this.variants);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_EnumType;
    }
}
exports.$$Declaration$_EnumType = $$Declaration$_EnumType;
class $$Declaration$_SingletonType extends Declaration {
    constructor(pos, cmeta, typ, init) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.typ = typ;
        this.init = init;
        Object.defineProperty(this, "tag", { value: "SingletonType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(typ, "TypeDef", TypeDef));
        ($assert_type(init, "TypeInit[]", $is_array(TypeInit)));
    }
    match(p) {
        return p.SingletonType(this.pos, this.cmeta, this.typ, this.init);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_SingletonType;
    }
}
exports.$$Declaration$_SingletonType = $$Declaration$_SingletonType;
class $$Declaration$_Type extends Declaration {
    constructor(pos, cmeta, typ, fields) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.typ = typ;
        this.fields = fields;
        Object.defineProperty(this, "tag", { value: "Type" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(typ, "TypeDef", TypeDef));
        ($assert_type(fields, "TypeField[]", $is_array(TypeField)));
    }
    match(p) {
        return p.Type(this.pos, this.cmeta, this.typ, this.fields);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Type;
    }
}
exports.$$Declaration$_Type = $$Declaration$_Type;
class $$Declaration$_Trait extends Declaration {
    constructor(pos, cmeta, name) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Trait" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Trait(this.pos, this.cmeta, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Trait;
    }
}
exports.$$Declaration$_Trait = $$Declaration$_Trait;
class $$Declaration$_ImplementTrait extends Declaration {
    constructor(pos, typ, trait) {
        super();
        this.pos = pos;
        this.typ = typ;
        this.trait = trait;
        Object.defineProperty(this, "tag", { value: "ImplementTrait" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
        ($assert_type(trait, "Trait", Trait));
    }
    match(p) {
        return p.ImplementTrait(this.pos, this.typ, this.trait);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_ImplementTrait;
    }
}
exports.$$Declaration$_ImplementTrait = $$Declaration$_ImplementTrait;
class $$Declaration$_Action extends Declaration {
    constructor(pos, cmeta, self, name, title, pred, rank, body, commands) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.self = self;
        this.name = name;
        this.title = title;
        this.pred = pred;
        this.rank = rank;
        this.body = body;
        this.commands = commands;
        Object.defineProperty(this, "tag", { value: "Action" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(self, "Parameter", Parameter));
        ($assert_type(name, "Name", Name));
        ($assert_type(title, "(Expression | null)", $is_maybe(Expression)));
        ($assert_type(pred, "Predicate", Predicate));
        ($assert_type(rank, "Rank", Rank));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
        ($assert_type(commands, "TypeInit[]", $is_array(TypeInit)));
    }
    match(p) {
        return p.Action(this.pos, this.cmeta, this.self, this.name, this.title, this.pred, this.rank, this.body, this.commands);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Action;
    }
}
exports.$$Declaration$_Action = $$Declaration$_Action;
class $$Declaration$_When extends Declaration {
    constructor(pos, cmeta, pred, body) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.pred = pred;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "When" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(pred, "Predicate", Predicate));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.When(this.pos, this.cmeta, this.pred, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_When;
    }
}
exports.$$Declaration$_When = $$Declaration$_When;
class $$Declaration$_Context extends Declaration {
    constructor(pos, cmeta, name, items) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.items = items;
        Object.defineProperty(this, "tag", { value: "Context" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(items, "Declaration[]", $is_array(Declaration)));
    }
    match(p) {
        return p.Context(this.pos, this.cmeta, this.name, this.items);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Context;
    }
}
exports.$$Declaration$_Context = $$Declaration$_Context;
class $$Declaration$_Open extends Declaration {
    constructor(pos, ns) {
        super();
        this.pos = pos;
        this.ns = ns;
        Object.defineProperty(this, "tag", { value: "Open" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(ns, "Namespace", Namespace));
    }
    match(p) {
        return p.Open(this.pos, this.ns);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Open;
    }
}
exports.$$Declaration$_Open = $$Declaration$_Open;
class $$Declaration$_Local extends Declaration {
    constructor(pos, decl) {
        super();
        this.pos = pos;
        this.decl = decl;
        Object.defineProperty(this, "tag", { value: "Local" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(decl, "Declaration", Declaration));
    }
    match(p) {
        return p.Local(this.pos, this.decl);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Local;
    }
}
exports.$$Declaration$_Local = $$Declaration$_Local;
class $$Declaration$_Test extends Declaration {
    constructor(pos, title, body) {
        super();
        this.pos = pos;
        this.title = title;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Test" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(title, "String", String));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.Test(this.pos, this.title, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Test;
    }
}
exports.$$Declaration$_Test = $$Declaration$_Test;
class $$Declaration$_Effect extends Declaration {
    constructor(pos, cmeta, name, cases) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.cases = cases;
        Object.defineProperty(this, "tag", { value: "Effect" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(cases, "EffectCase[]", $is_array(EffectCase)));
    }
    match(p) {
        return p.Effect(this.pos, this.cmeta, this.name, this.cases);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Effect;
    }
}
exports.$$Declaration$_Effect = $$Declaration$_Effect;
class $$Declaration$_Capability extends Declaration {
    constructor(pos, cmeta, name) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Capability" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Capability(this.pos, this.cmeta, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Capability;
    }
}
exports.$$Declaration$_Capability = $$Declaration$_Capability;
class $$Declaration$_Protect extends Declaration {
    constructor(pos, capability, entity) {
        super();
        this.pos = pos;
        this.capability = capability;
        this.entity = entity;
        Object.defineProperty(this, "tag", { value: "Protect" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(capability, "Name", Name));
        ($assert_type(entity, "ProtectEntity", ProtectEntity));
    }
    match(p) {
        return p.Protect(this.pos, this.capability, this.entity);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Protect;
    }
}
exports.$$Declaration$_Protect = $$Declaration$_Protect;
class ProtectEntity extends Node {
    static get Type() {
        return $$ProtectEntity$_Type;
    }
    static get Trait() {
        return $$ProtectEntity$_Trait;
    }
    static get Effect() {
        return $$ProtectEntity$_Effect;
    }
    static get Definition() {
        return $$ProtectEntity$_Definition;
    }
    static has_instance(x) {
        return x instanceof ProtectEntity;
    }
}
exports.ProtectEntity = ProtectEntity;
class $$ProtectEntity$_Type extends ProtectEntity {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Type" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Type(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$ProtectEntity$_Type;
    }
}
exports.$$ProtectEntity$_Type = $$ProtectEntity$_Type;
class $$ProtectEntity$_Trait extends ProtectEntity {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Trait" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Trait(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$ProtectEntity$_Trait;
    }
}
exports.$$ProtectEntity$_Trait = $$ProtectEntity$_Trait;
class $$ProtectEntity$_Effect extends ProtectEntity {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Effect" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Effect(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$ProtectEntity$_Effect;
    }
}
exports.$$ProtectEntity$_Effect = $$ProtectEntity$_Effect;
class $$ProtectEntity$_Definition extends ProtectEntity {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Definition" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Definition(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$ProtectEntity$_Definition;
    }
}
exports.$$ProtectEntity$_Definition = $$ProtectEntity$_Definition;
class EffectCase extends Node {
    constructor(pos, cmeta, name, params) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.params = params;
        Object.defineProperty(this, "tag", { value: "EffectCase" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(name, "Name", Name));
        ($assert_type(params, "Parameter[]", $is_array(Parameter)));
    }
    static has_instance(x) {
        return x instanceof EffectCase;
    }
}
exports.EffectCase = EffectCase;
class Handler extends Node {
    constructor(pos, name, variant, args, body) {
        super();
        this.pos = pos;
        this.name = name;
        this.variant = variant;
        this.args = args;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Handler" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(variant, "Name", Name));
        ($assert_type(args, "Name[]", $is_array(Name)));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    static has_instance(x) {
        return x instanceof Handler;
    }
}
exports.Handler = Handler;
class TrailingTest extends Node {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "TrailingTest" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    static has_instance(x) {
        return x instanceof TrailingTest;
    }
}
exports.TrailingTest = TrailingTest;
class Contract extends Node {
    constructor(pos, ret, pre, post) {
        super();
        this.pos = pos;
        this.ret = ret;
        this.pre = pre;
        this.post = post;
        Object.defineProperty(this, "tag", { value: "Contract" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(ret, "(TypeConstraint | null)", $is_maybe(TypeConstraint)));
        ($assert_type(pre, "ContractCondition[]", $is_array(ContractCondition)));
        ($assert_type(post, "ContractCondition[]", $is_array(ContractCondition)));
    }
    static has_instance(x) {
        return x instanceof Contract;
    }
}
exports.Contract = Contract;
class ContractCondition extends Node {
    constructor(pos, name, expr) {
        super();
        this.pos = pos;
        this.name = name;
        this.expr = expr;
        Object.defineProperty(this, "tag", { value: "ContractCondition" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(expr, "Expression", Expression));
    }
    static has_instance(x) {
        return x instanceof ContractCondition;
    }
}
exports.ContractCondition = ContractCondition;
class TypeDef extends Node {
    constructor(parent, name) {
        super();
        this.parent = parent;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "TypeDef" });
        ($assert_type(parent, "(TypeConstraint | null)", $is_maybe(TypeConstraint)));
        ($assert_type(name, "Name", Name));
    }
    static has_instance(x) {
        return x instanceof TypeDef;
    }
}
exports.TypeDef = TypeDef;
class FFI extends Node {
    constructor(pos, name, args) {
        super();
        this.pos = pos;
        this.name = name;
        this.args = args;
        Object.defineProperty(this, "tag", { value: "FFI" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Namespace", Namespace));
        ($assert_type(args, "Name[]", $is_array(Name)));
    }
    static has_instance(x) {
        return x instanceof FFI;
    }
}
exports.FFI = FFI;
class TypeField extends Node {
    constructor(pos, visibility, parameter) {
        super();
        this.pos = pos;
        this.visibility = visibility;
        this.parameter = parameter;
        Object.defineProperty(this, "tag", { value: "TypeField" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(visibility, "FieldVisibility", FieldVisibility));
        ($assert_type(parameter, "Parameter", Parameter));
    }
    static has_instance(x) {
        return x instanceof TypeField;
    }
}
exports.TypeField = TypeField;
class FieldVisibility extends Node {
    static get Local() {
        return $$FieldVisibility$_Local;
    }
    static get Global() {
        return $$FieldVisibility$_Global;
    }
    static has_instance(x) {
        return x instanceof FieldVisibility;
    }
}
exports.FieldVisibility = FieldVisibility;
class $$FieldVisibility$_Local extends FieldVisibility {
    constructor() {
        super();
        Object.defineProperty(this, "tag", { value: "Local" });
    }
    match(p) {
        return p.Local();
    }
    static has_instance(x) {
        return x instanceof $$FieldVisibility$_Local;
    }
}
exports.$$FieldVisibility$_Local = $$FieldVisibility$_Local;
class $$FieldVisibility$_Global extends FieldVisibility {
    constructor() {
        super();
        Object.defineProperty(this, "tag", { value: "Global" });
    }
    match(p) {
        return p.Global();
    }
    static has_instance(x) {
        return x instanceof $$FieldVisibility$_Global;
    }
}
exports.$$FieldVisibility$_Global = $$FieldVisibility$_Global;
class Rank extends Node {
    static get Expr() {
        return $$Rank$_Expr;
    }
    static get Unranked() {
        return $$Rank$_Unranked;
    }
    static has_instance(x) {
        return x instanceof Rank;
    }
}
exports.Rank = Rank;
class $$Rank$_Expr extends Rank {
    constructor(expr) {
        super();
        this.expr = expr;
        Object.defineProperty(this, "tag", { value: "Expr" });
        ($assert_type(expr, "Expression", Expression));
    }
    match(p) {
        return p.Expr(this.expr);
    }
    static has_instance(x) {
        return x instanceof $$Rank$_Expr;
    }
}
exports.$$Rank$_Expr = $$Rank$_Expr;
class $$Rank$_Unranked extends Rank {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Unranked" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Unranked(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Rank$_Unranked;
    }
}
exports.$$Rank$_Unranked = $$Rank$_Unranked;
class TypeInit extends Node {
    static get Fact() {
        return $$TypeInit$_Fact;
    }
    static get Command() {
        return $$TypeInit$_Command;
    }
    static has_instance(x) {
        return x instanceof TypeInit;
    }
}
exports.TypeInit = TypeInit;
class $$TypeInit$_Fact extends TypeInit {
    constructor(pos, sig) {
        super();
        this.pos = pos;
        this.sig = sig;
        Object.defineProperty(this, "tag", { value: "Fact" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(sig, "PartialSignature<Expression>", PartialSignature));
    }
    match(p) {
        return p.Fact(this.pos, this.sig);
    }
    static has_instance(x) {
        return x instanceof $$TypeInit$_Fact;
    }
}
exports.$$TypeInit$_Fact = $$TypeInit$_Fact;
class $$TypeInit$_Command extends TypeInit {
    constructor(pos, cmeta, sig, contract, body, ttest) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.sig = sig;
        this.contract = contract;
        this.body = body;
        this.ttest = ttest;
        Object.defineProperty(this, "tag", { value: "Command" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cmeta, "Metadata", Metadata));
        ($assert_type(sig, "PartialSignature<Parameter>", PartialSignature));
        ($assert_type(contract, "Contract", Contract));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
        ($assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest)));
    }
    match(p) {
        return p.Command(this.pos, this.cmeta, this.sig, this.contract, this.body, this.ttest);
    }
    static has_instance(x) {
        return x instanceof $$TypeInit$_Command;
    }
}
exports.$$TypeInit$_Command = $$TypeInit$_Command;
class Parameter extends Node {
    static get Untyped() {
        return $$Parameter$_Untyped;
    }
    static get Typed() {
        return $$Parameter$_Typed;
    }
    static get TypedOnly() {
        return $$Parameter$_TypedOnly;
    }
    static has_instance(x) {
        return x instanceof Parameter;
    }
}
exports.Parameter = Parameter;
class $$Parameter$_Untyped extends Parameter {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Untyped" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Untyped(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Parameter$_Untyped;
    }
}
exports.$$Parameter$_Untyped = $$Parameter$_Untyped;
class $$Parameter$_Typed extends Parameter {
    constructor(pos, name, typ) {
        super();
        this.pos = pos;
        this.name = name;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Typed" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(typ, "TypeConstraint", TypeConstraint));
    }
    match(p) {
        return p.Typed(this.pos, this.name, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Parameter$_Typed;
    }
}
exports.$$Parameter$_Typed = $$Parameter$_Typed;
class $$Parameter$_TypedOnly extends Parameter {
    constructor(pos, typ) {
        super();
        this.pos = pos;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "TypedOnly" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeConstraint", TypeConstraint));
    }
    match(p) {
        return p.TypedOnly(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Parameter$_TypedOnly;
    }
}
exports.$$Parameter$_TypedOnly = $$Parameter$_TypedOnly;
class TypeApp extends Node {
    static get Named() {
        return $$TypeApp$_Named;
    }
    static get Static() {
        return $$TypeApp$_Static;
    }
    static get Function() {
        return $$TypeApp$_Function;
    }
    static get Any() {
        return $$TypeApp$_Any;
    }
    static has_instance(x) {
        return x instanceof TypeApp;
    }
}
exports.TypeApp = TypeApp;
class $$TypeApp$_Named extends TypeApp {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Named" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Named(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Named;
    }
}
exports.$$TypeApp$_Named = $$TypeApp$_Named;
class $$TypeApp$_Static extends TypeApp {
    constructor(pos, typ) {
        super();
        this.pos = pos;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Static" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.Static(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Static;
    }
}
exports.$$TypeApp$_Static = $$TypeApp$_Static;
class $$TypeApp$_Function extends TypeApp {
    constructor(pos, args, ret) {
        super();
        this.pos = pos;
        this.args = args;
        this.ret = ret;
        Object.defineProperty(this, "tag", { value: "Function" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(args, "TypeConstraint[]", $is_array(TypeConstraint)));
        ($assert_type(ret, "TypeConstraint", TypeConstraint));
    }
    match(p) {
        return p.Function(this.pos, this.args, this.ret);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Function;
    }
}
exports.$$TypeApp$_Function = $$TypeApp$_Function;
class $$TypeApp$_Any extends TypeApp {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Any" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Any(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Any;
    }
}
exports.$$TypeApp$_Any = $$TypeApp$_Any;
class TypeConstraint extends Node {
    static get Type() {
        return $$TypeConstraint$_Type;
    }
    static get Has() {
        return $$TypeConstraint$_Has;
    }
    static has_instance(x) {
        return x instanceof TypeConstraint;
    }
}
exports.TypeConstraint = TypeConstraint;
class $$TypeConstraint$_Type extends TypeConstraint {
    constructor(pos, typ) {
        super();
        this.pos = pos;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Type" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.Type(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$TypeConstraint$_Type;
    }
}
exports.$$TypeConstraint$_Type = $$TypeConstraint$_Type;
class $$TypeConstraint$_Has extends TypeConstraint {
    constructor(pos, typ, traits) {
        super();
        this.pos = pos;
        this.typ = typ;
        this.traits = traits;
        Object.defineProperty(this, "tag", { value: "Has" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeConstraint", TypeConstraint));
        ($assert_type(traits, "Trait[]", $is_array(Trait)));
    }
    match(p) {
        return p.Has(this.pos, this.typ, this.traits);
    }
    static has_instance(x) {
        return x instanceof $$TypeConstraint$_Has;
    }
}
exports.$$TypeConstraint$_Has = $$TypeConstraint$_Has;
class Trait extends Node {
    static get Named() {
        return $$Trait$_Named;
    }
    static has_instance(x) {
        return x instanceof Trait;
    }
}
exports.Trait = Trait;
class $$Trait$_Named extends Trait {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Named" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Named(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Trait$_Named;
    }
}
exports.$$Trait$_Named = $$Trait$_Named;
class Statement extends Node {
    static get Fact() {
        return $$Statement$_Fact;
    }
    static get Forget() {
        return $$Statement$_Forget;
    }
    static get Let() {
        return $$Statement$_Let;
    }
    static get Simulate() {
        return $$Statement$_Simulate;
    }
    static get Assert() {
        return $$Statement$_Assert;
    }
    static get Expr() {
        return $$Statement$_Expr;
    }
    static has_instance(x) {
        return x instanceof Statement;
    }
}
exports.Statement = Statement;
class $$Statement$_Fact extends Statement {
    constructor(pos, signature) {
        super();
        this.pos = pos;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Fact" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Expression>", Signature));
    }
    match(p) {
        return p.Fact(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Fact;
    }
}
exports.$$Statement$_Fact = $$Statement$_Fact;
class $$Statement$_Forget extends Statement {
    constructor(pos, signature) {
        super();
        this.pos = pos;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Forget" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Expression>", Signature));
    }
    match(p) {
        return p.Forget(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Forget;
    }
}
exports.$$Statement$_Forget = $$Statement$_Forget;
class $$Statement$_Let extends Statement {
    constructor(pos, name, value) {
        super();
        this.pos = pos;
        this.name = name;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Let" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Let(this.pos, this.name, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Let;
    }
}
exports.$$Statement$_Let = $$Statement$_Let;
class $$Statement$_Simulate extends Statement {
    constructor(pos, actors, context, goal, signals) {
        super();
        this.pos = pos;
        this.actors = actors;
        this.context = context;
        this.goal = goal;
        this.signals = signals;
        Object.defineProperty(this, "tag", { value: "Simulate" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(actors, "Expression", Expression));
        ($assert_type(context, "SimulationContext", SimulationContext));
        ($assert_type(goal, "SimulationGoal", SimulationGoal));
        ($assert_type(signals, "Signal[]", $is_array(Signal)));
    }
    match(p) {
        return p.Simulate(this.pos, this.actors, this.context, this.goal, this.signals);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Simulate;
    }
}
exports.$$Statement$_Simulate = $$Statement$_Simulate;
class $$Statement$_Assert extends Statement {
    constructor(pos, expr) {
        super();
        this.pos = pos;
        this.expr = expr;
        Object.defineProperty(this, "tag", { value: "Assert" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(expr, "Expression", Expression));
    }
    match(p) {
        return p.Assert(this.pos, this.expr);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Assert;
    }
}
exports.$$Statement$_Assert = $$Statement$_Assert;
class $$Statement$_Expr extends Statement {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Expr" });
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Expr(this.value);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Expr;
    }
}
exports.$$Statement$_Expr = $$Statement$_Expr;
class SimulationContext extends Node {
    static get Global() {
        return $$SimulationContext$_Global;
    }
    static get Named() {
        return $$SimulationContext$_Named;
    }
    static has_instance(x) {
        return x instanceof SimulationContext;
    }
}
exports.SimulationContext = SimulationContext;
class $$SimulationContext$_Global extends SimulationContext {
    constructor() {
        super();
        Object.defineProperty(this, "tag", { value: "Global" });
    }
    match(p) {
        return p.Global();
    }
    static has_instance(x) {
        return x instanceof $$SimulationContext$_Global;
    }
}
exports.$$SimulationContext$_Global = $$SimulationContext$_Global;
class $$SimulationContext$_Named extends SimulationContext {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Named" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Named(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$SimulationContext$_Named;
    }
}
exports.$$SimulationContext$_Named = $$SimulationContext$_Named;
class Signal extends Node {
    constructor(pos, signature, body) {
        super();
        this.pos = pos;
        this.signature = signature;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Signal" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Parameter>", Signature));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    static has_instance(x) {
        return x instanceof Signal;
    }
}
exports.Signal = Signal;
class Expression extends Node {
    static get New() {
        return $$Expression$_New;
    }
    static get Invoke() {
        return $$Expression$_Invoke;
    }
    static get Global() {
        return $$Expression$_Global;
    }
    static get Variable() {
        return $$Expression$_Variable;
    }
    static get Self() {
        return $$Expression$_Self;
    }
    static get List() {
        return $$Expression$_List;
    }
    static get Record() {
        return $$Expression$_Record;
    }
    static get Search() {
        return $$Expression$_Search;
    }
    static get MatchSearch() {
        return $$Expression$_MatchSearch;
    }
    static get Project() {
        return $$Expression$_Project;
    }
    static get Select() {
        return $$Expression$_Select;
    }
    static get For() {
        return $$Expression$_For;
    }
    static get Block() {
        return $$Expression$_Block;
    }
    static get Apply() {
        return $$Expression$_Apply;
    }
    static get Pipe() {
        return $$Expression$_Pipe;
    }
    static get PipeInvoke() {
        return $$Expression$_PipeInvoke;
    }
    static get Interpolate() {
        return $$Expression$_Interpolate;
    }
    static get Condition() {
        return $$Expression$_Condition;
    }
    static get HasType() {
        return $$Expression$_HasType;
    }
    static get HasTrait() {
        return $$Expression$_HasTrait;
    }
    static get Force() {
        return $$Expression$_Force;
    }
    static get Lazy() {
        return $$Expression$_Lazy;
    }
    static get Hole() {
        return $$Expression$_Hole;
    }
    static get Return() {
        return $$Expression$_Return;
    }
    static get Type() {
        return $$Expression$_Type;
    }
    static get Lambda() {
        return $$Expression$_Lambda;
    }
    static get IntrinsicEqual() {
        return $$Expression$_IntrinsicEqual;
    }
    static get ForeignInvoke() {
        return $$Expression$_ForeignInvoke;
    }
    static get Parens() {
        return $$Expression$_Parens;
    }
    static get Lit() {
        return $$Expression$_Lit;
    }
    static get Handle() {
        return $$Expression$_Handle;
    }
    static get Perform() {
        return $$Expression$_Perform;
    }
    static get ContinueWith() {
        return $$Expression$_ContinueWith;
    }
    static get Dsl() {
        return $$Expression$_Dsl;
    }
    static has_instance(x) {
        return x instanceof Expression;
    }
}
exports.Expression = Expression;
class $$Expression$_New extends Expression {
    constructor(pos, typ, fields) {
        super();
        this.pos = pos;
        this.typ = typ;
        this.fields = fields;
        Object.defineProperty(this, "tag", { value: "New" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "Name", Name));
        ($assert_type(fields, "Expression[]", $is_array(Expression)));
    }
    match(p) {
        return p.New(this.pos, this.typ, this.fields);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_New;
    }
}
exports.$$Expression$_New = $$Expression$_New;
class $$Expression$_Invoke extends Expression {
    constructor(pos, signature) {
        super();
        this.pos = pos;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Invoke" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Expression>", Signature));
    }
    match(p) {
        return p.Invoke(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Invoke;
    }
}
exports.$$Expression$_Invoke = $$Expression$_Invoke;
class $$Expression$_Global extends Expression {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Global" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Global(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Global;
    }
}
exports.$$Expression$_Global = $$Expression$_Global;
class $$Expression$_Variable extends Expression {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Variable" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Variable(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Variable;
    }
}
exports.$$Expression$_Variable = $$Expression$_Variable;
class $$Expression$_Self extends Expression {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Self" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Self(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Self;
    }
}
exports.$$Expression$_Self = $$Expression$_Self;
class $$Expression$_List extends Expression {
    constructor(pos, values) {
        super();
        this.pos = pos;
        this.values = values;
        Object.defineProperty(this, "tag", { value: "List" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(values, "Expression[]", $is_array(Expression)));
    }
    match(p) {
        return p.List(this.pos, this.values);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_List;
    }
}
exports.$$Expression$_List = $$Expression$_List;
class $$Expression$_Record extends Expression {
    constructor(pos, pairs) {
        super();
        this.pos = pos;
        this.pairs = pairs;
        Object.defineProperty(this, "tag", { value: "Record" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pairs, "Pair<RecordField, Expression>[]", $is_array(Pair)));
    }
    match(p) {
        return p.Record(this.pos, this.pairs);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Record;
    }
}
exports.$$Expression$_Record = $$Expression$_Record;
class $$Expression$_Search extends Expression {
    constructor(pos, predicate) {
        super();
        this.pos = pos;
        this.predicate = predicate;
        Object.defineProperty(this, "tag", { value: "Search" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(predicate, "Predicate", Predicate));
    }
    match(p) {
        return p.Search(this.pos, this.predicate);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Search;
    }
}
exports.$$Expression$_Search = $$Expression$_Search;
class $$Expression$_MatchSearch extends Expression {
    constructor(pos, cases) {
        super();
        this.pos = pos;
        this.cases = cases;
        Object.defineProperty(this, "tag", { value: "MatchSearch" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cases, "MatchSearchCase[]", $is_array(MatchSearchCase)));
    }
    match(p) {
        return p.MatchSearch(this.pos, this.cases);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_MatchSearch;
    }
}
exports.$$Expression$_MatchSearch = $$Expression$_MatchSearch;
class $$Expression$_Project extends Expression {
    constructor(pos, object, field) {
        super();
        this.pos = pos;
        this.object = object;
        this.field = field;
        Object.defineProperty(this, "tag", { value: "Project" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(object, "Expression", Expression));
        ($assert_type(field, "RecordField", RecordField));
    }
    match(p) {
        return p.Project(this.pos, this.object, this.field);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Project;
    }
}
exports.$$Expression$_Project = $$Expression$_Project;
class $$Expression$_Select extends Expression {
    constructor(pos, object, fields) {
        super();
        this.pos = pos;
        this.object = object;
        this.fields = fields;
        Object.defineProperty(this, "tag", { value: "Select" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(object, "Expression", Expression));
        ($assert_type(fields, "Projection[]", $is_array(Projection)));
    }
    match(p) {
        return p.Select(this.pos, this.object, this.fields);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Select;
    }
}
exports.$$Expression$_Select = $$Expression$_Select;
class $$Expression$_For extends Expression {
    constructor(pos, comprehension) {
        super();
        this.pos = pos;
        this.comprehension = comprehension;
        Object.defineProperty(this, "tag", { value: "For" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(comprehension, "ForExpression", ForExpression));
    }
    match(p) {
        return p.For(this.pos, this.comprehension);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_For;
    }
}
exports.$$Expression$_For = $$Expression$_For;
class $$Expression$_Block extends Expression {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Block" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.Block(this.pos, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Block;
    }
}
exports.$$Expression$_Block = $$Expression$_Block;
class $$Expression$_Apply extends Expression {
    constructor(pos, partial, values) {
        super();
        this.pos = pos;
        this.partial = partial;
        this.values = values;
        Object.defineProperty(this, "tag", { value: "Apply" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(partial, "Expression", Expression));
        ($assert_type(values, "Expression[]", $is_array(Expression)));
    }
    match(p) {
        return p.Apply(this.pos, this.partial, this.values);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Apply;
    }
}
exports.$$Expression$_Apply = $$Expression$_Apply;
class $$Expression$_Pipe extends Expression {
    constructor(pos, left, right) {
        super();
        this.pos = pos;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "Pipe" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(left, "Expression", Expression));
        ($assert_type(right, "Expression", Expression));
    }
    match(p) {
        return p.Pipe(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Pipe;
    }
}
exports.$$Expression$_Pipe = $$Expression$_Pipe;
class $$Expression$_PipeInvoke extends Expression {
    constructor(pos, left, right) {
        super();
        this.pos = pos;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "PipeInvoke" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(left, "Expression", Expression));
        ($assert_type(right, "PartialSignature<Expression>", PartialSignature));
    }
    match(p) {
        return p.PipeInvoke(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_PipeInvoke;
    }
}
exports.$$Expression$_PipeInvoke = $$Expression$_PipeInvoke;
class $$Expression$_Interpolate extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Interpolate" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Interpolation<Expression>", Interpolation));
    }
    match(p) {
        return p.Interpolate(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Interpolate;
    }
}
exports.$$Expression$_Interpolate = $$Expression$_Interpolate;
class $$Expression$_Condition extends Expression {
    constructor(pos, cases) {
        super();
        this.pos = pos;
        this.cases = cases;
        Object.defineProperty(this, "tag", { value: "Condition" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(cases, "ConditionCase[]", $is_array(ConditionCase)));
    }
    match(p) {
        return p.Condition(this.pos, this.cases);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Condition;
    }
}
exports.$$Expression$_Condition = $$Expression$_Condition;
class $$Expression$_HasType extends Expression {
    constructor(pos, value, typ) {
        super();
        this.pos = pos;
        this.value = value;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "HasType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.HasType(this.pos, this.value, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_HasType;
    }
}
exports.$$Expression$_HasType = $$Expression$_HasType;
class $$Expression$_HasTrait extends Expression {
    constructor(pos, value, typ) {
        super();
        this.pos = pos;
        this.value = value;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "HasTrait" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
        ($assert_type(typ, "Trait", Trait));
    }
    match(p) {
        return p.HasTrait(this.pos, this.value, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_HasTrait;
    }
}
exports.$$Expression$_HasTrait = $$Expression$_HasTrait;
class $$Expression$_Force extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Force" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Force(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Force;
    }
}
exports.$$Expression$_Force = $$Expression$_Force;
class $$Expression$_Lazy extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Lazy" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Lazy(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Lazy;
    }
}
exports.$$Expression$_Lazy = $$Expression$_Lazy;
class $$Expression$_Hole extends Expression {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Hole" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Hole(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Hole;
    }
}
exports.$$Expression$_Hole = $$Expression$_Hole;
class $$Expression$_Return extends Expression {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Return" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Return(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Return;
    }
}
exports.$$Expression$_Return = $$Expression$_Return;
class $$Expression$_Type extends Expression {
    constructor(pos, typ) {
        super();
        this.pos = pos;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Type" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.Type(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Type;
    }
}
exports.$$Expression$_Type = $$Expression$_Type;
class $$Expression$_Lambda extends Expression {
    constructor(pos, params, body) {
        super();
        this.pos = pos;
        this.params = params;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Lambda" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(params, "Name[]", $is_array(Name)));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.Lambda(this.pos, this.params, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Lambda;
    }
}
exports.$$Expression$_Lambda = $$Expression$_Lambda;
class $$Expression$_IntrinsicEqual extends Expression {
    constructor(pos, left, right) {
        super();
        this.pos = pos;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "IntrinsicEqual" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(left, "Expression", Expression));
        ($assert_type(right, "Expression", Expression));
    }
    match(p) {
        return p.IntrinsicEqual(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_IntrinsicEqual;
    }
}
exports.$$Expression$_IntrinsicEqual = $$Expression$_IntrinsicEqual;
class $$Expression$_ForeignInvoke extends Expression {
    constructor(pos, name, args) {
        super();
        this.pos = pos;
        this.name = name;
        this.args = args;
        Object.defineProperty(this, "tag", { value: "ForeignInvoke" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Namespace", Namespace));
        ($assert_type(args, "Expression[]", $is_array(Expression)));
    }
    match(p) {
        return p.ForeignInvoke(this.pos, this.name, this.args);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_ForeignInvoke;
    }
}
exports.$$Expression$_ForeignInvoke = $$Expression$_ForeignInvoke;
class $$Expression$_Parens extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Parens" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Parens(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Parens;
    }
}
exports.$$Expression$_Parens = $$Expression$_Parens;
class $$Expression$_Lit extends Expression {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Lit" });
        ($assert_type(value, "Literal", Literal));
    }
    match(p) {
        return p.Lit(this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Lit;
    }
}
exports.$$Expression$_Lit = $$Expression$_Lit;
class $$Expression$_Handle extends Expression {
    constructor(pos, body, handlers) {
        super();
        this.pos = pos;
        this.body = body;
        this.handlers = handlers;
        Object.defineProperty(this, "tag", { value: "Handle" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
        ($assert_type(handlers, "Handler[]", $is_array(Handler)));
    }
    match(p) {
        return p.Handle(this.pos, this.body, this.handlers);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Handle;
    }
}
exports.$$Expression$_Handle = $$Expression$_Handle;
class $$Expression$_Perform extends Expression {
    constructor(pos, effect, variant, args) {
        super();
        this.pos = pos;
        this.effect = effect;
        this.variant = variant;
        this.args = args;
        Object.defineProperty(this, "tag", { value: "Perform" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(effect, "Name", Name));
        ($assert_type(variant, "Name", Name));
        ($assert_type(args, "Expression[]", $is_array(Expression)));
    }
    match(p) {
        return p.Perform(this.pos, this.effect, this.variant, this.args);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Perform;
    }
}
exports.$$Expression$_Perform = $$Expression$_Perform;
class $$Expression$_ContinueWith extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "ContinueWith" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.ContinueWith(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_ContinueWith;
    }
}
exports.$$Expression$_ContinueWith = $$Expression$_ContinueWith;
class $$Expression$_Dsl extends Expression {
    constructor(pos, language, ast) {
        super();
        this.pos = pos;
        this.language = language;
        this.ast = ast;
        Object.defineProperty(this, "tag", { value: "Dsl" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(language, "TypeApp", TypeApp));
        ($assert_type(ast, "DslAst[]", $is_array(DslAst)));
    }
    match(p) {
        return p.Dsl(this.pos, this.language, this.ast);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Dsl;
    }
}
exports.$$Expression$_Dsl = $$Expression$_Dsl;
class DslAst extends Node {
    static get Node() {
        return $$DslAst$_Node;
    }
    static get Lit() {
        return $$DslAst$_Lit;
    }
    static get Var() {
        return $$DslAst$_Var;
    }
    static get List() {
        return $$DslAst$_List;
    }
    static get Interpolation() {
        return $$DslAst$_Interpolation;
    }
    static get Dynamic() {
        return $$DslAst$_Dynamic;
    }
    static has_instance(x) {
        return x instanceof DslAst;
    }
}
exports.DslAst = DslAst;
class $$DslAst$_Node extends DslAst {
    constructor(pos, sig, attrs) {
        super();
        this.pos = pos;
        this.sig = sig;
        this.attrs = attrs;
        Object.defineProperty(this, "tag", { value: "Node" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(sig, "DslSignature<DslAst>[]", $is_array(DslSignature)));
        ($assert_type(attrs, "DslAttr[]", $is_array(DslAttr)));
    }
    match(p) {
        return p.Node(this.pos, this.sig, this.attrs);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_Node;
    }
}
exports.$$DslAst$_Node = $$DslAst$_Node;
class $$DslAst$_Lit extends DslAst {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Lit" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Literal", Literal));
    }
    match(p) {
        return p.Lit(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_Lit;
    }
}
exports.$$DslAst$_Lit = $$DslAst$_Lit;
class $$DslAst$_Var extends DslAst {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Var" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Var(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_Var;
    }
}
exports.$$DslAst$_Var = $$DslAst$_Var;
class $$DslAst$_List extends DslAst {
    constructor(pos, values) {
        super();
        this.pos = pos;
        this.values = values;
        Object.defineProperty(this, "tag", { value: "List" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(values, "DslAst[]", $is_array(DslAst)));
    }
    match(p) {
        return p.List(this.pos, this.values);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_List;
    }
}
exports.$$DslAst$_List = $$DslAst$_List;
class $$DslAst$_Interpolation extends DslAst {
    constructor(pos, parts) {
        super();
        this.pos = pos;
        this.parts = parts;
        Object.defineProperty(this, "tag", { value: "Interpolation" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(parts, "Interpolation<DslAst>", Interpolation));
    }
    match(p) {
        return p.Interpolation(this.pos, this.parts);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_Interpolation;
    }
}
exports.$$DslAst$_Interpolation = $$DslAst$_Interpolation;
class $$DslAst$_Dynamic extends DslAst {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Dynamic" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Dynamic(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$DslAst$_Dynamic;
    }
}
exports.$$DslAst$_Dynamic = $$DslAst$_Dynamic;
class DslSignature extends Node {
    static get Name() {
        return $$DslSignature$_Name;
    }
    static get Child() {
        return $$DslSignature$_Child;
    }
    static has_instance(x) {
        return x instanceof DslSignature;
    }
}
exports.DslSignature = DslSignature;
class $$DslSignature$_Name extends DslSignature {
    constructor(name) {
        super();
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Name" });
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Name(this.name);
    }
    static has_instance(x) {
        return x instanceof $$DslSignature$_Name;
    }
}
exports.$$DslSignature$_Name = $$DslSignature$_Name;
class $$DslSignature$_Child extends DslSignature {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Child" });
    }
    match(p) {
        return p.Child(this.value);
    }
    static has_instance(x) {
        return x instanceof $$DslSignature$_Child;
    }
}
exports.$$DslSignature$_Child = $$DslSignature$_Child;
class DslAttr extends Node {
    constructor(pos, key, value) {
        super();
        this.pos = pos;
        this.key = key;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "DslAttr" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(key, "Name", Name));
        ($assert_type(value, "DslAst", DslAst));
    }
    static has_instance(x) {
        return x instanceof DslAttr;
    }
}
exports.DslAttr = DslAttr;
class ForExpression extends Node {
    static get Map() {
        return $$ForExpression$_Map;
    }
    static get If() {
        return $$ForExpression$_If;
    }
    static get Do() {
        return $$ForExpression$_Do;
    }
    static has_instance(x) {
        return x instanceof ForExpression;
    }
}
exports.ForExpression = ForExpression;
class $$ForExpression$_Map extends ForExpression {
    constructor(pos, name, stream, body) {
        super();
        this.pos = pos;
        this.name = name;
        this.stream = stream;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Map" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(stream, "Expression", Expression));
        ($assert_type(body, "ForExpression", ForExpression));
    }
    match(p) {
        return p.Map(this.pos, this.name, this.stream, this.body);
    }
    static has_instance(x) {
        return x instanceof $$ForExpression$_Map;
    }
}
exports.$$ForExpression$_Map = $$ForExpression$_Map;
class $$ForExpression$_If extends ForExpression {
    constructor(pos, condition, body) {
        super();
        this.pos = pos;
        this.condition = condition;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "If" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(condition, "Expression", Expression));
        ($assert_type(body, "ForExpression", ForExpression));
    }
    match(p) {
        return p.If(this.pos, this.condition, this.body);
    }
    static has_instance(x) {
        return x instanceof $$ForExpression$_If;
    }
}
exports.$$ForExpression$_If = $$ForExpression$_If;
class $$ForExpression$_Do extends ForExpression {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Do" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(body, "Expression", Expression));
    }
    match(p) {
        return p.Do(this.pos, this.body);
    }
    static has_instance(x) {
        return x instanceof $$ForExpression$_Do;
    }
}
exports.$$ForExpression$_Do = $$ForExpression$_Do;
class MatchSearchCase extends Node {
    constructor(pos, predicate, body) {
        super();
        this.pos = pos;
        this.predicate = predicate;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "MatchSearchCase" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(predicate, "Predicate", Predicate));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    static has_instance(x) {
        return x instanceof MatchSearchCase;
    }
}
exports.MatchSearchCase = MatchSearchCase;
class ConditionCase extends Node {
    constructor(pos, guard, body) {
        super();
        this.pos = pos;
        this.guard = guard;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "ConditionCase" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(guard, "Expression", Expression));
        ($assert_type(body, "Statement[]", $is_array(Statement)));
    }
    static has_instance(x) {
        return x instanceof ConditionCase;
    }
}
exports.ConditionCase = ConditionCase;
class RecordField extends Node {
    static get FName() {
        return $$RecordField$_FName;
    }
    static get FText() {
        return $$RecordField$_FText;
    }
    static get FComputed() {
        return $$RecordField$_FComputed;
    }
    static has_instance(x) {
        return x instanceof RecordField;
    }
}
exports.RecordField = RecordField;
class $$RecordField$_FName extends RecordField {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "FName" });
        ($assert_type(value, "Name", Name));
    }
    match(p) {
        return p.FName(this.value);
    }
    static has_instance(x) {
        return x instanceof $$RecordField$_FName;
    }
}
exports.$$RecordField$_FName = $$RecordField$_FName;
class $$RecordField$_FText extends RecordField {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "FText" });
        ($assert_type(value, "String", String));
    }
    match(p) {
        return p.FText(this.value);
    }
    static has_instance(x) {
        return x instanceof $$RecordField$_FText;
    }
}
exports.$$RecordField$_FText = $$RecordField$_FText;
class $$RecordField$_FComputed extends RecordField {
    constructor(value) {
        super();
        this.value = value;
        Object.defineProperty(this, "tag", { value: "FComputed" });
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.FComputed(this.value);
    }
    static has_instance(x) {
        return x instanceof $$RecordField$_FComputed;
    }
}
exports.$$RecordField$_FComputed = $$RecordField$_FComputed;
class Projection extends Node {
    constructor(pos, name, alias) {
        super();
        this.pos = pos;
        this.name = name;
        this.alias = alias;
        Object.defineProperty(this, "tag", { value: "Projection" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "RecordField", RecordField));
        ($assert_type(alias, "RecordField", RecordField));
    }
    static has_instance(x) {
        return x instanceof Projection;
    }
}
exports.Projection = Projection;
class Interpolation extends Node {
    constructor(pos, parts) {
        super();
        this.pos = pos;
        this.parts = parts;
        Object.defineProperty(this, "tag", { value: "Interpolation" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(parts, "InterpolationPart<T>[]", $is_array(InterpolationPart)));
    }
    static has_instance(x) {
        return x instanceof Interpolation;
    }
}
exports.Interpolation = Interpolation;
class InterpolationPart extends Node {
    static get Escape() {
        return $$InterpolationPart$_Escape;
    }
    static get Static() {
        return $$InterpolationPart$_Static;
    }
    static get Dynamic() {
        return $$InterpolationPart$_Dynamic;
    }
    static has_instance(x) {
        return x instanceof InterpolationPart;
    }
}
exports.InterpolationPart = InterpolationPart;
class $$InterpolationPart$_Escape extends InterpolationPart {
    constructor(pos, character) {
        super();
        this.pos = pos;
        this.character = character;
        Object.defineProperty(this, "tag", { value: "Escape" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(character, "string", $is_type("string")));
    }
    match(p) {
        return p.Escape(this.pos, this.character);
    }
    static has_instance(x) {
        return x instanceof $$InterpolationPart$_Escape;
    }
}
exports.$$InterpolationPart$_Escape = $$InterpolationPart$_Escape;
class $$InterpolationPart$_Static extends InterpolationPart {
    constructor(pos, text) {
        super();
        this.pos = pos;
        this.text = text;
        Object.defineProperty(this, "tag", { value: "Static" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(text, "string", $is_type("string")));
    }
    match(p) {
        return p.Static(this.pos, this.text);
    }
    static has_instance(x) {
        return x instanceof $$InterpolationPart$_Static;
    }
}
exports.$$InterpolationPart$_Static = $$InterpolationPart$_Static;
class $$InterpolationPart$_Dynamic extends InterpolationPart {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Dynamic" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Dynamic(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$InterpolationPart$_Dynamic;
    }
}
exports.$$InterpolationPart$_Dynamic = $$InterpolationPart$_Dynamic;
class Literal extends Node {
    static get False() {
        return $$Literal$_False;
    }
    static get True() {
        return $$Literal$_True;
    }
    static get Nothing() {
        return $$Literal$_Nothing;
    }
    static get Text() {
        return $$Literal$_Text;
    }
    static get Integer() {
        return $$Literal$_Integer;
    }
    static get Float() {
        return $$Literal$_Float;
    }
    static has_instance(x) {
        return x instanceof Literal;
    }
}
exports.Literal = Literal;
class $$Literal$_False extends Literal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "False" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.False(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_False;
    }
}
exports.$$Literal$_False = $$Literal$_False;
class $$Literal$_True extends Literal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "True" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.True(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_True;
    }
}
exports.$$Literal$_True = $$Literal$_True;
class $$Literal$_Nothing extends Literal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Nothing" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Nothing(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_Nothing;
    }
}
exports.$$Literal$_Nothing = $$Literal$_Nothing;
class $$Literal$_Text extends Literal {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Text" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(value, "String", String));
    }
    match(p) {
        return p.Text(this.pos, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_Text;
    }
}
exports.$$Literal$_Text = $$Literal$_Text;
class $$Literal$_Integer extends Literal {
    constructor(pos, digits) {
        super();
        this.pos = pos;
        this.digits = digits;
        Object.defineProperty(this, "tag", { value: "Integer" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(digits, "string", $is_type("string")));
    }
    match(p) {
        return p.Integer(this.pos, this.digits);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_Integer;
    }
}
exports.$$Literal$_Integer = $$Literal$_Integer;
class $$Literal$_Float extends Literal {
    constructor(pos, digits) {
        super();
        this.pos = pos;
        this.digits = digits;
        Object.defineProperty(this, "tag", { value: "Float" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(digits, "string", $is_type("string")));
    }
    match(p) {
        return p.Float(this.pos, this.digits);
    }
    static has_instance(x) {
        return x instanceof $$Literal$_Float;
    }
}
exports.$$Literal$_Float = $$Literal$_Float;
class SimulationGoal extends Node {
    static get ActionQuiescence() {
        return $$SimulationGoal$_ActionQuiescence;
    }
    static get EventQuiescence() {
        return $$SimulationGoal$_EventQuiescence;
    }
    static get TotalQuiescence() {
        return $$SimulationGoal$_TotalQuiescence;
    }
    static get CustomGoal() {
        return $$SimulationGoal$_CustomGoal;
    }
    static has_instance(x) {
        return x instanceof SimulationGoal;
    }
}
exports.SimulationGoal = SimulationGoal;
class $$SimulationGoal$_ActionQuiescence extends SimulationGoal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "ActionQuiescence" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.ActionQuiescence(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$SimulationGoal$_ActionQuiescence;
    }
}
exports.$$SimulationGoal$_ActionQuiescence = $$SimulationGoal$_ActionQuiescence;
class $$SimulationGoal$_EventQuiescence extends SimulationGoal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "EventQuiescence" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.EventQuiescence(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$SimulationGoal$_EventQuiescence;
    }
}
exports.$$SimulationGoal$_EventQuiescence = $$SimulationGoal$_EventQuiescence;
class $$SimulationGoal$_TotalQuiescence extends SimulationGoal {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "TotalQuiescence" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.TotalQuiescence(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$SimulationGoal$_TotalQuiescence;
    }
}
exports.$$SimulationGoal$_TotalQuiescence = $$SimulationGoal$_TotalQuiescence;
class $$SimulationGoal$_CustomGoal extends SimulationGoal {
    constructor(pos, pred) {
        super();
        this.pos = pos;
        this.pred = pred;
        Object.defineProperty(this, "tag", { value: "CustomGoal" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pred, "Predicate", Predicate));
    }
    match(p) {
        return p.CustomGoal(this.pos, this.pred);
    }
    static has_instance(x) {
        return x instanceof $$SimulationGoal$_CustomGoal;
    }
}
exports.$$SimulationGoal$_CustomGoal = $$SimulationGoal$_CustomGoal;
class Predicate extends Node {
    static get And() {
        return $$Predicate$_And;
    }
    static get Or() {
        return $$Predicate$_Or;
    }
    static get Not() {
        return $$Predicate$_Not;
    }
    static get Has() {
        return $$Predicate$_Has;
    }
    static get Sample() {
        return $$Predicate$_Sample;
    }
    static get Constrain() {
        return $$Predicate$_Constrain;
    }
    static get Let() {
        return $$Predicate$_Let;
    }
    static get Typed() {
        return $$Predicate$_Typed;
    }
    static get Always() {
        return $$Predicate$_Always;
    }
    static get Parens() {
        return $$Predicate$_Parens;
    }
    static has_instance(x) {
        return x instanceof Predicate;
    }
}
exports.Predicate = Predicate;
class $$Predicate$_And extends Predicate {
    constructor(pos, left, right) {
        super();
        this.pos = pos;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "And" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(left, "Predicate", Predicate));
        ($assert_type(right, "Predicate", Predicate));
    }
    match(p) {
        return p.And(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_And;
    }
}
exports.$$Predicate$_And = $$Predicate$_And;
class $$Predicate$_Or extends Predicate {
    constructor(pos, left, right) {
        super();
        this.pos = pos;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "Or" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(left, "Predicate", Predicate));
        ($assert_type(right, "Predicate", Predicate));
    }
    match(p) {
        return p.Or(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Or;
    }
}
exports.$$Predicate$_Or = $$Predicate$_Or;
class $$Predicate$_Not extends Predicate {
    constructor(pos, pred) {
        super();
        this.pos = pos;
        this.pred = pred;
        Object.defineProperty(this, "tag", { value: "Not" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pred, "Predicate", Predicate));
    }
    match(p) {
        return p.Not(this.pos, this.pred);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Not;
    }
}
exports.$$Predicate$_Not = $$Predicate$_Not;
class $$Predicate$_Has extends Predicate {
    constructor(pos, signature) {
        super();
        this.pos = pos;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Has" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Pattern>", Signature));
    }
    match(p) {
        return p.Has(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Has;
    }
}
exports.$$Predicate$_Has = $$Predicate$_Has;
class $$Predicate$_Sample extends Predicate {
    constructor(pos, size, pool) {
        super();
        this.pos = pos;
        this.size = size;
        this.pool = pool;
        Object.defineProperty(this, "tag", { value: "Sample" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(size, "Literal", Literal));
        ($assert_type(pool, "SamplingPool", SamplingPool));
    }
    match(p) {
        return p.Sample(this.pos, this.size, this.pool);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Sample;
    }
}
exports.$$Predicate$_Sample = $$Predicate$_Sample;
class $$Predicate$_Constrain extends Predicate {
    constructor(pos, pred, constraint) {
        super();
        this.pos = pos;
        this.pred = pred;
        this.constraint = constraint;
        Object.defineProperty(this, "tag", { value: "Constrain" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pred, "Predicate", Predicate));
        ($assert_type(constraint, "Expression", Expression));
    }
    match(p) {
        return p.Constrain(this.pos, this.pred, this.constraint);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Constrain;
    }
}
exports.$$Predicate$_Constrain = $$Predicate$_Constrain;
class $$Predicate$_Let extends Predicate {
    constructor(pos, name, value) {
        super();
        this.pos = pos;
        this.name = name;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Let" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(value, "Expression", Expression));
    }
    match(p) {
        return p.Let(this.pos, this.name, this.value);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Let;
    }
}
exports.$$Predicate$_Let = $$Predicate$_Let;
class $$Predicate$_Typed extends Predicate {
    constructor(pos, name, typ) {
        super();
        this.pos = pos;
        this.name = name;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Typed" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.Typed(this.pos, this.name, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Typed;
    }
}
exports.$$Predicate$_Typed = $$Predicate$_Typed;
class $$Predicate$_Always extends Predicate {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Always" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Always(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Always;
    }
}
exports.$$Predicate$_Always = $$Predicate$_Always;
class $$Predicate$_Parens extends Predicate {
    constructor(pos, pred) {
        super();
        this.pos = pos;
        this.pred = pred;
        Object.defineProperty(this, "tag", { value: "Parens" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pred, "Predicate", Predicate));
    }
    match(p) {
        return p.Parens(this.pos, this.pred);
    }
    static has_instance(x) {
        return x instanceof $$Predicate$_Parens;
    }
}
exports.$$Predicate$_Parens = $$Predicate$_Parens;
class SamplingPool extends Node {
    static get Relation() {
        return $$SamplingPool$_Relation;
    }
    static get Type() {
        return $$SamplingPool$_Type;
    }
    static has_instance(x) {
        return x instanceof SamplingPool;
    }
}
exports.SamplingPool = SamplingPool;
class $$SamplingPool$_Relation extends SamplingPool {
    constructor(pos, signature) {
        super();
        this.pos = pos;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Relation" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(signature, "Signature<Pattern>", Signature));
    }
    match(p) {
        return p.Relation(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$SamplingPool$_Relation;
    }
}
exports.$$SamplingPool$_Relation = $$SamplingPool$_Relation;
class $$SamplingPool$_Type extends SamplingPool {
    constructor(pos, name, typ) {
        super();
        this.pos = pos;
        this.name = name;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "Type" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.Type(this.pos, this.name, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$SamplingPool$_Type;
    }
}
exports.$$SamplingPool$_Type = $$SamplingPool$_Type;
class Pattern extends Node {
    static get HasType() {
        return $$Pattern$_HasType;
    }
    static get StaticType() {
        return $$Pattern$_StaticType;
    }
    static get Global() {
        return $$Pattern$_Global;
    }
    static get Variable() {
        return $$Pattern$_Variable;
    }
    static get Self() {
        return $$Pattern$_Self;
    }
    static get Wildcard() {
        return $$Pattern$_Wildcard;
    }
    static get Lit() {
        return $$Pattern$_Lit;
    }
    static has_instance(x) {
        return x instanceof Pattern;
    }
}
exports.Pattern = Pattern;
class $$Pattern$_HasType extends Pattern {
    constructor(pos, typ, name) {
        super();
        this.pos = pos;
        this.typ = typ;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "HasType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
        ($assert_type(name, "Pattern", Pattern));
    }
    match(p) {
        return p.HasType(this.pos, this.typ, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_HasType;
    }
}
exports.$$Pattern$_HasType = $$Pattern$_HasType;
class $$Pattern$_StaticType extends Pattern {
    constructor(pos, typ) {
        super();
        this.pos = pos;
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "StaticType" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.StaticType(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_StaticType;
    }
}
exports.$$Pattern$_StaticType = $$Pattern$_StaticType;
class $$Pattern$_Global extends Pattern {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Global" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Global(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_Global;
    }
}
exports.$$Pattern$_Global = $$Pattern$_Global;
class $$Pattern$_Variable extends Pattern {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Variable" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Variable(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_Variable;
    }
}
exports.$$Pattern$_Variable = $$Pattern$_Variable;
class $$Pattern$_Self extends Pattern {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Self" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Self(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_Self;
    }
}
exports.$$Pattern$_Self = $$Pattern$_Self;
class $$Pattern$_Wildcard extends Pattern {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Wildcard" });
        ($assert_type(pos, "Meta", Meta));
    }
    match(p) {
        return p.Wildcard(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_Wildcard;
    }
}
exports.$$Pattern$_Wildcard = $$Pattern$_Wildcard;
class $$Pattern$_Lit extends Pattern {
    constructor(lit) {
        super();
        this.lit = lit;
        Object.defineProperty(this, "tag", { value: "Lit" });
        ($assert_type(lit, "Literal", Literal));
    }
    match(p) {
        return p.Lit(this.lit);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_Lit;
    }
}
exports.$$Pattern$_Lit = $$Pattern$_Lit;
class Signature extends Node {
    static get Unary() {
        return $$Signature$_Unary;
    }
    static get Binary() {
        return $$Signature$_Binary;
    }
    static get Keyword() {
        return $$Signature$_Keyword;
    }
    static get KeywordSelfless() {
        return $$Signature$_KeywordSelfless;
    }
    static has_instance(x) {
        return x instanceof Signature;
    }
}
exports.Signature = Signature;
class $$Signature$_Unary extends Signature {
    constructor(pos, self, name) {
        super();
        this.pos = pos;
        this.self = self;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Unary" });
        ($assert_type(pos, "Meta", Meta));
        ;
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Unary(this.pos, this.self, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Signature$_Unary;
    }
}
exports.$$Signature$_Unary = $$Signature$_Unary;
class $$Signature$_Binary extends Signature {
    constructor(pos, op, left, right) {
        super();
        this.pos = pos;
        this.op = op;
        this.left = left;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "Binary" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(op, "Name", Name));
        ;
    }
    match(p) {
        return p.Binary(this.pos, this.op, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Signature$_Binary;
    }
}
exports.$$Signature$_Binary = $$Signature$_Binary;
class $$Signature$_Keyword extends Signature {
    constructor(pos, self, pairs) {
        super();
        this.pos = pos;
        this.self = self;
        this.pairs = pairs;
        Object.defineProperty(this, "tag", { value: "Keyword" });
        ($assert_type(pos, "Meta", Meta));
        ;
        ($assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair)));
    }
    match(p) {
        return p.Keyword(this.pos, this.self, this.pairs);
    }
    static has_instance(x) {
        return x instanceof $$Signature$_Keyword;
    }
}
exports.$$Signature$_Keyword = $$Signature$_Keyword;
class $$Signature$_KeywordSelfless extends Signature {
    constructor(pos, pairs) {
        super();
        this.pos = pos;
        this.pairs = pairs;
        Object.defineProperty(this, "tag", { value: "KeywordSelfless" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair)));
    }
    match(p) {
        return p.KeywordSelfless(this.pos, this.pairs);
    }
    static has_instance(x) {
        return x instanceof $$Signature$_KeywordSelfless;
    }
}
exports.$$Signature$_KeywordSelfless = $$Signature$_KeywordSelfless;
class PartialSignature extends Node {
    static get Unary() {
        return $$PartialSignature$_Unary;
    }
    static get Binary() {
        return $$PartialSignature$_Binary;
    }
    static get Keyword() {
        return $$PartialSignature$_Keyword;
    }
    static has_instance(x) {
        return x instanceof PartialSignature;
    }
}
exports.PartialSignature = PartialSignature;
class $$PartialSignature$_Unary extends PartialSignature {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Unary" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Unary(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$PartialSignature$_Unary;
    }
}
exports.$$PartialSignature$_Unary = $$PartialSignature$_Unary;
class $$PartialSignature$_Binary extends PartialSignature {
    constructor(pos, op, right) {
        super();
        this.pos = pos;
        this.op = op;
        this.right = right;
        Object.defineProperty(this, "tag", { value: "Binary" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(op, "Name", Name));
    }
    match(p) {
        return p.Binary(this.pos, this.op, this.right);
    }
    static has_instance(x) {
        return x instanceof $$PartialSignature$_Binary;
    }
}
exports.$$PartialSignature$_Binary = $$PartialSignature$_Binary;
class $$PartialSignature$_Keyword extends PartialSignature {
    constructor(pos, pairs) {
        super();
        this.pos = pos;
        this.pairs = pairs;
        Object.defineProperty(this, "tag", { value: "Keyword" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair)));
    }
    match(p) {
        return p.Keyword(this.pos, this.pairs);
    }
    static has_instance(x) {
        return x instanceof $$PartialSignature$_Keyword;
    }
}
exports.$$PartialSignature$_Keyword = $$PartialSignature$_Keyword;
class RelationPart extends Node {
    static get Many() {
        return $$RelationPart$_Many;
    }
    static get One() {
        return $$RelationPart$_One;
    }
    static has_instance(x) {
        return x instanceof RelationPart;
    }
}
exports.RelationPart = RelationPart;
class $$RelationPart$_Many extends RelationPart {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Many" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.Many(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$RelationPart$_Many;
    }
}
exports.$$RelationPart$_Many = $$RelationPart$_Many;
class $$RelationPart$_One extends RelationPart {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "One" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "Name", Name));
    }
    match(p) {
        return p.One(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$RelationPart$_One;
    }
}
exports.$$RelationPart$_One = $$RelationPart$_One;
class Pair extends Node {
    constructor(pos, key, value) {
        super();
        this.pos = pos;
        this.key = key;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Pair" });
        ($assert_type(pos, "Meta", Meta));
        ;
    }
    static has_instance(x) {
        return x instanceof Pair;
    }
}
exports.Pair = Pair;
class Name extends Node {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Name" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(name, "string", $is_type("string")));
    }
    static has_instance(x) {
        return x instanceof Name;
    }
}
exports.Name = Name;
class Namespace extends Node {
    constructor(pos, names) {
        super();
        this.pos = pos;
        this.names = names;
        Object.defineProperty(this, "tag", { value: "Namespace" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(names, "string[]", $is_array($is_type("string"))));
    }
    static has_instance(x) {
        return x instanceof Namespace;
    }
}
exports.Namespace = Namespace;
class String extends Node {
    constructor(pos, text) {
        super();
        this.pos = pos;
        this.text = text;
        Object.defineProperty(this, "tag", { value: "String" });
        ($assert_type(pos, "Meta", Meta));
        ($assert_type(text, "string", $is_type("string")));
    }
    static has_instance(x) {
        return x instanceof String;
    }
}
exports.String = String;
class REPL extends Node {
    static get Declarations() {
        return $$REPL$_Declarations;
    }
    static get Statements() {
        return $$REPL$_Statements;
    }
    static get Command() {
        return $$REPL$_Command;
    }
    static has_instance(x) {
        return x instanceof REPL;
    }
}
exports.REPL = REPL;
class $$REPL$_Declarations extends REPL {
    constructor(x) {
        super();
        this.x = x;
        Object.defineProperty(this, "tag", { value: "Declarations" });
        ($assert_type(x, "Declaration[]", $is_array(Declaration)));
    }
    match(p) {
        return p.Declarations(this.x);
    }
    static has_instance(x) {
        return x instanceof $$REPL$_Declarations;
    }
}
exports.$$REPL$_Declarations = $$REPL$_Declarations;
class $$REPL$_Statements extends REPL {
    constructor(x) {
        super();
        this.x = x;
        Object.defineProperty(this, "tag", { value: "Statements" });
        ($assert_type(x, "Statement[]", $is_array(Statement)));
    }
    match(p) {
        return p.Statements(this.x);
    }
    static has_instance(x) {
        return x instanceof $$REPL$_Statements;
    }
}
exports.$$REPL$_Statements = $$REPL$_Statements;
class $$REPL$_Command extends REPL {
    constructor(x) {
        super();
        this.x = x;
        Object.defineProperty(this, "tag", { value: "Command" });
        ($assert_type(x, "ReplCommand", ReplCommand));
    }
    match(p) {
        return p.Command(this.x);
    }
    static has_instance(x) {
        return x instanceof $$REPL$_Command;
    }
}
exports.$$REPL$_Command = $$REPL$_Command;
class ReplCommand extends Node {
    static get Rollback() {
        return $$ReplCommand$_Rollback;
    }
    static get HelpCommand() {
        return $$ReplCommand$_HelpCommand;
    }
    static get HelpType() {
        return $$ReplCommand$_HelpType;
    }
    static has_instance(x) {
        return x instanceof ReplCommand;
    }
}
exports.ReplCommand = ReplCommand;
class $$ReplCommand$_Rollback extends ReplCommand {
    constructor(sig) {
        super();
        this.sig = sig;
        Object.defineProperty(this, "tag", { value: "Rollback" });
        ($assert_type(sig, "Signature<Expression>", Signature));
    }
    match(p) {
        return p.Rollback(this.sig);
    }
    static has_instance(x) {
        return x instanceof $$ReplCommand$_Rollback;
    }
}
exports.$$ReplCommand$_Rollback = $$ReplCommand$_Rollback;
class $$ReplCommand$_HelpCommand extends ReplCommand {
    constructor(sig) {
        super();
        this.sig = sig;
        Object.defineProperty(this, "tag", { value: "HelpCommand" });
        ($assert_type(sig, "Signature<Parameter>", Signature));
    }
    match(p) {
        return p.HelpCommand(this.sig);
    }
    static has_instance(x) {
        return x instanceof $$ReplCommand$_HelpCommand;
    }
}
exports.$$ReplCommand$_HelpCommand = $$ReplCommand$_HelpCommand;
class $$ReplCommand$_HelpType extends ReplCommand {
    constructor(typ) {
        super();
        this.typ = typ;
        Object.defineProperty(this, "tag", { value: "HelpType" });
        ($assert_type(typ, "TypeApp", TypeApp));
    }
    match(p) {
        return p.HelpType(this.typ);
    }
    static has_instance(x) {
        return x instanceof $$ReplCommand$_HelpType;
    }
}
exports.$$ReplCommand$_HelpType = $$ReplCommand$_HelpType;
// == Grammar definition ============================================
exports.grammar = Ohm.grammar("\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\nrepl  = ws declaration+ ws end  -- alt1\n | ws statements1 ws end  -- alt2\n | ws replCommand ws end  -- alt3\n\n\nreplCommand  = \":rollback\" hs+ signature<hole>  -- alt1\n | \":help\" hs+ command_ signature<parameter>  -- alt2\n | \":help\" hs+ type_ typeApp  -- alt3\n\n\ndeclarationMeta  = ws meta_doc  -- alt1\n\n\nmeta_doc  = doc  -- alt1\n |   -- alt2\n\n\ndeclaration  = relationDeclaration  -- alt1\n | doDeclaration  -- alt2\n | commandDeclaration  -- alt3\n | typeDeclaration  -- alt4\n | defineDeclaration  -- alt5\n | actionDeclaration  -- alt6\n | whenDeclaration  -- alt7\n | contextDeclaration  -- alt8\n | openDeclaration  -- alt9\n | localDeclaration  -- alt10\n | testDeclaration  -- alt11\n | effectDeclaration  -- alt12\n | traitDeclaration  -- alt13\n | traitImplementDeclaration  -- alt14\n | capabilityDeclaration  -- alt15\n | protectDeclaration  -- alt16\n\n\ncapabilityDeclaration  = declarationMeta capability_ atom s<\";\">  -- alt1\n\n\nprotectDeclaration  = protect_ protectEntity with_ atom s<\";\">  -- alt1\n\n\nprotectEntity  = type_ atom  -- alt1\n | effect_ atom  -- alt2\n | global_ atom  -- alt3\n | trait_ atom  -- alt4\n\n\ntraitDeclaration  = declarationMeta trait_ atom with_ traitInstruction+ end_  -- alt1\n | declarationMeta trait_ atom s<\";\">  -- alt2\n\n\ntraitInstruction  = traitCommand  -- alt1\n | traitRequires  -- alt2\n\n\ntraitCommand  = declarationMeta command_ signature<parameter> contractDefinition s<\";\">  -- alt1\n\n\ntraitRequires  = requires_ trait_ traitName s<\";\">  -- alt1\n\n\ntraitImplementDeclaration  = implement_ traitName for_ typeApp s<\";\">  -- alt1\n\n\neffectDeclaration  = declarationMeta effect_ atom with_ effectCase+ end_  -- alt1\n\n\neffectCase  = declarationMeta atom effectCaseParams s<\";\">  -- alt1\n\n\neffectCaseParams  = s<\"(\"> list0<typeParameter, s<\",\">> s<\")\">  -- alt1\n\n\ntestDeclaration  = test_ string do_ statements end_  -- alt1\n\n\ntrailingTest  = oneTrailingTest  -- alt1\n | s<\";\">  -- alt2\n\n\noneTrailingTest  = test_ statements end_  -- alt1\n\n\nlocalDeclaration  = local_ defineDeclaration  -- alt1\n | local_ typeDeclaration  -- alt2\n\n\nopenDeclaration  = open_ namespace s<\";\">  -- alt1\n\n\nrelationDeclaration  = declarationMeta ws relation_ logicSignature<relationPart> s<\";\">  -- alt1\n\n\nrelationPart  = name s<\"*\">  -- alt1\n | name  -- alt2\n\n\ndoDeclaration  = prelude_ statements end_  -- alt1\n\n\ncommandDeclaration  = declarationMeta ws command_ signature<parameter> contractDefinition s<\"=\"> expression trailingTest  -- alt1\n | declarationMeta ws command_ signature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt2\n | declarationMeta ws command_ signature<parameter> contractDefinition do_ statements end_  -- alt3\n\n\ncontractDefinition  = retContractDefinition preContractDefinition postContractDefinition  -- alt1\n\n\nretContractDefinition  = s<\"->\"> typeConstraintPrimary  -- alt1\n |   -- alt2\n\n\npreContractDefinition  = requires_ list1<contractCondition, s<\",\">>  -- alt1\n |   -- alt2\n\n\npostContractDefinition  = ensures_ list1<contractCondition, s<\",\">>  -- alt1\n |   -- alt2\n\n\ncontractCondition  = atom s<\"::\"> expression  -- alt1\n\n\nparameter  = name  -- alt1\n | s<\"(\"> name is_ typeConstraint s<\")\">  -- alt2\n | s<\"(\"> name has_ list1<traitName, s<\",\">> s<\")\">  -- alt3\n | typeAppStatic  -- alt4\n\n\ntypeConstraint  = typeConstraint1 has_ list1<traitName, s<\",\">>  -- alt1\n | typeConstraint1  -- alt2\n\n\ntypeConstraint1  = name is_ typeApp  -- alt1\n | typeConstraintPrimary  -- alt2\n\n\ntypeConstraintPrimary  = name  -- alt1\n | typeApp1  -- alt2\n | s<\"(\"> typeConstraint s<\")\">  -- alt3\n\n\ntypeApp  = typeAppArgs s<\"->\"> typeConstraintPrimary  -- alt1\n | typeApp1  -- alt2\n\n\ntypeAppArgs  = s<\"(\"> list0<typeConstraint, s<\",\">> s<\")\">  -- alt1\n | typeConstraintPrimary  -- alt2\n\n\ntypeApp1  = typeAppStatic s<\"<\"> list0<typeConstraint, s<\",\">> s<\">\">  -- alt1\n | typeAppStatic  -- alt2\n\n\ntypeAppStatic  = s<\"#\"> typeAppPrimary  -- alt1\n | typeAppPrimary  -- alt2\n\n\ntypeAppPrimary  = typeName  -- alt1\n | s<\"(\"> typeApp s<\")\">  -- alt2\n\n\ntypeName  = atom  -- alt1\n | nothing_  -- alt2\n | true_  -- alt3\n | false_  -- alt4\n\n\ntraitName  = atom  -- alt1\n\n\ntypeDeclaration  = declarationMeta ws type_ typeName s<\"=\"> foreign_ namespace s<\";\">  -- alt1\n | declarationMeta ws enum_ typeName s<\"=\"> nonemptyListOf<typeName, s<\",\">> s<\";\">  -- alt2\n | declarationMeta ws abstract_ basicType s<\";\">  -- alt3\n | declarationMeta ws singleton_ basicType typeInitBlock  -- alt4\n | declarationMeta ws type_ atom typeFields typeDefParent s<\";\">  -- alt5\n\n\nbasicType  = atom typeDefParent  -- alt1\n\n\ntypeDefParent  = is_ typeConstraint  -- alt1\n |   -- alt2\n\n\ntypeInitBlock  = with_ typeInit* end_  -- alt1\n | s<\";\">  -- alt2\n\n\ntypeFields  = s<\"(\"> list1<typeField, s<\",\">> s<\")\">  -- alt1\n |   -- alt2\n\n\ntypeField  = fieldVisibility typeParameter  -- alt1\n\n\ntypeParameter  = typeFieldName is_ typeConstraint  -- alt1\n | typeFieldName  -- alt2\n\n\nfieldVisibility  = global_  -- alt1\n |   -- alt2\n\n\ntypeFieldName  = name  -- alt1\n | atom  -- alt2\n\n\ntypeInit  = partialLogicSignature<invokePostfix> s<\";\">  -- alt1\n | typeInitCommand  -- alt2\n\n\ntypeInitCommand  = declarationMeta ws command_ partialSignature<parameter> contractDefinition s<\"=\"> s<expression> trailingTest  -- alt1\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt2\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition do_ statements end_  -- alt3\n\n\ndefineDeclaration  = declarationMeta ws define_ atom s<\"=\"> s<atomicExpression> s<\";\">  -- alt1\n\n\nactionDeclaration  = declarationMeta ws action_ parameter atom interpolateExpression? actionPredicate actionRank do_ statements actionInit end_  -- alt1\n\n\nactionPredicate  = when_ predicate  -- alt1\n |   -- alt2\n\n\nactionRank  = rank_ s<expression>  -- alt1\n |   -- alt2\n\n\nactionInit  = with_ typeInitCommand*  -- alt1\n |   -- alt2\n\n\nwhenDeclaration  = declarationMeta ws when_ predicate do_ statements end_  -- alt1\n\n\ncontextDeclaration  = declarationMeta ws context_ atom with_ contextItem* end_  -- alt1\n\n\ncontextItem  = actionDeclaration  -- alt1\n | whenDeclaration  -- alt2\n\n\npredicate  = predicateBinary  -- alt1\n\n\npredicateBinary  = predicateAnd  -- alt1\n | predicateOr  -- alt2\n | predicateNot  -- alt3\n\n\npredicateAnd  = predicateNot s<\",\"> predicateAnd1  -- alt1\n\n\npredicateAnd1  = predicateNot s<\",\"> predicateAnd1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateOr  = predicateNot s<\"|\"> predicateOr1  -- alt1\n\n\npredicateOr1  = predicateNot s<\"|\"> predicateOr1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateNot  = not_ predicateConstrain  -- alt1\n | predicateConstrain  -- alt2\n\n\npredicateConstrain  = predicateLet if_ s<expression>  -- alt1\n | if_ s<expression>  -- alt2\n | predicateLet  -- alt3\n | predicateSample  -- alt4\n | predicateType  -- alt5\n | predicatePrimary  -- alt6\n\n\npredicateType  = name is_ typeApp  -- alt1\n\n\npredicateLet  = let_ name s<\"=\"> s<expression>  -- alt1\n\n\npredicateSample  = sample_ integer of_ samplingPool  -- alt1\n\n\nsamplingPool  = logicSignature<pattern>  -- alt1\n | name is_ typeApp  -- alt2\n\n\npredicatePrimary  = always_  -- alt1\n | logicSignature<pattern>  -- alt2\n | s<\"(\"> predicate s<\")\">  -- alt3\n\n\npattern  = s<\"(\"> patternComplex s<\")\">  -- alt1\n | s<\"#\"> typeAppPrimary  -- alt2\n | atom  -- alt3\n | self_  -- alt4\n | literal  -- alt5\n | patternName  -- alt6\n\n\npatternComplex  = patternName is_ typeApp  -- alt1\n\n\npatternName  = s<\"_\">  -- alt1\n | name  -- alt2\n\n\nstatement  = s<letStatement>  -- alt1\n | s<factStatement>  -- alt2\n | s<forgetStatement>  -- alt3\n | s<simulateStatement>  -- alt4\n | s<assertStatement>  -- alt5\n | s<expression>  -- alt6\n\n\nblockStatement  = blockExpression  -- alt1\n\n\nletStatement  = let_ name s<\"=\"> s<expression>  -- alt1\n\n\nfactStatement  = fact_ logicSignature<primaryExpression>  -- alt1\n\n\nforgetStatement  = forget_ logicSignature<primaryExpression>  -- alt1\n\n\nsimulateStatement  = simulate_ for_ expression simulateContext until_ simulateGoal signal*  -- alt1\n\n\nsimulateContext  = in_ atom  -- alt1\n |   -- alt2\n\n\nsimulateGoal  = action_ quiescence_  -- alt1\n | event_ quiescence_  -- alt2\n | quiescence_  -- alt3\n | predicate  -- alt4\n\n\nsignal  = on_ signature<parameter> do_ statements end_  -- alt1\n\n\nassertStatement  = assert_ expression  -- alt1\n\n\nexpression  = blockExpression  -- alt1\n | s<searchExpression>  -- alt2\n | s<lazyExpression>  -- alt3\n | s<forceExpression>  -- alt4\n | s<foreignExpression>  -- alt5\n | s<continueWithExpression>  -- alt6\n | s<assignExpression>  -- alt7\n | s<pipeExpression>  -- alt8\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\nlazyExpression  = lazy_ expression  -- alt1\n\n\nforceExpression  = force_ expression  -- alt1\n\n\nforeignExpression  = foreign_ namespace s<\"(\"> list0<expression, s<\",\">> s<\")\">  -- alt1\n\n\ncontinueWithExpression  = continue_ with_ pipeExpression  -- alt1\n\n\nexpressionBlock  = do_ statements end_  -- alt1\n\n\nassignExpression  = invokePostfix named<\"<-\"> pipeExpression  -- alt1\n\n\npipeExpression  = pipeExpression s<\"|>\"> invokeMixfix  -- alt1\n | pipeExpression s<\"|\"> partialSignature<invokePostfix>  -- alt2\n | invokeMixfix  -- alt3\n\n\ninvokeMixfix  = invokeInfixExpression signaturePair<invokeInfixExpression>+  -- alt1\n | signaturePair<invokeInfixExpression>+  -- alt2\n | invokeInfixExpression  -- alt3\n\n\ninvokeInfixExpression  = invokePostfix s<\"=:=\"> invokePostfix  -- alt1\n | invokePostfix named<t_relational_op> invokePostfix  -- alt2\n | invokeInfixSequence<named<\"++\">>  -- alt3\n | invokeInfixSequence<named<\"+\">>  -- alt4\n | invokeInfixSequence<named<\"-\">>  -- alt5\n | invokeInfixSequence<named<\"**\">>  -- alt6\n | invokeInfixSequence<named<\"*\">>  -- alt7\n | invokeInfixSequence<named<\"/\">>  -- alt8\n | invokeInfixSequence<named<\"%\">>  -- alt9\n | invokeInfixSequence<and>  -- alt10\n | invokeInfixSequence<or>  -- alt11\n | castExpression  -- alt12\n\n\ninvokeInfixSequence<op>  = invokeInfixSequence<op> op invokePostfix  -- alt1\n | invokePostfix op invokePostfix  -- alt2\n\n\ncastExpression  = invokePrePost as castType  -- alt1\n | invokePrePost is_ typeAppPrimary  -- alt2\n | invokePrePost  -- alt3\n\n\ncastType  = typeAppPrimary  -- alt1\n\n\ninvokePrePost  = invokePrefix  -- alt1\n\n\ninvokePrefix  = not invokePostfix  -- alt1\n | invokePostfix  -- alt2\n\n\ninvokePostfix  = invokePostfix atom  -- alt1\n | applyExpression  -- alt2\n\n\napplyExpression  = applyExpression s<\"(\"> list0<expression, s<\",\">> s<\")\">  -- alt1\n | memberExpression  -- alt2\n\n\nmemberExpression  = memberExpression s<\".\"> recordField  -- alt1\n | memberExpression s<\".\"> memberSelection  -- alt2\n | primaryExpression  -- alt3\n\n\nmemberSelection  = s<\"(\"> list1<fieldSelection, s<\",\">> s<\")\">  -- alt1\n\n\nfieldSelection  = recordField as_ recordField  -- alt1\n | recordField  -- alt2\n\n\nprimaryExpression  = newExpression<expression>  -- alt1\n | interpolateExpression  -- alt2\n | literalExpression  -- alt3\n | recordExpression<expression>  -- alt4\n | listExpression<expression>  -- alt5\n | lambdaExpression  -- alt6\n | performExpression  -- alt7\n | hole  -- alt8\n | s<\"#\"> typeAppPrimary  -- alt9\n | return_  -- alt10\n | self_  -- alt11\n | atom  -- alt12\n | name  -- alt13\n | s<\"(\"> expression s<\")\">  -- alt14\n\n\nconditionExpression  = condition_ conditionCase+ end_  -- alt1\n\n\nconditionCase  = when_ expression eblock  -- alt1\n | otherwise_ eblock  -- alt2\n\n\nmatchSearchExpression  = match_ matchSearchCase+ end_  -- alt1\n\n\nmatchSearchCase  = when_ predicate eblock  -- alt1\n | otherwise_ eblock  -- alt2\n\n\nforExpression  = for_ forExprMap  -- alt1\n\n\nforExprMap  = name in_ expression forExprMap1  -- alt1\n\n\nforExprMap1  = s<\",\"> forExprMap  -- alt1\n | if_ expression forExprDo  -- alt2\n | forExprDo  -- alt3\n\n\nforExprDo  = expressionBlock  -- alt1\n\n\nperformExpression  = perform_ atom s<\".\"> atom s<\"(\"> list0<expression, s<\",\">> s<\")\">  -- alt1\n\n\nnewExpression<e>  = new_ atom newFields<e>  -- alt1\n\n\nnewFields<e>  = s<\"(\"> list1<e, s<\",\">> s<\")\">  -- alt1\n |   -- alt2\n\n\nlistExpression<e>  = s<\"[\"> list0<e, s<\",\">> s<\"]\">  -- alt1\n\n\nrecordExpression<e>  = s<\"[\"> s<\"->\"> s<\"]\">  -- alt1\n | s<\"[\"> list1<recordPair<e>, s<\",\">> s<\"]\">  -- alt2\n\n\nrecordPair<e>  = recordField s<\"->\"> e  -- alt1\n\n\nrecordField  = (name | atom)  -- alt1\n | string  -- alt2\n | s<\"[\"> expression s<\"]\">  -- alt3\n\n\nliteralExpression  = literal  -- alt1\n\n\nlambdaExpression  = s<\"{\"> statements s<\"}\">  -- alt1\n | s<\"{\"> list1<name, s<\",\">> in_ statements s<\"}\">  -- alt2\n\n\nhandleExpression  = handle_ statements with_ handlers end_  -- alt1\n\n\nhandlers  = one_handler+  -- alt1\n\n\none_handler  = on_ atom s<\".\"> atom s<\"(\"> list0<name, s<\",\">> s<\")\"> eblock  -- alt1\n\n\natomicExpression  = atom  -- alt1\n | lazyExpression  -- alt2\n | newExpression<atomicExpression>  -- alt3\n | literalExpression  -- alt4\n | recordExpression<atomicExpression>  -- alt5\n | listExpression<atomicExpression>  -- alt6\n\n\nblockExpression  = expressionBlock  -- alt1\n | conditionExpression  -- alt2\n | matchSearchExpression  -- alt3\n | forExpression  -- alt4\n | handleExpression  -- alt5\n | dslExpression  -- alt6\n\n\ninterpolateExpression  = interpolateText<expression>  -- alt1\n\n\ninterpolateText<t>  = s<\"<<\"> interpolatePart<t, \">>\">* \">>\"  -- alt1\n | s<\"\\\"\"> interpolatePart<t, \"\\\"\">* \"\\\"\"  -- alt2\n\n\ninterpolatePart<p, e>  = \"\\\\\" escape_sequence  -- alt1\n | \"[\" s<p> s<\"]\">  -- alt2\n | interpolateStatic<e>  -- alt3\n\n\ninterpolateStatic<e>  = (~(e | \"\\\\\" | \"[\") any)+  -- alt1\n\n\ndslExpression  = dsl_ typeApp with_ dslNodeSeq end_  -- alt1\n\n\ndslNodeSeq  = list0<dslNode, s<\";\">>  -- alt1\n\n\ndslNode  = dslSignature<dslPrimary> dslAttribute*  -- alt1\n | dslPrimary  -- alt2\n\n\ndslPrimary  = name  -- alt1\n | interpolateText<dslNode>  -- alt2\n | literal  -- alt3\n | dslCrochet  -- alt4\n | dslNodeList  -- alt5\n | s<\"(\"> dslNode s<\")\">  -- alt6\n\n\ndslNodeList  = s<\"[\"> dslNodeSeq s<\"]\">  -- alt1\n\n\ndslCrochet  = s<\"@(\"> expression s<\")\">  -- alt1\n\n\ndslAttribute  = attribute dslPrimary  -- alt1\n\n\ndslSignature<t>  = atom dslSignatureComponent<t>+  -- alt1\n\n\ndslSignatureComponent<t>  = atom  -- alt1\n | dslPrimary  -- alt2\n\n\nliteral  = text  -- alt1\n | float  -- alt2\n | integer  -- alt3\n | boolean  -- alt4\n | nothing  -- alt5\n\n\nnothing  = nothing_  -- alt1\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = string  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\nfloat  = s<t_float>  -- alt1\n\n\nstring  = s<t_text>  -- alt1\n\n\nhole  = s<\"_\"> ~name_rest  -- alt1\n\n\natom  = s<\"'\"> t_atom  -- alt1\n | ~reserved s<t_atom> ~\":\"  -- alt2\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\nattribute  = s<t_attribute>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nand  = and_  -- alt1\n\n\nor  = or_  -- alt1\n\n\nas  = as_  -- alt1\n\n\nnamespace  = s<nonemptyListOf<t_atom, s<\".\">>>  -- alt1\n\n\nnamed<n>  = s<n>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n | signaturePair<t>+  -- alt3\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\npartialLogicSignature<t>  = signaturePair<t>+  -- alt1\n | atom  -- alt2\n\n\npartialSignature<t>  = signaturePair<t>+  -- alt1\n | infix_symbol t  -- alt2\n | atom  -- alt3\n | not  -- alt4\n\n\nsignature<t>  = t as asParameter  -- alt1\n | t infix_symbol t  -- alt2\n | t signaturePair<t>+  -- alt3\n | t atom  -- alt4\n | not t  -- alt5\n | signaturePair<t>+  -- alt6\n\n\nasParameter  = typeAppPrimary  -- alt1\n\n\nlist0<t, s>  = listOf<t, s> s?  -- alt1\n\n\nlist1<t, s>  = nonemptyListOf<t, s> s?  -- alt1\n\n\nblock<t>  = do_ t* end_  -- alt1\n\n\nstatements  = blockStatement s<\";\">? ws statements1  -- alt1\n | statement ws \";\" ws statements1  -- alt2\n | statement s<\";\">?  -- alt3\n |   -- alt4\n\n\nstatements1  = blockStatement s<\";\">? ws statements1  -- alt1\n | statement ws \";\" ws statements1  -- alt2\n | statement s<\";\">?  -- alt3\n\n\neblock  = do_ statements end_  -- alt1\n | s<\"=>\"> expression s<\";\">  -- alt2\n\n\ns<p>  = space* p  -- alt1\n\n\nws  = space*  -- alt1\n\n\nheader (a file header) = space* \"%\" hs* \"crochet\" nl  -- alt1\n\n\nhs  = \" \"  -- alt1\n | \"\\t\"  -- alt2\n\n\nnl  = \"\\r\\n\"  -- alt1\n | \"\\n\"  -- alt2\n | \"\\r\"  -- alt3\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = \"//\" ~\"/\" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\ndoc (a documentation comment) = doc_line+  -- alt1\n\n\ndoc_line (a documentation comment) = hs* \"///\" hs? line nl  -- alt1\n\n\nsemi  = s<\";\">  -- alt1\n\n\natom_start  = \"a\"..\"z\"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | \"-\"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom \":\"  -- alt1\n\n\nt_attribute (an attribute) = \"--\" ~\"-\" t_atom  -- alt1\n\n\nname_start  = \"A\"..\"Z\"  -- alt1\n | \"_\"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | \"-\"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = t_any_infix ~infix_character  -- alt1\n | and_  -- alt2\n | or_  -- alt3\n | as_  -- alt4\n\n\nt_any_infix  = \"<-\"  -- alt1\n | t_relational_op  -- alt2\n | t_arithmetic_op  -- alt3\n\n\nt_relational_op  = \"===\"  -- alt1\n | \"=/=\"  -- alt2\n | \">=\"  -- alt3\n | \">\"  -- alt4\n | \"<=\"  -- alt5\n | \"<\"  -- alt6\n\n\nt_arithmetic_op  = \"++\"  -- alt1\n | \"+\"  -- alt2\n | \"-\"  -- alt3\n | \"**\"  -- alt4\n | \"*\"  -- alt5\n | \"/\"  -- alt6\n | \"%\"  -- alt7\n\n\ninfix_character  = \"+\"  -- alt1\n | \"-\"  -- alt2\n | \"*\"  -- alt3\n | \"/\"  -- alt4\n | \"<\"  -- alt5\n | \">\"  -- alt6\n | \"=\"  -- alt7\n | \"%\"  -- alt8\n\n\ndec_digit  = \"0\"..\"9\"  -- alt1\n | \"_\"  -- alt2\n\n\nhex_digit  = \"0\"..\"9\"  -- alt1\n | \"a\"..\"f\"  -- alt2\n | \"A\"..\"F\"  -- alt3\n\n\nt_integer (an integer) = ~\"_\" \"-\"? dec_digit+  -- alt1\n\n\nt_float (a floating point number) = ~\"_\" \"-\"? dec_digit+ \".\" dec_digit+  -- alt1\n\n\ntext_character  = \"\\\\\" escape_sequence  -- alt1\n | ~\"\\\"\" any  -- alt2\n\n\nescape_sequence  = \"u\" hex_digit hex_digit hex_digit hex_digit  -- alt1\n | \"x\" hex_digit hex_digit  -- alt2\n | any  -- alt3\n\n\nt_text (a text) = \"\\\"\" text_character* \"\\\"\"  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<\"relation\">  -- alt1\n\n\npredicate_  = kw<\"predicate\">  -- alt1\n\n\nwhen_  = kw<\"when\">  -- alt1\n\n\ndo_  = kw<\"do\">  -- alt1\n\n\ncommand_  = kw<\"command\">  -- alt1\n\n\ntype_  = kw<\"type\">  -- alt1\n\n\nenum_  = kw<\"enum\">  -- alt1\n\n\ndefine_  = kw<\"define\">  -- alt1\n\n\nsingleton_  = kw<\"singleton\">  -- alt1\n\n\naction_  = kw<\"action\">  -- alt1\n\n\nlet_  = kw<\"let\">  -- alt1\n\n\nreturn_  = kw<\"return\">  -- alt1\n\n\nfact_  = kw<\"fact\">  -- alt1\n\n\nforget_  = kw<\"forget\">  -- alt1\n\n\nnew_  = kw<\"new\">  -- alt1\n\n\nsearch_  = kw<\"search\">  -- alt1\n\n\nif_  = kw<\"if\">  -- alt1\n\n\nthen_  = kw<\"then\">  -- alt1\n\n\nelse_  = kw<\"else\">  -- alt1\n\n\ngoto_  = kw<\"goto\">  -- alt1\n\n\ncall_  = kw<\"call\">  -- alt1\n\n\nsimulate_  = kw<\"simulate\">  -- alt1\n\n\nmatch_  = kw<\"match\">  -- alt1\n\n\ntrue_  = kw<\"true\">  -- alt1\n\n\nfalse_  = kw<\"false\">  -- alt1\n\n\nnot_  = kw<\"not\">  -- alt1\n\n\nand_  = kw<\"and\">  -- alt1\n\n\nor_  = kw<\"or\">  -- alt1\n\n\nis_  = kw<\"is\">  -- alt1\n\n\nself_  = kw<\"self\">  -- alt1\n\n\nas_  = kw<\"as\">  -- alt1\n\n\nevent_  = kw<\"event\">  -- alt1\n\n\nquiescence_  = kw<\"quiescence\">  -- alt1\n\n\nfor_  = kw<\"for\">  -- alt1\n\n\nuntil_  = kw<\"until\">  -- alt1\n\n\nin_  = kw<\"in\">  -- alt1\n\n\nforeign_  = kw<\"foreign\">  -- alt1\n\n\non_  = kw<\"on\">  -- alt1\n\n\nalways_  = kw<\"always\">  -- alt1\n\n\ncondition_  = kw<\"condition\">  -- alt1\n\n\nend_  = kw<\"end\">  -- alt1\n\n\nprelude_  = kw<\"prelude\">  -- alt1\n\n\nwith_  = kw<\"with\">  -- alt1\n\n\ntags_  = kw<\"tags\">  -- alt1\n\n\nrank_  = kw<\"rank\">  -- alt1\n\n\nabstract_  = kw<\"abstract\">  -- alt1\n\n\nlazy_  = kw<\"lazy\">  -- alt1\n\n\nforce_  = kw<\"force\">  -- alt1\n\n\ncontext_  = kw<\"context\">  -- alt1\n\n\nsample_  = kw<\"sample\">  -- alt1\n\n\nof_  = kw<\"of\">  -- alt1\n\n\nopen_  = kw<\"open\">  -- alt1\n\n\nlocal_  = kw<\"local\">  -- alt1\n\n\ntest_  = kw<\"test\">  -- alt1\n\n\nassert_  = kw<\"assert\">  -- alt1\n\n\nrequires_  = kw<\"requires\">  -- alt1\n\n\nensures_  = kw<\"ensures\">  -- alt1\n\n\nnothing_  = kw<\"nothing\">  -- alt1\n\n\neffect_  = kw<\"effect\">  -- alt1\n\n\nhandle_  = kw<\"handle\">  -- alt1\n\n\ncontinue_  = kw<\"continue\">  -- alt1\n\n\nperform_  = kw<\"perform\">  -- alt1\n\n\ndsl_  = kw<\"dsl\">  -- alt1\n\n\ntrait_  = kw<\"trait\">  -- alt1\n\n\nimplement_  = kw<\"implement\">  -- alt1\n\n\nhas_  = kw<\"has\">  -- alt1\n\n\nglobal_  = kw<\"global\">  -- alt1\n\n\ncapability_  = kw<\"capability\">  -- alt1\n\n\nprotect_  = kw<\"protect\">  -- alt1\n\n\notherwise_  = kw<\"otherwise\">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | command_  -- alt5\n | action_  -- alt6\n | type_  -- alt7\n | enum_  -- alt8\n | define_  -- alt9\n | singleton_  -- alt10\n | goto_  -- alt11\n | call_  -- alt12\n | let_  -- alt13\n | return_  -- alt14\n | fact_  -- alt15\n | forget_  -- alt16\n | new_  -- alt17\n | search_  -- alt18\n | if_  -- alt19\n | simulate_  -- alt20\n | true_  -- alt21\n | false_  -- alt22\n | not_  -- alt23\n | and_  -- alt24\n | or_  -- alt25\n | is_  -- alt26\n | self_  -- alt27\n | as_  -- alt28\n | event_  -- alt29\n | quiescence_  -- alt30\n | for_  -- alt31\n | until_  -- alt32\n | in_  -- alt33\n | foreign_  -- alt34\n | on_  -- alt35\n | always_  -- alt36\n | match_  -- alt37\n | then_  -- alt38\n | else_  -- alt39\n | condition_  -- alt40\n | end_  -- alt41\n | prelude_  -- alt42\n | with_  -- alt43\n | tags_  -- alt44\n | rank_  -- alt45\n | abstract_  -- alt46\n | lazy_  -- alt47\n | force_  -- alt48\n | context_  -- alt49\n | sample_  -- alt50\n | of_  -- alt51\n | open_  -- alt52\n | local_  -- alt53\n | test_  -- alt54\n | assert_  -- alt55\n | requires_  -- alt56\n | ensures_  -- alt57\n | nothing_  -- alt58\n | effect_  -- alt59\n | handle_  -- alt60\n | continue_  -- alt61\n | perform_  -- alt62\n | dsl_  -- alt63\n | trait_  -- alt64\n | implement_  -- alt65\n | has_  -- alt66\n | global_  -- alt67\n | capability_  -- alt68\n | protect_  -- alt69\n | otherwise_  -- alt70\n\r\n  }\r\n  ");
// == Parsing =======================================================
function parse(source, rule) {
    const result = exports.grammar.match(source, rule);
    if (result.failed()) {
        return { ok: false, error: result.message };
    }
    else {
        const ast = toAst(result);
        ($assert_type(ast, "Program", Program));
        return { ok: true, value: ast };
    }
}
exports.parse = parse;
exports.semantics = exports.grammar.createSemantics();
exports.toAstVisitor = ({
    _terminal() {
        return this.primitiveValue;
    },
    _iter(children) {
        if (this._node.isOptional()) {
            if (this.numChildren === 0) {
                return null;
            }
            else {
                return children[0].toAST();
            }
        }
        return children.map((x) => x.toAST());
    },
    nonemptyListOf(first, _, rest) {
        return [first.toAST(), ...rest.toAST()];
    },
    emptyListOf() {
        return [];
    },
    NonemptyListOf(first, _, rest) {
        return [first.toAST(), ...rest.toAST()];
    },
    EmptyListOf() {
        return [];
    },
    program(x) {
        return x.toAST();
    },
    program_alt1(_1, ds$0, _3, _4) {
        ;
        const ds = ds$0.toAST();
        ;
        return (new (Program)($meta(this), ds));
    },
    repl(x) {
        return x.toAST();
    },
    repl_alt1(_1, ds$0, _3, _4) {
        ;
        const ds = ds$0.toAST();
        ;
        return (new (((REPL).Declarations))(ds));
    },
    repl_alt2(_1, xs$0, _3, _4) {
        ;
        const xs = xs$0.toAST();
        ;
        return (new (((REPL).Statements))(xs));
    },
    repl_alt3(_1, x$0, _3, _4) {
        ;
        const x = x$0.toAST();
        ;
        return (new (((REPL).Command))(x));
    },
    replCommand(x) {
        return x.toAST();
    },
    replCommand_alt1(_1, _2, s$0) {
        ;
        ;
        const s = s$0.toAST();
        return (new (((ReplCommand).Rollback))(s));
    },
    replCommand_alt2(_1, _2, _3, s$0) {
        ;
        ;
        ;
        const s = s$0.toAST();
        return (new (((ReplCommand).HelpCommand))(s));
    },
    replCommand_alt3(_1, _2, _3, t$0) {
        ;
        ;
        ;
        const t = t$0.toAST();
        return (new (((ReplCommand).HelpType))(t));
    },
    declarationMeta(x) {
        return x.toAST();
    },
    declarationMeta_alt1(_1, d$0) {
        ;
        const d = d$0.toAST();
        return (new (Metadata)(d));
    },
    meta_doc(x) {
        return x.toAST();
    },
    meta_doc_alt1(d$0) {
        const d = d$0.toAST();
        return d;
    },
    meta_doc_alt2() {
        return [];
    },
    declaration(x) {
        return x.toAST();
    },
    declaration_alt1(_1) {
        return this.children[0].toAST();
    },
    declaration_alt2(_1) {
        return this.children[0].toAST();
    },
    declaration_alt3(_1) {
        return this.children[0].toAST();
    },
    declaration_alt4(_1) {
        return this.children[0].toAST();
    },
    declaration_alt5(_1) {
        return this.children[0].toAST();
    },
    declaration_alt6(_1) {
        return this.children[0].toAST();
    },
    declaration_alt7(_1) {
        return this.children[0].toAST();
    },
    declaration_alt8(_1) {
        return this.children[0].toAST();
    },
    declaration_alt9(_1) {
        return this.children[0].toAST();
    },
    declaration_alt10(_1) {
        return this.children[0].toAST();
    },
    declaration_alt11(_1) {
        return this.children[0].toAST();
    },
    declaration_alt12(_1) {
        return this.children[0].toAST();
    },
    declaration_alt13(_1) {
        return this.children[0].toAST();
    },
    declaration_alt14(_1) {
        return this.children[0].toAST();
    },
    declaration_alt15(_1) {
        return this.children[0].toAST();
    },
    declaration_alt16(_1) {
        return this.children[0].toAST();
    },
    capabilityDeclaration(x) {
        return x.toAST();
    },
    capabilityDeclaration_alt1(m$0, _2, n$0, _4) {
        const m = m$0.toAST();
        ;
        const n = n$0.toAST();
        return (new (((Declaration).Capability))($meta(this), m, n));
    },
    protectDeclaration(x) {
        return x.toAST();
    },
    protectDeclaration_alt1(_1, e$0, _3, c$0, _5) {
        ;
        const e = e$0.toAST();
        ;
        const c = c$0.toAST();
        return (new (((Declaration).Protect))($meta(this), c, e));
    },
    protectEntity(x) {
        return x.toAST();
    },
    protectEntity_alt1(_1, n$0) {
        ;
        const n = n$0.toAST();
        return (new (((ProtectEntity).Type))($meta(this), n));
    },
    protectEntity_alt2(_1, n$0) {
        ;
        const n = n$0.toAST();
        return (new (((ProtectEntity).Effect))($meta(this), n));
    },
    protectEntity_alt3(_1, n$0) {
        ;
        const n = n$0.toAST();
        return (new (((ProtectEntity).Definition))($meta(this), n));
    },
    protectEntity_alt4(_1, n$0) {
        ;
        const n = n$0.toAST();
        return (new (((ProtectEntity).Trait))($meta(this), n));
    },
    traitDeclaration(x) {
        return x.toAST();
    },
    traitDeclaration_alt1(m$0, _2, n$0, _4, cs$0, _6) {
        const m = m$0.toAST();
        ;
        const n = n$0.toAST();
        ;
        const cs = cs$0.toAST();
        return (new (((Declaration).Trait))($meta(this), m, n));
    },
    traitDeclaration_alt2(m$0, _2, n$0, _4) {
        const m = m$0.toAST();
        ;
        const n = n$0.toAST();
        return (new (((Declaration).Trait))($meta(this), m, n));
    },
    traitInstruction(x) {
        return x.toAST();
    },
    traitInstruction_alt1(_1) {
        return this.children[0].toAST();
    },
    traitInstruction_alt2(_1) {
        return this.children[0].toAST();
    },
    traitCommand(x) {
        return x.toAST();
    },
    traitCommand_alt1(_1, _2, _3, _4, _5) {
        ;
        ;
        ;
        ;
        return null;
    },
    traitRequires(x) {
        return x.toAST();
    },
    traitRequires_alt1(_1, _2, n$0, _4) {
        ;
        ;
        const n = n$0.toAST();
        return null;
    },
    traitImplementDeclaration(x) {
        return x.toAST();
    },
    traitImplementDeclaration_alt1(_1, tr$0, _3, tp$0, _5) {
        ;
        const tr = tr$0.toAST();
        ;
        const tp = tp$0.toAST();
        return (new (((Declaration).ImplementTrait))($meta(this), tp, tr));
    },
    effectDeclaration(x) {
        return x.toAST();
    },
    effectDeclaration_alt1(m$0, _2, n$0, _4, cs$0, _6) {
        const m = m$0.toAST();
        ;
        const n = n$0.toAST();
        ;
        const cs = cs$0.toAST();
        return (new (((Declaration).Effect))($meta(this), m, n, cs));
    },
    effectCase(x) {
        return x.toAST();
    },
    effectCase_alt1(m$0, s$0, xs$0, _4) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const xs = xs$0.toAST();
        return (new (EffectCase)($meta(this), m, s, xs));
    },
    effectCaseParams(x) {
        return x.toAST();
    },
    effectCaseParams_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return xs;
    },
    testDeclaration(x) {
        return x.toAST();
    },
    testDeclaration_alt1(_1, s$0, _3, b$0, _5) {
        ;
        const s = s$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (((Declaration).Test))($meta(this), s, b));
    },
    trailingTest(x) {
        return x.toAST();
    },
    trailingTest_alt1(_1) {
        return this.children[0].toAST();
    },
    trailingTest_alt2(_1) {
        return null;
    },
    oneTrailingTest(x) {
        return x.toAST();
    },
    oneTrailingTest_alt1(_1, b$0, _3) {
        ;
        const b = b$0.toAST();
        return (new (TrailingTest)($meta(this), b));
    },
    localDeclaration(x) {
        return x.toAST();
    },
    localDeclaration_alt1(_1, d$0) {
        ;
        const d = d$0.toAST();
        return (new (((Declaration).Local))($meta(this), d));
    },
    localDeclaration_alt2(_1, t$0) {
        ;
        const t = t$0.toAST();
        return (new (((Declaration).Local))($meta(this), t));
    },
    openDeclaration(x) {
        return x.toAST();
    },
    openDeclaration_alt1(_1, ns$0, _3) {
        ;
        const ns = ns$0.toAST();
        return (new (((Declaration).Open))($meta(this), ns));
    },
    relationDeclaration(x) {
        return x.toAST();
    },
    relationDeclaration_alt1(m$0, _2, _3, s$0, _5) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        return (new (((Declaration).Relation))($meta(this), m, s));
    },
    relationPart(x) {
        return x.toAST();
    },
    relationPart_alt1(n$0, _2) {
        const n = n$0.toAST();
        return (new (((RelationPart).Many))($meta(this), n));
    },
    relationPart_alt2(n$0) {
        const n = n$0.toAST();
        return (new (((RelationPart).One))($meta(this), n));
    },
    doDeclaration(x) {
        return x.toAST();
    },
    doDeclaration_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return (new (((Declaration).Do))($meta(this), xs));
    },
    commandDeclaration(x) {
        return x.toAST();
    },
    commandDeclaration_alt1(m$0, _2, _3, s$0, c$0, _6, e$0, t$0) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const e = e$0.toAST();
        const t = t$0.toAST();
        return (new (((Declaration).Command))($meta(this), m, s, c, [(new (((Statement).Expr))(e))], t));
    },
    commandDeclaration_alt2(m$0, _2, _3, s$0, c$0, _6, b$0, t$0) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const b = b$0.toAST();
        const t = t$0.toAST();
        return (new (((Declaration).Command))($meta(this), m, s, c, b, t));
    },
    commandDeclaration_alt3(m$0, _2, _3, s$0, c$0, _6, b$0, _8) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (((Declaration).Command))($meta(this), m, s, c, b, null));
    },
    contractDefinition(x) {
        return x.toAST();
    },
    contractDefinition_alt1(ret$0, pre$0, post$0) {
        const ret = ret$0.toAST();
        const pre = pre$0.toAST();
        const post = post$0.toAST();
        return (new (Contract)($meta(this), ret, pre, post));
    },
    retContractDefinition(x) {
        return x.toAST();
    },
    retContractDefinition_alt1(_1, t$0) {
        ;
        const t = t$0.toAST();
        return t;
    },
    retContractDefinition_alt2() {
        return null;
    },
    preContractDefinition(x) {
        return x.toAST();
    },
    preContractDefinition_alt1(_1, cs$0) {
        ;
        const cs = cs$0.toAST();
        return cs;
    },
    preContractDefinition_alt2() {
        return [];
    },
    postContractDefinition(x) {
        return x.toAST();
    },
    postContractDefinition_alt1(_1, cs$0) {
        ;
        const cs = cs$0.toAST();
        return cs;
    },
    postContractDefinition_alt2() {
        return [];
    },
    contractCondition(x) {
        return x.toAST();
    },
    contractCondition_alt1(n$0, _2, e$0) {
        const n = n$0.toAST();
        ;
        const e = e$0.toAST();
        return (new (ContractCondition)($meta(this), n, e));
    },
    parameter(x) {
        return x.toAST();
    },
    parameter_alt1(n$0) {
        const n = n$0.toAST();
        return (new (((Parameter).Untyped))($meta(this), n));
    },
    parameter_alt2(_1, n$0, _3, t$0, _5) {
        ;
        const n = n$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((Parameter).Typed))($meta(this), n, t));
    },
    parameter_alt3(_1, n$0, _3, trs$0, _5) {
        ;
        const n = n$0.toAST();
        ;
        const trs = trs$0.toAST();
        return (new (((Parameter).Typed))($meta(this), n, (new (((TypeConstraint).Has))($meta(this), (new (((TypeConstraint).Type))($meta(this), (new (((TypeApp).Any))($meta(this))))), trs))));
    },
    parameter_alt4(t$0) {
        const t = t$0.toAST();
        return (new (((Parameter).TypedOnly))($meta(this), (new (((TypeConstraint).Type))($meta(this), t))));
    },
    typeConstraint(x) {
        return x.toAST();
    },
    typeConstraint_alt1(t$0, _2, trs$0) {
        const t = t$0.toAST();
        ;
        const trs = trs$0.toAST();
        return (new (((TypeConstraint).Has))($meta(this), t, trs));
    },
    typeConstraint_alt2(_1) {
        return this.children[0].toAST();
    },
    typeConstraint1(x) {
        return x.toAST();
    },
    typeConstraint1_alt1(n$0, _2, c$0) {
        const n = n$0.toAST();
        ;
        const c = c$0.toAST();
        return (new (((TypeConstraint).Type))($meta(this), c));
    },
    typeConstraint1_alt2(_1) {
        return this.children[0].toAST();
    },
    typeConstraintPrimary(x) {
        return x.toAST();
    },
    typeConstraintPrimary_alt1(n$0) {
        const n = n$0.toAST();
        return (new (((TypeConstraint).Type))($meta(this), (new (((TypeApp).Any))($meta(this)))));
    },
    typeConstraintPrimary_alt2(t$0) {
        const t = t$0.toAST();
        return (new (((TypeConstraint).Type))($meta(this), t));
    },
    typeConstraintPrimary_alt3(_1, t$0, _3) {
        ;
        const t = t$0.toAST();
        return t;
    },
    typeApp(x) {
        return x.toAST();
    },
    typeApp_alt1(ts$0, _2, t$0) {
        const ts = ts$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((TypeApp).Function))($meta(this), ts, t));
    },
    typeApp_alt2(_1) {
        return this.children[0].toAST();
    },
    typeAppArgs(x) {
        return x.toAST();
    },
    typeAppArgs_alt1(_1, ts$0, _3) {
        ;
        const ts = ts$0.toAST();
        return ts;
    },
    typeAppArgs_alt2(t$0) {
        const t = t$0.toAST();
        return [t];
    },
    typeApp1(x) {
        return x.toAST();
    },
    typeApp1_alt1(t$0, _2, _3, _4) {
        const t = t$0.toAST();
        ;
        ;
        return t;
    },
    typeApp1_alt2(_1) {
        return this.children[0].toAST();
    },
    typeAppStatic(x) {
        return x.toAST();
    },
    typeAppStatic_alt1(_1, t$0) {
        ;
        const t = t$0.toAST();
        return (new (((TypeApp).Static))($meta(this), t));
    },
    typeAppStatic_alt2(_1) {
        return this.children[0].toAST();
    },
    typeAppPrimary(x) {
        return x.toAST();
    },
    typeAppPrimary_alt1(t$0) {
        const t = t$0.toAST();
        return (new (((TypeApp).Named))($meta(this), t));
    },
    typeAppPrimary_alt2(_1, t$0, _3) {
        ;
        const t = t$0.toAST();
        return t;
    },
    typeName(x) {
        return x.toAST();
    },
    typeName_alt1(_1) {
        return this.children[0].toAST();
    },
    typeName_alt2(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    typeName_alt3(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    typeName_alt4(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    traitName(x) {
        return x.toAST();
    },
    traitName_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Trait).Named))($meta(this), x));
    },
    typeDeclaration(x) {
        return x.toAST();
    },
    typeDeclaration_alt1(m$0, _2, _3, t$0, _5, _6, n$0, _8) {
        const m = m$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        ;
        ;
        const n = n$0.toAST();
        return (new (((Declaration).ForeignType))($meta(this), m, t, n));
    },
    typeDeclaration_alt2(m$0, _2, _3, t$0, _5, vs$0, _7) {
        const m = m$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        ;
        const vs = vs$0.toAST();
        return (new (((Declaration).EnumType))($meta(this), m, t, vs));
    },
    typeDeclaration_alt3(m$0, _2, _3, t$0, _5) {
        const m = m$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        return (new (((Declaration).AbstractType))($meta(this), m, t));
    },
    typeDeclaration_alt4(m$0, _2, _3, t$0, i$0) {
        const m = m$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        const i = i$0.toAST();
        return (new (((Declaration).SingletonType))($meta(this), m, t, i));
    },
    typeDeclaration_alt5(m$0, _2, _3, n$0, fs$0, p$0, _7) {
        const m = m$0.toAST();
        ;
        ;
        const n = n$0.toAST();
        const fs = fs$0.toAST();
        const p = p$0.toAST();
        return (new (((Declaration).Type))($meta(this), m, (new (TypeDef)(p, n)), fs));
    },
    basicType(x) {
        return x.toAST();
    },
    basicType_alt1(n$0, p$0) {
        const n = n$0.toAST();
        const p = p$0.toAST();
        return (new (TypeDef)(p, n));
    },
    typeDefParent(x) {
        return x.toAST();
    },
    typeDefParent_alt1(_1, t$0) {
        ;
        const t = t$0.toAST();
        return t;
    },
    typeDefParent_alt2() {
        return null;
    },
    typeInitBlock(x) {
        return x.toAST();
    },
    typeInitBlock_alt1(_1, x$0, _3) {
        ;
        const x = x$0.toAST();
        return x;
    },
    typeInitBlock_alt2(_1) {
        return [];
    },
    typeFields(x) {
        return x.toAST();
    },
    typeFields_alt1(_1, fs$0, _3) {
        ;
        const fs = fs$0.toAST();
        return fs;
    },
    typeFields_alt2() {
        return [];
    },
    typeField(x) {
        return x.toAST();
    },
    typeField_alt1(v$0, p$0) {
        const v = v$0.toAST();
        const p = p$0.toAST();
        return (new (TypeField)($meta(this), v, p));
    },
    typeParameter(x) {
        return x.toAST();
    },
    typeParameter_alt1(n$0, _2, t$0) {
        const n = n$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((Parameter).Typed))($meta(this), n, t));
    },
    typeParameter_alt2(n$0) {
        const n = n$0.toAST();
        return (new (((Parameter).Untyped))($meta(this), n));
    },
    fieldVisibility(x) {
        return x.toAST();
    },
    fieldVisibility_alt1(_1) {
        return (new (((FieldVisibility).Global))());
    },
    fieldVisibility_alt2() {
        return (new (((FieldVisibility).Local))());
    },
    typeFieldName(x) {
        return x.toAST();
    },
    typeFieldName_alt1(_1) {
        return this.children[0].toAST();
    },
    typeFieldName_alt2(_1) {
        return this.children[0].toAST();
    },
    typeInit(x) {
        return x.toAST();
    },
    typeInit_alt1(s$0, _2) {
        const s = s$0.toAST();
        return (new (((TypeInit).Fact))($meta(this), s));
    },
    typeInit_alt2(_1) {
        return this.children[0].toAST();
    },
    typeInitCommand(x) {
        return x.toAST();
    },
    typeInitCommand_alt1(m$0, _2, _3, s$0, c$0, _6, e$0, t$0) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const e = e$0.toAST();
        const t = t$0.toAST();
        return (new (((TypeInit).Command))($meta(this), m, s, c, [(new (((Statement).Expr))(e))], t));
    },
    typeInitCommand_alt2(m$0, _2, _3, s$0, c$0, _6, b$0, t$0) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const b = b$0.toAST();
        const t = t$0.toAST();
        return (new (((TypeInit).Command))($meta(this), m, s, c, b, t));
    },
    typeInitCommand_alt3(m$0, _2, _3, s$0, c$0, _6, b$0, _8) {
        const m = m$0.toAST();
        ;
        ;
        const s = s$0.toAST();
        const c = c$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (((TypeInit).Command))($meta(this), m, s, c, b, null));
    },
    defineDeclaration(x) {
        return x.toAST();
    },
    defineDeclaration_alt1(m$0, _2, _3, n$0, _5, e$0, _7) {
        const m = m$0.toAST();
        ;
        ;
        const n = n$0.toAST();
        ;
        const e = e$0.toAST();
        return (new (((Declaration).Define))($meta(this), m, n, e));
    },
    actionDeclaration(x) {
        return x.toAST();
    },
    actionDeclaration_alt1(m$0, _2, _3, t$0, n$0, title$0, p$0, r$0, _9, b$0, c$0, _12) {
        const m = m$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        const n = n$0.toAST();
        const title = title$0.toAST();
        const p = p$0.toAST();
        const r = r$0.toAST();
        ;
        const b = b$0.toAST();
        const c = c$0.toAST();
        return (new (((Declaration).Action))($meta(this), m, t, n, title, p, r, b, c));
    },
    actionPredicate(x) {
        return x.toAST();
    },
    actionPredicate_alt1(_1, p$0) {
        ;
        const p = p$0.toAST();
        return p;
    },
    actionPredicate_alt2() {
        return (new (((Predicate).Always))($meta(this)));
    },
    actionRank(x) {
        return x.toAST();
    },
    actionRank_alt1(_1, e$0) {
        ;
        const e = e$0.toAST();
        return (new (((Rank).Expr))(e));
    },
    actionRank_alt2() {
        return (new (((Rank).Unranked))($meta(this)));
    },
    actionInit(x) {
        return x.toAST();
    },
    actionInit_alt1(_1, cs$0) {
        ;
        const cs = cs$0.toAST();
        return cs;
    },
    actionInit_alt2() {
        return [];
    },
    whenDeclaration(x) {
        return x.toAST();
    },
    whenDeclaration_alt1(m$0, _2, _3, p$0, _5, b$0, _7) {
        const m = m$0.toAST();
        ;
        ;
        const p = p$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (((Declaration).When))($meta(this), m, p, b));
    },
    contextDeclaration(x) {
        return x.toAST();
    },
    contextDeclaration_alt1(m$0, _2, _3, n$0, _5, xs$0, _7) {
        const m = m$0.toAST();
        ;
        ;
        const n = n$0.toAST();
        ;
        const xs = xs$0.toAST();
        return (new (((Declaration).Context))($meta(this), m, n, xs));
    },
    contextItem(x) {
        return x.toAST();
    },
    contextItem_alt1(_1) {
        return this.children[0].toAST();
    },
    contextItem_alt2(_1) {
        return this.children[0].toAST();
    },
    predicate(x) {
        return x.toAST();
    },
    predicate_alt1(_1) {
        return this.children[0].toAST();
    },
    predicateBinary(x) {
        return x.toAST();
    },
    predicateBinary_alt1(_1) {
        return this.children[0].toAST();
    },
    predicateBinary_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateBinary_alt3(_1) {
        return this.children[0].toAST();
    },
    predicateAnd(x) {
        return x.toAST();
    },
    predicateAnd_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Predicate).And))($meta(this), l, r));
    },
    predicateAnd1(x) {
        return x.toAST();
    },
    predicateAnd1_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Predicate).And))($meta(this), l, r));
    },
    predicateAnd1_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateOr(x) {
        return x.toAST();
    },
    predicateOr_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Predicate).Or))($meta(this), l, r));
    },
    predicateOr1(x) {
        return x.toAST();
    },
    predicateOr1_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Predicate).Or))($meta(this), l, r));
    },
    predicateOr1_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateNot(x) {
        return x.toAST();
    },
    predicateNot_alt1(_1, p$0) {
        ;
        const p = p$0.toAST();
        return (new (((Predicate).Not))($meta(this), p));
    },
    predicateNot_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateConstrain(x) {
        return x.toAST();
    },
    predicateConstrain_alt1(p$0, _2, c$0) {
        const p = p$0.toAST();
        ;
        const c = c$0.toAST();
        return (new (((Predicate).Constrain))($meta(this), p, c));
    },
    predicateConstrain_alt2(_1, c$0) {
        ;
        const c = c$0.toAST();
        return (new (((Predicate).Constrain))($meta(this), (new (((Predicate).Always))($meta(this))), c));
    },
    predicateConstrain_alt3(_1) {
        return this.children[0].toAST();
    },
    predicateConstrain_alt4(_1) {
        return this.children[0].toAST();
    },
    predicateConstrain_alt5(_1) {
        return this.children[0].toAST();
    },
    predicateConstrain_alt6(_1) {
        return this.children[0].toAST();
    },
    predicateType(x) {
        return x.toAST();
    },
    predicateType_alt1(n$0, _2, t$0) {
        const n = n$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((Predicate).Typed))($meta(this), n, t));
    },
    predicateLet(x) {
        return x.toAST();
    },
    predicateLet_alt1(_1, n$0, _3, e$0) {
        ;
        const n = n$0.toAST();
        ;
        const e = e$0.toAST();
        return (new (((Predicate).Let))($meta(this), n, e));
    },
    predicateSample(x) {
        return x.toAST();
    },
    predicateSample_alt1(_1, n$0, _3, p$0) {
        ;
        const n = n$0.toAST();
        ;
        const p = p$0.toAST();
        return (new (((Predicate).Sample))($meta(this), n, p));
    },
    samplingPool(x) {
        return x.toAST();
    },
    samplingPool_alt1(r$0) {
        const r = r$0.toAST();
        return (new (((SamplingPool).Relation))($meta(this), r));
    },
    samplingPool_alt2(l$0, _2, t$0) {
        const l = l$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((SamplingPool).Type))($meta(this), l, t));
    },
    predicatePrimary(x) {
        return x.toAST();
    },
    predicatePrimary_alt1(_1) {
        return (new (((Predicate).Always))($meta(this)));
    },
    predicatePrimary_alt2(r$0) {
        const r = r$0.toAST();
        return (new (((Predicate).Has))($meta(this), r));
    },
    predicatePrimary_alt3(_1, p$0, _3) {
        ;
        const p = p$0.toAST();
        return (new (((Predicate).Parens))($meta(this), p));
    },
    pattern(x) {
        return x.toAST();
    },
    pattern_alt1(_1, c$0, _3) {
        ;
        const c = c$0.toAST();
        return c;
    },
    pattern_alt2(_1, p$0) {
        ;
        const p = p$0.toAST();
        return (new (((Pattern).StaticType))($meta(this), p));
    },
    pattern_alt3(n$0) {
        const n = n$0.toAST();
        return (new (((Pattern).Global))($meta(this), n));
    },
    pattern_alt4(_1) {
        return (new (((Pattern).Self))($meta(this)));
    },
    pattern_alt5(l$0) {
        const l = l$0.toAST();
        return (new (((Pattern).Lit))(l));
    },
    pattern_alt6(_1) {
        return this.children[0].toAST();
    },
    patternComplex(x) {
        return x.toAST();
    },
    patternComplex_alt1(n$0, _2, t$0) {
        const n = n$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((Pattern).HasType))($meta(this), t, n));
    },
    patternName(x) {
        return x.toAST();
    },
    patternName_alt1(_1) {
        return (new (((Pattern).Wildcard))($meta(this)));
    },
    patternName_alt2(n$0) {
        const n = n$0.toAST();
        return (new (((Pattern).Variable))($meta(this), n));
    },
    statement(x) {
        return x.toAST();
    },
    statement_alt1(_1) {
        return this.children[0].toAST();
    },
    statement_alt2(_1) {
        return this.children[0].toAST();
    },
    statement_alt3(_1) {
        return this.children[0].toAST();
    },
    statement_alt4(_1) {
        return this.children[0].toAST();
    },
    statement_alt5(_1) {
        return this.children[0].toAST();
    },
    statement_alt6(e$0) {
        const e = e$0.toAST();
        return (new (((Statement).Expr))(e));
    },
    blockStatement(x) {
        return x.toAST();
    },
    blockStatement_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Statement).Expr))(x));
    },
    letStatement(x) {
        return x.toAST();
    },
    letStatement_alt1(_1, n$0, _3, e$0) {
        ;
        const n = n$0.toAST();
        ;
        const e = e$0.toAST();
        return (new (((Statement).Let))($meta(this), n, e));
    },
    factStatement(x) {
        return x.toAST();
    },
    factStatement_alt1(_1, s$0) {
        ;
        const s = s$0.toAST();
        return (new (((Statement).Fact))($meta(this), s));
    },
    forgetStatement(x) {
        return x.toAST();
    },
    forgetStatement_alt1(_1, s$0) {
        ;
        const s = s$0.toAST();
        return (new (((Statement).Forget))($meta(this), s));
    },
    simulateStatement(x) {
        return x.toAST();
    },
    simulateStatement_alt1(_1, _2, e$0, c$0, _5, g$0, s$0) {
        ;
        ;
        const e = e$0.toAST();
        const c = c$0.toAST();
        ;
        const g = g$0.toAST();
        const s = s$0.toAST();
        return (new (((Statement).Simulate))($meta(this), e, c, g, s));
    },
    simulateContext(x) {
        return x.toAST();
    },
    simulateContext_alt1(_1, n$0) {
        ;
        const n = n$0.toAST();
        return (new (((SimulationContext).Named))($meta(this), n));
    },
    simulateContext_alt2() {
        return (new (((SimulationContext).Global))());
    },
    simulateGoal(x) {
        return x.toAST();
    },
    simulateGoal_alt1(_1, _2) {
        ;
        return (new (((SimulationGoal).ActionQuiescence))($meta(this)));
    },
    simulateGoal_alt2(_1, _2) {
        ;
        return (new (((SimulationGoal).EventQuiescence))($meta(this)));
    },
    simulateGoal_alt3(_1) {
        return (new (((SimulationGoal).TotalQuiescence))($meta(this)));
    },
    simulateGoal_alt4(p$0) {
        const p = p$0.toAST();
        return (new (((SimulationGoal).CustomGoal))($meta(this), p));
    },
    signal(x) {
        return x.toAST();
    },
    signal_alt1(_1, s$0, _3, b$0, _5) {
        ;
        const s = s$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (Signal)($meta(this), s, b));
    },
    assertStatement(x) {
        return x.toAST();
    },
    assertStatement_alt1(_1, e$0) {
        ;
        const e = e$0.toAST();
        return (new (((Statement).Assert))($meta(this), e));
    },
    expression(x) {
        return x.toAST();
    },
    expression_alt1(_1) {
        return this.children[0].toAST();
    },
    expression_alt2(_1) {
        return this.children[0].toAST();
    },
    expression_alt3(_1) {
        return this.children[0].toAST();
    },
    expression_alt4(_1) {
        return this.children[0].toAST();
    },
    expression_alt5(_1) {
        return this.children[0].toAST();
    },
    expression_alt6(_1) {
        return this.children[0].toAST();
    },
    expression_alt7(_1) {
        return this.children[0].toAST();
    },
    expression_alt8(_1) {
        return this.children[0].toAST();
    },
    searchExpression(x) {
        return x.toAST();
    },
    searchExpression_alt1(_1, p$0) {
        ;
        const p = p$0.toAST();
        return (new (((Expression).Search))($meta(this), p));
    },
    lazyExpression(x) {
        return x.toAST();
    },
    lazyExpression_alt1(_1, e$0) {
        ;
        const e = e$0.toAST();
        return (new (((Expression).Lazy))($meta(this), e));
    },
    forceExpression(x) {
        return x.toAST();
    },
    forceExpression_alt1(_1, e$0) {
        ;
        const e = e$0.toAST();
        return (new (((Expression).Force))($meta(this), e));
    },
    foreignExpression(x) {
        return x.toAST();
    },
    foreignExpression_alt1(_1, ns$0, _3, xs$0, _5) {
        ;
        const ns = ns$0.toAST();
        ;
        const xs = xs$0.toAST();
        return (new (((Expression).ForeignInvoke))($meta(this), ns, xs));
    },
    continueWithExpression(x) {
        return x.toAST();
    },
    continueWithExpression_alt1(_1, _2, e$0) {
        ;
        ;
        const e = e$0.toAST();
        return (new (((Expression).ContinueWith))($meta(this), e));
    },
    expressionBlock(x) {
        return x.toAST();
    },
    expressionBlock_alt1(_1, b$0, _3) {
        ;
        const b = b$0.toAST();
        return (new (((Expression).Block))($meta(this), b));
    },
    assignExpression(x) {
        return x.toAST();
    },
    assignExpression_alt1(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Binary))($meta(this), op, l, r))));
    },
    pipeExpression(x) {
        return x.toAST();
    },
    pipeExpression_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Expression).Pipe))($meta(this), l, r));
    },
    pipeExpression_alt2(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Expression).PipeInvoke))($meta(this), l, r));
    },
    pipeExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    invokeMixfix(x) {
        return x.toAST();
    },
    invokeMixfix_alt1(s$0, ps$0) {
        const s = s$0.toAST();
        const ps = ps$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Keyword))($meta(this), s, ps))));
    },
    invokeMixfix_alt2(ps$0) {
        const ps = ps$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).KeywordSelfless))($meta(this), ps))));
    },
    invokeMixfix_alt3(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression(x) {
        return x.toAST();
    },
    invokeInfixExpression_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        ;
        const r = r$0.toAST();
        return (new (((Expression).IntrinsicEqual))($meta(this), l, r));
    },
    invokeInfixExpression_alt2(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Binary))($meta(this), op, l, r))));
    },
    invokeInfixExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt4(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt5(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt6(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt7(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt8(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt9(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt10(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt11(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression_alt12(_1) {
        return this.children[0].toAST();
    },
    invokeInfixSequence(x) {
        return x.toAST();
    },
    invokeInfixSequence_alt1(l$0, x$0, r$0) {
        const l = l$0.toAST();
        const x = x$0.toAST();
        const r = r$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Binary))($meta(this), x, l, r))));
    },
    invokeInfixSequence_alt2(l$0, x$0, r$0) {
        const l = l$0.toAST();
        const x = x$0.toAST();
        const r = r$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Binary))($meta(this), x, l, r))));
    },
    castExpression(x) {
        return x.toAST();
    },
    castExpression_alt1(s$0, op$0, t$0) {
        const s = s$0.toAST();
        const op = op$0.toAST();
        const t = t$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Binary))($meta(this), op, s, t))));
    },
    castExpression_alt2(s$0, _2, t$0) {
        const s = s$0.toAST();
        ;
        const t = t$0.toAST();
        return (new (((Expression).HasType))($meta(this), s, t));
    },
    castExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    castType(x) {
        return x.toAST();
    },
    castType_alt1(t$0) {
        const t = t$0.toAST();
        return (new (((Expression).Type))($meta(this), t));
    },
    invokePrePost(x) {
        return x.toAST();
    },
    invokePrePost_alt1(_1) {
        return this.children[0].toAST();
    },
    invokePrefix(x) {
        return x.toAST();
    },
    invokePrefix_alt1(n$0, p$0) {
        const n = n$0.toAST();
        const p = p$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Unary))($meta(this), p, n))));
    },
    invokePrefix_alt2(_1) {
        return this.children[0].toAST();
    },
    invokePostfix(x) {
        return x.toAST();
    },
    invokePostfix_alt1(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return (new (((Expression).Invoke))($meta(this), (new (((Signature).Unary))($meta(this), s, n))));
    },
    invokePostfix_alt2(_1) {
        return this.children[0].toAST();
    },
    applyExpression(x) {
        return x.toAST();
    },
    applyExpression_alt1(f$0, _2, xs$0, _4) {
        const f = f$0.toAST();
        ;
        const xs = xs$0.toAST();
        return (new (((Expression).Apply))($meta(this), f, xs));
    },
    applyExpression_alt2(_1) {
        return this.children[0].toAST();
    },
    memberExpression(x) {
        return x.toAST();
    },
    memberExpression_alt1(o$0, _2, f$0) {
        const o = o$0.toAST();
        ;
        const f = f$0.toAST();
        return (new (((Expression).Project))($meta(this), o, f));
    },
    memberExpression_alt2(o$0, _2, p$0) {
        const o = o$0.toAST();
        ;
        const p = p$0.toAST();
        return (new (((Expression).Select))($meta(this), o, p));
    },
    memberExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    memberSelection(x) {
        return x.toAST();
    },
    memberSelection_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return xs;
    },
    fieldSelection(x) {
        return x.toAST();
    },
    fieldSelection_alt1(n$0, _2, a$0) {
        const n = n$0.toAST();
        ;
        const a = a$0.toAST();
        return (new (Projection)($meta(this), n, a));
    },
    fieldSelection_alt2(n$0) {
        const n = n$0.toAST();
        return (new (Projection)($meta(this), n, n));
    },
    primaryExpression(x) {
        return x.toAST();
    },
    primaryExpression_alt1(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt2(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt4(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt5(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt6(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt7(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt8(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt9(_1, t$0) {
        ;
        const t = t$0.toAST();
        return (new (((Expression).Type))($meta(this), t));
    },
    primaryExpression_alt10(_1) {
        return (new (((Expression).Return))($meta(this)));
    },
    primaryExpression_alt11(_1) {
        return (new (((Expression).Self))($meta(this)));
    },
    primaryExpression_alt12(n$0) {
        const n = n$0.toAST();
        return (new (((Expression).Global))($meta(this), n));
    },
    primaryExpression_alt13(n$0) {
        const n = n$0.toAST();
        return (new (((Expression).Variable))($meta(this), n));
    },
    primaryExpression_alt14(_1, e$0, _3) {
        ;
        const e = e$0.toAST();
        return (new (((Expression).Parens))($meta(this), e));
    },
    conditionExpression(x) {
        return x.toAST();
    },
    conditionExpression_alt1(_1, cs$0, _3) {
        ;
        const cs = cs$0.toAST();
        return (new (((Expression).Condition))($meta(this), cs));
    },
    conditionCase(x) {
        return x.toAST();
    },
    conditionCase_alt1(_1, e$0, b$0) {
        ;
        const e = e$0.toAST();
        const b = b$0.toAST();
        return (new (ConditionCase)($meta(this), e, b));
    },
    conditionCase_alt2(_1, b$0) {
        ;
        const b = b$0.toAST();
        return (new (ConditionCase)($meta(this), (new (((Expression).Lit))((new (((Literal).True))($meta(this))))), b));
    },
    matchSearchExpression(x) {
        return x.toAST();
    },
    matchSearchExpression_alt1(_1, c$0, _3) {
        ;
        const c = c$0.toAST();
        return (new (((Expression).MatchSearch))($meta(this), c));
    },
    matchSearchCase(x) {
        return x.toAST();
    },
    matchSearchCase_alt1(_1, p$0, b$0) {
        ;
        const p = p$0.toAST();
        const b = b$0.toAST();
        return (new (MatchSearchCase)($meta(this), p, b));
    },
    matchSearchCase_alt2(_1, b$0) {
        ;
        const b = b$0.toAST();
        return (new (MatchSearchCase)($meta(this), (new (((Predicate).Always))($meta(this))), b));
    },
    forExpression(x) {
        return x.toAST();
    },
    forExpression_alt1(_1, b$0) {
        ;
        const b = b$0.toAST();
        return (new (((Expression).For))($meta(this), b));
    },
    forExprMap(x) {
        return x.toAST();
    },
    forExprMap_alt1(n$0, _2, e$0, r$0) {
        const n = n$0.toAST();
        ;
        const e = e$0.toAST();
        const r = r$0.toAST();
        return (new (((ForExpression).Map))($meta(this), n, e, r));
    },
    forExprMap1(x) {
        return x.toAST();
    },
    forExprMap1_alt1(_1, b$0) {
        ;
        const b = b$0.toAST();
        return b;
    },
    forExprMap1_alt2(_1, e$0, b$0) {
        ;
        const e = e$0.toAST();
        const b = b$0.toAST();
        return (new (((ForExpression).If))($meta(this), e, b));
    },
    forExprMap1_alt3(_1) {
        return this.children[0].toAST();
    },
    forExprDo(x) {
        return x.toAST();
    },
    forExprDo_alt1(b$0) {
        const b = b$0.toAST();
        return (new (((ForExpression).Do))($meta(this), b));
    },
    performExpression(x) {
        return x.toAST();
    },
    performExpression_alt1(_1, n$0, _3, v$0, _5, xs$0, _7) {
        ;
        const n = n$0.toAST();
        ;
        const v = v$0.toAST();
        ;
        const xs = xs$0.toAST();
        return (new (((Expression).Perform))($meta(this), n, v, xs));
    },
    newExpression(x) {
        return x.toAST();
    },
    newExpression_alt1(_1, n$0, fs$0) {
        ;
        const n = n$0.toAST();
        const fs = fs$0.toAST();
        return (new (((Expression).New))($meta(this), n, fs));
    },
    newFields(x) {
        return x.toAST();
    },
    newFields_alt1(_1, fs$0, _3) {
        ;
        const fs = fs$0.toAST();
        return fs;
    },
    newFields_alt2() {
        return [];
    },
    listExpression(x) {
        return x.toAST();
    },
    listExpression_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return (new (((Expression).List))($meta(this), xs));
    },
    recordExpression(x) {
        return x.toAST();
    },
    recordExpression_alt1(_1, _2, _3) {
        ;
        ;
        return (new (((Expression).Record))($meta(this), []));
    },
    recordExpression_alt2(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return (new (((Expression).Record))($meta(this), xs));
    },
    recordPair(x) {
        return x.toAST();
    },
    recordPair_alt1(n$0, _2, v$0) {
        const n = n$0.toAST();
        ;
        const v = v$0.toAST();
        return (new (Pair)($meta(this), n, v));
    },
    recordField(x) {
        return x.toAST();
    },
    recordField_alt1(n$0) {
        const n = n$0.toAST();
        return (new (((RecordField).FName))(n));
    },
    recordField_alt2(t$0) {
        const t = t$0.toAST();
        return (new (((RecordField).FText))(t));
    },
    recordField_alt3(_1, e$0, _3) {
        ;
        const e = e$0.toAST();
        return (new (((RecordField).FComputed))(e));
    },
    literalExpression(x) {
        return x.toAST();
    },
    literalExpression_alt1(l$0) {
        const l = l$0.toAST();
        return (new (((Expression).Lit))(l));
    },
    lambdaExpression(x) {
        return x.toAST();
    },
    lambdaExpression_alt1(_1, e$0, _3) {
        ;
        const e = e$0.toAST();
        return (new (((Expression).Lambda))($meta(this), [], e));
    },
    lambdaExpression_alt2(_1, p$0, _3, e$0, _5) {
        ;
        const p = p$0.toAST();
        ;
        const e = e$0.toAST();
        return (new (((Expression).Lambda))($meta(this), p, e));
    },
    handleExpression(x) {
        return x.toAST();
    },
    handleExpression_alt1(_1, b$0, _3, hs$0, _5) {
        ;
        const b = b$0.toAST();
        ;
        const hs = hs$0.toAST();
        return (new (((Expression).Handle))($meta(this), b, hs));
    },
    handlers(x) {
        return x.toAST();
    },
    handlers_alt1(xs$0) {
        const xs = xs$0.toAST();
        return xs;
    },
    one_handler(x) {
        return x.toAST();
    },
    one_handler_alt1(_1, n$0, _3, v$0, _5, xs$0, _7, b$0) {
        ;
        const n = n$0.toAST();
        ;
        const v = v$0.toAST();
        ;
        const xs = xs$0.toAST();
        ;
        const b = b$0.toAST();
        return (new (Handler)($meta(this), n, v, xs, b));
    },
    atomicExpression(x) {
        return x.toAST();
    },
    atomicExpression_alt1(a$0) {
        const a = a$0.toAST();
        return (new (((Expression).Global))($meta(this), a));
    },
    atomicExpression_alt2(_1) {
        return this.children[0].toAST();
    },
    atomicExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    atomicExpression_alt4(_1) {
        return this.children[0].toAST();
    },
    atomicExpression_alt5(_1) {
        return this.children[0].toAST();
    },
    atomicExpression_alt6(_1) {
        return this.children[0].toAST();
    },
    blockExpression(x) {
        return x.toAST();
    },
    blockExpression_alt1(_1) {
        return this.children[0].toAST();
    },
    blockExpression_alt2(_1) {
        return this.children[0].toAST();
    },
    blockExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    blockExpression_alt4(_1) {
        return this.children[0].toAST();
    },
    blockExpression_alt5(_1) {
        return this.children[0].toAST();
    },
    blockExpression_alt6(_1) {
        return this.children[0].toAST();
    },
    interpolateExpression(x) {
        return x.toAST();
    },
    interpolateExpression_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Expression).Interpolate))($meta(this), x));
    },
    interpolateText(x) {
        return x.toAST();
    },
    interpolateText_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return (new (Interpolation)($meta(this), xs));
    },
    interpolateText_alt2(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return (new (Interpolation)($meta(this), xs));
    },
    interpolatePart(x) {
        return x.toAST();
    },
    interpolatePart_alt1(_1, c$0) {
        ;
        const c = c$0.toAST();
        return (new (((InterpolationPart).Escape))($meta(this), c));
    },
    interpolatePart_alt2(_1, x$0, _3) {
        ;
        const x = x$0.toAST();
        return (new (((InterpolationPart).Dynamic))($meta(this), x));
    },
    interpolatePart_alt3(c$0) {
        const c = c$0.toAST();
        return (new (((InterpolationPart).Static))($meta(this), c));
    },
    interpolateStatic(x) {
        return x.toAST();
    },
    interpolateStatic_alt1(_1) {
        return this.sourceString;
    },
    dslExpression(x) {
        return x.toAST();
    },
    dslExpression_alt1(_1, t$0, _3, x$0, _5) {
        ;
        const t = t$0.toAST();
        ;
        const x = x$0.toAST();
        return (new (((Expression).Dsl))($meta(this), t, x));
    },
    dslNodeSeq(x) {
        return x.toAST();
    },
    dslNodeSeq_alt1(xs$0) {
        const xs = xs$0.toAST();
        return xs;
    },
    dslNode(x) {
        return x.toAST();
    },
    dslNode_alt1(s$0, o$0) {
        const s = s$0.toAST();
        const o = o$0.toAST();
        return (new (((DslAst).Node))($meta(this), s, o));
    },
    dslNode_alt2(_1) {
        return this.children[0].toAST();
    },
    dslPrimary(x) {
        return x.toAST();
    },
    dslPrimary_alt1(n$0) {
        const n = n$0.toAST();
        return (new (((DslAst).Var))($meta(this), n));
    },
    dslPrimary_alt2(x$0) {
        const x = x$0.toAST();
        return (new (((DslAst).Interpolation))($meta(this), x));
    },
    dslPrimary_alt3(l$0) {
        const l = l$0.toAST();
        return (new (((DslAst).Lit))($meta(this), l));
    },
    dslPrimary_alt4(x$0) {
        const x = x$0.toAST();
        return (new (((DslAst).Dynamic))($meta(this), x));
    },
    dslPrimary_alt5(xs$0) {
        const xs = xs$0.toAST();
        return (new (((DslAst).List))($meta(this), xs));
    },
    dslPrimary_alt6(_1, x$0, _3) {
        ;
        const x = x$0.toAST();
        return x;
    },
    dslNodeList(x) {
        return x.toAST();
    },
    dslNodeList_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return xs;
    },
    dslCrochet(x) {
        return x.toAST();
    },
    dslCrochet_alt1(_1, x$0, _3) {
        ;
        const x = x$0.toAST();
        return x;
    },
    dslAttribute(x) {
        return x.toAST();
    },
    dslAttribute_alt1(k$0, v$0) {
        const k = k$0.toAST();
        const v = v$0.toAST();
        return (new (DslAttr)($meta(this), k, v));
    },
    dslSignature(x) {
        return x.toAST();
    },
    dslSignature_alt1(n$0, xs$0) {
        const n = n$0.toAST();
        const xs = xs$0.toAST();
        return [(new (((DslSignature).Name))(n)), ...xs];
    },
    dslSignatureComponent(x) {
        return x.toAST();
    },
    dslSignatureComponent_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((DslSignature).Name))(x));
    },
    dslSignatureComponent_alt2(n$0) {
        const n = n$0.toAST();
        return (new (((DslSignature).Child))(n));
    },
    literal(x) {
        return x.toAST();
    },
    literal_alt1(_1) {
        return this.children[0].toAST();
    },
    literal_alt2(_1) {
        return this.children[0].toAST();
    },
    literal_alt3(_1) {
        return this.children[0].toAST();
    },
    literal_alt4(_1) {
        return this.children[0].toAST();
    },
    literal_alt5(_1) {
        return this.children[0].toAST();
    },
    nothing(x) {
        return x.toAST();
    },
    nothing_alt1(_1) {
        return (new (((Literal).Nothing))($meta(this)));
    },
    boolean(x) {
        return x.toAST();
    },
    boolean_alt1(_1) {
        return (new (((Literal).True))($meta(this)));
    },
    boolean_alt2(_1) {
        return (new (((Literal).False))($meta(this)));
    },
    text(x) {
        return x.toAST();
    },
    text_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Literal).Text))($meta(this), x));
    },
    integer(x) {
        return x.toAST();
    },
    integer_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Literal).Integer))($meta(this), x));
    },
    float(x) {
        return x.toAST();
    },
    float_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Literal).Float))($meta(this), x));
    },
    string(x) {
        return x.toAST();
    },
    string_alt1(x$0) {
        const x = x$0.toAST();
        return (new (String)($meta(this), x));
    },
    hole(x) {
        return x.toAST();
    },
    hole_alt1(x$0) {
        const x = x$0.toAST();
        return (new (((Expression).Hole))($meta(this)));
    },
    atom(x) {
        return x.toAST();
    },
    atom_alt1(_1, x$0) {
        ;
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    atom_alt2(x$0) {
        ;
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    name(x) {
        return x.toAST();
    },
    name_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    keyword(x) {
        return x.toAST();
    },
    keyword_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    attribute(x) {
        return x.toAST();
    },
    attribute_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    infix_symbol(x) {
        return x.toAST();
    },
    infix_symbol_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    not(x) {
        return x.toAST();
    },
    not_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    and(x) {
        return x.toAST();
    },
    and_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    or(x) {
        return x.toAST();
    },
    or_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    as(x) {
        return x.toAST();
    },
    as_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    namespace(x) {
        return x.toAST();
    },
    namespace_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Namespace)($meta(this), x));
    },
    named(x) {
        return x.toAST();
    },
    named_alt1(x$0) {
        const x = x$0.toAST();
        return (new (Name)($meta(this), x));
    },
    logicSignature(x) {
        return x.toAST();
    },
    logicSignature_alt1(s$0, kws$0) {
        const s = s$0.toAST();
        const kws = kws$0.toAST();
        return (new (((Signature).Keyword))($meta(this), s, kws));
    },
    logicSignature_alt2(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return (new (((Signature).Unary))($meta(this), s, n));
    },
    logicSignature_alt3(kws$0) {
        const kws = kws$0.toAST();
        return (new (((Signature).KeywordSelfless))($meta(this), kws));
    },
    signaturePair(x) {
        return x.toAST();
    },
    signaturePair_alt1(kw$0, v$0) {
        const kw = kw$0.toAST();
        const v = v$0.toAST();
        return (new (Pair)($meta(this), kw, v));
    },
    partialLogicSignature(x) {
        return x.toAST();
    },
    partialLogicSignature_alt1(kws$0) {
        const kws = kws$0.toAST();
        return (new (((PartialSignature).Keyword))($meta(this), kws));
    },
    partialLogicSignature_alt2(n$0) {
        const n = n$0.toAST();
        return (new (((PartialSignature).Unary))($meta(this), n));
    },
    partialSignature(x) {
        return x.toAST();
    },
    partialSignature_alt1(kws$0) {
        const kws = kws$0.toAST();
        return (new (((PartialSignature).Keyword))($meta(this), kws));
    },
    partialSignature_alt2(op$0, r$0) {
        const op = op$0.toAST();
        const r = r$0.toAST();
        return (new (((PartialSignature).Binary))($meta(this), op, r));
    },
    partialSignature_alt3(n$0) {
        const n = n$0.toAST();
        return (new (((PartialSignature).Unary))($meta(this), n));
    },
    partialSignature_alt4(n$0) {
        const n = n$0.toAST();
        return (new (((PartialSignature).Unary))($meta(this), n));
    },
    signature(x) {
        return x.toAST();
    },
    signature_alt1(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return (new (((Signature).Binary))($meta(this), op, l, r));
    },
    signature_alt2(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return (new (((Signature).Binary))($meta(this), op, l, r));
    },
    signature_alt3(s$0, kws$0) {
        const s = s$0.toAST();
        const kws = kws$0.toAST();
        return (new (((Signature).Keyword))($meta(this), s, kws));
    },
    signature_alt4(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return (new (((Signature).Unary))($meta(this), s, n));
    },
    signature_alt5(n$0, s$0) {
        const n = n$0.toAST();
        const s = s$0.toAST();
        return (new (((Signature).Unary))($meta(this), s, n));
    },
    signature_alt6(kws$0) {
        const kws = kws$0.toAST();
        return (new (((Signature).KeywordSelfless))($meta(this), kws));
    },
    asParameter(x) {
        return x.toAST();
    },
    asParameter_alt1(t$0) {
        const t = t$0.toAST();
        return (new (((Parameter).TypedOnly))($meta(this), (new (((TypeConstraint).Type))($meta(this), (new (((TypeApp).Static))($meta(this), t))))));
    },
    list0(x) {
        return x.toAST();
    },
    list0_alt1(xs$0, _2) {
        const xs = xs$0.toAST();
        return xs;
    },
    list1(x) {
        return x.toAST();
    },
    list1_alt1(xs$0, _2) {
        const xs = xs$0.toAST();
        return xs;
    },
    block(x) {
        return x.toAST();
    },
    block_alt1(_1, xs$0, _3) {
        ;
        const xs = xs$0.toAST();
        return xs;
    },
    statements(x) {
        return x.toAST();
    },
    statements_alt1(h$0, _2, _3, t$0) {
        const h = h$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements_alt2(h$0, _2, _3, _4, t$0) {
        const h = h$0.toAST();
        ;
        ;
        ;
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements_alt3(x$0, _2) {
        const x = x$0.toAST();
        return [x];
    },
    statements_alt4() {
        return [];
    },
    statements1(x) {
        return x.toAST();
    },
    statements1_alt1(h$0, _2, _3, t$0) {
        const h = h$0.toAST();
        ;
        ;
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements1_alt2(h$0, _2, _3, _4, t$0) {
        const h = h$0.toAST();
        ;
        ;
        ;
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements1_alt3(x$0, _2) {
        const x = x$0.toAST();
        return [x];
    },
    eblock(x) {
        return x.toAST();
    },
    eblock_alt1(_1, b$0, _3) {
        ;
        const b = b$0.toAST();
        return b;
    },
    eblock_alt2(_1, e$0, _3) {
        ;
        const e = e$0.toAST();
        return [(new (((Statement).Expr))(e))];
    },
    s(x) {
        return x.toAST();
    },
    s_alt1(_1, x$0) {
        ;
        const x = x$0.toAST();
        return x;
    },
    ws(x) {
        return x.toAST();
    },
    ws_alt1(_1) {
        return this.children[0].toAST();
    },
    header(x) {
        return x.toAST();
    },
    header_alt1(_1, _2, _3, _4, _5) {
        return this.sourceString;
    },
    hs(x) {
        return x.toAST();
    },
    hs_alt1(_1) {
        return this.sourceString;
    },
    hs_alt2(_1) {
        return this.sourceString;
    },
    nl(x) {
        return x.toAST();
    },
    nl_alt1(_1) {
        return this.sourceString;
    },
    nl_alt2(_1) {
        return this.sourceString;
    },
    nl_alt3(_1) {
        return this.sourceString;
    },
    line(x) {
        return x.toAST();
    },
    line_alt1(_1) {
        return this.sourceString;
    },
    comment(x) {
        return x.toAST();
    },
    comment_alt1(_1, _3) {
        return this.sourceString;
    },
    space(x) {
        return x.toAST();
    },
    space_alt1(_1) {
        return this.children[0].toAST();
    },
    doc(x) {
        return x.toAST();
    },
    doc_alt1(xs$0) {
        const xs = xs$0.toAST();
        return xs;
    },
    doc_line(x) {
        return x.toAST();
    },
    doc_line_alt1(_1, _2, _3, x$0, _5) {
        ;
        ;
        ;
        const x = x$0.toAST();
        return x;
    },
    semi(x) {
        return x.toAST();
    },
    semi_alt1(_1) {
        return this.children[0].toAST();
    },
    atom_start(x) {
        return x.toAST();
    },
    atom_start_alt1(_1) {
        return this.sourceString;
    },
    atom_rest(x) {
        return x.toAST();
    },
    atom_rest_alt1(_1) {
        return this.sourceString;
    },
    atom_rest_alt2(_1) {
        return this.sourceString;
    },
    atom_rest_alt3(_1) {
        return this.sourceString;
    },
    t_atom(x) {
        return x.toAST();
    },
    t_atom_alt1(_1, _2) {
        return this.sourceString;
    },
    t_keyword(x) {
        return x.toAST();
    },
    t_keyword_alt1(_1, _2) {
        return this.sourceString;
    },
    t_attribute(x) {
        return x.toAST();
    },
    t_attribute_alt1(_1, _3) {
        return this.sourceString;
    },
    name_start(x) {
        return x.toAST();
    },
    name_start_alt1(_1) {
        return this.sourceString;
    },
    name_start_alt2(_1) {
        return this.sourceString;
    },
    name_rest(x) {
        return x.toAST();
    },
    name_rest_alt1(_1) {
        return this.sourceString;
    },
    name_rest_alt2(_1) {
        return this.sourceString;
    },
    name_rest_alt3(_1) {
        return this.sourceString;
    },
    t_name(x) {
        return x.toAST();
    },
    t_name_alt1(_1, _2) {
        return this.sourceString;
    },
    t_infix_symbol(x) {
        return x.toAST();
    },
    t_infix_symbol_alt1(x$0) {
        return this.sourceString;
    },
    t_infix_symbol_alt2(_1) {
        return this.sourceString;
    },
    t_infix_symbol_alt3(_1) {
        return this.sourceString;
    },
    t_infix_symbol_alt4(_1) {
        return this.sourceString;
    },
    t_any_infix(x) {
        return x.toAST();
    },
    t_any_infix_alt1(_1) {
        return this.sourceString;
    },
    t_any_infix_alt2(_1) {
        return this.sourceString;
    },
    t_any_infix_alt3(_1) {
        return this.sourceString;
    },
    t_relational_op(x) {
        return x.toAST();
    },
    t_relational_op_alt1(_1) {
        return this.sourceString;
    },
    t_relational_op_alt2(_1) {
        return this.sourceString;
    },
    t_relational_op_alt3(_1) {
        return this.sourceString;
    },
    t_relational_op_alt4(_1) {
        return this.sourceString;
    },
    t_relational_op_alt5(_1) {
        return this.sourceString;
    },
    t_relational_op_alt6(_1) {
        return this.sourceString;
    },
    t_arithmetic_op(x) {
        return x.toAST();
    },
    t_arithmetic_op_alt1(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt2(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt3(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt4(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt5(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt6(_1) {
        return this.sourceString;
    },
    t_arithmetic_op_alt7(_1) {
        return this.sourceString;
    },
    infix_character(x) {
        return x.toAST();
    },
    infix_character_alt1(_1) {
        return this.sourceString;
    },
    infix_character_alt2(_1) {
        return this.sourceString;
    },
    infix_character_alt3(_1) {
        return this.sourceString;
    },
    infix_character_alt4(_1) {
        return this.sourceString;
    },
    infix_character_alt5(_1) {
        return this.sourceString;
    },
    infix_character_alt6(_1) {
        return this.sourceString;
    },
    infix_character_alt7(_1) {
        return this.sourceString;
    },
    infix_character_alt8(_1) {
        return this.sourceString;
    },
    dec_digit(x) {
        return x.toAST();
    },
    dec_digit_alt1(_1) {
        return this.sourceString;
    },
    dec_digit_alt2(_1) {
        return this.sourceString;
    },
    hex_digit(x) {
        return x.toAST();
    },
    hex_digit_alt1(_1) {
        return this.sourceString;
    },
    hex_digit_alt2(_1) {
        return this.sourceString;
    },
    hex_digit_alt3(_1) {
        return this.sourceString;
    },
    t_integer(x) {
        return x.toAST();
    },
    t_integer_alt1(_2, _3) {
        return this.sourceString;
    },
    t_float(x) {
        return x.toAST();
    },
    t_float_alt1(_2, _3, _4, _5) {
        return this.sourceString;
    },
    text_character(x) {
        return x.toAST();
    },
    text_character_alt1(_1, _2) {
        return this.sourceString;
    },
    text_character_alt2(_2) {
        return this.sourceString;
    },
    escape_sequence(x) {
        return x.toAST();
    },
    escape_sequence_alt1(_1, _2, _3, _4, _5) {
        return this.sourceString;
    },
    escape_sequence_alt2(_1, _2, _3) {
        return this.sourceString;
    },
    escape_sequence_alt3(_1) {
        return this.sourceString;
    },
    t_text(x) {
        return x.toAST();
    },
    t_text_alt1(_1, _2, _3) {
        return this.sourceString;
    },
    kw(x) {
        return x.toAST();
    },
    kw_alt1(x$0) {
        const x = x$0.toAST();
        return x;
    },
    relation_(x) {
        return x.toAST();
    },
    relation__alt1(_1) {
        return this.children[0].toAST();
    },
    predicate_(x) {
        return x.toAST();
    },
    predicate__alt1(_1) {
        return this.children[0].toAST();
    },
    when_(x) {
        return x.toAST();
    },
    when__alt1(_1) {
        return this.children[0].toAST();
    },
    do_(x) {
        return x.toAST();
    },
    do__alt1(_1) {
        return this.children[0].toAST();
    },
    command_(x) {
        return x.toAST();
    },
    command__alt1(_1) {
        return this.children[0].toAST();
    },
    type_(x) {
        return x.toAST();
    },
    type__alt1(_1) {
        return this.children[0].toAST();
    },
    enum_(x) {
        return x.toAST();
    },
    enum__alt1(_1) {
        return this.children[0].toAST();
    },
    define_(x) {
        return x.toAST();
    },
    define__alt1(_1) {
        return this.children[0].toAST();
    },
    singleton_(x) {
        return x.toAST();
    },
    singleton__alt1(_1) {
        return this.children[0].toAST();
    },
    action_(x) {
        return x.toAST();
    },
    action__alt1(_1) {
        return this.children[0].toAST();
    },
    let_(x) {
        return x.toAST();
    },
    let__alt1(_1) {
        return this.children[0].toAST();
    },
    return_(x) {
        return x.toAST();
    },
    return__alt1(_1) {
        return this.children[0].toAST();
    },
    fact_(x) {
        return x.toAST();
    },
    fact__alt1(_1) {
        return this.children[0].toAST();
    },
    forget_(x) {
        return x.toAST();
    },
    forget__alt1(_1) {
        return this.children[0].toAST();
    },
    new_(x) {
        return x.toAST();
    },
    new__alt1(_1) {
        return this.children[0].toAST();
    },
    search_(x) {
        return x.toAST();
    },
    search__alt1(_1) {
        return this.children[0].toAST();
    },
    if_(x) {
        return x.toAST();
    },
    if__alt1(_1) {
        return this.children[0].toAST();
    },
    then_(x) {
        return x.toAST();
    },
    then__alt1(_1) {
        return this.children[0].toAST();
    },
    else_(x) {
        return x.toAST();
    },
    else__alt1(_1) {
        return this.children[0].toAST();
    },
    goto_(x) {
        return x.toAST();
    },
    goto__alt1(_1) {
        return this.children[0].toAST();
    },
    call_(x) {
        return x.toAST();
    },
    call__alt1(_1) {
        return this.children[0].toAST();
    },
    simulate_(x) {
        return x.toAST();
    },
    simulate__alt1(_1) {
        return this.children[0].toAST();
    },
    match_(x) {
        return x.toAST();
    },
    match__alt1(_1) {
        return this.children[0].toAST();
    },
    true_(x) {
        return x.toAST();
    },
    true__alt1(_1) {
        return this.children[0].toAST();
    },
    false_(x) {
        return x.toAST();
    },
    false__alt1(_1) {
        return this.children[0].toAST();
    },
    not_(x) {
        return x.toAST();
    },
    not__alt1(_1) {
        return this.children[0].toAST();
    },
    and_(x) {
        return x.toAST();
    },
    and__alt1(_1) {
        return this.children[0].toAST();
    },
    or_(x) {
        return x.toAST();
    },
    or__alt1(_1) {
        return this.children[0].toAST();
    },
    is_(x) {
        return x.toAST();
    },
    is__alt1(_1) {
        return this.children[0].toAST();
    },
    self_(x) {
        return x.toAST();
    },
    self__alt1(_1) {
        return this.children[0].toAST();
    },
    as_(x) {
        return x.toAST();
    },
    as__alt1(_1) {
        return this.children[0].toAST();
    },
    event_(x) {
        return x.toAST();
    },
    event__alt1(_1) {
        return this.children[0].toAST();
    },
    quiescence_(x) {
        return x.toAST();
    },
    quiescence__alt1(_1) {
        return this.children[0].toAST();
    },
    for_(x) {
        return x.toAST();
    },
    for__alt1(_1) {
        return this.children[0].toAST();
    },
    until_(x) {
        return x.toAST();
    },
    until__alt1(_1) {
        return this.children[0].toAST();
    },
    in_(x) {
        return x.toAST();
    },
    in__alt1(_1) {
        return this.children[0].toAST();
    },
    foreign_(x) {
        return x.toAST();
    },
    foreign__alt1(_1) {
        return this.children[0].toAST();
    },
    on_(x) {
        return x.toAST();
    },
    on__alt1(_1) {
        return this.children[0].toAST();
    },
    always_(x) {
        return x.toAST();
    },
    always__alt1(_1) {
        return this.children[0].toAST();
    },
    condition_(x) {
        return x.toAST();
    },
    condition__alt1(_1) {
        return this.children[0].toAST();
    },
    end_(x) {
        return x.toAST();
    },
    end__alt1(_1) {
        return this.children[0].toAST();
    },
    prelude_(x) {
        return x.toAST();
    },
    prelude__alt1(_1) {
        return this.children[0].toAST();
    },
    with_(x) {
        return x.toAST();
    },
    with__alt1(_1) {
        return this.children[0].toAST();
    },
    tags_(x) {
        return x.toAST();
    },
    tags__alt1(_1) {
        return this.children[0].toAST();
    },
    rank_(x) {
        return x.toAST();
    },
    rank__alt1(_1) {
        return this.children[0].toAST();
    },
    abstract_(x) {
        return x.toAST();
    },
    abstract__alt1(_1) {
        return this.children[0].toAST();
    },
    lazy_(x) {
        return x.toAST();
    },
    lazy__alt1(_1) {
        return this.children[0].toAST();
    },
    force_(x) {
        return x.toAST();
    },
    force__alt1(_1) {
        return this.children[0].toAST();
    },
    context_(x) {
        return x.toAST();
    },
    context__alt1(_1) {
        return this.children[0].toAST();
    },
    sample_(x) {
        return x.toAST();
    },
    sample__alt1(_1) {
        return this.children[0].toAST();
    },
    of_(x) {
        return x.toAST();
    },
    of__alt1(_1) {
        return this.children[0].toAST();
    },
    open_(x) {
        return x.toAST();
    },
    open__alt1(_1) {
        return this.children[0].toAST();
    },
    local_(x) {
        return x.toAST();
    },
    local__alt1(_1) {
        return this.children[0].toAST();
    },
    test_(x) {
        return x.toAST();
    },
    test__alt1(_1) {
        return this.children[0].toAST();
    },
    assert_(x) {
        return x.toAST();
    },
    assert__alt1(_1) {
        return this.children[0].toAST();
    },
    requires_(x) {
        return x.toAST();
    },
    requires__alt1(_1) {
        return this.children[0].toAST();
    },
    ensures_(x) {
        return x.toAST();
    },
    ensures__alt1(_1) {
        return this.children[0].toAST();
    },
    nothing_(x) {
        return x.toAST();
    },
    nothing__alt1(_1) {
        return this.children[0].toAST();
    },
    effect_(x) {
        return x.toAST();
    },
    effect__alt1(_1) {
        return this.children[0].toAST();
    },
    handle_(x) {
        return x.toAST();
    },
    handle__alt1(_1) {
        return this.children[0].toAST();
    },
    continue_(x) {
        return x.toAST();
    },
    continue__alt1(_1) {
        return this.children[0].toAST();
    },
    perform_(x) {
        return x.toAST();
    },
    perform__alt1(_1) {
        return this.children[0].toAST();
    },
    dsl_(x) {
        return x.toAST();
    },
    dsl__alt1(_1) {
        return this.children[0].toAST();
    },
    trait_(x) {
        return x.toAST();
    },
    trait__alt1(_1) {
        return this.children[0].toAST();
    },
    implement_(x) {
        return x.toAST();
    },
    implement__alt1(_1) {
        return this.children[0].toAST();
    },
    has_(x) {
        return x.toAST();
    },
    has__alt1(_1) {
        return this.children[0].toAST();
    },
    global_(x) {
        return x.toAST();
    },
    global__alt1(_1) {
        return this.children[0].toAST();
    },
    capability_(x) {
        return x.toAST();
    },
    capability__alt1(_1) {
        return this.children[0].toAST();
    },
    protect_(x) {
        return x.toAST();
    },
    protect__alt1(_1) {
        return this.children[0].toAST();
    },
    otherwise_(x) {
        return x.toAST();
    },
    otherwise__alt1(_1) {
        return this.children[0].toAST();
    },
    reserved(x) {
        return x.toAST();
    },
    reserved_alt1(_1) {
        return this.children[0].toAST();
    },
    reserved_alt2(_1) {
        return this.children[0].toAST();
    },
    reserved_alt3(_1) {
        return this.children[0].toAST();
    },
    reserved_alt4(_1) {
        return this.children[0].toAST();
    },
    reserved_alt5(_1) {
        return this.children[0].toAST();
    },
    reserved_alt6(_1) {
        return this.children[0].toAST();
    },
    reserved_alt7(_1) {
        return this.children[0].toAST();
    },
    reserved_alt8(_1) {
        return this.children[0].toAST();
    },
    reserved_alt9(_1) {
        return this.children[0].toAST();
    },
    reserved_alt10(_1) {
        return this.children[0].toAST();
    },
    reserved_alt11(_1) {
        return this.children[0].toAST();
    },
    reserved_alt12(_1) {
        return this.children[0].toAST();
    },
    reserved_alt13(_1) {
        return this.children[0].toAST();
    },
    reserved_alt14(_1) {
        return this.children[0].toAST();
    },
    reserved_alt15(_1) {
        return this.children[0].toAST();
    },
    reserved_alt16(_1) {
        return this.children[0].toAST();
    },
    reserved_alt17(_1) {
        return this.children[0].toAST();
    },
    reserved_alt18(_1) {
        return this.children[0].toAST();
    },
    reserved_alt19(_1) {
        return this.children[0].toAST();
    },
    reserved_alt20(_1) {
        return this.children[0].toAST();
    },
    reserved_alt21(_1) {
        return this.children[0].toAST();
    },
    reserved_alt22(_1) {
        return this.children[0].toAST();
    },
    reserved_alt23(_1) {
        return this.children[0].toAST();
    },
    reserved_alt24(_1) {
        return this.children[0].toAST();
    },
    reserved_alt25(_1) {
        return this.children[0].toAST();
    },
    reserved_alt26(_1) {
        return this.children[0].toAST();
    },
    reserved_alt27(_1) {
        return this.children[0].toAST();
    },
    reserved_alt28(_1) {
        return this.children[0].toAST();
    },
    reserved_alt29(_1) {
        return this.children[0].toAST();
    },
    reserved_alt30(_1) {
        return this.children[0].toAST();
    },
    reserved_alt31(_1) {
        return this.children[0].toAST();
    },
    reserved_alt32(_1) {
        return this.children[0].toAST();
    },
    reserved_alt33(_1) {
        return this.children[0].toAST();
    },
    reserved_alt34(_1) {
        return this.children[0].toAST();
    },
    reserved_alt35(_1) {
        return this.children[0].toAST();
    },
    reserved_alt36(_1) {
        return this.children[0].toAST();
    },
    reserved_alt37(_1) {
        return this.children[0].toAST();
    },
    reserved_alt38(_1) {
        return this.children[0].toAST();
    },
    reserved_alt39(_1) {
        return this.children[0].toAST();
    },
    reserved_alt40(_1) {
        return this.children[0].toAST();
    },
    reserved_alt41(_1) {
        return this.children[0].toAST();
    },
    reserved_alt42(_1) {
        return this.children[0].toAST();
    },
    reserved_alt43(_1) {
        return this.children[0].toAST();
    },
    reserved_alt44(_1) {
        return this.children[0].toAST();
    },
    reserved_alt45(_1) {
        return this.children[0].toAST();
    },
    reserved_alt46(_1) {
        return this.children[0].toAST();
    },
    reserved_alt47(_1) {
        return this.children[0].toAST();
    },
    reserved_alt48(_1) {
        return this.children[0].toAST();
    },
    reserved_alt49(_1) {
        return this.children[0].toAST();
    },
    reserved_alt50(_1) {
        return this.children[0].toAST();
    },
    reserved_alt51(_1) {
        return this.children[0].toAST();
    },
    reserved_alt52(_1) {
        return this.children[0].toAST();
    },
    reserved_alt53(_1) {
        return this.children[0].toAST();
    },
    reserved_alt54(_1) {
        return this.children[0].toAST();
    },
    reserved_alt55(_1) {
        return this.children[0].toAST();
    },
    reserved_alt56(_1) {
        return this.children[0].toAST();
    },
    reserved_alt57(_1) {
        return this.children[0].toAST();
    },
    reserved_alt58(_1) {
        return this.children[0].toAST();
    },
    reserved_alt59(_1) {
        return this.children[0].toAST();
    },
    reserved_alt60(_1) {
        return this.children[0].toAST();
    },
    reserved_alt61(_1) {
        return this.children[0].toAST();
    },
    reserved_alt62(_1) {
        return this.children[0].toAST();
    },
    reserved_alt63(_1) {
        return this.children[0].toAST();
    },
    reserved_alt64(_1) {
        return this.children[0].toAST();
    },
    reserved_alt65(_1) {
        return this.children[0].toAST();
    },
    reserved_alt66(_1) {
        return this.children[0].toAST();
    },
    reserved_alt67(_1) {
        return this.children[0].toAST();
    },
    reserved_alt68(_1) {
        return this.children[0].toAST();
    },
    reserved_alt69(_1) {
        return this.children[0].toAST();
    },
    reserved_alt70(_1) {
        return this.children[0].toAST();
    },
});
exports.semantics.addOperation("toAST()", exports.toAstVisitor);
function toAst(result) {
    return exports.semantics(result).toAST();
}
exports.toAst = toAst;

},{"ohm-js":80,"ohm-js/src/util":99,"util":124}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectEntityTag = exports.DProtect = exports.DCapability = exports.DImplementTrait = exports.DTrait = exports.EffectCase = exports.DEffect = exports.DForeignType = exports.DContext = exports.DWhen = exports.DAction = exports.DRelation = exports.RelationType = exports.RelationMultiplicity = exports.DPrelude = exports.DOpen = exports.DDefine = exports.DTest = exports.DSeal = exports.DType = exports.DCommand = exports.Visibility = exports.DeclarationTag = void 0;
var DeclarationTag;
(function (DeclarationTag) {
    DeclarationTag[DeclarationTag["COMMAND"] = 1] = "COMMAND";
    DeclarationTag[DeclarationTag["TYPE"] = 2] = "TYPE";
    DeclarationTag[DeclarationTag["SEAL"] = 3] = "SEAL";
    DeclarationTag[DeclarationTag["TEST"] = 4] = "TEST";
    DeclarationTag[DeclarationTag["OPEN"] = 5] = "OPEN";
    DeclarationTag[DeclarationTag["DEFINE"] = 6] = "DEFINE";
    DeclarationTag[DeclarationTag["PRELUDE"] = 7] = "PRELUDE";
    DeclarationTag[DeclarationTag["RELATION"] = 8] = "RELATION";
    DeclarationTag[DeclarationTag["ACTION"] = 9] = "ACTION";
    DeclarationTag[DeclarationTag["WHEN"] = 10] = "WHEN";
    DeclarationTag[DeclarationTag["CONTEXT"] = 11] = "CONTEXT";
    DeclarationTag[DeclarationTag["FOREIGN_TYPE"] = 12] = "FOREIGN_TYPE";
    DeclarationTag[DeclarationTag["EFFECT"] = 13] = "EFFECT";
    DeclarationTag[DeclarationTag["TRAIT"] = 14] = "TRAIT";
    DeclarationTag[DeclarationTag["IMPLEMENT_TRAIT"] = 15] = "IMPLEMENT_TRAIT";
    DeclarationTag[DeclarationTag["CAPABILITY"] = 16] = "CAPABILITY";
    DeclarationTag[DeclarationTag["PROTECT"] = 17] = "PROTECT";
})(DeclarationTag = exports.DeclarationTag || (exports.DeclarationTag = {}));
var Visibility;
(function (Visibility) {
    Visibility[Visibility["LOCAL"] = 0] = "LOCAL";
    Visibility[Visibility["GLOBAL"] = 1] = "GLOBAL";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
class BaseDeclaration {
}
class DCommand extends BaseDeclaration {
    constructor(meta, documentation, name, parameters, types, body) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.parameters = parameters;
        this.types = types;
        this.body = body;
        this.tag = DeclarationTag.COMMAND;
    }
}
exports.DCommand = DCommand;
class DType extends BaseDeclaration {
    constructor(meta, documentation, visibility, name, parent, fields, types) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.visibility = visibility;
        this.name = name;
        this.parent = parent;
        this.fields = fields;
        this.types = types;
        this.tag = DeclarationTag.TYPE;
    }
}
exports.DType = DType;
class DSeal extends BaseDeclaration {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = DeclarationTag.SEAL;
    }
}
exports.DSeal = DSeal;
class DTest extends BaseDeclaration {
    constructor(meta, name, body) {
        super();
        this.meta = meta;
        this.name = name;
        this.body = body;
        this.tag = DeclarationTag.TEST;
    }
}
exports.DTest = DTest;
class DDefine extends BaseDeclaration {
    constructor(meta, documentation, visibility, name, body) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.visibility = visibility;
        this.name = name;
        this.body = body;
        this.tag = DeclarationTag.DEFINE;
    }
}
exports.DDefine = DDefine;
class DOpen extends BaseDeclaration {
    constructor(meta, namespace) {
        super();
        this.meta = meta;
        this.namespace = namespace;
        this.tag = DeclarationTag.OPEN;
    }
}
exports.DOpen = DOpen;
class DPrelude extends BaseDeclaration {
    constructor(meta, body) {
        super();
        this.meta = meta;
        this.body = body;
        this.tag = DeclarationTag.PRELUDE;
    }
}
exports.DPrelude = DPrelude;
var RelationMultiplicity;
(function (RelationMultiplicity) {
    RelationMultiplicity[RelationMultiplicity["ONE"] = 1] = "ONE";
    RelationMultiplicity[RelationMultiplicity["MANY"] = 2] = "MANY";
})(RelationMultiplicity = exports.RelationMultiplicity || (exports.RelationMultiplicity = {}));
class RelationType {
    constructor(meta, multiplicity) {
        this.meta = meta;
        this.multiplicity = multiplicity;
    }
}
exports.RelationType = RelationType;
class DRelation extends BaseDeclaration {
    constructor(meta, documentation, name, type) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.type = type;
        this.tag = DeclarationTag.RELATION;
    }
}
exports.DRelation = DRelation;
class DAction extends BaseDeclaration {
    constructor(meta, documentation, context, name, actor, parameter, rank_function, predicate, body) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.context = context;
        this.name = name;
        this.actor = actor;
        this.parameter = parameter;
        this.rank_function = rank_function;
        this.predicate = predicate;
        this.body = body;
        this.tag = DeclarationTag.ACTION;
    }
}
exports.DAction = DAction;
class DWhen extends BaseDeclaration {
    constructor(meta, documentation, context, predicate, body) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.context = context;
        this.predicate = predicate;
        this.body = body;
        this.tag = DeclarationTag.WHEN;
    }
}
exports.DWhen = DWhen;
class DContext extends BaseDeclaration {
    constructor(meta, documentation, name) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.tag = DeclarationTag.CONTEXT;
    }
}
exports.DContext = DContext;
class DForeignType extends BaseDeclaration {
    constructor(meta, documentation, visibility, name, target) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.visibility = visibility;
        this.name = name;
        this.target = target;
        this.tag = DeclarationTag.FOREIGN_TYPE;
    }
}
exports.DForeignType = DForeignType;
class DEffect extends BaseDeclaration {
    constructor(meta, documentation, name, cases) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.cases = cases;
        this.tag = DeclarationTag.EFFECT;
    }
}
exports.DEffect = DEffect;
class EffectCase {
    constructor(meta, documentation, name, parameters, types) {
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.parameters = parameters;
        this.types = types;
    }
}
exports.EffectCase = EffectCase;
class DTrait extends BaseDeclaration {
    constructor(meta, documentation, name) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.tag = DeclarationTag.TRAIT;
    }
}
exports.DTrait = DTrait;
class DImplementTrait extends BaseDeclaration {
    constructor(meta, trait, type) {
        super();
        this.meta = meta;
        this.trait = trait;
        this.type = type;
        this.tag = DeclarationTag.IMPLEMENT_TRAIT;
    }
}
exports.DImplementTrait = DImplementTrait;
class DCapability extends BaseDeclaration {
    constructor(meta, documentation, name) {
        super();
        this.meta = meta;
        this.documentation = documentation;
        this.name = name;
        this.tag = DeclarationTag.CAPABILITY;
    }
}
exports.DCapability = DCapability;
class DProtect extends BaseDeclaration {
    constructor(meta, capability, type, entity) {
        super();
        this.meta = meta;
        this.capability = capability;
        this.type = type;
        this.entity = entity;
        this.tag = DeclarationTag.PROTECT;
    }
}
exports.DProtect = DProtect;
var ProtectEntityTag;
(function (ProtectEntityTag) {
    ProtectEntityTag[ProtectEntityTag["TYPE"] = 0] = "TYPE";
    ProtectEntityTag[ProtectEntityTag["TRAIT"] = 1] = "TRAIT";
    ProtectEntityTag[ProtectEntityTag["EFFECT"] = 2] = "EFFECT";
    ProtectEntityTag[ProtectEntityTag["DEFINE"] = 3] = "DEFINE";
})(ProtectEntityTag = exports.ProtectEntityTag || (exports.ProtectEntityTag = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DslAstExpression = exports.DslAstNodeList = exports.DslAstVariable = exports.DslAstLiteral = exports.DslAstNode = exports.DslNodeTag = exports.Dsl = exports.ContinueWith = exports.Perform = exports.HandlerCase = exports.Handle = exports.Simulate = exports.SimulationSignal = exports.Forget = exports.Fact = exports.MatchSearch = exports.Search = exports.RegisterInstance = exports.IntrinsicEqual = exports.TraitTest = exports.TypeTest = exports.Branch = exports.Assert = exports.PushPartial = exports.Return = exports.Apply = exports.Invoke = exports.InvokeForeign = exports.PushLambda = exports.Interpolate = exports.Force = exports.PushLazy = exports.ProjectStatic = exports.Project = exports.RecordAtPut = exports.PushRecord = exports.PushStaticType = exports.PushNew = exports.PushList = exports.PushReturn = exports.PushLiteral = exports.PushGlobal = exports.PushSelf = exports.PushVariable = exports.Let = exports.Drop = exports.BaseOp = exports.BasicBlock = exports.AssertType = exports.OpTag = void 0;
exports.DslInterpolationDynamic = exports.DslInterpolationStatic = exports.DslInterpolationTag = exports.DslAstInterpolation = void 0;
var OpTag;
(function (OpTag) {
    OpTag[OpTag["DROP"] = 1] = "DROP";
    OpTag[OpTag["LET"] = 2] = "LET";
    OpTag[OpTag["PUSH_VARIABLE"] = 3] = "PUSH_VARIABLE";
    OpTag[OpTag["PUSH_SELF"] = 4] = "PUSH_SELF";
    OpTag[OpTag["PUSH_GLOBAL"] = 5] = "PUSH_GLOBAL";
    OpTag[OpTag["PUSH_LITERAL"] = 6] = "PUSH_LITERAL";
    OpTag[OpTag["PUSH_RETURN"] = 7] = "PUSH_RETURN";
    OpTag[OpTag["PUSH_LIST"] = 8] = "PUSH_LIST";
    OpTag[OpTag["PUSH_NEW"] = 9] = "PUSH_NEW";
    OpTag[OpTag["PUSH_STATIC_TYPE"] = 10] = "PUSH_STATIC_TYPE";
    OpTag[OpTag["PUSH_RECORD"] = 11] = "PUSH_RECORD";
    OpTag[OpTag["RECORD_AT_PUT"] = 12] = "RECORD_AT_PUT";
    OpTag[OpTag["PROJECT"] = 13] = "PROJECT";
    OpTag[OpTag["PROJECT_STATIC"] = 14] = "PROJECT_STATIC";
    OpTag[OpTag["INTERPOLATE"] = 15] = "INTERPOLATE";
    OpTag[OpTag["PUSH_LAZY"] = 16] = "PUSH_LAZY";
    OpTag[OpTag["FORCE"] = 17] = "FORCE";
    OpTag[OpTag["PUSH_LAMBDA"] = 18] = "PUSH_LAMBDA";
    OpTag[OpTag["INVOKE_FOREIGN"] = 19] = "INVOKE_FOREIGN";
    OpTag[OpTag["INVOKE"] = 20] = "INVOKE";
    OpTag[OpTag["APPLY"] = 21] = "APPLY";
    OpTag[OpTag["RETURN"] = 22] = "RETURN";
    OpTag[OpTag["PUSH_PARTIAL"] = 23] = "PUSH_PARTIAL";
    OpTag[OpTag["ASSERT"] = 24] = "ASSERT";
    OpTag[OpTag["BRANCH"] = 25] = "BRANCH";
    OpTag[OpTag["TYPE_TEST"] = 26] = "TYPE_TEST";
    OpTag[OpTag["TRAIT_TEST"] = 27] = "TRAIT_TEST";
    OpTag[OpTag["INTRINSIC_EQUAL"] = 28] = "INTRINSIC_EQUAL";
    OpTag[OpTag["REGISTER_INSTANCE"] = 29] = "REGISTER_INSTANCE";
    OpTag[OpTag["SEARCH"] = 30] = "SEARCH";
    OpTag[OpTag["MATCH_SEARCH"] = 31] = "MATCH_SEARCH";
    OpTag[OpTag["FACT"] = 32] = "FACT";
    OpTag[OpTag["FORGET"] = 33] = "FORGET";
    OpTag[OpTag["SIMULATE"] = 34] = "SIMULATE";
    OpTag[OpTag["HANDLE"] = 35] = "HANDLE";
    OpTag[OpTag["PERFORM"] = 36] = "PERFORM";
    OpTag[OpTag["CONTINUE_WITH"] = 37] = "CONTINUE_WITH";
    OpTag[OpTag["DSL"] = 38] = "DSL";
})(OpTag = exports.OpTag || (exports.OpTag = {}));
var AssertType;
(function (AssertType) {
    AssertType[AssertType["PRECONDITION"] = 1] = "PRECONDITION";
    AssertType[AssertType["POSTCONDITION"] = 2] = "POSTCONDITION";
    AssertType[AssertType["RETURN_TYPE"] = 3] = "RETURN_TYPE";
    AssertType[AssertType["ASSERT"] = 4] = "ASSERT";
    AssertType[AssertType["UNREACHABLE"] = 5] = "UNREACHABLE";
})(AssertType = exports.AssertType || (exports.AssertType = {}));
class BasicBlock {
    constructor(ops) {
        this.ops = ops;
    }
}
exports.BasicBlock = BasicBlock;
class BaseOp {
}
exports.BaseOp = BaseOp;
class Drop extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.DROP;
    }
}
exports.Drop = Drop;
class Let extends BaseOp {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = OpTag.LET;
    }
}
exports.Let = Let;
class PushVariable extends BaseOp {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = OpTag.PUSH_VARIABLE;
    }
}
exports.PushVariable = PushVariable;
class PushSelf extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.PUSH_SELF;
    }
}
exports.PushSelf = PushSelf;
class PushGlobal extends BaseOp {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = OpTag.PUSH_GLOBAL;
    }
}
exports.PushGlobal = PushGlobal;
class PushLiteral extends BaseOp {
    constructor(value) {
        super();
        this.value = value;
        this.tag = OpTag.PUSH_LITERAL;
        this.meta = null;
    }
}
exports.PushLiteral = PushLiteral;
class PushReturn extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.PUSH_RETURN;
    }
}
exports.PushReturn = PushReturn;
class PushList extends BaseOp {
    constructor(meta, arity) {
        super();
        this.meta = meta;
        this.arity = arity;
        this.tag = OpTag.PUSH_LIST;
    }
}
exports.PushList = PushList;
class PushNew extends BaseOp {
    constructor(meta, type, arity) {
        super();
        this.meta = meta;
        this.type = type;
        this.arity = arity;
        this.tag = OpTag.PUSH_NEW;
    }
}
exports.PushNew = PushNew;
class PushStaticType extends BaseOp {
    constructor(meta, type) {
        super();
        this.meta = meta;
        this.type = type;
        this.tag = OpTag.PUSH_STATIC_TYPE;
    }
}
exports.PushStaticType = PushStaticType;
class PushRecord extends BaseOp {
    constructor(meta, keys) {
        super();
        this.meta = meta;
        this.keys = keys;
        this.tag = OpTag.PUSH_RECORD;
    }
}
exports.PushRecord = PushRecord;
class RecordAtPut extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.RECORD_AT_PUT;
    }
}
exports.RecordAtPut = RecordAtPut;
class Project extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.PROJECT;
    }
}
exports.Project = Project;
class ProjectStatic extends BaseOp {
    constructor(meta, key) {
        super();
        this.meta = meta;
        this.key = key;
        this.tag = OpTag.PROJECT_STATIC;
    }
}
exports.ProjectStatic = ProjectStatic;
class PushLazy extends BaseOp {
    constructor(meta, body) {
        super();
        this.meta = meta;
        this.body = body;
        this.tag = OpTag.PUSH_LAZY;
    }
}
exports.PushLazy = PushLazy;
class Force extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.FORCE;
    }
}
exports.Force = Force;
class Interpolate extends BaseOp {
    constructor(meta, parts) {
        super();
        this.meta = meta;
        this.parts = parts;
        this.tag = OpTag.INTERPOLATE;
    }
}
exports.Interpolate = Interpolate;
class PushLambda extends BaseOp {
    constructor(meta, parameters, body) {
        super();
        this.meta = meta;
        this.parameters = parameters;
        this.body = body;
        this.tag = OpTag.PUSH_LAMBDA;
    }
}
exports.PushLambda = PushLambda;
class InvokeForeign extends BaseOp {
    constructor(meta, name, arity) {
        super();
        this.meta = meta;
        this.name = name;
        this.arity = arity;
        this.tag = OpTag.INVOKE_FOREIGN;
    }
}
exports.InvokeForeign = InvokeForeign;
class Invoke extends BaseOp {
    constructor(meta, name, arity) {
        super();
        this.meta = meta;
        this.name = name;
        this.arity = arity;
        this.tag = OpTag.INVOKE;
    }
}
exports.Invoke = Invoke;
class Apply extends BaseOp {
    constructor(meta, arity) {
        super();
        this.meta = meta;
        this.arity = arity;
        this.tag = OpTag.APPLY;
    }
}
exports.Apply = Apply;
class Return extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.RETURN;
    }
}
exports.Return = Return;
class PushPartial extends BaseOp {
    constructor(meta, name, arity) {
        super();
        this.meta = meta;
        this.name = name;
        this.arity = arity;
        this.tag = OpTag.PUSH_PARTIAL;
    }
}
exports.PushPartial = PushPartial;
class Assert extends BaseOp {
    constructor(meta, kind, assert_tag, message, expression) {
        super();
        this.meta = meta;
        this.kind = kind;
        this.assert_tag = assert_tag;
        this.message = message;
        this.expression = expression;
        this.tag = OpTag.ASSERT;
    }
}
exports.Assert = Assert;
class Branch extends BaseOp {
    constructor(meta, consequent, alternate) {
        super();
        this.meta = meta;
        this.consequent = consequent;
        this.alternate = alternate;
        this.tag = OpTag.BRANCH;
    }
}
exports.Branch = Branch;
class TypeTest extends BaseOp {
    constructor(meta, type) {
        super();
        this.meta = meta;
        this.type = type;
        this.tag = OpTag.TYPE_TEST;
    }
}
exports.TypeTest = TypeTest;
class TraitTest extends BaseOp {
    constructor(meta, trait) {
        super();
        this.meta = meta;
        this.trait = trait;
        this.tag = OpTag.TRAIT_TEST;
    }
}
exports.TraitTest = TraitTest;
class IntrinsicEqual extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.INTRINSIC_EQUAL;
    }
}
exports.IntrinsicEqual = IntrinsicEqual;
class RegisterInstance extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.REGISTER_INSTANCE;
    }
}
exports.RegisterInstance = RegisterInstance;
class Search extends BaseOp {
    constructor(meta, predicate) {
        super();
        this.meta = meta;
        this.predicate = predicate;
        this.tag = OpTag.SEARCH;
    }
}
exports.Search = Search;
class MatchSearch extends BaseOp {
    constructor(meta, block, alternate) {
        super();
        this.meta = meta;
        this.block = block;
        this.alternate = alternate;
        this.tag = OpTag.MATCH_SEARCH;
    }
}
exports.MatchSearch = MatchSearch;
class Fact extends BaseOp {
    constructor(meta, relation, arity) {
        super();
        this.meta = meta;
        this.relation = relation;
        this.arity = arity;
        this.tag = OpTag.FACT;
    }
}
exports.Fact = Fact;
class Forget extends BaseOp {
    constructor(meta, relation, arity) {
        super();
        this.meta = meta;
        this.relation = relation;
        this.arity = arity;
        this.tag = OpTag.FORGET;
    }
}
exports.Forget = Forget;
class SimulationSignal {
    constructor(meta, parameters, name, body) {
        this.meta = meta;
        this.parameters = parameters;
        this.name = name;
        this.body = body;
    }
}
exports.SimulationSignal = SimulationSignal;
class Simulate extends BaseOp {
    constructor(meta, context, goal, signals) {
        super();
        this.meta = meta;
        this.context = context;
        this.goal = goal;
        this.signals = signals;
        this.tag = OpTag.SIMULATE;
    }
}
exports.Simulate = Simulate;
class Handle extends BaseOp {
    constructor(meta, body, handlers) {
        super();
        this.meta = meta;
        this.body = body;
        this.handlers = handlers;
        this.tag = OpTag.HANDLE;
    }
}
exports.Handle = Handle;
class HandlerCase {
    constructor(meta, effect, variant, parameters, block) {
        this.meta = meta;
        this.effect = effect;
        this.variant = variant;
        this.parameters = parameters;
        this.block = block;
    }
}
exports.HandlerCase = HandlerCase;
class Perform extends BaseOp {
    constructor(meta, effect, variant, arity) {
        super();
        this.meta = meta;
        this.effect = effect;
        this.variant = variant;
        this.arity = arity;
        this.tag = OpTag.PERFORM;
    }
}
exports.Perform = Perform;
class ContinueWith extends BaseOp {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = OpTag.CONTINUE_WITH;
    }
}
exports.ContinueWith = ContinueWith;
class Dsl extends BaseOp {
    constructor(meta, type, ast) {
        super();
        this.meta = meta;
        this.type = type;
        this.ast = ast;
        this.tag = OpTag.DSL;
    }
}
exports.Dsl = Dsl;
var DslNodeTag;
(function (DslNodeTag) {
    DslNodeTag[DslNodeTag["NODE"] = 1] = "NODE";
    DslNodeTag[DslNodeTag["LITERAL"] = 2] = "LITERAL";
    DslNodeTag[DslNodeTag["VARIABLE"] = 3] = "VARIABLE";
    DslNodeTag[DslNodeTag["LIST"] = 4] = "LIST";
    DslNodeTag[DslNodeTag["INTERPOLATION"] = 5] = "INTERPOLATION";
    DslNodeTag[DslNodeTag["EXPRESSION"] = 6] = "EXPRESSION";
})(DslNodeTag = exports.DslNodeTag || (exports.DslNodeTag = {}));
class DslAstNode {
    constructor(meta, name, children, attributes) {
        this.meta = meta;
        this.name = name;
        this.children = children;
        this.attributes = attributes;
        this.tag = DslNodeTag.NODE;
    }
}
exports.DslAstNode = DslAstNode;
class DslAstLiteral {
    constructor(meta, value) {
        this.meta = meta;
        this.value = value;
        this.tag = DslNodeTag.LITERAL;
    }
}
exports.DslAstLiteral = DslAstLiteral;
class DslAstVariable {
    constructor(meta, name) {
        this.meta = meta;
        this.name = name;
        this.tag = DslNodeTag.VARIABLE;
    }
}
exports.DslAstVariable = DslAstVariable;
class DslAstNodeList {
    constructor(meta, children) {
        this.meta = meta;
        this.children = children;
        this.tag = DslNodeTag.LIST;
    }
}
exports.DslAstNodeList = DslAstNodeList;
class DslAstExpression {
    constructor(meta, source, value) {
        this.meta = meta;
        this.source = source;
        this.value = value;
        this.tag = DslNodeTag.EXPRESSION;
    }
}
exports.DslAstExpression = DslAstExpression;
class DslAstInterpolation {
    constructor(meta, parts) {
        this.meta = meta;
        this.parts = parts;
        this.tag = DslNodeTag.INTERPOLATION;
    }
}
exports.DslAstInterpolation = DslAstInterpolation;
var DslInterpolationTag;
(function (DslInterpolationTag) {
    DslInterpolationTag[DslInterpolationTag["STATIC"] = 0] = "STATIC";
    DslInterpolationTag[DslInterpolationTag["DYNAMIC"] = 1] = "DYNAMIC";
})(DslInterpolationTag = exports.DslInterpolationTag || (exports.DslInterpolationTag = {}));
class DslInterpolationStatic {
    constructor(text) {
        this.text = text;
        this.tag = DslInterpolationTag.STATIC;
    }
}
exports.DslInterpolationStatic = DslInterpolationStatic;
class DslInterpolationDynamic {
    constructor(node) {
        this.node = node;
        this.tag = DslInterpolationTag.DYNAMIC;
    }
}
exports.DslInterpolationDynamic = DslInterpolationDynamic;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SGPredicate = exports.SGTotalQuiescence = exports.SGEventQuiescence = exports.SGActionQuiescence = exports.SimulationGoalBase = exports.SimulationGoalTag = void 0;
var SimulationGoalTag;
(function (SimulationGoalTag) {
    SimulationGoalTag[SimulationGoalTag["ACTION_QUIESCENCE"] = 1] = "ACTION_QUIESCENCE";
    SimulationGoalTag[SimulationGoalTag["EVENT_QUIESCENCE"] = 2] = "EVENT_QUIESCENCE";
    SimulationGoalTag[SimulationGoalTag["TOTAL_QUIESCENCE"] = 3] = "TOTAL_QUIESCENCE";
    SimulationGoalTag[SimulationGoalTag["PREDICATE"] = 4] = "PREDICATE";
})(SimulationGoalTag = exports.SimulationGoalTag || (exports.SimulationGoalTag = {}));
class SimulationGoalBase {
}
exports.SimulationGoalBase = SimulationGoalBase;
class SGActionQuiescence extends SimulationGoalBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = SimulationGoalTag.ACTION_QUIESCENCE;
    }
}
exports.SGActionQuiescence = SGActionQuiescence;
class SGEventQuiescence extends SimulationGoalBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = SimulationGoalTag.EVENT_QUIESCENCE;
    }
}
exports.SGEventQuiescence = SGEventQuiescence;
class SGTotalQuiescence extends SimulationGoalBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = SimulationGoalTag.TOTAL_QUIESCENCE;
    }
}
exports.SGTotalQuiescence = SGTotalQuiescence;
class SGPredicate extends SimulationGoalBase {
    constructor(meta, predicate) {
        super();
        this.meta = meta;
        this.predicate = predicate;
        this.tag = SimulationGoalTag.PREDICATE;
    }
}
exports.SGPredicate = SGPredicate;

},{}],9:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./meta"), exports);
__exportStar(require("./type"), exports);
__exportStar(require("./literal"), exports);
__exportStar(require("./pattern"), exports);
__exportStar(require("./logic"), exports);
__exportStar(require("./goal"), exports);
__exportStar(require("./expression"), exports);
__exportStar(require("./declaration"), exports);
__exportStar(require("./program"), exports);
__exportStar(require("./repl"), exports);

},{"./declaration":6,"./expression":7,"./goal":8,"./literal":10,"./logic":11,"./meta":12,"./pattern":13,"./program":14,"./repl":15,"./type":16}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralText = exports.LiteralFloat64 = exports.LiteralInteger = exports.LiteralFalse = exports.LiteralTrue = exports.LiteralNothing = exports.BaseLiteral = exports.LiteralTag = void 0;
var LiteralTag;
(function (LiteralTag) {
    LiteralTag[LiteralTag["NOTHING"] = 1] = "NOTHING";
    LiteralTag[LiteralTag["TRUE"] = 2] = "TRUE";
    LiteralTag[LiteralTag["FALSE"] = 3] = "FALSE";
    LiteralTag[LiteralTag["INTEGER"] = 4] = "INTEGER";
    LiteralTag[LiteralTag["FLOAT_64"] = 5] = "FLOAT_64";
    LiteralTag[LiteralTag["TEXT"] = 6] = "TEXT";
})(LiteralTag = exports.LiteralTag || (exports.LiteralTag = {}));
class BaseLiteral {
}
exports.BaseLiteral = BaseLiteral;
class LiteralNothing extends BaseLiteral {
    constructor() {
        super(...arguments);
        this.tag = LiteralTag.NOTHING;
    }
}
exports.LiteralNothing = LiteralNothing;
class LiteralTrue extends BaseLiteral {
    constructor() {
        super(...arguments);
        this.tag = LiteralTag.TRUE;
    }
}
exports.LiteralTrue = LiteralTrue;
class LiteralFalse extends BaseLiteral {
    constructor() {
        super(...arguments);
        this.tag = LiteralTag.FALSE;
    }
}
exports.LiteralFalse = LiteralFalse;
class LiteralInteger extends BaseLiteral {
    constructor(value) {
        super();
        this.value = value;
        this.tag = LiteralTag.INTEGER;
    }
}
exports.LiteralInteger = LiteralInteger;
class LiteralFloat64 extends BaseLiteral {
    constructor(value) {
        super();
        this.value = value;
        this.tag = LiteralTag.FLOAT_64;
    }
}
exports.LiteralFloat64 = LiteralFloat64;
class LiteralText extends BaseLiteral {
    constructor(value) {
        super();
        this.value = value;
        this.tag = LiteralTag.TEXT;
    }
}
exports.LiteralText = LiteralText;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAlways = exports.PType = exports.PLet = exports.PConstrained = exports.PSampleType = exports.PSampleRelation = exports.PRelation = exports.PNot = exports.POr = exports.PAnd = exports.PredicateBase = exports.PredicateTag = void 0;
var PredicateTag;
(function (PredicateTag) {
    PredicateTag[PredicateTag["AND"] = 0] = "AND";
    PredicateTag[PredicateTag["OR"] = 1] = "OR";
    PredicateTag[PredicateTag["NOT"] = 2] = "NOT";
    PredicateTag[PredicateTag["RELATION"] = 3] = "RELATION";
    PredicateTag[PredicateTag["SAMPLE_RELATION"] = 4] = "SAMPLE_RELATION";
    PredicateTag[PredicateTag["SAMPLE_TYPE"] = 5] = "SAMPLE_TYPE";
    PredicateTag[PredicateTag["CONSTRAIN"] = 6] = "CONSTRAIN";
    PredicateTag[PredicateTag["LET"] = 7] = "LET";
    PredicateTag[PredicateTag["TYPE"] = 8] = "TYPE";
    PredicateTag[PredicateTag["ALWAYS"] = 9] = "ALWAYS";
})(PredicateTag = exports.PredicateTag || (exports.PredicateTag = {}));
class PredicateBase {
}
exports.PredicateBase = PredicateBase;
class PAnd extends PredicateBase {
    constructor(meta, left, right) {
        super();
        this.meta = meta;
        this.left = left;
        this.right = right;
        this.tag = PredicateTag.AND;
    }
}
exports.PAnd = PAnd;
class POr extends PredicateBase {
    constructor(meta, left, right) {
        super();
        this.meta = meta;
        this.left = left;
        this.right = right;
        this.tag = PredicateTag.OR;
    }
}
exports.POr = POr;
class PNot extends PredicateBase {
    constructor(meta, pred) {
        super();
        this.meta = meta;
        this.pred = pred;
        this.tag = PredicateTag.NOT;
    }
}
exports.PNot = PNot;
class PRelation extends PredicateBase {
    constructor(meta, relation, patterns) {
        super();
        this.meta = meta;
        this.relation = relation;
        this.patterns = patterns;
        this.tag = PredicateTag.RELATION;
    }
}
exports.PRelation = PRelation;
class PSampleRelation extends PredicateBase {
    constructor(meta, size, relation, patterns) {
        super();
        this.meta = meta;
        this.size = size;
        this.relation = relation;
        this.patterns = patterns;
        this.tag = PredicateTag.SAMPLE_RELATION;
    }
}
exports.PSampleRelation = PSampleRelation;
class PSampleType extends PredicateBase {
    constructor(meta, size, name, type) {
        super();
        this.meta = meta;
        this.size = size;
        this.name = name;
        this.type = type;
        this.tag = PredicateTag.SAMPLE_TYPE;
    }
}
exports.PSampleType = PSampleType;
class PConstrained extends PredicateBase {
    constructor(meta, predicate, constraint) {
        super();
        this.meta = meta;
        this.predicate = predicate;
        this.constraint = constraint;
        this.tag = PredicateTag.CONSTRAIN;
    }
}
exports.PConstrained = PConstrained;
class PLet extends PredicateBase {
    constructor(meta, name, value) {
        super();
        this.meta = meta;
        this.name = name;
        this.value = value;
        this.tag = PredicateTag.LET;
    }
}
exports.PLet = PLet;
class PType extends PredicateBase {
    constructor(meta, name, type) {
        super();
        this.meta = meta;
        this.name = name;
        this.type = type;
        this.tag = PredicateTag.TYPE;
    }
}
exports.PType = PType;
class PAlways extends PredicateBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = PredicateTag.ALWAYS;
    }
}
exports.PAlways = PAlways;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTypePattern = exports.WildcardPattern = exports.VariablePattern = exports.SelfPattern = exports.GlobalPattern = exports.LiteralPattern = exports.TypePattern = exports.PatternBase = exports.PatternTag = void 0;
var PatternTag;
(function (PatternTag) {
    PatternTag[PatternTag["HAS_TYPE"] = 0] = "HAS_TYPE";
    PatternTag[PatternTag["GLOBAL"] = 1] = "GLOBAL";
    PatternTag[PatternTag["STATIC_TYPE"] = 2] = "STATIC_TYPE";
    PatternTag[PatternTag["VARIABLE"] = 3] = "VARIABLE";
    PatternTag[PatternTag["SELF"] = 4] = "SELF";
    PatternTag[PatternTag["WILDCARD"] = 5] = "WILDCARD";
    PatternTag[PatternTag["LITERAL"] = 6] = "LITERAL";
})(PatternTag = exports.PatternTag || (exports.PatternTag = {}));
class PatternBase {
}
exports.PatternBase = PatternBase;
class TypePattern extends PatternBase {
    constructor(meta, type, pattern) {
        super();
        this.meta = meta;
        this.type = type;
        this.pattern = pattern;
        this.tag = PatternTag.HAS_TYPE;
    }
}
exports.TypePattern = TypePattern;
class LiteralPattern extends PatternBase {
    constructor(meta, literal) {
        super();
        this.meta = meta;
        this.literal = literal;
        this.tag = PatternTag.LITERAL;
    }
}
exports.LiteralPattern = LiteralPattern;
class GlobalPattern extends PatternBase {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = PatternTag.GLOBAL;
    }
}
exports.GlobalPattern = GlobalPattern;
class SelfPattern extends PatternBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = PatternTag.SELF;
    }
}
exports.SelfPattern = SelfPattern;
class VariablePattern extends PatternBase {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = PatternTag.VARIABLE;
    }
}
exports.VariablePattern = VariablePattern;
class WildcardPattern extends PatternBase {
    constructor(meta) {
        super();
        this.meta = meta;
        this.tag = PatternTag.WILDCARD;
    }
}
exports.WildcardPattern = WildcardPattern;
class StaticTypePattern extends PatternBase {
    constructor(meta, type) {
        super();
        this.meta = meta;
        this.type = type;
        this.tag = PatternTag.STATIC_TYPE;
    }
}
exports.StaticTypePattern = StaticTypePattern;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = exports.Interval = void 0;
class Interval {
    constructor(range) {
        this.range = range;
    }
}
exports.Interval = Interval;
class Program {
    constructor(filename, source, meta_table, declarations) {
        this.filename = filename;
        this.source = source;
        this.meta_table = meta_table;
        this.declarations = declarations;
    }
}
exports.Program = Program;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplStatements = exports.ReplDeclarations = exports.ReplTag = void 0;
var ReplTag;
(function (ReplTag) {
    ReplTag[ReplTag["STATEMENTS"] = 0] = "STATEMENTS";
    ReplTag[ReplTag["DECLARATIONS"] = 1] = "DECLARATIONS";
})(ReplTag = exports.ReplTag || (exports.ReplTag = {}));
class ReplDeclarations {
    constructor(declarations, source, meta) {
        this.declarations = declarations;
        this.source = source;
        this.meta = meta;
        this.tag = ReplTag.DECLARATIONS;
    }
}
exports.ReplDeclarations = ReplDeclarations;
class ReplStatements {
    constructor(block, source, meta) {
        this.block = block;
        this.source = source;
        this.meta = meta;
        this.tag = ReplTag.STATEMENTS;
    }
}
exports.ReplStatements = ReplStatements;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalTrait = exports.TraitTag = exports.TypeConstraintWithTrait = exports.TypeConstraintType = exports.TypeConstraintTag = exports.LocalType = exports.GlobalType = exports.StaticType = exports.UnknownType = exports.AnyType = exports.BaseType = exports.TypeTag = void 0;
var TypeTag;
(function (TypeTag) {
    TypeTag[TypeTag["ANY"] = 1] = "ANY";
    TypeTag[TypeTag["UNKNOWN"] = 2] = "UNKNOWN";
    TypeTag[TypeTag["GLOBAL"] = 3] = "GLOBAL";
    TypeTag[TypeTag["LOCAL"] = 4] = "LOCAL";
    TypeTag[TypeTag["LOCAL_STATIC"] = 5] = "LOCAL_STATIC";
})(TypeTag = exports.TypeTag || (exports.TypeTag = {}));
class BaseType {
}
exports.BaseType = BaseType;
class AnyType extends BaseType {
    constructor() {
        super(...arguments);
        this.tag = TypeTag.ANY;
    }
}
exports.AnyType = AnyType;
class UnknownType extends BaseType {
    constructor() {
        super(...arguments);
        this.tag = TypeTag.UNKNOWN;
    }
}
exports.UnknownType = UnknownType;
class StaticType extends BaseType {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = TypeTag.LOCAL_STATIC;
    }
}
exports.StaticType = StaticType;
class GlobalType extends BaseType {
    constructor(meta, namespace, name) {
        super();
        this.meta = meta;
        this.namespace = namespace;
        this.name = name;
        this.tag = TypeTag.GLOBAL;
    }
}
exports.GlobalType = GlobalType;
class LocalType extends BaseType {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = TypeTag.LOCAL;
    }
}
exports.LocalType = LocalType;
var TypeConstraintTag;
(function (TypeConstraintTag) {
    TypeConstraintTag[TypeConstraintTag["TYPE"] = 0] = "TYPE";
    TypeConstraintTag[TypeConstraintTag["WITH_TRAIT"] = 1] = "WITH_TRAIT";
})(TypeConstraintTag = exports.TypeConstraintTag || (exports.TypeConstraintTag = {}));
class BaseConstraint {
}
class TypeConstraintType extends BaseConstraint {
    constructor(meta, type) {
        super();
        this.meta = meta;
        this.type = type;
        this.tag = TypeConstraintTag.TYPE;
    }
}
exports.TypeConstraintType = TypeConstraintType;
class TypeConstraintWithTrait extends BaseConstraint {
    constructor(meta, type, traits) {
        super();
        this.meta = meta;
        this.type = type;
        this.traits = traits;
        this.tag = TypeConstraintTag.WITH_TRAIT;
    }
}
exports.TypeConstraintWithTrait = TypeConstraintWithTrait;
var TraitTag;
(function (TraitTag) {
    TraitTag[TraitTag["LOCAL"] = 0] = "LOCAL";
})(TraitTag = exports.TraitTag || (exports.TraitTag = {}));
class BaseTrait {
}
class LocalTrait extends BaseTrait {
    constructor(meta, name) {
        super();
        this.meta = meta;
        this.name = name;
        this.tag = TraitTag.LOCAL;
    }
}
exports.LocalTrait = LocalTrait;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
function force(x) {
    if (typeof x === "function") {
        return x();
    }
    else {
        return x;
    }
}
class Logger {
    constructor() {
        this.verbose = false;
    }
    meta(level) {
        return `[${level}]`;
    }
    info(...xs) {
        console.log(this.meta("info"), ...xs.map(force));
    }
    debug(...xs) {
        if (this.verbose) {
            console.debug(this.meta("debug"), ...xs.map(force));
        }
    }
    error(...xs) {
        console.error(this.meta("error"), ...xs.map(force));
    }
}
exports.Logger = Logger;
exports.logger = new Logger();

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format_time_diff = exports.gen = exports.clone_map = exports.copy_map = exports.every = exports.zip3 = exports.zip = exports.defer = exports.maybe_cast = exports.cast = exports.delay = exports.show = exports.unreachable = exports.force_cast = void 0;
const Util = require("util");
function force_cast(x) { }
exports.force_cast = force_cast;
function unreachable(x, message) {
    console.error(message, x);
    throw new Error(message);
}
exports.unreachable = unreachable;
function show(x) {
    return Util.inspect(x, false, null, true);
}
exports.show = show;
function delay(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
exports.delay = delay;
function cast(x, type) {
    if (x instanceof type) {
        return x;
    }
    else {
        const get_type = (x) => {
            if (x === null) {
                return `native null`;
            }
            else if (Object(x) !== x) {
                return `native ${typeof x}`;
            }
            else if (x?.type?.type_name) {
                return x.type.type_name;
            }
            else if (x?.type_name) {
                return x.type_name;
            }
            else if (x.constructor) {
                return x.constructor.name;
            }
            else {
                `<host value ${x?.name ?? typeof x}>`;
            }
        };
        throw new TypeError(`internal: expected ${get_type(type)}, got ${get_type(x)}`);
    }
}
exports.cast = cast;
function maybe_cast(x, type) {
    if (x instanceof type) {
        return x;
    }
    else {
        return null;
    }
}
exports.maybe_cast = maybe_cast;
function defer() {
    const deferred = Object.create(null);
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}
exports.defer = defer;
function* zip(xs, ys) {
    if (xs.length !== ys.length) {
        throw new Error(`Can't zip lists of different lengths`);
    }
    for (let i = 0; i < xs.length; ++i) {
        yield [xs[i], ys[i]];
    }
}
exports.zip = zip;
function* zip3(xs, ys, zs) {
    if (xs.length !== ys.length || xs.length !== zs.length) {
        throw new Error(`Can't zip lists of different lengths`);
    }
    for (let i = 0; i < xs.length; ++i) {
        yield [xs[i], ys[i], zs[i]];
    }
}
exports.zip3 = zip3;
function every(xs, pred) {
    for (const x of xs) {
        if (!pred(x)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function copy_map(source, target) {
    for (const [k, v] of source.entries()) {
        target.set(k, v);
    }
    return target;
}
exports.copy_map = copy_map;
function clone_map(source) {
    const map = new Map();
    for (const [k, v] of source.entries()) {
        map.set(k, v);
    }
    return map;
}
exports.clone_map = clone_map;
function* gen(x) {
    yield* x;
}
exports.gen = gen;
// assumes nanoseconds
function format_time_diff(n) {
    const units = [
        [1000n, "μs"],
        [1000n, "ms"],
        [1000n, "s"],
    ];
    let value = n;
    let suffix = "ns";
    for (const [divisor, unit] of units) {
        if (value > divisor) {
            value = value / divisor;
            suffix = unit;
        }
        else {
            break;
        }
    }
    return `${value}${suffix}`;
}
exports.format_time_diff = format_time_diff;

},{"util":124}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XorShift = void 0;
class XorShift {
    constructor(seed, inc) {
        this._seed = seed | 0;
        this._inc = inc | 0;
    }
    static new_random() {
        return XorShift.from_seed(random_int(2 ** 10, 2 ** 31));
    }
    static from_seed(seed) {
        return new XorShift(seed | 0, seed | 0);
    }
    get seed() {
        return this._seed;
    }
    get inc() {
        return this._inc;
    }
    reseed(seed) {
        this._seed = seed | 0;
        this._inc = seed;
    }
    clone() {
        return new XorShift(this._seed, this._inc);
    }
    next() {
        let t = this._seed;
        t ^= (t | 0) << 13;
        t ^= (t | 0) << 25;
        t ^= (t | 0) << 9;
        this._inc = (this._inc + 1368297235087925) | 0;
        t = Math.abs((t + this._inc) | 0);
        this._seed = t;
        return t;
    }
    random() {
        return 2 ** -31 * this.next();
    }
    random_integer(min, max) {
        return min + Math.floor(this.random() * (max - min));
    }
    random_choice(xs) {
        if (xs.length === 0) {
            return null;
        }
        else {
            const choice = this.random_integer(0, xs.length);
            return xs[choice];
        }
    }
    random_choice_mut(xs) {
        if (xs.length === 0) {
            return null;
        }
        else {
            const choice = this.random_integer(0, xs.length);
            const result = xs[choice];
            xs.splice(choice, 1);
            return result;
        }
    }
    random_choice_many(size, xs) {
        const result = [];
        const candidates = xs.slice();
        while (result.length < size) {
            const entry = this.random_choice_mut(candidates);
            if (entry == null) {
                return result;
            }
            else {
                result.push(entry);
            }
        }
        return result;
    }
    random_weighted_choice(xs) {
        if (xs.length === 0) {
            return null;
        }
        else {
            let total = 0;
            for (const [x, _] of xs) {
                total += x;
            }
            const sorted_xs = xs.sort(([x1, _1], [x2, _2]) => x2 - x1);
            let choice = this.random_integer(0, total);
            for (const [score, item] of sorted_xs) {
                if (choice <= score) {
                    return item;
                }
                else {
                    choice -= score;
                }
            }
        }
        throw new Error(`internal: weighted choice picked none`);
    }
}
exports.XorShift = XorShift;
XorShift.MIN_INTEGER = 0;
XorShift.MAX_INTEGER = (2 ** 32 - 1) | 0;
function random_int(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_declaration = exports.load_module = exports.make_universe = void 0;
const _1 = require(".");
const IR = require("../ir");
const utils_1 = require("../utils/utils");
const xorshift_1 = require("../utils/xorshift");
const evaluation_1 = require("./evaluation");
const intrinsics_1 = require("./intrinsics");
const logic_1 = require("./logic");
const primitives_1 = require("./primitives");
const simulation_1 = require("./simulation");
const tracing_1 = require("./tracing");
function make_universe() {
    const world = new intrinsics_1.CrochetWorld();
    // Core types
    const Any = new intrinsics_1.CrochetType(null, "any", "", null, [], [], false, null);
    const Unknown = new intrinsics_1.CrochetType(null, "unknown", "", Any, [], [], false, null);
    const Protected = new intrinsics_1.CrochetType(null, "protected", "", Any, [], [], false, null);
    const Nothing = new intrinsics_1.CrochetType(null, "nothing", "", Any, [], [], false, null);
    const Boolean = new intrinsics_1.CrochetType(null, "boolean", "", Any, [], [], false, null);
    const True = new intrinsics_1.CrochetType(null, "true", "", Boolean, [], [], false, null);
    const False = new intrinsics_1.CrochetType(null, "false", "", Boolean, [], [], false, null);
    const Numeric = new intrinsics_1.CrochetType(null, "numeric", "", Any, [], [], false, null);
    const Fractional = new intrinsics_1.CrochetType(null, "fractional", "", Numeric, [], [], false, null);
    const Integral = new intrinsics_1.CrochetType(null, "integral", "", Numeric, [], [], false, null);
    const Float = new intrinsics_1.CrochetType(null, "float", "", Fractional, [], [], false, null);
    const Integer = new intrinsics_1.CrochetType(null, "integer", "", Integral, [], [], false, null);
    const Text = new intrinsics_1.CrochetType(null, "text", "", Any, [], [], false, null);
    const StaticText = new intrinsics_1.CrochetType(null, "static-text", "", Text, [], [], false, null);
    const Interpolation = new intrinsics_1.CrochetType(null, "interpolation", "", Any, [], [], false, null);
    const Function = new intrinsics_1.CrochetType(null, "function", "", Any, [], [], false, null);
    const functions = [];
    const native_lambdas = [];
    for (let i = 0; i < 10; ++i) {
        const lambda = new intrinsics_1.CrochetType(null, `function-${i}`, "", Function, [], [], false, null);
        functions.push(lambda);
        const native_lambda = new intrinsics_1.CrochetType(null, `native-function-${i}`, "", lambda, [], [], false, null);
        native_lambdas.push(native_lambda);
    }
    const Thunk = new intrinsics_1.CrochetType(null, "thunk", "", Any, [], [], false, null);
    const Record = new intrinsics_1.CrochetType(null, "record", "", Any, [], [], false, null);
    const List = new intrinsics_1.CrochetType(null, "list", "", Any, [], [], false, null);
    const Enum = new intrinsics_1.CrochetType(null, "enum", "", Any, [], [], false, null);
    const Cell = new intrinsics_1.CrochetType(null, "cell", "", Any, [], [], false, null);
    const Type = new intrinsics_1.CrochetType(null, "type", "", Any, [], [], false, null);
    const Effect = new intrinsics_1.CrochetType(null, "effect", "", null, [], [], false, null);
    // Simulations
    const Action = new intrinsics_1.CrochetType(null, "action", "", Any, [], [], false, null);
    const ActionChoice = new intrinsics_1.CrochetType(null, "action-choice", "", Any, ["score", "action", "environment"], [
        new intrinsics_1.CrochetTypeConstraint(Integer, []),
        new intrinsics_1.CrochetTypeConstraint(Action, []),
        new intrinsics_1.CrochetTypeConstraint(Record, []),
    ], false, null);
    // Skeleton DSL
    const Skeleton = new intrinsics_1.CrochetType(null, "skeleton", "", Any, [], [], false, null);
    const SNode = new intrinsics_1.CrochetType(null, "skeleton-node", "", Skeleton, ["name", "children", "attributes", "meta"], [
        new intrinsics_1.CrochetTypeConstraint(Text, []),
        new intrinsics_1.CrochetTypeConstraint(List, []),
        new intrinsics_1.CrochetTypeConstraint(Record, []),
        new intrinsics_1.CrochetTypeConstraint(Any, []),
    ], false, null);
    const SLiteral = new intrinsics_1.CrochetType(null, "skeleton-literal", "", Skeleton, ["value", "meta"], [new intrinsics_1.CrochetTypeConstraint(Any, []), new intrinsics_1.CrochetTypeConstraint(Any, [])], false, null);
    const SName = new intrinsics_1.CrochetType(null, "skeleton-name", "", Skeleton, ["name", "meta"], [new intrinsics_1.CrochetTypeConstraint(Text, []), new intrinsics_1.CrochetTypeConstraint(Any, [])], false, null);
    const SDynamic = new intrinsics_1.CrochetType(null, "skeleton-dynamic", "", Skeleton, ["expression", "meta"], [
        new intrinsics_1.CrochetTypeConstraint(functions[0], []),
        new intrinsics_1.CrochetTypeConstraint(Any, []),
    ], false, null);
    const SList = new intrinsics_1.CrochetType(null, "skeleton-list", "", Skeleton, ["children", "meta"], [new intrinsics_1.CrochetTypeConstraint(List, []), new intrinsics_1.CrochetTypeConstraint(Any, [])], false, null);
    const SInterpolation = new intrinsics_1.CrochetType(null, "skeleton-interpolation", "", Skeleton, ["parts", "meta"], [new intrinsics_1.CrochetTypeConstraint(List, []), new intrinsics_1.CrochetTypeConstraint(Any, [])], false, null);
    world.native_types.define("crochet.core/core.any", Any);
    world.native_types.define("crochet.core/core.protected", Protected);
    world.native_types.define("crochet.core/core.unknown", Unknown);
    world.native_types.define("crochet.core/core.nothing", Nothing);
    world.native_types.define("crochet.core/core.boolean", Boolean);
    world.native_types.define("crochet.core/core.true", True);
    world.native_types.define("crochet.core/core.false", False);
    world.native_types.define("crochet.core/core.numeric", Numeric);
    world.native_types.define("crochet.core/core.fractional", Fractional);
    world.native_types.define("crochet.core/core.integral", Integral);
    world.native_types.define("crochet.core/core.float", Float);
    world.native_types.define("crochet.core/core.integer", Integer);
    world.native_types.define("crochet.core/core.text", Text);
    world.native_types.define("crochet.core/core.static-text", StaticText);
    world.native_types.define("crochet.core/core.interpolation", Interpolation);
    world.native_types.define("crochet.core/core.function", Function);
    for (const f of functions) {
        world.native_types.define(`crochet.core/core.${f.name}`, f);
    }
    world.native_types.define("crochet.core/core.thunk", Thunk);
    world.native_types.define("crochet.core/core.record", Record);
    world.native_types.define("crochet.core/core.list", List);
    world.native_types.define("crochet.core/core.enum", Enum);
    world.native_types.define("crochet.core/core.cell", Cell);
    world.native_types.define("crochet.core/core.action", Action);
    world.native_types.define("crochet.core/core.skeleton-ast", Skeleton);
    world.native_types.define("crochet.core/core.skeleton-node", SNode);
    world.native_types.define("crochet.core/core.skeleton-name", SName);
    world.native_types.define("crochet.core/core.skeleton-literal", SLiteral);
    world.native_types.define("crochet.core/core.skeleton-dynamic", SDynamic);
    world.native_types.define("crochet.core/core.skeleton-list", SList);
    world.native_types.define("crochet.core/core.skeleton-interpolation", SInterpolation);
    world.native_types.define("crochet.core/core.action", Action);
    world.native_types.define("crochet.core/core.action-choice", ActionChoice);
    return new intrinsics_1.Universe(new tracing_1.CrochetTrace(), world, xorshift_1.XorShift.new_random(), {
        Any,
        Unknown,
        Protected,
        Nothing,
        True,
        False,
        Integer,
        Float,
        Text,
        StaticText,
        Interpolation,
        Function: functions,
        NativeFunctions: native_lambdas,
        Thunk,
        Record,
        List: List,
        Enum,
        Type,
        Cell,
        Action,
        ActionChoice,
        Effect,
        Skeleton: {
            Node: SNode,
            Name: SName,
            Literal: SLiteral,
            Dynamic: SDynamic,
            List: SList,
            Interpolation: SInterpolation,
        },
    });
}
exports.make_universe = make_universe;
function load_module(universe, pkg, program) {
    const module = new intrinsics_1.CrochetModule(pkg, program.filename, new intrinsics_1.Metadata(program.source, program.meta_table));
    for (const x of program.declarations) {
        load_declaration(universe, module, x);
    }
    return module;
}
exports.load_module = load_module;
function load_declaration(universe, module, declaration) {
    const t = IR.DeclarationTag;
    switch (declaration.tag) {
        case t.COMMAND: {
            const command = primitives_1.Commands.get_or_make_command(universe, declaration.name, declaration.parameters.length);
            const branch = new intrinsics_1.CrochetCommandBranch(module, new intrinsics_1.Environment(null, null, module, null), declaration.name, declaration.documentation, declaration.parameters, declaration.types.map((t) => primitives_1.Types.materialise_type_constraint(universe, module, t)), declaration.body, declaration.meta);
            primitives_1.Commands.add_branch(command, branch);
            break;
        }
        case t.TYPE: {
            const parent = primitives_1.Types.materialise_type_constraint(universe, module, declaration.parent).type;
            const type = new intrinsics_1.CrochetType(module, declaration.name, declaration.documentation, parent, declaration.fields, declaration.types.map((t) => primitives_1.Types.materialise_type_constraint(universe, module, t)), false, declaration.meta);
            parent.sub_types.push(type);
            primitives_1.Types.define_type(module, declaration.name, type, declaration.visibility);
            break;
        }
        case t.EFFECT: {
            const effect = universe.types.Effect;
            const parent = new intrinsics_1.CrochetType(module, primitives_1.Effects.effect_name(declaration.name), declaration.documentation, effect, [], [], false, declaration.meta);
            for (const c of declaration.cases) {
                const type = new intrinsics_1.CrochetType(module, primitives_1.Effects.variant_name(declaration.name, c.name), c.documentation, parent, c.parameters, c.types.map((t) => primitives_1.Types.materialise_type_constraint(universe, module, t)), false, c.meta);
                parent.sub_types.push(type);
                primitives_1.Types.define_type(module, type.name, type, IR.Visibility.GLOBAL);
            }
            primitives_1.Types.define_type(module, parent.name, parent, IR.Visibility.GLOBAL);
            primitives_1.Types.seal(parent);
            break;
        }
        case t.FOREIGN_TYPE: {
            const type = primitives_1.Types.get_foreign_type(universe, module, declaration.target);
            primitives_1.Types.define_type(module, declaration.name, type, IR.Visibility.GLOBAL);
            break;
        }
        case t.SEAL: {
            const type = primitives_1.Types.get_type(module, declaration.name);
            primitives_1.Types.seal(type);
            break;
        }
        case t.TEST: {
            const test = new intrinsics_1.CrochetTest(module, new intrinsics_1.Environment(null, null, module, null), declaration.name, declaration.body);
            primitives_1.Tests.add_test(universe, test);
            break;
        }
        case t.OPEN: {
            primitives_1.Modules.open(module, declaration.namespace);
            break;
        }
        case t.DEFINE: {
            const value = evaluation_1.Thread.run_sync(universe, module, declaration.body);
            primitives_1.Modules.define(module, declaration.visibility, declaration.name, value);
            break;
        }
        case t.PRELUDE: {
            const env = new intrinsics_1.Environment(null, null, module, null);
            const prelude = new intrinsics_1.CrochetPrelude(env, declaration.body);
            primitives_1.World.add_prelude(universe.world, prelude);
            break;
        }
        case t.RELATION: {
            const type = logic_1.Tree.materialise_type(declaration.type);
            const tree = logic_1.Tree.materialise(type);
            logic_1.Relation.define_concrete(module, declaration.meta, declaration.name, declaration.documentation, type, tree);
            break;
        }
        case t.CONTEXT: {
            const context = new intrinsics_1.CrochetContext(declaration.meta, module, declaration.name, declaration.documentation);
            simulation_1.Contexts.define_context(module, context);
            break;
        }
        case t.ACTION: {
            const actor = primitives_1.Types.materialise_type_constraint(universe, module, declaration.actor);
            const action_type = new intrinsics_1.CrochetType(module, `action ${declaration.name}`, "", universe.types.Action, [], [], false, null);
            primitives_1.Types.define_type(module, action_type.name, action_type, IR.Visibility.GLOBAL);
            const action = new intrinsics_1.Action(action_type, declaration.meta, module, declaration.name, declaration.documentation, actor, declaration.parameter, declaration.predicate, declaration.rank_function, declaration.body);
            const context = simulation_1.Contexts.lookup_context(module, declaration.context);
            simulation_1.Contexts.add_action(module, context, action);
            break;
        }
        case t.WHEN: {
            const event = new intrinsics_1.When(declaration.meta, module, declaration.documentation, declaration.predicate, declaration.body);
            const context = simulation_1.Contexts.lookup_context(module, declaration.context);
            simulation_1.Contexts.add_event(context, event);
            break;
        }
        case t.TRAIT: {
            const trait = new intrinsics_1.CrochetTrait(module, declaration.name, declaration.documentation, declaration.meta);
            primitives_1.Types.define_trait(module, declaration.name, trait);
            break;
        }
        case t.IMPLEMENT_TRAIT: {
            const type = primitives_1.Types.materialise_type(universe, module, declaration.type);
            const trait = primitives_1.Types.materialise_trait(universe, module, declaration.trait);
            type.traits.add(trait);
            trait.implemented_by.add(type);
            break;
        }
        case t.CAPABILITY: {
            const capability = new _1.CrochetCapability(module, declaration.name, declaration.documentation, declaration.meta);
            primitives_1.Capability.define_capability(module, capability);
            break;
        }
        case t.PROTECT: {
            const et = IR.ProtectEntityTag;
            const entity = declaration.entity;
            const entity_type = declaration.type;
            const capability = primitives_1.Capability.get_capability(module, declaration.capability);
            switch (entity_type) {
                case et.TYPE: {
                    primitives_1.Capability.protect_type(universe, module, entity, capability);
                    break;
                }
                case et.EFFECT: {
                    primitives_1.Capability.protect_effect(universe, module, entity, capability);
                    break;
                }
                case et.TRAIT: {
                    primitives_1.Capability.protect_trait(universe, module, entity, capability);
                    break;
                }
                case et.DEFINE: {
                    primitives_1.Capability.protect_definition(universe, module, entity, capability);
                    break;
                }
                default: {
                    throw utils_1.unreachable(entity_type, "Entity type");
                }
            }
            break;
        }
        default:
            throw utils_1.unreachable(declaration, `Declaration`);
    }
}
exports.load_declaration = load_declaration;

},{".":23,"../ir":9,"../utils/utils":18,"../utils/xorshift":19,"./evaluation":22,"./intrinsics":24,"./logic":25,"./primitives":36,"./simulation":51,"./tracing":54}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetEvaluationError = exports.ErrNativePanic = exports.ErrArbitrary = exports.CrochetError = void 0;
class CrochetError extends Error {
}
exports.CrochetError = CrochetError;
class ErrArbitrary extends CrochetError {
    constructor(tag, original_message) {
        super(`${tag}: ${original_message}`);
        this.tag = tag;
        this.original_message = original_message;
    }
}
exports.ErrArbitrary = ErrArbitrary;
class ErrNativePanic extends CrochetError {
    constructor(tag, original_message, include_trace = true) {
        super(`${tag}: ${original_message}`);
        this.tag = tag;
        this.original_message = original_message;
        this.include_trace = include_trace;
    }
}
exports.ErrNativePanic = ErrNativePanic;
class CrochetEvaluationError extends CrochetError {
    constructor(source, trace, formatted_trace) {
        let native_trace = source instanceof Error ? source.stack ?? "" : "";
        if (native_trace != "") {
            const trace = native_trace.replace(/^.*?\n\s*at /, "");
            native_trace = `\n\nArising from the native code:\n${trace}`;
        }
        const include_trace = source instanceof ErrNativePanic ? source.include_trace : true;
        const suffix = include_trace
            ? ["\n\n", "Arising from:\n", formatted_trace, "\n", native_trace]
            : [];
        super([source.message, ...suffix].join(""));
        this.source = source;
        this.trace = trace;
    }
}
exports.CrochetEvaluationError = CrochetEvaluationError;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = exports.AwaitSignal = exports.SetStateSignal = exports.ContinueSignal = exports.JumpSignal = exports.ReturnSignal = exports.SignalTag = exports.RunResultAwait = exports.RunResultDone = exports.RunResultTag = void 0;
const _1 = require(".");
const IR = require("../ir");
const ir_1 = require("../ir");
const logger_1 = require("../utils/logger");
const utils_1 = require("../utils/utils");
const errors_1 = require("./errors");
const intrinsics_1 = require("./intrinsics");
const logic_1 = require("./logic");
const namespaces_1 = require("./namespaces");
const primitives_1 = require("./primitives");
const simulation_1 = require("./simulation");
const simulation_2 = require("./simulation/simulation");
const tracing_1 = require("./tracing");
var RunResultTag;
(function (RunResultTag) {
    RunResultTag[RunResultTag["DONE"] = 0] = "DONE";
    RunResultTag[RunResultTag["AWAIT"] = 1] = "AWAIT";
})(RunResultTag = exports.RunResultTag || (exports.RunResultTag = {}));
class RunResultDone {
    constructor(value) {
        this.value = value;
        this.tag = RunResultTag.DONE;
    }
}
exports.RunResultDone = RunResultDone;
class RunResultAwait {
    constructor(promise) {
        this.promise = promise;
        this.tag = RunResultTag.AWAIT;
    }
}
exports.RunResultAwait = RunResultAwait;
var SignalTag;
(function (SignalTag) {
    SignalTag[SignalTag["RETURN"] = 0] = "RETURN";
    SignalTag[SignalTag["JUMP"] = 1] = "JUMP";
    SignalTag[SignalTag["CONTINUE"] = 2] = "CONTINUE";
    SignalTag[SignalTag["SET_STATE"] = 3] = "SET_STATE";
    SignalTag[SignalTag["AWAIT"] = 4] = "AWAIT";
})(SignalTag = exports.SignalTag || (exports.SignalTag = {}));
class ReturnSignal {
    constructor(value) {
        this.value = value;
        this.tag = SignalTag.RETURN;
    }
}
exports.ReturnSignal = ReturnSignal;
class JumpSignal {
    constructor(activation) {
        this.activation = activation;
        this.tag = SignalTag.JUMP;
    }
}
exports.JumpSignal = JumpSignal;
class ContinueSignal {
    constructor() {
        this.tag = SignalTag.CONTINUE;
    }
}
exports.ContinueSignal = ContinueSignal;
class SetStateSignal {
    constructor(state) {
        this.state = state;
        this.tag = SignalTag.SET_STATE;
    }
}
exports.SetStateSignal = SetStateSignal;
class AwaitSignal {
    constructor(promise) {
        this.promise = promise;
        this.tag = SignalTag.AWAIT;
    }
}
exports.AwaitSignal = AwaitSignal;
const _continue = new ContinueSignal();
class Thread {
    constructor(state) {
        this.state = state;
    }
    static run_sync(universe, module, block) {
        const root = new intrinsics_1.State(universe, new intrinsics_1.CrochetActivation(null, null, new intrinsics_1.Environment(null, null, module, null), intrinsics_1._done, new intrinsics_1.HandlerStack(null, []), block), universe.random);
        const thread = new Thread(root);
        const value = thread.run_synchronous();
        return value;
    }
    async run_to_completion() {
        let result = this.run();
        while (true) {
            switch (result.tag) {
                case RunResultTag.DONE:
                    return result.value;
                case RunResultTag.AWAIT: {
                    const value = await result.promise;
                    result = this.run_with_input(value);
                    continue;
                }
                default:
                    throw utils_1.unreachable(result, "RunResult");
            }
        }
    }
    run_synchronous() {
        const result = this.run();
        switch (result.tag) {
            case RunResultTag.DONE:
                return result.value;
            case RunResultTag.AWAIT:
                throw new errors_1.ErrArbitrary("non-synchronous-completion", `Expected a synchronous completion, but got an asynchronous signal`);
            default:
                throw utils_1.unreachable(result, "RunResult");
        }
    }
    run_with_input(input) {
        const activation = this.state.activation;
        switch (activation.tag) {
            case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
                this.push(activation, input);
                activation.next();
                return this.run();
            }
            case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
                const signal = this.step_native(activation, input);
                return this.run(signal);
            }
            default:
                throw utils_1.unreachable(activation, "Activation");
        }
    }
    run(initial_signal) {
        logger_1.logger.debug(`Running`, () => primitives_1.Location.simple_activation(this.state.activation));
        try {
            let signal = initial_signal ?? this.step();
            while (true) {
                switch (signal.tag) {
                    case SignalTag.CONTINUE:
                        signal = this.step();
                        continue;
                    case SignalTag.RETURN: {
                        return new RunResultDone(signal.value);
                    }
                    case SignalTag.SET_STATE: {
                        this.state = signal.state;
                        signal = this.step();
                        continue;
                    }
                    case SignalTag.JUMP: {
                        this.state.activation = signal.activation;
                        logger_1.logger.debug("Jump to", () => primitives_1.Location.simple_activation(signal.activation));
                        signal = this.step();
                        continue;
                    }
                    case SignalTag.AWAIT: {
                        return new RunResultAwait(signal.promise);
                    }
                    default:
                        throw utils_1.unreachable(signal, `Signal`);
                }
            }
        }
        catch (error) {
            const trace = primitives_1.StackTrace.collect_trace(this.state.activation);
            const formatted_trace = primitives_1.StackTrace.format_entries(trace);
            throw new errors_1.CrochetEvaluationError(error, trace, formatted_trace);
        }
    }
    step() {
        const activation = this.state.activation;
        switch (activation.tag) {
            case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
                return this.step_crochet(activation);
            }
            case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
                return this.step_native(activation, this.universe.nothing);
            }
            default:
                throw utils_1.unreachable(activation, `Activation`);
        }
    }
    apply_continuation(value, k, activation) {
        switch (k.tag) {
            case intrinsics_1.ContinuationTag.DONE: {
                return new ReturnSignal(value);
            }
            case intrinsics_1.ContinuationTag.RETURN: {
                switch (activation.tag) {
                    case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
                        this.push(activation, value);
                        activation.next();
                        return new JumpSignal(activation);
                    }
                    case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
                        return this.step_native(activation, value);
                    }
                    default:
                        throw utils_1.unreachable(activation, `Activation`);
                }
            }
            case intrinsics_1.ContinuationTag.TAP: {
                logger_1.logger.debug("Applying continuation", () => k.continuation);
                const new_state = k.continuation(k.saved_state, this.state, value);
                return new SetStateSignal(new_state);
            }
            default:
                throw utils_1.unreachable(k, `Continuation`);
        }
    }
    do_return(value, activation) {
        if (activation == null) {
            return new ReturnSignal(value);
        }
        else {
            return this.apply_continuation(value, this.state.activation.continuation, activation);
        }
    }
    find_crochet_location(start_activation) {
        let activation = start_activation;
        while (activation != null) {
            switch (activation.tag) {
                case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
                    return activation.location;
                }
                case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
                    activation = activation.parent;
                    continue;
                }
                default:
                    throw utils_1.unreachable(activation, "Activation");
            }
        }
        return null;
    }
    step_native(activation, input) {
        const { value, done } = activation.routine.next(input);
        if (done) {
            if (!(value instanceof intrinsics_1.CrochetValue)) {
                throw new errors_1.ErrArbitrary("invalid-native-return", `The native function did not return a valid Crochet value`);
            }
            return this.do_return(value, activation.parent);
        }
        else {
            if (!(value instanceof intrinsics_1.NSBase)) {
                throw new errors_1.ErrArbitrary("invalid-native-yield", "The native function did not yield a valid signal");
            }
            switch (value.tag) {
                case intrinsics_1.NativeSignalTag.INVOKE: {
                    const command = primitives_1.Commands.get_command(this.universe, value.name);
                    const branch = primitives_1.Commands.select_branch(command, value.args);
                    const new_activation = primitives_1.Commands.prepare_activation(activation, branch, value.args);
                    return new JumpSignal(new_activation);
                }
                case intrinsics_1.NativeSignalTag.APPLY: {
                    const new_activation = primitives_1.Lambdas.prepare_activation(this.universe, activation, this.env, value.fn, value.args);
                    return new JumpSignal(new_activation);
                }
                case intrinsics_1.NativeSignalTag.EVALUATE: {
                    const new_activation = new intrinsics_1.CrochetActivation(activation, null, value.env, intrinsics_1._return, activation.handlers, value.block);
                    return new JumpSignal(new_activation);
                }
                case intrinsics_1.NativeSignalTag.AWAIT: {
                    return new AwaitSignal(value.promise);
                }
                case intrinsics_1.NativeSignalTag.JUMP: {
                    return new JumpSignal(value.activation(activation));
                }
                case intrinsics_1.NativeSignalTag.TRANSCRIPT_WRITE: {
                    const loc = this.find_crochet_location(activation);
                    this.universe.trace.publish(new tracing_1.TELog("transcript.write", value.tag_name, loc, value.message));
                    return this.step_native(activation, this.universe.nothing);
                }
                case intrinsics_1.NativeSignalTag.MAKE_CLOSURE: {
                    return this.step_native(activation, new intrinsics_1.CrochetValue(_1.Tag.NATIVE_LAMBDA, this.universe.types.NativeFunctions[value.arity], new _1.CrochetNativeLambda(value.arity, activation.handlers, value.fn)));
                }
                case intrinsics_1.NativeSignalTag.CURRENT_ACTIVATION: {
                    return this.step_native(activation, primitives_1.Values.box(this.universe, activation));
                }
                case intrinsics_1.NativeSignalTag.CURRENT_UNIVERSE: {
                    return this.step_native(activation, primitives_1.Values.box(this.universe, this.universe));
                }
                default:
                    throw utils_1.unreachable(value, `Native Signal`);
            }
        }
    }
    step_crochet(activation) {
        const op = activation.current;
        if (op == null) {
            if (activation.block_stack.length > 0) {
                logger_1.logger.debug(`Finished with block, taking next block`);
                activation.pop_block();
                activation.next();
                return _continue;
            }
            else {
                const value = activation.return_value ?? this.universe.nothing;
                logger_1.logger.debug(`Finished with activation, return value:`, () => primitives_1.Location.simple_value(value));
                return this.do_return(value, activation.parent);
            }
        }
        logger_1.logger.debug(`Stack:`, () => activation.stack.map(primitives_1.Location.simple_value));
        logger_1.logger.debug(`Executing operation:`, () => primitives_1.Location.simple_op(op, activation.instruction));
        const t = IR.OpTag;
        switch (op.tag) {
            case t.DROP: {
                this.pop(activation);
                activation.next();
                return _continue;
            }
            case t.LET: {
                const value = this.pop(activation);
                this.define(op.name, value, op.meta);
                activation.next();
                return _continue;
            }
            case t.PUSH_VARIABLE: {
                const value = this.lookup(op.name, op.meta);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_SELF: {
                const value = this.get_self(op.meta);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_GLOBAL: {
                const value = this.lookup_global(op.name, op.meta);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_LITERAL: {
                const value = primitives_1.Literals.materialise_literal(this.state.universe, op.value);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_RETURN: {
                const value = activation.return_value;
                if (value == null) {
                    throw new errors_1.ErrArbitrary("no-return", `Trying to access the return value, but no return value was defined yet`);
                }
                else {
                    this.push(activation, value);
                }
                activation.next();
                return _continue;
            }
            case t.PUSH_LIST: {
                const values = this.pop_many(activation, op.arity);
                const list = primitives_1.Values.make_list(this.state.universe, values);
                this.push(activation, list);
                activation.next();
                return _continue;
            }
            case t.PUSH_NEW: {
                const values = this.pop_many(activation, op.arity);
                const type0 = primitives_1.Types.materialise_type(this.state.universe, this.module, op.type);
                const type = primitives_1.Capability.free_type(this.module, type0);
                primitives_1.Capability.assert_construct_capability(this.universe, this.module, type);
                const value = primitives_1.Values.instantiate(type, values);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_STATIC_TYPE: {
                const type0 = primitives_1.Types.materialise_type(this.universe, this.module, op.type);
                const type = primitives_1.Capability.free_type(this.module, type0);
                const static_type = primitives_1.Types.get_static_type(this.universe, type);
                const value = primitives_1.Values.make_static_type(this.universe, static_type);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.INTERPOLATE: {
                const result = [];
                for (const part of op.parts) {
                    if (part == null) {
                        result.push(this.pop(activation));
                    }
                    else {
                        result.push(part);
                    }
                }
                const value = primitives_1.Values.make_interpolation(this.universe, result);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_LAZY: {
                const env = primitives_1.Environments.clone(this.env);
                const thunk = primitives_1.Values.make_thunk(this.universe, env, op.body);
                this.push(activation, thunk);
                activation.next();
                return _continue;
            }
            case t.FORCE: {
                const value = this.pop(activation);
                const thunk = primitives_1.Values.get_thunk(value);
                if (thunk.value != null) {
                    this.push(activation, thunk.value);
                    activation.next();
                    return _continue;
                }
                else {
                    return new JumpSignal(new intrinsics_1.CrochetActivation(this.state.activation, thunk, thunk.env, new intrinsics_1.ContinuationTap(this.state, (_previous, _state, value) => {
                        primitives_1.Values.update_thunk(thunk, value);
                        this.push(activation, value);
                        activation.next();
                        return new intrinsics_1.State(this.universe, activation, this.universe.random);
                    }), activation.handlers, thunk.body));
                }
            }
            case t.PUSH_LAMBDA: {
                const value = primitives_1.Values.make_lambda(this.universe, this.env, op.parameters, op.body);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.INVOKE_FOREIGN: {
                const fn = primitives_1.Native.get_native(this.module, op.name);
                const args = this.pop_many(activation, op.arity);
                switch (fn.tag) {
                    case intrinsics_1.NativeTag.NATIVE_SYNCHRONOUS: {
                        primitives_1.Native.assert_native_tag(intrinsics_1.NativeTag.NATIVE_SYNCHRONOUS, fn);
                        const value = fn.payload(...args);
                        if (!(value instanceof intrinsics_1.CrochetValue)) {
                            throw new errors_1.ErrArbitrary(`invalid-value`, `Native function ${fn.name} in ${fn.pkg.name} returned an invalid value ${value}`);
                        }
                        this.push(activation, value);
                        activation.next();
                        return _continue;
                    }
                    case intrinsics_1.NativeTag.NATIVE_MACHINE: {
                        primitives_1.Native.assert_native_tag(intrinsics_1.NativeTag.NATIVE_MACHINE, fn);
                        const machine = fn.payload(...args);
                        const new_activation = new intrinsics_1.NativeActivation(activation, fn, this.env, machine, activation.handlers, intrinsics_1._return);
                        return new JumpSignal(new_activation);
                    }
                    default:
                        throw utils_1.unreachable(fn.tag, `Native function`);
                }
            }
            case t.INVOKE: {
                const command = primitives_1.Commands.get_command(this.universe, op.name);
                const args = this.pop_many(activation, op.arity);
                const branch = primitives_1.Commands.select_branch(command, args);
                const new_activation = primitives_1.Commands.prepare_activation(activation, branch, args);
                return new JumpSignal(new_activation);
            }
            case t.APPLY: {
                const lambda = this.pop(activation);
                const args = this.pop_many(activation, op.arity);
                const new_activation = primitives_1.Lambdas.prepare_activation(this.universe, activation, this.env, lambda, args);
                return new JumpSignal(new_activation);
            }
            case t.RETURN: {
                // FIXME: we should generate RETURNs properly instead...
                let value;
                if (activation.stack.length > 0) {
                    value = this.pop(activation);
                }
                else {
                    value = this.universe.nothing;
                }
                activation.set_return_value(value);
                activation.next();
                return _continue;
            }
            case t.PUSH_PARTIAL: {
                const value = primitives_1.Values.make_partial(this.universe, this.module, op.name, op.arity);
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.ASSERT: {
                const value = this.pop(activation);
                let diagnostics = "";
                if (op.expression != null) {
                    const [name, params] = op.expression;
                    const args = params.map((x) => this.lookup(x, null));
                    let i = 1;
                    const name1 = name.replace(/_/g, () => `#${i++}`);
                    const args1 = args
                        .map((x, i) => `  #${i + 1}) ${primitives_1.Location.simple_value(x)}\n`)
                        .join("");
                    diagnostics = `\n\nIn the expression ${name1}:\n${args1}\n`;
                }
                if (!primitives_1.Values.get_boolean(value)) {
                    throw new errors_1.ErrArbitrary("assertion-violated", `${ir_1.AssertType[op.kind]}: ${op.assert_tag}: ${op.message}${diagnostics}`);
                }
                activation.next();
                return _continue;
            }
            case t.BRANCH: {
                const value = this.pop(activation);
                if (primitives_1.Values.get_boolean(value)) {
                    activation.push_block(op.consequent);
                    return _continue;
                }
                else {
                    activation.push_block(op.alternate);
                    return _continue;
                }
            }
            case t.TYPE_TEST: {
                const value = this.pop(activation);
                const type = primitives_1.Types.materialise_type(this.universe, this.module, op.type);
                this.push(activation, primitives_1.Values.make_boolean(this.universe, primitives_1.Values.has_type(type, value)));
                activation.next();
                return _continue;
            }
            case t.INTRINSIC_EQUAL: {
                const right = this.pop(activation);
                const left = this.pop(activation);
                const value = primitives_1.Values.make_boolean(this.universe, primitives_1.Values.equals(left, right));
                this.push(activation, value);
                activation.next();
                return _continue;
            }
            case t.REGISTER_INSTANCE: {
                const value = this.pop(activation);
                primitives_1.Values.register_instance(this.universe, value);
                activation.next();
                return _continue;
            }
            case t.PUSH_RECORD: {
                const values = this.pop_many(activation, op.keys.length);
                const record = primitives_1.Values.make_record(this.universe, op.keys, values);
                this.push(activation, record);
                activation.next();
                return _continue;
            }
            case t.RECORD_AT_PUT: {
                const [record0, key0, value] = this.pop_many(activation, 3);
                const key = primitives_1.Values.text_to_string(key0);
                const record = primitives_1.Values.record_at_put(this.universe, record0, key, value);
                this.push(activation, record);
                activation.next();
                return _continue;
            }
            case t.PROJECT: {
                const [key0, value0] = this.pop_many(activation, 2);
                const key = primitives_1.Values.text_to_string(key0);
                const result = primitives_1.Values.project(value0, key, (value) => primitives_1.Capability.assert_projection_capability(this.universe, this.module, value, key));
                this.push(activation, result);
                activation.next();
                return _continue;
            }
            case t.PROJECT_STATIC: {
                const value = this.pop(activation);
                const result = primitives_1.Values.project(value, op.key, (value) => primitives_1.Capability.assert_projection_capability(this.universe, this.module, value, op.key));
                this.push(activation, result);
                activation.next();
                return _continue;
            }
            case t.FACT: {
                const values = this.pop_many(activation, op.arity);
                const relation = logic_1.Relation.lookup(this.module, this.module.relations, op.relation);
                logic_1.Relation.insert(relation, values);
                this.universe.trace.publish_fact(activation.location, relation, values);
                activation.next();
                return _continue;
            }
            case t.FORGET: {
                const values = this.pop_many(activation, op.arity);
                const relation = logic_1.Relation.lookup(this.module, this.module.relations, op.relation);
                logic_1.Relation.remove(relation, values);
                this.universe.trace.publish_forget(activation.location, relation, values);
                activation.next();
                return _continue;
            }
            case t.SEARCH: {
                const machine = logic_1.search(this.state, this.env, this.module, this.state.random, this.module.relations, op.predicate);
                const new_activation = new intrinsics_1.NativeActivation(activation, null, this.env, logic_1.run_search(this.universe, this.env, machine), activation.handlers, intrinsics_1._return);
                return new JumpSignal(new_activation);
            }
            case t.MATCH_SEARCH: {
                const bindings0 = this.pop(activation);
                const bindings = primitives_1.Values.get_array(bindings0).map((x) => primitives_1.Values.get_map(x));
                if (bindings.length === 0) {
                    activation.push_block(op.alternate);
                    return _continue;
                }
                else {
                    const new_activation = new intrinsics_1.NativeActivation(activation, null, this.env, logic_1.run_match_case(this.universe, this.env, bindings, op.block), activation.handlers, intrinsics_1._return);
                    return new JumpSignal(new_activation);
                }
            }
            case t.SIMULATE: {
                const actors0 = this.pop(activation);
                const actors = primitives_1.Values.get_array(actors0);
                const context = simulation_1.Contexts.lookup_context(this.module, op.context);
                const signals = new namespaces_1.Namespace(null, null);
                for (const signal of op.signals) {
                    signals.define(signal.name, new intrinsics_1.SimulationSignal(signal.meta, signal.name, signal.parameters, signal.body, this.module));
                }
                const simulation_state = new intrinsics_1.SimulationState(this.state, this.module, this.env, this.state.random, actors, context, op.goal, signals);
                const new_activation = new intrinsics_1.NativeActivation(activation, null, this.env, simulation_2.run_simulation(simulation_state), activation.handlers, intrinsics_1._return);
                return new JumpSignal(new_activation);
            }
            case t.PERFORM: {
                const args = this.pop_many(activation, op.arity);
                const type0 = primitives_1.Effects.materialise_effect(this.module, op.effect, op.variant);
                const type = primitives_1.Capability.free_effect(this.module, type0);
                const value = primitives_1.Values.instantiate(type, args);
                const { handler, stack } = primitives_1.Effects.find_handler(activation.handlers, value);
                const new_activation = primitives_1.Effects.prepare_handler_activation(activation, stack, handler, value);
                return new JumpSignal(new_activation);
            }
            case t.CONTINUE_WITH: {
                const k = this.env.raw_continuation;
                if (k == null) {
                    throw new errors_1.ErrArbitrary("no-continuation", `'continue with' can only be used from inside handlers.`);
                }
                const value = this.pop(activation);
                return new JumpSignal(primitives_1.Effects.apply_continuation(k, value));
            }
            case t.HANDLE: {
                return new JumpSignal(primitives_1.Effects.make_handle(activation, this.module, this.env, op.body, op.handlers));
            }
            case t.DSL: {
                const type = primitives_1.Types.materialise_type(this.universe, this.module, op.type);
                const stype = primitives_1.Types.get_static_type(this.universe, type);
                const type_arg = primitives_1.Values.make_static_type(this.universe, stype);
                const nodes = op.ast.map((x) => primitives_1.DSL.reify_dsl_node(this.universe, this.module, this.env, x));
                const arg = primitives_1.Values.make_list(this.universe, nodes);
                const command = primitives_1.Commands.get_command(this.universe, "_ evaluate: _");
                const branch = primitives_1.Commands.select_branch(command, [type_arg, arg]);
                const new_activation = primitives_1.Commands.prepare_activation(activation, branch, [
                    type_arg,
                    arg,
                ]);
                return new JumpSignal(new_activation);
            }
            case t.TRAIT_TEST: {
                const trait = primitives_1.Types.materialise_trait(this.universe, this.module, op.trait);
                const value = this.pop(activation);
                const result = primitives_1.Values.make_boolean(this.universe, primitives_1.Values.has_trait(trait, value));
                this.push(activation, result);
                return _continue;
            }
            default:
                throw utils_1.unreachable(op, `Operation`);
        }
    }
    get universe() {
        return this.state.universe;
    }
    get module() {
        const result = this.env.raw_module;
        if (result == null) {
            throw new errors_1.ErrArbitrary("no-module", `The execution requires a module, but none was provided`);
        }
        return result;
    }
    get env() {
        return this.state.activation.env;
    }
    get_self(meta) {
        const value = this.env.raw_receiver;
        if (value == null) {
            throw new errors_1.ErrArbitrary("no-self", `The current block of code does not have a 'self' argument`);
        }
        return value;
    }
    lookup(name, meta) {
        const value = this.env.try_lookup(name);
        if (value == null) {
            throw new errors_1.ErrArbitrary("undefined-variable", `The variable ${name} is not defined`);
        }
        else {
            return value;
        }
    }
    lookup_global(name, meta) {
        const value = primitives_1.Modules.get_global(this.module, name);
        return primitives_1.Capability.free_definition(this.module, name, value);
    }
    define(name, value, meta) {
        if (!this.env.define(name, value)) {
            throw new errors_1.ErrArbitrary("duplicated-variable", `The variable ${name} is already defined`);
        }
    }
    pop(activation) {
        if (activation.stack.length === 0) {
            throw new errors_1.ErrArbitrary("vm:empty-stack", `Trying to get a value from an empty stack`);
        }
        return activation.stack.pop();
    }
    pop_many(activation, size) {
        if (activation.stack.length < size) {
            throw new errors_1.ErrArbitrary("vm:stack-too-small", `Trying to get ${size} values from a stack with only ${activation.stack.length} items`);
        }
        const result = new Array(size);
        const len = activation.stack.length;
        for (let i = size; i > 0; --i) {
            result[size - i] = activation.stack[len - i];
        }
        activation.stack.length = len - size;
        return result;
    }
    push(activation, value) {
        activation.stack.push(value);
    }
}
exports.Thread = Thread;

},{".":23,"../ir":9,"../utils/logger":17,"../utils/utils":18,"./errors":21,"./intrinsics":24,"./logic":25,"./namespaces":30,"./primitives":36,"./simulation":51,"./simulation/simulation":52,"./tracing":54}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./errors"), exports);
__exportStar(require("./intrinsics"), exports);
__exportStar(require("./tracing"), exports);
__exportStar(require("./primitives"), exports);
__exportStar(require("./boot"), exports);
__exportStar(require("./evaluation"), exports);
__exportStar(require("./run"), exports);

},{"./boot":20,"./errors":21,"./evaluation":22,"./intrinsics":24,"./primitives":36,"./run":49,"./tracing":54}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = exports.HandlerStack = exports.State = exports.Environment = exports.SimulationState = exports.SimulationSignal = exports.CrochetContext = exports.GlobalContext = exports.ContextTag = exports.When = exports.Action = exports.tree_end = exports.TreeEnd = exports.TreeMany = exports.TreeOne = exports.TreeBase = exports.type_end = exports.TTEnd = exports.TTMany = exports.TTOne = exports.TreeTag = exports.Pair = exports.ProceduralRelation = exports.ConcreteRelation = exports.CrochetRelation = exports.RelationTag = exports.CrochetModule = exports.CrochetPackage = exports.CrochetWorld = exports.CrochetPrelude = exports.CrochetTest = exports.Metadata = exports.NativeFunction = exports.NativeTag = exports.CrochetCommandBranch = exports.CrochetCommand = exports.equals = exports.CrochetCapability = exports.CrochetTypeConstraint = exports.CrochetType = exports.CrochetTrait = exports.CrochetProtectedValue = exports.CrochetThunk = exports.CrochetCapturedContext = exports.CrochetCell = exports.CrochetPartial = exports.CrochetNativeLambda = exports.CrochetLambda = exports.CrochetValue = exports.Tag = void 0;
exports.CMap = exports.Universe = exports.NativeActivation = exports.NSTranscriptWrite = exports.NSJump = exports.NSEvaluate = exports.NSAwait = exports.NSCurrentUniverse = exports.NSCurrentActivation = exports.NSMakeClosure = exports.NSApply = exports.NSInvoke = exports.NSBase = exports.NativeSignalTag = exports.CrochetActivation = exports.ActivationTag = exports._return = exports._done = exports.ContinuationTap = exports.ContinuationDone = exports.ContinuationReturn = exports.ContinuationTag = void 0;
const utils_1 = require("../utils/utils");
const namespaces_1 = require("./namespaces");
//#region Base values
var Tag;
(function (Tag) {
    Tag[Tag["NOTHING"] = 0] = "NOTHING";
    Tag[Tag["INTEGER"] = 1] = "INTEGER";
    Tag[Tag["FLOAT_64"] = 2] = "FLOAT_64";
    Tag[Tag["TEXT"] = 3] = "TEXT";
    Tag[Tag["TRUE"] = 4] = "TRUE";
    Tag[Tag["FALSE"] = 5] = "FALSE";
    Tag[Tag["INTERPOLATION"] = 6] = "INTERPOLATION";
    Tag[Tag["LIST"] = 7] = "LIST";
    Tag[Tag["RECORD"] = 8] = "RECORD";
    Tag[Tag["INSTANCE"] = 9] = "INSTANCE";
    Tag[Tag["LAMBDA"] = 10] = "LAMBDA";
    Tag[Tag["NATIVE_LAMBDA"] = 11] = "NATIVE_LAMBDA";
    Tag[Tag["PARTIAL"] = 12] = "PARTIAL";
    Tag[Tag["THUNK"] = 13] = "THUNK";
    Tag[Tag["CELL"] = 14] = "CELL";
    Tag[Tag["TYPE"] = 15] = "TYPE";
    Tag[Tag["ACTION"] = 16] = "ACTION";
    Tag[Tag["ACTION_CHOICE"] = 17] = "ACTION_CHOICE";
    Tag[Tag["UNKNOWN"] = 18] = "UNKNOWN";
    Tag[Tag["PROTECTED"] = 19] = "PROTECTED";
})(Tag = exports.Tag || (exports.Tag = {}));
class CrochetValue {
    constructor(tag, type, payload) {
        this.tag = tag;
        this.type = type;
        this.payload = payload;
    }
    equals(that) {
        return equals(this, that);
    }
    hashCode() {
        return 0; // FIXME: implement proper hash codes here
    }
}
exports.CrochetValue = CrochetValue;
class CrochetLambda {
    constructor(env, parameters, body) {
        this.env = env;
        this.parameters = parameters;
        this.body = body;
    }
}
exports.CrochetLambda = CrochetLambda;
class CrochetNativeLambda {
    constructor(arity, handlers, fn) {
        this.arity = arity;
        this.handlers = handlers;
        this.fn = fn;
    }
}
exports.CrochetNativeLambda = CrochetNativeLambda;
class CrochetPartial {
    constructor(module, name, arity) {
        this.module = module;
        this.name = name;
        this.arity = arity;
    }
}
exports.CrochetPartial = CrochetPartial;
class CrochetCell {
    constructor(value) {
        this.value = value;
    }
}
exports.CrochetCell = CrochetCell;
class CrochetCapturedContext {
    constructor(state) {
        this.state = state;
    }
}
exports.CrochetCapturedContext = CrochetCapturedContext;
class CrochetThunk {
    constructor(env, body) {
        this.env = env;
        this.body = body;
        this.value = null;
    }
}
exports.CrochetThunk = CrochetThunk;
class CrochetProtectedValue {
    constructor(value) {
        this.value = value;
        this.protected_by = new Set();
    }
}
exports.CrochetProtectedValue = CrochetProtectedValue;
class CrochetTrait {
    constructor(module, name, documentation, meta) {
        this.module = module;
        this.name = name;
        this.documentation = documentation;
        this.meta = meta;
        this.implemented_by = new Set();
        this.protected_by = new Set();
    }
}
exports.CrochetTrait = CrochetTrait;
class CrochetType {
    constructor(module, name, documentation, parent, fields, types, is_static, meta) {
        this.module = module;
        this.name = name;
        this.documentation = documentation;
        this.parent = parent;
        this.fields = fields;
        this.types = types;
        this.is_static = is_static;
        this.meta = meta;
        this.sealed = false;
        this.sub_types = [];
        this.traits = new Set();
        this.protected_by = new Set();
        this.layout = new Map(this.fields.map((k, i) => [k, i]));
    }
}
exports.CrochetType = CrochetType;
class CrochetTypeConstraint {
    constructor(type, traits) {
        this.type = type;
        this.traits = traits;
    }
}
exports.CrochetTypeConstraint = CrochetTypeConstraint;
class CrochetCapability {
    constructor(module, name, documentation, meta) {
        this.module = module;
        this.name = name;
        this.documentation = documentation;
        this.meta = meta;
        this.protecting = new Set();
    }
    get full_name() {
        const pkg = this.module?.pkg;
        if (!pkg) {
            return this.name;
        }
        else {
            return `${pkg.name}/${this.name}`;
        }
    }
}
exports.CrochetCapability = CrochetCapability;
//#endregion
//#region Core operations
function equals(left, right) {
    if (left.tag !== right.tag) {
        return false;
    }
    switch (left.tag) {
        case Tag.NOTHING:
        case Tag.TRUE:
        case Tag.FALSE:
            return left.tag === right.tag;
        case Tag.INTEGER: {
            return left.payload === right.payload;
        }
        case Tag.FLOAT_64: {
            return left.payload === right.payload;
        }
        case Tag.PARTIAL: {
            const l = left;
            const r = right;
            return (l.payload.module === r.payload.module &&
                l.payload.name === r.payload.name);
        }
        case Tag.TEXT: {
            return left.payload === right.payload;
        }
        case Tag.INTERPOLATION: {
            const l = left;
            const r = right;
            if (l.payload.length !== r.payload.length) {
                return false;
            }
            for (const [a, b] of utils_1.zip(l.payload, r.payload)) {
                if (typeof a === "string" && typeof b === "string") {
                    if (a !== b)
                        return false;
                }
                else if (a instanceof CrochetValue && b instanceof CrochetValue) {
                    if (!equals(a, b))
                        return false;
                }
                else {
                    return false;
                }
            }
            return true;
        }
        case Tag.LIST: {
            const l = left;
            const r = right;
            if (l.payload.length !== r.payload.length) {
                return false;
            }
            for (const [a, b] of utils_1.zip(l.payload, r.payload)) {
                if (!equals(a, b))
                    return false;
            }
            return true;
        }
        case Tag.RECORD: {
            const l = left;
            const r = right;
            if (l.payload.size !== r.payload.size) {
                return false;
            }
            for (const [k, v] of l.payload.entries()) {
                const rv = r.payload.get(k);
                if (rv == null || !equals(v, rv)) {
                    return false;
                }
            }
            return true;
        }
        default:
            return left === right;
    }
}
exports.equals = equals;
//#endregion
//#region Commands
class CrochetCommand {
    constructor(name, arity) {
        this.name = name;
        this.arity = arity;
        this.branches = [];
        this.versions = [];
    }
}
exports.CrochetCommand = CrochetCommand;
class CrochetCommandBranch {
    constructor(module, env, name, documentation, parameters, types, body, meta) {
        this.module = module;
        this.env = env;
        this.name = name;
        this.documentation = documentation;
        this.parameters = parameters;
        this.types = types;
        this.body = body;
        this.meta = meta;
    }
    get arity() {
        return this.types.length;
    }
}
exports.CrochetCommandBranch = CrochetCommandBranch;
var NativeTag;
(function (NativeTag) {
    NativeTag[NativeTag["NATIVE_SYNCHRONOUS"] = 0] = "NATIVE_SYNCHRONOUS";
    NativeTag[NativeTag["NATIVE_MACHINE"] = 1] = "NATIVE_MACHINE";
})(NativeTag = exports.NativeTag || (exports.NativeTag = {}));
class NativeFunction {
    constructor(tag, name, pkg, payload) {
        this.tag = tag;
        this.name = name;
        this.pkg = pkg;
        this.payload = payload;
    }
}
exports.NativeFunction = NativeFunction;
//#endregion
//#region Metadata
class Metadata {
    constructor(source, table) {
        this.source = source;
        this.table = table;
    }
}
exports.Metadata = Metadata;
//#endregion
//#region World
class CrochetTest {
    constructor(module, env, title, body) {
        this.module = module;
        this.env = env;
        this.title = title;
        this.body = body;
    }
}
exports.CrochetTest = CrochetTest;
class CrochetPrelude {
    constructor(env, body) {
        this.env = env;
        this.body = body;
    }
}
exports.CrochetPrelude = CrochetPrelude;
class CrochetWorld {
    constructor() {
        this.commands = new namespaces_1.Namespace(null, null);
        this.types = new namespaces_1.Namespace(null, null);
        this.traits = new namespaces_1.Namespace(null, null);
        this.definitions = new namespaces_1.Namespace(null, null);
        this.relations = new namespaces_1.Namespace(null, null);
        this.native_types = new namespaces_1.Namespace(null, null);
        this.native_functions = new namespaces_1.Namespace(null, null);
        this.actions = new namespaces_1.Namespace(null, null);
        this.contexts = new namespaces_1.Namespace(null, null);
        this.capabilities = new namespaces_1.Namespace(null, null);
        this.global_context = new GlobalContext();
        this.prelude = [];
        this.tests = [];
        this.packages = new Map();
    }
}
exports.CrochetWorld = CrochetWorld;
class CrochetPackage {
    constructor(world, name, filename) {
        this.world = world;
        this.name = name;
        this.filename = filename;
        this.dependencies = new Set();
        this.granted_capabilities = new Set();
        this.types = new namespaces_1.PassthroughNamespace(world.types, name);
        this.traits = new namespaces_1.PassthroughNamespace(world.traits, name);
        this.definitions = new namespaces_1.PassthroughNamespace(world.definitions, name);
        this.native_functions = new namespaces_1.Namespace(world.native_functions, name);
        this.relations = new namespaces_1.PassthroughNamespace(world.relations, name);
        this.actions = new namespaces_1.PassthroughNamespace(world.actions, name);
        this.contexts = new namespaces_1.PassthroughNamespace(world.contexts, name);
        this.capabilities = new namespaces_1.PassthroughNamespace(world.capabilities, name);
    }
}
exports.CrochetPackage = CrochetPackage;
class CrochetModule {
    constructor(pkg, filename, metadata) {
        this.pkg = pkg;
        this.filename = filename;
        this.metadata = metadata;
        this.open_prefixes = new Set();
        this.open_prefixes.add("crochet.core");
        this.types = new namespaces_1.Namespace(pkg.types, pkg.name, this.open_prefixes);
        this.definitions = new namespaces_1.Namespace(pkg.definitions, pkg.name, this.open_prefixes);
        this.relations = new namespaces_1.Namespace(pkg.relations, pkg.name, this.open_prefixes);
        this.actions = new namespaces_1.Namespace(pkg.actions, pkg.name, this.open_prefixes);
        this.contexts = new namespaces_1.Namespace(pkg.contexts, pkg.name, this.open_prefixes);
        this.traits = new namespaces_1.Namespace(pkg.traits, pkg.name, this.open_prefixes);
    }
}
exports.CrochetModule = CrochetModule;
//#endregion
//#region Relations
var RelationTag;
(function (RelationTag) {
    RelationTag[RelationTag["CONCRETE"] = 0] = "CONCRETE";
    RelationTag[RelationTag["PROCEDURAL"] = 1] = "PROCEDURAL";
})(RelationTag = exports.RelationTag || (exports.RelationTag = {}));
class CrochetRelation {
    constructor(tag, name, documentation, payload) {
        this.tag = tag;
        this.name = name;
        this.documentation = documentation;
        this.payload = payload;
    }
}
exports.CrochetRelation = CrochetRelation;
class ConcreteRelation {
    constructor(module, meta, type, tree) {
        this.module = module;
        this.meta = meta;
        this.type = type;
        this.tree = tree;
    }
}
exports.ConcreteRelation = ConcreteRelation;
class ProceduralRelation {
    constructor(search, sample) {
        this.search = search;
        this.sample = sample;
    }
}
exports.ProceduralRelation = ProceduralRelation;
class Pair {
    constructor(value, tree) {
        this.value = value;
        this.tree = tree;
    }
}
exports.Pair = Pair;
var TreeTag;
(function (TreeTag) {
    TreeTag[TreeTag["ONE"] = 0] = "ONE";
    TreeTag[TreeTag["MANY"] = 1] = "MANY";
    TreeTag[TreeTag["END"] = 2] = "END";
})(TreeTag = exports.TreeTag || (exports.TreeTag = {}));
class TTOne {
    constructor(next) {
        this.next = next;
        this.tag = TreeTag.ONE;
    }
}
exports.TTOne = TTOne;
class TTMany {
    constructor(next) {
        this.next = next;
        this.tag = TreeTag.MANY;
    }
}
exports.TTMany = TTMany;
class TTEnd {
    constructor() {
        this.tag = TreeTag.END;
    }
}
exports.TTEnd = TTEnd;
exports.type_end = new TTEnd();
class TreeBase {
}
exports.TreeBase = TreeBase;
class TreeOne extends TreeBase {
    constructor(type) {
        super();
        this.type = type;
        this.tag = TreeTag.ONE;
        this.value = null;
    }
}
exports.TreeOne = TreeOne;
class TreeMany extends TreeBase {
    constructor(type) {
        super();
        this.type = type;
        this.tag = TreeTag.MANY;
        this.table = new CMap();
    }
}
exports.TreeMany = TreeMany;
class TreeEnd extends TreeBase {
    constructor() {
        super();
        this.tag = TreeTag.END;
    }
}
exports.TreeEnd = TreeEnd;
exports.tree_end = new TreeEnd();
//#endregion
//#region Simulation
class Action {
    constructor(type, meta, module, name, documentation, actor_type, self_parameter, predicate, rank_function, body) {
        this.type = type;
        this.meta = meta;
        this.module = module;
        this.name = name;
        this.documentation = documentation;
        this.actor_type = actor_type;
        this.self_parameter = self_parameter;
        this.predicate = predicate;
        this.rank_function = rank_function;
        this.body = body;
        this.fired = new Set();
    }
}
exports.Action = Action;
class When {
    constructor(meta, module, documentation, predicate, body) {
        this.meta = meta;
        this.module = module;
        this.documentation = documentation;
        this.predicate = predicate;
        this.body = body;
    }
}
exports.When = When;
var ContextTag;
(function (ContextTag) {
    ContextTag[ContextTag["LOCAL"] = 0] = "LOCAL";
    ContextTag[ContextTag["GLOBAL"] = 1] = "GLOBAL";
})(ContextTag = exports.ContextTag || (exports.ContextTag = {}));
class GlobalContext {
    constructor() {
        this.tag = ContextTag.GLOBAL;
        this.actions = [];
        this.events = [];
    }
}
exports.GlobalContext = GlobalContext;
class CrochetContext {
    constructor(meta, module, name, documentation) {
        this.meta = meta;
        this.module = module;
        this.name = name;
        this.documentation = documentation;
        this.tag = ContextTag.LOCAL;
        this.actions = [];
        this.events = [];
    }
}
exports.CrochetContext = CrochetContext;
class SimulationSignal {
    constructor(meta, name, parameters, body, module) {
        this.meta = meta;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.module = module;
    }
}
exports.SimulationSignal = SimulationSignal;
class SimulationState {
    constructor(state, module, env, random, actors, context, goal, signals) {
        this.state = state;
        this.module = module;
        this.env = env;
        this.random = random;
        this.actors = actors;
        this.context = context;
        this.goal = goal;
        this.signals = signals;
        this.rounds = 0n;
        this.acted = new Set();
        this.turn = null;
    }
}
exports.SimulationState = SimulationState;
//#endregion
//#region Evaluation
class Environment {
    constructor(parent, raw_receiver, raw_module, raw_continuation) {
        this.parent = parent;
        this.raw_receiver = raw_receiver;
        this.raw_module = raw_module;
        this.raw_continuation = raw_continuation;
        this.bindings = new Map();
    }
    define(name, value) {
        if (this.bindings.has(name)) {
            return false;
        }
        this.bindings.set(name, value);
        return true;
    }
    has(name) {
        return this.bindings.has(name);
    }
    try_lookup(name) {
        const value = this.bindings.get(name);
        if (value != null) {
            return value;
        }
        else if (this.parent != null) {
            return this.parent.try_lookup(name);
        }
        else {
            return null;
        }
    }
}
exports.Environment = Environment;
class State {
    constructor(universe, activation, random) {
        this.universe = universe;
        this.activation = activation;
        this.random = random;
    }
}
exports.State = State;
class HandlerStack {
    constructor(parent, handlers) {
        this.parent = parent;
        this.handlers = handlers;
        this.activation = null;
    }
}
exports.HandlerStack = HandlerStack;
class Handler {
    constructor(guard, parameters, env, body) {
        this.guard = guard;
        this.parameters = parameters;
        this.env = env;
        this.body = body;
    }
}
exports.Handler = Handler;
var ContinuationTag;
(function (ContinuationTag) {
    ContinuationTag[ContinuationTag["RETURN"] = 0] = "RETURN";
    ContinuationTag[ContinuationTag["DONE"] = 1] = "DONE";
    ContinuationTag[ContinuationTag["TAP"] = 2] = "TAP";
})(ContinuationTag = exports.ContinuationTag || (exports.ContinuationTag = {}));
class ContinuationReturn {
    constructor() {
        this.tag = ContinuationTag.RETURN;
    }
}
exports.ContinuationReturn = ContinuationReturn;
class ContinuationDone {
    constructor() {
        this.tag = ContinuationTag.DONE;
    }
}
exports.ContinuationDone = ContinuationDone;
class ContinuationTap {
    constructor(saved_state, continuation) {
        this.saved_state = saved_state;
        this.continuation = continuation;
        this.tag = ContinuationTag.TAP;
    }
}
exports.ContinuationTap = ContinuationTap;
exports._done = new ContinuationDone();
exports._return = new ContinuationReturn();
var ActivationTag;
(function (ActivationTag) {
    ActivationTag[ActivationTag["CROCHET_ACTIVATION"] = 0] = "CROCHET_ACTIVATION";
    ActivationTag[ActivationTag["NATIVE_ACTIVATION"] = 1] = "NATIVE_ACTIVATION";
})(ActivationTag = exports.ActivationTag || (exports.ActivationTag = {}));
class CrochetActivation {
    constructor(parent, location, env, continuation, handlers, block) {
        this.parent = parent;
        this.location = location;
        this.env = env;
        this.continuation = continuation;
        this.handlers = handlers;
        this.block = block;
        this.tag = ActivationTag.CROCHET_ACTIVATION;
        this.stack = [];
        this.block_stack = [];
        this._return = null;
        this.instruction = 0;
    }
    get current() {
        if (this.instruction < 0 || this.instruction > this.block.ops.length) {
            return null;
        }
        return this.block.ops[this.instruction];
    }
    next() {
        this.instruction += 1;
    }
    get return_value() {
        return this._return;
    }
    set_return_value(value) {
        this._return = value;
    }
    push_block(b) {
        this.block_stack.push([this.instruction, this.block]);
        this.block = b;
        this.instruction = 0;
    }
    pop_block() {
        if (this.block_stack.length === 0) {
            throw new Error(`internal: pop_block() on empty stack`);
        }
        const [pc, block] = this.block_stack.pop();
        this.block = block;
        this.instruction = pc;
    }
}
exports.CrochetActivation = CrochetActivation;
var NativeSignalTag;
(function (NativeSignalTag) {
    NativeSignalTag[NativeSignalTag["INVOKE"] = 0] = "INVOKE";
    NativeSignalTag[NativeSignalTag["APPLY"] = 1] = "APPLY";
    NativeSignalTag[NativeSignalTag["AWAIT"] = 2] = "AWAIT";
    NativeSignalTag[NativeSignalTag["EVALUATE"] = 3] = "EVALUATE";
    NativeSignalTag[NativeSignalTag["JUMP"] = 4] = "JUMP";
    NativeSignalTag[NativeSignalTag["TRANSCRIPT_WRITE"] = 5] = "TRANSCRIPT_WRITE";
    NativeSignalTag[NativeSignalTag["MAKE_CLOSURE"] = 6] = "MAKE_CLOSURE";
    NativeSignalTag[NativeSignalTag["CURRENT_ACTIVATION"] = 7] = "CURRENT_ACTIVATION";
    NativeSignalTag[NativeSignalTag["CURRENT_UNIVERSE"] = 8] = "CURRENT_UNIVERSE";
})(NativeSignalTag = exports.NativeSignalTag || (exports.NativeSignalTag = {}));
class NSBase {
}
exports.NSBase = NSBase;
class NSInvoke extends NSBase {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
        this.tag = NativeSignalTag.INVOKE;
    }
}
exports.NSInvoke = NSInvoke;
class NSApply extends NSBase {
    constructor(fn, args) {
        super();
        this.fn = fn;
        this.args = args;
        this.tag = NativeSignalTag.APPLY;
    }
}
exports.NSApply = NSApply;
class NSMakeClosure extends NSBase {
    constructor(arity, fn) {
        super();
        this.arity = arity;
        this.fn = fn;
        this.tag = NativeSignalTag.MAKE_CLOSURE;
    }
}
exports.NSMakeClosure = NSMakeClosure;
class NSCurrentActivation extends NSBase {
    constructor() {
        super(...arguments);
        this.tag = NativeSignalTag.CURRENT_ACTIVATION;
    }
}
exports.NSCurrentActivation = NSCurrentActivation;
class NSCurrentUniverse extends NSBase {
    constructor() {
        super(...arguments);
        this.tag = NativeSignalTag.CURRENT_UNIVERSE;
    }
}
exports.NSCurrentUniverse = NSCurrentUniverse;
class NSAwait extends NSBase {
    constructor(promise) {
        super();
        this.promise = promise;
        this.tag = NativeSignalTag.AWAIT;
    }
}
exports.NSAwait = NSAwait;
class NSEvaluate extends NSBase {
    constructor(env, block) {
        super();
        this.env = env;
        this.block = block;
        this.tag = NativeSignalTag.EVALUATE;
    }
}
exports.NSEvaluate = NSEvaluate;
class NSJump extends NSBase {
    constructor(activation) {
        super();
        this.activation = activation;
        this.tag = NativeSignalTag.JUMP;
    }
}
exports.NSJump = NSJump;
class NSTranscriptWrite extends NSBase {
    constructor(tag_name, message) {
        super();
        this.tag_name = tag_name;
        this.message = message;
        this.tag = NativeSignalTag.TRANSCRIPT_WRITE;
    }
}
exports.NSTranscriptWrite = NSTranscriptWrite;
class NativeActivation {
    constructor(parent, location, env, routine, handlers, continuation) {
        this.parent = parent;
        this.location = location;
        this.env = env;
        this.routine = routine;
        this.handlers = handlers;
        this.continuation = continuation;
        this.tag = ActivationTag.NATIVE_ACTIVATION;
    }
}
exports.NativeActivation = NativeActivation;
class Universe {
    constructor(trace, world, random, types) {
        this.trace = trace;
        this.world = world;
        this.random = random;
        this.types = types;
        this.type_cache = new Map();
        this.static_type_cache = new Map();
        this.registered_instances = new Map();
        this.trusted_base = new Set();
        this.nothing = new CrochetValue(Tag.NOTHING, types.Nothing, null);
        this.true = new CrochetValue(Tag.TRUE, types.True, null);
        this.false = new CrochetValue(Tag.FALSE, types.False, null);
        this.integer_cache = [];
        this.float_cache = [];
        for (let i = 0; i < 256; ++i) {
            this.integer_cache[i] = new CrochetValue(Tag.INTEGER, types.Integer, BigInt(i));
            this.float_cache[i] = new CrochetValue(Tag.FLOAT_64, types.Float, i);
        }
    }
    make_integer(x) {
        if (x >= 0 && x < this.integer_cache.length) {
            return this.integer_cache[Number(x)];
        }
        else {
            return new CrochetValue(Tag.INTEGER, this.types.Integer, x);
        }
    }
    make_float(x) {
        if (Number.isInteger(x) && x >= 0 && x < this.float_cache.length) {
            return this.float_cache[x];
        }
        else {
            return new CrochetValue(Tag.FLOAT_64, this.types.Float, x);
        }
    }
    make_text(x) {
        return new CrochetValue(Tag.TEXT, this.types.Text, x);
    }
}
exports.Universe = Universe;
//#endregion
//#region Intrinsic supporting data structures
class CMapEntry {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
function cmap_is_slow(v) {
    switch (v.tag) {
        case Tag.INTERPOLATION:
        case Tag.LIST:
        case Tag.RECORD:
        case Tag.TEXT:
            return true;
        default:
            return false;
    }
}
function cmap_is_primitive(v) {
    switch (v.tag) {
        case Tag.NOTHING:
        case Tag.INTEGER:
        case Tag.FLOAT_64:
        case Tag.TRUE:
        case Tag.FALSE:
            return true;
        default:
            return false;
    }
}
function cmap_get_primitive(v) {
    switch (v.tag) {
        case Tag.TRUE:
            return true;
        case Tag.FALSE:
            return false;
        case Tag.NOTHING:
            return null;
        case Tag.INTEGER:
        case Tag.FLOAT_64:
            return v.payload;
        default:
            throw new Error(`Unsupported`);
    }
}
class CMap {
    constructor() {
        this._types = Object.create(null);
        this.slow_entries = [];
        this.table = new Map();
    }
    get(key) {
        if (cmap_is_slow(key)) {
            return this.get_slow(key);
        }
        else if (cmap_is_primitive(key)) {
            return this.table.get(cmap_get_primitive(key));
        }
        else {
            return this.table.get(key);
        }
    }
    get_slow(key) {
        for (const entry of this.slow_entries) {
            if (equals(entry.key, key)) {
                return entry.value;
            }
        }
        return undefined;
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    set(key, value) {
        if (cmap_is_slow(key)) {
            this.set_slow(key, value);
        }
        else if (cmap_is_primitive(key)) {
            const prim = cmap_get_primitive(key);
            this.remember_type(prim, key);
            this.table.set(cmap_get_primitive(key), value);
        }
        else {
            this.table.set(key, value);
        }
    }
    set_slow(key, value) {
        for (const entry of this.slow_entries) {
            if (equals(entry.key, key)) {
                entry.value = value;
            }
        }
        this.slow_entries.push(new CMapEntry(key, value));
    }
    delete(key) {
        if (cmap_is_slow(key)) {
            this.delete_slow(key);
        }
        else if (cmap_is_primitive(key)) {
            this.table.delete(cmap_get_primitive(key));
        }
        else {
            this.table.delete(key);
        }
    }
    delete_slow(key) {
        const new_entries = [];
        for (const entry of this.slow_entries) {
            if (!equals(entry.key, key)) {
                new_entries.push(entry);
            }
        }
        this.slow_entries = new_entries;
    }
    *entries() {
        for (const [k, v] of this.table.entries()) {
            yield [this.materialise_key(k), v];
        }
        for (const entry of this.slow_entries) {
            yield [entry.key, entry.value];
        }
    }
    *values() {
        for (const value of this.table.values()) {
            yield value;
        }
        for (const entry of this.slow_entries) {
            yield entry.value;
        }
    }
    *keys() {
        for (const key of this.table.keys()) {
            yield this.materialise_key(key);
        }
        for (const entry of this.slow_entries) {
            yield entry.key;
        }
    }
    remember_type(primitive, value) {
        if (primitive === null) {
            if (this._types.nothing)
                return;
            this._types.nothing = value;
            return;
        }
        switch (typeof primitive) {
            case "bigint":
                if (this._types.integer)
                    break;
                this._types.integer = value.type;
                break;
            case "number":
                if (this._types.float)
                    break;
                this._types.float = value.type;
                break;
            case "boolean":
                if (primitive) {
                    if (this._types.true)
                        break;
                    this._types.true = value;
                    break;
                }
                else {
                    if (this._types.false)
                        break;
                    this._types.false = value;
                    break;
                }
            default:
                throw utils_1.unreachable(primitive, "unreachable");
        }
    }
    materialise_key(key) {
        if (key instanceof CrochetValue) {
            return key;
        }
        else if (key === null) {
            return this._types.nothing;
        }
        else {
            switch (typeof key) {
                case "number":
                    return new CrochetValue(Tag.FLOAT_64, this._types.float, key);
                case "bigint":
                    return new CrochetValue(Tag.INTEGER, this._types.integer, key);
                case "boolean": {
                    if (key) {
                        return this._types.true;
                    }
                    else {
                        return this._types.false;
                    }
                }
                default:
                    throw utils_1.unreachable(key, "unreachable");
            }
        }
    }
    get size() {
        return this.table.size + this.slow_entries.length;
    }
}
exports.CMap = CMap;
//#endregion

},{"../utils/utils":18,"./namespaces":30}],25:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relation = exports.Tree = void 0;
__exportStar(require("./unification"), exports);
__exportStar(require("./predicate"), exports);
const Tree = require("./tree");
exports.Tree = Tree;
const Relation = require("./relations");
exports.Relation = Relation;

},{"./predicate":26,"./relations":27,"./tree":28,"./unification":29}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_match_case = exports.run_search = exports.search = void 0;
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
const Relations = require("./relations");
const primitives_1 = require("../primitives");
function search(state, env, module, random, relations, predicate) {
    const t = IR.PredicateTag;
    function* go(predicate, env) {
        switch (predicate.tag) {
            case t.ALWAYS: {
                return [env];
            }
            case t.AND: {
                const result = [];
                const lenvs = yield* go(predicate.left, env);
                for (const lenv of lenvs) {
                    const renvs = yield* go(predicate.right, lenv);
                    for (const e of renvs) {
                        result.push(e);
                    }
                }
                return result;
            }
            case t.CONSTRAIN: {
                const result = [];
                const envs = yield* go(predicate.predicate, env);
                for (const e of envs) {
                    const value = yield new intrinsics_1.NSEvaluate(primitives_1.Environments.clone(e), predicate.constraint);
                    if (primitives_1.Values.get_boolean(value)) {
                        result.push(e);
                    }
                }
                return result;
            }
            case t.LET: {
                const env1 = primitives_1.Environments.clone(env);
                const value = yield new intrinsics_1.NSEvaluate(primitives_1.Environments.clone(env), predicate.value);
                env1.define(predicate.name, value);
                return [env1];
            }
            case t.NOT: {
                const envs = yield* go(predicate.pred, env);
                if (envs.length === 0) {
                    return [env];
                }
                else {
                    return [];
                }
            }
            case t.OR: {
                const lenvs = yield* go(predicate.left, env);
                if (lenvs.length !== 0) {
                    return lenvs;
                }
                else {
                    return yield* go(predicate.right, env);
                }
            }
            case t.RELATION: {
                const relation = Relations.lookup(module, relations, predicate.relation);
                const envs = Relations.search(state, module, env, relation, predicate.patterns);
                return envs;
            }
            case t.SAMPLE_RELATION: {
                const relation = Relations.lookup(module, relations, predicate.relation);
                const envs = Relations.sample(state, module, random, predicate.size, env, relation, predicate.patterns);
                return envs;
            }
            case t.TYPE: {
                const result = [];
                const type = primitives_1.Types.materialise_type(state.universe, module, predicate.type);
                const instances = primitives_1.Types.registered_instances(state.universe, type);
                for (const x of instances) {
                    const new_env = primitives_1.Environments.clone(env);
                    new_env.define(predicate.name, x);
                    result.push(new_env);
                }
                return result;
            }
            case t.SAMPLE_TYPE: {
                const result = [];
                const type = primitives_1.Types.materialise_type(state.universe, module, predicate.type);
                const instances = [...primitives_1.Types.registered_instances(state.universe, type)];
                const sampled = random.random_choice_many(predicate.size, instances);
                for (const x of sampled) {
                    const new_env = primitives_1.Environments.clone(env);
                    new_env.define(predicate.name, x);
                    result.push(new_env);
                }
                return result;
            }
            default:
                throw utils_1.unreachable(predicate, `Predicate`);
        }
    }
    return go(predicate, env);
}
exports.search = search;
function* run_search(universe, mark, machine) {
    const envs = yield* machine;
    const result = [];
    for (const e of envs) {
        const bound = primitives_1.Environments.bound_values_up_to(mark, e);
        result.push(primitives_1.Values.make_record_from_map(universe, bound));
    }
    return primitives_1.Values.make_list(universe, result);
}
exports.run_search = run_search;
function* run_match_case(universe, base_env, bindings, block) {
    const result = [];
    for (const binds of bindings) {
        const new_env = primitives_1.Environments.clone_with_bindings(base_env, binds);
        const value = yield new intrinsics_1.NSEvaluate(new_env, block);
        result.push(value);
    }
    return primitives_1.Values.make_list(universe, result);
}
exports.run_match_case = run_match_case;

},{"../../ir":9,"../../utils/utils":18,"../intrinsics":24,"../primitives":36,"./relations":27}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.insert = exports.assert_tag = exports.sample = exports.search = exports.lookup = exports.make_functional_layer = exports.define_concrete = void 0;
const utils_1 = require("../../utils/utils");
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
const Tree = require("./tree");
const namespaces_1 = require("../namespaces");
const primitives_1 = require("../primitives");
const unification_1 = require("./unification");
function define_concrete(module, meta, name, documentation, type, tree) {
    const result = module.pkg.relations.define(name, new intrinsics_1.CrochetRelation(intrinsics_1.RelationTag.CONCRETE, name, documentation, new intrinsics_1.ConcreteRelation(module, meta, type, tree)));
    if (!result) {
        throw new errors_1.ErrArbitrary("duplicate-relation", `Could not define relation ${name} in module ${primitives_1.Location.module_location(module)}`);
    }
}
exports.define_concrete = define_concrete;
function make_functional_layer(module, funs) {
    // FIXME: this needs some more thinking
    const prefixes = new Set([...module.open_prefixes, module.pkg.name]);
    const layer = new namespaces_1.Namespace(module.relations, null, prefixes);
    for (const [name, fun] of funs) {
        layer.define(name, new intrinsics_1.CrochetRelation(intrinsics_1.RelationTag.PROCEDURAL, name, "", fun));
    }
    return layer;
}
exports.make_functional_layer = make_functional_layer;
function lookup(module, relations, name) {
    const relation = relations.try_lookup(name);
    if (relation == null) {
        throw new errors_1.ErrArbitrary(`no-relation`, `Relation ${name} is not accessible from ${primitives_1.Location.module_location(module)}`);
    }
    return relation;
}
exports.lookup = lookup;
function search(state, module, env, relation, patterns0) {
    const patterns = patterns0.map((p) => unification_1.compile_pattern(state, module, env, p));
    switch (relation.tag) {
        case intrinsics_1.RelationTag.CONCRETE: {
            assert_tag(intrinsics_1.RelationTag.CONCRETE, relation);
            return Tree.search(state, module, env, relation.payload.tree, patterns);
        }
        case intrinsics_1.RelationTag.PROCEDURAL: {
            assert_tag(intrinsics_1.RelationTag.PROCEDURAL, relation);
            return relation.payload.search(env, patterns);
        }
        default:
            throw utils_1.unreachable(relation.tag, `Relation`);
    }
}
exports.search = search;
function sample(state, module, random, size, env, relation, patterns0) {
    const patterns = patterns0.map((p) => unification_1.compile_pattern(state, module, env, p));
    switch (relation.tag) {
        case intrinsics_1.RelationTag.CONCRETE: {
            assert_tag(intrinsics_1.RelationTag.CONCRETE, relation);
            return Tree.sample(state, module, random, size, env, relation.payload.tree, patterns);
        }
        case intrinsics_1.RelationTag.PROCEDURAL: {
            assert_tag(intrinsics_1.RelationTag.PROCEDURAL, relation);
            if (relation.payload.sample == null) {
                const result = relation.payload.search(env, patterns);
                return random.random_choice_many(size, result);
            }
            else {
                return relation.payload.sample(env, patterns, size);
            }
        }
        default:
            throw utils_1.unreachable(relation.tag, `Relation`);
    }
}
exports.sample = sample;
function assert_tag(tag, relation) {
    if (relation.tag !== tag) {
        throw new errors_1.ErrArbitrary("invalid-relation", `Expected a ${intrinsics_1.RelationTag[tag]} relation`);
    }
}
exports.assert_tag = assert_tag;
function insert(relation, values) {
    assert_tag(intrinsics_1.RelationTag.CONCRETE, relation);
    Tree.insert(relation.payload.tree, values);
}
exports.insert = insert;
function remove(relation, values) {
    assert_tag(intrinsics_1.RelationTag.CONCRETE, relation);
    const result = Tree.remove(relation.payload.tree, values).tree;
    if (result == null) {
        relation.payload.tree = Tree.materialise(relation.payload.type);
    }
    else {
        relation.payload.tree = result;
    }
}
exports.remove = remove;

},{"../../utils/utils":18,"../errors":21,"../intrinsics":24,"../namespaces":30,"../primitives":36,"./tree":28,"./unification":29}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = exports.search = exports.remove = exports.insert = exports.materialise = exports.materialise_type = void 0;
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
const primitives_1 = require("../primitives");
const unification_1 = require("./unification");
function materialise_type(type) {
    return type.reduceRight((prev, type) => {
        switch (type.multiplicity) {
            case IR.RelationMultiplicity.ONE:
                return new intrinsics_1.TTOne(prev);
            case IR.RelationMultiplicity.MANY:
                return new intrinsics_1.TTMany(prev);
            default:
                throw utils_1.unreachable(type.multiplicity, `Tree Type`);
        }
    }, intrinsics_1.tree_end);
}
exports.materialise_type = materialise_type;
function materialise(type) {
    switch (type.tag) {
        case intrinsics_1.TreeTag.ONE: {
            return new intrinsics_1.TreeOne(type.next);
        }
        case intrinsics_1.TreeTag.MANY: {
            return new intrinsics_1.TreeMany(type.next);
        }
        case intrinsics_1.TreeTag.END: {
            return intrinsics_1.tree_end;
        }
        default:
            throw utils_1.unreachable(type, `Tree Type`);
    }
}
exports.materialise = materialise;
function insert(tree, values) {
    let changed = false;
    function go(tree, index) {
        switch (tree.tag) {
            case intrinsics_1.TreeTag.ONE: {
                const head = values[index];
                if (tree.value == null || !primitives_1.Values.equals(head, tree.value.value)) {
                    tree.value = new intrinsics_1.Pair(head, materialise(tree.type));
                    changed = true;
                    go(tree.value.tree, index + 1);
                }
                else {
                    go(tree.value.tree, index + 1);
                }
                return;
            }
            case intrinsics_1.TreeTag.MANY: {
                const head = values[index];
                const subtree = tree.table.get(head);
                if (subtree != null) {
                    go(subtree, index + 1);
                    return;
                }
                else {
                    const subtree = materialise(tree.type);
                    tree.table.set(head, subtree);
                    changed = true;
                    go(subtree, index + 1);
                    return;
                }
            }
            case intrinsics_1.TreeTag.END: {
                return;
            }
            default:
                throw utils_1.unreachable(tree, `Tree`);
        }
    }
    go(tree, 0);
    return changed;
}
exports.insert = insert;
function remove(tree, values) {
    let changed = false;
    function go(tree, index) {
        switch (tree.tag) {
            case intrinsics_1.TreeTag.ONE: {
                const head = values[index];
                if (tree.value == null) {
                    return null;
                }
                if (primitives_1.Values.equals(head, tree.value.value)) {
                    changed = true;
                    tree.value = null;
                    return null;
                }
                else {
                    const result = go(tree.value.tree, index + 1);
                    if (result == null) {
                        changed = true;
                        tree.value = null;
                        return null;
                    }
                    else {
                        tree.value.tree = result;
                        return tree;
                    }
                }
            }
            case intrinsics_1.TreeTag.MANY: {
                const head = values[index];
                for (const [key, subtree] of tree.table.entries()) {
                    if (primitives_1.Values.equals(head, key)) {
                        const result = go(subtree, index + 1);
                        if (result == null) {
                            tree.table.delete(key);
                            changed = true;
                        }
                        else {
                            tree.table.set(key, result);
                        }
                    }
                }
                if (tree.table.size === 0) {
                    return null;
                }
                else {
                    return tree;
                }
            }
            case intrinsics_1.TreeTag.END: {
                changed = true;
                return null;
            }
            default:
                throw utils_1.unreachable(tree, `Tree`);
        }
    }
    return { changed, tree: go(tree, 0) };
}
exports.remove = remove;
function search(state, module, env, tree, patterns) {
    function* go(tree, env, index) {
        switch (tree.tag) {
            case intrinsics_1.TreeTag.ONE: {
                if (tree.value == null) {
                    break;
                }
                const head = patterns[index];
                const new_env = head.unify(env, tree.value.value);
                if (new_env != null) {
                    yield* go(tree.value.tree, new_env, index + 1);
                }
                break;
            }
            case intrinsics_1.TreeTag.MANY: {
                const head = patterns[index];
                if (head instanceof unification_1.ValuePattern) {
                    const subtree = tree.table.get(head.value);
                    if (subtree != null) {
                        yield* go(subtree, env, index + 1);
                    }
                }
                else {
                    for (const [key, subtree] of tree.table.entries()) {
                        const new_env = head.unify(env, key);
                        if (new_env != null) {
                            yield* go(subtree, new_env, index + 1);
                        }
                    }
                }
                break;
            }
            case intrinsics_1.TreeTag.END: {
                yield env;
                break;
            }
            default:
                throw utils_1.unreachable(tree, `Tree`);
        }
    }
    return [...go(tree, env, 0)];
}
exports.search = search;
function sample(state, module, random, size, env, tree, patterns) {
    function* go(tree, env, index) {
        switch (tree.tag) {
            case intrinsics_1.TreeTag.ONE: {
                if (tree.value == null) {
                    break;
                }
                const head = patterns[index];
                const new_env = head.unify(env, tree.value.value);
                if (new_env != null) {
                    yield* go(tree.value.tree, new_env, index + 1);
                }
                break;
            }
            case intrinsics_1.TreeTag.MANY: {
                const head = patterns[index];
                const pairs = [];
                if (head instanceof unification_1.ValuePattern) {
                    const subtree = tree.table.get(head.value);
                    if (subtree != null) {
                        pairs.push({ env: env, tree: subtree });
                    }
                }
                else {
                    for (const [key, subtree] of tree.table.entries()) {
                        const new_env = head.unify(env, key);
                        if (new_env != null) {
                            pairs.push({ env: new_env, tree: subtree });
                        }
                    }
                }
                while (pairs.length > 0) {
                    const choice = random.random_choice_mut(pairs);
                    if (choice == null) {
                        break;
                    }
                    else {
                        yield* go(choice.tree, choice.env, index + 1);
                    }
                }
                break;
            }
            case intrinsics_1.TreeTag.END: {
                yield env;
                break;
            }
            default:
                throw utils_1.unreachable(tree, `Tree`);
        }
    }
    const results = [];
    for (const x of go(tree, env, 0)) {
        if (results.length > size) {
            break;
        }
        results.push(x);
    }
    return results;
}
exports.sample = sample;

},{"../../ir":9,"../../utils/utils":18,"../intrinsics":24,"../primitives":36,"./unification":29}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unify_all = exports.compile_pattern = exports.TypePattern = exports.WildcardPattern = exports.VariablePattern = exports.ValuePattern = exports.Pattern = void 0;
const IR = require("../../ir");
const primitives_1 = require("../primitives");
const errors_1 = require("../errors");
const utils_1 = require("../../utils/utils");
class Pattern {
}
exports.Pattern = Pattern;
class ValuePattern extends Pattern {
    constructor(value) {
        super();
        this.value = value;
    }
    unify(env, value) {
        if (primitives_1.Values.equals(this.value, value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.ValuePattern = ValuePattern;
class VariablePattern extends Pattern {
    constructor(name) {
        super();
        this.name = name;
    }
    unify(env, value) {
        const local = env.try_lookup(this.name);
        if (local == null) {
            const new_env = primitives_1.Environments.clone(env);
            new_env.define(this.name, value);
            return new_env;
        }
        else if (primitives_1.Values.equals(local, value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.VariablePattern = VariablePattern;
class WildcardPattern extends Pattern {
    unify(env, value) {
        return env;
    }
}
exports.WildcardPattern = WildcardPattern;
class TypePattern extends Pattern {
    constructor(type, pattern) {
        super();
        this.type = type;
        this.pattern = pattern;
    }
    unify(env, value) {
        if (primitives_1.Values.has_type(this.type, value)) {
            return this.pattern.unify(env, value);
        }
        else {
            return null;
        }
    }
}
exports.TypePattern = TypePattern;
function compile_pattern(state, module, env, pattern) {
    const t = IR.PatternTag;
    switch (pattern.tag) {
        case t.GLOBAL: {
            const global = module.definitions.try_lookup(pattern.name);
            if (global == null) {
                throw new errors_1.ErrArbitrary("no-definition", `${pattern.name} is not defined`);
            }
            return new ValuePattern(global);
        }
        case t.HAS_TYPE: {
            const type = primitives_1.Types.materialise_type(state.universe, module, pattern.type);
            return new TypePattern(type, compile_pattern(state, module, env, pattern.pattern));
        }
        case t.LITERAL: {
            const lit = primitives_1.Literals.materialise_literal(state.universe, pattern.literal);
            return new ValuePattern(lit);
        }
        case t.SELF: {
            if (env.raw_receiver == null) {
                throw new errors_1.ErrArbitrary("no-receiver", `self with no receiver`);
            }
            return new ValuePattern(env.raw_receiver);
        }
        case t.VARIABLE: {
            const local = env.try_lookup(pattern.name);
            if (local != null) {
                return new ValuePattern(local);
            }
            else {
                return new VariablePattern(pattern.name);
            }
        }
        case t.WILDCARD: {
            return new WildcardPattern();
        }
        case t.STATIC_TYPE: {
            const type = primitives_1.Types.materialise_type(state.universe, module, pattern.type);
            const stype = primitives_1.Types.get_static_type(state.universe, type);
            const value = primitives_1.Values.make_static_type(state.universe, stype);
            return new ValuePattern(value);
        }
        default:
            throw utils_1.unreachable(pattern, "Pattern");
    }
}
exports.compile_pattern = compile_pattern;
function unify_all(env, value, pattern) {
    const result = [];
    for (const x of value) {
        const new_env = pattern.unify(env, x);
        if (new_env != null) {
            result.push(new_env);
        }
    }
    return result;
}
exports.unify_all = unify_all;

},{"../../ir":9,"../../utils/utils":18,"../errors":21,"../primitives":36}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughNamespace = exports.Namespace = void 0;
class Namespace {
    constructor(parent, prefix, allowed_prefixes) {
        this.parent = parent;
        this.prefix = prefix;
        this.bindings = new Map();
        this.allowed_prefixes = allowed_prefixes || new Set();
    }
    prefixed(name) {
        return this.make_namespace(this.prefix, name);
    }
    make_namespace(namespace, name) {
        if (namespace == null) {
            return name;
        }
        else {
            return `${namespace}/${name}`;
        }
    }
    define(name, value) {
        if (this.has_own(name)) {
            return false;
        }
        this.bindings.set(this.prefixed(name), value);
        return true;
    }
    overwrite(name, value) {
        this.bindings.set(this.prefixed(name), value);
    }
    has_own(name) {
        return this.bindings.has(this.prefixed(name));
    }
    has(name) {
        return this.try_lookup(name) != null;
    }
    try_lookup_local(name) {
        return this.bindings.get(this.make_namespace(this.prefix, name)) ?? null;
    }
    try_lookup(name) {
        const value = this.try_lookup_namespaced(this.prefix, name);
        if (value != null) {
            return value;
        }
        else {
            for (const prefix of this.allowed_prefixes) {
                const value = this.try_lookup_namespaced(prefix, name);
                if (value != null) {
                    return value;
                }
            }
            return null;
        }
    }
    try_lookup_namespaced(namespace, name) {
        const value = this.bindings.get(this.make_namespace(namespace, name));
        if (value != null) {
            return value;
        }
        else if (this.parent != null) {
            return this.parent.try_lookup_namespaced(namespace, name);
        }
        else {
            return null;
        }
    }
}
exports.Namespace = Namespace;
class PassthroughNamespace extends Namespace {
    constructor(parent, prefix) {
        super(parent, prefix);
        this.parent = parent;
        this.prefix = prefix;
    }
    define(name, value) {
        return this.parent?.define(this.prefixed(name), value) ?? false;
    }
}
exports.PassthroughNamespace = PassthroughNamespace;

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert_construct_capability = exports.assert_projection_capability = exports.assert_capabilities = exports.free_effect = exports.free_trait = exports.free_type = exports.free_definition = exports.protect_definition = exports.protect_effect = exports.protect_trait = exports.protect_type = exports.get_capability = exports.define_capability = void 0;
const __1 = require("..");
const Location = require("./location");
const Types = require("./types");
const Values = require("./values");
const Modules = require("./modules");
function define_capability(module, capability) {
    const ns = module.pkg.capabilities;
    if (!ns.define(capability.name, capability)) {
        throw new __1.ErrArbitrary("duplicated-capability", `Duplicated capability declaration ${capability.name} in ${Location.module_location(module)}`);
    }
    module.pkg.granted_capabilities.add(capability);
}
exports.define_capability = define_capability;
function get_capability(module, name) {
    const capability = module.pkg.capabilities.try_lookup(name);
    if (capability == null) {
        throw new __1.ErrArbitrary("undefined-capability", `The capability ${name} is not defined in package ${module.pkg.name}`);
    }
    return capability;
}
exports.get_capability = get_capability;
function protect_type(universe, module, name, capability) {
    const type = Types.get_type(module, name);
    type.protected_by.add(capability);
    capability.protecting.add(type);
}
exports.protect_type = protect_type;
function protect_trait(universe, module, name, capability) {
    const trait = Types.get_trait(module, name);
    trait.protected_by.add(capability);
    capability.protecting.add(trait);
}
exports.protect_trait = protect_trait;
function protect_effect(universe, module, name, capability) {
    return protect_type(universe, module, name, capability);
}
exports.protect_effect = protect_effect;
function protect_definition(universe, module, name, capability) {
    const global = Modules.get_specific_global(module, name);
    const protected_value = Values.protect(universe, global, capability);
    Modules.replace_global(module, name, global, protected_value);
    capability.protecting.add(global);
}
exports.protect_definition = protect_definition;
function free_definition(module, name, value) {
    switch (value.tag) {
        case __1.Tag.PROTECTED: {
            Values.assert_tag(__1.Tag.PROTECTED, value);
            assert_capabilities(module, value.payload.protected_by, "Accessing definition", name);
            return value.payload.value;
        }
        default: {
            return value;
        }
    }
}
exports.free_definition = free_definition;
function free_type(module, type) {
    assert_capabilities(module, type.protected_by, "Accessing type", type.name);
    return type;
}
exports.free_type = free_type;
function free_trait(module, trait) {
    assert_capabilities(module, trait.protected_by, "Accessing trait", trait.name);
    return trait;
}
exports.free_trait = free_trait;
function free_effect(module, effect) {
    assert_capabilities(module, effect.protected_by, "Accessing effect", effect.name);
    return effect;
}
exports.free_effect = free_effect;
function assert_capabilities(module, required, operation, name) {
    if (required.size === 0)
        return;
    const granted = module.pkg.granted_capabilities;
    for (const r of required) {
        if (granted.has(r))
            return;
    }
    const caps = [...required].map((x) => x.full_name);
    throw new __1.ErrArbitrary("lacking-capability", `${operation} ${name} cannot be done in ${Location.module_location(module)} because the package does not have any of the following required capabilities: ${caps.join(", ")}`);
}
exports.assert_capabilities = assert_capabilities;
function assert_projection_capability(universe, module, value, name) {
    const type_pkg = value.type.module?.pkg;
    if (!type_pkg) {
        if (!universe.trusted_base.has(module.pkg)) {
            throw new __1.ErrArbitrary("lacking-capability", `Projecting ${name} from ${Location.type_name(value.type)} is not possible, as it's an intrinsic type. Intrinsic types can only be managed by the Crochet runtime for security.`);
        }
        else {
            return;
        }
    }
    if (module.pkg !== type_pkg) {
        throw new __1.ErrArbitrary("lacking-capability", `Projecting ${name} from ${Location.type_name(value.type)} is not possible in ${Location.module_location(module)}. Projecting values is only allowed inside of its declaring package---the package must expose commands if it wants fields to be accessible externally.`);
    }
}
exports.assert_projection_capability = assert_projection_capability;
function assert_construct_capability(universe, module, type) {
    const type_pkg = type.module?.pkg;
    if (!type_pkg) {
        if (!universe.trusted_base.has(module.pkg)) {
            throw new __1.ErrArbitrary("lacking-capability", `Constructing ${Location.type_name(type)} is not possible, as it's an intrinsic type. Intrinsic types can only be constructed by the Crochet runtime for security.`);
        }
        else {
            return;
        }
    }
    if (module.pkg !== type_pkg) {
        throw new __1.ErrArbitrary("lacking-capability", `Constructing ${Location.type_name(type)} is not possible in ${Location.module_location(module)}. Constructing types directly is only allowed inside of its declaring package---the package must expose commands if it wants the type to be constructed externally.`);
    }
}
exports.assert_construct_capability = assert_construct_capability;

},{"..":23,"./location":39,"./modules":41,"./types":46,"./values":47}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_command = exports.get_or_make_command = exports.branch_accepts = exports.compare_branches = exports.select_exact = exports.assert_no_ambiguity = exports.prepare_activation = exports.select_branch = exports.add_branch = void 0;
const utils_1 = require("../../utils/utils");
const Types = require("./types");
const Location = require("./location");
const Environments = require("./environments");
const intrinsics_1 = require("../intrinsics");
const errors_1 = require("../errors");
function add_branch(command, branch) {
    assert_no_ambiguity([branch, ...command.branches], branch.types);
    command.versions.push(command.branches);
    command.branches.push(branch);
    command.branches.sort((b1, b2) => compare_branches(b1, b2));
}
exports.add_branch = add_branch;
// == Invocation
function select_branch(command, values) {
    const types = values.map((x) => x.type);
    for (const branch of command.branches) {
        if (branch_accepts(branch, types)) {
            return branch;
        }
    }
    throw new errors_1.ErrArbitrary("no-branch-matched", [
        "No definitions of command ",
        command.name,
        " matched the signature ",
        Location.command_signature(command.name, types),
        "\n",
        "The following arguments were provided:\n",
        values.map((x) => `  - ${Location.simple_value(x)}`).join("\n"),
        "\n\n",
        "The following branches are defined for the command:\n",
        command.branches
            .map((x) => `  - ${Location.branch_name_location(x)}`)
            .join("\n"),
    ].join(""));
}
exports.select_branch = select_branch;
function prepare_activation(parent_activation, branch, values) {
    const env = Environments.extend(branch.env, values.length === 0 ? null : values[0]);
    for (const [k, v] of utils_1.zip(branch.parameters, values)) {
        env.define(k, v);
    }
    const activation = new intrinsics_1.CrochetActivation(parent_activation, branch, env, intrinsics_1._return, parent_activation.handlers, branch.body);
    return activation;
}
exports.prepare_activation = prepare_activation;
// == Assertions
function assert_no_ambiguity(branches, types) {
    const selected = [...select_exact(branches, types)];
    if (selected.length > 1) {
        const dups = selected.map((x) => `  - ${Location.branch_name_location(x)}`);
        throw new errors_1.ErrArbitrary("ambiguous-dispatch", `Multiple ${selected[0].name} commands are activated by the same types, making them ambiguous:\n${dups.join("\n")}`);
    }
}
exports.assert_no_ambiguity = assert_no_ambiguity;
// == Selection
function* select_exact(branches, types) {
    outer: for (const branch of branches) {
        for (const [bt, t] of utils_1.zip(branch.types, types)) {
            if (bt.type !== t.type)
                continue outer;
            if (bt.traits.length !== t.traits.length)
                continue outer;
            if (bt.traits.some((btt) => !t.traits.includes(btt)))
                continue outer;
        }
        yield branch;
    }
}
exports.select_exact = select_exact;
// == Testing
function compare_branches(b1, b2) {
    for (const [t1, t2] of utils_1.zip(b1.types, b2.types)) {
        const r = Types.compare_constraints(t1, t2);
        if (r !== 0) {
            return r;
        }
    }
    return 0;
}
exports.compare_branches = compare_branches;
function branch_accepts(branch, types) {
    if (branch.types.length !== types.length) {
        return false;
    }
    for (const [constraint, t] of utils_1.zip(branch.types, types)) {
        if (!Types.fulfills_constraint(constraint, t)) {
            return false;
        }
    }
    return true;
}
exports.branch_accepts = branch_accepts;
// == Lookup
function get_or_make_command(universe, name, arity) {
    const command = universe.world.commands.try_lookup(name);
    if (command == null) {
        const command = new intrinsics_1.CrochetCommand(name, arity);
        universe.world.commands.define(name, command);
        return command;
    }
    else {
        return command;
    }
}
exports.get_or_make_command = get_or_make_command;
function get_command(universe, name) {
    const command = universe.world.commands.try_lookup(name);
    if (command == null) {
        throw new errors_1.ErrArbitrary("undefined-command", `The command ${name} is not defined`);
    }
    return command;
}
exports.get_command = get_command;

},{"../../utils/utils":18,"../errors":21,"../intrinsics":24,"./environments":35,"./location":39,"./types":46}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reify_dsl_node = exports.reify_meta = void 0;
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const literals_1 = require("./literals");
const values_1 = require("./values");
function reify_meta(universe, module, node) {
    return values_1.make_record_from_map(universe, new Map([
        ["line", values_1.make_integer(universe, BigInt(node.meta.line))],
        ["column", values_1.make_integer(universe, BigInt(node.meta.column))],
    ]));
}
exports.reify_meta = reify_meta;
function reify_dsl_node(universe, module, env, node) {
    switch (node.tag) {
        case IR.DslNodeTag.NODE: {
            const children = node.children.map((x) => reify_dsl_node(universe, module, env, x));
            const attrs = new Map();
            for (const [k, v] of node.attributes) {
                attrs.set(k, reify_dsl_node(universe, module, env, v));
            }
            return values_1.instantiate(universe.types.Skeleton.Node, [
                values_1.make_static_text(universe, node.name),
                values_1.make_list(universe, children),
                values_1.make_record_from_map(universe, attrs),
                reify_meta(universe, module, node),
            ]);
        }
        case IR.DslNodeTag.LITERAL: {
            return values_1.instantiate(universe.types.Skeleton.Literal, [
                literals_1.materialise_literal(universe, node.value),
                reify_meta(universe, module, node),
            ]);
        }
        case IR.DslNodeTag.VARIABLE: {
            return values_1.instantiate(universe.types.Skeleton.Name, [
                values_1.make_static_text(universe, node.name),
                reify_meta(universe, module, node),
            ]);
        }
        case IR.DslNodeTag.EXPRESSION: {
            return values_1.instantiate(universe.types.Skeleton.Dynamic, [
                values_1.make_lambda(universe, env, [], node.value),
                reify_meta(universe, module, node),
            ]);
        }
        case IR.DslNodeTag.LIST: {
            const children = node.children.map((x) => reify_dsl_node(universe, module, env, x));
            return values_1.instantiate(universe.types.Skeleton.List, [
                values_1.make_list(universe, children),
                reify_meta(universe, module, node),
            ]);
        }
        case IR.DslNodeTag.INTERPOLATION: {
            const parts = node.parts.map((x) => {
                switch (x.tag) {
                    case IR.DslInterpolationTag.STATIC: {
                        return values_1.instantiate(universe.types.Skeleton.Literal, [
                            literals_1.materialise_literal(universe, new IR.LiteralText(x.text)),
                            universe.nothing,
                        ]);
                    }
                    case IR.DslInterpolationTag.DYNAMIC: {
                        return reify_dsl_node(universe, module, env, x.node);
                    }
                    default:
                        throw utils_1.unreachable(x, "DSL Interpolation part");
                }
            });
            return values_1.instantiate(universe.types.Skeleton.Interpolation, [
                values_1.make_list(universe, parts),
                reify_meta(universe, module, node),
            ]);
        }
        default:
            throw utils_1.unreachable(node, "DSL Node");
    }
}
exports.reify_dsl_node = reify_dsl_node;

},{"../../ir":9,"../../utils/utils":18,"./literals":38,"./values":47}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_handle = exports.apply_continuation = exports.prepare_handler_activation = exports.find_handler = exports.try_find_handler = exports.assert_can_perform = exports.materialise_effect = exports.variant_name = exports.effect_name = void 0;
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
const location_1 = require("./location");
const values_1 = require("./values");
const Environments = require("./environments");
const Capability = require("./capability");
function effect_name(x) {
    return `effect ${x}`;
}
exports.effect_name = effect_name;
function variant_name(x, variant) {
    return `effect ${x}.${variant}`;
}
exports.variant_name = variant_name;
function materialise_effect(module, name, variant) {
    const type = module.types.try_lookup(variant_name(name, variant));
    if (type == null) {
        throw new errors_1.ErrArbitrary(`undefined-effect`, `The effect ${name}.${variant} is not accessible from ${location_1.module_location(module)}`);
    }
    return type;
}
exports.materialise_effect = materialise_effect;
function assert_can_perform(module, type) {
    if (type.module?.pkg !== module.pkg) {
        throw new errors_1.ErrArbitrary(`no-perform-capability`, `Not allowing ${location_1.module_location(module)} to perform ${type.name}. The effect ${type.name} can only be performed from its defining package, ${type.module?.pkg.name ?? ""}.`);
    }
}
exports.assert_can_perform = assert_can_perform;
function try_find_handler(stack, value) {
    let current = stack;
    while (current != null) {
        for (const handler of current.handlers) {
            if (values_1.has_type(handler.guard, value)) {
                return { handler, stack: current };
            }
        }
        current = current.parent;
    }
    return null;
}
exports.try_find_handler = try_find_handler;
function find_handler(stack, value) {
    const result = try_find_handler(stack, value);
    if (result == null) {
        throw new errors_1.ErrArbitrary(`no-handler`, `No handler for ${location_1.simple_value(value)} was found in this context.`);
    }
    return result;
}
exports.find_handler = find_handler;
function prepare_handler_activation(activation, stack, handler, value) {
    values_1.assert_tag(intrinsics_1.Tag.INSTANCE, value);
    if (handler.parameters.length !== value.payload.length) {
        throw new errors_1.ErrArbitrary(`internal:invalid-layout`, `Corrupted layout for ${location_1.simple_value(value)}---does not match the expected layout.`);
    }
    const env = Environments.clone_with_continuation(handler.env, activation);
    for (let i = 0; i < handler.parameters.length; ++i) {
        env.define(handler.parameters[i], value.payload[i]);
    }
    return new intrinsics_1.CrochetActivation(stack.activation, null, env, intrinsics_1._return, stack, handler.body);
}
exports.prepare_handler_activation = prepare_handler_activation;
// TODO: Clone continuation in tracing mode
function apply_continuation(k, value) {
    k.stack.push(value);
    k.next();
    return k;
}
exports.apply_continuation = apply_continuation;
function make_handle(activation, module, env0, body, cases) {
    const env = Environments.clone(env0);
    const handlers = [];
    for (const h of cases) {
        const type0 = materialise_effect(module, h.effect, h.variant);
        const type = Capability.free_effect(module, type0);
        handlers.push(new intrinsics_1.Handler(type, h.parameters, env, h.block));
    }
    const stack = new intrinsics_1.HandlerStack(activation.handlers, handlers);
    const new_activation = new intrinsics_1.CrochetActivation(activation, null, env, intrinsics_1._return, stack, body);
    stack.activation = activation;
    return new_activation;
}
exports.make_handle = make_handle;

},{"../errors":21,"../intrinsics":24,"./capability":31,"./environments":35,"./location":39,"./values":47}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bound_values_up_to = exports.extend_with_parameters_and_receiver = exports.extend_with_parameters = exports.extend = exports.clone_with_bindings = exports.clone_with_receiver = exports.clone_with_continuation = exports.clone = void 0;
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
function clone(env) {
    return new intrinsics_1.Environment(env, env.raw_receiver, env.raw_module, env.raw_continuation);
}
exports.clone = clone;
function clone_with_continuation(env, k) {
    return new intrinsics_1.Environment(env, env.raw_receiver, env.raw_module, k);
}
exports.clone_with_continuation = clone_with_continuation;
function clone_with_receiver(env, receiver) {
    return new intrinsics_1.Environment(env, receiver, env.raw_module, env.raw_continuation);
}
exports.clone_with_receiver = clone_with_receiver;
function clone_with_bindings(env, bindings) {
    const result = clone(env);
    for (const [k, v] of bindings) {
        result.define(k, v);
    }
    return result;
}
exports.clone_with_bindings = clone_with_bindings;
function extend(env, receiver) {
    return new intrinsics_1.Environment(env, receiver, env.raw_module, env.raw_continuation);
}
exports.extend = extend;
function extend_with_parameters(parent_env, parameters, values) {
    const receiver = values.length > 0 ? values[0] : null;
    const env = extend(parent_env, receiver);
    for (const [k, v] of utils_1.zip(parameters, values)) {
        env.define(k, v);
    }
    return env;
}
exports.extend_with_parameters = extend_with_parameters;
function extend_with_parameters_and_receiver(parent_env, parameters, values, receiver) {
    const env = extend(parent_env, receiver);
    for (const [k, v] of utils_1.zip(parameters, values)) {
        env.define(k, v);
    }
    return env;
}
exports.extend_with_parameters_and_receiver = extend_with_parameters_and_receiver;
function bound_values_up_to(mark_env, env) {
    let current = env;
    let result = new Map();
    while (current != null && current !== mark_env) {
        for (const [k, v] of current.bindings) {
            if (!result.has(k)) {
                result.set(k, v);
            }
        }
        current = current.parent;
    }
    return result;
}
exports.bound_values_up_to = bound_values_up_to;

},{"../../utils/utils":18,"../intrinsics":24}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capability = exports.DSL = exports.Effects = exports.World = exports.Values = exports.Types = exports.Tests = exports.StackTrace = exports.Packages = exports.Native = exports.Modules = exports.Location = exports.Literals = exports.Lambdas = exports.Environments = exports.Commands = void 0;
const Location = require("./location");
exports.Location = Location;
const Commands = require("./commands");
exports.Commands = Commands;
const Types = require("./types");
exports.Types = Types;
const Values = require("./values");
exports.Values = Values;
const Literals = require("./literals");
exports.Literals = Literals;
const Environments = require("./environments");
exports.Environments = Environments;
const Native = require("./native");
exports.Native = Native;
const Lambdas = require("./lambdas");
exports.Lambdas = Lambdas;
const Tests = require("./tests");
exports.Tests = Tests;
const Modules = require("./modules");
exports.Modules = Modules;
const Packages = require("./packages");
exports.Packages = Packages;
const World = require("./world");
exports.World = World;
const StackTrace = require("./stack-trace");
exports.StackTrace = StackTrace;
const Effects = require("./effect");
exports.Effects = Effects;
const DSL = require("./dsl");
exports.DSL = DSL;
const Capability = require("./capability");
exports.Capability = Capability;

},{"./capability":31,"./commands":32,"./dsl":33,"./effect":34,"./environments":35,"./lambdas":37,"./literals":38,"./location":39,"./modules":41,"./native":42,"./packages":43,"./stack-trace":44,"./tests":45,"./types":46,"./values":47,"./world":48}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_arity = exports.assert_arity = exports.prepare_activation = void 0;
const Commands = require("./commands");
const Environments = require("./environments");
const Values = require("./values");
const Location = require("./location");
const intrinsics_1 = require("../intrinsics");
const errors_1 = require("../errors");
const location_1 = require("./location");
const __1 = require("..");
function prepare_activation(universe, parent_activation, env0, lambda, values) {
    switch (lambda.tag) {
        case intrinsics_1.Tag.LAMBDA: {
            Values.assert_tag(intrinsics_1.Tag.LAMBDA, lambda);
            const p = lambda.payload;
            assert_arity(lambda, p.parameters.length, values.length);
            const env = Environments.extend_with_parameters_and_receiver(p.env, p.parameters, values, p.env.raw_receiver);
            const activation = new intrinsics_1.CrochetActivation(parent_activation, lambda.payload, env, intrinsics_1._return, parent_activation.handlers, p.body);
            return activation;
        }
        case intrinsics_1.Tag.NATIVE_LAMBDA: {
            Values.assert_tag(intrinsics_1.Tag.NATIVE_LAMBDA, lambda);
            const p = lambda.payload;
            assert_arity(lambda, p.arity, values.length);
            const activation = new __1.NativeActivation(parent_activation, null, new intrinsics_1.Environment(null, values[0] ?? null, null, null), p.fn(...values), p.handlers, intrinsics_1._return);
            return activation;
        }
        case intrinsics_1.Tag.PARTIAL: {
            Values.assert_tag(intrinsics_1.Tag.PARTIAL, lambda);
            const command = Commands.get_command(universe, lambda.payload.name);
            assert_arity(lambda, command.arity, values.length);
            const branch = Commands.select_branch(command, values);
            const new_activation = Commands.prepare_activation(parent_activation, branch, values);
            return new_activation;
        }
        default:
            throw new errors_1.ErrArbitrary("not-a-function", `Expected a function, but got ${Location.type_name(lambda.type)}`);
    }
}
exports.prepare_activation = prepare_activation;
function assert_arity(value, expected, got) {
    if (expected !== got) {
        throw new errors_1.ErrArbitrary("invalid-arity", `${Location.simple_value(value)} expects ${expected} arguments, but was provided with ${got}`);
    }
}
exports.assert_arity = assert_arity;
function get_arity(value) {
    switch (value.tag) {
        case intrinsics_1.Tag.LAMBDA: {
            Values.assert_tag(intrinsics_1.Tag.LAMBDA, value);
            return value.payload.parameters.length;
        }
        case intrinsics_1.Tag.PARTIAL: {
            Values.assert_tag(intrinsics_1.Tag.PARTIAL, value);
            return value.payload.arity;
        }
        default:
            throw new errors_1.ErrArbitrary(`invalid-type`, `Expected a function, but got a ${location_1.type_name(value.type)}`);
    }
}
exports.get_arity = get_arity;

},{"..":23,"../errors":21,"../intrinsics":24,"./commands":32,"./environments":35,"./location":39,"./values":47}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialise_literal = void 0;
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const values_1 = require("./values");
function materialise_literal(universe, literal) {
    const t = IR.LiteralTag;
    switch (literal.tag) {
        case t.NOTHING:
            return values_1.get_nothing(universe);
        case t.TRUE:
            return values_1.get_true(universe);
        case t.FALSE:
            return values_1.get_false(universe);
        case t.INTEGER:
            return values_1.make_integer(universe, literal.value);
        case t.FLOAT_64:
            return values_1.make_float(universe, literal.value);
        case t.TEXT:
            return values_1.make_static_text(universe, literal.value);
        default:
            throw utils_1.unreachable(literal, `Literal`);
    }
}
exports.materialise_literal = materialise_literal;

},{"../../ir":9,"../../utils/utils":18,"./values":47}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler_stack = exports.activation_location = exports.op_block = exports.format_position_suffix = exports.simple_activation = exports.simple_op = exports.simple_value = exports.trait_name = exports.type_name = exports.type_constraint_name = exports.type_or_constraint_name = exports.thunk_location = exports.command_signature = exports.from_suffix_newline = exports.from_suffix = exports.branch_name_location = exports.branch_location = exports.branch_name = exports.module_location = void 0;
const util_1 = require("util");
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
const meta_1 = require("./meta");
const values_1 = require("./values");
function module_location(x) {
    return `module ${x.filename} in ${x.pkg.name}`;
}
exports.module_location = module_location;
function branch_name(x) {
    return command_signature(x.name, x.types);
}
exports.branch_name = branch_name;
function branch_location(x) {
    return module_location(x.module);
}
exports.branch_location = branch_location;
function branch_name_location(x) {
    return `${branch_name(x)}, from ${branch_location(x)}`;
}
exports.branch_name_location = branch_name_location;
function from_suffix(x) {
    if (x == null) {
        return "";
    }
    else {
        return `, from ${module_location(x)}`;
    }
}
exports.from_suffix = from_suffix;
function from_suffix_newline(x) {
    if (x == null) {
        return "";
    }
    else {
        return `\n    from ${module_location(x)}`;
    }
}
exports.from_suffix_newline = from_suffix_newline;
function command_signature(name, types) {
    let i = 0;
    return name.replace(/_/g, (_) => `(${type_or_constraint_name(types[i++])})`);
}
exports.command_signature = command_signature;
function thunk_location(thunk) {
    const module = thunk.env.raw_module;
    if (module != null) {
        return `thunk, from ${module_location(module)}`;
    }
    else {
        return `thunk`;
    }
}
exports.thunk_location = thunk_location;
function type_or_constraint_name(x) {
    if (x instanceof intrinsics_1.CrochetType) {
        return type_name(x);
    }
    else if (x instanceof intrinsics_1.CrochetTypeConstraint) {
        return type_constraint_name(x);
    }
    else {
        throw utils_1.unreachable(x, "type or constraint");
    }
}
exports.type_or_constraint_name = type_or_constraint_name;
function type_constraint_name(x) {
    if (x.traits.length === 0) {
        return type_name(x.type);
    }
    else {
        return `${type_name(x.type)} has ${x.traits.map(trait_name).join(", ")}`;
    }
}
exports.type_constraint_name = type_constraint_name;
function type_name(x) {
    if (x.module != null) {
        return `${x.module.pkg.name}/${x.name}`;
    }
    else {
        return x.name;
    }
}
exports.type_name = type_name;
function trait_name(x) {
    if (x.module != null) {
        return `trait ${x.module.pkg.name}/${x.name}`;
    }
    else {
        return `trait ${x.name}`;
    }
}
exports.trait_name = trait_name;
function simple_value(x) {
    switch (x.tag) {
        case intrinsics_1.Tag.NOTHING:
            return "nothing";
        case intrinsics_1.Tag.FALSE:
            return "false";
        case intrinsics_1.Tag.TRUE:
            return "true";
        case intrinsics_1.Tag.INTEGER: {
            values_1.assert_tag(intrinsics_1.Tag.INTEGER, x);
            return x.payload.toString();
        }
        case intrinsics_1.Tag.FLOAT_64: {
            values_1.assert_tag(intrinsics_1.Tag.FLOAT_64, x);
            return x.payload.toString() + (Number.isInteger(x.payload) ? ".0" : "");
        }
        case intrinsics_1.Tag.INSTANCE: {
            values_1.assert_tag(intrinsics_1.Tag.INSTANCE, x);
            const fields = x.payload.map((v, i) => `${x.type.fields[i]} -> ${simple_value(v)}`);
            return `<${type_name(x.type)}: ${fields.join(", ")}>`;
        }
        case intrinsics_1.Tag.INTERPOLATION: {
            values_1.assert_tag(intrinsics_1.Tag.INTERPOLATION, x);
            return `i"${x.payload
                .map((x) => (typeof x === "string" ? x : `[${simple_value(x)}]`))
                .join("")}"`;
        }
        case intrinsics_1.Tag.LAMBDA: {
            values_1.assert_tag(intrinsics_1.Tag.LAMBDA, x);
            return `function(${x.payload.parameters.join(", ")})`;
        }
        case intrinsics_1.Tag.NATIVE_LAMBDA: {
            values_1.assert_tag(intrinsics_1.Tag.NATIVE_LAMBDA, x);
            return `<native-function-${x.payload.arity}>`;
        }
        case intrinsics_1.Tag.PARTIAL: {
            values_1.assert_tag(intrinsics_1.Tag.PARTIAL, x);
            return `<partial ${x.payload.name}>`;
        }
        case intrinsics_1.Tag.RECORD: {
            values_1.assert_tag(intrinsics_1.Tag.RECORD, x);
            if (x.payload.size === 0) {
                return "[->]";
            }
            const pairs = [...x.payload.entries()].map(([k, v]) => `${k} -> ${simple_value(v)}`);
            return `[${pairs.join(", ")}]`;
        }
        case intrinsics_1.Tag.TEXT: {
            return `"${x.payload}"`;
        }
        case intrinsics_1.Tag.THUNK: {
            values_1.assert_tag(intrinsics_1.Tag.THUNK, x);
            if (x.payload.value != null) {
                return `<thunk ${simple_value(x.payload.value)}>`;
            }
            else {
                return `<thunk>`;
            }
        }
        case intrinsics_1.Tag.LIST: {
            values_1.assert_tag(intrinsics_1.Tag.LIST, x);
            return `[${x.payload.map((x) => simple_value(x)).join(", ")}]`;
        }
        case intrinsics_1.Tag.TYPE: {
            values_1.assert_tag(intrinsics_1.Tag.TYPE, x);
            return `${type_name(x.type)}`;
        }
        case intrinsics_1.Tag.UNKNOWN: {
            return `<unknown>`;
        }
        case intrinsics_1.Tag.CELL: {
            values_1.assert_tag(intrinsics_1.Tag.CELL, x);
            return `<cell ${simple_value(x.payload.value)}`;
        }
        case intrinsics_1.Tag.ACTION: {
            values_1.assert_tag(intrinsics_1.Tag.ACTION, x);
            return `<action ${x.payload.action.name}>`;
        }
        case intrinsics_1.Tag.ACTION_CHOICE: {
            values_1.assert_tag(intrinsics_1.Tag.ACTION_CHOICE, x);
            return `<action choice ${x.payload.action.name} - ${x.payload.score}>`;
        }
        case intrinsics_1.Tag.PROTECTED: {
            values_1.assert_tag(intrinsics_1.Tag.PROTECTED, x);
            return `<protected ${simple_value(x.payload.value)}>`;
        }
        default:
            throw utils_1.unreachable(x.tag, `Value ${x}`);
    }
}
exports.simple_value = simple_value;
function simple_op(op, index) {
    const entries = Object.entries(op)
        .filter(([k, v]) => !["meta", "tag", "handlers"].includes(k) &&
        !(v instanceof IR.BasicBlock))
        .map((x) => util_1.inspect(x[1]));
    const bbs = Object.entries(op)
        .filter(([k, v]) => v instanceof IR.BasicBlock)
        .map(([k, v]) => `\n  ${k}:\n${v.ops
        .map((op, i) => `  ${simple_op(op, i)}`)
        .join("\n")}\n`)
        .join("\n")
        .split(/\n/g)
        .map((x) => `    ${x}`)
        .join("\n");
    const hs = (op.tag === IR.OpTag.HANDLE
        ? [
            "\n",
            ...op.handlers.map((x) => {
                return (`on ${x.effect}.${x.variant} [${x.parameters.join(", ")}]:\n` +
                    x.block.ops.map((x, i) => "  " + simple_op(x, i) + "\n").join(""));
            }),
        ]
        : [])
        .join("\n")
        .split(/\n/g)
        .map((x) => `    ${x}`)
        .join("\n");
    return `${(index ?? "").toString().padStart(3)} ${IR.OpTag[op.tag]} ${entries.join(" ")}${bbs}${hs}`;
}
exports.simple_op = simple_op;
function simple_activation(x) {
    switch (x.tag) {
        case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
            return [
                `activation at ${x.instruction}\n`,
                x.block.ops.map((x, i) => "  " + simple_op(x, i) + "\n").join(""),
                "\nstack:\n",
                x.stack.map((x) => "  " + simple_value(x) + "\n").join(""),
            ].join("");
        }
        case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
            if (x.location) {
                return `native activation ${x.location.name} in ${x.location.pkg.name}`;
            }
            else {
                return `native activation`;
            }
        }
    }
}
exports.simple_activation = simple_activation;
function format_position_suffix(id, meta) {
    if (meta == null) {
        return "";
    }
    else {
        const pos = meta_1.get_line_column(id, meta);
        if (pos == null) {
            return "";
        }
        else {
            return ` at line ${pos.line}`;
        }
    }
}
exports.format_position_suffix = format_position_suffix;
function op_block(xs, padding) {
    return xs
        .map((x, i) => simple_op(x, i))
        .join("\n")
        .split(/\r\n|\r|\n/)
        .map((x) => " ".repeat(padding) + x)
        .join("\n");
}
exports.op_block = op_block;
function activation_location(x) {
    if (x == null) {
        return "(root)";
    }
    else if (x instanceof intrinsics_1.CrochetLambda) {
        return `function/${x.parameters.length} from ${x.env.raw_module ? module_location(x.env.raw_module) : "(no module)"}`;
    }
    else if (x instanceof intrinsics_1.CrochetCommandBranch) {
        return branch_location(x);
    }
    else if (x instanceof intrinsics_1.CrochetThunk) {
        return `thunk from ${x.env.raw_module ? module_location(x.env.raw_module) : "(no module)"}`;
    }
    else if (x instanceof intrinsics_1.CrochetPrelude) {
        return `prelude from ${module_location(x.env.raw_module)}`;
    }
    else if (x instanceof intrinsics_1.NativeFunction) {
        return `native function ${x.name} from ${x.pkg.name}`;
    }
    else if (x instanceof intrinsics_1.SimulationSignal) {
        return `simulation signal ${x.name} from ${module_location(x.module)}`;
    }
    else {
        return "unknown";
    }
}
exports.activation_location = activation_location;
function handler_stack(x) {
    const entries = x.handlers.map((x) => [`  on ${type_name(x.guard)}\n`, `${op_block(x.body.ops, 4)}\n`].join(""));
    return [
        x.activation ? `at ${activation_location(x.activation?.location)}\n` : "",
        ...entries,
        ...(x.parent ? ["\n---\n", handler_stack(x.parent)] : []),
    ].join("");
}
exports.handler_stack = handler_stack;

},{"../../ir":9,"../../utils/utils":18,"../intrinsics":24,"./meta":40,"./values":47,"util":124}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_annotated_source = exports.get_line_column = void 0;
function get_line_column(id, meta) {
    const interval = meta.table.get(id);
    if (interval == null) {
        return null;
    }
    else {
        const lines = meta.source
            .slice(0, interval.range.start)
            .split(/\r\n|\r|\n/);
        const last_line = lines[lines.length - 1] ?? "";
        return { line: lines.length, column: last_line.length + 1 };
    }
}
exports.get_line_column = get_line_column;
function get_annotated_source(id, meta) {
    const pos = get_line_column(id, meta);
    if (pos == null) {
        return null;
    }
    else {
        const lines = meta.source.split(/\r\n|\r|\n/);
        const line = lines[pos.line - 1];
        if (line == null) {
            return null;
        }
        else {
            return ` ${pos.line.toString().padStart(4)} | ${line}`;
        }
    }
}
exports.get_annotated_source = get_annotated_source;

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace_global = exports.get_specific_global = exports.get_global = exports.get_trait_namespace = exports.get_type_namespace = exports.get_define_namespace = exports.define = exports.open = void 0;
const IR = require("../../ir");
const logger_1 = require("../../utils/logger");
const errors_1 = require("../errors");
const location_1 = require("./location");
const packages_1 = require("./packages");
function open(module, namespace) {
    packages_1.assert_open_allowed(module.pkg, namespace);
    module.open_prefixes.add(namespace);
}
exports.open = open;
function define(module, visibility, name, value) {
    const ns = get_define_namespace(module, visibility);
    logger_1.logger.debug(`Defining ${IR.Visibility[visibility]} ${name} in ${location_1.module_location(module)}`);
    if (!ns.define(name, value)) {
        throw new errors_1.ErrArbitrary("duplicated-definition", `Duplicated definition ${name} in ${location_1.module_location(module)}`);
    }
}
exports.define = define;
function get_define_namespace(module, visibility) {
    switch (visibility) {
        case IR.Visibility.LOCAL:
            return module.definitions;
        case IR.Visibility.GLOBAL:
            return module.pkg.definitions;
    }
}
exports.get_define_namespace = get_define_namespace;
function get_type_namespace(module, visibility) {
    switch (visibility) {
        case IR.Visibility.LOCAL:
            return module.types;
        case IR.Visibility.GLOBAL:
            return module.pkg.types;
    }
}
exports.get_type_namespace = get_type_namespace;
function get_trait_namespace(module) {
    return module.pkg.traits;
}
exports.get_trait_namespace = get_trait_namespace;
function get_global(module, name) {
    const value = module.definitions.try_lookup(name);
    if (value == null) {
        throw new errors_1.ErrArbitrary("undefined", `The definition ${name} is not accessible from ${location_1.module_location(module)}`);
    }
    return value;
}
exports.get_global = get_global;
function get_specific_global(module, name) {
    const global_name = module.pkg.definitions.prefixed(name);
    const value = module.pkg.world.definitions.try_lookup_local(global_name);
    if (value == null) {
        throw new errors_1.ErrArbitrary("undefined", `The definition ${name} is not accessible from package ${module.pkg.name}`);
    }
    return value;
}
exports.get_specific_global = get_specific_global;
function replace_global(module, name, old, value) {
    const global_name = module.pkg.definitions.prefixed(name);
    const actual = module.pkg.world.definitions.try_lookup_local(global_name);
    if (old === actual) {
        module.pkg.world.definitions.overwrite(global_name, value);
    }
    else {
        throw new errors_1.ErrArbitrary("replace-not-allowed", `Replacing ${name} in ${module.pkg.name} is not allowed; the provided capability is not correct`);
    }
}
exports.replace_global = replace_global;

},{"../../ir":9,"../../utils/logger":17,"../errors":21,"./location":39,"./packages":43}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_native = exports.assert_native_tag = exports.native_tag_to_name = void 0;
const _1 = require(".");
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
function native_tag_to_name(x) {
    return intrinsics_1.NativeTag[x].toLowerCase().replace(/_/g, "-");
}
exports.native_tag_to_name = native_tag_to_name;
function assert_native_tag(tag, value) {
    if (value.tag != tag) {
        throw new errors_1.ErrArbitrary("invalid-native-function", `Expected a ${native_tag_to_name(tag)} native function, but got a ${native_tag_to_name(value.tag)} instead`);
    }
    return value;
}
exports.assert_native_tag = assert_native_tag;
function get_native(module, name) {
    const fn = module.pkg.native_functions.try_lookup(name);
    if (fn == null) {
        throw new errors_1.ErrArbitrary("undefined-foreign-function", `The foreign function ${name} is not accessible from ${_1.Location.module_location(module)}`);
    }
    return fn;
}
exports.get_native = get_native;

},{".":36,"../errors":21,"../intrinsics":24}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert_open_allowed = exports.is_open_allowed = void 0;
const errors_1 = require("../errors");
function is_open_allowed(pkg, namespace) {
    return pkg.dependencies.has(namespace);
}
exports.is_open_allowed = is_open_allowed;
function assert_open_allowed(pkg, namespace) {
    if (!is_open_allowed(pkg, namespace)) {
        throw new errors_1.ErrArbitrary("no-open-capability", `Cannot open name ${namespace} from ${pkg.name} because it's not declared as a dependency`);
    }
}
exports.assert_open_allowed = assert_open_allowed;

},{"../errors":21}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format_slice = exports.format_location = exports.format_entry = exports.format_entries = exports.collect_trace = exports.TraceEntry = void 0;
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
const location_1 = require("./location");
const meta_1 = require("./meta");
class TraceEntry {
    constructor(context, module, meta) {
        this.context = context;
        this.module = module;
        this.meta = meta;
    }
}
exports.TraceEntry = TraceEntry;
const MAX_DEPTH = 10;
function collect_trace(activation, depth = 0) {
    if (activation == null || depth > MAX_DEPTH) {
        return [];
    }
    switch (activation.tag) {
        case intrinsics_1.ActivationTag.CROCHET_ACTIVATION: {
            return [
                new TraceEntry(activation.location, activation.env.raw_module, activation.current?.meta ?? null),
                ...collect_trace(activation.parent, depth + 1),
            ];
        }
        case intrinsics_1.ActivationTag.NATIVE_ACTIVATION: {
            return [
                new TraceEntry(activation.location, null, null),
                ...collect_trace(activation.parent, depth + 1),
            ];
        }
        default:
            throw utils_1.unreachable(activation, "Activation");
    }
}
exports.collect_trace = collect_trace;
function format_entries(entries) {
    return entries.map(format_entry).join("\n");
}
exports.format_entries = format_entries;
function format_entry(entry) {
    return `  In ${format_location(entry.context)} ${format_slice(entry.module, entry.meta)}`;
}
exports.format_entry = format_entry;
function format_location(location) {
    if (location instanceof intrinsics_1.CrochetLambda) {
        return `anonymous function(${location.parameters.join(", ")})${location_1.from_suffix_newline(location.env.raw_module)}`;
    }
    else if (location instanceof intrinsics_1.CrochetCommandBranch) {
        return `${location_1.branch_name(location)}\n    from ${location_1.branch_location(location)}`;
    }
    else if (location instanceof intrinsics_1.CrochetThunk) {
        return location_1.thunk_location(location);
    }
    else if (location instanceof intrinsics_1.CrochetPrelude) {
        return `prelude${location_1.from_suffix_newline(location.env.raw_module)}`;
    }
    else if (location instanceof intrinsics_1.CrochetTest) {
        return `test "${location.title}"${location_1.from_suffix_newline(location.module)}`;
    }
    else if (location instanceof intrinsics_1.NativeFunction) {
        return `native ${location.name} in ${location.pkg.name}`;
    }
    else if (location instanceof intrinsics_1.SimulationSignal) {
        return `signal ${location.name}${location_1.from_suffix_newline(location.module)}`;
    }
    else if (location == null) {
        return `(root)`;
    }
    else {
        throw utils_1.unreachable(location, "Location");
    }
}
exports.format_location = format_location;
function format_slice(module, meta) {
    if (module == null || meta == null || module.metadata == null) {
        return "\n";
    }
    const line = meta_1.get_annotated_source(meta, module.metadata);
    if (line == null) {
        return "\n";
    }
    else {
        return `\n    ${line}\n`;
    }
}
exports.format_slice = format_slice;

},{"../../utils/utils":18,"../intrinsics":24,"./location":39,"./meta":40}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grouped_tests = exports.filter_grouped_tests = exports.add_test = void 0;
function add_test(universe, test) {
    universe.world.tests.push(test);
}
exports.add_test = add_test;
function filter_grouped_tests(tests, filter) {
    let total = 0;
    let skipped = 0;
    const result = new Map();
    for (const [group, modules] of tests) {
        const group_tests = new Map();
        for (const [module, tests] of modules) {
            const valid_tests = tests.filter(filter);
            if (valid_tests.length !== 0) {
                group_tests.set(module, valid_tests);
            }
            skipped += tests.length - valid_tests.length;
            total += valid_tests.length;
        }
        if (group_tests.size !== 0) {
            result.set(group, group_tests);
        }
    }
    return { total, skipped, tests: result };
}
exports.filter_grouped_tests = filter_grouped_tests;
function grouped_tests(universe) {
    const groups = new Map();
    for (const test of universe.world.tests) {
        const key = test.module.pkg.name;
        const module_key = test.module.filename;
        const modules = groups.get(key) ?? new Map();
        const tests = modules.get(module_key) ?? [];
        tests.push(test);
        modules.set(module_key, tests);
        groups.set(key, modules);
    }
    return groups;
}
exports.grouped_tests = grouped_tests;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registered_instances = exports.seal = exports.constraint_distance = exports.compare_constraints = exports.compare = exports.distance = exports.get_function_type = exports.define_trait = exports.define_type = exports.get_foreign_type = exports.materialise_trait = exports.materialise_type_constraint = exports.materialise_type = exports.get_type_namespaced = exports.get_trait = exports.get_type = exports.get_static_type = exports.has_trait = exports.fulfills_constraint = exports.is_subtype = void 0;
const IR = require("../../ir");
const utils_1 = require("../../utils/utils");
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
const Location = require("./location");
const modules_1 = require("./modules");
function is_subtype(type, parent) {
    if (type === parent) {
        return true;
    }
    else if (type.parent != null) {
        return is_subtype(type.parent, parent);
    }
    else {
        return false;
    }
}
exports.is_subtype = is_subtype;
function fulfills_constraint(constraint, type) {
    return (is_subtype(type, constraint.type) &&
        constraint.traits.every((t) => has_trait(t, type)));
}
exports.fulfills_constraint = fulfills_constraint;
function has_trait(trait, type) {
    if (type.traits.has(trait)) {
        return true;
    }
    else if (type.parent != null) {
        return has_trait(trait, type.parent);
    }
    else {
        return false;
    }
}
exports.has_trait = has_trait;
function get_static_type(universe, type) {
    if (type.is_static) {
        return type;
    }
    const cached = universe.type_cache.get(type);
    if (cached != null) {
        return cached;
    }
    else {
        const name = `#${type.name}`;
        const static_type = new intrinsics_1.CrochetType(type.module, name, "", universe.types.Type, [], [], true, null);
        universe.type_cache.set(type, static_type);
        return static_type;
    }
}
exports.get_static_type = get_static_type;
function get_type(module, name) {
    const value = module.types.try_lookup(name);
    if (value != null) {
        return value;
    }
    else {
        throw new errors_1.ErrArbitrary("no-type", `No type ${name} is accessible from ${Location.module_location(module)}`);
    }
}
exports.get_type = get_type;
function get_trait(module, name) {
    const value = module.traits.try_lookup(name);
    if (value != null) {
        return value;
    }
    else {
        throw new errors_1.ErrArbitrary("no-trait", `No trait ${name} is accessible from ${Location.module_location(module)}`);
    }
}
exports.get_trait = get_trait;
function get_type_namespaced(module, namespace, name) {
    const value = module.types.try_lookup_namespaced(namespace, name);
    if (value != null) {
        return value;
    }
    else {
        throw new errors_1.ErrArbitrary("no-type", `No type ${namespace}/${name} is accessible from ${Location.module_location(module)}`);
    }
}
exports.get_type_namespaced = get_type_namespaced;
function materialise_type(universe, module, type) {
    switch (type.tag) {
        case IR.TypeTag.ANY:
            return universe.types.Any;
        case IR.TypeTag.UNKNOWN:
            return universe.types.Unknown;
        case IR.TypeTag.LOCAL: {
            return get_type(module, type.name);
        }
        case IR.TypeTag.LOCAL_STATIC: {
            const value = get_type(module, type.name);
            return get_static_type(universe, value);
        }
        case IR.TypeTag.GLOBAL: {
            return get_type_namespaced(module, type.namespace, type.name);
        }
        default:
            throw utils_1.unreachable(type, "Type");
    }
}
exports.materialise_type = materialise_type;
function materialise_type_constraint(universe, module, constraint) {
    switch (constraint.tag) {
        case IR.TypeConstraintTag.TYPE: {
            return new intrinsics_1.CrochetTypeConstraint(materialise_type(universe, module, constraint.type), []);
        }
        case IR.TypeConstraintTag.WITH_TRAIT: {
            const base = materialise_type_constraint(universe, module, constraint.type);
            return new intrinsics_1.CrochetTypeConstraint(base.type, [
                ...base.traits,
                ...constraint.traits.map((t) => materialise_trait(universe, module, t)),
            ]);
        }
    }
}
exports.materialise_type_constraint = materialise_type_constraint;
function materialise_trait(universe, module, trait) {
    switch (trait.tag) {
        case IR.TraitTag.LOCAL: {
            return get_trait(module, trait.name);
        }
        default:
            throw utils_1.unreachable(trait, "Trait");
    }
}
exports.materialise_trait = materialise_trait;
function get_foreign_type(universe, module, name) {
    const result = universe.world.native_types.try_lookup_namespaced(module.pkg.name, name);
    if (result == null) {
        throw new errors_1.ErrArbitrary("no-foreign-type", `No foreign type ${name} is accessible from ${Location.module_location(module)}`);
    }
    return result;
}
exports.get_foreign_type = get_foreign_type;
function define_type(module, name, type, visibility) {
    const ns = modules_1.get_type_namespace(module, visibility);
    if (!ns.define(name, type)) {
        throw new errors_1.ErrArbitrary("duplicated-type", `Duplicated definition of type ${name} in ${Location.module_location(module)}`);
    }
}
exports.define_type = define_type;
function define_trait(module, name, trait) {
    const ns = modules_1.get_trait_namespace(module);
    if (!ns.define(name, trait)) {
        throw new errors_1.ErrArbitrary("duplicated-trait", `Duplicated definition of trait ${name} in ${Location.module_location(module)}`);
    }
}
exports.define_trait = define_trait;
function get_function_type(universe, arity) {
    const type = universe.types.Function[arity];
    if (type != null) {
        return type;
    }
    else {
        throw new errors_1.ErrArbitrary("invalid-function", `internal: Functions of arity ${arity} are not currently supported`);
    }
}
exports.get_function_type = get_function_type;
function distance(type) {
    if (type.parent == null) {
        return 0;
    }
    else {
        return 1 + distance(type.parent);
    }
}
exports.distance = distance;
function compare(t1, t2) {
    return distance(t2) - distance(t1);
}
exports.compare = compare;
function compare_constraints(t1, t2) {
    return constraint_distance(t2) - constraint_distance(t1);
}
exports.compare_constraints = compare_constraints;
function constraint_distance(t) {
    const d = distance(t.type) * 2;
    if (t.traits.length !== 0) {
        return d + 1;
    }
    else {
        return d;
    }
}
exports.constraint_distance = constraint_distance;
function seal(type) {
    type.sealed = true;
}
exports.seal = seal;
function* registered_instances(universe, type) {
    const instances = universe.registered_instances.get(type) ?? [];
    yield* instances;
    for (const sub_type of type.sub_types) {
        yield* registered_instances(universe, sub_type);
    }
}
exports.registered_instances = registered_instances;

},{"../../ir":9,"../../utils/utils":18,"../errors":21,"../intrinsics":24,"./location":39,"./modules":41}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equals = exports.protect = exports.is_nothing = exports.to_number = exports.float_to_number = exports.from_plain_object = exports.to_plain_object = exports.unbox = exports.box = exports.is_boxed = exports.update_thunk = exports.is_thunk_forced = exports.normalise_interpolation = exports.get_map = exports.update_cell = exports.deref_cell = exports.make_cell = exports.project = exports.text_to_string = exports.register_instance = exports.get_interpolation_parts = exports.get_array = exports.make_boolean = exports.get_boolean = exports.get_thunk = exports.assert_tag = exports.tag_to_name = exports.make_static_type = exports.instantiate = exports.has_trait = exports.has_type = exports.record_at_put = exports.get_action_choice = exports.make_action_choice = exports.get_action = exports.make_action = exports.make_record_from_map = exports.make_record = exports.make_partial = exports.make_lambda = exports.make_thunk = exports.make_interpolation = exports.make_list = exports.make_static_text = exports.make_text = exports.make_float = exports.make_integer = exports.get_true = exports.get_false = exports.get_nothing = void 0;
const __1 = require("..");
const utils_1 = require("../../utils/utils");
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
Object.defineProperty(exports, "equals", { enumerable: true, get: function () { return intrinsics_1.equals; } });
const location_1 = require("./location");
const types_1 = require("./types");
function get_nothing(universe) {
    return universe.nothing;
}
exports.get_nothing = get_nothing;
function get_false(universe) {
    return universe.false;
}
exports.get_false = get_false;
function get_true(universe) {
    return universe.true;
}
exports.get_true = get_true;
function make_integer(universe, x) {
    return universe.make_integer(x);
}
exports.make_integer = make_integer;
function make_float(universe, x) {
    return universe.make_float(x);
}
exports.make_float = make_float;
function make_text(universe, x) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.TEXT, universe.types.Text, x);
}
exports.make_text = make_text;
function make_static_text(universe, x) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.TEXT, universe.types.StaticText, x);
}
exports.make_static_text = make_static_text;
function make_list(universe, xs) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.LIST, universe.types.List, xs);
}
exports.make_list = make_list;
function make_interpolation(universe, xs) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.INTERPOLATION, universe.types.Interpolation, xs);
}
exports.make_interpolation = make_interpolation;
function make_thunk(universe, env, block) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.THUNK, universe.types.Thunk, new intrinsics_1.CrochetThunk(env, block));
}
exports.make_thunk = make_thunk;
function make_lambda(universe, env, parameters, body) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.LAMBDA, types_1.get_function_type(universe, parameters.length), new intrinsics_1.CrochetLambda(env, parameters, body));
}
exports.make_lambda = make_lambda;
function make_partial(universe, module, name, arity) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.PARTIAL, types_1.get_function_type(universe, arity), new intrinsics_1.CrochetPartial(module, name, arity));
}
exports.make_partial = make_partial;
function make_record(universe, keys, values) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.RECORD, universe.types.Record, new Map(utils_1.zip(keys, values)));
}
exports.make_record = make_record;
function make_record_from_map(universe, value) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.RECORD, universe.types.Record, value);
}
exports.make_record_from_map = make_record_from_map;
function make_action(action, env) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.ACTION, action.type, { env, action });
}
exports.make_action = make_action;
function get_action(value) {
    assert_tag(intrinsics_1.Tag.ACTION, value);
    return value.payload;
}
exports.get_action = get_action;
function make_action_choice(universe, choice) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.ACTION_CHOICE, universe.types.ActionChoice, choice);
}
exports.make_action_choice = make_action_choice;
function get_action_choice(value) {
    assert_tag(intrinsics_1.Tag.ACTION_CHOICE, value);
    return value.payload;
}
exports.get_action_choice = get_action_choice;
function record_at_put(universe, record, key, value) {
    assert_tag(intrinsics_1.Tag.RECORD, record);
    const map0 = record.payload;
    const map = utils_1.clone_map(map0);
    map.set(key, value);
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.RECORD, universe.types.Record, map);
}
exports.record_at_put = record_at_put;
function has_type(type, value) {
    return types_1.is_subtype(value.type, type);
}
exports.has_type = has_type;
function has_trait(trait, value) {
    return value.type.traits.has(trait);
}
exports.has_trait = has_trait;
function instantiate(type, values) {
    if (type.sealed) {
        throw new errors_1.ErrArbitrary("new-on-sealed-type", `The type ${location_1.type_name(type)} cannot be instantiated`);
    }
    if (type.fields.length !== values.length) {
        throw new errors_1.ErrArbitrary("invalid-new-arity", `The type ${location_1.type_name(type)} requires ${type.fields.length} arguments (${type.fields.join(", ")})`);
    }
    for (const [f, t, v] of utils_1.zip3(type.fields, type.types, values)) {
        if (!has_type(t.type, v)) {
            throw new errors_1.ErrArbitrary("invalid-field-type", `The field ${f} of type ${location_1.type_name(type)} expects a value of type ${location_1.type_name(t.type)}, but was provided a value of type ${location_1.type_name(v.type)}`);
        }
        for (const trait of t.traits) {
            if (!has_trait(trait, v)) {
                throw new errors_1.ErrArbitrary("invalid-field-type", `The field ${f} of type ${location_1.type_name(type)} expects a value with trait ${location_1.trait_name(trait)}, but the provided value of type ${location_1.type_name(v.type)} does not implement it.`);
            }
        }
    }
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.INSTANCE, type, values);
}
exports.instantiate = instantiate;
function make_static_type(universe, type) {
    if (!type.is_static) {
        throw new errors_1.ErrArbitrary("no-static-type", `The operation tried to construct a static type value, but wasn't provided with a static type`);
    }
    const stype = universe.static_type_cache.get(type);
    if (stype == null) {
        const value = new intrinsics_1.CrochetValue(intrinsics_1.Tag.TYPE, type, type);
        universe.static_type_cache.set(type, value);
        return value;
    }
    else {
        return stype;
    }
}
exports.make_static_type = make_static_type;
function tag_to_name(x) {
    return intrinsics_1.Tag[x].replace(/_/g, "-").toLowerCase();
}
exports.tag_to_name = tag_to_name;
function assert_tag(tag, value) {
    if (value.tag !== tag) {
        throw new errors_1.ErrArbitrary("invalid-type", `Expected a value of type ${tag_to_name(tag)}, but got ${location_1.type_name(value.type)}`);
    }
    else {
        return value;
    }
}
exports.assert_tag = assert_tag;
function get_thunk(x) {
    assert_tag(intrinsics_1.Tag.THUNK, x);
    return x.payload;
}
exports.get_thunk = get_thunk;
function get_boolean(x) {
    switch (x.tag) {
        case intrinsics_1.Tag.FALSE:
            return false;
        case intrinsics_1.Tag.TRUE:
            return true;
        default:
            throw new errors_1.ErrArbitrary("invalid-type", `Expected true or false, but got a value of type ${location_1.type_name(x.type)} instead`);
    }
}
exports.get_boolean = get_boolean;
function make_boolean(universe, x) {
    return x ? get_true(universe) : get_false(universe);
}
exports.make_boolean = make_boolean;
function get_array(x) {
    assert_tag(intrinsics_1.Tag.LIST, x);
    return x.payload;
}
exports.get_array = get_array;
function get_interpolation_parts(x) {
    assert_tag(intrinsics_1.Tag.INTERPOLATION, x);
    return x.payload;
}
exports.get_interpolation_parts = get_interpolation_parts;
function register_instance(universe, value) {
    const current = universe.registered_instances.get(value.type) ?? [];
    if (current.some((x) => intrinsics_1.equals(x, value))) {
        throw new errors_1.ErrArbitrary("instance-already-registered", `The instance ${location_1.simple_value(value)} is already registered`);
    }
    current.push(value);
    universe.registered_instances.set(value.type, current);
}
exports.register_instance = register_instance;
function text_to_string(x) {
    assert_tag(intrinsics_1.Tag.TEXT, x);
    return x.payload;
}
exports.text_to_string = text_to_string;
function project(value, key, assert_capability) {
    switch (value.tag) {
        case intrinsics_1.Tag.RECORD: {
            assert_tag(intrinsics_1.Tag.RECORD, value);
            const x = value.payload.get(key);
            if (x == null) {
                throw new errors_1.ErrArbitrary("no-record-key", `The key ${key} does not exist in the record (${[
                    ...value.payload.keys(),
                ].join(", ")})`);
            }
            else {
                return x;
            }
        }
        case intrinsics_1.Tag.INSTANCE: {
            assert_tag(intrinsics_1.Tag.INSTANCE, value);
            assert_capability(value);
            const index = value.type.layout.get(key);
            if (index == null) {
                throw new errors_1.ErrArbitrary("no-type-key", `The type ${location_1.type_name(value.type)} does not have a field ${key} ([${value.type.fields.join(", ")}])`);
            }
            else {
                const result = value.payload[index];
                if (result == null) {
                    throw new errors_1.ErrArbitrary("internal", `The data in the value does not match its type (${location_1.type_name(value.type)}) layout`);
                }
                return result;
            }
        }
        case intrinsics_1.Tag.LIST: {
            assert_tag(intrinsics_1.Tag.LIST, value);
            const results = value.payload.map((x) => project(x, key, assert_capability));
            return new intrinsics_1.CrochetValue(intrinsics_1.Tag.LIST, value.type, results);
        }
        case intrinsics_1.Tag.ACTION: {
            assert_tag(intrinsics_1.Tag.ACTION, value);
            const result = value.payload.env.try_lookup(key);
            if (result == null) {
                throw new errors_1.ErrArbitrary("no-bound-variable", `The name ${key} is not bound in the action ${value.payload.action.name}`);
            }
            return result;
        }
        default:
            throw new errors_1.ErrArbitrary("no-projection-capability", `Values of type ${location_1.type_name(value.type)} do not support projection`);
    }
}
exports.project = project;
function make_cell(universe, value) {
    return new intrinsics_1.CrochetValue(intrinsics_1.Tag.CELL, universe.types.Cell, new intrinsics_1.CrochetCell(value));
}
exports.make_cell = make_cell;
function deref_cell(cell) {
    assert_tag(intrinsics_1.Tag.CELL, cell);
    return cell.payload.value;
}
exports.deref_cell = deref_cell;
function update_cell(cell, old_value, value) {
    assert_tag(intrinsics_1.Tag.CELL, cell);
    if (intrinsics_1.equals(cell.payload.value, old_value)) {
        cell.payload.value = value;
        return true;
    }
    else {
        return false;
    }
}
exports.update_cell = update_cell;
function get_map(x) {
    assert_tag(intrinsics_1.Tag.RECORD, x);
    return x.payload;
}
exports.get_map = get_map;
function normalise_interpolation(universe, x) {
    assert_tag(intrinsics_1.Tag.INTERPOLATION, x);
    let last = null;
    const list = [];
    for (const p of x.payload) {
        if (typeof p === "string") {
            if (typeof last === "string") {
                last = last + p;
            }
            else {
                last = p;
            }
        }
        else {
            if (last != null) {
                list.push(last);
                last = null;
            }
            list.push(p);
        }
    }
    if (last != null) {
        list.push(last);
    }
    return make_interpolation(universe, list);
}
exports.normalise_interpolation = normalise_interpolation;
function is_thunk_forced(x) {
    assert_tag(intrinsics_1.Tag.THUNK, x);
    return x.payload.value != null;
}
exports.is_thunk_forced = is_thunk_forced;
function update_thunk(x, value) {
    x.value = value;
}
exports.update_thunk = update_thunk;
function is_boxed(x) {
    return x.tag === intrinsics_1.Tag.UNKNOWN;
}
exports.is_boxed = is_boxed;
function box(universe, x) {
    if (x instanceof intrinsics_1.CrochetValue && is_boxed(x)) {
        return x;
    }
    else {
        return new intrinsics_1.CrochetValue(intrinsics_1.Tag.UNKNOWN, universe.types.Unknown, x);
    }
}
exports.box = box;
function unbox(x) {
    assert_tag(intrinsics_1.Tag.UNKNOWN, x);
    return x.payload;
}
exports.unbox = unbox;
function to_plain_object(x) {
    switch (x.tag) {
        case intrinsics_1.Tag.NOTHING:
            return null;
        case intrinsics_1.Tag.INTEGER:
            return x.payload;
        case intrinsics_1.Tag.FLOAT_64:
            return x.payload;
        case intrinsics_1.Tag.TEXT:
            return x.payload;
        case intrinsics_1.Tag.TRUE:
            return true;
        case intrinsics_1.Tag.FALSE:
            return false;
        case intrinsics_1.Tag.LIST:
            assert_tag(intrinsics_1.Tag.LIST, x);
            return x.payload.map((x) => to_plain_object(x));
        case intrinsics_1.Tag.RECORD: {
            assert_tag(intrinsics_1.Tag.RECORD, x);
            const result = new Map();
            for (const [k, v] of x.payload.entries()) {
                result.set(k, to_plain_object(v));
            }
            return result;
        }
        default:
            throw new errors_1.ErrArbitrary(`no-conversion-to-native`, `No conversion supported for values of type ${location_1.type_name(x.type)}`);
    }
}
exports.to_plain_object = to_plain_object;
function from_plain_object(universe, x) {
    if (x == null) {
        return universe.nothing;
    }
    else if (typeof x === "string") {
        return make_text(universe, x);
    }
    else if (typeof x === "bigint") {
        return make_integer(universe, x);
    }
    else if (typeof x === "number") {
        return make_float(universe, x);
    }
    else if (typeof x === "boolean") {
        return make_boolean(universe, x);
    }
    else if (Array.isArray(x)) {
        return make_list(universe, x.map((x) => from_plain_object(universe, x)));
    }
    else if (x instanceof Map) {
        const result = new Map();
        for (const [k, v] of x.entries()) {
            if (typeof k !== "string") {
                throw new errors_1.ErrArbitrary("invalid-type", `Cannot convert native map because it has non-text keys`);
            }
            result.set(k, from_plain_object(universe, v));
        }
        return make_record_from_map(universe, result);
    }
    else {
        throw new errors_1.ErrArbitrary("no-conversion-from-native", `Conversions are only supported for plain native types`);
    }
}
exports.from_plain_object = from_plain_object;
function float_to_number(x) {
    assert_tag(intrinsics_1.Tag.FLOAT_64, x);
    return x.payload;
}
exports.float_to_number = float_to_number;
function to_number(x) {
    switch (x.tag) {
        case intrinsics_1.Tag.FLOAT_64: {
            assert_tag(intrinsics_1.Tag.FLOAT_64, x);
            return x.payload;
        }
        case intrinsics_1.Tag.INTEGER: {
            assert_tag(intrinsics_1.Tag.INTEGER, x);
            return Number(x.payload);
        }
        default:
            throw new errors_1.ErrArbitrary("invalid-type", `Expected a numeric value`);
    }
}
exports.to_number = to_number;
function is_nothing(x) {
    return x.tag === intrinsics_1.Tag.NOTHING;
}
exports.is_nothing = is_nothing;
function protect(universe, x, capability) {
    switch (x.tag) {
        case intrinsics_1.Tag.PROTECTED: {
            assert_tag(intrinsics_1.Tag.PROTECTED, x);
            x.payload.protected_by.add(capability);
            return x;
        }
        default: {
            const x1 = new intrinsics_1.CrochetValue(intrinsics_1.Tag.PROTECTED, universe.types.Protected, new __1.CrochetProtectedValue(x));
            x1.payload.protected_by.add(capability);
            return x1;
        }
    }
}
exports.protect = protect;

},{"..":23,"../../utils/utils":18,"../errors":21,"../intrinsics":24,"./location":39,"./types":46}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_or_make_package = exports.add_prelude = void 0;
const intrinsics_1 = require("../intrinsics");
function add_prelude(world, prelude) {
    world.prelude.push(prelude);
}
exports.add_prelude = add_prelude;
function get_or_make_package(world, pkg) {
    const result = world.packages.get(pkg.name);
    if (result != null) {
        return result;
    }
    else {
        const cpkg = new intrinsics_1.CrochetPackage(world, pkg.name, pkg.filename);
        for (const dep of pkg.dependencies) {
            cpkg.dependencies.add(dep.name);
        }
        world.packages.set(pkg.name, cpkg);
        return cpkg;
    }
}
exports.get_or_make_package = get_or_make_package;

},{"../intrinsics":24}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_native = exports.run_native_sync = exports.run_block = exports.run_test = exports.run_prelude = exports.run_command = void 0;
const IR = require("../ir");
const evaluation_1 = require("./evaluation");
const intrinsics_1 = require("./intrinsics");
async function run_command(universe, name, args) {
    const env = new intrinsics_1.Environment(null, null, null, null);
    const activation = new intrinsics_1.CrochetActivation(null, null, env, intrinsics_1._done, new intrinsics_1.HandlerStack(null, []), new IR.BasicBlock([new IR.Invoke(0, name, args.length), new IR.Return(0)]));
    const state = new intrinsics_1.State(universe, activation, universe.random);
    activation.stack.push.apply(activation.stack, args);
    const thread = new evaluation_1.Thread(state);
    const value = await thread.run_to_completion();
    return value;
}
exports.run_command = run_command;
async function run_prelude(universe) {
    for (const x of universe.world.prelude) {
        const activation = new intrinsics_1.CrochetActivation(null, x, x.env, intrinsics_1._done, new intrinsics_1.HandlerStack(null, []), x.body);
        const state = new intrinsics_1.State(universe, activation, universe.random);
        const thread = new evaluation_1.Thread(state);
        await thread.run_to_completion();
    }
}
exports.run_prelude = run_prelude;
async function run_test(universe, test) {
    const env = new intrinsics_1.Environment(test.env, null, test.module, null);
    const activation = new intrinsics_1.CrochetActivation(null, test, env, intrinsics_1._done, new intrinsics_1.HandlerStack(null, []), test.body);
    const state = new intrinsics_1.State(universe, activation, universe.random);
    const thread = new evaluation_1.Thread(state);
    const value = await thread.run_to_completion();
    return value;
}
exports.run_test = run_test;
async function run_block(universe, env, block) {
    const activation = new intrinsics_1.CrochetActivation(null, null, env, intrinsics_1._done, new intrinsics_1.HandlerStack(null, []), block);
    const state = new intrinsics_1.State(universe, activation, universe.random);
    const thread = new evaluation_1.Thread(state);
    const value = await thread.run_to_completion();
    return value;
}
exports.run_block = run_block;
function run_native_sync(universe, env, pkg, machine) {
    const fn = new intrinsics_1.NativeFunction(intrinsics_1.NativeTag.NATIVE_MACHINE, "(native)", pkg, () => machine);
    const activation = new intrinsics_1.NativeActivation(null, fn, env, machine, new intrinsics_1.HandlerStack(null, []), intrinsics_1._done);
    const state = new intrinsics_1.State(universe, activation, universe.random);
    const thread = new evaluation_1.Thread(state);
    const value = thread.run_synchronous();
    return value;
}
exports.run_native_sync = run_native_sync;
async function run_native(universe, env, pkg, machine) {
    const fn = new intrinsics_1.NativeFunction(intrinsics_1.NativeTag.NATIVE_MACHINE, "(native)", pkg, () => machine);
    const activation = new intrinsics_1.NativeActivation(null, fn, env, machine, new intrinsics_1.HandlerStack(null, []), intrinsics_1._done);
    const state = new intrinsics_1.State(universe, activation, universe.random);
    const thread = new evaluation_1.Thread(state);
    const value = await thread.run_to_completion();
    return value;
}
exports.run_native = run_native;

},{"../ir":9,"./evaluation":22,"./intrinsics":24}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mark_action_fired = exports.available_events = exports.available_actions = exports.add_event = exports.add_action = exports.define_context = exports.lookup_context = void 0;
const errors_1 = require("../errors");
const intrinsics_1 = require("../intrinsics");
const logic_1 = require("../logic");
const primitives_1 = require("../primitives");
const location_1 = require("../primitives/location");
function lookup_context(module, name) {
    if (name == null) {
        return module.pkg.world.global_context;
    }
    const context = module.contexts.try_lookup(name);
    if (context == null) {
        throw new errors_1.ErrArbitrary("undefined-context", `The context ${name} is not accessible from ${location_1.module_location(module)}`);
    }
    return context;
}
exports.lookup_context = lookup_context;
function define_context(module, context) {
    const result = module.pkg.contexts.define(context.name, context);
    if (!result) {
        throw new errors_1.ErrArbitrary(`duplicated-context`, `The context ${context.name} already exists in package ${module.pkg.name}`);
    }
    return result;
}
exports.define_context = define_context;
function add_action(module, context, action) {
    const result = module.pkg.actions.define(action.name, action);
    if (!result) {
        throw new errors_1.ErrArbitrary(`duplicated-action`, `The action ${action.name} already exists in package ${module.pkg.name}`);
    }
    context.actions.push(action);
}
exports.add_action = add_action;
function add_event(context, event) {
    context.events.push(event);
}
exports.add_event = add_event;
function* available_actions(context, state, env0, module, random, relations, actor) {
    const result = [];
    for (const action of context.actions) {
        if (!primitives_1.Types.fulfills_constraint(action.actor_type, actor.type)) {
            continue;
        }
        const action_value = primitives_1.Values.make_action(action, env0);
        const env = primitives_1.Environments.clone_with_receiver(env0, action_value);
        env.define(action.self_parameter, actor);
        const envs = yield* logic_1.search(state, env, module, random, relations, action.predicate);
        for (const e0 of envs) {
            const e1 = primitives_1.Environments.clone(e0);
            const score0 = yield new intrinsics_1.NSEvaluate(e1, action.rank_function);
            const score = primitives_1.Values.to_number(score0);
            result.push({
                action: action,
                env: e0,
                score: score,
            });
        }
    }
    return result;
}
exports.available_actions = available_actions;
function* available_events(context, state, env, module, random, relations) {
    const result = [];
    for (const event of context.events) {
        const envs = yield* logic_1.search(state, env, module, random, relations, event.predicate);
        for (const e of envs) {
            result.push({ event: event, env: e });
        }
    }
    return result;
}
exports.available_events = available_events;
function mark_action_fired(action, actor) {
    action.fired.add(actor);
}
exports.mark_action_fired = mark_action_fired;

},{"../errors":21,"../intrinsics":24,"../logic":25,"../primitives":36,"../primitives/location":39}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contexts = void 0;
const Contexts = require("./contexts");
exports.Contexts = Contexts;

},{"./contexts":50}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_simulation = void 0;
const IR = require("../../ir");
const logger_1 = require("../../utils/logger");
const utils_1 = require("../../utils/utils");
const intrinsics_1 = require("../intrinsics");
const primitives_1 = require("../primitives");
const contexts_1 = require("./contexts");
const logic_1 = require("../logic");
function* run_simulation(state) {
    const relations = setup_relations(state);
    state.rounds = 0n;
    while (true) {
        const active = yield* run_turn(state, relations);
        if (!active) {
            break;
        }
        state.rounds += 1n;
    }
    return primitives_1.Values.get_nothing(state.state.universe);
}
exports.run_simulation = run_simulation;
function* run_turn(state, relations) {
    const location = state.state.activation.location;
    const trace = state.state.universe.trace;
    let actions_fired = 0;
    let events_fired = 0;
    state.acted.clear();
    let actor = yield* next_actor(state);
    while (actor != null) {
        state.turn = actor;
        trace.publish_turn(location, actor);
        logger_1.logger.debug(`Turn ${primitives_1.Location.simple_value(actor)}`);
        const action = yield* pick_action(state, actor, relations);
        if (action != null) {
            actions_fired += 1;
            contexts_1.mark_action_fired(action.action, actor);
            trace.publish_action(location, action);
            logger_1.logger.debug(`Running action ${action.action.name}`);
            yield new intrinsics_1.NSEvaluate(action.env, action.action.body);
            const reactions = yield* contexts_1.available_events(state.context, state.state, state.env, state.module, state.random, relations);
            for (const reaction of reactions) {
                events_fired += 1;
                trace.publish_event(location, reaction);
                yield new intrinsics_1.NSEvaluate(reaction.env, reaction.event.body);
            }
        }
        state.acted.add(actor);
        const next_turn = yield* next_actor(state);
        const ended = yield* check_goal(state, actions_fired, events_fired, next_turn == null);
        logger_1.logger.debug(`Checked goal ${ended}`);
        logger_1.logger.debug(`Next turn ${primitives_1.Location.simple_value(next_turn ?? primitives_1.Values.get_nothing(state.state.universe))}`);
        if (ended) {
            trace.publish_goal_reached(location, state.goal);
            return false;
        }
        else {
            actor = next_turn;
        }
    }
    return actions_fired > 0;
}
function* next_actor(state) {
    const remaining = state.actors.filter((x) => !state.acted.has(x));
    if (remaining.length === 0) {
        return null;
    }
    else {
        return remaining[0];
    }
}
function* pick_action(state, actor, relations) {
    const actions = yield* contexts_1.available_actions(state.context, state.state, state.env, state.module, state.random, relations, actor);
    state.state.universe.trace.publish_action_choice(state.state.activation.location, actor, actions);
    const sorted_actions = actions.sort((a, b) => a.score - b.score);
    const signal = state.signals.try_lookup("pick-action: _ for: _");
    if (signal == null) {
        const choices = sorted_actions.map((x) => [x.score, x]);
        return state.random.random_weighted_choice(choices);
    }
    else {
        const choices = sorted_actions.map((x) => make_action_choice(state, x));
        const args = [primitives_1.Values.make_list(state.state.universe, choices), actor];
        const choice0 = yield* trigger_signal(state, signal, args);
        if (choice0.tag === intrinsics_1.Tag.NOTHING) {
            return null;
        }
        else {
            const choice = primitives_1.Values.get_action_choice(choice0);
            return choice;
        }
    }
}
function make_action_choice(state, choice) {
    const universe = state.state.universe;
    return primitives_1.Values.make_action_choice(universe, choice);
}
function* trigger_signal(state, signal, args) {
    const env = primitives_1.Environments.clone(state.env);
    for (const [k, v] of utils_1.zip(signal.parameters, args)) {
        env.define(k, v);
    }
    const result = yield new intrinsics_1.NSJump((parent) => new intrinsics_1.CrochetActivation(parent, signal, env, intrinsics_1._return, parent.handlers, signal.body));
    return result;
}
function* check_goal(state, actions, events, round_ended) {
    const goal = state.goal;
    switch (goal.tag) {
        case IR.SimulationGoalTag.ACTION_QUIESCENCE:
            return round_ended && actions === 0;
        case IR.SimulationGoalTag.EVENT_QUIESCENCE:
            return round_ended && events === 0;
        case IR.SimulationGoalTag.TOTAL_QUIESCENCE:
            return round_ended && events === 0 && actions === 0;
        case IR.SimulationGoalTag.PREDICATE: {
            const env = primitives_1.Environments.clone(state.env);
            const results = yield* logic_1.search(state.state, env, state.module, state.random, state.module.relations, goal.predicate);
            return results.length !== 0;
        }
        default:
            throw utils_1.unreachable(goal, `Goal`);
    }
}
function setup_relations(state) {
    return logic_1.Relation.make_functional_layer(state.module, new Map([
        [
            "_ simulate-turn",
            new intrinsics_1.ProceduralRelation((env, [pattern]) => {
                if (state.turn == null) {
                    return [];
                }
                else {
                    return logic_1.unify_all(env, [state.turn], pattern);
                }
            }, null),
        ],
        [
            "_ simulate-rounds-elapsed",
            new intrinsics_1.ProceduralRelation((env, [pattern]) => {
                const rounds = primitives_1.Values.make_integer(state.state.universe, state.rounds);
                return logic_1.unify_all(env, [rounds], pattern);
            }, null),
        ],
    ]));
}

},{"../../ir":9,"../../utils/logger":17,"../../utils/utils":18,"../intrinsics":24,"../logic":25,"../primitives":36,"./contexts":50}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEActionChoice = exports.TEGoalReached = exports.TETurn = exports.TEEvent = exports.TEAction = exports.TELog = exports.TEForget = exports.TEFact = exports.BaseTraceEvent = exports.TraceTag = void 0;
var TraceTag;
(function (TraceTag) {
    TraceTag[TraceTag["FACT"] = 0] = "FACT";
    TraceTag[TraceTag["FORGET"] = 1] = "FORGET";
    TraceTag[TraceTag["SIMULATION_TURN"] = 2] = "SIMULATION_TURN";
    TraceTag[TraceTag["SIMULATION_EVENT"] = 3] = "SIMULATION_EVENT";
    TraceTag[TraceTag["SIMULATION_ACTION"] = 4] = "SIMULATION_ACTION";
    TraceTag[TraceTag["SIMULATION_GOAL_REACHED"] = 5] = "SIMULATION_GOAL_REACHED";
    TraceTag[TraceTag["SIMULATION_ACTION_CHOICE"] = 6] = "SIMULATION_ACTION_CHOICE";
    TraceTag[TraceTag["LOG"] = 7] = "LOG";
})(TraceTag = exports.TraceTag || (exports.TraceTag = {}));
class BaseTraceEvent {
}
exports.BaseTraceEvent = BaseTraceEvent;
class TEFact extends BaseTraceEvent {
    constructor(location, relation, values) {
        super();
        this.location = location;
        this.relation = relation;
        this.values = values;
        this.tag = TraceTag.FACT;
    }
}
exports.TEFact = TEFact;
class TEForget extends BaseTraceEvent {
    constructor(location, relation, values) {
        super();
        this.location = location;
        this.relation = relation;
        this.values = values;
        this.tag = TraceTag.FORGET;
    }
}
exports.TEForget = TEForget;
class TELog extends BaseTraceEvent {
    constructor(category, log_tag, location, value) {
        super();
        this.category = category;
        this.log_tag = log_tag;
        this.location = location;
        this.value = value;
        this.tag = TraceTag.LOG;
    }
}
exports.TELog = TELog;
class TEAction extends BaseTraceEvent {
    constructor(location, choice) {
        super();
        this.location = location;
        this.choice = choice;
        this.tag = TraceTag.SIMULATION_ACTION;
    }
}
exports.TEAction = TEAction;
class TEEvent extends BaseTraceEvent {
    constructor(location, event) {
        super();
        this.location = location;
        this.event = event;
        this.tag = TraceTag.SIMULATION_EVENT;
    }
}
exports.TEEvent = TEEvent;
class TETurn extends BaseTraceEvent {
    constructor(location, turn) {
        super();
        this.location = location;
        this.turn = turn;
        this.tag = TraceTag.SIMULATION_TURN;
    }
}
exports.TETurn = TETurn;
class TEGoalReached extends BaseTraceEvent {
    constructor(location, goal) {
        super();
        this.location = location;
        this.goal = goal;
        this.tag = TraceTag.SIMULATION_GOAL_REACHED;
    }
}
exports.TEGoalReached = TEGoalReached;
class TEActionChoice extends BaseTraceEvent {
    constructor(location, turn, choices) {
        super();
        this.location = location;
        this.turn = turn;
        this.choices = choices;
        this.tag = TraceTag.SIMULATION_ACTION_CHOICE;
    }
}
exports.TEActionChoice = TEActionChoice;

},{}],54:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./events"), exports);
__exportStar(require("./trace"), exports);

},{"./events":53,"./trace":55}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetTrace = void 0;
const events_1 = require("./events");
class CrochetTrace {
    constructor() {
        this.subscribers = [];
    }
    subscribe(action) {
        this.subscribers.push(action);
    }
    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter((x) => x !== subscriber);
    }
    publish(event) {
        for (const f of this.subscribers) {
            f(event);
        }
    }
    publish_fact(location, relation, values) {
        this.publish(new events_1.TEFact(location, relation, values));
    }
    publish_forget(location, relation, values) {
        this.publish(new events_1.TEForget(location, relation, values));
    }
    publish_turn(location, turn) {
        this.publish(new events_1.TETurn(location, turn));
    }
    publish_action(location, choice) {
        this.publish(new events_1.TEAction(location, choice));
    }
    publish_event(location, event) {
        this.publish(new events_1.TEEvent(location, event));
    }
    publish_goal_reached(location, goal) {
        this.publish(new events_1.TEGoalReached(location, goal));
    }
    publish_action_choice(location, turn, choices) {
        this.publish(new events_1.TEActionChoice(location, turn, choices));
    }
}
exports.CrochetTrace = CrochetTrace;

},{"./events":53}],56:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{"sourceInterval":[297,301]},0],["param",{"sourceInterval":[303,306]},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{"sourceInterval":[326,330]},0],["param",{"sourceInterval":[332,335]},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{"sourceInterval":[372,376]},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{"sourceInterval":[378,381]},1],["param",{"sourceInterval":[382,386]},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{"sourceInterval":[477,481]},0],["param",{"sourceInterval":[483,486]},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{"sourceInterval":[506,510]},0],["param",{"sourceInterval":[512,515]},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{"sourceInterval":[552,556]},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{"sourceInterval":[558,561]},1],["param",{"sourceInterval":[562,566]},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);

},{"..":80}],57:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" OverrideRuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  OverrideRuleBody\n    = \"|\"? NonemptyListOf<OverrideTopLevelTerm, \"|\">\n\n  OverrideTopLevelTerm\n    = \"...\"  -- superSplice\n    | TopLevelTerm\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* &(\"\\n\" | end)  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,248]},null,[],["seq",{"sourceInterval":[188,235]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,235]},"OverrideRuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[255,305]},null,[],["seq",{"sourceInterval":[255,294]},["app",{"sourceInterval":[255,260]},"ident",[]],["opt",{"sourceInterval":[261,269]},["app",{"sourceInterval":[261,268]},"Formals",[]]],["terminal",{"sourceInterval":[281,285]},"+="],["app",{"sourceInterval":[286,294]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,305]},null,[],["alt",{"sourceInterval":[131,305]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,235]},"Rule_override",[]],["app",{"sourceInterval":[255,294]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[309,362]},null,[],["seq",{"sourceInterval":[324,362]},["opt",{"sourceInterval":[324,328]},["terminal",{"sourceInterval":[324,327]},"|"]],["app",{"sourceInterval":[329,362]},"NonemptyListOf",[["app",{"sourceInterval":[344,356]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[358,361]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[385,408]},null,[],["seq",{"sourceInterval":[385,397]},["app",{"sourceInterval":[385,388]},"Seq",[]],["app",{"sourceInterval":[389,397]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[366,418]},null,[],["alt",{"sourceInterval":[385,418]},["app",{"sourceInterval":[385,397]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[415,418]},"Seq",[]]]],"OverrideRuleBody":["define",{"sourceInterval":[422,491]},null,[],["seq",{"sourceInterval":[445,491]},["opt",{"sourceInterval":[445,449]},["terminal",{"sourceInterval":[445,448]},"|"]],["app",{"sourceInterval":[450,491]},"NonemptyListOf",[["app",{"sourceInterval":[465,485]},"OverrideTopLevelTerm",[]],["terminal",{"sourceInterval":[487,490]},"|"]]]]],"OverrideTopLevelTerm_superSplice":["define",{"sourceInterval":[522,543]},null,[],["terminal",{"sourceInterval":[522,527]},"..."]],"OverrideTopLevelTerm":["define",{"sourceInterval":[495,562]},null,[],["alt",{"sourceInterval":[522,562]},["app",{"sourceInterval":[522,527]},"OverrideTopLevelTerm_superSplice",[]],["app",{"sourceInterval":[550,562]},"TopLevelTerm",[]]]],"Formals":["define",{"sourceInterval":[566,606]},null,[],["seq",{"sourceInterval":[580,606]},["terminal",{"sourceInterval":[580,583]},"<"],["app",{"sourceInterval":[584,602]},"ListOf",[["app",{"sourceInterval":[591,596]},"ident",[]],["terminal",{"sourceInterval":[598,601]},","]]],["terminal",{"sourceInterval":[603,606]},">"]]],"Params":["define",{"sourceInterval":[610,647]},null,[],["seq",{"sourceInterval":[623,647]},["terminal",{"sourceInterval":[623,626]},"<"],["app",{"sourceInterval":[627,643]},"ListOf",[["app",{"sourceInterval":[634,637]},"Seq",[]],["terminal",{"sourceInterval":[639,642]},","]]],["terminal",{"sourceInterval":[644,647]},">"]]],"Alt":["define",{"sourceInterval":[651,685]},null,[],["app",{"sourceInterval":[661,685]},"NonemptyListOf",[["app",{"sourceInterval":[676,679]},"Seq",[]],["terminal",{"sourceInterval":[681,684]},"|"]]]],"Seq":["define",{"sourceInterval":[689,704]},null,[],["star",{"sourceInterval":[699,704]},["app",{"sourceInterval":[699,703]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[719,736]},null,[],["seq",{"sourceInterval":[719,727]},["app",{"sourceInterval":[719,723]},"Pred",[]],["terminal",{"sourceInterval":[724,727]},"*"]]],"Iter_plus":["define",{"sourceInterval":[743,760]},null,[],["seq",{"sourceInterval":[743,751]},["app",{"sourceInterval":[743,747]},"Pred",[]],["terminal",{"sourceInterval":[748,751]},"+"]]],"Iter_opt":["define",{"sourceInterval":[767,783]},null,[],["seq",{"sourceInterval":[767,775]},["app",{"sourceInterval":[767,771]},"Pred",[]],["terminal",{"sourceInterval":[772,775]},"?"]]],"Iter":["define",{"sourceInterval":[708,794]},null,[],["alt",{"sourceInterval":[719,794]},["app",{"sourceInterval":[719,727]},"Iter_star",[]],["app",{"sourceInterval":[743,751]},"Iter_plus",[]],["app",{"sourceInterval":[767,775]},"Iter_opt",[]],["app",{"sourceInterval":[790,794]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[809,824]},null,[],["seq",{"sourceInterval":[809,816]},["terminal",{"sourceInterval":[809,812]},"~"],["app",{"sourceInterval":[813,816]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[831,852]},null,[],["seq",{"sourceInterval":[831,838]},["terminal",{"sourceInterval":[831,834]},"&"],["app",{"sourceInterval":[835,838]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[798,862]},null,[],["alt",{"sourceInterval":[809,862]},["app",{"sourceInterval":[809,816]},"Pred_not",[]],["app",{"sourceInterval":[831,838]},"Pred_lookahead",[]],["app",{"sourceInterval":[859,862]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[876,892]},null,[],["seq",{"sourceInterval":[876,884]},["terminal",{"sourceInterval":[876,879]},"#"],["app",{"sourceInterval":[880,884]},"Base",[]]]],"Lex":["define",{"sourceInterval":[866,903]},null,[],["alt",{"sourceInterval":[876,903]},["app",{"sourceInterval":[876,884]},"Lex_lex",[]],["app",{"sourceInterval":[899,903]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[918,979]},null,[],["seq",{"sourceInterval":[918,963]},["app",{"sourceInterval":[918,923]},"ident",[]],["opt",{"sourceInterval":[924,931]},["app",{"sourceInterval":[924,930]},"Params",[]]],["not",{"sourceInterval":[932,963]},["alt",{"sourceInterval":[934,962]},["seq",{"sourceInterval":[934,948]},["opt",{"sourceInterval":[934,944]},["app",{"sourceInterval":[934,943]},"ruleDescr",[]]],["terminal",{"sourceInterval":[945,948]},"="]],["terminal",{"sourceInterval":[951,955]},":="],["terminal",{"sourceInterval":[958,962]},"+="]]]]],"Base_range":["define",{"sourceInterval":[986,1041]},null,[],["seq",{"sourceInterval":[986,1022]},["app",{"sourceInterval":[986,1001]},"oneCharTerminal",[]],["terminal",{"sourceInterval":[1002,1006]},".."],["app",{"sourceInterval":[1007,1022]},"oneCharTerminal",[]]]],"Base_terminal":["define",{"sourceInterval":[1048,1106]},null,[],["app",{"sourceInterval":[1048,1056]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[1113,1168]},null,[],["seq",{"sourceInterval":[1113,1124]},["terminal",{"sourceInterval":[1113,1116]},"("],["app",{"sourceInterval":[1117,1120]},"Alt",[]],["terminal",{"sourceInterval":[1121,1124]},")"]]],"Base":["define",{"sourceInterval":[907,1168]},null,[],["alt",{"sourceInterval":[918,1168]},["app",{"sourceInterval":[918,963]},"Base_application",[]],["app",{"sourceInterval":[986,1022]},"Base_range",[]],["app",{"sourceInterval":[1048,1056]},"Base_terminal",[]],["app",{"sourceInterval":[1113,1124]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1172,1231]},"a rule description",[],["seq",{"sourceInterval":[1210,1231]},["terminal",{"sourceInterval":[1210,1213]},"("],["app",{"sourceInterval":[1214,1227]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1228,1231]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1235,1266]},null,[],["star",{"sourceInterval":[1255,1266]},["seq",{"sourceInterval":[1256,1264]},["not",{"sourceInterval":[1256,1260]},["terminal",{"sourceInterval":[1257,1260]},")"]],["app",{"sourceInterval":[1261,1264]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1270,1338]},null,[],["seq",{"sourceInterval":[1285,1338]},["terminal",{"sourceInterval":[1285,1289]},"--"],["star",{"sourceInterval":[1290,1304]},["seq",{"sourceInterval":[1291,1302]},["not",{"sourceInterval":[1291,1296]},["terminal",{"sourceInterval":[1292,1296]},"\n"]],["app",{"sourceInterval":[1297,1302]},"space",[]]]],["app",{"sourceInterval":[1305,1309]},"name",[]],["star",{"sourceInterval":[1310,1324]},["seq",{"sourceInterval":[1311,1322]},["not",{"sourceInterval":[1311,1316]},["terminal",{"sourceInterval":[1312,1316]},"\n"]],["app",{"sourceInterval":[1317,1322]},"space",[]]]],["alt",{"sourceInterval":[1326,1337]},["terminal",{"sourceInterval":[1326,1330]},"\n"],["lookahead",{"sourceInterval":[1333,1337]},["terminal",{"sourceInterval":[1334,1337]},"}"]]]]],"name":["define",{"sourceInterval":[1342,1382]},"a name",[],["seq",{"sourceInterval":[1363,1382]},["app",{"sourceInterval":[1363,1372]},"nameFirst",[]],["star",{"sourceInterval":[1373,1382]},["app",{"sourceInterval":[1373,1381]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1386,1418]},null,[],["alt",{"sourceInterval":[1402,1418]},["terminal",{"sourceInterval":[1402,1405]},"_"],["app",{"sourceInterval":[1412,1418]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1422,1452]},null,[],["alt",{"sourceInterval":[1437,1452]},["terminal",{"sourceInterval":[1437,1440]},"_"],["app",{"sourceInterval":[1447,1452]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1456,1489]},"an identifier",[],["app",{"sourceInterval":[1485,1489]},"name",[]]],"terminal":["define",{"sourceInterval":[1493,1531]},null,[],["seq",{"sourceInterval":[1508,1531]},["terminal",{"sourceInterval":[1508,1512]},"\""],["star",{"sourceInterval":[1513,1526]},["app",{"sourceInterval":[1513,1525]},"terminalChar",[]]],["terminal",{"sourceInterval":[1527,1531]},"\""]]],"oneCharTerminal":["define",{"sourceInterval":[1535,1579]},null,[],["seq",{"sourceInterval":[1557,1579]},["terminal",{"sourceInterval":[1557,1561]},"\""],["app",{"sourceInterval":[1562,1574]},"terminalChar",[]],["terminal",{"sourceInterval":[1575,1579]},"\""]]],"terminalChar":["define",{"sourceInterval":[1583,1640]},null,[],["alt",{"sourceInterval":[1602,1640]},["app",{"sourceInterval":[1602,1612]},"escapeChar",[]],["seq",{"sourceInterval":[1619,1640]},["not",{"sourceInterval":[1619,1624]},["terminal",{"sourceInterval":[1620,1624]},"\\"]],["not",{"sourceInterval":[1625,1630]},["terminal",{"sourceInterval":[1626,1630]},"\""]],["not",{"sourceInterval":[1631,1636]},["terminal",{"sourceInterval":[1632,1636]},"\n"]],["app",{"sourceInterval":[1637,1640]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1683,1738]},null,[],["terminal",{"sourceInterval":[1683,1689]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1745,1802]},null,[],["terminal",{"sourceInterval":[1745,1751]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1809,1866]},null,[],["terminal",{"sourceInterval":[1809,1815]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1873,1928]},null,[],["terminal",{"sourceInterval":[1873,1878]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1935,1989]},null,[],["terminal",{"sourceInterval":[1935,1940]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1996,2056]},null,[],["terminal",{"sourceInterval":[1996,2001]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[2063,2112]},null,[],["terminal",{"sourceInterval":[2063,2068]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[2119,2178]},null,[],["seq",{"sourceInterval":[2119,2160]},["terminal",{"sourceInterval":[2119,2124]},"\\u"],["app",{"sourceInterval":[2125,2133]},"hexDigit",[]],["app",{"sourceInterval":[2134,2142]},"hexDigit",[]],["app",{"sourceInterval":[2143,2151]},"hexDigit",[]],["app",{"sourceInterval":[2152,2160]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[2185,2240]},null,[],["seq",{"sourceInterval":[2185,2208]},["terminal",{"sourceInterval":[2185,2190]},"\\x"],["app",{"sourceInterval":[2191,2199]},"hexDigit",[]],["app",{"sourceInterval":[2200,2208]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1644,2240]},"an escape sequence",[],["alt",{"sourceInterval":[1683,2240]},["app",{"sourceInterval":[1683,1689]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1745,1751]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1809,1815]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1873,1878]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1935,1940]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1996,2001]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[2063,2068]},"escapeChar_tab",[]],["app",{"sourceInterval":[2119,2160]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[2185,2208]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2244,2263]},null,[],["app",{"sourceInterval":[2256,2263]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2281,2327]},null,[],["seq",{"sourceInterval":[2281,2312]},["terminal",{"sourceInterval":[2281,2285]},"//"],["star",{"sourceInterval":[2286,2298]},["seq",{"sourceInterval":[2287,2296]},["not",{"sourceInterval":[2287,2292]},["terminal",{"sourceInterval":[2288,2292]},"\n"]],["app",{"sourceInterval":[2293,2296]},"any",[]]]],["lookahead",{"sourceInterval":[2299,2312]},["alt",{"sourceInterval":[2301,2311]},["terminal",{"sourceInterval":[2301,2305]},"\n"],["app",{"sourceInterval":[2308,2311]},"end",[]]]]]],"comment_multiLine":["define",{"sourceInterval":[2334,2370]},null,[],["seq",{"sourceInterval":[2334,2356]},["terminal",{"sourceInterval":[2334,2338]},"/*"],["star",{"sourceInterval":[2339,2351]},["seq",{"sourceInterval":[2340,2349]},["not",{"sourceInterval":[2340,2345]},["terminal",{"sourceInterval":[2341,2345]},"*/"]],["app",{"sourceInterval":[2346,2349]},"any",[]]]],["terminal",{"sourceInterval":[2352,2356]},"*/"]]],"comment":["define",{"sourceInterval":[2267,2370]},null,[],["alt",{"sourceInterval":[2281,2370]},["app",{"sourceInterval":[2281,2312]},"comment_singleLine",[]],["app",{"sourceInterval":[2334,2356]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2374,2389]},null,[],["star",{"sourceInterval":[2383,2389]},["app",{"sourceInterval":[2383,2388]},"token",[]]]],"token":["define",{"sourceInterval":[2393,2469]},null,[],["alt",{"sourceInterval":[2401,2469]},["app",{"sourceInterval":[2401,2409]},"caseName",[]],["app",{"sourceInterval":[2412,2419]},"comment",[]],["app",{"sourceInterval":[2422,2427]},"ident",[]],["app",{"sourceInterval":[2430,2438]},"operator",[]],["app",{"sourceInterval":[2441,2452]},"punctuation",[]],["app",{"sourceInterval":[2455,2463]},"terminal",[]],["app",{"sourceInterval":[2466,2469]},"any",[]]]],"operator":["define",{"sourceInterval":[2473,2538]},null,[],["alt",{"sourceInterval":[2484,2538]},["terminal",{"sourceInterval":[2484,2488]},"<:"],["terminal",{"sourceInterval":[2491,2494]},"="],["terminal",{"sourceInterval":[2497,2501]},":="],["terminal",{"sourceInterval":[2504,2508]},"+="],["terminal",{"sourceInterval":[2511,2514]},"*"],["terminal",{"sourceInterval":[2517,2520]},"+"],["terminal",{"sourceInterval":[2523,2526]},"?"],["terminal",{"sourceInterval":[2529,2532]},"~"],["terminal",{"sourceInterval":[2535,2538]},"&"]]],"punctuation":["define",{"sourceInterval":[2542,2578]},null,[],["alt",{"sourceInterval":[2556,2578]},["terminal",{"sourceInterval":[2556,2559]},"<"],["terminal",{"sourceInterval":[2562,2565]},">"],["terminal",{"sourceInterval":[2568,2571]},","],["terminal",{"sourceInterval":[2574,2578]},"--"]]]}]);

},{"..":80}],58:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"},"OperationsAndAttributes",null,"AttributeSignature",{"AttributeSignature":["define",{"sourceInterval":[29,58]},null,[],["app",{"sourceInterval":[54,58]},"name",[]]],"OperationSignature":["define",{"sourceInterval":[62,100]},null,[],["seq",{"sourceInterval":[87,100]},["app",{"sourceInterval":[87,91]},"name",[]],["opt",{"sourceInterval":[92,100]},["app",{"sourceInterval":[92,99]},"Formals",[]]]]],"Formals":["define",{"sourceInterval":[104,143]},null,[],["seq",{"sourceInterval":[118,143]},["terminal",{"sourceInterval":[118,121]},"("],["app",{"sourceInterval":[122,139]},"ListOf",[["app",{"sourceInterval":[129,133]},"name",[]],["terminal",{"sourceInterval":[135,138]},","]]],["terminal",{"sourceInterval":[140,143]},")"]]],"name":["define",{"sourceInterval":[147,187]},"a name",[],["seq",{"sourceInterval":[168,187]},["app",{"sourceInterval":[168,177]},"nameFirst",[]],["star",{"sourceInterval":[178,187]},["app",{"sourceInterval":[178,186]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[191,223]},null,[],["alt",{"sourceInterval":[207,223]},["terminal",{"sourceInterval":[207,210]},"_"],["app",{"sourceInterval":[217,223]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[227,257]},null,[],["alt",{"sourceInterval":[242,257]},["terminal",{"sourceInterval":[242,245]},"_"],["app",{"sourceInterval":[252,257]},"alnum",[]]]]}]);

},{"..":80}],59:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const assert = require('../src/common').assert;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Helpers

function getProp(name, thing, fn) {
  return fn(thing[name]);
}

function mapProp(name, thing, fn) {
  return thing[name].map(fn);
}

// Returns a function that will walk a single property of a node.
// `descriptor` is a string indicating the property name, optionally ending
// with '[]' (e.g., 'children[]').
function getPropWalkFn(descriptor) {
  const parts = descriptor.split(/ ?\[\]/);
  if (parts.length === 2) {
    return mapProp.bind(null, parts[0]);
  }
  return getProp.bind(null, descriptor);
}

function getProps(walkFns, thing, fn) {
  return walkFns.map(walkFn => walkFn(thing, fn));
}

function getWalkFn(shape) {
  if (typeof shape === 'string') {
    return getProps.bind(null, [getPropWalkFn(shape)]);
  } else if (Array.isArray(shape)) {
    return getProps.bind(null, shape.map(getPropWalkFn));
  } else {
    assert(typeof shape === 'function', 'Expected a string, Array, or function');
    assert(shape.length === 2, 'Expected a function of arity 2, got ' + shape.length);
    return shape;
  }
}

function isRestrictedIdentifier(str) {
  return /^[a-zA-Z_][0-9a-zA-Z_]*$/.test(str);
}

function trim(s) {
  return s.trim();
}

function parseSignature(sig) {
  const parts = sig.split(/[()]/).map(trim);
  if (parts.length === 3 && parts[2] === '') {
    const name = parts[0];
    let params = [];
    if (parts[1].length > 0) {
      params = parts[1].split(',').map(trim);
    }
    if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
      return {name, formals: params};
    }
  }
  throw new Error('Invalid operation signature: ' + sig);
}

/*
  A VisitorFamily contains a set of recursive operations that are defined over some kind of
  tree structure. The `config` parameter specifies how to walk the tree:
  - 'getTag' is function which, given a node in the tree, returns the node's 'tag' (type)
  - 'shapes' an object that maps from a tag to a value that describes how to recursively
    evaluate the operation for nodes of that type. The value can be:
    * a string indicating the property name that holds that node's only child
    * an Array of property names (or an empty array indicating a leaf type), or
    * a function taking two arguments (node, fn), and returning an Array which is the result
      of apply `fn` to each of the node's children.
 */
function VisitorFamily(config) {
  this._shapes = config.shapes;
  this._getTag = config.getTag;

  this.Adapter = function(thing, family) {
    this._adaptee = thing;
    this._family = family;
  };
  this.Adapter.prototype.valueOf = function() {
    throw new Error('heeey!');
  };
  this.operations = {};

  this._arities = Object.create(null);
  this._getChildren = Object.create(null);

  const self = this;
  Object.keys(this._shapes).forEach(k => {
    const shape = self._shapes[k];
    self._getChildren[k] = getWalkFn(shape);

    // A function means the arity isn't fixed, so don't put an entry in the arity map.
    if (typeof shape !== 'function') {
      self._arities[k] = Array.isArray(shape) ? shape.length : 1;
    }
  });
  this._wrap = function(thing) { return new self.Adapter(thing, self); };
}

VisitorFamily.prototype.wrap = function(thing) {
  return this._wrap(thing);
};

VisitorFamily.prototype._checkActionDict = function(dict) {
  const self = this;
  Object.keys(dict).forEach(k => {
    assert(k in self._getChildren, "Unrecognized action name '" + k + "'");
    const action = dict[k];
    assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
    if (k in self._arities) {
      const expected = self._arities[k];
      const actual = dict[k].length;
      assert(actual === expected,
          "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
    }
  });
};

VisitorFamily.prototype.addOperation = function(signature, actions) {
  const sig = parseSignature(signature);
  const name = sig.name;
  this._checkActionDict(actions);
  this.operations[name] = {
    name,
    formals: sig.formals,
    actions
  };

  const family = this;
  this.Adapter.prototype[name] = function() {
    const tag = family._getTag(this._adaptee);
    assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
    assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'");

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    const args = Object.create(null);
    for (let i = 0; i < arguments.length; i++) {
      args[sig.formals[i]] = arguments[i];
    }

    const oldArgs = this.args;
    this.args = args;
    const ans = actions[tag].apply(this, family._getChildren[tag](this._adaptee, family._wrap));
    this.args = oldArgs;
    return ans;
  };
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = VisitorFamily;

},{"../src/common":78}],60:[function(require,module,exports){
'use strict';

module.exports = {
  VisitorFamily: require('./VisitorFamily'),
  semanticsForToAST: require('./semantics-toAST').semantics,
  toAST: require('./semantics-toAST').helper
};

},{"./VisitorFamily":59,"./semantics-toAST":61}],61:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const pexprs = require('../src/pexprs');
const MatchResult = require('../src/MatchResult');
const Grammar = require('../src/Grammar');
const extend = require('util-extend');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

const defaultOperation = {
  _terminal() {
    return this.primitiveValue;
  },

  _nonterminal(children) {
    const ctorName = this._node.ctorName;
    const mapping = this.args.mapping;

    // without customization
    if (!mapping.hasOwnProperty(ctorName)) {
      // intermediate node
      if (this._node instanceof pexprs.Alt || this._node instanceof pexprs.Apply) {
        return children[0].toAST(mapping);
      }

      // lexical rule
      if (this.isLexical()) {
        return this.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(child => !child.isTerminal());
      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      }

      // rest: terms with multiple children
    }

    // direct forward
    if (typeof mapping[ctorName] === 'number') {
      return children[mapping[ctorName]].toAST(mapping);
    }

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    const propMap = mapping[ctorName] || children;
    const node = {
      type: ctorName
    };
    for (const prop in propMap) {
      const mappedProp = mapping[ctorName] && mapping[ctorName][prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if ((typeof mappedProp === 'string') || (typeof mappedProp === 'boolean') ||
          (mappedProp === null)) {
        // primitive value
        node[prop] = mappedProp;
      } else if ((typeof mappedProp === 'object') && (mappedProp instanceof Number)) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        node[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          node[prop] = children[prop].toAST(mapping);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete node[prop];
        }
      }
    }
    return node;
  },

  _iter(children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST(this.args.mapping);
      }
    }

    return children.map(function(child) {
      return child.toAST(this.args.mapping);
    }, this);
  },

  NonemptyListOf(first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
  },

  EmptyListOf() {
    return [];
  }
};

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
function toAST(res, mapping) {
  if (!(res instanceof MatchResult) || res.failed()) {
    throw new Error('toAST() expects a succesfull MatchResult as first parameter');
  }

  mapping = extend({}, mapping);
  const operation = extend({}, defaultOperation);
  for (const termName in mapping) {
    if (typeof mapping[termName] === 'function') {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  const g = res._cst.grammar;
  const s = g.createSemantics().addOperation('toAST(mapping)', operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error('semanticsToAST() expects a Grammar as parameter');
  }

  return g.createSemantics().addOperation('toAST(mapping)', defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};

},{"../src/Grammar":67,"../src/MatchResult":71,"../src/pexprs":98,"util-extend":102}],62:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

},{}],63:[function(require,module,exports){
module.exports={
  "name": "ohm-js",
  "version": "15.5.0",
  "description": "An object-oriented language for parsing and pattern matching",
  "repository": "https://github.com/harc/ohm",
  "keywords": [
    "parser",
    "compiler",
    "pattern matching",
    "pattern-matching",
    "ometa",
    "ometa/js",
    "ometa-js",
    "ometajs",
    "rapid",
    "prototyping"
  ],
  "homepage": "https://ohmlang.github.io/",
  "bugs": "https://github.com/harc/ohm/issues",
  "main": "src/main.js",
  "bin": "src/ohm-cmd.js",
  "types": "index.d.ts",
  "scripts": {
    "prebootstrap": "bash bin/prebootstrap",
    "bootstrap": "bash bin/bootstrap --test || (echo 'Bootstrap failed.' && mv -v dist/ohm-grammar.js.old dist/ohm-grammar.js && mv -v dist/built-in-rules.js.old dist/built-in-rules.js && mv -v dist/operations-and-attributes.js.old dist/operations-and-attributes.js)",
    "build": "yarn build-debug && webpack --mode=production",
    "prebuild-debug": "bash ../bin/update-env.sh",
    "build-debug": "webpack --mode=development",
    "clean": "rm -f dist/ohm.js dist/ohm.min.js",
    "lint": "eslint . --ignore-path ../.eslintignore",
    "pretest": "bash ../bin/update-env.sh",
    "test": "ava && ava --config ava-ts.config.js test/test-typings.ts",
    "test-watch": "ava --watch",
    "pre-commit": "yarn run lint && yarn run build && yarn run test",
    "prepublishOnly": "cp ../README.md .",
    "postpublish": "rm README.md",
    "postinstall": "node bin/dev-setup.js",
    "unsafe-bootstrap": "bash bin/bootstrap",
    "version-package": "bash bin/version",
    "watch": "webpack --mode=development --watch"
  },
  "license": "MIT",
  "author": "Alex Warth <alexwarth@gmail.com> (http://tinlizzie.org/~awarth)",
  "contributors": [
    "Patrick Dubroy <pdubroy@gmail.com>",
    "Meixian Li <lmeixian@gmail.com>",
    "Marko Röder <m.roeder@photon-software.de>",
    "Tony Garnock-Jones <tonygarnockjones@gmail.com>",
    "Saketh Kasibatla <sake.kasi@gmail.com>",
    "Lionel Landwerlin <llandwerlin@gmail.com>",
    "Ray Toal <rtoal@lmu.edu>",
    "Jason Merrill <jwmerrill@gmail.com>",
    "Yoshiki Ohshima <Yoshiki.Ohshima@acm.org>",
    "stagas <gstagas@gmail.com>",
    "Jonathan Edwards <JonathanMEdwards@gmail.com>",
    "Neil Jewers <njjewers@uwaterloo.ca>",
    "Luca Guzzon <luca.guzzon@gmail.com>",
    "Milan Lajtoš <milan.lajtos@me.com>",
    "AngryPowman <angrypowman@qq.com>",
    "Leslie Ying <acetophore@users.noreply.github.com>",
    "Pierre Donias <pierre.donias@gmail.com>",
    "Justin Chase <justin.m.chase@gmail.com>",
    "Daniel Tomlinson <DanielTomlinson@me.com>",
    "Stan Rozenraukh <stan@stanistan.com>",
    "Stephan Seidt <stephan.seidt@gmail.com>",
    "Szymon Kaliski <kaliskiszymon@gmail.com>",
    "Thomas Nyberg <tomnyberg@gmail.com>",
    "Casey Olson <casey.m.olson@gmail.com>",
    "Vse Mozhet Byt <vsemozhetbyt@gmail.com>",
    "Wil Chung <10446+iamwilhelm@users.noreply.github.com>",
    "Arthur Carabott <arthurc@gmail.com>",
    "abego <ub@abego-software.de>",
    "acslk <d_vd415@hotmail.com>",
    "codeZeilen <codeZeilen@users.noreply.github.com>",
    "owch <bowenrainyday@gmail.com>",
    "sfinnie <scott.finnie@gmail.com>",
    "Mike Niebling <(none)>"
  ],
  "dependencies": {
    "is-buffer": "^2.0.4",
    "util-extend": "^1.0.3"
  },
  "devDependencies": {
    "ava": "^3.15.0",
    "ava-spec": "^1.1.1",
    "eslint": "^7.9.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-ava": "^11.0.0",
    "eslint-plugin-camelcase-ohm": "^0.2.1",
    "eslint-plugin-no-extension-in-require": "^0.2.0",
    "husky": "^4.2.5",
    "jsdom": "^9.9.1",
    "json": "^9.0.6",
    "markscript": "^0.5.0",
    "node-static": "^0.7.11",
    "ohm-grammar-ecmascript": "^0.5.0",
    "ts-loader": "^8.0.4",
    "ts-node": "^9.0.0",
    "typescript": "^4.0.3",
    "walk-sync": "^2.2.0",
    "webpack": "^4.44.2",
    "webpack-cli": "^3.3.12"
  },
  "engines": {
    "node": ">=0.12.1"
  }
}

},{}],64:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const GrammarDecl = require('./GrammarDecl');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {}

Builder.prototype = {
  currentDecl: null,
  currentRuleName: null,

  newGrammar(name) {
    return new GrammarDecl(name);
  },

  grammar(metaInfo, name, superGrammar, defaultStartRule, rules) {
    const gDecl = new GrammarDecl(name);
    if (superGrammar) {
      gDecl.withSuperGrammar(this.fromRecipe(superGrammar));
    }
    if (defaultStartRule) {
      gDecl.withDefaultStartRule(defaultStartRule);
    }
    if (metaInfo && metaInfo.source) {
      gDecl.withSource(metaInfo.source);
    }

    this.currentDecl = gDecl;
    Object.keys(rules).forEach(ruleName => {
      this.currentRuleName = ruleName;
      const ruleRecipe = rules[ruleName];

      const action = ruleRecipe[0]; // define/extend/override
      const metaInfo = ruleRecipe[1];
      const description = ruleRecipe[2];
      const formals = ruleRecipe[3];
      const body = this.fromRecipe(ruleRecipe[4]);

      let source;
      if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
        source = gDecl.source.subInterval(
            metaInfo.sourceInterval[0],
            metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
      }
      gDecl[action](ruleName, formals, body, description, source);
    });
    this.currentRuleName = this.currentDecl = null;
    return gDecl.build();
  },

  terminal(x) {
    return new pexprs.Terminal(x);
  },

  range(from, to) {
    return new pexprs.Range(from, to);
  },

  param(index) {
    return new pexprs.Param(index);
  },

  alt(/* term1, term2, ... */) {
    let terms = [];
    for (let idx = 0; idx < arguments.length; idx++) {
      let arg = arguments[idx];
      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }
      if (arg instanceof pexprs.Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
  },

  seq(/* factor1, factor2, ... */) {
    let factors = [];
    for (let idx = 0; idx < arguments.length; idx++) {
      let arg = arguments[idx];
      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }
      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },

  star(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Star(expr);
  },

  plus(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Plus(expr);
  },

  opt(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Opt(expr);
  },

  not(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Not(expr);
  },

  la(expr) {
    // TODO: temporary to still be able to read old recipes
    return this.lookahead(expr);
  },

  lookahead(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lookahead(expr);
  },

  lex(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lex(expr);
  },

  app(ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function(param) {
        return param instanceof pexprs.PExpr ? param :
          this.fromRecipe(param);
      }, this);
    }
    return new pexprs.Apply(ruleName, optParams);
  },

  // Note that unlike other methods in this class, this method cannot be used as a
  // convenience constructor. It only works with recipes, because it relies on
  // `this.currentDecl` and `this.currentRuleName` being set.
  splice(beforeTerms, afterTerms) {
    return new pexprs.Splice(
        this.currentDecl.superGrammar,
        this.currentRuleName,
        beforeTerms.map(term => this.fromRecipe(term)),
        afterTerms.map(term => this.fromRecipe(term)));
  },

  fromRecipe(recipe) {
    // the meta-info of 'grammar' is processed in Builder.grammar
    const result = this[recipe[0]].apply(this,
      recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));

    const metaInfo = recipe[1];
    if (metaInfo) {
      if (metaInfo.sourceInterval && this.currentDecl) {
        result.withSource(
            this.currentDecl.sourceInterval.apply(this.currentDecl, metaInfo.sourceInterval)
        );
      }
    }
    return result;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;

},{"./GrammarDecl":68,"./pexprs":98}],65:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Failure = require('./Failure');
const TerminalNode = require('./nodes').TerminalNode;
const assert = require('./common').assert;
const {PExpr, Terminal} = require('./pexprs');

class CaseInsensitiveTerminal extends PExpr {
  constructor(param) {
    super();
    this.obj = param;
  }

  _getString(state) {
    const terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof Terminal, 'expected a Terminal expression');
    return terminal.obj;
  }

  // Implementation of the PExpr API

  allowsSkippingPrecedingSpace() {
    return true;
  }

  eval(state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const matchStr = this._getString(state);
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
      return true;
    }
  }

  generateExample(grammar, examples, inSyntacticContext, actuals) {
    // Start with a example generated from the Terminal...
    const str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value;

    // ...and randomly switch characters to uppercase/lowercase.
    let value = '';
    for (let i = 0; i < str.length; ++i) {
      value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
    }
    return {value};
  }

  getArity() {
    return 1;
  }

  substituteParams(actuals) {
    return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  }

  toDisplayString() {
    return this.obj.toDisplayString() + ' (case-insensitive)';
  }

  toFailure(grammar) {
    return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
  }

  _isNullable(grammar, memo) {
    return this.obj._isNullable(grammar, memo);
  }
}

module.exports = CaseInsensitiveTerminal;

},{"./Failure":66,"./common":78,"./nodes":81,"./pexprs":98}],66:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

/*
  `Failure`s represent expressions that weren't matched while parsing. They are used to generate
  error messages automatically. The interface of `Failure`s includes the collowing methods:

  - getText() : String
  - getType() : String  (one of {"description", "string", "code"})
  - isDescription() : bool
  - isStringTerminal() : bool
  - isCode() : bool
  - isFluffy() : bool
  - makeFluffy() : void
  - subsumes(Failure) : bool
*/

function isValidType(type) {
  return type === 'description' || type === 'string' || type === 'code';
}

function Failure(pexpr, text, type) {
  if (!isValidType(type)) {
    throw new Error('invalid Failure type: ' + type);
  }
  this.pexpr = pexpr;
  this.text = text;
  this.type = type;
  this.fluffy = false;
}

Failure.prototype.getPExpr = function() {
  return this.pexpr;
};

Failure.prototype.getText = function() {
  return this.text;
};

Failure.prototype.getType = function() {
  return this.type;
};

Failure.prototype.isDescription = function() {
  return this.type === 'description';
};

Failure.prototype.isStringTerminal = function() {
  return this.type === 'string';
};

Failure.prototype.isCode = function() {
  return this.type === 'code';
};

Failure.prototype.isFluffy = function() {
  return this.fluffy;
};

Failure.prototype.makeFluffy = function() {
  this.fluffy = true;
};

Failure.prototype.clearFluffy = function() {
  this.fluffy = false;
};

Failure.prototype.subsumes = function(that) {
  return this.getText() === that.getText() &&
      this.type === that.type &&
      (!this.isFluffy() || this.isFluffy() && that.isFluffy());
};

Failure.prototype.toString = function() {
  return this.type === 'string' ?
    JSON.stringify(this.getText()) :
    this.getText();
};

Failure.prototype.clone = function() {
  const failure = new Failure(this.pexpr, this.text, this.type);
  if (this.isFluffy()) {
    failure.makeFluffy();
  }
  return failure;
};

Failure.prototype.toKey = function() {
  return this.toString() + '#' + this.type;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Failure;

},{}],67:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const CaseInsensitiveTerminal = require('./CaseInsensitiveTerminal');
const Matcher = require('./Matcher');
const Semantics = require('./Semantics');
const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getSortedRuleValues(grammar) {
  return Object.keys(grammar.rules).sort().map(name => grammar.rules[name]);
}

function Grammar(
    name,
    superGrammar,
    rules,
    optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.rules = rules;
  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in rules)) {
      throw new Error("Invalid start rule: '" + optDefaultStartRule +
                      "' is not a rule in grammar '" + name + "'");
    }
    this.defaultStartRule = optDefaultStartRule;
  }
}

let ohmGrammar;
let buildGrammar;

// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function(grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  matcher() {
    return new Matcher(this);
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  equals(g) {
    if (this === g) {
      return true;
    }
    // Do the cheapest comparisons first.
    if (g == null ||
        this.name !== g.name ||
        this.defaultStartRule !== g.defaultStartRule ||
        !(this.superGrammar === g.superGrammar || this.superGrammar.equals(g.superGrammar))) {
      return false;
    }
    const myRules = getSortedRuleValues(this);
    const otherRules = getSortedRuleValues(g);
    return myRules.length === otherRules.length && myRules.every((rule, i) => {
      return rule.description === otherRules[i].description &&
             rule.formals.join(',') === otherRules[i].formals.join(',') &&
             rule.body.toString() === otherRules[i].body.toString();
    });
  },

  match(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  },

  trace(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  },

  semantics() {
    // TODO: Remove this eventually! Deprecated in v0.12.
    throw new Error('semantics() is deprecated -- use createSemantics() instead.');
  },

  createSemantics() {
    return Semantics.createSemantics(this);
  },

  extendSemantics(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict(what, name, actionDict) {
    function isSpecialAction(a) {
      return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
    }

    const problems = [];
    for (const k in actionDict) {
      const v = actionDict[k];
      if (!isSpecialAction(k) && !(k in this.rules)) {
        problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
      } else if (typeof v !== 'function') {
        problems.push(
            "'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
      } else {
        const actual = v.length;
        const expected = this._topDownActionArity(k);
        if (actual !== expected) {
          problems.push(
              "Semantic action '" + k + "' has the wrong arity: " +
              'expected ' + expected + ', got ' + actual);
        }
      }
    }
    if (problems.length > 0) {
      const prettyProblems = problems.map(problem => '- ' + problem);
      const error = new Error(
          "Found errors in the action dictionary of the '" + name + "' " + what + ':\n' +
          prettyProblems.join('\n'));
      error.problems = problems;
      throw error;
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(actionName) {
    if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }
    return this.rules[actionName].body.getArity();
  },

  _inheritsFrom(grammar) {
    let g = this.superGrammar;
    while (g) {
      if (g.equals(grammar, true)) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe(optVarName) {
    const metaInfo = {};
    // Include the grammar source if it is available.
    if (this.source) {
      metaInfo.source = this.source.contents;
    }

    let superGrammar = null;
    if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammar = JSON.parse(this.superGrammar.toRecipe());
    }

    let startRule = null;
    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }

    const rules = {};
    const self = this;
    Object.keys(this.rules).forEach(ruleName => {
      const ruleInfo = self.rules[ruleName];
      const body = ruleInfo.body;
      const isDefinition = !self.superGrammar || !self.superGrammar.rules[ruleName];

      let operation;
      if (isDefinition) {
        operation = 'define';
      } else {
        operation = body instanceof pexprs.Extend ? 'extend' : 'override';
      }

      const metaInfo = {};
      if (ruleInfo.source && self.source) {
        const adjusted = ruleInfo.source.relativeTo(self.source);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }

      const description = isDefinition ? ruleInfo.description : null;
      const bodyRecipe = body.outputRecipe(ruleInfo.formals, self.source);

      rules[ruleName] = [
        operation, // "define"/"extend"/"override"
        metaInfo,
        description,
        ruleInfo.formals,
        bodyRecipe
      ];
    });

    return JSON.stringify([
      'grammar',
      metaInfo,
      this.name,
      superGrammar,
      startRule,
      rules
    ]);
  },

  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },

  _toOperationOrAttributeActionDictionaryTemplate() {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    const sb = new common.StringBuffer();
    sb.append('{');

    let first = true;
    for (const ruleName in this.rules) {
      const body = this.rules[ruleName].body;
      if (first) {
        first = false;
      } else {
        sb.append(',');
      }
      sb.append('\n');
      sb.append('  ');
      this.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },

  addSemanticActionTemplate(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    const arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },

  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(str) {
    let app;
    if (str.indexOf('<') === -1) {
      // simple application
      app = new pexprs.Apply(str);
    } else {
      // parameterized application
      const cst = ohmGrammar.match(str, 'Base_application');
      app = buildGrammar(cst, {});
    }

    // Ensure that the application is valid.
    if (!(app.ruleName in this.rules)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    }
    const formals = this.rules[app.ruleName].formals;
    if (formals.length !== app.args.length) {
      const source = this.rules[app.ruleName].source;
      throw errors.wrongNumberOfParameters(app.ruleName, formals.length, app.args.length, source);
    }
    return app;
  }
};

// The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.
Grammar.ProtoBuiltInRules = new Grammar(
    'ProtoBuiltInRules', // name
    undefined, // supergrammar
    {
      any: {
        body: pexprs.any,
        formals: [],
        description: 'any character',
        primitive: true
      },
      end: {
        body: pexprs.end,
        formals: [],
        description: 'end of input',
        primitive: true
      },

      caseInsensitive: {
        body: new CaseInsensitiveTerminal(new pexprs.Param(0)),
        formals: ['str'],
        primitive: true
      },
      lower: {
        body: new pexprs.UnicodeChar('Ll'),
        formals: [],
        description: 'a lowercase letter',
        primitive: true
      },
      upper: {
        body: new pexprs.UnicodeChar('Lu'),
        formals: [],
        description: 'an uppercase letter',
        primitive: true
      },
      // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
      unicodeLtmo: {
        body: new pexprs.UnicodeChar('Ltmo'),
        formals: [],
        description: 'a Unicode character in Lt, Lm, or Lo',
        primitive: true
      },

      // These rules are not truly primitive (they could be written in userland) but are defined
      // here for bootstrapping purposes.
      spaces: {
        body: new pexprs.Star(new pexprs.Apply('space')),
        formals: []
      },
      space: {
        body: new pexprs.Range('\x00', ' '),
        formals: [],
        description: 'a space'
      }
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

},{"./CaseInsensitiveTerminal":65,"./Matcher":73,"./Semantics":76,"./common":78,"./errors":79,"./pexprs":98}],68:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Grammar = require('./Grammar');
const InputStream = require('./InputStream');
const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Constructors

function GrammarDecl(name) {
  this.name = name;
}

// Helpers

GrammarDecl.prototype.sourceInterval = function(startIdx, endIdx) {
  return this.source.subInterval(startIdx, endIdx - startIdx);
};

GrammarDecl.prototype.ensureSuperGrammar = function() {
  if (!this.superGrammar) {
    this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === 'BuiltInRules' ?
            Grammar.ProtoBuiltInRules :
            Grammar.BuiltInRules);
  }
  return this.superGrammar;
};

GrammarDecl.prototype.ensureSuperGrammarRuleForOverriding = function(name, source) {
  const ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
  }
  return ruleInfo;
};

GrammarDecl.prototype.installOverriddenOrExtendedRule = function(name, formals, body, source) {
  const duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  const ruleInfo = this.ensureSuperGrammar().rules[name];
  const expectedFormals = ruleInfo.formals;
  const expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
  if (formals.length !== expectedNumFormals) {
    throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
  }
  return this.install(name, formals, body, ruleInfo.description, source);
};

GrammarDecl.prototype.install = function(name, formals, body, description, source) {
  this.rules[name] = {
    body: body.introduceParams(formals),
    formals,
    description,
    source
  };
  return this;
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(superGrammar) {
  if (this.superGrammar) {
    throw new Error('the super grammar of a GrammarDecl cannot be set more than once');
  }
  this.superGrammar = superGrammar;
  this.rules = Object.create(superGrammar.rules);

  // Grammars with an explicit supergrammar inherit a default start rule.
  if (!superGrammar.isBuiltIn()) {
    this.defaultStartRule = superGrammar.defaultStartRule;
  }
  return this;
};

GrammarDecl.prototype.withDefaultStartRule = function(ruleName) {
  this.defaultStartRule = ruleName;
  return this;
};

GrammarDecl.prototype.withSource = function(source) {
  this.source = new InputStream(source).interval(0, source.length);
  return this;
};

// Creates a Grammar instance, and if it passes the sanity checks, returns it.
GrammarDecl.prototype.build = function() {
  const grammar = new Grammar(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule);

  // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.
  const grammarErrors = [];
  let grammarHasInvalidApplications = false;
  Object.keys(grammar.rules).forEach(ruleName => {
    const body = grammar.rules[ruleName].body;
    try {
      body.assertChoicesHaveUniformArity(ruleName);
    } catch (e) {
      grammarErrors.push(e);
    }
    try {
      body.assertAllApplicationsAreValid(ruleName, grammar);
    } catch (e) {
      grammarErrors.push(e);
      grammarHasInvalidApplications = true;
    }
  });
  if (!grammarHasInvalidApplications) {
    // The following check can only be done if the grammar has no invalid applications.
    Object.keys(grammar.rules).forEach(ruleName => {
      const body = grammar.rules[ruleName].body;
      try {
        body.assertIteratedExprsAreNotNullable(grammar, []);
      } catch (e) {
        grammarErrors.push(e);
      }
    });
  }
  if (grammarErrors.length > 0) {
    errors.throwErrors(grammarErrors);
  }
  if (this.source) {
    grammar.source = this.source;
  }

  return grammar;
};

// Rule declarations

GrammarDecl.prototype.define = function(name, formals, body, description, source) {
  this.ensureSuperGrammar();
  if (this.superGrammar.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.superGrammar.name, source);
  } else if (this.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.name, source);
  }
  const duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  return this.install(name, formals, body, description, source);
};

GrammarDecl.prototype.override = function(name, formals, body, descIgnored, source) {
  this.ensureSuperGrammarRuleForOverriding(name, source);
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, fragment, descIgnored, source) {
  const ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
  }
  const body = new pexprs.Extend(this.superGrammar, name, fragment);
  body.source = fragment.source;
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":67,"./InputStream":69,"./common":78,"./errors":79,"./pexprs":98}],69:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.examinedLength = 0;
}

InputStream.prototype = {
  atEnd() {
    const ans = this.pos === this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  },

  next() {
    const ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  },

  matchString(s, optIgnoreCase) {
    let idx;
    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.

        This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").
       */
      for (idx = 0; idx < s.length; idx++) {
        const actual = this.next();
        const expected = s[idx];
        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) {
          return false;
        }
      }
      return true;
    }
    // Default is case-sensitive comparison.
    for (idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) { return false; }
    }
    return true;
  },

  sourceSlice(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval(startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

},{"./Interval":70}],70:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const assert = require('./common').assert;
const errors = require('./errors');
const util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(sourceString, startIdx, endIdx) {
  this.sourceString = sourceString;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function(/* interval1, interval2, ... */) {
  const sourceString = arguments[0].sourceString;
  let startIdx = arguments[0].startIdx;
  let endIdx = arguments[0].endIdx;
  for (let idx = 1; idx < arguments.length; idx++) {
    const interval = arguments[idx];
    if (interval.sourceString !== sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, arguments[idx].startIdx);
      endIdx = Math.max(endIdx, arguments[idx].endIdx);
    }
  }
  return new Interval(sourceString, startIdx, endIdx);
};

Interval.prototype = {
  coverageWith(/* interval1, interval2, ... */) {
    const intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },

  collapsedLeft() {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  },

  collapsedRight() {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  },

  getLineAndColumn() {
    return util.getLineAndColumn(this.sourceString, this.startIdx);
  },

  getLineAndColumnMessage() {
    const range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  },

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      // `this` and `that` are the same interval!
      return [
      ];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      // `that` splits `this` into two intervals
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx),
        new Interval(this.sourceString, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      // `that` contains a prefix of `this`
      return [
        new Interval(this.sourceString, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      // `that` contains a suffix of `this`
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx)
      ];
    } else {
      // `that` and `this` do not overlap
      return [
        this
      ];
    }
  },

  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    }
    assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
        'other interval does not cover this one');
    return new Interval(this.sourceString,
        this.startIdx - that.startIdx,
        this.endIdx - that.startIdx);
  },

  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends. (This only makes sense when
  // the input stream is a string.)
  trimmed() {
    const contents = this.contents;
    const startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    const endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.sourceString, startIdx, endIdx);
  },

  subInterval(offset, len) {
    const newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
};

Object.defineProperties(Interval.prototype, {
  contents: {
    get() {
      if (this._contents === undefined) {
        this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  },
  length: {
    get() { return this.endIdx - this.startIdx; },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./common":78,"./errors":79,"./util":99}],71:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const util = require('./util');
const Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function MatchResult(
    matcher,
    input,
    startExpr,
    cst,
    cstOffset,
    rightmostFailurePosition,
    optRecordedFailures) {

  this.matcher = matcher;
  this.input = input;
  this.startExpr = startExpr;
  this._cst = cst;
  this._cstOffset = cstOffset;
  this._rightmostFailurePosition = rightmostFailurePosition;
  this._rightmostFailures = optRecordedFailures;

  if (this.failed()) {
    common.defineLazyProperty(this, 'message', function() {
      const detail = 'Expected ' + this.getExpectedText();
      return util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
    });
    common.defineLazyProperty(this, 'shortMessage', function() {
      const detail = 'expected ' + this.getExpectedText();
      const errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
      return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
    });
  }
}

MatchResult.prototype.succeeded = function() {
  return !!this._cst;
};

MatchResult.prototype.failed = function() {
  return !this.succeeded();
};

MatchResult.prototype.getRightmostFailurePosition = function() {
  return this._rightmostFailurePosition;
};

MatchResult.prototype.getRightmostFailures = function() {
  if (!this._rightmostFailures) {
    this.matcher.setInput(this.input);
    const matchResultWithFailures =
        this.matcher._match(this.startExpr, false, this.getRightmostFailurePosition());
    this._rightmostFailures = matchResultWithFailures.getRightmostFailures();
  }
  return this._rightmostFailures;
};

MatchResult.prototype.toString = function() {
  return this.succeeded() ?
      '[match succeeded]' :
      '[match failed at position ' + this.getRightmostFailurePosition() + ']';
};

// Return a string summarizing the expected contents of the input stream when
// the match failure occurred.
MatchResult.prototype.getExpectedText = function() {
  if (this.succeeded()) {
    throw new Error('cannot get expected text of a successful MatchResult');
  }

  const sb = new common.StringBuffer();
  let failures = this.getRightmostFailures();

  // Filter out the fluffy failures to make the default error messages more useful
  failures = failures.filter(failure => !failure.isFluffy());

  for (let idx = 0; idx < failures.length; idx++) {
    if (idx > 0) {
      if (idx === failures.length - 1) {
        sb.append(failures.length > 2 ? ', or ' : ' or ');
      } else {
        sb.append(', ');
      }
    }
    sb.append(failures[idx].toString());
  }
  return sb.contents();
};

MatchResult.prototype.getInterval = function() {
  const pos = this.getRightmostFailurePosition();
  return new Interval(this.input, pos, pos);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchResult;

},{"./Interval":70,"./common":78,"./util":99}],72:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const InputStream = require('./InputStream');
const MatchResult = require('./MatchResult');
const PosInfo = require('./PosInfo');
const Trace = require('./Trace');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const applySpaces = new pexprs.Apply('spaces');

function MatchState(matcher, startExpr, optPositionToRecordFailures) {
  this.matcher = matcher;
  this.startExpr = startExpr;

  this.grammar = matcher.grammar;
  this.input = matcher.input;
  this.inputStream = new InputStream(matcher.input);
  this.memoTable = matcher.memoTable;

  this._bindings = [];
  this._bindingOffsets = [];
  this._applicationStack = [];
  this._posStack = [0];
  this.inLexifiedContextStack = [false];

  this.rightmostFailurePosition = -1;
  this._rightmostFailurePositionStack = [];
  this._recordedFailuresStack = [];

  if (optPositionToRecordFailures !== undefined) {
    this.positionToRecordFailures = optPositionToRecordFailures;
    this.recordedFailures = Object.create(null);
  }
}

MatchState.prototype = {
  posToOffset(pos) {
    return pos - this._posStack[this._posStack.length - 1];
  },

  enterApplication(posInfo, app) {
    this._posStack.push(this.inputStream.pos);
    this._applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this.rightmostFailurePosition = -1;
  },

  exitApplication(posInfo, optNode) {
    const origPos = this._posStack.pop();
    this._applicationStack.pop();
    this.inLexifiedContextStack.pop();
    posInfo.exit();

    this.rightmostFailurePosition = Math.max(
        this.rightmostFailurePosition,
        this._rightmostFailurePositionStack.pop());

    if (optNode) {
      this.pushBinding(optNode, origPos);
    }
  },

  enterLexifiedContext() {
    this.inLexifiedContextStack.push(true);
  },

  exitLexifiedContext() {
    this.inLexifiedContextStack.pop();
  },

  currentApplication() {
    return this._applicationStack[this._applicationStack.length - 1];
  },

  inSyntacticContext() {
    if (typeof this.inputStream.source !== 'string') {
      return false;
    }
    const currentApplication = this.currentApplication();
    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      // The top-level context is syntactic if the start application is.
      return this.startExpr.factors[0].isSyntactic();
    }
  },

  inLexifiedContext() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  },

  skipSpaces() {
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
    return this.inputStream.pos;
  },

  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ?
        this.skipSpaces() :
        this.inputStream.pos;
  },

  maybeSkipSpacesBefore(expr) {
    if (expr instanceof pexprs.Apply && expr.isSyntactic()) {
      return this.skipSpaces();
    } else if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  },

  pushBinding(node, origPos) {
    this._bindings.push(node);
    this._bindingOffsets.push(this.posToOffset(origPos));
  },

  popBinding() {
    this._bindings.pop();
    this._bindingOffsets.pop();
  },

  numBindings() {
    return this._bindings.length;
  },

  truncateBindings(newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  },

  getCurrentPosInfo() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo(pos) {
    let posInfo = this.memoTable[pos];
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }
    return posInfo;
  },

  processFailure(pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);

    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      const app = this.currentApplication();
      if (app) {
        // Substitute parameters with the actual pexprs that were passed to
        // the current rule.
        expr = expr.substituteParams(app.args);
      } else {
        // This branch is only reached for the "end-check" that is
        // performed after the top-level application. In that case,
        // expr === pexprs.end so there is no need to substitute
        // parameters.
      }

      this.recordFailure(expr.toFailure(this.grammar), false);
    }
  },

  recordFailure(failure, shouldCloneIfNew) {
    const key = failure.toKey();
    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  },

  recordFailures(failures, shouldCloneIfNew) {
    const self = this;
    Object.keys(failures).forEach(key => {
      self.recordFailure(failures[key], shouldCloneIfNew);
    });
  },

  cloneRecordedFailures() {
    if (!this.recordedFailures) {
      return undefined;
    }

    const ans = Object.create(null);
    const self = this;
    Object.keys(this.recordedFailures).forEach(key => {
      ans[key] = self.recordedFailures[key].clone();
    });
    return ans;
  },

  getRightmostFailurePosition() {
    return this.rightmostFailurePosition;
  },

  _getRightmostFailureOffset() {
    return this.rightmostFailurePosition >= 0 ?
        this.posToOffset(this.rightmostFailurePosition) :
        -1;
  },

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry(pos, expr) {
    const posInfo = this.memoTable[pos];
    if (posInfo && expr.ruleName) {
      const memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec && memoRec.traceEntry) {
        const entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }
    return null;
  },

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry(pos, expr, succeeded, bindings) {
    if (expr instanceof pexprs.Apply) {
      const app = this.currentApplication();
      const actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }
    return this.getMemoizedTraceEntry(pos, expr) ||
           new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
  },

  isTracing() {
    return !!this.trace;
  },

  hasNecessaryInfo(memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }

    if (this.recordedFailures &&
        this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
      return !!memoRec.failuresAtRightmostPosition;
    }

    return true;
  },


  useMemoizedResult(origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }

    const memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
    this.rightmostFailurePosition =
        Math.max(this.rightmostFailurePosition, memoRecRightmostFailurePosition);
    if (this.recordedFailures &&
        this.positionToRecordFailures === memoRecRightmostFailurePosition &&
        memoRec.failuresAtRightmostPosition) {
      this.recordFailures(memoRec.failuresAtRightmostPosition, true);
    }

    this.inputStream.examinedLength =
        Math.max(this.inputStream.examinedLength, memoRec.examinedLength + origPos);

    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength;
      this.pushBinding(memoRec.value, origPos);
      return true;
    }
    return false;
  },

  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval(expr) {
    const inputStream = this.inputStream;
    const origNumBindings = this._bindings.length;

    let origRecordedFailures;
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = Object.create(null);
    }

    const origPos = inputStream.pos;
    const memoPos = this.maybeSkipSpacesBefore(expr);

    let origTrace;
    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    }

    // Do the actual evaluation.
    const ans = expr.eval(this);

    if (this.trace) {
      const bindings = this._bindings.slice(origNumBindings);
      const traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        const self = this;
        Object.keys(this.recordedFailures).forEach(key => {
          self.recordedFailures[key].makeFluffy();
        });
      }
    } else {
      // Reset the position and the bindings.
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
    }

    if (this.recordedFailures) {
      this.recordFailures(origRecordedFailures, false);
    }

    return ans;
  },

  getMatchResult() {
    this.eval(this.startExpr);
    let rightmostFailures;
    if (this.recordedFailures) {
      const self = this;
      rightmostFailures = Object.keys(this.recordedFailures).map(key => self.recordedFailures[key]);
    }
    return new MatchResult(
        this.matcher,
        this.input,
        this.startExpr,
        this._bindings[0],
        this._bindingOffsets[0],
        this.rightmostFailurePosition,
        rightmostFailures);
  },

  getTrace() {
    this.trace = [];
    const matchResult = this.getMatchResult();

    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    const rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  },

  pushFailuresInfo() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this._recordedFailuresStack.push(this.recordedFailures);
  },

  popFailuresInfo() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchState;

},{"./InputStream":69,"./MatchResult":71,"./PosInfo":75,"./Trace":77,"./pexprs":98}],73:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const MatchState = require('./MatchState');

const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Matcher(grammar) {
  this.grammar = grammar;
  this.memoTable = [];
  this.input = '';
}

Matcher.prototype.getInput = function() {
  return this.input;
};

Matcher.prototype.setInput = function(str) {
  if (this.input !== str) {
    this.replaceInputRange(0, this.input.length, str);
  }
  return this;
};

Matcher.prototype.replaceInputRange = function(startIdx, endIdx, str) {
  const currentInput = this.input;
  if (startIdx < 0 || startIdx > currentInput.length ||
      endIdx < 0 || endIdx > currentInput.length ||
      startIdx > endIdx) {
    throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
  }

  // update input
  this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx);

  // update memo table (similar to the above)
  const restOfMemoTable = this.memoTable.slice(endIdx);
  this.memoTable.length = startIdx;
  for (let idx = 0; idx < str.length; idx++) {
    this.memoTable.push(undefined);
  }
  restOfMemoTable.forEach(
      function(posInfo) { this.memoTable.push(posInfo); },
      this);

  // Invalidate memoRecs
  for (let pos = 0; pos < startIdx; pos++) {
    const posInfo = this.memoTable[pos];
    if (posInfo) {
      posInfo.clearObsoleteEntries(pos, startIdx);
    }
  }

  return this;
};

Matcher.prototype.match = function(optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), false);
};

Matcher.prototype.trace = function(optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), true);
};

Matcher.prototype._match = function(startExpr, tracing, optPositionToRecordFailures) {
  const state = new MatchState(this, startExpr, optPositionToRecordFailures);
  return tracing ? state.getTrace() : state.getMatchResult();
};

/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/
Matcher.prototype._getStartExpr = function(optStartApplicationStr) {
  const applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;
  if (!applicationStr) {
    throw new Error('Missing start rule argument -- the grammar has no default start rule.');
  }

  const startApp = this.grammar.parseApplication(applicationStr);
  return new pexprs.Seq([startApp, pexprs.end]);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Matcher;

},{"./MatchState":72,"./pexprs":98}],74:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const extend = require('util-extend');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Namespace() {
}
Namespace.prototype = Object.create(null);

Namespace.asNamespace = function(objOrNamespace) {
  if (objOrNamespace instanceof Namespace) {
    return objOrNamespace;
  }
  return Namespace.createNamespace(objOrNamespace);
};

// Create a new namespace. If `optProps` is specified, all of its properties
// will be copied to the new namespace.
Namespace.createNamespace = function(optProps) {
  return Namespace.extend(Namespace.prototype, optProps);
};

// Create a new namespace which extends another namespace. If `optProps` is
// specified, all of its properties will be copied to the new namespace.
Namespace.extend = function(namespace, optProps) {
  if (namespace !== Namespace.prototype && !(namespace instanceof Namespace)) {
    throw new TypeError('not a Namespace object: ' + namespace);
  }
  const ns = Object.create(namespace, {
    constructor: {
      value: Namespace,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  return extend(ns, optProps);
};

// TODO: Should this be a regular method?
Namespace.toString = function(ns) {
  return Object.prototype.toString.call(ns);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace;

},{"util-extend":102}],75:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo() {
  this.applicationMemoKeyStack = []; // active applications at this position
  this.memo = {};
  this.maxExaminedLength = 0;
  this.maxRightmostFailureOffset = -1;
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  },

  enter(application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  },

  exit() {
    this.applicationMemoKeyStack.pop();
  },

  startLeftRecursion(headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;

    const applicationMemoKeyStack = this.applicationMemoKeyStack;
    const indexOfFirstInvolvedRule =
        applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    const involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);

    memoRec.isInvolved = function(applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };

    memoRec.updateInvolvedApplicationMemoKeys = function() {
      for (let idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        const applicationMemoKey = applicationMemoKeyStack[idx];
        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  },

  endLeftRecursion() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  },

  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult(memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }
    const applicationMemoKeyStack = this.applicationMemoKeyStack;
    for (let idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      const applicationMemoKey = applicationMemoKeyStack[idx];
      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }
    return true;
  },

  memoize(memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset =
        Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
    return memoRec;
  },

  clearObsoleteEntries(pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      // Optimization: none of the rule applications that were memoized here examined the
      // interval of the input that changed, so nothing has to be invalidated.
      return;
    }

    const memo = this.memo;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    const self = this;
    Object.keys(memo).forEach(k => {
      const memoRec = memo[k];
      if (pos + memoRec.examinedLength > invalidatedIdx) {
        delete memo[k];
      } else {
        self.maxExaminedLength = Math.max(self.maxExaminedLength, memoRec.examinedLength);
        self.maxRightmostFailureOffset =
            Math.max(self.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
      }
    });
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;

},{}],76:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const InputStream = require('./InputStream');
const IterationNode = require('./nodes').IterationNode;
const MatchResult = require('./MatchResult');
const common = require('./common');
const errors = require('./errors');
const util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const globalActionStack = [];
let prototypeGrammar;
let prototypeGrammarSemantics;

// JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)
function jsonToJS(str) {
  const output = str.replace(/[\u2028\u2029]/g, (char, pos, str) => {
    const hex = char.codePointAt(0).toString(16);
    return '\\u' + '0000'.slice(hex.length) + hex;
  });
  return output;
}

// ----------------- Wrappers -----------------

// Wrappers decorate CST nodes with all of the functionality (i.e., operations and attributes)
// provided by a Semantics (see below). `Wrapper` is the abstract superclass of all wrappers. A
// `Wrapper` must have `_node` and `_semantics` instance variables, which refer to the CST node and
// Semantics (resp.) for which it was created, and a `_childWrappers` instance variable which is
// used to cache the wrapper instances that are created for its child nodes. Setting these instance
// variables is the responsibility of the constructor of each Semantics-specific subclass of
// `Wrapper`.
class Wrapper {
  constructor(node, sourceInterval, baseInterval) {
    this._node = node;
    this.source = sourceInterval;

    // The interval that the childOffsets of `node` are relative to. It should be the source
    // of the closest Nonterminal node.
    this._baseInterval = baseInterval;

    if (node.isNonterminal()) {
      common.assert(sourceInterval === baseInterval);
    }
    this._childWrappers = [];
  }

  toString() {
    return '[semantics wrapper for ' + this._node.grammar.name + ']';
  };

  // This is used by ohm editor to display a node wrapper appropriately.
  toJSON() {
    return this.toString();
  }

  _forgetMemoizedResultFor(attributeName) {
    // Remove the memoized attribute from the cstNode and all its children.
    delete this._node[this._semantics.attributeKeys[attributeName]];
    this.children.forEach(child => {
      child._forgetMemoizedResultFor(attributeName);
    });
  }

  // Returns the wrapper of the specified child node. Child wrappers are created lazily and
  // cached in the parent wrapper's `_childWrappers` instance variable.
  child(idx) {
    if (!(0 <= idx && idx < this._node.numChildren())) {
      // TODO: Consider throwing an exception here.
      return undefined;
    }
    let childWrapper = this._childWrappers[idx];
    if (!childWrapper) {
      const childNode = this._node.childAt(idx);
      const offset = this._node.childOffsets[idx];

      const source = this._baseInterval.subInterval(offset, childNode.matchLength);
      const base = childNode.isNonterminal() ? source : this._baseInterval;
      childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
    }
    return childWrapper;
  }

  // Returns an array containing the wrappers of all of the children of the node associated
  // with this wrapper.
  _children() {
    // Force the creation of all child wrappers
    for (let idx = 0; idx < this._node.numChildren(); idx++) {
      this.child(idx);
    }
    return this._childWrappers;
  }

  // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
  // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
  isIteration() {
    return this._node.isIteration();
  }

  // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
  // otherwise.
  isTerminal() {
    return this._node.isTerminal();
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
  // otherwise.
  isNonterminal() {
    return this._node.isNonterminal();
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a syntactic rule, `false` otherwise.
  isSyntactic() {
    return this.isNonterminal() && this._node.isSyntactic();
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a lexical rule, `false` otherwise.
  isLexical() {
    return this.isNonterminal() && this._node.isLexical();
  }

  // Returns `true` if the CST node associated with this wrapper is an iterator node
  // having either one or no child (? operator), `false` otherwise.
  // Otherwise, throws an exception.
  isOptional() {
    return this._node.isOptional();
  }

  // Create a new _iter wrapper in the same semantics as this wrapper.
  iteration(optChildWrappers) {
    const childWrappers = optChildWrappers || [];

    const childNodes = childWrappers.map(c => c._node);
    const iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);

    const wrapper = this._semantics.wrap(iter, null, null);
    wrapper._childWrappers = childWrappers;
    return wrapper;
  }

  // Returns an array containing the children of this CST node.
  get children() {
    return this._children();
  }

  // Returns the name of grammar rule that created this CST node.
  get ctorName() {
    return this._node.ctorName;
  }

  // TODO: Remove this eventually (deprecated in v0.12).
  get interval() {
    throw new Error('The `interval` property is deprecated -- use `source` instead');
  }

  // Returns the number of children of this CST node.
  get numChildren() {
    return this._node.numChildren();
  }

  // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
  // throws an exception.
  get primitiveValue() {
    if (this.isTerminal()) {
      return this._node.primitiveValue;
    }
    throw new TypeError(
        "tried to access the 'primitiveValue' attribute of a non-terminal CST node");
  }

  // Returns the contents of the input stream consumed by this CST node.
  get sourceString() {
    return this.source.contents;
  }
}

// ----------------- Semantics -----------------

// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.createSemantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, superSemantics) {
  const self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false;

  // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.
  this.Wrapper = class extends (superSemantics ? superSemantics.Wrapper : Wrapper) {
    constructor(node, sourceInterval, baseInterval) {
      super(node, sourceInterval, baseInterval);
      self.checkActionDictsIfHaventAlready();
      this._semantics = self;
    }
  };

  this.super = superSemantics;
  if (superSemantics) {
    if (!(grammar.equals(this.super.grammar) || grammar._inheritsFrom(this.super.grammar))) {
      throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name +
          "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null);

    // Assign unique symbols for each of the attributes inherited from the super-semantics so that
    // they are memoized independently.
    for (const attributeName in this.attributes) {
      Object.defineProperty(this.attributeKeys, attributeName, {
        value: util.uniqueId(attributeName)
      });
    }
  } else {
    this.operations = Object.create(null);
    this.attributes = Object.create(null);
    this.attributeKeys = Object.create(null);
  }
}

Semantics.prototype.toString = function() {
  return '[semantics for ' + this.grammar.name + ']';
};

Semantics.prototype.checkActionDictsIfHaventAlready = function() {
  if (!this.checkedActionDicts) {
    this.checkActionDicts();
    this.checkedActionDicts = true;
  }
};

// Checks that the action dictionaries for all operations and attributes in this semantics,
// including the ones that were inherited from the super-semantics, agree with the grammar.
// Throws an exception if one or more of them doesn't.
Semantics.prototype.checkActionDicts = function() {
  let name;
  for (name in this.operations) {
    this.operations[name].checkActionDict(this.grammar);
  }
  for (name in this.attributes) {
    this.attributes[name].checkActionDict(this.grammar);
  }
};

Semantics.prototype.toRecipe = function(semanticsOnly) {
  function hasSuperSemantics(s) {
    return s.super !== Semantics.BuiltInSemantics._getSemantics();
  }

  let str = '(function(g) {\n';
  if (hasSuperSemantics(this)) {
    str += '  var semantics = ' + this.super.toRecipe(true) + '(g';

    const superSemanticsGrammar = this.super.grammar;
    let relatedGrammar = this.grammar;
    while (relatedGrammar !== superSemanticsGrammar) {
      str += '.superGrammar';
      relatedGrammar = relatedGrammar.superGrammar;
    }

    str += ');\n';
    str += '  return g.extendSemantics(semantics)';
  } else {
    str += '  return g.createSemantics()';
  }
  ['Operation', 'Attribute'].forEach(type => {
    const semanticOperations = this[type.toLowerCase() + 's'];
    Object.keys(semanticOperations).forEach(name => {
      const {actionDict, formals, builtInDefault} = semanticOperations[name];

      let signature = name;
      if (formals.length > 0) {
        signature += '(' + formals.join(', ') + ')';
      }

      let method;
      if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
        method = 'extend' + type;
      } else {
        method = 'add' + type;
      }
      str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';

      const srcArray = [];
      Object.keys(actionDict).forEach(actionName => {
        if (actionDict[actionName] !== builtInDefault) {
          let source = actionDict[actionName].toString().trim();

          // Convert method shorthand to plain old function syntax.
          // https://github.com/harc/ohm/issues/263
          source = source.replace(/^.*\(/, 'function(');

          srcArray.push('\n      ' + JSON.stringify(actionName) + ': ' + source);
        }
      });
      str += srcArray.join(',') + '\n    })';
    });
  });
  str += ';\n  })';

  if (!semanticsOnly) {
    str =
      '(function() {\n' +
      '  var grammar = this.fromRecipe(' + jsonToJS(this.grammar.toRecipe()) + ');\n' +
      '  var semantics = ' + str + '(grammar);\n' +
      '  return semantics;\n' +
      '});\n';
  }

  return str;
};

function parseSignature(signature, type) {
  if (!prototypeGrammar) {
    // The Operations and Attributes grammar won't be available while Ohm is loading,
    // but we can get away the following simplification b/c none of the operations
    // that are used while loading take arguments.
    common.assert(signature.indexOf('(') === -1);
    return {
      name: signature,
      formals: []
    };
  }

  const r = prototypeGrammar.match(
      signature,
      type === 'operation' ? 'OperationSignature' : 'AttributeSignature');
  if (r.failed()) {
    throw new Error(r.message);
  }

  return prototypeGrammarSemantics(r).parse();
}

function newDefaultAction(type, name, doIt) {
  return function(children) {
    const self = this;
    const thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
    const args = thisThing.formals.map(formal => self.args[formal]);

    if (this.isIteration()) {
      // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
      // default behavior is to map this operation or attribute over all of its child nodes.
      return children.map(child => doIt.apply(child, args));
    }

    // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
    // we got here means that this action dictionary doesn't have an action for this particular
    // non-terminal or a generic `_nonterminal` action.
    if (children.length === 1) {
      // As a convenience, if this node only has one child, we just return the result of
      // applying this operation / attribute to the child node.
      return doIt.apply(children[0], args);
    } else {
      // Otherwise, we throw an exception to let the programmer know that we don't know what
      // to do with this node.
      throw errors.missingSemanticAction(this.ctorName, name, type, globalActionStack);
    }
  };
}

Semantics.prototype.addOperationOrAttribute = function(type, signature, actionDict) {
  const typePlural = type + 's';

  const parsedNameAndFormalArgs = parseSignature(signature, type);
  const name = parsedNameAndFormalArgs.name;
  const formals = parsedNameAndFormalArgs.formals;

  // TODO: check that there are no duplicate formal arguments

  this.assertNewName(name, type);

  // Create the action dictionary for this operation / attribute that contains a `_default` action
  // which defines the default behavior of iteration, terminal, and non-terminal nodes...
  const builtInDefault = newDefaultAction(type, name, doIt);
  const realActionDict = {_default: builtInDefault};
  // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.
  Object.keys(actionDict).forEach(name => {
    realActionDict[name] = actionDict[name];
  });

  const entry = type === 'operation' ?
      new Operation(name, formals, realActionDict, builtInDefault) :
      new Attribute(name, realActionDict, builtInDefault);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  entry.checkActionDict(this.grammar);

  this[typePlural][name] = entry;

  function doIt() {
    // Dispatch to most specific version of this operation / attribute -- it may have been
    // overridden by a sub-semantics.
    const thisThing = this._semantics[typePlural][name];

    // Check that the caller passed the correct number of arguments.
    if (arguments.length !== thisThing.formals.length) {
      throw new Error(
          'Invalid number of arguments passed to ' + name + ' ' + type + ' (expected ' +
          thisThing.formals.length + ', got ' + arguments.length + ')');
    }

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    const args = Object.create(null);
    for (let idx = 0; idx < arguments.length; idx++) {
      const formal = thisThing.formals[idx];
      args[formal] = arguments[idx];
    }

    const oldArgs = this.args;
    this.args = args;
    const ans = thisThing.execute(this._semantics, this);
    this.args = oldArgs;
    return ans;
  }

  if (type === 'operation') {
    this.Wrapper.prototype[name] = doIt;
    this.Wrapper.prototype[name].toString = function() {
      return '[' + name + ' operation]';
    };
  } else {
    Object.defineProperty(this.Wrapper.prototype, name, {
      get: doIt,
      configurable: true // So the property can be deleted.
    });
    Object.defineProperty(this.attributeKeys, name, {
      value: util.uniqueId(name)
    });
  }
};

Semantics.prototype.extendOperationOrAttribute = function(type, name, actionDict) {
  const typePlural = type + 's';

  // Make sure that `name` really is just a name, i.e., that it doesn't also contain formals.
  parseSignature(name, 'attribute');

  if (!(this.super && name in this.super[typePlural])) {
    throw new Error('Cannot extend ' + type + " '" + name +
        "': did not inherit an " + type + ' with that name');
  }
  if (Object.prototype.hasOwnProperty.call(this[typePlural], name)) {
    throw new Error('Cannot extend ' + type + " '" + name + "' again");
  }

  // Create a new operation / attribute whose actionDict delegates to the super operation /
  // attribute's actionDict, and which has all the keys from `inheritedActionDict`.
  const inheritedFormals = this[typePlural][name].formals;
  const inheritedActionDict = this[typePlural][name].actionDict;
  const newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(name => {
    newActionDict[name] = actionDict[name];
  });

  this[typePlural][name] = type === 'operation' ?
      new Operation(name, inheritedFormals, newActionDict) :
      new Attribute(name, newActionDict);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  this[typePlural][name].checkActionDict(this.grammar);
};

Semantics.prototype.assertNewName = function(name, type) {
  if (Wrapper.prototype.hasOwnProperty(name)) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': that's a reserved name");
  }
  if (name in this.operations) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an operation with that name already exists");
  }
  if (name in this.attributes) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
};

// Returns a wrapper for the given CST `node` in this semantics.
// If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
Semantics.prototype.wrap = function(node, source, optBaseInterval) {
  const baseInterval = optBaseInterval || source;
  return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
};

// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function(grammar, optSuperSemantics) {
  const s = new Semantics(
      grammar,
      optSuperSemantics !== undefined ?
          optSuperSemantics :
          Semantics.BuiltInSemantics._getSemantics());

  // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.
  const proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError(
          'Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
    }
    if (matchResult.failed()) {
      throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
    }

    const cst = matchResult._cst;
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a MatchResult from grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    const inputStream = new InputStream(matchResult.input);
    return s.wrap(cst, inputStream.interval(matchResult._cstOffset, matchResult.input.length));
  };

  // Forward public methods from the proxy to the semantics instance.
  proxy.addOperation = function(signature, actionDict) {
    s.addOperationOrAttribute('operation', signature, actionDict);
    return proxy;
  };
  proxy.extendOperation = function(name, actionDict) {
    s.extendOperationOrAttribute('operation', name, actionDict);
    return proxy;
  };
  proxy.addAttribute = function(name, actionDict) {
    s.addOperationOrAttribute('attribute', name, actionDict);
    return proxy;
  };
  proxy.extendAttribute = function(name, actionDict) {
    s.extendOperationOrAttribute('attribute', name, actionDict);
    return proxy;
  };
  proxy._getActionDict = function(operationOrAttributeName) {
    const action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];
    if (!action) {
      throw new Error('"' + operationOrAttributeName + '" is not a valid operation or attribute ' +
        'name in this semantics for "' + grammar.name + '"');
    }
    return action.actionDict;
  };
  proxy._remove = function(operationOrAttributeName) {
    let semantic;
    if (operationOrAttributeName in s.operations) {
      semantic = s.operations[operationOrAttributeName];
      delete s.operations[operationOrAttributeName];
    } else if (operationOrAttributeName in s.attributes) {
      semantic = s.attributes[operationOrAttributeName];
      delete s.attributes[operationOrAttributeName];
    }
    delete s.Wrapper.prototype[operationOrAttributeName];
    return semantic;
  };
  proxy.getOperationNames = function() {
    return Object.keys(s.operations);
  };
  proxy.getAttributeNames = function() {
    return Object.keys(s.attributes);
  };
  proxy.getGrammar = function() {
    return s.grammar;
  };
  proxy.toRecipe = function(semanticsOnly) {
    return s.toRecipe(semanticsOnly);
  };

  // Make the proxy's toString() work.
  proxy.toString = s.toString.bind(s);

  // Returns the semantics for the proxy.
  proxy._getSemantics = function() {
    return s;
  };

  return proxy;
};

// ----------------- Operation -----------------

// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.
class Operation {
  constructor(name, formals, actionDict, builtInDefault) {
    this.name = name;
    this.formals = formals;
    this.actionDict = actionDict;
    this.builtInDefault = builtInDefault;
  }

  checkActionDict(grammar) {
    grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
  }

  // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
  // given Semantics instance.
  execute(semantics, nodeWrapper) {
    try {
      // Look for a semantic action whose name matches the node's constructor name, which is either
      // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
      // iteration node). In the latter case, the action function receives a single argument, which
      // is an array containing all of the children of the CST node.
      const ctorName = nodeWrapper._node.ctorName;
      let actionFn = this.actionDict[ctorName];
      let ans;
      if (actionFn) {
        globalActionStack.push([this, ctorName]);
        ans = this.doAction(semantics, nodeWrapper, actionFn, nodeWrapper.isIteration());
        return ans;
      }

      // The action dictionary does not contain a semantic action for this specific type of node.
      // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
      // action, we invoke it:
      if (nodeWrapper.isNonterminal()) {
        actionFn = this.actionDict._nonterminal;
        if (actionFn) {
          globalActionStack.push([this, '_nonterminal', ctorName]);
          ans = this.doAction(semantics, nodeWrapper, actionFn, true);
          return ans;
        }
      }

      // Otherwise, we invoke the '_default' semantic action.
      globalActionStack.push([this, 'default action', ctorName]);
      ans = this.doAction(semantics, nodeWrapper, this.actionDict._default, true);
      return ans;
    } finally {
      globalActionStack.pop();
    }
  }

  // Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
  // `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
  // argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
  // be equal to the number of children in the CST node.
  doAction(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
    return optPassChildrenAsArray ?
        actionFn.call(nodeWrapper, nodeWrapper._children()) :
        actionFn.apply(nodeWrapper, nodeWrapper._children());
  }
}

Operation.prototype.typeName = 'operation';

// ----------------- Attribute -----------------

// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
class Attribute extends Operation {
  constructor(name, actionDict, builtInDefault) {
    super(name, [], actionDict, builtInDefault);
  }

  execute(semantics, nodeWrapper) {
    const node = nodeWrapper._node;
    const key = semantics.attributeKeys[this.name];
    if (!node.hasOwnProperty(key)) {
      // The following is a super-send -- isn't JS beautiful? :/
      node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
    }
    return node[key];
  }
}

Attribute.prototype.typeName = 'attribute';


// ----------------- Deferred initialization -----------------

util.awaitBuiltInRules(builtInRules => {
  const operationsAndAttributesGrammar = require('../dist/operations-and-attributes');
  initBuiltInSemantics(builtInRules);
  initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics
});

function initBuiltInSemantics(builtInRules) {
  const actions = {
    empty() {
      return this.iteration();
    },
    nonEmpty(first, _, rest) {
      return this.iteration([first].concat(rest.children));
    }
  };

  Semantics.BuiltInSemantics = Semantics
      .createSemantics(builtInRules, null)
      .addOperation('asIteration', {
        emptyListOf: actions.empty,
        nonemptyListOf: actions.nonEmpty,
        EmptyListOf: actions.empty,
        NonemptyListOf: actions.nonEmpty
      });
}

function initPrototypeParser(grammar) {
  prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
    AttributeSignature(name) {
      return {
        name: name.parse(),
        formals: []
      };
    },
    OperationSignature(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.parse()[0] || []
      };
    },
    Formals(oparen, fs, cparen) {
      return fs.asIteration().parse();
    },
    name(first, rest) {
      return this.sourceString;
    }
  });
  prototypeGrammar = grammar;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;

},{"../dist/operations-and-attributes":58,"./InputStream":69,"./MatchResult":71,"./common":78,"./errors":79,"./nodes":81,"./util":99}],77:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Interval = require('./Interval');
const common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Unicode characters that are used in the `toString` output.
const BALLOT_X = '\u2717';
const CHECK_MARK = '\u2713';
const DOT_OPERATOR = '\u22C5';
const RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
const SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
const SYMBOL_FOR_LINE_FEED = '\u240A';
const SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';

const Flags = {
  succeeded: 1 << 0,
  isRootNode: 1 << 1,
  isImplicitSpaces: 1 << 2,
  isMemoized: 1 << 3,
  isHeadOfLeftRecursion: 1 << 4,
  terminatesLR: 1 << 5
};

function spaces(n) {
  return common.repeat(' ', n).join('');
}

// Return a string representation of a portion of `input` at offset `pos`.
// The result will contain exactly `len` characters.
function getInputExcerpt(input, pos, len) {
  const excerpt = asEscapedString(input.slice(pos, pos + len));

  // Pad the output if necessary.
  if (excerpt.length < len) {
    return excerpt + common.repeat(' ', len - excerpt.length).join('');
  }
  return excerpt;
}

function asEscapedString(obj) {
  if (typeof obj === 'string') {
    // Replace non-printable characters with visible symbols.
    return obj
        .replace(/ /g, DOT_OPERATOR)
        .replace(/\t/g, SYMBOL_FOR_HORIZONTAL_TABULATION)
        .replace(/\n/g, SYMBOL_FOR_LINE_FEED)
        .replace(/\r/g, SYMBOL_FOR_CARRIAGE_RETURN);
  }
  return String(obj);
}

// ----------------- Trace -----------------

function Trace(input, pos1, pos2, expr, succeeded, bindings, optChildren) {
  this.input = input;
  this.pos = this.pos1 = pos1;
  this.pos2 = pos2;
  this.source = new Interval(input, pos1, pos2);
  this.expr = expr;
  this.bindings = bindings;
  this.children = optChildren || [];
  this.terminatingLREntry = null;

  this._flags = succeeded ? Flags.succeeded : 0;
}

// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
Trace.prototype.SKIP = {};

Object.defineProperty(Trace.prototype, 'displayString', {
  get() { return this.expr.toDisplayString(); }
});

// For convenience, create a getter and setter for the boolean flags in `Flags`.
Object.keys(Flags).forEach(name => {
  const mask = Flags[name];
  Object.defineProperty(Trace.prototype, name, {
    get() {
      return (this._flags & mask) !== 0;
    },
    set(val) {
      if (val) {
        this._flags |= mask;
      } else {
        this._flags &= ~mask;
      }
    }
  });
});

Trace.prototype.clone = function() {
  return this.cloneWithExpr(this.expr);
};

Trace.prototype.cloneWithExpr = function(expr) {
  const ans = new Trace(
      this.input, this.pos, this.pos2, expr, this.succeeded, this.bindings, this.children);

  ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion;
  ans.isImplicitSpaces = this.isImplicitSpaces;
  ans.isMemoized = this.isMemoized;
  ans.isRootNode = this.isRootNode;
  ans.terminatesLR = this.terminatesLR;
  ans.terminatingLREntry = this.terminatingLREntry;
  return ans;
};

// Record the trace information for the terminating condition of the LR loop.
Trace.prototype.recordLRTermination = function(ruleBodyTrace, value) {
  this.terminatingLREntry =
      new Trace(this.input, this.pos, this.pos2, this.expr, false, [value], [ruleBodyTrace]);
  this.terminatingLREntry.terminatesLR = true;
};

// Recursively traverse this trace node and all its descendents, calling a visitor function
// for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
// is a function to call before visiting the children of a node, and its 'exit' property is
// a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
// function.
//
// The functions are called with three arguments: the Trace node, its parent Trace, and a number
// representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
// specified, is the value to use for `this` when executing the visitor functions.
Trace.prototype.walk = function(visitorObjOrFn, optThisArg) {
  let visitor = visitorObjOrFn;
  if (typeof visitor === 'function') {
    visitor = {enter: visitor};
  }

  function _walk(node, parent, depth) {
    let recurse = true;
    if (visitor.enter) {
      if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
        recurse = false;
      }
    }
    if (recurse) {
      node.children.forEach(child => {
        _walk(child, node, depth + 1);
      });
      if (visitor.exit) {
        visitor.exit.call(optThisArg, node, parent, depth);
      }
    }
  }
  if (this.isRootNode) {
    // Don't visit the root node itself, only its children.
    this.children.forEach(c => { _walk(c, null, 0); });
  } else {
    _walk(this, null, 0);
  }
};

// Return a string representation of the trace.
// Sample:
//     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
//     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
//     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
Trace.prototype.toString = function() {
  const sb = new common.StringBuffer();
  this.walk((node, parent, depth) => {
    if (!node) {
      return this.SKIP;
    }
    const ctorName = node.expr.constructor.name;
    // Don't print anything for Alt nodes.
    if (ctorName === 'Alt') {
      return; // eslint-disable-line consistent-return
    }
    sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
    if (node.isHeadOfLeftRecursion) {
      sb.append(' (LR)');
    }
    if (node.succeeded) {
      const contents = asEscapedString(node.source.contents);
      sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
      sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
    }
    sb.append('\n');
  });
  return sb.contents();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Trace;

},{"./Interval":70,"./common":78}],78:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const extend = require('util-extend');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

const escapeStringFor = {};
for (let c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}
escapeStringFor["'".charCodeAt(0)] = "\\'";
escapeStringFor['"'.charCodeAt(0)] = '\\"';
escapeStringFor['\\'.charCodeAt(0)] = '\\\\';
escapeStringFor['\b'.charCodeAt(0)] = '\\b';
escapeStringFor['\f'.charCodeAt(0)] = '\\f';
escapeStringFor['\n'.charCodeAt(0)] = '\\n';
escapeStringFor['\r'.charCodeAt(0)] = '\\r';
escapeStringFor['\t'.charCodeAt(0)] = '\\t';
escapeStringFor['\u000b'.charCodeAt(0)] = '\\v';

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function(optMethodName) {
  const methodName = optMethodName || '';
  return function() {
    throw new Error(
        'this method ' + methodName + ' is abstract! ' +
      '(it has no implementation in class ' + this.constructor.name + ')');
  };
};

exports.assert = function(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
};

// Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.
exports.defineLazyProperty = function(obj, propName, getterFn) {
  let memo;
  Object.defineProperty(obj, propName, {
    get() {
      if (!memo) {
        memo = getterFn.call(this);
      }
      return memo;
    }
  });
};

exports.clone = function(obj) {
  if (obj) {
    return extend({}, obj);
  }
  return obj;
};

exports.extend = extend;

exports.repeatFn = function(fn, n) {
  const arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
};

exports.repeatStr = function(str, n) {
  return new Array(n + 1).join(str);
};

exports.repeat = function(x, n) {
  return exports.repeatFn(() => x, n);
};

exports.getDuplicates = function(array) {
  const duplicates = [];
  for (let idx = 0; idx < array.length; idx++) {
    const x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
};

exports.copyWithoutDuplicates = function(array) {
  const noDuplicates = [];
  array.forEach(entry => {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
};

exports.isSyntactic = function(ruleName) {
  const firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
};

exports.isLexical = function(ruleName) {
  return !exports.isSyntactic(ruleName);
};

exports.padLeft = function(str, len, optChar) {
  const ch = optChar || ' ';
  if (str.length < len) {
    return exports.repeatStr(ch, len - str.length) + str;
  }
  return str;
};

// StringBuffer

exports.StringBuffer = function() {
  this.strings = [];
};

exports.StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};

exports.StringBuffer.prototype.contents = function() {
  return this.strings.join('');
};

// Character escaping and unescaping

exports.escapeChar = function(c, optDelim) {
  const charCode = c.charCodeAt(0);
  if ((c === '"' || c === "'") && optDelim && c !== optDelim) {
    return c;
  } else if (charCode < 128) {
    return escapeStringFor[charCode];
  } else if (128 <= charCode && charCode < 256) {
    return '\\x' + exports.padLeft(charCode.toString(16), 2, '0');
  } else {
    return '\\u' + exports.padLeft(charCode.toString(16), 4, '0');
  }
};

exports.unescapeChar = function(s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b': return '\b';
      case 'f': return '\f';
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'v': return '\v';
      case 'x': return String.fromCharCode(parseInt(s.substring(2, 4), 16));
      case 'u': return String.fromCharCode(parseInt(s.substring(2, 6), 16));
      default: return s.charAt(1);
    }
  } else {
    return s;
  }
};

// Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.
exports.unexpectedObjToString = function(obj) {
  if (obj == null) {
    return String(obj);
  }
  const baseToString = Object.prototype.toString.call(obj);
  try {
    let typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1); // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = typeof obj;
    }
    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
};

},{"util-extend":102}],79:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const pexprs = require('./pexprs');

const Namespace = require('./Namespace');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function createError(message, optInterval) {
  let e;
  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message);
    e.shortMessage = message;
    e.interval = optInterval;
  } else {
    e = new Error(message);
  }
  return e;
}

// ----------------- errors about intervals -----------------

function intervalSourcesDontMatch() {
  return createError("Interval sources don't match");
}

// ----------------- errors about grammars -----------------

// Grammar syntax error

function grammarSyntaxError(matchFailure) {
  const e = new Error();
  Object.defineProperty(e, 'message', {
    enumerable: true,
    get() {
      return matchFailure.message;
    }
  });
  Object.defineProperty(e, 'shortMessage', {
    enumerable: true,
    get() {
      return 'Expected ' + matchFailure.getExpectedText();
    }
  });
  e.interval = matchFailure.getInterval();
  return e;
}

// Undeclared grammar

function undeclaredGrammar(grammarName, namespace, interval) {
  const message = namespace ?
      'Grammar ' + grammarName + ' is not declared in namespace ' + Namespace.toString(namespace) :
      'Undeclared grammar ' + grammarName;
  return createError(message, interval);
}

// Duplicate grammar declaration

function duplicateGrammarDeclaration(grammar, namespace) {
  return createError('Grammar ' + grammar.name + ' is already declared in this namespace');
}

// ----------------- rules -----------------

// Undeclared rule

function undeclaredRule(ruleName, grammarName, optInterval) {
  return createError(
      'Rule ' + ruleName + ' is not declared in grammar ' + grammarName,
      optInterval);
}

// Cannot override undeclared rule

function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource);
}

// Cannot extend undeclared rule

function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource);
}

// Duplicate rule declaration

function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
  let message = "Duplicate declaration for rule '" + ruleName +
      "' in grammar '" + grammarName + "'";
  if (grammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }
  return createError(message, optSource);
}

// Wrong number of parameters

function wrongNumberOfParameters(ruleName, expected, actual, source) {
  return createError(
      'Wrong number of parameters for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      source);
}

// Wrong number of arguments

function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError(
      'Wrong number of arguments for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      expr.source);
}

// Duplicate parameter names

function duplicateParameterNames(ruleName, duplicates, source) {
  return createError(
      'Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '),
      source);
}

// Invalid parameter expression

function invalidParameter(ruleName, expr) {
  return createError(
      'Invalid parameter to rule ' + ruleName + ': ' + expr + ' has arity ' + expr.getArity() +
         ', but parameter expressions must have arity 1',
      expr.source);
}

// Application of syntactic rule from lexical rule

function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError(
      'Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)',
      applyExpr.source);
}

// Incorrect argument type

function incorrectArgumentType(expectedType, expr) {
  return createError('Incorrect argument type: expected ' + expectedType, expr.source);
}

// Multiple instances of the super-splice operator (`...`) in the rule body.

function multipleSuperSplices(expr) {
  return createError("'...' can appear at most once in a rule body", expr.source);
}

// ----------------- Kleene operators -----------------

function kleeneExprHasNullableOperand(kleeneExpr, applicationStack) {
  const actuals = applicationStack.length > 0 ?
    applicationStack[applicationStack.length - 1].args :
    [];
  const expr = kleeneExpr.expr.substituteParams(actuals);
  let message =
    'Nullable expression ' + expr + " is not allowed inside '" +
    kleeneExpr.operator + "' (possible infinite loop)";
  if (applicationStack.length > 0) {
    const stackTrace = applicationStack
        .map(app => new pexprs.Apply(app.ruleName, app.args))
        .join('\n');
    message += '\nApplication stack (most recent application last):\n' + stackTrace;
  }
  return createError(message, kleeneExpr.expr.source);
}

// ----------------- arity -----------------

function inconsistentArity(ruleName, expected, actual, expr) {
  return createError(
      'Rule ' + ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + expected + ', got ' + actual + ')',
      expr.source);
}

// ----------------- properties -----------------

function duplicatePropertyNames(duplicates) {
  return createError('Object pattern has duplicate property names: ' + duplicates.join(', '));
}

// ----------------- constructors -----------------

function invalidConstructorCall(grammar, ctorName, children) {
  return createError(
      'Attempt to invoke constructor ' + ctorName + ' with invalid or unexpected arguments');
}

// ----------------- convenience -----------------

function multipleErrors(errors) {
  const messages = errors.map(e => e.message);
  return createError(
      ['Errors:'].concat(messages).join('\n- '),
      errors[0].interval);
}

// ----------------- semantic -----------------

function missingSemanticAction(ctorName, name, type, stack) {
  let stackTrace = stack.slice(0, -1).map(info => {
    const ans = '  ' + info[0].name + ' > ' + info[1];
    return info.length === 3
        ? ans + " for '" + info[2] + "'"
        : ans;
  }).join('\n');
  stackTrace += '\n  ' + name + ' > ' + ctorName;

  const where = type + " '" + name + "'";
  const message = "Missing semantic action for '" + ctorName + "' in " + where + '\n' +
                'Action stack (most recent call last):\n' + stackTrace;

  const e = createError(message);
  e.name = 'missingSemanticAction';
  return e;
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  applicationOfSyntacticRuleFromLexicalContext,
  cannotExtendUndeclaredRule,
  cannotOverrideUndeclaredRule,
  duplicateGrammarDeclaration,
  duplicateParameterNames,
  duplicatePropertyNames,
  duplicateRuleDeclaration,
  inconsistentArity,
  incorrectArgumentType,
  intervalSourcesDontMatch,
  invalidConstructorCall,
  invalidParameter,
  grammarSyntaxError,
  kleeneExprHasNullableOperand,
  missingSemanticAction,
  multipleSuperSplices,
  undeclaredGrammar,
  undeclaredRule,
  wrongNumberOfArguments,
  wrongNumberOfParameters,

  throwErrors(errors) {
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw multipleErrors(errors);
    }
  }
};

},{"./Namespace":74,"./pexprs":98}],80:[function(require,module,exports){
/* global document, XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Builder = require('./Builder');
const Grammar = require('./Grammar');
const Namespace = require('./Namespace');
const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');
const util = require('./util');
const version = require('./version');

const isBuffer = require('is-buffer');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
let ohmGrammar;

// An object which makes it possible to stub out the document API for testing.
let documentInterface = {
  querySelector(sel) { return document.querySelector(sel); },
  querySelectorAll(sel) { return document.querySelectorAll(sel); }
};

const superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0; // eslint-disable-line no-void
}

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }
  const length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// TODO: just use the jQuery thing
function load(url) {
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  const builder = new Builder();
  let decl;
  let currentRuleName;
  let currentRuleFormals;
  let overriding = false;
  const metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  const helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammar(n, s, open, rs, close) {
      const grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      const g = decl.build();
      g.source = this.source.trimmed();
      if (grammarName in namespace) {
        throw errors.duplicateGrammarDeclaration(g, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar(_, n) {
      const superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      const body = b.visit();
      const description = d.visit()[0];
      const source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];

      const source = this.source.trimmed();
      decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);

      overriding = true;
      const body = b.visit();
      overriding = false;
      return decl.override(currentRuleName, currentRuleFormals, body, null, source);
    },
    Rule_extend(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      const body = b.visit();
      const source = this.source.trimmed();
      return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
    },
    RuleBody(_, terms) {
      const args = terms.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },
    OverrideRuleBody(_, terms) {
      const args = terms.visit();

      // Check if the super-splice operator (`...`) appears in the terms.
      const expansionPos = args.indexOf(superSplicePlaceholder);
      if (expansionPos >= 0) {
        const beforeTerms = args.slice(0, expansionPos);
        const afterTerms = args.slice(expansionPos + 1);

        // Ensure it appears no more than once.
        afterTerms.forEach(t => {
          if (t === superSplicePlaceholder) throw errors.multipleSuperSplices(t);
        });

        return new pexprs.Splice(
            decl.superGrammar, currentRuleName, beforeTerms, afterTerms).withSource(this.source);
      } else {
        return builder.alt.apply(builder, args).withSource(this.source);
      }
    },
    Formals(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt(seqs) {
      const args = seqs.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    TopLevelTerm_inline(b, n) {
      const inlineRuleName = currentRuleName + '_' + n.visit();
      const body = b.visit();
      const source = this.source.trimmed();
      const isNewRuleDeclaration =
          !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }
      const params = currentRuleFormals.map(formal => builder.app(formal));
      return builder.app(inlineRuleName, params).withSource(body.source);
    },
    OverrideTopLevelTerm_superSplice(_) {
      return superSplicePlaceholder;
    },

    Seq(expr) {
      return builder.seq.apply(builder, expr.visit()).withSource(this.source);
    },

    Iter_star(x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus(x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt(x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },

    Pred_not(_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead(_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },

    Lex_lex(_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },

    Base_application(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
    },
    Base_range(from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal(expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren(open, x, close) {
      return x.visit();
    },

    ruleDescr(open, t, close) {
      return t.visit();
    },
    ruleDescrText(_) {
      return this.sourceString.trim();
    },

    caseName(_, space1, n, space2, end) {
      return n.visit();
    },

    name(first, rest) {
      return this.sourceString;
    },
    nameFirst(expr) {},
    nameRest(expr) {},

    terminal(open, cs, close) {
      return cs.visit().join('');
    },

    oneCharTerminal(open, c, close) {
      return c.visit();
    },

    terminalChar(_) {
      return common.unescapeChar(this.sourceString);
    },

    escapeChar(_) {
      return this.sourceString;
    },

    NonemptyListOf(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    EmptyListOf() {
      return [];
    },

    _terminal() {
      return this.primitiveValue;
    }
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  const m = ohmGrammar.match(source, 'Grammars');
  if (m.failed()) {
    throw errors.grammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}

// Return the contents of a script element, fetching it via XHR if necessary.
function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node, got ' + common.unexpectedObjToString(el));
  }
  if (el.type !== 'text/ohm-js') {
    throw new Error('Expected a script tag with type="text/ohm-js", got ' + el);
  }
  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function grammar(source, optNamespace) {
  const ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  const grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    const secondGrammar = ns[grammarNames[1]];
    const interval = secondGrammar.source;
    throw new Error(
        util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.');
  }
  return ns[grammarNames[0]]; // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  const ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
          'Expected string as first argument, got ' + common.unexpectedObjToString(source));
    }
  }
  compileAndLoad(source, ns);
  return ns;
}

function grammarFromScriptElement(optNode) {
  let node = optNode;
  if (isUndefined(node)) {
    const nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
    if (nodeList.length !== 1) {
      throw new Error(
          'Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
    }
    node = nodeList[0];
  }
  return grammar(getScriptElementContents(node));
}

function grammarsFromScriptElements(optNodeOrNodeList) {
  // Simple case: the argument is a DOM node.
  if (isElement(optNodeOrNodeList)) {
    return grammars(optNodeOrNodeList);
  }
  // Otherwise, it must be either undefined or a NodeList.
  let nodeList = optNodeOrNodeList;
  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }
  const ns = Namespace.createNamespace();
  for (let i = 0; i < nodeList.length; ++i) {
    // Copy the new grammars into `ns` to keep the namespace flat.
    common.extend(ns, grammars(getScriptElementContents(nodeList[i]), ns));
  }
  return ns;
}

function makeRecipe(recipe) {
  if (typeof recipe === 'function') {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === 'string') {
      // stringified JSON recipe
      recipe = JSON.parse(recipe);
    }
    return (new Builder()).fromRecipe(recipe);
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about
module.exports = {
  createNamespace: Namespace.createNamespace,
  grammar,
  grammars,
  grammarFromScriptElement,
  grammarsFromScriptElements,
  makeRecipe,
  ohmGrammar: null, // Initialized below, after Grammar.BuiltInRules.
  pexprs,
  util,
  extras: require('../extras'),
  version
};

// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };

// Late initialization for stuff that is bootstrapped.

Grammar.BuiltInRules = require('../dist/built-in-rules');
util.announceBuiltInRules(Grammar.BuiltInRules);

module.exports.ohmGrammar = ohmGrammar = require('../dist/ohm-grammar');
Grammar.initApplicationParser(ohmGrammar, buildGrammar);

},{"../dist/built-in-rules":56,"../dist/ohm-grammar":57,"../extras":60,"./Builder":64,"./Grammar":67,"./Namespace":74,"./common":78,"./errors":79,"./pexprs":98,"./util":99,"./version":100,"is-buffer":62}],81:[function(require,module,exports){
'use strict';

const common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

class Node {
  constructor(grammar, ctorName, matchLength) {
    this.grammar = grammar;
    this.ctorName = ctorName;
    this.matchLength = matchLength;
  }

  numChildren() {
    return this.children ? this.children.length : 0;
  }

  childAt(idx) {
    if (this.children) {
      return this.children[idx];
    }
  }

  indexOfChild(arg) {
    return this.children.indexOf(arg);
  }

  hasChildren() {
    return this.numChildren() > 0;
  }

  hasNoChildren() {
    return !this.hasChildren();
  }

  onlyChild() {
    if (this.numChildren() !== 1) {
      throw new Error(
          'cannot get only child of a node of type ' + this.ctorName +
          ' (it has ' + this.numChildren() + ' children)');
    } else {
      return this.firstChild();
    }
  }

  firstChild() {
    if (this.hasNoChildren()) {
      throw new Error(
          'cannot get first child of a ' + this.ctorName + ' node, which has no children');
    } else {
      return this.childAt(0);
    }
  }

  lastChild() {
    if (this.hasNoChildren()) {
      throw new Error(
          'cannot get last child of a ' + this.ctorName + ' node, which has no children');
    } else {
      return this.childAt(this.numChildren() - 1);
    }
  }

  childBefore(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error('Node.childBefore() called w/ an argument that is not a child');
    } else if (childIdx === 0) {
      throw new Error('cannot get child before first child');
    } else {
      return this.childAt(childIdx - 1);
    }
  }

  childAfter(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error('Node.childAfter() called w/ an argument that is not a child');
    } else if (childIdx === this.numChildren() - 1) {
      throw new Error('cannot get child after last child');
    } else {
      return this.childAt(childIdx + 1);
    }
  }

  isTerminal() {
    return false;
  }

  isNonterminal() {
    return false;
  }

  isIteration() {
    return false;
  }

  isOptional() {
    return false;
  }

  toJSON() {
    return {[this.ctorName]: this.children};
  }
}

// Terminals

class TerminalNode extends Node {
  constructor(grammar, value) {
    const matchLength = value ? value.length : 0;
    super(grammar, '_terminal', matchLength);
    this.primitiveValue = value;
  }

  isTerminal() {
    return true;
  }

  toJSON() {
    return {[this.ctorName]: this.primitiveValue};
  }
}

// Nonterminals

class NonterminalNode extends Node {
  constructor(grammar, ruleName, children, childOffsets, matchLength) {
    super(grammar, ruleName, matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
  }

  isNonterminal() {
    return true;
  }

  isLexical() {
    return common.isLexical(this.ctorName);
  }

  isSyntactic() {
    return common.isSyntactic(this.ctorName);
  }
}

// Iterations

class IterationNode extends Node {
  constructor(grammar, children, childOffsets, matchLength, isOptional) {
    super(grammar, '_iter', matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
    this.optional = isOptional;
  }

  isIteration() {
    return true;
  }

  isOptional() {
    return this.optional;
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  Node,
  TerminalNode,
  NonterminalNode,
  IterationNode
};

},{"./common":78}],82:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Return true if we should skip spaces preceding this expression in a syntactic context.
*/
pexprs.PExpr.prototype.allowsSkippingPrecedingSpace = common.abstract(
    'allowsSkippingPrecedingSpace'
);

/*
  Generally, these are all first-order expressions and (with the exception of Apply)
  directly read from the input stream.
*/
pexprs.any.allowsSkippingPrecedingSpace =
pexprs.end.allowsSkippingPrecedingSpace =
pexprs.Apply.prototype.allowsSkippingPrecedingSpace =
pexprs.Terminal.prototype.allowsSkippingPrecedingSpace =
pexprs.Range.prototype.allowsSkippingPrecedingSpace =
pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace = function() {
  return true;
};

/*
  Higher-order expressions that don't directly consume input.
*/
pexprs.Alt.prototype.allowsSkippingPrecedingSpace =
pexprs.Iter.prototype.allowsSkippingPrecedingSpace =
pexprs.Lex.prototype.allowsSkippingPrecedingSpace =
pexprs.Lookahead.prototype.allowsSkippingPrecedingSpace =
pexprs.Not.prototype.allowsSkippingPrecedingSpace =
pexprs.Param.prototype.allowsSkippingPrecedingSpace =
pexprs.Seq.prototype.allowsSkippingPrecedingSpace = function() {
  return false;
};

},{"./common":78,"./pexprs":98}],83:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');
const util = require('./util');

let BuiltInRules;

util.awaitBuiltInRules(g => { BuiltInRules = g; });

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

let lexifyCount;

pexprs.PExpr.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount = 0;
  this._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract(
    '_assertAllApplicationsAreValid'
);

pexprs.any._assertAllApplicationsAreValid =
pexprs.end._assertAllApplicationsAreValid =
pexprs.Terminal.prototype._assertAllApplicationsAreValid =
pexprs.Range.prototype._assertAllApplicationsAreValid =
pexprs.Param.prototype._assertAllApplicationsAreValid =
pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Lex.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount++;
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
  lexifyCount--;
};

pexprs.Alt.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid =
pexprs.Not.prototype._assertAllApplicationsAreValid =
pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Apply.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  const ruleInfo = grammar.rules[this.ruleName];

  // Make sure that the rule exists...
  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  }

  // ...and that this application is allowed
  if (common.isSyntactic(this.ruleName) && (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments
  const actual = this.args.length;
  const expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  }

  // ...and that all of the argument expressions only have valid applications and have arity 1.
  const self = this;
  this.args.forEach(arg => {
    arg._assertAllApplicationsAreValid(ruleName, grammar);
    if (arg.getArity() !== 1) {
      throw errors.invalidParameter(self.ruleName, arg);
    }
  });

  // Extra checks for "special" applications

  // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.
  if (BuiltInRules && ruleInfo === BuiltInRules.rules.caseInsensitive) {
    if (!(this.args[0] instanceof pexprs.Terminal)) {
      throw errors.incorrectArgumentType('a Terminal (e.g. \"abc\")', this.args[0]);
    }
  }
};

},{"./common":78,"./errors":79,"./pexprs":98,"./util":99}],84:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract(
    'assertChoicesHaveUniformArity'
);

pexprs.any.assertChoicesHaveUniformArity =
pexprs.end.assertChoicesHaveUniformArity =
pexprs.Terminal.prototype.assertChoicesHaveUniformArity =
pexprs.Range.prototype.assertChoicesHaveUniformArity =
pexprs.Param.prototype.assertChoicesHaveUniformArity =
pexprs.Lex.prototype.assertChoicesHaveUniformArity =
pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  if (this.terms.length === 0) {
    return;
  }
  const arity = this.terms[0].getArity();
  for (let idx = 0; idx < this.terms.length; idx++) {
    const term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    const otherArity = term.getArity();
    if (arity !== otherArity) {
      throw errors.inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  const actualArity = this.terms[0].getArity();
  const expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Iter.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};

},{"./common":78,"./errors":79,"./pexprs":98}],85:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract(
    'assertIteratedExprsAreNotNullable'
);

pexprs.any.assertIteratedExprsAreNotNullable =
pexprs.end.assertIteratedExprsAreNotNullable =
pexprs.Terminal.prototype.assertIteratedExprsAreNotNullable =
pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
pexprs.Param.prototype.assertIteratedExprsAreNotNullable =
pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  // no-op
};

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar);
  if (this.expr.isNullable(grammar)) {
    throw errors.kleeneExprHasNullableOperand(this, []);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lex.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  this.expr.assertIteratedExprsAreNotNullable(grammar);
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar) {
  this.args.forEach(arg => {
    arg.assertIteratedExprsAreNotNullable(grammar);
  });
};

},{"./common":78,"./errors":79,"./pexprs":98}],86:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const nodes = require('./nodes');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.check = common.abstract('check');

pexprs.any.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.end.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === undefined;
};

pexprs.Terminal.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === this.obj;
};

pexprs.Range.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === typeof this.from;
};

pexprs.Param.prototype.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.Alt.prototype.check = function(grammar, vals) {
  for (let i = 0; i < this.terms.length; i++) {
    const term = this.terms[i];
    if (term.check(grammar, vals)) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.check = function(grammar, vals) {
  let pos = 0;
  for (let i = 0; i < this.factors.length; i++) {
    const factor = this.factors[i];
    if (factor.check(grammar, vals.slice(pos))) {
      pos += factor.getArity();
    } else {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.check = function(grammar, vals) {
  const arity = this.getArity();
  const columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  const rowCount = columns[0].length;
  let i;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowCount) {
      return false;
    }
  }

  for (i = 0; i < rowCount; i++) {
    const row = [];
    for (let j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }
    if (!this.expr.check(grammar, row)) {
      return false;
    }
  }

  return true;
};

pexprs.Not.prototype.check = function(grammar, vals) {
  return true;
};

pexprs.Lookahead.prototype.check =
pexprs.Lex.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Apply.prototype.check = function(grammar, vals) {
  if (!(vals[0] instanceof nodes.Node &&
        vals[0].grammar === grammar &&
        vals[0].ctorName === this.ruleName)) {
    return false;
  }

  // TODO: think about *not* doing the following checks, i.e., trusting that the rule
  // was correctly constructed.
  const ruleNode = vals[0];
  const body = grammar.rules[this.ruleName].body;
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

pexprs.UnicodeChar.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === 'string';
};

},{"./common":78,"./nodes":81,"./pexprs":98}],87:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Trace = require('./Trace');
const common = require('./common');
const errors = require('./errors');
const nodes = require('./nodes');
const pexprs = require('./pexprs');

const TerminalNode = nodes.TerminalNode;
const NonterminalNode = nodes.NonterminalNode;
const IterationNode = nodes.IterationNode;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Evaluate the expression and return `true` if it succeeds, `false` otherwise. This method should
  only be called directly by `State.prototype.eval(expr)`, which also updates the data structures
  that are used for tracing. (Making those updates in a method of `State` enables the trace-specific
  data structures to be "secrets" of that class, which is good for modularity.)

  The contract of this method is as follows:
  * When the return value is `true`,
    - the state object will have `expr.getArity()` more bindings than it did before the call.
  * When the return value is `false`,
    - the state object may have more bindings than it did before the call, and
    - its input stream's position may be anywhere.

  Note that `State.prototype.eval(expr)`, unlike this method, guarantees that neither the state
  object's bindings nor its input stream's position will change if the expression fails to match.
*/
pexprs.PExpr.prototype.eval = common.abstract('eval'); // function(state) { ... }

pexprs.any.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  const ch = inputStream.next();
  if (ch) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.end.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  if (inputStream.atEnd()) {
    state.pushBinding(new TerminalNode(state.grammar, undefined), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Terminal.prototype.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    state.pushBinding(new TerminalNode(state.grammar, this.obj), origPos);
    return true;
  }
};

pexprs.Range.prototype.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  const ch = inputStream.next();
  if (ch && this.from <= ch && ch <= this.to) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Param.prototype.eval = function(state) {
  return state.eval(state.currentApplication().args[this.index]);
};

pexprs.Lex.prototype.eval = function(state) {
  state.enterLexifiedContext();
  const ans = state.eval(this.expr);
  state.exitLexifiedContext();
  return ans;
};

pexprs.Alt.prototype.eval = function(state) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.eval = function(state) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    const factor = this.factors[idx];
    if (!state.eval(factor)) {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  const arity = this.getArity();
  const cols = [];
  const colOffsets = [];
  while (cols.length < arity) {
    cols.push([]);
    colOffsets.push([]);
  }

  let numMatches = 0;
  let prevPos = origPos;
  let idx;
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    if (inputStream.pos === prevPos) {
      throw errors.kleeneExprHasNullableOperand(this, state._applicationStack);
    }
    prevPos = inputStream.pos;
    numMatches++;
    const row = state._bindings.splice(state._bindings.length - arity, arity);
    const rowOffsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
      colOffsets[idx].push(rowOffsets[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  let offset = state.posToOffset(origPos);
  let matchLength = 0;
  if (numMatches > 0) {
    const lastCol = cols[arity - 1];
    const lastColOffsets = colOffsets[arity - 1];

    const endOffset =
        lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
    offset = colOffsets[0][0];
    matchLength = endOffset - offset;
  }
  const isOptional = this instanceof pexprs.Opt;
  for (idx = 0; idx < cols.length; idx++) {
    state._bindings.push(
        new IterationNode(state.grammar, cols[idx], colOffsets[idx], matchLength, isOptional));
    state._bindingOffsets.push(offset);
  }
  return true;
};

pexprs.Not.prototype.eval = function(state) {
  /*
    TODO:
    - Right now we're just throwing away all of the failures that happen inside a `not`, and
      recording `this` as a failed expression.
    - Double negation should be equivalent to lookahead, but that's not the case right now wrt
      failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
      a failure for 'foo' instead.
  */

  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  state.pushFailuresInfo();

  const ans = state.eval(this.expr);

  state.popFailuresInfo();
  if (ans) {
    state.processFailure(origPos, this);
    return false;
  }

  inputStream.pos = origPos;
  return true;
};

pexprs.Lookahead.prototype.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  if (state.eval(this.expr)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function(state) {
  const caller = state.currentApplication();
  const actuals = caller ? caller.args : [];
  const app = this.substituteParams(actuals);

  const posInfo = state.getCurrentPosInfo();
  if (posInfo.isActive(app)) {
    // This rule is already active at this position, i.e., it is left-recursive.
    return app.handleCycle(state);
  }

  const memoKey = app.toMemoKey();
  const memoRec = posInfo.memo[memoKey];

  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) {
      return state.useMemoizedResult(state.inputStream.pos, memoRec);
    }
    delete posInfo.memo[memoKey];
  }
  return app.reallyEval(state);
};

pexprs.Apply.prototype.handleCycle = function(state) {
  const posInfo = state.getCurrentPosInfo();
  const currentLeftRecursion = posInfo.currentLeftRecursion;
  const memoKey = this.toMemoKey();
  let memoRec = posInfo.memo[memoKey];

  if (currentLeftRecursion && currentLeftRecursion.headApplication.toMemoKey() === memoKey) {
    // We already know about this left recursion, but it's possible there are "involved
    // applications" that we don't already know about, so...
    memoRec.updateInvolvedApplicationMemoKeys();
  } else if (!memoRec) {
    // New left recursion detected! Memoize a failure to try to get a seed parse.
    memoRec = posInfo.memoize(
        memoKey,
        {matchLength: 0, examinedLength: 0, value: false, rightmostFailureOffset: -1});
    posInfo.startLeftRecursion(this, memoRec);
  }
  return state.useMemoizedResult(state.inputStream.pos, memoRec);
};

pexprs.Apply.prototype.reallyEval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  const origPosInfo = state.getCurrentPosInfo();
  const ruleInfo = state.grammar.rules[this.ruleName];
  const body = ruleInfo.body;
  const description = ruleInfo.description;

  state.enterApplication(origPosInfo, this);

  if (description) {
    state.pushFailuresInfo();
  }

  // Reset the input stream's examinedLength property so that we can track
  // the examined length of this particular application.
  const origInputStreamExaminedLength = inputStream.examinedLength;
  inputStream.examinedLength = 0;

  let value = this.evalOnce(body, state);
  const currentLR = origPosInfo.currentLeftRecursion;
  const memoKey = this.toMemoKey();
  const isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  let memoRec;

  if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
    memoRec = currentLR;
    memoRec.examinedLength = inputStream.examinedLength - origPos;
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
    origPosInfo.memoize(memoKey, memoRec); // updates origPosInfo's maxExaminedLength
  } else if (!currentLR || !currentLR.isInvolved(memoKey)) {
    // This application is not involved in left recursion, so it's ok to memoize it.
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    });
  }
  const succeeded = !!value;

  if (description) {
    state.popFailuresInfo();
    if (!succeeded) {
      state.processFailure(origPos, this);
    }
    if (memoRec) {
      memoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
    }
  }

  // Record trace information in the memo table, so that it is available if the memoized result
  // is used later.
  if (state.isTracing() && memoRec) {
    const entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
    if (isHeadOfLeftRecursion) {
      common.assert(entry.terminatingLREntry != null || !succeeded);
      entry.isHeadOfLeftRecursion = true;
    }
    memoRec.traceEntry = entry;
  }

  // Fix the input stream's examinedLength -- it should be the maximum examined length
  // across all applications, not just this one.
  inputStream.examinedLength = Math.max(inputStream.examinedLength, origInputStreamExaminedLength);

  state.exitApplication(origPosInfo, value);

  return succeeded;
};

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;

  if (state.eval(expr)) {
    const arity = expr.getArity();
    const bindings = state._bindings.splice(state._bindings.length - arity, arity);
    const offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    return new NonterminalNode(
        state.grammar, this.ruleName, bindings, offsets, inputStream.pos - origPos);
  } else {
    return false;
  }
};

pexprs.Apply.prototype.growSeedResult = function(body, state, origPos, lrMemoRec, newValue) {
  if (!newValue) {
    return false;
  }

  const inputStream = state.inputStream;

  while (true) {
    lrMemoRec.matchLength = inputStream.pos - origPos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();

    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is a copy of the trace node from `newValue`, which will always be the last
      // element in `state.trace`.
      const seedTrace = state.trace[state.trace.length - 1];
      lrMemoRec.traceEntry = new Trace(
          state.input, origPos, inputStream.pos, this, true, [newValue], [seedTrace.clone()]);
    }
    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);
    if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
      break;
    }
    if (state.isTracing()) {
      state.trace.splice(-2, 1); // Drop the trace for the old seed.
    }
  }
  if (state.isTracing()) {
    // The last entry is for an unused result -- pop it and save it in the "real" entry.
    lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue);
  }
  inputStream.pos = origPos + lrMemoRec.matchLength;
  return lrMemoRec.value;
};

pexprs.UnicodeChar.prototype.eval = function(state) {
  const inputStream = state.inputStream;
  const origPos = inputStream.pos;
  const ch = inputStream.next();
  if (ch && this.pattern.test(ch)) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

},{"./Trace":77,"./common":78,"./errors":79,"./nodes":81,"./pexprs":98}],88:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function flatten(listOfLists) {
  return Array.prototype.concat.apply([], listOfLists);
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.generateExample = common.abstract('generateExample');

function categorizeExamples(examples) {
  // A list of rules that the system needs examples of, in order to generate an example
  //   for the current rule
  let examplesNeeded = examples.filter(example => example.hasOwnProperty('examplesNeeded'))
      .map(example => example.examplesNeeded);

  examplesNeeded = flatten(examplesNeeded);

  const uniqueExamplesNeeded = {};
  for (let i = 0; i < examplesNeeded.length; i++) {
    const currentExampleNeeded = examplesNeeded[i];
    uniqueExamplesNeeded[currentExampleNeeded] = true;
  }
  examplesNeeded = Object.keys(uniqueExamplesNeeded);

  // A list of successfully generated examples
  const successfulExamples = examples.filter(example => example.hasOwnProperty('value'))
      .map(item => item.value);

  // This flag returns true if the system cannot generate the rule it is currently
  //   attempting to generate, regardless of whether or not it has the examples it needs.
  //   Currently, this is only used in overriding generators to prevent the system from
  //   generating examples for certain rules (e.g. 'ident').
  const needHelp = examples.some(item => item.needHelp);

  return {
    examplesNeeded,
    successfulExamples,
    needHelp
  };
}

pexprs.any.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return {value: String.fromCharCode(Math.floor(Math.random() * 255))};
};

// Assumes that terminal's object is always a string
pexprs.Terminal.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: this.obj};
};

pexprs.Range.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  const rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
  return {value: String.fromCharCode(
      this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random())
  )};
};

pexprs.Param.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return actuals[this.index].generateExample(grammar, examples, inSyntacticContext, actuals);
};

pexprs.Alt.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  // items -> termExamples
  const termExamples = this.terms.map(term => {
    return term.generateExample(grammar, examples, inSyntacticContext, actuals);
  });

  const categorizedExamples = categorizeExamples(termExamples);

  const examplesNeeded = categorizedExamples.examplesNeeded;
  const successfulExamples = categorizedExamples.successfulExamples;
  const needHelp = categorizedExamples.needHelp;

  const ans = {};

  // Alt can contain both an example and a request for examples
  if (successfulExamples.length > 0) {
    const i = Math.floor(Math.random() * successfulExamples.length);
    ans.value = successfulExamples[i];
  }
  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }
  ans.needHelp = needHelp;

  return ans;
};

pexprs.Seq.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  const factorExamples = this.factors.map(factor => {
    return factor.generateExample(grammar, examples, inSyntacticContext, actuals);
  });
  const categorizedExamples = categorizeExamples(factorExamples);

  const examplesNeeded = categorizedExamples.examplesNeeded;
  const successfulExamples = categorizedExamples.successfulExamples;
  const needHelp = categorizedExamples.needHelp;

  const ans = {};

  // In a Seq, all pieces must succeed in order to have a successful example.
  if (examplesNeeded.length > 0 || needHelp) {
    ans.examplesNeeded = examplesNeeded;
    ans.needHelp = needHelp;
  } else {
    ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
  }

  return ans;
};

pexprs.Iter.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  const rangeTimes = Math.min(this.maxNumMatches - this.minNumMatches, 3);
  const numTimes = Math.floor(Math.random() * (rangeTimes + 1) + this.minNumMatches);
  const items = [];

  for (let i = 0; i < numTimes; i++) {
    items.push(this.expr.generateExample(grammar, examples, inSyntacticContext, actuals));
  }

  const categorizedExamples = categorizeExamples(items);

  const examplesNeeded = categorizedExamples.examplesNeeded;
  const successfulExamples = categorizedExamples.successfulExamples;

  const ans = {};

  // It's always either one or the other.
  // TODO: instead of ' ', call 'spaces.generateExample()'
  ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }

  return ans;
};

// Right now, 'Not' and 'Lookahead' generate nothing and assume that whatever follows will
//   work according to the encoded constraints.
pexprs.Not.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: ''};
};

pexprs.Lookahead.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: ''};
};

pexprs.Lex.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return this.expr.generateExample(grammar, examples, false, actuals);
};

pexprs.Apply.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  const ans = {};

  const ruleName = this.substituteParams(actuals).toString();

  if (!examples.hasOwnProperty(ruleName)) {
    ans.examplesNeeded = [ruleName];
  } else {
    const relevantExamples = examples[ruleName];
    const i = Math.floor(Math.random() * relevantExamples.length);
    ans.value = relevantExamples[i];
  }

  return ans;
};

pexprs.UnicodeChar.prototype.generateExample = function(
    grammar, examples, inSyntacticContext, actuals) {
  let char;
  switch (this.category) {
    case 'Lu': char = 'Á'; break;
    case 'Ll': char = 'ŏ'; break;
    case 'Lt': char = 'ǅ'; break;
    case 'Lm': char = 'ˮ'; break;
    case 'Lo': char = 'ƻ'; break;

    case 'Nl': char = 'ↂ'; break;
    case 'Nd': char = '½'; break;

    case 'Mn': char = '\u0487'; break;
    case 'Mc': char = 'ि'; break;

    case 'Pc': char = '⁀'; break;

    case 'Zs': char = '\u2001'; break;

    case 'L': char = 'Á'; break;
    case 'Ltmo': char = 'ǅ'; break;
  }
  return {value: char}; // 💩
};

},{"./common":78,"./pexprs":98}],89:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = common.abstract('getArity');

pexprs.any.getArity =
pexprs.end.getArity =
pexprs.Terminal.prototype.getArity =
pexprs.Range.prototype.getArity =
pexprs.Param.prototype.getArity =
pexprs.Apply.prototype.getArity =
pexprs.UnicodeChar.prototype.getArity = function() {
  return 1;
};

pexprs.Alt.prototype.getArity = function() {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function() {
  let arity = 0;
  for (let idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};

pexprs.Iter.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function() {
  return 0;
};

pexprs.Lookahead.prototype.getArity =
pexprs.Lex.prototype.getArity = function() {
  return this.expr.getArity();
};

},{"./common":78,"./pexprs":98}],90:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Called at grammar creation time to rewrite a rule body, replacing each reference to a formal
  parameter with a `Param` node. Returns a PExpr -- either a new one, or the original one if
  it was modified in place.
*/
pexprs.PExpr.prototype.introduceParams = common.abstract('introduceParams');

pexprs.any.introduceParams =
pexprs.end.introduceParams =
pexprs.Terminal.prototype.introduceParams =
pexprs.Range.prototype.introduceParams =
pexprs.Param.prototype.introduceParams =
pexprs.UnicodeChar.prototype.introduceParams = function(formals) {
  return this;
};

pexprs.Alt.prototype.introduceParams = function(formals) {
  this.terms.forEach((term, idx, terms) => {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach((factor, idx, factors) => {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};

pexprs.Iter.prototype.introduceParams =
pexprs.Not.prototype.introduceParams =
pexprs.Lookahead.prototype.introduceParams =
pexprs.Lex.prototype.introduceParams = function(formals) {
  this.expr = this.expr.introduceParams(formals);
  return this;
};

pexprs.Apply.prototype.introduceParams = function(formals) {
  const index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.args.length > 0) {
      // TODO: Should this be supported? See issue #64.
      throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
    }
    return new pexprs.Param(index).withSource(this.source);
  } else {
    this.args.forEach((arg, idx, args) => {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};

},{"./common":78,"./pexprs":98}],91:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function(grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = common.abstract('_isNullable');

pexprs.any._isNullable =
pexprs.Range.prototype._isNullable =
pexprs.Param.prototype._isNullable =
pexprs.Plus.prototype._isNullable =
pexprs.UnicodeChar.prototype._isNullable = function(grammar, memo) {
  return false;
};

pexprs.end._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Terminal.prototype._isNullable = function(grammar, memo) {
  if (typeof this.obj === 'string') {
    // This is an over-simplification: it's only correct if the input is a string. If it's an array
    // or an object, then the empty string parsing expression is not nullable.
    return this.obj === '';
  } else {
    return false;
  }
};

pexprs.Alt.prototype._isNullable = function(grammar, memo) {
  return this.terms.length === 0 ||
      this.terms.some(term => term._isNullable(grammar, memo));
};

pexprs.Seq.prototype._isNullable = function(grammar, memo) {
  return this.factors.every(factor => factor._isNullable(grammar, memo));
};

pexprs.Star.prototype._isNullable =
pexprs.Opt.prototype._isNullable =
pexprs.Not.prototype._isNullable =
pexprs.Lookahead.prototype._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Lex.prototype._isNullable = function(grammar, memo) {
  return this.expr._isNullable(grammar, memo);
};

pexprs.Apply.prototype._isNullable = function(grammar, memo) {
  const key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    const body = grammar.rules[this.ruleName].body;
    const inlined = body.substituteParams(this.args);
    memo[key] = false; // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};

},{"./common":78,"./pexprs":98}],92:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getMetaInfo(expr, grammarInterval) {
  const metaInfo = {};
  if (expr.source && grammarInterval) {
    const adjusted = expr.source.relativeTo(grammarInterval);
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
  }
  return metaInfo;
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract('outputRecipe');

pexprs.any.outputRecipe = function(formals, grammarInterval) {
  return ['any', getMetaInfo(this, grammarInterval)];
};

pexprs.end.outputRecipe = function(formals, grammarInterval) {
  return ['end', getMetaInfo(this, grammarInterval)];
};

pexprs.Terminal.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'terminal',
    getMetaInfo(this, grammarInterval),
    this.obj
  ];
};

pexprs.Range.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'range',
    getMetaInfo(this, grammarInterval),
    this.from,
    this.to
  ];
};

pexprs.Param.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'param',
    getMetaInfo(this, grammarInterval),
    this.index
  ];
};

pexprs.Alt.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'alt',
    getMetaInfo(this, grammarInterval)
  ].concat(this.terms.map(term => term.outputRecipe(formals, grammarInterval)));
};

pexprs.Extend.prototype.outputRecipe = function(formals, grammarInterval) {
  const extension = this.terms[0]; // [extension, original]
  return extension.outputRecipe(formals, grammarInterval);
};

pexprs.Splice.prototype.outputRecipe = function(formals, grammarInterval) {
  const beforeTerms = this.terms.slice(0, this.expansionPos);
  const afterTerms = this.terms.slice(this.expansionPos + 1);
  return [
    'splice',
    getMetaInfo(this, grammarInterval),
    beforeTerms.map(term => term.outputRecipe(formals, grammarInterval)),
    afterTerms.map(term => term.outputRecipe(formals, grammarInterval))
  ];
};

pexprs.Seq.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'seq',
    getMetaInfo(this, grammarInterval)
  ].concat(this.factors.map(factor => factor.outputRecipe(formals, grammarInterval)));
};

pexprs.Star.prototype.outputRecipe =
pexprs.Plus.prototype.outputRecipe =
pexprs.Opt.prototype.outputRecipe =
pexprs.Not.prototype.outputRecipe =
pexprs.Lookahead.prototype.outputRecipe =
pexprs.Lex.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    this.constructor.name.toLowerCase(),
    getMetaInfo(this, grammarInterval),
    this.expr.outputRecipe(formals, grammarInterval)
  ];
};

pexprs.Apply.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'app',
    getMetaInfo(this, grammarInterval),
    this.ruleName,
    this.args.map(arg => arg.outputRecipe(formals, grammarInterval))
  ];
};

pexprs.UnicodeChar.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'unicodeChar',
    getMetaInfo(this, grammarInterval),
    this.category
  ];
};

},{"./common":78,"./pexprs":98}],93:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a PExpr that results from recursively replacing every formal parameter (i.e., instance
  of `Param`) inside this PExpr with its actual value from `actuals` (an Array).

  The receiver must not be modified; a new PExpr must be returned if any replacement is necessary.
*/
// function(actuals) { ... }
pexprs.PExpr.prototype.substituteParams = common.abstract('substituteParams');

pexprs.any.substituteParams =
pexprs.end.substituteParams =
pexprs.Terminal.prototype.substituteParams =
pexprs.Range.prototype.substituteParams =
pexprs.UnicodeChar.prototype.substituteParams = function(actuals) {
  return this;
};

pexprs.Param.prototype.substituteParams = function(actuals) {
  return actuals[this.index];
};

pexprs.Alt.prototype.substituteParams = function(actuals) {
  return new pexprs.Alt(
      this.terms.map(term => term.substituteParams(actuals)));
};

pexprs.Seq.prototype.substituteParams = function(actuals) {
  return new pexprs.Seq(
      this.factors.map(factor => factor.substituteParams(actuals)));
};

pexprs.Iter.prototype.substituteParams =
pexprs.Not.prototype.substituteParams =
pexprs.Lookahead.prototype.substituteParams =
pexprs.Lex.prototype.substituteParams = function(actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
};

pexprs.Apply.prototype.substituteParams = function(actuals) {
  if (this.args.length === 0) {
    // Avoid making a copy of this application, as an optimization
    return this;
  } else {
    const args = this.args.map(arg => arg.substituteParams(actuals));
    return new pexprs.Apply(this.ruleName, args);
  }
};

},{"./common":78,"./pexprs":98}],94:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

const {copyWithoutDuplicates} = common;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function isRestrictedJSIdentifier(str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}

function resolveDuplicatedNames(argumentNameList) {
  // `count` is used to record the number of times each argument name occurs in the list,
  // this is useful for checking duplicated argument name. It maps argument names to ints.
  const count = Object.create(null);
  argumentNameList.forEach(argName => {
    count[argName] = (count[argName] || 0) + 1;
  });

  // Append subscripts ('_1', '_2', ...) to duplicate argument names.
  Object.keys(count).forEach(dupArgName => {
    if (count[dupArgName] <= 1) {
      return;
    }

    // This name shows up more than once, so add subscripts.
    let subscript = 1;
    argumentNameList.forEach((argName, idx) => {
      if (argName === dupArgName) {
        argumentNameList[idx] = argName + '_' + subscript++;
      }
    });
  });
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a list of strings that will be used as the default argument names for its receiver
  (a pexpr) in a semantic action. This is used exclusively by the Semantics Editor.

  `firstArgIndex` is the 1-based index of the first argument name that will be generated for this
  pexpr. It enables us to name arguments positionally, e.g., if the second argument is a
  non-alphanumeric terminal like "+", it will be named '$2'.

  `noDupCheck` is true if the caller of `toArgumentNameList` is not a top level caller. It enables
  us to avoid nested duplication subscripts appending, e.g., '_1_1', '_1_2', by only checking
  duplicates at the top level.

  Here is a more elaborate example that illustrates how this method works:
  `(a "+" b).toArgumentNameList(1)` evaluates to `['a', '$2', 'b']` with the following recursive
  calls:

    (a).toArgumentNameList(1) -> ['a'],
    ("+").toArgumentNameList(2) -> ['$2'],
    (b).toArgumentNameList(3) -> ['b']

  Notes:
  * This method must only be called on well-formed expressions, e.g., the receiver must
    not have any Alt sub-expressions with inconsistent arities.
  * e.getArity() === e.toArgumentNameList(1).length
*/
// function(firstArgIndex, noDupCheck) { ... }
pexprs.PExpr.prototype.toArgumentNameList = common.abstract('toArgumentNameList');

pexprs.any.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['any'];
};

pexprs.end.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['end'];
};

pexprs.Terminal.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    return ['_' + this.obj];
  } else {
    // Otherwise, name it positionally.
    return ['$' + firstArgIndex];
  }
};

pexprs.Range.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  let argName = this.from + '_to_' + this.to;
  // If the `argName` is not valid then try to prepend a `_`.
  if (!isRestrictedJSIdentifier(argName)) {
    argName = '_' + argName;
  }
  // If the `argName` still not valid after prepending a `_`, then name it positionally.
  if (!isRestrictedJSIdentifier(argName)) {
    argName = '$' + firstArgIndex;
  }
  return [argName];
};

pexprs.Alt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  // `termArgNameLists` is an array of arrays where each row is the
  // argument name list that corresponds to a term in this alternation.
  const termArgNameLists = this.terms.map(term => term.toArgumentNameList(firstArgIndex, true));

  const argumentNameList = [];
  const numArgs = termArgNameLists[0].length;
  for (let colIdx = 0; colIdx < numArgs; colIdx++) {
    const col = [];
    for (let rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
      col.push(termArgNameLists[rowIdx][colIdx]);
    }
    const uniqueNames = copyWithoutDuplicates(col);
    argumentNameList.push(uniqueNames.join('_or_'));
  }

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Seq.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  // Generate the argument name list, without worrying about duplicates.
  let argumentNameList = [];
  this.factors.forEach(factor => {
    const factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
    argumentNameList = argumentNameList.concat(factorArgumentNameList);

    // Shift the firstArgIndex to take this factor's argument names into account.
    firstArgIndex += factorArgumentNameList.length;
  });
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Iter.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  const argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck)
      .map(exprArgumentString => exprArgumentString[exprArgumentString.length - 1] === 's' ?
          exprArgumentString + 'es' :
          exprArgumentString + 's');
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Opt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(argName => {
    return 'opt' + argName[0].toUpperCase() + argName.slice(1);
  });
};

pexprs.Not.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [];
};

pexprs.Lookahead.prototype.toArgumentNameList =
pexprs.Lex.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck);
};

pexprs.Apply.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [this.ruleName];
};

pexprs.UnicodeChar.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['$' + firstArgIndex];
};

pexprs.Param.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['param' + this.index];
};

// "Value pexprs" (Value, Str, Arr, Obj) are going away soon, so we don't worry about them here.

},{"./common":78,"./pexprs":98}],95:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = common.abstract('toDisplayString');

pexprs.Alt.prototype.toDisplayString =
pexprs.Seq.prototype.toDisplayString = function() {
  if (this.source) {
    return this.source.trimmed().contents;
  }
  return '[' + this.constructor.name + ']';
};

pexprs.any.toDisplayString =
pexprs.end.toDisplayString =
pexprs.Iter.prototype.toDisplayString =
pexprs.Not.prototype.toDisplayString =
pexprs.Lookahead.prototype.toDisplayString =
pexprs.Lex.prototype.toDisplayString =
pexprs.Terminal.prototype.toDisplayString =
pexprs.Range.prototype.toDisplayString =
pexprs.Param.prototype.toDisplayString = function() {
  return this.toString();
};

pexprs.Apply.prototype.toDisplayString = function() {
  if (this.args.length > 0) {
    const ps = this.args.map(arg => arg.toDisplayString());
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toDisplayString = function() {
  return 'Unicode [' + this.category + '] character';
};

},{"./common":78,"./pexprs":98}],96:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Failure = require('./Failure');
const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toFailure = common.abstract('toFailure');

pexprs.any.toFailure = function(grammar) {
  return new Failure(this, 'any object', 'description');
};

pexprs.end.toFailure = function(grammar) {
  return new Failure(this, 'end of input', 'description');
};

pexprs.Terminal.prototype.toFailure = function(grammar) {
  return new Failure(this, this.obj, 'string');
};

pexprs.Range.prototype.toFailure = function(grammar) {
  // TODO: come up with something better
  return new Failure(this, JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function(grammar) {
  const description = this.expr === pexprs.any ?
      'nothing' :
      'not ' + this.expr.toFailure(grammar);
  return new Failure(this, description, 'description');
};

pexprs.Lookahead.prototype.toFailure = function(grammar) {
  return this.expr.toFailure(grammar);
};

pexprs.Apply.prototype.toFailure = function(grammar) {
  let description = grammar.rules[this.ruleName].description;
  if (!description) {
    const article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(this, description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(grammar) {
  return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};

pexprs.Alt.prototype.toFailure = function(grammar) {
  const fs = this.terms.map(t => t.toFailure(grammar));
  const description = '(' + fs.join(' or ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Seq.prototype.toFailure = function(grammar) {
  const fs = this.factors.map(f => f.toFailure(grammar));
  const description = '(' + fs.join(' ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Iter.prototype.toFailure = function(grammar) {
  const description = '(' + this.expr.toFailure(grammar) + this.operator + ')';
  return new Failure(this, description, 'description');
};

},{"./Failure":66,"./common":78,"./pexprs":98}],97:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  e1.toString() === e2.toString() ==> e1 and e2 are semantically equivalent.
  Note that this is not an iff (<==>): e.g.,
  (~"b" "a").toString() !== ("a").toString(), even though
  ~"b" "a" and "a" are interchangeable in any grammar,
  both in terms of the languages they accept and their arities.
*/
pexprs.PExpr.prototype.toString = common.abstract('toString');

pexprs.any.toString = function() {
  return 'any';
};

pexprs.end.toString = function() {
  return 'end';
};

pexprs.Terminal.prototype.toString = function() {
  return JSON.stringify(this.obj);
};

pexprs.Range.prototype.toString = function() {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toString = function() {
  return '$' + this.index;
};

pexprs.Lex.prototype.toString = function() {
  return '#(' + this.expr.toString() + ')';
};

pexprs.Alt.prototype.toString = function() {
  return this.terms.length === 1 ?
    this.terms[0].toString() :
    '(' + this.terms.map(term => term.toString()).join(' | ') + ')';
};

pexprs.Seq.prototype.toString = function() {
  return this.factors.length === 1 ?
    this.factors[0].toString() :
    '(' + this.factors.map(factor => factor.toString()).join(' ') + ')';
};

pexprs.Iter.prototype.toString = function() {
  return this.expr + this.operator;
};

pexprs.Not.prototype.toString = function() {
  return '~' + this.expr;
};

pexprs.Lookahead.prototype.toString = function() {
  return '&' + this.expr;
};

pexprs.Apply.prototype.toString = function() {
  if (this.args.length > 0) {
    const ps = this.args.map(arg => arg.toString());
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toString = function() {
  return '\\p{' + this.category + '}';
};

},{"./common":78,"./pexprs":98}],98:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const UnicodeCategories = require('../third_party/UnicodeCategories');
const common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

class PExpr {
  constructor() {
    if (this.constructor === PExpr) {
      throw new Error("PExpr cannot be instantiated -- it's abstract");
    }
  }

  // Set the `source` property to the interval containing the source for this expression.
  withSource(interval) {
    if (interval) {
      this.source = interval.trimmed();
    }
    return this;
  }
}

// Any

const any = Object.create(PExpr.prototype);

// End

const end = Object.create(PExpr.prototype);

// Terminals

class Terminal extends PExpr {
  constructor(obj) {
    super();
    this.obj = obj;
  }
}

// Ranges

class Range extends PExpr {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
  }
}

// Parameters

class Param extends PExpr {
  constructor(index) {
    super();
    this.index = index;
  }
}

// Alternation

class Alt extends PExpr {
  constructor(terms) {
    super();
    this.terms = terms;
  }
}

// Extend is an implementation detail of rule extension

class Extend extends Alt {
  constructor(superGrammar, name, body) {
    const origBody = superGrammar.rules[name].body;
    super([body, origBody]);

    this.superGrammar = superGrammar;
    this.name = name;
    this.body = body;
  }
}

// Splice is an implementation detail of rule overriding with the `...` operator.
class Splice extends Alt {
  constructor(superGrammar, ruleName, beforeTerms, afterTerms) {
    const origBody = superGrammar.rules[ruleName].body;
    super([...beforeTerms, origBody, ...afterTerms]);

    this.superGrammar = superGrammar;
    this.ruleName = ruleName;
    this.expansionPos = beforeTerms.length;
  }
}

// Sequences

class Seq extends PExpr {
  constructor(factors) {
    super();
    this.factors = factors;
  }
}

// Iterators and optionals

class Iter extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

class Star extends Iter {}
class Plus extends Iter {}
class Opt extends Iter {}

Star.prototype.operator = '*';
Plus.prototype.operator = '+';
Opt.prototype.operator = '?';

Star.prototype.minNumMatches = 0;
Plus.prototype.minNumMatches = 1;
Opt.prototype.minNumMatches = 0;

Star.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Plus.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Opt.prototype.maxNumMatches = 1;

// Predicates

class Not extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

class Lookahead extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

// "Lexification"

class Lex extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

// Rule application

class Apply extends PExpr {
  constructor(ruleName, args=[]) {
    super();
    this.ruleName = ruleName;
    this.args = args;
  }

  isSyntactic() {
    return common.isSyntactic(this.ruleName);
  }

  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    if (!this._memoKey) {
      Object.defineProperty(this, '_memoKey', {value: this.toString()});
    }
    return this._memoKey;
  }
}

// Unicode character

class UnicodeChar extends PExpr {
  constructor(category) {
    super();
    this.category = category;
    this.pattern = UnicodeCategories[category];
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.PExpr = PExpr;
exports.any = any;
exports.end = end;
exports.Terminal = Terminal;
exports.Range = Range;
exports.Param = Param;
exports.Alt = Alt;
exports.Extend = Extend;
exports.Splice = Splice;
exports.Seq = Seq;
exports.Iter = Iter;
exports.Star = Star;
exports.Plus = Plus;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Lex = Lex;
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('./pexprs-allowsSkippingPrecedingSpace');
require('./pexprs-assertAllApplicationsAreValid');
require('./pexprs-assertChoicesHaveUniformArity');
require('./pexprs-assertIteratedExprsAreNotNullable');
require('./pexprs-check');
require('./pexprs-eval');
require('./pexprs-getArity');
require('./pexprs-generateExample');
require('./pexprs-outputRecipe');
require('./pexprs-introduceParams');
require('./pexprs-isNullable');
require('./pexprs-substituteParams');
require('./pexprs-toDisplayString');
require('./pexprs-toArgumentNameList');
require('./pexprs-toFailure');
require('./pexprs-toString');

},{"../third_party/UnicodeCategories":101,"./common":78,"./pexprs-allowsSkippingPrecedingSpace":82,"./pexprs-assertAllApplicationsAreValid":83,"./pexprs-assertChoicesHaveUniformArity":84,"./pexprs-assertIteratedExprsAreNotNullable":85,"./pexprs-check":86,"./pexprs-eval":87,"./pexprs-generateExample":88,"./pexprs-getArity":89,"./pexprs-introduceParams":90,"./pexprs-isNullable":91,"./pexprs-outputRecipe":92,"./pexprs-substituteParams":93,"./pexprs-toArgumentNameList":94,"./pexprs-toDisplayString":95,"./pexprs-toFailure":96,"./pexprs-toString":97}],99:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
  let maxLen = 0;
  const strings = arr.map(n => {
    const str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(s => common.padLeft(s, maxLen));
}

// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
  const origDestLen = dest.length;
  const start = dest.slice(0, offset);
  const end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
}

// Casts the underlying lineAndCol object to a formatted message string,
// highlighting `ranges`.
function lineAndColumnToMessage(...ranges) {
  const lineAndCol = this;
  const offset = lineAndCol.offset;
  const repeatStr = common.repeatStr;

  const sb = new common.StringBuffer();
  sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');

  // An array of the previous, current, and next line numbers as strings of equal length.
  const lineNumbers = padNumbersToEqualLength([
    lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
    lineAndCol.lineNum,
    lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ]);

  // Helper for appending formatting input lines to the buffer.
  const appendLine = (num, content, prefix) => {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
  };

  // Include the previous line for context if possible.
  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  }
  // Line that the error occurred on.
  appendLine(1, lineAndCol.line, '> ');

  // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
  const lineLen = lineAndCol.line.length;
  let indicationLine = repeatStr(' ', lineLen + 1);
  for (let i = 0; i < ranges.length; ++i) {
    let startIdx = ranges[i][0];
    let endIdx = ranges[i][1];
    common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');

    const lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);

    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }
  const gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr(' ', gutterWidth));
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, '') + '\n');

  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return sb.contents();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

let builtInRulesCallbacks = [];

// Since Grammar.BuiltInRules is bootstrapped, most of Ohm can't directly depend it.
// This function allows modules that do depend on the built-in rules to register a callback
// that will be called later in the initialization process.
exports.awaitBuiltInRules = cb => {
  builtInRulesCallbacks.push(cb);
};

exports.announceBuiltInRules = grammar => {
  builtInRulesCallbacks.forEach(cb => {
    cb(grammar);
  });
  builtInRulesCallbacks = null;
};

// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = (str, offset) => {
  let lineNum = 1;
  let colNum = 1;

  let currOffset = 0;
  let lineStartOffset = 0;

  let nextLine = null;
  let prevLine = null;
  let prevLineStartOffset = -1;

  while (currOffset < offset) {
    const c = str.charAt(currOffset++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  // Find the end of the target line.
  let lineEndOffset = str.indexOf('\n', lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    const nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
                                        : str.slice(lineEndOffset, nextLineEndOffset);
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  }

  // Get the previous line.
  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset)
        .replace(/\r?\n$/, ''); // Strip trailing EOL char(s).
  }

  // Get the target line, stripping a trailing carriage return if necessary.
  const line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

  return {
    offset,
    lineNum,
    colNum,
    line,
    prevLine,
    nextLine,
    toString: lineAndColumnToMessage
  };
};

// Return a nicely-formatted string describing the line and column for the
// given offset in `str` highlighting `ranges`.
exports.getLineAndColumnMessage = function(str, offset, ...ranges) {
  return exports.getLineAndColumn(str, offset).toString(...ranges);
};

exports.uniqueId = (() => {
  let idCounter = 0;
  return prefix => '' + prefix + idCounter++;
})();

},{"./common":78}],100:[function(require,module,exports){
/* global __GLOBAL_OHM_VERSION__ */

'use strict';

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see webpack.config.js).
module.exports = typeof __GLOBAL_OHM_VERSION__ === 'string'
    ? __GLOBAL_OHM_VERSION__
    : require('../package.json').version;

},{"../package.json":63}],101:[function(require,module,exports){
// Based on https://github.com/mathiasbynens/unicode-9.0.0.
// These are just categories that are used in ES5/ES2015.
// The full list of Unicode categories is here: http://www.fileformat.info/info/unicode/category/index.htm.
module.exports = {
  // Letters
  Lu: /[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]/,
  Ll: /[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43]/,
  Lt: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,
  Lm: /[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]/,
  Lo: /[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,

  // Numbers
  Nl: /[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]|\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC6E]/,
  Nd: /[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD801[\uDCA0-\uDCA9]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|[\uD805\uD807][\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDD50-\uDD59]/,

  // Marks
  Mn: /[\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDCA-\uDDCC\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]/,
  Mc: /[\u0903-\u0903]|[\u093E-\u0940]|[\u0949-\u094C]|[\u0982-\u0983]|[\u09BE-\u09C0]|[\u09C7-\u09C8]|[\u09CB-\u09CC]|[\u09D7-\u09D7]|[\u0A3E-\u0A40]|[\u0A83-\u0A83]|[\u0ABE-\u0AC0]|[\u0AC9-\u0AC9]|[\u0ACB-\u0ACC]|[\u0B02-\u0B03]|[\u0B3E-\u0B3E]|[\u0B40-\u0B40]|[\u0B47-\u0B48]|[\u0B4B-\u0B4C]|[\u0B57-\u0B57]|[\u0B83-\u0B83]|[\u0BBE-\u0BBF]|[\u0BC1-\u0BC2]|[\u0BC6-\u0BC8]|[\u0BCA-\u0BCC]|[\u0BD7-\u0BD7]|[\u0C01-\u0C03]|[\u0C41-\u0C44]|[\u0C82-\u0C83]|[\u0CBE-\u0CBE]|[\u0CC0-\u0CC4]|[\u0CC7-\u0CC8]|[\u0CCA-\u0CCB]|[\u0CD5-\u0CD6]|[\u0D02-\u0D03]|[\u0D3E-\u0D40]|[\u0D46-\u0D48]|[\u0D4A-\u0D4C]|[\u0D57-\u0D57]|[\u0F3E-\u0F3F]|[\u0F7F-\u0F7F]/,

  // Punctuation, Connector
  Pc: /[_\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F]/,

  // Separator, Space
  Zs: /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,

  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
  Ltmo: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]|[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]|[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/
};

},{}],102:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = extend;
function extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const VM = require("../../../../build/vm");
const repl_1 = require("./repl");
class Client {
    constructor(id, capabilities, origin) {
        this.id = id;
        this.capabilities = capabilities;
        this.origin = origin;
        this.methods = new Map();
        this.instances = new Map();
        this.methods.set("run-tests", this.run_tests.bind(this));
        this.methods.set("spawn-playground", this.spawn_playground.bind(this));
        this.methods.set("run-snippet", this.run_snippet.bind(this));
    }
    async instantiate() {
        const crochet = new Crochet.CrochetForBrowser(`/${this.id}/library`, new Set(this.capabilities), false);
        await crochet.boot_from_file(`/${this.id}/app/crochet.json`, Crochet.Package.target_web());
        return crochet;
    }
    post_message(method, data) {
        window.parent.postMessage({ method, id: this.id, data }, this.origin);
    }
    dispatch(data) {
        const method = this.methods.get(data.method);
        if (method != null) {
            method(data.data);
        }
        else {
            console.log(`Unhandled message:`, this.id, data);
        }
    }
    listen() {
        window.addEventListener("message", (ev) => {
            if (ev.origin !== this.origin || ev.data.id !== this.id) {
                console.log(`Unhandled message:`, this.id, ev.data, ev.origin);
                return;
            }
            this.dispatch(ev.data);
        });
    }
    async run_tests({ id }) {
        this.post_message("testing-started", { id });
        // TODO: handle errors here
        const instance = await this.instantiate();
        const handler = instance.test_report.subscribe((message) => {
            if (message.id !== id) {
                return;
            }
            switch (message.tag) {
                case "started": {
                    break;
                }
                case "test-started": {
                    this.post_message("test-started", {
                        id: message.id,
                        "test-id": message.test_id,
                        package: message.pkg,
                        module: message.module,
                        title: message.name,
                    });
                    break;
                }
                case "test-skipped": {
                    this.post_message("test-skipped", {
                        id: message.id,
                        "test-id": message.test_id,
                    });
                    break;
                }
                case "test-passed": {
                    this.post_message("test-passed", {
                        id: message.id,
                        "test-id": message.test_id,
                    });
                    break;
                }
                case "test-failed": {
                    this.post_message("test-failed", {
                        id: message.id,
                        "test-id": message.test_id,
                        message: message.message,
                    });
                    break;
                }
                case "finished": {
                    break;
                }
            }
        });
        const result = await instance.run_tests(id, () => true);
        instance.test_report.unsubscribe(handler);
        this.post_message("testing-finished", {
            id,
            passed: result.passed,
            failed: result.failed,
            skipped: result.skipped,
            total: result.total,
            duration: result.finished - result.started,
        });
    }
    async spawn_playground({ id }) {
        const instance = await this.instantiate();
        const pkg = instance.system.graph.get_package(instance.root.meta.name);
        const cpkg = instance.system.universe.world.packages.get(pkg.name);
        const module = new VM.CrochetModule(cpkg, "(playground)", null);
        const environment = new VM.Environment(null, null, module, null);
        this.instances.set(id, {
            vm: instance,
            module: module,
            environment: environment,
        });
        this.post_message("playground-ready", { id });
    }
    async run_snippet({ id, sid, code, }) {
        const instance = this.instances.get(id);
        const client = {
            id,
            sid,
            post_message: (method, data) => {
                this.post_message(method, { ...data, id, sid });
            },
        };
        try {
            const ast = (0, repl_1.compile)(code);
            await ast.evaluate(client, instance);
        }
        catch (error) {
            console.error(error);
            client.post_message("playground/error", {
                message: String(error),
            });
        }
    }
}
exports.Client = Client;
async function main() {
    const query = new URL(document.location.href).searchParams;
    const capabilities = (query.get("capabilities") || "native").split(",");
    const client = new Client(query.get("id"), new Set(capabilities), query.get("origin"));
    client.listen();
    client.post_message("ready", {});
}
main().catch((e) => {
    console.log(e);
});

},{"../../../../build/vm":23,"./repl":104}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.lower = exports.ReplStatements = exports.ReplDeclaration = exports.ReplExpr = void 0;
const Compiler = require("../../../../build/compiler");
const IR = require("../../../../build/ir");
const VM = require("../../../../build/vm");
class ReplExpr {
}
exports.ReplExpr = ReplExpr;
class ReplDeclaration extends ReplExpr {
    constructor(declarations, source, meta) {
        super();
        this.declarations = declarations;
        this.source = source;
        this.meta = meta;
    }
    async evaluate(client, process) {
        for (const x of this.declarations) {
            await process.vm.system.load_declaration(x, process.module);
            client.post_message("playground/declaration-loaded", {
                message: declaration_name(x),
            });
        }
        client.post_message("playground/success", { value: null });
    }
}
exports.ReplDeclaration = ReplDeclaration;
class ReplStatements extends ReplExpr {
    constructor(block, source, meta) {
        super();
        this.block = block;
        this.source = source;
        this.meta = meta;
    }
    async evaluate(client, process) {
        const new_env = VM.Environments.clone(process.environment);
        const value = await process.vm.system.run_block(this.block, new_env);
        // Copy only non-generated bindings back to the top-level environment
        for (const [k, v] of new_env.bindings.entries()) {
            if (!/\$/.test(k)) {
                process.environment.define(k, v);
            }
        }
        client.post_message("playground/success", {
            value: {
                tag: "RAW",
                code: VM.Location.simple_value(value),
            },
        });
    }
}
exports.ReplStatements = ReplStatements;
function lower(x, source) {
    return x.match({
        Declarations: (xs) => {
            const { declarations, meta } = Compiler.lower_declarations(source, xs);
            return new ReplDeclaration(declarations, source, meta);
        },
        Statements: (xs) => {
            const { block, meta } = Compiler.lower_statements(source, xs);
            return new ReplStatements(block, source, meta);
        },
        Command: (command) => {
            throw new Error(`Unsupported`);
        },
    });
}
exports.lower = lower;
function compile(source) {
    const ast = Compiler.parse_repl(source, "(repl)");
    return lower(ast, source);
}
exports.compile = compile;
function declaration_name(x) {
    switch (x.tag) {
        case IR.DeclarationTag.ACTION:
            return `added action ${x.name}`;
        case IR.DeclarationTag.CAPABILITY:
            return `added capability group ${x.name}`;
        case IR.DeclarationTag.COMMAND:
            return `added command ${x.name}`;
        case IR.DeclarationTag.CONTEXT:
            return `added context ${x.name}`;
        case IR.DeclarationTag.DEFINE:
            return `defined ${x.name}`;
        case IR.DeclarationTag.EFFECT:
            return `added effect ${x.name}`;
        case IR.DeclarationTag.FOREIGN_TYPE:
            return `added foreign type ${x.name}`;
        case IR.DeclarationTag.IMPLEMENT_TRAIT:
            return `registered trait implementation for ${x.trait.name}`;
        case IR.DeclarationTag.OPEN:
            return `opened ${x.namespace}`;
        case IR.DeclarationTag.PRELUDE:
            return `scheduled prelude`;
        case IR.DeclarationTag.PROTECT:
            return `protected type`;
        case IR.DeclarationTag.RELATION:
            return `added relation ${x.name}`;
        case IR.DeclarationTag.SEAL:
            return `sealed type`;
        case IR.DeclarationTag.TEST:
            return `added test ${x.name}`;
        case IR.DeclarationTag.TRAIT:
            return `added trait ${x.name}`;
        case IR.DeclarationTag.TYPE:
            return `added type ${x.name}`;
        case IR.DeclarationTag.WHEN:
            return `added logical event`;
        default:
            throw new Error(`unknown declaration`);
    }
}

},{"../../../../build/compiler":1,"../../../../build/ir":9,"../../../../build/vm":23}],105:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],106:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":107,"get-intrinsic":112}],107:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":111,"get-intrinsic":112}],108:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":112}],109:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],110:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],111:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":110}],112:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":111,"has":116,"has-symbols":113}],113:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":114}],114:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],115:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":114}],116:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":111}],117:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],118:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":106,"has-tostringtag/shams":115}],119:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":115}],120:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":105,"call-bind/callBound":106,"es-abstract/helpers/getOwnPropertyDescriptor":108,"foreach":109,"has-tostringtag/shams":115}],121:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],122:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],123:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":118,"is-generator-function":119,"is-typed-array":120,"which-typed-array":125}],124:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":122,"./support/types":123,"_process":121,"inherits":117}],125:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":105,"call-bind/callBound":106,"es-abstract/helpers/getOwnPropertyDescriptor":108,"foreach":109,"has-tostringtag/shams":115,"is-typed-array":120}]},{},[103]);
