"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadNode = exports.ProjectionNode = exports.ApplicationNode = exports.ConcatenateNode = exports.IdentifierNode = exports.BooleanNode = exports.NumberNode = exports.TextNode = exports.Node = void 0;
const boolean_1 = require("../runtime/intrinsics/boolean");
const number_1 = require("../runtime/intrinsics/number");
const text_1 = require("../runtime/intrinsics/text");
const algebra_1 = require("../runtime/dialogue/algebra");
const record_1 = require("../runtime/intrinsics/record");
class Node {
}
exports.Node = Node;
class TextNode extends Node {
    constructor(value) {
        super();
        this.value = value;
    }
    eval(env) {
        return new text_1.CrochetText(this.value);
    }
}
exports.TextNode = TextNode;
class NumberNode extends Node {
    constructor(value) {
        super();
        this.value = value;
    }
    eval(env) {
        return new number_1.CrochetInteger(this.value, null);
    }
}
exports.NumberNode = NumberNode;
class BooleanNode extends Node {
    constructor(value) {
        super();
        this.value = value;
    }
    eval(env) {
        return new boolean_1.CrochetBoolean(this.value);
    }
}
exports.BooleanNode = BooleanNode;
class IdentifierNode {
    constructor(name) {
        this.name = name;
    }
}
exports.IdentifierNode = IdentifierNode;
class ConcatenateNode extends Node {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    eval(env) {
        return new algebra_1.Concatenate(algebra_1.from_primitive(this.left.eval(env)), algebra_1.from_primitive(this.right.eval(env)));
    }
}
exports.ConcatenateNode = ConcatenateNode;
class ApplicationNode extends Node {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
    eval(env) {
        const procedure = env.lookup_procedure(this.name.name);
        const args = this.args.map(x => x.eval(env));
        if (procedure == null) {
            throw new Error(`Undefined procedure ${this.name.name}`);
        }
        else {
            return procedure(...args);
        }
    }
}
exports.ApplicationNode = ApplicationNode;
class ProjectionNode extends Node {
    constructor(record, field) {
        super();
        this.record = record;
        this.field = field;
    }
    eval(env) {
        const record = this.record.eval(env);
        if (record instanceof record_1.CrochetRecord) {
            const value = record.project(this.field.name);
            if (value == null) {
                throw new Error(`Field ${this.field.name} does not exist in the record.`);
            }
            else {
                return value;
            }
        }
        else {
            throw new TypeError(`Expected a record.`);
        }
    }
}
exports.ProjectionNode = ProjectionNode;
class LoadNode extends Node {
    constructor(name) {
        super();
        this.name = name;
    }
    eval(env) {
        const value = env.lookup(this.name.name);
        if (value == null) {
            throw new Error(`Variable ${this.name.name} is not defined`);
        }
        else {
            return value;
        }
    }
}
exports.LoadNode = LoadNode;
