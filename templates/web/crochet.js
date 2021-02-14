(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Crochet = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
__exportStar(require("./loader"), exports);
__exportStar(require("./operations"), exports);

},{"./loader":2,"./operations":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJson = void 0;
const operations_1 = require("./operations");
function fromJson(x) {
    return operations_1.Module.fromJson(x);
}
exports.fromJson = fromJson;

},{"./operations":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerContext = exports.Search = exports.TriggerAction = exports.RemoveFact = exports.InsertFact = exports.Let = exports.Goto = exports.Halt = exports.Drop = exports.Return = exports.Invoke = exports.PushActor = exports.PushLocal = exports.PushNothing = exports.PushBoolean = exports.PushText = exports.PushFloat = exports.PushInteger = exports.AbstractOperation = exports.DefineForeignCommand = exports.DefineCommand = exports.Do = exports.ManyRelation = exports.OneRelation = exports.RelationComponent = exports.DefineRelation = exports.CRole = exports.CActor = exports.CBoolean = exports.CVariable = exports.CNotEqual = exports.CEqual = exports.CNot = exports.COr = exports.CAnd = exports.AbstractConstraint = exports.PredicateRelation = exports.Predicate = exports.HookDefinition = exports.DefineContext = exports.SimpleInterpolationVariable = exports.SimpleInterpolationStatic = exports.AbstractSimpleInterpolationPart = exports.SimpleInterpolation = exports.DefineAction = exports.DefineActor = exports.DefineScene = exports.AbstractDeclaration = exports.Module = exports.IRNode = void 0;
exports.VariablePattern = exports.ActorPattern = exports.NothingPattern = exports.TextPattern = exports.BooleanPattern = exports.FloatPattern = exports.IntegerPattern = exports.AbstractPattern = exports.MatchDefault = exports.MatchPredicate = exports.AbstractMatchClause = exports.Match = exports.Project = exports.Yield = exports.Interpolate = exports.Block = exports.Branch = void 0;
const Logic = require("../vm-js/logic");
const spec_1 = require("../utils/spec");
class IRNode {
    toJSON() {
        return { ...this };
    }
}
exports.IRNode = IRNode;
class Module extends IRNode {
    constructor(filename, declarations) {
        super();
        this.filename = filename;
        this.declarations = declarations;
    }
    static get spec() {
        return spec_1.spec({
            filename: spec_1.string,
            declarations: spec_1.array(AbstractDeclaration),
        }, (x) => {
            return new Module(x.filename, x.declarations);
        });
    }
    static fromJson(x) {
        return spec_1.parse(x, Module);
    }
}
exports.Module = Module;
//== Declaration
class AbstractDeclaration extends IRNode {
    static get spec() {
        return spec_1.anyOf([
            DefineCommand,
            DefineForeignCommand,
            DefineRelation,
            DefineScene,
            DefineActor,
            DefineAction,
            DefineContext,
            Do,
        ]);
    }
}
exports.AbstractDeclaration = AbstractDeclaration;
class DefineScene extends AbstractDeclaration {
    constructor(name, body) {
        super();
        this.name = name;
        this.body = body;
        this.tag = "define-scene";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-scene"),
            name: spec_1.string,
            body: spec_1.array(AbstractOperation),
        }, (x) => new DefineScene(x.name, x.body));
    }
}
exports.DefineScene = DefineScene;
class DefineActor extends AbstractDeclaration {
    constructor(name, roles) {
        super();
        this.name = name;
        this.roles = roles;
        this.tag = "define-actor";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-actor"),
            name: spec_1.string,
            roles: spec_1.array(spec_1.string),
        }, (x) => new DefineActor(x.name, x.roles));
    }
}
exports.DefineActor = DefineActor;
class DefineAction extends AbstractDeclaration {
    constructor(title, predicate, body) {
        super();
        this.title = title;
        this.predicate = predicate;
        this.body = body;
        this.tag = "define-action";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-action"),
            title: SimpleInterpolation,
            predicate: Predicate,
            body: spec_1.array(AbstractOperation),
        }, (x) => new DefineAction(x.title, x.predicate, x.body));
    }
}
exports.DefineAction = DefineAction;
class SimpleInterpolation {
    constructor(parts) {
        this.parts = parts;
    }
    static_text() {
        return this.parts.map((x) => x.static_text()).join("");
    }
    static get spec() {
        return spec_1.spec({
            parts: spec_1.array(AbstractSimpleInterpolationPart),
        }, (x) => new SimpleInterpolation(x.parts));
    }
}
exports.SimpleInterpolation = SimpleInterpolation;
class AbstractSimpleInterpolationPart {
    static get spec() {
        return spec_1.anyOf([SimpleInterpolationStatic, SimpleInterpolationVariable]);
    }
}
exports.AbstractSimpleInterpolationPart = AbstractSimpleInterpolationPart;
class SimpleInterpolationStatic extends AbstractSimpleInterpolationPart {
    constructor(text) {
        super();
        this.text = text;
        this.tag = "static";
    }
    static_text() {
        return this.text;
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("static"),
            text: spec_1.string,
        }, (x) => new SimpleInterpolationStatic(x.text));
    }
}
exports.SimpleInterpolationStatic = SimpleInterpolationStatic;
class SimpleInterpolationVariable extends AbstractSimpleInterpolationPart {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "variable";
    }
    static_text() {
        return "_";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("variable"),
            name: spec_1.string,
        }, (x) => new SimpleInterpolationVariable(x.name));
    }
}
exports.SimpleInterpolationVariable = SimpleInterpolationVariable;
class DefineContext extends AbstractDeclaration {
    constructor(name, hooks) {
        super();
        this.name = name;
        this.hooks = hooks;
        this.tag = "define-context";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-context"),
            name: spec_1.string,
            hooks: spec_1.array(HookDefinition),
        }, (x) => new DefineContext(x.name, x.hooks));
    }
}
exports.DefineContext = DefineContext;
class HookDefinition {
    constructor(predicate, body) {
        this.predicate = predicate;
        this.body = body;
    }
    static get spec() {
        return spec_1.spec({
            predicate: Predicate,
            body: spec_1.array(AbstractOperation),
        }, (x) => new HookDefinition(x.predicate, x.body));
    }
    toJSON() {
        return { ...this };
    }
}
exports.HookDefinition = HookDefinition;
class Predicate {
    constructor(relations, constraint) {
        this.relations = relations;
        this.constraint = constraint;
    }
    variables() {
        return this.relations.flatMap((x) => x.variables());
    }
    static get spec() {
        return spec_1.spec({
            relations: spec_1.array(PredicateRelation),
            constraint: AbstractConstraint,
        }, (x) => new Predicate(x.relations, x.constraint));
    }
    toJSON() {
        return { ...this };
    }
}
exports.Predicate = Predicate;
class PredicateRelation {
    constructor(name, patterns) {
        this.name = name;
        this.patterns = patterns;
    }
    variables() {
        return this.patterns.flatMap((x) => x.variables());
    }
    static get spec() {
        return spec_1.spec({
            name: spec_1.string,
            patterns: spec_1.array(AbstractPattern),
        }, (x) => new PredicateRelation(x.name, x.patterns));
    }
    toJSON() {
        return { ...this };
    }
}
exports.PredicateRelation = PredicateRelation;
class AbstractConstraint {
    static get spec() {
        return spec_1.anyOf([
            CAnd,
            COr,
            CNot,
            CEqual,
            CNotEqual,
            CVariable,
            CActor,
            CRole,
            CBoolean,
        ]);
    }
    toJSON() {
        return { ...this };
    }
}
exports.AbstractConstraint = AbstractConstraint;
class CAnd extends AbstractConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this.tag = "and";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("and"),
            left: AbstractConstraint,
            right: AbstractConstraint,
        }, (x) => new CAnd(x.left, x.right));
    }
}
exports.CAnd = CAnd;
class COr extends AbstractConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this.tag = "or";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("or"),
            left: AbstractConstraint,
            right: AbstractConstraint,
        }, (x) => new COr(x.left, x.right));
    }
}
exports.COr = COr;
class CNot extends AbstractConstraint {
    constructor(expr) {
        super();
        this.expr = expr;
        this.tag = "not";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("not"),
            expr: AbstractConstraint,
        }, (x) => new CNot(x.expr));
    }
}
exports.CNot = CNot;
class CEqual extends AbstractConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this.tag = "equal";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("equal"),
            left: AbstractConstraint,
            right: AbstractConstraint,
        }, (x) => new CEqual(x.left, x.right));
    }
}
exports.CEqual = CEqual;
class CNotEqual extends AbstractConstraint {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this.tag = "not-equal";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("not-equal"),
            left: AbstractConstraint,
            right: AbstractConstraint,
        }, (x) => new CNotEqual(x.left, x.right));
    }
}
exports.CNotEqual = CNotEqual;
class CVariable extends AbstractConstraint {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "variable";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("variable"),
            name: spec_1.string,
        }, (x) => new CVariable(x.name));
    }
}
exports.CVariable = CVariable;
class CBoolean extends AbstractConstraint {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "boolean";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("boolean"),
            value: spec_1.boolean,
        }, (x) => new CBoolean(x.value));
    }
}
exports.CBoolean = CBoolean;
class CActor extends AbstractConstraint {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "actor";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("actor"),
            name: spec_1.string,
        }, (x) => new CActor(x.name));
    }
}
exports.CActor = CActor;
class CRole extends AbstractConstraint {
    constructor(expr, role) {
        super();
        this.expr = expr;
        this.role = role;
        this.tag = "role";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("role"),
            expr: AbstractConstraint,
            role: spec_1.string,
        }, (x) => new CRole(x.expr, x.role));
    }
}
exports.CRole = CRole;
class DefineRelation extends AbstractDeclaration {
    constructor(name, components) {
        super();
        this.name = name;
        this.components = components;
        this.tag = "define-relation";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-relation"),
            name: spec_1.string,
            components: spec_1.array(RelationComponent),
        }, (x) => new DefineRelation(x.name, x.components));
    }
}
exports.DefineRelation = DefineRelation;
class RelationComponent {
    static get spec() {
        return spec_1.anyOf([OneRelation, ManyRelation]);
    }
    toJSON() {
        return { ...this };
    }
}
exports.RelationComponent = RelationComponent;
class OneRelation extends RelationComponent {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "one";
    }
    evaluate() {
        return new Logic.Component(new Logic.One(), this.name);
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("one"),
            name: spec_1.string,
        }, (x) => new OneRelation(x.name));
    }
}
exports.OneRelation = OneRelation;
class ManyRelation extends RelationComponent {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "many";
    }
    evaluate() {
        return new Logic.Component(new Logic.Many(), this.name);
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("many"),
            name: spec_1.string,
        }, (x) => new ManyRelation(x.name));
    }
}
exports.ManyRelation = ManyRelation;
class Do extends AbstractDeclaration {
    constructor(body) {
        super();
        this.body = body;
        this.tag = "do";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("do"),
            body: spec_1.array(AbstractOperation),
        }, (x) => new Do(x.body));
    }
}
exports.Do = Do;
class DefineCommand extends AbstractDeclaration {
    constructor(name, parameters, body) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.tag = "define-command";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-command"),
            name: spec_1.string,
            parameters: spec_1.array(spec_1.string),
            body: spec_1.array(AbstractOperation),
        }, (x) => new DefineCommand(x.name, x.parameters, x.body));
    }
}
exports.DefineCommand = DefineCommand;
class DefineForeignCommand extends AbstractDeclaration {
    constructor(name, parameters, foreign_name, args) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.foreign_name = foreign_name;
        this.args = args;
        this.tag = "define-foreign-command";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("define-foreign-command"),
            name: spec_1.string,
            parameters: spec_1.array(spec_1.string),
            foreign_name: spec_1.string,
            args: spec_1.array(spec_1.number),
        }, (x) => new DefineForeignCommand(x.name, x.parameters, x.foreign_name, x.args));
    }
}
exports.DefineForeignCommand = DefineForeignCommand;
//== Operation
class AbstractOperation extends IRNode {
    static get spec() {
        return spec_1.anyOf([
            Drop,
            PushInteger,
            PushFloat,
            PushText,
            PushLocal,
            PushBoolean,
            PushNothing,
            PushActor,
            Interpolate,
            TriggerContext,
            TriggerAction,
            InsertFact,
            RemoveFact,
            Search,
            Let,
            Invoke,
            Return,
            Branch,
            Block,
            Goto,
            Yield,
            Halt,
            Project,
            Match,
        ]);
    }
}
exports.AbstractOperation = AbstractOperation;
class PushInteger extends AbstractOperation {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "push-integer";
    }
    toJSON() {
        return {
            tag: this.tag,
            value: this.value.toString(),
        };
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-integer"),
            value: spec_1.bigint_string,
        }, (x) => new PushInteger(x.value));
    }
}
exports.PushInteger = PushInteger;
class PushFloat extends AbstractOperation {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "push-float";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-float"),
            value: spec_1.number,
        }, (x) => new PushFloat(x.value));
    }
}
exports.PushFloat = PushFloat;
class PushText extends AbstractOperation {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "push-text";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-text"),
            value: spec_1.string,
        }, (x) => new PushText(x.value));
    }
}
exports.PushText = PushText;
class PushBoolean extends AbstractOperation {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "push-boolean";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-boolean"),
            value: spec_1.boolean,
        }, (x) => new PushBoolean(x.value));
    }
}
exports.PushBoolean = PushBoolean;
class PushNothing extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "push-nothing";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-nothing"),
        }, (x) => new PushNothing());
    }
}
exports.PushNothing = PushNothing;
class PushLocal extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "push-local";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-local"),
            name: spec_1.string,
        }, (x) => new PushLocal(x.name));
    }
}
exports.PushLocal = PushLocal;
class PushActor extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "push-actor";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("push-actor"),
            name: spec_1.string,
        }, (x) => new PushActor(x.name));
    }
}
exports.PushActor = PushActor;
class Invoke extends AbstractOperation {
    constructor(name, arity) {
        super();
        this.name = name;
        this.arity = arity;
        this.tag = "invoke";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("invoke"),
            name: spec_1.string,
            arity: spec_1.number,
        }, (x) => new Invoke(x.name, x.arity));
    }
}
exports.Invoke = Invoke;
class Return extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "return";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("return"),
        }, (x) => new Return());
    }
}
exports.Return = Return;
class Drop extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "drop";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("drop"),
        }, (x) => new Drop());
    }
}
exports.Drop = Drop;
class Halt extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "halt";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("halt"),
        }, (x) => new Halt());
    }
}
exports.Halt = Halt;
class Goto extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "goto";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("goto"),
            name: spec_1.string,
        }, (x) => new Goto(x.name));
    }
}
exports.Goto = Goto;
class Let extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "let";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("let"),
            name: spec_1.string,
        }, (x) => new Let(x.name));
    }
}
exports.Let = Let;
class InsertFact extends AbstractOperation {
    constructor(name, arity) {
        super();
        this.name = name;
        this.arity = arity;
        this.tag = "insert-fact";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("insert-fact"),
            name: spec_1.string,
            arity: spec_1.number,
        }, (x) => new InsertFact(x.name, x.arity));
    }
}
exports.InsertFact = InsertFact;
class RemoveFact extends AbstractOperation {
    constructor(name, arity) {
        super();
        this.name = name;
        this.arity = arity;
        this.tag = "remove-fact";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("remove-fact"),
            name: spec_1.string,
            arity: spec_1.number,
        }, (x) => new RemoveFact(x.name, x.arity));
    }
}
exports.RemoveFact = RemoveFact;
class TriggerAction extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "trigger-action";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("trigger-action"),
        }, (x) => new TriggerAction());
    }
}
exports.TriggerAction = TriggerAction;
class Search extends AbstractOperation {
    constructor(predicate) {
        super();
        this.predicate = predicate;
        this.tag = "search";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("search"),
            predicate: Predicate,
        }, (x) => new Search(x.predicate));
    }
}
exports.Search = Search;
class TriggerContext extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "trigger-context";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("trigger-context"),
            name: spec_1.string,
        }, (x) => new TriggerContext(x.name));
    }
}
exports.TriggerContext = TriggerContext;
class Branch extends AbstractOperation {
    constructor() {
        super();
        this.tag = "branch";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("branch"),
        }, (x) => new Branch());
    }
}
exports.Branch = Branch;
class Block extends AbstractOperation {
    constructor(parameters, body) {
        super();
        this.parameters = parameters;
        this.body = body;
        this.tag = "block";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("block"),
            parameters: spec_1.array(spec_1.string),
            body: spec_1.array(AbstractOperation),
        }, (x) => new Block(x.parameters, x.body));
    }
}
exports.Block = Block;
class Interpolate extends AbstractOperation {
    constructor(arity) {
        super();
        this.arity = arity;
        this.tag = "interpolate";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("interpolate"),
            arity: spec_1.number,
        }, (x) => new Interpolate(x.arity));
    }
}
exports.Interpolate = Interpolate;
class Yield extends AbstractOperation {
    constructor() {
        super(...arguments);
        this.tag = "yield";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("yield"),
        }, (x) => new Yield());
    }
}
exports.Yield = Yield;
class Project extends AbstractOperation {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "project";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("project"),
            name: spec_1.string,
        }, (x) => new Project(x.name));
    }
}
exports.Project = Project;
class Match extends AbstractOperation {
    constructor(clauses) {
        super();
        this.clauses = clauses;
        this.tag = "match";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("match"),
            clauses: spec_1.array(AbstractMatchClause),
        }, (x) => new Match(x.clauses));
    }
}
exports.Match = Match;
class AbstractMatchClause {
    static get spec() {
        return spec_1.anyOf([MatchPredicate, MatchDefault]);
    }
}
exports.AbstractMatchClause = AbstractMatchClause;
class MatchPredicate extends AbstractMatchClause {
    constructor(predicate) {
        super();
        this.predicate = predicate;
        this.tag = "predicate";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("predicate"),
            predicate: Predicate,
        }, (x) => new MatchPredicate(x.predicate));
    }
}
exports.MatchPredicate = MatchPredicate;
class MatchDefault extends AbstractMatchClause {
    constructor() {
        super();
        this.tag = "default";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("default"),
        }, (x) => new MatchDefault());
    }
}
exports.MatchDefault = MatchDefault;
class AbstractPattern {
    variables() {
        return [];
    }
    static get spec() {
        return spec_1.anyOf([
            IntegerPattern,
            FloatPattern,
            BooleanPattern,
            TextPattern,
            NothingPattern,
            VariablePattern,
            ActorPattern,
        ]);
    }
    toJSON() {
        return { ...this };
    }
}
exports.AbstractPattern = AbstractPattern;
class IntegerPattern extends AbstractPattern {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "integer-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("integer-pattern"),
            value: spec_1.bigint_string,
        }, (x) => new IntegerPattern(x.value));
    }
}
exports.IntegerPattern = IntegerPattern;
class FloatPattern extends AbstractPattern {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "float-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("float-pattern"),
            value: spec_1.number,
        }, (x) => new FloatPattern(x.value));
    }
}
exports.FloatPattern = FloatPattern;
class BooleanPattern extends AbstractPattern {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "boolean-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("boolean-pattern"),
            value: spec_1.boolean,
        }, (x) => new BooleanPattern(x.value));
    }
}
exports.BooleanPattern = BooleanPattern;
class TextPattern extends AbstractPattern {
    constructor(value) {
        super();
        this.value = value;
        this.tag = "text-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("text-pattern"),
            value: spec_1.string,
        }, (x) => new TextPattern(x.value));
    }
}
exports.TextPattern = TextPattern;
class NothingPattern extends AbstractPattern {
    constructor() {
        super(...arguments);
        this.tag = "nothing-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("nothing-pattern"),
        }, (x) => new NothingPattern());
    }
}
exports.NothingPattern = NothingPattern;
class ActorPattern extends AbstractPattern {
    constructor(actor_name) {
        super();
        this.actor_name = actor_name;
        this.tag = "actor-pattern";
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("actor-pattern"),
            actor_name: spec_1.string,
        }, (x) => new ActorPattern(x.actor_name));
    }
}
exports.ActorPattern = ActorPattern;
class VariablePattern extends AbstractPattern {
    constructor(name) {
        super();
        this.name = name;
        this.tag = "variable-pattern";
    }
    variables() {
        return [this.name];
    }
    static get spec() {
        return spec_1.spec({
            tag: spec_1.equal("variable-pattern"),
            name: spec_1.string,
        }, (x) => new VariablePattern(x.name));
    }
}
exports.VariablePattern = VariablePattern;

},{"../utils/spec":15,"../vm-js/logic":19}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
const utils_1 = require("../utils/utils");
const html_1 = require("./html");
class Display {
    constructor(canvas) {
        this.canvas = canvas;
    }
    async show(x) {
        this.canvas.appendChild(x);
        x.scrollIntoView();
    }
    async show_error(error) {
        console.error(error);
        const element = html_1.h("div", { class: "crochet-error" }, error);
        this.canvas.appendChild(element);
    }
    text(text) {
        return html_1.h("div", { class: "crochet-text" }, text);
    }
    monospaced_text(text) {
        return html_1.h("div", { class: "crochet-mono" }, text);
    }
    title(text) {
        return html_1.h("div", { class: "crochet-title" }, text);
    }
    divider() {
        return html_1.h("div", { class: "crochet-divider" });
    }
    button(text, on_click) {
        const element = html_1.h("div", { class: "crochet-button" }, text);
        element.addEventListener("click", (_) => {
            element.setAttribute("data-selected", "true");
            on_click();
        });
        return element;
    }
    menu(options, on_selected) {
        const element = html_1.h("div", { class: "crochet-menu" }, ...options.map((x) => this.button(x.title, () => {
            element.setAttribute("data-selected", "true");
            on_selected(x.value);
        })));
        return element;
    }
    async show_menu(options) {
        const deferred = utils_1.defer();
        this.show(this.menu(options, (selection) => deferred.resolve(selection)));
        return deferred.promise;
    }
}
exports.Display = Display;

},{"../utils/utils":16,"./html":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = void 0;
function h(tag, attributes, ...contents) {
    const element = document.createElement(tag);
    for (const [k, v] of Object.entries(attributes)) {
        element.setAttribute(k, v);
    }
    for (const x of contents) {
        if (typeof x === "string") {
            element.appendChild(document.createTextNode(x));
        }
        else {
            element.appendChild(x);
        }
    }
    return element;
}
exports.h = h;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_program = void 0;
const IR = require("../ir");
async function load_program(url) {
    const response = await fetch(url);
    const json = await response.json();
    const ir = IR.fromJson(json);
    return ir;
}
exports.load_program = load_program;

},{"../ir":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const vm_1 = require("../vm-js/vm");
const Stdlib = require("../stdlib");
const primitives_1 = require("../vm-js/primitives");
const display_1 = require("./display");
const primitives_2 = require("./primitives");
const loader_1 = require("./loader");
async function run(selector, programs, extension) {
    const ffi = new primitives_1.ForeignInterface();
    const vm = new vm_1.CrochetVM(ffi);
    Stdlib.add_prelude(vm, ffi);
    const canvas = document.querySelector(selector);
    if (canvas == null) {
        alert("No element ${selector");
        throw new Error(`No element ${selector}`);
    }
    const display = new display_1.Display(canvas);
    const primitives = new primitives_2.Primitives(display);
    primitives_2.add_primitives(vm, ffi, primitives);
    for (const program of programs) {
        const module = await loader_1.load_program(program);
        vm.load_module(module);
    }
    if (extension != null) {
        extension(vm, ffi, display);
    }
    await vm.run().catch((error) => {
        console.error(error);
        display.show_error(error.message);
    });
}
exports.run = run;

},{"../stdlib":11,"../vm-js/primitives":20,"../vm-js/vm":23,"./display":4,"./loader":6,"./primitives":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitives = exports.add_primitives = void 0;
const utils_1 = require("../utils/utils");
function add_primitives(vm, ffi, primitives) {
    const root = vm.root_env;
    ffi.add("crochet.player:say", 1, primitives.say);
    vm.add_foreign_command(root, "say:", ["Text"], [0], "crochet.player:say");
    ffi.add("crochet.player:wait", 1, primitives.wait);
    vm.add_foreign_command(root, "wait:", ["Seconds"], [0], "crochet.player:wait");
    ffi.add("crochet.player:show", 1, primitives.show);
    vm.add_foreign_command(root, "_ show", ["Element"], [0], "crochet.player:show");
    ffi.add("crochet.player:title", 1, primitives.title);
    vm.add_foreign_command(root, "_ title", ["Element"], [0], "crochet.player:title");
    ffi.add("crochet.player:monospace", 1, primitives.monospaced_text);
    vm.add_foreign_command(root, "_ monospaced-text", ["Element"], [0], "crochet.player:monospace");
    ffi.add("crochet.player:text", 1, primitives.text);
    vm.add_foreign_command(root, "_ text", ["Element"], [0], "crochet.player:text");
    ffi.add("crochet.player:divider", 0, primitives.divider);
    vm.add_foreign_command(root, "divider", [], [], "crochet.player:divider");
}
exports.add_primitives = add_primitives;
class Primitives {
    constructor(display) {
        this.display = display;
        this.say = async (vm, text) => {
            vm.assert_text(text);
            this.display.show(this.display.text(text.value));
            return vm.nothing;
        };
        this.wait = async (vm, time) => {
            vm.assert_integer(time);
            await utils_1.delay(Number(time.value * 1000n));
            return vm.nothing;
        };
        this.text = async (vm, text) => {
            vm.assert_text(text);
            return vm.box(this.display.text(text.value));
        };
        this.show = async (vm, value) => {
            vm.assert_box(value);
            const element = value.to_js();
            if (!(element instanceof Element)) {
                throw new Error(`Expected an HTMLElement`);
            }
            this.display.show(element);
            return vm.nothing;
        };
        this.monospaced_text = async (vm, text) => {
            vm.assert_text(text);
            return vm.box(this.display.monospaced_text(text.value));
        };
        this.title = async (vm, text) => {
            vm.assert_text(text);
            return vm.box(this.display.title(text.value));
        };
        this.divider = async (vm) => {
            return vm.box(this.display.divider());
        };
    }
}
exports.Primitives = Primitives;

},{"../utils/utils":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = void 0;
function and(vm, x, y) {
    vm.assert_boolean(x);
    vm.assert_boolean(y);
    return x.and(y);
}
exports.and = and;
function or(vm, x, y) {
    vm.assert_boolean(x);
    vm.assert_boolean(y);
    return x.or(y);
}
exports.or = or;
function not(vm, x) {
    vm.assert_boolean(x);
    return x.not();
}
exports.not = not;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to_text = exports.not_equals = exports.equals = void 0;
function equals(vm, x, y) {
    return vm.boolean(x.equals(y));
}
exports.equals = equals;
function not_equals(vm, x, y) {
    return vm.boolean(!x.equals(y));
}
exports.not_equals = not_equals;
function to_text(vm, x) {
    return vm.text(x.to_text());
}
exports.to_text = to_text;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_prelude = void 0;
const boolean_1 = require("./boolean");
const core_1 = require("./core");
const numeric_1 = require("./numeric");
const text_1 = require("./text");
const stream_1 = require("./stream");
function add_prelude(vm, ffi) {
    const root = vm.root_env;
    ffi.add("builtin:equals", 2, core_1.equals);
    vm.add_foreign_command(root, "_ === _", ["This", "That"], [0, 1], "builtin:equals");
    ffi.add("builtin:not-equals", 2, core_1.not_equals);
    vm.add_foreign_command(root, "_ =/= _", ["This", "That"], [0, 1], "builtin:not-equals");
    ffi.add("builtin:to-text", 1, core_1.to_text);
    vm.add_foreign_command(root, "_ as-text", ["This"], [0], "builtin:to-text");
    ffi.add("builtin:less-than", 2, numeric_1.less_than);
    vm.add_foreign_command(root, "_ < _", ["This", "That"], [0, 1], "builtin:less-than");
    ffi.add("builtin:less-than-or-equal", 2, numeric_1.less_than_or_equal);
    vm.add_foreign_command(root, "_ <= _", ["This", "That"], [0, 1], "builtin:less-than-or-equal");
    ffi.add("builtin:greater-than", 2, numeric_1.greater_than);
    vm.add_foreign_command(root, "_ > _", ["This", "That"], [0, 1], "builtin:greater-than");
    ffi.add("builtin:greater-than-or-equal", 2, numeric_1.greater_than_or_equal);
    vm.add_foreign_command(root, "_ >= _", ["This", "That"], [0, 1], "builtin:greater-than-or-equal");
    ffi.add("builtin:add", 2, numeric_1.add);
    vm.add_foreign_command(root, "_ + _", ["This", "That"], [0, 1], "builtin:add");
    ffi.add("builtin:subtract", 2, numeric_1.subtract);
    vm.add_foreign_command(root, "_ - _", ["This", "That"], [0, 1], "builtin:subtract");
    ffi.add("builtin:multiply", 2, numeric_1.multiply);
    vm.add_foreign_command(root, "_ * _", ["This", "That"], [0, 1], "builtin:multiply");
    ffi.add("builtin:divide", 2, numeric_1.divide);
    vm.add_foreign_command(root, "_ / _", ["This", "That"], [0, 1], "builtin:divide");
    ffi.add("builtin:remainder", 2, numeric_1.remainder);
    vm.add_foreign_command(root, "_ remainder-of-dividing-by:", ["This", "That"], [0, 1], "builtin:remainder");
    ffi.add("builtin:concat", 2, text_1.concat);
    vm.add_foreign_command(root, "_ ++ _", ["This", "That"], [0, 1], "builtin:concat");
    ffi.add("builtin:title-case", 1, text_1.title_case);
    vm.add_foreign_command(root, "_ title-case", ["This"], [0], "builtin:title-case");
    ffi.add("builtin:and", 2, boolean_1.and);
    vm.add_foreign_command(root, "_ and:", ["This", "That"], [0, 1], "builtin:and");
    ffi.add("builtin:or", 2, boolean_1.or);
    vm.add_foreign_command(root, "_ or:", ["This", "That"], [0, 1], "builtin:or");
    ffi.add("builtin:not", 1, boolean_1.not);
    vm.add_foreign_command(root, "_ bnot", ["This"], [0], "builtin:not");
    ffi.add("builtin:first", 1, stream_1.first);
    vm.add_foreign_command(root, "_ first", ["Stream"], [0], "builtin:first");
}
exports.add_prelude = add_prelude;

},{"./boolean":9,"./core":10,"./numeric":12,"./stream":13,"./text":14}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remainder = exports.divide = exports.multiply = exports.subtract = exports.add = exports.greater_than_or_equal = exports.less_than_or_equal = exports.greater_than = exports.less_than = void 0;
function less_than(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.less_than(y);
}
exports.less_than = less_than;
function greater_than(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.greater_than(y);
}
exports.greater_than = greater_than;
function less_than_or_equal(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.less_than(y).or(vm.boolean(x.equals(y)));
}
exports.less_than_or_equal = less_than_or_equal;
function greater_than_or_equal(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.greater_than(y).or(vm.boolean(x.equals(y)));
}
exports.greater_than_or_equal = greater_than_or_equal;
function add(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.add(y);
}
exports.add = add;
function subtract(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.subtract(y);
}
exports.subtract = subtract;
function multiply(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.multiply(y);
}
exports.multiply = multiply;
function divide(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.divide(y);
}
exports.divide = divide;
function remainder(vm, x, y) {
    vm.assert_integer(x);
    vm.assert_integer(y);
    return x.remainder(y);
}
exports.remainder = remainder;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
function first(vm, stream) {
    vm.assert_stream(stream);
    if (stream.values.length === 0) {
        throw new Error(`Empty stream`);
    }
    return stream.values[0];
}
exports.first = first;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.title_case = exports.concat = void 0;
const intrinsics_1 = require("../vm-js/intrinsics");
function concat(vm, x, y) {
    vm.assert_text(x);
    vm.assert_text(y);
    return x.concat(y);
}
exports.concat = concat;
function title_case(vm, x) {
    vm.assert_text(x);
    return new intrinsics_1.CrochetText(x.value.replace(/^[a-z]/, (m) => m.toUpperCase()));
}
exports.title_case = title_case;

},{"../vm-js/intrinsics":18}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.optional = exports.spec = exports.anyOf = exports.equal = exports.array = exports.nothing = exports.boolean = exports.number = exports.bigint_string = exports.bigint = exports.string = exports.EAnyOf = exports.ENotEqual = exports.ENoKey = exports.EType = exports.Err = exports.Ok = void 0;
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
}
exports.EType = EType;
class ENoKey {
    constructor(key) {
        this.key = key;
    }
}
exports.ENoKey = ENoKey;
class ENotEqual {
    constructor(expected) {
        this.expected = expected;
    }
}
exports.ENotEqual = ENotEqual;
class EAnyOf {
    constructor(errors) {
        this.errors = errors;
    }
}
exports.EAnyOf = EAnyOf;
function toSpec(x) {
    if (typeof x.spec === "function") {
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
                if (k in value) {
                    return toSpec(f)(value[k]).chain((v) => new Ok([k, v]));
                }
                else {
                    return new Err(new ENoKey(k));
                }
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
        return toSpec(spec)(value).recover((_) => new Ok(default_value));
    };
}
exports.optional = optional;
function parse(x, spec) {
    const result = toSpec(spec)(x);
    if (result instanceof Ok) {
        return result.value;
    }
    else {
        console.error(result.reason);
        throw new Error(`Failed to parse`);
    }
}
exports.parse = parse;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = exports.defer = exports.delay = exports.pick = exports.show = exports.unreachable = void 0;
const Util = require("util");
function unreachable(x, message) {
    console.error(message, x);
    throw new Error(message);
}
exports.unreachable = unreachable;
function show(x) {
    return Util.inspect(x, false, null, true);
}
exports.show = show;
function pick(xs) {
    if (xs.length === 0) {
        return null;
    }
    else {
        return xs[Math.floor(Math.random() * xs.length)];
    }
}
exports.pick = pick;
function delay(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
exports.delay = delay;
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

},{"util":43}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activation = exports.Environment = void 0;
const IR = require("../ir/operations");
class Environment {
    constructor(parent) {
        this.parent = parent;
        this.bindings = new Map();
        this.procedures = new Map();
        this.actors = new Map();
    }
    lookup_procedure(name) {
        const value = this.procedures.get(name);
        if (value != null) {
            return value;
        }
        else if (this.parent != null) {
            return this.parent.lookup_procedure(name);
        }
        else {
            return null;
        }
    }
    define_procedure(name, procedure) {
        if (!this.procedures.has(name)) {
            this.procedures.set(name, procedure);
            return true;
        }
        else {
            return false;
        }
    }
    lookup_actor(name) {
        const value = this.actors.get(name);
        if (value != null) {
            return value;
        }
        else if (this.parent != null) {
            return this.parent.lookup_actor(name);
        }
        else {
            return null;
        }
    }
    define_actor(name, type) {
        if (!this.actors.has(name)) {
            this.actors.set(name, type);
            return true;
        }
        else {
            return false;
        }
    }
    lookup(name) {
        const value = this.bindings.get(name);
        if (value != null) {
            return value;
        }
        else if (this.parent != null) {
            return this.parent.lookup(name);
        }
        else {
            return null;
        }
    }
    define(name, value) {
        if (!this.bindings.has(name)) {
            this.bindings.set(name, value);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Environment = Environment;
class Activation {
    constructor(parent, env, block) {
        this.parent = parent;
        this.env = env;
        this.block = block;
        this.current_index = 0;
        this.stack = [];
    }
    get current() {
        if (this.current_index < 0 || this.current_index >= this.block.length) {
            return new IR.Halt();
        }
        return this.block[this.current_index];
    }
    next() {
        this.current_index += 1;
    }
    push(value) {
        this.stack.push(value);
    }
    pop() {
        if (this.stack.length === 0) {
            throw new Error(`pop() on an empty stack`);
        }
        return this.stack.pop();
    }
    pop_many(size) {
        if (this.stack.length < size) {
            throw new Error(`pop() on an empty stack`);
        }
        const result = this.stack.slice(-size);
        this.stack.length -= size;
        return result;
    }
}
exports.Activation = Activation;

},{"../ir/operations":3}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nothing = exports.CrochetBox = exports.CrochetBlock = exports.CrochetStream = exports.CrochetRecord = exports.CrochetActor = exports.CrochetNothing = exports.CrochetBoolean = exports.CrochetFloat = exports.CrochetInteger = exports.CrochetText = exports.CrochetValue = void 0;
class CrochetValue {
}
exports.CrochetValue = CrochetValue;
class CrochetText extends CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = "Text";
    }
    equals(x) {
        return x instanceof CrochetText && x.value === this.value;
    }
    concat(x) {
        return new CrochetText(this.value + x.value);
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return this.value;
    }
}
exports.CrochetText = CrochetText;
class CrochetInteger extends CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = "Integer";
    }
    equals(x) {
        return x instanceof CrochetInteger && x.value === this.value;
    }
    less_than(x) {
        return new CrochetBoolean(this.value < x.value);
    }
    greater_than(x) {
        return new CrochetBoolean(this.value > x.value);
    }
    add(x) {
        return new CrochetInteger(this.value + x.value);
    }
    subtract(x) {
        return new CrochetInteger(this.value - x.value);
    }
    multiply(x) {
        return new CrochetInteger(this.value * x.value);
    }
    divide(x) {
        return new CrochetInteger(this.value / x.value);
    }
    remainder(x) {
        return new CrochetInteger(this.value % x.value);
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return this.value.toString();
    }
}
exports.CrochetInteger = CrochetInteger;
class CrochetFloat extends CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = "Float";
    }
    equals(x) {
        return x instanceof CrochetFloat && x.value === this.value;
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return this.value.toString();
    }
}
exports.CrochetFloat = CrochetFloat;
class CrochetBoolean extends CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = "Boolean";
    }
    equals(x) {
        return x instanceof CrochetBoolean && x.value === this.value;
    }
    and(x) {
        return new CrochetBoolean(this.value && x.value);
    }
    or(x) {
        return new CrochetBoolean(this.value || x.value);
    }
    not() {
        return new CrochetBoolean(!this.value);
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return this.value.toString();
    }
}
exports.CrochetBoolean = CrochetBoolean;
class CrochetNothing extends CrochetValue {
    constructor() {
        super(...arguments);
        this.type = "Nothing";
    }
    equals(x) {
        return x instanceof CrochetNothing;
    }
    to_js() {
        return null;
    }
    to_text() {
        return "<nothing>";
    }
}
exports.CrochetNothing = CrochetNothing;
class CrochetActor extends CrochetValue {
    constructor(name, roles) {
        super();
        this.name = name;
        this.roles = roles;
        this.type = "Actor";
    }
    equals(x) {
        return x === this;
    }
    has_role(x) {
        return this.roles.has(x);
    }
    to_js() {
        return this;
    }
    to_text() {
        return `#${this.name}`;
    }
}
exports.CrochetActor = CrochetActor;
class CrochetRecord extends CrochetValue {
    constructor(values) {
        super();
        this.values = values;
        this.type = "Record";
    }
    equals(x) {
        if (!(x instanceof CrochetRecord)) {
            return false;
        }
        const keys = new Set(this.values.keys());
        const other_keys = [...x.values.keys()];
        if (keys.size !== other_keys.length) {
            return false;
        }
        for (const key of other_keys) {
            if (!keys.has(key)) {
                return false;
            }
            if (!this.values.get(key)?.equals(x.values.get(key))) {
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
    to_text() {
        const pairs = [...this.values.entries()].map(([k, v]) => `${k} => ${v.to_text()}`);
        return `{${pairs.join(", ")}}`;
    }
}
exports.CrochetRecord = CrochetRecord;
class CrochetStream extends CrochetValue {
    constructor(values) {
        super();
        this.values = values;
        this.type = "stream";
    }
    equals(x) {
        if (!(x instanceof CrochetStream)) {
            return false;
        }
        if (x.values.length !== this.values.length) {
            return false;
        }
        for (let i = 0; i < x.values.length; ++i) {
            if (!x.values[i].equals(this.values[i])) {
                return false;
            }
        }
        return true;
    }
    to_js() {
        return this.values.map((x) => x.to_js());
    }
    to_text() {
        return `[${this.values.map((x) => x.to_text()).join(", ")}]`;
    }
}
exports.CrochetStream = CrochetStream;
class CrochetBlock extends CrochetValue {
    constructor(env, parameters, body) {
        super();
        this.env = env;
        this.parameters = parameters;
        this.body = body;
        this.type = "block";
    }
    equals(x) {
        return x === this;
    }
    to_js() {
        return this;
    }
    to_text() {
        return `<block {...}>`;
    }
}
exports.CrochetBlock = CrochetBlock;
class CrochetBox extends CrochetValue {
    constructor(value) {
        super();
        this.value = value;
        this.type = "Box";
    }
    equals(x) {
        return this === x;
    }
    to_js() {
        return this.value;
    }
    to_text() {
        return `<box>`;
    }
}
exports.CrochetBox = CrochetBox;
exports.nothing = new CrochetNothing();

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnificationEnvironment = exports.Component = exports.Many = exports.One = exports.Multiplicity = exports.RelationType = exports.SingleNode = exports.ManyNode = exports.EndNode = exports.RelationNode = exports.Pair = exports.VariablePattern = exports.ActorPattern = exports.ValuePattern = exports.Pattern = exports.Database = void 0;
class Database {
    constructor() {
        this.relations = new Map();
    }
    add(type) {
        if (this.relations.has(type.name)) {
            return false;
        }
        else {
            this.relations.set(type.name, type);
        }
    }
    lookup(name) {
        return this.relations.get(name) ?? null;
    }
}
exports.Database = Database;
class Pattern {
}
exports.Pattern = Pattern;
class ValuePattern extends Pattern {
    constructor(value) {
        super();
        this.value = value;
    }
    unify(env, value) {
        if (this.value.equals(value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.ValuePattern = ValuePattern;
class ActorPattern extends Pattern {
    constructor(type) {
        super();
        this.type = type;
    }
    unify(env, value) {
        if (this.type.equals(value)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.ActorPattern = ActorPattern;
class VariablePattern extends Pattern {
    constructor(name) {
        super();
        this.name = name;
    }
    unify(env, value) {
        const bound = env.lookup(this.name);
        if (bound == null) {
            if (this.name === "_") {
                return env;
            }
            else {
                const new_env = env.clone();
                new_env.add(this.name, value);
                return new_env;
            }
        }
        else if (value.equals(bound)) {
            return env;
        }
        else {
            return null;
        }
    }
}
exports.VariablePattern = VariablePattern;
class Pair {
    constructor(value, tree) {
        this.value = value;
        this.tree = tree;
    }
}
exports.Pair = Pair;
class RelationNode {
}
exports.RelationNode = RelationNode;
class EndNode extends RelationNode {
    insert(values) {
        if (values.length !== 0) {
            throw new Error(`Insert with extraneous values`);
        }
    }
    remove(values) {
        if (values.length !== 0) {
            throw new Error(`Remove with extraneous values`);
        }
        return null;
    }
    search(env, patterns) {
        if (patterns.length !== 0) {
            throw new Error(`Search with extraneous patterns`);
        }
        return [env];
    }
}
exports.EndNode = EndNode;
class ManyNode extends RelationNode {
    constructor(new_tree) {
        super();
        this.new_tree = new_tree;
        this.trees = [];
    }
    remove(values) {
        const [head, ...tail] = values;
        this.trees = this.trees.flatMap((pair) => {
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
        if (this.trees.length === 0) {
            return null;
        }
        else {
            return this;
        }
    }
    insert(values) {
        const [head, ...tail] = values;
        for (const pair of this.trees) {
            if (pair.value.equals(head)) {
                pair.tree.insert(tail);
                return;
            }
        }
        const sub_tree = this.new_tree();
        this.trees.push(new Pair(head, sub_tree));
        sub_tree.insert(tail);
    }
    search(env, patterns) {
        const [head, ...tail] = patterns;
        return this.trees.flatMap((pair) => {
            const new_env = head.unify(env, pair.value);
            if (new_env === null) {
                return [];
            }
            else {
                return pair.tree.search(new_env, tail);
            }
        });
    }
}
exports.ManyNode = ManyNode;
class SingleNode extends RelationNode {
    constructor(new_tree) {
        super();
        this.new_tree = new_tree;
    }
    insert(values) {
        const [head, ...tail] = values;
        this.value = head;
        this.sub_tree = this.new_tree();
        this.sub_tree.insert(tail);
    }
    remove(values) {
        const [head, ...tail] = values;
        if (head.equals(this.value)) {
            const result = this.sub_tree.remove(tail);
            if (result == null) {
                return null;
            }
            else {
                this.sub_tree = result;
                return this;
            }
        }
        else {
            return this;
        }
    }
    search(env, patterns) {
        const [head, ...tail] = patterns;
        const new_env = head.unify(env, this.value);
        if (new_env == null) {
            return [];
        }
        else {
            return this.sub_tree.search(new_env, tail);
        }
    }
}
exports.SingleNode = SingleNode;
class RelationType {
    constructor(name, arity, components) {
        this.name = name;
        this.arity = arity;
        this.components = components;
        this.tree = build_tree_structure(components)();
    }
    insert(values) {
        if (this.arity !== values.length) {
            throw new Error(`Invalid arity ${values.length} for relation ${this.name}`);
        }
        this.tree.insert(values);
    }
    remove(values) {
        const result = this.tree.remove(values);
        if (result == null) {
            this.tree = build_tree_structure(this.components)();
        }
        else {
            this.tree = result;
        }
    }
    search(patterns, env) {
        return this.tree.search(env, patterns);
    }
}
exports.RelationType = RelationType;
class Multiplicity {
}
exports.Multiplicity = Multiplicity;
class One extends Multiplicity {
    to_tree(subtree) {
        return new SingleNode(subtree);
    }
}
exports.One = One;
class Many extends Multiplicity {
    to_tree(subtree) {
        return new ManyNode(subtree);
    }
}
exports.Many = Many;
class Component {
    constructor(multiplicity, name) {
        this.multiplicity = multiplicity;
        this.name = name;
    }
    to_tree(subtree) {
        return this.multiplicity.to_tree(subtree);
    }
}
exports.Component = Component;
function build_tree_structure(components) {
    if (components.length === 0) {
        throw new Error(`empty components`);
    }
    else {
        return components.reduceRight((subtree, component) => {
            return () => component.to_tree(subtree);
        }, () => new EndNode());
    }
}
class UnificationEnvironment {
    constructor() {
        this.bindings = new Map();
    }
    static from_map(map) {
        const new_env = new UnificationEnvironment();
        for (const [k, v] of map) {
            new_env.bindings.set(k, v);
        }
        return new_env;
    }
    clone() {
        return UnificationEnvironment.from_map(this.bindings);
    }
    add(name, value) {
        this.bindings.set(name, value);
    }
    lookup(name) {
        return this.bindings.get(name) ?? null;
    }
    get bound_values() {
        return this.bindings;
    }
}
exports.UnificationEnvironment = UnificationEnvironment;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignInterface = exports.ForeignFunction = void 0;
class ForeignFunction {
    constructor(arity, fn) {
        this.arity = arity;
        this.fn = fn;
    }
}
exports.ForeignFunction = ForeignFunction;
class ForeignInterface {
    constructor() {
        this.bindings = new Map();
    }
    add(name, arity, fn) {
        if (this.bindings.has(name)) {
            throw new Error(`Duplicated foreign function definition ${name}`);
        }
        this.bindings.set(name, new ForeignFunction(arity, fn));
    }
    get(name) {
        const value = this.bindings.get(name);
        if (value == null) {
            throw new Error(`Unknown foreign function ${name}`);
        }
        return value;
    }
}
exports.ForeignInterface = ForeignInterface;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetForeignProcedure = exports.CrochetProcedure = void 0;
const environment_1 = require("./environment");
const vm_1 = require("./vm");
class CrochetProcedure {
    constructor(env, name, parameters, body) {
        this.env = env;
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }
    get arity() {
        return this.parameters.length;
    }
    async invoke(vm, activation, args) {
        const new_env = new environment_1.Environment(this.env);
        this.parameters.forEach((k, i) => new_env.define(k, args[i]));
        const new_activation = new environment_1.Activation(activation, new_env, this.body);
        return new_activation;
    }
}
exports.CrochetProcedure = CrochetProcedure;
class CrochetForeignProcedure {
    constructor(name, parameters, args, code) {
        this.name = name;
        this.parameters = parameters;
        this.args = args;
        this.code = code;
    }
    get arity() {
        return this.parameters.length;
    }
    async invoke(vm, activation, args) {
        const code = this.code;
        const actual_args = this.args.map((x) => args[x]);
        const vmi = new vm_1.CrochetVMInterface(vm, activation);
        const result = await code(vmi, ...actual_args);
        activation.push(result);
        return activation;
    }
}
exports.CrochetForeignProcedure = CrochetForeignProcedure;

},{"./environment":17,"./vm":23}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.Hook = exports.Action = exports.Scene = void 0;
class Scene {
    constructor(module, name, env, body) {
        this.module = module;
        this.name = name;
        this.env = env;
        this.body = body;
    }
}
exports.Scene = Scene;
class Action {
    constructor(module, title, env, predicate, body) {
        this.module = module;
        this.title = title;
        this.env = env;
        this.predicate = predicate;
        this.body = body;
    }
}
exports.Action = Action;
class Hook {
    constructor(module, env, predicate, body) {
        this.module = module;
        this.env = env;
        this.predicate = predicate;
        this.body = body;
    }
}
exports.Hook = Hook;
class Context {
    constructor(name, hooks) {
        this.name = name;
        this.hooks = hooks;
    }
}
exports.Context = Context;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetVMInterface = exports.CrochetVM = void 0;
const IR = require("../ir/operations");
const environment_1 = require("./environment");
const procedure_1 = require("./procedure");
const scene_1 = require("./scene");
const utils_1 = require("../utils/utils");
const intrinsics_1 = require("./intrinsics");
const logic_1 = require("./logic");
const Logic = require("./logic");
class Halt {
}
class CrochetVM {
    constructor(ffi) {
        this.ffi = ffi;
        this.root_env = new environment_1.Environment(null);
        this.queue = [];
        this.scenes = new Map();
        this.contexts = new Map();
        this.actions = [];
        this.running = false;
        this.tracing = false;
        this.database = new logic_1.Database();
        this._pick = async (activation, options) => {
            return utils_1.pick(options);
        };
    }
    //== Hooks
    on_pick(fn) {
        this._pick = (activation, options) => fn(new CrochetVMInterface(this, activation), options);
    }
    //== Public operations
    get global() {
        return new CrochetVMInterface(this, new environment_1.Activation(null, this.root_env, [new IR.Halt()]));
    }
    async run() {
        if (this.running) {
            throw new Error(`Trying to run the VM twice.`);
        }
        this.running = true;
        while (this.queue.length !== 0) {
            const result = await this.run_next();
            if (result instanceof Halt) {
                this.running = false;
                break;
            }
        }
    }
    load_module(module) {
        for (const declaration of module.declarations) {
            this.load_declaration(module, this.root_env, declaration);
        }
    }
    get_scene(activation, name) {
        const scene = this.scenes.get(name);
        if (scene == null) {
            throw new Error(`Undefined scene ${name}`);
        }
        return scene;
    }
    make_scene_activation(activation0, scene) {
        const new_env = new environment_1.Environment(scene.env);
        const activation = new environment_1.Activation(activation0, new_env, scene.body);
        return activation;
    }
    schedule(activation) {
        this.queue.push(activation);
    }
    assert_text(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetText)) {
            throw new Error(`Expected a Text, got ${value.type}`);
        }
    }
    assert_integer(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetInteger)) {
            throw new Error(`Expected an Integer, got ${value.type}`);
        }
    }
    assert_stream(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetStream)) {
            throw new Error(`Expected a Stream, got ${value.type}`);
        }
    }
    assert_record(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetRecord)) {
            throw new Error(`Expected a Record, got ${value.type}`);
        }
    }
    assert_boolean(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetBoolean)) {
            throw new Error(`Expected a Boolean, got ${value.type}`);
        }
    }
    assert_actor(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetActor)) {
            throw new Error(`Expected an Actor, got ${value.type}`);
        }
    }
    assert_block(activation, value) {
        if (!(value instanceof intrinsics_1.CrochetBlock)) {
            throw new Error(`Expected a Block, got ${value.type}`);
        }
    }
    make_block_activation(activation, block, args) {
        if (args.length !== block.parameters.length) {
            throw new Error(`Invalid arity. Expected ${block.parameters.length}, got ${args.length}`);
        }
        const new_env = new environment_1.Environment(block.env);
        for (let i = 0; i < block.parameters.length; ++i) {
            new_env.define(block.parameters[i], args[i]);
        }
        const new_activation = new environment_1.Activation(activation, new_env, block.body);
        return new_activation;
    }
    //== Tracing and debugging
    trace(value) {
        this.tracing = value;
    }
    trace_operation(activation, op) {
        if (this.tracing) {
            console.log(`[TRACE]`, utils_1.show(op));
        }
    }
    trace_activation(activation) {
        if (this.tracing) {
            if (activation instanceof Halt) {
                console.log("[TRACE] Halt");
                return;
            }
            if (activation == null) {
                console.log("[TRACE] Yield");
                return;
            }
            console.log("[TRACE]", utils_1.show({
                parent: activation.parent != null,
                current: [activation.current_index, activation.current],
                block: activation.block,
                stack: activation.stack,
            }));
        }
    }
    //== Running
    async run_next() {
        let activation = await this.next_activation();
        while (activation != null) {
            this.trace_activation(activation);
            const new_activation = await this.step(activation);
            if (new_activation !== activation) {
                this.trace_activation(new_activation);
            }
            if (new_activation instanceof Halt) {
                return new_activation;
            }
            else {
                activation = new_activation;
            }
        }
    }
    async step(activation) {
        const operation = activation.current;
        this.trace_operation(activation, operation);
        switch (operation.tag) {
            case "block": {
                const value = new intrinsics_1.CrochetBlock(activation.env, operation.parameters, operation.body);
                activation.push(value);
                activation.next();
                return activation;
            }
            case "branch": {
                const ifFalse = activation.pop();
                const ifTrue = activation.pop();
                const test = activation.pop();
                this.assert_boolean(activation, test);
                this.assert_block(activation, ifFalse);
                this.assert_block(activation, ifTrue);
                const block = test.value ? ifTrue : ifFalse;
                const new_activation = this.make_block_activation(activation, block, []);
                activation.next();
                return new_activation;
            }
            case "drop": {
                activation.pop();
                activation.next();
                return activation;
            }
            case "halt": {
                return new Halt();
            }
            case "goto": {
                const scene = this.get_scene(activation, operation.name);
                return this.make_scene_activation(activation, scene);
            }
            case "insert-fact": {
                const relation = this.get_relation(activation, operation.name);
                if (relation.arity !== operation.arity) {
                    throw new Error(`Invalid arity for relation ${relation.name}. Expected ${relation.arity}, got ${operation.arity}`);
                }
                const values = activation.pop_many(operation.arity);
                relation.insert(values);
                activation.next();
                return activation;
            }
            case "interpolate": {
                const values = activation.pop_many(operation.arity);
                const text = values.reduce((x, y) => {
                    return x + y.to_text();
                }, "");
                activation.push(new intrinsics_1.CrochetText(text));
                activation.next();
                return activation;
            }
            case "invoke": {
                const procedure = this.get_procedure(activation, operation.name);
                if (procedure.arity !== operation.arity) {
                    throw new Error(`Invalid arity for ${operation.name}. Expected ${procedure.arity}, got ${operation.arity}`);
                }
                const args = activation.pop_many(operation.arity);
                activation.next();
                return procedure.invoke(this, activation, args);
            }
            case "let": {
                const value = activation.pop();
                activation.env.define(operation.name, value);
                activation.next();
                return activation;
            }
            case "match": {
                const blocks = activation.pop_many(operation.clauses.length);
                for (const [block, clause] of utils_1.zip(blocks, operation.clauses)) {
                    this.assert_block(activation, block);
                    const new_activation = this.evaluate_clause(activation, clause, block);
                    if (new_activation != null) {
                        activation.next();
                        return new_activation;
                    }
                }
                throw new Error(`No clause matched`);
            }
            case "project": {
                const value = activation.pop();
                activation.push(this.project(activation, value, operation.name));
                activation.next();
                return activation;
            }
            case "push-actor": {
                const actor = this.get_actor(activation, operation.name);
                activation.push(actor);
                activation.next();
                return activation;
            }
            case "push-boolean": {
                activation.push(new intrinsics_1.CrochetBoolean(operation.value));
                activation.next();
                return activation;
            }
            case "push-float": {
                activation.push(new intrinsics_1.CrochetFloat(operation.value));
                activation.next();
                return activation;
            }
            case "push-integer": {
                activation.push(new intrinsics_1.CrochetInteger(operation.value));
                activation.next();
                return activation;
            }
            case "push-local": {
                const value = this.get_local(activation, operation.name);
                activation.push(value);
                activation.next();
                return activation;
            }
            case "push-nothing": {
                activation.push(intrinsics_1.nothing);
                activation.next();
                return activation;
            }
            case "push-text": {
                activation.push(new intrinsics_1.CrochetText(operation.value));
                activation.next();
                return activation;
            }
            case "remove-fact": {
                const relation = this.get_relation(activation, operation.name);
                if (relation.arity !== operation.arity) {
                    throw new Error(`Invalid arity for relation ${relation.name}. Expected ${relation.arity}, got ${operation.arity}`);
                }
                const values = activation.pop_many(operation.arity);
                relation.remove(values);
                activation.next();
                return activation;
            }
            case "return": {
                const result = activation.pop();
                activation.next();
                const parent = activation.parent;
                if (parent != null) {
                    parent.push(result);
                    return parent;
                }
                else {
                    return null;
                }
            }
            case "search": {
                const results0 = this.search(activation, operation.predicate);
                const results = results0.map((x) => new intrinsics_1.CrochetRecord(x.bound_values));
                activation.push(new intrinsics_1.CrochetStream(results));
                activation.next();
                return activation;
            }
            case "trigger-action": {
                const chosen = await this.pick_action(activation);
                if (chosen != null) {
                    const { action, bindings } = chosen;
                    const new_env = new environment_1.Environment(action.env);
                    for (const [k, v] of bindings.bound_values.entries()) {
                        new_env.define(k, v);
                    }
                    const new_activation = new environment_1.Activation(null, new_env, action.body);
                    activation.next();
                    this.schedule(new_activation);
                    this.schedule(activation);
                    return null;
                }
                else {
                    activation.next();
                    return activation;
                }
            }
            case "trigger-context": {
                const context = this.get_context(activation, operation.name);
                const hooks = this.get_active_hooks(activation, context);
                for (const hook of hooks) {
                    this.schedule(hook);
                }
                activation.next();
                this.schedule(activation);
                return null;
            }
            case "yield": {
                activation.next();
                return null;
            }
            default: {
                throw utils_1.unreachable(operation, `Unknown operation`);
            }
        }
    }
    evaluate_pattern(activation, pattern) {
        switch (pattern.tag) {
            case "actor-pattern": {
                const actor = this.get_actor(activation, pattern.actor_name);
                return new Logic.ActorPattern(actor);
            }
            case "integer-pattern": {
                return new Logic.ValuePattern(new intrinsics_1.CrochetInteger(pattern.value));
            }
            case "float-pattern": {
                return new Logic.ValuePattern(new intrinsics_1.CrochetFloat(pattern.value));
            }
            case "boolean-pattern": {
                return new Logic.ValuePattern(new intrinsics_1.CrochetBoolean(pattern.value));
            }
            case "nothing-pattern": {
                return new Logic.ValuePattern(intrinsics_1.nothing);
            }
            case "text-pattern": {
                return new Logic.ValuePattern(new intrinsics_1.CrochetText(pattern.value));
            }
            case "variable-pattern": {
                return new Logic.VariablePattern(pattern.name);
            }
            default: {
                throw utils_1.unreachable(pattern, `Unknown pattern`);
            }
        }
    }
    async next_activation() {
        if (this.queue.length === 0) {
            throw new Error(`next_activation() on an empty queue`);
        }
        return this.queue.shift();
    }
    //== Declaration evaluation
    load_declaration(module, env, declaration) {
        switch (declaration.tag) {
            case "define-scene": {
                const scene_env = new environment_1.Environment(env);
                const scene = new scene_1.Scene(module, declaration.name, scene_env, declaration.body);
                this.add_scene(scene);
                break;
            }
            case "do": {
                const do_env = new environment_1.Environment(env);
                const activation = new environment_1.Activation(null, do_env, declaration.body);
                this.queue.push(activation);
                break;
            }
            case "define-command": {
                this.add_command(env, declaration.name, declaration.parameters, declaration.body);
                break;
            }
            case "define-foreign-command": {
                this.add_foreign_command(env, declaration.name, declaration.parameters, declaration.args, declaration.foreign_name);
                break;
            }
            case "define-action": {
                const action_env = new environment_1.Environment(env);
                const action = new scene_1.Action(module, declaration.title, action_env, declaration.predicate, declaration.body);
                this.actions.push(action);
                break;
            }
            case "define-actor": {
                const actor = new intrinsics_1.CrochetActor(declaration.name, new Set(declaration.roles));
                env.define_actor(actor.name, actor);
                break;
            }
            case "define-context": {
                const hooks = declaration.hooks.map((x) => {
                    return new scene_1.Hook(module, new environment_1.Environment(env), x.predicate, x.body);
                });
                const context = new scene_1.Context(declaration.name, hooks);
                this.define_context(context);
                break;
            }
            case "define-relation": {
                const components = declaration.components;
                if (components.length === 0) {
                    throw new Error(`Relation ${declaration.name} has no components`);
                }
                const relation = new logic_1.RelationType(declaration.name, components.length, components.map((x) => x.evaluate()));
                this.database.add(relation);
                break;
            }
            default: {
                utils_1.unreachable(declaration, `Unknown declaration`);
            }
        }
    }
    define_context(context) {
        if (this.contexts.has(context.name)) {
            throw new Error(`Duplicated context ${context.name}`);
        }
        this.contexts.set(context.name, context);
    }
    add_scene(scene) {
        if (this.scenes.has(scene.name)) {
            throw new Error(`Duplicated scene name ${scene.name}`);
        }
        this.scenes.set(scene.name, scene);
    }
    add_foreign_command(env, name, parameters, args, foreign_name) {
        const procedure = new procedure_1.CrochetForeignProcedure(name, parameters, args, async (...realArgs) => {
            const fun = this.ffi.get(foreign_name);
            if (fun.arity !== args.length) {
                throw new Error(`Foreign function ${foreign_name} has arity ${fun.arity}, but was defined with ${args.length} arguments`);
            }
            return fun.fn(...realArgs);
        });
        if (!env.define_procedure(name, procedure)) {
            throw new Error(`Command ${name} is already defined`);
        }
    }
    add_command(env, name, parameters, body) {
        const procedure = new procedure_1.CrochetProcedure(env, name, parameters, body);
        if (!env.define_procedure(name, procedure)) {
            throw new Error(`Command ${name} is already defined`);
        }
    }
    //== Operation evaluation
    get_procedure(activation, name) {
        const procedure = activation.env.lookup_procedure(name);
        if (procedure == null) {
            throw new Error(`Undefined procedure ${name}`);
        }
        else {
            return procedure;
        }
    }
    get_local(activation, name) {
        const local = activation.env.lookup(name);
        if (local == null) {
            throw new Error(`Undefined local ${name}`);
        }
        else {
            return local;
        }
    }
    get_actor(activation, name) {
        const actor = activation.env.lookup_actor(name);
        if (actor == null) {
            throw new Error(`Undefined actor #${name}`);
        }
        else {
            return actor;
        }
    }
    get_relation(activation, name) {
        const relation = this.database.lookup(name);
        if (relation == null) {
            throw new Error(`Undefined relation ${name}`);
        }
        else {
            return relation;
        }
    }
    get_context(activation, name) {
        const context = this.contexts.get(name);
        if (context == null) {
            throw new Error(`Undefined context ${name}`);
        }
        else {
            return context;
        }
    }
    get_active_hooks(activation0, context) {
        return context.hooks.flatMap((hook) => {
            const search_activation = new environment_1.Activation(activation0, hook.env, hook.body);
            const results = this.search(search_activation, hook.predicate);
            return results.map((env) => {
                const new_env = new environment_1.Environment(hook.env);
                for (const [k, v] of env.bound_values) {
                    new_env.define(k, v);
                }
                return new environment_1.Activation(null, new_env, hook.body);
            });
        });
    }
    project(activation, value, name) {
        this.assert_record(activation, value);
        const result = value.values.get(name);
        if (result == null) {
            throw new Error(`Undefined field ${name}`);
        }
        else {
            return result;
        }
    }
    simple_interpolate(activation, action, bindings) {
        return action.title.parts
            .map((x) => {
            switch (x.tag) {
                case "static":
                    return x.text;
                case "variable": {
                    const value = bindings.get(x.name);
                    if (value != null) {
                        return value.to_text();
                    }
                    else {
                        throw new Error(`Unbound variable ${x.name} evaluating action ${action.title.static_text()}`);
                    }
                }
                default:
                    throw utils_1.unreachable(x, "Unknown interpolation part");
            }
        })
            .join("");
    }
    // Actions and turns
    apply_block(activation, block, args) {
        const new_env = new environment_1.Environment(block.env);
        const new_activation = new environment_1.Activation(activation, new_env, block.body);
        for (const [name, value] of utils_1.zip(block.parameters, args)) {
            new_env.define(name, value);
        }
        return new_activation;
    }
    evaluate_clause(activation, clause, block) {
        switch (clause.tag) {
            case "predicate": {
                const results = this.search(activation, clause.predicate);
                if (results.length === 0) {
                    return null;
                }
                else {
                    if (results.length !== 1) {
                        throw new Error(`Not supported: multiple results in match`);
                    }
                    const [bound] = results.map((x) => x.bound_values);
                    const args = block.parameters.map((x) => bound.get(x));
                    return this.make_block_activation(activation, block, args);
                }
            }
            case "default": {
                return this.make_block_activation(activation, block, []);
            }
            default:
                throw utils_1.unreachable(clause, "Unknown clause");
        }
    }
    pick_action(activation) {
        const available = this.actions.flatMap((x) => this.actions_available(activation, x));
        return this._pick(activation, available);
    }
    actions_available(activation, action) {
        const results = this.search(activation, action.predicate);
        return results.map((x) => ({
            action,
            bindings: x,
            title: this.simple_interpolate(activation, action, x.bound_values),
        }));
    }
    search(activation, predicate) {
        return predicate.relations
            .reduce((envs, pred) => {
            return envs.flatMap((env) => this.refine_search(activation, env, pred));
        }, [new Logic.UnificationEnvironment()])
            .filter((uenv) => {
            const valid = this.evaluate_constraint(activation, uenv, predicate.constraint);
            this.assert_boolean(activation, valid);
            return valid.value;
        });
    }
    refine_search(activation, env, predicate) {
        const relation = this.get_relation(activation, predicate.name);
        const patterns = predicate.patterns.map((x) => this.evaluate_pattern(activation, x));
        return relation.search(patterns, env);
    }
    evaluate_constraint(activation, uenv, constraint) {
        switch (constraint.tag) {
            case "actor": {
                return this.get_actor(activation, constraint.name);
            }
            case "and": {
                const left = this.evaluate_constraint(activation, uenv, constraint.left);
                const right = this.evaluate_constraint(activation, uenv, constraint.right);
                this.assert_boolean(activation, left);
                this.assert_boolean(activation, right);
                return new intrinsics_1.CrochetBoolean(left.value && right.value);
            }
            case "boolean": {
                return new intrinsics_1.CrochetBoolean(constraint.value);
            }
            case "equal": {
                const left = this.evaluate_constraint(activation, uenv, constraint.left);
                const right = this.evaluate_constraint(activation, uenv, constraint.right);
                return new intrinsics_1.CrochetBoolean(left.equals(right));
            }
            case "not": {
                const value = this.evaluate_constraint(activation, uenv, constraint.expr);
                this.assert_boolean(activation, value);
                return new intrinsics_1.CrochetBoolean(!value.value);
            }
            case "not-equal": {
                const left = this.evaluate_constraint(activation, uenv, constraint.left);
                const right = this.evaluate_constraint(activation, uenv, constraint.right);
                return new intrinsics_1.CrochetBoolean(!left.equals(right));
            }
            case "or": {
                const left = this.evaluate_constraint(activation, uenv, constraint.left);
                const right = this.evaluate_constraint(activation, uenv, constraint.right);
                this.assert_boolean(activation, left);
                this.assert_boolean(activation, right);
                return new intrinsics_1.CrochetBoolean(left.value || right.value);
            }
            case "role": {
                const value = this.evaluate_constraint(activation, uenv, constraint.expr);
                this.assert_actor(activation, value);
                return new intrinsics_1.CrochetBoolean(value.has_role(constraint.role));
            }
            case "variable": {
                const local = uenv.bound_values.get(constraint.name);
                if (local != null) {
                    return local;
                }
                else {
                    return this.get_local(activation, constraint.name);
                }
            }
            default:
                throw utils_1.unreachable(constraint, "Unknown constraint");
        }
    }
}
exports.CrochetVM = CrochetVM;
class CrochetVMInterface {
    constructor(vm, activation) {
        this.vm = vm;
        this.activation = activation;
    }
    // Assertions
    assert_text(x) {
        this.vm.assert_text(this.activation, x);
    }
    assert_integer(x) {
        this.vm.assert_integer(this.activation, x);
    }
    assert_boolean(x) {
        this.vm.assert_boolean(this.activation, x);
    }
    assert_nothing(x) {
        if (!(x instanceof intrinsics_1.CrochetNothing)) {
            throw new Error(`Expected Nothing, got ${x.type}`);
        }
    }
    assert_actor(x) {
        this.vm.assert_actor(this.activation, x);
    }
    assert_record(x) {
        this.vm.assert_record(this.activation, x);
    }
    assert_stream(x) {
        this.vm.assert_stream(this.activation, x);
    }
    assert_block(x) {
        this.vm.assert_block(this.activation, x);
    }
    assert_box(x) {
        if (!(x instanceof intrinsics_1.CrochetBox)) {
            throw new Error(`Expected a Box, got ${x.type}`);
        }
    }
    // Constructors
    get nothing() {
        return intrinsics_1.nothing;
    }
    text(x) {
        return new intrinsics_1.CrochetText(x);
    }
    integer(x) {
        return new intrinsics_1.CrochetInteger(x);
    }
    float(x) {
        return new intrinsics_1.CrochetFloat(x);
    }
    boolean(x) {
        return new intrinsics_1.CrochetBoolean(x);
    }
    record(x) {
        return new intrinsics_1.CrochetRecord(x);
    }
    stream(x) {
        return new intrinsics_1.CrochetStream(x);
    }
    box(x) {
        return new intrinsics_1.CrochetBox(x);
    }
    // Accessors
    get_actor(name) {
        return this.vm.get_actor(this.activation, name);
    }
    // Operations
    search(name, patterns) {
        const relation = this.vm.get_relation(this.activation, name);
        const env = new Logic.UnificationEnvironment();
        return relation.search(patterns, env).map((x) => x.bound_values);
    }
    pvar(name) {
        return new Logic.VariablePattern(name);
    }
    pval(value) {
        return new Logic.ValuePattern(value);
    }
}
exports.CrochetVMInterface = CrochetVMInterface;

},{"../ir/operations":3,"../utils/utils":16,"./environment":17,"./intrinsics":18,"./logic":19,"./procedure":21,"./scene":22}],24:[function(require,module,exports){

/**
 * Array#filter.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Object=} self
 * @return {Array}
 * @throw TypeError
 */

module.exports = function (arr, fn, self) {
  if (arr.filter) return arr.filter(fn, self);
  if (void 0 === arr || null === arr) throw new TypeError;
  if ('function' != typeof fn) throw new TypeError;
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) continue;
    var val = arr[i];
    if (fn.call(self, val, i, arr)) ret.push(val);
  }
  return ret;
};

var hasOwn = Object.prototype.hasOwnProperty;

},{}],25:[function(require,module,exports){
(function (global){(function (){
'use strict';

var filter = require('array-filter');

module.exports = function availableTypedArrays() {
	return filter([
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
	], function (typedArray) {
		return typeof global[typedArray] === 'function';
	});
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"array-filter":24}],26:[function(require,module,exports){
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

},{"./":27,"get-intrinsic":32}],27:[function(require,module,exports){
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

},{"function-bind":31,"get-intrinsic":32}],28:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":32}],29:[function(require,module,exports){

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


},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":30}],32:[function(require,module,exports){
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

},{"function-bind":31,"has":35,"has-symbols":33}],33:[function(require,module,exports){
(function (global){(function (){
'use strict';

var origSymbol = global.Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./shams":34}],34:[function(require,module,exports){
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
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
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

},{}],35:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":31}],36:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],37:[function(require,module,exports){
'use strict';

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
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

},{"call-bind/callBound":26}],38:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
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
var generatorFunc = getGeneratorFunc();
var GeneratorFunction = getProto && generatorFunc ? getProto(generatorFunc) : false;

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
	return getProto && getProto(fn) === GeneratorFunction;
};

},{}],39:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasSymbols = require('has-symbols')();
var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';

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
		var arr = new global[typedArray]();
		if (!(Symbol.toStringTag in arr)) {
			throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
		}
		var proto = getPrototypeOf(arr);
		var descriptor = gOPD(proto, Symbol.toStringTag);
		if (!descriptor) {
			var superProto = getPrototypeOf(proto);
			descriptor = gOPD(superProto, Symbol.toStringTag);
		}
		toStrTags[typedArray] = descriptor.get;
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
	if (!hasToStringTag) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":25,"call-bind/callBound":26,"es-abstract/helpers/getOwnPropertyDescriptor":28,"foreach":29,"has-symbols":33}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],42:[function(require,module,exports){
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

function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
isSharedArrayBufferToString.working = (
  typeof SharedArrayBuffer !== 'undefined' &&
  isSharedArrayBufferToString(new SharedArrayBuffer())
);
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBuffer === 'undefined') {
    return false;
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBuffer;
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

},{"is-arguments":37,"is-generator-function":38,"is-typed-array":39,"which-typed-array":44}],43:[function(require,module,exports){
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
},{"./support/isBuffer":41,"./support/types":42,"_process":40,"inherits":36}],44:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasSymbols = require('has-symbols')();
var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';

var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof global[typedArray] === 'function') {
			var arr = new global[typedArray]();
			if (!(Symbol.toStringTag in arr)) {
				throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
			}
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
	if (!hasToStringTag) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":25,"call-bind/callBound":26,"es-abstract/helpers/getOwnPropertyDescriptor":28,"foreach":29,"has-symbols":33,"is-typed-array":39}]},{},[7])(7)
});
