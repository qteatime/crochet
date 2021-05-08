(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Crochet"] = factory();
	else
		root["Crochet"] = factory();
})(global, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Crochet = void 0;
const Path = __webpack_require__(1);
const FS = __webpack_require__(3);
const stdlib = __webpack_require__(4);
const runtime_1 = __webpack_require__(7);
const vm_interface_1 = __webpack_require__(139);
class Crochet extends vm_interface_1.CrochetVM {
    constructor() {
        super(...arguments);
        this.stdlib_path = Path.join(__dirname, "../../stdlib");
    }
    get prelude() {
        return ["crochet.core", "crochet.debug"];
    }
    async read_file(filename) {
        return FS.readFileSync(filename, "utf-8");
    }
    async load_native(filename) {
        // FIXME: this is really unsafe :')
        const module = __webpack_require__(146)(filename);
        if (typeof module.default === "function") {
            return module.default;
        }
        else if (typeof module === "function") {
            return module;
        }
        else {
            throw new Error(`Cannot load native module ${filename} because it does not export a function`);
        }
    }
    async initialise() {
        await stdlib.load(runtime_1.State.root(this.world));
        await this.register_packages_from_directory(this.stdlib_path);
    }
    async register_packages_from_directory(root) {
        for (const dir of FS.readdirSync(root)) {
            const file = Path.join(root, dir, "crochet.json");
            if (FS.existsSync(file)) {
                const pkg = await this.read_package_from_file(file);
                this.register_package(pkg.name, pkg);
            }
        }
    }
}
exports.Crochet = Crochet;
//# sourceMappingURL=cli.js.map

/***/ }),
/* 3 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Html = exports.load = void 0;
const native_1 = __webpack_require__(5);
async function load(state) {
    for (const ffi_fun of native_1.funs) {
        ffi_fun(state.world.ffi);
    }
}
exports.load = load;
const Html = __webpack_require__(81);
exports.Html = Html;
__exportStar(__webpack_require__(77), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.funs = void 0;
const debug_1 = __webpack_require__(6);
const time_1 = __webpack_require__(78);
const core_1 = __webpack_require__(79);
const text_1 = __webpack_require__(80);
const html_1 = __webpack_require__(81);
const mathematics_1 = __webpack_require__(85);
const collections_1 = __webpack_require__(86);
const random_1 = __webpack_require__(87);
const json_1 = __webpack_require__(88);
const lingua_1 = __webpack_require__(89);
const intl_1 = __webpack_require__(137);
const codec_1 = __webpack_require__(138);
exports.funs = [
    ...debug_1.default,
    ...time_1.default,
    ...core_1.default,
    ...mathematics_1.default,
    ...html_1.default,
    ...collections_1.default,
    ...text_1.default,
    ...random_1.default,
    ...json_1.default,
    ...lingua_1.default,
    ...intl_1.default,
    ...codec_1.default,
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debug_time = exports.debug_trace = exports.debug_transcript = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
function debug_transcript(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.debug:transcript")
        .defun("write", [runtime_1.CrochetValue, runtime_1.CrochetText], (self, text) => {
        console.log(text.value);
        return self;
    })
        .defun("write-inspect", [runtime_1.CrochetValue, runtime_1.CrochetValue], (self, value) => {
        console.log(value.to_text());
        return value;
    });
}
exports.debug_transcript = debug_transcript;
function debug_trace(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.debug:trace-constraint")
        .defun("ec-named", [runtime_1.CrochetText], (text) => runtime_1.box(new runtime_1.ECNamed(text.value)))
        .defun("ec-package", [runtime_1.CrochetText], (text) => runtime_1.box(new runtime_1.ECInPackage(text.value)))
        .defun("ec-and", [runtime_1.CrochetUnknown, runtime_1.CrochetUnknown], (a, b) => runtime_1.box(new runtime_1.ECAnd(utils_1.cast(a.value, runtime_1.EntityConstraint), utils_1.cast(b.value, runtime_1.EntityConstraint))))
        .defun("ec-or", [runtime_1.CrochetUnknown, runtime_1.CrochetUnknown], (a, b) => runtime_1.box(new runtime_1.ECOr(utils_1.cast(a.value, runtime_1.EntityConstraint), utils_1.cast(b.value, runtime_1.EntityConstraint))))
        .defun("ec-not", [runtime_1.CrochetUnknown], (a) => runtime_1.box(new runtime_1.ECNot(utils_1.cast(a.value, runtime_1.EntityConstraint))))
        .defun("tc-invoke", [runtime_1.CrochetUnknown], (a) => runtime_1.box(new runtime_1.TCInvoke(utils_1.cast(a.value, runtime_1.EntityConstraint))));
    new ffi_def_1.ForeignNamespace(ffi, "crochet.debug:trace")
        .defmachine("start-tracing", [runtime_1.CrochetText, runtime_1.CrochetUnknown], function* (state, name, c) {
        const ref = state.world.tracer.start_tracing(name.value, utils_1.cast(c.value, runtime_1.TraceConstraint));
        return runtime_1.box(ref);
    })
        .defmachine("stop-tracing", [runtime_1.CrochetUnknown], function* (state, ref) {
        state.world.tracer.stop_tracing(utils_1.cast(ref.value, runtime_1.TraceRef));
        return runtime_1.CrochetNothing.instance;
    })
        .defmachine("clear-traces", [], function* (state) {
        state.world.tracer.clear_traces();
        return runtime_1.CrochetNothing.instance;
    });
}
exports.debug_trace = debug_trace;
function debug_time(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.debug:time").defmachine("time", [runtime_1.CrochetText, runtime_1.CrochetValue], function* (state, label, computation) {
        const ns_start = process.hrtime.bigint();
        const result = runtime_1.cvalue(yield runtime_1._push(runtime_1.apply(state, computation, [])));
        const ns_end = process.hrtime.bigint();
        const diff = ns_end - ns_start;
        console.log(`[${label.value}] ${utils_1.format_time_diff(diff)}`);
        return result;
    });
}
exports.debug_time = debug_time;
exports.default = [debug_transcript, debug_trace, debug_time];
//# sourceMappingURL=debug.js.map

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IR = void 0;
const IR = __webpack_require__(8);
exports.IR = IR;
__exportStar(__webpack_require__(12), exports);
__exportStar(__webpack_require__(18), exports);
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(10), exports);
__exportStar(__webpack_require__(15), exports);
__exportStar(__webpack_require__(70), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(9), exports);
__exportStar(__webpack_require__(64), exports);
__exportStar(__webpack_require__(65), exports);
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(68), exports);
__exportStar(__webpack_require__(66), exports);
__exportStar(__webpack_require__(69), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DTest = exports.DOpen = exports.DContext = exports.DSealType = exports.DForeignType = exports.DWhen = exports.DAction = exports.DScene = exports.DDefine = exports.DType = exports.DCrochetCommand = exports.DForeignCommand = exports.DDo = exports.DPredicate = exports.DRelation = exports.Declaration = void 0;
const simulation_1 = __webpack_require__(10);
const logic_1 = __webpack_require__(12);
const primitives_1 = __webpack_require__(18);
const procedure_1 = __webpack_require__(46);
const vm_1 = __webpack_require__(15);
const world_1 = __webpack_require__(49);
const statement_1 = __webpack_require__(64);
const utils_1 = __webpack_require__(33);
class Declaration {
}
exports.Declaration = Declaration;
class DRelation extends Declaration {
    constructor(position, name, type) {
        super();
        this.position = position;
        this.name = name;
        this.type = type;
    }
    async apply(context, state) {
        const relation = new logic_1.ConcreteRelation(this.position, this.name, this.type.realise());
        state.world.database.add(this.name, relation);
    }
}
exports.DRelation = DRelation;
class DPredicate extends Declaration {
    constructor(position, name, procedure) {
        super();
        this.position = position;
        this.name = name;
        this.procedure = procedure;
    }
    async apply(context, state) {
        this.procedure.set_metadata(this.position);
        state.world.database.add(this.name, this.procedure);
    }
}
exports.DPredicate = DPredicate;
class DDo extends Declaration {
    constructor(position, body) {
        super();
        this.position = position;
        this.body = body;
    }
    async apply(context, state) {
        const block = new statement_1.SBlock(this.position, this.body);
        state.world.schedule(block.evaluate(state.with_new_env()));
    }
}
exports.DDo = DDo;
class DForeignCommand extends Declaration {
    constructor(position, name, types, foreign_name, parameters, args, contract, override) {
        super();
        this.position = position;
        this.name = name;
        this.types = types;
        this.foreign_name = foreign_name;
        this.parameters = parameters;
        this.args = args;
        this.contract = contract;
        this.override = override;
    }
    async apply(context, state) {
        const env = new world_1.Environment(state.env, context.module, null);
        state.world.procedures.add_foreign(this.name, this.types.map((x) => x.realise(state)), new procedure_1.NativeProcedure(this.position, env, this.name, this.parameters, this.args, `${context.package.name}:${this.foreign_name}`, this.contract), this.override);
    }
}
exports.DForeignCommand = DForeignCommand;
class DCrochetCommand extends Declaration {
    constructor(position, name, parameters, types, body, contract, override) {
        super();
        this.position = position;
        this.name = name;
        this.parameters = parameters;
        this.types = types;
        this.body = body;
        this.contract = contract;
        this.override = override;
    }
    async apply(context, state) {
        const env = new world_1.Environment(state.env, context.module, null);
        const code = new procedure_1.CrochetProcedure(this.position, env, state.world, this.name, this.parameters, this.body, this.contract);
        state.world.procedures.add_crochet(this.name, this.types.map((x) => x.realise(state)), code, this.override);
    }
}
exports.DCrochetCommand = DCrochetCommand;
class DType extends Declaration {
    constructor(position, local, parent, name, fields) {
        super();
        this.position = position;
        this.local = local;
        this.parent = parent;
        this.name = name;
        this.fields = fields;
    }
    async apply(context, state) {
        const fields = this.fields.map((x) => x.parameter);
        const types = this.fields.map((x) => x.type.realise(state));
        const layout = new Map(this.fields.map((x, i) => [x.parameter, i]));
        const parent = this.parent ? this.parent.realise(state) : null;
        const type = new primitives_1.TCrochetType(context.module, this.position, parent ?? primitives_1.TCrochetAny.type, this.name, types, fields, layout);
        if (parent != null) {
            const parentType = utils_1.cast(parent, primitives_1.TCrochetType);
            parentType.register_subtype(type);
        }
        context.module.add_type(this.name, type, this.local);
    }
}
exports.DType = DType;
class DDefine extends Declaration {
    constructor(position, local, name, value) {
        super();
        this.position = position;
        this.local = local;
        this.name = name;
        this.value = value;
    }
    async apply(context, state) {
        const new_state = state.with_new_env();
        const value = vm_1.cvalue(vm_1.Thread.for_expr(this.value, new_state).run_sync());
        context.module.add_value(this.name, value, this.local);
    }
}
exports.DDefine = DDefine;
class DScene extends Declaration {
    constructor(position, name, body) {
        super();
        this.position = position;
        this.name = name;
        this.body = body;
    }
    async apply(context, state) {
        const env = new world_1.Environment(state.env, context.module, null);
        const scene = new world_1.Scene(this.position, this.name, env, this.body);
        state.world.scenes.add(this.name, scene);
    }
}
exports.DScene = DScene;
class DAction extends Declaration {
    constructor(position, type_resctiction, title, tags, predicate, rank, body) {
        super();
        this.position = position;
        this.type_resctiction = type_resctiction;
        this.title = title;
        this.tags = tags;
        this.predicate = predicate;
        this.rank = rank;
        this.body = body;
    }
    async apply_to_context(declaration_context, state, context) {
        const env = new world_1.Environment(state.env, declaration_context.module, null);
        const tags = this.tags.map((x) => state.env.module.lookup_value(x));
        const action = new simulation_1.Action(this.position, this.title, this.predicate, tags, env, this.rank, this.body, this.type_resctiction);
        context.add_action(action);
    }
    async apply(context, state) {
        this.apply_to_context(context, state, state.world.global_context);
    }
}
exports.DAction = DAction;
class DWhen extends Declaration {
    constructor(position, predicate, body) {
        super();
        this.position = position;
        this.predicate = predicate;
        this.body = body;
    }
    async apply_to_context(declaration_context, state, context) {
        const env = new world_1.Environment(state.env, declaration_context.module, null);
        const event = new simulation_1.When(this.position, this.predicate, env, this.body);
        context.add_event(event);
    }
    async apply(context, state) {
        this.apply_to_context(context, state, state.world.global_context);
    }
}
exports.DWhen = DWhen;
class DForeignType extends Declaration {
    constructor(position, local, name, foreign_name) {
        super();
        this.position = position;
        this.local = local;
        this.name = name;
        this.foreign_name = foreign_name;
    }
    async apply(context, state) {
        const type = state.world.ffi.types.lookup(`${context.package.name}:${this.foreign_name}`);
        context.module.add_type(this.name, type, this.local);
    }
}
exports.DForeignType = DForeignType;
class DSealType extends Declaration {
    constructor(position, name) {
        super();
        this.position = position;
        this.name = name;
    }
    async apply(context, state) {
        const type = utils_1.cast(context.module.lookup_type(this.name), primitives_1.TCrochetType);
        type.seal();
    }
}
exports.DSealType = DSealType;
class DContext extends Declaration {
    constructor(position, name, declarations) {
        super();
        this.position = position;
        this.name = name;
        this.declarations = declarations;
    }
    async apply(declaration_context, state) {
        const context = new simulation_1.ConcreteContext(this.position, this.name);
        state.world.contexts.add(this.name, context);
        for (const x of this.declarations) {
            await x.apply_to_context(declaration_context, state, context);
        }
    }
}
exports.DContext = DContext;
class DOpen extends Declaration {
    constructor(position, ns) {
        super();
        this.position = position;
        this.ns = ns;
    }
    async apply(declaration_context, state) {
        const module = declaration_context.module;
        module.open_namespace(this.ns);
    }
}
exports.DOpen = DOpen;
class DTest extends Declaration {
    constructor(position, title, body) {
        super();
        this.position = position;
        this.title = title;
        this.body = body;
    }
    async apply(declaration_context, state) {
        const test = new world_1.CrochetTest(declaration_context.module, this.title, state.env, this.body);
        declaration_context.module.add_test(test);
    }
}
exports.DTest = DTest;
//# sourceMappingURL=declaration.js.map

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(11), exports);
__exportStar(__webpack_require__(61), exports);
__exportStar(__webpack_require__(62), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnyContext = exports.ConcreteContext = exports.Context = exports.ContextBag = exports.Action = exports.When = void 0;
const ir_1 = __webpack_require__(8);
const logic_1 = __webpack_require__(12);
const vm_1 = __webpack_require__(15);
const primitives_1 = __webpack_require__(18);
const utils_1 = __webpack_require__(33);
const layer_1 = __webpack_require__(60);
class When {
    constructor(meta, predicate, env, body) {
        this.meta = meta;
        this.predicate = predicate;
        this.env = env;
        this.body = body;
    }
    get full_name() {
        return `an event (from ${this.env.module.qualified_name}${this.meta.at_line_suffix})`;
    }
    executions(state) {
        const results = state.database.search(state, this.predicate, logic_1.UnificationEnvironment.empty());
        return results.map((uenv) => {
            const env = this.env.clone_with_receiver(null);
            env.define_all(uenv.boundValues);
            const block = new ir_1.SBlock(ir_1.generated_node, this.body);
            return block.evaluate(state.with_env(env));
        });
    }
}
exports.When = When;
class Action {
    constructor(meta, title, predicate, tags, env, rank, body, for_type) {
        this.meta = meta;
        this.title = title;
        this.predicate = predicate;
        this.tags = tags;
        this.env = env;
        this.rank = rank;
        this.body = body;
        this.for_type = for_type;
        this.fired_for = new utils_1.BagMap();
    }
    ready_actions(actor, state0) {
        const type = this.for_type.realise(state0);
        if (!type.accepts(actor)) {
            return [];
        }
        const db = new layer_1.DatabaseLayer(state0.database, this.layer);
        const state = state0.with_database(db);
        const results = state.database.search(state, this.predicate, logic_1.UnificationEnvironment.empty());
        return results.map((uenv) => {
            const env = this.env.clone_with_receiver(null);
            env.define_all(uenv.boundValues);
            const block = new ir_1.SBlock(ir_1.generated_node, this.body);
            return {
                action: this,
                title: new primitives_1.CrochetThunk(this.title, env),
                score: new primitives_1.CrochetThunk(this.rank, env),
                tags: this.tags,
                machine: block.evaluate(state.with_env(env)),
            };
        });
    }
    fire(actor) {
        const fired = this.fired_for.get(actor) ?? 0n;
        this.fired_for.set(actor, fired + 1n);
    }
    get layer() {
        const layer = new layer_1.FunctionLayer(null);
        layer.add("_ action-fired:", (state, env, [pactor, ptimes]) => {
            return utils_1.iter(this.fired_for.entries())
                .flatMap(([actor, times]) => {
                return pactor.aunify(state, env, actor).flatMap((env) => {
                    return ptimes.aunify(state, env, new primitives_1.CrochetInteger(times));
                });
            })
                .to_array();
        });
        return layer;
    }
}
exports.Action = Action;
class ContextBag extends utils_1.Bag {
    constructor() {
        super("context");
    }
    get concrete_contexts() {
        const result = [];
        for (const x of this.map.values()) {
            if (x instanceof ConcreteContext) {
                result.push(x);
            }
        }
        return result;
    }
}
exports.ContextBag = ContextBag;
class Context {
    add_action(action) {
        throw vm_1.die(`can only add actions to concrete contexts`);
    }
    add_event(event) {
        throw vm_1.die(`can only add events to concrete contexts`);
    }
}
exports.Context = Context;
class ConcreteContext {
    constructor(meta, name) {
        this.meta = meta;
        this.name = name;
        this.events = [];
        this.actions = [];
    }
    add_action(action) {
        this.actions.push(action);
    }
    add_event(event) {
        this.events.push(event);
    }
    available_actions(actor, state) {
        return this.actions.flatMap((x) => x.ready_actions(actor, state));
    }
    available_events(state) {
        return this.events.flatMap((x) => x.executions(state).map((e) => vm_1._mark(x.full_name, e)));
    }
}
exports.ConcreteContext = ConcreteContext;
class AnyContext extends Context {
    available_actions(actor, state) {
        return state.world.all_contexts.flatMap((x) => x.available_actions(actor, state));
    }
    available_events(state) {
        return state.world.all_contexts.flatMap((x) => x.available_events(state));
    }
}
exports.AnyContext = AnyContext;
AnyContext.instance = new AnyContext();
//# sourceMappingURL=event.js.map

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Effect = void 0;
const Effect = __webpack_require__(13);
exports.Effect = Effect;
__exportStar(__webpack_require__(14), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(58), exports);
__exportStar(__webpack_require__(59), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Trivial = void 0;
class Trivial {
    evaluate(env) {
        return env;
    }
}
exports.Trivial = Trivial;
//# sourceMappingURL=effect.js.map

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Database = void 0;
const vm_1 = __webpack_require__(15);
class Database {
    constructor() {
        this.relations = new Map();
    }
    add(name, relation) {
        if (this.relations.has(name)) {
            throw vm_1.die(`duplicated database predicate: ${name}`);
        }
        this.relations.set(name, relation);
    }
    update(name, relation) {
        this.relations.set(name, relation);
    }
    try_lookup(name) {
        return this.relations.get(name) ?? null;
    }
    lookup(name) {
        const relation = this.try_lookup(name);
        if (relation == null) {
            throw vm_1.die(`undefined relation: ${name}`);
        }
        return relation;
    }
    search(state, predicate, initial_environment) {
        return predicate.search(state.with_database(this), initial_environment);
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(56), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(17), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrArbitrary = exports.ErrNativeError = exports.ErrNoSelection = exports.ErrNoProjection = exports.ErrInvalidArity = exports.ErrUnexpectedType = exports.ErrIndexOutOfRange = exports.ErrNoRecordKey = exports.ErrNoConversionAvailable = exports.ErrNoBranchMatched = exports.ErrVariableAlreadyBound = exports.ErrUndefinedVariable = exports.MachineError = void 0;
const primitives_1 = __webpack_require__(18);
class MachineError {
    format_verbose() {
        return this.format();
    }
}
exports.MachineError = MachineError;
class ErrUndefinedVariable extends MachineError {
    constructor(name) {
        super();
        this.name = name;
    }
    format() {
        return `undefined-variable: Undefined variable ${this.name}`;
    }
}
exports.ErrUndefinedVariable = ErrUndefinedVariable;
class ErrVariableAlreadyBound extends MachineError {
    constructor(name) {
        super();
        this.name = name;
    }
    format() {
        return `variable-already-bound: The variable ${this.name} is already bound`;
    }
}
exports.ErrVariableAlreadyBound = ErrVariableAlreadyBound;
class ErrNoBranchMatched extends MachineError {
    constructor(procedure, args) {
        super();
        this.procedure = procedure;
        this.args = args;
    }
    format() {
        return `no-branch-matched: No branches of ${this.procedure.name} match the signature (${this.args.map(primitives_1.type_name).join(", ")})`;
    }
}
exports.ErrNoBranchMatched = ErrNoBranchMatched;
class ErrNoConversionAvailable extends MachineError {
    constructor(type, value) {
        super();
        this.type = type;
        this.value = value;
    }
    format() {
        return `no-conversion-available: It's not possible to convert the value of type ${primitives_1.type_name(this.value)} to ${primitives_1.type_name(this.type)}`;
    }
}
exports.ErrNoConversionAvailable = ErrNoConversionAvailable;
class ErrNoRecordKey extends MachineError {
    constructor(record, key) {
        super();
        this.record = record;
        this.key = key;
    }
    format() {
        return `no-record-key: The record does not contain a key ${this.key}`;
    }
}
exports.ErrNoRecordKey = ErrNoRecordKey;
class ErrIndexOutOfRange extends MachineError {
    constructor(value, index) {
        super();
        this.value = value;
        this.index = index;
    }
    format() {
        return `index-out-of-range: The index ${this.index} does not exist in the value`;
    }
}
exports.ErrIndexOutOfRange = ErrIndexOutOfRange;
class ErrUnexpectedType extends MachineError {
    constructor(type, value) {
        super();
        this.type = type;
        this.value = value;
    }
    format() {
        return `unexpected-type: Expected a value of type ${primitives_1.type_name(this.type)}, but got a value of type ${primitives_1.type_name(this.value)}`;
    }
}
exports.ErrUnexpectedType = ErrUnexpectedType;
class ErrInvalidArity extends MachineError {
    constructor(partial, provided) {
        super();
        this.partial = partial;
        this.provided = provided;
    }
    format() {
        return `invalid-arity: ${primitives_1.type_name(this.partial)} requires ${this.partial.arity} arguments, but was given ${this.provided}`;
    }
}
exports.ErrInvalidArity = ErrInvalidArity;
class ErrNoProjection extends MachineError {
    constructor(value) {
        super();
        this.value = value;
    }
    format() {
        return `no-projection: ${primitives_1.type_name(this.value)} does not support projection.`;
    }
}
exports.ErrNoProjection = ErrNoProjection;
class ErrNoSelection extends MachineError {
    constructor(value) {
        super();
        this.value = value;
    }
    format() {
        return `no-selection: ${primitives_1.type_name(this.value)} does not support selection.`;
    }
}
exports.ErrNoSelection = ErrNoSelection;
class ErrNativeError extends MachineError {
    constructor(error) {
        super();
        this.error = error;
    }
    format() {
        return `internal: ${this.error.name}: ${this.error.message}`;
    }
    format_verbose() {
        if (this.error.stack != null) {
            return `internal: ${this.error.stack}`;
        }
        else {
            return this.format();
        }
    }
}
exports.ErrNativeError = ErrNativeError;
class ErrArbitrary extends MachineError {
    constructor(name, message) {
        super();
        this.name = name;
        this.message = message;
    }
    format() {
        return `${this.name}: ${this.message}`;
    }
}
exports.ErrArbitrary = ErrArbitrary;
//# sourceMappingURL=errors.js.map

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(19), exports);
__exportStar(__webpack_require__(20), exports);
__exportStar(__webpack_require__(43), exports);
__exportStar(__webpack_require__(44), exports);
__exportStar(__webpack_require__(22), exports);
__exportStar(__webpack_require__(32), exports);
__exportStar(__webpack_require__(30), exports);
__exportStar(__webpack_require__(29), exports);
__exportStar(__webpack_require__(31), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(45), exports);
__exportStar(__webpack_require__(21), exports);
__exportStar(__webpack_require__(46), exports);
__exportStar(__webpack_require__(25), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.type_name = exports.CrochetNothing = exports.TCrochetNothing = exports.TCrochetAny = exports.CrochetTypeInstance = exports.TCrochetTypeInstance = exports.CrochetType = exports.CrochetValue = void 0;
const vm_1 = __webpack_require__(15);
class CrochetValue {
    constructor() {
        this._projection = null;
        this._selection = null;
    }
    as_bool() {
        return true;
    }
    to_js() {
        return this;
    }
    equals(other) {
        return other === this;
    }
    not_equals(other) {
        return !this.equals(other);
    }
    to_text(transparent) {
        return `<${type_name(this.type)}>`;
    }
    to_debug_text(transparent) {
        return this.to_text(transparent);
    }
    to_json() {
        throw new vm_1.ErrArbitrary("unsupported", `Unsupported by ${type_name(this.type)}`);
    }
    get projection() {
        const projection = this._projection;
        if (!projection) {
            throw new vm_1.ErrNoProjection(this);
        }
        else {
            return projection;
        }
    }
    get selection() {
        const selection = this._selection;
        if (!selection) {
            throw new vm_1.ErrNoSelection(this);
        }
        else {
            return selection;
        }
    }
}
exports.CrochetValue = CrochetValue;
class CrochetType {
    constructor() {
        this._static_type = null;
        this.module = null;
    }
    get static_type() {
        if (this._static_type == null) {
            const type = new CrochetTypeInstance(this);
            this._static_type = type;
            return type;
        }
        else {
            return this._static_type;
        }
    }
    accepts(x) {
        return x.type.is_subtype(this);
    }
    is_subtype(type) {
        if (this === type) {
            return true;
        }
        else if (this.parent != null) {
            return this.parent.is_subtype(type);
        }
        else {
            return false;
        }
    }
    distance() {
        if (this.parent == null) {
            return 0;
        }
        else {
            return -1 + this.parent.distance();
        }
    }
    coerce(x) {
        if (this.accepts(x)) {
            return x;
        }
        else {
            return null;
        }
    }
    get location() {
        const module = this.module;
        if (module == null) {
            return "built-in";
        }
        else {
            return `from ${module.qualified_name}`;
        }
    }
    get documentation() {
        return "(no documentation)";
    }
}
exports.CrochetType = CrochetType;
class TCrochetTypeInstance extends CrochetType {
    constructor(type) {
        super();
        this.type = type;
    }
    get type_name() {
        return `#${this.type}`;
    }
    get parent() {
        return TCrochetAny.type;
    }
}
exports.TCrochetTypeInstance = TCrochetTypeInstance;
class CrochetTypeInstance extends CrochetValue {
    constructor(type_wrapped) {
        super();
        this.type_wrapped = type_wrapped;
        this.type = new TCrochetTypeInstance(this.type_wrapped.type_name);
    }
}
exports.CrochetTypeInstance = CrochetTypeInstance;
class TCrochetAny extends CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "any";
        this.parent = null;
    }
    coerce(x) {
        return x;
    }
}
exports.TCrochetAny = TCrochetAny;
TCrochetAny.type = new TCrochetAny();
class TCrochetNothing extends CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "nothing";
        this.parent = TCrochetAny.type;
    }
}
exports.TCrochetNothing = TCrochetNothing;
TCrochetNothing.type = new TCrochetNothing();
class CrochetNothing extends CrochetValue {
    get type() {
        return TCrochetNothing.type;
    }
    as_bool() {
        return false;
    }
    to_text() {
        return "nothing";
    }
    to_json() {
        return null;
    }
}
exports.CrochetNothing = CrochetNothing;
CrochetNothing.instance = new CrochetNothing();
function type_name(x) {
    if (x instanceof CrochetValue) {
        return x.type.type_name;
    }
    else if (x instanceof CrochetType) {
        return x.type_name;
    }
    else {
        return `<host value: ${x?.name ?? typeof x}>`;
    }
}
exports.type_name = type_name;
//# sourceMappingURL=0-core.js.map

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetFalse = exports.TCrochetTrue = exports.TCrochetBoolean = exports.False = exports.True = void 0;
const _0_core_1 = __webpack_require__(19);
const core_ops_1 = __webpack_require__(21);
class True extends _0_core_1.CrochetValue {
    get type() {
        return TCrochetTrue.type;
    }
    equals(other) {
        return !(other instanceof False);
    }
    as_bool() {
        return true;
    }
    to_js() {
        return true;
    }
    to_text() {
        return "true";
    }
    to_json() {
        return true;
    }
}
exports.True = True;
True.instance = new True();
class False extends _0_core_1.CrochetValue {
    get type() {
        return TCrochetFalse.type;
    }
    equals(other) {
        return other instanceof False;
    }
    as_bool() {
        return false;
    }
    to_js() {
        return false;
    }
    to_text() {
        return "false";
    }
    to_json() {
        return false;
    }
}
exports.False = False;
False.instance = new False();
class TCrochetBoolean extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "boolean";
    }
    coerce(x) {
        return core_ops_1.from_bool(x.as_bool());
    }
}
exports.TCrochetBoolean = TCrochetBoolean;
TCrochetBoolean.type = new TCrochetBoolean();
class TCrochetTrue extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = TCrochetBoolean.type;
        this.type_name = "true";
    }
    coerce(x) {
        if (x.as_bool()) {
            return True.instance;
        }
        else {
            return null;
        }
    }
}
exports.TCrochetTrue = TCrochetTrue;
TCrochetTrue.type = new TCrochetTrue();
class TCrochetFalse extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = TCrochetBoolean.type;
        this.type_name = "false";
    }
    coerce(x) {
        if (!x.as_bool()) {
            return False.instance;
        }
        else {
            return null;
        }
    }
}
exports.TCrochetFalse = TCrochetFalse;
TCrochetFalse.type = new TCrochetFalse();
//# sourceMappingURL=boolean.js.map

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.equals_sync = exports.equals = exports.from_integer = exports.from_string = exports.project = exports.get_thunk = exports.get_map = exports.get_array = exports.get_string = exports.get_integer = exports.number_to_float = exports.unbox_typed = exports.unbox = exports.box = exports.json_to_crochet = exports.js_to_crochet = exports.apply = exports.apply_partial = exports.invoke = exports.safe_cast = exports.from_bool = void 0;
const _0_core_1 = __webpack_require__(19);
const vm_1 = __webpack_require__(15);
const partial_1 = __webpack_require__(22);
const boolean_1 = __webpack_require__(20);
const numeric_1 = __webpack_require__(25);
const text_1 = __webpack_require__(29);
const tuple_1 = __webpack_require__(30);
const unknown_1 = __webpack_require__(31);
const record_1 = __webpack_require__(32);
const utils_1 = __webpack_require__(33);
const thunk_1 = __webpack_require__(42);
function from_bool(x) {
    return x ? boolean_1.True.instance : boolean_1.False.instance;
}
exports.from_bool = from_bool;
function* safe_cast(x, type) {
    if (type.accepts(x)) {
        return x;
    }
    else {
        throw new vm_1.ErrUnexpectedType(type, x);
    }
}
exports.safe_cast = safe_cast;
function* invoke(state, name, args) {
    const procedure = state.world.procedures.lookup(name);
    const branch0 = procedure.select(args);
    let branch;
    if (branch0 == null) {
        throw new vm_1.ErrNoBranchMatched(procedure, args);
    }
    else {
        branch = branch0;
    }
    const result = vm_1.cvalue(yield vm_1._push(branch.procedure.invoke(state, args)));
    return result;
}
exports.invoke = invoke;
function* apply_partial(state, fn, args) {
    if (fn.arity !== args.length) {
        throw new vm_1.ErrInvalidArity(fn, args.length);
    }
    else {
        const new_fn = fn.merge(args);
        if (new_fn.is_saturated) {
            return yield vm_1._push(invoke(state, new_fn.name, new_fn.concrete_args));
        }
        else {
            return new_fn;
        }
    }
}
exports.apply_partial = apply_partial;
function* apply(state, fn, args) {
    if (fn instanceof partial_1.CrochetPartial) {
        return yield vm_1._push(apply_partial(state, fn, args.map((x) => new partial_1.PartialConcrete(x))));
    }
    else if (fn instanceof partial_1.CrochetLambda) {
        return yield vm_1._push(fn.apply(state, args));
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected a function, got ${fn.to_text()}`);
    }
}
exports.apply = apply;
function js_to_crochet(value) {
    if (value instanceof _0_core_1.CrochetValue) {
        return value;
    }
    switch (typeof value) {
        case "number":
            return new numeric_1.CrochetFloat(value);
        case "bigint":
            return new numeric_1.CrochetInteger(value);
        case "boolean":
            return from_bool(value);
        case "string":
            return new text_1.CrochetText(value);
        default: {
            if (value == null) {
                return _0_core_1.CrochetNothing.instance;
            }
            else if (Array.isArray(value)) {
                return new tuple_1.CrochetTuple(value.map(js_to_crochet));
            }
            else {
                return new unknown_1.CrochetUnknown(value);
            }
        }
    }
}
exports.js_to_crochet = js_to_crochet;
function json_to_crochet(value) {
    switch (typeof value) {
        case "number":
            return new numeric_1.CrochetFloat(value);
        case "boolean":
            return from_bool(value);
        case "string":
            return new text_1.CrochetText(value);
        case "object": {
            if (value == null) {
                return _0_core_1.CrochetNothing.instance;
            }
            else if (Array.isArray(value)) {
                return new tuple_1.CrochetTuple(value.map(json_to_crochet));
            }
            else {
                const result = new Map();
                for (const [key, prop] of Object.entries(value)) {
                    result.set(key, json_to_crochet(prop));
                }
                return new record_1.CrochetRecord(result);
            }
        }
        default:
            throw new vm_1.ErrArbitrary("invalid-json", `Invalid JSON type ${typeof value}`);
    }
}
exports.json_to_crochet = json_to_crochet;
function box(value) {
    if (value instanceof unknown_1.CrochetUnknown) {
        return value;
    }
    else {
        return new unknown_1.CrochetUnknown(value);
    }
}
exports.box = box;
function unbox(value) {
    return utils_1.cast(value, unknown_1.CrochetUnknown).value;
}
exports.unbox = unbox;
function unbox_typed(type, value) {
    const result = unbox(value);
    if (result instanceof type) {
        return result;
    }
    else {
        throw new vm_1.ErrNativeError(new Error(`invalid-type: Expected ${type.name}`));
    }
}
exports.unbox_typed = unbox_typed;
function number_to_float(value) {
    if (value instanceof numeric_1.CrochetInteger) {
        return Number(value.value);
    }
    else if (value instanceof numeric_1.CrochetFloat) {
        return value.value;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected an integer or float, got ${_0_core_1.type_name(value)}`);
    }
}
exports.number_to_float = number_to_float;
function get_integer(value) {
    if (value instanceof numeric_1.CrochetInteger) {
        return value.value;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected an integer, got ${_0_core_1.type_name(value)}`);
    }
}
exports.get_integer = get_integer;
function get_string(value) {
    if (value instanceof text_1.CrochetText) {
        return value.value;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected a text, got ${_0_core_1.type_name(value)}`);
    }
}
exports.get_string = get_string;
function get_array(value) {
    if (value instanceof tuple_1.CrochetTuple) {
        return value.values;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected a tuple, got ${_0_core_1.type_name(value)}`);
    }
}
exports.get_array = get_array;
function get_map(value) {
    if (value instanceof record_1.CrochetRecord) {
        return value.values;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected a record, got ${_0_core_1.type_name(value)}`);
    }
}
exports.get_map = get_map;
function get_thunk(value) {
    if (value instanceof thunk_1.CrochetThunk) {
        return value;
    }
    else {
        throw new vm_1.ErrArbitrary("invalid-type", `Expected a thunk, got ${_0_core_1.type_name(value)}`);
    }
}
exports.get_thunk = get_thunk;
function project(value, key, requestee_module) {
    return value.projection.project(key, requestee_module);
}
exports.project = project;
function from_string(x) {
    return new text_1.CrochetText(x);
}
exports.from_string = from_string;
function from_integer(x) {
    return new numeric_1.CrochetInteger(x);
}
exports.from_integer = from_integer;
function* equals(state, left, right) {
    const result = yield vm_1._push(invoke(state, "_ === _", [left, right]));
    return vm_1.cvalue(result);
}
exports.equals = equals;
function equals_sync(state, left, right) {
    return vm_1.cvalue(vm_1.Thread.for_machine(equals(state, left, right)).run_sync()).as_bool();
}
exports.equals_sync = equals_sync;
//# sourceMappingURL=core-ops.js.map

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PartialConcrete = exports.PartialHole = exports.PartialValue = exports.partial_holes = exports.TFunctionWithArity = exports.TAnyFunction = exports.CrochetLambda = exports.TCrochetPartial = exports.CrochetPartial = void 0;
const utils_1 = __webpack_require__(23);
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
class CrochetPartial extends _0_core_1.CrochetValue {
    constructor(name, env, values) {
        super();
        this.name = name;
        this.env = env;
        this.values = values;
        this.type = new TCrochetPartial(name, partial_holes(this.values));
    }
    equals(other) {
        return other === this;
    }
    to_text() {
        return `<partial ${this.name}>`;
    }
    merge(candidates) {
        const values = this.values.slice();
        let current_index = 0;
        let candidate_index = 0;
        while (candidate_index < candidates.length &&
            current_index < values.length) {
            const candidate = candidates[candidate_index];
            const current = values[current_index];
            if (current instanceof PartialConcrete) {
                current_index += 1;
            }
            else if (current instanceof PartialHole) {
                values[current_index] = candidate;
                candidate_index += 1;
                current_index += 1;
            }
        }
        if (candidate_index < candidates.length) {
            throw vm_1.die(`Invalid arity`);
        }
        else {
            return new CrochetPartial(this.name, this.env, values);
        }
    }
    get is_saturated() {
        return this.values.every((x) => x instanceof PartialConcrete);
    }
    get arity() {
        return partial_holes(this.values);
    }
    get concrete_args() {
        return this.values.map((x) => utils_1.cast(x, PartialConcrete).value);
    }
}
exports.CrochetPartial = CrochetPartial;
class TCrochetPartial extends _0_core_1.CrochetType {
    constructor(name, arity) {
        super();
        this.name = name;
        this.arity = arity;
    }
    get parent() {
        return TFunctionWithArity.for_arity(this.arity);
    }
    get type_name() {
        return `<partial ${this.name}>`;
    }
}
exports.TCrochetPartial = TCrochetPartial;
class CrochetLambda extends _0_core_1.CrochetValue {
    constructor(env, parameters, body) {
        super();
        this.env = env;
        this.parameters = parameters;
        this.body = body;
    }
    get arity() {
        return this.parameters.length;
    }
    get type() {
        return TFunctionWithArity.for_arity(this.parameters.length);
    }
    get full_name() {
        return `(anonymous function)`;
    }
    *apply(state0, args) {
        const env = this.env.clone();
        if (args.length !== this.parameters.length) {
            throw new vm_1.ErrArbitrary("arity-mismatch", `invalid number of arguments ${args.length} for ${this.type.type_name}`);
        }
        for (const [k, v] of utils_1.zip(this.parameters, args)) {
            env.define(k, v);
        }
        const state = state0.with_env(env);
        const value = vm_1.cvalue(yield vm_1._mark(this.full_name, this.run_body(state)));
        return value;
    }
    *run_body(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.body, state));
        return value;
    }
}
exports.CrochetLambda = CrochetLambda;
class TAnyFunction extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
    }
    get type_name() {
        return "<function>";
    }
}
exports.TAnyFunction = TAnyFunction;
TAnyFunction.type = new TAnyFunction();
class TFunctionWithArity extends _0_core_1.CrochetType {
    constructor(parent, arity) {
        super();
        this.parent = parent;
        this.arity = arity;
    }
    get type_name() {
        const holes = Array.from({ length: this.arity }, () => "_");
        return `<function(${holes.join(", ")})>`;
    }
    static for_arity(n) {
        const type = TFunctionWithArity.types[n];
        if (type == null) {
            throw new Error(`Undefined arity ${n}`);
        }
        return type;
    }
}
exports.TFunctionWithArity = TFunctionWithArity;
TFunctionWithArity.types = Array.from({ length: 10 }, (_, i) => i).map((x) => new TFunctionWithArity(TAnyFunction.type, x));
function partial_holes(values) {
    return values.filter((x) => x instanceof PartialHole).length;
}
exports.partial_holes = partial_holes;
class PartialValue {
}
exports.PartialValue = PartialValue;
class PartialHole extends PartialValue {
}
exports.PartialHole = PartialHole;
class PartialConcrete extends PartialValue {
    constructor(value) {
        super();
        this.value = value;
    }
}
exports.PartialConcrete = PartialConcrete;
//# sourceMappingURL=partial.js.map

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.format_time_diff = exports.gen = exports.copy_map = exports.every = exports.zip = exports.defer = exports.maybe_cast = exports.cast = exports.delay = exports.show = exports.unreachable = void 0;
const Util = __webpack_require__(24);
const runtime_1 = __webpack_require__(7);
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
        throw new TypeError(`internal: expected ${runtime_1.type_name(type)}, got ${runtime_1.type_name(x)}`);
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
//# sourceMappingURL=utils.js.map

/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(28), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetFractional = exports.TCrochetIntegral = exports.TCrochetNumeric = void 0;
const _0_core_1 = __webpack_require__(19);
class TCrochetNumeric extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "numeric";
        this.parent = _0_core_1.TCrochetAny.type;
    }
}
exports.TCrochetNumeric = TCrochetNumeric;
TCrochetNumeric.type = new TCrochetNumeric();
class TCrochetIntegral extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "integral";
        this.parent = TCrochetNumeric.type;
    }
}
exports.TCrochetIntegral = TCrochetIntegral;
TCrochetIntegral.type = new TCrochetIntegral();
class TCrochetFractional extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "fractional";
        this.parent = TCrochetNumeric.type;
    }
}
exports.TCrochetFractional = TCrochetFractional;
TCrochetFractional.type = new TCrochetFractional();
//# sourceMappingURL=0-core.js.map

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetInteger = exports.CrochetInteger = void 0;
const _0_core_1 = __webpack_require__(26);
const _0_core_2 = __webpack_require__(19);
class CrochetInteger extends _0_core_2.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
    }
    get type() {
        return TCrochetInteger.type;
    }
    equals(other) {
        return other instanceof CrochetInteger && other.value === this.value;
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return this.value.toString();
    }
}
exports.CrochetInteger = CrochetInteger;
class TCrochetInteger extends _0_core_2.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetIntegral.type;
        this.type_name = "integer";
    }
}
exports.TCrochetInteger = TCrochetInteger;
TCrochetInteger.type = new TCrochetInteger();
//# sourceMappingURL=integer.js.map

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetFloat = exports.CrochetFloat = void 0;
const _0_core_1 = __webpack_require__(19);
const _0_core_2 = __webpack_require__(26);
class CrochetFloat extends _0_core_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
    }
    get type() {
        return TCrochetFloat.type;
    }
    equals(other) {
        return other instanceof CrochetFloat && other.value === this.value;
    }
    to_js() {
        return this.value;
    }
    to_json() {
        return this.value;
    }
    to_text() {
        const suffix = Number.isInteger(this.value) ? ".0" : "";
        return this.value.toString() + suffix;
    }
}
exports.CrochetFloat = CrochetFloat;
class TCrochetFloat extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_2.TCrochetFractional.type;
        this.type_name = "float-64bit";
    }
}
exports.TCrochetFloat = TCrochetFloat;
TCrochetFloat.type = new TCrochetFloat();
//# sourceMappingURL=float.js.map

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetStaticText = exports.TCrochetBaseText = exports.CrochetStaticText = exports.CrochetText = void 0;
const _0_core_1 = __webpack_require__(19);
class CrochetText extends _0_core_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
    }
    get type() {
        return TCrochetBaseText.type;
    }
    equals(other) {
        return other instanceof CrochetText && other.value === this.value;
    }
    to_js() {
        return this.value;
    }
    to_json() {
        return this.value;
    }
    to_text(transparent) {
        if (transparent) {
            return this.value;
        }
        else {
            return `"${this.value.replace(/"/g, '\\"')}"`;
        }
    }
}
exports.CrochetText = CrochetText;
class CrochetStaticText extends CrochetText {
    get type() {
        return TCrochetStaticText.type;
    }
}
exports.CrochetStaticText = CrochetStaticText;
class TCrochetBaseText extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "text";
    }
}
exports.TCrochetBaseText = TCrochetBaseText;
TCrochetBaseText.type = new TCrochetBaseText();
class TCrochetStaticText extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = TCrochetBaseText.type;
        this.type_name = "text";
    }
}
exports.TCrochetStaticText = TCrochetStaticText;
TCrochetStaticText.type = new TCrochetStaticText();
//# sourceMappingURL=text.js.map

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetTuple = exports.TupleSelection = exports.TupleProjection = exports.CrochetTuple = void 0;
const utils_1 = __webpack_require__(23);
const _0_core_1 = __webpack_require__(19);
const boolean_1 = __webpack_require__(20);
class CrochetTuple extends _0_core_1.CrochetValue {
    constructor(values) {
        super();
        this.values = values;
        this._projection = new TupleProjection(this);
        this._selection = new TupleSelection(this);
    }
    get type() {
        return TCrochetTuple.type;
    }
    equals(other) {
        return (other instanceof CrochetTuple &&
            other.values.length === this.values.length &&
            utils_1.every(utils_1.zip(other.values, this.values), ([a, b]) => a.equals(b)));
    }
    as_bool() {
        return this.values.length > 0;
    }
    to_js() {
        return this.values.map((x) => x.to_js());
    }
    to_text() {
        return `[${this.values.map((x) => x.to_text()).join(", ")}]`;
    }
    to_json() {
        return this.values.map((x) => x.to_json());
    }
}
exports.CrochetTuple = CrochetTuple;
class TupleProjection {
    constructor(stream) {
        this.stream = stream;
    }
    project(name, requestee) {
        const result = [];
        for (const value of this.stream.values) {
            result.push(value.projection.project(name, requestee));
        }
        return new CrochetTuple(result);
    }
}
exports.TupleProjection = TupleProjection;
class TupleSelection {
    constructor(stream) {
        this.stream = stream;
    }
    select(selections, requestee) {
        const result = [];
        for (const value of this.stream.values) {
            result.push(value.selection.select(selections, requestee));
        }
        return new CrochetTuple(result);
    }
}
exports.TupleSelection = TupleSelection;
class TCrochetTuple extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "tuple";
    }
    coerce(x) {
        if (x instanceof CrochetTuple) {
            return x;
        }
        else if (x instanceof boolean_1.False) {
            return null;
        }
        else {
            return new CrochetTuple([x]);
        }
    }
}
exports.TCrochetTuple = TCrochetTuple;
TCrochetTuple.type = new TCrochetTuple();
//# sourceMappingURL=tuple.js.map

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetUnknown = exports.CrochetUnknown = void 0;
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
class CrochetUnknown extends _0_core_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        if (value instanceof CrochetUnknown) {
            throw vm_1.die(`double-wrapping an unknown value`);
        }
    }
    get type() {
        return TCrochetUnknown.type;
    }
    equals(other) {
        return other === this;
    }
    to_js() {
        if (this.value instanceof _0_core_1.CrochetValue) {
            return this.value.to_js();
        }
        else {
            return this.value;
        }
    }
    to_text() {
        return `<unknown>`;
    }
    to_debug_text() {
        return `<unknown(${this.value})>`;
    }
}
exports.CrochetUnknown = CrochetUnknown;
class TCrochetUnknown extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "unknown";
    }
    coerce(x) {
        if (x instanceof CrochetUnknown) {
            return x;
        }
        else {
            return new CrochetUnknown(x);
        }
    }
}
exports.TCrochetUnknown = TCrochetUnknown;
TCrochetUnknown.type = new TCrochetUnknown();
//# sourceMappingURL=unknown.js.map

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetRecord = exports.RecordSelection = exports.RecordProjection = exports.CrochetRecord = void 0;
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
class CrochetRecord extends _0_core_1.CrochetValue {
    constructor(values) {
        super();
        this.values = values;
        this._projection = new RecordProjection(this);
        this._selection = new RecordSelection(this);
    }
    get type() {
        return TCrochetRecord.type;
    }
    equals(other) {
        if (!(other instanceof CrochetRecord)) {
            return false;
        }
        const keys = new Set(this.values.keys());
        const other_keys = [...other.values.keys()];
        if (keys.size !== other_keys.length) {
            return false;
        }
        for (const key of other_keys) {
            if (!keys.has(key)) {
                return false;
            }
            if (!this.values.get(key)?.equals(other.values.get(key))) {
                return false;
            }
        }
        return true;
    }
    to_js() {
        const result = new Map();
        for (const [k, v] of this.values) {
            result.set(k, v.to_js());
        }
        return result;
    }
    to_json() {
        const result = Object.create(null);
        for (const [k, v] of this.values) {
            result[k] = v.to_json();
        }
        return result;
    }
    as_bool() {
        return true;
    }
    to_text() {
        if (this.values.size === 0) {
            return "[->]";
        }
        return `[${[...this.values.entries()]
            .map(([k, v]) => `${k} -> ${v.to_text()}`)
            .join(", ")}]`;
    }
    get(key) {
        return this.values.get(key) ?? null;
    }
}
exports.CrochetRecord = CrochetRecord;
class RecordProjection {
    constructor(record) {
        this.record = record;
    }
    project(name, requestee) {
        const value = this.record.get(name);
        if (value == null) {
            throw new vm_1.ErrNoRecordKey(this.record, name);
        }
        return value;
    }
}
exports.RecordProjection = RecordProjection;
class RecordSelection {
    constructor(record) {
        this.record = record;
    }
    select(selection, requestee) {
        const projection = this.record.projection;
        const result = new Map();
        for (const sel of selection) {
            result.set(sel.alias, projection.project(sel.key, requestee));
        }
        return new CrochetRecord(result);
    }
}
exports.RecordSelection = RecordSelection;
class TCrochetRecord extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "record";
    }
}
exports.TCrochetRecord = TCrochetRecord;
TCrochetRecord.type = new TCrochetRecord();
//# sourceMappingURL=record.js.map

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(34), exports);
__exportStar(__webpack_require__(35), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);
__exportStar(__webpack_require__(38), exports);
__exportStar(__webpack_require__(23), exports);
__exportStar(__webpack_require__(39), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(41), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bag = void 0;
class Bag {
    constructor(name) {
        this.name = name;
        this.map = new Map();
    }
    add(name, value) {
        if (this.map.has(name)) {
            throw new Error(`internal: duplicated ${this.name}: ${name}`);
        }
        this.map.set(name, value);
    }
    has_own(name) {
        return this.map.has(name);
    }
    has(name) {
        return this.try_lookup(name) != null;
    }
    try_lookup(name) {
        return this.map.get(name) ?? null;
    }
    lookup(name) {
        const value = this.try_lookup(name);
        if (value != null) {
            return value;
        }
        else {
            throw new Error(`internal: undefined ${this.name}: ${name}`);
        }
    }
}
exports.Bag = Bag;
//# sourceMappingURL=bag.js.map

/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BetterIterable = exports.iter = void 0;
function iter(x) {
    return new BetterIterable(x);
}
exports.iter = iter;
class BetterIterable {
    constructor(values) {
        this.values = values;
    }
    map(f) {
        const values = this.values;
        return new BetterIterable((function* () {
            for (const value of values) {
                yield f(value);
            }
        })());
    }
    flatMap(f) {
        const values = this.values;
        return new BetterIterable((function* () {
            for (const value of values) {
                yield* f(value);
            }
        })());
    }
    zip(gen) {
        const values = this.values;
        return new BetterIterable((function* () {
            for (const value of values) {
                const { value: other } = gen.next(null);
                yield [value, other];
            }
        })());
    }
    every(f) {
        for (const x of this.values) {
            if (!f(x)) {
                return false;
            }
        }
        return true;
    }
    to_array() {
        return [...this.values];
    }
}
exports.BetterIterable = BetterIterable;
//# sourceMappingURL=iterable.js.map

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.coercePrimitiveArray = exports.coerceArray = exports.coercePrimitive = exports.coerce = void 0;
function coerce(ctor, value) {
    if (!(value instanceof ctor)) {
        throw new TypeError(`Expected ${ctor.name}, got ${value}`);
    }
    return value;
}
exports.coerce = coerce;
function coercePrimitive(type, value) {
    if (typeof value !== type) {
        throw new TypeError(`Expected a primitive ${type}, got ${value}`);
    }
    return value;
}
exports.coercePrimitive = coercePrimitive;
function coerceArray(ctor, value) {
    if (!Array.isArray(value)) {
        throw new TypeError(`Expected an array of ${ctor.name}, got ${value}`);
    }
    return value.map(x => coerce(ctor, x));
}
exports.coerceArray = coerceArray;
function coercePrimitiveArray(type, value) {
    if (!Array.isArray(value)) {
        throw new TypeError(`Expected an array of primitive ${type}, got ${value}`);
    }
    return value.map(x => coercePrimitive(type, x));
}
exports.coercePrimitiveArray = coercePrimitiveArray;
//# sourceMappingURL=operators.js.map

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = exports.map_spec = exports.optional = exports.spec = exports.anyOf = exports.equal = exports.array = exports.nothing = exports.boolean = exports.number = exports.bigint_string = exports.bigint = exports.string = exports.lazy = exports.LazySpec = exports.EPath = exports.EAnyOf = exports.ENotEqual = exports.ENoKey = exports.EType = exports.Err = exports.Ok = void 0;
const util_1 = __webpack_require__(24);
class Ok {
    constructor(value) {
        this.value = value;
    }
    chain(f) {
        return f(this.value);
    }
    recover(f) {
        return this;
    }
}
exports.Ok = Ok;
class Err {
    constructor(reason) {
        this.reason = reason;
    }
    chain(f) {
        return this;
    }
    recover(f) {
        return f(this.reason);
    }
}
exports.Err = Err;
function collect(xs) {
    return xs.reduce((rs, x) => {
        return rs.chain((rsV) => {
            return x.chain((xV) => {
                return new Ok([...rsV, xV]);
            });
        });
    }, new Ok([]));
}
class EType {
    constructor(expected) {
        this.expected = expected;
    }
    format() {
        return `a value of type ${this.expected}`;
    }
}
exports.EType = EType;
class ENoKey {
    constructor(key) {
        this.key = key;
    }
    format() {
        return `the key ${JSON.stringify(this.key)} to be present`;
    }
}
exports.ENoKey = ENoKey;
class ENotEqual {
    constructor(expected) {
        this.expected = expected;
    }
    format() {
        return `${util_1.inspect(this.expected)}`;
    }
}
exports.ENotEqual = ENotEqual;
class EAnyOf {
    constructor(errors) {
        this.errors = errors;
    }
    format() {
        return `any of: ${this.errors.map((x) => x.format()).join(", ")}`;
    }
}
exports.EAnyOf = EAnyOf;
class EPath {
    constructor(key, error) {
        this.key = key;
        this.error = error;
    }
    get_path_and_error() {
        const go = (path, err) => {
            if (err instanceof EPath) {
                return go([...path, err.key], err.error);
            }
            else {
                return [path, err];
            }
        };
        return go([], this);
    }
    format() {
        const [path, error] = this.get_path_and_error();
        return `${error.format()} at path ${path.join(".")}`;
    }
}
exports.EPath = EPath;
const failed = new (class Failed {
})();
class LazySpec {
    constructor(thunk) {
        this.thunk = thunk;
    }
}
exports.LazySpec = LazySpec;
function lazy(x) {
    return new LazySpec(x);
}
exports.lazy = lazy;
function toSpec(x) {
    if (x instanceof LazySpec) {
        return toSpec(x.thunk());
    }
    else if (typeof x.spec === "function") {
        return x.spec;
    }
    else {
        return x;
    }
}
function string(x) {
    if (typeof x === "string") {
        return new Ok(x);
    }
    else {
        return new Err(new EType("string"));
    }
}
exports.string = string;
function bigint(x) {
    if (typeof x === "bigint") {
        return new Ok(x);
    }
    else {
        return new Err(new EType("bigint"));
    }
}
exports.bigint = bigint;
function bigint_string(x) {
    return string(x).chain((s) => {
        try {
            return new Ok(BigInt(s));
        }
        catch {
            return new Err(new EType("bigint"));
        }
    });
}
exports.bigint_string = bigint_string;
function number(x) {
    if (typeof x === "number") {
        return new Ok(x);
    }
    else {
        return new Err(new EType("number"));
    }
}
exports.number = number;
function boolean(x) {
    if (typeof x === "boolean") {
        return new Ok(x);
    }
    else {
        return new Err(new EType("boolean"));
    }
}
exports.boolean = boolean;
function nothing(x) {
    if (x == null) {
        return new Ok(null);
    }
    else {
        return new Err(new EType("nothing"));
    }
}
exports.nothing = nothing;
function array(f0) {
    const f = toSpec(f0);
    return (xs) => {
        if (Array.isArray(xs)) {
            return collect(xs.map(f));
        }
        else {
            return new Err(new EType("array"));
        }
    };
}
exports.array = array;
function equal(x) {
    return (value) => {
        if (value === x) {
            return new Ok(value);
        }
        else {
            return new Err(new ENotEqual(x));
        }
    };
}
exports.equal = equal;
function anyOf(fs) {
    return (value) => {
        return fs.map(toSpec).reduce((r, f) => {
            return r.recover((rs) => {
                return f(value).recover((e) => {
                    return new Err(new EAnyOf([...rs.errors, e]));
                });
            });
        }, new Err(new EAnyOf([])));
    };
}
exports.anyOf = anyOf;
function spec(type, parser) {
    return (value) => {
        if (value !== null && typeof value === "object") {
            const entries = collect(Object.entries(type).map(([k, f]) => {
                return toSpec(f)(value[k] ?? failed)
                    .recover((e) => new Err(new EPath(k, e)))
                    .chain((v) => new Ok([k, v]));
            }));
            return entries.chain((xs) => {
                const result = Object.create(null);
                for (const [k, v] of xs) {
                    result[k] = v;
                }
                return new Ok(parser(result));
            });
        }
        else {
            return new Err(new EType("object"));
        }
    };
}
exports.spec = spec;
function optional(spec, default_value) {
    return (value) => {
        if (value === failed) {
            return new Ok(default_value);
        }
        else {
            return toSpec(spec)(value);
        }
    };
}
exports.optional = optional;
function map_spec(spec, f) {
    return (value) => {
        return toSpec(spec)(value).chain((v) => new Ok(f(v)));
    };
}
exports.map_spec = map_spec;
function parse(x, spec) {
    const result = toSpec(spec)(x);
    if (result instanceof Ok) {
        return result.value;
    }
    else {
        throw new Error(`Failed to parse: Expected ${result.reason.format()}`);
    }
}
exports.parse = parse;
//# sourceMappingURL=spec.js.map

/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types.js.map

/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intersect = exports.union = exports.difference = exports.BagMap = void 0;
class Pair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class BagMap {
    constructor() {
        this.pairs = [];
    }
    set(key, value) {
        for (const pair of this.pairs) {
            if (pair.key.equals(key)) {
                pair.value = value;
                return;
            }
        }
        this.pairs.push(new Pair(key, value));
    }
    has(key) {
        for (const pair of this.pairs) {
            if (pair.key.equals(key)) {
                return true;
            }
        }
        return false;
    }
    get(key) {
        for (const pair of this.pairs) {
            if (pair.key.equals(key)) {
                return pair.value;
            }
        }
    }
    *entries() {
        for (const pair of this.pairs) {
            yield [pair.key, pair.value];
        }
    }
}
exports.BagMap = BagMap;
// s1 - s2
function difference(s1, s2) {
    const result = new Set();
    for (const x of s1.values()) {
        if (!s2.has(x)) {
            result.add(x);
        }
    }
    return result;
}
exports.difference = difference;
function union(s1, s2) {
    const result = new Set();
    for (const x of s1.values())
        result.add(x);
    for (const x of s2.values())
        result.add(x);
    return result;
}
exports.union = union;
function intersect(s1, s2) {
    const result = new Set();
    for (const x of s1.values()) {
        if (s2.has(x)) {
            result.add(x);
        }
    }
    return result;
}
exports.intersect = intersect;
//# sourceMappingURL=collections.js.map

/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XorShift = void 0;
const runtime_1 = __webpack_require__(7);
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
        throw runtime_1.die(`internal: weighted choice picked none`);
    }
}
exports.XorShift = XorShift;
XorShift.MIN_INTEGER = 0;
XorShift.MAX_INTEGER = (2 ** 32 - 1) | 0;
function random_int(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
//# sourceMappingURL=xorshift.js.map

/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logger = exports.Logger = void 0;
class Logger {
    constructor() {
        this.verbose = false;
    }
    meta(level) {
        return `[${level}]`;
    }
    info(...xs) {
        console.log(this.meta("info"), ...xs);
    }
    debug(...xs) {
        if (this.verbose) {
            console.debug(this.meta("debug"), ...xs);
        }
    }
    error(...xs) {
        console.error(this.meta("error"), ...xs);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map

/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TCrochetThunk = exports.CrochetThunk = void 0;
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
class CrochetThunk extends _0_core_1.CrochetValue {
    constructor(expr, env) {
        super();
        this.expr = expr;
        this.env = env;
        this.value = null;
    }
    get type() {
        return TCrochetThunk.type;
    }
    *force(state0) {
        if (this.value != null) {
            return this.value;
        }
        else {
            const state = state0.with_env(this.env);
            const value = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
            this.value = value;
            return value;
        }
    }
    equals(other) {
        return other === this;
    }
    to_js() {
        return this;
    }
    to_text() {
        return "<thunk>";
    }
    get is_forced() {
        return this.value != null;
    }
    get forced_value() {
        if (this.value == null) {
            throw new vm_1.ErrArbitrary("unevaluated-thunk", `Trying to get a value from an unevaluated thunk`);
        }
        return this.value;
    }
}
exports.CrochetThunk = CrochetThunk;
class TCrochetThunk extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
        this.type_name = "thunk";
    }
}
exports.TCrochetThunk = TCrochetThunk;
TCrochetThunk.type = new TCrochetThunk();
//# sourceMappingURL=thunk.js.map

/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.baseEnum = exports.TCrochetType = exports.InstanceSelection = exports.InstanceProjection = exports.CrochetInstance = void 0;
const utils_1 = __webpack_require__(33);
const ir_1 = __webpack_require__(8);
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
const record_1 = __webpack_require__(32);
class CrochetInstance extends _0_core_1.CrochetValue {
    constructor(type, id, data) {
        super();
        this.type = type;
        this.id = id;
        this.data = data;
        this._projection = new InstanceProjection(this);
        this._selection = new InstanceSelection(this);
    }
    equals(other) {
        return other === this;
    }
    to_text() {
        return `<${this.type.type_name}>`;
    }
    to_debug_text(transparent) {
        const fields = this.data
            .map((x) => x.to_debug_text(transparent))
            .join(", ");
        return `<${this.type.type_name}(${fields})>`;
    }
    as_record() {
        const data = new Map(utils_1.zip(this.type.fields, this.data));
        return new record_1.CrochetRecord(data);
    }
    get_field(name) {
        const value = this.data[this.type.layout.get(name) ?? -1];
        if (!value) {
            throw vm_1.die(`The field ${name} does not exist in ${_0_core_1.type_name(this.type)}`);
        }
        return value;
    }
}
exports.CrochetInstance = CrochetInstance;
class InstanceProjection {
    constructor(instance) {
        this.instance = instance;
    }
    project(name, requestee_module) {
        if (requestee_module === null ||
            requestee_module.pkg.name !== this.instance.type.module?.pkg.name) {
            throw new vm_1.ErrArbitrary("no-projection-capability", `Cannot directly project ${name} from ${this.instance.type.type_name} outside of its declaring package ${this.instance.type.module?.pkg.name ?? "no package"}`);
        }
        return this.instance.get_field(name);
    }
}
exports.InstanceProjection = InstanceProjection;
class InstanceSelection {
    constructor(instance) {
        this.instance = instance;
    }
    select(selections, requestee_module) {
        if (requestee_module === null ||
            requestee_module.pkg.name !== this.instance.type.module?.pkg.name) {
            throw new vm_1.ErrArbitrary("no-projection-capability", `Cannot directly project ${name} from ${this.instance.type.type_name} outside of its declaring package ${this.instance.type.module?.pkg.name ?? "no package"}`);
        }
        return this.instance
            .as_record()
            .selection.select(selections, requestee_module);
    }
}
exports.InstanceSelection = InstanceSelection;
class TCrochetType extends _0_core_1.CrochetType {
    constructor(module, meta, parent, name, types, fields, layout) {
        super();
        this.module = module;
        this.meta = meta;
        this.parent = parent;
        this.name = name;
        this.types = types;
        this.fields = fields;
        this.layout = layout;
        this.instance_count = 0n;
        this.subtypes = new Set();
        this.instances = new Set();
        this.sealed = false;
    }
    get type_name() {
        return this.name;
    }
    validate(data) {
        if (data.length !== this.types.length) {
            throw vm_1.die(`${this.type_name} expects ${this.types.length} arguments, but got ${data.length}`);
        }
        for (const [v, type] of utils_1.zip(data, this.types)) {
            if (!type.accepts(v)) {
                throw vm_1.die(`Invalid type: expected ${type.type_name}, got ${_0_core_1.type_name(v)}`);
            }
        }
    }
    instantiate(data) {
        if (this.sealed) {
            throw vm_1.die(`attempting to construct a sealed type: ${this.name}`);
        }
        this.validate(data);
        return new CrochetInstance(this, ++this.instance_count, data);
    }
    register_subtype(type) {
        this.subtypes.add(type);
    }
    register_instance(value) {
        if (!this.accepts(value)) {
            throw vm_1.die(`invalid value ${_0_core_1.type_name(value)} for type ${_0_core_1.type_name(this)}`);
        }
        this.instances.add(value);
    }
    get registered_instances() {
        const sub_instances = [...this.subtypes].flatMap((x) => x.registered_instances);
        return [...this.instances, ...sub_instances];
    }
    seal() {
        this.sealed = true;
    }
    get documentation() {
        return this.meta.doc;
    }
}
exports.TCrochetType = TCrochetType;
exports.baseEnum = new TCrochetType(null, ir_1.generated_node, _0_core_1.TCrochetAny.type, "enum", [], [], new Map());
exports.baseEnum.seal();
//# sourceMappingURL=instance.js.map

/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InterpolationDynamic = exports.InterpolationStatic = exports.InteprolationPart = exports.TCrochetInterpolation = exports.CrochetInterpolation = void 0;
const utils_1 = __webpack_require__(33);
const utils_2 = __webpack_require__(23);
const ir_1 = __webpack_require__(8);
const _0_core_1 = __webpack_require__(19);
const text_1 = __webpack_require__(29);
class CrochetInterpolation extends _0_core_1.CrochetValue {
    constructor(parts) {
        super();
        this.parts = parts;
    }
    get type() {
        return TCrochetInterpolation.type;
    }
    equals(other) {
        return (other instanceof CrochetInterpolation &&
            utils_1.iter(this.parts)
                .zip(utils_2.gen(other.parts))
                .every(([x, y]) => x.equals(y)));
    }
    to_text(transparent) {
        const text = this.parts.map((x) => x.to_text(true)).join("");
        if (transparent) {
            return text;
        }
        else {
            return `"${text}"`;
        }
    }
    normalize() {
        const parts = this.parts.map((x) => x.to_simple_part());
        return new ir_1.SimpleInterpolation(parts).optimise().interpolate((x) => x);
    }
}
exports.CrochetInterpolation = CrochetInterpolation;
class TCrochetInterpolation extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = _0_core_1.TCrochetAny.type;
    }
    get type_name() {
        return "interpolation";
    }
    coerce(x) {
        if (x instanceof CrochetInterpolation) {
            return x;
        }
        else if (x instanceof text_1.CrochetText) {
            return new CrochetInterpolation([new InterpolationStatic(x.value)]);
        }
        else {
            return new CrochetInterpolation([new InterpolationDynamic(x)]);
        }
    }
}
exports.TCrochetInterpolation = TCrochetInterpolation;
TCrochetInterpolation.type = new TCrochetInterpolation();
class InteprolationPart {
}
exports.InteprolationPart = InteprolationPart;
class InterpolationStatic extends InteprolationPart {
    constructor(text) {
        super();
        this.text = text;
    }
    equals(other) {
        return other instanceof InterpolationStatic && other.text === this.text;
    }
    to_text() {
        return this.text;
    }
    to_part() {
        return new text_1.CrochetStaticText(this.text);
    }
    to_static() {
        return this.text;
    }
    to_simple_part() {
        return new ir_1.SIPStatic(this.text);
    }
}
exports.InterpolationStatic = InterpolationStatic;
class InterpolationDynamic extends InteprolationPart {
    constructor(value) {
        super();
        this.value = value;
    }
    equals(other) {
        return (other instanceof InterpolationDynamic && other.value.equals(this.value));
    }
    to_text(transparent) {
        return `[${this.value.to_text(transparent)}]`;
    }
    to_part() {
        return this.value;
    }
    to_static() {
        return "_";
    }
    to_simple_part() {
        return new ir_1.SIPDynamic(this.value);
    }
}
exports.InterpolationDynamic = InterpolationDynamic;
//# sourceMappingURL=interpolation.js.map

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetCell = exports.TCrochetCell = void 0;
const _0_core_1 = __webpack_require__(19);
class TCrochetCell extends _0_core_1.CrochetType {
    constructor() {
        super(...arguments);
        this.type_name = "cell";
        this.parent = _0_core_1.TCrochetAny.type;
    }
}
exports.TCrochetCell = TCrochetCell;
TCrochetCell.type = new TCrochetCell();
class CrochetCell extends _0_core_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = TCrochetCell.type;
    }
    deref() {
        return this.value;
    }
    cas(old, value) {
        if (old.equals(this.value)) {
            this.value = value;
            return true;
        }
        else {
            return false;
        }
    }
}
exports.CrochetCell = CrochetCell;
//# sourceMappingURL=cell.js.map

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetProcedure = exports.NativeProcedure = exports.ProcedureBranch = exports.Procedure = exports.Contract = exports.ContractCondition = void 0;
const utils_1 = __webpack_require__(23);
const ir_1 = __webpack_require__(8);
const vm_1 = __webpack_require__(15);
const _0_core_1 = __webpack_require__(19);
class ContractCondition {
    constructor(meta, tag, expr) {
        this.meta = meta;
        this.tag = tag;
        this.expr = expr;
    }
    *is_valid(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
        return value;
    }
    format_error() {
        return `${this.tag}: ${this.meta.source_slice}`;
    }
}
exports.ContractCondition = ContractCondition;
class Contract {
    constructor(pre, post) {
        this.pre = pre;
        this.post = post;
    }
    *check_pre(state, name, params, args) {
        for (const condition of this.pre) {
            const valid = vm_1.cvalue(yield vm_1._push(condition.is_valid(state)));
            if (!valid.as_bool()) {
                throw new vm_1.ErrArbitrary("pre-condition-failed", `Pre-condition violated when calling ${name}\nArguments: (${[
                    ...utils_1.zip(params, args),
                ]
                    .map(([k, x]) => `${k} = ${x.to_debug_text()}`)
                    .join(", ")})\n\n${condition.format_error()}`);
            }
        }
        return _0_core_1.CrochetNothing.instance;
    }
    *check_post(state0, name, params, args, result) {
        const env = state0.env.clone();
        env.define("contract:return", result);
        const state = state0.with_env(env);
        for (const condition of this.post) {
            const valid = vm_1.cvalue(yield vm_1._push(condition.is_valid(state)));
            if (!valid.as_bool()) {
                throw new vm_1.ErrArbitrary("pos-condition-failed", `Post-condition violated from ${name}\nArguments: (${[
                    ...utils_1.zip(params, args),
                ]
                    .map(([k, x]) => `${k} = ${x.to_debug_text()}`)
                    .join(", ")})\nReturn: ${result.to_debug_text()}\n\n${condition.format_error()}`);
            }
        }
        return result;
    }
}
exports.Contract = Contract;
class Procedure {
    constructor(name, arity) {
        this.name = name;
        this.arity = arity;
        this.branches = [];
        this.versions = [];
    }
    select(values) {
        for (const branch of this.branches) {
            if (branch.accepts(values)) {
                return branch;
            }
        }
        return null;
    }
    add(types, procedure) {
        const branch = new ProcedureBranch(types, procedure);
        this.assert_no_duplicates(types, [branch, ...this.branches]);
        this.versions.push(this.branches);
        this.branches.push(branch);
        this.branches.sort((b1, b2) => b1.compare(b2));
    }
    override(types, procedure) {
        const branch = new ProcedureBranch(types, procedure);
        const old = [...this.select_exact(types)];
        if (old.length > 0) {
            console.log(`Overriding ${this.name} (${types
                .map((x) => x.type_name)
                .join(", ")}), from ${old
                .map((x) => x.location_message)
                .join(", ")}, with ${this.name} ${branch.full_repr}`);
            this.versions.push(this.branches);
        }
        this.branches = this.branches.filter((x) => !old.includes(x));
        this.branches.push(branch);
        this.branches.sort((b1, b2) => b1.compare(b2));
    }
    rollback(version = this.versions.length - 1) {
        if (version < 0 || version >= this.versions.length) {
            throw new vm_1.ErrArbitrary("no-procedure-version", `No procedure version ${version} exists for ${this.name}`);
        }
        console.log(`Rolling back procedure ${this.name} to version ${version}`);
        this.branches = this.versions[version];
        this.versions.length = version - 1;
        const branches = this.branches.map((x) => `  - ${x.full_repr}`).join("\n");
        console.log(`${this.name} now has the following branches:\n${branches}`);
    }
    *select_exact(types, branches = this.branches) {
        for (const branch of branches) {
            if (branch.types.every((t, i) => t === types[i])) {
                yield branch;
            }
        }
    }
    *select_subtype(types, branches = this.branches) {
        for (const branch of branches) {
            if (branch.types.every((t, i) => t.is_subtype(types[i]))) {
                yield branch;
            }
        }
    }
    select_matching(type, branches = this.branches) {
        const result = new Array(this.arity);
        for (const branch of branches) {
            for (let i = 0; i < this.arity; ++i) {
                if (!branch.types[i].is_subtype(type)) {
                    continue;
                }
                const old = result[i];
                if (old == null) {
                    result[i] = branch;
                }
                else if (branch.types[i].is_subtype(old.types[i])) {
                    result[i] = branch;
                }
            }
        }
        return [...new Set(result.filter((x) => x != null))];
    }
    assert_no_duplicates(types, branches = this.branches) {
        const dups = [...this.select_exact(types, branches)];
        if (dups.length > 1) {
            const branches = dups.map((x) => `  - ${this.name}${x.simple_repr}, from ${x.location_message}`);
            throw new vm_1.ErrArbitrary("ambiguous-dispatch", `Multiple ${this.name} commands are activated by the same types, making them ambiguous:\n${branches.join("\n")}`);
        }
    }
}
exports.Procedure = Procedure;
class ProcedureBranch {
    constructor(types, procedure) {
        this.types = types;
        this.procedure = procedure;
    }
    compare(branch) {
        for (const [t1, t2] of utils_1.zip(this.types, branch.types)) {
            const d = t1.distance() - t2.distance();
            if (d !== 0) {
                return d;
            }
        }
        return 0;
    }
    accepts(values) {
        return (values.length === this.types.length &&
            utils_1.every(utils_1.zip(this.types, values), ([t, v]) => t.accepts(v)));
    }
    get simple_repr() {
        return `(${this.types.map((x) => x.type_name).join(", ")})`;
    }
    get location_message() {
        return this.procedure.location_message;
    }
    get full_repr() {
        return `${this.simple_repr} from ${this.location_message}`;
    }
}
exports.ProcedureBranch = ProcedureBranch;
class NativeProcedure {
    constructor(meta, env, name, parameter_names, parameters, foreign_name, contract) {
        this.meta = meta;
        this.env = env;
        this.name = name;
        this.parameter_names = parameter_names;
        this.parameters = parameters;
        this.foreign_name = foreign_name;
        this.contract = contract;
    }
    get full_name() {
        return `${this.name} (from ${this.location_message})`;
    }
    get location_message() {
        return `${this.env.module.qualified_name}${this.meta.at_line_suffix}`;
    }
    get documentation() {
        return this.meta.doc || "(no documentation)";
    }
    *invoke(state0, values) {
        state0.world.tracer.procedure_call(state0, this, values);
        const env = this.env.clone_with_receiver(values[0]);
        for (const [k, v] of utils_1.zip(this.parameter_names, values)) {
            env.define(k, v);
        }
        const state = state0.with_env(env);
        const args = [];
        for (const name of this.parameters) {
            args.push(env.lookup(name));
        }
        const procedure = state.world.ffi.methods.lookup(this.foreign_name);
        yield vm_1._push(this.contract.check_pre(state, this.full_name, this.parameter_names, values));
        const result = vm_1.cvalue(yield vm_1._mark(this.full_name, procedure(state, ...args)));
        yield vm_1._push(this.contract.check_post(state, this.full_name, this.parameter_names, values, result));
        state.world.tracer.procedure_return(state, this, result);
        return result;
    }
}
exports.NativeProcedure = NativeProcedure;
class CrochetProcedure {
    constructor(meta, env, world, name, parameters, body, contract) {
        this.meta = meta;
        this.env = env;
        this.world = world;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.contract = contract;
    }
    get full_name() {
        return `${this.name} (from ${this.location_message})`;
    }
    get location_message() {
        return `${this.env.module.qualified_name}${this.meta.at_line_suffix}`;
    }
    get documentation() {
        return this.meta.doc || "(no documentation)";
    }
    *invoke(state0, values) {
        state0.world.tracer.procedure_call(state0, this, values);
        const env = this.env.clone_with_receiver(values[0]);
        for (const [k, v] of utils_1.zip(this.parameters, values)) {
            env.define(k, v);
        }
        const state = state0.with_env(env);
        const block = new ir_1.SBlock(ir_1.generated_node, this.body);
        yield vm_1._push(this.contract.check_pre(state, this.full_name, this.parameters, values));
        const result = vm_1.cvalue(yield vm_1._mark(this.full_name, block.evaluate(state)));
        yield vm_1._push(this.contract.check_post(state, this.full_name, this.parameters, values, result));
        state.world.tracer.procedure_return(state, this, result);
        return result;
    }
}
exports.CrochetProcedure = CrochetProcedure;
//# sourceMappingURL=procedure.js.map

/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ECNot = exports.ECOr = exports.ECAnd = exports.ECInPackage = exports.ECNamed = exports.EntityConstraint = exports.TCInvoke = exports.TraceConstraint = exports.Tracer = exports.TraceRef = void 0;
class TraceRef {
    constructor(name) {
        this.name = name;
    }
}
exports.TraceRef = TraceRef;
class Tracer {
    constructor() {
        this.traces = new Map();
    }
    start_tracing(name, trace) {
        const ref = new TraceRef(name);
        this.traces.set(ref, trace);
        return ref;
    }
    stop_tracing(ref) {
        this.traces.delete(ref);
    }
    clear_traces() {
        this.traces = new Map();
    }
    procedure_call(state, proc, args) {
        for (const [tag, constraint] of this.traces.entries()) {
            constraint.procedure_call(this, tag.name, proc, state, args);
        }
    }
    procedure_return(state, proc, result) {
        for (const [tag, constraint] of this.traces.entries()) {
            constraint.procedure_return(this, tag.name, proc, state, result);
        }
    }
    show(tag, ...args) {
        console.log(`[${tag}]\n`, ...args);
        console.log("---");
    }
}
exports.Tracer = Tracer;
class TraceConstraint {
    procedure_call(tracer, tag, p, state, args) { }
    procedure_return(tracer, tag, p, state, result) { }
}
exports.TraceConstraint = TraceConstraint;
class TCInvoke extends TraceConstraint {
    constructor(entity) {
        super();
        this.entity = entity;
    }
    procedure_call(tracer, tag, p, state, args) {
        if (this.entity.for_procedure(p)) {
            tracer.show(tag, [
                `<invoke> ${p.full_name}\n`,
                `Arguments:\n`,
                args.map((x) => `  - ${x.to_debug_text()}`).join("\n"),
            ].join(""));
        }
    }
    procedure_return(tracer, tag, p, state, result) {
        if (this.entity.for_procedure(p)) {
            tracer.show(tag, [`<return> ${p.full_name}\n`, `Return: ${result.to_debug_text()}`].join(""));
        }
    }
}
exports.TCInvoke = TCInvoke;
class EntityConstraint {
    for_procedure(n) {
        return false;
    }
}
exports.EntityConstraint = EntityConstraint;
class ECNamed extends EntityConstraint {
    constructor(name) {
        super();
        this.name = name;
    }
    for_procedure(p) {
        return p.name === this.name;
    }
}
exports.ECNamed = ECNamed;
class ECInPackage extends EntityConstraint {
    constructor(pkg_name) {
        super();
        this.pkg_name = pkg_name;
    }
    for_procedure(p) {
        return p.env.module.pkg.name === this.pkg_name;
    }
}
exports.ECInPackage = ECInPackage;
class ECAnd extends EntityConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    for_procedure(p) {
        return this.left.for_procedure(p) && this.right.for_procedure(p);
    }
}
exports.ECAnd = ECAnd;
class ECOr extends EntityConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    for_procedure(p) {
        return this.left.for_procedure(p) || this.right.for_procedure(p);
    }
}
exports.ECOr = ECOr;
class ECNot extends EntityConstraint {
    constructor(entity) {
        super();
        this.entity = entity;
    }
    for_procedure(p) {
        return this.entity.for_procedure(p);
    }
}
exports.ECNot = ECNot;
//# sourceMappingURL=trace.js.map

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.State = void 0;
const world_1 = __webpack_require__(49);
class State {
    constructor(random, world, env, database) {
        this.random = random;
        this.world = world;
        this.env = env;
        this.database = database;
    }
    static root(world) {
        return new State(world.global_random, world, new world_1.Environment(null, null, null), world.database);
    }
    with_random(random) {
        return new State(random, this.world, this.env, this.database);
    }
    with_env(env) {
        return new State(this.random, this.world, env, this.database);
    }
    with_new_env() {
        return new State(this.random, this.world, this.env.clone_with_receiver(null), this.database);
    }
    with_database(db) {
        return new State(this.random, this.world, this.env, db);
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map

/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Environment = void 0;
const run_1 = __webpack_require__(51);
class Environment {
    constructor(parent, raw_module, raw_receiver) {
        this.parent = parent;
        this.raw_module = raw_module;
        this.raw_receiver = raw_receiver;
        this.bindings = new Map();
    }
    get receiver() {
        if (this.raw_receiver == null) {
            throw run_1.die(`requesting receiver outside of command`);
        }
        return this.raw_receiver;
    }
    get module() {
        if (this.raw_module == null) {
            throw run_1.die(`requesting module outside of a module`);
        }
        return this.raw_module;
    }
    has(name) {
        return this.bindings.has(name);
    }
    try_lookup(name) {
        const result = this.bindings.get(name);
        if (result != null) {
            return result;
        }
        else if (this.parent != null) {
            return this.parent.try_lookup(name);
        }
        else {
            return null;
        }
    }
    lookup(name) {
        const result = this.try_lookup(name);
        if (result != null) {
            return result;
        }
        else {
            throw run_1.die(`undefined variable ${name}`);
        }
    }
    define(name, value) {
        if (name === "_") {
            return;
        }
        if (this.bindings.has(name)) {
            throw run_1.die(`Duplicate binding ${name}`);
        }
        this.bindings.set(name, value);
    }
    define_all(bindings) {
        for (const [k, v] of bindings.entries()) {
            this.define(k, v);
        }
    }
    lookup_all(names) {
        const result = new Map();
        for (const name of names) {
            const value = this.try_lookup(name);
            if (value != null) {
                result.set(name, value);
            }
        }
        return result;
    }
    extend_with_unification(env) {
        const newEnv = new Environment(this, this.raw_module, this.raw_receiver);
        newEnv.bindings = env.boundValues;
        return newEnv;
    }
    clone() {
        return new Environment(this, this.raw_module, this.raw_receiver);
    }
    clone_with_receiver(receiver) {
        return new Environment(this, this.raw_module, receiver);
    }
    clone_with_module(module) {
        return new Environment(this, module, this.raw_receiver);
    }
}
exports.Environment = Environment;
//# sourceMappingURL=environment.js.map

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.die = exports.avalue = exports.cvalue = exports.run_all_exprs = exports.run_all = exports.StackTrace = exports.StackFrames = exports.Thread = exports.Frame = exports._mark = exports._jump = exports._push_expr = exports._push = exports._await = exports.Await = exports.Mark = exports.Jump = exports.PushExpr = exports.Push = exports.Yield = exports.CrochetError = void 0;
const utils_1 = __webpack_require__(33);
const utils_2 = __webpack_require__(23);
const primitives_1 = __webpack_require__(18);
const errors_1 = __webpack_require__(17);
// Error types
class CrochetError {
    constructor(error, trace) {
        this.error = error;
        this.trace = trace;
    }
    get message() {
        return this.error.format();
    }
    get stack() {
        const message = utils_1.logger.verbose
            ? this.error.format_verbose()
            : this.error.format();
        return `${message}\n\n${this.trace.format()}`;
    }
}
exports.CrochetError = CrochetError;
// Yield types
class Yield {
}
exports.Yield = Yield;
class Push extends Yield {
    constructor(machine) {
        super();
        this.machine = machine;
    }
    evaluate(thread) {
        thread.save_machine();
        thread.machine = this.machine;
        thread.input = null;
    }
}
exports.Push = Push;
class PushExpr extends Yield {
    constructor(expr, state) {
        super();
        this.expr = expr;
        this.state = state;
    }
    evaluate(thread) {
        const machine = this.expr.evaluate(this.state);
        thread.stack.push(new FExpression(this.expr, this.state, thread.machine));
        thread.machine = machine;
        thread.input = null;
    }
}
exports.PushExpr = PushExpr;
class Jump extends Yield {
    constructor(machine) {
        super();
        this.machine = machine;
    }
    evaluate(thread) {
        thread.unwind_to_procedure();
        thread.save_machine();
        thread.machine = this.machine;
        thread.input = null;
    }
}
exports.Jump = Jump;
class Mark extends Yield {
    constructor(name, machine, k) {
        super();
        this.name = name;
        this.machine = machine;
        this.k = k;
    }
    evaluate(thread) {
        thread.stack.push(new FProcedure(this.name, this.k ?? thread.machine));
        thread.machine = this.machine;
        thread.input = null;
    }
}
exports.Mark = Mark;
class Await extends Yield {
    constructor(value) {
        super();
        this.value = value;
    }
    evaluate(thread) {
        return new SRAwait(this.value, thread);
    }
}
exports.Await = Await;
function _await(value) {
    return new Await(value);
}
exports._await = _await;
function _push(machine) {
    return new Push(machine);
}
exports._push = _push;
function _push_expr(expr, state) {
    return new PushExpr(expr, state);
}
exports._push_expr = _push_expr;
function _jump(machine) {
    return new Jump(machine);
}
exports._jump = _jump;
function _mark(name, machine, k = null) {
    return new Mark(name, machine, k);
}
exports._mark = _mark;
// Frame types
class Frame {
}
exports.Frame = Frame;
class FMachine extends Frame {
    constructor(machine) {
        super();
        this.machine = machine;
    }
    evaluate(value, thread) {
        thread.machine = this.machine;
        thread.input = value;
    }
}
class FExpression extends Frame {
    constructor(expr, state, machine) {
        super();
        this.expr = expr;
        this.state = state;
        this.machine = machine;
    }
    get location() {
        return {
            position: this.expr.position,
            filename: this.state.env.module.qualified_name,
        };
    }
    evaluate(value, thread) {
        thread.machine = this.machine;
        thread.input = value;
    }
}
class FProcedure extends Frame {
    constructor(location, k) {
        super();
        this.location = location;
        this.k = k;
    }
    evaluate(value, thread) {
        thread.machine = this.k;
        thread.input = value;
    }
}
class SRAwait {
    constructor(value, thread) {
        this.value = value;
        this.thread = thread;
        this.tag = "await";
    }
}
class SRDone {
    constructor(value) {
        this.value = value;
        this.tag = "done";
    }
}
class Thread {
    constructor(stack, machine, input, current) {
        this.stack = stack;
        this.machine = machine;
        this.input = input;
        this.current = current;
    }
    static for_machine(machine) {
        return new Thread([], machine, null, null);
    }
    static for_expr(expr, state) {
        function* machine() {
            const value = yield _push_expr(expr, state);
            return cvalue(value);
        }
        return Thread.for_machine(machine());
    }
    get stack_frames() {
        return new StackFrames(this.stack);
    }
    save_machine() {
        this.stack.push(new FMachine(this.machine));
    }
    unwind_to_procedure() {
        let frame = null;
        do {
            frame = this.stack.pop() ?? null;
        } while (frame != null && !(frame instanceof FProcedure));
        return frame;
    }
    run() {
        try {
            while (true) {
                const result = this.machine.next(this.input);
                if (result.done) {
                    const newFrame = this.stack.pop();
                    if (newFrame == null) {
                        return new SRDone(result.value);
                    }
                    else {
                        newFrame.evaluate(result.value, this);
                    }
                }
                else {
                    const signal = result.value;
                    const sr = signal.evaluate(this);
                    if (sr != null) {
                        return sr;
                    }
                }
            }
        }
        catch (error) {
            if (error instanceof errors_1.MachineError) {
                const trace = this.stack_frames.stack_trace;
                throw new CrochetError(error, trace);
            }
            else {
                throw error;
            }
        }
    }
    run_sync() {
        const result = this.run();
        switch (result.tag) {
            case "done":
                return result.value;
            case "await":
                throw this.die(`The evaluation did not complete synchronously.`);
            default:
                throw utils_2.unreachable(result, `SyncResult`);
        }
    }
    async run_and_wait() {
        let input = this.input;
        while (true) {
            this.input = input;
            const result = this.run();
            switch (result.tag) {
                case "done": {
                    return result.value;
                }
                case "await": {
                    input = await result.value;
                    continue;
                }
                default:
                    throw utils_2.unreachable(result, `SyncReturn`);
            }
        }
    }
    die(message) {
        const trace = this.stack_frames.stack_trace;
        throw new Error(`${message}\n\n  - ${trace.format()}`);
    }
}
exports.Thread = Thread;
class StackFrames {
    constructor(_frames) {
        this._frames = _frames;
    }
    *frames() {
        for (let i = this._frames.length - 1; i >= 0; --i) {
            yield this._frames[i];
        }
    }
    get current_expression_frame() {
        for (const frame of this.frames()) {
            if (frame instanceof FExpression) {
                return frame;
            }
            else if (frame instanceof FProcedure) {
                return null;
            }
        }
        return null;
    }
    get stack_trace() {
        let fuel = 10;
        const trace = [];
        for (const frame of this.frames()) {
            if (frame instanceof FProcedure) {
                trace.push(frame.location);
                if (--fuel <= 0) {
                    break;
                }
            }
        }
        const current = this.current_expression_frame;
        return new StackTrace(current?.location ?? null, trace);
    }
}
exports.StackFrames = StackFrames;
class StackTrace {
    constructor(location, trace) {
        this.location = location;
        this.trace = trace;
    }
    format_location() {
        if (this.location == null) {
            return [];
        }
        else {
            return [
                `In ${this.location.filename} at ${this.location.position.annotated_source}`,
            ];
        }
    }
    format_trace() {
        if (this.trace.length === 0) {
            return [];
        }
        else {
            return [
                [`Arising from:`, ...this.trace.map((x) => `  - ${x}`)].join("\n"),
            ];
        }
    }
    format() {
        return [...this.format_location(), ...this.format_trace()].join("\n\n");
    }
}
exports.StackTrace = StackTrace;
function* run_all(machines) {
    const result = [];
    for (const machine of machines) {
        const value = yield _push(machine);
        result.push(value);
    }
    return result;
}
exports.run_all = run_all;
function* run_all_exprs(exprs, state) {
    const result = [];
    for (const expr of exprs) {
        const value = yield _push_expr(expr, state);
        result.push(value);
    }
    return result;
}
exports.run_all_exprs = run_all_exprs;
function cvalue(x) {
    if (x instanceof primitives_1.CrochetValue) {
        return x;
    }
    else {
        throw die(`expected a crochet value`);
    }
}
exports.cvalue = cvalue;
function avalue(x) {
    if (Array.isArray(x) && x.every((z) => z instanceof primitives_1.CrochetValue)) {
        return x;
    }
    else {
        throw die(`expected an array of crochet values`);
    }
}
exports.avalue = avalue;
function die(x) {
    throw new errors_1.ErrNativeError(new Error(x));
}
exports.die = die;
//# sourceMappingURL=run.js.map

/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForeignInterface = void 0;
const utils_1 = __webpack_require__(33);
class ForeignInterface {
    constructor() {
        this.methods = new utils_1.Bag("foreign function");
        this.types = new utils_1.Bag("foreign type");
    }
}
exports.ForeignInterface = ForeignInterface;
//# sourceMappingURL=foreign.js.map

/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scene = void 0;
const ir_1 = __webpack_require__(8);
const vm_1 = __webpack_require__(15);
class Scene {
    constructor(meta, name, env, body) {
        this.meta = meta;
        this.name = name;
        this.env = env;
        this.body = body;
    }
    get full_name() {
        return `scene ${this.name} (from ${this.env.module.qualified_name}${this.meta.at_line_suffix})`;
    }
    *evaluate(state) {
        const env = this.env.clone_with_receiver(null);
        const block = new ir_1.SBlock(ir_1.generated_node, this.body);
        const value = vm_1.cvalue(yield vm_1._mark(this.full_name, block.evaluate(state.with_env(env))));
        return value;
    }
}
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map

/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = exports.ProcedureBag = void 0;
const ir_1 = __webpack_require__(8);
const logic_1 = __webpack_require__(12);
const primitives_1 = __webpack_require__(18);
const vm_1 = __webpack_require__(15);
const simulation_1 = __webpack_require__(10);
const foreign_1 = __webpack_require__(52);
const bag_1 = __webpack_require__(34);
const utils_1 = __webpack_require__(33);
class ProcedureBag {
    constructor() {
        this.map = new Map();
    }
    add_foreign(name, types, code, override) {
        const procedure = this.map.get(name) ?? new primitives_1.Procedure(name, types.length);
        if (override) {
            procedure.override(types, code);
        }
        else {
            procedure.add(types, code);
        }
        this.map.set(name, procedure);
    }
    add_crochet(name, types, code, override) {
        const procedure = this.map.get(name) ?? new primitives_1.Procedure(name, types.length);
        if (override) {
            procedure.override(types, code);
        }
        else {
            procedure.add(types, code);
        }
        this.map.set(name, procedure);
    }
    has(name) {
        return this.map.has(name);
    }
    try_lookup(name) {
        return this.map.get(name) ?? null;
    }
    lookup(name) {
        const value = this.map.get(name);
        if (value != null) {
            return value;
        }
        else {
            throw vm_1.die(`undefined procedure: ${name}`);
        }
    }
    *select_matching(type) {
        for (const procedure of this.map.values()) {
            const branches = procedure.select_matching(type);
            if (branches.length !== 0) {
                yield [procedure, branches];
            }
        }
    }
}
exports.ProcedureBag = ProcedureBag;
class World {
    constructor() {
        this.queue = [];
        this.database = new logic_1.Database();
        this.procedures = new ProcedureBag();
        this.types = new bag_1.Bag("type");
        this.globals = new bag_1.Bag("global");
        this.scenes = new bag_1.Bag("scene");
        this.contexts = new simulation_1.ContextBag();
        this.global_context = new simulation_1.ConcreteContext(ir_1.generated_node, "global");
        this.ffi = new foreign_1.ForeignInterface();
        this.global_random = utils_1.XorShift.new_random();
        this.tests = [];
        this.tracer = new vm_1.Tracer();
    }
    schedule(machine) {
        this.queue.push(machine);
    }
    get all_contexts() {
        return [this.global_context, ...this.contexts.concrete_contexts];
    }
    async load_declarations(filename, xs, env, pkg) {
        const module = new vm_1.CrochetModule(this, filename, pkg);
        const context = {
            filename,
            module,
            package: pkg,
        };
        const state = new vm_1.State(this.global_random, this, env.clone_with_module(module), this.database);
        for (const x of xs) {
            await x.apply(context, state);
        }
    }
    async run_init() {
        let current = this.queue.shift();
        while (current != null) {
            await vm_1.Thread.for_machine(current).run_and_wait();
            current = this.queue.shift();
        }
    }
    async run(entry) {
        await this.run_init();
        const state = vm_1.State.root(this);
        const scene = this.scenes.lookup(entry);
        return await vm_1.Thread.for_machine(scene.evaluate(state)).run_and_wait();
    }
    get grouped_tests() {
        const groups = new Map();
        for (const test of this.tests) {
            const key = test.module.pkg.name;
            const module_key = test.module.relative_filename;
            const modules = groups.get(key) ?? new Map();
            const tests = modules.get(module_key) ?? [];
            tests.push(test);
            modules.set(module_key, tests);
            groups.set(key, modules);
        }
        return groups;
    }
}
exports.World = World;
//# sourceMappingURL=world.js.map

/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetTest = void 0;
const vm_1 = __webpack_require__(15);
class CrochetTest {
    constructor(module, title, env, body) {
        this.module = module;
        this.title = title;
        this.env = env;
        this.body = body;
    }
    *evaluate(state0) {
        const env = this.env.clone();
        const state = state0.with_env(env);
        yield vm_1._push(this.body.evaluate(state));
    }
}
exports.CrochetTest = CrochetTest;
//# sourceMappingURL=test.js.map

/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetModule = void 0;
const utils_1 = __webpack_require__(33);
const errors_1 = __webpack_require__(16);
class CrochetModule {
    constructor(world, filename, pkg) {
        this.world = world;
        this.filename = filename;
        this.pkg = pkg;
        this.local_types = new utils_1.Bag("type");
        this.local_values = new utils_1.Bag("local");
        this.open_namespaces = new Set([pkg.name, "crochet.core"]);
    }
    get relative_filename() {
        return this.pkg.relative_filename(this.filename);
    }
    get qualified_name() {
        return `${this.pkg.name}~${this.relative_filename}`;
    }
    namespace_allowed(ns) {
        return this.pkg.dependencies.some((x) => x.name === ns);
    }
    open_namespace(ns) {
        if (!this.namespace_allowed(ns)) {
            throw new errors_1.ErrArbitrary("access-violation", `Module ${this.relative_filename} is not allowed to open namespace ${ns} because it is not declared as a dependency in package ${this.pkg.name}`);
        }
        this.open_namespaces.add(ns);
    }
    namespaced(ns, name) {
        return `${ns}::${name}`;
    }
    try_lookup_type(name) {
        const local = this.local_types.try_lookup(name);
        if (local != null) {
            return local;
        }
        else {
            for (const ns of this.open_namespaces) {
                const type = this.world.types.try_lookup(this.namespaced(ns, name));
                if (type != null) {
                    return type;
                }
            }
            return null;
        }
    }
    lookup_type(name) {
        const type = this.try_lookup_type(name);
        if (type == null) {
            const opened = [...this.open_namespaces].join(", ");
            throw new errors_1.ErrArbitrary("undefined-type", `No type ${name} is accessible from module ${this.relative_filename} in package ${this.pkg.name}.\nOpened packages: ${opened}`);
        }
        else {
            return type;
        }
    }
    add_type(name, type, local) {
        if (local) {
            utils_1.logger.debug(`Adding local type ${name} in module ${this.qualified_name}`);
            this.local_types.add(name, type);
        }
        else {
            const ns_name = this.namespaced(this.pkg.name, name);
            utils_1.logger.debug(`Adding namespaced type ${ns_name} from module ${this.qualified_name}`);
            this.world.types.add(ns_name, type);
        }
    }
    try_lookup_value(name) {
        const local = this.local_values.try_lookup(name);
        if (local != null) {
            return local;
        }
        else {
            for (const ns of this.open_namespaces) {
                const type = this.world.globals.try_lookup(this.namespaced(ns, name));
                if (type != null) {
                    return type;
                }
            }
            return null;
        }
    }
    lookup_value(name) {
        const value = this.try_lookup_value(name);
        if (value == null) {
            const opened = [...this.open_namespaces].join(", ");
            throw new errors_1.ErrArbitrary("undefined-global", `No definition ${name} is accessible from module ${this.relative_filename} in package ${this.pkg.name}.\nOpened packages: ${opened}`);
        }
        else {
            return value;
        }
    }
    add_value(name, value, local) {
        if (local) {
            utils_1.logger.debug(`Adding local value ${name} in module ${this.qualified_name}`);
            this.local_values.add(name, value);
        }
        else {
            const ns_name = this.namespaced(this.pkg.name, name);
            utils_1.logger.debug(`Adding namespaced value ${ns_name} from module ${this.qualified_name}`);
            this.world.globals.add(ns_name, value);
        }
    }
    add_test(test) {
        this.world.tests.push(test);
    }
}
exports.CrochetModule = CrochetModule;
//# sourceMappingURL=module.js.map

/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PredicateClause = exports.PredicateProcedure = exports.FunctionRelation = exports.ConcreteRelation = exports.MappedRelation = exports.SamplingType = exports.SamplingRelation = exports.SamplingPool = exports.SamplePredicate = exports.TypePredicate = exports.LetPredicate = exports.AlwaysPredicate = exports.NotPredicate = exports.HasRelation = exports.OrPredicate = exports.AndPredicate = exports.ConstrainedPredicate = exports.Predicate = void 0;
const utils_1 = __webpack_require__(23);
const ir_1 = __webpack_require__(8);
const primitives_1 = __webpack_require__(18);
const vm_1 = __webpack_require__(15);
class Predicate {
}
exports.Predicate = Predicate;
class ConstrainedPredicate extends Predicate {
    constructor(predicate, constraint) {
        super();
        this.predicate = predicate;
        this.constraint = constraint;
    }
    search(state, env) {
        return this.predicate.search(state, env).filter((env) => {
            const evalEnv = state.env.extend_with_unification(env);
            const evalState = state.with_env(evalEnv);
            const value = vm_1.cvalue(vm_1.Thread.for_expr(this.constraint, evalState).run_sync());
            return value.as_bool();
        });
    }
}
exports.ConstrainedPredicate = ConstrainedPredicate;
class AndPredicate extends Predicate {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    search(state, env) {
        return this.left
            .search(state, env)
            .flatMap((env) => this.right.search(state, env));
    }
}
exports.AndPredicate = AndPredicate;
class OrPredicate extends Predicate {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    search(state, env) {
        const lresult = this.left.search(state, env);
        if (lresult.length !== 0) {
            return lresult;
        }
        else {
            return this.right.search(state, env);
        }
    }
}
exports.OrPredicate = OrPredicate;
class HasRelation extends Predicate {
    constructor(name, patterns) {
        super();
        this.name = name;
        this.patterns = patterns;
    }
    search(state, env) {
        const relation = state.database.lookup(this.name);
        return relation.search(state, env, this.patterns);
    }
}
exports.HasRelation = HasRelation;
class NotPredicate extends Predicate {
    constructor(predicate) {
        super();
        this.predicate = predicate;
    }
    search(state, env) {
        const result = this.predicate.search(state, env);
        if (result.length === 0) {
            return [env];
        }
        else {
            return [];
        }
    }
}
exports.NotPredicate = NotPredicate;
class AlwaysPredicate extends Predicate {
    search(state, env) {
        return [env];
    }
}
exports.AlwaysPredicate = AlwaysPredicate;
class LetPredicate extends Predicate {
    constructor(name, expr) {
        super();
        this.name = name;
        this.expr = expr;
    }
    search(state, env) {
        const evalEnv = state.env.extend_with_unification(env);
        const evalState = state.with_env(evalEnv);
        const value = vm_1.cvalue(vm_1.Thread.for_expr(this.expr, evalState).run_sync());
        const newEnv = env.clone();
        newEnv.bind(this.name, value);
        return [newEnv];
    }
}
exports.LetPredicate = LetPredicate;
class TypePredicate extends Predicate {
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    search(state, env) {
        const type = utils_1.cast(this.type.realise(state), primitives_1.TCrochetType);
        return type.registered_instances.map((v) => {
            const newEnv = env.clone();
            newEnv.bind(this.name, v);
            return newEnv;
        });
    }
}
exports.TypePredicate = TypePredicate;
class SamplePredicate extends Predicate {
    constructor(size, pool) {
        super();
        this.size = size;
        this.pool = pool;
    }
    search(state, env) {
        return this.pool.sample(this.size, state, env);
    }
}
exports.SamplePredicate = SamplePredicate;
class SamplingPool {
}
exports.SamplingPool = SamplingPool;
class SamplingRelation extends SamplingPool {
    constructor(name, patterns) {
        super();
        this.name = name;
        this.patterns = patterns;
    }
    sample(size, state, env) {
        const relation = state.database.lookup(this.name);
        return relation.sample(size, state, env, this.patterns);
    }
}
exports.SamplingRelation = SamplingRelation;
class SamplingType extends SamplingPool {
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    sample(size, state, env) {
        const type = utils_1.cast(this.type.realise(state), primitives_1.TCrochetType);
        const instances = type.registered_instances;
        const sampled = state.random.random_choice_many(size, instances);
        return sampled.map((s) => {
            const newEnv = env.clone();
            newEnv.bind(this.name, s);
            return newEnv;
        });
    }
}
exports.SamplingType = SamplingType;
class MappedRelation {
    sample(size, state, env, patterns) {
        return state.random.random_choice_many(size, this.search(state, env, patterns));
    }
}
exports.MappedRelation = MappedRelation;
class ConcreteRelation extends MappedRelation {
    constructor(meta, name, tree) {
        super();
        this.meta = meta;
        this.name = name;
        this.tree = tree;
    }
    search(state, env, patterns) {
        return this.tree.search(state, env, patterns);
    }
    sample(size, state, env, patterns) {
        return this.tree.sample(size, state, env, patterns);
    }
}
exports.ConcreteRelation = ConcreteRelation;
class FunctionRelation extends MappedRelation {
    constructor(name, code) {
        super();
        this.name = name;
        this.code = code;
    }
    search(state, env, patterns) {
        return this.code(state, env, patterns);
    }
}
exports.FunctionRelation = FunctionRelation;
class PredicateProcedure extends MappedRelation {
    constructor(name, parameters, clauses) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.clauses = clauses;
        this.metadata = ir_1.generated_node;
    }
    set_metadata(metadata) {
        this.metadata = metadata;
    }
    search(state, env, patterns) {
        const bindings = [...utils_1.zip(this.parameters, patterns)];
        for (const clause of this.clauses) {
            const result = clause.evaluate(state, env, bindings);
            if (result.length !== 0) {
                return result;
            }
        }
        return [];
    }
}
exports.PredicateProcedure = PredicateProcedure;
class PredicateClause {
    constructor(predicate, effect) {
        this.predicate = predicate;
        this.effect = effect;
    }
    evaluate(state, env, bindings) {
        return this.predicate.search(state, env).flatMap((env0) => {
            const env1 = join(state, env0, env, bindings);
            if (env1 == null) {
                return [];
            }
            else {
                const env2 = this.effect.evaluate(env1);
                if (env2 == null) {
                    return [];
                }
                else {
                    return [env2];
                }
            }
        });
    }
}
exports.PredicateClause = PredicateClause;
function join(state, env0, resultEnv, bindings) {
    let env = resultEnv;
    for (const [key, pattern] of bindings) {
        const value = env0.try_lookup(key);
        if (value == null) {
            return null;
        }
        const newEnv = pattern.unify(state, env, value);
        if (newEnv == null) {
            return null;
        }
        else {
            env = newEnv;
        }
    }
    return env;
}
//# sourceMappingURL=predicate.js.map

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WildcardPattern = exports.VariablePattern = exports.SelfPattern = exports.GlobalPattern = exports.ValuePattern = exports.TypePattern = exports.Pattern = exports.UnificationEnvironment = void 0;
const vm_1 = __webpack_require__(15);
class UnificationEnvironment {
    constructor() {
        this.bindings = new Map();
    }
    get boundValues() {
        return this.bindings;
    }
    try_lookup(name) {
        return this.bindings.get(name);
    }
    lookup(name) {
        const result = this.try_lookup(name);
        if (result == null) {
            throw vm_1.die(`undefined logical variable ${name}`);
        }
        return result;
    }
    bind(name, value) {
        this.bindings.set(name, value);
    }
    clone() {
        return UnificationEnvironment.from(this.bindings);
    }
    static from(map) {
        const result = UnificationEnvironment.empty();
        for (const [k, v] of map.entries()) {
            result.bindings.set(k, v);
        }
        return result;
    }
    static empty() {
        return new UnificationEnvironment();
    }
}
exports.UnificationEnvironment = UnificationEnvironment;
class Pattern {
    aunify(state, env, value) {
        const result = this.unify(state, env, value);
        if (result == null) {
            return [];
        }
        else {
            return [result];
        }
    }
    get variables() {
        return [];
    }
}
exports.Pattern = Pattern;
class TypePattern extends Pattern {
    constructor(pattern, type) {
        super();
        this.pattern = pattern;
        this.type = type;
    }
    unify(state, env, value) {
        const type = this.type.realise(state);
        if (type.accepts(value)) {
            return this.pattern.unify(state, env, value);
        }
        else {
            return null;
        }
    }
}
exports.TypePattern = TypePattern;
class ValuePattern extends Pattern {
    constructor(value) {
        super();
        this.value = value;
    }
    unify(state, env, value) {
        if (value.equals(this.value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.ValuePattern = ValuePattern;
class GlobalPattern extends Pattern {
    constructor(name) {
        super();
        this.name = name;
    }
    unify(state, env, other) {
        const value = state.env.module.lookup_value(this.name);
        if (other.equals(value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.GlobalPattern = GlobalPattern;
class SelfPattern extends Pattern {
    unify(state, env, other) {
        const value = state.env.receiver;
        if (other.equals(value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.SelfPattern = SelfPattern;
class VariablePattern extends Pattern {
    constructor(name) {
        super();
        this.name = name;
    }
    unify(state, env, value) {
        const local_bound = env.try_lookup(this.name);
        const bound = local_bound ?? state.env.try_lookup(this.name);
        if (bound == null) {
            const newEnv = env.clone();
            newEnv.bind(this.name, value);
            return newEnv;
        }
        else if (value.equals(bound)) {
            if (local_bound == null) {
                const newEnv = env.clone();
                newEnv.bind(this.name, value);
                return newEnv;
            }
            else {
                return env;
            }
        }
        else {
            return null;
        }
    }
    get variables() {
        return [this.name];
    }
}
exports.VariablePattern = VariablePattern;
class WildcardPattern extends Pattern {
    unify(state, env, _value) {
        return env;
    }
}
exports.WildcardPattern = WildcardPattern;
//# sourceMappingURL=unification.js.map

/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndNode = exports.ManyNode = exports.OneNode = exports.Tree = exports.TTEnd = exports.TTMany = exports.TTOne = exports.TreeType = void 0;
const vm_1 = __webpack_require__(15);
class Pair {
    constructor(value, tree) {
        this.value = value;
        this.tree = tree;
    }
}
class TreeType {
}
exports.TreeType = TreeType;
class TTOne extends TreeType {
    constructor(next) {
        super();
        this.next = next;
    }
    realise() {
        return new OneNode(this.next);
    }
}
exports.TTOne = TTOne;
class TTMany extends TreeType {
    constructor(next) {
        super();
        this.next = next;
    }
    realise() {
        return new ManyNode(this.next);
    }
}
exports.TTMany = TTMany;
class TTEnd extends TreeType {
    realise() {
        return new EndNode();
    }
}
exports.TTEnd = TTEnd;
class Tree {
}
exports.Tree = Tree;
class OneNode extends Tree {
    constructor(subtype) {
        super();
        this.subtype = subtype;
        this.value = null;
    }
    get type() {
        return new TTOne(this.subtype);
    }
    insert(values) {
        const [head, ...tail] = values;
        if (this.value == null || !this.value.value.equals(head)) {
            this.value = new Pair(head, this.subtype.realise());
            this.value.tree.insert(tail);
        }
        else {
            this.value.tree.insert(tail);
        }
    }
    remove(values) {
        const [head, ...tail] = values;
        if (this.value == null) {
            return null;
        }
        if (head.equals(this.value.value)) {
            this.value = null;
            return null;
        }
        else {
            const result = this.value.tree.remove(tail);
            if (result == null) {
                this.value = null;
                return null;
            }
            else {
                this.value.tree = result;
                return this;
            }
        }
    }
    search(state, env, patterns) {
        if (this.value == null) {
            return [];
        }
        const [head, ...tail] = patterns;
        const newEnv = head.unify(state, env, this.value.value);
        if (newEnv == null) {
            return [];
        }
        else {
            return this.value.tree.search(state, newEnv, tail);
        }
    }
    sample(size, state, env, patterns) {
        if (this.value == null) {
            return [];
        }
        const [head, ...tail] = patterns;
        const newEnv = head.unify(state, env, this.value.value);
        if (newEnv == null) {
            return [];
        }
        else {
            return this.value.tree.sample(size, state, newEnv, tail);
        }
    }
}
exports.OneNode = OneNode;
class ManyNode extends Tree {
    constructor(subtype) {
        super();
        this.subtype = subtype;
        this.pairs = [];
    }
    get type() {
        return new TTMany(this.subtype);
    }
    insert(values) {
        const [head, ...tail] = values;
        for (const pair of this.pairs) {
            if (pair.value.equals(head)) {
                pair.tree.insert(tail);
                return;
            }
        }
        const subtree = this.subtype.realise();
        this.pairs.push(new Pair(head, subtree));
        subtree.insert(tail);
    }
    remove(values) {
        const [head, ...tail] = values;
        this.pairs = this.pairs.flatMap((pair) => {
            if (pair.value.equals(head)) {
                const result = pair.tree.remove(tail);
                if (result == null) {
                    return [];
                }
                else {
                    return [new Pair(pair.value, result)];
                }
            }
            else {
                return [pair];
            }
        });
        if (this.pairs.length === 0) {
            return null;
        }
        else {
            return this;
        }
    }
    search(state, env, patterns) {
        const [head, ...tail] = patterns;
        return this.pairs.flatMap((pair) => {
            const newEnv = head.unify(state, env, pair.value);
            if (newEnv == null) {
                return [];
            }
            else {
                return pair.tree.search(state, newEnv, tail);
            }
        });
    }
    sample(size, state, env, patterns) {
        const [head, ...tail] = patterns;
        const result = [];
        const envs = this.pairs.flatMap((pair) => {
            const newEnv = head.unify(state, env, pair.value);
            if (newEnv == null) {
                return [];
            }
            else {
                return [{ env: newEnv, tree: pair.tree }];
            }
        });
        while (result.length < size) {
            const choice = state.random.random_choice_mut(envs);
            if (choice == null) {
                return result;
            }
            else {
                const envs = choice.tree.sample(size, state, choice.env, tail);
                result.push.apply(result, envs);
            }
        }
        return result;
    }
}
exports.ManyNode = ManyNode;
class EndNode extends Tree {
    get type() {
        return new TTEnd();
    }
    insert(values) {
        if (values.length !== 0) {
            throw vm_1.die(`non-empty insertion on end node`);
        }
    }
    remove(values) {
        if (values.length !== 0) {
            throw vm_1.die(`non-empty deletion on end node`);
        }
        else {
            return null;
        }
    }
    search(state, env, patterns) {
        if (patterns.length !== 0) {
            throw vm_1.die(`non-empty search on end node`);
        }
        return [env];
    }
    sample(size, state, env, patterns) {
        if (patterns.length !== 0) {
            throw vm_1.die(`non-empty search on end node`);
        }
        return [env];
    }
}
exports.EndNode = EndNode;
//# sourceMappingURL=tree.js.map

/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseLayer = exports.FunctionLayer = void 0;
const bag_1 = __webpack_require__(34);
const vm_1 = __webpack_require__(15);
const predicate_1 = __webpack_require__(57);
class FunctionLayer extends bag_1.Bag {
    constructor(parent) {
        super("function");
        this.parent = parent;
    }
    try_lookup(name) {
        const value = super.try_lookup(name);
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
exports.FunctionLayer = FunctionLayer;
class DatabaseLayer {
    constructor(parent, functions) {
        this.parent = parent;
        this.functions = functions;
    }
    add(name, relation) {
        this.parent.add(name, relation);
    }
    update(name, relation) {
        this.parent.update(name, relation);
    }
    try_lookup(name) {
        const fun = this.functions.try_lookup(name);
        if (fun != null) {
            return new predicate_1.FunctionRelation(name, fun);
        }
        else {
            return this.parent.try_lookup(name);
        }
    }
    lookup(name) {
        const relation = this.try_lookup(name);
        if (relation == null) {
            throw vm_1.die(`undefined relation or function: ${name}`);
        }
        return relation;
    }
    search(state, predicate, initial_environment) {
        return predicate.search(state.with_database(this), initial_environment);
    }
}
exports.DatabaseLayer = DatabaseLayer;
//# sourceMappingURL=layer.js.map

/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomGoal = exports.TotalQuiescence = exports.EventQuiescence = exports.ActionQuiescence = void 0;
const logic_1 = __webpack_require__(12);
class ActionQuiescence {
    constructor() {
        this._reached = true;
    }
    reached(round_ended) {
        return round_ended && this._reached;
    }
    reset() {
        this._reached = true;
    }
    tick(actor, state, context) {
        if (context.available_actions(actor, state).length !== 0) {
            this._reached = false;
        }
    }
}
exports.ActionQuiescence = ActionQuiescence;
class EventQuiescence {
    constructor() {
        this._reached = true;
    }
    reached(round_ended) {
        return round_ended && this._reached;
    }
    reset() {
        this._reached = true;
    }
    tick(actor, state, context) {
        if (context.available_events(state).length !== 0) {
            this._reached = false;
        }
    }
}
exports.EventQuiescence = EventQuiescence;
class TotalQuiescence {
    constructor() {
        this.event_goal = new EventQuiescence();
        this.action_goal = new ActionQuiescence();
    }
    reached(round_ended) {
        return (this.event_goal.reached(round_ended) &&
            this.action_goal.reached(round_ended));
    }
    reset() {
        this.event_goal.reset();
        this.action_goal.reset();
    }
    tick(actor, state, context) {
        this.action_goal.tick(actor, state, context);
        this.event_goal.tick(actor, state, context);
    }
}
exports.TotalQuiescence = TotalQuiescence;
class CustomGoal {
    constructor(predicate) {
        this.predicate = predicate;
        this._reached = false;
    }
    reached(round_ended) {
        return this._reached;
    }
    reset() {
        this._reached = false;
    }
    tick(actor, state, context) {
        const env = logic_1.UnificationEnvironment.empty();
        const results = state.database.search(state, this.predicate, env);
        if (results.length !== 0) {
            this._reached = true;
        }
    }
}
exports.CustomGoal = CustomGoal;
//# sourceMappingURL=goal.js.map

/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Simulation = exports.Signal = void 0;
const ir_1 = __webpack_require__(8);
const utils_1 = __webpack_require__(23);
const vm_1 = __webpack_require__(15);
const primitives_1 = __webpack_require__(18);
const layer_1 = __webpack_require__(60);
const action_choice_1 = __webpack_require__(63);
const utils_2 = __webpack_require__(33);
class Signal {
    constructor(name, parameters, body) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }
    get full_name() {
        return `signal ${this.name}`;
    }
    *evaluate(state, args) {
        const env = state.env.clone();
        if (this.parameters.length !== args.length) {
            throw vm_1.die(`Invalid arity in signal ${this.name}`);
        }
        for (const [key, value] of utils_1.zip(this.parameters, args)) {
            env.define(key, value);
        }
        const block = new ir_1.SBlock(ir_1.generated_node, this.body);
        const new_state = state.with_env(env);
        const result = vm_1.cvalue(yield vm_1._mark(this.full_name, block.evaluate(new_state)));
        return result;
    }
}
exports.Signal = Signal;
class Simulation {
    constructor(env, actors, context, goal, signals) {
        this.env = env;
        this.actors = actors;
        this.context = context;
        this.goal = goal;
        this.signals = signals;
        this.turn = null;
        this.acted = new Set();
        this.active = false;
        this.rounds = 0n;
    }
    *run(state0) {
        this.active = true;
        this.rounds = 0n;
        const layered_db = new layer_1.DatabaseLayer(state0.database, this.layer);
        const state = state0.with_database(layered_db);
        while (this.active) {
            const acted = (yield vm_1._push(this.simulate_round(state)));
            if (acted === 0) {
                break;
            }
            this.rounds += 1n;
        }
        return primitives_1.CrochetNothing.instance;
    }
    *simulate_round(state) {
        let actions_fired = 0;
        this.acted = new Set();
        this.goal.reset();
        const actor0 = yield vm_1._push(this.next_actor(state));
        this.turn = utils_1.maybe_cast(actor0, primitives_1.CrochetValue);
        while (this.turn != null) {
            utils_2.logger.debug("New turn", this.turn.to_text());
            const action0 = vm_1.cvalue(yield vm_1._push(this.pick_action(state, this.turn)));
            const action = utils_1.maybe_cast(action0, action_choice_1.ActionChoice);
            if (action != null) {
                actions_fired += 1;
                utils_2.logger.debug("Chosen action", action.title.to_text());
                action.action.fire(this.turn);
                yield vm_1._mark(action.full_name, action.machine);
                for (const reaction of this.context.available_events(state)) {
                    yield reaction;
                }
            }
            this.acted.add(this.turn);
            this.goal.tick(this.turn, state, this.context);
            this.turn = utils_1.maybe_cast(yield vm_1._push(this.next_actor(state)), primitives_1.CrochetValue);
            if (this.goal.reached(this.turn == null)) {
                this.active = false;
                return;
            }
        }
        return actions_fired;
    }
    *next_actor(state) {
        const remaining = this.actors.filter((x) => !this.acted.has(x));
        return remaining[0] ?? null;
    }
    *pick_action(state, actor) {
        const actions = this.context
            .available_actions(actor, state)
            .map((x) => new action_choice_1.ActionChoice(x.title, x.score, x.tags, x.action, x.machine));
        const selected = vm_1.cvalue(yield vm_1._push(this.trigger_signal(state, "pick-action:for:", [new primitives_1.CrochetTuple(actions), actor], function* (_state, _actions, _for) {
            const scores = vm_1.avalue(yield vm_1._push(vm_1.run_all(actions.map((x) => x.score.force(state))))).map((x) => primitives_1.number_to_float(x));
            const scored_actions = [...utils_1.zip(scores, actions)];
            return (state.random.random_weighted_choice(scored_actions) ??
                primitives_1.CrochetNothing.instance);
        })));
        return selected;
    }
    *trigger_signal(state, name, args, default_handler) {
        const signal = this.signals.try_lookup(name);
        if (signal != null) {
            const result = vm_1.cvalue(yield vm_1._push(signal.evaluate(state.with_env(this.env), args)));
            return result;
        }
        else {
            const result = vm_1.cvalue(yield vm_1._push(default_handler(state, ...args)));
            return result;
        }
    }
    get layer() {
        const layer = new layer_1.FunctionLayer(null);
        layer.add("_ simulate-turn", (state, env, [pattern]) => unify(pattern, this.turn ?? primitives_1.CrochetNothing.instance, state, env));
        layer.add("_ simulate-actor", (state, env, [pattern]) => this.actors.flatMap((x) => unify(pattern, x, state, env)));
        layer.add("_ simulate-acted", (state, env, [pattern]) => [...this.acted].flatMap((x) => unify(pattern, x, state, env)));
        layer.add("_ simulate-rounds-elapsed", (state, env, [pattern]) => unify(pattern, new primitives_1.CrochetInteger(this.rounds), state, env));
        return layer;
    }
}
exports.Simulation = Simulation;
function unify(pattern, value, state, env) {
    const result = pattern.unify(state, env, value);
    if (result == null) {
        return [];
    }
    else {
        return [result];
    }
}
//# sourceMappingURL=simulate.js.map

/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TActionChoice = exports.ActionChoice = void 0;
const primitives_1 = __webpack_require__(18);
class ActionChoice extends primitives_1.CrochetValue {
    constructor(title, score, tags, action, machine) {
        super();
        this.title = title;
        this.score = score;
        this.tags = tags;
        this.action = action;
        this.machine = machine;
        this._projection = this.as_record().projection;
        this._selection = this.as_record().selection;
    }
    get type() {
        return TActionChoice.type;
    }
    get full_name() {
        return `action ${this.title.to_text()} (from ${this.action.env.module.qualified_name}${this.action.meta.at_line_suffix})`;
    }
    as_record() {
        return new primitives_1.CrochetRecord(new Map([
            ["Title", this.title],
            ["Score", this.score],
            ["Tags", new primitives_1.CrochetTuple(this.tags)],
            ["Action", new primitives_1.CrochetUnknown(this.action)],
        ]));
    }
}
exports.ActionChoice = ActionChoice;
class TActionChoice extends primitives_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = primitives_1.TCrochetAny.type;
        this.type_name = "action-choice";
    }
}
exports.TActionChoice = TActionChoice;
TActionChoice.type = new TActionChoice();
//# sourceMappingURL=action-choice.js.map

/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SAssert = exports.SRegister = exports.SSimulate = exports.SCNamed = exports.SCAny = exports.SimulateContext = exports.SCall = exports.SGoto = exports.SBlock = exports.SLet = exports.SExpression = exports.SForget = exports.SFact = exports.Statement = void 0;
const bag_1 = __webpack_require__(34);
const utils_1 = __webpack_require__(23);
const logic_1 = __webpack_require__(12);
const primitives_1 = __webpack_require__(18);
const vm_1 = __webpack_require__(15);
const simulation_1 = __webpack_require__(10);
const expression_1 = __webpack_require__(65);
const meta_1 = __webpack_require__(66);
class Statement {
}
exports.Statement = Statement;
class SFact extends Statement {
    constructor(position, name, exprs) {
        super();
        this.position = position;
        this.name = name;
        this.exprs = exprs;
    }
    *evaluate(state) {
        const relation = utils_1.cast(state.world.database.lookup(this.name), logic_1.ConcreteRelation);
        const values = vm_1.avalue(yield vm_1._push(vm_1.run_all_exprs(this.exprs, state)));
        relation.tree.insert(values);
        return primitives_1.CrochetNothing.instance;
    }
}
exports.SFact = SFact;
class SForget extends Statement {
    constructor(position, name, exprs) {
        super();
        this.position = position;
        this.name = name;
        this.exprs = exprs;
    }
    *evaluate(state) {
        const relation = utils_1.cast(state.world.database.lookup(this.name), logic_1.ConcreteRelation);
        const values = vm_1.avalue(yield vm_1._push(vm_1.run_all_exprs(this.exprs, state)));
        relation.tree.remove(values);
        return primitives_1.CrochetNothing.instance;
    }
}
exports.SForget = SForget;
class SExpression extends Statement {
    constructor(position, expr) {
        super();
        this.position = position;
        this.expr = expr;
    }
    *evaluate(state) {
        const result = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
        return result;
    }
}
exports.SExpression = SExpression;
class SLet extends Statement {
    constructor(position, name, expr) {
        super();
        this.position = position;
        this.name = name;
        this.expr = expr;
    }
    *evaluate(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
        if (state.env.has(this.name)) {
            throw new vm_1.ErrVariableAlreadyBound(this.name);
        }
        state.env.define(this.name, value);
        return value;
    }
}
exports.SLet = SLet;
class SBlock extends Statement {
    constructor(position, statements) {
        super();
        this.position = position;
        this.statements = statements;
    }
    *evaluate(state) {
        let result = primitives_1.CrochetNothing.instance;
        for (const stmt of this.statements) {
            result = vm_1.cvalue(yield vm_1._push_expr(stmt, state));
        }
        return result;
    }
}
exports.SBlock = SBlock;
class SGoto extends Statement {
    constructor(position, name) {
        super();
        this.position = position;
        this.name = name;
    }
    *evaluate(state) {
        const scene = state.world.scenes.lookup(this.name);
        const machine = scene.evaluate(state);
        return yield vm_1._jump(machine);
    }
}
exports.SGoto = SGoto;
class SCall extends Statement {
    constructor(position, name) {
        super();
        this.position = position;
        this.name = name;
    }
    *evaluate(state) {
        const scene = state.world.scenes.lookup(this.name);
        const machine = scene.evaluate(state);
        return yield vm_1._push(machine);
    }
}
exports.SCall = SCall;
class SimulateContext {
}
exports.SimulateContext = SimulateContext;
class SCAny extends SimulateContext {
    realise(state) {
        return simulation_1.AnyContext.instance;
    }
}
exports.SCAny = SCAny;
class SCNamed extends SimulateContext {
    constructor(name) {
        super();
        this.name = name;
    }
    realise(state) {
        return state.world.contexts.lookup(this.name);
    }
}
exports.SCNamed = SCNamed;
class SSimulate extends Statement {
    constructor(position, context, actors, goal, signals) {
        super();
        this.position = position;
        this.context = context;
        this.actors = actors;
        this.goal = goal;
        this.signals = signals;
    }
    *evaluate(state) {
        const actors = utils_1.cast(yield vm_1._push_expr(this.actors, state), primitives_1.CrochetTuple);
        const context = this.context.realise(state);
        const signals = new bag_1.Bag("signal");
        for (const signal of this.signals) {
            signals.add(signal.name, signal);
        }
        const simulation = new simulation_1.Simulation(state.env, actors.values, context, this.goal, signals);
        return yield vm_1._push(simulation.run(state));
    }
}
exports.SSimulate = SSimulate;
class SRegister extends Statement {
    constructor(position, expr) {
        super();
        this.position = position;
        this.expr = expr;
    }
    *evaluate(state) {
        const value0 = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
        const value = utils_1.cast(value0, primitives_1.CrochetInstance);
        value.type.register_instance(value);
        return value;
    }
}
exports.SRegister = SRegister;
let asserts = 0;
class SAssert extends Statement {
    constructor(position, expr) {
        super();
        this.position = position;
        this.expr = expr;
        this.id = ++asserts;
    }
    *evaluate(state0) {
        const env = state0.env.clone();
        const subexprs = [];
        for (const e of this.expr.sub_expressions) {
            subexprs.push(vm_1.cvalue(yield vm_1._push_expr(e, state0)));
        }
        const vars = [];
        for (let i = 0; i < subexprs.length; ++i) {
            const name = `$assert_${this.id}_${i}`;
            env.define(name, subexprs[i]);
            vars.push(name);
        }
        let i = 0;
        const expr = this.expr.map_subexpressions((_) => new expression_1.EVariable(meta_1.generated_node, vars[i++]));
        const state = state0.with_env(env);
        const value = vm_1.cvalue(yield vm_1._push_expr(expr, state));
        if (!value.as_bool()) {
            const report = subexprs
                .map((x, i) => `  - ${x.to_debug_text()}`)
                .join("\n");
            throw new vm_1.ErrArbitrary("assertion-failed", `${this.position.source_slice}\nWith values:\n${report}`);
        }
        return value;
    }
}
exports.SAssert = SAssert;
//# sourceMappingURL=statement.js.map

/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENothing = exports.EIntrinsicEqual = exports.ELambda = exports.EFloat = exports.EStaticType = exports.EReturn = exports.EForce = exports.ELazy = exports.EHasType = exports.ConditionCase = exports.ECondition = exports.MatchSearchCase = exports.EMatchSearch = exports.EInterpolateDynamic = exports.EInterpolateStatic = exports.EInterpolate = exports.EPartialConcrete = exports.EPartialHole = exports.PartialExpr = exports.EApply = exports.EPartial = exports.EBlock = exports.EForall = exports.ForallIf = exports.ForallDo = exports.ForallMap = exports.ForallExpr = exports.EProjectMany = exports.EProject = exports.ERecord = exports.RFDynamic = exports.RFStatic = exports.RecordField = exports.EList = exports.ESelf = exports.EGlobal = exports.ENew = exports.EInvoke = exports.ESearch = exports.EInteger = exports.EText = exports.EVariable = exports.ETrue = exports.EFalse = exports.Expression = void 0;
const utils_1 = __webpack_require__(23);
const logic_1 = __webpack_require__(12);
const primitives_1 = __webpack_require__(18);
const vm_1 = __webpack_require__(15);
const statement_1 = __webpack_require__(64);
class Expression {
    get sub_expressions() {
        return [];
    }
    map_subexpressions(f) {
        return this;
    }
}
exports.Expression = Expression;
class EFalse extends Expression {
    constructor(position) {
        super();
        this.position = position;
    }
    *evaluate(state) {
        return primitives_1.False.instance;
    }
}
exports.EFalse = EFalse;
class ETrue extends Expression {
    constructor(position) {
        super();
        this.position = position;
    }
    *evaluate(state) {
        return primitives_1.True.instance;
    }
}
exports.ETrue = ETrue;
class EVariable extends Expression {
    constructor(position, name) {
        super();
        this.position = position;
        this.name = name;
    }
    *evaluate(state) {
        const value = state.env.try_lookup(this.name);
        if (value == null) {
            throw new vm_1.ErrUndefinedVariable(this.name);
        }
        else {
            return value;
        }
    }
}
exports.EVariable = EVariable;
class EText extends Expression {
    constructor(position, value) {
        super();
        this.position = position;
        this.value = value;
    }
    *evaluate(state) {
        return new primitives_1.CrochetStaticText(this.value);
    }
}
exports.EText = EText;
class EInteger extends Expression {
    constructor(position, value) {
        super();
        this.position = position;
        this.value = value;
    }
    *evaluate(state) {
        return new primitives_1.CrochetInteger(this.value);
    }
}
exports.EInteger = EInteger;
class ESearch extends Expression {
    constructor(position, predicate) {
        super();
        this.position = position;
        this.predicate = predicate;
    }
    *evaluate(state) {
        const env = logic_1.UnificationEnvironment.empty();
        const results = state.database.search(state, this.predicate, env);
        return new primitives_1.CrochetTuple(results.map((x) => new primitives_1.CrochetRecord(x.boundValues)));
    }
}
exports.ESearch = ESearch;
class EInvoke extends Expression {
    constructor(position, name, args) {
        super();
        this.position = position;
        this.name = name;
        this.args = args;
    }
    *evaluate(state) {
        const args = vm_1.avalue(yield vm_1._push(vm_1.run_all_exprs(this.args, state)));
        return yield vm_1._push(primitives_1.invoke(state, this.name, args));
    }
    get sub_expressions() {
        return this.args;
    }
    map_subexpressions(f) {
        return new EInvoke(this.position, this.name, this.args.map(f));
    }
}
exports.EInvoke = EInvoke;
class ENew extends Expression {
    constructor(position, name, data) {
        super();
        this.position = position;
        this.name = name;
        this.data = data;
    }
    *evaluate(state) {
        const type = utils_1.cast(state.env.module.lookup_type(this.name), primitives_1.TCrochetType);
        if (!type.module) {
            throw new vm_1.ErrArbitrary("no-new-capability", `The type ${type.name} does not provide a support constructing it with 'new'.`);
        }
        if (!state.env.raw_module) {
            throw new vm_1.ErrArbitrary("no-new-capability", `Types can only be constructed in the context of a module.`);
        }
        if (type.module.pkg.name !== state.env.raw_module.pkg.name) {
            throw new vm_1.ErrArbitrary("no-new-capability", `The type ${type.type_name} can only be directly constructed from its declaring package (${type.module?.pkg.name ?? "no package"})`);
        }
        const values = vm_1.avalue(yield vm_1._push(vm_1.run_all_exprs(this.data, state)));
        return type.instantiate(values);
    }
    get sub_expressions() {
        return this.data;
    }
}
exports.ENew = ENew;
class EGlobal extends Expression {
    constructor(position, name) {
        super();
        this.position = position;
        this.name = name;
    }
    *evaluate(state) {
        return state.env.module.lookup_value(this.name);
    }
}
exports.EGlobal = EGlobal;
class ESelf extends Expression {
    constructor(position) {
        super();
        this.position = position;
    }
    *evaluate(state) {
        return state.env.receiver;
    }
}
exports.ESelf = ESelf;
class EList extends Expression {
    constructor(position, values) {
        super();
        this.position = position;
        this.values = values;
    }
    *evaluate(state) {
        const values = vm_1.avalue(yield vm_1._push(vm_1.run_all_exprs(this.values, state)));
        return new primitives_1.CrochetTuple(values);
    }
    get sub_expressions() {
        return this.values;
    }
}
exports.EList = EList;
class RecordField {
    get expression() {
        throw new Error(`Unsupported`);
    }
    get name() {
        throw new Error(`Unsupported`);
    }
}
exports.RecordField = RecordField;
class RFStatic extends RecordField {
    constructor(_name) {
        super();
        this._name = _name;
    }
    get is_static() {
        return true;
    }
    get name() {
        return this._name;
    }
}
exports.RFStatic = RFStatic;
class RFDynamic extends RecordField {
    constructor(value) {
        super();
        this.value = value;
    }
    get is_static() {
        return false;
    }
    get expression() {
        return this.value;
    }
}
exports.RFDynamic = RFDynamic;
class ERecord extends Expression {
    constructor(position, pairs) {
        super();
        this.position = position;
        this.pairs = pairs;
    }
    *evaluate(state) {
        const map = new Map();
        for (const pair of this.pairs) {
            const key = pair.key.is_static
                ? pair.key.name
                : primitives_1.get_string(vm_1.cvalue(yield vm_1._push_expr(pair.key.expression, state)));
            const value = vm_1.cvalue(yield vm_1._push_expr(pair.value, state));
            map.set(key, value);
        }
        return new primitives_1.CrochetRecord(map);
    }
    get sub_expressions() {
        return this.pairs.map((x) => x.value);
    }
}
exports.ERecord = ERecord;
class EProject extends Expression {
    constructor(position, object, field) {
        super();
        this.position = position;
        this.object = object;
        this.field = field;
    }
    *evaluate(state) {
        const object = vm_1.cvalue(yield vm_1._push_expr(this.object, state));
        const key = this.field.is_static
            ? this.field.name
            : primitives_1.get_string(vm_1.cvalue(yield vm_1._push_expr(this.field.expression, state)));
        return object.projection.project(key, state.env.raw_module);
    }
    get sub_expressions() {
        return [this.object];
    }
}
exports.EProject = EProject;
class EProjectMany extends Expression {
    constructor(position, object, fields) {
        super();
        this.position = position;
        this.object = object;
        this.fields = fields;
    }
    *evaluate(state) {
        const object = vm_1.cvalue(yield vm_1._push_expr(this.object, state));
        const fields = [];
        for (const field of this.fields) {
            const key = field.key.is_static
                ? field.key.name
                : primitives_1.get_string(vm_1.cvalue(yield vm_1._push_expr(field.key.expression, state)));
            const alias = field.alias.is_static
                ? field.alias.name
                : primitives_1.get_string(vm_1.cvalue(yield vm_1._push_expr(field.alias.expression, state)));
            fields.push({ key, alias });
        }
        return object.selection.select(fields, state.env.raw_module);
    }
    get sub_expressions() {
        return [this.object];
    }
}
exports.EProjectMany = EProjectMany;
class ForallExpr {
}
exports.ForallExpr = ForallExpr;
class ForallMap extends ForallExpr {
    constructor(name, stream, body) {
        super();
        this.name = name;
        this.stream = stream;
        this.body = body;
    }
    *evaluate(state, results) {
        const stream0 = vm_1.cvalue(yield vm_1._push_expr(this.stream, state));
        const stream = utils_1.cast(yield vm_1._push(primitives_1.safe_cast(stream0, primitives_1.TCrochetTuple.type)), primitives_1.CrochetTuple);
        for (const x of stream.values) {
            const env = state.env.clone();
            env.define(this.name, x);
            const newState = state.with_env(env);
            yield* this.body.evaluate(newState, results);
        }
        return primitives_1.CrochetNothing.instance;
    }
}
exports.ForallMap = ForallMap;
class ForallDo extends ForallExpr {
    constructor(body) {
        super();
        this.body = body;
    }
    *evaluate(state, results) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.body, state));
        results.push(value);
        return primitives_1.CrochetNothing.instance;
    }
}
exports.ForallDo = ForallDo;
class ForallIf extends ForallExpr {
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }
    *evaluate(state, results) {
        const condition = vm_1.cvalue(yield vm_1._push_expr(this.condition, state));
        if (condition.as_bool()) {
            yield* this.body.evaluate(state, results);
        }
        return primitives_1.CrochetNothing.instance;
    }
}
exports.ForallIf = ForallIf;
class EForall extends Expression {
    constructor(position, expr) {
        super();
        this.position = position;
        this.expr = expr;
    }
    *evaluate(state) {
        const results = [];
        yield* this.expr.evaluate(state, results);
        return new primitives_1.CrochetTuple(results);
    }
    *evaluate_stream(state, expr) { }
}
exports.EForall = EForall;
class EBlock extends Expression {
    constructor(position, body) {
        super();
        this.position = position;
        this.body = body;
    }
    evaluate(state) {
        return new statement_1.SBlock(this.position, this.body).evaluate(state);
    }
}
exports.EBlock = EBlock;
class EPartial extends Expression {
    constructor(position, name, values) {
        super();
        this.position = position;
        this.name = name;
        this.values = values;
    }
    *evaluate(state) {
        const values = (yield vm_1._push(vm_1.run_all(this.values.map((x) => x.evaluate(state)))));
        return new primitives_1.CrochetPartial(this.name, state.env, values.map((x) => utils_1.cast(x, primitives_1.PartialValue)));
    }
}
exports.EPartial = EPartial;
class EApply extends Expression {
    constructor(position, partial, values) {
        super();
        this.position = position;
        this.partial = partial;
        this.values = values;
    }
    *evaluate(state) {
        const fn0 = vm_1.cvalue(yield vm_1._push_expr(this.partial, state));
        const values0 = (yield vm_1._push(vm_1.run_all(this.values.map((x) => x.evaluate(state)))));
        const values = values0.map((x) => utils_1.cast(x, primitives_1.PartialValue));
        if (fn0 instanceof primitives_1.CrochetPartial) {
            return yield vm_1._push(primitives_1.apply_partial(state, fn0, values));
        }
        else if (fn0 instanceof primitives_1.CrochetLambda) {
            const args = values.map((x) => utils_1.cast(x, primitives_1.PartialConcrete).value);
            return yield vm_1._push(fn0.apply(state, args));
        }
        else {
            throw new vm_1.ErrArbitrary("invalid-type", `Expected a function`);
        }
    }
}
exports.EApply = EApply;
class PartialExpr {
}
exports.PartialExpr = PartialExpr;
class EPartialHole extends PartialExpr {
    *evaluate(state) {
        return new primitives_1.PartialHole();
    }
}
exports.EPartialHole = EPartialHole;
class EPartialConcrete extends PartialExpr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
    *evaluate(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.expr, state));
        return new primitives_1.PartialConcrete(value);
    }
}
exports.EPartialConcrete = EPartialConcrete;
class EInterpolate extends Expression {
    constructor(position, parts) {
        super();
        this.position = position;
        this.parts = parts;
    }
    *evaluate(state) {
        const values = (yield vm_1._push(vm_1.run_all(this.parts.map((x) => x.evaluate(state)))));
        return new primitives_1.CrochetInterpolation(values);
    }
}
exports.EInterpolate = EInterpolate;
class EInterpolateStatic {
    constructor(text) {
        this.text = text;
    }
    *evaluate(state) {
        return new primitives_1.InterpolationStatic(this.text);
    }
}
exports.EInterpolateStatic = EInterpolateStatic;
class EInterpolateDynamic {
    constructor(expr) {
        this.expr = expr;
    }
    *evaluate(state) {
        return new primitives_1.InterpolationDynamic(vm_1.cvalue(yield vm_1._push_expr(this.expr, state)));
    }
}
exports.EInterpolateDynamic = EInterpolateDynamic;
class EMatchSearch extends Expression {
    constructor(position, cases) {
        super();
        this.position = position;
        this.cases = cases;
    }
    *evaluate(state) {
        for (const kase of this.cases) {
            const results = kase.search(state);
            if (results.length !== 0) {
                const values = [];
                for (const uenv of results) {
                    const new_env = state.env.clone();
                    new_env.define_all(uenv.boundValues);
                    const new_state = state.with_env(new_env);
                    const result = vm_1.cvalue(yield vm_1._push_expr(kase.body, new_state));
                    values.push(result);
                }
                return new primitives_1.CrochetTuple(values);
            }
        }
        return new primitives_1.CrochetTuple([]);
    }
}
exports.EMatchSearch = EMatchSearch;
class MatchSearchCase {
    constructor(predicate, body) {
        this.predicate = predicate;
        this.body = body;
    }
    search(state) {
        const env = logic_1.UnificationEnvironment.empty();
        return state.database.search(state, this.predicate, env);
    }
}
exports.MatchSearchCase = MatchSearchCase;
class ECondition extends Expression {
    constructor(position, cases) {
        super();
        this.position = position;
        this.cases = cases;
    }
    *evaluate(state) {
        for (const kase of this.cases) {
            const valid = vm_1.cvalue(yield vm_1._push_expr(kase.test, state));
            if (valid.as_bool()) {
                return vm_1.cvalue(yield vm_1._push_expr(kase.body, state));
            }
        }
        return primitives_1.CrochetNothing.instance;
    }
}
exports.ECondition = ECondition;
class ConditionCase {
    constructor(test, body) {
        this.test = test;
        this.body = body;
    }
}
exports.ConditionCase = ConditionCase;
class EHasType extends Expression {
    constructor(position, value, type) {
        super();
        this.position = position;
        this.value = value;
        this.type = type;
    }
    *evaluate(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.value, state));
        const type = this.type.realise(state);
        return primitives_1.from_bool(type.accepts(value));
    }
}
exports.EHasType = EHasType;
class ELazy extends Expression {
    constructor(position, value) {
        super();
        this.position = position;
        this.value = value;
    }
    *evaluate(state) {
        return new primitives_1.CrochetThunk(this.value, state.env);
    }
}
exports.ELazy = ELazy;
class EForce extends Expression {
    constructor(position, value) {
        super();
        this.position = position;
        this.value = value;
    }
    *evaluate(state) {
        const value = vm_1.cvalue(yield vm_1._push_expr(this.value, state));
        if (value instanceof primitives_1.CrochetThunk) {
            return vm_1.cvalue(yield vm_1._push(value.force(state)));
        }
        else {
            return value;
        }
    }
}
exports.EForce = EForce;
class EReturn extends Expression {
    constructor(position) {
        super();
        this.position = position;
    }
    *evaluate(state) {
        return state.env.lookup("contract:return");
    }
}
exports.EReturn = EReturn;
class EStaticType extends Expression {
    constructor(position, type) {
        super();
        this.position = position;
        this.type = type;
    }
    *evaluate(state) {
        const type = this.type.realise(state);
        return type.static_type;
    }
}
exports.EStaticType = EStaticType;
class EFloat extends Expression {
    constructor(position, value) {
        super();
        this.position = position;
        this.value = value;
    }
    *evaluate(state) {
        return new primitives_1.CrochetFloat(this.value);
    }
}
exports.EFloat = EFloat;
class ELambda extends Expression {
    constructor(position, parameters, body) {
        super();
        this.position = position;
        this.parameters = parameters;
        this.body = body;
    }
    *evaluate(state) {
        return new primitives_1.CrochetLambda(state.env, this.parameters, this.body);
    }
}
exports.ELambda = ELambda;
class EIntrinsicEqual extends Expression {
    constructor(position, left, right) {
        super();
        this.position = position;
        this.left = left;
        this.right = right;
    }
    *evaluate(state) {
        const left = vm_1.cvalue(yield vm_1._push_expr(this.left, state));
        const right = vm_1.cvalue(yield vm_1._push_expr(this.right, state));
        return primitives_1.from_bool(left.equals(right));
    }
    get sub_expressions() {
        return [this.left, this.right];
    }
    map_subexpressions(f) {
        return new EIntrinsicEqual(this.position, f(this.left), f(this.right));
    }
}
exports.EIntrinsicEqual = EIntrinsicEqual;
class ENothing extends Expression {
    constructor(position) {
        super();
        this.position = position;
    }
    *evaluate(state) {
        return primitives_1.CrochetNothing.instance;
    }
}
exports.ENothing = ENothing;
//# sourceMappingURL=expression.js.map

/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generated_node = exports.GeneratedNode = exports.Interval = exports.Metadata = void 0;
class Metadata {
}
exports.Metadata = Metadata;
class Interval extends Metadata {
    constructor(info, doc) {
        super();
        this.info = info;
        this.doc = doc;
    }
    get source_slice() {
        return this.info.source_slice;
    }
    get annotated_source() {
        return this.info.formatted_position_message;
    }
    get at_suffix() {
        return ` at line ${this.info.position.line}, column ${this.info.position.column}`;
    }
    get at_line_suffix() {
        return ` at line ${this.info.position.line}`;
    }
}
exports.Interval = Interval;
class GeneratedNode extends Metadata {
    get source_slice() {
        return `(source unavailable)`;
    }
    get annotated_source() {
        return "(source unavailable)";
    }
    get at_suffix() {
        return "";
    }
    get at_line_suffix() {
        return "";
    }
    get doc() {
        return "";
    }
}
exports.GeneratedNode = GeneratedNode;
exports.generated_node = new GeneratedNode();
//# sourceMappingURL=meta.js.map

/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TStatic = exports.TNamed = exports.TAny = exports.Type = void 0;
const primitives_1 = __webpack_require__(18);
class Type {
}
exports.Type = Type;
class TAny extends Type {
    realise(state) {
        return primitives_1.TCrochetAny.type;
    }
    get static_name() {
        return "any";
    }
}
exports.TAny = TAny;
class TNamed extends Type {
    constructor(name) {
        super();
        this.name = name;
    }
    realise(state) {
        return state.env.module.lookup_type(this.name);
    }
    get static_name() {
        return this.name;
    }
}
exports.TNamed = TNamed;
class TStatic extends Type {
    constructor(type) {
        super();
        this.type = type;
    }
    realise(state) {
        const type = this.type.realise(state);
        return type.static_type.type;
    }
    get static_name() {
        return `#${this.type.static_name}`;
    }
}
exports.TStatic = TStatic;
//# sourceMappingURL=type.js.map

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SIPDynamic = exports.SIPStatic = exports.SimpleInterpolationPart = exports.SimpleInterpolation = void 0;
const utils_1 = __webpack_require__(33);
const primitives_1 = __webpack_require__(18);
const expression_1 = __webpack_require__(65);
const meta_1 = __webpack_require__(66);
class SimpleInterpolation {
    constructor(parts) {
        this.parts = parts;
    }
    interpolate(f) {
        return new primitives_1.CrochetInterpolation(this.parts.map((x) => x.evaluate(f)));
    }
    to_expression() {
        if (this.has_dynamic_parts()) {
            return new expression_1.EInterpolate(meta_1.generated_node, this.parts.map((x) => x.to_expression()));
        }
        else {
            return new expression_1.EText(meta_1.generated_node, this.static_text());
        }
    }
    has_dynamic_parts() {
        return this.parts.some((x) => x instanceof SIPDynamic);
    }
    static_text() {
        return this.parts.map((x) => x.static_text()).join("");
    }
    optimise() {
        if (this.parts.length === 0) {
            return this;
        }
        else {
            const [hd, ...tl] = this.parts;
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
            return new SimpleInterpolation(list);
        }
    }
}
exports.SimpleInterpolation = SimpleInterpolation;
class SimpleInterpolationPart {
}
exports.SimpleInterpolationPart = SimpleInterpolationPart;
class SIPStatic extends SimpleInterpolationPart {
    constructor(text) {
        super();
        this.text = text;
    }
    evaluate(f) {
        return new primitives_1.InterpolationStatic(this.text);
    }
    to_expression() {
        return new expression_1.EInterpolateStatic(this.text);
    }
    static_text() {
        return this.text;
    }
    merge(x) {
        if (x instanceof SIPStatic) {
            return new SIPStatic(this.text + x.text);
        }
        else {
            return null;
        }
    }
}
exports.SIPStatic = SIPStatic;
class SIPDynamic extends SimpleInterpolationPart {
    constructor(value) {
        super();
        this.value = value;
    }
    evaluate(f) {
        return new primitives_1.InterpolationDynamic(f(this.value));
    }
    to_expression() {
        return new expression_1.EInterpolateDynamic(utils_1.cast(this.value, expression_1.Expression));
    }
    static_text() {
        return "[_]";
    }
    merge(x) {
        return null;
    }
}
exports.SIPDynamic = SIPDynamic;
//# sourceMappingURL=atomic.js.map

/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CmdHelpType = exports.CmdHelpCommand = exports.CmdRollback = exports.REPLCommand = exports.REPLStatements = exports.REPLDeclarations = exports.REPLExpr = void 0;
const utils_1 = __webpack_require__(33);
const primitives_1 = __webpack_require__(18);
const vm_1 = __webpack_require__(15);
class REPLExpr {
}
exports.REPLExpr = REPLExpr;
class REPLDeclarations extends REPLExpr {
    constructor(declarations) {
        super();
        this.declarations = declarations;
    }
    async evaluate(state) {
        for (const x of this.declarations) {
            await x.apply({
                module: state.env.module,
                package: state.env.module.pkg,
            }, state);
        }
    }
}
exports.REPLDeclarations = REPLDeclarations;
class REPLStatements extends REPLExpr {
    constructor(statements) {
        super();
        this.statements = statements;
    }
    async evaluate(state) {
        const machine = this.statements.evaluate(state);
        const result = vm_1.cvalue(await vm_1.Thread.for_machine(machine).run_and_wait());
        const printer_type = utils_1.cast(state.world.types.lookup("crochet.core::debug-printer"), primitives_1.TCrochetType);
        const printer = printer_type.instantiate([]);
        const repr_machine = primitives_1.invoke(state, "_ show: _", [printer, result]);
        const repr = vm_1.cvalue(await vm_1.Thread.for_machine(repr_machine).run_and_wait());
        console.log(primitives_1.get_string(repr));
    }
}
exports.REPLStatements = REPLStatements;
class REPLCommand extends REPLExpr {
}
exports.REPLCommand = REPLCommand;
class CmdRollback extends REPLCommand {
    constructor(name) {
        super();
        this.name = name;
    }
    async evaluate(state) {
        const procedure = state.world.procedures.lookup(this.name);
        procedure.rollback();
    }
}
exports.CmdRollback = CmdRollback;
class CmdHelpCommand extends REPLCommand {
    constructor(name, types) {
        super();
        this.name = name;
        this.types = types;
    }
    async evaluate(state) {
        const procedure = state.world.procedures.lookup(this.name);
        const types = this.types.map((x) => x.realise(state));
        const branches = [...procedure.select_subtype(types)];
        console.log(`${procedure.name} (${branches.length} branches matched)`);
        console.log("");
        branches.forEach((x) => this.describe_branch(x));
    }
    describe_branch(x) {
        console.log(x.full_repr);
        const contract = x.procedure.contract;
        this.describe_contract(contract.pre, "Requires:");
        this.describe_contract(contract.post, "Ensures:");
        console.log("");
        console.log(indent(2, x.procedure.documentation));
        console.log("");
        console.log("---");
    }
    describe_contract(contracts, header) {
        if (contracts.length !== 0) {
            console.log(header);
            for (const x of contracts) {
                console.log(`  ${x.tag} :: ${x.expr.position.source_slice}`);
            }
        }
    }
}
exports.CmdHelpCommand = CmdHelpCommand;
class CmdHelpType extends REPLCommand {
    constructor(type) {
        super();
        this.type = type;
    }
    async evaluate(state) {
        const type = this.type.realise(state);
        console.log(`${type.type_name} (${type.location})`);
        console.log("");
        if (type.parent != null) {
            console.log(`Refines: ${type.parent.type_name}`);
        }
        if (type instanceof primitives_1.TCrochetType && type.fields.length !== 0) {
            console.log(`Fields:`);
            type.fields.forEach((x, i) => {
                console.log(`  - ${x} is ${type.types[i].type_name}`);
            });
        }
        console.log("");
        console.log(type.documentation);
        console.log("");
        console.log("---");
        const procedures = [...state.world.procedures.select_matching(type)];
        console.log(`${procedures.length} procedures defined on this type`);
        for (const [procedure, branches] of procedures) {
            console.log(`${procedure.name}`);
            for (const branch of branches) {
                console.log(`  ${branch.full_repr}`);
                console.log(`    ${short(branch.procedure.documentation)}`);
                console.log("");
            }
        }
    }
}
exports.CmdHelpType = CmdHelpType;
function short(s) {
    const line = s.split(/\r\n|\r|\n/)[0] || "";
    if (line.length > 65) {
        return `${line.slice(0, 65)}...`;
    }
    else {
        return line;
    }
}
function indent(n, x) {
    return x
        .split(/\r\n|\r|\n/)
        .map((x) => " ".repeat(n) + x)
        .join("\n");
}
//# sourceMappingURL=repl.js.map

/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(71), exports);
__exportStar(__webpack_require__(72), exports);
__exportStar(__webpack_require__(73), exports);
__exportStar(__webpack_require__(74), exports);
__exportStar(__webpack_require__(76), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetCapability = exports.Capabilities = void 0;
const utils_1 = __webpack_require__(33);
class Capabilities {
    constructor(capabilities) {
        this.capabilities = capabilities;
    }
    static get all() {
        return new Capabilities(new Set([]));
    }
    static get safe() {
        return new Capabilities(new Set([]));
    }
    allows(capability) {
        return this.capabilities.has(capability);
    }
    require(set) {
        return utils_1.difference(set, this.capabilities);
    }
    restrict(new_set) {
        return new Capabilities(utils_1.intersect(this.capabilities, new_set));
    }
}
exports.Capabilities = Capabilities;
class CrochetCapability {
    static get spec() {
        return utils_1.string;
    }
}
exports.CrochetCapability = CrochetCapability;
//# sourceMappingURL=capability.js.map

/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnyTarget = exports.BrowserTarget = exports.NodeTarget = exports.Target = void 0;
const utils_1 = __webpack_require__(33);
class Target {
    static get spec() {
        return utils_1.anyOf([NodeTarget, BrowserTarget, AnyTarget]);
    }
}
exports.Target = Target;
class NodeTarget extends Target {
    accepts(x) {
        return x instanceof NodeTarget;
    }
    describe() {
        return `node`;
    }
    static get spec() {
        return utils_1.map_spec(utils_1.equal("node"), (_) => new NodeTarget());
    }
}
exports.NodeTarget = NodeTarget;
class BrowserTarget extends Target {
    accepts(x) {
        return x instanceof BrowserTarget;
    }
    describe() {
        return `browser`;
    }
    static get spec() {
        return utils_1.map_spec(utils_1.equal("browser"), (_) => new BrowserTarget());
    }
}
exports.BrowserTarget = BrowserTarget;
class AnyTarget extends Target {
    accepts(x) {
        return true;
    }
    describe() {
        return `*`;
    }
    static get spec() {
        return utils_1.map_spec(utils_1.equal("*"), (_) => new AnyTarget());
    }
}
exports.AnyTarget = AnyTarget;
//# sourceMappingURL=target.js.map

/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dependency = void 0;
const utils_1 = __webpack_require__(33);
const capability_1 = __webpack_require__(71);
const target_1 = __webpack_require__(72);
class Dependency {
    constructor(name, raw_capabilities, target) {
        this.name = name;
        this.raw_capabilities = raw_capabilities;
        this.target = target;
    }
    get capabilities() {
        if (this.raw_capabilities == null) {
            return capability_1.Capabilities.safe.capabilities;
        }
        else {
            return this.raw_capabilities;
        }
    }
    is_valid(x) {
        return this.target.accepts(x);
    }
    static get spec() {
        return utils_1.anyOf([
            utils_1.map_spec(utils_1.string, (x) => new Dependency(x, null, new target_1.AnyTarget())),
            utils_1.spec({
                name: utils_1.string,
                capabilities: utils_1.array(capability_1.CrochetCapability),
                target: target_1.Target,
            }, (x) => new Dependency(x.name, new Set(x.capabilities), x.target)),
        ]);
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=dependency.js.map

/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RestrictedCrochetPackage = exports.CrochetPackage = void 0;
const Path = __webpack_require__(1);
const utils_1 = __webpack_require__(33);
const capability_1 = __webpack_require__(71);
const dependency_1 = __webpack_require__(73);
const target_1 = __webpack_require__(72);
const file_1 = __webpack_require__(75);
class CrochetPackage {
    constructor(filename, data) {
        this.filename = filename;
        this.data = data;
        this.root = Path.resolve(Path.dirname(filename));
    }
    get name() {
        return this.data.name;
    }
    get target() {
        return this.data.target;
    }
    sources_for(target) {
        return this.data.sources
            .filter((x) => x.is_valid(target))
            .map((x) => this.resolve(x.filename));
    }
    native_sources_for(target) {
        return this.data.native_sources
            .filter((x) => x.is_valid(target))
            .map((x) => this.resolve(x.filename));
    }
    dependencies_for(target) {
        return this.data.dependencies.filter((x) => x.is_valid(target));
    }
    get capabilities() {
        return this.data.capabilities;
    }
    get required_capabilities() {
        return utils_1.union(this.capabilities.provides, this.capabilities.requires);
    }
    relative_filename(filename) {
        return Path.relative(this.root, filename);
    }
    allows(x) {
        return this.required_capabilities.has(x);
    }
    resolve(source) {
        const resolved = Path.resolve(this.root, source);
        return resolved;
    }
    restricted_to(target) {
        return new RestrictedCrochetPackage(target, this);
    }
    static get spec() {
        return utils_1.spec({
            name: utils_1.string,
            target: utils_1.optional(target_1.Target, new target_1.AnyTarget()),
            sources: utils_1.array(file_1.File),
            native_sources: utils_1.optional(utils_1.array(file_1.File), []),
            dependencies: utils_1.optional(utils_1.array(dependency_1.Dependency), []),
            capabilities: utils_1.optional(utils_1.spec({
                requires: utils_1.array(capability_1.CrochetCapability),
                provides: utils_1.array(capability_1.CrochetCapability),
            }, (x) => ({
                requires: new Set(x.requires),
                provides: new Set(x.provides),
            })), { requires: new Set(), provides: new Set() }),
        }, (x) => (filename) => new CrochetPackage(filename, x));
    }
    static parse(x, filename) {
        return utils_1.parse(x, this.spec)(filename);
    }
    static empty(filename, capabilities, dependencies) {
        return new CrochetPackage(filename, {
            name: "(empty)",
            target: new target_1.AnyTarget(),
            sources: [],
            native_sources: [],
            dependencies: dependencies.map((x) => new dependency_1.Dependency(x, capabilities.capabilities, new target_1.AnyTarget())),
            capabilities: {
                requires: capabilities.capabilities,
                provides: new Set(),
            },
        });
    }
}
exports.CrochetPackage = CrochetPackage;
class RestrictedCrochetPackage extends CrochetPackage {
    constructor(target_restriction, pkg) {
        super(pkg.filename, pkg.data);
        this.target_restriction = target_restriction;
    }
    get sources() {
        return this.sources_for(this.target_restriction);
    }
    get native_sources() {
        return this.native_sources_for(this.target_restriction);
    }
    get dependencies() {
        return this.dependencies_for(this.target_restriction);
    }
}
exports.RestrictedCrochetPackage = RestrictedCrochetPackage;
//# sourceMappingURL=pkg.js.map

/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.File = void 0;
const target_1 = __webpack_require__(72);
const utils_1 = __webpack_require__(33);
const target_2 = __webpack_require__(72);
class File {
    constructor(filename, target) {
        this.filename = filename;
        this.target = target;
    }
    is_valid(target) {
        return this.target.accepts(target);
    }
    static get spec() {
        return utils_1.anyOf([
            utils_1.map_spec(utils_1.string, (n) => new File(n, new target_1.AnyTarget())),
            utils_1.spec({
                filename: utils_1.string,
                target: target_2.Target,
            }, (x) => new File(x.filename, x.target)),
        ]);
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map

/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PackageGraph = void 0;
const utils_1 = __webpack_require__(33);
class PackageGraph {
    constructor(target, packages) {
        this.target = target;
        this.packages = packages;
    }
    static async resolve(target, resolver, pkg) {
        const packages = new Map();
        const resolve = async (pkg) => {
            for (const dep_meta of pkg.dependencies) {
                if (!packages.has(dep_meta.name)) {
                    utils_1.logger.debug(`Resolving package ${dep_meta.name} from ${pkg.name}`);
                    const dep = await resolver.get_package(dep_meta.name);
                    if (dep.name !== dep_meta.name) {
                        throw new Error(`${pkg.name} includes a dependency on ${dep_meta.name}, but the loader returned the package ${dep.name}`);
                    }
                    const restricted_dep = dep.restricted_to(target);
                    packages.set(dep.name, restricted_dep);
                    resolve(restricted_dep);
                }
            }
        };
        const restricted_pkg = pkg.restricted_to(target);
        packages.set(pkg.name, restricted_pkg);
        await resolve(restricted_pkg);
        return new PackageGraph(target, packages);
    }
    get capability_requirements() {
        const capabilities = new Set();
        for (const pkg of this.packages.values()) {
            for (const cap of pkg.required_capabilities) {
                capabilities.add(cap);
            }
        }
        return capabilities;
    }
    get_package(name) {
        const pkg = this.packages.get(name);
        if (pkg == null) {
            throw new Error(`Package ${name} does not exist in the package graph`);
        }
        return pkg;
    }
    parents(name) {
        const result = [];
        for (const pkg of this.packages.values()) {
            for (const dep of pkg.dependencies) {
                if (dep.name === name) {
                    result.push(dep);
                }
            }
        }
        return result;
    }
    check_capabilities(name, capabilities) {
        const check = (visited, parent, pkg, capabilities) => {
            const name = pkg.name;
            const missing = capabilities.require(pkg.required_capabilities);
            if (missing.size !== 0) {
                throw new Error(`${name} cannot be loaded from ${parent} because it does not have the capabilities: ${[
                    ...missing,
                ].join(", ")}.\n${parent} has granted the capabilities: ${[
                    ...capabilities.capabilities,
                ].join(", ")}`);
            }
            if (pkg.native_sources.length !== 0 && !capabilities.allows("native")) {
                throw new Error(`${pkg.name} (${pkg.filename}) defines native extensions, but has not been granted the 'native' capability..\n${parent} has granted the capabilities: ${[
                    ...capabilities.capabilities,
                ].join(", ")}`);
            }
            for (const x of pkg.dependencies) {
                const dep = this.get_package(x.name);
                if (!visited.includes(x.name)) {
                    const new_capabilities = capabilities.restrict(x.capabilities);
                    check([x.name, ...visited], name, dep, new_capabilities);
                }
            }
        };
        utils_1.logger.debug(`Checking for capability violations (capabilities: ${[
            ...capabilities.capabilities,
        ].join(", ")})`);
        for (const [k, v] of this.packages.entries()) {
            utils_1.logger.debug(`- ${k} requires: ${[...v.required_capabilities].join(", ")}`);
        }
        check([], "(root)", this.get_package(name), capabilities);
    }
    check_target(root) {
        utils_1.logger.debug(`Checking for target violations (target: ${this.target.describe()})`);
        for (const pkg of this.serialise(root)) {
            utils_1.logger.debug(`- ${pkg.name} has target: ${pkg.target.describe()}`);
            if (!pkg.target.accepts(this.target)) {
                const parents = this.parents(pkg.name)
                    .map((x) => x.name)
                    .join(", ");
                throw new Error(`Cannot load package ${pkg.name} (included in ${parents}) for target ${this.target.describe()} because it requires the target ${pkg.target.describe()}`);
            }
        }
    }
    check(root, capabilities) {
        this.check_capabilities(root, capabilities);
        this.check_target(root);
    }
    *serialise(root) {
        const self = this;
        const visited = new Set([]);
        const collect = function* (pkg) {
            const include = !visited.has(pkg.name);
            visited.add(pkg.name);
            for (const x of pkg.dependencies) {
                if (!visited.has(x.name)) {
                    yield* collect(self.get_package(x.name));
                }
            }
            if (include) {
                yield pkg;
            }
        };
        yield* collect(this.get_package(root));
    }
}
exports.PackageGraph = PackageGraph;
//# sourceMappingURL=pkg-graph.js.map

/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForeignNamespace = void 0;
const utils_1 = __webpack_require__(33);
class ForeignNamespace {
    constructor(ffi, namespace) {
        this.ffi = ffi;
        this.namespace = namespace;
    }
    namespaced(x) {
        return `${this.namespace}.${x}`;
    }
    deftype(name, type) {
        utils_1.logger.debug(`Defining native type ${name}`);
        this.ffi.types.add(this.namespaced(name), type);
        return this;
    }
    defun(name, types, fn) {
        utils_1.logger.debug(`Defining native function ${name}`);
        this.ffi.methods.add(this.namespaced(name), function* (state, ...args) {
            return fn(...args);
        });
        return this;
    }
    defmachine(name, types, fn) {
        utils_1.logger.debug(`Defining native function ${name}`);
        this.ffi.methods.add(this.namespaced(name), fn);
        return this;
    }
    defun1(name, fn) {
        this.defun(name, [], fn);
        return this;
    }
    defmachine1(name, fn) {
        this.defmachine(name, [], fn);
        return this;
    }
}
exports.ForeignNamespace = ForeignNamespace;
//# sourceMappingURL=ffi-def.js.map

/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wall_clock_ffi = exports.pure_instant_ffi = exports.time_ffi = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
function time_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.time:time").defmachine("sleep", [runtime_1.CrochetInteger], function* (_, ms) {
        yield runtime_1._await(utils_1.delay(Number(ms.value)));
        return runtime_1.CrochetNothing.instance;
    });
}
exports.time_ffi = time_ffi;
function pure_instant_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.time:instant")
        .defun("from-ms", [runtime_1.CrochetInteger], (x) => {
        return runtime_1.box(new Date(Number(x.value)));
    })
        .defun("from-iso", [runtime_1.CrochetText], (x) => {
        const m = [
            [
                /^(\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d+)$/,
                (_, y, m, d, h, mm, ss, ms) => [+y, +m, +d, +h, +mm, +ss, +ms],
            ],
            [
                /^(\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
                (_, y, m, d, h, mm, ss) => [+y, +m, +d, +h, +mm, +ss, 0],
            ],
            [/^(\d+)-(\d{2})-(\d{2})$/, (_, y, m, d) => [+y, +m, +d, 0, 0, 0, 0]],
        ];
        const text = x.value;
        for (const [re, f] of m) {
            const match = text.match(re);
            if (match != null) {
                const [Y, M, D, h, m, s, ms] = f(...match);
                return runtime_1.box(new Date(Y, M, D, h, m, s, ms));
            }
        }
        return runtime_1.CrochetNothing.instance;
    })
        .defun("epoch-ms", [runtime_1.CrochetUnknown], (x) => new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getTime())))
        .defun("to-iso", [runtime_1.CrochetUnknown], (x) => {
        const d = runtime_1.unbox(x);
        const t = `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d
            .getDate()
            .toString()
            .padStart(2, "0")}T${d
            .getHours()
            .toString()
            .padStart(2, "0")}:${d
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${d
            .getSeconds()
            .toString()
            .padStart(2, "0")}.${d.getMilliseconds().toString()}`;
        return new runtime_1.CrochetText(t);
    });
    new ffi_def_1.ForeignNamespace(ffi, "crochet.time:date")
        .defun("year", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCFullYear()));
    })
        .defun("month", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCMonth() + 1));
    })
        .defun("day", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCDate()));
    })
        .defun("hours", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCHours()));
    })
        .defun("minutes", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCMinutes()));
    })
        .defun("seconds", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCSeconds()));
    })
        .defun("milliseconds", [runtime_1.CrochetUnknown], (x) => {
        return new runtime_1.CrochetInteger(BigInt(runtime_1.unbox(x).getUTCMilliseconds()));
    });
}
exports.pure_instant_ffi = pure_instant_ffi;
function wall_clock_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.time.wall-clock:clock").defun("now", [], () => new runtime_1.CrochetInteger(BigInt(new Date().getTime())));
}
exports.wall_clock_ffi = wall_clock_ffi;
exports.default = [time_ffi, pure_instant_ffi, wall_clock_ffi];
//# sourceMappingURL=time.js.map

/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.core_debug = exports.core_commands = exports.core_record = exports.core_cell = exports.core_tuple = exports.core_float = exports.core_integer = exports.core_text = exports.core_interpolation = exports.core_conversion = exports.core_boolean = exports.core_types = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
function core_types(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:core")
        .deftype("any", runtime_1.TCrochetAny.type)
        .deftype("unknown", runtime_1.TCrochetUnknown.type)
        .deftype("nothing", runtime_1.TCrochetNothing.type)
        .deftype("true", runtime_1.TCrochetTrue.type)
        .deftype("false", runtime_1.TCrochetFalse.type)
        .deftype("boolean", runtime_1.TCrochetBoolean.type)
        .deftype("numeric", runtime_1.TCrochetNumeric.type)
        .deftype("integral", runtime_1.TCrochetIntegral.type)
        .deftype("fractional", runtime_1.TCrochetFractional.type)
        .deftype("float", runtime_1.TCrochetFloat.type)
        .deftype("integer", runtime_1.TCrochetInteger.type)
        .deftype("text", runtime_1.TCrochetBaseText.type)
        .deftype("static-text", runtime_1.TCrochetStaticText.type)
        .deftype("interpolation", runtime_1.TCrochetInterpolation.type)
        .deftype("function", runtime_1.TAnyFunction.type)
        .deftype("function-0", runtime_1.TFunctionWithArity.for_arity(0))
        .deftype("function-1", runtime_1.TFunctionWithArity.for_arity(1))
        .deftype("function-2", runtime_1.TFunctionWithArity.for_arity(2))
        .deftype("function-3", runtime_1.TFunctionWithArity.for_arity(3))
        .deftype("function-4", runtime_1.TFunctionWithArity.for_arity(4))
        .deftype("function-5", runtime_1.TFunctionWithArity.for_arity(5))
        .deftype("function-6", runtime_1.TFunctionWithArity.for_arity(6))
        .deftype("record", runtime_1.TCrochetRecord.type)
        .deftype("tuple", runtime_1.TCrochetTuple.type)
        .deftype("enum", runtime_1.baseEnum)
        .deftype("thunk", runtime_1.TCrochetThunk.type)
        .deftype("cell", runtime_1.TCrochetCell.type);
}
exports.core_types = core_types;
function core_boolean(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:boolean")
        .defun("and", [runtime_1.CrochetValue, runtime_1.CrochetValue], (x, y) => runtime_1.from_bool(x.as_bool() && y.as_bool()))
        .defun("or", [runtime_1.CrochetValue, runtime_1.CrochetValue], (x, y) => runtime_1.from_bool(x.as_bool() || y.as_bool()))
        .defun("not", [runtime_1.CrochetValue], (x) => runtime_1.from_bool(!x.as_bool()));
}
exports.core_boolean = core_boolean;
function core_conversion(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:conversion")
        .defun("integer-to-float", [runtime_1.CrochetInteger], (x) => new runtime_1.CrochetFloat(Number(x.value)))
        .defun("float-to-integer", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetInteger(BigInt(x.value)))
        .defun("tuple-to-interpolation", [runtime_1.CrochetTuple], (xs) => {
        return new runtime_1.CrochetInterpolation(xs.values.map((x) => {
            if (x instanceof runtime_1.CrochetText) {
                return new runtime_1.InterpolationStatic(x.value);
            }
            else {
                return new runtime_1.InterpolationDynamic(x);
            }
        }));
    })
        .defun("interpolation-to-text", [runtime_1.CrochetInterpolation], (x) => {
        return new runtime_1.CrochetText(x.parts
            .map((x) => {
            if (x instanceof runtime_1.InterpolationStatic) {
                return x.text;
            }
            else if (x instanceof runtime_1.InterpolationDynamic) {
                return utils_1.cast(x.value, runtime_1.CrochetText).value;
            }
            else {
                throw new Error(`internal: impossible`);
            }
        })
            .join(""));
    })
        .defun("text-to-integer", [runtime_1.CrochetText], (x) => {
        try {
            return new runtime_1.CrochetInteger(BigInt(x.value));
        }
        catch (_) {
            return runtime_1.CrochetNothing.instance;
        }
    })
        .defun("text-to-float", [runtime_1.CrochetText], (x) => {
        const n = Number(x.value);
        if (isNaN(n)) {
            return runtime_1.CrochetNothing.instance;
        }
        else {
            return new runtime_1.CrochetFloat(n);
        }
    })
        .defun("any-to-text", [runtime_1.CrochetValue], (x) => {
        return new runtime_1.CrochetText(x.to_text());
    });
}
exports.core_conversion = core_conversion;
function core_interpolation(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:interpolation")
        .defun("concat", [runtime_1.CrochetInterpolation, runtime_1.CrochetInterpolation], (x, y) => new runtime_1.CrochetInterpolation(x.parts.concat(y.parts)))
        .defun("parts", [runtime_1.CrochetInterpolation], (x) => new runtime_1.CrochetTuple(x.parts.map((a) => a.to_part())))
        .defun("holes", [runtime_1.CrochetInterpolation], (x) => new runtime_1.CrochetTuple(x.parts
        .filter((a) => a instanceof runtime_1.InterpolationDynamic)
        .map((a) => a.to_part())))
        .defun("static-text", [runtime_1.CrochetInterpolation], (x) => new runtime_1.CrochetText(x.parts.map((a) => a.to_static()).join("")))
        .defun("to-plain-text", [runtime_1.CrochetInterpolation], (x) => {
        function flatten_part(x) {
            if (x instanceof runtime_1.InterpolationStatic) {
                return x.text;
            }
            else if (x instanceof runtime_1.InterpolationDynamic) {
                return flatten(x.value);
            }
            else {
                throw new Error(`unreachable`);
            }
        }
        function flatten(x) {
            if (x instanceof runtime_1.CrochetText) {
                return x.value;
            }
            else if (x instanceof runtime_1.CrochetInterpolation) {
                return x.parts.map(flatten_part).reduce((a, b) => a + b, "");
            }
            else {
                throw new runtime_1.ErrArbitrary("invalid-type", "Can only flatten interpolations containing text");
            }
        }
        return runtime_1.from_string(flatten(x));
    })
        .defun("normalise", [runtime_1.CrochetInterpolation], (x) => x.normalize());
}
exports.core_interpolation = core_interpolation;
function core_text(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:text").defun("concat", [runtime_1.CrochetText, runtime_1.CrochetText], (x, y) => new runtime_1.CrochetText(x.value + y.value));
}
exports.core_text = core_text;
function core_integer(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:integer")
        .defun("add", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value + y.value))
        .defun("sub", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value - y.value))
        .defun("mul", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value * y.value))
        .defun("div", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value / y.value))
        .defun("rem", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value % y.value))
        .defun("lt", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => runtime_1.from_bool(x.value < y.value))
        .defun("lte", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => runtime_1.from_bool(x.value <= y.value))
        .defun("gt", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => runtime_1.from_bool(x.value > y.value))
        .defun("gte", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => runtime_1.from_bool(x.value >= y.value))
        .defun("power", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetInteger(x.value ** y.value))
        .defun("range", [runtime_1.CrochetInteger, runtime_1.CrochetInteger, runtime_1.CrochetInteger], (x, y, z) => {
        const result = [];
        for (let i = x.value; i <= y.value; i += z.value) {
            result.push(new runtime_1.CrochetInteger(i));
        }
        return new runtime_1.CrochetTuple(result);
    });
}
exports.core_integer = core_integer;
function core_float(ffi) {
    const nan = new runtime_1.CrochetFloat(NaN);
    const inf = new runtime_1.CrochetFloat(Number.POSITIVE_INFINITY);
    const neginf = new runtime_1.CrochetFloat(Number.NEGATIVE_INFINITY);
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:float")
        .defun("add", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(x.value + y.value))
        .defun("sub", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(x.value - y.value))
        .defun("mul", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(x.value * y.value))
        .defun("div", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(x.value / y.value))
        .defun("rem", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(x.value % y.value))
        .defun("lt", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value < y.value))
        .defun("lte", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value <= y.value))
        .defun("gt", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value > y.value))
        .defun("gte", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value >= y.value))
        .defun("eq", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value === y.value))
        .defun("neq", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => runtime_1.from_bool(x.value !== y.value))
        .defun("power", [runtime_1.CrochetFloat, runtime_1.CrochetInteger], (x, y) => new runtime_1.CrochetFloat(x.value ** Number(y.value)))
        .defun("floor", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.floor(x.value)))
        .defun("ceil", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.ceil(x.value)))
        .defun("trunc", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.trunc(x.value)))
        .defun("round", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.round(x.value)))
        .defun("is-nan", [runtime_1.CrochetFloat], (x) => runtime_1.from_bool(Number.isNaN(x.value)))
        .defun("is-finite", [runtime_1.CrochetFloat], (x) => runtime_1.from_bool(Number.isFinite(x.value)))
        .defun("nan", [], () => nan)
        .defun("infinity", [], () => inf)
        .defun("negative-infinity", [], () => neginf);
}
exports.core_float = core_float;
function core_tuple(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:tuple")
        .defun("count", [runtime_1.CrochetTuple], (xs) => new runtime_1.CrochetInteger(BigInt(xs.values.length)))
        .defun("concat", [runtime_1.CrochetTuple, runtime_1.CrochetTuple], (xs, ys) => new runtime_1.CrochetTuple(xs.values.concat(ys.values)))
        .defun("contains", [runtime_1.CrochetTuple, runtime_1.CrochetValue], (xs, x) => runtime_1.from_bool(xs.values.some((y) => x.equals(y))))
        .defmachine("fold", [runtime_1.CrochetTuple, runtime_1.CrochetValue, runtime_1.CrochetValue], function* (state, xs, z, f) {
        let acc = z;
        for (const x of xs.values) {
            acc = runtime_1.cvalue(yield runtime_1._push(runtime_1.apply(state, f, [acc, x])));
        }
        return acc;
    })
        .defmachine("foldr", [runtime_1.CrochetTuple, runtime_1.CrochetValue, runtime_1.CrochetValue], function* (state, xs, z, f) {
        let acc = z;
        const vs = xs.values;
        for (let i = vs.length - 1; i >= 0; --i) {
            const x = vs[i];
            acc = runtime_1.cvalue(yield runtime_1._push(runtime_1.apply(state, f, [x, acc])));
        }
        return acc;
    })
        .defun("slice", [runtime_1.CrochetTuple, runtime_1.CrochetInteger, runtime_1.CrochetInteger], (xs, from, to) => {
        return new runtime_1.CrochetTuple(xs.values.slice(Number(from.value - 1n), Number(to.value)));
    })
        .defun("at", [runtime_1.CrochetTuple, runtime_1.CrochetInteger], (xs, i) => xs.values[Number(i.value - 1n)])
        .defun("at-put", [runtime_1.CrochetTuple, runtime_1.CrochetInteger, runtime_1.CrochetValue], (xs, i, v) => {
        const result = xs.values.slice();
        result[Number(i.value - 1n)] = v;
        return new runtime_1.CrochetTuple(result);
    })
        .defun("at-delete", [runtime_1.CrochetTuple, runtime_1.CrochetInteger], (xs, i) => {
        const result = [];
        const values = xs.values;
        const target = Number(i.value - 1n);
        for (let i = 0; i < values.length; ++i) {
            if (i !== target) {
                result.push(values[i]);
            }
        }
        return new runtime_1.CrochetTuple(result);
    })
        .defun1("at-insert", (xs0, i0, x) => {
        const xs = runtime_1.get_array(xs0);
        const i = runtime_1.get_integer(i0);
        const xs1 = xs.slice();
        xs1.splice(Number(i - 1n), 0, x);
        return new runtime_1.CrochetTuple(xs1);
    })
        .defmachine1("zip-with", function* (state, self0, that0, fn) {
        const self = runtime_1.get_array(self0);
        const that = runtime_1.get_array(that0);
        if (self.length !== that.length) {
            throw new runtime_1.ErrArbitrary("invalid-length", "Cannot zip tuples of different lengths");
        }
        let result = [];
        for (let i = 0; i < self.length; ++i) {
            const x = self[i];
            const y = that[i];
            const value = runtime_1.cvalue(yield runtime_1._push(runtime_1.apply(state, fn, [x, y])));
            result.push(value);
        }
        return new runtime_1.CrochetTuple(result);
    })
        .defun("reverse", [runtime_1.CrochetTuple], (xs) => {
        const source = xs.values;
        const result = [];
        for (let i = source.length - 1; i >= 0; i--) {
            result.push(source[i]);
        }
        return new runtime_1.CrochetTuple(result);
    })
        .defmachine("sort", [runtime_1.CrochetTuple, runtime_1.CrochetValue], function* (state, xs, f) {
        const result = xs.values.slice();
        result.sort((a, b) => {
            const call = runtime_1.apply(state, f, [a, b]);
            const order = utils_1.cast(runtime_1.Thread.for_machine(call).run_sync(), runtime_1.CrochetInteger);
            return Number(order.value);
        });
        return new runtime_1.CrochetTuple(result);
    })
        .defmachine("unique", [runtime_1.CrochetTuple], function* (state, xs) {
        const result = [];
        for (const x of xs.values) {
            if (!result.some((y) => runtime_1.equals_sync(state, x, y))) {
                result.push(x);
            }
        }
        return new runtime_1.CrochetTuple(result);
    });
}
exports.core_tuple = core_tuple;
function core_cell(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:cell")
        .defun("make", [runtime_1.CrochetValue], (v) => new runtime_1.CrochetCell(v))
        .defun("deref", [runtime_1.CrochetCell], (x) => x.deref())
        .defun("cas", [runtime_1.CrochetCell, runtime_1.CrochetValue, runtime_1.CrochetValue], (x, v1, v2) => runtime_1.from_bool(x.cas(v1, v2)));
}
exports.core_cell = core_cell;
function core_record(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:record")
        .defun("count", [runtime_1.CrochetRecord], (x) => new runtime_1.CrochetInteger(BigInt(x.values.size)))
        .defun("keys", [runtime_1.CrochetRecord], (x) => new runtime_1.CrochetTuple([...x.values.keys()].map((x) => new runtime_1.CrochetText(x))))
        .defun("values", [runtime_1.CrochetRecord], (x) => new runtime_1.CrochetTuple([...x.values.values()]))
        .defun("pairs", [runtime_1.CrochetRecord], (x) => {
        return new runtime_1.CrochetTuple([...x.values.entries()].map(([k, v]) => new runtime_1.CrochetRecord(new Map([
            ["key", new runtime_1.CrochetText(k)],
            ["value", v],
        ]))));
    })
        .defun("concat", [runtime_1.CrochetRecord, runtime_1.CrochetRecord], (a, b) => {
        const result = new Map();
        for (const [k, v] of a.values) {
            result.set(k, v);
        }
        for (const [k, v] of b.values) {
            result.set(k, v);
        }
        return new runtime_1.CrochetRecord(result);
    })
        .defmachine("from-pairs", [runtime_1.CrochetTuple], function* (state, xs) {
        const result = new Map();
        for (const pair0 of xs.values) {
            const pair = utils_1.cast(pair0, runtime_1.CrochetRecord);
            result.set(utils_1.cast(pair.projection.project("key", state.env.raw_module), runtime_1.CrochetText).value, pair.projection.project("value", state.env.raw_module));
        }
        return new runtime_1.CrochetRecord(result);
    })
        .defmachine("at-default", [runtime_1.CrochetRecord, runtime_1.CrochetText, runtime_1.CrochetValue], function* (state, r, k, x) {
        if (r.values.has(k.value)) {
            return r.projection.project(k.value, state.env.raw_module);
        }
        else {
            return x;
        }
    })
        .defun1("has-key", (rec0, key0) => {
        const rec = runtime_1.get_map(rec0);
        const key = runtime_1.get_string(key0);
        return runtime_1.from_bool(rec.has(key));
    })
        .defun1("delete-at", (rec0, key0) => {
        const rec = runtime_1.get_map(rec0);
        const key = runtime_1.get_string(key0);
        const result = new Map();
        for (const [k, v] of rec.entries()) {
            if (k !== key) {
                result.set(k, v);
            }
        }
        return new runtime_1.CrochetRecord(result);
    })
        .defun1("at-put", (rec0, key0, value) => {
        const rec = runtime_1.get_map(rec0);
        const key = runtime_1.get_string(key0);
        const result = new Map();
        utils_1.copy_map(rec, result);
        result.set(key, value);
        return new runtime_1.CrochetRecord(result);
    });
}
exports.core_record = core_record;
function core_commands(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:commands").defun("panic", [runtime_1.CrochetText, runtime_1.CrochetText], (tag, text) => {
        throw new runtime_1.ErrArbitrary(tag.value, text.value);
    });
}
exports.core_commands = core_commands;
function core_debug(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.core:debug")
        .defun1("fun-name", (x) => {
        if (x instanceof runtime_1.CrochetPartial) {
            return runtime_1.from_string(x.name);
        }
        else {
            return runtime_1.from_string(x.to_text());
        }
    })
        .defun1("thunk-forced", (x) => {
        const t = runtime_1.get_thunk(x);
        return runtime_1.from_bool(t.is_forced);
    })
        .defun1("type-name", (x) => {
        return runtime_1.from_string(runtime_1.type_name(x));
    })
        .defun1("text-length", (x) => {
        return runtime_1.from_integer(BigInt(runtime_1.get_string(x).length));
    });
}
exports.core_debug = core_debug;
exports.default = [
    core_types,
    core_boolean,
    core_conversion,
    core_interpolation,
    core_text,
    core_integer,
    core_float,
    core_tuple,
    core_cell,
    core_record,
    core_commands,
    core_debug,
];
//# sourceMappingURL=core.js.map

/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.text_ascii = exports.text_core = exports.text_views = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
function text_views(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.text:view")
        .defun("lines", [runtime_1.CrochetText], (x) => {
        return new runtime_1.CrochetTuple(x.value.split(/\r\n|\r|\n/).map((x) => new runtime_1.CrochetText(x)));
    })
        .defun("code-points", [runtime_1.CrochetText], (x) => {
        const points = [];
        for (const point of x.value) {
            points.push(new runtime_1.CrochetInteger(BigInt(point.codePointAt(0))));
        }
        return new runtime_1.CrochetTuple(points);
    })
        .defun("from-code-points", [runtime_1.CrochetTuple], (x) => {
        const points = x.values.map((a) => Number(utils_1.cast(a, runtime_1.CrochetInteger).value));
        const text = String.fromCodePoint(...points);
        return new runtime_1.CrochetText(text);
    });
}
exports.text_views = text_views;
function text_core(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.text:core")
        .defun("ends-with", [runtime_1.CrochetText, runtime_1.CrochetText], (a, b) => runtime_1.from_bool(a.value.endsWith(b.value)))
        .defun("starts-with", [runtime_1.CrochetText, runtime_1.CrochetText], (a, b) => runtime_1.from_bool(a.value.startsWith(b.value)))
        .defun("contains", [runtime_1.CrochetText, runtime_1.CrochetText], (a, b) => runtime_1.from_bool(a.value.includes(b.value)))
        .defun("trim-start", [runtime_1.CrochetText], (x) => new runtime_1.CrochetText(x.value.trimStart()))
        .defun("trim-end", [runtime_1.CrochetText], (x) => new runtime_1.CrochetText(x.value.trimEnd()))
        .defun("trim", [runtime_1.CrochetText], (x) => new runtime_1.CrochetText(x.value.trim()))
        .defun("is-empty", [runtime_1.CrochetText], (x) => runtime_1.from_bool(x.value.length === 0))
        .defun("repeat", [runtime_1.CrochetText, runtime_1.CrochetInteger], (x, i) => {
        return new runtime_1.CrochetText(x.value.repeat(Number(i.value)));
    });
}
exports.text_core = text_core;
function text_ascii(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.text:ascii")
        .defun("to-upper", [runtime_1.CrochetText], (x) => new runtime_1.CrochetText(x.value.toUpperCase()))
        .defun("to-lower", [runtime_1.CrochetText], (x) => new runtime_1.CrochetText(x.value.toLowerCase()))
        .defun("is-ascii", [runtime_1.CrochetText], (a) => {
        for (const x of a.value) {
            if ((x.codePointAt(0) ?? 0) >= 128) {
                return runtime_1.False.instance;
            }
        }
        return runtime_1.True.instance;
    });
}
exports.text_ascii = text_ascii;
exports.default = [text_views, text_core, text_ascii];
//# sourceMappingURL=text.js.map

/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(82), exports);
__exportStar(__webpack_require__(83), exports);
const ffi_1 = __webpack_require__(84);
exports.default = ffi_1.default;
//# sourceMappingURL=index.js.map

/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetMenu = exports.TCrochetMenu = exports.CrochetHtml = exports.TCrochetHtml = void 0;
const runtime_1 = __webpack_require__(7);
class TCrochetHtml extends runtime_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = runtime_1.TCrochetAny.type;
        this.type_name = "html-element";
    }
}
exports.TCrochetHtml = TCrochetHtml;
TCrochetHtml.type = new TCrochetHtml();
class CrochetHtml extends runtime_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
    }
    get type() {
        return TCrochetHtml.type;
    }
    equals(other) {
        return other === this;
    }
    to_text(transparent) {
        return "<html-element>";
    }
}
exports.CrochetHtml = CrochetHtml;
class TCrochetMenu extends runtime_1.CrochetType {
    constructor() {
        super(...arguments);
        this.parent = TCrochetHtml.type;
        this.type_name = "html-menu";
    }
}
exports.TCrochetMenu = TCrochetMenu;
TCrochetMenu.type = new TCrochetMenu();
class CrochetMenu extends CrochetHtml {
    constructor(value, selected) {
        super(value);
        this.value = value;
        this.selected = selected;
    }
    get type() {
        return TCrochetMenu.type;
    }
    equals(other) {
        return other === this;
    }
    to_text(transparent) {
        return "<html-menu>";
    }
}
exports.CrochetMenu = CrochetMenu;
//# sourceMappingURL=element.js.map

/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.canvas = exports.Canvas = exports.Rect = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
class Rect {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    static from_element_offset(x) {
        return new Rect(x.offsetLeft, x.offsetTop, x.offsetWidth, x.offsetHeight);
    }
    get bottom() {
        return this.top + this.height;
    }
    get right() {
        return this.left + this.width;
    }
}
exports.Rect = Rect;
class Canvas {
    constructor() {
        this.mark = null;
    }
    get canvas() {
        if (this._canvas == null) {
            throw runtime_1.die(`HTML canvas has not been initialised`);
        }
        return this._canvas;
    }
    measure(x) {
        const old_visibility = x.style.visibility;
        const old_animation = x.style.animation;
        x.style.visibility = "hidden";
        x.style.animation = "none";
        this.canvas.appendChild(x);
        const dimensions = Rect.from_element_offset(x);
        this.canvas.removeChild(x);
        x.style.animation = old_animation;
        x.style.visibility = old_visibility;
        return dimensions;
    }
    is_interactive(x) {
        if (x.getAttribute("data-interactive") === "true") {
            return true;
        }
        const children = Array.from(x.children);
        if (children.length === 0) {
            return false;
        }
        else {
            return children.some((x) => x instanceof HTMLElement && this.is_interactive(x));
        }
    }
    async wait_mark(x) {
        if (this.mark == null) {
            this.mark = x;
            return;
        }
        const dimensions = this.measure(x);
        if (dimensions.bottom - this.mark.offsetTop > this.canvas.clientHeight) {
            await this.click_to_continue(x);
        }
        if (this.is_interactive(x)) {
            this.mark = null;
        }
    }
    async animate(x, frames, time) {
        const deferred = utils_1.defer();
        const animation = x.animate(frames, time);
        animation.addEventListener("finish", () => deferred.resolve());
        animation.addEventListener("cancel", () => deferred.resolve());
        await deferred.promise;
    }
    async animate_appear(x, time) {
        x.style.opacity = "0";
        x.style.top = "-1em";
        x.style.position = "relative";
        const appear = [
            { opacity: 0, top: "-1em" },
            { opacity: 1, top: "0px" },
        ];
        await this.animate(x, appear, time);
        x.style.opacity = "1";
        x.style.top = "0px";
        x.style.position = "relative";
    }
    async click_to_continue(x) {
        const deferred = utils_1.defer();
        this.canvas.setAttribute("data-wait", "true");
        this.canvas.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            this.canvas.removeAttribute("data-wait");
            if (x != null) {
                this.mark = x;
            }
            else {
                const children = this.canvas.children;
                this.mark = children.item(children.length - 1) ?? null;
            }
            deferred.resolve();
        });
        return deferred.promise;
    }
    async show(x) {
        await this.wait_mark(x);
        x.style.opacity = "0";
        this.canvas.appendChild(x);
        x.scrollIntoView();
        await this.animate_appear(x, 200);
    }
    async show_error(error) {
        console.error(error);
        const element = document.createElement("div");
        element.className = "crochet-error";
        element.appendChild(document.createTextNode(error));
        this.canvas.appendChild(element);
    }
    set_mark(x) {
        if (x == null) {
            this.mark =
                this.canvas.children.item(this.canvas.children.length - 1) ?? null;
        }
        else {
            this.mark = x;
        }
    }
    is_empty() {
        return this.canvas.childElementCount === 0;
    }
    render_to(x) {
        this._canvas = x;
    }
}
exports.Canvas = Canvas;
exports.canvas = new Canvas();
//# sourceMappingURL=canvas.js.map

/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.html_ffi = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
const canvas_1 = __webpack_require__(83);
const element_1 = __webpack_require__(82);
function html_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.ui.html:html")
        .deftype("element", element_1.TCrochetHtml.type)
        .deftype("menu", element_1.TCrochetMenu.type)
        .defmachine("show", [element_1.CrochetHtml], function* (_, html) {
        yield runtime_1._await(canvas_1.canvas.show(html.value));
        return runtime_1.ValuePattern;
    })
        .defmachine("wait", [], function* (_) {
        yield runtime_1._await(canvas_1.canvas.click_to_continue());
        return runtime_1.CrochetNothing.instance;
    })
        .defun("mark", [], () => {
        if (!canvas_1.canvas.is_empty()) {
            canvas_1.canvas.set_mark();
        }
        return runtime_1.CrochetNothing.instance;
    })
        .defun("box", [runtime_1.CrochetText, runtime_1.CrochetText, runtime_1.CrochetRecord, runtime_1.CrochetTuple], (name, klass, attributes, children) => {
        const element = document.createElement(name.value);
        element.setAttribute("class", "crochet-box " + klass.value);
        for (const child of children.values) {
            element.appendChild(utils_1.cast(child, element_1.CrochetHtml).value);
        }
        for (const [key, value] of attributes.values.entries()) {
            element.setAttribute(key, utils_1.cast(value, runtime_1.CrochetText).value);
        }
        return new element_1.CrochetHtml(element);
    })
        .defun("text", [runtime_1.CrochetText], (text0) => {
        const text = document.createTextNode(text0.value);
        const el = document.createElement("span");
        el.className = "crochet-text-span";
        el.appendChild(text);
        return new element_1.CrochetHtml(el);
    })
        .defun("menu", [runtime_1.CrochetText, runtime_1.CrochetTuple], (klass, items) => {
        const selection = utils_1.defer();
        const menu = document.createElement("div");
        menu.setAttribute("data-interactive", "true");
        menu.className = "crochet-box " + klass.value;
        for (const child of items.values) {
            const record = utils_1.cast(child, runtime_1.CrochetRecord);
            const title = utils_1.cast(record.projection.project("Title", null), element_1.CrochetHtml);
            const value = record.projection.project("Value", null);
            menu.appendChild(title.value);
            title.value.addEventListener("click", (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                title.value.setAttribute("data-selected", "true");
                menu.setAttribute("data-selected", "true");
                selection.resolve(value);
            }, { once: true });
        }
        return new element_1.CrochetMenu(menu, selection.promise);
    })
        .defmachine("menu-selected", [element_1.CrochetMenu], function* (_, menu) {
        return yield runtime_1._await(menu.selected);
    })
        .defmachine("preload", [runtime_1.CrochetText], function* (_, url) {
        const deferred = utils_1.defer();
        const image = new Image();
        image.onload = () => deferred.resolve(runtime_1.True.instance);
        image.onerror = () => deferred.reject(new Error(`Failed to load image ${url.value}`));
        image.src = url.value;
        const result = runtime_1.cvalue(yield runtime_1._await(deferred.promise));
        return result;
    })
        .defmachine("animate", [element_1.CrochetHtml, runtime_1.CrochetInteger], function* (_, element, time0) {
        const time = Number(time0.value);
        for (const child of Array.from(element.value.children)) {
            child.style.opacity = "1";
            yield runtime_1._await(utils_1.delay(time));
        }
        return element;
    })
        .defun("make-animation", [runtime_1.CrochetTuple], (children1) => {
        const element = document.createElement("div");
        const children = children1.values.map((x) => utils_1.cast(x, element_1.CrochetHtml).value);
        element.className = "crochet-animation";
        for (const child of children) {
            element.appendChild(child);
        }
        children[0].style.opacity = "1";
        let last_width = 0;
        let last_height = 0;
        const interval = setInterval(() => {
            if (element.parentNode == null) {
                return runtime_1.CrochetNothing.instance;
            }
            const width = Math.max(...children.map((x) => x.offsetWidth));
            const height = Math.max(...children.map((x) => x.offsetHeight));
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
            if (width == last_width && height == last_height) {
                clearInterval(interval);
            }
            else {
                last_width = width;
                last_height = height;
            }
        }, 250);
        return new element_1.CrochetHtml(element);
    });
}
exports.html_ffi = html_ffi;
exports.default = [html_ffi];
//# sourceMappingURL=ffi.js.map

/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.float_ffi = void 0;
const runtime_1 = __webpack_require__(7);
const ffi_def_1 = __webpack_require__(77);
function float_ffi(ffi) {
    const pi = new runtime_1.CrochetFloat(Math.PI);
    const e = new runtime_1.CrochetFloat(Math.E);
    new ffi_def_1.ForeignNamespace(ffi, "crochet.mathematics:float")
        .defun("pi", [], () => pi)
        .defun("e", [], () => e)
        .defun("sin", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.sin(x.value)))
        .defun("sinh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.sinh(x.value)))
        .defun("asin", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.asin(x.value)))
        .defun("asinh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.asinh(x.value)))
        .defun("cos", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.cos(x.value)))
        .defun("cosh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.cosh(x.value)))
        .defun("acos", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.acos(x.value)))
        .defun("acosh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.acosh(x.value)))
        .defun("tan", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.tan(x.value)))
        .defun("atan", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.atan(x.value)))
        .defun("atan2", [runtime_1.CrochetFloat, runtime_1.CrochetFloat], (x, y) => new runtime_1.CrochetFloat(Math.atan2(x.value, y.value)))
        .defun("atanh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.atanh(x.value)))
        .defun("tanh", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.tanh(x.value)))
        .defun("cbrt", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.cbrt(x.value)))
        .defun("sqrt", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.sqrt(x.value)))
        .defun("clz32", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.clz32(x.value)))
        .defun("exp", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.exp(x.value)))
        .defun("log", [runtime_1.CrochetFloat], (x) => new runtime_1.CrochetFloat(Math.log(x.value)));
}
exports.float_ffi = float_ffi;
exports.default = [float_ffi];
//# sourceMappingURL=mathematics.js.map

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = [];
//# sourceMappingURL=collections.js.map

/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.random_xorshift = void 0;
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
function random_xorshift(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.random:xorshift")
        .defun("random-seed", [], () => {
        const rand = utils_1.XorShift.new_random();
        return new runtime_1.CrochetRecord(new Map([
            ["seed", new runtime_1.CrochetInteger(BigInt(rand.seed))],
            ["inc", new runtime_1.CrochetInteger(BigInt(rand.inc))],
        ]));
    })
        .defun("next-uniform", [runtime_1.CrochetInteger, runtime_1.CrochetInteger], (seed, inc) => {
        const rand = new utils_1.XorShift(Number(seed.value) | 0, Number(inc.value) | 0);
        const value = rand.random();
        return new runtime_1.CrochetRecord(new Map([
            ["value", new runtime_1.CrochetFloat(value)],
            ["seed", new runtime_1.CrochetInteger(BigInt(rand.seed))],
            ["inc", new runtime_1.CrochetInteger(BigInt(rand.inc))],
        ]));
    })
        .defun("next-integer", [runtime_1.CrochetInteger, runtime_1.CrochetInteger, runtime_1.CrochetInteger, runtime_1.CrochetInteger], (seed, inc, min, max) => {
        const rand = new utils_1.XorShift(Number(seed.value) | 0, Number(inc.value) | 0);
        const value = rand.random_integer(Number(min.value), Number(max.value));
        return new runtime_1.CrochetRecord(new Map([
            ["value", new runtime_1.CrochetInteger(BigInt(value))],
            ["seed", new runtime_1.CrochetInteger(BigInt(rand.seed))],
            ["inc", new runtime_1.CrochetInteger(BigInt(rand.inc))],
        ]));
    });
}
exports.random_xorshift = random_xorshift;
exports.default = [random_xorshift];
//# sourceMappingURL=random.js.map

/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.json_ffi = void 0;
const runtime_1 = __webpack_require__(7);
const ffi_def_1 = __webpack_require__(77);
function json_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.language.json:json")
        .defun("parse", [runtime_1.CrochetText, runtime_1.CrochetValue], (text) => {
        return runtime_1.json_to_crochet(JSON.parse(text.value));
    })
        .defun("serialise", [runtime_1.CrochetValue], (value) => {
        return new runtime_1.CrochetText(JSON.stringify(value.to_json()));
    })
        .defun("pretty-print", [runtime_1.CrochetValue, runtime_1.CrochetInteger], (value, indent) => {
        return new runtime_1.CrochetText(JSON.stringify(value.to_json(), null, Number(indent.value)));
    });
}
exports.json_ffi = json_ffi;
exports.default = [json_ffi];
//# sourceMappingURL=json.js.map

/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lingua_ffi = void 0;
const Ohm = __webpack_require__(90);
const runtime_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(33);
const ffi_def_1 = __webpack_require__(77);
const OhmUtil = __webpack_require__(105);
function to_array(x) {
    if (x instanceof runtime_1.CrochetTuple) {
        return x.values;
    }
    else if (Array.isArray(x)) {
        return x;
    }
    else {
        throw new runtime_1.ErrArbitrary("invalid-type", `Expected native array or tuple, got ${runtime_1.type_name(x)}`);
    }
}
const builtin_visitor = {
    _terminal() {
        return new runtime_1.CrochetText(this.primitiveValue);
    },
    _iter(children) {
        if (this._node.isOptional()) {
            if (this.numChildren === 0) {
                return runtime_1.CrochetNothing.instance;
            }
            else {
                return children[0].visit();
            }
        }
        return new runtime_1.CrochetTuple(children.map((x) => x.visit()));
    },
    nonemptyListOf(first, _, rest) {
        return new runtime_1.CrochetTuple([first.visit(), ...to_array(rest.visit())]);
    },
    emptyListOf() {
        return new runtime_1.CrochetTuple([]);
    },
    NonemptyListOf(first, _, rest) {
        return new runtime_1.CrochetTuple([first.visit(), ...to_array(rest.visit())]);
    },
    EmptyListOf() {
        return new runtime_1.CrochetTuple([]);
    },
};
function to_visitor(visitor0) {
    const visitor = Object.create(null);
    for (const [k, v] of Object.entries(builtin_visitor)) {
        visitor[k] = v;
    }
    for (const [k, v] of visitor0.values) {
        visitor[k] = utils_1.cast(v, runtime_1.CrochetUnknown).value;
    }
    return visitor;
}
function lingua_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.text.parsing.lingua:lingua")
        .defun("make-grammar", [runtime_1.CrochetText], (text) => {
        const grammar = Ohm.grammar(text.value);
        return new runtime_1.CrochetUnknown(grammar);
    })
        .defun("parse", [runtime_1.CrochetUnknown, runtime_1.CrochetText, runtime_1.CrochetText], (grammar0, input, rule) => {
        const grammar = grammar0.value;
        // We don't care about checking the semantic actions here
        grammar._checkTopDownActionDict = () => { };
        const match = grammar.match(input.value, rule.value);
        return new runtime_1.CrochetUnknown(match);
    })
        .defun("succeeded", [runtime_1.CrochetUnknown], (match0) => {
        const match = match0.value;
        return runtime_1.from_bool(match.succeeded());
    })
        .defun("error-message", [runtime_1.CrochetUnknown], (match0) => {
        const match = match0.value;
        if (match.message == null) {
            throw new runtime_1.ErrArbitrary("invalid-type", `Not a failed parse tree`);
        }
        return new runtime_1.CrochetText(match.message);
    })
        .defun("make-semantics", [runtime_1.CrochetUnknown, runtime_1.CrochetRecord], (grammar0, visitor) => {
        const grammar = grammar0.value;
        const semantics = grammar.createSemantics();
        semantics.addOperation("visit", to_visitor(visitor));
        return new runtime_1.CrochetUnknown(semantics);
    })
        .defun("apply-semantics", [runtime_1.CrochetUnknown, runtime_1.CrochetUnknown], (semantics0, parse_tree0) => {
        const semantics = semantics0.value;
        const parse_tree = parse_tree0.value;
        return runtime_1.cvalue(semantics(parse_tree).visit());
    })
        .defun("visitor-identity", [], () => {
        return new runtime_1.CrochetUnknown(function (x) {
            return x.visit();
        });
    })
        .defun("visitor-source", [], () => {
        return new runtime_1.CrochetUnknown(function () {
            return new runtime_1.CrochetText(this.sourceString);
        });
    })
        .defun("visitor-singleton", [], () => {
        return new runtime_1.CrochetUnknown(function () {
            return this.children[0].visit();
        });
    })
        .defmachine("visitor-lambda", [runtime_1.CrochetValue], function* (state, lambda) {
        return new runtime_1.CrochetUnknown(function (...args) {
            const machine = runtime_1.apply(state, lambda, [
                new runtime_1.CrochetUnknown(this),
                ...args.map((x) => x.visit()),
            ]);
            const value = runtime_1.Thread.for_machine(machine).run_sync();
            return runtime_1.cvalue(value);
        });
    })
        .defun("interval", [runtime_1.CrochetUnknown], (node0) => {
        const node = node0.value;
        return new runtime_1.CrochetUnknown(node.source);
    })
        .defun("interval-position", [runtime_1.CrochetUnknown], (interval0) => {
        const interval = interval0.value;
        const { lineNum, colNum } = OhmUtil.getLineAndColumn(interval.sourceString, interval.startIdx);
        return new runtime_1.CrochetRecord(new Map([
            ["line", new runtime_1.CrochetInteger(BigInt(lineNum))],
            ["column", new runtime_1.CrochetInteger(BigInt(colNum))],
        ]));
    })
        .defun("interval-range", [runtime_1.CrochetUnknown], (interval0) => {
        const interval = interval0.value;
        return new runtime_1.CrochetRecord(new Map([
            ["start", new runtime_1.CrochetInteger(BigInt(interval.startIdx))],
            ["stop", new runtime_1.CrochetInteger(BigInt(interval.endIdx))],
        ]));
    })
        .defun("interval-source", [runtime_1.CrochetUnknown], (interval0) => {
        const interval = interval0.value;
        return new runtime_1.CrochetText(interval.contents);
    })
        .defun("interval-annotated-source", [runtime_1.CrochetUnknown], (interval0) => {
        const interval = interval0.value;
        return new runtime_1.CrochetText(interval.getLineAndColumnMessage());
    });
}
exports.lingua_ffi = lingua_ffi;
exports.default = [lingua_ffi];
//# sourceMappingURL=lingua.js.map

/***/ }),
/* 90 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* global document, XMLHttpRequest */



// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Builder = __webpack_require__(91);
const Grammar = __webpack_require__(93);
const Namespace = __webpack_require__(104);
const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);
const util = __webpack_require__(105);
const version = __webpack_require__(129);

const isBuffer = __webpack_require__(131);

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
  extras: __webpack_require__(132),
  version
};

// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };

// Late initialization for stuff that is bootstrapped.

Grammar.BuiltInRules = __webpack_require__(135);
util.announceBuiltInRules(Grammar.BuiltInRules);

module.exports.ohmGrammar = ohmGrammar = __webpack_require__(136);
Grammar.initApplicationParser(ohmGrammar, buildGrammar);


/***/ }),
/* 91 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const GrammarDecl = __webpack_require__(92);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 92 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Grammar = __webpack_require__(93);
const InputStream = __webpack_require__(124);
const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 93 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const CaseInsensitiveTerminal = __webpack_require__(94);
const Matcher = __webpack_require__(122);
const Semantics = __webpack_require__(127);
const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 94 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Failure = __webpack_require__(95);
const TerminalNode = __webpack_require__(96).TerminalNode;
const assert = __webpack_require__(97).assert;
const {PExpr, Terminal} = __webpack_require__(99);

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


/***/ }),
/* 95 */
/***/ ((module) => {

"use strict";


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


/***/ }),
/* 96 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const common = __webpack_require__(97);

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
    return this.numChildren() > 1;
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


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const extend = __webpack_require__(98);

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


/***/ }),
/* 98 */
/***/ ((module) => {

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


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const UnicodeCategories = __webpack_require__(100);
const common = __webpack_require__(97);

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

__webpack_require__(101);
__webpack_require__(102);
__webpack_require__(106);
__webpack_require__(107);
__webpack_require__(108);
__webpack_require__(109);
__webpack_require__(112);
__webpack_require__(113);
__webpack_require__(114);
__webpack_require__(115);
__webpack_require__(116);
__webpack_require__(117);
__webpack_require__(118);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(121);


/***/ }),
/* 100 */
/***/ ((module) => {

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


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);
const util = __webpack_require__(105);

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


/***/ }),
/* 103 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const pexprs = __webpack_require__(99);

const Namespace = __webpack_require__(104);

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


/***/ }),
/* 104 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const extend = __webpack_require__(98);

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


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);

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
    lineNum,
    colNum,
    line,
    prevLine,
    nextLine
  };
};

// Return a nicely-formatted string describing the line and column for the
// given offset in `str`.
exports.getLineAndColumnMessage = function(str, offset /* ...ranges */) {
  const repeatStr = common.repeatStr;

  const lineAndCol = exports.getLineAndColumn(str, offset);
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
  const ranges = Array.prototype.slice.call(arguments, 2);
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

exports.uniqueId = (() => {
  let idCounter = 0;
  return prefix => '' + prefix + idCounter++;
})();


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const nodes = __webpack_require__(96);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Trace = __webpack_require__(110);
const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const nodes = __webpack_require__(96);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 110 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Interval = __webpack_require__(111);
const common = __webpack_require__(97);

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


/***/ }),
/* 111 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const assert = __webpack_require__(97).assert;
const errors = __webpack_require__(103);
const util = __webpack_require__(105);

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



/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Failure = __webpack_require__(95);
const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 122 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const MatchState = __webpack_require__(123);

const pexprs = __webpack_require__(99);

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


/***/ }),
/* 123 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const InputStream = __webpack_require__(124);
const MatchResult = __webpack_require__(125);
const PosInfo = __webpack_require__(126);
const Trace = __webpack_require__(110);
const pexprs = __webpack_require__(99);

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


/***/ }),
/* 124 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Interval = __webpack_require__(111);

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


/***/ }),
/* 125 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = __webpack_require__(97);
const util = __webpack_require__(105);
const Interval = __webpack_require__(111);

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


/***/ }),
/* 126 */
/***/ ((module) => {

"use strict";


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


/***/ }),
/* 127 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const InputStream = __webpack_require__(124);
const IterationNode = __webpack_require__(96).IterationNode;
const MatchResult = __webpack_require__(125);
const common = __webpack_require__(97);
const errors = __webpack_require__(103);
const util = __webpack_require__(105);

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
  const operationsAndAttributesGrammar = __webpack_require__(128);
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


/***/ }),
/* 128 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ohm = __webpack_require__(90);
module.exports = ohm.makeRecipe(["grammar",{"source":"OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"},"OperationsAndAttributes",null,"AttributeSignature",{"AttributeSignature":["define",{"sourceInterval":[29,58]},null,[],["app",{"sourceInterval":[54,58]},"name",[]]],"OperationSignature":["define",{"sourceInterval":[62,100]},null,[],["seq",{"sourceInterval":[87,100]},["app",{"sourceInterval":[87,91]},"name",[]],["opt",{"sourceInterval":[92,100]},["app",{"sourceInterval":[92,99]},"Formals",[]]]]],"Formals":["define",{"sourceInterval":[104,143]},null,[],["seq",{"sourceInterval":[118,143]},["terminal",{"sourceInterval":[118,121]},"("],["app",{"sourceInterval":[122,139]},"ListOf",[["app",{"sourceInterval":[129,133]},"name",[]],["terminal",{"sourceInterval":[135,138]},","]]],["terminal",{"sourceInterval":[140,143]},")"]]],"name":["define",{"sourceInterval":[147,187]},"a name",[],["seq",{"sourceInterval":[168,187]},["app",{"sourceInterval":[168,177]},"nameFirst",[]],["star",{"sourceInterval":[178,187]},["app",{"sourceInterval":[178,186]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[191,223]},null,[],["alt",{"sourceInterval":[207,223]},["terminal",{"sourceInterval":[207,210]},"_"],["app",{"sourceInterval":[217,223]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[227,257]},null,[],["alt",{"sourceInterval":[242,257]},["terminal",{"sourceInterval":[242,245]},"_"],["app",{"sourceInterval":[252,257]},"alnum",[]]]]}]);


/***/ }),
/* 129 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* global __GLOBAL_OHM_VERSION__ */



// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see webpack.config.js).
module.exports = typeof __GLOBAL_OHM_VERSION__ === 'string'
    ? __GLOBAL_OHM_VERSION__
    : __webpack_require__(130).version;


/***/ }),
/* 130 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"ohm-js","version":"15.3.0","description":"An object-oriented language for parsing and pattern matching","repository":"https://github.com/harc/ohm","keywords":["parser","compiler","pattern matching","pattern-matching","ometa","ometa/js","ometa-js","ometajs","rapid","prototyping"],"homepage":"https://ohmlang.github.io/","bugs":"https://github.com/harc/ohm/issues","main":"src/main.js","bin":"src/ohm-cmd.js","types":"index.d.ts","scripts":{"prebootstrap":"bash bin/prebootstrap","bootstrap":"bash bin/bootstrap --test || (echo \'Bootstrap failed.\' && mv -v dist/ohm-grammar.js.old dist/ohm-grammar.js && mv -v dist/built-in-rules.js.old dist/built-in-rules.js && mv -v dist/operations-and-attributes.js.old dist/operations-and-attributes.js)","build":"yarn build-debug && webpack --mode=production","prebuild-debug":"bash ../bin/update-env.sh","build-debug":"webpack --mode=development","clean":"rm -f dist/ohm.js dist/ohm.min.js","lint":"eslint . --ignore-path ../.eslintignore","pretest":"bash ../bin/update-env.sh","test":"(tape \'test/**/*.js\' | tap-spec) && ts-node test/test-typings.ts","test-watch":"bash bin/test-watch","postinstall":"node bin/dev-setup.js","pre-commit":"yarn run lint && yarn run build && yarn run test","unsafe-bootstrap":"bash bin/bootstrap","version-package":"bash bin/version","watch":"webpack --mode=development --watch"},"license":"MIT","author":"Alex Warth <alexwarth@gmail.com> (http://tinlizzie.org/~awarth)","contributors":[],"dependencies":{"is-buffer":"^2.0.4","util-extend":"^1.0.3"},"devDependencies":{"@types/tape":"^4.13.0","eslint":"^7.9.0","eslint-config-google":"^0.14.0","eslint-plugin-camelcase-ohm":"^0.2.1","eslint-plugin-no-extension-in-require":"^0.2.0","eslint-plugin-tape":"^1.1.0","husky":"^4.2.5","jsdom":"^9.9.1","json":"^9.0.6","markscript":"^0.5.0","node-static":"^0.7.11","nodemon":"^2.0.4","ohm-grammar-ecmascript":"^0.5.0","tap-spec":"^5.0.0","tape":"^5.0.1","tape-catch":"^1.0.6","ts-loader":"^8.0.4","ts-node":"^9.0.0","typescript":"^4.0.3","walk-sync":"^2.2.0","webpack":"^4.44.2","webpack-cli":"^3.3.12"},"engines":{"node":">=0.12.1"}}');

/***/ }),
/* 131 */
/***/ ((module) => {

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


/***/ }),
/* 132 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = {
  VisitorFamily: __webpack_require__(133),
  semanticsForToAST: __webpack_require__(134).semantics,
  toAST: __webpack_require__(134).helper
};


/***/ }),
/* 133 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const assert = __webpack_require__(97).assert;

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


/***/ }),
/* 134 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const pexprs = __webpack_require__(99);
const MatchResult = __webpack_require__(125);
const Grammar = __webpack_require__(93);
const extend = __webpack_require__(98);

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


/***/ }),
/* 135 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ohm = __webpack_require__(90);
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{"sourceInterval":[297,301]},0],["param",{"sourceInterval":[303,306]},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{"sourceInterval":[326,330]},0],["param",{"sourceInterval":[332,335]},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{"sourceInterval":[372,376]},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{"sourceInterval":[378,381]},1],["param",{"sourceInterval":[382,386]},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{"sourceInterval":[477,481]},0],["param",{"sourceInterval":[483,486]},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{"sourceInterval":[506,510]},0],["param",{"sourceInterval":[512,515]},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{"sourceInterval":[552,556]},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{"sourceInterval":[558,561]},1],["param",{"sourceInterval":[562,566]},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);


/***/ }),
/* 136 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ohm = __webpack_require__(90);
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" OverrideRuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  OverrideRuleBody\n    = \"|\"? NonemptyListOf<OverrideTopLevelTerm, \"|\">\n\n  OverrideTopLevelTerm\n    = \"...\"  -- superSplice\n    | TopLevelTerm\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,248]},null,[],["seq",{"sourceInterval":[188,235]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,235]},"OverrideRuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[255,305]},null,[],["seq",{"sourceInterval":[255,294]},["app",{"sourceInterval":[255,260]},"ident",[]],["opt",{"sourceInterval":[261,269]},["app",{"sourceInterval":[261,268]},"Formals",[]]],["terminal",{"sourceInterval":[281,285]},"+="],["app",{"sourceInterval":[286,294]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,305]},null,[],["alt",{"sourceInterval":[131,305]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,235]},"Rule_override",[]],["app",{"sourceInterval":[255,294]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[309,362]},null,[],["seq",{"sourceInterval":[324,362]},["opt",{"sourceInterval":[324,328]},["terminal",{"sourceInterval":[324,327]},"|"]],["app",{"sourceInterval":[329,362]},"NonemptyListOf",[["app",{"sourceInterval":[344,356]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[358,361]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[385,408]},null,[],["seq",{"sourceInterval":[385,397]},["app",{"sourceInterval":[385,388]},"Seq",[]],["app",{"sourceInterval":[389,397]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[366,418]},null,[],["alt",{"sourceInterval":[385,418]},["app",{"sourceInterval":[385,397]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[415,418]},"Seq",[]]]],"OverrideRuleBody":["define",{"sourceInterval":[422,491]},null,[],["seq",{"sourceInterval":[445,491]},["opt",{"sourceInterval":[445,449]},["terminal",{"sourceInterval":[445,448]},"|"]],["app",{"sourceInterval":[450,491]},"NonemptyListOf",[["app",{"sourceInterval":[465,485]},"OverrideTopLevelTerm",[]],["terminal",{"sourceInterval":[487,490]},"|"]]]]],"OverrideTopLevelTerm_superSplice":["define",{"sourceInterval":[522,543]},null,[],["terminal",{"sourceInterval":[522,527]},"..."]],"OverrideTopLevelTerm":["define",{"sourceInterval":[495,562]},null,[],["alt",{"sourceInterval":[522,562]},["app",{"sourceInterval":[522,527]},"OverrideTopLevelTerm_superSplice",[]],["app",{"sourceInterval":[550,562]},"TopLevelTerm",[]]]],"Formals":["define",{"sourceInterval":[566,606]},null,[],["seq",{"sourceInterval":[580,606]},["terminal",{"sourceInterval":[580,583]},"<"],["app",{"sourceInterval":[584,602]},"ListOf",[["app",{"sourceInterval":[591,596]},"ident",[]],["terminal",{"sourceInterval":[598,601]},","]]],["terminal",{"sourceInterval":[603,606]},">"]]],"Params":["define",{"sourceInterval":[610,647]},null,[],["seq",{"sourceInterval":[623,647]},["terminal",{"sourceInterval":[623,626]},"<"],["app",{"sourceInterval":[627,643]},"ListOf",[["app",{"sourceInterval":[634,637]},"Seq",[]],["terminal",{"sourceInterval":[639,642]},","]]],["terminal",{"sourceInterval":[644,647]},">"]]],"Alt":["define",{"sourceInterval":[651,685]},null,[],["app",{"sourceInterval":[661,685]},"NonemptyListOf",[["app",{"sourceInterval":[676,679]},"Seq",[]],["terminal",{"sourceInterval":[681,684]},"|"]]]],"Seq":["define",{"sourceInterval":[689,704]},null,[],["star",{"sourceInterval":[699,704]},["app",{"sourceInterval":[699,703]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[719,736]},null,[],["seq",{"sourceInterval":[719,727]},["app",{"sourceInterval":[719,723]},"Pred",[]],["terminal",{"sourceInterval":[724,727]},"*"]]],"Iter_plus":["define",{"sourceInterval":[743,760]},null,[],["seq",{"sourceInterval":[743,751]},["app",{"sourceInterval":[743,747]},"Pred",[]],["terminal",{"sourceInterval":[748,751]},"+"]]],"Iter_opt":["define",{"sourceInterval":[767,783]},null,[],["seq",{"sourceInterval":[767,775]},["app",{"sourceInterval":[767,771]},"Pred",[]],["terminal",{"sourceInterval":[772,775]},"?"]]],"Iter":["define",{"sourceInterval":[708,794]},null,[],["alt",{"sourceInterval":[719,794]},["app",{"sourceInterval":[719,727]},"Iter_star",[]],["app",{"sourceInterval":[743,751]},"Iter_plus",[]],["app",{"sourceInterval":[767,775]},"Iter_opt",[]],["app",{"sourceInterval":[790,794]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[809,824]},null,[],["seq",{"sourceInterval":[809,816]},["terminal",{"sourceInterval":[809,812]},"~"],["app",{"sourceInterval":[813,816]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[831,852]},null,[],["seq",{"sourceInterval":[831,838]},["terminal",{"sourceInterval":[831,834]},"&"],["app",{"sourceInterval":[835,838]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[798,862]},null,[],["alt",{"sourceInterval":[809,862]},["app",{"sourceInterval":[809,816]},"Pred_not",[]],["app",{"sourceInterval":[831,838]},"Pred_lookahead",[]],["app",{"sourceInterval":[859,862]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[876,892]},null,[],["seq",{"sourceInterval":[876,884]},["terminal",{"sourceInterval":[876,879]},"#"],["app",{"sourceInterval":[880,884]},"Base",[]]]],"Lex":["define",{"sourceInterval":[866,903]},null,[],["alt",{"sourceInterval":[876,903]},["app",{"sourceInterval":[876,884]},"Lex_lex",[]],["app",{"sourceInterval":[899,903]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[918,979]},null,[],["seq",{"sourceInterval":[918,963]},["app",{"sourceInterval":[918,923]},"ident",[]],["opt",{"sourceInterval":[924,931]},["app",{"sourceInterval":[924,930]},"Params",[]]],["not",{"sourceInterval":[932,963]},["alt",{"sourceInterval":[934,962]},["seq",{"sourceInterval":[934,948]},["opt",{"sourceInterval":[934,944]},["app",{"sourceInterval":[934,943]},"ruleDescr",[]]],["terminal",{"sourceInterval":[945,948]},"="]],["terminal",{"sourceInterval":[951,955]},":="],["terminal",{"sourceInterval":[958,962]},"+="]]]]],"Base_range":["define",{"sourceInterval":[986,1041]},null,[],["seq",{"sourceInterval":[986,1022]},["app",{"sourceInterval":[986,1001]},"oneCharTerminal",[]],["terminal",{"sourceInterval":[1002,1006]},".."],["app",{"sourceInterval":[1007,1022]},"oneCharTerminal",[]]]],"Base_terminal":["define",{"sourceInterval":[1048,1106]},null,[],["app",{"sourceInterval":[1048,1056]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[1113,1168]},null,[],["seq",{"sourceInterval":[1113,1124]},["terminal",{"sourceInterval":[1113,1116]},"("],["app",{"sourceInterval":[1117,1120]},"Alt",[]],["terminal",{"sourceInterval":[1121,1124]},")"]]],"Base":["define",{"sourceInterval":[907,1168]},null,[],["alt",{"sourceInterval":[918,1168]},["app",{"sourceInterval":[918,963]},"Base_application",[]],["app",{"sourceInterval":[986,1022]},"Base_range",[]],["app",{"sourceInterval":[1048,1056]},"Base_terminal",[]],["app",{"sourceInterval":[1113,1124]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1172,1231]},"a rule description",[],["seq",{"sourceInterval":[1210,1231]},["terminal",{"sourceInterval":[1210,1213]},"("],["app",{"sourceInterval":[1214,1227]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1228,1231]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1235,1266]},null,[],["star",{"sourceInterval":[1255,1266]},["seq",{"sourceInterval":[1256,1264]},["not",{"sourceInterval":[1256,1260]},["terminal",{"sourceInterval":[1257,1260]},")"]],["app",{"sourceInterval":[1261,1264]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1270,1338]},null,[],["seq",{"sourceInterval":[1285,1338]},["terminal",{"sourceInterval":[1285,1289]},"--"],["star",{"sourceInterval":[1290,1304]},["seq",{"sourceInterval":[1291,1302]},["not",{"sourceInterval":[1291,1296]},["terminal",{"sourceInterval":[1292,1296]},"\n"]],["app",{"sourceInterval":[1297,1302]},"space",[]]]],["app",{"sourceInterval":[1305,1309]},"name",[]],["star",{"sourceInterval":[1310,1324]},["seq",{"sourceInterval":[1311,1322]},["not",{"sourceInterval":[1311,1316]},["terminal",{"sourceInterval":[1312,1316]},"\n"]],["app",{"sourceInterval":[1317,1322]},"space",[]]]],["alt",{"sourceInterval":[1326,1337]},["terminal",{"sourceInterval":[1326,1330]},"\n"],["lookahead",{"sourceInterval":[1333,1337]},["terminal",{"sourceInterval":[1334,1337]},"}"]]]]],"name":["define",{"sourceInterval":[1342,1382]},"a name",[],["seq",{"sourceInterval":[1363,1382]},["app",{"sourceInterval":[1363,1372]},"nameFirst",[]],["star",{"sourceInterval":[1373,1382]},["app",{"sourceInterval":[1373,1381]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1386,1418]},null,[],["alt",{"sourceInterval":[1402,1418]},["terminal",{"sourceInterval":[1402,1405]},"_"],["app",{"sourceInterval":[1412,1418]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1422,1452]},null,[],["alt",{"sourceInterval":[1437,1452]},["terminal",{"sourceInterval":[1437,1440]},"_"],["app",{"sourceInterval":[1447,1452]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1456,1489]},"an identifier",[],["app",{"sourceInterval":[1485,1489]},"name",[]]],"terminal":["define",{"sourceInterval":[1493,1531]},null,[],["seq",{"sourceInterval":[1508,1531]},["terminal",{"sourceInterval":[1508,1512]},"\""],["star",{"sourceInterval":[1513,1526]},["app",{"sourceInterval":[1513,1525]},"terminalChar",[]]],["terminal",{"sourceInterval":[1527,1531]},"\""]]],"oneCharTerminal":["define",{"sourceInterval":[1535,1579]},null,[],["seq",{"sourceInterval":[1557,1579]},["terminal",{"sourceInterval":[1557,1561]},"\""],["app",{"sourceInterval":[1562,1574]},"terminalChar",[]],["terminal",{"sourceInterval":[1575,1579]},"\""]]],"terminalChar":["define",{"sourceInterval":[1583,1640]},null,[],["alt",{"sourceInterval":[1602,1640]},["app",{"sourceInterval":[1602,1612]},"escapeChar",[]],["seq",{"sourceInterval":[1619,1640]},["not",{"sourceInterval":[1619,1624]},["terminal",{"sourceInterval":[1620,1624]},"\\"]],["not",{"sourceInterval":[1625,1630]},["terminal",{"sourceInterval":[1626,1630]},"\""]],["not",{"sourceInterval":[1631,1636]},["terminal",{"sourceInterval":[1632,1636]},"\n"]],["app",{"sourceInterval":[1637,1640]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1683,1738]},null,[],["terminal",{"sourceInterval":[1683,1689]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1745,1802]},null,[],["terminal",{"sourceInterval":[1745,1751]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1809,1866]},null,[],["terminal",{"sourceInterval":[1809,1815]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1873,1928]},null,[],["terminal",{"sourceInterval":[1873,1878]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1935,1989]},null,[],["terminal",{"sourceInterval":[1935,1940]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1996,2056]},null,[],["terminal",{"sourceInterval":[1996,2001]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[2063,2112]},null,[],["terminal",{"sourceInterval":[2063,2068]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[2119,2178]},null,[],["seq",{"sourceInterval":[2119,2160]},["terminal",{"sourceInterval":[2119,2124]},"\\u"],["app",{"sourceInterval":[2125,2133]},"hexDigit",[]],["app",{"sourceInterval":[2134,2142]},"hexDigit",[]],["app",{"sourceInterval":[2143,2151]},"hexDigit",[]],["app",{"sourceInterval":[2152,2160]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[2185,2240]},null,[],["seq",{"sourceInterval":[2185,2208]},["terminal",{"sourceInterval":[2185,2190]},"\\x"],["app",{"sourceInterval":[2191,2199]},"hexDigit",[]],["app",{"sourceInterval":[2200,2208]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1644,2240]},"an escape sequence",[],["alt",{"sourceInterval":[1683,2240]},["app",{"sourceInterval":[1683,1689]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1745,1751]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1809,1815]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1873,1878]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1935,1940]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1996,2001]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[2063,2068]},"escapeChar_tab",[]],["app",{"sourceInterval":[2119,2160]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[2185,2208]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2244,2263]},null,[],["app",{"sourceInterval":[2256,2263]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2281,2318]},null,[],["seq",{"sourceInterval":[2281,2303]},["terminal",{"sourceInterval":[2281,2285]},"//"],["star",{"sourceInterval":[2286,2298]},["seq",{"sourceInterval":[2287,2296]},["not",{"sourceInterval":[2287,2292]},["terminal",{"sourceInterval":[2288,2292]},"\n"]],["app",{"sourceInterval":[2293,2296]},"any",[]]]],["terminal",{"sourceInterval":[2299,2303]},"\n"]]],"comment_multiLine":["define",{"sourceInterval":[2325,2361]},null,[],["seq",{"sourceInterval":[2325,2347]},["terminal",{"sourceInterval":[2325,2329]},"/*"],["star",{"sourceInterval":[2330,2342]},["seq",{"sourceInterval":[2331,2340]},["not",{"sourceInterval":[2331,2336]},["terminal",{"sourceInterval":[2332,2336]},"*/"]],["app",{"sourceInterval":[2337,2340]},"any",[]]]],["terminal",{"sourceInterval":[2343,2347]},"*/"]]],"comment":["define",{"sourceInterval":[2267,2361]},null,[],["alt",{"sourceInterval":[2281,2361]},["app",{"sourceInterval":[2281,2303]},"comment_singleLine",[]],["app",{"sourceInterval":[2325,2347]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2365,2380]},null,[],["star",{"sourceInterval":[2374,2380]},["app",{"sourceInterval":[2374,2379]},"token",[]]]],"token":["define",{"sourceInterval":[2384,2460]},null,[],["alt",{"sourceInterval":[2392,2460]},["app",{"sourceInterval":[2392,2400]},"caseName",[]],["app",{"sourceInterval":[2403,2410]},"comment",[]],["app",{"sourceInterval":[2413,2418]},"ident",[]],["app",{"sourceInterval":[2421,2429]},"operator",[]],["app",{"sourceInterval":[2432,2443]},"punctuation",[]],["app",{"sourceInterval":[2446,2454]},"terminal",[]],["app",{"sourceInterval":[2457,2460]},"any",[]]]],"operator":["define",{"sourceInterval":[2464,2529]},null,[],["alt",{"sourceInterval":[2475,2529]},["terminal",{"sourceInterval":[2475,2479]},"<:"],["terminal",{"sourceInterval":[2482,2485]},"="],["terminal",{"sourceInterval":[2488,2492]},":="],["terminal",{"sourceInterval":[2495,2499]},"+="],["terminal",{"sourceInterval":[2502,2505]},"*"],["terminal",{"sourceInterval":[2508,2511]},"+"],["terminal",{"sourceInterval":[2514,2517]},"?"],["terminal",{"sourceInterval":[2520,2523]},"~"],["terminal",{"sourceInterval":[2526,2529]},"&"]]],"punctuation":["define",{"sourceInterval":[2533,2569]},null,[],["alt",{"sourceInterval":[2547,2569]},["terminal",{"sourceInterval":[2547,2550]},"<"],["terminal",{"sourceInterval":[2553,2556]},">"],["terminal",{"sourceInterval":[2559,2562]},","],["terminal",{"sourceInterval":[2565,2569]},"--"]]]}]);


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intl_ffi = void 0;
const runtime_1 = __webpack_require__(7);
const ffi_def_1 = __webpack_require__(77);
function intl_ffi(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.text.internationalisation:intl")
        .defun1("make-locale", (tag) => {
        return runtime_1.box(new Intl.Locale(runtime_1.get_string(tag)));
    })
        .defun1("make-list-formatter", (locale, matcher, type, style) => {
        const formatter = new Intl.ListFormat(runtime_1.get_string(locale), {
            localeMatcher: runtime_1.get_string(matcher),
            type: runtime_1.get_string(type),
            style: runtime_1.get_string(style),
        });
        return runtime_1.box(formatter);
    })
        .defun1("format-list", (formatter0, list) => {
        const formatter = runtime_1.unbox_typed(Intl.ListFormat, formatter0);
        const items = runtime_1.get_array(list).map((x) => runtime_1.get_string(x));
        return runtime_1.from_string(formatter.format(items));
    });
}
exports.intl_ffi = intl_ffi;
exports.default = [intl_ffi];
//# sourceMappingURL=intl.js.map

/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.codec_hex = exports.codec_base64 = void 0;
const runtime_1 = __webpack_require__(7);
const ffi_def_1 = __webpack_require__(77);
function codec_base64(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.codec.basic:base64")
        .defun1("encode", (x) => {
        return runtime_1.from_string(Buffer.from(runtime_1.get_string(x)).toString("base64"));
    })
        .defun1("decode", (x) => {
        return runtime_1.from_string(Buffer.from(runtime_1.get_string(x), "base64").toString("utf-8"));
    });
}
exports.codec_base64 = codec_base64;
function codec_hex(ffi) {
    new ffi_def_1.ForeignNamespace(ffi, "crochet.codec.basic:hex")
        .defun1("encode", (x) => {
        return runtime_1.from_string(Buffer.from(runtime_1.get_string(x)).toString("hex"));
    })
        .defun1("encode-int", (x) => {
        return runtime_1.from_string(runtime_1.get_integer(x).toString(16));
    })
        .defun1("decode", (x) => {
        return runtime_1.from_string(Buffer.from(runtime_1.get_string(x), "hex").toString("utf-8"));
    })
        .defun1("decode-int", (x) => {
        return runtime_1.from_integer(BigInt(`0x${runtime_1.get_string(x)}`));
    });
}
exports.codec_hex = codec_hex;
exports.default = [codec_base64, codec_hex];
//# sourceMappingURL=codec.js.map

/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(140), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrochetVM = void 0;
const Path = __webpack_require__(1);
const Compiler = __webpack_require__(141);
const runtime_1 = __webpack_require__(7);
const runtime_2 = __webpack_require__(7);
const runtime_3 = __webpack_require__(7);
const pkg_1 = __webpack_require__(70);
const utils_1 = __webpack_require__(33);
const errors_1 = __webpack_require__(17);
const plugin_1 = __webpack_require__(145);
class CrochetVM {
    constructor() {
        this.registered_packages = new Map();
        this.loaded_packages = new Set();
        this.world = new runtime_1.World();
    }
    get ffi() {
        return this.world.ffi;
    }
    reseed(seed) {
        this.world.global_random.reseed(seed);
    }
    async load_source(filename, pkg) {
        switch (Path.extname(filename)) {
            case ".crochet": {
                return this.load_crochet(filename, pkg);
            }
            default:
                return this.load_crochet(filename + ".crochet", pkg);
        }
    }
    async load_crochet(filename, pkg) {
        utils_1.logger.debug(`Loading ${pkg.relative_filename(filename)} from package ${pkg.name}`);
        const source = await this.read_file(filename);
        const ast = Compiler.parse(source, filename);
        const ir = Compiler.compileProgram(ast);
        const state = runtime_2.State.root(this.world);
        await state.world.load_declarations(filename, ir, state.env, pkg);
    }
    async register_package(name, pkg) {
        const old = this.registered_packages.get(name);
        if (old != null) {
            throw new Error(`Duplicated package ${name}. Defined in ${pkg.filename} and ${old.filename}`);
        }
        utils_1.logger.debug(`Registered package ${name} from ${pkg.filename}`);
        this.registered_packages.set(name, pkg);
    }
    async read_package_from_file(filename) {
        const source = await this.read_file(filename);
        try {
            return pkg_1.CrochetPackage.parse(JSON.parse(source), filename);
        }
        catch (error) {
            throw new Error(`In ${filename}\n${error.message}`);
        }
    }
    async get_package(name) {
        const pkg = this.registered_packages.get(name);
        if (pkg == null) {
            throw new Error(`Package ${name} is not registered`);
        }
        return pkg;
    }
    async load_package(pkg) {
        utils_1.logger.debug(`Loading package ${pkg.name}`);
        for (const x of pkg.native_sources) {
            utils_1.logger.debug(`Loading native module ${pkg.relative_filename(x)} from package ${pkg.name}`);
            const module = await this.load_native(x);
            const ffi = this.world.ffi;
            const plugin = new plugin_1.Plugin(pkg, ffi);
            await module(plugin);
        }
        for (const x of pkg.sources) {
            await this.load_source(x, pkg);
        }
    }
    async load_graph(graph, pkg) {
        for (const x of graph.serialise(pkg.name)) {
            await this.load_package(x);
        }
    }
    async resolve(filename, target) {
        const pkg0 = await this.read_package_from_file(filename);
        if (!this.registered_packages.has(pkg0.name)) {
            this.register_package(pkg0.name, pkg0);
        }
        const pkg = pkg0.restricted_to(target);
        const graph = await pkg_1.PackageGraph.resolve(target, this, pkg);
        return { graph, pkg };
    }
    async run(scene) {
        utils_1.logger.debug(`Running scene ${scene}`);
        return await this.world.run(scene);
    }
    async run_initialisation() {
        await this.world.run_init();
    }
    async run_tests(filter) {
        const start = new Date();
        await this.run_initialisation();
        let failures = [];
        let total = 0;
        let skipped = 0;
        const state = runtime_2.State.root(this.world);
        for (const [group, modules] of this.world.grouped_tests) {
            console.log("");
            console.log(group);
            console.log("=".repeat(72));
            for (const [module, tests] of modules) {
                const valid_tests = tests.filter(filter);
                if (valid_tests.length === 0) {
                    continue;
                }
                console.log("");
                console.log(module);
                console.log("-".repeat(72));
                for (const test of tests) {
                    total += 1;
                    if (!filter(test)) {
                        skipped += 1;
                        continue;
                    }
                    try {
                        const machine = test.evaluate(state);
                        await runtime_3.Thread.for_machine(machine).run_and_wait();
                        console.log(`[OK]    ${test.title}`);
                    }
                    catch (error) {
                        console.log("-".repeat(3));
                        console.log(`[ERROR] ${test.title}`);
                        console.log(this.format_error(error));
                        console.log("-".repeat(3));
                        failures.push(error);
                    }
                }
            }
        }
        const end = new Date();
        const diff = end.getTime() - start.getTime();
        console.log("");
        console.log("-".repeat(72));
        console.log(`${total} tests in ${diff}ms  |  ${skipped} skipped  |  ${failures.length} failures`);
        return failures;
    }
    async show_error(error) {
        console.error(this.format_error(error));
    }
    format_error(error) {
        if (error instanceof errors_1.MachineError) {
            return error.format();
        }
        else if (error instanceof Error) {
            if (utils_1.logger.verbose && error.stack != null) {
                return error.stack;
            }
            else {
                return `${error.name}: ${error.message}`;
            }
        }
        else if (error instanceof runtime_3.CrochetError) {
            return error.stack;
        }
        else {
            return String(error);
        }
    }
}
exports.CrochetVM = CrochetVM;
//# sourceMappingURL=vm.js.map

/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(142), exports);
__exportStar(__webpack_require__(144), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse_repl = exports.parse = void 0;
const Crochet = __webpack_require__(143);
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
//# sourceMappingURL=parser.js.map

/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.$$Statement$_Goto = exports.$$Statement$_Forget = exports.$$Statement$_Fact = exports.Statement = exports.$$PredicateEffect$_Trivial = exports.PredicateEffect = exports.PredicateClause = exports.$$TypeApp$_Any = exports.$$TypeApp$_Static = exports.$$TypeApp$_Named = exports.TypeApp = exports.$$Parameter$_TypedOnly = exports.$$Parameter$_Typed = exports.$$Parameter$_Untyped = exports.Parameter = exports.$$TypeInit$_ForeignCommand = exports.$$TypeInit$_Command = exports.$$TypeInit$_Fact = exports.TypeInit = exports.$$Rank$_Unranked = exports.$$Rank$_Expr = exports.Rank = exports.FFI = exports.TypeDef = exports.ContractCondition = exports.Contract = exports.TrailingTest = exports.$$Declaration$_Test = exports.$$Declaration$_Local = exports.$$Declaration$_Open = exports.$$Declaration$_Context = exports.$$Declaration$_When = exports.$$Declaration$_Action = exports.$$Declaration$_Scene = exports.$$Declaration$_Type = exports.$$Declaration$_ForeignType = exports.$$Declaration$_SingletonType = exports.$$Declaration$_EnumType = exports.$$Declaration$_AbstractType = exports.$$Declaration$_Define = exports.$$Declaration$_Command = exports.$$Declaration$_ForeignCommand = exports.$$Declaration$_Do = exports.$$Declaration$_DefinePredicate = exports.$$Declaration$_Relation = exports.Declaration = exports.Metadata = exports.Program = exports.Meta = exports.Node = void 0;
exports.Interpolation = exports.Projection = exports.$$RecordField$_FComputed = exports.$$RecordField$_FText = exports.$$RecordField$_FName = exports.RecordField = exports.ConditionCase = exports.MatchSearchCase = exports.$$ForExpression$_Do = exports.$$ForExpression$_If = exports.$$ForExpression$_Map = exports.ForExpression = exports.$$Expression$_Lit = exports.$$Expression$_Parens = exports.$$Expression$_IntrinsicEqual = exports.$$Expression$_Lambda = exports.$$Expression$_Type = exports.$$Expression$_Return = exports.$$Expression$_Hole = exports.$$Expression$_Lazy = exports.$$Expression$_Force = exports.$$Expression$_HasType = exports.$$Expression$_Condition = exports.$$Expression$_Interpolate = exports.$$Expression$_PipeInvoke = exports.$$Expression$_Pipe = exports.$$Expression$_Apply = exports.$$Expression$_Block = exports.$$Expression$_For = exports.$$Expression$_Select = exports.$$Expression$_Project = exports.$$Expression$_MatchSearch = exports.$$Expression$_Search = exports.$$Expression$_Record = exports.$$Expression$_List = exports.$$Expression$_Self = exports.$$Expression$_Variable = exports.$$Expression$_Global = exports.$$Expression$_Invoke = exports.$$Expression$_New = exports.Expression = exports.Signal = exports.$$SimulationContext$_Named = exports.$$SimulationContext$_Global = exports.SimulationContext = exports.$$Statement$_Expr = exports.$$Statement$_Assert = exports.$$Statement$_Simulate = exports.$$Statement$_Let = exports.$$Statement$_Call = void 0;
exports.Pair = exports.$$RelationPart$_One = exports.$$RelationPart$_Many = exports.RelationPart = exports.$$PartialSignature$_Keyword = exports.$$PartialSignature$_Binary = exports.$$PartialSignature$_Unary = exports.PartialSignature = exports.$$Signature$_KeywordSelfless = exports.$$Signature$_Keyword = exports.$$Signature$_Binary = exports.$$Signature$_Unary = exports.Signature = exports.$$Pattern$_Lit = exports.$$Pattern$_Wildcard = exports.$$Pattern$_Self = exports.$$Pattern$_Variable = exports.$$Pattern$_Global = exports.$$Pattern$_HasType = exports.Pattern = exports.$$SamplingPool$_Type = exports.$$SamplingPool$_Relation = exports.SamplingPool = exports.$$Predicate$_Parens = exports.$$Predicate$_Always = exports.$$Predicate$_Typed = exports.$$Predicate$_Let = exports.$$Predicate$_Constrain = exports.$$Predicate$_Sample = exports.$$Predicate$_Has = exports.$$Predicate$_Not = exports.$$Predicate$_Or = exports.$$Predicate$_And = exports.Predicate = exports.$$SimulationGoal$_CustomGoal = exports.$$SimulationGoal$_TotalQuiescence = exports.$$SimulationGoal$_EventQuiescence = exports.$$SimulationGoal$_ActionQuiescence = exports.SimulationGoal = exports.$$Literal$_Float = exports.$$Literal$_Integer = exports.$$Literal$_Text = exports.$$Literal$_Nothing = exports.$$Literal$_True = exports.$$Literal$_False = exports.Literal = exports.$$InterpolationPart$_Dynamic = exports.$$InterpolationPart$_Static = exports.$$InterpolationPart$_Escape = exports.InterpolationPart = void 0;
exports.toAst = exports.toAstVisitor = exports.semantics = exports.parse = exports.grammar = exports.$$ReplCommand$_HelpType = exports.$$ReplCommand$_HelpCommand = exports.$$ReplCommand$_Rollback = exports.ReplCommand = exports.$$REPL$_Command = exports.$$REPL$_Statements = exports.$$REPL$_Declarations = exports.REPL = exports.String = exports.Namespace = exports.Name = void 0;
// This file is generated from Linguist
const Ohm = __webpack_require__(90);
const OhmUtil = __webpack_require__(105);
const util_1 = __webpack_require__(24);
const inspect = Symbol.for("nodejs.util.inspect.custom");
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(declarations, "Declaration[]", $is_array(Declaration));
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
        $assert_type(doc, "string[]", $is_array($is_type("string")));
    }
    static has_instance(x) {
        return x instanceof Metadata;
    }
}
exports.Metadata = Metadata;
class Declaration extends Node {
    static get Relation() {
        return $$Declaration$_Relation;
    }
    static get DefinePredicate() {
        return $$Declaration$_DefinePredicate;
    }
    static get Do() {
        return $$Declaration$_Do;
    }
    static get ForeignCommand() {
        return $$Declaration$_ForeignCommand;
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
    static get ForeignType() {
        return $$Declaration$_ForeignType;
    }
    static get Type() {
        return $$Declaration$_Type;
    }
    static get Scene() {
        return $$Declaration$_Scene;
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
    static has_instance(x) {
        return x instanceof Declaration;
    }
}
exports.Declaration = Declaration;
class $$Declaration$_Relation extends Declaration {
    constructor(pos, cmeta, signature) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        Object.defineProperty(this, "tag", { value: "Relation" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(signature, "Signature<RelationPart>", Signature);
    }
    match(p) {
        return p.Relation(this.pos, this.cmeta, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Relation;
    }
}
exports.$$Declaration$_Relation = $$Declaration$_Relation;
class $$Declaration$_DefinePredicate extends Declaration {
    constructor(pos, cmeta, signature, clauses) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        this.clauses = clauses;
        Object.defineProperty(this, "tag", { value: "DefinePredicate" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(signature, "Signature<Name>", Signature);
        $assert_type(clauses, "PredicateClause[]", $is_array(PredicateClause));
    }
    match(p) {
        return p.DefinePredicate(this.pos, this.cmeta, this.signature, this.clauses);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_DefinePredicate;
    }
}
exports.$$Declaration$_DefinePredicate = $$Declaration$_DefinePredicate;
class $$Declaration$_Do extends Declaration {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Do" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(body, "Statement[]", $is_array(Statement));
    }
    match(p) {
        return p.Do(this.pos, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Do;
    }
}
exports.$$Declaration$_Do = $$Declaration$_Do;
class $$Declaration$_ForeignCommand extends Declaration {
    constructor(pos, cmeta, signature, contract, body, ttest) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        this.contract = contract;
        this.body = body;
        this.ttest = ttest;
        Object.defineProperty(this, "tag", { value: "ForeignCommand" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(signature, "Signature<Parameter>", Signature);
        $assert_type(contract, "Contract", Contract);
        $assert_type(body, "FFI", FFI);
        $assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest));
    }
    match(p) {
        return p.ForeignCommand(this.pos, this.cmeta, this.signature, this.contract, this.body, this.ttest);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_ForeignCommand;
    }
}
exports.$$Declaration$_ForeignCommand = $$Declaration$_ForeignCommand;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(signature, "Signature<Parameter>", Signature);
        $assert_type(contract, "Contract", Contract);
        $assert_type(body, "Statement[]", $is_array(Statement));
        $assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(name, "Name", Name);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(typ, "TypeDef", TypeDef);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(name, "Name", Name);
        $assert_type(variants, "Name[]", $is_array(Name));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(typ, "TypeDef", TypeDef);
        $assert_type(init, "TypeInit[]", $is_array(TypeInit));
    }
    match(p) {
        return p.SingletonType(this.pos, this.cmeta, this.typ, this.init);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_SingletonType;
    }
}
exports.$$Declaration$_SingletonType = $$Declaration$_SingletonType;
class $$Declaration$_ForeignType extends Declaration {
    constructor(pos, cmeta, name, foreign_name) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.foreign_name = foreign_name;
        Object.defineProperty(this, "tag", { value: "ForeignType" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(name, "Name", Name);
        $assert_type(foreign_name, "Namespace", Namespace);
    }
    match(p) {
        return p.ForeignType(this.pos, this.cmeta, this.name, this.foreign_name);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_ForeignType;
    }
}
exports.$$Declaration$_ForeignType = $$Declaration$_ForeignType;
class $$Declaration$_Type extends Declaration {
    constructor(pos, cmeta, typ, fields) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.typ = typ;
        this.fields = fields;
        Object.defineProperty(this, "tag", { value: "Type" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(typ, "TypeDef", TypeDef);
        $assert_type(fields, "Parameter[]", $is_array(Parameter));
    }
    match(p) {
        return p.Type(this.pos, this.cmeta, this.typ, this.fields);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Type;
    }
}
exports.$$Declaration$_Type = $$Declaration$_Type;
class $$Declaration$_Scene extends Declaration {
    constructor(pos, cmeta, name, body) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.name = name;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Scene" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(name, "Name", Name);
        $assert_type(body, "Statement[]", $is_array(Statement));
    }
    match(p) {
        return p.Scene(this.pos, this.cmeta, this.name, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Scene;
    }
}
exports.$$Declaration$_Scene = $$Declaration$_Scene;
class $$Declaration$_Action extends Declaration {
    constructor(pos, cmeta, typeRestriction, title, tags, pred, rank, body) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.typeRestriction = typeRestriction;
        this.title = title;
        this.tags = tags;
        this.pred = pred;
        this.rank = rank;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "Action" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(typeRestriction, "TypeApp", TypeApp);
        $assert_type(title, "Expression", Expression);
        $assert_type(tags, "Name[]", $is_array(Name));
        $assert_type(pred, "Predicate", Predicate);
        $assert_type(rank, "Rank", Rank);
        $assert_type(body, "Statement[]", $is_array(Statement));
    }
    match(p) {
        return p.Action(this.pos, this.cmeta, this.typeRestriction, this.title, this.tags, this.pred, this.rank, this.body);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(pred, "Predicate", Predicate);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(name, "Name", Name);
        $assert_type(items, "Declaration[]", $is_array(Declaration));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(ns, "Namespace", Namespace);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(decl, "Declaration", Declaration);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(title, "String", String);
        $assert_type(body, "Statement[]", $is_array(Statement));
    }
    match(p) {
        return p.Test(this.pos, this.title, this.body);
    }
    static has_instance(x) {
        return x instanceof $$Declaration$_Test;
    }
}
exports.$$Declaration$_Test = $$Declaration$_Test;
class TrailingTest extends Node {
    constructor(pos, body) {
        super();
        this.pos = pos;
        this.body = body;
        Object.defineProperty(this, "tag", { value: "TrailingTest" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(ret, "(TypeApp | null)", $is_maybe(TypeApp));
        $assert_type(pre, "ContractCondition[]", $is_array(ContractCondition));
        $assert_type(post, "ContractCondition[]", $is_array(ContractCondition));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(expr, "Expression", Expression);
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
        $assert_type(parent, "(TypeApp | null)", $is_maybe(TypeApp));
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Namespace", Namespace);
        $assert_type(args, "Name[]", $is_array(Name));
    }
    static has_instance(x) {
        return x instanceof FFI;
    }
}
exports.FFI = FFI;
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
        $assert_type(expr, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
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
    static get ForeignCommand() {
        return $$TypeInit$_ForeignCommand;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(sig, "PartialSignature<Expression>", PartialSignature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(sig, "PartialSignature<Parameter>", PartialSignature);
        $assert_type(contract, "Contract", Contract);
        $assert_type(body, "Statement[]", $is_array(Statement));
        $assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest));
    }
    match(p) {
        return p.Command(this.pos, this.cmeta, this.sig, this.contract, this.body, this.ttest);
    }
    static has_instance(x) {
        return x instanceof $$TypeInit$_Command;
    }
}
exports.$$TypeInit$_Command = $$TypeInit$_Command;
class $$TypeInit$_ForeignCommand extends TypeInit {
    constructor(pos, cmeta, signature, contract, body, ttest) {
        super();
        this.pos = pos;
        this.cmeta = cmeta;
        this.signature = signature;
        this.contract = contract;
        this.body = body;
        this.ttest = ttest;
        Object.defineProperty(this, "tag", { value: "ForeignCommand" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(cmeta, "Metadata", Metadata);
        $assert_type(signature, "PartialSignature<Parameter>", PartialSignature);
        $assert_type(contract, "Contract", Contract);
        $assert_type(body, "FFI", FFI);
        $assert_type(ttest, "(TrailingTest | null)", $is_maybe(TrailingTest));
    }
    match(p) {
        return p.ForeignCommand(this.pos, this.cmeta, this.signature, this.contract, this.body, this.ttest);
    }
    static has_instance(x) {
        return x instanceof $$TypeInit$_ForeignCommand;
    }
}
exports.$$TypeInit$_ForeignCommand = $$TypeInit$_ForeignCommand;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(typ, "TypeApp", TypeApp);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(typ, "TypeApp", TypeApp);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(typ, "TypeApp", TypeApp);
    }
    match(p) {
        return p.Static(this.pos, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Static;
    }
}
exports.$$TypeApp$_Static = $$TypeApp$_Static;
class $$TypeApp$_Any extends TypeApp {
    constructor(pos) {
        super();
        this.pos = pos;
        Object.defineProperty(this, "tag", { value: "Any" });
        $assert_type(pos, "Meta", Meta);
    }
    match(p) {
        return p.Any(this.pos);
    }
    static has_instance(x) {
        return x instanceof $$TypeApp$_Any;
    }
}
exports.$$TypeApp$_Any = $$TypeApp$_Any;
class PredicateClause extends Node {
    constructor(pos, predicate, effect) {
        super();
        this.pos = pos;
        this.predicate = predicate;
        this.effect = effect;
        Object.defineProperty(this, "tag", { value: "PredicateClause" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(predicate, "Predicate", Predicate);
        $assert_type(effect, "PredicateEffect", PredicateEffect);
    }
    static has_instance(x) {
        return x instanceof PredicateClause;
    }
}
exports.PredicateClause = PredicateClause;
class PredicateEffect extends Node {
    static get Trivial() {
        return $$PredicateEffect$_Trivial;
    }
    static has_instance(x) {
        return x instanceof PredicateEffect;
    }
}
exports.PredicateEffect = PredicateEffect;
class $$PredicateEffect$_Trivial extends PredicateEffect {
    constructor() {
        super();
        Object.defineProperty(this, "tag", { value: "Trivial" });
    }
    match(p) {
        return p.Trivial();
    }
    static has_instance(x) {
        return x instanceof $$PredicateEffect$_Trivial;
    }
}
exports.$$PredicateEffect$_Trivial = $$PredicateEffect$_Trivial;
class Statement extends Node {
    static get Fact() {
        return $$Statement$_Fact;
    }
    static get Forget() {
        return $$Statement$_Forget;
    }
    static get Goto() {
        return $$Statement$_Goto;
    }
    static get Call() {
        return $$Statement$_Call;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Expression>", Signature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Expression>", Signature);
    }
    match(p) {
        return p.Forget(this.pos, this.signature);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Forget;
    }
}
exports.$$Statement$_Forget = $$Statement$_Forget;
class $$Statement$_Goto extends Statement {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Goto" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
    }
    match(p) {
        return p.Goto(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Goto;
    }
}
exports.$$Statement$_Goto = $$Statement$_Goto;
class $$Statement$_Call extends Statement {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Call" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
    }
    match(p) {
        return p.Call(this.pos, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Statement$_Call;
    }
}
exports.$$Statement$_Call = $$Statement$_Call;
class $$Statement$_Let extends Statement {
    constructor(pos, name, value) {
        super();
        this.pos = pos;
        this.name = name;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Let" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(actors, "Expression", Expression);
        $assert_type(context, "SimulationContext", SimulationContext);
        $assert_type(goal, "SimulationGoal", SimulationGoal);
        $assert_type(signals, "Signal[]", $is_array(Signal));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(expr, "Expression", Expression);
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
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Parameter>", Signature);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
    static get Parens() {
        return $$Expression$_Parens;
    }
    static get Lit() {
        return $$Expression$_Lit;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(typ, "Name", Name);
        $assert_type(fields, "Expression[]", $is_array(Expression));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Expression>", Signature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(values, "Expression[]", $is_array(Expression));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pairs, "Pair<RecordField, Expression>[]", $is_array(Pair));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(predicate, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cases, "MatchSearchCase[]", $is_array(MatchSearchCase));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(object, "Expression", Expression);
        $assert_type(field, "RecordField", RecordField);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(object, "Expression", Expression);
        $assert_type(fields, "Projection[]", $is_array(Projection));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(comprehension, "ForExpression", ForExpression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(partial, "Expression", Expression);
        $assert_type(values, "Expression[]", $is_array(Expression));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(left, "Expression", Expression);
        $assert_type(right, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(left, "Expression", Expression);
        $assert_type(right, "PartialSignature<Expression>", PartialSignature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "Interpolation<Expression>", Interpolation);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(cases, "ConditionCase[]", $is_array(ConditionCase));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "Expression", Expression);
        $assert_type(typ, "TypeApp", TypeApp);
    }
    match(p) {
        return p.HasType(this.pos, this.value, this.typ);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_HasType;
    }
}
exports.$$Expression$_HasType = $$Expression$_HasType;
class $$Expression$_Force extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Force" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(typ, "TypeApp", TypeApp);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(params, "Name[]", $is_array(Name));
        $assert_type(body, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(left, "Expression", Expression);
        $assert_type(right, "Expression", Expression);
    }
    match(p) {
        return p.IntrinsicEqual(this.pos, this.left, this.right);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_IntrinsicEqual;
    }
}
exports.$$Expression$_IntrinsicEqual = $$Expression$_IntrinsicEqual;
class $$Expression$_Parens extends Expression {
    constructor(pos, value) {
        super();
        this.pos = pos;
        this.value = value;
        Object.defineProperty(this, "tag", { value: "Parens" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(value, "Literal", Literal);
    }
    match(p) {
        return p.Lit(this.value);
    }
    static has_instance(x) {
        return x instanceof $$Expression$_Lit;
    }
}
exports.$$Expression$_Lit = $$Expression$_Lit;
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(stream, "Expression", Expression);
        $assert_type(body, "ForExpression", ForExpression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(condition, "Expression", Expression);
        $assert_type(body, "ForExpression", ForExpression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(body, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(predicate, "Predicate", Predicate);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(guard, "Expression", Expression);
        $assert_type(body, "Statement[]", $is_array(Statement));
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
        $assert_type(value, "Name", Name);
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
        $assert_type(value, "String", String);
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
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "RecordField", RecordField);
        $assert_type(alias, "RecordField", RecordField);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(parts, "InterpolationPart<T>[]", $is_array(InterpolationPart));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(character, "string", $is_type("string"));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(text, "string", $is_type("string"));
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(value, "String", String);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(digits, "string", $is_type("string"));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(digits, "string", $is_type("string"));
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pred, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(left, "Predicate", Predicate);
        $assert_type(right, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(left, "Predicate", Predicate);
        $assert_type(right, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pred, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Pattern>", Signature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(size, "Literal", Literal);
        $assert_type(pool, "SamplingPool", SamplingPool);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pred, "Predicate", Predicate);
        $assert_type(constraint, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(value, "Expression", Expression);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(typ, "TypeApp", TypeApp);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pred, "Predicate", Predicate);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(signature, "Signature<Pattern>", Signature);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
        $assert_type(typ, "TypeApp", TypeApp);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(typ, "TypeApp", TypeApp);
        $assert_type(name, "Pattern", Pattern);
    }
    match(p) {
        return p.HasType(this.pos, this.typ, this.name);
    }
    static has_instance(x) {
        return x instanceof $$Pattern$_HasType;
    }
}
exports.$$Pattern$_HasType = $$Pattern$_HasType;
class $$Pattern$_Global extends Pattern {
    constructor(pos, name) {
        super();
        this.pos = pos;
        this.name = name;
        Object.defineProperty(this, "tag", { value: "Global" });
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(lit, "Literal", Literal);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(op, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(op, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(pairs, "Pair<Name, T>[]", $is_array(Pair));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "Name", Name);
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
        $assert_type(pos, "Meta", Meta);
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(name, "string", $is_type("string"));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(names, "string[]", $is_array($is_type("string")));
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
        $assert_type(pos, "Meta", Meta);
        $assert_type(text, "string", $is_type("string"));
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
        $assert_type(x, "Declaration[]", $is_array(Declaration));
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
        $assert_type(x, "Statement[]", $is_array(Statement));
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
        $assert_type(x, "ReplCommand", ReplCommand);
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
        $assert_type(sig, "Signature<Expression>", Signature);
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
        $assert_type(sig, "Signature<Parameter>", Signature);
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
        $assert_type(typ, "TypeApp", TypeApp);
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
exports.grammar = Ohm.grammar('\r\n  Crochet {\r\n    program  = header declaration* space* end  -- alt1\n\n\nrepl  = ws declaration+ ws end  -- alt1\n | ws statements1 ws end  -- alt2\n | ws replCommand ws end  -- alt3\n\n\nreplCommand  = ":rollback" hs+ signature<hole>  -- alt1\n | ":help" hs+ command_ signature<parameter>  -- alt2\n | ":help" hs+ type_ typeApp  -- alt3\n\n\ndeclarationMeta  = ws meta_doc  -- alt1\n\n\nmeta_doc  = doc  -- alt1\n |   -- alt2\n\n\ndeclaration  = relationDeclaration  -- alt1\n | predicateDeclaration  -- alt2\n | doDeclaration  -- alt3\n | commandDeclaration  -- alt4\n | typeDeclaration  -- alt5\n | defineDeclaration  -- alt6\n | sceneDeclaration  -- alt7\n | actionDeclaration  -- alt8\n | whenDeclaration  -- alt9\n | contextDeclaration  -- alt10\n | openDeclaration  -- alt11\n | localDeclaration  -- alt12\n | testDeclaration  -- alt13\n\n\ntestDeclaration  = test_ string do_ statements end_  -- alt1\n\n\ntrailingTest  = oneTrailingTest  -- alt1\n | s<";">  -- alt2\n\n\noneTrailingTest  = test_ statements end_  -- alt1\n\n\nlocalDeclaration  = local_ defineDeclaration  -- alt1\n | local_ typeDeclaration  -- alt2\n\n\nopenDeclaration  = open_ namespace s<";">  -- alt1\n\n\nrelationDeclaration  = declarationMeta ws relation_ logicSignature<relationPart> s<";">  -- alt1\n\n\nrelationPart  = name s<"*">  -- alt1\n | name  -- alt2\n\n\npredicateDeclaration  = declarationMeta ws predicate_ logicSignature<name> block<predicateClause>  -- alt1\n\n\npredicateClause  = when_ predicate s<";">  -- alt1\n | always_ predicate s<";">  -- alt2\n\n\ndoDeclaration  = prelude_ statements end_  -- alt1\n\n\ncommandDeclaration  = declarationMeta ws command_ signature<parameter> contractDefinition s<"="> foreign_ foreignBody trailingTest  -- alt1\n | declarationMeta ws command_ signature<parameter> contractDefinition s<"="> expression trailingTest  -- alt2\n | declarationMeta ws command_ signature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt3\n | declarationMeta ws command_ signature<parameter> contractDefinition do_ statements end_  -- alt4\n\n\ncontractDefinition  = retContractDefinition preContractDefinition postContractDefinition  -- alt1\n\n\nretContractDefinition  = s<"->"> typeAppPrimary  -- alt1\n |   -- alt2\n\n\npreContractDefinition  = requires_ list1<contractCondition, s<";">>  -- alt1\n |   -- alt2\n\n\npostContractDefinition  = ensures_ list1<contractCondition, s<";">>  -- alt1\n |   -- alt2\n\n\ncontractCondition  = atom s<"::"> expression  -- alt1\n\n\nforeignBody  = namespace s<"("> list0<name, s<",">> s<")">  -- alt1\n\n\nparameter  = name  -- alt1\n | s<"("> name is_ typeApp s<")">  -- alt2\n | typeAppStatic  -- alt3\n\n\ntypeApp  = typeAppStatic  -- alt1\n\n\ntypeAppStatic  = s<"#"> typeAppPrimary  -- alt1\n | typeAppPrimary  -- alt2\n\n\ntypeAppPrimary  = typeName  -- alt1\n\n\ntypeName  = atom  -- alt1\n | nothing_  -- alt2\n | true_  -- alt3\n | false_  -- alt4\n\n\ntypeDeclaration  = declarationMeta ws enum_ typeName s<"="> nonemptyListOf<typeName, s<",">> s<";">  -- alt1\n | declarationMeta ws abstract_ basicType s<";">  -- alt2\n | declarationMeta ws singleton_ basicType typeInitBlock  -- alt3\n | declarationMeta ws type_ basicType typeFields s<";">  -- alt4\n | declarationMeta ws type_ typeName s<"="> foreign_ namespace s<";">  -- alt5\n\n\nbasicType  = atom typeDefParent  -- alt1\n\n\ntypeDefParent  = is_ typeApp  -- alt1\n |   -- alt2\n\n\ntypeInitBlock  = with_ typeInit* end_  -- alt1\n | s<";">  -- alt2\n\n\ntypeFields  = s<"("> list1<typeField, s<",">> s<")">  -- alt1\n |   -- alt2\n\n\ntypeField  = typeFieldName is_ typeApp  -- alt1\n | typeFieldName  -- alt2\n\n\ntypeFieldName  = name  -- alt1\n | atom  -- alt2\n\n\ntypeInit  = partialLogicSignature<invokePostfix> s<";">  -- alt1\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition s<"="> foreignBody trailingTest  -- alt2\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition s<"="> s<expression> trailingTest  -- alt3\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition do_ statements oneTrailingTest  -- alt4\n | declarationMeta ws command_ partialSignature<parameter> contractDefinition do_ statements end_  -- alt5\n\n\ndefineDeclaration  = declarationMeta ws define_ atom s<"="> s<atomicExpression> s<";">  -- alt1\n\n\nsceneDeclaration  = declarationMeta ws scene_ atom do_ statements end_  -- alt1\n\n\nactionDeclaration  = declarationMeta ws action_ actionTitle actionType actionTags actionPredicate actionRank do_ statements end_  -- alt1\n\n\nactionType  = for_ typeApp  -- alt1\n |   -- alt2\n\n\nactionTitle  = interpolateText<expression>  -- alt1\n\n\nactionTags  = tags_ list1<atom, s<",">>  -- alt1\n |   -- alt2\n\n\nactionPredicate  = when_ predicate  -- alt1\n |   -- alt2\n\n\nactionRank  = rank_ s<expression>  -- alt1\n |   -- alt2\n\n\nwhenDeclaration  = declarationMeta ws when_ predicate do_ statements end_  -- alt1\n\n\ncontextDeclaration  = declarationMeta ws context_ atom with_ contextItem* end_  -- alt1\n\n\ncontextItem  = actionDeclaration  -- alt1\n | whenDeclaration  -- alt2\n\n\npredicate  = predicateBinary  -- alt1\n\n\npredicateBinary  = predicateAnd  -- alt1\n | predicateOr  -- alt2\n | predicateNot  -- alt3\n\n\npredicateAnd  = predicateNot s<","> predicateAnd1  -- alt1\n\n\npredicateAnd1  = predicateNot s<","> predicateAnd1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateOr  = predicateNot s<"|"> predicateOr1  -- alt1\n\n\npredicateOr1  = predicateNot s<"|"> predicateOr1  -- alt1\n | predicateNot  -- alt2\n\n\npredicateNot  = not_ predicateConstrain  -- alt1\n | predicateConstrain  -- alt2\n\n\npredicateConstrain  = predicateLet if_ s<expression>  -- alt1\n | if_ s<expression>  -- alt2\n | predicateLet  -- alt3\n | predicateSample  -- alt4\n | predicateType  -- alt5\n | predicatePrimary  -- alt6\n\n\npredicateType  = name is_ typeApp  -- alt1\n\n\npredicateLet  = let_ name s<"="> s<expression>  -- alt1\n\n\npredicateSample  = sample_ integer of_ samplingPool  -- alt1\n\n\nsamplingPool  = logicSignature<pattern>  -- alt1\n | name is_ typeApp  -- alt2\n\n\npredicatePrimary  = always_  -- alt1\n | logicSignature<pattern>  -- alt2\n | s<"("> predicate s<")">  -- alt3\n\n\npattern  = s<"("> patternComplex s<")">  -- alt1\n | atom  -- alt2\n | self_  -- alt3\n | literal  -- alt4\n | patternName  -- alt5\n\n\npatternComplex  = patternName is_ typeApp  -- alt1\n\n\npatternName  = s<"_">  -- alt1\n | name  -- alt2\n\n\nstatement  = s<letStatement>  -- alt1\n | s<factStatement>  -- alt2\n | s<forgetStatement>  -- alt3\n | s<gotoStatement>  -- alt4\n | s<callStatement>  -- alt5\n | s<simulateStatement>  -- alt6\n | s<assertStatement>  -- alt7\n | s<expression>  -- alt8\n\n\nblockStatement  = blockExpression  -- alt1\n\n\nletStatement  = let_ name s<"="> s<expression>  -- alt1\n\n\nfactStatement  = fact_ logicSignature<primaryExpression>  -- alt1\n\n\nforgetStatement  = forget_ logicSignature<primaryExpression>  -- alt1\n\n\ngotoStatement  = goto_ atom  -- alt1\n\n\ncallStatement  = call_ atom  -- alt1\n\n\nsimulateStatement  = simulate_ for_ expression simulateContext until_ simulateGoal signal*  -- alt1\n\n\nsimulateContext  = in_ atom  -- alt1\n |   -- alt2\n\n\nsimulateGoal  = action_ quiescence_  -- alt1\n | event_ quiescence_  -- alt2\n | quiescence_  -- alt3\n | predicate  -- alt4\n\n\nsignal  = on_ signature<parameter> do_ statements end_  -- alt1\n\n\nassertStatement  = assert_ expression  -- alt1\n\n\nexpression  = blockExpression  -- alt1\n | s<searchExpression>  -- alt2\n | s<lazyExpression>  -- alt3\n | s<forceExpression>  -- alt4\n | s<pipeExpression>  -- alt5\n\n\nsearchExpression  = search_ predicate  -- alt1\n\n\nlazyExpression  = lazy_ expression  -- alt1\n\n\nforceExpression  = force_ expression  -- alt1\n\n\nexpressionBlock  = do_ statements end_  -- alt1\n\n\npipeExpression  = pipeExpression s<"|>"> invokeInfixExpression  -- alt1\n | pipeExpression s<"|"> partialSignature<invokePostfix>  -- alt2\n | invokeInfixExpression  -- alt3\n\n\ninvokeInfixExpression  = invokeMixfix s<"=:="> invokeMixfix  -- alt1\n | invokeInfixExpression infix_symbol invokeMixfix  -- alt2\n | invokeMixfix  -- alt3\n\n\ninvokeMixfix  = castExpression signaturePair<invokePostfix>+  -- alt1\n | signaturePair<invokePostfix>+  -- alt2\n | castExpression  -- alt3\n\n\ncastExpression  = invokePrePost as castType  -- alt1\n | invokePrePost is_ typeAppPrimary  -- alt2\n | invokePrePost  -- alt3\n\n\ncastType  = typeAppPrimary  -- alt1\n\n\ninvokePrePost  = invokePrefix  -- alt1\n | invokePostfix  -- alt2\n\n\ninvokePrefix  = not applyExpression  -- alt1\n\n\ninvokePostfix  = invokePostfix atom  -- alt1\n | applyExpression  -- alt2\n\n\napplyExpression  = applyExpression s<"("> list0<expression, s<",">> s<")">  -- alt1\n | memberExpression  -- alt2\n\n\nmemberExpression  = memberExpression s<"."> recordField  -- alt1\n | memberExpression s<"."> memberSelection  -- alt2\n | primaryExpression  -- alt3\n\n\nmemberSelection  = s<"("> list1<fieldSelection, s<",">> s<")">  -- alt1\n\n\nfieldSelection  = recordField as_ recordField  -- alt1\n | recordField  -- alt2\n\n\nprimaryExpression  = newExpression<expression>  -- alt1\n | interpolateText<expression>  -- alt2\n | literalExpression  -- alt3\n | recordExpression<expression>  -- alt4\n | listExpression<expression>  -- alt5\n | lambdaExpression  -- alt6\n | hole  -- alt7\n | s<"#"> typeAppPrimary  -- alt8\n | return_  -- alt9\n | self_  -- alt10\n | atom  -- alt11\n | name  -- alt12\n | s<"("> expression s<")">  -- alt13\n\n\nconditionExpression  = condition_ conditionCase+ end_  -- alt1\n\n\nconditionCase  = when_ expression eblock  -- alt1\n | always_ eblock  -- alt2\n\n\nmatchSearchExpression  = match_ matchSearchCase+ end_  -- alt1\n\n\nmatchSearchCase  = when_ predicate eblock  -- alt1\n | always_ eblock  -- alt2\n\n\nforExpression  = for_ forExprMap  -- alt1\n\n\nforExprMap  = name in_ expression forExprMap1  -- alt1\n\n\nforExprMap1  = s<","> forExprMap  -- alt1\n | if_ expression forExprDo  -- alt2\n | forExprDo  -- alt3\n\n\nforExprDo  = expressionBlock  -- alt1\n\n\nnewExpression<e>  = new_ atom newFields<e>  -- alt1\n\n\nnewFields<e>  = s<"("> list1<e, s<",">> s<")">  -- alt1\n |   -- alt2\n\n\nlistExpression<e>  = s<"["> list0<e, s<",">> s<"]">  -- alt1\n\n\nrecordExpression<e>  = s<"["> s<"->"> s<"]">  -- alt1\n | s<"["> list1<recordPair<e>, s<",">> s<"]">  -- alt2\n\n\nrecordPair<e>  = recordField s<"->"> e  -- alt1\n\n\nrecordField  = (name | atom)  -- alt1\n | string  -- alt2\n | s<"["> expression s<"]">  -- alt3\n\n\nliteralExpression  = literal  -- alt1\n\n\nlambdaExpression  = s<"{"> expression s<"}">  -- alt1\n | s<"{"> list1<name, s<",">> in_ expression s<"}">  -- alt2\n\n\natomicExpression  = atom  -- alt1\n | lazyExpression  -- alt2\n | newExpression<atomicExpression>  -- alt3\n | literalExpression  -- alt4\n | recordExpression<atomicExpression>  -- alt5\n | listExpression<atomicExpression>  -- alt6\n\n\nblockExpression  = expressionBlock  -- alt1\n | conditionExpression  -- alt2\n | matchSearchExpression  -- alt3\n | forExpression  -- alt4\n\n\ninterpolateText<t>  = s<"\\""> interpolatePart<t>* "\\""  -- alt1\n\n\ninterpolatePart<p>  = "\\\\" escape_sequence  -- alt1\n | "[" s<p> s<"]">  -- alt2\n | ~"\\"" any  -- alt3\n\n\nliteral  = text  -- alt1\n | float  -- alt2\n | integer  -- alt3\n | boolean  -- alt4\n | nothing  -- alt5\n\n\nnothing  = nothing_  -- alt1\n\n\nboolean  = true_  -- alt1\n | false_  -- alt2\n\n\ntext  = string  -- alt1\n\n\ninteger  = s<t_integer>  -- alt1\n\n\nfloat  = s<t_float>  -- alt1\n\n\nstring  = s<t_text>  -- alt1\n\n\nhole  = s<"_"> ~name_rest  -- alt1\n\n\natom  = s<"\'"> t_atom  -- alt1\n | ~reserved s<t_atom> ~":"  -- alt2\n\n\nname  = s<t_name>  -- alt1\n\n\nkeyword  = s<t_keyword>  -- alt1\n\n\ninfix_symbol  = s<t_infix_symbol>  -- alt1\n\n\nnot  = not_  -- alt1\n\n\nand  = and_  -- alt1\n\n\nor  = or_  -- alt1\n\n\nas  = as_  -- alt1\n\n\nnamespace  = s<nonemptyListOf<t_atom, s<".">>>  -- alt1\n\n\nlogicSignature<t>  = t signaturePair<t>+  -- alt1\n | t atom  -- alt2\n | signaturePair<t>+  -- alt3\n\n\nsignaturePair<t>  = keyword t  -- alt1\n\n\npartialLogicSignature<t>  = signaturePair<t>+  -- alt1\n | atom  -- alt2\n\n\npartialSignature<t>  = signaturePair<t>+  -- alt1\n | infix_symbol t  -- alt2\n | atom  -- alt3\n | not  -- alt4\n\n\nsignature<t>  = t as asParameter  -- alt1\n | t infix_symbol t  -- alt2\n | t signaturePair<t>+  -- alt3\n | t atom  -- alt4\n | not t  -- alt5\n | signaturePair<t>+  -- alt6\n\n\nasParameter  = typeAppPrimary  -- alt1\n\n\nlist0<t, s>  = listOf<t, s> s?  -- alt1\n\n\nlist1<t, s>  = nonemptyListOf<t, s> s?  -- alt1\n\n\nblock<t>  = do_ t* end_  -- alt1\n\n\nstatements  = blockStatement s<";">? ws statements1  -- alt1\n | statement ws ";" ws statements1  -- alt2\n | statement s<";">?  -- alt3\n |   -- alt4\n\n\nstatements1  = blockStatement s<";">? ws statements1  -- alt1\n | statement ws ";" ws statements1  -- alt2\n | statement s<";">?  -- alt3\n\n\neblock  = do_ statements end_  -- alt1\n | s<"=>"> expression s<";">  -- alt2\n\n\ns<p>  = space* p  -- alt1\n\n\nws  = space*  -- alt1\n\n\nheader (a file header) = space* "%" hs* "crochet" nl  -- alt1\n\n\nhs  = " "  -- alt1\n | "\\t"  -- alt2\n\n\nnl  = "\\r\\n"  -- alt1\n | "\\n"  -- alt2\n | "\\r"  -- alt3\n\n\nline  = (~nl any)*  -- alt1\n\n\ncomment (a comment) = "//" ~"/" line  -- alt1\n\n\nspace += comment  -- alt1\n\n\ndoc (a documentation comment) = doc_line+  -- alt1\n\n\ndoc_line (a documentation comment) = "///" hs? line nl  -- alt1\n\n\nsemi  = s<";">  -- alt1\n\n\natom_start  = "a".."z"  -- alt1\n\n\natom_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_atom (an atom) = atom_start atom_rest*  -- alt1\n\n\nt_keyword (a keyword) = t_atom ":"  -- alt1\n\n\nname_start  = "A".."Z"  -- alt1\n | "_"  -- alt2\n\n\nname_rest  = letter  -- alt1\n | digit  -- alt2\n | "-"  -- alt3\n\n\nt_name (a name) = name_start name_rest*  -- alt1\n\n\nt_infix_symbol  = t_any_infix ~infix_character  -- alt1\n | and_  -- alt2\n | or_  -- alt3\n | as_  -- alt4\n\n\nt_any_infix  = "++"  -- alt1\n | "+"  -- alt2\n | "<-"  -- alt3\n | "-"  -- alt4\n | "**"  -- alt5\n | "*"  -- alt6\n | "/"  -- alt7\n | "<="  -- alt8\n | "<"  -- alt9\n | ">="  -- alt10\n | ">"  -- alt11\n | "==="  -- alt12\n | "=/="  -- alt13\n | "%"  -- alt14\n\n\ninfix_character  = "+"  -- alt1\n | "-"  -- alt2\n | "*"  -- alt3\n | "/"  -- alt4\n | "<"  -- alt5\n | ">"  -- alt6\n | "="  -- alt7\n | "%"  -- alt8\n\n\ndec_digit  = "0".."9"  -- alt1\n | "_"  -- alt2\n\n\nhex_digit  = "0".."9"  -- alt1\n | "a".."f"  -- alt2\n | "A".."F"  -- alt3\n\n\nt_integer (an integer) = ~"_" "-"? dec_digit+  -- alt1\n\n\nt_float (a floating point number) = ~"_" "-"? dec_digit+ "." dec_digit+  -- alt1\n\n\ntext_character  = "\\\\" escape_sequence  -- alt1\n | ~"\\"" any  -- alt2\n\n\nescape_sequence  = "u" hex_digit hex_digit hex_digit hex_digit  -- alt1\n | "x" hex_digit hex_digit  -- alt2\n | any  -- alt3\n\n\nt_text (a text) = "\\"" text_character* "\\""  -- alt1\n\n\nkw<w>  = s<w> ~atom_rest  -- alt1\n\n\nrelation_  = kw<"relation">  -- alt1\n\n\npredicate_  = kw<"predicate">  -- alt1\n\n\nwhen_  = kw<"when">  -- alt1\n\n\ndo_  = kw<"do">  -- alt1\n\n\ncommand_  = kw<"command">  -- alt1\n\n\ntype_  = kw<"type">  -- alt1\n\n\nenum_  = kw<"enum">  -- alt1\n\n\ndefine_  = kw<"define">  -- alt1\n\n\nsingleton_  = kw<"singleton">  -- alt1\n\n\nscene_  = kw<"scene">  -- alt1\n\n\naction_  = kw<"action">  -- alt1\n\n\nlet_  = kw<"let">  -- alt1\n\n\nreturn_  = kw<"return">  -- alt1\n\n\nfact_  = kw<"fact">  -- alt1\n\n\nforget_  = kw<"forget">  -- alt1\n\n\nnew_  = kw<"new">  -- alt1\n\n\nsearch_  = kw<"search">  -- alt1\n\n\nif_  = kw<"if">  -- alt1\n\n\nthen_  = kw<"then">  -- alt1\n\n\nelse_  = kw<"else">  -- alt1\n\n\ngoto_  = kw<"goto">  -- alt1\n\n\ncall_  = kw<"call">  -- alt1\n\n\nsimulate_  = kw<"simulate">  -- alt1\n\n\nmatch_  = kw<"match">  -- alt1\n\n\ntrue_  = kw<"true">  -- alt1\n\n\nfalse_  = kw<"false">  -- alt1\n\n\nnot_  = kw<"not">  -- alt1\n\n\nand_  = kw<"and">  -- alt1\n\n\nor_  = kw<"or">  -- alt1\n\n\nis_  = kw<"is">  -- alt1\n\n\nself_  = kw<"self">  -- alt1\n\n\nas_  = kw<"as">  -- alt1\n\n\nevent_  = kw<"event">  -- alt1\n\n\nquiescence_  = kw<"quiescence">  -- alt1\n\n\nfor_  = kw<"for">  -- alt1\n\n\nuntil_  = kw<"until">  -- alt1\n\n\nin_  = kw<"in">  -- alt1\n\n\nforeign_  = kw<"foreign">  -- alt1\n\n\non_  = kw<"on">  -- alt1\n\n\nalways_  = kw<"always">  -- alt1\n\n\ncondition_  = kw<"condition">  -- alt1\n\n\nend_  = kw<"end">  -- alt1\n\n\nprelude_  = kw<"prelude">  -- alt1\n\n\nwith_  = kw<"with">  -- alt1\n\n\ntags_  = kw<"tags">  -- alt1\n\n\nrank_  = kw<"rank">  -- alt1\n\n\nabstract_  = kw<"abstract">  -- alt1\n\n\nlazy_  = kw<"lazy">  -- alt1\n\n\nforce_  = kw<"force">  -- alt1\n\n\ncontext_  = kw<"context">  -- alt1\n\n\nsample_  = kw<"sample">  -- alt1\n\n\nof_  = kw<"of">  -- alt1\n\n\nopen_  = kw<"open">  -- alt1\n\n\nlocal_  = kw<"local">  -- alt1\n\n\ntest_  = kw<"test">  -- alt1\n\n\nassert_  = kw<"assert">  -- alt1\n\n\nrequires_  = kw<"requires">  -- alt1\n\n\nensures_  = kw<"ensures">  -- alt1\n\n\nnothing_  = kw<"nothing">  -- alt1\n\n\nreserved  = relation_  -- alt1\n | predicate_  -- alt2\n | when_  -- alt3\n | do_  -- alt4\n | command_  -- alt5\n | scene_  -- alt6\n | action_  -- alt7\n | type_  -- alt8\n | enum_  -- alt9\n | define_  -- alt10\n | singleton_  -- alt11\n | goto_  -- alt12\n | call_  -- alt13\n | let_  -- alt14\n | return_  -- alt15\n | fact_  -- alt16\n | forget_  -- alt17\n | new_  -- alt18\n | search_  -- alt19\n | if_  -- alt20\n | simulate_  -- alt21\n | true_  -- alt22\n | false_  -- alt23\n | not_  -- alt24\n | and_  -- alt25\n | or_  -- alt26\n | is_  -- alt27\n | self_  -- alt28\n | as_  -- alt29\n | event_  -- alt30\n | quiescence_  -- alt31\n | for_  -- alt32\n | until_  -- alt33\n | in_  -- alt34\n | foreign_  -- alt35\n | on_  -- alt36\n | always_  -- alt37\n | match_  -- alt38\n | then_  -- alt39\n | else_  -- alt40\n | condition_  -- alt41\n | end_  -- alt42\n | prelude_  -- alt43\n | with_  -- alt44\n | tags_  -- alt45\n | rank_  -- alt46\n | abstract_  -- alt47\n | lazy_  -- alt48\n | force_  -- alt49\n | context_  -- alt50\n | sample_  -- alt51\n | of_  -- alt52\n | open_  -- alt53\n | local_  -- alt54\n | test_  -- alt55\n | assert_  -- alt56\n | requires_  -- alt57\n | ensures_  -- alt58\n | nothing_  -- alt59\n\r\n  }\r\n  ');
// == Parsing =======================================================
function parse(source, rule) {
    const result = exports.grammar.match(source, rule);
    if (result.failed()) {
        return { ok: false, error: result.message };
    }
    else {
        const ast = toAst(result);
        $assert_type(ast, "Program", Program);
        return { ok: true, value: ast };
    }
}
exports.parse = parse;
exports.semantics = exports.grammar.createSemantics();
exports.toAstVisitor = {
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
        const ds = ds$0.toAST();
        return new Program($meta(this), ds);
    },
    repl(x) {
        return x.toAST();
    },
    repl_alt1(_1, ds$0, _3, _4) {
        const ds = ds$0.toAST();
        return new REPL.Declarations(ds);
    },
    repl_alt2(_1, xs$0, _3, _4) {
        const xs = xs$0.toAST();
        return new REPL.Statements(xs);
    },
    repl_alt3(_1, x$0, _3, _4) {
        const x = x$0.toAST();
        return new REPL.Command(x);
    },
    replCommand(x) {
        return x.toAST();
    },
    replCommand_alt1(_1, _2, s$0) {
        const s = s$0.toAST();
        return new ReplCommand.Rollback(s);
    },
    replCommand_alt2(_1, _2, _3, s$0) {
        const s = s$0.toAST();
        return new ReplCommand.HelpCommand(s);
    },
    replCommand_alt3(_1, _2, _3, t$0) {
        const t = t$0.toAST();
        return new ReplCommand.HelpType(t);
    },
    declarationMeta(x) {
        return x.toAST();
    },
    declarationMeta_alt1(_1, d$0) {
        const d = d$0.toAST();
        return new Metadata(d);
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
    testDeclaration(x) {
        return x.toAST();
    },
    testDeclaration_alt1(_1, s$0, _3, b$0, _5) {
        const s = s$0.toAST();
        const b = b$0.toAST();
        return new Declaration.Test($meta(this), s, b);
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
        const b = b$0.toAST();
        return new TrailingTest($meta(this), b);
    },
    localDeclaration(x) {
        return x.toAST();
    },
    localDeclaration_alt1(_1, d$0) {
        const d = d$0.toAST();
        return new Declaration.Local($meta(this), d);
    },
    localDeclaration_alt2(_1, t$0) {
        const t = t$0.toAST();
        return new Declaration.Local($meta(this), t);
    },
    openDeclaration(x) {
        return x.toAST();
    },
    openDeclaration_alt1(_1, ns$0, _3) {
        const ns = ns$0.toAST();
        return new Declaration.Open($meta(this), ns);
    },
    relationDeclaration(x) {
        return x.toAST();
    },
    relationDeclaration_alt1(m$0, _2, _3, s$0, _5) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        return new Declaration.Relation($meta(this), m, s);
    },
    relationPart(x) {
        return x.toAST();
    },
    relationPart_alt1(n$0, _2) {
        const n = n$0.toAST();
        return new RelationPart.Many($meta(this), n);
    },
    relationPart_alt2(n$0) {
        const n = n$0.toAST();
        return new RelationPart.One($meta(this), n);
    },
    predicateDeclaration(x) {
        return x.toAST();
    },
    predicateDeclaration_alt1(m$0, _2, _3, l$0, c$0) {
        const m = m$0.toAST();
        const l = l$0.toAST();
        const c = c$0.toAST();
        return new Declaration.DefinePredicate($meta(this), m, l, c);
    },
    predicateClause(x) {
        return x.toAST();
    },
    predicateClause_alt1(_1, p$0, _3) {
        const p = p$0.toAST();
        return new PredicateClause($meta(this), p, new PredicateEffect.Trivial());
    },
    predicateClause_alt2(_1, p$0, _3) {
        const p = p$0.toAST();
        return new PredicateClause($meta(this), new Predicate.Always($meta(this)), new PredicateEffect.Trivial());
    },
    doDeclaration(x) {
        return x.toAST();
    },
    doDeclaration_alt1(_1, xs$0, _3) {
        const xs = xs$0.toAST();
        return new Declaration.Do($meta(this), xs);
    },
    commandDeclaration(x) {
        return x.toAST();
    },
    commandDeclaration_alt1(m$0, _2, _3, s$0, c$0, _6, _7, b$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        const t = t$0.toAST();
        return new Declaration.ForeignCommand($meta(this), m, s, c, b, t);
    },
    commandDeclaration_alt2(m$0, _2, _3, s$0, c$0, _6, e$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const e = e$0.toAST();
        const t = t$0.toAST();
        return new Declaration.Command($meta(this), m, s, c, [new Statement.Expr(e)], t);
    },
    commandDeclaration_alt3(m$0, _2, _3, s$0, c$0, _6, b$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        const t = t$0.toAST();
        return new Declaration.Command($meta(this), m, s, c, b, t);
    },
    commandDeclaration_alt4(m$0, _2, _3, s$0, c$0, _6, b$0, _8) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        return new Declaration.Command($meta(this), m, s, c, b, null);
    },
    contractDefinition(x) {
        return x.toAST();
    },
    contractDefinition_alt1(ret$0, pre$0, post$0) {
        const ret = ret$0.toAST();
        const pre = pre$0.toAST();
        const post = post$0.toAST();
        return new Contract($meta(this), ret, pre, post);
    },
    retContractDefinition(x) {
        return x.toAST();
    },
    retContractDefinition_alt1(_1, t$0) {
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
        const e = e$0.toAST();
        return new ContractCondition($meta(this), n, e);
    },
    foreignBody(x) {
        return x.toAST();
    },
    foreignBody_alt1(n$0, _2, xs$0, _4) {
        const n = n$0.toAST();
        const xs = xs$0.toAST();
        return new FFI($meta(this), n, xs);
    },
    parameter(x) {
        return x.toAST();
    },
    parameter_alt1(n$0) {
        const n = n$0.toAST();
        return new Parameter.Untyped($meta(this), n);
    },
    parameter_alt2(_1, n$0, _3, t$0, _5) {
        const n = n$0.toAST();
        const t = t$0.toAST();
        return new Parameter.Typed($meta(this), n, t);
    },
    parameter_alt3(t$0) {
        const t = t$0.toAST();
        return new Parameter.TypedOnly($meta(this), t);
    },
    typeApp(x) {
        return x.toAST();
    },
    typeApp_alt1(_1) {
        return this.children[0].toAST();
    },
    typeAppStatic(x) {
        return x.toAST();
    },
    typeAppStatic_alt1(_1, t$0) {
        const t = t$0.toAST();
        return new TypeApp.Static($meta(this), t);
    },
    typeAppStatic_alt2(_1) {
        return this.children[0].toAST();
    },
    typeAppPrimary(x) {
        return x.toAST();
    },
    typeAppPrimary_alt1(t$0) {
        const t = t$0.toAST();
        return new TypeApp.Named($meta(this), t);
    },
    typeName(x) {
        return x.toAST();
    },
    typeName_alt1(_1) {
        return this.children[0].toAST();
    },
    typeName_alt2(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    typeName_alt3(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    typeName_alt4(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    typeDeclaration(x) {
        return x.toAST();
    },
    typeDeclaration_alt1(m$0, _2, _3, t$0, _5, vs$0, _7) {
        const m = m$0.toAST();
        const t = t$0.toAST();
        const vs = vs$0.toAST();
        return new Declaration.EnumType($meta(this), m, t, vs);
    },
    typeDeclaration_alt2(m$0, _2, _3, t$0, _5) {
        const m = m$0.toAST();
        const t = t$0.toAST();
        return new Declaration.AbstractType($meta(this), m, t);
    },
    typeDeclaration_alt3(m$0, _2, _3, t$0, i$0) {
        const m = m$0.toAST();
        const t = t$0.toAST();
        const i = i$0.toAST();
        return new Declaration.SingletonType($meta(this), m, t, i);
    },
    typeDeclaration_alt4(m$0, _2, _3, t$0, fs$0, _6) {
        const m = m$0.toAST();
        const t = t$0.toAST();
        const fs = fs$0.toAST();
        return new Declaration.Type($meta(this), m, t, fs);
    },
    typeDeclaration_alt5(m$0, _2, _3, n$0, _5, _6, ns$0, _8) {
        const m = m$0.toAST();
        const n = n$0.toAST();
        const ns = ns$0.toAST();
        return new Declaration.ForeignType($meta(this), m, n, ns);
    },
    basicType(x) {
        return x.toAST();
    },
    basicType_alt1(n$0, p$0) {
        const n = n$0.toAST();
        const p = p$0.toAST();
        return new TypeDef(p, n);
    },
    typeDefParent(x) {
        return x.toAST();
    },
    typeDefParent_alt1(_1, t$0) {
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
        const fs = fs$0.toAST();
        return fs;
    },
    typeFields_alt2() {
        return [];
    },
    typeField(x) {
        return x.toAST();
    },
    typeField_alt1(n$0, _2, t$0) {
        const n = n$0.toAST();
        const t = t$0.toAST();
        return new Parameter.Typed($meta(this), n, t);
    },
    typeField_alt2(n$0) {
        const n = n$0.toAST();
        return new Parameter.Untyped($meta(this), n);
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
        return new TypeInit.Fact($meta(this), s);
    },
    typeInit_alt2(m$0, _2, _3, s$0, c$0, _6, b$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        const t = t$0.toAST();
        return new TypeInit.ForeignCommand($meta(this), m, s, c, b, t);
    },
    typeInit_alt3(m$0, _2, _3, s$0, c$0, _6, e$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const e = e$0.toAST();
        const t = t$0.toAST();
        return new TypeInit.Command($meta(this), m, s, c, [new Statement.Expr(e)], t);
    },
    typeInit_alt4(m$0, _2, _3, s$0, c$0, _6, b$0, t$0) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        const t = t$0.toAST();
        return new TypeInit.Command($meta(this), m, s, c, b, t);
    },
    typeInit_alt5(m$0, _2, _3, s$0, c$0, _6, b$0, _8) {
        const m = m$0.toAST();
        const s = s$0.toAST();
        const c = c$0.toAST();
        const b = b$0.toAST();
        return new TypeInit.Command($meta(this), m, s, c, b, null);
    },
    defineDeclaration(x) {
        return x.toAST();
    },
    defineDeclaration_alt1(m$0, _2, _3, n$0, _5, e$0, _7) {
        const m = m$0.toAST();
        const n = n$0.toAST();
        const e = e$0.toAST();
        return new Declaration.Define($meta(this), m, n, e);
    },
    sceneDeclaration(x) {
        return x.toAST();
    },
    sceneDeclaration_alt1(m$0, _2, _3, n$0, _5, b$0, _7) {
        const m = m$0.toAST();
        const n = n$0.toAST();
        const b = b$0.toAST();
        return new Declaration.Scene($meta(this), m, n, b);
    },
    actionDeclaration(x) {
        return x.toAST();
    },
    actionDeclaration_alt1(m$0, _2, _3, t$0, typ$0, tags$0, p$0, r$0, _9, b$0, _11) {
        const m = m$0.toAST();
        const t = t$0.toAST();
        const typ = typ$0.toAST();
        const tags = tags$0.toAST();
        const p = p$0.toAST();
        const r = r$0.toAST();
        const b = b$0.toAST();
        return new Declaration.Action($meta(this), m, typ, t, tags, p, r, b);
    },
    actionType(x) {
        return x.toAST();
    },
    actionType_alt1(_1, t$0) {
        const t = t$0.toAST();
        return t;
    },
    actionType_alt2() {
        return new TypeApp.Any($meta(this));
    },
    actionTitle(x) {
        return x.toAST();
    },
    actionTitle_alt1(t$0) {
        const t = t$0.toAST();
        return new Expression.Interpolate($meta(this), t);
    },
    actionTags(x) {
        return x.toAST();
    },
    actionTags_alt1(_1, es$0) {
        const es = es$0.toAST();
        return es;
    },
    actionTags_alt2() {
        return [];
    },
    actionPredicate(x) {
        return x.toAST();
    },
    actionPredicate_alt1(_1, p$0) {
        const p = p$0.toAST();
        return p;
    },
    actionPredicate_alt2() {
        return new Predicate.Always($meta(this));
    },
    actionRank(x) {
        return x.toAST();
    },
    actionRank_alt1(_1, e$0) {
        const e = e$0.toAST();
        return new Rank.Expr(e);
    },
    actionRank_alt2() {
        return new Rank.Unranked($meta(this));
    },
    whenDeclaration(x) {
        return x.toAST();
    },
    whenDeclaration_alt1(m$0, _2, _3, p$0, _5, b$0, _7) {
        const m = m$0.toAST();
        const p = p$0.toAST();
        const b = b$0.toAST();
        return new Declaration.When($meta(this), m, p, b);
    },
    contextDeclaration(x) {
        return x.toAST();
    },
    contextDeclaration_alt1(m$0, _2, _3, n$0, _5, xs$0, _7) {
        const m = m$0.toAST();
        const n = n$0.toAST();
        const xs = xs$0.toAST();
        return new Declaration.Context($meta(this), m, n, xs);
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
        const r = r$0.toAST();
        return new Predicate.And($meta(this), l, r);
    },
    predicateAnd1(x) {
        return x.toAST();
    },
    predicateAnd1_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Predicate.And($meta(this), l, r);
    },
    predicateAnd1_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateOr(x) {
        return x.toAST();
    },
    predicateOr_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Predicate.Or($meta(this), l, r);
    },
    predicateOr1(x) {
        return x.toAST();
    },
    predicateOr1_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Predicate.Or($meta(this), l, r);
    },
    predicateOr1_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateNot(x) {
        return x.toAST();
    },
    predicateNot_alt1(_1, p$0) {
        const p = p$0.toAST();
        return new Predicate.Not($meta(this), p);
    },
    predicateNot_alt2(_1) {
        return this.children[0].toAST();
    },
    predicateConstrain(x) {
        return x.toAST();
    },
    predicateConstrain_alt1(p$0, _2, c$0) {
        const p = p$0.toAST();
        const c = c$0.toAST();
        return new Predicate.Constrain($meta(this), p, c);
    },
    predicateConstrain_alt2(_1, c$0) {
        const c = c$0.toAST();
        return new Predicate.Constrain($meta(this), new Predicate.Always($meta(this)), c);
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
        const t = t$0.toAST();
        return new Predicate.Typed($meta(this), n, t);
    },
    predicateLet(x) {
        return x.toAST();
    },
    predicateLet_alt1(_1, n$0, _3, e$0) {
        const n = n$0.toAST();
        const e = e$0.toAST();
        return new Predicate.Let($meta(this), n, e);
    },
    predicateSample(x) {
        return x.toAST();
    },
    predicateSample_alt1(_1, n$0, _3, p$0) {
        const n = n$0.toAST();
        const p = p$0.toAST();
        return new Predicate.Sample($meta(this), n, p);
    },
    samplingPool(x) {
        return x.toAST();
    },
    samplingPool_alt1(r$0) {
        const r = r$0.toAST();
        return new SamplingPool.Relation($meta(this), r);
    },
    samplingPool_alt2(l$0, _2, t$0) {
        const l = l$0.toAST();
        const t = t$0.toAST();
        return new SamplingPool.Type($meta(this), l, t);
    },
    predicatePrimary(x) {
        return x.toAST();
    },
    predicatePrimary_alt1(_1) {
        return new Predicate.Always($meta(this));
    },
    predicatePrimary_alt2(r$0) {
        const r = r$0.toAST();
        return new Predicate.Has($meta(this), r);
    },
    predicatePrimary_alt3(_1, p$0, _3) {
        const p = p$0.toAST();
        return new Predicate.Parens($meta(this), p);
    },
    pattern(x) {
        return x.toAST();
    },
    pattern_alt1(_1, c$0, _3) {
        const c = c$0.toAST();
        return c;
    },
    pattern_alt2(n$0) {
        const n = n$0.toAST();
        return new Pattern.Global($meta(this), n);
    },
    pattern_alt3(_1) {
        return new Pattern.Self($meta(this));
    },
    pattern_alt4(l$0) {
        const l = l$0.toAST();
        return new Pattern.Lit(l);
    },
    pattern_alt5(_1) {
        return this.children[0].toAST();
    },
    patternComplex(x) {
        return x.toAST();
    },
    patternComplex_alt1(n$0, _2, t$0) {
        const n = n$0.toAST();
        const t = t$0.toAST();
        return new Pattern.HasType($meta(this), t, n);
    },
    patternName(x) {
        return x.toAST();
    },
    patternName_alt1(_1) {
        return new Pattern.Wildcard($meta(this));
    },
    patternName_alt2(n$0) {
        const n = n$0.toAST();
        return new Pattern.Variable($meta(this), n);
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
    statement_alt6(_1) {
        return this.children[0].toAST();
    },
    statement_alt7(_1) {
        return this.children[0].toAST();
    },
    statement_alt8(e$0) {
        const e = e$0.toAST();
        return new Statement.Expr(e);
    },
    blockStatement(x) {
        return x.toAST();
    },
    blockStatement_alt1(x$0) {
        const x = x$0.toAST();
        return new Statement.Expr(x);
    },
    letStatement(x) {
        return x.toAST();
    },
    letStatement_alt1(_1, n$0, _3, e$0) {
        const n = n$0.toAST();
        const e = e$0.toAST();
        return new Statement.Let($meta(this), n, e);
    },
    factStatement(x) {
        return x.toAST();
    },
    factStatement_alt1(_1, s$0) {
        const s = s$0.toAST();
        return new Statement.Fact($meta(this), s);
    },
    forgetStatement(x) {
        return x.toAST();
    },
    forgetStatement_alt1(_1, s$0) {
        const s = s$0.toAST();
        return new Statement.Forget($meta(this), s);
    },
    gotoStatement(x) {
        return x.toAST();
    },
    gotoStatement_alt1(_1, n$0) {
        const n = n$0.toAST();
        return new Statement.Goto($meta(this), n);
    },
    callStatement(x) {
        return x.toAST();
    },
    callStatement_alt1(_1, n$0) {
        const n = n$0.toAST();
        return new Statement.Call($meta(this), n);
    },
    simulateStatement(x) {
        return x.toAST();
    },
    simulateStatement_alt1(_1, _2, e$0, c$0, _5, g$0, s$0) {
        const e = e$0.toAST();
        const c = c$0.toAST();
        const g = g$0.toAST();
        const s = s$0.toAST();
        return new Statement.Simulate($meta(this), e, c, g, s);
    },
    simulateContext(x) {
        return x.toAST();
    },
    simulateContext_alt1(_1, n$0) {
        const n = n$0.toAST();
        return new SimulationContext.Named($meta(this), n);
    },
    simulateContext_alt2() {
        return new SimulationContext.Global();
    },
    simulateGoal(x) {
        return x.toAST();
    },
    simulateGoal_alt1(_1, _2) {
        return new SimulationGoal.ActionQuiescence($meta(this));
    },
    simulateGoal_alt2(_1, _2) {
        return new SimulationGoal.EventQuiescence($meta(this));
    },
    simulateGoal_alt3(_1) {
        return new SimulationGoal.TotalQuiescence($meta(this));
    },
    simulateGoal_alt4(p$0) {
        const p = p$0.toAST();
        return new SimulationGoal.CustomGoal($meta(this), p);
    },
    signal(x) {
        return x.toAST();
    },
    signal_alt1(_1, s$0, _3, b$0, _5) {
        const s = s$0.toAST();
        const b = b$0.toAST();
        return new Signal($meta(this), s, b);
    },
    assertStatement(x) {
        return x.toAST();
    },
    assertStatement_alt1(_1, e$0) {
        const e = e$0.toAST();
        return new Statement.Assert($meta(this), e);
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
    searchExpression(x) {
        return x.toAST();
    },
    searchExpression_alt1(_1, p$0) {
        const p = p$0.toAST();
        return new Expression.Search($meta(this), p);
    },
    lazyExpression(x) {
        return x.toAST();
    },
    lazyExpression_alt1(_1, e$0) {
        const e = e$0.toAST();
        return new Expression.Lazy($meta(this), e);
    },
    forceExpression(x) {
        return x.toAST();
    },
    forceExpression_alt1(_1, e$0) {
        const e = e$0.toAST();
        return new Expression.Force($meta(this), e);
    },
    expressionBlock(x) {
        return x.toAST();
    },
    expressionBlock_alt1(_1, b$0, _3) {
        const b = b$0.toAST();
        return new Expression.Block($meta(this), b);
    },
    pipeExpression(x) {
        return x.toAST();
    },
    pipeExpression_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Expression.Pipe($meta(this), l, r);
    },
    pipeExpression_alt2(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Expression.PipeInvoke($meta(this), l, r);
    },
    pipeExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    invokeInfixExpression(x) {
        return x.toAST();
    },
    invokeInfixExpression_alt1(l$0, _2, r$0) {
        const l = l$0.toAST();
        const r = r$0.toAST();
        return new Expression.IntrinsicEqual($meta(this), l, r);
    },
    invokeInfixExpression_alt2(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.Binary($meta(this), op, l, r));
    },
    invokeInfixExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    invokeMixfix(x) {
        return x.toAST();
    },
    invokeMixfix_alt1(s$0, ps$0) {
        const s = s$0.toAST();
        const ps = ps$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.Keyword($meta(this), s, ps));
    },
    invokeMixfix_alt2(ps$0) {
        const ps = ps$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.KeywordSelfless($meta(this), ps));
    },
    invokeMixfix_alt3(_1) {
        return this.children[0].toAST();
    },
    castExpression(x) {
        return x.toAST();
    },
    castExpression_alt1(s$0, op$0, t$0) {
        const s = s$0.toAST();
        const op = op$0.toAST();
        const t = t$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.Binary($meta(this), op, s, t));
    },
    castExpression_alt2(s$0, _2, t$0) {
        const s = s$0.toAST();
        const t = t$0.toAST();
        return new Expression.HasType($meta(this), s, t);
    },
    castExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    castType(x) {
        return x.toAST();
    },
    castType_alt1(t$0) {
        const t = t$0.toAST();
        return new Expression.Type($meta(this), t);
    },
    invokePrePost(x) {
        return x.toAST();
    },
    invokePrePost_alt1(_1) {
        return this.children[0].toAST();
    },
    invokePrePost_alt2(_1) {
        return this.children[0].toAST();
    },
    invokePrefix(x) {
        return x.toAST();
    },
    invokePrefix_alt1(n$0, p$0) {
        const n = n$0.toAST();
        const p = p$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.Unary($meta(this), p, n));
    },
    invokePostfix(x) {
        return x.toAST();
    },
    invokePostfix_alt1(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return new Expression.Invoke($meta(this), new Signature.Unary($meta(this), s, n));
    },
    invokePostfix_alt2(_1) {
        return this.children[0].toAST();
    },
    applyExpression(x) {
        return x.toAST();
    },
    applyExpression_alt1(f$0, _2, xs$0, _4) {
        const f = f$0.toAST();
        const xs = xs$0.toAST();
        return new Expression.Apply($meta(this), f, xs);
    },
    applyExpression_alt2(_1) {
        return this.children[0].toAST();
    },
    memberExpression(x) {
        return x.toAST();
    },
    memberExpression_alt1(o$0, _2, f$0) {
        const o = o$0.toAST();
        const f = f$0.toAST();
        return new Expression.Project($meta(this), o, f);
    },
    memberExpression_alt2(o$0, _2, p$0) {
        const o = o$0.toAST();
        const p = p$0.toAST();
        return new Expression.Select($meta(this), o, p);
    },
    memberExpression_alt3(_1) {
        return this.children[0].toAST();
    },
    memberSelection(x) {
        return x.toAST();
    },
    memberSelection_alt1(_1, xs$0, _3) {
        const xs = xs$0.toAST();
        return xs;
    },
    fieldSelection(x) {
        return x.toAST();
    },
    fieldSelection_alt1(n$0, _2, a$0) {
        const n = n$0.toAST();
        const a = a$0.toAST();
        return new Projection($meta(this), n, a);
    },
    fieldSelection_alt2(n$0) {
        const n = n$0.toAST();
        return new Projection($meta(this), n, n);
    },
    primaryExpression(x) {
        return x.toAST();
    },
    primaryExpression_alt1(_1) {
        return this.children[0].toAST();
    },
    primaryExpression_alt2(x$0) {
        const x = x$0.toAST();
        return new Expression.Interpolate($meta(this), x);
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
    primaryExpression_alt8(_1, t$0) {
        const t = t$0.toAST();
        return new Expression.Type($meta(this), t);
    },
    primaryExpression_alt9(_1) {
        return new Expression.Return($meta(this));
    },
    primaryExpression_alt10(_1) {
        return new Expression.Self($meta(this));
    },
    primaryExpression_alt11(n$0) {
        const n = n$0.toAST();
        return new Expression.Global($meta(this), n);
    },
    primaryExpression_alt12(n$0) {
        const n = n$0.toAST();
        return new Expression.Variable($meta(this), n);
    },
    primaryExpression_alt13(_1, e$0, _3) {
        const e = e$0.toAST();
        return new Expression.Parens($meta(this), e);
    },
    conditionExpression(x) {
        return x.toAST();
    },
    conditionExpression_alt1(_1, cs$0, _3) {
        const cs = cs$0.toAST();
        return new Expression.Condition($meta(this), cs);
    },
    conditionCase(x) {
        return x.toAST();
    },
    conditionCase_alt1(_1, e$0, b$0) {
        const e = e$0.toAST();
        const b = b$0.toAST();
        return new ConditionCase($meta(this), e, b);
    },
    conditionCase_alt2(_1, b$0) {
        const b = b$0.toAST();
        return new ConditionCase($meta(this), new Expression.Lit(new Literal.True($meta(this))), b);
    },
    matchSearchExpression(x) {
        return x.toAST();
    },
    matchSearchExpression_alt1(_1, c$0, _3) {
        const c = c$0.toAST();
        return new Expression.MatchSearch($meta(this), c);
    },
    matchSearchCase(x) {
        return x.toAST();
    },
    matchSearchCase_alt1(_1, p$0, b$0) {
        const p = p$0.toAST();
        const b = b$0.toAST();
        return new MatchSearchCase($meta(this), p, b);
    },
    matchSearchCase_alt2(_1, b$0) {
        const b = b$0.toAST();
        return new MatchSearchCase($meta(this), new Predicate.Always($meta(this)), b);
    },
    forExpression(x) {
        return x.toAST();
    },
    forExpression_alt1(_1, b$0) {
        const b = b$0.toAST();
        return new Expression.For($meta(this), b);
    },
    forExprMap(x) {
        return x.toAST();
    },
    forExprMap_alt1(n$0, _2, e$0, r$0) {
        const n = n$0.toAST();
        const e = e$0.toAST();
        const r = r$0.toAST();
        return new ForExpression.Map($meta(this), n, e, r);
    },
    forExprMap1(x) {
        return x.toAST();
    },
    forExprMap1_alt1(_1, b$0) {
        const b = b$0.toAST();
        return b;
    },
    forExprMap1_alt2(_1, e$0, b$0) {
        const e = e$0.toAST();
        const b = b$0.toAST();
        return new ForExpression.If($meta(this), e, b);
    },
    forExprMap1_alt3(_1) {
        return this.children[0].toAST();
    },
    forExprDo(x) {
        return x.toAST();
    },
    forExprDo_alt1(b$0) {
        const b = b$0.toAST();
        return new ForExpression.Do($meta(this), b);
    },
    newExpression(x) {
        return x.toAST();
    },
    newExpression_alt1(_1, n$0, fs$0) {
        const n = n$0.toAST();
        const fs = fs$0.toAST();
        return new Expression.New($meta(this), n, fs);
    },
    newFields(x) {
        return x.toAST();
    },
    newFields_alt1(_1, fs$0, _3) {
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
        const xs = xs$0.toAST();
        return new Expression.List($meta(this), xs);
    },
    recordExpression(x) {
        return x.toAST();
    },
    recordExpression_alt1(_1, _2, _3) {
        return new Expression.Record($meta(this), []);
    },
    recordExpression_alt2(_1, xs$0, _3) {
        const xs = xs$0.toAST();
        return new Expression.Record($meta(this), xs);
    },
    recordPair(x) {
        return x.toAST();
    },
    recordPair_alt1(n$0, _2, v$0) {
        const n = n$0.toAST();
        const v = v$0.toAST();
        return new Pair($meta(this), n, v);
    },
    recordField(x) {
        return x.toAST();
    },
    recordField_alt1(n$0) {
        const n = n$0.toAST();
        return new RecordField.FName(n);
    },
    recordField_alt2(t$0) {
        const t = t$0.toAST();
        return new RecordField.FText(t);
    },
    recordField_alt3(_1, e$0, _3) {
        const e = e$0.toAST();
        return new RecordField.FComputed(e);
    },
    literalExpression(x) {
        return x.toAST();
    },
    literalExpression_alt1(l$0) {
        const l = l$0.toAST();
        return new Expression.Lit(l);
    },
    lambdaExpression(x) {
        return x.toAST();
    },
    lambdaExpression_alt1(_1, e$0, _3) {
        const e = e$0.toAST();
        return new Expression.Lambda($meta(this), [], e);
    },
    lambdaExpression_alt2(_1, p$0, _3, e$0, _5) {
        const p = p$0.toAST();
        const e = e$0.toAST();
        return new Expression.Lambda($meta(this), p, e);
    },
    atomicExpression(x) {
        return x.toAST();
    },
    atomicExpression_alt1(a$0) {
        const a = a$0.toAST();
        return new Expression.Global($meta(this), a);
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
    interpolateText(x) {
        return x.toAST();
    },
    interpolateText_alt1(_1, xs$0, _3) {
        const xs = xs$0.toAST();
        return new Interpolation($meta(this), xs);
    },
    interpolatePart(x) {
        return x.toAST();
    },
    interpolatePart_alt1(_1, c$0) {
        const c = c$0.toAST();
        return new InterpolationPart.Escape($meta(this), c);
    },
    interpolatePart_alt2(_1, x$0, _3) {
        const x = x$0.toAST();
        return new InterpolationPart.Dynamic($meta(this), x);
    },
    interpolatePart_alt3(c$0) {
        const c = c$0.toAST();
        return new InterpolationPart.Static($meta(this), c);
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
        return new Literal.Nothing($meta(this));
    },
    boolean(x) {
        return x.toAST();
    },
    boolean_alt1(_1) {
        return new Literal.True($meta(this));
    },
    boolean_alt2(_1) {
        return new Literal.False($meta(this));
    },
    text(x) {
        return x.toAST();
    },
    text_alt1(x$0) {
        const x = x$0.toAST();
        return new Literal.Text($meta(this), x);
    },
    integer(x) {
        return x.toAST();
    },
    integer_alt1(x$0) {
        const x = x$0.toAST();
        return new Literal.Integer($meta(this), x);
    },
    float(x) {
        return x.toAST();
    },
    float_alt1(x$0) {
        const x = x$0.toAST();
        return new Literal.Float($meta(this), x);
    },
    string(x) {
        return x.toAST();
    },
    string_alt1(x$0) {
        const x = x$0.toAST();
        return new String($meta(this), x);
    },
    hole(x) {
        return x.toAST();
    },
    hole_alt1(x$0) {
        const x = x$0.toAST();
        return new Expression.Hole($meta(this));
    },
    atom(x) {
        return x.toAST();
    },
    atom_alt1(_1, x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    atom_alt2(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    name(x) {
        return x.toAST();
    },
    name_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    keyword(x) {
        return x.toAST();
    },
    keyword_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    infix_symbol(x) {
        return x.toAST();
    },
    infix_symbol_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    not(x) {
        return x.toAST();
    },
    not_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    and(x) {
        return x.toAST();
    },
    and_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    or(x) {
        return x.toAST();
    },
    or_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    as(x) {
        return x.toAST();
    },
    as_alt1(x$0) {
        const x = x$0.toAST();
        return new Name($meta(this), x);
    },
    namespace(x) {
        return x.toAST();
    },
    namespace_alt1(x$0) {
        const x = x$0.toAST();
        return new Namespace($meta(this), x);
    },
    logicSignature(x) {
        return x.toAST();
    },
    logicSignature_alt1(s$0, kws$0) {
        const s = s$0.toAST();
        const kws = kws$0.toAST();
        return new Signature.Keyword($meta(this), s, kws);
    },
    logicSignature_alt2(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return new Signature.Unary($meta(this), s, n);
    },
    logicSignature_alt3(kws$0) {
        const kws = kws$0.toAST();
        return new Signature.KeywordSelfless($meta(this), kws);
    },
    signaturePair(x) {
        return x.toAST();
    },
    signaturePair_alt1(kw$0, v$0) {
        const kw = kw$0.toAST();
        const v = v$0.toAST();
        return new Pair($meta(this), kw, v);
    },
    partialLogicSignature(x) {
        return x.toAST();
    },
    partialLogicSignature_alt1(kws$0) {
        const kws = kws$0.toAST();
        return new PartialSignature.Keyword($meta(this), kws);
    },
    partialLogicSignature_alt2(n$0) {
        const n = n$0.toAST();
        return new PartialSignature.Unary($meta(this), n);
    },
    partialSignature(x) {
        return x.toAST();
    },
    partialSignature_alt1(kws$0) {
        const kws = kws$0.toAST();
        return new PartialSignature.Keyword($meta(this), kws);
    },
    partialSignature_alt2(op$0, r$0) {
        const op = op$0.toAST();
        const r = r$0.toAST();
        return new PartialSignature.Binary($meta(this), op, r);
    },
    partialSignature_alt3(n$0) {
        const n = n$0.toAST();
        return new PartialSignature.Unary($meta(this), n);
    },
    partialSignature_alt4(n$0) {
        const n = n$0.toAST();
        return new PartialSignature.Unary($meta(this), n);
    },
    signature(x) {
        return x.toAST();
    },
    signature_alt1(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return new Signature.Binary($meta(this), op, l, r);
    },
    signature_alt2(l$0, op$0, r$0) {
        const l = l$0.toAST();
        const op = op$0.toAST();
        const r = r$0.toAST();
        return new Signature.Binary($meta(this), op, l, r);
    },
    signature_alt3(s$0, kws$0) {
        const s = s$0.toAST();
        const kws = kws$0.toAST();
        return new Signature.Keyword($meta(this), s, kws);
    },
    signature_alt4(s$0, n$0) {
        const s = s$0.toAST();
        const n = n$0.toAST();
        return new Signature.Unary($meta(this), s, n);
    },
    signature_alt5(n$0, s$0) {
        const n = n$0.toAST();
        const s = s$0.toAST();
        return new Signature.Unary($meta(this), s, n);
    },
    signature_alt6(kws$0) {
        const kws = kws$0.toAST();
        return new Signature.KeywordSelfless($meta(this), kws);
    },
    asParameter(x) {
        return x.toAST();
    },
    asParameter_alt1(t$0) {
        const t = t$0.toAST();
        return new Parameter.TypedOnly($meta(this), new TypeApp.Static($meta(this), t));
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
        const xs = xs$0.toAST();
        return xs;
    },
    statements(x) {
        return x.toAST();
    },
    statements_alt1(h$0, _2, _3, t$0) {
        const h = h$0.toAST();
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements_alt2(h$0, _2, _3, _4, t$0) {
        const h = h$0.toAST();
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
        const t = t$0.toAST();
        return [h, ...t];
    },
    statements1_alt2(h$0, _2, _3, _4, t$0) {
        const h = h$0.toAST();
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
        const b = b$0.toAST();
        return b;
    },
    eblock_alt2(_1, e$0, _3) {
        const e = e$0.toAST();
        return [new Statement.Expr(e)];
    },
    s(x) {
        return x.toAST();
    },
    s_alt1(_1, x$0) {
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
    doc_line_alt1(_1, _2, x$0, _4) {
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
    t_any_infix_alt4(_1) {
        return this.sourceString;
    },
    t_any_infix_alt5(_1) {
        return this.sourceString;
    },
    t_any_infix_alt6(_1) {
        return this.sourceString;
    },
    t_any_infix_alt7(_1) {
        return this.sourceString;
    },
    t_any_infix_alt8(_1) {
        return this.sourceString;
    },
    t_any_infix_alt9(_1) {
        return this.sourceString;
    },
    t_any_infix_alt10(_1) {
        return this.sourceString;
    },
    t_any_infix_alt11(_1) {
        return this.sourceString;
    },
    t_any_infix_alt12(_1) {
        return this.sourceString;
    },
    t_any_infix_alt13(_1) {
        return this.sourceString;
    },
    t_any_infix_alt14(_1) {
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
    scene_(x) {
        return x.toAST();
    },
    scene__alt1(_1) {
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
};
exports.semantics.addOperation("toAST()", exports.toAstVisitor);
function toAst(result) {
    return exports.semantics(result).toAST();
}
exports.toAst = toAst;
//# sourceMappingURL=crochet-grammar.js.map

/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compileProgram = exports.compileReplCommand = exports.compileRepl = exports.compileDeclaration = exports.compileRank = exports.compileTypeDef = exports.compileParameters = exports.compileTrailingTest = exports.compileParameter = exports.compileTypeApp = exports.compileStatement = exports.compileContext = exports.compileSignal = exports.compileSimulationGoal = exports.compileTypeInit = exports.compileContract = exports.compileContractReturn = exports.compileContractCondition = exports.materialiseSignature = exports.compileExpression = exports.compileForExpression = exports.compileRecordField = exports.compileMatchSearchCase = exports.compileInterpolationPart = exports.compileInterpolation = exports.compileArgument = exports.literalToExpression = exports.compilePredicateClause = exports.compilePredicate = exports.compileSamplingPool = exports.compilePredicateEffect = exports.compilePattern = exports.compileRelationTypes = exports.compileNamespace = exports.signatureValues = exports.signatureName = exports.literalToValue = exports.compileMeta = exports.DeclarationLocality = void 0;
const crochet_grammar_1 = __webpack_require__(143);
const rt = __webpack_require__(7);
const runtime_1 = __webpack_require__(7);
const IR = __webpack_require__(8);
const ir_1 = __webpack_require__(8);
const Logic = __webpack_require__(12);
const Sim = __webpack_require__(10);
const utils_1 = __webpack_require__(23);
var DeclarationLocality;
(function (DeclarationLocality) {
    DeclarationLocality[DeclarationLocality["LOCAL"] = 0] = "LOCAL";
    DeclarationLocality[DeclarationLocality["PUBLIC"] = 1] = "PUBLIC";
})(DeclarationLocality = exports.DeclarationLocality || (exports.DeclarationLocality = {}));
const noMeta = new crochet_grammar_1.Metadata([]);
// -- Utilities
function parseInteger(x) {
    return BigInt(x.replace(/_/g, ""));
}
function parseNumber(x) {
    return Number(x.replace(/_/g, ""));
}
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
function compileMeta(x, cmeta) {
    return new ir_1.Interval(x, cmeta.doc.join("\n"));
}
exports.compileMeta = compileMeta;
function literalToValue(lit) {
    return lit.match({
        False(_) {
            return rt.False.instance;
        },
        True(_) {
            return rt.True.instance;
        },
        Nothing(_) {
            return rt.CrochetNothing.instance;
        },
        Text(_, value) {
            return new rt.CrochetText(parseString(value));
        },
        Integer(_, digits) {
            return new rt.CrochetInteger(parseInteger(digits));
        },
        Float(_, digits) {
            return new rt.CrochetFloat(parseNumber(digits));
        },
    });
}
exports.literalToValue = literalToValue;
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
function compileNamespace(x) {
    return x.names.join(".");
}
exports.compileNamespace = compileNamespace;
function compileLocality(x) {
    switch (x) {
        case DeclarationLocality.LOCAL:
            return true;
        case DeclarationLocality.PUBLIC:
            return false;
        default:
            throw utils_1.unreachable(x, "Locality");
    }
}
// -- Logic
function compileRelationTypes(types) {
    return types.reduceRight((p, t) => {
        return t.match({
            Many(_meta, _name) {
                return new Logic.TTMany(p);
            },
            One(_meta, _name) {
                return new Logic.TTOne(p);
            },
        });
    }, new Logic.TTEnd());
}
exports.compileRelationTypes = compileRelationTypes;
function compilePattern(p) {
    return p.match({
        HasType(_, type, name) {
            return new Logic.TypePattern(compilePattern(name), compileTypeApp(type));
        },
        Lit(lit) {
            return new Logic.ValuePattern(literalToValue(lit));
        },
        Global(_, name) {
            return new Logic.GlobalPattern(name.name);
        },
        Self(_) {
            return new Logic.SelfPattern();
        },
        Variable(_, name) {
            return new Logic.VariablePattern(name.name);
        },
        Wildcard(_) {
            return new Logic.WildcardPattern();
        },
    });
}
exports.compilePattern = compilePattern;
function compilePredicateEffect(eff) {
    return eff.match({
        Trivial() {
            return new Logic.Effect.Trivial();
        },
    });
}
exports.compilePredicateEffect = compilePredicateEffect;
function compileSamplingPool(pool) {
    return pool.match({
        Relation(_, signature) {
            return new Logic.SamplingRelation(signatureName(signature), signatureValues(signature).map(compilePattern));
        },
        Type(_, name, type) {
            return new Logic.SamplingType(name.name, compileTypeApp(type));
        },
    });
}
exports.compileSamplingPool = compileSamplingPool;
function compilePredicate(p) {
    return p.match({
        And(_, l, r) {
            return new Logic.AndPredicate(compilePredicate(l), compilePredicate(r));
        },
        Or(_, l, r) {
            return new Logic.OrPredicate(compilePredicate(l), compilePredicate(r));
        },
        Not(_, p) {
            return new Logic.NotPredicate(compilePredicate(p));
        },
        Constrain(_, p, c) {
            return new Logic.ConstrainedPredicate(compilePredicate(p), compileExpression(c));
        },
        Parens(_, p) {
            return compilePredicate(p);
        },
        Has(_, sig) {
            return new Logic.HasRelation(signatureName(sig), signatureValues(sig).map(compilePattern));
        },
        Let(_, name, value) {
            return new Logic.LetPredicate(name.name, compileExpression(value));
        },
        Typed(_, name, typ) {
            return new Logic.TypePredicate(name.name, compileTypeApp(typ));
        },
        Sample(_, size0, pool) {
            const size = utils_1.cast(literalToValue(size0), runtime_1.CrochetInteger);
            return new Logic.SamplePredicate(Number(size.value), compileSamplingPool(pool));
        },
        Always(_) {
            return new Logic.AlwaysPredicate();
        },
    });
}
exports.compilePredicate = compilePredicate;
function compilePredicateClause(p) {
    return new Logic.PredicateClause(compilePredicate(p.predicate), compilePredicateEffect(p.effect));
}
exports.compilePredicateClause = compilePredicateClause;
// -- Expression
function literalToExpression(lit) {
    return lit.match({
        False(pos) {
            return new IR.EFalse(compileMeta(pos, noMeta));
        },
        True(pos) {
            return new IR.ETrue(compileMeta(pos, noMeta));
        },
        Nothing(pos) {
            return new IR.ENothing(compileMeta(pos, noMeta));
        },
        Text(pos, value) {
            return new IR.EText(compileMeta(pos, noMeta), parseString(value));
        },
        Integer(pos, digits) {
            return new IR.EInteger(compileMeta(pos, noMeta), parseInteger(digits));
        },
        Float(pos, digits) {
            return new ir_1.EFloat(compileMeta(pos, noMeta), parseNumber(digits));
        },
    });
}
exports.literalToExpression = literalToExpression;
function compileArgument(expr) {
    if (expr instanceof crochet_grammar_1.Expression.Hole) {
        return new IR.EPartialHole();
    }
    else {
        return new IR.EPartialConcrete(compileExpression(expr));
    }
}
exports.compileArgument = compileArgument;
function compileInterpolation(value, f) {
    const column = value.pos.position.column;
    const indent = new RegExp(`(\r\n|\r|\n)[ \t]{0,${column}}`, "g");
    const sip = new ir_1.SimpleInterpolation(value.parts.map((x) => compileInterpolationPart(x, f))).optimise();
    const parts = sip.parts.map((x) => {
        if (x instanceof IR.SIPStatic) {
            return new IR.SIPStatic(x.text.replace(indent, (_, newline) => newline));
        }
        else {
            return x;
        }
    });
    if (parts.length > 0) {
        const part0 = parts[0];
        if (part0 instanceof IR.SIPStatic) {
            parts.shift();
            parts.unshift(new IR.SIPStatic(part0.text.replace(/^[ \t]*(\r\n|\r|\n)/g, (_, nl) => "")));
        }
        const part = parts[parts.length - 1];
        if (part !== part0 && part instanceof IR.SIPStatic) {
            parts.pop();
            parts.push(new IR.SIPStatic(part.text.replace(/(\r\n|\r|\n)[ \t]*$/g, (_, nl) => {
                return "";
            })));
        }
    }
    const parts1 = parts.map((x) => {
        if (x instanceof IR.SIPStatic) {
            return new IR.SIPStatic(x.text.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, e) => {
                return resolve_escape(e);
            }));
        }
        else {
            return x;
        }
    });
    return new ir_1.SimpleInterpolation(parts1);
}
exports.compileInterpolation = compileInterpolation;
function compileInterpolationPart(part, f) {
    return part.match({
        Escape(_, c) {
            return new IR.SIPStatic(`\\${c}`);
        },
        Static(_, c) {
            return new IR.SIPStatic(c);
        },
        Dynamic(_, x) {
            return new IR.SIPDynamic(f(x));
        },
    });
}
exports.compileInterpolationPart = compileInterpolationPart;
function compileMatchSearchCase(kase) {
    return new IR.MatchSearchCase(compilePredicate(kase.predicate), new IR.SBlock(ir_1.generated_node, kase.body.map(compileStatement)));
}
exports.compileMatchSearchCase = compileMatchSearchCase;
function compileRecordField(field) {
    return field.match({
        FName(x) {
            return new IR.RFStatic(x.name);
        },
        FText(x) {
            return new IR.RFStatic(parseString(x));
        },
        FComputed(x) {
            return new IR.RFDynamic(compileExpression(x));
        },
    });
}
exports.compileRecordField = compileRecordField;
function compileForExpression(expr) {
    return expr.match({
        Map(_, name, stream, body) {
            return new IR.ForallMap(name.name, compileExpression(stream), compileForExpression(body));
        },
        If(_, cond, body) {
            return new IR.ForallIf(compileExpression(cond), compileForExpression(body));
        },
        Do(_, body) {
            return new IR.ForallDo(compileExpression(body));
        },
    });
}
exports.compileForExpression = compileForExpression;
function compileExpression(expr) {
    return expr.match({
        Search(pos, pred) {
            return new IR.ESearch(compileMeta(pos, noMeta), compilePredicate(pred));
        },
        MatchSearch(pos, cases) {
            return new IR.EMatchSearch(compileMeta(pos, noMeta), cases.map(compileMatchSearchCase));
        },
        Invoke(pos, sig) {
            const name = signatureName(sig);
            const args = signatureValues(sig).map(compileArgument);
            const is_saturated = args.every((x) => x instanceof IR.EPartialConcrete);
            if (is_saturated) {
                return new IR.EInvoke(compileMeta(pos, noMeta), name, args.map((x) => utils_1.cast(x, IR.EPartialConcrete).expr));
            }
            else {
                return new IR.EPartial(compileMeta(pos, noMeta), name, args);
            }
        },
        Variable(pos, name) {
            return new IR.EVariable(compileMeta(pos, noMeta), name.name);
        },
        Global(pos, name) {
            return new IR.EGlobal(compileMeta(pos, noMeta), name.name);
        },
        Self(pos) {
            return new IR.ESelf(compileMeta(pos, noMeta));
        },
        New(pos, type, values) {
            return new IR.ENew(compileMeta(pos, noMeta), type.name, values.map(compileExpression));
        },
        List(pos, values) {
            return new IR.EList(compileMeta(pos, noMeta), values.map(compileExpression));
        },
        Record(pos, pairs) {
            return new IR.ERecord(compileMeta(pos, noMeta), pairs.map((x) => ({
                key: compileRecordField(x.key),
                value: compileExpression(x.value),
            })));
        },
        Project(pos, object, field) {
            return new IR.EProject(compileMeta(pos, noMeta), compileExpression(object), compileRecordField(field));
        },
        Select(pos, object, fields) {
            return new IR.EProjectMany(compileMeta(pos, noMeta), compileExpression(object), fields.map((x) => ({
                key: compileRecordField(x.name),
                alias: compileRecordField(x.alias),
            })));
        },
        Block(pos, body) {
            return new IR.EBlock(compileMeta(pos, noMeta), body.map(compileStatement));
        },
        For(pos, body) {
            return new IR.EForall(compileMeta(pos, noMeta), compileForExpression(body));
        },
        Apply(pos, partial, args) {
            return new IR.EApply(compileMeta(pos, noMeta), compileExpression(partial), args.map(compileArgument));
        },
        Interpolate(_, x) {
            return compileInterpolation(x, compileExpression).to_expression();
        },
        Pipe(pos, left, right) {
            return new IR.EApply(compileMeta(pos, noMeta), compileExpression(right), [
                new IR.EPartialConcrete(compileExpression(left)),
            ]);
        },
        PipeInvoke(meta, left, sig0) {
            const sig = materialiseSignature(left, sig0);
            return compileExpression(new crochet_grammar_1.Expression.Invoke(meta, sig));
        },
        Condition(pos, cases) {
            return new IR.ECondition(compileMeta(pos, noMeta), cases.map((x) => new IR.ConditionCase(compileExpression(x.guard), new IR.SBlock(compileMeta(x.pos, noMeta), x.body.map(compileStatement)))));
        },
        HasType(pos, value, type) {
            return new IR.EHasType(compileMeta(pos, noMeta), compileExpression(value), compileTypeApp(type));
        },
        Force(pos, value) {
            return new IR.EForce(compileMeta(pos, noMeta), compileExpression(value));
        },
        Lazy(pos, value) {
            return new IR.ELazy(compileMeta(pos, noMeta), compileExpression(value));
        },
        Hole(_) {
            throw new Error(`Hole found outside of function application.`);
        },
        Return(pos) {
            return new IR.EReturn(compileMeta(pos, noMeta));
        },
        Type(pos, type) {
            return new IR.EStaticType(compileMeta(pos, noMeta), compileTypeApp(type));
        },
        Lambda(pos, params, body) {
            return new IR.ELambda(compileMeta(pos, noMeta), params.map((x) => x.name), compileExpression(body));
        },
        IntrinsicEqual(pos, l, r) {
            return new IR.EIntrinsicEqual(compileMeta(pos, noMeta), compileExpression(l), compileExpression(r));
        },
        Parens(_, value) {
            return compileExpression(value);
        },
        Lit(lit) {
            return literalToExpression(lit);
        },
    });
}
exports.compileExpression = compileExpression;
// -- Statement
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
function compileContractCondition(c) {
    return new rt.ContractCondition(c.pos, c.name.name, compileExpression(c.expr));
}
exports.compileContractCondition = compileContractCondition;
function compileContractReturn(c) {
    if (c == null) {
        return [];
    }
    else {
        const pos = c.match({
            Any(p) {
                return p;
            },
            Named(p, _) {
                return p;
            },
            Static(p, _) {
                return p;
            },
        });
        return [
            new rt.ContractCondition(pos, "return-type", new rt.IR.EHasType(compileMeta(pos, noMeta), new rt.IR.EReturn(compileMeta(pos, noMeta)), compileTypeApp(c))),
        ];
    }
}
exports.compileContractReturn = compileContractReturn;
function compileContract(c) {
    const ret = compileContractReturn(c.ret);
    return new rt.Contract(c.pre.map(compileContractCondition), [
        ...ret,
        ...c.post.map(compileContractCondition),
    ]);
}
exports.compileContract = compileContract;
function compileTypeInit(meta, self, partialStmts, locality, override) {
    const results = partialStmts.map((x) => x.match({
        Fact(meta, sig0) {
            const self_expr = new crochet_grammar_1.Expression.Global(meta, new crochet_grammar_1.Name(meta, self));
            const sig = materialiseSignature(self_expr, sig0);
            return new crochet_grammar_1.Statement.Fact(meta, sig);
        },
        Command(meta, cmeta, sig0, contract, body, test) {
            const self_param = new crochet_grammar_1.Parameter.TypedOnly(meta, new crochet_grammar_1.TypeApp.Named(meta, new crochet_grammar_1.Name(meta, self)));
            const sig = materialiseSignature(self_param, sig0);
            return new crochet_grammar_1.Declaration.Command(meta, cmeta, sig, contract, body, test);
        },
        ForeignCommand(meta, cmeta, sig0, contract, body, test) {
            const self_param = new crochet_grammar_1.Parameter.TypedOnly(meta, new crochet_grammar_1.TypeApp.Named(meta, new crochet_grammar_1.Name(meta, self)));
            const sig = materialiseSignature(self_param, sig0);
            return new crochet_grammar_1.Declaration.ForeignCommand(meta, cmeta, sig, contract, body, test);
        },
    }));
    const stmts = results.filter((x) => x instanceof crochet_grammar_1.Statement);
    const decls0 = results.filter((x) => x instanceof crochet_grammar_1.Declaration);
    const decls = [...decls0, new crochet_grammar_1.Declaration.Do(meta, stmts)];
    return decls.flatMap((x) => compileDeclaration(x, locality, override));
}
exports.compileTypeInit = compileTypeInit;
function compileSimulationGoal(goal) {
    return goal.match({
        ActionQuiescence(_) {
            return new Sim.ActionQuiescence();
        },
        EventQuiescence(_) {
            return new Sim.EventQuiescence();
        },
        TotalQuiescence(_) {
            return new Sim.TotalQuiescence();
        },
        CustomGoal(_, pred) {
            return new Sim.CustomGoal(compilePredicate(pred));
        },
    });
}
exports.compileSimulationGoal = compileSimulationGoal;
function compileSignal(signal) {
    const name = signatureName(signal.signature);
    const parameters0 = signatureValues(signal.signature);
    const { parameters } = compileParameters(parameters0);
    return new rt.Signal(name, parameters, signal.body.map(compileStatement));
}
exports.compileSignal = compileSignal;
function compileContext(context) {
    return context.match({
        Global() {
            return new IR.SCAny();
        },
        Named(_, name) {
            return new IR.SCNamed(name.name);
        },
    });
}
exports.compileContext = compileContext;
function compileStatement(stmt) {
    return stmt.match({
        Let(pos, name, value) {
            return new IR.SLet(compileMeta(pos, noMeta), name.name, compileExpression(value));
        },
        Fact(pos, sig) {
            return new IR.SFact(compileMeta(pos, noMeta), signatureName(sig), signatureValues(sig).map(compileExpression));
        },
        Forget(pos, sig) {
            return new IR.SForget(compileMeta(pos, noMeta), signatureName(sig), signatureValues(sig).map(compileExpression));
        },
        Call(pos, name) {
            return new IR.SCall(compileMeta(pos, noMeta), name.name);
        },
        Goto(pos, name) {
            return new IR.SGoto(compileMeta(pos, noMeta), name.name);
        },
        Simulate(pos, actors, context, goal, signals) {
            return new IR.SSimulate(compileMeta(pos, noMeta), compileContext(context), compileExpression(actors), compileSimulationGoal(goal), signals.map(compileSignal));
        },
        Assert(pos, expr) {
            return new IR.SAssert(compileMeta(pos, noMeta), compileExpression(expr));
        },
        Expr(value) {
            const expr = compileExpression(value);
            return new IR.SExpression(expr.position, expr);
        },
    });
}
exports.compileStatement = compileStatement;
// -- Declaration
function compileTypeApp(x) {
    return x.match({
        Named(_, name) {
            return new IR.TNamed(name.name);
        },
        Static(_, type) {
            return new IR.TStatic(compileTypeApp(type));
        },
        Any(_) {
            return new IR.TAny();
        },
    });
}
exports.compileTypeApp = compileTypeApp;
function compileParameter(x) {
    return x.match({
        Typed(_, name, type) {
            return {
                type: compileTypeApp(type),
                parameter: name.name,
            };
        },
        TypedOnly(_, type) {
            return {
                type: compileTypeApp(type),
                parameter: "_",
            };
        },
        Untyped(_, name) {
            return {
                type: new IR.TAny(),
                parameter: name.name,
            };
        },
    });
}
exports.compileParameter = compileParameter;
function compileTrailingTest(title, types, test) {
    if (test == null) {
        return [];
    }
    else {
        const pos = compileMeta(test.pos, noMeta);
        return [
            new IR.DTest(pos, `${title} (${types.map((x) => x.static_name).join(", ")})`, new IR.SBlock(pos, test.body.map(compileStatement))),
        ];
    }
}
exports.compileTrailingTest = compileTrailingTest;
function compileParameters(xs0) {
    const xs = xs0.map(compileParameter);
    return {
        types: xs.map((x) => x.type),
        parameters: xs.map((x) => x.parameter),
    };
}
exports.compileParameters = compileParameters;
function compileTypeDef(local, meta, t, fields) {
    const params = fields.map(compileParameter);
    const parent = t.parent ? compileTypeApp(t.parent) : null;
    return new IR.DType(meta, local, parent, t.name.name, params);
}
exports.compileTypeDef = compileTypeDef;
function compileRank(r) {
    return r.match({
        Expr(e) {
            return compileExpression(e);
        },
        Unranked(_) {
            return new IR.EInteger(ir_1.generated_node, 1n);
        },
    });
}
exports.compileRank = compileRank;
function compileDeclaration(d, locality, override) {
    return d.match({
        Do(pos, body) {
            return [new IR.DDo(compileMeta(pos, noMeta), body.map(compileStatement))];
        },
        DefinePredicate(pos, cmeta, sig, clauses) {
            const name = signatureName(sig);
            const params = signatureValues(sig).map((x) => x.name);
            const procedure = new Logic.PredicateProcedure(name, params, clauses.map(compilePredicateClause));
            return [new IR.DPredicate(compileMeta(pos, cmeta), name, procedure)];
        },
        Relation(pos, cmeta, sig) {
            const types = signatureValues(sig);
            return [
                new IR.DRelation(compileMeta(pos, cmeta), signatureName(sig), compileRelationTypes(types)),
            ];
        },
        ForeignCommand(meta, cmeta, sig, contract, body, test) {
            const name = signatureName(sig);
            const { types, parameters } = compileParameters(signatureValues(sig));
            const pos = compileMeta(meta, cmeta);
            return [
                new IR.DForeignCommand(pos, name, types, compileNamespace(body.name), parameters, body.args.map((x) => x.name), compileContract(contract), override),
                ...compileTrailingTest(name, types, test),
            ];
        },
        Command(meta, cmeta, sig, contract, body, test) {
            const name = signatureName(sig);
            const { types, parameters } = compileParameters(signatureValues(sig));
            const pos = compileMeta(meta, cmeta);
            return [
                new IR.DCrochetCommand(pos, name, parameters, types, body.map(compileStatement), compileContract(contract), override),
                ...compileTrailingTest(name, types, test),
            ];
        },
        SingletonType(meta, cmeta, type0, init) {
            const local = compileLocality(locality);
            const pos = compileMeta(meta, cmeta);
            const type = compileTypeDef(local, pos, type0, []);
            return [
                new IR.DType(pos, local, type.parent, type.name, []),
                new IR.DDefine(pos, local, type.name, new IR.ENew(pos, type.name, [])),
                new IR.DSealType(pos, type.name),
                new IR.DDo(pos, [
                    new IR.SRegister(pos, new IR.EGlobal(pos, type.name)),
                ]),
                ...compileTypeInit(meta, type.name, init, locality, override),
            ];
        },
        EnumType(meta, cmeta, name, variants) {
            const local = compileLocality(locality);
            const parent = new crochet_grammar_1.TypeApp.Named(name.pos, name);
            const pos = compileMeta(meta, cmeta);
            const variantDecls = variants.flatMap((v, i) => [
                new crochet_grammar_1.Declaration.SingletonType(v.pos, noMeta, new crochet_grammar_1.TypeDef(parent, v), []),
                new crochet_grammar_1.Declaration.Command(v.pos, noMeta, new crochet_grammar_1.Signature.Unary(v.pos, new crochet_grammar_1.Parameter.TypedOnly(v.pos, new crochet_grammar_1.TypeApp.Named(v.pos, v)), new crochet_grammar_1.Name(v.pos, "to-enum-integer")), new crochet_grammar_1.Contract(meta, null, [], []), [
                    new crochet_grammar_1.Statement.Expr(new crochet_grammar_1.Expression.Lit(new crochet_grammar_1.Literal.Integer(v.pos, (i + 1).toString()))),
                ], null),
            ]);
            return [
                new IR.DType(pos, local, new IR.TNamed("enum"), name.name, []),
                ...variantDecls.flatMap((v) => compileDeclaration(v, locality, override)),
                new IR.DDefine(pos, local, name.name, new IR.ENew(pos, name.name, [])),
                new IR.DSealType(pos, name.name),
                new IR.DCrochetCommand(pos, "_ lower-bound", ["Self"], [new IR.TNamed(name.name)], [new IR.SExpression(pos, new IR.EGlobal(pos, variants[0].name))], new rt.Contract([], []), override),
                new IR.DCrochetCommand(pos, "_ upper-bound", ["Self"], [new IR.TNamed(name.name)], [
                    new IR.SExpression(pos, new IR.EGlobal(pos, variants[variants.length - 1].name)),
                ], new rt.Contract([], []), override),
                new IR.DCrochetCommand(pos, "_ from-enum-integer: _", ["Self", "N"], [new IR.TNamed(name.name), new IR.TNamed("integer")], [
                    new IR.SExpression(pos, new IR.ECondition(pos, variants.map((n, i) => {
                        return new IR.ConditionCase(new IR.EInvoke(pos, "_ === _", [
                            new IR.EVariable(pos, "N"),
                            new IR.EInteger(pos, BigInt(i + 1)),
                        ]), new IR.SBlock(pos, [new IR.EGlobal(pos, n.name)]));
                    }))),
                ], new rt.Contract([], []), override),
            ];
        },
        AbstractType(meta, cmeta, t) {
            const local = compileLocality(locality);
            const pos = compileMeta(meta, cmeta);
            const type = compileTypeDef(local, pos, t, []);
            return [
                new IR.DType(pos, local, type.parent, type.name, []),
                new IR.DSealType(pos, type.name),
            ];
        },
        Type(meta, cmeta, t, fields) {
            const local = compileLocality(locality);
            const pos = compileMeta(meta, cmeta);
            return [compileTypeDef(local, pos, t, fields)];
        },
        Define(pos, cmeta, name, value) {
            const local = compileLocality(locality);
            return [
                new IR.DDefine(compileMeta(pos, cmeta), local, name.name, compileExpression(value)),
            ];
        },
        Scene(pos, cmeta, name, body) {
            return [
                new IR.DScene(compileMeta(pos, cmeta), name.name, body.map(compileStatement)),
            ];
        },
        Action(pos, cmeta, typ, title, tags, predicate, rank, body) {
            return [
                new IR.DAction(compileMeta(pos, cmeta), compileTypeApp(typ), compileExpression(title), tags.map((x) => x.name), compilePredicate(predicate), compileRank(rank), body.map(compileStatement)),
            ];
        },
        When(pos, cmeta, predicate, body) {
            return [
                new IR.DWhen(compileMeta(pos, cmeta), compilePredicate(predicate), body.map(compileStatement)),
            ];
        },
        Context(pos, cmeta, name, items) {
            return [
                new IR.DContext(compileMeta(pos, cmeta), name.name, items.flatMap((x) => compileDeclaration(x, locality, override))),
            ];
        },
        ForeignType(pos, cmeta, name, foreign_name) {
            const local = compileLocality(locality);
            return [
                new IR.DForeignType(compileMeta(pos, cmeta), local, name.name, compileNamespace(foreign_name)),
            ];
        },
        Open(pos, ns) {
            return [new IR.DOpen(compileMeta(pos, noMeta), compileNamespace(ns))];
        },
        Local(_, decl) {
            return compileDeclaration(decl, DeclarationLocality.LOCAL, override);
        },
        Test(pos, title0, body) {
            const title = parseString(title0);
            return [
                new IR.DTest(compileMeta(pos, noMeta), title, new IR.SBlock(compileMeta(pos, noMeta), body.map(compileStatement))),
            ];
        },
    });
}
exports.compileDeclaration = compileDeclaration;
function compileRepl(p) {
    return p.match({
        Declarations(xs) {
            return new IR.REPLDeclarations(xs.flatMap((x) => compileDeclaration(x, DeclarationLocality.PUBLIC, true)));
        },
        Statements(xs) {
            return new IR.REPLStatements(new IR.SBlock(ir_1.generated_node, xs.map((x) => compileStatement(x))));
        },
        Command(x) {
            return compileReplCommand(x);
        },
    });
}
exports.compileRepl = compileRepl;
function compileReplCommand(x) {
    return x.match({
        Rollback(sig) {
            return new IR.CmdRollback(signatureName(sig));
        },
        HelpCommand(sig) {
            return new IR.CmdHelpCommand(signatureName(sig), signatureValues(sig)
                .map((x) => compileParameter(x))
                .map((x) => x.type));
        },
        HelpType(typ) {
            return new IR.CmdHelpType(compileTypeApp(typ));
        },
    });
}
exports.compileReplCommand = compileReplCommand;
function compileProgram(p) {
    return p.declarations.flatMap((x) => compileDeclaration(x, DeclarationLocality.PUBLIC, false));
}
exports.compileProgram = compileProgram;
//# sourceMappingURL=compiler.js.map

/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Plugin = exports.PluginFFI = void 0;
const runtime_1 = __webpack_require__(7);
const stdlib_1 = __webpack_require__(4);
const utils_1 = __webpack_require__(33);
class PluginFFI {
    constructor(ffi) {
        this.ffi = ffi;
    }
    defun(name, fn) {
        this.ffi.defun(name, [], fn);
        return this;
    }
    defmachine(name, fn) {
        this.ffi.defmachine(name, [], fn);
        return this;
    }
}
exports.PluginFFI = PluginFFI;
class Plugin {
    constructor(pkg, ffi) {
        this.pkg = pkg;
        this.ffi = ffi;
        this.pkg = pkg;
        this.ffi = ffi;
    }
    define_ffi(namespace) {
        return new PluginFFI(new stdlib_1.ForeignNamespace(this.ffi, `${this.pkg.name}:${namespace}`));
    }
    get_integer(value) {
        return utils_1.cast(value, runtime_1.CrochetInteger).value;
    }
    get_string(value) {
        return utils_1.cast(value, runtime_1.CrochetText).value;
    }
    get_float(value) {
        return utils_1.cast(value, runtime_1.CrochetFloat).value;
    }
    get_bool(value) {
        return value.as_bool();
    }
    get_array(value) {
        return utils_1.cast(value, runtime_1.CrochetTuple).values;
    }
    get_map(value) {
        return utils_1.cast(value, runtime_1.CrochetRecord).values;
    }
    from_bool(value) {
        return runtime_1.from_bool(value);
    }
    from_integer(value) {
        return new runtime_1.CrochetInteger(value);
    }
    from_float(value) {
        return new runtime_1.CrochetFloat(value);
    }
    from_string(value) {
        return new runtime_1.CrochetText(value);
    }
    from_array(value) {
        return new runtime_1.CrochetTuple(value);
    }
    from_map(value) {
        return new runtime_1.CrochetRecord(value);
    }
    nothing() {
        return runtime_1.CrochetNothing.instance;
    }
    from_js(value) {
        return runtime_1.js_to_crochet(value);
    }
    from_json(value) {
        return runtime_1.json_to_crochet(JSON.parse(value));
    }
    from_json_object(value) {
        return runtime_1.json_to_crochet(value);
    }
    box(value) {
        return runtime_1.box(value);
    }
    unbox(value) {
        return runtime_1.unbox(value);
    }
    unbox_typed(type, value) {
        return runtime_1.unbox_typed(type, value);
    }
    invoke(state, name, args) {
        return runtime_1.invoke(state, name, args);
    }
    apply(state, fun, args) {
        return runtime_1.apply(state, fun, args);
    }
    run_sync(machine) {
        return runtime_1.cvalue(runtime_1.Thread.for_machine(machine).run_sync());
    }
    async run_async(machine) {
        return runtime_1.cvalue(await runtime_1.Thread.for_machine(machine).run_and_wait());
    }
    panic(tag, message) {
        throw new runtime_1.ErrNativeError(new Error(`${tag}: ${message}`));
    }
    push(machine) {
        return runtime_1._push(machine);
    }
    await(promise) {
        return runtime_1._await(promise);
    }
}
exports.Plugin = Plugin;
//# sourceMappingURL=plugin.js.map

/***/ }),
/* 146 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 146;
module.exports = webpackEmptyContext;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Crochet = void 0;
const Path = __webpack_require__(1);
const cli_1 = __webpack_require__(2);
const pkg_1 = __webpack_require__(70);
const file_1 = __webpack_require__(75);
class Crochet extends cli_1.Crochet {
    constructor(stdlib_path) {
        super();
        this.stdlib_path = stdlib_path;
    }
    get capabilities() {
        return pkg_1.Capabilities.safe;
    }
    get prelude() {
        return [
            "crochet.core",
            "crochet.debug",
            "crochet.text",
            "crochet.mathematics",
            "crochet.collections",
        ];
    }
    async load_from_file(filename) {
        const target = new pkg_1.NodeTarget();
        const pkg0 = new pkg_1.CrochetPackage("(benchmark)", {
            capabilities: {
                requires: new Set(),
                provides: new Set(),
            },
            dependencies: this.prelude.map((x) => new pkg_1.Dependency(x, new Set(), target)),
            name: "(benchmark)",
            native_sources: [],
            sources: [new file_1.File(Path.resolve(filename), target)],
            target: target,
        });
        const pkg = pkg0.restricted_to(target);
        const graph = await pkg_1.PackageGraph.resolve(target, this, pkg);
        graph.check(pkg.name, this.capabilities);
        await this.load_graph(graph, pkg);
    }
}
exports.Crochet = Crochet;
//# sourceMappingURL=bench.js.map
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});