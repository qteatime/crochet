/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "generate": () => (/* binding */ generate),
/* harmony export */   "generateCrochet": () => (/* binding */ generateCrochet)
/* harmony export */ });
/* harmony import */ var _Parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Codegen_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* harmony import */ var _CrochetCodegen_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);




const parse = (source) => ((filename) => (0,_Parser_js__WEBPACK_IMPORTED_MODULE_0__.parse)(source, filename));

function generate(g) {
    return (0,_Codegen_js__WEBPACK_IMPORTED_MODULE_1__.generate)(g);
}

function generateCrochet(g) {
    return (0,_CrochetCodegen_js__WEBPACK_IMPORTED_MODULE_2__.generate)(g);
}

//# sourceMappingURL=App.js.map


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _generated_Lingua_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);



function parse(source, filename) {
    const matchValue = (0,_generated_Lingua_js__WEBPACK_IMPORTED_MODULE_0__.parse)("Grammar", source, new _generated_Lingua_js__WEBPACK_IMPORTED_MODULE_0__.ParseOptions(filename));
    if (matchValue.tag === 1) {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toFail)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.printf)("%s"))(matchValue.fields[0]);
    }
    else {
        return matchValue.fields[0];
    }
}

//# sourceMappingURL=Parser.js.map


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Offset": () => (/* binding */ Offset),
/* harmony export */   "Offset$reflection": () => (/* binding */ Offset$reflection),
/* harmony export */   "OffsetRecord$1": () => (/* binding */ OffsetRecord$1),
/* harmony export */   "OffsetRecord$1$reflection": () => (/* binding */ OffsetRecord$1$reflection),
/* harmony export */   "Position": () => (/* binding */ Position),
/* harmony export */   "Position$reflection": () => (/* binding */ Position$reflection),
/* harmony export */   "Meta": () => (/* binding */ Meta),
/* harmony export */   "Meta$reflection": () => (/* binding */ Meta$reflection),
/* harmony export */   "ParseOptions": () => (/* binding */ ParseOptions),
/* harmony export */   "ParseOptions$reflection": () => (/* binding */ ParseOptions$reflection),
/* harmony export */   "parseString": () => (/* binding */ parseString),
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _Ast_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
/* harmony import */ var _source_generated_fohm_runtime_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17);
/* harmony import */ var _source_generated_fohm_runtime_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_source_generated_fohm_runtime_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _fable_fable_library_3_1_5_Choice_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(18);







class Offset extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(line, column) {
        super();
        this.line = (line | 0);
        this.column = (column | 0);
    }
}

function Offset$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Fohm.Generated.Lingua.Offset", [], Offset, () => [["line", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.int32_type], ["column", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.int32_type]]);
}

class OffsetRecord$1 extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
}

function OffsetRecord$1$reflection(gen0) {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Fohm.Generated.Lingua.OffsetRecord`1", [gen0], OffsetRecord$1, () => [["start", gen0], ["end", gen0]]);
}

class Position extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(offset, position, sourceSlice, sourceString, filename) {
        super();
        this.offset = offset;
        this.position = position;
        this.sourceSlice = sourceSlice;
        this.sourceString = sourceString;
        this.filename = filename;
    }
}

function Position$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Fohm.Generated.Lingua.Position", [], Position, () => [["offset", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.lambda_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.unit_type, OffsetRecord$1$reflection(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.int32_type))], ["position", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.lambda_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.unit_type, OffsetRecord$1$reflection(Offset$reflection()))], ["sourceSlice", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["sourceString", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["filename", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.option_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)]]);
}

class Meta extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(source, children) {
        super();
        this.source = source;
        this.children = children;
    }
}

function Meta$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Fohm.Generated.Lingua.Meta", [], Meta, () => [["source", Position$reflection()], ["children", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Position$reflection())]]);
}

class ParseOptions extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(filename) {
        super();
        this.filename = filename;
    }
}

function ParseOptions$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Fohm.Generated.Lingua.ParseOptions", [], ParseOptions, () => [["filename", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.option_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)]]);
}

function parseString(s) {
    return JSON.parse((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_2__.replace)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_2__.replace)(s, "\r\n", "\\n"), "\n", "\\n"));
}

const visitor = {
    TypeDecl_alt0: (meta, _0, n, f, _3, p, _5) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Type(0, n, f, p)),
    TypeDecl_alt1: (meta_1, _0_1, n_1, f_1, _3_1, _4, p_1) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Type(1, n_1, f_1, p_1)),
    TypeVariant_alt0: (meta_2, n_2, _1, p_2, _3_2) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Variant(0, n_2, p_2)),
    TypeField_alt0: (meta_3, n_3, _1_1, t) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Field(0, n_3, t)),
    TypeApp_alt0: (meta_4, t_1, _1_2) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.TypeApp(3, t_1)),
    TypeApp_alt1: (meta_5, t_2, _1_3) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.TypeApp(4, t_2)),
    TypeApp2_alt0: (meta_6, t_3, _1_4, ps, _3_3) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.TypeApp(1, t_3, ps)),
    TypeApp3_alt0: (meta_7, t_4, _1_5, n_4) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.TypeApp(2, t_4, n_4)),
    TypeApp4_alt0: (meta_8, n_5) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.TypeApp(0, n_5)),
    TypeApp4_alt1: (meta_9, _0_2, t_5, _2) => t_5,
    Grammar_alt0: (meta_10, ts, _1_6, n_6, _3_4, t_6, _5_1, rs, _7) => (0,_Ast_js__WEBPACK_IMPORTED_MODULE_3__.grammar)(n_6, rs, t_6, ts),
    Rule_alt0: (meta_11, _0_3, r) => (0,_Ast_js__WEBPACK_IMPORTED_MODULE_3__.makeToken)(r),
    Rule_alt1: (meta_12, n_7, p_3, d, _3_5, b) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Rule(0, false, n_7, p_3, d, b)),
    Rule_alt2: (meta_13, n_8, p_4, _2_1, b_1) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Rule(1, false, n_8, p_4, b_1)),
    Rule_alt3: (meta_14, n_9, p_5, _2_2, b_2) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Rule(2, false, n_9, p_5, b_2)),
    RuleBody_alt0: (meta_15, _0_4, bs) => bs,
    TopLevelTerm_alt0: (meta_16, t_7, _1_7, e) => (0,_Ast_js__WEBPACK_IMPORTED_MODULE_3__.body)(t_7, e),
    TopLevelTerm_alt1: (meta_17, t_8) => (0,_Ast_js__WEBPACK_IMPORTED_MODULE_3__.body)(t_8, void 0),
    Binder_alt0: (meta_18, n_10, _1_8, t_9) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Binder(0, n_10, t_9)),
    Binder_alt1: (meta_19, t_10) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Binder(1, t_10)),
    Action_alt0: (meta_20, e_1, _1_9, xs, _3_6) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(1, e_1, xs)),
    ActionProject_alt0: (meta_21, a, _1_10, n_11) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(2, a, n_11)),
    ActionPrimary_alt0: (meta_22, _0_5) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(0)),
    ActionPrimary_alt1: (meta_23, n_12) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(3, n_12)),
    ActionPrimary_alt2: (meta_24, _0_6) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(6)),
    ActionPrimary_alt4: (meta_25, _0_7, x, _2_3) => x,
    ActionList_alt0: (meta_26, _0_8, xs_1, _2_4, _3_7, x_1, _5_2) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(5, xs_1, x_1)),
    ActionList_alt1: (meta_27, _0_9, xs_2, _2_5) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Expr(4, xs_2)),
    Formals_alt0: (meta_28, _0_10, xs_3, _2_6) => xs_3,
    Formals_alt1: (meta_29) => [],
    Params_alt0: (meta_30, _0_11, xs_4, _2_7) => xs_4,
    Params_alt1: (meta_31) => [],
    Alt_alt0: (meta_32, xs_5) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(1, xs_5)),
    Seq_alt0: (meta_33, xs_6) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(0, xs_6)),
    Iter_alt0: (meta_34, t_11, _1_11) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(2, t_11)),
    Iter_alt1: (meta_35, t_12, _1_12) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(3, t_12)),
    Iter_alt2: (meta_36, t_13, _1_13) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(4, t_13)),
    Pred_alt0: (meta_37, _0_12, t_14) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(5, t_14)),
    Pred_alt1: (meta_38, _0_13, t_15) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(6, t_15)),
    Lex_alt0: (meta_39, _0_14, t_16) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(7, t_16)),
    Base_alt0: (meta_40, n_13, p_6) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(8, n_13, p_6)),
    Base_alt1: (meta_41, l, _1_14, e_2) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(9, l, e_2)),
    Base_alt2: (meta_42, t_17) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(10, t_17)),
    Base_alt3: (meta_43, _0_15, t_18, _2_8) => (new _Ast_js__WEBPACK_IMPORTED_MODULE_3__.Term(11, t_18)),
    ruleDescr_alt0: (meta_44, _0_16, d_1, _2_9) => (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_2__.join)("", d_1),
    terminal_alt0: (meta_45, t_19) => parseString(t_19),
    oneCharTerminal_alt0: (meta_46, t_20) => parseString(t_20),
};

const primParser = (0,_source_generated_fohm_runtime_js__WEBPACK_IMPORTED_MODULE_4__.makeParser)("\n    Linguist {\n      TypeDecl =\n        | type_ Name Formals \"(\" ListOf\u003cTypeField, \",\"\u003e \")\" -- alt0\n        | type_ Name Formals \"=\" \"|\"? NonemptyListOf\u003cTypeVariant, \"|\"\u003e -- alt1\n              \n      \n      TypeVariant =\n        | Name \"(\" ListOf\u003cTypeField, \",\"\u003e \")\" -- alt0\n              \n      \n      TypeField =\n        | Name \":\" TypeApp -- alt0\n              \n      \n      TypeApp =\n        | TypeApp2 \"[]\" -- alt0\n        | TypeApp2 \"?\" -- alt1\n        | TypeApp2 -- alt2\n              \n      \n      TypeApp2 =\n        | TypeApp3 \"\u003c\" NonemptyListOf\u003cTypeApp, \",\"\u003e \"\u003e\" -- alt0\n        | TypeApp3 -- alt1\n              \n      \n      TypeApp3 =\n        | TypeApp3 \".\" Name -- alt0\n        | TypeApp4 -- alt1\n              \n      \n      TypeApp4 =\n        | Name -- alt0\n        | \"(\" TypeApp \")\" -- alt1\n              \n      \n      Grammar =\n        | TypeDecl* grammar_ Name \":\" TypeApp \"{\" Rule* \"}\" -- alt0\n              \n      \n      Rule =\n        | token_ Rule -- alt0\n        | ident Formals ruleDescr? \"=\" RuleBody -- alt1\n        | ident Formals \":=\" RuleBody -- alt2\n        | ident Formals? \"+=\" RuleBody -- alt3\n              \n      \n      RuleBody =\n        | \"|\"? NonemptyListOf\u003cTopLevelTerm, \"|\"\u003e -- alt0\n              \n      \n      TopLevelTerm =\n        | Binder* \"-\u003e\" Action -- alt0\n        | Binder* -- alt1\n              \n      \n      Binder =\n        | Name \":\" Iter -- alt0\n        | Iter -- alt1\n              \n      \n      Action =\n        | ActionProject \"(\" ListOf\u003cAction, \",\"\u003e \")\" -- alt0\n        | ActionProject -- alt1\n              \n      \n      ActionProject =\n        | ActionProject \".\" Name -- alt0\n        | ActionPrimary -- alt1\n              \n      \n      ActionPrimary =\n        | meta_ -- alt0\n        | Name -- alt1\n        | null_ -- alt2\n        | ActionList -- alt3\n        | \"(\" Action \")\" -- alt4\n              \n      \n      ActionList =\n        | \"[\" NonemptyListOf\u003cAction, \",\"\u003e \",\" \"...\" Action \"]\" -- alt0\n        | \"[\" ListOf\u003cAction, \",\"\u003e \"]\" -- alt1\n              \n      \n      Formals =\n        | \"\u003c\" ListOf\u003cident, \",\"\u003e \"\u003e\" -- alt0\n        |  -- alt1\n              \n      \n      Params =\n        | \"\u003c\" ListOf\u003cSeq, \",\"\u003e \"\u003e\" -- alt0\n        |  -- alt1\n              \n      \n      Alt =\n        | NonemptyListOf\u003cSeq, \"|\"\u003e -- alt0\n              \n      \n      Seq =\n        | Iter* -- alt0\n              \n      \n      Iter =\n        | Pred \"*\" -- alt0\n        | Pred \"+\" -- alt1\n        | Pred \"?\" -- alt2\n        | Pred -- alt3\n              \n      \n      Pred =\n        | \"~\" Lex -- alt0\n        | \"\u0026\" Lex -- alt1\n        | Lex -- alt2\n              \n      \n      Lex =\n        | \"#\" Base -- alt0\n        | Base -- alt1\n              \n      \n      Base =\n        | ~reserved ident Params ~(ruleDescr? \"=\" | \":=\" | \"+=\") -- alt0\n        | oneCharTerminal \"..\" oneCharTerminal -- alt1\n        | terminal -- alt2\n        | \"(\" Alt \")\" -- alt3\n              \n      \n      ruleDescr (a,r,u,l,e,d,e,s,c,r,i,p,t,i,o,n) =\n        | \"(\" ruleDescrText \")\" -- alt0\n              \n      \n      ruleDescrText =\n        | (~\")\" any)* -- alt0\n              \n      \n      name (a,n,a,m,e) =\n        | nameFirst nameRest* -- alt0\n              \n      \n      nameFirst =\n        | \"_\" -- alt0\n        | letter -- alt1\n              \n      \n      nameRest =\n        | \"_\" -- alt0\n        | alnum -- alt1\n              \n      \n      ident (a,n,i,d,e,n,t,i,f,i,e,r) =\n        | name -- alt0\n              \n      \n      terminal =\n        | t_terminal -- alt0\n              \n      \n      t_terminal =\n        | \"\\\"\" terminalChar* \"\\\"\" -- alt0\n              \n      \n      oneCharTerminal =\n        | t_oneCharTerminal -- alt0\n              \n      \n      t_oneCharTerminal =\n        | \"\\\"\" terminalChar \"\\\"\" -- alt0\n              \n      \n      terminalChar =\n        | escapeChar -- alt0\n        | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any -- alt1\n              \n      \n      escapeChar (a,n,e,s,c,a,p,e,s,e,q,u,e,n,c,e) =\n        | \"\\\\\\\\\" -- alt0\n        | \"\\\\\\\"\" -- alt1\n        | \"\\\\b\" -- alt2\n        | \"\\\\n\" -- alt3\n        | \"\\\\r\" -- alt4\n        | \"\\\\t\" -- alt5\n        | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit -- alt6\n        | \"\\\\x\" hexDigit hexDigit -- alt7\n              \n      \n      space +=\n        | comment -- alt0\n              \n      \n      comment =\n        | \"//\" (~\"\\n\" any)* \"\\n\" -- alt0\n        | \"/*\" (~\"*/\" any)* \"*/\" -- alt1\n              \n      \n      tokens =\n        | token* -- alt0\n              \n      \n      token =\n        | comment -- alt0\n        | ident -- alt1\n        | operator -- alt2\n        | punctuation -- alt3\n        | terminal -- alt4\n        | any -- alt5\n              \n      \n      operator =\n        | \"\u003c:\" -- alt0\n        | \"=\" -- alt1\n        | \":=\" -- alt2\n        | \"+=\" -- alt3\n        | \"*\" -- alt4\n        | \"+\" -- alt5\n        | \"?\" -- alt6\n        | \"~\" -- alt7\n        | \"\u0026\" -- alt8\n              \n      \n      punctuation =\n        | \"\u003c\" -- alt0\n        | \"\u003e\" -- alt1\n        | \",\" -- alt2\n        | \"--\" -- alt3\n              \n      \n      kw\u003ck\u003e =\n        | k ~nameRest -- alt0\n              \n      \n      type_ =\n        | kw\u003c\"type\"\u003e -- alt0\n              \n      \n      grammar_ =\n        | kw\u003c\"grammar\"\u003e -- alt0\n              \n      \n      meta_ =\n        | kw\u003c\"meta\"\u003e -- alt0\n              \n      \n      null_ =\n        | kw\u003c\"null\"\u003e -- alt0\n              \n      \n      token_ =\n        | kw\u003c\"token\"\u003e -- alt0\n              \n      \n      reserved =\n        | type_ -- alt0\n        | grammar_ -- alt1\n        | meta_ -- alt2\n        | null_ -- alt3\n        | token_ -- alt4\n              \n      \n      Name =\n        | ~reserved name -- alt0\n              \n    }\n      \n    ", visitor);

function parse(rule, source, options) {
    const patternInput = primParser(source, rule, options);
    const value = patternInput[1];
    if (patternInput[0]) {
        return new _fable_fable_library_3_1_5_Choice_js__WEBPACK_IMPORTED_MODULE_5__.FSharpResult$2(0, value);
    }
    else {
        return new _fable_fable_library_3_1_5_Choice_js__WEBPACK_IMPORTED_MODULE_5__.FSharpResult$2(1, value);
    }
}

//# sourceMappingURL=Lingua.js.map


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "seqToString": () => (/* binding */ seqToString),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "List": () => (/* binding */ List),
/* harmony export */   "Union": () => (/* binding */ Union),
/* harmony export */   "Record": () => (/* binding */ Record),
/* harmony export */   "FSharpRef": () => (/* binding */ FSharpRef),
/* harmony export */   "Exception": () => (/* binding */ Exception),
/* harmony export */   "isException": () => (/* binding */ isException),
/* harmony export */   "FSharpException": () => (/* binding */ FSharpException),
/* harmony export */   "MatchFailureException": () => (/* binding */ MatchFailureException),
/* harmony export */   "Attribute": () => (/* binding */ Attribute)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

function seqToString(self) {
    let count = 0;
    let str = "[";
    for (const x of self) {
        if (count === 0) {
            str += toString(x);
        }
        else if (count === 100) {
            str += "; ...";
            break;
        }
        else {
            str += "; " + toString(x);
        }
        count++;
    }
    return str + "]";
}
function toString(x, callStack = 0) {
    if (x != null && typeof x === "object") {
        if (typeof x.toString === "function") {
            return x.toString();
        }
        else if (Symbol.iterator in x) {
            return seqToString(x);
        }
        else { // TODO: Date?
            const cons = Object.getPrototypeOf(x).constructor;
            return cons === Object && callStack < 10
                // Same format as recordToString
                ? "{ " + Object.entries(x).map(([k, v]) => k + " = " + toString(v, callStack + 1)).join("\n  ") + " }"
                : cons.name;
        }
    }
    return String(x);
}
function compareList(self, other) {
    if (self === other) {
        return 0;
    }
    else {
        if (other == null) {
            return -1;
        }
        while (self.tail != null) {
            if (other.tail == null) {
                return 1;
            }
            const res = (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.compare)(self.head, other.head);
            if (res !== 0) {
                return res;
            }
            self = self.tail;
            other = other.tail;
        }
        return other.tail == null ? 0 : -1;
    }
}
class List {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    [Symbol.iterator]() {
        let cur = this;
        return {
            next: () => {
                const value = cur === null || cur === void 0 ? void 0 : cur.head;
                const done = (cur === null || cur === void 0 ? void 0 : cur.tail) == null;
                cur = cur === null || cur === void 0 ? void 0 : cur.tail;
                return { done, value };
            },
        };
    }
    toJSON() { return Array.from(this); }
    toString() { return seqToString(this); }
    GetHashCode() { return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.combineHashCodes)(Array.from(this).map(_Util_js__WEBPACK_IMPORTED_MODULE_0__.structuralHash)); }
    Equals(other) { return compareList(this, other) === 0; }
    CompareTo(other) { return compareList(this, other); }
}
class Union {
    get name() {
        return this.cases()[this.tag];
    }
    toJSON() {
        return this.fields.length === 0 ? this.name : [this.name].concat(this.fields);
    }
    toString() {
        if (this.fields.length === 0) {
            return this.name;
        }
        else {
            let fields = "";
            let withParens = true;
            if (this.fields.length === 1) {
                const field = toString(this.fields[0]);
                withParens = field.indexOf(" ") >= 0;
                fields = field;
            }
            else {
                fields = this.fields.map((x) => toString(x)).join(", ");
            }
            return this.name + (withParens ? " (" : " ") + fields + (withParens ? ")" : "");
        }
    }
    GetHashCode() {
        const hashes = this.fields.map((x) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.structuralHash)(x));
        hashes.splice(0, 0, (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.numberHash)(this.tag));
        return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.combineHashCodes)(hashes);
    }
    Equals(other) {
        if (this === other) {
            return true;
        }
        else if (!(0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.sameConstructor)(this, other)) {
            return false;
        }
        else if (this.tag === other.tag) {
            return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.equalArrays)(this.fields, other.fields);
        }
        else {
            return false;
        }
    }
    CompareTo(other) {
        if (this === other) {
            return 0;
        }
        else if (!(0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.sameConstructor)(this, other)) {
            return -1;
        }
        else if (this.tag === other.tag) {
            return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.compareArrays)(this.fields, other.fields);
        }
        else {
            return this.tag < other.tag ? -1 : 1;
        }
    }
}
function recordToJSON(self) {
    const o = {};
    const keys = Object.keys(self);
    for (let i = 0; i < keys.length; i++) {
        o[keys[i]] = self[keys[i]];
    }
    return o;
}
function recordToString(self) {
    return "{ " + Object.entries(self).map(([k, v]) => k + " = " + toString(v)).join("\n  ") + " }";
}
function recordGetHashCode(self) {
    const hashes = Object.values(self).map((v) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.structuralHash)(v));
    return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.combineHashCodes)(hashes);
}
function recordEquals(self, other) {
    if (self === other) {
        return true;
    }
    else if (!(0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.sameConstructor)(self, other)) {
        return false;
    }
    else {
        const thisNames = Object.keys(self);
        for (let i = 0; i < thisNames.length; i++) {
            if (!(0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.equals)(self[thisNames[i]], other[thisNames[i]])) {
                return false;
            }
        }
        return true;
    }
}
function recordCompareTo(self, other) {
    if (self === other) {
        return 0;
    }
    else if (!(0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.sameConstructor)(self, other)) {
        return -1;
    }
    else {
        const thisNames = Object.keys(self);
        for (let i = 0; i < thisNames.length; i++) {
            const result = (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.compare)(self[thisNames[i]], other[thisNames[i]]);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    }
}
class Record {
    toJSON() { return recordToJSON(this); }
    toString() { return recordToString(this); }
    GetHashCode() { return recordGetHashCode(this); }
    Equals(other) { return recordEquals(this, other); }
    CompareTo(other) { return recordCompareTo(this, other); }
}
class FSharpRef {
    constructor(contentsOrGetter, setter) {
        if (typeof setter === "function") {
            this.getter = contentsOrGetter;
            this.setter = setter;
        }
        else {
            this.getter = () => contentsOrGetter;
            this.setter = (v) => { contentsOrGetter = v; };
        }
    }
    get contents() {
        return this.getter();
    }
    set contents(v) {
        this.setter(v);
    }
}
// EXCEPTIONS
// Exception is intentionally not derived from Error, for performance reasons (see #2160)
class Exception {
    constructor(message) {
        this.message = message;
    }
}
function isException(x) {
    return x instanceof Exception || x instanceof Error;
}
class FSharpException extends Exception {
    toJSON() { return recordToJSON(this); }
    toString() { return recordToString(this); }
    GetHashCode() { return recordGetHashCode(this); }
    Equals(other) { return recordEquals(this, other); }
    CompareTo(other) { return recordCompareTo(this, other); }
}
class MatchFailureException extends FSharpException {
    constructor(arg1, arg2, arg3) {
        super();
        this.arg1 = arg1;
        this.arg2 = arg2 | 0;
        this.arg3 = arg3 | 0;
        this.message = "The match cases were incomplete";
    }
}
class Attribute {
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isIterable": () => (/* binding */ isIterable),
/* harmony export */   "isArrayLike": () => (/* binding */ isArrayLike),
/* harmony export */   "isDisposable": () => (/* binding */ isDisposable),
/* harmony export */   "sameConstructor": () => (/* binding */ sameConstructor),
/* harmony export */   "Comparer": () => (/* binding */ Comparer),
/* harmony export */   "comparerFromEqualityComparer": () => (/* binding */ comparerFromEqualityComparer),
/* harmony export */   "assertEqual": () => (/* binding */ assertEqual),
/* harmony export */   "assertNotEqual": () => (/* binding */ assertNotEqual),
/* harmony export */   "Lazy": () => (/* binding */ Lazy),
/* harmony export */   "lazyFromValue": () => (/* binding */ lazyFromValue),
/* harmony export */   "padWithZeros": () => (/* binding */ padWithZeros),
/* harmony export */   "padLeftAndRightWithZeros": () => (/* binding */ padLeftAndRightWithZeros),
/* harmony export */   "dateOffset": () => (/* binding */ dateOffset),
/* harmony export */   "int16ToString": () => (/* binding */ int16ToString),
/* harmony export */   "int32ToString": () => (/* binding */ int32ToString),
/* harmony export */   "ObjectRef": () => (/* binding */ ObjectRef),
/* harmony export */   "stringHash": () => (/* binding */ stringHash),
/* harmony export */   "numberHash": () => (/* binding */ numberHash),
/* harmony export */   "combineHashCodes": () => (/* binding */ combineHashCodes),
/* harmony export */   "physicalHash": () => (/* binding */ physicalHash),
/* harmony export */   "identityHash": () => (/* binding */ identityHash),
/* harmony export */   "dateHash": () => (/* binding */ dateHash),
/* harmony export */   "arrayHash": () => (/* binding */ arrayHash),
/* harmony export */   "structuralHash": () => (/* binding */ structuralHash),
/* harmony export */   "fastStructuralHash": () => (/* binding */ fastStructuralHash),
/* harmony export */   "safeHash": () => (/* binding */ safeHash),
/* harmony export */   "equalArraysWith": () => (/* binding */ equalArraysWith),
/* harmony export */   "equalArrays": () => (/* binding */ equalArrays),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "compareDates": () => (/* binding */ compareDates),
/* harmony export */   "comparePrimitives": () => (/* binding */ comparePrimitives),
/* harmony export */   "compareArraysWith": () => (/* binding */ compareArraysWith),
/* harmony export */   "compareArrays": () => (/* binding */ compareArrays),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "createAtom": () => (/* binding */ createAtom),
/* harmony export */   "createObj": () => (/* binding */ createObj),
/* harmony export */   "jsOptions": () => (/* binding */ jsOptions),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "sign": () => (/* binding */ sign),
/* harmony export */   "randomNext": () => (/* binding */ randomNext),
/* harmony export */   "randomBytes": () => (/* binding */ randomBytes),
/* harmony export */   "unescapeDataString": () => (/* binding */ unescapeDataString),
/* harmony export */   "escapeDataString": () => (/* binding */ escapeDataString),
/* harmony export */   "escapeUriString": () => (/* binding */ escapeUriString),
/* harmony export */   "count": () => (/* binding */ count),
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "uncurry": () => (/* binding */ uncurry),
/* harmony export */   "curry": () => (/* binding */ curry),
/* harmony export */   "checkArity": () => (/* binding */ checkArity),
/* harmony export */   "partialApply": () => (/* binding */ partialApply),
/* harmony export */   "mapCurriedArgs": () => (/* binding */ mapCurriedArgs)
/* harmony export */ });
// tslint:disable:ban-types
function isIterable(x) {
    return x != null && typeof x === "object" && Symbol.iterator in x;
}
function isArrayLike(x) {
    return Array.isArray(x) || ArrayBuffer.isView(x);
}
function isComparer(x) {
    return typeof x.Compare === "function";
}
function isComparable(x) {
    return typeof x.CompareTo === "function";
}
function isEquatable(x) {
    return typeof x.Equals === "function";
}
function isHashable(x) {
    return typeof x.GetHashCode === "function";
}
function isDisposable(x) {
    return x != null && typeof x.Dispose === "function";
}
function sameConstructor(x, y) {
    return Object.getPrototypeOf(x).constructor === Object.getPrototypeOf(y).constructor;
}
class Comparer {
    constructor(f) {
        this.Compare = f || compare;
    }
}
function comparerFromEqualityComparer(comparer) {
    // Sometimes IEqualityComparer also implements IComparer
    if (isComparer(comparer)) {
        return new Comparer(comparer.Compare);
    }
    else {
        return new Comparer((x, y) => {
            const xhash = comparer.GetHashCode(x);
            const yhash = comparer.GetHashCode(y);
            if (xhash === yhash) {
                return comparer.Equals(x, y) ? 0 : -1;
            }
            else {
                return xhash < yhash ? -1 : 1;
            }
        });
    }
}
function assertEqual(actual, expected, msg) {
    if (!equals(actual, expected)) {
        throw Object.assign(new Error(msg || `Expected: ${expected} - Actual: ${actual}`), {
            actual,
            expected,
        });
    }
}
function assertNotEqual(actual, expected, msg) {
    if (equals(actual, expected)) {
        throw Object.assign(new Error(msg || `Expected: ${expected} - Actual: ${actual}`), {
            actual,
            expected,
        });
    }
}
class Lazy {
    constructor(factory) {
        this.factory = factory;
        this.isValueCreated = false;
    }
    get Value() {
        if (!this.isValueCreated) {
            this.createdValue = this.factory();
            this.isValueCreated = true;
        }
        return this.createdValue;
    }
    get IsValueCreated() {
        return this.isValueCreated;
    }
}
function lazyFromValue(v) {
    return new Lazy(() => v);
}
function padWithZeros(i, length) {
    let str = i.toString(10);
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}
function padLeftAndRightWithZeros(i, lengthLeft, lengthRight) {
    let str = i.toString(10);
    while (str.length < lengthLeft) {
        str = "0" + str;
    }
    while (str.length < lengthRight) {
        str = str + "0";
    }
    return str;
}
function dateOffset(date) {
    const date1 = date;
    return typeof date1.offset === "number"
        ? date1.offset
        : (date.kind === 1 /* UTC */
            ? 0 : date.getTimezoneOffset() * -60000);
}
function int16ToString(i, radix) {
    i = i < 0 && radix != null && radix !== 10 ? 0xFFFF + i + 1 : i;
    return i.toString(radix);
}
function int32ToString(i, radix) {
    i = i < 0 && radix != null && radix !== 10 ? 0xFFFFFFFF + i + 1 : i;
    return i.toString(radix);
}
class ObjectRef {
    static id(o) {
        if (!ObjectRef.idMap.has(o)) {
            ObjectRef.idMap.set(o, ++ObjectRef.count);
        }
        return ObjectRef.idMap.get(o);
    }
}
ObjectRef.idMap = new WeakMap();
ObjectRef.count = 0;
function stringHash(s) {
    let i = 0;
    let h = 5381;
    const len = s.length;
    while (i < len) {
        h = (h * 33) ^ s.charCodeAt(i++);
    }
    return h;
}
function numberHash(x) {
    return x * 2654435761 | 0;
}
// From https://stackoverflow.com/a/37449594
function combineHashCodes(hashes) {
    if (hashes.length === 0) {
        return 0;
    }
    return hashes.reduce((h1, h2) => {
        return ((h1 << 5) + h1) ^ h2;
    });
}
function physicalHash(x) {
    if (x == null) {
        return 0;
    }
    switch (typeof x) {
        case "boolean":
            return x ? 1 : 0;
        case "number":
            return numberHash(x);
        case "string":
            return stringHash(x);
        default:
            return numberHash(ObjectRef.id(x));
    }
}
function identityHash(x) {
    if (x == null) {
        return 0;
    }
    else if (isHashable(x)) {
        return x.GetHashCode();
    }
    else {
        return physicalHash(x);
    }
}
function dateHash(x) {
    return x.getTime();
}
function arrayHash(x) {
    const len = x.length;
    const hashes = new Array(len);
    for (let i = 0; i < len; i++) {
        hashes[i] = structuralHash(x[i]);
    }
    return combineHashCodes(hashes);
}
function structuralHash(x) {
    if (x == null) {
        return 0;
    }
    switch (typeof x) {
        case "boolean":
            return x ? 1 : 0;
        case "number":
            return numberHash(x);
        case "string":
            return stringHash(x);
        default: {
            if (isHashable(x)) {
                return x.GetHashCode();
            }
            else if (isArrayLike(x)) {
                return arrayHash(x);
            }
            else if (x instanceof Date) {
                return dateHash(x);
            }
            else if (Object.getPrototypeOf(x).constructor === Object) {
                // TODO: check call-stack to prevent cyclic objects?
                const hashes = Object.values(x).map((v) => structuralHash(v));
                return combineHashCodes(hashes);
            }
            else {
                // Classes don't implement GetHashCode by default, but must use identity hashing
                return numberHash(ObjectRef.id(x));
                // return stringHash(String(x));
            }
        }
    }
}
// Intended for custom numeric types, like long or decimal
function fastStructuralHash(x) {
    return stringHash(String(x));
}
// Intended for declared types that may or may not implement GetHashCode
function safeHash(x) {
    return x == null ? 0 : isHashable(x) ? x.GetHashCode() : numberHash(ObjectRef.id(x));
}
function equalArraysWith(x, y, eq) {
    if (x == null) {
        return y == null;
    }
    if (y == null) {
        return false;
    }
    if (x.length !== y.length) {
        return false;
    }
    for (let i = 0; i < x.length; i++) {
        if (!eq(x[i], y[i])) {
            return false;
        }
    }
    return true;
}
function equalArrays(x, y) {
    return equalArraysWith(x, y, equals);
}
function equalObjects(x, y) {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length) {
        return false;
    }
    xKeys.sort();
    yKeys.sort();
    for (let i = 0; i < xKeys.length; i++) {
        if (xKeys[i] !== yKeys[i] || !equals(x[xKeys[i]], y[yKeys[i]])) {
            return false;
        }
    }
    return true;
}
function equals(x, y) {
    if (x === y) {
        return true;
    }
    else if (x == null) {
        return y == null;
    }
    else if (y == null) {
        return false;
    }
    else if (typeof x !== "object") {
        return false;
    }
    else if (isEquatable(x)) {
        return x.Equals(y);
    }
    else if (isArrayLike(x)) {
        return isArrayLike(y) && equalArrays(x, y);
    }
    else if (x instanceof Date) {
        return (y instanceof Date) && compareDates(x, y) === 0;
    }
    else {
        return Object.getPrototypeOf(x).constructor === Object && equalObjects(x, y);
    }
}
function compareDates(x, y) {
    let xtime;
    let ytime;
    // DateTimeOffset and DateTime deals with equality differently.
    if ("offset" in x && "offset" in y) {
        xtime = x.getTime();
        ytime = y.getTime();
    }
    else {
        xtime = x.getTime() + dateOffset(x);
        ytime = y.getTime() + dateOffset(y);
    }
    return xtime === ytime ? 0 : (xtime < ytime ? -1 : 1);
}
function comparePrimitives(x, y) {
    return x === y ? 0 : (x < y ? -1 : 1);
}
function compareArraysWith(x, y, comp) {
    if (x == null) {
        return y == null ? 0 : 1;
    }
    if (y == null) {
        return -1;
    }
    if (x.length !== y.length) {
        return x.length < y.length ? -1 : 1;
    }
    for (let i = 0, j = 0; i < x.length; i++) {
        j = comp(x[i], y[i]);
        if (j !== 0) {
            return j;
        }
    }
    return 0;
}
function compareArrays(x, y) {
    return compareArraysWith(x, y, compare);
}
function compareObjects(x, y) {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length) {
        return xKeys.length < yKeys.length ? -1 : 1;
    }
    xKeys.sort();
    yKeys.sort();
    for (let i = 0, j = 0; i < xKeys.length; i++) {
        const key = xKeys[i];
        if (key !== yKeys[i]) {
            return key < yKeys[i] ? -1 : 1;
        }
        else {
            j = compare(x[key], y[key]);
            if (j !== 0) {
                return j;
            }
        }
    }
    return 0;
}
function compare(x, y) {
    if (x === y) {
        return 0;
    }
    else if (x == null) {
        return y == null ? 0 : -1;
    }
    else if (y == null) {
        return 1;
    }
    else if (typeof x !== "object") {
        return x < y ? -1 : 1;
    }
    else if (isComparable(x)) {
        return x.CompareTo(y);
    }
    else if (isArrayLike(x)) {
        return isArrayLike(y) ? compareArrays(x, y) : -1;
    }
    else if (x instanceof Date) {
        return y instanceof Date ? compareDates(x, y) : -1;
    }
    else {
        return Object.getPrototypeOf(x).constructor === Object ? compareObjects(x, y) : -1;
    }
}
function min(comparer, x, y) {
    return comparer(x, y) < 0 ? x : y;
}
function max(comparer, x, y) {
    return comparer(x, y) > 0 ? x : y;
}
function clamp(comparer, value, min, max) {
    return (comparer(value, min) < 0) ? min : (comparer(value, max) > 0) ? max : value;
}
function createAtom(value) {
    let atom = value;
    return (value, isSetter) => {
        if (!isSetter) {
            return atom;
        }
        else {
            atom = value;
            return void 0;
        }
    };
}
function createObj(fields) {
    const obj = {};
    for (const kv of fields) {
        obj[kv[0]] = kv[1];
    }
    return obj;
}
function jsOptions(mutator) {
    const opts = {};
    mutator(opts);
    return opts;
}
function round(value, digits = 0) {
    const m = Math.pow(10, digits);
    const n = +(digits ? value * m : value).toFixed(8);
    const i = Math.floor(n);
    const f = n - i;
    const e = 1e-8;
    const r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return digits ? r / m : r;
}
function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
function randomNext(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function randomBytes(buffer) {
    if (buffer == null) {
        throw new Error("Buffer cannot be null");
    }
    for (let i = 0; i < buffer.length; i += 6) {
        // Pick random 48-bit number. Fill buffer in 2 24-bit chunks to avoid bitwise truncation.
        let r = Math.floor(Math.random() * 281474976710656); // Low 24 bits = chunk 1.
        const rhi = Math.floor(r / 16777216); // High 24 bits shifted via division = chunk 2.
        for (let j = 0; j < 6 && i + j < buffer.length; j++) {
            if (j === 3) {
                r = rhi;
            }
            buffer[i + j] = r & 255;
            r >>>= 8;
        }
    }
}
function unescapeDataString(s) {
    // https://stackoverflow.com/a/4458580/524236
    return decodeURIComponent((s).replace(/\+/g, "%20"));
}
function escapeDataString(s) {
    return encodeURIComponent(s).replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
}
function escapeUriString(s) {
    return encodeURI(s);
}
// ICollection.Clear and Count members can be called on Arrays
// or Dictionaries so we need a runtime check (see #1120)
function count(col) {
    if (isArrayLike(col)) {
        return col.length;
    }
    else {
        let count = 0;
        for (const _ of col) {
            count++;
        }
        return count;
    }
}
function clear(col) {
    if (isArrayLike(col)) {
        col.splice(0);
    }
    else {
        col.clear();
    }
}
const CURRIED_KEY = "__CURRIED__";
function uncurry(arity, f) {
    // f may be a function option with None value
    if (f == null || f.length > 1) {
        return f;
    }
    let uncurriedFn;
    switch (arity) {
        case 2:
            uncurriedFn = (a1, a2) => f(a1)(a2);
            break;
        case 3:
            uncurriedFn = (a1, a2, a3) => f(a1)(a2)(a3);
            break;
        case 4:
            uncurriedFn = (a1, a2, a3, a4) => f(a1)(a2)(a3)(a4);
            break;
        case 5:
            uncurriedFn = (a1, a2, a3, a4, a5) => f(a1)(a2)(a3)(a4)(a5);
            break;
        case 6:
            uncurriedFn = (a1, a2, a3, a4, a5, a6) => f(a1)(a2)(a3)(a4)(a5)(a6);
            break;
        case 7:
            uncurriedFn = (a1, a2, a3, a4, a5, a6, a7) => f(a1)(a2)(a3)(a4)(a5)(a6)(a7);
            break;
        case 8:
            uncurriedFn = (a1, a2, a3, a4, a5, a6, a7, a8) => f(a1)(a2)(a3)(a4)(a5)(a6)(a7)(a8);
            break;
        default:
            throw new Error("Uncurrying to more than 8-arity is not supported: " + arity);
    }
    uncurriedFn[CURRIED_KEY] = f;
    return uncurriedFn;
}
function curry(arity, f) {
    if (f == null || f.length === 1) {
        return f;
    }
    if (CURRIED_KEY in f) {
        return f[CURRIED_KEY];
    }
    switch (arity) {
        case 2:
            return (a1) => (a2) => f(a1, a2);
        case 3:
            return (a1) => (a2) => (a3) => f(a1, a2, a3);
        case 4:
            return (a1) => (a2) => (a3) => (a4) => f(a1, a2, a3, a4);
        case 5:
            return (a1) => (a2) => (a3) => (a4) => (a5) => f(a1, a2, a3, a4, a5);
        case 6:
            return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => f(a1, a2, a3, a4, a5, a6);
        case 7:
            return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => (a7) => f(a1, a2, a3, a4, a5, a6, a7);
        case 8:
            return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => (a7) => (a8) => f(a1, a2, a3, a4, a5, a6, a7, a8);
        default:
            throw new Error("Currying to more than 8-arity is not supported: " + arity);
    }
}
function checkArity(arity, f) {
    return f.length > arity
        ? (...args1) => (...args2) => f.apply(undefined, args1.concat(args2))
        : f;
}
function partialApply(arity, f, args) {
    if (f == null) {
        return undefined;
    }
    else if (CURRIED_KEY in f) {
        f = f[CURRIED_KEY];
        for (let i = 0; i < args.length; i++) {
            f = f(args[i]);
        }
        return f;
    }
    else {
        switch (arity) {
            case 1:
                // Wrap arguments to make sure .concat doesn't destruct arrays. Example
                // [1,2].concat([3,4],5)   --> [1,2,3,4,5]    // fails
                // [1,2].concat([[3,4],5]) --> [1,2,[3,4],5]  // ok
                return (a1) => f.apply(undefined, args.concat([a1]));
            case 2:
                return (a1) => (a2) => f.apply(undefined, args.concat([a1, a2]));
            case 3:
                return (a1) => (a2) => (a3) => f.apply(undefined, args.concat([a1, a2, a3]));
            case 4:
                return (a1) => (a2) => (a3) => (a4) => f.apply(undefined, args.concat([a1, a2, a3, a4]));
            case 5:
                return (a1) => (a2) => (a3) => (a4) => (a5) => f.apply(undefined, args.concat([a1, a2, a3, a4, a5]));
            case 6:
                return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => f.apply(undefined, args.concat([a1, a2, a3, a4, a5, a6]));
            case 7:
                return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => (a7) => f.apply(undefined, args.concat([a1, a2, a3, a4, a5, a6, a7]));
            case 8:
                return (a1) => (a2) => (a3) => (a4) => (a5) => (a6) => (a7) => (a8) => f.apply(undefined, args.concat([a1, a2, a3, a4, a5, a6, a7, a8]));
            default:
                throw new Error("Partially applying to more than 8-arity is not supported: " + arity);
        }
    }
}
function mapCurriedArgs(fn, mappings) {
    function mapArg(fn, arg, mappings, idx) {
        const mapping = mappings[idx];
        if (mapping !== 0) {
            const expectedArity = mapping[0];
            const actualArity = mapping[1];
            if (expectedArity > 1) {
                arg = curry(expectedArity, arg);
            }
            if (actualArity > 1) {
                arg = uncurry(actualArity, arg);
            }
        }
        const res = fn(arg);
        if (idx + 1 === mappings.length) {
            return res;
        }
        else {
            return (arg) => mapArg(res, arg, mappings, idx + 1);
        }
    }
    return (arg) => mapArg(fn, arg, mappings, 0);
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CaseInfo": () => (/* binding */ CaseInfo),
/* harmony export */   "TypeInfo": () => (/* binding */ TypeInfo),
/* harmony export */   "getGenerics": () => (/* binding */ getGenerics),
/* harmony export */   "getHashCode": () => (/* binding */ getHashCode),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "class_type": () => (/* binding */ class_type),
/* harmony export */   "record_type": () => (/* binding */ record_type),
/* harmony export */   "anonRecord_type": () => (/* binding */ anonRecord_type),
/* harmony export */   "union_type": () => (/* binding */ union_type),
/* harmony export */   "tuple_type": () => (/* binding */ tuple_type),
/* harmony export */   "delegate_type": () => (/* binding */ delegate_type),
/* harmony export */   "lambda_type": () => (/* binding */ lambda_type),
/* harmony export */   "option_type": () => (/* binding */ option_type),
/* harmony export */   "list_type": () => (/* binding */ list_type),
/* harmony export */   "array_type": () => (/* binding */ array_type),
/* harmony export */   "enum_type": () => (/* binding */ enum_type),
/* harmony export */   "obj_type": () => (/* binding */ obj_type),
/* harmony export */   "unit_type": () => (/* binding */ unit_type),
/* harmony export */   "char_type": () => (/* binding */ char_type),
/* harmony export */   "string_type": () => (/* binding */ string_type),
/* harmony export */   "bool_type": () => (/* binding */ bool_type),
/* harmony export */   "int8_type": () => (/* binding */ int8_type),
/* harmony export */   "uint8_type": () => (/* binding */ uint8_type),
/* harmony export */   "int16_type": () => (/* binding */ int16_type),
/* harmony export */   "uint16_type": () => (/* binding */ uint16_type),
/* harmony export */   "int32_type": () => (/* binding */ int32_type),
/* harmony export */   "uint32_type": () => (/* binding */ uint32_type),
/* harmony export */   "float32_type": () => (/* binding */ float32_type),
/* harmony export */   "float64_type": () => (/* binding */ float64_type),
/* harmony export */   "decimal_type": () => (/* binding */ decimal_type),
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "fullName": () => (/* binding */ fullName),
/* harmony export */   "namespace": () => (/* binding */ namespace),
/* harmony export */   "isArray": () => (/* binding */ isArray),
/* harmony export */   "getElementType": () => (/* binding */ getElementType),
/* harmony export */   "isGenericType": () => (/* binding */ isGenericType),
/* harmony export */   "isEnum": () => (/* binding */ isEnum),
/* harmony export */   "isSubclassOf": () => (/* binding */ isSubclassOf),
/* harmony export */   "getGenericTypeDefinition": () => (/* binding */ getGenericTypeDefinition),
/* harmony export */   "getEnumUnderlyingType": () => (/* binding */ getEnumUnderlyingType),
/* harmony export */   "getEnumValues": () => (/* binding */ getEnumValues),
/* harmony export */   "getEnumNames": () => (/* binding */ getEnumNames),
/* harmony export */   "parseEnum": () => (/* binding */ parseEnum),
/* harmony export */   "tryParseEnum": () => (/* binding */ tryParseEnum),
/* harmony export */   "getEnumName": () => (/* binding */ getEnumName),
/* harmony export */   "isEnumDefined": () => (/* binding */ isEnumDefined),
/* harmony export */   "getUnionCases": () => (/* binding */ getUnionCases),
/* harmony export */   "getRecordElements": () => (/* binding */ getRecordElements),
/* harmony export */   "getTupleElements": () => (/* binding */ getTupleElements),
/* harmony export */   "getFunctionElements": () => (/* binding */ getFunctionElements),
/* harmony export */   "isUnion": () => (/* binding */ isUnion),
/* harmony export */   "isRecord": () => (/* binding */ isRecord),
/* harmony export */   "isTuple": () => (/* binding */ isTuple),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "getUnionFields": () => (/* binding */ getUnionFields),
/* harmony export */   "getUnionCaseFields": () => (/* binding */ getUnionCaseFields),
/* harmony export */   "getRecordFields": () => (/* binding */ getRecordFields),
/* harmony export */   "getRecordField": () => (/* binding */ getRecordField),
/* harmony export */   "getTupleFields": () => (/* binding */ getTupleFields),
/* harmony export */   "getTupleField": () => (/* binding */ getTupleField),
/* harmony export */   "makeUnion": () => (/* binding */ makeUnion),
/* harmony export */   "makeRecord": () => (/* binding */ makeRecord),
/* harmony export */   "makeTuple": () => (/* binding */ makeTuple),
/* harmony export */   "makeGenericType": () => (/* binding */ makeGenericType),
/* harmony export */   "createInstance": () => (/* binding */ createInstance),
/* harmony export */   "getValue": () => (/* binding */ getValue),
/* harmony export */   "getCaseTag": () => (/* binding */ getCaseTag),
/* harmony export */   "getCaseName": () => (/* binding */ getCaseName),
/* harmony export */   "getCaseFields": () => (/* binding */ getCaseFields)
/* harmony export */ });
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


class CaseInfo {
    constructor(declaringType, tag, name, fields) {
        this.declaringType = declaringType;
        this.tag = tag;
        this.name = name;
        this.fields = fields;
    }
}
class TypeInfo {
    constructor(fullname, generics, construct, parent, fields, cases, enumCases) {
        this.fullname = fullname;
        this.generics = generics;
        this.construct = construct;
        this.parent = parent;
        this.fields = fields;
        this.cases = cases;
        this.enumCases = enumCases;
    }
    toString() {
        return fullName(this);
    }
    GetHashCode() {
        return getHashCode(this);
    }
    Equals(other) {
        return equals(this, other);
    }
}
function getGenerics(t) {
    return t.generics != null ? t.generics : [];
}
function getHashCode(t) {
    const fullnameHash = (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.stringHash)(t.fullname);
    const genHashes = getGenerics(t).map(getHashCode);
    return (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.combineHashCodes)([fullnameHash, ...genHashes]);
}
function equals(t1, t2) {
    if (t1.fullname === "") { // Anonymous records
        return t2.fullname === ""
            && (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.equalArraysWith)(getRecordElements(t1), getRecordElements(t2), ([k1, v1], [k2, v2]) => k1 === k2 && equals(v1, v2));
    }
    else {
        return t1.fullname === t2.fullname
            && (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.equalArraysWith)(getGenerics(t1), getGenerics(t2), equals);
    }
}
function class_type(fullname, generics, construct, parent) {
    return new TypeInfo(fullname, generics, construct, parent);
}
function record_type(fullname, generics, construct, fields) {
    return new TypeInfo(fullname, generics, construct, undefined, fields);
}
function anonRecord_type(...fields) {
    return new TypeInfo("", undefined, undefined, undefined, () => fields);
}
function union_type(fullname, generics, construct, cases) {
    const t = new TypeInfo(fullname, generics, construct, undefined, undefined, () => {
        const caseNames = construct.prototype.cases();
        return cases().map((fields, i) => new CaseInfo(t, i, caseNames[i], fields));
    });
    return t;
}
function tuple_type(...generics) {
    return new TypeInfo("System.Tuple`" + generics.length, generics);
}
function delegate_type(...generics) {
    return new TypeInfo("System.Func`" + generics.length, generics);
}
function lambda_type(argType, returnType) {
    return new TypeInfo("Microsoft.FSharp.Core.FSharpFunc`2", [argType, returnType]);
}
function option_type(generic) {
    return new TypeInfo("Microsoft.FSharp.Core.FSharpOption`1", [generic]);
}
function list_type(generic) {
    return new TypeInfo("Microsoft.FSharp.Collections.FSharpList`1", [generic]);
}
function array_type(generic) {
    return new TypeInfo(generic.fullname + "[]", [generic]);
}
function enum_type(fullname, underlyingType, enumCases) {
    return new TypeInfo(fullname, [underlyingType], undefined, undefined, undefined, undefined, enumCases);
}
const obj_type = new TypeInfo("System.Object");
const unit_type = new TypeInfo("Microsoft.FSharp.Core.Unit");
const char_type = new TypeInfo("System.Char");
const string_type = new TypeInfo("System.String");
const bool_type = new TypeInfo("System.Boolean");
const int8_type = new TypeInfo("System.SByte");
const uint8_type = new TypeInfo("System.Byte");
const int16_type = new TypeInfo("System.Int16");
const uint16_type = new TypeInfo("System.UInt16");
const int32_type = new TypeInfo("System.Int32");
const uint32_type = new TypeInfo("System.UInt32");
const float32_type = new TypeInfo("System.Single");
const float64_type = new TypeInfo("System.Double");
const decimal_type = new TypeInfo("System.Decimal");
function name(info) {
    if (Array.isArray(info)) {
        return info[0];
    }
    else if (info instanceof CaseInfo) {
        return info.name;
    }
    else {
        const i = info.fullname.lastIndexOf(".");
        return i === -1 ? info.fullname : info.fullname.substr(i + 1);
    }
}
function fullName(t) {
    const gen = t.generics != null && !isArray(t) ? t.generics : [];
    if (gen.length > 0) {
        return t.fullname + "[" + gen.map((x) => fullName(x)).join(",") + "]";
    }
    else {
        return t.fullname;
    }
}
function namespace(t) {
    const i = t.fullname.lastIndexOf(".");
    return i === -1 ? "" : t.fullname.substr(0, i);
}
function isArray(t) {
    return t.fullname.endsWith("[]");
}
function getElementType(t) {
    var _a;
    return isArray(t) ? (_a = t.generics) === null || _a === void 0 ? void 0 : _a[0] : undefined;
}
function isGenericType(t) {
    return t.generics != null && t.generics.length > 0;
}
function isEnum(t) {
    return t.enumCases != null && t.enumCases.length > 0;
}
function isSubclassOf(t1, t2) {
    var _a, _b;
    return (_b = (_a = t1.parent) === null || _a === void 0 ? void 0 : _a.Equals(t2)) !== null && _b !== void 0 ? _b : false;
}
/**
 * This doesn't replace types for fields (records) or cases (unions)
 * but it should be enough for type comparison purposes
 */
function getGenericTypeDefinition(t) {
    return t.generics == null ? t : new TypeInfo(t.fullname, t.generics.map(() => obj_type));
}
function getEnumUnderlyingType(t) {
    var _a;
    return (_a = t.generics) === null || _a === void 0 ? void 0 : _a[0];
}
function getEnumValues(t) {
    if (isEnum(t) && t.enumCases != null) {
        return t.enumCases.map((kv) => kv[1]);
    }
    else {
        throw new Error(`${t.fullname} is not an enum type`);
    }
}
function getEnumNames(t) {
    if (isEnum(t) && t.enumCases != null) {
        return t.enumCases.map((kv) => kv[0]);
    }
    else {
        throw new Error(`${t.fullname} is not an enum type`);
    }
}
function getEnumCase(t, v) {
    if (t.enumCases != null) {
        if (typeof v === "string") {
            for (const kv of t.enumCases) {
                if (kv[0] === v) {
                    return kv;
                }
            }
            throw new Error(`'${v}' was not found in ${t.fullname}`);
        }
        else {
            for (const kv of t.enumCases) {
                if (kv[1] === v) {
                    return kv;
                }
            }
            // .NET returns the number even if it doesn't match any of the cases
            return ["", v];
        }
    }
    else {
        throw new Error(`${t.fullname} is not an enum type`);
    }
}
function parseEnum(t, str) {
    // TODO: better int parsing here, parseInt ceils floats: "4.8" -> 4
    const value = parseInt(str, 10);
    return getEnumCase(t, isNaN(value) ? str : value)[1];
}
function tryParseEnum(t, str, defValue) {
    try {
        defValue.contents = parseEnum(t, str);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function getEnumName(t, v) {
    return getEnumCase(t, v)[0];
}
function isEnumDefined(t, v) {
    try {
        const kv = getEnumCase(t, v);
        return kv[0] != null && kv[0] !== "";
    }
    catch (_a) {
        // supress error
    }
    return false;
}
// FSharpType
function getUnionCases(t) {
    if (t.cases != null) {
        return t.cases();
    }
    else {
        throw new Error(`${t.fullname} is not an F# union type`);
    }
}
function getRecordElements(t) {
    if (t.fields != null) {
        return t.fields();
    }
    else {
        throw new Error(`${t.fullname} is not an F# record type`);
    }
}
function getTupleElements(t) {
    if (isTuple(t) && t.generics != null) {
        return t.generics;
    }
    else {
        throw new Error(`${t.fullname} is not a tuple type`);
    }
}
function getFunctionElements(t) {
    if (isFunction(t) && t.generics != null) {
        const gen = t.generics;
        return [gen[0], gen[1]];
    }
    else {
        throw new Error(`${t.fullname} is not an F# function type`);
    }
}
function isUnion(t) {
    return t instanceof TypeInfo ? t.cases != null : t instanceof _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union;
}
function isRecord(t) {
    return t instanceof TypeInfo ? t.fields != null : t instanceof _Types_js__WEBPACK_IMPORTED_MODULE_0__.Record;
}
function isTuple(t) {
    return t.fullname.startsWith("System.Tuple") && !isArray(t);
}
// In .NET this is false for delegates
function isFunction(t) {
    return t.fullname === "Microsoft.FSharp.Core.FSharpFunc`2";
}
// FSharpValue
function getUnionFields(v, t) {
    const cases = getUnionCases(t);
    const case_ = cases[v.tag];
    if (case_ == null) {
        throw new Error(`Cannot find case ${v.name} in union type`);
    }
    return [case_, v.fields];
}
function getUnionCaseFields(uci) {
    return uci.fields == null ? [] : uci.fields;
}
// This is used as replacement of `FSharpValue.GetRecordFields`
// For `FSharpTypes.GetRecordFields` see `getRecordElements`
// Object.keys returns keys in the order they were added to the object
function getRecordFields(v) {
    return Object.keys(v).map((k) => v[k]);
}
function getRecordField(v, field) {
    return v[field[0]];
}
function getTupleFields(v) {
    return v;
}
function getTupleField(v, i) {
    return v[i];
}
function makeUnion(uci, values) {
    const expectedLength = (uci.fields || []).length;
    if (values.length !== expectedLength) {
        throw new Error(`Expected an array of length ${expectedLength} but got ${values.length}`);
    }
    return uci.declaringType.construct != null
        ? new uci.declaringType.construct(uci.tag, ...values)
        : {};
}
function makeRecord(t, values) {
    const fields = getRecordElements(t);
    if (fields.length !== values.length) {
        throw new Error(`Expected an array of length ${fields.length} but got ${values.length}`);
    }
    return t.construct != null
        ? new t.construct(...values)
        : fields.reduce((obj, [key, _t], i) => {
            obj[key] = values[i];
            return obj;
        }, {});
}
function makeTuple(values, _t) {
    return values;
}
function makeGenericType(t, generics) {
    return new TypeInfo(t.fullname, generics, t.construct, t.parent, t.fields, t.cases);
}
function createInstance(t, consArgs) {
    // TODO: Check if consArgs length is same as t.construct?
    // (Arg types can still be different)
    if (typeof t.construct === "function") {
        return new t.construct(...(consArgs !== null && consArgs !== void 0 ? consArgs : []));
    }
    else {
        throw new Error(`Cannot access constructor of ${t.fullname}`);
    }
}
function getValue(propertyInfo, v) {
    return v[propertyInfo[0]];
}
// Fable.Core.Reflection
function assertUnion(x) {
    if (!(x instanceof _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union)) {
        throw new Error(`Value is not an F# union type`);
    }
}
function getCaseTag(x) {
    assertUnion(x);
    return x.tag;
}
function getCaseName(x) {
    assertUnion(x);
    return x.cases()[x.tag];
}
function getCaseFields(x) {
    assertUnion(x);
    return x.fields;
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "compareOrdinal": () => (/* binding */ compareOrdinal),
/* harmony export */   "compareTo": () => (/* binding */ compareTo),
/* harmony export */   "startsWith": () => (/* binding */ startsWith),
/* harmony export */   "indexOfAny": () => (/* binding */ indexOfAny),
/* harmony export */   "printf": () => (/* binding */ printf),
/* harmony export */   "interpolate": () => (/* binding */ interpolate),
/* harmony export */   "toConsole": () => (/* binding */ toConsole),
/* harmony export */   "toConsoleError": () => (/* binding */ toConsoleError),
/* harmony export */   "toText": () => (/* binding */ toText),
/* harmony export */   "toFail": () => (/* binding */ toFail),
/* harmony export */   "fsFormat": () => (/* binding */ fsFormat),
/* harmony export */   "format": () => (/* binding */ format),
/* harmony export */   "endsWith": () => (/* binding */ endsWith),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "insert": () => (/* binding */ insert),
/* harmony export */   "isNullOrEmpty": () => (/* binding */ isNullOrEmpty),
/* harmony export */   "isNullOrWhiteSpace": () => (/* binding */ isNullOrWhiteSpace),
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "join": () => (/* binding */ join),
/* harmony export */   "joinWithIndices": () => (/* binding */ joinWithIndices),
/* harmony export */   "toBase64String": () => (/* binding */ toBase64String),
/* harmony export */   "fromBase64String": () => (/* binding */ fromBase64String),
/* harmony export */   "padLeft": () => (/* binding */ padLeft),
/* harmony export */   "padRight": () => (/* binding */ padRight),
/* harmony export */   "remove": () => (/* binding */ remove),
/* harmony export */   "replace": () => (/* binding */ replace),
/* harmony export */   "replicate": () => (/* binding */ replicate),
/* harmony export */   "getCharAtIndex": () => (/* binding */ getCharAtIndex),
/* harmony export */   "split": () => (/* binding */ split),
/* harmony export */   "trim": () => (/* binding */ trim),
/* harmony export */   "trimStart": () => (/* binding */ trimStart),
/* harmony export */   "trimEnd": () => (/* binding */ trimEnd),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "substring": () => (/* binding */ substring)
/* harmony export */ });
/* harmony import */ var _Date_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _Numeric_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _RegExp_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);




const fsFormatRegExp = /(^|[^%])%([0+\- ]*)(\*|\d+)?(?:\.(\d+))?(\w)/;
const interpolateRegExp = /(?:(^|[^%])%([0+\- ]*)(\d+)?(?:\.(\d+))?(\w))?%P\(\)/g;
const formatRegExp = /\{(\d+)(,-?\d+)?(?:\:([a-zA-Z])(\d{0,2})|\:(.+?))?\}/g;
function isLessThan(x, y) {
    return (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.compare)(x, y) < 0;
}
function cmp(x, y, ic) {
    function isIgnoreCase(i) {
        return i === true ||
            i === 1 /* CurrentCultureIgnoreCase */ ||
            i === 3 /* InvariantCultureIgnoreCase */ ||
            i === 5 /* OrdinalIgnoreCase */;
    }
    function isOrdinal(i) {
        return i === 4 /* Ordinal */ ||
            i === 5 /* OrdinalIgnoreCase */;
    }
    if (x == null) {
        return y == null ? 0 : -1;
    }
    if (y == null) {
        return 1;
    } // everything is bigger than null
    if (isOrdinal(ic)) {
        if (isIgnoreCase(ic)) {
            x = x.toLowerCase();
            y = y.toLowerCase();
        }
        return (x === y) ? 0 : (x < y ? -1 : 1);
    }
    else {
        if (isIgnoreCase(ic)) {
            x = x.toLocaleLowerCase();
            y = y.toLocaleLowerCase();
        }
        return x.localeCompare(y);
    }
}
function compare(...args) {
    switch (args.length) {
        case 2: return cmp(args[0], args[1], false);
        case 3: return cmp(args[0], args[1], args[2]);
        case 4: return cmp(args[0], args[1], args[2] === true);
        case 5: return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), false);
        case 6: return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5]);
        case 7: return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5] === true);
        default: throw new Error("String.compare: Unsupported number of parameters");
    }
}
function compareOrdinal(x, y) {
    return cmp(x, y, 4 /* Ordinal */);
}
function compareTo(x, y) {
    return cmp(x, y, 0 /* CurrentCulture */);
}
function startsWith(str, pattern, ic) {
    if (str.length >= pattern.length) {
        return cmp(str.substr(0, pattern.length), pattern, ic) === 0;
    }
    return false;
}
function indexOfAny(str, anyOf, ...args) {
    if (str == null || str === "") {
        return -1;
    }
    const startIndex = (args.length > 0) ? args[0] : 0;
    if (startIndex < 0) {
        throw new Error("Start index cannot be negative");
    }
    const length = (args.length > 1) ? args[1] : str.length - startIndex;
    if (length < 0) {
        throw new Error("Length cannot be negative");
    }
    if (length > str.length - startIndex) {
        throw new Error("Invalid startIndex and length");
    }
    str = str.substr(startIndex, length);
    for (const c of anyOf) {
        const index = str.indexOf(c);
        if (index > -1) {
            return index + startIndex;
        }
    }
    return -1;
}
function printf(input) {
    return {
        input,
        cont: fsFormat(input),
    };
}
function interpolate(input, values) {
    let i = 0;
    return input.replace(interpolateRegExp, (_, prefix, flags, padLength, precision, format) => {
        return formatReplacement(values[i++], prefix, flags, padLength, precision, format);
    });
}
function continuePrint(cont, arg) {
    return typeof arg === "string" ? cont(arg) : arg.cont(cont);
}
function toConsole(arg) {
    // Don't remove the lambda here, see #1357
    return continuePrint((x) => console.log(x), arg);
}
function toConsoleError(arg) {
    return continuePrint((x) => console.error(x), arg);
}
function toText(arg) {
    return continuePrint((x) => x, arg);
}
function toFail(arg) {
    return continuePrint((x) => {
        throw new Error(x);
    }, arg);
}
function formatReplacement(rep, prefix, flags, padLength, precision, format) {
    let sign = "";
    flags = flags || "";
    format = format || "";
    if ((0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.isNumeric)(rep)) {
        if (format.toLowerCase() !== "x") {
            if (isLessThan(rep, 0)) {
                rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.multiply)(rep, -1);
                sign = "-";
            }
            else {
                if (flags.indexOf(" ") >= 0) {
                    sign = " ";
                }
                else if (flags.indexOf("+") >= 0) {
                    sign = "+";
                }
            }
        }
        precision = precision == null ? null : parseInt(precision, 10);
        switch (format) {
            case "f":
            case "F":
                precision = precision != null ? precision : 6;
                rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toFixed)(rep, precision);
                break;
            case "g":
            case "G":
                rep = precision != null ? (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toPrecision)(rep, precision) : (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toPrecision)(rep);
                break;
            case "e":
            case "E":
                rep = precision != null ? (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toExponential)(rep, precision) : (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toExponential)(rep);
                break;
            case "x":
                rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(rep);
                break;
            case "X":
                rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(rep).toUpperCase();
                break;
            default: // AOid
                rep = String(rep);
                break;
        }
    }
    else if (rep instanceof Date) {
        rep = (0,_Date_js__WEBPACK_IMPORTED_MODULE_0__.toString)(rep);
    }
    else {
        rep = (0,_Types_js__WEBPACK_IMPORTED_MODULE_3__.toString)(rep);
    }
    padLength = typeof padLength === "number" ? padLength : parseInt(padLength, 10);
    if (!isNaN(padLength)) {
        const zeroFlag = flags.indexOf("0") >= 0; // Use '0' for left padding
        const minusFlag = flags.indexOf("-") >= 0; // Right padding
        const ch = minusFlag || !zeroFlag ? " " : "0";
        if (ch === "0") {
            rep = padLeft(rep, padLength - sign.length, ch, minusFlag);
            rep = sign + rep;
        }
        else {
            rep = padLeft(sign + rep, padLength, ch, minusFlag);
        }
    }
    else {
        rep = sign + rep;
    }
    return prefix ? prefix + rep : rep;
}
function formatOnce(str2, rep, padRef) {
    return str2.replace(fsFormatRegExp, (match, prefix, flags, padLength, precision, format) => {
        if (padRef.contents != null) {
            padLength = padRef.contents;
            padRef.contents = null;
        }
        else if (padLength === "*") {
            if (rep < 0) {
                throw new Error("Non-negative number required");
            }
            padRef.contents = rep;
            return match;
        }
        const once = formatReplacement(rep, prefix, flags, padLength, precision, format);
        return once.replace(/%/g, "%%");
    });
}
function createPrinter(str, cont, padRef = new _Types_js__WEBPACK_IMPORTED_MODULE_3__.FSharpRef(null)) {
    return (...args) => {
        // Make a copy as the function may be used several times
        let strCopy = str;
        for (const arg of args) {
            strCopy = formatOnce(strCopy, arg, padRef);
        }
        return fsFormatRegExp.test(strCopy)
            ? createPrinter(strCopy, cont, padRef)
            : cont(strCopy.replace(/%%/g, "%"));
    };
}
function fsFormat(str) {
    return (cont) => {
        return fsFormatRegExp.test(str)
            ? createPrinter(str, cont)
            : cont(str);
    };
}
function format(str, ...args) {
    if (typeof str === "object" && args.length > 0) {
        // Called with culture info
        str = args[0];
        args.shift();
    }
    return str.replace(formatRegExp, (_, idx, padLength, format, precision, pattern) => {
        let rep = args[idx];
        if ((0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.isNumeric)(rep)) {
            precision = precision == null ? null : parseInt(precision, 10);
            switch (format) {
                case "f":
                case "F":
                    precision = precision != null ? precision : 2;
                    rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toFixed)(rep, precision);
                    break;
                case "g":
                case "G":
                    rep = precision != null ? (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toPrecision)(rep, precision) : (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toPrecision)(rep);
                    break;
                case "e":
                case "E":
                    rep = precision != null ? (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toExponential)(rep, precision) : (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toExponential)(rep);
                    break;
                case "p":
                case "P":
                    precision = precision != null ? precision : 2;
                    rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toFixed)((0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.multiply)(rep, 100), precision) + " %";
                    break;
                case "d":
                case "D":
                    rep = precision != null ? padLeft(String(rep), precision, "0") : String(rep);
                    break;
                case "x":
                case "X":
                    rep = precision != null ? padLeft((0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(rep), precision, "0") : (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toHex)(rep);
                    if (format === "X") {
                        rep = rep.toUpperCase();
                    }
                    break;
                default:
                    if (pattern) {
                        let sign = "";
                        rep = pattern.replace(/(0+)(\.0+)?/, (_, intPart, decimalPart) => {
                            if (isLessThan(rep, 0)) {
                                rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.multiply)(rep, -1);
                                sign = "-";
                            }
                            rep = (0,_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.toFixed)(rep, decimalPart != null ? decimalPart.length - 1 : 0);
                            return padLeft(rep, (intPart || "").length - sign.length + (decimalPart != null ? decimalPart.length : 0), "0");
                        });
                        rep = sign + rep;
                    }
            }
        }
        else if (rep instanceof Date) {
            rep = (0,_Date_js__WEBPACK_IMPORTED_MODULE_0__.toString)(rep, pattern || format);
        }
        else {
            rep = (0,_Types_js__WEBPACK_IMPORTED_MODULE_3__.toString)(rep);
        }
        padLength = parseInt((padLength || " ").substring(1), 10);
        if (!isNaN(padLength)) {
            rep = padLeft(String(rep), Math.abs(padLength), " ", padLength < 0);
        }
        return rep;
    });
}
function endsWith(str, search) {
    const idx = str.lastIndexOf(search);
    return idx >= 0 && idx === str.length - search.length;
}
function initialize(n, f) {
    if (n < 0) {
        throw new Error("String length must be non-negative");
    }
    const xs = new Array(n);
    for (let i = 0; i < n; i++) {
        xs[i] = f(i);
    }
    return xs.join("");
}
function insert(str, startIndex, value) {
    if (startIndex < 0 || startIndex > str.length) {
        throw new Error("startIndex is negative or greater than the length of this instance.");
    }
    return str.substring(0, startIndex) + value + str.substring(startIndex);
}
function isNullOrEmpty(str) {
    return typeof str !== "string" || str.length === 0;
}
function isNullOrWhiteSpace(str) {
    return typeof str !== "string" || /^\s*$/.test(str);
}
function concat(...xs) {
    return xs.map((x) => String(x)).join("");
}
function join(delimiter, xs) {
    if (Array.isArray(xs)) {
        return xs.join(delimiter);
    }
    else {
        return Array.from(xs).join(delimiter);
    }
}
function joinWithIndices(delimiter, xs, startIndex, count) {
    const endIndexPlusOne = startIndex + count;
    if (endIndexPlusOne > xs.length) {
        throw new Error("Index and count must refer to a location within the buffer.");
    }
    return xs.slice(startIndex, endIndexPlusOne).join(delimiter);
}
function notSupported(name) {
    throw new Error("The environment doesn't support '" + name + "', please use a polyfill.");
}
function toBase64String(inArray) {
    let str = "";
    for (let i = 0; i < inArray.length; i++) {
        str += String.fromCharCode(inArray[i]);
    }
    return typeof btoa === "function" ? btoa(str) : notSupported("btoa");
}
function fromBase64String(b64Encoded) {
    const binary = typeof atob === "function" ? atob(b64Encoded) : notSupported("atob");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
function padLeft(str, len, ch, isRight) {
    ch = ch || " ";
    len = len - str.length;
    for (let i = 0; i < len; i++) {
        str = isRight ? str + ch : ch + str;
    }
    return str;
}
function padRight(str, len, ch) {
    return padLeft(str, len, ch, true);
}
function remove(str, startIndex, count) {
    if (startIndex >= str.length) {
        throw new Error("startIndex must be less than length of string");
    }
    if (typeof count === "number" && (startIndex + count) > str.length) {
        throw new Error("Index and count must refer to a location within the string.");
    }
    return str.slice(0, startIndex) + (typeof count === "number" ? str.substr(startIndex + count) : "");
}
function replace(str, search, replace) {
    return str.replace(new RegExp((0,_RegExp_js__WEBPACK_IMPORTED_MODULE_2__.escape)(search), "g"), replace);
}
function replicate(n, x) {
    return initialize(n, () => x);
}
function getCharAtIndex(input, index) {
    if (index < 0 || index >= input.length) {
        throw new Error("Index was outside the bounds of the array.");
    }
    return input[index];
}
function split(str, splitters, count, removeEmpty) {
    count = typeof count === "number" ? count : undefined;
    removeEmpty = typeof removeEmpty === "number" ? removeEmpty : undefined;
    if (count && count < 0) {
        throw new Error("Count cannot be less than zero");
    }
    if (count === 0) {
        return [];
    }
    if (!Array.isArray(splitters)) {
        if (removeEmpty === 0) {
            return str.split(splitters, count);
        }
        const len = arguments.length;
        splitters = Array(len - 1);
        for (let key = 1; key < len; key++) {
            splitters[key - 1] = arguments[key];
        }
    }
    splitters = splitters.map((x) => (0,_RegExp_js__WEBPACK_IMPORTED_MODULE_2__.escape)(x));
    splitters = splitters.length > 0 ? splitters : [" "];
    let i = 0;
    const splits = [];
    const reg = new RegExp(splitters.join("|"), "g");
    while (count == null || count > 1) {
        const m = reg.exec(str);
        if (m === null) {
            break;
        }
        if (!removeEmpty || (m.index - i) > 0) {
            count = count != null ? count - 1 : count;
            splits.push(str.substring(i, m.index));
        }
        i = reg.lastIndex;
    }
    if (!removeEmpty || (str.length - i) > 0) {
        splits.push(str.substring(i));
    }
    return splits;
}
function trim(str, ...chars) {
    if (chars.length === 0) {
        return str.trim();
    }
    const pattern = "[" + (0,_RegExp_js__WEBPACK_IMPORTED_MODULE_2__.escape)(chars.join("")) + "]+";
    return str.replace(new RegExp("^" + pattern), "").replace(new RegExp(pattern + "$"), "");
}
function trimStart(str, ...chars) {
    return chars.length === 0
        ? str.trimStart()
        : str.replace(new RegExp("^[" + (0,_RegExp_js__WEBPACK_IMPORTED_MODULE_2__.escape)(chars.join("")) + "]+"), "");
}
function trimEnd(str, ...chars) {
    return chars.length === 0
        ? str.trimEnd()
        : str.replace(new RegExp("[" + (0,_RegExp_js__WEBPACK_IMPORTED_MODULE_2__.escape)(chars.join("")) + "]+$"), "");
}
function filter(pred, x) {
    return x.split("").filter((c) => pred(c)).join("");
}
function substring(str, startIndex, length) {
    if ((startIndex + (length || 0) > str.length)) {
        throw new Error("Invalid startIndex and/or length");
    }
    return length != null ? str.substr(startIndex, length) : str.substr(startIndex);
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "offsetRegex": () => (/* binding */ offsetRegex),
/* harmony export */   "dateOffsetToString": () => (/* binding */ dateOffsetToString),
/* harmony export */   "dateToHalfUTCString": () => (/* binding */ dateToHalfUTCString),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "DateTime": () => (/* binding */ DateTime),
/* harmony export */   "fromTicks": () => (/* binding */ fromTicks),
/* harmony export */   "fromDateTimeOffset": () => (/* binding */ fromDateTimeOffset),
/* harmony export */   "getTicks": () => (/* binding */ getTicks),
/* harmony export */   "minValue": () => (/* binding */ minValue),
/* harmony export */   "maxValue": () => (/* binding */ maxValue),
/* harmony export */   "parseRaw": () => (/* binding */ parseRaw),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "tryParse": () => (/* binding */ tryParse),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "now": () => (/* binding */ now),
/* harmony export */   "utcNow": () => (/* binding */ utcNow),
/* harmony export */   "today": () => (/* binding */ today),
/* harmony export */   "isLeapYear": () => (/* binding */ isLeapYear),
/* harmony export */   "daysInMonth": () => (/* binding */ daysInMonth),
/* harmony export */   "toUniversalTime": () => (/* binding */ toUniversalTime),
/* harmony export */   "toLocalTime": () => (/* binding */ toLocalTime),
/* harmony export */   "specifyKind": () => (/* binding */ specifyKind),
/* harmony export */   "timeOfDay": () => (/* binding */ timeOfDay),
/* harmony export */   "date": () => (/* binding */ date),
/* harmony export */   "day": () => (/* binding */ day),
/* harmony export */   "hour": () => (/* binding */ hour),
/* harmony export */   "millisecond": () => (/* binding */ millisecond),
/* harmony export */   "minute": () => (/* binding */ minute),
/* harmony export */   "month": () => (/* binding */ month),
/* harmony export */   "second": () => (/* binding */ second),
/* harmony export */   "year": () => (/* binding */ year),
/* harmony export */   "dayOfWeek": () => (/* binding */ dayOfWeek),
/* harmony export */   "dayOfYear": () => (/* binding */ dayOfYear),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "addDays": () => (/* binding */ addDays),
/* harmony export */   "addHours": () => (/* binding */ addHours),
/* harmony export */   "addMinutes": () => (/* binding */ addMinutes),
/* harmony export */   "addSeconds": () => (/* binding */ addSeconds),
/* harmony export */   "addMilliseconds": () => (/* binding */ addMilliseconds),
/* harmony export */   "addYears": () => (/* binding */ addYears),
/* harmony export */   "addMonths": () => (/* binding */ addMonths),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "toLongDateString": () => (/* binding */ toLongDateString),
/* harmony export */   "toShortDateString": () => (/* binding */ toShortDateString),
/* harmony export */   "toLongTimeString": () => (/* binding */ toLongTimeString),
/* harmony export */   "toShortTimeString": () => (/* binding */ toShortTimeString),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "compareTo": () => (/* binding */ compareTo),
/* harmony export */   "op_Addition": () => (/* binding */ op_Addition),
/* harmony export */   "op_Subtraction": () => (/* binding */ op_Subtraction),
/* harmony export */   "isDaylightSavingTime": () => (/* binding */ isDaylightSavingTime),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Long_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/**
 * DateTimeOffset functions.
 *
 * Note: Date instances are always DateObjects in local
 * timezone (because JS dates are all kinds of messed up).
 * A local date returns UTC epoc when `.getTime()` is called.
 *
 * Basically; invariant: date.getTime() always return UTC time.
 */


const offsetRegex = /(?:Z|[+-](\d+):?([0-5]?\d)?)\s*$/;
function dateOffsetToString(offset) {
    const isMinus = offset < 0;
    offset = Math.abs(offset);
    const hours = ~~(offset / 3600000);
    const minutes = (offset % 3600000) / 60000;
    return (isMinus ? "-" : "+") +
        (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(hours, 2) + ":" +
        (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(minutes, 2);
}
function dateToHalfUTCString(date, half) {
    const str = date.toISOString();
    return half === "first"
        ? str.substring(0, str.indexOf("T"))
        : str.substring(str.indexOf("T") + 1, str.length - 1);
}
function dateToISOString(d, utc) {
    if (utc) {
        return d.toISOString();
    }
    else {
        // JS Date is always local
        const printOffset = d.kind == null ? true : d.kind === 2 /* Local */;
        return (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getFullYear(), 4) + "-" +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getMonth() + 1, 2) + "-" +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getDate(), 2) + "T" +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getHours(), 2) + ":" +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getMinutes(), 2) + ":" +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getSeconds(), 2) + "." +
            (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.padWithZeros)(d.getMilliseconds(), 3) +
            (printOffset ? dateOffsetToString(d.getTimezoneOffset() * -60000) : "");
    }
}
function dateToISOStringWithOffset(dateWithOffset, offset) {
    const str = dateWithOffset.toISOString();
    return str.substring(0, str.length - 1) + dateOffsetToString(offset);
}
function dateToStringWithCustomFormat(date, format, utc) {
    return format.replace(/(\w)\1*/g, (match) => {
        let rep = Number.NaN;
        switch (match.substring(0, 1)) {
            case "y":
                const y = utc ? date.getUTCFullYear() : date.getFullYear();
                rep = match.length < 4 ? y % 100 : y;
                break;
            case "M":
                rep = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
                break;
            case "d":
                rep = utc ? date.getUTCDate() : date.getDate();
                break;
            case "H":
                rep = utc ? date.getUTCHours() : date.getHours();
                break;
            case "h":
                const h = utc ? date.getUTCHours() : date.getHours();
                rep = h > 12 ? h % 12 : h;
                break;
            case "m":
                rep = utc ? date.getUTCMinutes() : date.getMinutes();
                break;
            case "s":
                rep = utc ? date.getUTCSeconds() : date.getSeconds();
                break;
            case "f":
                rep = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
                break;
        }
        if (Number.isNaN(rep)) {
            return match;
        }
        else {
            return (rep < 10 && match.length > 1) ? "0" + rep : "" + rep;
        }
    });
}
function dateToStringWithOffset(date, format) {
    var _a, _b, _c;
    const d = new Date(date.getTime() + ((_a = date.offset) !== null && _a !== void 0 ? _a : 0));
    if (typeof format !== "string") {
        return d.toISOString().replace(/\.\d+/, "").replace(/[A-Z]|\.\d+/g, " ") + dateOffsetToString(((_b = date.offset) !== null && _b !== void 0 ? _b : 0));
    }
    else if (format.length === 1) {
        switch (format) {
            case "D":
            case "d": return dateToHalfUTCString(d, "first");
            case "T":
            case "t": return dateToHalfUTCString(d, "second");
            case "O":
            case "o": return dateToISOStringWithOffset(d, ((_c = date.offset) !== null && _c !== void 0 ? _c : 0));
            default: throw new Error("Unrecognized Date print format");
        }
    }
    else {
        return dateToStringWithCustomFormat(d, format, true);
    }
}
function dateToStringWithKind(date, format) {
    const utc = date.kind === 1 /* UTC */;
    if (typeof format !== "string") {
        return utc ? date.toUTCString() : date.toLocaleString();
    }
    else if (format.length === 1) {
        switch (format) {
            case "D":
            case "d":
                return utc ? dateToHalfUTCString(date, "first") : date.toLocaleDateString();
            case "T":
            case "t":
                return utc ? dateToHalfUTCString(date, "second") : date.toLocaleTimeString();
            case "O":
            case "o":
                return dateToISOString(date, utc);
            default:
                throw new Error("Unrecognized Date print format");
        }
    }
    else {
        return dateToStringWithCustomFormat(date, format, utc);
    }
}
function toString(date, format, _provider) {
    return date.offset != null
        ? dateToStringWithOffset(date, format)
        : dateToStringWithKind(date, format);
}
function DateTime(value, kind) {
    const d = new Date(value);
    d.kind = (kind == null ? 0 /* Unspecified */ : kind) | 0;
    return d;
}
function fromTicks(ticks, kind) {
    ticks = (0,_Long_js__WEBPACK_IMPORTED_MODULE_0__.fromValue)(ticks);
    kind = kind != null ? kind : 0 /* Unspecified */;
    let date = DateTime((0,_Long_js__WEBPACK_IMPORTED_MODULE_0__.ticksToUnixEpochMilliseconds)(ticks), kind);
    // Ticks are local to offset (in this case, either UTC or Local/Unknown).
    // If kind is anything but UTC, that means that the tick number was not
    // in utc, thus getTime() cannot return UTC, and needs to be shifted.
    if (kind !== 1 /* UTC */) {
        date = DateTime(date.getTime() - (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.dateOffset)(date), kind);
    }
    return date;
}
function fromDateTimeOffset(date, kind) {
    var _a;
    switch (kind) {
        case 1 /* UTC */: return DateTime(date.getTime(), 1 /* UTC */);
        case 2 /* Local */: return DateTime(date.getTime(), 2 /* Local */);
        default:
            const d = DateTime(date.getTime() + ((_a = date.offset) !== null && _a !== void 0 ? _a : 0), kind);
            return DateTime(d.getTime() - (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.dateOffset)(d), kind);
    }
}
function getTicks(date) {
    return (0,_Long_js__WEBPACK_IMPORTED_MODULE_0__.unixEpochMillisecondsToTicks)(date.getTime(), (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.dateOffset)(date));
}
function minValue() {
    // This is "0001-01-01T00:00:00.000Z", actual JS min value is -8640000000000000
    return DateTime(-62135596800000, 0 /* Unspecified */);
}
function maxValue() {
    // This is "9999-12-31T23:59:59.999Z", actual JS max value is 8640000000000000
    return DateTime(253402300799999, 0 /* Unspecified */);
}
function parseRaw(input) {
    if (input === null) {
        throw new Error("Value cannot be null when parsing DateTime");
    }
    if (input.trim() === "") {
        throw new Error("An empty string is not recognized as a valid DateTime");
    }
    let date = new Date(input);
    if (isNaN(date.getTime())) {
        // Try to check strings JS Date cannot parse (see #1045, #1422)
        // tslint:disable-next-line:max-line-length
        const m = /^\s*(\d+[^\w\s:]\d+[^\w\s:]\d+)?\s*(\d+:\d+(?::\d+(?:\.\d+)?)?)?\s*([AaPp][Mm])?\s*([+-]\d+(?::\d+)?)?\s*$/.exec(input);
        if (m != null) {
            let baseDate;
            let timeInSeconds = 0;
            if (m[2] != null) {
                const timeParts = m[2].split(":");
                timeInSeconds =
                    parseInt(timeParts[0], 10) * 3600 +
                        parseInt(timeParts[1] || "0", 10) * 60 +
                        parseFloat(timeParts[2] || "0");
                if (m[3] != null && m[3].toUpperCase() === "PM") {
                    timeInSeconds += 720;
                }
            }
            if (m[4] != null) { // There's an offset, parse as UTC
                if (m[1] != null) {
                    baseDate = new Date(m[1] + " UTC");
                }
                else {
                    const d = new Date();
                    baseDate = new Date(d.getUTCFullYear() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCDate());
                }
                const offsetParts = m[4].substr(1).split(":");
                let offsetInMinutes = parseInt(offsetParts[0], 10) * 60 + parseInt(offsetParts[1] || "0", 10);
                if (m[4][0] === "+") {
                    offsetInMinutes *= -1;
                }
                timeInSeconds += offsetInMinutes * 60;
            }
            else {
                if (m[1] != null) {
                    baseDate = new Date(m[1]);
                }
                else {
                    const d = new Date();
                    baseDate = new Date(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate());
                }
            }
            date = new Date(baseDate.getTime() + timeInSeconds * 1000);
            // correct for daylight savings time
            date = new Date(date.getTime() + (date.getTimezoneOffset() - baseDate.getTimezoneOffset()) * 60000);
        }
        else {
            throw new Error("The string is not a valid Date.");
        }
    }
    return date;
}
function parse(str, detectUTC = false) {
    const date = parseRaw(str);
    const offset = offsetRegex.exec(str);
    // .NET always parses DateTime as Local if there's offset info (even "Z")
    // Newtonsoft.Json uses UTC if the offset is "Z"
    const kind = offset != null
        ? (detectUTC && offset[0] === "Z" ? 1 /* UTC */ : 2 /* Local */)
        : 0 /* Unspecified */;
    return DateTime(date.getTime(), kind);
}
function tryParse(v, defValue) {
    try {
        defValue.contents = parse(v);
        return true;
    }
    catch (_err) {
        return false;
    }
}
function create(year, month, day, h = 0, m = 0, s = 0, ms = 0, kind) {
    const dateValue = kind === 1 /* UTC */
        ? Date.UTC(year, month - 1, day, h, m, s, ms)
        : new Date(year, month - 1, day, h, m, s, ms).getTime();
    if (isNaN(dateValue)) {
        throw new Error("The parameters describe an unrepresentable Date.");
    }
    const date = DateTime(dateValue, kind);
    if (year <= 99) {
        date.setFullYear(year, month - 1, day);
    }
    return date;
}
function now() {
    return DateTime(Date.now(), 2 /* Local */);
}
function utcNow() {
    return DateTime(Date.now(), 1 /* UTC */);
}
function today() {
    return date(now());
}
function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function daysInMonth(year, month) {
    return month === 2
        ? (isLeapYear(year) ? 29 : 28)
        : (month >= 8 ? (month % 2 === 0 ? 31 : 30) : (month % 2 === 0 ? 30 : 31));
}
function toUniversalTime(date) {
    return date.kind === 1 /* UTC */ ? date : DateTime(date.getTime(), 1 /* UTC */);
}
function toLocalTime(date) {
    return date.kind === 2 /* Local */ ? date : DateTime(date.getTime(), 2 /* Local */);
}
function specifyKind(d, kind) {
    return create(year(d), month(d), day(d), hour(d), minute(d), second(d), millisecond(d), kind);
}
function timeOfDay(d) {
    return hour(d) * 3600000
        + minute(d) * 60000
        + second(d) * 1000
        + millisecond(d);
}
function date(d) {
    return create(year(d), month(d), day(d), 0, 0, 0, 0, d.kind);
}
function day(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCDate() : d.getDate();
}
function hour(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCHours() : d.getHours();
}
function millisecond(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCMilliseconds() : d.getMilliseconds();
}
function minute(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCMinutes() : d.getMinutes();
}
function month(d) {
    return (d.kind === 1 /* UTC */ ? d.getUTCMonth() : d.getMonth()) + 1;
}
function second(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCSeconds() : d.getSeconds();
}
function year(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCFullYear() : d.getFullYear();
}
function dayOfWeek(d) {
    return d.kind === 1 /* UTC */ ? d.getUTCDay() : d.getDay();
}
function dayOfYear(d) {
    const _year = year(d);
    const _month = month(d);
    let _day = day(d);
    for (let i = 1; i < _month; i++) {
        _day += daysInMonth(_year, i);
    }
    return _day;
}
function add(d, ts) {
    const newDate = DateTime(d.getTime() + ts, d.kind);
    if (d.kind === 2 /* Local */) {
        const oldTzOffset = d.getTimezoneOffset();
        const newTzOffset = newDate.getTimezoneOffset();
        return oldTzOffset !== newTzOffset
            ? DateTime(newDate.getTime() + (newTzOffset - oldTzOffset) * 60000, d.kind)
            : newDate;
    }
    else {
        return newDate;
    }
}
function addDays(d, v) {
    return add(d, v * 86400000);
}
function addHours(d, v) {
    return add(d, v * 3600000);
}
function addMinutes(d, v) {
    return add(d, v * 60000);
}
function addSeconds(d, v) {
    return add(d, v * 1000);
}
function addMilliseconds(d, v) {
    return add(d, v);
}
function addYears(d, v) {
    const newMonth = month(d);
    const newYear = year(d) + v;
    const _daysInMonth = daysInMonth(newYear, newMonth);
    const newDay = Math.min(_daysInMonth, day(d));
    return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind);
}
function addMonths(d, v) {
    let newMonth = month(d) + v;
    let newMonth_ = 0;
    let yearOffset = 0;
    if (newMonth > 12) {
        newMonth_ = newMonth % 12;
        yearOffset = Math.floor(newMonth / 12);
        newMonth = newMonth_;
    }
    else if (newMonth < 1) {
        newMonth_ = 12 + newMonth % 12;
        yearOffset = Math.floor(newMonth / 12) + (newMonth_ === 12 ? -1 : 0);
        newMonth = newMonth_;
    }
    const newYear = year(d) + yearOffset;
    const _daysInMonth = daysInMonth(newYear, newMonth);
    const newDay = Math.min(_daysInMonth, day(d));
    return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind);
}
function subtract(d, that) {
    return typeof that === "number"
        ? add(d, -that)
        : d.getTime() - that.getTime();
}
function toLongDateString(d) {
    return d.toDateString();
}
function toShortDateString(d) {
    return d.toLocaleDateString();
}
function toLongTimeString(d) {
    return d.toLocaleTimeString();
}
function toShortTimeString(d) {
    return d.toLocaleTimeString().replace(/:\d\d(?!:)/, "");
}
function equals(d1, d2) {
    return d1.getTime() === d2.getTime();
}
const compare = _Util_js__WEBPACK_IMPORTED_MODULE_1__.compareDates;
const compareTo = _Util_js__WEBPACK_IMPORTED_MODULE_1__.compareDates;
function op_Addition(x, y) {
    return add(x, y);
}
function op_Subtraction(x, y) {
    return subtract(x, y);
}
function isDaylightSavingTime(x) {
    const jan = new Date(x.getFullYear(), 0, 1);
    const jul = new Date(x.getFullYear(), 6, 1);
    return isDST(jan.getTimezoneOffset(), jul.getTimezoneOffset(), x.getTimezoneOffset());
}
function isDST(janOffset, julOffset, tOffset) {
    return Math.min(janOffset, julOffset) === tOffset;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateTime);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "get_Zero": () => (/* binding */ get_Zero),
/* harmony export */   "get_One": () => (/* binding */ get_One),
/* harmony export */   "op_Addition": () => (/* binding */ op_Addition),
/* harmony export */   "op_Subtraction": () => (/* binding */ op_Subtraction),
/* harmony export */   "op_Multiply": () => (/* binding */ op_Multiply),
/* harmony export */   "op_Division": () => (/* binding */ op_Division),
/* harmony export */   "op_Modulus": () => (/* binding */ op_Modulus),
/* harmony export */   "op_UnaryNegation": () => (/* binding */ op_UnaryNegation),
/* harmony export */   "op_LeftShift": () => (/* binding */ op_LeftShift),
/* harmony export */   "op_RightShift": () => (/* binding */ op_RightShift),
/* harmony export */   "op_RightShiftUnsigned": () => (/* binding */ op_RightShiftUnsigned),
/* harmony export */   "op_BitwiseAnd": () => (/* binding */ op_BitwiseAnd),
/* harmony export */   "op_BitwiseOr": () => (/* binding */ op_BitwiseOr),
/* harmony export */   "op_ExclusiveOr": () => (/* binding */ op_ExclusiveOr),
/* harmony export */   "op_LogicalNot": () => (/* binding */ op_LogicalNot),
/* harmony export */   "op_LessThan": () => (/* binding */ op_LessThan),
/* harmony export */   "op_LessThanOrEqual": () => (/* binding */ op_LessThanOrEqual),
/* harmony export */   "op_GreaterThan": () => (/* binding */ op_GreaterThan),
/* harmony export */   "op_GreaterThanOrEqual": () => (/* binding */ op_GreaterThanOrEqual),
/* harmony export */   "op_Equality": () => (/* binding */ op_Equality),
/* harmony export */   "op_Inequality": () => (/* binding */ op_Inequality),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "fromInt": () => (/* binding */ fromInt),
/* harmony export */   "fromBits": () => (/* binding */ fromBits),
/* harmony export */   "fromBytes": () => (/* binding */ fromBytes),
/* harmony export */   "fromNumber": () => (/* binding */ fromNumber),
/* harmony export */   "fromString": () => (/* binding */ fromString),
/* harmony export */   "fromValue": () => (/* binding */ fromValue),
/* harmony export */   "toInt": () => (/* binding */ toInt),
/* harmony export */   "toBytes": () => (/* binding */ toBytes),
/* harmony export */   "toNumber": () => (/* binding */ toNumber),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "getLowBits": () => (/* binding */ getLowBits),
/* harmony export */   "getHighBits": () => (/* binding */ getHighBits),
/* harmony export */   "getLowBitsUnsigned": () => (/* binding */ getLowBitsUnsigned),
/* harmony export */   "getHighBitsUnsigned": () => (/* binding */ getHighBitsUnsigned),
/* harmony export */   "abs": () => (/* binding */ abs),
/* harmony export */   "fromInteger": () => (/* binding */ fromInteger),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "tryParse": () => (/* binding */ tryParse),
/* harmony export */   "unixEpochMillisecondsToTicks": () => (/* binding */ unixEpochMillisecondsToTicks),
/* harmony export */   "ticksToUnixEpochMilliseconds": () => (/* binding */ ticksToUnixEpochMilliseconds),
/* harmony export */   "makeRangeStepFunction": () => (/* binding */ makeRangeStepFunction)
/* harmony export */ });
/* harmony import */ var _Int32_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _lib_long_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_long_js__WEBPACK_IMPORTED_MODULE_1__.Long);
const get_Zero = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.ZERO;
const get_One = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.ONE;
const op_Addition = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.add;
const op_Subtraction = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.subtract;
const op_Multiply = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.multiply;
const op_Division = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.divide;
const op_Modulus = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.modulo;
const op_UnaryNegation = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.negate;
const op_LeftShift = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.shiftLeft;
const op_RightShift = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.shiftRight;
const op_RightShiftUnsigned = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.shiftRightUnsigned;
const op_BitwiseAnd = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.and;
const op_BitwiseOr = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.or;
const op_ExclusiveOr = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.xor;
const op_LogicalNot = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.not;
const op_LessThan = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.lessThan;
const op_LessThanOrEqual = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.lessThanOrEqual;
const op_GreaterThan = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.greaterThan;
const op_GreaterThanOrEqual = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.greaterThanOrEqual;
const op_Equality = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.equals;
const op_Inequality = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.notEquals;
const equals = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.equals;
const compare = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.compare;
const fromInt = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromInt;
const fromBits = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromBits;
const fromBytes = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromBytes;
const fromNumber = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromNumber;
const fromString = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromString;
const fromValue = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromValue;
const toInt = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.toInt;
const toBytes = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.toBytes;
const toNumber = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.toNumber;
const toString = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.toString;
const getLowBits = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.getLowBits;
const getHighBits = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.getHighBits;
const getLowBitsUnsigned = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.getLowBitsUnsigned;
const getHighBitsUnsigned = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.getHighBitsUnsigned;
function getMaxValue(unsigned, radix, isNegative) {
    switch (radix) {
        case 2: return unsigned ?
            "1111111111111111111111111111111111111111111111111111111111111111" :
            (isNegative ? "1000000000000000000000000000000000000000000000000000000000000000"
                : "111111111111111111111111111111111111111111111111111111111111111");
        case 8: return unsigned ?
            "1777777777777777777777" :
            (isNegative ? "1000000000000000000000" : "777777777777777777777");
        case 10: return unsigned ?
            "18446744073709551615" :
            (isNegative ? "9223372036854775808" : "9223372036854775807");
        case 16: return unsigned ?
            "FFFFFFFFFFFFFFFF" :
            (isNegative ? "8000000000000000" : "7FFFFFFFFFFFFFFF");
        default: throw new Error("Invalid radix.");
    }
}
function abs(x) {
    if (!x.unsigned && _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.isNegative(x)) {
        return op_UnaryNegation(x);
    }
    else {
        return x;
    }
}
function fromInteger(value, unsigned, kind) {
    let x = value;
    let xh = 0;
    switch (kind) {
        case 0:
            x = value << 24 >> 24;
            xh = x;
            break;
        case 4:
            x = value << 24 >>> 24;
            break;
        case 1:
            x = value << 16 >> 16;
            xh = x;
            break;
        case 5:
            x = value << 16 >>> 16;
            break;
        case 2:
            x = value >> 0;
            xh = x;
            break;
        case 6:
            x = value >>> 0;
            break;
    }
    return _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromBits(x, xh >> 31, unsigned);
}
function parse(str, style, unsigned, _bitsize, radix) {
    const res = (0,_Int32_js__WEBPACK_IMPORTED_MODULE_0__.isValid)(str, style, radix);
    if (res != null) {
        const lessOrEqual = (x, y) => {
            const len = Math.max(x.length, y.length);
            return x.padStart(len, "0") <= y.padStart(len, "0");
        };
        const isNegative = res.sign === "-";
        const maxValue = getMaxValue(unsigned || res.radix !== 10, res.radix, isNegative);
        if (lessOrEqual(res.digits.toUpperCase(), maxValue)) {
            str = isNegative ? res.sign + res.digits : res.digits;
            return _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromString(str, unsigned, res.radix);
        }
    }
    throw new Error("Input string was not in a correct format.");
}
function tryParse(str, style, unsigned, bitsize, defValue) {
    try {
        defValue.contents = parse(str, style, unsigned, bitsize);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function unixEpochMillisecondsToTicks(ms, offset) {
    return op_Multiply(op_Addition(op_Addition(_lib_long_js__WEBPACK_IMPORTED_MODULE_1__.fromNumber(ms), 62135596800000), offset), 10000);
}
function ticksToUnixEpochMilliseconds(ticks) {
    return _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.toNumber(op_Subtraction(op_Division(ticks, 10000), 62135596800000));
}
function makeRangeStepFunction(step, last, unsigned) {
    const stepComparedWithZero = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.compare(step, unsigned ? _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.UZERO : _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.ZERO);
    if (stepComparedWithZero === 0) {
        throw new Error("The step of a range cannot be zero");
    }
    const stepGreaterThanZero = stepComparedWithZero > 0;
    return (x) => {
        const comparedWithLast = _lib_long_js__WEBPACK_IMPORTED_MODULE_1__.compare(x, last);
        if ((stepGreaterThanZero && comparedWithLast <= 0)
            || (!stepGreaterThanZero && comparedWithLast >= 0)) {
            return [x, op_Addition(x, step)];
        }
        else {
            return undefined;
        }
    };
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NumberStyles": () => (/* binding */ NumberStyles),
/* harmony export */   "isValid": () => (/* binding */ isValid),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "tryParse": () => (/* binding */ tryParse),
/* harmony export */   "op_UnaryNegation_Int8": () => (/* binding */ op_UnaryNegation_Int8),
/* harmony export */   "op_UnaryNegation_Int16": () => (/* binding */ op_UnaryNegation_Int16),
/* harmony export */   "op_UnaryNegation_Int32": () => (/* binding */ op_UnaryNegation_Int32)
/* harmony export */ });
// export type decimal = Decimal;
var NumberStyles;
(function (NumberStyles) {
    // None = 0x00000000,
    // AllowLeadingWhite = 0x00000001,
    // AllowTrailingWhite = 0x00000002,
    // AllowLeadingSign = 0x00000004,
    // AllowTrailingSign = 0x00000008,
    // AllowParentheses = 0x00000010,
    // AllowDecimalPoint = 0x00000020,
    // AllowThousands = 0x00000040,
    // AllowExponent = 0x00000080,
    // AllowCurrencySymbol = 0x00000100,
    NumberStyles[NumberStyles["AllowHexSpecifier"] = 512] = "AllowHexSpecifier";
    // Integer = AllowLeadingWhite | AllowTrailingWhite | AllowLeadingSign,
    // HexNumber = AllowLeadingWhite | AllowTrailingWhite | AllowHexSpecifier,
    // Number = AllowLeadingWhite | AllowTrailingWhite | AllowLeadingSign |
    //          AllowTrailingSign | AllowDecimalPoint | AllowThousands,
    // Float = AllowLeadingWhite | AllowTrailingWhite | AllowLeadingSign |
    //         AllowDecimalPoint | AllowExponent,
    // Currency = AllowLeadingWhite | AllowTrailingWhite | AllowLeadingSign | AllowTrailingSign |
    //            AllowParentheses | AllowDecimalPoint | AllowThousands | AllowCurrencySymbol,
    // Any = AllowLeadingWhite | AllowTrailingWhite | AllowLeadingSign | AllowTrailingSign |
    //       AllowParentheses | AllowDecimalPoint | AllowThousands | AllowCurrencySymbol | AllowExponent,
})(NumberStyles || (NumberStyles = {}));
function validResponse(regexMatch, radix) {
    const [/*all*/ , sign, prefix, digits] = regexMatch;
    return {
        sign: sign || "",
        prefix: prefix || "",
        digits,
        radix,
    };
}
function getRange(unsigned, bitsize) {
    switch (bitsize) {
        case 8: return unsigned ? [0, 255] : [-128, 127];
        case 16: return unsigned ? [0, 65535] : [-32768, 32767];
        case 32: return unsigned ? [0, 4294967295] : [-2147483648, 2147483647];
        default: throw new Error("Invalid bit size.");
    }
}
function getInvalidDigits(radix) {
    switch (radix) {
        case 2: return /[^0-1]/;
        case 8: return /[^0-7]/;
        case 10: return /[^0-9]/;
        case 16: return /[^0-9a-fA-F]/;
        default:
            throw new Error("Invalid Base.");
    }
}
function getRadix(prefix, style) {
    if (style & NumberStyles.AllowHexSpecifier) {
        return 16;
    }
    else {
        switch (prefix) {
            case "0b":
            case "0B": return 2;
            case "0o":
            case "0O": return 8;
            case "0x":
            case "0X": return 16;
            default: return 10;
        }
    }
}
function isValid(str, style, radix) {
    const integerRegex = /^\s*([\+\-])?(0[xXoObB])?([0-9a-fA-F]+)\s*$/;
    const res = integerRegex.exec(str.replace(/_/g, ""));
    if (res != null) {
        const [/*all*/ , /*sign*/ , prefix, digits] = res;
        radix = radix || getRadix(prefix, style);
        const invalidDigits = getInvalidDigits(radix);
        if (!invalidDigits.test(digits)) {
            return validResponse(res, radix);
        }
    }
    return null;
}
function parse(str, style, unsigned, bitsize, radix) {
    const res = isValid(str, style, radix);
    if (res != null) {
        let v = Number.parseInt(res.sign + res.digits, res.radix);
        if (!Number.isNaN(v)) {
            const [umin, umax] = getRange(true, bitsize);
            if (!unsigned && res.radix !== 10 && v >= umin && v <= umax) {
                v = v << (32 - bitsize) >> (32 - bitsize);
            }
            const [min, max] = getRange(unsigned, bitsize);
            if (v >= min && v <= max) {
                return v;
            }
        }
    }
    throw new Error("Input string was not in a correct format.");
}
function tryParse(str, style, unsigned, bitsize, defValue) {
    try {
        defValue.contents = parse(str, style, unsigned, bitsize);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function op_UnaryNegation_Int8(x) {
    return x === -128 ? x : -x;
}
function op_UnaryNegation_Int16(x) {
    return x === -32768 ? x : -x;
}
function op_UnaryNegation_Int32(x) {
    return x === -2147483648 ? x : -x;
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Long": () => (/* binding */ Long),
/* harmony export */   "isLong": () => (/* binding */ isLong),
/* harmony export */   "fromInt": () => (/* binding */ fromInt),
/* harmony export */   "fromNumber": () => (/* binding */ fromNumber),
/* harmony export */   "fromBits": () => (/* binding */ fromBits),
/* harmony export */   "fromString": () => (/* binding */ fromString),
/* harmony export */   "fromValue": () => (/* binding */ fromValue),
/* harmony export */   "ZERO": () => (/* binding */ ZERO),
/* harmony export */   "UZERO": () => (/* binding */ UZERO),
/* harmony export */   "ONE": () => (/* binding */ ONE),
/* harmony export */   "UONE": () => (/* binding */ UONE),
/* harmony export */   "NEG_ONE": () => (/* binding */ NEG_ONE),
/* harmony export */   "MAX_VALUE": () => (/* binding */ MAX_VALUE),
/* harmony export */   "MAX_UNSIGNED_VALUE": () => (/* binding */ MAX_UNSIGNED_VALUE),
/* harmony export */   "MIN_VALUE": () => (/* binding */ MIN_VALUE),
/* harmony export */   "toInt": () => (/* binding */ toInt),
/* harmony export */   "toNumber": () => (/* binding */ toNumber),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "getHighBits": () => (/* binding */ getHighBits),
/* harmony export */   "getHighBitsUnsigned": () => (/* binding */ getHighBitsUnsigned),
/* harmony export */   "getLowBits": () => (/* binding */ getLowBits),
/* harmony export */   "getLowBitsUnsigned": () => (/* binding */ getLowBitsUnsigned),
/* harmony export */   "getNumBitsAbs": () => (/* binding */ getNumBitsAbs),
/* harmony export */   "isZero": () => (/* binding */ isZero),
/* harmony export */   "isNegative": () => (/* binding */ isNegative),
/* harmony export */   "isPositive": () => (/* binding */ isPositive),
/* harmony export */   "isOdd": () => (/* binding */ isOdd),
/* harmony export */   "isEven": () => (/* binding */ isEven),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "notEquals": () => (/* binding */ notEquals),
/* harmony export */   "lessThan": () => (/* binding */ lessThan),
/* harmony export */   "lessThanOrEqual": () => (/* binding */ lessThanOrEqual),
/* harmony export */   "greaterThan": () => (/* binding */ greaterThan),
/* harmony export */   "greaterThanOrEqual": () => (/* binding */ greaterThanOrEqual),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "modulo": () => (/* binding */ modulo),
/* harmony export */   "not": () => (/* binding */ not),
/* harmony export */   "and": () => (/* binding */ and),
/* harmony export */   "or": () => (/* binding */ or),
/* harmony export */   "xor": () => (/* binding */ xor),
/* harmony export */   "shiftLeft": () => (/* binding */ shiftLeft),
/* harmony export */   "shiftRight": () => (/* binding */ shiftRight),
/* harmony export */   "shiftRightUnsigned": () => (/* binding */ shiftRightUnsigned),
/* harmony export */   "rotateLeft": () => (/* binding */ rotateLeft),
/* harmony export */   "rotateRight": () => (/* binding */ rotateRight),
/* harmony export */   "toSigned": () => (/* binding */ toSigned),
/* harmony export */   "toUnsigned": () => (/* binding */ toUnsigned),
/* harmony export */   "toBytes": () => (/* binding */ toBytes),
/* harmony export */   "toBytesLE": () => (/* binding */ toBytesLE),
/* harmony export */   "toBytesBE": () => (/* binding */ toBytesBE),
/* harmony export */   "fromBytes": () => (/* binding */ fromBytes),
/* harmony export */   "fromBytesLE": () => (/* binding */ fromBytesLE),
/* harmony export */   "fromBytesBE": () => (/* binding */ fromBytesBE)
/* harmony export */ });
/* harmony import */ var _Numeric_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
// Adapted from: https://github.com/dcodeIO/long.js/blob/master/src/long.js
// Apache License 2.0: https://github.com/dcodeIO/long.js/blob/master/LICENSE
/* tslint:disable */

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;
try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
    ])), {}).exports;
}
catch (e) {
    // no wasm support :(
}
/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {
    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;
    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;
    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}
Long.prototype.GetHashCode = function () {
    let h1 = this.unsigned ? 1 : 0;
    h1 = ((h1 << 5) + h1) ^ this.high;
    h1 = ((h1 << 5) + h1) ^ this.low;
    return h1;
};
Long.prototype.Equals = function (x) { return equals(this, x); };
Long.prototype.CompareTo = function (x) { return compare(this, x); };
Long.prototype.toString = function (radix) { return toString(this, radix); };
Long.prototype.toJSON = function () { return toString(this); };
Long.prototype[_Numeric_js__WEBPACK_IMPORTED_MODULE_0__.symbol] = function () {
    const x = this;
    return {
        multiply: y => multiply(x, y),
        toPrecision: sd => String(x) + (0).toPrecision(sd).substr(1),
        toExponential: dp => String(x) + (0).toExponential(dp).substr(1),
        toFixed: dp => String(x) + (0).toFixed(dp).substr(1),
        toHex: () => toString(x.unsigned ? x : fromBytes(toBytes(x), true), 16),
    };
};
// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.
/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });
/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}
/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
// Long.isLong = isLong;
/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};
/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};
/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    }
    else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}
/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
// Long.fromInt = fromInt;
/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    }
    else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return negate(fromNumber(-value, unsigned));
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}
/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
// Long.fromNumber = fromNumber;
/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}
/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
// Long.fromBits = fromBits;
/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)
/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
            unsigned = false;
    }
    else {
        unsigned = !!unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    var p = str.indexOf('-');
    if (p > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return negate(fromString(str.substring(1), unsigned, radix));
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));
    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = add(multiply(result, power), fromNumber(value));
        }
        else {
            result = multiply(result, radixToPower);
            result = add(result, fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}
/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
// Long.fromString = fromString;
/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}
/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
// Long.fromValue = fromValue;
// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.
/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;
/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;
/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);
/**
 * Signed zero.
 * @type {!Long}
 */
// Long.ZERO = ZERO;
/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);
/**
 * Unsigned zero.
 * @type {!Long}
 */
// Long.UZERO = UZERO;
/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);
/**
 * Signed one.
 * @type {!Long}
 */
// Long.ONE = ONE;
/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);
/**
 * Unsigned one.
 * @type {!Long}
 */
// Long.UONE = UONE;
/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);
/**
 * Signed negative one.
 * @type {!Long}
 */
// Long.NEG_ONE = NEG_ONE;
/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
/**
 * Maximum signed value.
 * @type {!Long}
 */
// Long.MAX_VALUE = MAX_VALUE;
/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
/**
 * Maximum unsigned value.
 * @type {!Long}
 */
// Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);
/**
 * Minimum signed value.
 * @type {!Long}
 */
// Long.MIN_VALUE = MIN_VALUE;
/**
 * @alias Long.prototype
 * @inner
 */
// var LongPrototype = Long.prototype;
/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @this {!Long}
 * @returns {number}
 */
function toInt($this) {
    return $this.unsigned ? $this.low >>> 0 : $this.low;
}
;
/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @this {!Long}
 * @returns {number}
 */
function toNumber($this) {
    if ($this.unsigned)
        return (($this.high >>> 0) * TWO_PWR_32_DBL) + ($this.low >>> 0);
    return $this.high * TWO_PWR_32_DBL + ($this.low >>> 0);
}
;
/**
 * Converts the Long to a string written in the specified radix.
 * @this {!Long}
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
function toString($this, radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (isZero($this))
        return '0';
    if (isNegative($this)) { // Unsigned Longs are never negative
        if (equals($this, MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix), div = divide($this, radixLong), rem1 = subtract(multiply(div, radixLong), $this);
            return toString(div, radix) + toInt(rem1).toString(radix);
        }
        else
            return '-' + toString(negate($this), radix);
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), $this.unsigned), rem = $this;
    var result = '';
    while (true) {
        var remDiv = divide(rem, radixToPower), intval = toInt(subtract(rem, multiply(remDiv, radixToPower))) >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (isZero(rem))
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
}
;
/**
 * Gets the high 32 bits as a signed integer.
 * @this {!Long}
 * @returns {number} Signed high bits
 */
function getHighBits($this) {
    return $this.high;
}
;
/**
 * Gets the high 32 bits as an unsigned integer.
 * @this {!Long}
 * @returns {number} Unsigned high bits
 */
function getHighBitsUnsigned($this) {
    return $this.high >>> 0;
}
;
/**
 * Gets the low 32 bits as a signed integer.
 * @this {!Long}
 * @returns {number} Signed low bits
 */
function getLowBits($this) {
    return $this.low;
}
;
/**
 * Gets the low 32 bits as an unsigned integer.
 * @this {!Long}
 * @returns {number} Unsigned low bits
 */
function getLowBitsUnsigned($this) {
    return $this.low >>> 0;
}
;
/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @this {!Long}
 * @returns {number}
 */
function getNumBitsAbs($this) {
    if (isNegative($this)) // Unsigned Longs are never negative
        return equals($this, MIN_VALUE) ? 64 : getNumBitsAbs(negate($this));
    var val = $this.high != 0 ? $this.high : $this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return $this.high != 0 ? bit + 33 : bit + 1;
}
;
/**
 * Tests if this Long's value equals zero.
 * @this {!Long}
 * @returns {boolean}
 */
function isZero($this) {
    return $this.high === 0 && $this.low === 0;
}
;
/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
// LongPrototype.eqz = LongPrototype.isZero;
/**
 * Tests if this Long's value is negative.
 * @this {!Long}
 * @returns {boolean}
 */
function isNegative($this) {
    return !$this.unsigned && $this.high < 0;
}
;
/**
 * Tests if this Long's value is positive.
 * @this {!Long}
 * @returns {boolean}
 */
function isPositive($this) {
    return $this.unsigned || $this.high >= 0;
}
;
/**
 * Tests if this Long's value is odd.
 * @this {!Long}
 * @returns {boolean}
 */
function isOdd($this) {
    return ($this.low & 1) === 1;
}
;
/**
 * Tests if this Long's value is even.
 * @this {!Long}
 * @returns {boolean}
 */
function isEven($this) {
    return ($this.low & 1) === 0;
}
;
/**
 * Tests if this Long's value equals the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function equals($this, other) {
    if (!isLong(other))
        other = fromValue(other);
    if ($this.unsigned !== other.unsigned && ($this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return $this.high === other.high && $this.low === other.low;
}
;
/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.eq = LongPrototype.equals;
/**
 * Tests if this Long's value differs from the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function notEquals($this, other) {
    return !equals($this, /* validates */ other);
}
;
/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.neq = LongPrototype.notEquals;
/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.ne = LongPrototype.notEquals;
/**
 * Tests if this Long's value is less than the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function lessThan($this, other) {
    return compare($this, /* validates */ other) < 0;
}
;
/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.lt = LongPrototype.lessThan;
/**
 * Tests if this Long's value is less than or equal the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function lessThanOrEqual($this, other) {
    return compare($this, /* validates */ other) <= 0;
}
;
/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.lte = LongPrototype.lessThanOrEqual;
/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.le = LongPrototype.lessThanOrEqual;
/**
 * Tests if this Long's value is greater than the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function greaterThan($this, other) {
    return compare($this, /* validates */ other) > 0;
}
;
/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.gt = LongPrototype.greaterThan;
/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
function greaterThanOrEqual($this, other) {
    return compare($this, /* validates */ other) >= 0;
}
;
/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.gte = LongPrototype.greaterThanOrEqual;
/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
// LongPrototype.ge = LongPrototype.greaterThanOrEqual;
/**
 * Compares this Long's value with the specified's.
 * @this {!Long}
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
function compare($this, other) {
    if (!isLong(other))
        other = fromValue(other);
    if (equals($this, other))
        return 0;
    var thisNeg = isNegative($this), otherNeg = isNegative(other);
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!$this.unsigned)
        return isNegative(subtract($this, other)) ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > ($this.high >>> 0) || (other.high === $this.high && (other.low >>> 0) > ($this.low >>> 0)) ? -1 : 1;
}
;
/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
// LongPrototype.comp = LongPrototype.compare;
/**
 * Negates this Long's value.
 * @this {!Long}
 * @returns {!Long} Negated Long
 */
function negate($this) {
    if (!$this.unsigned && equals($this, MIN_VALUE))
        return MIN_VALUE;
    return add(not($this), ONE);
}
;
/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
// LongPrototype.neg = LongPrototype.negate;
/**
 * Returns the sum of this and the specified Long.
 * @this {!Long}
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
function add($this, addend) {
    if (!isLong(addend))
        addend = fromValue(addend);
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = $this.high >>> 16;
    var a32 = $this.high & 0xFFFF;
    var a16 = $this.low >>> 16;
    var a00 = $this.low & 0xFFFF;
    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, $this.unsigned);
}
;
/**
 * Returns the difference of this and the specified Long.
 * @this {!Long}
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
function subtract($this, subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return add($this, negate(subtrahend));
}
;
/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
// LongPrototype.sub = LongPrototype.subtract;
/**
 * Returns the product of this and the specified Long.
 * @this {!Long}
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
function multiply($this, multiplier) {
    if (isZero($this))
        return $this.unsigned ? UZERO : ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
    // use wasm support if present
    if (wasm) {
        var low = wasm.mul($this.low, $this.high, multiplier.low, multiplier.high);
        return fromBits(low, wasm.get_high(), $this.unsigned);
    }
    if (isZero(multiplier))
        return $this.unsigned ? UZERO : ZERO;
    if (equals($this, MIN_VALUE))
        return isOdd(multiplier) ? MIN_VALUE : ZERO;
    if (equals(multiplier, MIN_VALUE))
        return isOdd($this) ? MIN_VALUE : ZERO;
    if (isNegative($this)) {
        if (isNegative(multiplier))
            return multiply(negate($this), negate(multiplier));
        else
            return negate(multiply(negate($this), multiplier));
    }
    else if (isNegative(multiplier))
        return negate(multiply($this, negate(multiplier)));
    // If both longs are small, use float multiplication
    if (lessThan($this, TWO_PWR_24) && lessThan(multiplier, TWO_PWR_24))
        return fromNumber(toNumber($this) * toNumber(multiplier), $this.unsigned);
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = $this.high >>> 16;
    var a32 = $this.high & 0xFFFF;
    var a16 = $this.low >>> 16;
    var a00 = $this.low & 0xFFFF;
    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, $this.unsigned);
}
;
/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
// LongPrototype.mul = LongPrototype.multiply;
/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @this {!Long}
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
function divide($this, divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (isZero(divisor))
        throw Error('division by zero');
    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!$this.unsigned &&
            $this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return $this;
        }
        var low = ($this.unsigned ? wasm.div_u : wasm.div_s)($this.low, $this.high, divisor.low, divisor.high);
        return fromBits(low, wasm.get_high(), $this.unsigned);
    }
    if (isZero($this))
        return $this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!$this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (equals($this, MIN_VALUE)) {
            if (equals(divisor, ONE) || equals(divisor, NEG_ONE))
                return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
            else if (equals(divisor, MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = shiftRight($this, 1);
                approx = shiftLeft(divide(halfThis, divisor), 1);
                if (equals(approx, ZERO)) {
                    return isNegative(divisor) ? ONE : NEG_ONE;
                }
                else {
                    rem = subtract($this, multiply(divisor, approx));
                    res = add(approx, divide(rem, divisor));
                    return res;
                }
            }
        }
        else if (equals(divisor, MIN_VALUE))
            return $this.unsigned ? UZERO : ZERO;
        if (isNegative($this)) {
            if (isNegative(divisor))
                return divide(negate($this), negate(divisor));
            return negate(divide(negate($this), divisor));
        }
        else if (isNegative(divisor))
            return negate(divide($this, negate(divisor)));
        res = ZERO;
    }
    else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = toUnsigned(divisor);
        if (greaterThan(divisor, $this))
            return UZERO;
        if (greaterThan(divisor, shiftRightUnsigned($this, 1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = $this;
    while (greaterThanOrEqual(rem, divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(toNumber(rem) / toNumber(divisor)));
        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48), 
        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
        approxRes = fromNumber(approx), approxRem = multiply(approxRes, divisor);
        while (isNegative(approxRem) || greaterThan(approxRem, rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, $this.unsigned);
            approxRem = multiply(approxRes, divisor);
        }
        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (isZero(approxRes))
            approxRes = ONE;
        res = add(res, approxRes);
        rem = subtract(rem, approxRem);
    }
    return res;
}
;
/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
// LongPrototype.div = LongPrototype.divide;
/**
 * Returns this Long modulo the specified.
 * @this {!Long}
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
function modulo($this, divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    // use wasm support if present
    if (wasm) {
        var low = ($this.unsigned ? wasm.rem_u : wasm.rem_s)($this.low, $this.high, divisor.low, divisor.high);
        return fromBits(low, wasm.get_high(), $this.unsigned);
    }
    return subtract($this, multiply(divide($this, divisor), divisor));
}
;
/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
// LongPrototype.mod = LongPrototype.modulo;
/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
// LongPrototype.rem = LongPrototype.modulo;
/**
 * Returns the bitwise NOT of this Long.
 * @this {!Long}
 * @returns {!Long}
 */
function not($this) {
    return fromBits(~$this.low, ~$this.high, $this.unsigned);
}
;
/**
 * Returns the bitwise AND of this Long and the specified.
 * @this {!Long}
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
function and($this, other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits($this.low & other.low, $this.high & other.high, $this.unsigned);
}
;
/**
 * Returns the bitwise OR of this Long and the specified.
 * @this {!Long}
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
function or($this, other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits($this.low | other.low, $this.high | other.high, $this.unsigned);
}
;
/**
 * Returns the bitwise XOR of this Long and the given one.
 * @this {!Long}
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
function xor($this, other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits($this.low ^ other.low, $this.high ^ other.high, $this.unsigned);
}
;
/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @this {!Long}
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
function shiftLeft($this, numBits) {
    if (isLong(numBits))
        numBits = toInt(numBits);
    if ((numBits &= 63) === 0)
        return $this;
    else if (numBits < 32)
        return fromBits($this.low << numBits, ($this.high << numBits) | ($this.low >>> (32 - numBits)), $this.unsigned);
    else
        return fromBits(0, $this.low << (numBits - 32), $this.unsigned);
}
;
/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
// LongPrototype.shl = LongPrototype.shiftLeft;
/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @this {!Long}
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
function shiftRight($this, numBits) {
    if (isLong(numBits))
        numBits = toInt(numBits);
    if ((numBits &= 63) === 0)
        return $this;
    else if (numBits < 32)
        return fromBits(($this.low >>> numBits) | ($this.high << (32 - numBits)), $this.high >> numBits, $this.unsigned);
    else
        return fromBits($this.high >> (numBits - 32), $this.high >= 0 ? 0 : -1, $this.unsigned);
}
;
/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
// LongPrototype.shr = LongPrototype.shiftRight;
/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @this {!Long}
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
function shiftRightUnsigned($this, numBits) {
    if (isLong(numBits))
        numBits = toInt(numBits);
    numBits &= 63;
    if (numBits === 0)
        return $this;
    else {
        var high = $this.high;
        if (numBits < 32) {
            var low = $this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, $this.unsigned);
        }
        else if (numBits === 32)
            return fromBits(high, 0, $this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, $this.unsigned);
    }
}
;
/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
// LongPrototype.shru = LongPrototype.shiftRightUnsigned;
/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
// LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
/**
 * Returns this Long with bits rotated to the left by the given amount.
 * @this {!Long}
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Rotated Long
 */
const rotateLeft = function rotateLeft(numBits) {
    var b;
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    if (numBits === 32)
        return fromBits(this.high, this.low, this.unsigned);
    if (numBits < 32) {
        b = (32 - numBits);
        return fromBits(((this.low << numBits) | (this.high >>> b)), ((this.high << numBits) | (this.low >>> b)), this.unsigned);
    }
    numBits -= 32;
    b = (32 - numBits);
    return fromBits(((this.high << numBits) | (this.low >>> b)), ((this.low << numBits) | (this.high >>> b)), this.unsigned);
};
/**
 * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Rotated Long
 */
// LongPrototype.rotl = LongPrototype.rotateLeft;
/**
 * Returns this Long with bits rotated to the right by the given amount.
 * @this {!Long}
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Rotated Long
 */
const rotateRight = function rotateRight(numBits) {
    var b;
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    if (numBits === 32)
        return fromBits(this.high, this.low, this.unsigned);
    if (numBits < 32) {
        b = (32 - numBits);
        return fromBits(((this.high << b) | (this.low >>> numBits)), ((this.low << b) | (this.high >>> numBits)), this.unsigned);
    }
    numBits -= 32;
    b = (32 - numBits);
    return fromBits(((this.low << b) | (this.high >>> numBits)), ((this.high << b) | (this.low >>> numBits)), this.unsigned);
};
/**
 * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Rotated Long
 */
// LongPrototype.rotr = LongPrototype.rotateRight;
/**
 * Converts this Long to signed.
 * @this {!Long}
 * @returns {!Long} Signed long
 */
function toSigned($this) {
    if (!$this.unsigned)
        return $this;
    return fromBits($this.low, $this.high, false);
}
;
/**
 * Converts this Long to unsigned.
 * @this {!Long}
 * @returns {!Long} Unsigned long
 */
function toUnsigned($this) {
    if ($this.unsigned)
        return $this;
    return fromBits($this.low, $this.high, true);
}
;
/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @this {!Long}
 * @returns {!Array.<number>} Byte representation
 */
function toBytes($this, le) {
    return le ? toBytesLE($this) : toBytesBE($this);
}
;
/**
 * Converts this Long to its little endian byte representation.
 * @this {!Long}
 * @returns {!Array.<number>} Little endian byte representation
 */
function toBytesLE($this) {
    var hi = $this.high, lo = $this.low;
    return [
        lo & 0xff,
        lo >>> 8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24,
        hi & 0xff,
        hi >>> 8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
}
;
/**
 * Converts this Long to its big endian byte representation.
 * @this {!Long}
 * @returns {!Array.<number>} Big endian byte representation
 */
function toBytesBE($this) {
    var hi = $this.high, lo = $this.low;
    return [
        hi >>> 24,
        hi >>> 16 & 0xff,
        hi >>> 8 & 0xff,
        hi & 0xff,
        lo >>> 24,
        lo >>> 16 & 0xff,
        lo >>> 8 & 0xff,
        lo & 0xff
    ];
}
;
/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
function fromBytes(bytes, unsigned, le) {
    return le ? fromBytesLE(bytes, unsigned) : fromBytesBE(bytes, unsigned);
}
;
/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
function fromBytesLE(bytes, unsigned) {
    return new Long(bytes[0] |
        bytes[1] << 8 |
        bytes[2] << 16 |
        bytes[3] << 24, bytes[4] |
        bytes[5] << 8 |
        bytes[6] << 16 |
        bytes[7] << 24, unsigned);
}
;
/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
function fromBytesBE(bytes, unsigned) {
    return new Long(bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] << 8 |
        bytes[7], bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] << 8 |
        bytes[3], unsigned);
}
;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "symbol": () => (/* binding */ symbol),
/* harmony export */   "isNumeric": () => (/* binding */ isNumeric),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "toFixed": () => (/* binding */ toFixed),
/* harmony export */   "toPrecision": () => (/* binding */ toPrecision),
/* harmony export */   "toExponential": () => (/* binding */ toExponential),
/* harmony export */   "toHex": () => (/* binding */ toHex)
/* harmony export */ });
const symbol = Symbol("numeric");
function isNumeric(x) {
    return typeof x === "number" || (x === null || x === void 0 ? void 0 : x[symbol]);
}
function compare(x, y) {
    if (typeof x === "number") {
        return x < y ? -1 : (x > y ? 1 : 0);
    }
    else {
        return x.CompareTo(y);
    }
}
function multiply(x, y) {
    if (typeof x === "number") {
        return x * y;
    }
    else {
        return x[symbol]().multiply(y);
    }
}
function toFixed(x, dp) {
    if (typeof x === "number") {
        return x.toFixed(dp);
    }
    else {
        return x[symbol]().toFixed(dp);
    }
}
function toPrecision(x, sd) {
    if (typeof x === "number") {
        return x.toPrecision(sd);
    }
    else {
        return x[symbol]().toPrecision(sd);
    }
}
function toExponential(x, dp) {
    if (typeof x === "number") {
        return x.toExponential(dp);
    }
    else {
        return x[symbol]().toExponential(dp);
    }
}
function toHex(x) {
    if (typeof x === "number") {
        return (Number(x) >>> 0).toString(16);
    }
    else {
        return x[symbol]().toHex();
    }
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "escape": () => (/* binding */ escape),
/* harmony export */   "unescape": () => (/* binding */ unescape),
/* harmony export */   "isMatch": () => (/* binding */ isMatch),
/* harmony export */   "match": () => (/* binding */ match),
/* harmony export */   "matches": () => (/* binding */ matches),
/* harmony export */   "options": () => (/* binding */ options),
/* harmony export */   "replace": () => (/* binding */ replace),
/* harmony export */   "split": () => (/* binding */ split)
/* harmony export */ });
function create(pattern, options = 0) {
    // Supported RegexOptions
    // * IgnoreCase:  0x0001
    // * Multiline:   0x0002
    // * Singleline:  0x0010
    // * ECMAScript:  0x0100 (ignored)
    if ((options & ~(1 ^ 2 ^ 16 ^ 256)) !== 0) {
        throw new Error("RegexOptions only supports: IgnoreCase, Multiline, Singleline and ECMAScript");
    }
    let flags = "g";
    flags += options & 1 ? "i" : ""; // 0x0001 RegexOptions.IgnoreCase
    flags += options & 2 ? "m" : "";
    flags += options & 16 ? "s" : "";
    return new RegExp(pattern, flags);
}
// From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function unescape(str) {
    return str.replace(/\\([\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|])/g, "$1");
}
function isMatch(str, pattern, options = 0) {
    let reg;
    reg = str instanceof RegExp
        ? (reg = str, str = pattern, reg.lastIndex = options, reg)
        : reg = create(pattern, options);
    return reg.test(str);
}
function match(str, pattern, options = 0) {
    let reg;
    reg = str instanceof RegExp
        ? (reg = str, str = pattern, reg.lastIndex = options, reg)
        : reg = create(pattern, options);
    return reg.exec(str);
}
function matches(str, pattern, options = 0) {
    let reg;
    reg = str instanceof RegExp
        ? (reg = str, str = pattern, reg.lastIndex = options, reg)
        : reg = create(pattern, options);
    if (!reg.global) {
        throw new Error("Non-global RegExp"); // Prevent infinite loop
    }
    let m = reg.exec(str);
    const matches = [];
    while (m !== null) {
        matches.push(m);
        m = reg.exec(str);
    }
    return matches;
}
function options(reg) {
    let options = 256; // ECMAScript
    options |= reg.ignoreCase ? 1 : 0;
    options |= reg.multiline ? 2 : 0;
    return options;
}
function replace(reg, input, replacement, limit, offset = 0) {
    function replacer() {
        let res = arguments[0];
        if (limit) {
            limit--;
            const match = [];
            const len = arguments.length;
            // arguments: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
            // * match: matched substring
            // * p1, p2, ...: nth capture group string
            // * offset: offset of matched substring
            // * string: whole string examined
            // * groups: named capturing groups
            //           ONLY if regex contains a named capture group AND browser supports named groups
            // -> last element can be groups OR input string
            // -> check if last element is string
            const withGroups = typeof arguments[len - 1] !== "string";
            let pLast = withGroups ? len - 3 : len - 2;
            for (let i = 0; i < pLast; i++) {
                match.push(arguments[i]);
            }
            match.index = arguments[pLast++];
            match.input = arguments[pLast++];
            if (withGroups) {
                match.groups = arguments[pLast];
            }
            res = replacement(match);
        }
        return res;
    }
    if (typeof reg === "string") {
        const tmp = reg;
        reg = create(input, limit !== null && limit !== void 0 ? limit : 0);
        input = tmp;
        limit = undefined;
    }
    if (typeof replacement === "function") {
        limit = limit == null ? -1 : limit;
        return input.substring(0, offset) + input.substring(offset).replace(reg, replacer);
    }
    else {
        replacement =
            replacement
                // $0 doesn't work with JS regex, see #1155
                .replace(/\$0/g, (_s) => "$&")
                // named groups in replacement are `${name}` in .Net, but `$<name>` in JS (in regex: groups are `(?<name>...)` in both)
                .replace(/\${([^}]+)}/g, "\$<$1>");
        if (limit != null) {
            let m;
            const sub1 = input.substring(offset);
            const _matches = matches(reg, sub1);
            const sub2 = matches.length > limit ? (m = _matches[limit - 1], sub1.substring(0, m.index + m[0].length)) : sub1;
            return input.substring(0, offset) + sub2.replace(reg, replacement)
                + input.substring(offset + sub2.length);
        }
        else {
            return input.replace(reg, replacement);
        }
    }
}
function split(reg, input, limit, offset = 0) {
    if (typeof reg === "string") {
        const tmp = reg;
        reg = create(input, limit !== null && limit !== void 0 ? limit : 0);
        input = tmp;
        limit = undefined;
    }
    input = input.substring(offset);
    return input.split(reg, limit);
}


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grammar": () => (/* binding */ Grammar),
/* harmony export */   "Grammar$reflection": () => (/* binding */ Grammar$reflection),
/* harmony export */   "Rule": () => (/* binding */ Rule),
/* harmony export */   "Rule$reflection": () => (/* binding */ Rule$reflection),
/* harmony export */   "RuleBody": () => (/* binding */ RuleBody),
/* harmony export */   "RuleBody$reflection": () => (/* binding */ RuleBody$reflection),
/* harmony export */   "Binder": () => (/* binding */ Binder),
/* harmony export */   "Binder$reflection": () => (/* binding */ Binder$reflection),
/* harmony export */   "Term": () => (/* binding */ Term),
/* harmony export */   "Term$reflection": () => (/* binding */ Term$reflection),
/* harmony export */   "Expr": () => (/* binding */ Expr),
/* harmony export */   "Expr$reflection": () => (/* binding */ Expr$reflection),
/* harmony export */   "Type": () => (/* binding */ Type),
/* harmony export */   "Type$reflection": () => (/* binding */ Type$reflection),
/* harmony export */   "Variant": () => (/* binding */ Variant),
/* harmony export */   "Variant$reflection": () => (/* binding */ Variant$reflection),
/* harmony export */   "Field": () => (/* binding */ Field),
/* harmony export */   "Field$reflection": () => (/* binding */ Field$reflection),
/* harmony export */   "TypeApp": () => (/* binding */ TypeApp),
/* harmony export */   "TypeApp$reflection": () => (/* binding */ TypeApp$reflection),
/* harmony export */   "grammar": () => (/* binding */ grammar),
/* harmony export */   "body": () => (/* binding */ body),
/* harmony export */   "makeToken": () => (/* binding */ makeToken)
/* harmony export */ });
/* harmony import */ var _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



class Grammar extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(Name, Top, Rules, Types) {
        super();
        this.Name = Name;
        this.Top = Top;
        this.Rules = Rules;
        this.Types = Types;
    }
}

function Grammar$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Lingua.AST.Grammar", [], Grammar, () => [["Name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["Top", TypeApp$reflection()], ["Rules", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Rule$reflection())], ["Types", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Type$reflection())]]);
}

class Rule extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["RDefine", "ROverride", "RExtend"];
    }
}

function Rule$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Rule", [], Rule, () => [[["isToken", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.bool_type], ["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["formals", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["desc", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.option_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["Item5", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(RuleBody$reflection())]], [["isToken", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.bool_type], ["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["formals", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["Item4", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(RuleBody$reflection())]], [["isToken", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.bool_type], ["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["formals", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["Item4", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(RuleBody$reflection())]]]);
}

class RuleBody extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Record {
    constructor(Terms, Expr) {
        super();
        this.Terms = Terms;
        this.Expr = Expr;
    }
}

function RuleBody$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.record_type)("Lingua.AST.RuleBody", [], RuleBody, () => [["Terms", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Binder$reflection())], ["Expr", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.option_type)(Expr$reflection())]]);
}

class Binder extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["BBound", "BUnbound"];
    }
}

function Binder$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Binder", [], Binder, () => [[["Item1", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["Item2", Term$reflection()]], [["Item", Term$reflection()]]]);
}

class Term extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["TSeq", "TAlt", "TStar", "TPlus", "TOpt", "TNot", "TLookahead", "TLex", "TApply", "TRange", "TTerminal", "TParens"];
    }
}

function Term$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Term", [], Term, () => [[["Item", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Term$reflection())]], [["Item", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Term$reflection())]], [["Item", Term$reflection()]], [["Item", Term$reflection()]], [["Item", Term$reflection()]], [["Item", Term$reflection()]], [["Item", Term$reflection()]], [["Item", Term$reflection()]], [["Item1", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["args", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Term$reflection())]], [["Item1", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["Item2", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["Item", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["Item", Term$reflection()]]]);
}

class Expr extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["AMeta", "AMake", "AProject", "AVar", "AList", "ACons", "ANull"];
    }
}

function Expr$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Expr", [], Expr, () => [[], [["ctor", Expr$reflection()], ["args", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Expr$reflection())]], [["Item1", Expr$reflection()], ["field", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["Item", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Expr$reflection())]], [["Item1", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Expr$reflection())], ["Item2", Expr$reflection()]], []]);
}

class Type extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["TRecord", "TUnion"];
    }
}

function Type$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Type", [], Type, () => [[["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["formals", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["fields", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Field$reflection())]], [["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["formals", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type)], ["variants", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Variant$reflection())]]]);
}

class Variant extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Variant"];
    }
}

function Variant$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Variant", [], Variant, () => [[["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["fields", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(Field$reflection())]]]);
}

class Field extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Field"];
    }
}

function Field$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.Field", [], Field, () => [[["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type], ["typ", TypeApp$reflection()]]]);
}

class TypeApp extends _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["TAName", "TAApply", "TAProject", "TAList", "TAMaybe"];
    }
}

function TypeApp$reflection() {
    return (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("Lingua.AST.TypeApp", [], TypeApp, () => [[["name", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["Item1", TypeApp$reflection()], ["args", (0,_fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.array_type)(TypeApp$reflection())]], [["Item1", TypeApp$reflection()], ["field", _fable_fable_library_3_1_5_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.string_type]], [["Item", TypeApp$reflection()]], [["Item", TypeApp$reflection()]]]);
}

function grammar(n, rs, t, ts) {
    return new Grammar(n, t, rs, ts);
}

function body(t, a) {
    return new RuleBody(t, a);
}

function makeToken(r) {
    switch (r.tag) {
        case 1: {
            return new Rule(1, true, r.fields[1], r.fields[2], r.fields[3]);
        }
        case 2: {
            return new Rule(2, true, r.fields[1], r.fields[2], r.fields[3]);
        }
        default: {
            return new Rule(0, true, r.fields[1], r.fields[2], r.fields[3], r.fields[4]);
        }
    }
}

//# sourceMappingURL=Ast.js.map


/***/ }),
/* 17 */
/***/ ((module) => {

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=undefined;if(!f&&c)return require(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=undefined,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":3,"es5-ext/object/is-callable":6,"es5-ext/object/normalize-options":11,"es5-ext/string/#/contains":13}],2:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":4,"./shim":5}],4:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],5:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":8,"../valid-value":12}],6:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],7:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":2}],8:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":9,"./shim":10}],9:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],10:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":7}],11:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":7}],12:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":7}],13:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":14,"./shim":15}],14:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],15:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],16:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":17,"./polyfill":19}],17:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],19:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":20,"d":1}],20:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":18}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],23:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{},0],["param",{},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{},1],["param",{},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{},0],["param",{},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{},1],["param",{},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);

},{"..":46}],24:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" RuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,240]},null,[],["seq",{"sourceInterval":[188,227]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,227]},"RuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[247,297]},null,[],["seq",{"sourceInterval":[247,286]},["app",{"sourceInterval":[247,252]},"ident",[]],["opt",{"sourceInterval":[253,261]},["app",{"sourceInterval":[253,260]},"Formals",[]]],["terminal",{"sourceInterval":[273,277]},"+="],["app",{"sourceInterval":[278,286]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,297]},null,[],["alt",{"sourceInterval":[131,297]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,227]},"Rule_override",[]],["app",{"sourceInterval":[247,286]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[301,354]},null,[],["seq",{"sourceInterval":[316,354]},["opt",{"sourceInterval":[316,320]},["terminal",{"sourceInterval":[316,319]},"|"]],["app",{"sourceInterval":[321,354]},"NonemptyListOf",[["app",{"sourceInterval":[336,348]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[350,353]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[377,400]},null,[],["seq",{"sourceInterval":[377,389]},["app",{"sourceInterval":[377,380]},"Seq",[]],["app",{"sourceInterval":[381,389]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[358,410]},null,[],["alt",{"sourceInterval":[377,410]},["app",{"sourceInterval":[377,389]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[407,410]},"Seq",[]]]],"Formals":["define",{"sourceInterval":[414,454]},null,[],["seq",{"sourceInterval":[428,454]},["terminal",{"sourceInterval":[428,431]},"<"],["app",{"sourceInterval":[432,450]},"ListOf",[["app",{"sourceInterval":[439,444]},"ident",[]],["terminal",{"sourceInterval":[446,449]},","]]],["terminal",{"sourceInterval":[451,454]},">"]]],"Params":["define",{"sourceInterval":[458,495]},null,[],["seq",{"sourceInterval":[471,495]},["terminal",{"sourceInterval":[471,474]},"<"],["app",{"sourceInterval":[475,491]},"ListOf",[["app",{"sourceInterval":[482,485]},"Seq",[]],["terminal",{"sourceInterval":[487,490]},","]]],["terminal",{"sourceInterval":[492,495]},">"]]],"Alt":["define",{"sourceInterval":[499,533]},null,[],["app",{"sourceInterval":[509,533]},"NonemptyListOf",[["app",{"sourceInterval":[524,527]},"Seq",[]],["terminal",{"sourceInterval":[529,532]},"|"]]]],"Seq":["define",{"sourceInterval":[537,552]},null,[],["star",{"sourceInterval":[547,552]},["app",{"sourceInterval":[547,551]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[567,584]},null,[],["seq",{"sourceInterval":[567,575]},["app",{"sourceInterval":[567,571]},"Pred",[]],["terminal",{"sourceInterval":[572,575]},"*"]]],"Iter_plus":["define",{"sourceInterval":[591,608]},null,[],["seq",{"sourceInterval":[591,599]},["app",{"sourceInterval":[591,595]},"Pred",[]],["terminal",{"sourceInterval":[596,599]},"+"]]],"Iter_opt":["define",{"sourceInterval":[615,631]},null,[],["seq",{"sourceInterval":[615,623]},["app",{"sourceInterval":[615,619]},"Pred",[]],["terminal",{"sourceInterval":[620,623]},"?"]]],"Iter":["define",{"sourceInterval":[556,642]},null,[],["alt",{"sourceInterval":[567,642]},["app",{"sourceInterval":[567,575]},"Iter_star",[]],["app",{"sourceInterval":[591,599]},"Iter_plus",[]],["app",{"sourceInterval":[615,623]},"Iter_opt",[]],["app",{"sourceInterval":[638,642]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[657,672]},null,[],["seq",{"sourceInterval":[657,664]},["terminal",{"sourceInterval":[657,660]},"~"],["app",{"sourceInterval":[661,664]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[679,700]},null,[],["seq",{"sourceInterval":[679,686]},["terminal",{"sourceInterval":[679,682]},"&"],["app",{"sourceInterval":[683,686]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[646,710]},null,[],["alt",{"sourceInterval":[657,710]},["app",{"sourceInterval":[657,664]},"Pred_not",[]],["app",{"sourceInterval":[679,686]},"Pred_lookahead",[]],["app",{"sourceInterval":[707,710]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[724,740]},null,[],["seq",{"sourceInterval":[724,732]},["terminal",{"sourceInterval":[724,727]},"#"],["app",{"sourceInterval":[728,732]},"Base",[]]]],"Lex":["define",{"sourceInterval":[714,751]},null,[],["alt",{"sourceInterval":[724,751]},["app",{"sourceInterval":[724,732]},"Lex_lex",[]],["app",{"sourceInterval":[747,751]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[766,827]},null,[],["seq",{"sourceInterval":[766,811]},["app",{"sourceInterval":[766,771]},"ident",[]],["opt",{"sourceInterval":[772,779]},["app",{"sourceInterval":[772,778]},"Params",[]]],["not",{"sourceInterval":[780,811]},["alt",{"sourceInterval":[782,810]},["seq",{"sourceInterval":[782,796]},["opt",{"sourceInterval":[782,792]},["app",{"sourceInterval":[782,791]},"ruleDescr",[]]],["terminal",{"sourceInterval":[793,796]},"="]],["terminal",{"sourceInterval":[799,803]},":="],["terminal",{"sourceInterval":[806,810]},"+="]]]]],"Base_range":["define",{"sourceInterval":[834,889]},null,[],["seq",{"sourceInterval":[834,870]},["app",{"sourceInterval":[834,849]},"oneCharTerminal",[]],["terminal",{"sourceInterval":[850,854]},".."],["app",{"sourceInterval":[855,870]},"oneCharTerminal",[]]]],"Base_terminal":["define",{"sourceInterval":[896,954]},null,[],["app",{"sourceInterval":[896,904]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[961,1016]},null,[],["seq",{"sourceInterval":[961,972]},["terminal",{"sourceInterval":[961,964]},"("],["app",{"sourceInterval":[965,968]},"Alt",[]],["terminal",{"sourceInterval":[969,972]},")"]]],"Base":["define",{"sourceInterval":[755,1016]},null,[],["alt",{"sourceInterval":[766,1016]},["app",{"sourceInterval":[766,811]},"Base_application",[]],["app",{"sourceInterval":[834,870]},"Base_range",[]],["app",{"sourceInterval":[896,904]},"Base_terminal",[]],["app",{"sourceInterval":[961,972]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1020,1079]},"a rule description",[],["seq",{"sourceInterval":[1058,1079]},["terminal",{"sourceInterval":[1058,1061]},"("],["app",{"sourceInterval":[1062,1075]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1076,1079]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1083,1114]},null,[],["star",{"sourceInterval":[1103,1114]},["seq",{"sourceInterval":[1104,1112]},["not",{"sourceInterval":[1104,1108]},["terminal",{"sourceInterval":[1105,1108]},")"]],["app",{"sourceInterval":[1109,1112]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1118,1186]},null,[],["seq",{"sourceInterval":[1133,1186]},["terminal",{"sourceInterval":[1133,1137]},"--"],["star",{"sourceInterval":[1138,1152]},["seq",{"sourceInterval":[1139,1150]},["not",{"sourceInterval":[1139,1144]},["terminal",{"sourceInterval":[1140,1144]},"\n"]],["app",{"sourceInterval":[1145,1150]},"space",[]]]],["app",{"sourceInterval":[1153,1157]},"name",[]],["star",{"sourceInterval":[1158,1172]},["seq",{"sourceInterval":[1159,1170]},["not",{"sourceInterval":[1159,1164]},["terminal",{"sourceInterval":[1160,1164]},"\n"]],["app",{"sourceInterval":[1165,1170]},"space",[]]]],["alt",{"sourceInterval":[1174,1185]},["terminal",{"sourceInterval":[1174,1178]},"\n"],["lookahead",{"sourceInterval":[1181,1185]},["terminal",{"sourceInterval":[1182,1185]},"}"]]]]],"name":["define",{"sourceInterval":[1190,1230]},"a name",[],["seq",{"sourceInterval":[1211,1230]},["app",{"sourceInterval":[1211,1220]},"nameFirst",[]],["star",{"sourceInterval":[1221,1230]},["app",{"sourceInterval":[1221,1229]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1234,1266]},null,[],["alt",{"sourceInterval":[1250,1266]},["terminal",{"sourceInterval":[1250,1253]},"_"],["app",{"sourceInterval":[1260,1266]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1270,1300]},null,[],["alt",{"sourceInterval":[1285,1300]},["terminal",{"sourceInterval":[1285,1288]},"_"],["app",{"sourceInterval":[1295,1300]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1304,1337]},"an identifier",[],["app",{"sourceInterval":[1333,1337]},"name",[]]],"terminal":["define",{"sourceInterval":[1341,1379]},null,[],["seq",{"sourceInterval":[1356,1379]},["terminal",{"sourceInterval":[1356,1360]},"\""],["star",{"sourceInterval":[1361,1374]},["app",{"sourceInterval":[1361,1373]},"terminalChar",[]]],["terminal",{"sourceInterval":[1375,1379]},"\""]]],"oneCharTerminal":["define",{"sourceInterval":[1383,1427]},null,[],["seq",{"sourceInterval":[1405,1427]},["terminal",{"sourceInterval":[1405,1409]},"\""],["app",{"sourceInterval":[1410,1422]},"terminalChar",[]],["terminal",{"sourceInterval":[1423,1427]},"\""]]],"terminalChar":["define",{"sourceInterval":[1431,1488]},null,[],["alt",{"sourceInterval":[1450,1488]},["app",{"sourceInterval":[1450,1460]},"escapeChar",[]],["seq",{"sourceInterval":[1467,1488]},["not",{"sourceInterval":[1467,1472]},["terminal",{"sourceInterval":[1468,1472]},"\\"]],["not",{"sourceInterval":[1473,1478]},["terminal",{"sourceInterval":[1474,1478]},"\""]],["not",{"sourceInterval":[1479,1484]},["terminal",{"sourceInterval":[1480,1484]},"\n"]],["app",{"sourceInterval":[1485,1488]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1531,1586]},null,[],["terminal",{"sourceInterval":[1531,1537]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1593,1650]},null,[],["terminal",{"sourceInterval":[1593,1599]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1657,1714]},null,[],["terminal",{"sourceInterval":[1657,1663]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1721,1776]},null,[],["terminal",{"sourceInterval":[1721,1726]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1783,1837]},null,[],["terminal",{"sourceInterval":[1783,1788]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1844,1904]},null,[],["terminal",{"sourceInterval":[1844,1849]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[1911,1960]},null,[],["terminal",{"sourceInterval":[1911,1916]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[1967,2026]},null,[],["seq",{"sourceInterval":[1967,2008]},["terminal",{"sourceInterval":[1967,1972]},"\\u"],["app",{"sourceInterval":[1973,1981]},"hexDigit",[]],["app",{"sourceInterval":[1982,1990]},"hexDigit",[]],["app",{"sourceInterval":[1991,1999]},"hexDigit",[]],["app",{"sourceInterval":[2000,2008]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[2033,2088]},null,[],["seq",{"sourceInterval":[2033,2056]},["terminal",{"sourceInterval":[2033,2038]},"\\x"],["app",{"sourceInterval":[2039,2047]},"hexDigit",[]],["app",{"sourceInterval":[2048,2056]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1492,2088]},"an escape sequence",[],["alt",{"sourceInterval":[1531,2088]},["app",{"sourceInterval":[1531,1537]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1593,1599]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1657,1663]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1721,1726]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1783,1788]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1844,1849]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[1911,1916]},"escapeChar_tab",[]],["app",{"sourceInterval":[1967,2008]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[2033,2056]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2092,2111]},null,[],["app",{"sourceInterval":[2104,2111]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2129,2166]},null,[],["seq",{"sourceInterval":[2129,2151]},["terminal",{"sourceInterval":[2129,2133]},"//"],["star",{"sourceInterval":[2134,2146]},["seq",{"sourceInterval":[2135,2144]},["not",{"sourceInterval":[2135,2140]},["terminal",{"sourceInterval":[2136,2140]},"\n"]],["app",{"sourceInterval":[2141,2144]},"any",[]]]],["terminal",{"sourceInterval":[2147,2151]},"\n"]]],"comment_multiLine":["define",{"sourceInterval":[2173,2209]},null,[],["seq",{"sourceInterval":[2173,2195]},["terminal",{"sourceInterval":[2173,2177]},"/*"],["star",{"sourceInterval":[2178,2190]},["seq",{"sourceInterval":[2179,2188]},["not",{"sourceInterval":[2179,2184]},["terminal",{"sourceInterval":[2180,2184]},"*/"]],["app",{"sourceInterval":[2185,2188]},"any",[]]]],["terminal",{"sourceInterval":[2191,2195]},"*/"]]],"comment":["define",{"sourceInterval":[2115,2209]},null,[],["alt",{"sourceInterval":[2129,2209]},["app",{"sourceInterval":[2129,2151]},"comment_singleLine",[]],["app",{"sourceInterval":[2173,2195]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2213,2228]},null,[],["star",{"sourceInterval":[2222,2228]},["app",{"sourceInterval":[2222,2227]},"token",[]]]],"token":["define",{"sourceInterval":[2232,2308]},null,[],["alt",{"sourceInterval":[2240,2308]},["app",{"sourceInterval":[2240,2248]},"caseName",[]],["app",{"sourceInterval":[2251,2258]},"comment",[]],["app",{"sourceInterval":[2261,2266]},"ident",[]],["app",{"sourceInterval":[2269,2277]},"operator",[]],["app",{"sourceInterval":[2280,2291]},"punctuation",[]],["app",{"sourceInterval":[2294,2302]},"terminal",[]],["app",{"sourceInterval":[2305,2308]},"any",[]]]],"operator":["define",{"sourceInterval":[2312,2377]},null,[],["alt",{"sourceInterval":[2323,2377]},["terminal",{"sourceInterval":[2323,2327]},"<:"],["terminal",{"sourceInterval":[2330,2333]},"="],["terminal",{"sourceInterval":[2336,2340]},":="],["terminal",{"sourceInterval":[2343,2347]},"+="],["terminal",{"sourceInterval":[2350,2353]},"*"],["terminal",{"sourceInterval":[2356,2359]},"+"],["terminal",{"sourceInterval":[2362,2365]},"?"],["terminal",{"sourceInterval":[2368,2371]},"~"],["terminal",{"sourceInterval":[2374,2377]},"&"]]],"punctuation":["define",{"sourceInterval":[2381,2417]},null,[],["alt",{"sourceInterval":[2395,2417]},["terminal",{"sourceInterval":[2395,2398]},"<"],["terminal",{"sourceInterval":[2401,2404]},">"],["terminal",{"sourceInterval":[2407,2410]},","],["terminal",{"sourceInterval":[2413,2417]},"--"]]]}]);

},{"..":46}],25:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"},"OperationsAndAttributes",null,"AttributeSignature",{"AttributeSignature":["define",{"sourceInterval":[29,58]},null,[],["app",{"sourceInterval":[54,58]},"name",[]]],"OperationSignature":["define",{"sourceInterval":[62,100]},null,[],["seq",{"sourceInterval":[87,100]},["app",{"sourceInterval":[87,91]},"name",[]],["opt",{"sourceInterval":[92,100]},["app",{"sourceInterval":[92,99]},"Formals",[]]]]],"Formals":["define",{"sourceInterval":[104,143]},null,[],["seq",{"sourceInterval":[118,143]},["terminal",{"sourceInterval":[118,121]},"("],["app",{"sourceInterval":[122,139]},"ListOf",[["app",{"sourceInterval":[129,133]},"name",[]],["terminal",{"sourceInterval":[135,138]},","]]],["terminal",{"sourceInterval":[140,143]},")"]]],"name":["define",{"sourceInterval":[147,187]},"a name",[],["seq",{"sourceInterval":[168,187]},["app",{"sourceInterval":[168,177]},"nameFirst",[]],["star",{"sourceInterval":[178,187]},["app",{"sourceInterval":[178,186]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[191,223]},null,[],["alt",{"sourceInterval":[207,223]},["terminal",{"sourceInterval":[207,210]},"_"],["app",{"sourceInterval":[217,223]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[227,257]},null,[],["alt",{"sourceInterval":[242,257]},["terminal",{"sourceInterval":[242,245]},"_"],["app",{"sourceInterval":[252,257]},"alnum",[]]]]}]);

},{"..":46}],26:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('../src/common').assert;

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
  var parts = descriptor.split(/ ?\[\]/);
  if (parts.length === 2) {
    return mapProp.bind(null, parts[0]);
  }
  return getProp.bind(null, descriptor);
}

function getProps(walkFns, thing, fn) {
  return walkFns.map(function(walkFn) {
    return walkFn(thing, fn);
  });
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
  var parts = sig.split(/[()]/).map(trim);
  if (parts.length === 3 && parts[2] === '') {
    var name = parts[0];
    var params = [];
    if (parts[1].length > 0) {
      params = parts[1].split(',').map(trim);
    }
    if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
      return {name: name, formals: params};
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

  var self = this;
  Object.keys(this._shapes).forEach(function(k) {
    var shape = self._shapes[k];
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
  var self = this;
  Object.keys(dict).forEach(function(k) {
    assert(k in self._getChildren, "Unrecognized action name '" + k + "'");
    var action = dict[k];
    assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
    if (k in self._arities) {
      var expected = self._arities[k];
      var actual = dict[k].length;
      assert(actual === expected,
             "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
    }
  });
};

VisitorFamily.prototype.addOperation = function(signature, actions) {
  var sig = parseSignature(signature);
  var name = sig.name;
  this._checkActionDict(actions);
  this.operations[name] = {
    name: name,
    formals: sig.formals,
    actions: actions
  };

  var family = this;
  this.Adapter.prototype[name] = function() {
    var tag = family._getTag(this._adaptee);
    assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
    assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'");

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    var args = Object.create(null);
    for (var i = 0; i < arguments.length; i++) {
      args[sig.formals[i]] = arguments[i];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = actions[tag].apply(this, family._getChildren[tag](this._adaptee, family._wrap));
    this.args = oldArgs;
    return ans;
  };
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = VisitorFamily;

},{"../src/common":44}],27:[function(require,module,exports){
'use strict';

module.exports = {
  VisitorFamily: require('./VisitorFamily'),
  semanticsForToAST: require('./semantics-toAST').semantics,
  toAST: require('./semantics-toAST').helper
};

},{"./VisitorFamily":26,"./semantics-toAST":28}],28:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('../src/pexprs');
var MatchResult = require('../src/MatchResult');
var Grammar = require('../src/Grammar');
var extend = require('util-extend');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var defaultOperation = {
  _terminal: function() {
    return this.primitiveValue;
  },

  _nonterminal: function(children) {
    var ctorName = this._node.ctorName;
    var mapping = this.args.mapping;

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
      var realChildren = children.filter(function(child) {
        return !child.isTerminal();
      });
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
    var propMap = mapping[ctorName] || children;
    var node = {
      type: ctorName
    };
    for (var prop in propMap) {
      var mappedProp = mapping[ctorName] && mapping[ctorName][prop];
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

  _iter: function(children) {
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

  NonemptyListOf: function(first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
  },

  EmptyListOf: function() {
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
  var operation = extend({}, defaultOperation);
  for (var termName in mapping) {
    if (typeof mapping[termName] === 'function') {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  var g = res._cst.grammar;
  var s = g.createSemantics().addOperation('toAST(mapping)', operation);
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

},{"../src/Grammar":33,"../src/MatchResult":37,"../src/pexprs":64,"util-extend":68}],29:[function(require,module,exports){
module.exports={
  "_from": "ohm-js",
  "_id": "ohm-js@0.14.0",
  "_inBundle": false,
  "_integrity": "sha512-Iuiapfkaf0ZdvuJo9thtE57BT93uNOSIb3/DtwuBNBJiiT28ALzTg++w3HoAXWbQBYPem9Bd8BaNJcDYoABWUA==",
  "_location": "/ohm-js",
  "_phantomChildren": {},
  "_requested": {
    "type": "tag",
    "registry": true,
    "raw": "ohm-js",
    "name": "ohm-js",
    "escapedName": "ohm-js",
    "rawSpec": "",
    "saveSpec": null,
    "fetchSpec": "latest"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/ohm-js/-/ohm-js-0.14.0.tgz",
  "_shasum": "ef5dbe33d493407916f8c4c12115161872c2bc0d",
  "_spec": "ohm-js",
  "_where": "/home/quil/Projects/Palette/fohm",
  "author": {
    "name": "Alex Warth",
    "email": "alexwarth@gmail.com",
    "url": "http://tinlizzie.org/~awarth"
  },
  "bin": {
    "ohm-js": "src/ohm-cmd.js"
  },
  "bugs": {
    "url": "https://github.com/harc/ohm/issues"
  },
  "bundleDependencies": false,
  "contributors": [
    {
      "name": "Patrick Dubroy",
      "email": "pdubroy@gmail.com"
    },
    {
      "name": "Meixian Li",
      "email": "lmeixian@gmail.com"
    },
    {
      "name": "Marko Röder",
      "email": "m.roeder@photon-software.de"
    },
    {
      "name": "Tony Garnock-Jones",
      "email": "tonygarnockjones@gmail.com"
    },
    {
      "name": "Saketh Kasibatla",
      "email": "sake.kasi@gmail.com"
    },
    {
      "name": "Lionel Landwerlin",
      "email": "llandwerlin@gmail.com"
    },
    {
      "name": "Jason Merrill",
      "email": "jwmerrill@gmail.com"
    },
    {
      "name": "Yoshiki Ohshima",
      "email": "Yoshiki.Ohshima@acm.org"
    },
    {
      "name": "Ray Toal",
      "email": "rtoal@lmu.edu"
    },
    {
      "name": "Jonathan Edwards",
      "email": "JonathanMEdwards@gmail.com"
    },
    {
      "name": "Neil Jewers",
      "email": "njjewers@uwaterloo.ca"
    },
    {
      "name": "sfinnie",
      "email": "scott.finnie@gmail.com"
    },
    {
      "name": "Arthur Carabott",
      "email": "arthurc@gmail.com"
    },
    {
      "name": "Daniel Tomlinson",
      "email": "DanielTomlinson@me.com"
    },
    {
      "name": "Justin Chase",
      "email": "justin.m.chase@gmail.com"
    },
    {
      "name": "Leslie Ying",
      "email": "acetophore@users.noreply.github.com"
    },
    {
      "name": "Luca Guzzon",
      "email": "luca.guzzon@gmail.com"
    },
    {
      "name": "Mike Niebling",
      "email": "(none)",
      "url": "none"
    },
    {
      "name": "Milan Lajtoš",
      "email": "milan.lajtos@me.com"
    },
    {
      "name": "Stephan Seidt",
      "email": "stephan.seidt@gmail.com"
    },
    {
      "name": "acslk",
      "email": "d_vd415@hotmail.com"
    },
    {
      "name": "codeZeilen",
      "email": "codeZeilen@users.noreply.github.com"
    },
    {
      "name": "owch",
      "email": "bowenrainyday@gmail.com"
    }
  ],
  "dependencies": {
    "es6-symbol": "^3.1.0",
    "inherits": "^2.0.3",
    "is-buffer": "^1.1.4",
    "util-extend": "^1.0.3"
  },
  "deprecated": false,
  "description": "An object-oriented language for parsing and pattern matching",
  "devDependencies": {
    "@types/tape": "^4.2.29",
    "browserify": "^13.1.1",
    "eslint": "~3.13.1",
    "eslint-config-google": "~0.7.1",
    "eslint-plugin-camelcase-ohm": "~0.2.1",
    "eslint-plugin-no-extension-in-require": "~0.2.0",
    "eslint-plugin-tape": "~1.1.0",
    "husky": "^0.14.3",
    "jsdom": "^9.9.1",
    "json": "^9.0.4",
    "markscript": "^0.5.0",
    "node-static": "^0.7.9",
    "nodemon": "^1.11.0",
    "tap-spec": "^4.1.1",
    "tape": "^4.6.3",
    "tape-catch": "^1.0.6",
    "ts-node": "^2.1.0",
    "typescript": "2.2.1",
    "uglify-js": "^2.7.5",
    "walk-sync": "^0.3.1",
    "watchify": "^3.8.0"
  },
  "engines": {
    "node": ">=0.12.1"
  },
  "homepage": "https://ohmlang.github.io/",
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
  "license": "MIT",
  "main": "src/main.js",
  "name": "ohm-js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/harc/ohm.git"
  },
  "scripts": {
    "bootstrap": "bash bin/bootstrap --test || (echo 'Bootstrap failed.' && mv -v dist/ohm-grammar.js.old dist/ohm-grammar.js && mv -v dist/built-in-rules.js.old dist/built-in-rules.js && mv -v dist/operations-and-attributes.js.old dist/operations-and-attributes.js)",
    "build": "node bin/build-debug.js && uglifyjs dist/ohm.js > dist/ohm.min.js",
    "build-debug": "bash bin/build-debug.sh",
    "ci-test": "npm run lint && npm test && ts-node test/test-typings.ts",
    "clean": "rm -f dist/ohm.js dist/ohm.min.js",
    "deploy-gh-pages": "bin/deploy-gh-pages.sh",
    "lint": "eslint .",
    "postinstall": "node bin/dev-setup.js",
    "prebootstrap": "bash bin/prebootstrap",
    "prebuild-debug": "bash bin/update-env.sh",
    "precommit": "npm run prepublishOnly",
    "prepublishOnly": "npm run lint && npm run build && npm run bootstrap",
    "pretest": "bash bin/update-env.sh",
    "test": "tape 'test/**/*.js' | tap-spec",
    "test-watch": "bash bin/test-watch",
    "unsafe-bootstrap": "bash bin/bootstrap",
    "visualizer": "bash bin/ohm-visualizer",
    "watch": "bash bin/watch.sh"
  },
  "types": "index.d.ts",
  "version": "0.14.0"
}

},{}],30:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var GrammarDecl = require('./GrammarDecl');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {}

Builder.prototype = {
  currentDecl: null,

  newGrammar: function(name) {
    return new GrammarDecl(name);
  },

  grammar: function(metaInfo, name, superGrammar, defaultStartRule, rules) {
    var gDecl = new GrammarDecl(name);
    if (superGrammar) {
      gDecl.withSuperGrammar(this.fromRecipe(superGrammar));
    }
    if (defaultStartRule) {
      gDecl.withDefaultStartRule(defaultStartRule);
    }
    if (metaInfo && metaInfo.source) {
      gDecl.withSource(metaInfo.source);
    }

    var self = this;
    this.currentDecl = gDecl;
    Object.keys(rules).forEach(function(ruleName) {
      var ruleRecipe = rules[ruleName];

      var action = ruleRecipe[0]; // define/extend/override
      var metaInfo = ruleRecipe[1];
      var description = ruleRecipe[2];
      var formals = ruleRecipe[3];
      var body = self.fromRecipe(ruleRecipe[4]);

      var source;
      if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
        source = gDecl.source.subInterval(
            metaInfo.sourceInterval[0],
            metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
      }
      gDecl[action](ruleName, formals, body, description, source);
    });
    this.currentDecl = null;
    return gDecl.build();
  },

  terminal: function(x) {
    return new pexprs.Terminal(x);
  },

  range: function(from, to) {
    return new pexprs.Range(from, to);
  },

  param: function(index) {
    return new pexprs.Param(index);
  },

  alt: function(/* term1, term1, ... */) {
    var terms = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
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

  seq: function(/* factor1, factor2, ... */) {
    var factors = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
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

  star: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Star(expr);
  },

  plus: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Plus(expr);
  },

  opt: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Opt(expr);
  },

  not: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Not(expr);
  },

  la: function(expr) {
    // TODO: temporary to still be able to read old recipes
    return this.lookahead(expr);
  },

  lookahead: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lookahead(expr);
  },

  lex: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lex(expr);
  },

  app: function(ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function(param) {
        return param instanceof pexprs.PExpr ? param :
          this.fromRecipe(param);
      }, this);
    }
    return new pexprs.Apply(ruleName, optParams);
  },

  fromRecipe: function(recipe) {
    // the meta-info of 'grammar' is proccessed in Builder.grammar
    var result = this[recipe[0]].apply(this,
      recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));

    var metaInfo = recipe[1];
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

},{"./GrammarDecl":34,"./pexprs":64}],31:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');
var TerminalNode = require('./nodes').TerminalNode;
var assert = require('./common').assert;
var inherits = require('inherits');
var pexprs = require('./pexprs');

function CaseInsensitiveTerminal(param) {
  this.obj = param;
}
inherits(CaseInsensitiveTerminal, pexprs.PExpr);

CaseInsensitiveTerminal.prototype = {
  _getString: function(state) {
    var terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof pexprs.Terminal, 'expected a Terminal expression');
    return terminal.obj;
  },

  // Implementation of the PExpr API

  allowsSkippingPrecedingSpace: function() {
    return true;
  },

  eval: function(state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    var matchStr = this._getString(state);
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
      return true;
    }
  },

  generateExample: function(grammar, examples, inSyntacticContext, actuals) {
    // Start with a example generated from the Terminal...
    var str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value;

    // ...and randomly switch characters to uppercase/lowercase.
    var value = '';
    for (var i = 0; i < str.length; ++i) {
      value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
    }
    return {value: value};
  },

  getArity: function() {
    return 1;
  },

  substituteParams: function(actuals) {
    return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  },

  toDisplayString: function() {
    return this.obj.toDisplayString() + ' (case-insensitive)';
  },

  toFailure: function() {
    return new Failure(this, this.obj.toFailure() + ' (case-insensitive)', 'description');
  },

  _isNullable: function(grammar, memo) {
    return this.obj._isNullable(grammar, memo);
  }
};

module.exports = CaseInsensitiveTerminal;

},{"./Failure":32,"./common":44,"./nodes":47,"./pexprs":64,"inherits":21}],32:[function(require,module,exports){
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
  var failure = new Failure(this.pexpr, this.text, this.type);
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

},{}],33:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var CaseInsensitiveTerminal = require('./CaseInsensitiveTerminal');
var Matcher = require('./Matcher');
var Semantics = require('./Semantics');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getSortedRuleValues(grammar) {
  return Object.keys(grammar.rules).sort().map(function(name) { return grammar.rules[name]; });
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

var ohmGrammar;
var buildGrammar;

// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function(grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  matcher: function() {
    return new Matcher(this);
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  equals: function(g) {
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
    var myRules = getSortedRuleValues(this);
    var otherRules = getSortedRuleValues(g);
    return myRules.length === otherRules.length && myRules.every(function(rule, i) {
      return rule.description === otherRules[i].description &&
             rule.formals.join(',') === otherRules[i].formals.join(',') &&
             rule.body.toString() === otherRules[i].body.toString();
    });
  },

  match: function(input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  },

  trace: function(input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  },

  semantics: function() {
    // TODO: Remove this eventually! Deprecated in v0.12.
    throw new Error('semantics() is deprecated -- use createSemantics() instead.');
  },

  createSemantics: function() {
    return Semantics.createSemantics(this);
  },

  extendSemantics: function(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict: function(what, name, actionDict) {
    function isSpecialAction(a) {
      return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
    }

    var problems = [];
    for (var k in actionDict) {
      var v = actionDict[k];
      if (!isSpecialAction(k) && !(k in this.rules)) {
        problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
      } else if (typeof v !== 'function') {
        problems.push(
            "'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
      } else {
        var actual = v.length;
        var expected = this._topDownActionArity(k);
        if (actual !== expected) {
          problems.push(
              "Semantic action '" + k + "' has the wrong arity: " +
              'expected ' + expected + ', got ' + actual);
        }
      }
    }
    if (problems.length > 0) {
      var prettyProblems = problems.map(function(problem) { return '- ' + problem; });
      var error = new Error(
          "Found errors in the action dictionary of the '" + name + "' " + what + ':\n' +
          prettyProblems.join('\n'));
      error.problems = problems;
      throw error;
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity: function(actionName) {
    if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }
    return this.rules[actionName].body.getArity();
  },

  _inheritsFrom: function(grammar) {
    var g = this.superGrammar;
    while (g) {
      if (g.equals(grammar, true)) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe: function(optVarName) {
    var metaInfo = {};
    // Include the grammar source if it is available.
    if (this.source) {
      metaInfo.source = this.source.contents;
    }

    var superGrammar = null;
    if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammar = JSON.parse(this.superGrammar.toRecipe());
    }

    var startRule = null;
    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }

    var rules = {};
    var self = this;
    Object.keys(this.rules).forEach(function(ruleName) {
      var ruleInfo = self.rules[ruleName];
      var body = ruleInfo.body;
      var isDefinition = !self.superGrammar || !self.superGrammar.rules[ruleName];

      var operation;
      if (isDefinition) {
        operation = 'define';
      } else {
        operation = body instanceof pexprs.Extend ? 'extend' : 'override';
      }

      var metaInfo = {};
      if (ruleInfo.source && self.source) {
        var adjusted = ruleInfo.source.relativeTo(self.source);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }

      var description = isDefinition ? ruleInfo.description : null;
      var bodyRecipe = body.outputRecipe(ruleInfo.formals, self.source);

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
  toOperationActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },

  _toOperationOrAttributeActionDictionaryTemplate: function() {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    var sb = new common.StringBuffer();
    sb.append('{');

    var first = true;
    for (var ruleName in this.rules) {
      var body = this.rules[ruleName].body;
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

  addSemanticActionTemplate: function(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    var arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },

  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication: function(str) {
    var app;
    if (str.indexOf('<') === -1) {
      // simple application
      app = new pexprs.Apply(str);
    } else {
      // parameterized application
      var cst = ohmGrammar.match(str, 'Base_application');
      app = buildGrammar(cst, {});
    }

    // Ensure that the application is valid.
    if (!(app.ruleName in this.rules)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    }
    var formals = this.rules[app.ruleName].formals;
    if (formals.length !== app.args.length) {
      var source = this.rules[app.ruleName].source;
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
  'ProtoBuiltInRules',  // name
  undefined,  // supergrammar
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
    // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
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

},{"./CaseInsensitiveTerminal":31,"./Matcher":39,"./Semantics":42,"./common":44,"./errors":45,"./pexprs":64}],34:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = require('./Grammar');
var InputStream = require('./InputStream');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

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

GrammarDecl.prototype.installOverriddenOrExtendedRule = function(name, formals, body, source) {
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  var expectedFormals = ruleInfo.formals;
  var expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
  if (formals.length !== expectedNumFormals) {
    throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
  }
  return this.install(name, formals, body, ruleInfo.description, source);
};

GrammarDecl.prototype.install = function(name, formals, body, description, source) {
  this.rules[name] = {
    body: body.introduceParams(formals),
    formals: formals,
    description: description,
    source: source
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
  var grammar = new Grammar(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule);

  // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.
  var grammarErrors = [];
  var grammarHasInvalidApplications = false;
  Object.keys(grammar.rules).forEach(function(ruleName) {
    var body = grammar.rules[ruleName].body;
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
    Object.keys(grammar.rules).forEach(function(ruleName) {
      var body = grammar.rules[ruleName].body;
      try {
        body.assertIteratedExprsAreNotNullable(grammar, ruleName);
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
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  return this.install(name, formals, body, description, source);
};

GrammarDecl.prototype.override = function(name, formals, body, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
  }
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, fragment, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
  }
  var body = new pexprs.Extend(this.superGrammar, name, fragment);
  body.source = fragment.source;
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":33,"./InputStream":35,"./common":44,"./errors":45,"./pexprs":64}],35:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.examinedLength = 0;
}

InputStream.prototype = {
  atEnd: function() {
    var ans = this.pos === this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  },

  next: function() {
    var ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  },

  matchString: function(s, optIgnoreCase) {
    var idx;
    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.

        This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").
       */
      for (idx = 0; idx < s.length; idx++) {
        var actual = this.next();
        var expected = s[idx];
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

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval: function(startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

},{"./Interval":36}],36:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('./common').assert;
var errors = require('./errors');
var util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(sourceString, startIdx, endIdx) {
  this.sourceString = sourceString;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function(/* interval1, interval2, ... */) {
  var sourceString = arguments[0].sourceString;
  var startIdx = arguments[0].startIdx;
  var endIdx = arguments[0].endIdx;
  for (var idx = 1; idx < arguments.length; idx++) {
    var interval = arguments[idx];
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
  coverageWith: function(/* interval1, interval2, ... */) {
    var intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },

  collapsedLeft: function() {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  },

  collapsedRight: function() {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  },

  getLineAndColumnMessage: function() {
    var range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  },

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus: function(that) {
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
  relativeTo: function(that) {
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
  trimmed: function() {
    var contents = this.contents;
    var startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    var endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.sourceString, startIdx, endIdx);
  },

  subInterval: function(offset, len) {
    var newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
};

Object.defineProperties(Interval.prototype, {
  contents: {
    get: function() {
      if (this._contents === undefined) {
        this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  },
  length: {
    get: function() { return this.endIdx - this.startIdx; },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./common":44,"./errors":45,"./util":65}],37:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var util = require('./util');
var Interval = require('./Interval');

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
      var detail = 'Expected ' + this.getExpectedText();
      return util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
    });
    common.defineLazyProperty(this, 'shortMessage', function() {
      var detail = 'expected ' + this.getExpectedText();
      var errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
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
    var matchResultWithFailures =
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

  var sb = new common.StringBuffer();
  var failures = this.getRightmostFailures();

  // Filter out the fluffy failures to make the default error messages more useful
  failures = failures.filter(function(failure) {
    return !failure.isFluffy();
  });

  for (var idx = 0; idx < failures.length; idx++) {
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
  var pos = this.getRightmostFailurePosition();
  return new Interval(this.input, pos, pos);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchResult;

},{"./Interval":36,"./common":44,"./util":65}],38:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');
var MatchResult = require('./MatchResult');
var PosInfo = require('./PosInfo');
var Trace = require('./Trace');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var applySpaces = new pexprs.Apply('spaces');

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
  posToOffset: function(pos) {
    return pos - this._posStack[this._posStack.length - 1];
  },

  enterApplication: function(posInfo, app) {
    this._posStack.push(this.inputStream.pos);
    this._applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this.rightmostFailurePosition = -1;
  },

  exitApplication: function(posInfo, optNode) {
    var origPos = this._posStack.pop();
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

  enterLexifiedContext: function() {
    this.inLexifiedContextStack.push(true);
  },

  exitLexifiedContext: function() {
    this.inLexifiedContextStack.pop();
  },

  currentApplication: function() {
    return this._applicationStack[this._applicationStack.length - 1];
  },

  inSyntacticContext: function() {
    if (typeof this.inputStream.source !== 'string') {
      return false;
    }
    var currentApplication = this.currentApplication();
    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      // The top-level context is syntactic if the start application is.
      return this.startExpr.factors[0].isSyntactic();
    }
  },

  inLexifiedContext: function() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  },

  skipSpaces: function() {
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
    return this.inputStream.pos;
  },

  skipSpacesIfInSyntacticContext: function() {
    return this.inSyntacticContext() ?
        this.skipSpaces() :
        this.inputStream.pos;
  },

  maybeSkipSpacesBefore: function(expr) {
    if (expr instanceof pexprs.Apply && expr.isSyntactic()) {
      return this.skipSpaces();
    } else if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  },

  pushBinding: function(node, origPos) {
    this._bindings.push(node);
    this._bindingOffsets.push(this.posToOffset(origPos));
  },

  popBinding: function() {
    this._bindings.pop();
    this._bindingOffsets.pop();
  },

  numBindings: function() {
    return this._bindings.length;
  },

  truncateBindings: function(newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  },

  getCurrentPosInfo: function() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo: function(pos) {
    var posInfo = this.memoTable[pos];
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }
    return posInfo;
  },

  processFailure: function(pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);

    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      var app = this.currentApplication();
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

  recordFailure: function(failure, shouldCloneIfNew) {
    var key = failure.toKey();
    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  },

  recordFailures: function(failures, shouldCloneIfNew) {
    var self = this;
    Object.keys(failures).forEach(function(key) {
      self.recordFailure(failures[key], shouldCloneIfNew);
    });
  },

  cloneRecordedFailures: function() {
    if (!this.recordedFailures) {
      return undefined;
    }

    var ans = Object.create(null);
    var self = this;
    Object.keys(this.recordedFailures).forEach(function(key) {
      ans[key] = self.recordedFailures[key].clone();
    });
    return ans;
  },

  getRightmostFailurePosition: function() {
    return this.rightmostFailurePosition;
  },

  _getRightmostFailureOffset: function() {
    return this.rightmostFailurePosition >= 0 ?
        this.posToOffset(this.rightmostFailurePosition) :
        -1;
  },

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry: function(pos, expr) {
    var posInfo = this.memoTable[pos];
    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec && memoRec.traceEntry) {
        var entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }
    return null;
  },

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry: function(pos, expr, succeeded, bindings) {
    if (expr instanceof pexprs.Apply) {
      var app = this.currentApplication();
      var actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }
    return this.getMemoizedTraceEntry(pos, expr) ||
           new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
  },

  isTracing: function() {
    return !!this.trace;
  },

  hasNecessaryInfo: function(memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }

    if (this.recordedFailures &&
        this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
      return !!memoRec.failuresAtRightmostPosition;
    }

    return true;
  },


  useMemoizedResult: function(origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }

    var memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
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
  eval: function(expr) {
    var inputStream = this.inputStream;
    var origNumBindings = this._bindings.length;

    var origRecordedFailures;
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = Object.create(null);
    }

    var origPos = inputStream.pos;
    var memoPos = this.maybeSkipSpacesBefore(expr);

    var origTrace;
    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    }

    // Do the actual evaluation.
    var ans = expr.eval(this);

    if (this.trace) {
      var bindings = this._bindings.slice(origNumBindings);
      var traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        var self = this;
        Object.keys(this.recordedFailures).forEach(function(key) {
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

  getMatchResult: function() {
    this.eval(this.startExpr);
    var rightmostFailures;
    if (this.recordedFailures) {
      var self = this;
      rightmostFailures = Object.keys(this.recordedFailures).map(function(key) {
        return self.recordedFailures[key];
      });
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

  getTrace: function() {
    this.trace = [];
    var matchResult = this.getMatchResult();

    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    var rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  },

  pushFailuresInfo: function() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this._recordedFailuresStack.push(this.recordedFailures);
  },

  popFailuresInfo: function() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchState;

},{"./InputStream":35,"./MatchResult":37,"./PosInfo":41,"./Trace":43,"./pexprs":64}],39:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var MatchState = require('./MatchState');

var pexprs = require('./pexprs');

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
  var currentInput = this.input;
  if (startIdx < 0 || startIdx > currentInput.length ||
      endIdx < 0 || endIdx > currentInput.length ||
      startIdx > endIdx) {
    throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
  }

  // update input
  this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx);

  // update memo table (similar to the above)
  var restOfMemoTable = this.memoTable.slice(endIdx);
  this.memoTable.length = startIdx;
  for (var idx = 0; idx < str.length; idx++) {
    this.memoTable.push(undefined);
  }
  restOfMemoTable.forEach(
      function(posInfo) { this.memoTable.push(posInfo); },
      this);

  // Invalidate memoRecs
  for (var pos = 0; pos < startIdx; pos++) {
    var posInfo = this.memoTable[pos];
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
  var state = new MatchState(this, startExpr, optPositionToRecordFailures);
  return tracing ? state.getTrace() : state.getMatchResult();
};

/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/
Matcher.prototype._getStartExpr = function(optStartApplicationStr) {
  var applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;
  if (!applicationStr) {
    throw new Error('Missing start rule argument -- the grammar has no default start rule.');
  }

  var startApp = this.grammar.parseApplication(applicationStr);
  return new pexprs.Seq([startApp, pexprs.end]);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Matcher;

},{"./MatchState":38,"./pexprs":64}],40:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');

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
  var ns = Object.create(namespace, {
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

},{"util-extend":68}],41:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo() {
  this.applicationMemoKeyStack = [];  // active applications at this position
  this.memo = {};
  this.maxExaminedLength = 0;
  this.maxRightmostFailureOffset = -1;
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  },

  enter: function(application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  },

  exit: function() {
    this.applicationMemoKeyStack.pop();
  },

  startLeftRecursion: function(headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;

    var applicationMemoKeyStack = this.applicationMemoKeyStack;
    var indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    var involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);

    memoRec.isInvolved = function(applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };

    memoRec.updateInvolvedApplicationMemoKeys = function() {
      for (var idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        var applicationMemoKey = applicationMemoKeyStack[idx];
        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  },

  endLeftRecursion: function() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  },

  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult: function(memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }
    var applicationMemoKeyStack = this.applicationMemoKeyStack;
    for (var idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      var applicationMemoKey = applicationMemoKeyStack[idx];
      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }
    return true;
  },

  memoize: function(memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset =
        Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
    return memoRec;
  },

  clearObsoleteEntries: function(pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      // Optimization: none of the rule applications that were memoized here examined the
      // interval of the input that changed, so nothing has to be invalidated.
      return;
    }

    var memo = this.memo;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    var self = this;
    Object.keys(memo).forEach(function(k) {
      var memoRec = memo[k];
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

},{}],42:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = require('es6-symbol');  // eslint-disable-line no-undef
var inherits = require('inherits');

var InputStream = require('./InputStream');
var IterationNode = require('./nodes').IterationNode;
var MatchResult = require('./MatchResult');
var common = require('./common');
var errors = require('./errors');
var util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var globalActionStack = [];
var prototypeGrammar;
var prototypeGrammarSemantics;

// JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)
function jsonToJS(str) {
  var output = str.replace(/[\u2028\u2029]/g, function(char, pos, str) {
    var hex = char.codePointAt(0).toString(16);
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
function Wrapper() {}

Wrapper.prototype.toString = function() {
  return '[semantics wrapper for ' + this._node.grammar.name + ']';
};

// This is used by ohm editor to display a node wrapper appropriately.
Wrapper.prototype.toJSON = function() {
  return this.toString();
};

Wrapper.prototype._forgetMemoizedResultFor = function(attributeName) {
  // Remove the memoized attribute from the cstNode and all its children.
  delete this._node[this._semantics.attributeKeys[attributeName]];
  this.children.forEach(function(child) {
    child._forgetMemoizedResultFor(attributeName);
  });
};

// Returns the wrapper of the specified child node. Child wrappers are created lazily and cached in
// the parent wrapper's `_childWrappers` instance variable.
Wrapper.prototype.child = function(idx) {
  if (!(0 <= idx && idx < this._node.numChildren())) {
    // TODO: Consider throwing an exception here.
    return undefined;
  }
  var childWrapper = this._childWrappers[idx];
  if (!childWrapper) {
    var childNode = this._node.childAt(idx);
    var offset = this._node.childOffsets[idx];

    var source = this._baseInterval.subInterval(offset, childNode.matchLength);
    var base = childNode.isNonterminal() ? source : this._baseInterval;
    childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
  }
  return childWrapper;
};

// Returns an array containing the wrappers of all of the children of the node associated with this
// wrapper.
Wrapper.prototype._children = function() {
  // Force the creation of all child wrappers
  for (var idx = 0; idx < this._node.numChildren(); idx++) {
    this.child(idx);
  }
  return this._childWrappers;
};

// Returns `true` if the CST node associated with this wrapper corresponds to an iteration
// expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
Wrapper.prototype.isIteration = function() {
  return this._node.isIteration();
};

// Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
// otherwise.
Wrapper.prototype.isTerminal = function() {
  return this._node.isTerminal();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
// otherwise.
Wrapper.prototype.isNonterminal = function() {
  return this._node.isNonterminal();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a syntactic rule, `false` otherwise.
Wrapper.prototype.isSyntactic = function() {
  return this.isNonterminal() && this._node.isSyntactic();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a lexical rule, `false` otherwise.
Wrapper.prototype.isLexical = function() {
  return this.isNonterminal() && this._node.isLexical();
};

// Returns `true` if the CST node associated with this wrapper is an iterator node
// having either one or no child (? operator), `false` otherwise.
// Otherwise, throws an exception.
Wrapper.prototype.isOptional = function() {
  return this._node.isOptional();
};

// Create a new _iter wrapper in the same semantics as this wrapper.
Wrapper.prototype.iteration = function(optChildWrappers) {
  var childWrappers = optChildWrappers || [];

  var childNodes = childWrappers.map(function(c) { return c._node; });
  var iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);

  var wrapper = this._semantics.wrap(iter, null, null);
  wrapper._childWrappers = childWrappers;
  return wrapper;
};

Object.defineProperties(Wrapper.prototype, {
  // Returns an array containing the children of this CST node.
  children: {get: function() { return this._children(); }},

  // Returns the name of grammar rule that created this CST node.
  ctorName: {get: function() { return this._node.ctorName; }},

  // TODO: Remove this eventually (deprecated in v0.12).
  interval: {get: function() {
    throw new Error('The `interval` property is deprecated -- use `source` instead');
  }},

  // Returns the number of children of this CST node.
  numChildren: {get: function() { return this._node.numChildren(); }},

  // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
  // throws an exception.
  primitiveValue: {
    get: function() {
      if (this.isTerminal()) {
        return this._node.primitiveValue;
      }
      throw new TypeError(
          "tried to access the 'primitiveValue' attribute of a non-terminal CST node");
    }
  },

  // Returns the contents of the input stream consumed by this CST node.
  sourceString: {get: function() { return this.source.contents; }}
});

// ----------------- Semantics -----------------

// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.createSemantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, superSemantics) {
  var self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false;

  // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.
  this.Wrapper = function(node, sourceInterval, baseInterval) {
    self.checkActionDictsIfHaventAlready();
    this._semantics = self;
    this._node = node;
    this.source = sourceInterval;

    // The interval that the childOffsets of `node` are relative to. It should be the source
    // of the closest Nonterminal node.
    this._baseInterval = baseInterval;

    if (node.isNonterminal()) {
      common.assert(sourceInterval === baseInterval);
    }

    this._childWrappers = [];
  };

  this.super = superSemantics;
  if (superSemantics) {
    if (!(grammar.equals(this.super.grammar) || grammar._inheritsFrom(this.super.grammar))) {
      throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name +
          "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }
    inherits(this.Wrapper, this.super.Wrapper);
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null);

    // Assign unique symbols for each of the attributes inherited from the super-semantics so that
    // they are memoized independently.
    for (var attributeName in this.attributes) {
      this.attributeKeys[attributeName] = Symbol();
    }
  } else {
    inherits(this.Wrapper, Wrapper);
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
  var name;
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

  var str = '(function(g) {\n';
  if (hasSuperSemantics(this)) {
    str += '  var semantics = ' + this.super.toRecipe(true) + '(g';

    var superSemanticsGrammar = this.super.grammar;
    var relatedGrammar = this.grammar;
    while (relatedGrammar !== superSemanticsGrammar) {
      str += '.superGrammar';
      relatedGrammar = relatedGrammar.superGrammar;
    }

    str += ');\n';
    str += '  return g.extendSemantics(semantics)';
  } else {
    str += '  return g.createSemantics()';
  }
  ['Operation', 'Attribute'].forEach(function(type) {
    var semanticOperations = this[type.toLowerCase() + 's'];
    Object.keys(semanticOperations).forEach(function(name) {
      var signature = name;
      if (semanticOperations[name].formals.length > 0) {
        signature += '(' + semanticOperations[name].formals.join(', ') + ')';
      }

      var method;
      if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
        method = 'extend' + type;
      } else {
        method = 'add' + type;
      }
      str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';

      var actions = semanticOperations[name].actionDict;
      var srcArray = [];
      Object.keys(actions).forEach(function(actionName) {
        if (semanticOperations[name].builtInDefault !== actions[actionName]) {
          srcArray.push('\n      ' + JSON.stringify(actionName) + ': ' +
            actions[actionName].toString());
        }
      });
      str += srcArray.join(',');

      str += '\n    })';
    }, this);
  }, this);
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

  var r = prototypeGrammar.match(
      signature,
      type === 'operation' ? 'OperationSignature' : 'AttributeSignature');
  if (r.failed()) {
    throw new Error(r.message);
  }

  return prototypeGrammarSemantics(r).parse();
}

function newDefaultAction(type, name, doIt) {
  return function(children) {
    var self = this;
    var thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
    var args = thisThing.formals.map(function(formal) {
      return self.args[formal];
    });

    if (this.isIteration()) {
      // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
      // default behavior is to map this operation or attribute over all of its child nodes.
      return children.map(function(child) { return doIt.apply(child, args); });
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
  var typePlural = type + 's';

  var parsedNameAndFormalArgs = parseSignature(signature, type);
  var name = parsedNameAndFormalArgs.name;
  var formals = parsedNameAndFormalArgs.formals;

  // TODO: check that there are no duplicate formal arguments

  this.assertNewName(name, type);

  // Create the action dictionary for this operation / attribute that contains a `_default` action
  // which defines the default behavior of iteration, terminal, and non-terminal nodes...
  var builtInDefault = newDefaultAction(type, name, doIt);
  var realActionDict = {_default: builtInDefault};
  // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.
  Object.keys(actionDict).forEach(function(name) {
    realActionDict[name] = actionDict[name];
  });

  var entry = type === 'operation' ?
      new Operation(name, formals, realActionDict, builtInDefault) :
      new Attribute(name, realActionDict, builtInDefault);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  entry.checkActionDict(this.grammar);

  this[typePlural][name] = entry;

  function doIt() {
    // Dispatch to most specific version of this operation / attribute -- it may have been
    // overridden by a sub-semantics.
    var thisThing = this._semantics[typePlural][name];

    // Check that the caller passed the correct number of arguments.
    if (arguments.length !== thisThing.formals.length) {
      throw new Error(
          'Invalid number of arguments passed to ' + name + ' ' + type + ' (expected ' +
          thisThing.formals.length + ', got ' + arguments.length + ')');
    }

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    var args = Object.create(null);
    for (var idx = 0; idx < arguments.length; idx++) {
      var formal = thisThing.formals[idx];
      args[formal] = arguments[idx];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = thisThing.execute(this._semantics, this);
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
      configurable: true  // So the property can be deleted.
    });
    this.attributeKeys[name] = Symbol();
  }
};

Semantics.prototype.extendOperationOrAttribute = function(type, name, actionDict) {
  var typePlural = type + 's';

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
  var inheritedFormals = this[typePlural][name].formals;
  var inheritedActionDict = this[typePlural][name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
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
  var baseInterval = optBaseInterval || source;
  return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
};

// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(
      grammar,
      optSuperSemantics !== undefined ?
          optSuperSemantics :
          Semantics.BuiltInSemantics._getSemantics());

  // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.
  var proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError(
          'Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
    }
    if (matchResult.failed()) {
      throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
    }

    var cst = matchResult._cst;
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a MatchResult from grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    var inputStream = new InputStream(matchResult.input);
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
    var action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];
    if (!action) {
      throw new Error('"' + operationOrAttributeName + '" is not a valid operation or attribute ' +
        'name in this semantics for "' + grammar.name + '"');
    }
    return action.actionDict;
  };
  proxy._remove = function(operationOrAttributeName) {
    var semantic;
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
function Operation(name, formals, actionDict, builtInDefault) {
  this.name = name;
  this.formals = formals;
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
}

Operation.prototype.typeName = 'operation';

Operation.prototype.checkActionDict = function(grammar) {
  grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
};

// Execute this operation on the CST node associated with `nodeWrapper` in the context of the given
// Semantics instance.
Operation.prototype.execute = function(semantics, nodeWrapper) {
  try {
    // Look for a semantic action whose name matches the node's constructor name, which is either
    // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
    // iteration node). In the latter case, the action function receives a single argument, which
    // is an array containing all of the children of the CST node.
    var ctorName = nodeWrapper._node.ctorName;
    var actionFn = this.actionDict[ctorName];
    var ans;
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
};

// Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
// `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
// argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
// be equal to the number of children in the CST node.
Operation.prototype.doAction = function(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
  return optPassChildrenAsArray ?
      actionFn.call(nodeWrapper, nodeWrapper._children()) :
      actionFn.apply(nodeWrapper, nodeWrapper._children());
};

// ----------------- Attribute -----------------

// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
function Attribute(name, actionDict, builtInDefault) {
  this.name = name;
  this.formals = [];
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
}
inherits(Attribute, Operation);

Attribute.prototype.typeName = 'attribute';

Attribute.prototype.execute = function(semantics, nodeWrapper) {
  var node = nodeWrapper._node;
  var key = semantics.attributeKeys[this.name];
  if (!node.hasOwnProperty(key)) {
    // The following is a super-send -- isn't JS beautiful? :/
    node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
  }
  return node[key];
};

// ----------------- Deferred initialization -----------------

util.awaitBuiltInRules(function(builtInRules) {
  var operationsAndAttributesGrammar = require('../dist/operations-and-attributes');
  initBuiltInSemantics(builtInRules);
  initPrototypeParser(operationsAndAttributesGrammar);  // requires BuiltInSemantics
});

function initBuiltInSemantics(builtInRules) {
  var actions = {
    empty: function() {
      return this.iteration();
    },
    nonEmpty: function(first, _, rest) {
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
    AttributeSignature: function(name) {
      return {
        name: name.parse(),
        formals: []
      };
    },
    OperationSignature: function(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.parse()[0] || []
      };
    },
    Formals: function(oparen, fs, cparen) {
      return fs.asIteration().parse();
    },
    name: function(first, rest) {
      return this.sourceString;
    }
  });
  prototypeGrammar = grammar;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;

},{"../dist/operations-and-attributes":25,"./InputStream":35,"./MatchResult":37,"./common":44,"./errors":45,"./nodes":47,"./util":65,"es6-symbol":16,"inherits":21}],43:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');
var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Unicode characters that are used in the `toString` output.
var BALLOT_X = '\u2717';
var CHECK_MARK = '\u2713';
var DOT_OPERATOR = '\u22C5';
var RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
var SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
var SYMBOL_FOR_LINE_FEED = '\u240A';
var SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';

var Flags = {
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
  var excerpt = asEscapedString(input.slice(pos, pos + len));

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
  get: function() { return this.expr.toDisplayString(); }
});

// For convenience, create a getter and setter for the boolean flags in `Flags`.
Object.keys(Flags).forEach(function(name) {
  var mask = Flags[name];
  Object.defineProperty(Trace.prototype, name, {
    get: function() {
      return (this._flags & mask) !== 0;
    },
    set: function(val) {
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
  var ans = new Trace(
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
  var visitor = visitorObjOrFn;
  if (typeof visitor === 'function') {
    visitor = {enter: visitor};
  }

  function _walk(node, parent, depth) {
    var recurse = true;
    if (visitor.enter) {
      if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
        recurse = false;
      }
    }
    if (recurse) {
      node.children.forEach(function(child) {
        _walk(child, node, depth + 1);
      });
      if (visitor.exit) {
        visitor.exit.call(optThisArg, node, parent, depth);
      }
    }
  }
  if (this.isRootNode) {
    // Don't visit the root node itself, only its children.
    this.children.forEach(function(c) { _walk(c, null, 0); });
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
  var sb = new common.StringBuffer();
  this.walk(function(node, parent, depth) {
    if (!node) {
      return this.SKIP;
    }
    var ctorName = node.expr.constructor.name;
    // Don't print anything for Alt nodes.
    if (ctorName === 'Alt') {
      return;  // eslint-disable-line consistent-return
    }
    sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
    if (node.isHeadOfLeftRecursion) {
      sb.append(' (LR)');
    }
    if (node.succeeded) {
      var contents = asEscapedString(node.source.contents);
      sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
      sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
    }
    sb.append('\n');
  }.bind(this));
  return sb.contents();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Trace;

},{"./Interval":36,"./common":44}],44:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

var escapeStringFor = {};
for (var c = 0; c < 128; c++) {
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
  var methodName = optMethodName || '';
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
  var memo;
  Object.defineProperty(obj, propName, {
    get: function() {
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
  var arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
};

exports.repeatStr = function(str, n) {
  return new Array(n + 1).join(str);
};

exports.repeat = function(x, n) {
  return exports.repeatFn(function() { return x; }, n);
};

exports.getDuplicates = function(array) {
  var duplicates = [];
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
};

exports.copyWithoutDuplicates = function(array) {
  var noDuplicates = [];
  array.forEach(function(entry) {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
};

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
};

exports.isLexical = function(ruleName) {
  return !exports.isSyntactic(ruleName);
};

exports.padLeft = function(str, len, optChar) {
  var ch = optChar || ' ';
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
  var charCode = c.charCodeAt(0);
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
  var baseToString = Object.prototype.toString.call(obj);
  try {
    var typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1);  // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = typeof obj;
    }
    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
};

},{"util-extend":68}],45:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Namespace = require('./Namespace');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function createError(message, optInterval) {
  var e;
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
  var e = new Error();
  Object.defineProperty(e, 'message', {get: function() { return matchFailure.message; }});
  Object.defineProperty(e, 'shortMessage', {get: function() {
    return 'Expected ' + matchFailure.getExpectedText();
  }});
  e.interval = matchFailure.getInterval();
  return e;
}

// Undeclared grammar

function undeclaredGrammar(grammarName, namespace, interval) {
  var message = namespace ?
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
  var message = "Duplicate declaration for rule '" + ruleName +
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

// ----------------- Kleene operators -----------------

function kleeneExprHasNullableOperand(kleeneExpr) {
  return createError(
      'Nullable expression ' + kleeneExpr.expr.source.contents + " is not allowed inside '" +
          kleeneExpr.operator + "' (possible infinite loop)",
      kleeneExpr.expr.source);
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
  var messages = errors.map(function(e) { return e.message; });
  return createError(
      ['Errors:'].concat(messages).join('\n- '),
      errors[0].interval);
}

// ----------------- semantic -----------------

function missingSemanticAction(ctorName, name, type, stack) {
  var stackTrace = stack.slice(0, -1).map(function(info) {
    var ans = '  ' + info[0].name + ' > ' + info[1];
    return info.length === 3
        ? ans + " for '" + info[2] + "'"
        : ans;
  }).join('\n');
  stackTrace += '\n  ' + name + ' > ' + ctorName;

  var where = type + " '" + name + "'";
  var message = "Missing semantic action for '" + ctorName + "' in " + where + '\n' +
                'Action stack (most recent call last):\n' + stackTrace;

  var e = createError(message);
  e.name = 'missingSemanticAction';
  return e;
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  applicationOfSyntacticRuleFromLexicalContext: applicationOfSyntacticRuleFromLexicalContext,
  cannotExtendUndeclaredRule: cannotExtendUndeclaredRule,
  cannotOverrideUndeclaredRule: cannotOverrideUndeclaredRule,
  duplicateGrammarDeclaration: duplicateGrammarDeclaration,
  duplicateParameterNames: duplicateParameterNames,
  duplicatePropertyNames: duplicatePropertyNames,
  duplicateRuleDeclaration: duplicateRuleDeclaration,
  inconsistentArity: inconsistentArity,
  incorrectArgumentType: incorrectArgumentType,
  intervalSourcesDontMatch: intervalSourcesDontMatch,
  invalidConstructorCall: invalidConstructorCall,
  invalidParameter: invalidParameter,
  grammarSyntaxError: grammarSyntaxError,
  kleeneExprHasNullableOperand: kleeneExprHasNullableOperand,
  missingSemanticAction: missingSemanticAction,
  undeclaredGrammar: undeclaredGrammar,
  undeclaredRule: undeclaredRule,
  wrongNumberOfArguments: wrongNumberOfArguments,
  wrongNumberOfParameters: wrongNumberOfParameters,

  throwErrors: function(errors) {
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw multipleErrors(errors);
    }
  }
};

},{"./Namespace":40}],46:[function(require,module,exports){
/* global document, XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Builder = require('./Builder');
var Grammar = require('./Grammar');
var Namespace = require('./Namespace');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');
var util = require('./util');
var version = require('./version');

var isBuffer = require('is-buffer');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
var ohmGrammar;

// An object which makes it possible to stub out the document API for testing.
var documentInterface = {
  querySelector: function(sel) { return document.querySelector(sel); },
  querySelectorAll: function(sel) { return document.querySelectorAll(sel); }
};

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0;  // eslint-disable-line no-void
}

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }
  var length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
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
  var builder = new Builder();
  var decl;
  var currentRuleName;
  var currentRuleFormals;
  var overriding = false;
  var metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  var helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammar: function(n, s, open, rs, close) {
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      g.source = this.source.trimmed();
      if (grammarName in namespace) {
        throw errors.duplicateGrammarDeclaration(g, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar: function(_, n) {
      var superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define: function(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      var body = b.visit();
      var description = d.visit()[0];
      var source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      overriding = true;
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body, null, source);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body, null, source);
      return ans;
    },
    RuleBody: function(_, terms) {
      var args = terms.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    Formals: function(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params: function(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt: function(seqs) {
      var args = seqs.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    TopLevelTerm_inline: function(b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      var source = this.source.trimmed();
      var isNewRuleDeclaration =
          !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }
      var params = currentRuleFormals.map(function(formal) { return builder.app(formal); });
      return builder.app(inlineRuleName, params).withSource(body.source);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.visit()).withSource(this.source);
    },

    Iter_star: function(x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus: function(x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt: function(x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },

    Pred_not: function(_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead: function(_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },

    Lex_lex: function(_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
    },
    Base_range: function(from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal: function(expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
    },

    ruleDescr: function(open, t, close) {
      return t.visit();
    },
    ruleDescrText: function(_) {
      return this.sourceString.trim();
    },

    caseName: function(_, space1, n, space2, end) {
      return n.visit();
    },

    name: function(first, rest) {
      return this.sourceString;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    terminal: function(open, cs, close) {
      return cs.visit().join('');
    },

    oneCharTerminal: function(open, c, close) {
      return c.visit();
    },

    terminalChar: function(_) {
      return common.unescapeChar(this.sourceString);
    },

    escapeChar: function(_) {
      return this.sourceString;
    },

    NonemptyListOf: function(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    EmptyListOf: function() {
      return [];
    },

    _terminal: function() {
      return this.primitiveValue;
    }
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  var m = ohmGrammar.match(source, 'Grammars');
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
  var ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  var grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    var secondGrammar = ns[grammarNames[1]];
    var interval = secondGrammar.source;
    throw new Error(
        util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.');
  }
  return ns[grammarNames[0]];  // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
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
  var node = optNode;
  if (isUndefined(node)) {
    var nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
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
  var nodeList = optNodeOrNodeList;
  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }
  var ns = Namespace.createNamespace();
  for (var i = 0; i < nodeList.length; ++i) {
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
  grammar: grammar,
  grammars: grammars,
  grammarFromScriptElement: grammarFromScriptElement,
  grammarsFromScriptElements: grammarsFromScriptElements,
  makeRecipe: makeRecipe,
  ohmGrammar: null,  // Initialized below, after Grammar.BuiltInRules.
  pexprs: pexprs,
  util: util,
  extras: require('../extras'),
  version: version
};

// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };

// Late initialization for stuff that is bootstrapped.

Grammar.BuiltInRules = require('../dist/built-in-rules');
util.announceBuiltInRules(Grammar.BuiltInRules);

module.exports.ohmGrammar = ohmGrammar = require('../dist/ohm-grammar');
Grammar.initApplicationParser(ohmGrammar, buildGrammar);

},{"../dist/built-in-rules":23,"../dist/ohm-grammar":24,"../extras":27,"./Builder":30,"./Grammar":33,"./Namespace":40,"./common":44,"./errors":45,"./pexprs":64,"./util":65,"./version":66,"is-buffer":22}],47:[function(require,module,exports){
'use strict';

var inherits = require('inherits');

var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, matchLength) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.matchLength = matchLength;
}

Node.prototype.numChildren = function() {
  return this.children ? this.children.length : 0;
};

Node.prototype.childAt = function(idx) {
  if (this.children) {
    return this.children[idx];
  }
};

Node.prototype.indexOfChild = function(arg) {
  return this.children.indexOf(arg);
};

Node.prototype.hasChildren = function() {
  return this.numChildren() > 1;
};

Node.prototype.hasNoChildren = function() {
  return !this.hasChildren();
};

Node.prototype.onlyChild = function() {
  if (this.numChildren() !== 1) {
    throw new Error(
        'cannot get only child of a node of type ' + this.ctorName +
        ' (it has ' + this.numChildren() + ' children)');
  } else {
    return this.firstChild();
  }
};

Node.prototype.firstChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get first child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(0);
  }
};

Node.prototype.lastChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get last child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(this.numChildren() - 1);
  }
};

Node.prototype.childBefore = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childBefore() called w/ an argument that is not a child');
  } else if (childIdx === 0) {
    throw new Error('cannot get child before first child');
  } else {
    return this.childAt(childIdx - 1);
  }
};

Node.prototype.childAfter = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childAfter() called w/ an argument that is not a child');
  } else if (childIdx === this.numChildren() - 1) {
    throw new Error('cannot get child after last child');
  } else {
    return this.childAt(childIdx + 1);
  }
};

Node.prototype.isTerminal = function() {
  return false;
};

Node.prototype.isNonterminal = function() {
  return false;
};

Node.prototype.isIteration = function() {
  return false;
};

Node.prototype.isOptional = function() {
  return false;
};

Node.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.children;
  return r;
};

// Terminals

function TerminalNode(grammar, value) {
  var matchLength = value ? value.length : 0;
  Node.call(this, grammar, '_terminal', matchLength);
  this.primitiveValue = value;
}
inherits(TerminalNode, Node);

TerminalNode.prototype.isTerminal = function() {
  return true;
};

TerminalNode.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.primitiveValue;
  return r;
};

// Nonterminals

function NonterminalNode(grammar, ruleName, children, childOffsets, matchLength) {
  Node.call(this, grammar, ruleName, matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
}
inherits(NonterminalNode, Node);

NonterminalNode.prototype.isNonterminal = function() {
  return true;
};

NonterminalNode.prototype.isLexical = function() {
  return common.isLexical(this.ctorName);
};

NonterminalNode.prototype.isSyntactic = function() {
  return common.isSyntactic(this.ctorName);
};

// Iterations

function IterationNode(grammar, children, childOffsets, matchLength, isOptional) {
  Node.call(this, grammar, '_iter', matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
  this.optional = isOptional;
}
inherits(IterationNode, Node);

IterationNode.prototype.isIteration = function() {
  return true;
};

IterationNode.prototype.isOptional = function() {
  return this.optional;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  Node: Node,
  TerminalNode: TerminalNode,
  NonterminalNode: NonterminalNode,
  IterationNode: IterationNode
};

},{"./common":44,"inherits":21}],48:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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

},{"./common":44,"./pexprs":64}],49:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');
var util = require('./util');

var BuiltInRules;

util.awaitBuiltInRules(function(g) { BuiltInRules = g; });

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var lexifyCount;

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
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid =
pexprs.Not.prototype._assertAllApplicationsAreValid =
pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Apply.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  var ruleInfo = grammar.rules[this.ruleName];

  // Make sure that the rule exists...
  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  }

  // ...and that this application is allowed
  if (common.isSyntactic(this.ruleName) && (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments
  var actual = this.args.length;
  var expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  }

  // ...and that all of the argument expressions only have valid applications and have arity 1.
  var self = this;
  this.args.forEach(function(arg) {
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

},{"./common":44,"./errors":45,"./pexprs":64,"./util":65}],50:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

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
  var arity = this.terms[0].getArity();
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    var otherArity = term.getArity();
    if (arity !== otherArity) {
      throw errors.inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  var actualArity = this.terms[0].getArity();
  var expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
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

},{"./common":44,"./errors":45,"./pexprs":64}],51:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

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
pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
  if (this.expr.isNullable(grammar)) {
    throw errors.kleeneExprHasNullableOperand(this, ruleName);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lex.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.args.forEach(function(arg) {
    arg.assertIteratedExprsAreNotNullable(grammar, ruleName);
  });
};

},{"./common":44,"./errors":45,"./pexprs":64}],52:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

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
  for (var i = 0; i < this.terms.length; i++) {
    var term = this.terms[i];
    if (term.check(grammar, vals)) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.check = function(grammar, vals) {
  var pos = 0;
  for (var i = 0; i < this.factors.length; i++) {
    var factor = this.factors[i];
    if (factor.check(grammar, vals.slice(pos))) {
      pos += factor.getArity();
    } else {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.check = function(grammar, vals) {
  var arity = this.getArity();
  var columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  var rowCount = columns[0].length;
  var i;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowCount) {
      return false;
    }
  }

  for (i = 0; i < rowCount; i++) {
    var row = [];
    for (var j = 0; j < arity; j++) {
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
  var ruleNode = vals[0];
  var body = grammar.rules[this.ruleName].body;
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

pexprs.UnicodeChar.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === 'string';
};

},{"./common":44,"./nodes":47,"./pexprs":64}],53:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Trace = require('./Trace');
var common = require('./common');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

var TerminalNode = nodes.TerminalNode;
var NonterminalNode = nodes.NonterminalNode;
var IterationNode = nodes.IterationNode;

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
pexprs.PExpr.prototype.eval = common.abstract('eval');  // function(state) { ... }

pexprs.any.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.end.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (inputStream.atEnd()) {
    state.pushBinding(new TerminalNode(state.grammar, undefined), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Terminal.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    state.pushBinding(new TerminalNode(state.grammar, this.obj), origPos);
    return true;
  }
};

pexprs.Range.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
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
  var ans = state.eval(this.expr);
  state.exitLexifiedContext();
  return ans;
};

pexprs.Alt.prototype.eval = function(state) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.eval = function(state) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];
    if (!state.eval(factor)) {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var cols = [];
  var colOffsets = [];
  while (cols.length < arity) {
    cols.push([]);
    colOffsets.push([]);
  }

  var numMatches = 0;
  var idx;
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    numMatches++;
    var row = state._bindings.splice(state._bindings.length - arity, arity);
    var rowOffsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
      colOffsets[idx].push(rowOffsets[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  var offset = state.posToOffset(origPos);
  var matchLength = 0;
  if (numMatches > 0) {
    var lastCol = cols[arity - 1];
    var lastColOffsets = colOffsets[arity - 1];

    var endOffset =
        lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
    offset = colOffsets[0][0];
    matchLength = endOffset - offset;
  }
  var isOptional = this instanceof pexprs.Opt;
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

  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  state.pushFailuresInfo();

  var ans = state.eval(this.expr);

  state.popFailuresInfo();
  if (ans) {
    state.processFailure(origPos, this);
    return false;
  }

  inputStream.pos = origPos;
  return true;
};

pexprs.Lookahead.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (state.eval(this.expr)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function(state) {
  var caller = state.currentApplication();
  var actuals = caller ? caller.args : [];
  var app = this.substituteParams(actuals);

  var posInfo = state.getCurrentPosInfo();
  if (posInfo.isActive(app)) {
    // This rule is already active at this position, i.e., it is left-recursive.
    return app.handleCycle(state);
  }

  var memoKey = app.toMemoKey();
  var memoRec = posInfo.memo[memoKey];

  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) {
      return state.useMemoizedResult(state.inputStream.pos, memoRec);
    }
    delete posInfo.memo[memoKey];
  }
  return app.reallyEval(state);
};

pexprs.Apply.prototype.handleCycle = function(state) {
  var posInfo = state.getCurrentPosInfo();
  var currentLeftRecursion = posInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var memoRec = posInfo.memo[memoKey];

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
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origPosInfo = state.getCurrentPosInfo();
  var ruleInfo = state.grammar.rules[this.ruleName];
  var body = ruleInfo.body;
  var description = ruleInfo.description;

  state.enterApplication(origPosInfo, this);

  if (description) {
    state.pushFailuresInfo();
  }

  // Reset the input stream's examinedLength property so that we can track
  // the examined length of this particular application.
  var origInputStreamExaminedLength = inputStream.examinedLength;
  inputStream.examinedLength = 0;

  var value = this.evalOnce(body, state);
  var currentLR = origPosInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  var memoRec;

  if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
    memoRec = currentLR;
    memoRec.examinedLength = inputStream.examinedLength - origPos;
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
    origPosInfo.memoize(memoKey, memoRec);  // updates origPosInfo's maxExaminedLength
  } else if (!currentLR || !currentLR.isInvolved(memoKey)) {
    // This application is not involved in left recursion, so it's ok to memoize it.
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value: value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    });
  }
  var succeeded = !!value;

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
    var entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
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
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (state.eval(expr)) {
    var arity = expr.getArity();
    var bindings = state._bindings.splice(state._bindings.length - arity, arity);
    var offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
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

  var inputStream = state.inputStream;

  while (true) {
    lrMemoRec.matchLength = inputStream.pos - origPos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();

    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is a copy of the trace node from `newValue`, which will always be the last
      // element in `state.trace`.
      var seedTrace = state.trace[state.trace.length - 1];
      lrMemoRec.traceEntry = new Trace(
          state.input, origPos, inputStream.pos, this, true, [newValue], [seedTrace.clone()]);
    }
    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);
    if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
      break;
    }
    if (state.isTracing()) {
      state.trace.splice(-2, 1);  // Drop the trace for the old seed.
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
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch && this.pattern.test(ch)) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

},{"./Trace":43,"./common":44,"./nodes":47,"./pexprs":64}],54:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
  var examplesNeeded = examples.filter(function(example) {
    return example.hasOwnProperty('examplesNeeded');
  })
  .map(function(example) { return example.examplesNeeded; });

  examplesNeeded = flatten(examplesNeeded);

  var uniqueExamplesNeeded = {};
  for (var i = 0; i < examplesNeeded.length; i++) {
    var currentExampleNeeded = examplesNeeded[i];
    uniqueExamplesNeeded[currentExampleNeeded] = true;
  }
  examplesNeeded = Object.keys(uniqueExamplesNeeded);

  // A list of successfully generated examples
  var successfulExamples = examples.filter(function(example) {
    return example.hasOwnProperty('value');
  })
  .map(function(item) { return item.value; });

  // This flag returns true if the system cannot generate the rule it is currently
  //   attempting to generate, regardless of whether or not it has the examples it needs.
  //   Currently, this is only used in overriding generators to prevent the system from
  //   generating examples for certain rules (e.g. 'ident').
  var needHelp = examples.some(function(item) { return item.needHelp; });

  return {
    examplesNeeded: examplesNeeded,
    successfulExamples: successfulExamples,
    needHelp: needHelp
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
  var rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
  return {value: String.fromCharCode(
    this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random())
  )};
};

pexprs.Param.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return actuals[this.index].generateExample(grammar, examples, inSyntacticContext, actuals);
};

pexprs.Alt.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  // items -> termExamples
  var termExamples = this.terms.map(function(term) {
    return term.generateExample(grammar, examples, inSyntacticContext, actuals);
  });

  var categorizedExamples = categorizeExamples(termExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;

  var ans = {};

  // Alt can contain both an example and a request for examples
  if (successfulExamples.length > 0) {
    var i = Math.floor(Math.random() * successfulExamples.length);
    ans.value = successfulExamples[i];
  }
  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }
  ans.needHelp = needHelp;

  return ans;
};

pexprs.Seq.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  var factorExamples = this.factors.map(function(factor) {
    return factor.generateExample(grammar, examples, inSyntacticContext, actuals);
  });
  var categorizedExamples = categorizeExamples(factorExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;

  var ans = {};

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
  var rangeTimes = Math.min(this.maxNumMatches - this.minNumMatches, 3);
  var numTimes = Math.floor(Math.random() * (rangeTimes + 1) + this.minNumMatches);
  var items = [];

  for (var i = 0; i < numTimes; i++) {
    items.push(this.expr.generateExample(grammar, examples, inSyntacticContext, actuals));
  }

  var categorizedExamples = categorizeExamples(items);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;

  var ans = {};

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
  var ans = {};

  var ruleName = this.substituteParams(actuals).toString();

  if (!examples.hasOwnProperty(ruleName)) {
    ans.examplesNeeded = [ruleName];
  } else {
    var relevantExamples = examples[ruleName];
    var i = Math.floor(Math.random() * relevantExamples.length);
    ans.value = relevantExamples[i];
  }

  return ans;
};

pexprs.UnicodeChar.prototype.generateExample = function(
    grammar, examples, inSyntacticContext, actuals) {
  var char;
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

},{"./common":44,"./pexprs":64}],55:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
  var arity = 0;
  for (var idx = 0; idx < this.factors.length; idx++) {
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

},{"./common":44,"./pexprs":64}],56:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
  this.terms.forEach(function(term, idx, terms) {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach(function(factor, idx, factors) {
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
  var index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.args.length > 0) {
      // TODO: Should this be supported? See issue #64.
      throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
    }
    return new pexprs.Param(index);
  } else {
    this.args.forEach(function(arg, idx, args) {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};

},{"./common":44,"./pexprs":64}],57:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
      this.terms.some(function(term) { return term._isNullable(grammar, memo); });
};

pexprs.Seq.prototype._isNullable = function(grammar, memo) {
  return this.factors.every(function(factor) { return factor._isNullable(grammar, memo); });
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
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var body = grammar.rules[this.ruleName].body;
    var inlined = body.substituteParams(this.args);
    memo[key] = false;  // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};

},{"./common":44,"./pexprs":64}],58:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getMetaInfo(expr, grammarInterval) {
  var metaInfo = {};
  if (expr.source && grammarInterval) {
    var adjusted = expr.source.relativeTo(grammarInterval);
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
  ].concat(this.terms.map(function(term) {
    return term.outputRecipe(formals, grammarInterval);
  }));
};

pexprs.Extend.prototype.outputRecipe = function(formals, grammarInterval) {
  var extension = this.terms[0]; // [extension, orginal]
  return extension.outputRecipe(formals, grammarInterval);
};

pexprs.Seq.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'seq',
    getMetaInfo(this, grammarInterval)
  ].concat(this.factors.map(function(factor) {
    return factor.outputRecipe(formals, grammarInterval);
  }));
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
    this.args.map(function(arg) {
      return arg.outputRecipe(formals, grammarInterval);
    })
  ];
};

pexprs.UnicodeChar.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'unicodeChar',
    getMetaInfo(this, grammarInterval),
    this.category
  ];
};

},{"./common":44,"./pexprs":64}],59:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
      this.terms.map(function(term) { return term.substituteParams(actuals); }));
};

pexprs.Seq.prototype.substituteParams = function(actuals) {
  return new pexprs.Seq(
      this.factors.map(function(factor) { return factor.substituteParams(actuals); }));
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
    var args = this.args.map(function(arg) { return arg.substituteParams(actuals); });
    return new pexprs.Apply(this.ruleName, args);
  }
};

},{"./common":44,"./pexprs":64}],60:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

var copyWithoutDuplicates = common.copyWithoutDuplicates;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function isRestrictedJSIdentifier(str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}

function resolveDuplicatedNames(argumentNameList) {
  // `count` is used to record the number of times each argument name occurs in the list,
  // this is useful for checking duplicated argument name. It maps argument names to ints.
  var count = Object.create(null);
  argumentNameList.forEach(function(argName) {
    count[argName] = (count[argName] || 0) + 1;
  });

  // Append subscripts ('_1', '_2', ...) to duplicate argument names.
  Object.keys(count).forEach(function(dupArgName) {
    if (count[dupArgName] <= 1) {
      return;
    }

    // This name shows up more than once, so add subscripts.
    var subscript = 1;
    argumentNameList.forEach(function(argName, idx) {
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
  var argName = this.from + '_to_' + this.to;
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
  var termArgNameLists = this.terms.map(function(term) {
    return term.toArgumentNameList(firstArgIndex, true);
  });

  var argumentNameList = [];
  var numArgs = termArgNameLists[0].length;
  for (var colIdx = 0; colIdx < numArgs; colIdx++) {
    var col = [];
    for (var rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
      col.push(termArgNameLists[rowIdx][colIdx]);
    }
    var uniqueNames = copyWithoutDuplicates(col);
    argumentNameList.push(uniqueNames.join('_or_'));
  }

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Seq.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  // Generate the argument name list, without worrying about duplicates.
  var argumentNameList = [];
  this.factors.forEach(function(factor) {
    var factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
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
  var argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck)
    .map(function(exprArgumentString) {
      return exprArgumentString[exprArgumentString.length - 1] === 's' ?
          exprArgumentString + 'es' :
          exprArgumentString + 's';
    });
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Opt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(function(argName) {
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

},{"./common":44,"./pexprs":64}],61:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
    var ps = this.args.map(function(arg) { return arg.toDisplayString(); });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toDisplayString = function() {
  return 'Unicode [' + this.category + '] character';
};

},{"./common":44,"./pexprs":64}],62:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');
var common = require('./common');
var pexprs = require('./pexprs');

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
  var description = this.expr === pexprs.any ?
      'nothing' :
      'not ' + this.expr.toFailure(grammar);
  return new Failure(this, description, 'description');
};

pexprs.Lookahead.prototype.toFailure = function(grammar) {
  return this.expr.toFailure(grammar);
};

pexprs.Apply.prototype.toFailure = function(grammar) {
  var description = grammar.rules[this.ruleName].description;
  if (!description) {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(this, description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(grammar) {
  return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};

pexprs.Alt.prototype.toFailure = function(grammar) {
  var fs = this.terms.map(function(t) { return t.toFailure(); });
  var description = '(' + fs.join(' or ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Seq.prototype.toFailure = function(grammar) {
  var fs = this.factors.map(function(f) { return f.toFailure(); });
  var description = '(' + fs.join(' ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Iter.prototype.toFailure = function(grammar) {
  var description = '(' + this.expr.toFailure() + this.operator + ')';
  return new Failure(this, description, 'description');
};

},{"./Failure":32,"./common":44,"./pexprs":64}],63:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

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
    '(' + this.terms.map(function(term) { return term.toString(); }).join(' | ') + ')';
};

pexprs.Seq.prototype.toString = function() {
  return this.factors.length === 1 ?
    this.factors[0].toString() :
    '(' + this.factors.map(function(factor) { return factor.toString(); }).join(' ') + ')';
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
    var ps = this.args.map(function(arg) { return arg.toString(); });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toString = function() {
  return '\\p{' + this.category + '}';
};

},{"./common":44,"./pexprs":64}],64:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var UnicodeCategories = require('../third_party/UnicodeCategories');
var common = require('./common');
var inherits = require('inherits');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

function PExpr() {
  throw new Error("PExpr cannot be instantiated -- it's abstract");
}

// Set the `source` property to the interval containing the source for this expression.
PExpr.prototype.withSource = function(interval) {
  if (interval) {
    this.source = interval.trimmed();
  }
  return this;
};

// Any

var any = Object.create(PExpr.prototype);

// End

var end = Object.create(PExpr.prototype);

// Terminals

function Terminal(obj) {
  this.obj = obj;
}
inherits(Terminal, PExpr);

// Ranges

function Range(from, to) {
  this.from = from;
  this.to = to;
}
inherits(Range, PExpr);

// Parameters

function Param(index) {
  this.index = index;
}
inherits(Param, PExpr);

// Alternation

function Alt(terms) {
  this.terms = terms;
}
inherits(Alt, PExpr);

// Extend is an implementation detail of rule extension

function Extend(superGrammar, name, body) {
  this.superGrammar = superGrammar;
  this.name = name;
  this.body = body;
  var origBody = superGrammar.rules[name].body;
  this.terms = [body, origBody];
}
inherits(Extend, Alt);

// Sequences

function Seq(factors) {
  this.factors = factors;
}
inherits(Seq, PExpr);

// Iterators and optionals

function Iter(expr) {
  this.expr = expr;
}
inherits(Iter, PExpr);

function Star(expr) {
  this.expr = expr;
}
inherits(Star, Iter);

function Plus(expr) {
  this.expr = expr;
}
inherits(Plus, Iter);

function Opt(expr) {
  this.expr = expr;
}
inherits(Opt, Iter);

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

function Not(expr) {
  this.expr = expr;
}
inherits(Not, PExpr);

function Lookahead(expr) {
  this.expr = expr;
}
inherits(Lookahead, PExpr);

// "Lexification"

function Lex(expr) {
  this.expr = expr;
}
inherits(Lex, PExpr);

// Rule application

function Apply(ruleName, optArgs) {
  this.ruleName = ruleName;
  this.args = optArgs || [];
}
inherits(Apply, PExpr);

Apply.prototype.isSyntactic = function() {
  return common.isSyntactic(this.ruleName);
};

// This method just caches the result of `this.toString()` in a non-enumerable property.
Apply.prototype.toMemoKey = function() {
  if (!this._memoKey) {
    Object.defineProperty(this, '_memoKey', {value: this.toString()});
  }
  return this._memoKey;
};

// Unicode character

function UnicodeChar(category) {
  this.category = category;
  this.pattern = UnicodeCategories[category];
}
inherits(UnicodeChar, PExpr);

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

},{"../third_party/UnicodeCategories":67,"./common":44,"./pexprs-allowsSkippingPrecedingSpace":48,"./pexprs-assertAllApplicationsAreValid":49,"./pexprs-assertChoicesHaveUniformArity":50,"./pexprs-assertIteratedExprsAreNotNullable":51,"./pexprs-check":52,"./pexprs-eval":53,"./pexprs-generateExample":54,"./pexprs-getArity":55,"./pexprs-introduceParams":56,"./pexprs-isNullable":57,"./pexprs-outputRecipe":58,"./pexprs-substituteParams":59,"./pexprs-toArgumentNameList":60,"./pexprs-toDisplayString":61,"./pexprs-toFailure":62,"./pexprs-toString":63,"inherits":21}],65:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
  var maxLen = 0;
  var strings = arr.map(function(n) {
    var str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(function(s) { return common.padLeft(s, maxLen); });
}

// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
  var origDestLen = dest.length;
  var start = dest.slice(0, offset);
  var end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

var builtInRulesCallbacks = [];

// Since Grammar.BuiltInRules is bootstrapped, most of Ohm can't directly depend it.
// This function allows modules that do depend on the built-in rules to register a callback
// that will be called later in the initialization process.
exports.awaitBuiltInRules = function(cb) {
  builtInRulesCallbacks.push(cb);
};

exports.announceBuiltInRules = function(grammar) {
  builtInRulesCallbacks.forEach(function(cb) {
    cb(grammar);
  });
  builtInRulesCallbacks = null;
};

// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = function(str, offset) {
  var lineNum = 1;
  var colNum = 1;

  var currOffset = 0;
  var lineStartOffset = 0;

  var nextLine = null;
  var prevLine = null;
  var prevLineStartOffset = -1;

  while (currOffset < offset) {
    var c = str.charAt(currOffset++);
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
  var lineEndOffset = str.indexOf('\n', lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
                                        : str.slice(lineEndOffset, nextLineEndOffset);
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  }

  // Get the previous line.
  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset)
                  .replace(/\r?\n$/, '');  // Strip trailing EOL char(s).
  }

  // Get the target line, stripping a trailing carriage return if necessary.
  var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: line,
    prevLine: prevLine,
    nextLine: nextLine
  };
};

// Return a nicely-formatted string describing the line and column for the
// given offset in `str`.
exports.getLineAndColumnMessage = function(str, offset /* ...ranges */) {
  var repeatStr = common.repeatStr;

  var lineAndCol = exports.getLineAndColumn(str, offset);
  var sb = new common.StringBuffer();
  sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');

  // An array of the previous, current, and next line numbers as strings of equal length.
  var lineNumbers = padNumbersToEqualLength([
    lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
    lineAndCol.lineNum,
    lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ]);

  // Helper for appending formatting input lines to the buffer.
  function appendLine(num, content, prefix) {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
  }

  // Include the previous line for context if possible.
  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  }
  // Line that the error occurred on.
  appendLine(1, lineAndCol.line, '> ');

  // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
  var lineLen = lineAndCol.line.length;
  var indicationLine = repeatStr(' ', lineLen + 1);
  var ranges = Array.prototype.slice.call(arguments, 2);
  for (var i = 0; i < ranges.length; ++i) {
    var startIdx = ranges[i][0];
    var endIdx = ranges[i][1];
    common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');

    var lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);

    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }
  var gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr(' ', gutterWidth));
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, '') + '\n');

  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return sb.contents();
};

},{"./common":44}],66:[function(require,module,exports){
/* global browserifyGlobalOhmVersion */

'use strict';

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see bin/build-debug.js).
module.exports = typeof browserifyGlobalOhmVersion === 'string'
    ? browserifyGlobalOhmVersion
    : require('../package.json').version;

},{"../package.json":29}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
const Ohm = require("ohm-js");
const OhmToAST = require("./to-ast").helper;

/**
 * Retrieves the last element of the array. Or null if the index
 * isn't within the array's bounds.
 *
 * @template T
 * @param {Array<T>} array
 * @returns {null | T}
 */
function last(array) {
  return array.length === 0 ? null : array[array.length - 1];
}

/**
 * An entry in the source cache, which allows computing the line/column
 * offsets in the source code without repeating the work all the time.
 */
class CacheEntry {
  constructor(source) {
    /**
     * The source code that this entry represents.
     * @type string
     */
    this.source = source;

    /**
     * A list of pre-computed line offsets.
     * @type Array<number>
     */
    this.lines = [];

    /**
     * A set of line offsets we've already found.
     * @type Set<number>
     */
    this.lineSet = new Set();
  }

  /**
   * Computes the line/column offsets for a given indexPoint.
   *
   * This is `O(nm)` in the worst case and `O(m)` in the best case,
   * with `n` being the number of characters in the source code we need to scan,
   * and `m` being the number of lines in the pre-computed line offsets.
   *
   * Line and column offsets are 0-based.
   *
   * @param {number} indexPoint
   * @returns {{ line: number, column: number }}
   */
  computePosition(indexPoint) {
    this._buildIndexes(indexPoint);
    let count = 0;
    let lastLine = 0;
    for (const line of this.lines) {
      if (line <= indexPoint) {
        lastLine = line + 1;
        count += 1;
      } else {
        break;
      }
    }

    return {
      line: count,
      column: Math.max(0, indexPoint - lastLine)
    };
  }

  /**
   * Builds the pre-computed array of line offsets up to `indexPoint`.
   *
   * @private
   * @param {number} indexPoint
   */
  _buildIndexes(indexPoint) {
    const source = this.source;
    const isNewline = c => c === "\n" || c === "\r";

    const startIndex = (last(this.lines) || -1) + 1;
    for (let index = startIndex; index <= indexPoint; ++index) {
      const c = source.charAt(index);
      if (isNewline(c)) {
        // We also need to handle Windows' newlines.
        if (c === "\r" && source.charAt(index + 1) === "\n") {
          index += 1;
        }
        if (!this.lineSet.has(index)) {
          this.lines.push(index);
          this.lineSet.add(index);
        }
      }
    }
  }
}

/**
 * A source cache allows a mapping from multiple sources to
 * cache entries of source positions.
 */
class SourceCache {
  constructor() {
    /**
     * The caches we have available, with the source code as key.
     *
     * @type Map<string, CacheEntry>
     */
    this.cache = new Map();
  }

  /**
   * Computes the start and end line/column offsets from a start/end
   * index offset pair, for the given source code.
   *
   * @param {string} source
   * @param {{ start: number, end: number }} offset
   * @returns {{ start: LineOffset, end: LineOffset }}
   */
  computePosition(source, offset) {
    let cache = this.cache.get(source);
    if (cache == null) {
      cache = new CacheEntry(source);
      this.cache.set(source, cache);
    }

    return {
      start: cache.computePosition(offset.start),
      end: cache.computePosition(offset.end)
    };
  }
}

/**
 * A global cache of source positions.
 */
const globalCache = new SourceCache();

/**
 * A structure that holds the position of a CST node in the source code,
 * and allows lazily computing the line/column offsets.
 */
class Position {
  constructor(data, { filename = null }) {
    /**
     * The original source where this CST node was found.
     * @type string
     */
    this.sourceString = data.sourceString;

    /**
     * The initial character offset of this node.
     * @type number
     */
    this.startIndex = data.startIdx;

    /**
     * The final character offset of this node.
     * @type number
     */
    this.endIndex = data.endIdx;

    /**
     * The starting line/column offset of this node (if computed).
     * @type LineOffset | null
     */
    this.startPosition = null;

    /**
     * The final line/column offset of this node (if computed).
     * @type LineOffset | null
     */
    this.endPosition = null;

    /**
     * The filename from which this source was parsed.
     * @type string | null
     */
    this.filename = filename;
  }

  /**
   * Returns the absolute character offsets for this node.
   * @returns {{ start: number, end: number }}
   */
  offset() {
    return {
      start: this.startIndex,
      end: this.endIndex
    };
  }

  /**
   * Returns the line/column offsets for this node, computing it if
   * that hasn't been done yet.
   *
   * @returns {{ start: LineOffset, end: LineOffset }}
   */
  position() {
    if (this.startPosition == null || this.endPosition == null) {
      const { start, end } = globalCache.computePosition(
        this.sourceString,
        this.offset()
      );
      this.startPosition = start;
      this.endPosition = end;
    }

    return {
      start: this.startPosition,
      end: this.endPosition
    };
  }

  /**
   * Returns the source slice for this node.
   *
   * @returns {string}
   */
  get sourceSlice() {
    return this.sourceString.slice(this.startIndex, this.endIndex);
  }
}

/**
 * Constructs an Ohm parser from the given Ohm grammar source, and CST->AST
 * bindings.
 *
 * @param {string} code
 * @param {object} bindings
 * @returns {(source: string, rule: string | undefined) => AST}
 */
function makeParser(code, bindings) {
  const grammar = Ohm.grammar(code);

  const parse = (source, rule, { filename }) => {
    const match = grammar.match(source, rule);
    if (match.failed()) {
      return [false, match.message];
    }

    const visitor = Object.keys(bindings)
      .map(x => {
        const args = Array.from(
          { length: bindings[x].length - 1 },
          (_, i) => `$${i}`
        );
        const fn = new Function(
          "fn",
          `return function (${args.join(", ")}) { return fn(this, ${args.join(
            ", "
          )}) }`
        )((ctx, ...args) => {
          const meta = {
            children: args.map(x => new Position(x.source, { filename })),
            source: new Position(ctx.source, { filename })
          };
          return bindings[x](meta, ...args.map(x => x.toAST(ctx.args.mapping)));
        });
        return {
          [x]: fn
        };
      })
      .reduce((a, b) => Object.assign(a, b), {});

    return [true, OhmToAST(match, visitor)];
  };

  return parse;
}

module.exports = {
  makeParser
};

},{"./to-ast":70,"ohm-js":46}],70:[function(require,module,exports){
// This code is based on Ohm's built-in toAST semantics
// with a slight change on how lexical rules without a
// semantic action defined are handled. This allows
// lexical rules to be handled by semantic actions as well
// in non-confusing ways.

// Original from https://github.com/harc/ohm/blob/master/extras/semantics-toAST.js
// MIT licensed, Copyright (c) 2014-2016 Alessandro Warth and the Ohm project contributors.

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require("ohm-js/src/pexprs");
var MatchResult = require("ohm-js/src/MatchResult");
var Grammar = require("ohm-js/src/Grammar");
var extend = require("util-extend");

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var defaultOperation = {
  _terminal: function() {
    return this.primitiveValue;
  },

  _nonterminal: function(children) {
    var ctorName = this._node.ctorName;
    var mapping = this.args.mapping;

    // without customization
    if (!mapping.hasOwnProperty(ctorName)) {
      // intermediate node
      if (
        this._node instanceof pexprs.Alt ||
        this._node instanceof pexprs.Apply
      ) {
        return children[0].toAST(mapping);
      }

      // lexical rule
      if (this.isLexical()) {
        if (children.length === 1) {
          return children[0].toAST(mapping);
        } else {
          return this.sourceString;
        }
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      var realChildren = children.filter(function(child) {
        return !child.isTerminal();
      });
      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      }

      // rest: terms with multiple children
    }

    // direct forward
    if (typeof mapping[ctorName] === "number") {
      return children[mapping[ctorName]].toAST(mapping);
    }

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    var propMap = mapping[ctorName] || children;
    var node = {
      type: ctorName
    };
    for (var prop in propMap) {
      var mappedProp = mapping[ctorName] && mapping[ctorName][prop];
      if (typeof mappedProp === "number") {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if (
        typeof mappedProp === "string" ||
        typeof mappedProp === "boolean" ||
        mappedProp === null
      ) {
        // primitive value
        node[prop] = mappedProp;
      } else if (
        typeof mappedProp === "object" &&
        mappedProp instanceof Number
      ) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === "function") {
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

  _iter: function(children) {
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

  listOf: function(node) {
    if (node.children.length === 0) {
      return [];
    } else if (node.children.length === 1) {
      return [node.children[0].toAST(this.args.mapping)];
    } else {
      const [first, _, rest] = node.children;
      return [first.toAST(this.args.mapping)].concat(
        rest.toAST(this.args.mapping)
      );
    }
  },

  NonemptyListOf: function(first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(
      rest.toAST(this.args.mapping)
    );
  },

  EmptyListOf: function() {
    return [];
  }
};

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
function toAST(res, mapping) {
  if (!(res instanceof MatchResult) || res.failed()) {
    throw new Error(
      "toAST() expects a succesfull MatchResult as first parameter"
    );
  }

  mapping = extend({}, mapping);
  var operation = extend({}, defaultOperation);
  for (var termName in mapping) {
    if (typeof mapping[termName] === "function") {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  var g = res._cst.grammar;
  var s = g.createSemantics().addOperation("toAST(mapping)", operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error("semanticsToAST() expects a Grammar as parameter");
  }

  return g.createSemantics().addOperation("toAST(mapping)", defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};

},{"ohm-js/src/Grammar":33,"ohm-js/src/MatchResult":37,"ohm-js/src/pexprs":64,"util-extend":68}]},{},[69])(69)
});


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FSharpResult$2": () => (/* binding */ FSharpResult$2),
/* harmony export */   "FSharpResult$2$reflection": () => (/* binding */ FSharpResult$2$reflection),
/* harmony export */   "Result_Map": () => (/* binding */ Result_Map),
/* harmony export */   "Result_MapError": () => (/* binding */ Result_MapError),
/* harmony export */   "Result_Bind": () => (/* binding */ Result_Bind),
/* harmony export */   "FSharpChoice$2": () => (/* binding */ FSharpChoice$2),
/* harmony export */   "FSharpChoice$2$reflection": () => (/* binding */ FSharpChoice$2$reflection),
/* harmony export */   "FSharpChoice$3": () => (/* binding */ FSharpChoice$3),
/* harmony export */   "FSharpChoice$3$reflection": () => (/* binding */ FSharpChoice$3$reflection),
/* harmony export */   "FSharpChoice$4": () => (/* binding */ FSharpChoice$4),
/* harmony export */   "FSharpChoice$4$reflection": () => (/* binding */ FSharpChoice$4$reflection),
/* harmony export */   "FSharpChoice$5": () => (/* binding */ FSharpChoice$5),
/* harmony export */   "FSharpChoice$5$reflection": () => (/* binding */ FSharpChoice$5$reflection),
/* harmony export */   "FSharpChoice$6": () => (/* binding */ FSharpChoice$6),
/* harmony export */   "FSharpChoice$6$reflection": () => (/* binding */ FSharpChoice$6$reflection),
/* harmony export */   "FSharpChoice$7": () => (/* binding */ FSharpChoice$7),
/* harmony export */   "FSharpChoice$7$reflection": () => (/* binding */ FSharpChoice$7$reflection),
/* harmony export */   "Choice_makeChoice1Of2": () => (/* binding */ Choice_makeChoice1Of2),
/* harmony export */   "Choice_makeChoice2Of2": () => (/* binding */ Choice_makeChoice2Of2),
/* harmony export */   "Choice_tryValueIfChoice1Of2": () => (/* binding */ Choice_tryValueIfChoice1Of2),
/* harmony export */   "Choice_tryValueIfChoice2Of2": () => (/* binding */ Choice_tryValueIfChoice2Of2)
/* harmony export */ });
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _Reflection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);




class FSharpResult$2 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Ok", "Error"];
    }
}

function FSharpResult$2$reflection(gen0, gen1) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpResult`2", [gen0, gen1], FSharpResult$2, () => [[["ResultValue", gen0]], [["ErrorValue", gen1]]]);
}

function Result_Map(mapping, result) {
    if (result.tag === 0) {
        return new FSharpResult$2(0, mapping(result.fields[0]));
    }
    else {
        return new FSharpResult$2(1, result.fields[0]);
    }
}

function Result_MapError(mapping, result) {
    if (result.tag === 0) {
        return new FSharpResult$2(0, result.fields[0]);
    }
    else {
        return new FSharpResult$2(1, mapping(result.fields[0]));
    }
}

function Result_Bind(binder, result) {
    if (result.tag === 0) {
        return binder(result.fields[0]);
    }
    else {
        return new FSharpResult$2(1, result.fields[0]);
    }
}

class FSharpChoice$2 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of2", "Choice2Of2"];
    }
}

function FSharpChoice$2$reflection(gen0, gen1) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`2", [gen0, gen1], FSharpChoice$2, () => [[["Item", gen0]], [["Item", gen1]]]);
}

class FSharpChoice$3 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of3", "Choice2Of3", "Choice3Of3"];
    }
}

function FSharpChoice$3$reflection(gen0, gen1, gen2) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`3", [gen0, gen1, gen2], FSharpChoice$3, () => [[["Item", gen0]], [["Item", gen1]], [["Item", gen2]]]);
}

class FSharpChoice$4 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of4", "Choice2Of4", "Choice3Of4", "Choice4Of4"];
    }
}

function FSharpChoice$4$reflection(gen0, gen1, gen2, gen3) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`4", [gen0, gen1, gen2, gen3], FSharpChoice$4, () => [[["Item", gen0]], [["Item", gen1]], [["Item", gen2]], [["Item", gen3]]]);
}

class FSharpChoice$5 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of5", "Choice2Of5", "Choice3Of5", "Choice4Of5", "Choice5Of5"];
    }
}

function FSharpChoice$5$reflection(gen0, gen1, gen2, gen3, gen4) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`5", [gen0, gen1, gen2, gen3, gen4], FSharpChoice$5, () => [[["Item", gen0]], [["Item", gen1]], [["Item", gen2]], [["Item", gen3]], [["Item", gen4]]]);
}

class FSharpChoice$6 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of6", "Choice2Of6", "Choice3Of6", "Choice4Of6", "Choice5Of6", "Choice6Of6"];
    }
}

function FSharpChoice$6$reflection(gen0, gen1, gen2, gen3, gen4, gen5) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`6", [gen0, gen1, gen2, gen3, gen4, gen5], FSharpChoice$6, () => [[["Item", gen0]], [["Item", gen1]], [["Item", gen2]], [["Item", gen3]], [["Item", gen4]], [["Item", gen5]]]);
}

class FSharpChoice$7 extends _Types_js__WEBPACK_IMPORTED_MODULE_0__.Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Choice1Of7", "Choice2Of7", "Choice3Of7", "Choice4Of7", "Choice5Of7", "Choice6Of7", "Choice7Of7"];
    }
}

function FSharpChoice$7$reflection(gen0, gen1, gen2, gen3, gen4, gen5, gen6) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_1__.union_type)("FSharp.Core.FSharpChoice`7", [gen0, gen1, gen2, gen3, gen4, gen5, gen6], FSharpChoice$7, () => [[["Item", gen0]], [["Item", gen1]], [["Item", gen2]], [["Item", gen3]], [["Item", gen4]], [["Item", gen5]], [["Item", gen6]]]);
}

function Choice_makeChoice1Of2(x) {
    return new FSharpChoice$2(0, x);
}

function Choice_makeChoice2Of2(x) {
    return new FSharpChoice$2(1, x);
}

function Choice_tryValueIfChoice1Of2(x) {
    if (x.tag === 0) {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(x.fields[0]);
    }
    else {
        return void 0;
    }
}

function Choice_tryValueIfChoice2Of2(x) {
    if (x.tag === 1) {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(x.fields[0]);
    }
    else {
        return void 0;
    }
}



/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Some": () => (/* binding */ Some),
/* harmony export */   "some": () => (/* binding */ some),
/* harmony export */   "value": () => (/* binding */ value),
/* harmony export */   "ofNullable": () => (/* binding */ ofNullable),
/* harmony export */   "toNullable": () => (/* binding */ toNullable),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "toArray": () => (/* binding */ toArray),
/* harmony export */   "defaultArg": () => (/* binding */ defaultArg),
/* harmony export */   "defaultArgWith": () => (/* binding */ defaultArgWith),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "map2": () => (/* binding */ map2),
/* harmony export */   "map3": () => (/* binding */ map3),
/* harmony export */   "bind": () => (/* binding */ bind),
/* harmony export */   "tryOp": () => (/* binding */ tryOp)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

// Using a class here for better compatibility with TS files importing Some
class Some {
    constructor(value) {
        this.value = value;
    }
    toJSON() {
        return this.value;
    }
    // Don't add "Some" for consistency with erased options
    toString() {
        return String(this.value);
    }
    GetHashCode() {
        return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.structuralHash)(this.value);
    }
    Equals(other) {
        if (other == null) {
            return false;
        }
        else {
            return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.equals)(this.value, other instanceof Some ? other.value : other);
        }
    }
    CompareTo(other) {
        if (other == null) {
            return 1;
        }
        else {
            return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.compare)(this.value, other instanceof Some ? other.value : other);
        }
    }
}
function some(x) {
    return x == null || x instanceof Some ? new Some(x) : x;
}
function value(x) {
    if (x == null) {
        throw new Error("Option has no value");
    }
    else {
        return x instanceof Some ? x.value : x;
    }
}
function ofNullable(x) {
    // This will fail with unit probably, an alternative would be:
    // return x === null ? undefined : (x === undefined ? new Some(x) : x);
    return x == null ? undefined : x;
}
function toNullable(x) {
    return x == null ? null : value(x);
}
function flatten(x) {
    return x == null ? undefined : value(x);
}
function toArray(opt) {
    return (opt == null) ? [] : [value(opt)];
}
function defaultArg(opt, defaultValue) {
    return (opt != null) ? value(opt) : defaultValue;
}
function defaultArgWith(opt, defThunk) {
    return (opt != null) ? value(opt) : defThunk();
}
function filter(predicate, opt) {
    return (opt != null) ? (predicate(value(opt)) ? opt : undefined) : opt;
}
function map(mapping, opt) {
    return (opt != null) ? some(mapping(value(opt))) : undefined;
}
function map2(mapping, opt1, opt2) {
    return (opt1 != null && opt2 != null) ? mapping(value(opt1), value(opt2)) : undefined;
}
function map3(mapping, opt1, opt2, opt3) {
    return (opt1 != null && opt2 != null && opt3 != null) ? mapping(value(opt1), value(opt2), value(opt3)) : undefined;
}
function bind(binder, opt) {
    return opt != null ? binder(value(opt)) : undefined;
}
function tryOp(op, arg) {
    try {
        return some(op(arg));
    }
    catch (_a) {
        return undefined;
    }
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ident": () => (/* binding */ ident),
/* harmony export */   "enumerate": () => (/* binding */ enumerate),
/* harmony export */   "genParam": () => (/* binding */ genParam),
/* harmony export */   "genParams": () => (/* binding */ genParams),
/* harmony export */   "genTypeApp": () => (/* binding */ genTypeApp),
/* harmony export */   "genField": () => (/* binding */ genField),
/* harmony export */   "genFields": () => (/* binding */ genFields),
/* harmony export */   "genFieldNames": () => (/* binding */ genFieldNames),
/* harmony export */   "genFieldInit": () => (/* binding */ genFieldInit),
/* harmony export */   "generateType": () => (/* binding */ generateType),
/* harmony export */   "genRecord": () => (/* binding */ genRecord),
/* harmony export */   "genTypePattern": () => (/* binding */ genTypePattern),
/* harmony export */   "genTypePatterns": () => (/* binding */ genTypePatterns),
/* harmony export */   "genVariantTags": () => (/* binding */ genVariantTags),
/* harmony export */   "genThisProjection": () => (/* binding */ genThisProjection),
/* harmony export */   "genThisProjections": () => (/* binding */ genThisProjections),
/* harmony export */   "genTaggedThisProjections": () => (/* binding */ genTaggedThisProjections),
/* harmony export */   "genVariant": () => (/* binding */ genVariant),
/* harmony export */   "getVariantNames": () => (/* binding */ getVariantNames),
/* harmony export */   "genVariantGetter": () => (/* binding */ genVariantGetter),
/* harmony export */   "getVariantFullname": () => (/* binding */ getVariantFullname),
/* harmony export */   "genInitAsserts": () => (/* binding */ genInitAsserts),
/* harmony export */   "genInitAssert": () => (/* binding */ genInitAssert),
/* harmony export */   "genAssert": () => (/* binding */ genAssert),
/* harmony export */   "genTypeAssert": () => (/* binding */ genTypeAssert),
/* harmony export */   "generateTypes": () => (/* binding */ generateTypes),
/* harmony export */   "topType": () => (/* binding */ topType),
/* harmony export */   "builtinVisitors": () => (/* binding */ builtinVisitors),
/* harmony export */   "isImmaterial": () => (/* binding */ isImmaterial),
/* harmony export */   "genVisitorBinder": () => (/* binding */ genVisitorBinder),
/* harmony export */   "genVisitorParams": () => (/* binding */ genVisitorParams),
/* harmony export */   "resolveVisitorBinder": () => (/* binding */ resolveVisitorBinder),
/* harmony export */   "resolveVisitorBinders": () => (/* binding */ resolveVisitorBinders),
/* harmony export */   "genBinderRecordBinder": () => (/* binding */ genBinderRecordBinder),
/* harmony export */   "genBinderRecord": () => (/* binding */ genBinderRecord),
/* harmony export */   "genExpr": () => (/* binding */ genExpr),
/* harmony export */   "genVisitorEffect": () => (/* binding */ genVisitorEffect),
/* harmony export */   "isSingletonRule": () => (/* binding */ isSingletonRule),
/* harmony export */   "genAltVisitor": () => (/* binding */ genAltVisitor),
/* harmony export */   "genRuleVisitor": () => (/* binding */ genRuleVisitor),
/* harmony export */   "genVisitor": () => (/* binding */ genVisitor),
/* harmony export */   "genVisitors": () => (/* binding */ genVisitors),
/* harmony export */   "generateAstVisitor": () => (/* binding */ generateAstVisitor),
/* harmony export */   "prelude": () => (/* binding */ prelude),
/* harmony export */   "generate": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _fable_fable_library_3_1_5_Array_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var _fable_fable_library_3_1_5_Set_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var _fable_fable_library_3_1_5_Util_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(29);
/* harmony import */ var _OhmCodegen_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(30);








function ident(n) {
    return n;
}

function enumerate(xs) {
    return (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.zip)((0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.rangeNumber)(1, 1, (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.length)(xs)), xs);
}

function genParam(p) {
    return p;
}

function genParams(ps) {
    if (ps.length === 0) {
        return "";
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\u003c%P()\u003e", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((p) => genParam(p), ps))]));
    }
}

function genTypeApp(t_mut) {
    genTypeApp:
    while (true) {
        const t = t_mut;
        switch (t.tag) {
            case 1: {
                const ps = t.fields[1];
                const n_1 = t.fields[0];
                if (ps.length === 0) {
                    t_mut = n_1;
                    continue genTypeApp;
                }
                else {
                    const ps_1 = (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((t_1) => genTypeApp(t_1), ps));
                    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()\u003c%P()\u003e", [genTypeApp(n_1), ps_1]));
                }
            }
            case 2: {
                return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P().%P()", [genTypeApp(t.fields[0]), t.fields[1]]));
            }
            case 3: {
                return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()[]", [genTypeApp(t.fields[0])]));
            }
            case 4: {
                return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("(%P() | null)", [genTypeApp(t.fields[0])]));
            }
            default: {
                return t.fields[0];
            }
        }
        break;
    }
}

function genField(_arg1) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P(): %P()", [_arg1.fields[0], genTypeApp(_arg1.fields[1])]));
}

function genFields(fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg00$0040) => genField(arg00$0040), fs));
}

function genFieldNames(fs) {
    return (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((_arg1) => _arg1.fields[0], fs);
}

function genFieldInit(fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((f) => (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("readonly %P()", [genField(f)])), fs));
}

function generateType(t) {
    if (t.tag === 1) {
        const vs = t.fields[2];
        const ps_1 = t.fields[1];
        const n_1 = t.fields[0];
        const patTypes = genParams((0,_fable_fable_library_3_1_5_Array_js__WEBPACK_IMPORTED_MODULE_2__.append)(ps_1, ["$T"]));
        const variantGetters = (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg20$0040) => genVariantGetter(n_1, ps_1, arg20$0040), vs);
        const variants = (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg30$0040) => genVariant(n_1, ps_1, patTypes, arg30$0040), vs);
        const names = getVariantNames(vs);
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n      type $p_%P()%P() = {\r\n        %P()\r\n      }\r\n\r\n      export abstract class %P()%P() extends Node {\r\n        abstract tag: %P();\r\n        abstract match\u003c$T\u003e(p: $p_%P()%P()): $T;\r\n        %P()\r\n\r\n        static has_instance(x: any) {\r\n          return x instanceof %P();\r\n        }\r\n      }\r\n \r\n      %P()\r\n      ", [n_1, patTypes, genTypePatterns(n_1, patTypes, vs), n_1, genParams(ps_1), genVariantTags(vs), n_1, patTypes, (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("\n", variantGetters), n_1, (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("\n\n", variants)]));
    }
    else {
        return genRecord(t.fields[0], t.fields[1], t.fields[2]);
    }
}

function genRecord(n, ps, fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  export class %P()%P() extends Node {\r\n    readonly tag!: \"%P()\"\r\n\r\n    constructor(%P()) {\r\n      super();\r\n      Object.defineProperty(this, \"tag\", { value: \"%P()\" });\r\n      %P()\r\n    }\r\n\r\n    static has_instance(x: any) {\r\n      return x instanceof %P();\r\n    }\r\n  }\r\n  ", [n, genParams(ps), n, genFieldInit(fs), n, genInitAsserts(ps, fs), n]));
}

function genTypePattern(n, patTypes, _arg1) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  %P()(%P()): $T;\r\n  ", [_arg1.fields[0], genFields(_arg1.fields[1])]));
}

function genTypePatterns(n, patTypes, vs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg20$0040) => genTypePattern(n, patTypes, arg20$0040), vs));
}

function genVariantTags(vs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(" | ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((_arg1) => (JSON.stringify(_arg1.fields[0])), vs));
}

function genThisProjection(_arg2) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("this.%P()", [_arg2.fields[0]]));
}

function genThisProjections(fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg00$0040) => genThisProjection(arg00$0040), fs));
}

function genTaggedThisProjections(fs) {
    const vs = (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((arg00$0040) => genThisProjection(arg00$0040), fs);
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map2)((k, v) => (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P(): %P()", [k, v])), (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((_arg2) => _arg2.fields[0], fs), vs));
}

function genVariant(p, ps, patTypes, _arg3) {
    const n = _arg3.fields[0];
    const fs = _arg3.fields[1];
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  export class $$%P()$_%P()%P() extends %P()%P() {\r\n    readonly tag!: \"%P()\";\r\n\r\n    constructor(%P()) {\r\n      super();\r\n      Object.defineProperty(this, \"tag\", { value: \"%P()\" });\r\n      %P()\r\n    }\r\n\r\n    match\u003c$T\u003e(p: $p_%P()%P()): $T {\r\n      return p.%P()(%P());\r\n    }\r\n\r\n    static has_instance(x: any) {\r\n      return x instanceof %P();\r\n    }\r\n  }\r\n  ", [p, n, genParams(ps), p, genParams(ps), n, genFieldInit(fs), n, genInitAsserts(ps, fs), p, patTypes, n, genThisProjections(fs), getVariantFullname(p, n)]));
}

function getVariantNames(vs) {
    return (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((_arg3) => _arg3.fields[0], vs);
}

function genVariantGetter(p, ps, _arg4) {
    const n = _arg4.fields[0];
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  static get %P()() {\r\n    return %P()\r\n  }\r\n  ", [n, getVariantFullname(p, n)]));
}

function getVariantFullname(p, n) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("$$%P()$_%P()", [p, n]));
}

function genInitAsserts(ps, fs) {
    let ps_1;
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("; ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((ps_1 = (0,_fable_fable_library_3_1_5_Set_js__WEBPACK_IMPORTED_MODULE_3__.ofSeq)(ps, {
        Compare: (x, y) => (0,_fable_fable_library_3_1_5_Util_js__WEBPACK_IMPORTED_MODULE_4__.comparePrimitives)(x, y),
    }), (arg10$0040) => genInitAssert(ps_1, arg10$0040)), fs));
}

function genInitAssert(ps, _arg5) {
    return genAssert(ps, _arg5.fields[0], _arg5.fields[1]);
}

function genAssert(ps, x, t) {
    let pattern_matching_result;
    if (t.tag === 0) {
        if ((0,_fable_fable_library_3_1_5_Set_js__WEBPACK_IMPORTED_MODULE_3__.contains)(t.fields[0], ps)) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return "";
        }
        case 1: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("($assert_type\u003c%P()\u003e(%P(), \"%P()\", %P()))", [genTypeApp(t), x, genTypeApp(t), genTypeAssert(t)]));
        }
    }
}

function genTypeAssert(t_mut) {
    genTypeAssert:
    while (true) {
        const t = t_mut;
        if (t.tag === 1) {
            t_mut = t.fields[0];
            continue genTypeAssert;
        }
        else if (t.tag === 2) {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P().%P()", [genTypeAssert(t.fields[0]), t.fields[1]]));
        }
        else if (t.tag === 3) {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("$is_array(%P())", [genTypeAssert(t.fields[0])]));
        }
        else if (t.tag === 4) {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("$is_maybe(%P())", [genTypeAssert(t.fields[0])]));
        }
        else if (t.fields[0] === "string") {
            return "$is_type(\"string\")";
        }
        else if (t.fields[0] === "number") {
            return "$is_type(\"number\")";
        }
        else if (t.fields[0] === "bigint") {
            return "$is_type(\"bigint\")";
        }
        else if (t.fields[0] === "boolean") {
            return "$is_type(\"boolean\")";
        }
        else if (t.fields[0] === "null") {
            return "$is_null";
        }
        else {
            return t.fields[0];
        }
        break;
    }
}

function generateTypes(ts) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("\n\n", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((t) => generateType(t), ts));
}

function topType(g) {
    return genTypeApp(g.Top);
}

const builtinVisitors = "\r\n  _terminal(this: Ohm.Node): any {\r\n    return this.primitiveValue\r\n  },\r\n\r\n  _iter(this: any, children: Ohm.Node): any {\r\n    if (this._node.isOptional()) {\r\n      if (this.numChildren === 0) {\r\n        return null;\r\n      } else {\r\n        return children[0].toAST();\r\n      }\r\n    }\r\n    return children.map((x: any) =\u003e x.toAST());\r\n  },\r\n\r\n  nonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {\r\n    return [first.toAST(), ...rest.toAST()];\r\n  },\r\n\r\n  emptyListOf(): any {\r\n    return [];\r\n  },\r\n\r\n  NonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {\r\n    return [first.toAST(), ...rest.toAST()];\r\n  },\r\n\r\n  EmptyListOf(): any {\r\n    return [];\r\n  },\r\n  ";

function isImmaterial(t) {
    switch (t.tag) {
        case 5: {
            return true;
        }
        case 6: {
            return true;
        }
        default: {
            return false;
        }
    }
}

function genVisitorBinder(n, b) {
    let pattern_matching_result;
    if (b.tag === 0) {
        if (isImmaterial(b.fields[1])) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_5__.empty)();
        }
        case 1: {
            let pattern_matching_result_1;
            if (b.tag === 1) {
                if (isImmaterial(b.fields[0])) {
                    pattern_matching_result_1 = 0;
                }
                else {
                    pattern_matching_result_1 = 1;
                }
            }
            else {
                pattern_matching_result_1 = 1;
            }
            switch (pattern_matching_result_1) {
                case 0: {
                    return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_5__.empty)();
                }
                case 1: {
                    if (b.tag === 1) {
                        return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_5__.singleton)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("_%P(): Ohm.Node", [n])));
                    }
                    else {
                        return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_5__.singleton)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()$0: Ohm.Node", [b.fields[0]])));
                    }
                }
            }
        }
    }
}

function genVisitorParams(binders) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.collect)((tupledArg) => genVisitorBinder(tupledArg[0], tupledArg[1]), enumerate(binders)));
}

function resolveVisitorBinder(b) {
    if (b.tag === 1) {
        return "";
    }
    else {
        const name = b.fields[0];
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("const %P() = %P()$0.toAST()", [name, name]));
    }
}

function resolveVisitorBinders(binders) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("; ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((b) => resolveVisitorBinder(b), binders));
}

function genBinderRecordBinder(binder) {
    if (binder.tag === 1) {
        return "";
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P(), ", [binder.fields[0]]));
    }
}

function genBinderRecord(binders) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((binder) => genBinderRecordBinder(binder), binders));
}

function genExpr(e) {
    switch (e.tag) {
        case 1: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("(new (%P())(%P()))", [genExpr(e.fields[0]), (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((e_1) => genExpr(e_1), e.fields[1]))]));
        }
        case 2: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("((%P()).%P())", [genExpr(e.fields[0]), e.fields[1]]));
        }
        case 3: {
            return ident(e.fields[0]);
        }
        case 4: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("[%P()]", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((e_2) => genExpr(e_2), e.fields[0]))]));
        }
        case 5: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("[%P(), ...%P()]", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((e_3) => genExpr(e_3), e.fields[0])), genExpr(e.fields[1])]));
        }
        case 6: {
            return "null";
        }
        default: {
            return "$meta(this)";
        }
    }
}

function genVisitorEffect(n, expr) {
    if (expr != null) {
        return genExpr(expr);
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("(() =\u003e { throw new Error(`Undefined rule %P()`) })()", [n]));
    }
}

function isSingletonRule(b) {
    if (b.Terms.length === 1) {
        return b.Expr == null;
    }
    else {
        return false;
    }
}

function genAltVisitor(tk, n, i, b) {
    if (tk) {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n    %P()_alt%P()(this: Ohm.Node, %P()): any {\r\n      return this.sourceString;\r\n    },\r\n    ", [n, i, genVisitorParams(b.Terms)]));
    }
    else if (isSingletonRule(b)) {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n    %P()_alt%P()(this: Ohm.Node, %P()): any {\r\n      return this.children[0].toAST();\r\n    },\r\n    ", [n, i, genVisitorParams(b.Terms)]));
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n    %P()_alt%P()(this: Ohm.Node, %P()): any {\r\n      %P()\r\n      return %P()\r\n    },\r\n    ", [n, i, genVisitorParams(b.Terms), resolveVisitorBinders(b.Terms), genVisitorEffect(n, b.Expr)]));
    }
}

function genRuleVisitor(tk, n, b) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  %P()(x: Ohm.Node): any {\r\n    return x.toAST();\r\n  },\r\n  ", [n])) + (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((tupledArg) => genAltVisitor(tk, n, tupledArg[0], tupledArg[1]), enumerate(b)));
}

function genVisitor(rule) {
    switch (rule.tag) {
        case 1: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[3]);
        }
        case 2: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[3]);
        }
        default: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[4]);
        }
    }
}

function genVisitors(g) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((rule) => genVisitor(rule), g.Rules));
}

function generateAstVisitor(g) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  { \r\n    %P()\r\n    %P()\r\n  }\r\n  ", [builtinVisitors, genVisitors(g)]));
}

const prelude = "\r\nconst inspect = Symbol.for(\u0027nodejs.util.inspect.custom\u0027);\r\n\r\ntype Result\u003cA\u003e =\r\n  { ok: true, value: A }\r\n| { ok: false, error: string };\r\n\r\nexport abstract class Node {}\r\n\r\nexport class Meta {\r\n  constructor(readonly interval: Ohm.Interval) {}\r\n\r\n  static has_instance(x: any) {\r\n    return x instanceof Meta;\r\n  }\r\n\r\n  get position() {\r\n    const { lineNum, colNum } = OhmUtil.getLineAndColumn(\r\n      (this.interval as any).sourceString,\r\n      this.interval.startIdx\r\n    );\r\n    return {\r\n      line: lineNum,\r\n      column: colNum,\r\n    };\r\n  }\r\n\r\n  get range() {\r\n    return {\r\n      start: this.interval.startIdx,\r\n      end: this.interval.endIdx,\r\n    };\r\n  }\r\n\r\n  get source_slice() {\r\n    return this.interval.contents;\r\n  }\r\n\r\n  get formatted_position_message() {\r\n    return this.interval.getLineAndColumnMessage();\r\n  }\r\n\r\n  [inspect]() {\r\n    return this.position;\r\n  }\r\n}\r\n\r\nfunction $meta(x: Ohm.Node): Meta {\r\n  return new Meta(x.source);\r\n}\r\n\r\ntype Typed =\r\n  ((_: any) =\u003e boolean)\r\n| { has_instance(x: any): boolean };\r\n\r\nfunction $check_type(f: Typed) {\r\n  return (x: any) =\u003e {\r\n    if (typeof (f as any).has_instance === \"function\") {\r\n      return (f as any).has_instance(x);\r\n    } else {\r\n      return (f as any)(x);\r\n    }\r\n  }\r\n}\r\n\r\nfunction $is_type(t: string) {\r\n  return (x: any) =\u003e {\r\n    return typeof x === t;\r\n  };\r\n}\r\n\r\nfunction $is_array(f: Typed) {\r\n  return (x: any) =\u003e {\r\n    return Array.isArray(x) \u0026\u0026 x.every($check_type(f));\r\n  };\r\n}\r\n\r\nfunction $is_maybe(f: Typed) {\r\n  return (x: any) =\u003e {\r\n    return x === null || $check_type(f)(x);\r\n  };\r\n}\r\n\r\nfunction $is_null(x: any) {\r\n  return x === null;\r\n}\r\n\r\nfunction $assert_type\u003cT\u003e(x: any, t: string, f: Typed): asserts x is T {\r\n  if (!$check_type(f)(x)) {\r\n    throw new TypeError(`Expected ${t}, but got ${$inspect(x)}`);\r\n  }\r\n}\r\n  ";

function generate(g) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  // This file is generated from Linguist\r\n  import * as Ohm from \"ohm-js\";\r\n  const OhmUtil = require(\"ohm-js/src/util\");\r\n  import { inspect as $inspect } from \"util\";\r\n\r\n  %P()\r\n\r\n  // == Type definitions ==============================================\r\n  %P()\r\n\r\n  // == Grammar definition ============================================\r\n  export const grammar = Ohm.grammar(%P())\r\n\r\n  // == Parsing =======================================================\r\n  export function parse(source: string, rule: string): Result\u003c%P()\u003e {\r\n    const result = grammar.match(source, rule);\r\n    if (result.failed()) {\r\n      return { ok: false, error: result.message as string };\r\n    } else {\r\n      const ast = toAst(result);\r\n      %P()\r\n      return { ok: true, value: ast };\r\n    }\r\n  }\r\n\r\n  export const semantics = grammar.createSemantics();\r\n  export const toAstVisitor = (%P());\r\n  semantics.addOperation(\"toAST()\", toAstVisitor);\r\n\r\n  export function toAst(result: Ohm.MatchResult) {\r\n    return semantics(result).toAST();\r\n  }\r\n  ", [prelude, generateTypes(g.Types), JSON.stringify((0,_OhmCodegen_js__WEBPACK_IMPORTED_MODULE_6__.generateGrammar)(g)), topType(g), genAssert((0,_fable_fable_library_3_1_5_Set_js__WEBPACK_IMPORTED_MODULE_3__.empty)({
        Compare: (x, y) => (0,_fable_fable_library_3_1_5_Util_js__WEBPACK_IMPORTED_MODULE_4__.comparePrimitives)(x, y),
    }), "ast", g.Top), generateAstVisitor(g)]));
}

//# sourceMappingURL=Codegen.js.map


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Enumerator": () => (/* binding */ Enumerator),
/* harmony export */   "getEnumerator": () => (/* binding */ getEnumerator),
/* harmony export */   "toIterator": () => (/* binding */ toIterator),
/* harmony export */   "ofArray": () => (/* binding */ ofArray),
/* harmony export */   "allPairs": () => (/* binding */ allPairs),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "average": () => (/* binding */ average),
/* harmony export */   "averageBy": () => (/* binding */ averageBy),
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "collect": () => (/* binding */ collect),
/* harmony export */   "choose": () => (/* binding */ choose),
/* harmony export */   "compareWith": () => (/* binding */ compareWith),
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "enumerateFromFunctions": () => (/* binding */ enumerateFromFunctions),
/* harmony export */   "enumerateWhile": () => (/* binding */ enumerateWhile),
/* harmony export */   "enumerateThenFinally": () => (/* binding */ enumerateThenFinally),
/* harmony export */   "enumerateUsing": () => (/* binding */ enumerateUsing),
/* harmony export */   "exactlyOne": () => (/* binding */ exactlyOne),
/* harmony export */   "except": () => (/* binding */ except),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "exists2": () => (/* binding */ exists2),
/* harmony export */   "forAll": () => (/* binding */ forAll),
/* harmony export */   "forAll2": () => (/* binding */ forAll2),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "where": () => (/* binding */ where),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "foldBack": () => (/* binding */ foldBack),
/* harmony export */   "fold2": () => (/* binding */ fold2),
/* harmony export */   "foldBack2": () => (/* binding */ foldBack2),
/* harmony export */   "tryHead": () => (/* binding */ tryHead),
/* harmony export */   "head": () => (/* binding */ head),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "initializeInfinite": () => (/* binding */ initializeInfinite),
/* harmony export */   "tryItem": () => (/* binding */ tryItem),
/* harmony export */   "item": () => (/* binding */ item),
/* harmony export */   "iterate": () => (/* binding */ iterate),
/* harmony export */   "iterate2": () => (/* binding */ iterate2),
/* harmony export */   "iterateIndexed": () => (/* binding */ iterateIndexed),
/* harmony export */   "iterateIndexed2": () => (/* binding */ iterateIndexed2),
/* harmony export */   "isEmpty": () => (/* binding */ isEmpty),
/* harmony export */   "tryLast": () => (/* binding */ tryLast),
/* harmony export */   "last": () => (/* binding */ last),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapIndexed": () => (/* binding */ mapIndexed),
/* harmony export */   "indexed": () => (/* binding */ indexed),
/* harmony export */   "map2": () => (/* binding */ map2),
/* harmony export */   "mapIndexed2": () => (/* binding */ mapIndexed2),
/* harmony export */   "map3": () => (/* binding */ map3),
/* harmony export */   "mapFold": () => (/* binding */ mapFold),
/* harmony export */   "mapFoldBack": () => (/* binding */ mapFoldBack),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "maxBy": () => (/* binding */ maxBy),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "minBy": () => (/* binding */ minBy),
/* harmony export */   "pairwise": () => (/* binding */ pairwise),
/* harmony export */   "rangeChar": () => (/* binding */ rangeChar),
/* harmony export */   "rangeLong": () => (/* binding */ rangeLong),
/* harmony export */   "rangeDecimal": () => (/* binding */ rangeDecimal),
/* harmony export */   "rangeNumber": () => (/* binding */ rangeNumber),
/* harmony export */   "readOnly": () => (/* binding */ readOnly),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "reduceBack": () => (/* binding */ reduceBack),
/* harmony export */   "replicate": () => (/* binding */ replicate),
/* harmony export */   "reverse": () => (/* binding */ reverse),
/* harmony export */   "scan": () => (/* binding */ scan),
/* harmony export */   "scanBack": () => (/* binding */ scanBack),
/* harmony export */   "skip": () => (/* binding */ skip),
/* harmony export */   "skipWhile": () => (/* binding */ skipWhile),
/* harmony export */   "sortWith": () => (/* binding */ sortWith),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "sumBy": () => (/* binding */ sumBy),
/* harmony export */   "tail": () => (/* binding */ tail),
/* harmony export */   "take": () => (/* binding */ take),
/* harmony export */   "truncate": () => (/* binding */ truncate),
/* harmony export */   "takeWhile": () => (/* binding */ takeWhile),
/* harmony export */   "tryFind": () => (/* binding */ tryFind),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "tryFindBack": () => (/* binding */ tryFindBack),
/* harmony export */   "findBack": () => (/* binding */ findBack),
/* harmony export */   "tryFindIndex": () => (/* binding */ tryFindIndex),
/* harmony export */   "findIndex": () => (/* binding */ findIndex),
/* harmony export */   "tryFindIndexBack": () => (/* binding */ tryFindIndexBack),
/* harmony export */   "findIndexBack": () => (/* binding */ findIndexBack),
/* harmony export */   "tryPick": () => (/* binding */ tryPick),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "unfold": () => (/* binding */ unfold),
/* harmony export */   "zip": () => (/* binding */ zip),
/* harmony export */   "zip3": () => (/* binding */ zip3),
/* harmony export */   "windowed": () => (/* binding */ windowed),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _Decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _Long_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);




class Enumerator {
    constructor(iter) {
        this.iter = iter;
    }
    ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
        return this.current;
    }
    ["System.Collections.IEnumerator.get_Current"]() {
        return this.current;
    }
    ["System.Collections.IEnumerator.MoveNext"]() {
        const cur = this.iter.next();
        this.current = cur.value;
        return !cur.done;
    }
    ["System.Collections.IEnumerator.Reset"]() {
        throw new Error("JS iterators cannot be reset");
    }
    Dispose() {
        return;
    }
}
function getEnumerator(o) {
    return typeof o.GetEnumerator === "function"
        ? o.GetEnumerator()
        : new Enumerator(o[Symbol.iterator]());
}
function toIterator(en) {
    return {
        [Symbol.iterator]() { return this; },
        next() {
            const hasNext = en["System.Collections.IEnumerator.MoveNext"]();
            const current = hasNext ? en["System.Collections.IEnumerator.get_Current"]() : undefined;
            return { done: !hasNext, value: current };
        },
    };
}
// export function toIterable<T>(en: IEnumerable<T>): Iterable<T> {
//   return {
//     [Symbol.iterator]() {
//       return toIterator(en.GetEnumerator());
//     },
//   };
// }
function __failIfNone(res) {
    if (res == null) {
        throw new Error("Seq did not contain any matching element");
    }
    return (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.value)(res);
}
class Seq {
    constructor(f) {
        this.f = f;
    }
    [Symbol.iterator]() { return new Seq(this.f); }
    next() {
        var _a;
        this.iter = (_a = this.iter) !== null && _a !== void 0 ? _a : this.f();
        return this.iter.next();
    }
    toString() {
        return "seq [" + Array.from(this).join("; ") + "]";
    }
}
function makeSeq(f) {
    return new Seq(f);
}
function isArrayOrBufferView(xs) {
    return Array.isArray(xs) || ArrayBuffer.isView(xs);
}
function ofArray(xs) {
    if (Array.isArray(xs)) {
        return delay(() => xs);
    }
    else {
        return delay(() => unfold((i) => i != null && i < xs.length ? [xs[i], i + 1] : undefined, 0));
    }
}
function allPairs(xs, ys) {
    let firstEl = true;
    const ysCache = [];
    return collect((x) => {
        if (firstEl) {
            firstEl = false;
            return map((y) => {
                ysCache.push(y);
                return [x, y];
            }, ys);
        }
        else {
            return ysCache.map((y) => [x, y]);
            // return map(function (i) {
            //     return [x, ysCache[i]];
            // }, rangeNumber(0, 1, ysCache.length - 1));
        }
    }, xs);
}
function append(xs, ys) {
    return delay(() => {
        let firstDone = false;
        const i = xs[Symbol.iterator]();
        let iters = [i, undefined];
        return unfold(() => {
            var _a, _b;
            let cur;
            if (!firstDone) {
                cur = (_a = iters[0]) === null || _a === void 0 ? void 0 : _a.next();
                if (cur != null && !cur.done) {
                    return [cur.value, iters];
                }
                else {
                    firstDone = true;
                    iters = [undefined, ys[Symbol.iterator]()];
                }
            }
            cur = (_b = iters[1]) === null || _b === void 0 ? void 0 : _b.next();
            return cur != null && !cur.done ? [cur.value, iters] : undefined;
        }, iters);
    });
}
function average(xs, averager) {
    let count = 0;
    const total = fold((acc, x) => {
        count++;
        return averager.Add(acc, x);
    }, averager.GetZero(), xs);
    return averager.DivideByInt(total, count);
}
function averageBy(f, xs, averager) {
    let count = 0;
    const total = fold((acc, x) => {
        count++;
        return averager.Add(acc, f(x));
    }, averager.GetZero(), xs);
    return averager.DivideByInt(total, count);
}
function concat(xs) {
    return delay(() => {
        const iter = xs[Symbol.iterator]();
        let output;
        return unfold((innerIter) => {
            let hasFinished = false;
            while (!hasFinished) {
                if (innerIter == null) {
                    const cur = iter.next();
                    if (!cur.done) {
                        innerIter = cur.value[Symbol.iterator]();
                    }
                    else {
                        hasFinished = true;
                    }
                }
                else {
                    const cur = innerIter.next();
                    if (!cur.done) {
                        output = cur.value;
                        hasFinished = true;
                    }
                    else {
                        innerIter = undefined;
                    }
                }
            }
            return innerIter != null ? [output, innerIter] : undefined;
        }, undefined);
    });
}
function collect(f, xs) {
    return concat(map(f, xs));
}
function choose(f, xs) {
    return delay(() => unfold((iter) => {
        let cur = iter.next();
        while (!cur.done) {
            const y = f(cur.value);
            if (y != null) {
                return [(0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.value)(y), iter];
            }
            cur = iter.next();
        }
        return undefined;
    }, xs[Symbol.iterator]()));
}
function compareWith(f, xs, ys) {
    if (xs === ys) {
        return 0;
    }
    let cur1;
    let cur2;
    let c = 0;
    for (const iter1 = xs[Symbol.iterator](), iter2 = ys[Symbol.iterator]();;) {
        cur1 = iter1.next();
        cur2 = iter2.next();
        if (cur1.done || cur2.done) {
            break;
        }
        c = f(cur1.value, cur2.value);
        if (c !== 0) {
            break;
        }
    }
    return (c !== 0) ? c : (cur1.done && !cur2.done) ? -1 : (!cur1.done && cur2.done) ? 1 : 0;
}
function delay(f) {
    return makeSeq(() => f()[Symbol.iterator]());
}
function empty() {
    return delay(() => []);
}
function singleton(y) {
    return delay(() => [y]);
}
function enumerateFromFunctions(factory, moveNext, current) {
    return delay(() => unfold((e) => moveNext(e) ? [current(e), e] : undefined, factory()));
}
function enumerateWhile(cond, xs) {
    return concat(unfold(() => cond() ? [xs, true] : undefined, undefined));
}
function enumerateThenFinally(xs, finalFn) {
    return delay(() => {
        let iter;
        try {
            iter = xs[Symbol.iterator]();
        }
        catch (err) {
            try {
                return empty();
            }
            finally {
                finalFn();
            }
        }
        return unfold((it) => {
            try {
                const cur = it.next();
                return !cur.done ? [cur.value, it] : undefined;
            }
            catch (err) {
                return undefined;
            }
            finally {
                finalFn();
            }
        }, iter);
    });
}
function enumerateUsing(disp, work) {
    let isDisposed = false;
    const disposeOnce = () => {
        if (!isDisposed) {
            isDisposed = true;
            disp.Dispose();
        }
    };
    try {
        return enumerateThenFinally(work(disp), disposeOnce);
    }
    catch (err) {
        return void 0;
    }
    finally {
        disposeOnce();
    }
}
function exactlyOne(xs) {
    const iter = xs[Symbol.iterator]();
    const fst = iter.next();
    if (fst.done) {
        throw new Error("Seq was empty");
    }
    const snd = iter.next();
    if (!snd.done) {
        throw new Error("Seq had multiple items");
    }
    return fst.value;
}
function except(itemsToExclude, source) {
    const exclusionItems = Array.from(itemsToExclude);
    const testIsNotInExclusionItems = (element) => !exclusionItems.some((excludedItem) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_3__.equals)(excludedItem, element));
    return filter(testIsNotInExclusionItems, source);
}
function exists(f, xs) {
    let cur;
    for (const iter = xs[Symbol.iterator]();;) {
        cur = iter.next();
        if (cur.done) {
            break;
        }
        if (f(cur.value)) {
            return true;
        }
    }
    return false;
}
function exists2(f, xs, ys) {
    let cur1;
    let cur2;
    for (const iter1 = xs[Symbol.iterator](), iter2 = ys[Symbol.iterator]();;) {
        cur1 = iter1.next();
        cur2 = iter2.next();
        if (cur1.done || cur2.done) {
            break;
        }
        if (f(cur1.value, cur2.value)) {
            return true;
        }
    }
    return false;
}
function forAll(f, xs) {
    return !exists((x) => !f(x), xs);
}
function forAll2(f, xs, ys) {
    return !exists2((x, y) => !f(x, y), xs, ys);
}
function contains(i, xs) {
    return exists((x) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_3__.equals)(x, i), xs);
}
function filter(f, xs) {
    return delay(() => unfold((iter) => {
        let cur = iter.next();
        while (!cur.done) {
            if (f(cur.value)) {
                return [cur.value, iter];
            }
            cur = iter.next();
        }
        return undefined;
    }, xs[Symbol.iterator]()));
}
function where(f, xs) {
    return filter(f, xs);
}
function fold(f, acc, xs) {
    if (isArrayOrBufferView(xs)) {
        return xs.reduce(f, acc);
    }
    else {
        let cur;
        for (let i = 0, iter = xs[Symbol.iterator]();; i++) {
            cur = iter.next();
            if (cur.done) {
                break;
            }
            acc = f(acc, cur.value, i);
        }
        return acc;
    }
}
function foldBack(f, xs, acc) {
    const arr = isArrayOrBufferView(xs) ? xs : Array.from(xs);
    for (let i = arr.length - 1; i >= 0; i--) {
        acc = f(arr[i], acc, i);
    }
    return acc;
}
function fold2(f, acc, xs, ys) {
    const iter1 = xs[Symbol.iterator]();
    const iter2 = ys[Symbol.iterator]();
    let cur1;
    let cur2;
    for (let i = 0;; i++) {
        cur1 = iter1.next();
        cur2 = iter2.next();
        if (cur1.done || cur2.done) {
            break;
        }
        acc = f(acc, cur1.value, cur2.value, i);
    }
    return acc;
}
function foldBack2(f, xs, ys, acc) {
    const ar1 = isArrayOrBufferView(xs) ? xs : Array.from(xs);
    const ar2 = isArrayOrBufferView(ys) ? ys : Array.from(ys);
    for (let i = ar1.length - 1; i >= 0; i--) {
        acc = f(ar1[i], ar2[i], acc, i);
    }
    return acc;
}
function tryHead(xs) {
    const iter = xs[Symbol.iterator]();
    const cur = iter.next();
    return cur.done ? undefined : (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(cur.value);
}
function head(xs) {
    return __failIfNone(tryHead(xs));
}
function initialize(n, f) {
    return delay(() => unfold((i) => i < n ? [f(i), i + 1] : undefined, 0));
}
function initializeInfinite(f) {
    return delay(() => unfold((i) => [f(i), i + 1], 0));
}
function tryItem(i, xs) {
    if (i < 0) {
        return undefined;
    }
    if (isArrayOrBufferView(xs)) {
        return i < xs.length ? (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(xs[i]) : undefined;
    }
    for (let j = 0, iter = xs[Symbol.iterator]();; j++) {
        const cur = iter.next();
        if (cur.done) {
            break;
        }
        if (j === i) {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(cur.value);
        }
    }
    return undefined;
}
function item(i, xs) {
    return __failIfNone(tryItem(i, xs));
}
function iterate(f, xs) {
    fold((_, x) => (f(x), undefined), undefined, xs);
}
function iterate2(f, xs, ys) {
    fold2((_, x, y) => (f(x, y), undefined), undefined, xs, ys);
}
function iterateIndexed(f, xs) {
    fold((_, x, i) => (f(i !== null && i !== void 0 ? i : 0, x), undefined), undefined, xs);
}
function iterateIndexed2(f, xs, ys) {
    fold2((_, x, y, i) => (f(i !== null && i !== void 0 ? i : 0, x, y), undefined), undefined, xs, ys);
}
function isEmpty(xs) {
    const i = xs[Symbol.iterator]();
    return i.next().done;
}
function tryLast(xs) {
    return isEmpty(xs) ? undefined : (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(reduce((_, x) => x, xs));
}
function last(xs) {
    return __failIfNone(tryLast(xs));
}
function length(xs) {
    return isArrayOrBufferView(xs)
        ? xs.length
        : fold((acc, _x) => acc + 1, 0, xs);
}
function map(f, xs) {
    return delay(() => unfold((iter) => {
        const cur = iter.next();
        return !cur.done ? [f(cur.value), iter] : undefined;
    }, xs[Symbol.iterator]()));
}
function mapIndexed(f, xs) {
    return delay(() => {
        let i = 0;
        return unfold((iter) => {
            const cur = iter.next();
            return !cur.done ? [f(i++, cur.value), iter] : undefined;
        }, xs[Symbol.iterator]());
    });
}
function indexed(xs) {
    return mapIndexed((i, x) => [i, x], xs);
}
function map2(f, xs, ys) {
    return delay(() => {
        const iter1 = xs[Symbol.iterator]();
        const iter2 = ys[Symbol.iterator]();
        return unfold(() => {
            const cur1 = iter1.next();
            const cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(cur1.value, cur2.value), undefined] : undefined;
        }, undefined);
    });
}
function mapIndexed2(f, xs, ys) {
    return delay(() => {
        let i = 0;
        const iter1 = xs[Symbol.iterator]();
        const iter2 = ys[Symbol.iterator]();
        return unfold(() => {
            const cur1 = iter1.next();
            const cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(i++, cur1.value, cur2.value), undefined] : undefined;
        }, undefined);
    });
}
function map3(f, xs, ys, zs) {
    return delay(() => {
        const iter1 = xs[Symbol.iterator]();
        const iter2 = ys[Symbol.iterator]();
        const iter3 = zs[Symbol.iterator]();
        return unfold(() => {
            const cur1 = iter1.next();
            const cur2 = iter2.next();
            const cur3 = iter3.next();
            return !cur1.done && !cur2.done && !cur3.done ? [f(cur1.value, cur2.value, cur3.value), undefined] : undefined;
        }, undefined);
    });
}
function mapFold(f, acc, xs, transform) {
    const result = [];
    let r;
    let cur;
    for (let i = 0, iter = xs[Symbol.iterator]();; i++) {
        cur = iter.next();
        if (cur.done) {
            break;
        }
        [r, acc] = f(acc, cur.value);
        result.push(r);
    }
    return transform !== void 0 ? [transform(result), acc] : [result, acc];
}
function mapFoldBack(f, xs, acc, transform) {
    const arr = isArrayOrBufferView(xs) ? xs : Array.from(xs);
    const result = [];
    let r;
    for (let i = arr.length - 1; i >= 0; i--) {
        [r, acc] = f(arr[i], acc);
        result.push(r);
    }
    return transform !== void 0 ? [transform(result), acc] : [result, acc];
}
function max(xs, comparer) {
    const compareFn = comparer != null ? comparer.Compare : _Util_js__WEBPACK_IMPORTED_MODULE_3__.compare;
    return reduce((acc, x) => compareFn(acc, x) === 1 ? acc : x, xs);
}
function maxBy(f, xs, comparer) {
    const compareFn = comparer != null ? comparer.Compare : _Util_js__WEBPACK_IMPORTED_MODULE_3__.compare;
    return reduce((acc, x) => compareFn(f(acc), f(x)) === 1 ? acc : x, xs);
}
function min(xs, comparer) {
    const compareFn = comparer != null ? comparer.Compare : _Util_js__WEBPACK_IMPORTED_MODULE_3__.compare;
    return reduce((acc, x) => compareFn(acc, x) === -1 ? acc : x, xs);
}
function minBy(f, xs, comparer) {
    const compareFn = comparer != null ? comparer.Compare : _Util_js__WEBPACK_IMPORTED_MODULE_3__.compare;
    return reduce((acc, x) => compareFn(f(acc), f(x)) === -1 ? acc : x, xs);
}
function pairwise(xs) {
    return delay(() => {
        const iter = xs[Symbol.iterator]();
        const cur = iter.next();
        if (cur.done) {
            return empty();
        }
        const hd = cur.value;
        const tl = tail(xs);
        const ys = scan(([_, last], next) => [last, next], [hd, hd], tl);
        return skip(1, ys);
    });
}
function rangeChar(first, last) {
    const firstNum = first.charCodeAt(0);
    const lastNum = last.charCodeAt(0);
    return delay(() => unfold((x) => x <= lastNum ? [String.fromCharCode(x), x + 1] : undefined, firstNum));
}
function rangeLong(first, step, last, unsigned) {
    const stepFn = (0,_Long_js__WEBPACK_IMPORTED_MODULE_1__.makeRangeStepFunction)(step, last, unsigned);
    return delay(() => unfold(stepFn, first));
}
function rangeDecimal(first, step, last) {
    const stepFn = (0,_Decimal_js__WEBPACK_IMPORTED_MODULE_0__.makeRangeStepFunction)(step, last);
    return delay(() => unfold(stepFn, first));
}
function rangeNumber(first, step, last) {
    if (step === 0) {
        throw new Error("Step cannot be 0");
    }
    return delay(() => unfold((x) => step > 0 && x <= last || step < 0 && x >= last ? [x, x + step] : undefined, first));
}
function readOnly(xs) {
    return map((x) => x, xs);
}
function reduce(f, xs) {
    if (isArrayOrBufferView(xs)) {
        return xs.reduce(f);
    }
    const iter = xs[Symbol.iterator]();
    let cur = iter.next();
    if (cur.done) {
        throw new Error("Seq was empty");
    }
    let acc = cur.value;
    while (true) {
        cur = iter.next();
        if (cur.done) {
            break;
        }
        acc = f(acc, cur.value);
    }
    return acc;
}
function reduceBack(f, xs) {
    const ar = isArrayOrBufferView(xs) ? xs : Array.from(xs);
    if (ar.length === 0) {
        throw new Error("Seq was empty");
    }
    let acc = ar[ar.length - 1];
    for (let i = ar.length - 2; i >= 0; i--) {
        acc = f(ar[i], acc, i);
    }
    return acc;
}
function replicate(n, x) {
    return initialize(n, () => x);
}
function reverse(xs) {
    const ar = isArrayOrBufferView(xs) ? xs.slice(0) : Array.from(xs);
    return ofArray(ar.reverse());
}
function scan(f, seed, xs) {
    return delay(() => {
        const iter = xs[Symbol.iterator]();
        return unfold((acc) => {
            if (acc == null) {
                return [seed, seed];
            }
            const cur = iter.next();
            if (!cur.done) {
                acc = f(acc, cur.value);
                return [acc, acc];
            }
            return undefined;
        }, undefined);
    });
}
function scanBack(f, xs, seed) {
    return reverse(scan((acc, x) => f(x, acc), seed, reverse(xs)));
}
function skip(n, xs) {
    return makeSeq(() => {
        const iter = xs[Symbol.iterator]();
        for (let i = 1; i <= n; i++) {
            if (iter.next().done) {
                throw new Error("Seq has not enough elements");
            }
        }
        return iter;
    });
}
function skipWhile(f, xs) {
    return delay(() => {
        let hasPassed = false;
        return filter((x) => hasPassed || (hasPassed = !f(x)), xs);
    });
}
function sortWith(f, xs) {
    const ys = Array.from(xs);
    return ofArray(ys.sort(f));
}
function sum(xs, adder) {
    return fold((acc, x) => adder.Add(acc, x), adder.GetZero(), xs);
}
function sumBy(f, xs, adder) {
    return fold((acc, x) => adder.Add(acc, f(x)), adder.GetZero(), xs);
}
function tail(xs) {
    return skip(1, xs);
}
function take(n, xs, truncate = false) {
    return delay(() => {
        const iter = xs[Symbol.iterator]();
        return unfold((i) => {
            if (i < n) {
                const cur = iter.next();
                if (!cur.done) {
                    return [cur.value, i + 1];
                }
                if (!truncate) {
                    throw new Error("Seq has not enough elements");
                }
            }
            return undefined;
        }, 0);
    });
}
function truncate(n, xs) {
    return take(n, xs, true);
}
function takeWhile(f, xs) {
    return delay(() => {
        const iter = xs[Symbol.iterator]();
        return unfold(() => {
            const cur = iter.next();
            if (!cur.done && f(cur.value)) {
                return [cur.value, undefined];
            }
            return undefined;
        }, 0);
    });
}
function tryFind(f, xs, defaultValue) {
    for (let i = 0, iter = xs[Symbol.iterator]();; i++) {
        const cur = iter.next();
        if (cur.done) {
            break;
        }
        if (f(cur.value, i)) {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(cur.value);
        }
    }
    return defaultValue === void 0 ? undefined : (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.some)(defaultValue);
}
function find(f, xs) {
    return __failIfNone(tryFind(f, xs));
}
function tryFindBack(f, xs, defaultValue) {
    const arr = isArrayOrBufferView(xs) ? xs.slice(0) : Array.from(xs);
    return tryFind(f, arr.reverse(), defaultValue);
}
function findBack(f, xs) {
    return __failIfNone(tryFindBack(f, xs));
}
function tryFindIndex(f, xs) {
    for (let i = 0, iter = xs[Symbol.iterator]();; i++) {
        const cur = iter.next();
        if (cur.done) {
            break;
        }
        if (f(cur.value, i)) {
            return i;
        }
    }
    return undefined;
}
function findIndex(f, xs) {
    return __failIfNone(tryFindIndex(f, xs));
}
function tryFindIndexBack(f, xs) {
    const arr = isArrayOrBufferView(xs) ? xs.slice(0) : Array.from(xs);
    for (let i = arr.length - 1; i >= 0; i--) {
        if (f(arr[i], i)) {
            return i;
        }
    }
    return undefined;
}
function findIndexBack(f, xs) {
    return __failIfNone(tryFindIndexBack(f, xs));
}
function tryPick(f, xs) {
    for (let i = 0, iter = xs[Symbol.iterator]();; i++) {
        const cur = iter.next();
        if (cur.done) {
            break;
        }
        const y = f(cur.value, i);
        if (y != null) {
            return y;
        }
    }
    return undefined;
}
function pick(f, xs) {
    return __failIfNone(tryPick(f, xs));
}
function unfold(f, fst) {
    return makeSeq(() => {
        // Capture a copy of the first value in the closure
        // so the sequence is restarted every time, see #1230
        let acc = fst;
        const iter = {
            next() {
                const res = f(acc);
                if (res != null) {
                    const v = (0,_Option_js__WEBPACK_IMPORTED_MODULE_2__.value)(res);
                    if (v != null) {
                        acc = v[1];
                        return { done: false, value: v[0] };
                    }
                }
                return { done: true, value: undefined };
            },
        };
        return iter;
    });
}
function zip(xs, ys) {
    return map2((x, y) => [x, y], xs, ys);
}
function zip3(xs, ys, zs) {
    return map3((x, y, z) => [x, y, z], xs, ys, zs);
}
function windowed(windowSize, source) {
    if (windowSize <= 0) {
        throw new Error("windowSize must be positive");
    }
    return makeSeq(() => {
        let window = [];
        const iter = source[Symbol.iterator]();
        const iter2 = {
            next() {
                let cur;
                while (window.length < windowSize) {
                    if ((cur = iter.next()).done) {
                        return { done: true, value: undefined };
                    }
                    window.push(cur.value);
                }
                const value = window;
                window = window.slice(1);
                return { done: false, value };
            },
        };
        return iter2;
    });
}
function transpose(source) {
    return makeSeq(() => {
        const iters = Array.from(source, (x) => x[Symbol.iterator]());
        const iter = {
            next() {
                if (iters.length === 0) {
                    return { done: true, value: undefined }; // empty sequence
                }
                const results = Array.from(iters, (iter) => iter.next());
                if (results[0].done) {
                    if (!results.every((x) => x.done)) {
                        throw new Error("Sequences have different lengths");
                    }
                    return { done: true, value: undefined };
                }
                else {
                    if (!results.every((x) => !x.done)) {
                        throw new Error("Sequences have different lengths");
                    }
                    const values = results.map((x) => x.value);
                    return { done: false, value: values };
                }
            },
        };
        return iter;
    });
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "get_Zero": () => (/* binding */ get_Zero),
/* harmony export */   "get_One": () => (/* binding */ get_One),
/* harmony export */   "get_MinusOne": () => (/* binding */ get_MinusOne),
/* harmony export */   "get_MaxValue": () => (/* binding */ get_MaxValue),
/* harmony export */   "get_MinValue": () => (/* binding */ get_MinValue),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "abs": () => (/* binding */ abs),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "truncate": () => (/* binding */ truncate),
/* harmony export */   "ceiling": () => (/* binding */ ceiling),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "pow": () => (/* binding */ pow),
/* harmony export */   "sqrt": () => (/* binding */ sqrt),
/* harmony export */   "op_Addition": () => (/* binding */ op_Addition),
/* harmony export */   "op_Subtraction": () => (/* binding */ op_Subtraction),
/* harmony export */   "op_Multiply": () => (/* binding */ op_Multiply),
/* harmony export */   "op_Division": () => (/* binding */ op_Division),
/* harmony export */   "op_Modulus": () => (/* binding */ op_Modulus),
/* harmony export */   "op_UnaryNegation": () => (/* binding */ op_UnaryNegation),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "remainder": () => (/* binding */ remainder),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "toString": () => (/* binding */ toString),
/* harmony export */   "tryParse": () => (/* binding */ tryParse),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "toNumber": () => (/* binding */ toNumber),
/* harmony export */   "fromIntArray": () => (/* binding */ fromIntArray),
/* harmony export */   "fromInts": () => (/* binding */ fromInts),
/* harmony export */   "fromParts": () => (/* binding */ fromParts),
/* harmony export */   "getBits": () => (/* binding */ getBits),
/* harmony export */   "makeRangeStepFunction": () => (/* binding */ makeRangeStepFunction)
/* harmony export */ });
/* harmony import */ var _lib_big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default);
const get_Zero = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(0);
const get_One = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(1);
const get_MinusOne = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(-1);
const get_MaxValue = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default("79228162514264337593543950335");
const get_MinValue = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default("-79228162514264337593543950335");
function compare(x, y) {
    return x.cmp(y);
}
function equals(x, y) {
    return !x.cmp(y);
}
function abs(x) {
    return x.abs();
}
function round(x, digits = 0) {
    return x.round(digits, 2 /* ROUND_HALF_EVEN */);
}
function truncate(x) {
    return x.round(0, 0 /* ROUND_DOWN */);
}
function ceiling(x) {
    return x.round(0, x.cmp(0) >= 0 ? 3 /* ROUND_UP */ : 0 /* ROUND_DOWN */);
}
function floor(x) {
    return x.round(0, x.cmp(0) >= 0 ? 0 /* ROUND_DOWN */ : 3 /* ROUND_UP */);
}
function pow(x, n) {
    return x.pow(n);
}
function sqrt(x) {
    return x.sqrt();
}
function op_Addition(x, y) {
    return x.add(y);
}
function op_Subtraction(x, y) {
    return x.sub(y);
}
function op_Multiply(x, y) {
    return x.mul(y);
}
function op_Division(x, y) {
    return x.div(y);
}
function op_Modulus(x, y) {
    return x.mod(y);
}
function op_UnaryNegation(x) {
    const x2 = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(x);
    x2.s = -x2.s || 0;
    return x2;
}
const add = op_Addition;
const subtract = op_Subtraction;
const multiply = op_Multiply;
const divide = op_Division;
const remainder = op_Modulus;
const negate = op_UnaryNegation;
function toString(x) {
    return x.toString();
}
function tryParse(str, defValue) {
    try {
        defValue.contents = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(str.trim());
        return true;
    }
    catch (_a) {
        return false;
    }
}
function parse(str) {
    const defValue = new _Types_js__WEBPACK_IMPORTED_MODULE_1__.FSharpRef(get_Zero);
    if (tryParse(str, defValue)) {
        return defValue.contents;
    }
    else {
        throw new Error("Input string was not in a correct format.");
    }
}
function toNumber(x) {
    return +x;
}
function decimalToHex(dec, bitSize) {
    const hex = new Uint8Array(bitSize / 4 | 0);
    let hexCount = 1;
    for (let d = 0; d < dec.length; d++) {
        let value = dec[d];
        for (let i = 0; i < hexCount; i++) {
            const digit = hex[i] * 10 + value | 0;
            hex[i] = digit & 0xF;
            value = digit >> 4;
        }
        if (value !== 0) {
            hex[hexCount++] = value;
        }
    }
    return hex.slice(0, hexCount); // digits in reverse order
}
function hexToDecimal(hex, bitSize) {
    const dec = new Uint8Array(bitSize * 301 / 1000 + 1 | 0);
    let decCount = 1;
    for (let d = hex.length - 1; d >= 0; d--) {
        let carry = hex[d];
        for (let i = 0; i < decCount; i++) {
            const val = dec[i] * 16 + carry | 0;
            dec[i] = (val % 10) | 0;
            carry = (val / 10) | 0;
        }
        while (carry > 0) {
            dec[decCount++] = (carry % 10) | 0;
            carry = (carry / 10) | 0;
        }
    }
    return dec.slice(0, decCount); // digits in reverse order
}
function setInt32Bits(hexDigits, bits, offset) {
    for (let i = 0; i < 8; i++) {
        hexDigits[offset + i] = (bits >> (i * 4)) & 0xF;
    }
}
function getInt32Bits(hexDigits, offset) {
    let bits = 0;
    for (let i = 0; i < 8; i++) {
        bits = bits | (hexDigits[offset + i] << (i * 4));
    }
    return bits;
}
function fromIntArray(bits) {
    return fromInts(bits[0], bits[1], bits[2], bits[3]);
}
function fromInts(low, mid, high, signExp) {
    const isNegative = signExp < 0;
    const scale = (signExp >> 16) & 0x7F;
    return fromParts(low, mid, high, isNegative, scale);
}
function fromParts(low, mid, high, isNegative, scale) {
    const bitSize = 96;
    const hexDigits = new Uint8Array(bitSize / 4);
    setInt32Bits(hexDigits, low, 0);
    setInt32Bits(hexDigits, mid, 8);
    setInt32Bits(hexDigits, high, 16);
    const decDigits = hexToDecimal(hexDigits, bitSize);
    scale = scale & 0x7F;
    const big = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(0);
    big.c = Array.from(decDigits.reverse());
    big.e = decDigits.length - scale - 1;
    big.s = isNegative ? -1 : 1;
    const d = new _lib_big_js__WEBPACK_IMPORTED_MODULE_0__.default(big);
    return d;
}
function getBits(d) {
    const bitSize = 96;
    const decDigits = Uint8Array.from(d.c);
    const hexDigits = decimalToHex(decDigits, bitSize);
    const low = getInt32Bits(hexDigits, 0);
    const mid = getInt32Bits(hexDigits, 8);
    const high = getInt32Bits(hexDigits, 16);
    const decStr = d.toString();
    const dotPos = decStr.indexOf(".");
    const scale = dotPos < 0 ? 0 : decStr.length - dotPos - 1;
    const signExp = ((scale & 0x7F) << 16) | (d.s < 0 ? 0x80000000 : 0);
    return [low, mid, high, signExp];
}
function makeRangeStepFunction(step, last) {
    const stepComparedWithZero = step.cmp(get_Zero);
    if (stepComparedWithZero === 0) {
        throw new Error("The step of a range cannot be zero");
    }
    const stepGreaterThanZero = stepComparedWithZero > 0;
    return (x) => {
        const comparedWithLast = x.cmp(last);
        if ((stepGreaterThanZero && comparedWithLast <= 0)
            || (!stepGreaterThanZero && comparedWithLast >= 0)) {
            return [x, op_Addition(x, step)];
        }
        else {
            return undefined;
        }
    };
}


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Big": () => (/* binding */ Big),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Numeric_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
// https://github.com/MikeMcl/big.js/blob/01b3ce3a6b0ba7b42442ea48ec4ffc88d1669ec4/big.mjs
/* tslint:disable */


// The shared prototype object.
var P = {
    GetHashCode() { return (0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.combineHashCodes)([this.s, this.e].concat(this.c)); },
    Equals(x) { return !this.cmp(x); },
    CompareTo(x) { return this.cmp(x); },
    [_Numeric_js__WEBPACK_IMPORTED_MODULE_1__.symbol]() {
        const _this = this;
        return {
            multiply: y => _this.mul(y),
            toPrecision: sd => _this.toPrecision(sd),
            toExponential: dp => _this.toExponential(dp),
            toFixed: dp => _this.toFixed(dp),
            toHex: () => (Number(_this) >>> 0).toString(16),
        };
    }
};
/*
 *  big.js v5.2.2
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2018 Michael Mclaughlin <M8ch88l@gmail.com>
 *  https://github.com/MikeMcl/big.js/LICENCE
 */
/************************************** EDITABLE DEFAULTS *****************************************/
// The default values below must be integers within the stated ranges.
/*
 * The maximum number of decimal places (DP) of the results of operations involving division:
 * div and sqrt, and pow with negative exponents.
 */
var DP = 28, // 0 to MAX_DP
/*
 * The rounding mode (RM) used when rounding to the above decimal places.
 *
 *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
 *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
 *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
 *  3  Away from zero.                                  (ROUND_UP)
 */
RM = 1, // 0, 1, 2 or 3
// The maximum value of DP and Big.DP.
MAX_DP = 1E6, // 0 to 1000000
// The maximum magnitude of the exponent argument to the pow method.
MAX_POWER = 1E6, // 1 to 1000000
/*
 * The negative exponent (NE) at and beneath which toString returns exponential notation.
 * (JavaScript numbers: -7)
 * -1000000 is the minimum recommended exponent value of a Big.
 */
NE = -29, // 0 to -1000000
/*
 * The positive exponent (PE) at and above which toString returns exponential notation.
 * (JavaScript numbers: 21)
 * 1000000 is the maximum recommended exponent value of a Big.
 * (This limit is not enforced or checked.)
 */
PE = 29, // 0 to 1000000
/**************************************************************************************************/
// Error messages.
NAME = '[big.js] ', INVALID = NAME + 'Invalid ', INVALID_DP = INVALID + 'decimal places', INVALID_RM = INVALID + 'rounding mode', DIV_BY_ZERO = NAME + 'Division by zero', UNDEFINED = void 0, NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
/*
 * Create and return a Big constructor.
 *
 */
function _Big_() {
    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
        var x = this;
        // Enable constructor usage without new.
        if (!(x instanceof Big))
            return n === UNDEFINED ? _Big_() : new Big(n);
        // Duplicate.
        if (n instanceof Big) {
            x.s = n.s;
            x.e = n.e;
            x.c = n.c.slice();
            normalize(x);
        }
        else {
            parse(x, n);
        }
        /*
         * Retain a reference to this Big constructor, and shadow Big.prototype.constructor which
         * points to Object.
         */
        x.constructor = Big;
    }
    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.version = '5.2.2';
    return Big;
}
function normalize(x) {
    x = round(x, DP, 0);
    if (x.c.length > 1 && !x.c[0]) {
        let i = x.c.findIndex(x => x);
        x.c = x.c.slice(i);
        x.e = x.e - i;
    }
}
/*
 * Parse the number or string value passed to a Big constructor.
 *
 * x {Big} A Big number instance.
 * n {number|string} A numeric value.
 */
function parse(x, n) {
    var e, i, nl;
    // Minus zero?
    if (n === 0 && 1 / n < 0)
        n = '-0';
    else if (!NUMERIC.test(n += ''))
        throw Error(INVALID + 'number');
    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;
    // Decimal point?
    if ((e = n.indexOf('.')) > -1)
        n = n.replace('.', '');
    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {
        // Determine exponent.
        if (e < 0)
            e = i;
        e += +n.slice(i + 1);
        n = n.substring(0, i);
    }
    else if (e < 0) {
        // Integer.
        e = n.length;
    }
    nl = n.length;
    // Determine leading zeros before decimal point.
    for (i = 0; i < e && i < nl && n.charAt(i) == '0';)
        ++i;
    // older version (ignores decimal point).
    // // Determine leading zeros.
    // for (i = 0; i < nl && n.charAt(i) == '0';) ++i;
    if (i == nl) {
        // Zero.
        x.c = [x.e = 0];
    }
    else {
        x.e = e - i - 1;
        x.c = [];
        // Convert string to array of digits without leading zeros
        for (e = 0; i < nl;)
            x.c[e++] = +n.charAt(i++);
        // older version (doesn't keep trailing zeroes).
        // // Determine trailing zeros.
        // for (; nl > 0 && n.charAt(--nl) == '0';);
        // // Convert string to array of digits without leading/trailing zeros.
        // for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }
    x = round(x, Big.DP, Big.RM);
    return x;
}
/*
 * Round Big x to a maximum of dp decimal places using rounding mode rm.
 * Called by stringify, P.div, P.round and P.sqrt.
 *
 * x {Big} The Big to round.
 * dp {number} Integer, 0 to MAX_DP inclusive.
 * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
 * [more] {boolean} Whether the result of division was truncated.
 */
function round(x, dp, rm, more) {
    var xc = x.c, i = x.e + dp + 1;
    if (i < xc.length) {
        if (rm === 1) {
            // xc[i] is the digit after the digit that may be rounded up.
            more = xc[i] >= 5;
        }
        else if (rm === 2) {
            more = xc[i] > 5 || xc[i] == 5 &&
                (more || i < 0 || xc[i + 1] !== UNDEFINED || xc[i - 1] & 1);
        }
        else if (rm === 3) {
            const isZero = xc.findIndex((xci, idx) => idx >= i && xci > 0) < 0;
            more = more || !isZero;
        }
        else {
            more = false;
            if (rm !== 0)
                throw Error(INVALID_RM);
        }
        if (i < 1) {
            xc.length = 1;
            if (more) {
                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                x.e = -dp;
                xc[0] = 1;
            }
            else {
                // Zero.
                xc[0] = x.e = 0;
            }
        }
        else {
            // Remove any digits after the required decimal places.
            xc.length = i--;
            // Round up?
            if (more) {
                // Rounding up may mean the previous digit has to be rounded up.
                for (; ++xc[i] > 9;) {
                    xc[i] = 0;
                    if (!i--) {
                        ++x.e;
                        xc.unshift(1);
                    }
                }
            }
            // Remove trailing zeros.
            for (i = xc.length; !xc[--i];)
                xc.pop();
        }
    }
    else if (rm < 0 || rm > 3 || rm !== ~~rm) {
        throw Error(INVALID_RM);
    }
    return x;
}
/*
 * Return a string representing the value of Big x in normal or exponential notation.
 * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
 *
 * x {Big}
 * id? {number} Caller id.
 *         1 toExponential
 *         2 toFixed
 *         3 toPrecision
 *         4 valueOf
 * n? {number|undefined} Caller's argument.
 * k? {number|undefined}
 */
function stringify(x, id, n, k) {
    var e, s, Big = x.constructor, z = !x.c[0];
    if (n !== UNDEFINED) {
        if (n !== ~~n || n < (id == 3) || n > MAX_DP) {
            throw Error(id == 3 ? INVALID + 'precision' : INVALID_DP);
        }
        x = new Big(x);
        // The index of the digit that may be rounded up.
        n = k - x.e;
        // Round?
        if (x.c.length > ++k)
            round(x, n, Big.RM);
        // toFixed: recalculate k as x.e may have changed if value rounded up.
        if (id == 2)
            k = x.e + n + 1;
        // Append zeros?
        for (; x.c.length < k;)
            x.c.push(0);
    }
    e = x.e;
    s = x.c.join('');
    n = s.length;
    // Exponential notation?
    if (id != 2 && (id == 1 || id == 3 && k <= e || e <= Big.NE || e >= Big.PE)) {
        s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;
        // Normal notation.
    }
    else if (e < 0) {
        for (; ++e;)
            s = '0' + s;
        s = '0.' + s;
    }
    else if (e > 0) {
        if (++e > n)
            for (e -= n; e--;)
                s += '0';
        else if (e < n)
            s = s.slice(0, e) + '.' + s.slice(e);
    }
    else if (n > 1) {
        s = s.charAt(0) + '.' + s.slice(1);
    }
    return x.s < 0 && (!z || id == 4) ? '-' + s : s;
}
// Prototype/instance methods
/*
 * Return a new Big whose value is the absolute value of this Big.
 */
P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
};
/*
 * Return 1 if the value of this Big is greater than the value of Big y,
 *       -1 if the value of this Big is less than the value of Big y, or
 *        0 if they have the same value.
*/
P.cmp = function (y) {
    var isneg, Big = this.constructor, x = new Big(this), y = new Big(y), xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
    // Either zero?
    if (!xc[0] || !yc[0])
        return !xc[0] ? !yc[0] ? 0 : -j : i;
    // Signs differ?
    if (i != j)
        return i;
    isneg = i < 0;
    // Compare exponents.
    if (k != l)
        return k > l ^ isneg ? 1 : -1;
    // Compare digit by digit.
    j = Math.max(xc.length, yc.length);
    for (i = 0; i < j; i++) {
        k = i < xc.length ? xc[i] : 0;
        l = i < yc.length ? yc[i] : 0;
        if (k != l)
            return k > l ^ isneg ? 1 : -1;
    }
    return 0;
    // old version (doesn't compare well trailing zeroes, e.g. 1.0 with 1.00)
    // j = (k = xc.length) < (l = yc.length) ? k : l;
    // // Compare digit by digit.
    // for (i = -1; ++i < j;) {
    //   if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    // }
    // // Compare lengths.
    // return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};
/*
 * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
 * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.div = function (y) {
    var Big = this.constructor, x = new Big(this), y = new Big(y), a = x.c, // dividend
    b = y.c, // divisor
    k = x.s == y.s ? 1 : -1, dp = Big.DP;
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP)
        throw Error(INVALID_DP);
    // Divisor is zero?
    if (!b[0])
        throw Error(DIV_BY_ZERO);
    // Dividend is 0? Return +-0.
    if (!a[0])
        return new Big(k * 0);
    var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), // remainder
    rl = r.length, q = y, // quotient
    qc = q.c = [], qi = 0, d = dp + (q.e = x.e - y.e) + 1; // number of digits of the result
    q.s = k;
    k = d < 0 ? 0 : d;
    // Create version of divisor with leading zero.
    bz.unshift(0);
    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;)
        r.push(0);
    do {
        // n is how many times the divisor goes into current remainder.
        for (n = 0; n < 10; n++) {
            // Compare divisor and remainder.
            if (bl != (rl = r.length)) {
                cmp = bl > rl ? 1 : -1;
            }
            else {
                for (ri = -1, cmp = 0; ++ri < bl;) {
                    if (b[ri] != r[ri]) {
                        cmp = b[ri] > r[ri] ? 1 : -1;
                        break;
                    }
                }
            }
            // If divisor < remainder, subtract divisor from remainder.
            if (cmp < 0) {
                // Remainder can't be more than 1 digit longer than divisor.
                // Equalise lengths using divisor with extra leading zero?
                for (bt = rl == bl ? b : bz; rl;) {
                    if (r[--rl] < bt[rl]) {
                        ri = rl;
                        for (; ri && !r[--ri];)
                            r[ri] = 9;
                        --r[ri];
                        r[rl] += 10;
                    }
                    r[rl] -= bt[rl];
                }
                for (; !r[0];)
                    r.shift();
            }
            else {
                break;
            }
        }
        // Add the digit n to the result array.
        qc[qi++] = cmp ? n : ++n;
        // Update the remainder.
        if (r[0] && cmp)
            r[rl] = a[ai] || 0;
        else
            r = [a[ai]];
    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);
    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {
        // There can't be more than one zero.
        qc.shift();
        q.e--;
    }
    // Round?
    if (qi > d)
        round(q, dp, Big.RM, r[0] !== UNDEFINED);
    return q;
};
/*
 * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
 */
P.eq = function (y) {
    return !this.cmp(y);
};
/*
 * Return true if the value of this Big is greater than the value of Big y, otherwise return
 * false.
 */
P.gt = function (y) {
    return this.cmp(y) > 0;
};
/*
 * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
 * return false.
 */
P.gte = function (y) {
    return this.cmp(y) > -1;
};
/*
 * Return true if the value of this Big is less than the value of Big y, otherwise return false.
 */
P.lt = function (y) {
    return this.cmp(y) < 0;
};
/*
 * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
 * return false.
 */
P.lte = function (y) {
    return this.cmp(y) < 1;
};
/*
 * Return a new Big whose value is the value of this Big minus the value of Big y.
 */
P.minus = P.sub = function (y) {
    var i, j, t, xlty, Big = this.constructor, x = new Big(this), y = new Big(y), a = x.s, b = y.s;
    // Signs differ?
    if (a != b) {
        y.s = -b;
        return x.plus(y);
    }
    var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
    // Either zero?
    if (!xc[0] || !yc[0]) {
        // y is non-zero? x is non-zero? Or both are zero.
        return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
    }
    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {
        if (xlty = a < 0) {
            a = -a;
            t = xc;
        }
        else {
            ye = xe;
            t = yc;
        }
        t.reverse();
        for (b = a; b--;)
            t.push(0);
        t.reverse();
    }
    else {
        // Exponents equal. Check digit by digit.
        j = ((xlty = xc.length < yc.length) ? xc : yc).length;
        for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
                xlty = xc[b] < yc[b];
                break;
            }
        }
    }
    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
    }
    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0)
        for (; b--;)
            xc[i++] = 0;
    // Subtract yc from xc.
    for (b = i; j > a;) {
        if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i];)
                xc[i] = 9;
            --xc[i];
            xc[j] += 10;
        }
        xc[j] -= yc[j];
    }
    // Remove trailing zeros.
    for (; xc[--b] === 0;)
        xc.pop();
    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
        xc.shift();
        --ye;
    }
    if (!xc[0]) {
        // n - n = +0
        y.s = 1;
        // Result must be zero.
        xc = [ye = 0];
    }
    y.c = xc;
    y.e = ye;
    return y;
};
/*
 * Return a new Big whose value is the value of this Big modulo the value of Big y.
 */
P.mod = function (y) {
    var ygtx, Big = this.constructor, x = new Big(this), y = new Big(y), a = x.s, b = y.s;
    if (!y.c[0])
        throw Error(DIV_BY_ZERO);
    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;
    if (ygtx)
        return new Big(x);
    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;
    return this.minus(x.times(y));
};
/*
 * Return a new Big whose value is the value of this Big plus the value of Big y.
 */
P.plus = P.add = function (y) {
    var t, Big = this.constructor, x = new Big(this), y = new Big(y), a = x.s, b = y.s;
    // Signs differ?
    if (a != b) {
        y.s = -b;
        return x.minus(y);
    }
    var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
    // Either zero? y is non-zero? x is non-zero? Or both are zero.
    if (!xc[0] || !yc[0])
        return yc[0] ? y : new Big(xc[0] ? x : a * 0);
    xc = xc.slice();
    // Prepend zeros to equalise exponents.
    // Note: reverse faster than unshifts.
    if (a = xe - ye) {
        if (a > 0) {
            ye = xe;
            t = yc;
        }
        else {
            a = -a;
            t = xc;
        }
        t.reverse();
        for (; a--;)
            t.push(0);
        t.reverse();
    }
    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
        t = yc;
        yc = xc;
        xc = t;
    }
    a = yc.length;
    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (b = 0; a; xc[a] %= 10)
        b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    if (b) {
        xc.unshift(b);
        ++ye;
    }
    // Remove trailing zeros.
    for (a = xc.length; xc[--a] === 0;)
        xc.pop();
    y.c = xc;
    y.e = ye;
    return y;
};
/*
 * Return a Big whose value is the value of this Big raised to the power n.
 * If n is negative, round to a maximum of Big.DP decimal places using rounding
 * mode Big.RM.
 *
 * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
 */
P.pow = function (n) {
    var Big = this.constructor, x = new Big(this), y = new Big(1), one = new Big(1), isneg = n < 0;
    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER)
        throw Error(INVALID + 'exponent');
    if (isneg)
        n = -n;
    for (;;) {
        if (n & 1)
            y = y.times(x);
        n >>= 1;
        if (!n)
            break;
        x = x.times(x);
    }
    return isneg ? one.div(y) : y;
};
/*
 * Return a new Big whose value is the value of this Big rounded using rounding mode rm
 * to a maximum of dp decimal places, or, if dp is negative, to an integer which is a
 * multiple of 10**-dp.
 * If dp is not specified, round to 0 decimal places.
 * If rm is not specified, use Big.RM.
 *
 * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
 * rm? 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
 */
P.round = function (dp, rm) {
    var Big = this.constructor;
    if (dp === UNDEFINED)
        dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP)
        throw Error(INVALID_DP);
    return round(new Big(this), dp, rm === UNDEFINED ? Big.RM : rm);
};
/*
 * Return a new Big whose value is the square root of the value of this Big, rounded, if
 * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.sqrt = function () {
    var r, c, t, Big = this.constructor, x = new Big(this), s = x.s, e = x.e, half = new Big(0.5);
    // Zero?
    if (!x.c[0])
        return new Big(x);
    // Negative?
    if (s < 0)
        throw Error(NAME + 'No square root');
    // Estimate.
    s = Math.sqrt(x + '');
    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
        c = x.c.join('');
        if (!(c.length + e & 1))
            c += '0';
        s = Math.sqrt(c);
        e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
        r = new Big((s == 1 / 0 ? '1e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
    }
    else {
        r = new Big(s);
    }
    e = r.e + (Big.DP += 4);
    // Newton-Raphson iteration.
    do {
        t = r;
        r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));
    return round(r, Big.DP -= 4, Big.RM);
};
/*
 * Return a new Big whose value is the value of this Big times the value of Big y.
 */
P.times = P.mul = function (y) {
    var c, Big = this.constructor, x = new Big(this), y = new Big(y), xc = x.c, yc = y.c, a = xc.length, b = yc.length, i = x.e, j = y.e;
    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;
    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0])
        return new Big(y.s * 0);
    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;
    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
        c = xc;
        xc = yc;
        yc = c;
        j = a;
        a = b;
        b = j;
    }
    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;)
        c[j] = 0;
    // Multiply.
    // i is initially xc.length.
    for (i = b; i--;) {
        b = 0;
        // a is yc.length.
        for (j = a + i; j > i;) {
            // Current sum of products at this digit position, plus carry.
            b = c[j] + yc[i] * xc[j - i - 1] + b;
            c[j--] = b % 10;
            // carry
            b = b / 10 | 0;
        }
        c[j] = (c[j] + b) % 10;
    }
    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b)
        ++y.e;
    else
        c.shift();
    // Remove trailing zeros.
    for (i = c.length; !c[--i];)
        c.pop();
    y.c = c;
    return y;
};
/*
 * Return a string representing the value of this Big in exponential notation to dp fixed decimal
 * places and rounded using Big.RM.
 *
 * dp? {number} Integer, 0 to MAX_DP inclusive.
 */
P.toExponential = function (dp) {
    return stringify(this, 1, dp, dp);
};
/*
 * Return a string representing the value of this Big in normal notation to dp fixed decimal
 * places and rounded using Big.RM.
 *
 * dp? {number} Integer, 0 to MAX_DP inclusive.
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 */
P.toFixed = function (dp) {
    return stringify(this, 2, dp, this.e + dp);
};
/*
 * Return a string representing the value of this Big rounded to sd significant digits using
 * Big.RM. Use exponential notation if sd is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * sd {number} Integer, 1 to MAX_DP inclusive.
 */
P.toPrecision = function (sd) {
    return stringify(this, 3, sd, sd - 1);
};
/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Omit the sign for negative zero.
 */
P.toString = function () {
    return stringify(this);
};
/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Include the sign for negative zero.
 */
P.valueOf = P.toJSON = function () {
    return stringify(this, 4);
};
// Export
var Big = _Big_();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Big);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Helpers_allocateArrayFromCons": () => (/* binding */ Helpers_allocateArrayFromCons),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "fill": () => (/* binding */ fill),
/* harmony export */   "getSubArray": () => (/* binding */ getSubArray),
/* harmony export */   "last": () => (/* binding */ last),
/* harmony export */   "tryLast": () => (/* binding */ tryLast),
/* harmony export */   "mapIndexed": () => (/* binding */ mapIndexed),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapIndexed2": () => (/* binding */ mapIndexed2),
/* harmony export */   "map2": () => (/* binding */ map2),
/* harmony export */   "mapIndexed3": () => (/* binding */ mapIndexed3),
/* harmony export */   "map3": () => (/* binding */ map3),
/* harmony export */   "mapFold": () => (/* binding */ mapFold),
/* harmony export */   "mapFoldBack": () => (/* binding */ mapFoldBack),
/* harmony export */   "indexed": () => (/* binding */ indexed),
/* harmony export */   "truncate": () => (/* binding */ truncate),
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "collect": () => (/* binding */ collect),
/* harmony export */   "countBy": () => (/* binding */ countBy),
/* harmony export */   "distinctBy": () => (/* binding */ distinctBy),
/* harmony export */   "distinct": () => (/* binding */ distinct),
/* harmony export */   "where": () => (/* binding */ where),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "except": () => (/* binding */ except),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "pairwise": () => (/* binding */ pairwise),
/* harmony export */   "replicate": () => (/* binding */ replicate),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "reverse": () => (/* binding */ reverse),
/* harmony export */   "scan": () => (/* binding */ scan),
/* harmony export */   "scanBack": () => (/* binding */ scanBack),
/* harmony export */   "skip": () => (/* binding */ skip),
/* harmony export */   "skipWhile": () => (/* binding */ skipWhile),
/* harmony export */   "take": () => (/* binding */ take),
/* harmony export */   "takeWhile": () => (/* binding */ takeWhile),
/* harmony export */   "addInPlace": () => (/* binding */ addInPlace),
/* harmony export */   "addRangeInPlace": () => (/* binding */ addRangeInPlace),
/* harmony export */   "removeInPlace": () => (/* binding */ removeInPlace),
/* harmony export */   "removeAllInPlace": () => (/* binding */ removeAllInPlace),
/* harmony export */   "copyTo": () => (/* binding */ copyTo),
/* harmony export */   "copyToTypedArray": () => (/* binding */ copyToTypedArray),
/* harmony export */   "indexOf": () => (/* binding */ indexOf),
/* harmony export */   "partition": () => (/* binding */ partition),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "tryFind": () => (/* binding */ tryFind),
/* harmony export */   "findIndex": () => (/* binding */ findIndex),
/* harmony export */   "tryFindIndex": () => (/* binding */ tryFindIndex),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "tryPick": () => (/* binding */ tryPick),
/* harmony export */   "findBack": () => (/* binding */ findBack),
/* harmony export */   "tryFindBack": () => (/* binding */ tryFindBack),
/* harmony export */   "findLastIndex": () => (/* binding */ findLastIndex),
/* harmony export */   "findIndexBack": () => (/* binding */ findIndexBack),
/* harmony export */   "tryFindIndexBack": () => (/* binding */ tryFindIndexBack),
/* harmony export */   "choose": () => (/* binding */ choose),
/* harmony export */   "foldIndexed": () => (/* binding */ foldIndexed),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "iterate": () => (/* binding */ iterate),
/* harmony export */   "iterateIndexed": () => (/* binding */ iterateIndexed),
/* harmony export */   "iterate2": () => (/* binding */ iterate2),
/* harmony export */   "iterateIndexed2": () => (/* binding */ iterateIndexed2),
/* harmony export */   "isEmpty": () => (/* binding */ isEmpty),
/* harmony export */   "forAll": () => (/* binding */ forAll),
/* harmony export */   "permute": () => (/* binding */ permute),
/* harmony export */   "setSlice": () => (/* binding */ setSlice),
/* harmony export */   "sortInPlaceBy": () => (/* binding */ sortInPlaceBy),
/* harmony export */   "sortInPlace": () => (/* binding */ sortInPlace),
/* harmony export */   "sort": () => (/* binding */ sort),
/* harmony export */   "sortBy": () => (/* binding */ sortBy),
/* harmony export */   "sortDescending": () => (/* binding */ sortDescending),
/* harmony export */   "sortByDescending": () => (/* binding */ sortByDescending),
/* harmony export */   "sortWith": () => (/* binding */ sortWith),
/* harmony export */   "unfold": () => (/* binding */ unfold),
/* harmony export */   "unzip": () => (/* binding */ unzip),
/* harmony export */   "unzip3": () => (/* binding */ unzip3),
/* harmony export */   "zip": () => (/* binding */ zip),
/* harmony export */   "zip3": () => (/* binding */ zip3),
/* harmony export */   "chunkBySize": () => (/* binding */ chunkBySize),
/* harmony export */   "splitAt": () => (/* binding */ splitAt),
/* harmony export */   "compareWith": () => (/* binding */ compareWith),
/* harmony export */   "equalsWith": () => (/* binding */ equalsWith),
/* harmony export */   "exactlyOne": () => (/* binding */ exactlyOne),
/* harmony export */   "head": () => (/* binding */ head),
/* harmony export */   "tryHead": () => (/* binding */ tryHead),
/* harmony export */   "tail": () => (/* binding */ tail),
/* harmony export */   "item": () => (/* binding */ item),
/* harmony export */   "tryItem": () => (/* binding */ tryItem),
/* harmony export */   "foldBackIndexed": () => (/* binding */ foldBackIndexed),
/* harmony export */   "foldBack": () => (/* binding */ foldBack),
/* harmony export */   "foldIndexed2": () => (/* binding */ foldIndexed2),
/* harmony export */   "fold2": () => (/* binding */ fold2),
/* harmony export */   "foldBackIndexed2": () => (/* binding */ foldBackIndexed2),
/* harmony export */   "foldBack2": () => (/* binding */ foldBack2),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "reduceBack": () => (/* binding */ reduceBack),
/* harmony export */   "forAll2": () => (/* binding */ forAll2),
/* harmony export */   "existsOffset": () => (/* binding */ existsOffset),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "existsOffset2": () => (/* binding */ existsOffset2),
/* harmony export */   "exists2": () => (/* binding */ exists2),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "sumBy": () => (/* binding */ sumBy),
/* harmony export */   "maxBy": () => (/* binding */ maxBy),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "minBy": () => (/* binding */ minBy),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "average": () => (/* binding */ average),
/* harmony export */   "averageBy": () => (/* binding */ averageBy),
/* harmony export */   "windowed": () => (/* binding */ windowed),
/* harmony export */   "splitInto": () => (/* binding */ splitInto),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _MutableMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _MapUtil_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(27);
/* harmony import */ var _Seq_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(21);








function Helpers_allocateArrayFromCons(cons, len) {
    if ((typeof cons) === "function") {
        return new cons(len);
    }
    else {
        return new Array(len);
    }
}

function indexNotFound() {
    throw (new Error("An index satisfying the predicate was not found in the collection."));
}

function differentLengths() {
    throw (new Error("Arrays had different lengths"));
}

function append(array1, array2, cons) {
    const len1 = array1.length | 0;
    const len2 = array2.length | 0;
    const newArray = Helpers_allocateArrayFromCons(cons, len1 + len2);
    for (let i = 0; i <= (len1 - 1); i++) {
        newArray[i] = array1[i];
    }
    for (let i_1 = 0; i_1 <= (len2 - 1); i_1++) {
        newArray[i_1 + len1] = array2[i_1];
    }
    return newArray;
}

function filter(predicate, array) {
    return array.filter(predicate);
}

function fill(target, targetIndex, count, value) {
    const start = targetIndex | 0;
    return target.fill(value, start, (start + count));
}

function getSubArray(array, start, count) {
    const start_1 = start | 0;
    return array.slice(start_1, (start_1 + count));
}

function last(array) {
    if (array.length === 0) {
        throw (new Error("The input array was empty\\nParameter name: array"));
    }
    return array[array.length - 1];
}

function tryLast(array) {
    if (array.length === 0) {
        return void 0;
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.some)(array[array.length - 1]);
    }
}

function mapIndexed(f, source, cons) {
    const len = source.length | 0;
    const target = Helpers_allocateArrayFromCons(cons, len);
    for (let i = 0; i <= (len - 1); i++) {
        target[i] = f(i, source[i]);
    }
    return target;
}

function map(f, source, cons) {
    const len = source.length | 0;
    const target = Helpers_allocateArrayFromCons(cons, len);
    for (let i = 0; i <= (len - 1); i++) {
        target[i] = f(source[i]);
    }
    return target;
}

function mapIndexed2(f, source1, source2, cons) {
    if (source1.length !== source2.length) {
        throw (new Error("Arrays had different lengths"));
    }
    const result = Helpers_allocateArrayFromCons(cons, source1.length);
    for (let i = 0; i <= (source1.length - 1); i++) {
        result[i] = f(i, source1[i], source2[i]);
    }
    return result;
}

function map2(f, source1, source2, cons) {
    if (source1.length !== source2.length) {
        throw (new Error("Arrays had different lengths"));
    }
    const result = Helpers_allocateArrayFromCons(cons, source1.length);
    for (let i = 0; i <= (source1.length - 1); i++) {
        result[i] = f(source1[i], source2[i]);
    }
    return result;
}

function mapIndexed3(f, source1, source2, source3, cons) {
    if ((source1.length !== source2.length) ? true : (source2.length !== source3.length)) {
        throw (new Error("Arrays had different lengths"));
    }
    const result = Helpers_allocateArrayFromCons(cons, source1.length);
    for (let i = 0; i <= (source1.length - 1); i++) {
        result[i] = f(i, source1[i], source2[i], source3[i]);
    }
    return result;
}

function map3(f, source1, source2, source3, cons) {
    if ((source1.length !== source2.length) ? true : (source2.length !== source3.length)) {
        throw (new Error("Arrays had different lengths"));
    }
    const result = Helpers_allocateArrayFromCons(cons, source1.length);
    for (let i = 0; i <= (source1.length - 1); i++) {
        result[i] = f(source1[i], source2[i], source3[i]);
    }
    return result;
}

function mapFold(mapping, state, array, cons) {
    const matchValue = array.length | 0;
    if (matchValue === 0) {
        return [[], state];
    }
    else {
        let acc = state;
        const res = Helpers_allocateArrayFromCons(cons, matchValue);
        for (let i = 0; i <= (array.length - 1); i++) {
            const patternInput = mapping(acc, array[i]);
            res[i] = patternInput[0];
            acc = patternInput[1];
        }
        return [res, acc];
    }
}

function mapFoldBack(mapping, array, state, cons) {
    const matchValue = array.length | 0;
    if (matchValue === 0) {
        return [[], state];
    }
    else {
        let acc = state;
        const res = Helpers_allocateArrayFromCons(cons, matchValue);
        for (let i = array.length - 1; i >= 0; i--) {
            const patternInput = mapping(array[i], acc);
            res[i] = patternInput[0];
            acc = patternInput[1];
        }
        return [res, acc];
    }
}

function indexed(source) {
    const len = source.length | 0;
    const target = new Array(len);
    for (let i = 0; i <= (len - 1); i++) {
        target[i] = [i, source[i]];
    }
    return target;
}

function truncate(count, array) {
    const count_1 = (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.max)((x, y) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.comparePrimitives)(x, y), 0, count) | 0;
    const start = 0;
    return array.slice(start, (start + count_1));
}

function concat(arrays, cons) {
    const arrays_1 = Array.isArray(arrays) ? arrays : (Array.from(arrays));
    const matchValue = arrays_1.length | 0;
    switch (matchValue) {
        case 0: {
            return Helpers_allocateArrayFromCons(cons, 0);
        }
        case 1: {
            return arrays_1[0];
        }
        default: {
            let totalIdx = 0;
            let totalLength = 0;
            for (let idx = 0; idx <= (arrays_1.length - 1); idx++) {
                const arr_1 = arrays_1[idx];
                totalLength = (totalLength + arr_1.length);
            }
            const result = Helpers_allocateArrayFromCons(cons, totalLength);
            for (let idx_1 = 0; idx_1 <= (arrays_1.length - 1); idx_1++) {
                const arr_2 = arrays_1[idx_1];
                for (let j = 0; j <= (arr_2.length - 1); j++) {
                    result[totalIdx] = arr_2[j];
                    totalIdx = (totalIdx + 1);
                }
            }
            return result;
        }
    }
}

function collect(mapping, array, cons) {
    return concat(map(mapping, array, null), cons);
}

function countBy(projection, array, eq) {
    const dict = new _MutableMap_js__WEBPACK_IMPORTED_MODULE_2__.Dictionary([], eq);
    const keys = [];
    for (let idx = 0; idx <= (array.length - 1); idx++) {
        const key = projection(array[idx]);
        let matchValue;
        let outArg = 0;
        matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.tryGetValue)(dict, key, new _Types_js__WEBPACK_IMPORTED_MODULE_4__.FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            dict.set(key, matchValue[1] + 1);
        }
        else {
            dict.set(key, 1);
            void (keys.push(key));
        }
    }
    return map((key_1) => [key_1, (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.getItemFromDict)(dict, key_1)], keys, null);
}

function distinctBy(projection, array, eq) {
    const hashSet = new _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__.HashSet([], eq);
    return filter((arg) => (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.addToSet)(projection(arg), hashSet), array);
}

function distinct(array, eq) {
    return distinctBy((x) => x, array, eq);
}

function where(predicate, array) {
    return array.filter(predicate);
}

function contains(value, array, eq) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i >= array.length) {
                return false;
            }
            else if (eq.Equals(value, array[i])) {
                return true;
            }
            else {
                i_mut = (i + 1);
                continue loop;
            }
            break;
        }
    };
    return loop(0);
}

function except(itemsToExclude, array, eq) {
    if (array.length === 0) {
        return array;
    }
    else {
        const cached = new _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__.HashSet(itemsToExclude, eq);
        return array.filter(((arg00) => (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.addToSet)(arg00, cached)));
    }
}

function groupBy(projection, array, eq) {
    const dict = new _MutableMap_js__WEBPACK_IMPORTED_MODULE_2__.Dictionary([], eq);
    const keys = [];
    for (let idx = 0; idx <= (array.length - 1); idx++) {
        const v = array[idx];
        const key = projection(v);
        let matchValue;
        let outArg = null;
        matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.tryGetValue)(dict, key, new _Types_js__WEBPACK_IMPORTED_MODULE_4__.FSharpRef(() => outArg, (v_1) => {
            outArg = v_1;
        })), outArg];
        if (matchValue[0]) {
            void (matchValue[1].push(v));
        }
        else {
            (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.addToDict)(dict, key, [v]);
            void (keys.push(key));
        }
    }
    return map((key_1) => [key_1, Array.from((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.getItemFromDict)(dict, key_1))], keys, null);
}

function empty(cons) {
    return Helpers_allocateArrayFromCons(cons, 0);
}

function singleton(value, cons) {
    const ar = Helpers_allocateArrayFromCons(cons, 1);
    ar[0] = value;
    return ar;
}

function initialize(count, initializer, cons) {
    if (count < 0) {
        throw (new Error("The input must be non-negative\\nParameter name: count"));
    }
    const result = Helpers_allocateArrayFromCons(cons, count);
    for (let i = 0; i <= (count - 1); i++) {
        result[i] = initializer(i);
    }
    return result;
}

function pairwise(array) {
    if (array.length < 2) {
        return [];
    }
    else {
        const count = (array.length - 1) | 0;
        const result = new Array(count);
        for (let i = 0; i <= (count - 1); i++) {
            result[i] = [array[i], array[i + 1]];
        }
        return result;
    }
}

function replicate(count, initial, cons) {
    if (count < 0) {
        throw (new Error("The input must be non-negative\\nParameter name: count"));
    }
    const result = Helpers_allocateArrayFromCons(cons, count);
    for (let i = 0; i <= (result.length - 1); i++) {
        result[i] = initial;
    }
    return result;
}

function copy(array) {
    return array.slice();
}

function reverse(array) {
    const array_2 = array.slice();
    return array_2.reverse();
}

function scan(folder, state, array, cons) {
    const res = Helpers_allocateArrayFromCons(cons, array.length + 1);
    res[0] = state;
    for (let i = 0; i <= (array.length - 1); i++) {
        res[i + 1] = folder(res[i], array[i]);
    }
    return res;
}

function scanBack(folder, array, state, cons) {
    const res = Helpers_allocateArrayFromCons(cons, array.length + 1);
    res[array.length] = state;
    for (let i = array.length - 1; i >= 0; i--) {
        res[i] = folder(array[i], res[i + 1]);
    }
    return res;
}

function skip(count, array, cons) {
    if (count > array.length) {
        throw (new Error("count is greater than array length\\nParameter name: count"));
    }
    if (count === array.length) {
        return Helpers_allocateArrayFromCons(cons, 0);
    }
    else {
        const count_1 = ((count < 0) ? 0 : count) | 0;
        return array.slice(count_1);
    }
}

function skipWhile(predicate, array, cons) {
    let count = 0;
    while ((count < array.length) ? predicate(array[count]) : false) {
        count = (count + 1);
    }
    if (count === array.length) {
        return Helpers_allocateArrayFromCons(cons, 0);
    }
    else {
        const count_1 = count | 0;
        return array.slice(count_1);
    }
}

function take(count, array, cons) {
    if (count < 0) {
        throw (new Error("The input must be non-negative\\nParameter name: count"));
    }
    if (count > array.length) {
        throw (new Error("count is greater than array length\\nParameter name: count"));
    }
    if (count === 0) {
        return Helpers_allocateArrayFromCons(cons, 0);
    }
    else {
        const start = 0;
        return array.slice(start, (start + count));
    }
}

function takeWhile(predicate, array, cons) {
    let count = 0;
    while ((count < array.length) ? predicate(array[count]) : false) {
        count = (count + 1);
    }
    if (count === 0) {
        return Helpers_allocateArrayFromCons(cons, 0);
    }
    else {
        const start = 0;
        const count_1 = count | 0;
        return array.slice(start, (start + count_1));
    }
}

function addInPlace(x, array) {
    void (array.push(x));
}

function addRangeInPlace(range, array) {
    (0,_Seq_js__WEBPACK_IMPORTED_MODULE_6__.iterate)((x) => {
        void (array.push(x));
    }, range);
}

function removeInPlace(item_1, array) {
    const i = array.indexOf(item_1, 0);
    if (i > -1) {
        void (array.splice(i, 1));
        return true;
    }
    else {
        return false;
    }
}

function removeAllInPlace(predicate, array) {
    const countRemoveAll = (count) => {
        const i = array.findIndex(predicate);
        if (i > -1) {
            void (array.splice(i, 1));
            return (countRemoveAll(count) + 1) | 0;
        }
        else {
            return count | 0;
        }
    };
    return countRemoveAll(0) | 0;
}

function copyTo(source, sourceIndex, target, targetIndex, count) {
    const diff = (targetIndex - sourceIndex) | 0;
    for (let i = sourceIndex; i <= ((sourceIndex + count) - 1); i++) {
        target[i + diff] = source[i];
    }
}

function copyToTypedArray(source, sourceIndex, target, targetIndex, count) {
    try {
        target.set(source.subarray(sourceIndex, sourceIndex + count), targetIndex);
    }
    catch (matchValue) {
        copyTo(source, sourceIndex, target, targetIndex, count);
    }
}

function indexOf(array, item_1, start, count) {
    const start_1 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.defaultArg)(start, 0) | 0;
    const i = array.indexOf(item_1, start_1);
    if ((count != null) ? (i >= (start_1 + (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.value)(count))) : false) {
        return -1;
    }
    else {
        return i | 0;
    }
}

function partition(f, source, cons) {
    const len = source.length | 0;
    const res1 = Helpers_allocateArrayFromCons(cons, len);
    const res2 = Helpers_allocateArrayFromCons(cons, len);
    let iTrue = 0;
    let iFalse = 0;
    for (let i = 0; i <= (len - 1); i++) {
        if (f(source[i])) {
            res1[iTrue] = source[i];
            iTrue = (iTrue + 1);
        }
        else {
            res2[iFalse] = source[i];
            iFalse = (iFalse + 1);
        }
    }
    return [truncate(iTrue, res1), truncate(iFalse, res2)];
}

function find(predicate, array) {
    const matchValue = array.find(predicate);
    if (matchValue == null) {
        return indexNotFound();
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.value)(matchValue);
    }
}

function tryFind(predicate, array) {
    return array.find(predicate);
}

function findIndex(predicate, array) {
    const matchValue = array.findIndex(predicate);
    if (matchValue > -1) {
        return matchValue | 0;
    }
    else {
        return indexNotFound();
    }
}

function tryFindIndex(predicate, array) {
    const matchValue = array.findIndex(predicate);
    if (matchValue > -1) {
        return matchValue;
    }
    else {
        return void 0;
    }
}

function pick(chooser, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i >= array.length) {
                return indexNotFound();
            }
            else {
                const matchValue = chooser(array[i]);
                if (matchValue != null) {
                    return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.value)(matchValue);
                }
                else {
                    i_mut = (i + 1);
                    continue loop;
                }
            }
            break;
        }
    };
    return loop(0);
}

function tryPick(chooser, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i >= array.length) {
                return void 0;
            }
            else {
                const matchValue = chooser(array[i]);
                if (matchValue == null) {
                    i_mut = (i + 1);
                    continue loop;
                }
                else {
                    return matchValue;
                }
            }
            break;
        }
    };
    return loop(0);
}

function findBack(predicate, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i < 0) {
                return indexNotFound();
            }
            else if (predicate(array[i])) {
                return array[i];
            }
            else {
                i_mut = (i - 1);
                continue loop;
            }
            break;
        }
    };
    return loop(array.length - 1);
}

function tryFindBack(predicate, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i < 0) {
                return void 0;
            }
            else if (predicate(array[i])) {
                return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.some)(array[i]);
            }
            else {
                i_mut = (i - 1);
                continue loop;
            }
            break;
        }
    };
    return loop(array.length - 1);
}

function findLastIndex(predicate, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i < 0) {
                return -1;
            }
            else if (predicate(array[i])) {
                return i | 0;
            }
            else {
                i_mut = (i - 1);
                continue loop;
            }
            break;
        }
    };
    return loop(array.length - 1) | 0;
}

function findIndexBack(predicate, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i < 0) {
                return indexNotFound();
            }
            else if (predicate(array[i])) {
                return i | 0;
            }
            else {
                i_mut = (i - 1);
                continue loop;
            }
            break;
        }
    };
    return loop(array.length - 1) | 0;
}

function tryFindIndexBack(predicate, array) {
    const loop = (i_mut) => {
        loop:
        while (true) {
            const i = i_mut;
            if (i < 0) {
                return void 0;
            }
            else if (predicate(array[i])) {
                return i;
            }
            else {
                i_mut = (i - 1);
                continue loop;
            }
            break;
        }
    };
    return loop(array.length - 1);
}

function choose(chooser, array, cons) {
    return map((x_1) => (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.value)(chooser(x_1)), array.filter(((x) => (chooser(x) != null))), cons);
}

function foldIndexed(folder, state, array) {
    return array.reduce(((delegateArg0, delegateArg1, delegateArg2) => folder(delegateArg2, delegateArg0, delegateArg1)), state);
}

function fold(folder, state, array) {
    return array.reduce(((delegateArg0, delegateArg1) => folder(delegateArg0, delegateArg1)), state);
}

function iterate(action, array) {
    for (let i = 0; i <= (array.length - 1); i++) {
        action(array[i]);
    }
}

function iterateIndexed(action, array) {
    for (let i = 0; i <= (array.length - 1); i++) {
        action(i, array[i]);
    }
}

function iterate2(action, array1, array2) {
    if (array1.length !== array2.length) {
        differentLengths();
    }
    for (let i = 0; i <= (array1.length - 1); i++) {
        action(array1[i], array2[i]);
    }
}

function iterateIndexed2(action, array1, array2) {
    if (array1.length !== array2.length) {
        differentLengths();
    }
    for (let i = 0; i <= (array1.length - 1); i++) {
        action(i, array1[i], array2[i]);
    }
}

function isEmpty(array) {
    return array.length === 0;
}

function forAll(predicate, array) {
    return array.every(predicate);
}

function permute(f, array) {
    const size = array.length | 0;
    const res = array.slice();
    const checkFlags = new Array(size);
    iterateIndexed((i, x) => {
        const j = f(i) | 0;
        if ((j < 0) ? true : (j >= size)) {
            throw (new Error("Not a valid permutation"));
        }
        res[j] = x;
        checkFlags[j] = 1;
    }, array);
    if (!(checkFlags.every(((y) => (1 === y))))) {
        throw (new Error("Not a valid permutation"));
    }
    return res;
}

function setSlice(target, lower, upper, source) {
    const lower_1 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.defaultArg)(lower, 0) | 0;
    const upper_1 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.defaultArg)(upper, 0) | 0;
    const length = (((upper_1 > 0) ? upper_1 : (target.length - 1)) - lower_1) | 0;
    for (let i = 0; i <= length; i++) {
        target[i + lower_1] = source[i];
    }
}

function sortInPlaceBy(projection, xs, comparer) {
    xs.sort(((x, y) => comparer.Compare(projection(x), projection(y))));
}

function sortInPlace(xs, comparer) {
    xs.sort(((x, y) => comparer.Compare(x, y)));
}

function sort(xs, comparer) {
    const xs_1 = xs.slice();
    xs_1.sort(((x, y) => comparer.Compare(x, y)));
    return xs_1;
}

function sortBy(projection, xs, comparer) {
    const xs_1 = xs.slice();
    xs_1.sort(((x, y) => comparer.Compare(projection(x), projection(y))));
    return xs_1;
}

function sortDescending(xs, comparer) {
    const xs_1 = xs.slice();
    xs_1.sort(((x, y) => (comparer.Compare(x, y) * -1)));
    return xs_1;
}

function sortByDescending(projection, xs, comparer) {
    const xs_1 = xs.slice();
    xs_1.sort(((x, y) => (comparer.Compare(projection(x), projection(y)) * -1)));
    return xs_1;
}

function sortWith(comparer, xs) {
    const comparer_1 = comparer;
    const xs_1 = xs.slice();
    xs_1.sort(comparer_1);
    return xs_1;
}

function unfold(generator, state) {
    const res = [];
    const loop = (state_1_mut) => {
        loop:
        while (true) {
            const state_1 = state_1_mut;
            const matchValue = generator(state_1);
            if (matchValue != null) {
                const x = matchValue[0];
                const s = matchValue[1];
                void (res.push(x));
                state_1_mut = s;
                continue loop;
            }
            break;
        }
    };
    loop(state);
    return res;
}

function unzip(array) {
    const len = array.length | 0;
    const res1 = new Array(len);
    const res2 = new Array(len);
    iterateIndexed((i, tupledArg) => {
        res1[i] = tupledArg[0];
        res2[i] = tupledArg[1];
    }, array);
    return [res1, res2];
}

function unzip3(array) {
    const len = array.length | 0;
    const res1 = new Array(len);
    const res2 = new Array(len);
    const res3 = new Array(len);
    iterateIndexed((i, tupledArg) => {
        res1[i] = tupledArg[0];
        res2[i] = tupledArg[1];
        res3[i] = tupledArg[2];
    }, array);
    return [res1, res2, res3];
}

function zip(array1, array2) {
    if (array1.length !== array2.length) {
        differentLengths();
    }
    const result = new Array(array1.length);
    for (let i = 0; i <= (array1.length - 1); i++) {
        result[i] = [array1[i], array2[i]];
    }
    return result;
}

function zip3(array1, array2, array3) {
    if ((array1.length !== array2.length) ? true : (array2.length !== array3.length)) {
        differentLengths();
    }
    const result = new Array(array1.length);
    for (let i = 0; i <= (array1.length - 1); i++) {
        result[i] = [array1[i], array2[i], array3[i]];
    }
    return result;
}

function chunkBySize(chunkSize, array) {
    if (chunkSize < 1) {
        throw (new Error("The input must be positive.\\nParameter name: size"));
    }
    if (array.length === 0) {
        return [[]];
    }
    else {
        const result = [];
        for (let x = 0; x <= ((~(~Math.ceil(array.length / chunkSize))) - 1); x++) {
            let slice;
            const start_1 = (x * chunkSize) | 0;
            slice = (array.slice(start_1, (start_1 + chunkSize)));
            void (result.push(slice));
        }
        return result;
    }
}

function splitAt(index, array) {
    let start;
    if (index < 0) {
        throw (new Error("The input must be non-negative\\nParameter name: index"));
    }
    if (index > array.length) {
        throw (new Error("The input sequence has an insufficient number of elements.\\nParameter name: index"));
    }
    return [(start = 0, array.slice(start, (start + index))), array.slice(index)];
}

function compareWith(comparer, array1, array2) {
    if (array1 == null) {
        if (array2 == null) {
            return 0;
        }
        else {
            return -1;
        }
    }
    else if (array2 == null) {
        return 1;
    }
    else {
        let i = 0;
        let result = 0;
        const length1 = array1.length | 0;
        const length2 = array2.length | 0;
        if (length1 > length2) {
            return 1;
        }
        else if (length1 < length2) {
            return -1;
        }
        else {
            while ((i < length1) ? (result === 0) : false) {
                result = comparer(array1[i], array2[i]);
                i = (i + 1);
            }
            return result | 0;
        }
    }
}

function equalsWith(comparer, array1, array2) {
    return compareWith((e1, e2) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.compare)(e1, e2), array1, array2) === 0;
}

function exactlyOne(array) {
    if (array.length === 1) {
        return array[0];
    }
    else if (array.length === 0) {
        throw (new Error("The input sequence was empty\\nParameter name: array"));
    }
    else {
        throw (new Error("Input array too long\\nParameter name: array"));
    }
}

function head(array) {
    if (array.length === 0) {
        throw (new Error("The input array was empty\\nParameter name: array"));
    }
    else {
        return array[0];
    }
}

function tryHead(array) {
    if (array.length === 0) {
        return void 0;
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.some)(array[0]);
    }
}

function tail(array) {
    if (array.length === 0) {
        throw (new Error("Not enough elements\\nParameter name: array"));
    }
    return array.slice(1);
}

function item(index, array) {
    return array[index];
}

function tryItem(index, array) {
    if ((index < 0) ? true : (index >= array.length)) {
        return void 0;
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_0__.some)(array[index]);
    }
}

function foldBackIndexed(folder, array, state) {
    return array.reduceRight(((delegateArg0, delegateArg1, delegateArg2) => folder(delegateArg2, delegateArg1, delegateArg0)), state);
}

function foldBack(folder, array, state) {
    return array.reduceRight(((delegateArg0, delegateArg1) => folder(delegateArg1, delegateArg0)), state);
}

function foldIndexed2(folder, state, array1, array2) {
    let acc = state;
    if (array1.length !== array2.length) {
        throw (new Error("Arrays have different lengths"));
    }
    for (let i = 0; i <= (array1.length - 1); i++) {
        acc = folder(i, acc, array1[i], array2[i]);
    }
    return acc;
}

function fold2(folder, state, array1, array2) {
    return foldIndexed2((_arg1, acc, x, y) => folder(acc, x, y), state, array1, array2);
}

function foldBackIndexed2(folder, array1, array2, state) {
    let acc = state;
    if (array1.length !== array2.length) {
        differentLengths();
    }
    const size = array1.length | 0;
    for (let i = 1; i <= size; i++) {
        acc = folder(i - 1, array1[size - i], array2[size - i], acc);
    }
    return acc;
}

function foldBack2(f, array1, array2, state) {
    return foldBackIndexed2((_arg1, x, y, acc) => f(x, y, acc), array1, array2, state);
}

function reduce(reduction, array) {
    if (array.length === 0) {
        throw (new Error("The input array was empty"));
    }
    const reduction_1 = reduction;
    return array.reduce(reduction_1);
}

function reduceBack(reduction, array) {
    if (array.length === 0) {
        throw (new Error("The input array was empty"));
    }
    const reduction_1 = reduction;
    return array.reduceRight(reduction_1);
}

function forAll2(predicate, array1, array2) {
    return fold2((acc, x, y) => (acc ? predicate(x, y) : false), true, array1, array2);
}

function existsOffset(predicate_mut, array_mut, index_mut) {
    existsOffset:
    while (true) {
        const predicate = predicate_mut, array = array_mut, index = index_mut;
        if (index === array.length) {
            return false;
        }
        else if (predicate(array[index])) {
            return true;
        }
        else {
            predicate_mut = predicate;
            array_mut = array;
            index_mut = (index + 1);
            continue existsOffset;
        }
        break;
    }
}

function exists(predicate, array) {
    return existsOffset(predicate, array, 0);
}

function existsOffset2(predicate_mut, array1_mut, array2_mut, index_mut) {
    existsOffset2:
    while (true) {
        const predicate = predicate_mut, array1 = array1_mut, array2 = array2_mut, index = index_mut;
        if (index === array1.length) {
            return false;
        }
        else if (predicate(array1[index], array2[index])) {
            return true;
        }
        else {
            predicate_mut = predicate;
            array1_mut = array1;
            array2_mut = array2;
            index_mut = (index + 1);
            continue existsOffset2;
        }
        break;
    }
}

function exists2(predicate, array1, array2) {
    if (array1.length !== array2.length) {
        differentLengths();
    }
    return existsOffset2(predicate, array1, array2, 0);
}

function sum(array, adder) {
    let acc = adder.GetZero();
    for (let i = 0; i <= (array.length - 1); i++) {
        acc = adder.Add(acc, array[i]);
    }
    return acc;
}

function sumBy(projection, array, adder) {
    let acc = adder.GetZero();
    for (let i = 0; i <= (array.length - 1); i++) {
        acc = adder.Add(acc, projection(array[i]));
    }
    return acc;
}

function maxBy(projection, xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(projection(y), projection(x)) > 0) ? y : x), xs);
}

function max(xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(y, x) > 0) ? y : x), xs);
}

function minBy(projection, xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(projection(y), projection(x)) > 0) ? x : y), xs);
}

function min(xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(y, x) > 0) ? x : y), xs);
}

function average(array, averager) {
    if (array.length === 0) {
        throw (new Error("The input array was empty\\nParameter name: array"));
    }
    let total = averager.GetZero();
    for (let i = 0; i <= (array.length - 1); i++) {
        total = averager.Add(total, array[i]);
    }
    return averager.DivideByInt(total, array.length);
}

function averageBy(projection, array, averager) {
    if (array.length === 0) {
        throw (new Error("The input array was empty\\nParameter name: array"));
    }
    let total = averager.GetZero();
    for (let i = 0; i <= (array.length - 1); i++) {
        total = averager.Add(total, projection(array[i]));
    }
    return averager.DivideByInt(total, array.length);
}

function windowed(windowSize, source) {
    if (windowSize <= 0) {
        throw (new Error("windowSize must be positive"));
    }
    let res;
    const len = (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.max)((x, y) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.comparePrimitives)(x, y), 0, source.length - windowSize) | 0;
    res = (new Array(len));
    for (let i = windowSize; i <= source.length; i++) {
        res[i - windowSize] = source.slice(i - windowSize, (i - 1) + 1);
    }
    return res;
}

function splitInto(chunks, array) {
    if (chunks < 1) {
        throw (new Error("The input must be positive.\\nParameter name: chunks"));
    }
    if (array.length === 0) {
        return [[]];
    }
    else {
        const result = [];
        const chunks_1 = (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.min)((x, y) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.comparePrimitives)(x, y), chunks, array.length) | 0;
        const minChunkSize = (~(~(array.length / chunks_1))) | 0;
        const chunksWithExtraItem = (array.length % chunks_1) | 0;
        for (let i = 0; i <= (chunks_1 - 1); i++) {
            const chunkSize = ((i < chunksWithExtraItem) ? (minChunkSize + 1) : minChunkSize) | 0;
            let slice;
            const start_1 = ((i * minChunkSize) + (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.min)((x_1, y_1) => (0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.comparePrimitives)(x_1, y_1), chunksWithExtraItem, i)) | 0;
            slice = (array.slice(start_1, (start_1 + chunkSize)));
            void (result.push(slice));
        }
        return result;
    }
}

function transpose(arrays, cons) {
    const arrays_1 = Array.isArray(arrays) ? arrays : (Array.from(arrays));
    const len = arrays_1.length | 0;
    if (len === 0) {
        return new Array(0);
    }
    else {
        const lenInner = arrays_1[0].length | 0;
        if (!forAll((a) => (a.length === lenInner), arrays_1)) {
            differentLengths();
        }
        const result = new Array(lenInner);
        for (let i = 0; i <= (lenInner - 1); i++) {
            result[i] = Helpers_allocateArrayFromCons(cons, len);
            for (let j = 0; j <= (len - 1); j++) {
                result[i][j] = arrays_1[j][i];
            }
        }
        return result;
    }
}



/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dictionary": () => (/* binding */ Dictionary),
/* harmony export */   "Dictionary$reflection": () => (/* binding */ Dictionary$reflection),
/* harmony export */   "Dictionary_$ctor_6623D9B3": () => (/* binding */ Dictionary_$ctor_6623D9B3),
/* harmony export */   "Dictionary__TryFind_2B595": () => (/* binding */ Dictionary__TryFind_2B595),
/* harmony export */   "Dictionary__get_Comparer": () => (/* binding */ Dictionary__get_Comparer),
/* harmony export */   "Dictionary__Clear": () => (/* binding */ Dictionary__Clear),
/* harmony export */   "Dictionary__get_Count": () => (/* binding */ Dictionary__get_Count),
/* harmony export */   "Dictionary__get_Item_2B595": () => (/* binding */ Dictionary__get_Item_2B595),
/* harmony export */   "Dictionary__set_Item_5BDDA1": () => (/* binding */ Dictionary__set_Item_5BDDA1),
/* harmony export */   "Dictionary__Add_5BDDA1": () => (/* binding */ Dictionary__Add_5BDDA1),
/* harmony export */   "Dictionary__ContainsKey_2B595": () => (/* binding */ Dictionary__ContainsKey_2B595),
/* harmony export */   "Dictionary__Remove_2B595": () => (/* binding */ Dictionary__Remove_2B595)
/* harmony export */ });
/* harmony import */ var _Seq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _Reflection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _MapUtil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(26);
/* harmony import */ var _String_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);







class Dictionary {
    constructor(pairs, comparer) {
        const this$ = new _Types_js__WEBPACK_IMPORTED_MODULE_2__.FSharpRef(null);
        this.comparer = comparer;
        this$.contents = this;
        this.hashMap = (new Map([]));
        this["init@8-1"] = 1;
        const enumerator = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)(pairs);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const pair = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                Dictionary__Add_5BDDA1(this$.contents, pair[0], pair[1]);
            }
        }
        finally {
            enumerator.Dispose();
        }
    }
    get [Symbol.toStringTag]() {
        return "Dictionary";
    }
    ["System.Collections.IEnumerable.GetEnumerator"]() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)(this$);
    }
    GetEnumerator() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)((0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.concat)(this$.hashMap.values()));
    }
    [Symbol.iterator]() {
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.toIterator)(this.GetEnumerator());
    }
    ["System.Collections.Generic.ICollection`1.Add2B595"](item) {
        const this$ = this;
        Dictionary__Add_5BDDA1(this$, item[0], item[1]);
    }
    ["System.Collections.Generic.ICollection`1.Clear"]() {
        const this$ = this;
        Dictionary__Clear(this$);
    }
    ["System.Collections.Generic.ICollection`1.Contains2B595"](item) {
        const this$ = this;
        const matchValue = Dictionary__TryFind_2B595(this$, item[0]);
        let pattern_matching_result;
        if (matchValue != null) {
            if ((0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.equals)(matchValue[1], item[1])) {
                pattern_matching_result = 0;
            }
            else {
                pattern_matching_result = 1;
            }
        }
        else {
            pattern_matching_result = 1;
        }
        switch (pattern_matching_result) {
            case 0: {
                return true;
            }
            case 1: {
                return false;
            }
        }
    }
    ["System.Collections.Generic.ICollection`1.CopyToZ2E171D71"](array, arrayIndex) {
        const this$ = this;
        (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.iterateIndexed)((i, e) => {
            array[arrayIndex + i] = e;
        }, this$);
    }
    ["System.Collections.Generic.ICollection`1.get_Count"]() {
        const this$ = this;
        return Dictionary__get_Count(this$) | 0;
    }
    ["System.Collections.Generic.ICollection`1.get_IsReadOnly"]() {
        return false;
    }
    ["System.Collections.Generic.ICollection`1.Remove2B595"](item) {
        const this$ = this;
        const matchValue = Dictionary__TryFind_2B595(this$, item[0]);
        if (matchValue != null) {
            if ((0,_Util_js__WEBPACK_IMPORTED_MODULE_1__.equals)(matchValue[1], item[1])) {
                void Dictionary__Remove_2B595(this$, item[0]);
            }
            return true;
        }
        else {
            return false;
        }
    }
    get size() {
        const this$ = this;
        return Dictionary__get_Count(this$) | 0;
    }
    clear() {
        const this$ = this;
        Dictionary__Clear(this$);
    }
    delete(k) {
        const this$ = this;
        return Dictionary__Remove_2B595(this$, k);
    }
    entries() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((p) => [p[0], p[1]], this$);
    }
    get(k) {
        const this$ = this;
        return Dictionary__get_Item_2B595(this$, k);
    }
    has(k) {
        const this$ = this;
        return Dictionary__ContainsKey_2B595(this$, k);
    }
    keys() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((p) => p[0], this$);
    }
    set(k, v) {
        const this$ = this;
        Dictionary__set_Item_5BDDA1(this$, k, v);
        return this$;
    }
    values() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((p) => p[1], this$);
    }
    forEach(f, thisArg) {
        const this$ = this;
        (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.iterate)((p) => {
            f(p[1], p[0], this$);
        }, this$);
    }
}

function Dictionary$reflection(gen0, gen1) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_3__.class_type)("Fable.Collections.Dictionary", [gen0, gen1], Dictionary);
}

function Dictionary_$ctor_6623D9B3(pairs, comparer) {
    return new Dictionary(pairs, comparer);
}

function Dictionary__TryFindIndex_2B595(this$, k) {
    const h = this$.comparer.GetHashCode(k) | 0;
    let matchValue;
    let outArg = null;
    matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.tryGetValue)(this$.hashMap, h, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.FSharpRef(() => outArg, (v) => {
        outArg = v;
    })), outArg];
    if (matchValue[0]) {
        return [true, h, matchValue[1].findIndex((pair) => this$.comparer.Equals(k, pair[0]))];
    }
    else {
        return [false, h, -1];
    }
}

function Dictionary__TryFind_2B595(this$, k) {
    const matchValue = Dictionary__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.getItemFromDict)(this$.hashMap, matchValue[1])[matchValue[2]];
        }
        case 1: {
            return void 0;
        }
    }
}

function Dictionary__get_Comparer(this$) {
    return this$.comparer;
}

function Dictionary__Clear(this$) {
    this$.hashMap.clear();
}

function Dictionary__get_Count(this$) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.sumBy)((pairs) => pairs.length, this$.hashMap.values(), {
        GetZero: () => 0,
        Add: (x, y) => (x + y),
    });
}

function Dictionary__get_Item_2B595(this$, k) {
    const matchValue = Dictionary__TryFind_2B595(this$, k);
    if (matchValue != null) {
        return matchValue[1];
    }
    else {
        throw (new Error("The item was not found in collection"));
    }
}

function Dictionary__set_Item_5BDDA1(this$, k, v) {
    const matchValue = Dictionary__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.getItemFromDict)(this$.hashMap, matchValue[1])[matchValue[2]] = [k, v];
            break;
        }
        case 1: {
            if (matchValue[0]) {
                const value = void ((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.getItemFromDict)(this$.hashMap, matchValue[1]).push([k, v]));
            }
            else {
                this$.hashMap.set(matchValue[1], [[k, v]]);
            }
            break;
        }
    }
}

function Dictionary__Add_5BDDA1(this$, k, v) {
    const matchValue = Dictionary__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            const msg = (0,_String_js__WEBPACK_IMPORTED_MODULE_5__.format)("An item with the same key has already been added. Key: {0}", k);
            throw (new Error(msg));
            break;
        }
        case 1: {
            if (matchValue[0]) {
                const value = void ((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.getItemFromDict)(this$.hashMap, matchValue[1]).push([k, v]));
            }
            else {
                this$.hashMap.set(matchValue[1], [[k, v]]);
            }
            break;
        }
    }
}

function Dictionary__ContainsKey_2B595(this$, k) {
    const matchValue = Dictionary__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return true;
        }
        case 1: {
            return false;
        }
    }
}

function Dictionary__Remove_2B595(this$, k) {
    const matchValue = Dictionary__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_4__.getItemFromDict)(this$.hashMap, matchValue[1]).splice(matchValue[2], 1);
            return true;
        }
        case 1: {
            return false;
        }
    }
}



/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keyValueList": () => (/* binding */ keyValueList),
/* harmony export */   "containsValue": () => (/* binding */ containsValue),
/* harmony export */   "tryGetValue": () => (/* binding */ tryGetValue),
/* harmony export */   "addToSet": () => (/* binding */ addToSet),
/* harmony export */   "addToDict": () => (/* binding */ addToDict),
/* harmony export */   "getItemFromDict": () => (/* binding */ getItemFromDict)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


const CaseRules = {
    None: 0,
    LowerFirst: 1,
    SnakeCase: 2,
    SnakeCaseAllCaps: 3,
    KebabCase: 4,
};
function dashify(str, separator) {
    return str.replace(/[a-z]?[A-Z]/g, (m) => m.length === 1
        ? m.toLowerCase()
        : m.charAt(0) + separator + m.charAt(1).toLowerCase());
}
function changeCase(str, caseRule) {
    switch (caseRule) {
        case CaseRules.LowerFirst:
            return str.charAt(0).toLowerCase() + str.slice(1);
        case CaseRules.SnakeCase:
            return dashify(str, "_");
        case CaseRules.SnakeCaseAllCaps:
            return dashify(str, "_").toUpperCase();
        case CaseRules.KebabCase:
            return dashify(str, "-");
        case CaseRules.None:
        default:
            return str;
    }
}
function keyValueList(fields, caseRule = CaseRules.None) {
    const obj = {};
    const definedCaseRule = caseRule;
    function fail(kvPair) {
        throw new Error("Cannot infer key and value of " + String(kvPair));
    }
    function assign(key, caseRule, value) {
        key = changeCase(key, caseRule);
        obj[key] = value;
    }
    for (let kvPair of fields) {
        let caseRule = CaseRules.None;
        if (kvPair == null) {
            fail(kvPair);
        }
        // Deflate unions and use the defined case rule
        if (kvPair instanceof _Types_js__WEBPACK_IMPORTED_MODULE_1__.Union) {
            const name = kvPair.cases()[kvPair.tag];
            kvPair = kvPair.fields.length === 0 ? name : [name].concat(kvPair.fields);
            caseRule = definedCaseRule;
        }
        if (Array.isArray(kvPair)) {
            switch (kvPair.length) {
                case 0:
                    fail(kvPair);
                    break;
                case 1:
                    assign(kvPair[0], caseRule, true);
                    break;
                case 2:
                    const value = kvPair[1];
                    assign(kvPair[0], caseRule, value);
                    break;
                default:
                    assign(kvPair[0], caseRule, kvPair.slice(1));
            }
        }
        else if (typeof kvPair === "string") {
            assign(kvPair, caseRule, true);
        }
        else {
            fail(kvPair);
        }
    }
    return obj;
}
// TODO: Move these methods to Map and Set modules
function containsValue(v, map) {
    for (const kv of map) {
        if ((0,_Util_js__WEBPACK_IMPORTED_MODULE_0__.equals)(v, kv[1])) {
            return true;
        }
    }
    return false;
}
function tryGetValue(map, key, defaultValue) {
    if (map.has(key)) {
        defaultValue.contents = map.get(key);
        return true;
    }
    return false;
}
function addToSet(v, set) {
    if (set.has(v)) {
        return false;
    }
    set.add(v);
    return true;
}
function addToDict(dict, k, v) {
    if (dict.has(k)) {
        throw new Error("An item with the same key has already been added. Key: " + k);
    }
    dict.set(k, v);
}
function getItemFromDict(map, key) {
    if (map.has(key)) {
        return map.get(key);
    }
    else {
        throw new Error(`The given key '${key}' was not present in the dictionary.`);
    }
}


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HashSet": () => (/* binding */ HashSet),
/* harmony export */   "HashSet$reflection": () => (/* binding */ HashSet$reflection),
/* harmony export */   "HashSet_$ctor_Z6150332D": () => (/* binding */ HashSet_$ctor_Z6150332D),
/* harmony export */   "HashSet__get_Comparer": () => (/* binding */ HashSet__get_Comparer),
/* harmony export */   "HashSet__Clear": () => (/* binding */ HashSet__Clear),
/* harmony export */   "HashSet__get_Count": () => (/* binding */ HashSet__get_Count),
/* harmony export */   "HashSet__Add_2B595": () => (/* binding */ HashSet__Add_2B595),
/* harmony export */   "HashSet__Contains_2B595": () => (/* binding */ HashSet__Contains_2B595),
/* harmony export */   "HashSet__Remove_2B595": () => (/* binding */ HashSet__Remove_2B595)
/* harmony export */ });
/* harmony import */ var _Seq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _Reflection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _MapUtil_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(19);






class HashSet {
    constructor(items, comparer) {
        const this$ = new _Types_js__WEBPACK_IMPORTED_MODULE_1__.FSharpRef(null);
        this.comparer = comparer;
        this$.contents = this;
        this.hashMap = (new Map([]));
        this["init@8-2"] = 1;
        const enumerator = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)(items);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                void HashSet__Add_2B595(this$.contents, enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]());
            }
        }
        finally {
            enumerator.Dispose();
        }
    }
    get [Symbol.toStringTag]() {
        return "HashSet";
    }
    ["System.Collections.IEnumerable.GetEnumerator"]() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)(this$);
    }
    GetEnumerator() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.getEnumerator)((0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.concat)(this$.hashMap.values()));
    }
    [Symbol.iterator]() {
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.toIterator)(this.GetEnumerator());
    }
    ["System.Collections.Generic.ICollection`1.Add2B595"](item) {
        const this$ = this;
        void HashSet__Add_2B595(this$, item);
    }
    ["System.Collections.Generic.ICollection`1.Clear"]() {
        const this$ = this;
        HashSet__Clear(this$);
    }
    ["System.Collections.Generic.ICollection`1.Contains2B595"](item) {
        const this$ = this;
        return HashSet__Contains_2B595(this$, item);
    }
    ["System.Collections.Generic.ICollection`1.CopyToZ2E171D71"](array, arrayIndex) {
        const this$ = this;
        (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.iterateIndexed)((i, e) => {
            array[arrayIndex + i] = e;
        }, this$);
    }
    ["System.Collections.Generic.ICollection`1.get_Count"]() {
        const this$ = this;
        return HashSet__get_Count(this$) | 0;
    }
    ["System.Collections.Generic.ICollection`1.get_IsReadOnly"]() {
        return false;
    }
    ["System.Collections.Generic.ICollection`1.Remove2B595"](item) {
        const this$ = this;
        return HashSet__Remove_2B595(this$, item);
    }
    get size() {
        const this$ = this;
        return HashSet__get_Count(this$) | 0;
    }
    add(k) {
        const this$ = this;
        void HashSet__Add_2B595(this$, k);
        return this$;
    }
    clear() {
        const this$ = this;
        HashSet__Clear(this$);
    }
    delete(k) {
        const this$ = this;
        return HashSet__Remove_2B595(this$, k);
    }
    has(k) {
        const this$ = this;
        return HashSet__Contains_2B595(this$, k);
    }
    keys() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((x) => x, this$);
    }
    values() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((x) => x, this$);
    }
    entries() {
        const this$ = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((v) => [v, v], this$);
    }
    forEach(f, thisArg) {
        const this$ = this;
        (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.iterate)((x) => {
            f(x, x, this$);
        }, this$);
    }
}

function HashSet$reflection(gen0) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_2__.class_type)("Fable.Collections.HashSet", [gen0], HashSet);
}

function HashSet_$ctor_Z6150332D(items, comparer) {
    return new HashSet(items, comparer);
}

function HashSet__TryFindIndex_2B595(this$, k) {
    const h = this$.comparer.GetHashCode(k) | 0;
    let matchValue;
    let outArg = null;
    matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.tryGetValue)(this$.hashMap, h, new _Types_js__WEBPACK_IMPORTED_MODULE_1__.FSharpRef(() => outArg, (v) => {
        outArg = v;
    })), outArg];
    if (matchValue[0]) {
        return [true, h, matchValue[1].findIndex((v_1) => this$.comparer.Equals(k, v_1))];
    }
    else {
        return [false, h, -1];
    }
}

function HashSet__TryFind_2B595(this$, k) {
    const matchValue = HashSet__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_4__.some)((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.getItemFromDict)(this$.hashMap, matchValue[1])[matchValue[2]]);
        }
        case 1: {
            return void 0;
        }
    }
}

function HashSet__get_Comparer(this$) {
    return this$.comparer;
}

function HashSet__Clear(this$) {
    this$.hashMap.clear();
}

function HashSet__get_Count(this$) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_0__.sumBy)((pairs) => pairs.length, this$.hashMap.values(), {
        GetZero: () => 0,
        Add: (x, y) => (x + y),
    });
}

function HashSet__Add_2B595(this$, k) {
    const matchValue = HashSet__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return false;
        }
        case 1: {
            if (matchValue[0]) {
                const value = void ((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.getItemFromDict)(this$.hashMap, matchValue[1]).push(k));
                return true;
            }
            else {
                this$.hashMap.set(matchValue[1], [k]);
                return true;
            }
        }
    }
}

function HashSet__Contains_2B595(this$, k) {
    const matchValue = HashSet__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return true;
        }
        case 1: {
            return false;
        }
    }
}

function HashSet__Remove_2B595(this$, k) {
    const matchValue = HashSet__TryFindIndex_2B595(this$, k);
    let pattern_matching_result;
    if (matchValue[0]) {
        if (matchValue[2] > -1) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_3__.getItemFromDict)(this$.hashMap, matchValue[1]).splice(matchValue[2], 1);
            return true;
        }
        case 1: {
            return false;
        }
    }
}



/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SetTreeLeaf$1": () => (/* binding */ SetTreeLeaf$1),
/* harmony export */   "SetTreeLeaf$1$reflection": () => (/* binding */ SetTreeLeaf$1$reflection),
/* harmony export */   "SetTreeLeaf$1_$ctor_2B595": () => (/* binding */ SetTreeLeaf$1_$ctor_2B595),
/* harmony export */   "SetTreeLeaf$1__get_Key": () => (/* binding */ SetTreeLeaf$1__get_Key),
/* harmony export */   "SetTreeNode$1": () => (/* binding */ SetTreeNode$1),
/* harmony export */   "SetTreeNode$1$reflection": () => (/* binding */ SetTreeNode$1$reflection),
/* harmony export */   "SetTreeNode$1_$ctor_Z6E7BE5F7": () => (/* binding */ SetTreeNode$1_$ctor_Z6E7BE5F7),
/* harmony export */   "SetTreeNode$1__get_Left": () => (/* binding */ SetTreeNode$1__get_Left),
/* harmony export */   "SetTreeNode$1__get_Right": () => (/* binding */ SetTreeNode$1__get_Right),
/* harmony export */   "SetTreeNode$1__get_Height": () => (/* binding */ SetTreeNode$1__get_Height),
/* harmony export */   "SetTreeModule_empty": () => (/* binding */ SetTreeModule_empty),
/* harmony export */   "SetTreeModule_countAux": () => (/* binding */ SetTreeModule_countAux),
/* harmony export */   "SetTreeModule_count": () => (/* binding */ SetTreeModule_count),
/* harmony export */   "SetTreeModule_mk": () => (/* binding */ SetTreeModule_mk),
/* harmony export */   "SetTreeModule_rebalance": () => (/* binding */ SetTreeModule_rebalance),
/* harmony export */   "SetTreeModule_add": () => (/* binding */ SetTreeModule_add),
/* harmony export */   "SetTreeModule_balance": () => (/* binding */ SetTreeModule_balance),
/* harmony export */   "SetTreeModule_split": () => (/* binding */ SetTreeModule_split),
/* harmony export */   "SetTreeModule_spliceOutSuccessor": () => (/* binding */ SetTreeModule_spliceOutSuccessor),
/* harmony export */   "SetTreeModule_remove": () => (/* binding */ SetTreeModule_remove),
/* harmony export */   "SetTreeModule_mem": () => (/* binding */ SetTreeModule_mem),
/* harmony export */   "SetTreeModule_iter": () => (/* binding */ SetTreeModule_iter),
/* harmony export */   "SetTreeModule_foldBackOpt": () => (/* binding */ SetTreeModule_foldBackOpt),
/* harmony export */   "SetTreeModule_foldBack": () => (/* binding */ SetTreeModule_foldBack),
/* harmony export */   "SetTreeModule_foldOpt": () => (/* binding */ SetTreeModule_foldOpt),
/* harmony export */   "SetTreeModule_fold": () => (/* binding */ SetTreeModule_fold),
/* harmony export */   "SetTreeModule_forall": () => (/* binding */ SetTreeModule_forall),
/* harmony export */   "SetTreeModule_exists": () => (/* binding */ SetTreeModule_exists),
/* harmony export */   "SetTreeModule_subset": () => (/* binding */ SetTreeModule_subset),
/* harmony export */   "SetTreeModule_properSubset": () => (/* binding */ SetTreeModule_properSubset),
/* harmony export */   "SetTreeModule_filterAux": () => (/* binding */ SetTreeModule_filterAux),
/* harmony export */   "SetTreeModule_filter": () => (/* binding */ SetTreeModule_filter),
/* harmony export */   "SetTreeModule_diffAux": () => (/* binding */ SetTreeModule_diffAux),
/* harmony export */   "SetTreeModule_diff": () => (/* binding */ SetTreeModule_diff),
/* harmony export */   "SetTreeModule_union": () => (/* binding */ SetTreeModule_union),
/* harmony export */   "SetTreeModule_intersectionAux": () => (/* binding */ SetTreeModule_intersectionAux),
/* harmony export */   "SetTreeModule_intersection": () => (/* binding */ SetTreeModule_intersection),
/* harmony export */   "SetTreeModule_partition1": () => (/* binding */ SetTreeModule_partition1),
/* harmony export */   "SetTreeModule_partitionAux": () => (/* binding */ SetTreeModule_partitionAux),
/* harmony export */   "SetTreeModule_partition": () => (/* binding */ SetTreeModule_partition),
/* harmony export */   "SetTreeModule_minimumElementAux": () => (/* binding */ SetTreeModule_minimumElementAux),
/* harmony export */   "SetTreeModule_minimumElementOpt": () => (/* binding */ SetTreeModule_minimumElementOpt),
/* harmony export */   "SetTreeModule_maximumElementAux": () => (/* binding */ SetTreeModule_maximumElementAux),
/* harmony export */   "SetTreeModule_maximumElementOpt": () => (/* binding */ SetTreeModule_maximumElementOpt),
/* harmony export */   "SetTreeModule_minimumElement": () => (/* binding */ SetTreeModule_minimumElement),
/* harmony export */   "SetTreeModule_maximumElement": () => (/* binding */ SetTreeModule_maximumElement),
/* harmony export */   "SetTreeModule_SetIterator$1": () => (/* binding */ SetTreeModule_SetIterator$1),
/* harmony export */   "SetTreeModule_SetIterator$1$reflection": () => (/* binding */ SetTreeModule_SetIterator$1$reflection),
/* harmony export */   "SetTreeModule_collapseLHS": () => (/* binding */ SetTreeModule_collapseLHS),
/* harmony export */   "SetTreeModule_mkIterator": () => (/* binding */ SetTreeModule_mkIterator),
/* harmony export */   "SetTreeModule_notStarted": () => (/* binding */ SetTreeModule_notStarted),
/* harmony export */   "SetTreeModule_alreadyFinished": () => (/* binding */ SetTreeModule_alreadyFinished),
/* harmony export */   "SetTreeModule_current": () => (/* binding */ SetTreeModule_current),
/* harmony export */   "SetTreeModule_moveNext": () => (/* binding */ SetTreeModule_moveNext),
/* harmony export */   "SetTreeModule_mkIEnumerator": () => (/* binding */ SetTreeModule_mkIEnumerator),
/* harmony export */   "SetTreeModule_compareStacks": () => (/* binding */ SetTreeModule_compareStacks),
/* harmony export */   "SetTreeModule_compare": () => (/* binding */ SetTreeModule_compare),
/* harmony export */   "SetTreeModule_choose": () => (/* binding */ SetTreeModule_choose),
/* harmony export */   "SetTreeModule_toList": () => (/* binding */ SetTreeModule_toList),
/* harmony export */   "SetTreeModule_copyToArray": () => (/* binding */ SetTreeModule_copyToArray),
/* harmony export */   "SetTreeModule_toArray": () => (/* binding */ SetTreeModule_toArray),
/* harmony export */   "SetTreeModule_mkFromEnumerator": () => (/* binding */ SetTreeModule_mkFromEnumerator),
/* harmony export */   "SetTreeModule_ofSeq": () => (/* binding */ SetTreeModule_ofSeq),
/* harmony export */   "SetTreeModule_ofArray": () => (/* binding */ SetTreeModule_ofArray),
/* harmony export */   "FSharpSet": () => (/* binding */ FSharpSet),
/* harmony export */   "FSharpSet$reflection": () => (/* binding */ FSharpSet$reflection),
/* harmony export */   "FSharpSet_$ctor": () => (/* binding */ FSharpSet_$ctor),
/* harmony export */   "FSharpSet__get_Comparer": () => (/* binding */ FSharpSet__get_Comparer),
/* harmony export */   "FSharpSet__get_Tree": () => (/* binding */ FSharpSet__get_Tree),
/* harmony export */   "FSharpSet_Empty": () => (/* binding */ FSharpSet_Empty),
/* harmony export */   "FSharpSet__Add": () => (/* binding */ FSharpSet__Add),
/* harmony export */   "FSharpSet__Remove": () => (/* binding */ FSharpSet__Remove),
/* harmony export */   "FSharpSet__get_Count": () => (/* binding */ FSharpSet__get_Count),
/* harmony export */   "FSharpSet__Contains": () => (/* binding */ FSharpSet__Contains),
/* harmony export */   "FSharpSet__Iterate": () => (/* binding */ FSharpSet__Iterate),
/* harmony export */   "FSharpSet__Fold": () => (/* binding */ FSharpSet__Fold),
/* harmony export */   "FSharpSet__get_IsEmpty": () => (/* binding */ FSharpSet__get_IsEmpty),
/* harmony export */   "FSharpSet__Partition": () => (/* binding */ FSharpSet__Partition),
/* harmony export */   "FSharpSet__Filter": () => (/* binding */ FSharpSet__Filter),
/* harmony export */   "FSharpSet__Map": () => (/* binding */ FSharpSet__Map),
/* harmony export */   "FSharpSet__Exists": () => (/* binding */ FSharpSet__Exists),
/* harmony export */   "FSharpSet__ForAll": () => (/* binding */ FSharpSet__ForAll),
/* harmony export */   "FSharpSet_op_Subtraction": () => (/* binding */ FSharpSet_op_Subtraction),
/* harmony export */   "FSharpSet_op_Addition": () => (/* binding */ FSharpSet_op_Addition),
/* harmony export */   "FSharpSet_Intersection": () => (/* binding */ FSharpSet_Intersection),
/* harmony export */   "FSharpSet_IntersectionMany": () => (/* binding */ FSharpSet_IntersectionMany),
/* harmony export */   "FSharpSet_Equality": () => (/* binding */ FSharpSet_Equality),
/* harmony export */   "FSharpSet_Compare": () => (/* binding */ FSharpSet_Compare),
/* harmony export */   "FSharpSet__get_Choose": () => (/* binding */ FSharpSet__get_Choose),
/* harmony export */   "FSharpSet__get_MinimumElement": () => (/* binding */ FSharpSet__get_MinimumElement),
/* harmony export */   "FSharpSet__get_MaximumElement": () => (/* binding */ FSharpSet__get_MaximumElement),
/* harmony export */   "FSharpSet__IsSubsetOf": () => (/* binding */ FSharpSet__IsSubsetOf),
/* harmony export */   "FSharpSet__IsSupersetOf": () => (/* binding */ FSharpSet__IsSupersetOf),
/* harmony export */   "FSharpSet__IsProperSubsetOf": () => (/* binding */ FSharpSet__IsProperSubsetOf),
/* harmony export */   "FSharpSet__IsProperSupersetOf": () => (/* binding */ FSharpSet__IsProperSupersetOf),
/* harmony export */   "FSharpSet__ToList": () => (/* binding */ FSharpSet__ToList),
/* harmony export */   "FSharpSet__ToArray": () => (/* binding */ FSharpSet__ToArray),
/* harmony export */   "FSharpSet__ComputeHashCode": () => (/* binding */ FSharpSet__ComputeHashCode),
/* harmony export */   "isEmpty": () => (/* binding */ isEmpty),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "remove": () => (/* binding */ remove),
/* harmony export */   "union": () => (/* binding */ union),
/* harmony export */   "unionMany": () => (/* binding */ unionMany),
/* harmony export */   "intersect": () => (/* binding */ intersect),
/* harmony export */   "intersectMany": () => (/* binding */ intersectMany),
/* harmony export */   "iterate": () => (/* binding */ iterate),
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "forAll": () => (/* binding */ forAll),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "partition": () => (/* binding */ partition),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "foldBack": () => (/* binding */ foldBack),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "count": () => (/* binding */ count),
/* harmony export */   "ofList": () => (/* binding */ ofList),
/* harmony export */   "ofArray": () => (/* binding */ ofArray),
/* harmony export */   "toList": () => (/* binding */ toList),
/* harmony export */   "toArray": () => (/* binding */ toArray),
/* harmony export */   "toSeq": () => (/* binding */ toSeq),
/* harmony export */   "ofSeq": () => (/* binding */ ofSeq),
/* harmony export */   "difference": () => (/* binding */ difference),
/* harmony export */   "isSubset": () => (/* binding */ isSubset),
/* harmony export */   "isSuperset": () => (/* binding */ isSuperset),
/* harmony export */   "isProperSubset": () => (/* binding */ isProperSubset),
/* harmony export */   "isProperSuperset": () => (/* binding */ isProperSuperset),
/* harmony export */   "minElement": () => (/* binding */ minElement),
/* harmony export */   "maxElement": () => (/* binding */ maxElement),
/* harmony export */   "createMutable": () => (/* binding */ createMutable),
/* harmony export */   "distinct": () => (/* binding */ distinct),
/* harmony export */   "distinctBy": () => (/* binding */ distinctBy),
/* harmony export */   "unionWith": () => (/* binding */ unionWith),
/* harmony export */   "intersectWith": () => (/* binding */ intersectWith),
/* harmony export */   "exceptWith": () => (/* binding */ exceptWith),
/* harmony export */   "isSubsetOf": () => (/* binding */ isSubsetOf),
/* harmony export */   "isSupersetOf": () => (/* binding */ isSupersetOf),
/* harmony export */   "isProperSubsetOf": () => (/* binding */ isProperSubsetOf),
/* harmony export */   "isProperSupersetOf": () => (/* binding */ isProperSupersetOf)
/* harmony export */ });
/* harmony import */ var _Reflection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _Seq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);
/* harmony import */ var _Array_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/* harmony import */ var _String_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7);
/* harmony import */ var _MutableSet_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(27);









class SetTreeLeaf$1 {
    constructor(k) {
        this.k = k;
    }
}

function SetTreeLeaf$1$reflection(gen0) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.class_type)("Set.SetTreeLeaf`1", [gen0], SetTreeLeaf$1);
}

function SetTreeLeaf$1_$ctor_2B595(k) {
    return new SetTreeLeaf$1(k);
}

function SetTreeLeaf$1__get_Key(_) {
    return _.k;
}

class SetTreeNode$1 extends SetTreeLeaf$1 {
    constructor(v, left, right, h) {
        super(v);
        this.left = left;
        this.right = right;
        this.h = h;
    }
}

function SetTreeNode$1$reflection(gen0) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.class_type)("Set.SetTreeNode`1", [gen0], SetTreeNode$1, SetTreeLeaf$1$reflection(gen0));
}

function SetTreeNode$1_$ctor_Z6E7BE5F7(v, left, right, h) {
    return new SetTreeNode$1(v, left, right, h);
}

function SetTreeNode$1__get_Left(_) {
    return _.left;
}

function SetTreeNode$1__get_Right(_) {
    return _.right;
}

function SetTreeNode$1__get_Height(_) {
    return _.h;
}

function SetTreeModule_empty() {
    return void 0;
}

function SetTreeModule_countAux(t_mut, acc_mut) {
    SetTreeModule_countAux:
    while (true) {
        const t = t_mut, acc = acc_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                t_mut = SetTreeNode$1__get_Left(t2);
                acc_mut = SetTreeModule_countAux(SetTreeNode$1__get_Right(t2), acc + 1);
                continue SetTreeModule_countAux;
            }
            else {
                return (acc + 1) | 0;
            }
        }
        else {
            return acc | 0;
        }
        break;
    }
}

function SetTreeModule_count(s) {
    return SetTreeModule_countAux(s, 0);
}

function SetTreeModule_mk(l, k, r) {
    let hl;
    const t = l;
    if (t != null) {
        const t2 = t;
        hl = ((t2 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2) : 1);
    }
    else {
        hl = 0;
    }
    let hr;
    const t_1 = r;
    if (t_1 != null) {
        const t2_1 = t_1;
        hr = ((t2_1 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2_1) : 1);
    }
    else {
        hr = 0;
    }
    const m = ((hl < hr) ? hr : hl) | 0;
    if (m === 0) {
        return SetTreeLeaf$1_$ctor_2B595(k);
    }
    else {
        return SetTreeNode$1_$ctor_Z6E7BE5F7(k, l, r, m + 1);
    }
}

function SetTreeModule_rebalance(t1, v, t2) {
    let t_2, t2_3, t_3, t2_4;
    let t1h;
    const t = t1;
    if (t != null) {
        const t2_1 = t;
        t1h = ((t2_1 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2_1) : 1);
    }
    else {
        t1h = 0;
    }
    let t2h;
    const t_1 = t2;
    if (t_1 != null) {
        const t2_2 = t_1;
        t2h = ((t2_2 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2_2) : 1);
    }
    else {
        t2h = 0;
    }
    if (t2h > (t1h + 2)) {
        const matchValue = (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(t2);
        if (matchValue instanceof SetTreeNode$1) {
            if ((t_2 = SetTreeNode$1__get_Left(matchValue), (t_2 != null) ? (t2_3 = t_2, (t2_3 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2_3) : 1) : 0) > (t1h + 1)) {
                const matchValue_1 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(SetTreeNode$1__get_Left(matchValue));
                if (matchValue_1 instanceof SetTreeNode$1) {
                    return SetTreeModule_mk(SetTreeModule_mk(t1, v, SetTreeNode$1__get_Left(matchValue_1)), SetTreeLeaf$1__get_Key(matchValue_1), SetTreeModule_mk(SetTreeNode$1__get_Right(matchValue_1), SetTreeLeaf$1__get_Key(matchValue), SetTreeNode$1__get_Right(matchValue)));
                }
                else {
                    throw (new Error("internal error: Set.rebalance"));
                }
            }
            else {
                return SetTreeModule_mk(SetTreeModule_mk(t1, v, SetTreeNode$1__get_Left(matchValue)), SetTreeLeaf$1__get_Key(matchValue), SetTreeNode$1__get_Right(matchValue));
            }
        }
        else {
            throw (new Error("internal error: Set.rebalance"));
        }
    }
    else if (t1h > (t2h + 2)) {
        const matchValue_2 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(t1);
        if (matchValue_2 instanceof SetTreeNode$1) {
            if ((t_3 = SetTreeNode$1__get_Right(matchValue_2), (t_3 != null) ? (t2_4 = t_3, (t2_4 instanceof SetTreeNode$1) ? SetTreeNode$1__get_Height(t2_4) : 1) : 0) > (t2h + 1)) {
                const matchValue_3 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(SetTreeNode$1__get_Right(matchValue_2));
                if (matchValue_3 instanceof SetTreeNode$1) {
                    return SetTreeModule_mk(SetTreeModule_mk(SetTreeNode$1__get_Left(matchValue_2), SetTreeLeaf$1__get_Key(matchValue_2), SetTreeNode$1__get_Left(matchValue_3)), SetTreeLeaf$1__get_Key(matchValue_3), SetTreeModule_mk(SetTreeNode$1__get_Right(matchValue_3), v, t2));
                }
                else {
                    throw (new Error("internal error: Set.rebalance"));
                }
            }
            else {
                return SetTreeModule_mk(SetTreeNode$1__get_Left(matchValue_2), SetTreeLeaf$1__get_Key(matchValue_2), SetTreeModule_mk(SetTreeNode$1__get_Right(matchValue_2), v, t2));
            }
        }
        else {
            throw (new Error("internal error: Set.rebalance"));
        }
    }
    else {
        return SetTreeModule_mk(t1, v, t2);
    }
}

function SetTreeModule_add(comparer, k, t) {
    if (t != null) {
        const t2 = t;
        const c = comparer.Compare(k, SetTreeLeaf$1__get_Key(t2)) | 0;
        if (t2 instanceof SetTreeNode$1) {
            if (c < 0) {
                return SetTreeModule_rebalance(SetTreeModule_add(comparer, k, SetTreeNode$1__get_Left(t2)), SetTreeLeaf$1__get_Key(t2), SetTreeNode$1__get_Right(t2));
            }
            else if (c === 0) {
                return t;
            }
            else {
                return SetTreeModule_rebalance(SetTreeNode$1__get_Left(t2), SetTreeLeaf$1__get_Key(t2), SetTreeModule_add(comparer, k, SetTreeNode$1__get_Right(t2)));
            }
        }
        else {
            const c_1 = comparer.Compare(k, SetTreeLeaf$1__get_Key(t2)) | 0;
            if (c_1 < 0) {
                return SetTreeNode$1_$ctor_Z6E7BE5F7(k, SetTreeModule_empty(), t, 2);
            }
            else if (c_1 === 0) {
                return t;
            }
            else {
                return SetTreeNode$1_$ctor_Z6E7BE5F7(k, t, SetTreeModule_empty(), 2);
            }
        }
    }
    else {
        return SetTreeLeaf$1_$ctor_2B595(k);
    }
}

function SetTreeModule_balance(comparer, t1, k, t2) {
    if (t1 != null) {
        const t1$0027 = t1;
        if (t2 != null) {
            const t2$0027 = t2;
            if (t1$0027 instanceof SetTreeNode$1) {
                if (t2$0027 instanceof SetTreeNode$1) {
                    if ((SetTreeNode$1__get_Height(t1$0027) + 2) < SetTreeNode$1__get_Height(t2$0027)) {
                        return SetTreeModule_rebalance(SetTreeModule_balance(comparer, t1, k, SetTreeNode$1__get_Left(t2$0027)), SetTreeLeaf$1__get_Key(t2$0027), SetTreeNode$1__get_Right(t2$0027));
                    }
                    else if ((SetTreeNode$1__get_Height(t2$0027) + 2) < SetTreeNode$1__get_Height(t1$0027)) {
                        return SetTreeModule_rebalance(SetTreeNode$1__get_Left(t1$0027), SetTreeLeaf$1__get_Key(t1$0027), SetTreeModule_balance(comparer, SetTreeNode$1__get_Right(t1$0027), k, t2));
                    }
                    else {
                        return SetTreeModule_mk(t1, k, t2);
                    }
                }
                else {
                    return SetTreeModule_add(comparer, k, SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2$0027), t1));
                }
            }
            else {
                return SetTreeModule_add(comparer, k, SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t1$0027), t2));
            }
        }
        else {
            return SetTreeModule_add(comparer, k, t1);
        }
    }
    else {
        return SetTreeModule_add(comparer, k, t2);
    }
}

function SetTreeModule_split(comparer, pivot, t) {
    if (t != null) {
        const t2 = t;
        if (t2 instanceof SetTreeNode$1) {
            const c = comparer.Compare(pivot, SetTreeLeaf$1__get_Key(t2)) | 0;
            if (c < 0) {
                const patternInput = SetTreeModule_split(comparer, pivot, SetTreeNode$1__get_Left(t2));
                return [patternInput[0], patternInput[1], SetTreeModule_balance(comparer, patternInput[2], SetTreeLeaf$1__get_Key(t2), SetTreeNode$1__get_Right(t2))];
            }
            else if (c === 0) {
                return [SetTreeNode$1__get_Left(t2), true, SetTreeNode$1__get_Right(t2)];
            }
            else {
                const patternInput_1 = SetTreeModule_split(comparer, pivot, SetTreeNode$1__get_Right(t2));
                return [SetTreeModule_balance(comparer, SetTreeNode$1__get_Left(t2), SetTreeLeaf$1__get_Key(t2), patternInput_1[0]), patternInput_1[1], patternInput_1[2]];
            }
        }
        else {
            const c_1 = comparer.Compare(SetTreeLeaf$1__get_Key(t2), pivot) | 0;
            if (c_1 < 0) {
                return [t, false, SetTreeModule_empty()];
            }
            else if (c_1 === 0) {
                return [SetTreeModule_empty(), true, SetTreeModule_empty()];
            }
            else {
                return [SetTreeModule_empty(), false, t];
            }
        }
    }
    else {
        return [SetTreeModule_empty(), false, SetTreeModule_empty()];
    }
}

function SetTreeModule_spliceOutSuccessor(t) {
    if (t != null) {
        const t2 = t;
        if (t2 instanceof SetTreeNode$1) {
            if (SetTreeNode$1__get_Left(t2) == null) {
                return [SetTreeLeaf$1__get_Key(t2), SetTreeNode$1__get_Right(t2)];
            }
            else {
                const patternInput = SetTreeModule_spliceOutSuccessor(SetTreeNode$1__get_Left(t2));
                return [patternInput[0], SetTreeModule_mk(patternInput[1], SetTreeLeaf$1__get_Key(t2), SetTreeNode$1__get_Right(t2))];
            }
        }
        else {
            return [SetTreeLeaf$1__get_Key(t2), SetTreeModule_empty()];
        }
    }
    else {
        throw (new Error("internal error: Set.spliceOutSuccessor"));
    }
}

function SetTreeModule_remove(comparer, k, t) {
    if (t != null) {
        const t2 = t;
        const c = comparer.Compare(k, SetTreeLeaf$1__get_Key(t2)) | 0;
        if (t2 instanceof SetTreeNode$1) {
            if (c < 0) {
                return SetTreeModule_rebalance(SetTreeModule_remove(comparer, k, SetTreeNode$1__get_Left(t2)), SetTreeLeaf$1__get_Key(t2), SetTreeNode$1__get_Right(t2));
            }
            else if (c === 0) {
                if (SetTreeNode$1__get_Left(t2) == null) {
                    return SetTreeNode$1__get_Right(t2);
                }
                else if (SetTreeNode$1__get_Right(t2) == null) {
                    return SetTreeNode$1__get_Left(t2);
                }
                else {
                    const patternInput = SetTreeModule_spliceOutSuccessor(SetTreeNode$1__get_Right(t2));
                    return SetTreeModule_mk(SetTreeNode$1__get_Left(t2), patternInput[0], patternInput[1]);
                }
            }
            else {
                return SetTreeModule_rebalance(SetTreeNode$1__get_Left(t2), SetTreeLeaf$1__get_Key(t2), SetTreeModule_remove(comparer, k, SetTreeNode$1__get_Right(t2)));
            }
        }
        else if (c === 0) {
            return SetTreeModule_empty();
        }
        else {
            return t;
        }
    }
    else {
        return t;
    }
}

function SetTreeModule_mem(comparer_mut, k_mut, t_mut) {
    SetTreeModule_mem:
    while (true) {
        const comparer = comparer_mut, k = k_mut, t = t_mut;
        if (t != null) {
            const t2 = t;
            const c = comparer.Compare(k, SetTreeLeaf$1__get_Key(t2)) | 0;
            if (t2 instanceof SetTreeNode$1) {
                if (c < 0) {
                    comparer_mut = comparer;
                    k_mut = k;
                    t_mut = SetTreeNode$1__get_Left(t2);
                    continue SetTreeModule_mem;
                }
                else if (c === 0) {
                    return true;
                }
                else {
                    comparer_mut = comparer;
                    k_mut = k;
                    t_mut = SetTreeNode$1__get_Right(t2);
                    continue SetTreeModule_mem;
                }
            }
            else {
                return c === 0;
            }
        }
        else {
            return false;
        }
        break;
    }
}

function SetTreeModule_iter(f_mut, t_mut) {
    SetTreeModule_iter:
    while (true) {
        const f = f_mut, t = t_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                SetTreeModule_iter(f, SetTreeNode$1__get_Left(t2));
                f(SetTreeLeaf$1__get_Key(t2));
                f_mut = f;
                t_mut = SetTreeNode$1__get_Right(t2);
                continue SetTreeModule_iter;
            }
            else {
                f(SetTreeLeaf$1__get_Key(t2));
            }
        }
        break;
    }
}

function SetTreeModule_foldBackOpt(f_mut, t_mut, x_mut) {
    SetTreeModule_foldBackOpt:
    while (true) {
        const f = f_mut, t = t_mut, x = x_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                f_mut = f;
                t_mut = SetTreeNode$1__get_Left(t2);
                x_mut = f(SetTreeLeaf$1__get_Key(t2), SetTreeModule_foldBackOpt(f, SetTreeNode$1__get_Right(t2), x));
                continue SetTreeModule_foldBackOpt;
            }
            else {
                return f(SetTreeLeaf$1__get_Key(t2), x);
            }
        }
        else {
            return x;
        }
        break;
    }
}

function SetTreeModule_foldBack(f, m, x) {
    return SetTreeModule_foldBackOpt(f, m, x);
}

function SetTreeModule_foldOpt(f_mut, x_mut, t_mut) {
    SetTreeModule_foldOpt:
    while (true) {
        const f = f_mut, x = x_mut, t = t_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                f_mut = f;
                x_mut = f(SetTreeModule_foldOpt(f, x, SetTreeNode$1__get_Left(t2)), SetTreeLeaf$1__get_Key(t2));
                t_mut = SetTreeNode$1__get_Right(t2);
                continue SetTreeModule_foldOpt;
            }
            else {
                return f(x, SetTreeLeaf$1__get_Key(t2));
            }
        }
        else {
            return x;
        }
        break;
    }
}

function SetTreeModule_fold(f, x, m) {
    return SetTreeModule_foldOpt(f, x, m);
}

function SetTreeModule_forall(f_mut, t_mut) {
    SetTreeModule_forall:
    while (true) {
        const f = f_mut, t = t_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                if (f(SetTreeLeaf$1__get_Key(t2)) ? SetTreeModule_forall(f, SetTreeNode$1__get_Left(t2)) : false) {
                    f_mut = f;
                    t_mut = SetTreeNode$1__get_Right(t2);
                    continue SetTreeModule_forall;
                }
                else {
                    return false;
                }
            }
            else {
                return f(SetTreeLeaf$1__get_Key(t2));
            }
        }
        else {
            return true;
        }
        break;
    }
}

function SetTreeModule_exists(f_mut, t_mut) {
    SetTreeModule_exists:
    while (true) {
        const f = f_mut, t = t_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                if (f(SetTreeLeaf$1__get_Key(t2)) ? true : SetTreeModule_exists(f, SetTreeNode$1__get_Left(t2))) {
                    return true;
                }
                else {
                    f_mut = f;
                    t_mut = SetTreeNode$1__get_Right(t2);
                    continue SetTreeModule_exists;
                }
            }
            else {
                return f(SetTreeLeaf$1__get_Key(t2));
            }
        }
        else {
            return false;
        }
        break;
    }
}

function SetTreeModule_subset(comparer, a, b) {
    return SetTreeModule_forall((x) => SetTreeModule_mem(comparer, x, b), a);
}

function SetTreeModule_properSubset(comparer, a, b) {
    if (SetTreeModule_forall((x) => SetTreeModule_mem(comparer, x, b), a)) {
        return SetTreeModule_exists((x_1) => (!SetTreeModule_mem(comparer, x_1, a)), b);
    }
    else {
        return false;
    }
}

function SetTreeModule_filterAux(comparer_mut, f_mut, t_mut, acc_mut) {
    SetTreeModule_filterAux:
    while (true) {
        const comparer = comparer_mut, f = f_mut, t = t_mut, acc = acc_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                const acc_1 = f(SetTreeLeaf$1__get_Key(t2)) ? SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2), acc) : acc;
                comparer_mut = comparer;
                f_mut = f;
                t_mut = SetTreeNode$1__get_Left(t2);
                acc_mut = SetTreeModule_filterAux(comparer, f, SetTreeNode$1__get_Right(t2), acc_1);
                continue SetTreeModule_filterAux;
            }
            else if (f(SetTreeLeaf$1__get_Key(t2))) {
                return SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2), acc);
            }
            else {
                return acc;
            }
        }
        else {
            return acc;
        }
        break;
    }
}

function SetTreeModule_filter(comparer, f, s) {
    return SetTreeModule_filterAux(comparer, f, s, SetTreeModule_empty());
}

function SetTreeModule_diffAux(comparer_mut, t_mut, acc_mut) {
    SetTreeModule_diffAux:
    while (true) {
        const comparer = comparer_mut, t = t_mut, acc = acc_mut;
        if (acc == null) {
            return acc;
        }
        else if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                comparer_mut = comparer;
                t_mut = SetTreeNode$1__get_Left(t2);
                acc_mut = SetTreeModule_diffAux(comparer, SetTreeNode$1__get_Right(t2), SetTreeModule_remove(comparer, SetTreeLeaf$1__get_Key(t2), acc));
                continue SetTreeModule_diffAux;
            }
            else {
                return SetTreeModule_remove(comparer, SetTreeLeaf$1__get_Key(t2), acc);
            }
        }
        else {
            return acc;
        }
        break;
    }
}

function SetTreeModule_diff(comparer, a, b) {
    return SetTreeModule_diffAux(comparer, b, a);
}

function SetTreeModule_union(comparer, t1, t2) {
    if (t1 != null) {
        const t1$0027 = t1;
        if (t2 != null) {
            const t2$0027 = t2;
            if (t1$0027 instanceof SetTreeNode$1) {
                if (t2$0027 instanceof SetTreeNode$1) {
                    if (SetTreeNode$1__get_Height(t1$0027) > SetTreeNode$1__get_Height(t2$0027)) {
                        const patternInput = SetTreeModule_split(comparer, SetTreeLeaf$1__get_Key(t1$0027), t2);
                        return SetTreeModule_balance(comparer, SetTreeModule_union(comparer, SetTreeNode$1__get_Left(t1$0027), patternInput[0]), SetTreeLeaf$1__get_Key(t1$0027), SetTreeModule_union(comparer, SetTreeNode$1__get_Right(t1$0027), patternInput[2]));
                    }
                    else {
                        const patternInput_1 = SetTreeModule_split(comparer, SetTreeLeaf$1__get_Key(t2$0027), t1);
                        return SetTreeModule_balance(comparer, SetTreeModule_union(comparer, SetTreeNode$1__get_Left(t2$0027), patternInput_1[0]), SetTreeLeaf$1__get_Key(t2$0027), SetTreeModule_union(comparer, SetTreeNode$1__get_Right(t2$0027), patternInput_1[2]));
                    }
                }
                else {
                    return SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2$0027), t1);
                }
            }
            else {
                return SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t1$0027), t2);
            }
        }
        else {
            return t1;
        }
    }
    else {
        return t2;
    }
}

function SetTreeModule_intersectionAux(comparer_mut, b_mut, t_mut, acc_mut) {
    SetTreeModule_intersectionAux:
    while (true) {
        const comparer = comparer_mut, b = b_mut, t = t_mut, acc = acc_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                const acc_1 = SetTreeModule_intersectionAux(comparer, b, SetTreeNode$1__get_Right(t2), acc);
                const acc_2 = SetTreeModule_mem(comparer, SetTreeLeaf$1__get_Key(t2), b) ? SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2), acc_1) : acc_1;
                comparer_mut = comparer;
                b_mut = b;
                t_mut = SetTreeNode$1__get_Left(t2);
                acc_mut = acc_2;
                continue SetTreeModule_intersectionAux;
            }
            else if (SetTreeModule_mem(comparer, SetTreeLeaf$1__get_Key(t2), b)) {
                return SetTreeModule_add(comparer, SetTreeLeaf$1__get_Key(t2), acc);
            }
            else {
                return acc;
            }
        }
        else {
            return acc;
        }
        break;
    }
}

function SetTreeModule_intersection(comparer, a, b) {
    return SetTreeModule_intersectionAux(comparer, b, a, SetTreeModule_empty());
}

function SetTreeModule_partition1(comparer, f, k, acc1, acc2) {
    if (f(k)) {
        return [SetTreeModule_add(comparer, k, acc1), acc2];
    }
    else {
        return [acc1, SetTreeModule_add(comparer, k, acc2)];
    }
}

function SetTreeModule_partitionAux(comparer_mut, f_mut, t_mut, acc_0_mut, acc_1_mut) {
    SetTreeModule_partitionAux:
    while (true) {
        const comparer = comparer_mut, f = f_mut, t = t_mut, acc_0 = acc_0_mut, acc_1 = acc_1_mut;
        const acc = [acc_0, acc_1];
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                const acc_2 = SetTreeModule_partitionAux(comparer, f, SetTreeNode$1__get_Right(t2), acc[0], acc[1]);
                const acc_3 = SetTreeModule_partition1(comparer, f, SetTreeLeaf$1__get_Key(t2), acc_2[0], acc_2[1]);
                comparer_mut = comparer;
                f_mut = f;
                t_mut = SetTreeNode$1__get_Left(t2);
                acc_0_mut = acc_3[0];
                acc_1_mut = acc_3[1];
                continue SetTreeModule_partitionAux;
            }
            else {
                return SetTreeModule_partition1(comparer, f, SetTreeLeaf$1__get_Key(t2), acc[0], acc[1]);
            }
        }
        else {
            return acc;
        }
        break;
    }
}

function SetTreeModule_partition(comparer, f, s) {
    return SetTreeModule_partitionAux(comparer, f, s, SetTreeModule_empty(), SetTreeModule_empty());
}

function SetTreeModule_minimumElementAux(t_mut, n_mut) {
    SetTreeModule_minimumElementAux:
    while (true) {
        const t = t_mut, n = n_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                t_mut = SetTreeNode$1__get_Left(t2);
                n_mut = SetTreeLeaf$1__get_Key(t2);
                continue SetTreeModule_minimumElementAux;
            }
            else {
                return SetTreeLeaf$1__get_Key(t2);
            }
        }
        else {
            return n;
        }
        break;
    }
}

function SetTreeModule_minimumElementOpt(t) {
    if (t != null) {
        const t2 = t;
        if (t2 instanceof SetTreeNode$1) {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(SetTreeModule_minimumElementAux(SetTreeNode$1__get_Left(t2), SetTreeLeaf$1__get_Key(t2)));
        }
        else {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(SetTreeLeaf$1__get_Key(t2));
        }
    }
    else {
        return void 0;
    }
}

function SetTreeModule_maximumElementAux(t_mut, n_mut) {
    SetTreeModule_maximumElementAux:
    while (true) {
        const t = t_mut, n = n_mut;
        if (t != null) {
            const t2 = t;
            if (t2 instanceof SetTreeNode$1) {
                t_mut = SetTreeNode$1__get_Right(t2);
                n_mut = SetTreeLeaf$1__get_Key(t2);
                continue SetTreeModule_maximumElementAux;
            }
            else {
                return SetTreeLeaf$1__get_Key(t2);
            }
        }
        else {
            return n;
        }
        break;
    }
}

function SetTreeModule_maximumElementOpt(t) {
    if (t != null) {
        const t2 = t;
        if (t2 instanceof SetTreeNode$1) {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(SetTreeModule_maximumElementAux(SetTreeNode$1__get_Right(t2), SetTreeLeaf$1__get_Key(t2)));
        }
        else {
            return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(SetTreeLeaf$1__get_Key(t2));
        }
    }
    else {
        return void 0;
    }
}

function SetTreeModule_minimumElement(s) {
    const matchValue = SetTreeModule_minimumElementOpt(s);
    if (matchValue == null) {
        throw (new Error("Set contains no elements"));
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(matchValue);
    }
}

function SetTreeModule_maximumElement(s) {
    const matchValue = SetTreeModule_maximumElementOpt(s);
    if (matchValue == null) {
        throw (new Error("Set contains no elements"));
    }
    else {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(matchValue);
    }
}

class SetTreeModule_SetIterator$1 extends _Types_js__WEBPACK_IMPORTED_MODULE_2__.Record {
    constructor(stack, started) {
        super();
        this.stack = stack;
        this.started = started;
    }
}

function SetTreeModule_SetIterator$1$reflection(gen0) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.record_type)("Set.SetTreeModule.SetIterator`1", [gen0], SetTreeModule_SetIterator$1, () => [["stack", (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.list_type)((0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.option_type)(SetTreeLeaf$1$reflection(gen0)))], ["started", _Reflection_js__WEBPACK_IMPORTED_MODULE_0__.bool_type]]);
}

function SetTreeModule_collapseLHS(stack_mut) {
    SetTreeModule_collapseLHS:
    while (true) {
        const stack = stack_mut;
        if (stack.tail != null) {
            const x = stack.head;
            const rest = stack.tail;
            if (x != null) {
                const x2 = x;
                if (x2 instanceof SetTreeNode$1) {
                    stack_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2)), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Right(x2), rest))));
                    continue SetTreeModule_collapseLHS;
                }
                else {
                    return stack;
                }
            }
            else {
                stack_mut = rest;
                continue SetTreeModule_collapseLHS;
            }
        }
        else {
            return new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List();
        }
        break;
    }
}

function SetTreeModule_mkIterator(s) {
    return new SetTreeModule_SetIterator$1(SetTreeModule_collapseLHS(new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(s, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List())), false);
}

function SetTreeModule_notStarted() {
    throw (new Error("Enumeration not started"));
}

function SetTreeModule_alreadyFinished() {
    throw (new Error("Enumeration already started"));
}

function SetTreeModule_current(i) {
    if (i.started) {
        const matchValue = i.stack;
        if (matchValue.tail == null) {
            return SetTreeModule_alreadyFinished();
        }
        else if (matchValue.head != null) {
            const t = matchValue.head;
            return SetTreeLeaf$1__get_Key(t);
        }
        else {
            throw (new Error("Please report error: Set iterator, unexpected stack for current"));
        }
    }
    else {
        return SetTreeModule_notStarted();
    }
}

function SetTreeModule_moveNext(i) {
    if (i.started) {
        const matchValue = i.stack;
        if (matchValue.tail != null) {
            if (matchValue.head != null) {
                const t = matchValue.head;
                if (t instanceof SetTreeNode$1) {
                    throw (new Error("Please report error: Set iterator, unexpected stack for moveNext"));
                }
                else {
                    i.stack = SetTreeModule_collapseLHS(matchValue.tail);
                    return !(i.stack.tail == null);
                }
            }
            else {
                throw (new Error("Please report error: Set iterator, unexpected stack for moveNext"));
            }
        }
        else {
            return false;
        }
    }
    else {
        i.started = true;
        return !(i.stack.tail == null);
    }
}

function SetTreeModule_mkIEnumerator(s) {
    let i = SetTreeModule_mkIterator(s);
    return {
        ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
            return SetTreeModule_current(i);
        },
        ["System.Collections.IEnumerator.get_Current"]() {
            return SetTreeModule_current(i);
        },
        ["System.Collections.IEnumerator.MoveNext"]() {
            return SetTreeModule_moveNext(i);
        },
        ["System.Collections.IEnumerator.Reset"]() {
            i = SetTreeModule_mkIterator(s);
        },
        Dispose() {
        },
    };
}

function SetTreeModule_compareStacks(comparer_mut, l1_mut, l2_mut) {
    SetTreeModule_compareStacks:
    while (true) {
        const comparer = comparer_mut, l1 = l1_mut, l2 = l2_mut;
        const matchValue = [l1, l2];
        if (matchValue[0].tail != null) {
            if (matchValue[1].tail != null) {
                if (matchValue[1].head != null) {
                    if (matchValue[0].head != null) {
                        const x1_3 = matchValue[0].head;
                        const x2_3 = matchValue[1].head;
                        if (x1_3 instanceof SetTreeNode$1) {
                            if (SetTreeNode$1__get_Left(x1_3) == null) {
                                if (x2_3 instanceof SetTreeNode$1) {
                                    if (SetTreeNode$1__get_Left(x2_3) == null) {
                                        const c = comparer.Compare(SetTreeLeaf$1__get_Key(x1_3), SetTreeLeaf$1__get_Key(x2_3)) | 0;
                                        if (c !== 0) {
                                            return c | 0;
                                        }
                                        else {
                                            comparer_mut = comparer;
                                            l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Right(x1_3), matchValue[0].tail));
                                            l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Right(x2_3), matchValue[1].tail));
                                            continue SetTreeModule_compareStacks;
                                        }
                                    }
                                    else {
                                        const matchValue_3 = [l1, l2];
                                        let pattern_matching_result, t1_6, x1_4, t2_6, x2_4;
                                        if (matchValue_3[0].tail != null) {
                                            if (matchValue_3[0].head != null) {
                                                pattern_matching_result = 0;
                                                t1_6 = matchValue_3[0].tail;
                                                x1_4 = matchValue_3[0].head;
                                            }
                                            else if (matchValue_3[1].tail != null) {
                                                if (matchValue_3[1].head != null) {
                                                    pattern_matching_result = 1;
                                                    t2_6 = matchValue_3[1].tail;
                                                    x2_4 = matchValue_3[1].head;
                                                }
                                                else {
                                                    pattern_matching_result = 2;
                                                }
                                            }
                                            else {
                                                pattern_matching_result = 2;
                                            }
                                        }
                                        else if (matchValue_3[1].tail != null) {
                                            if (matchValue_3[1].head != null) {
                                                pattern_matching_result = 1;
                                                t2_6 = matchValue_3[1].tail;
                                                x2_4 = matchValue_3[1].head;
                                            }
                                            else {
                                                pattern_matching_result = 2;
                                            }
                                        }
                                        else {
                                            pattern_matching_result = 2;
                                        }
                                        switch (pattern_matching_result) {
                                            case 0: {
                                                if (x1_4 instanceof SetTreeNode$1) {
                                                    comparer_mut = comparer;
                                                    l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x1_4), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x1_4), SetTreeModule_empty(), SetTreeNode$1__get_Right(x1_4), 0), t1_6)));
                                                    l2_mut = l2;
                                                    continue SetTreeModule_compareStacks;
                                                }
                                                else {
                                                    comparer_mut = comparer;
                                                    l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x1_4)), t1_6)));
                                                    l2_mut = l2;
                                                    continue SetTreeModule_compareStacks;
                                                }
                                            }
                                            case 1: {
                                                if (x2_4 instanceof SetTreeNode$1) {
                                                    comparer_mut = comparer;
                                                    l1_mut = l1;
                                                    l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2_4), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x2_4), SetTreeModule_empty(), SetTreeNode$1__get_Right(x2_4), 0), t2_6)));
                                                    continue SetTreeModule_compareStacks;
                                                }
                                                else {
                                                    comparer_mut = comparer;
                                                    l1_mut = l1;
                                                    l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2_4)), t2_6)));
                                                    continue SetTreeModule_compareStacks;
                                                }
                                            }
                                            case 2: {
                                                throw (new Error("unexpected state in SetTree.compareStacks"));
                                            }
                                        }
                                    }
                                }
                                else {
                                    const c_1 = comparer.Compare(SetTreeLeaf$1__get_Key(x1_3), SetTreeLeaf$1__get_Key(x2_3)) | 0;
                                    if (c_1 !== 0) {
                                        return c_1 | 0;
                                    }
                                    else {
                                        comparer_mut = comparer;
                                        l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Right(x1_3), matchValue[0].tail));
                                        l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), matchValue[1].tail));
                                        continue SetTreeModule_compareStacks;
                                    }
                                }
                            }
                            else {
                                const matchValue_4 = [l1, l2];
                                let pattern_matching_result_1, t1_7, x1_5, t2_7, x2_5;
                                if (matchValue_4[0].tail != null) {
                                    if (matchValue_4[0].head != null) {
                                        pattern_matching_result_1 = 0;
                                        t1_7 = matchValue_4[0].tail;
                                        x1_5 = matchValue_4[0].head;
                                    }
                                    else if (matchValue_4[1].tail != null) {
                                        if (matchValue_4[1].head != null) {
                                            pattern_matching_result_1 = 1;
                                            t2_7 = matchValue_4[1].tail;
                                            x2_5 = matchValue_4[1].head;
                                        }
                                        else {
                                            pattern_matching_result_1 = 2;
                                        }
                                    }
                                    else {
                                        pattern_matching_result_1 = 2;
                                    }
                                }
                                else if (matchValue_4[1].tail != null) {
                                    if (matchValue_4[1].head != null) {
                                        pattern_matching_result_1 = 1;
                                        t2_7 = matchValue_4[1].tail;
                                        x2_5 = matchValue_4[1].head;
                                    }
                                    else {
                                        pattern_matching_result_1 = 2;
                                    }
                                }
                                else {
                                    pattern_matching_result_1 = 2;
                                }
                                switch (pattern_matching_result_1) {
                                    case 0: {
                                        if (x1_5 instanceof SetTreeNode$1) {
                                            comparer_mut = comparer;
                                            l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x1_5), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x1_5), SetTreeModule_empty(), SetTreeNode$1__get_Right(x1_5), 0), t1_7)));
                                            l2_mut = l2;
                                            continue SetTreeModule_compareStacks;
                                        }
                                        else {
                                            comparer_mut = comparer;
                                            l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x1_5)), t1_7)));
                                            l2_mut = l2;
                                            continue SetTreeModule_compareStacks;
                                        }
                                    }
                                    case 1: {
                                        if (x2_5 instanceof SetTreeNode$1) {
                                            comparer_mut = comparer;
                                            l1_mut = l1;
                                            l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2_5), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x2_5), SetTreeModule_empty(), SetTreeNode$1__get_Right(x2_5), 0), t2_7)));
                                            continue SetTreeModule_compareStacks;
                                        }
                                        else {
                                            comparer_mut = comparer;
                                            l1_mut = l1;
                                            l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2_5)), t2_7)));
                                            continue SetTreeModule_compareStacks;
                                        }
                                    }
                                    case 2: {
                                        throw (new Error("unexpected state in SetTree.compareStacks"));
                                    }
                                }
                            }
                        }
                        else if (x2_3 instanceof SetTreeNode$1) {
                            if (SetTreeNode$1__get_Left(x2_3) == null) {
                                const c_2 = comparer.Compare(SetTreeLeaf$1__get_Key(x1_3), SetTreeLeaf$1__get_Key(x2_3)) | 0;
                                if (c_2 !== 0) {
                                    return c_2 | 0;
                                }
                                else {
                                    comparer_mut = comparer;
                                    l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), matchValue[0].tail));
                                    l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Right(x2_3), matchValue[1].tail));
                                    continue SetTreeModule_compareStacks;
                                }
                            }
                            else {
                                const matchValue_5 = [l1, l2];
                                let pattern_matching_result_2, t1_8, x1_6, t2_8, x2_6;
                                if (matchValue_5[0].tail != null) {
                                    if (matchValue_5[0].head != null) {
                                        pattern_matching_result_2 = 0;
                                        t1_8 = matchValue_5[0].tail;
                                        x1_6 = matchValue_5[0].head;
                                    }
                                    else if (matchValue_5[1].tail != null) {
                                        if (matchValue_5[1].head != null) {
                                            pattern_matching_result_2 = 1;
                                            t2_8 = matchValue_5[1].tail;
                                            x2_6 = matchValue_5[1].head;
                                        }
                                        else {
                                            pattern_matching_result_2 = 2;
                                        }
                                    }
                                    else {
                                        pattern_matching_result_2 = 2;
                                    }
                                }
                                else if (matchValue_5[1].tail != null) {
                                    if (matchValue_5[1].head != null) {
                                        pattern_matching_result_2 = 1;
                                        t2_8 = matchValue_5[1].tail;
                                        x2_6 = matchValue_5[1].head;
                                    }
                                    else {
                                        pattern_matching_result_2 = 2;
                                    }
                                }
                                else {
                                    pattern_matching_result_2 = 2;
                                }
                                switch (pattern_matching_result_2) {
                                    case 0: {
                                        if (x1_6 instanceof SetTreeNode$1) {
                                            comparer_mut = comparer;
                                            l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x1_6), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x1_6), SetTreeModule_empty(), SetTreeNode$1__get_Right(x1_6), 0), t1_8)));
                                            l2_mut = l2;
                                            continue SetTreeModule_compareStacks;
                                        }
                                        else {
                                            comparer_mut = comparer;
                                            l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x1_6)), t1_8)));
                                            l2_mut = l2;
                                            continue SetTreeModule_compareStacks;
                                        }
                                    }
                                    case 1: {
                                        if (x2_6 instanceof SetTreeNode$1) {
                                            comparer_mut = comparer;
                                            l1_mut = l1;
                                            l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2_6), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x2_6), SetTreeModule_empty(), SetTreeNode$1__get_Right(x2_6), 0), t2_8)));
                                            continue SetTreeModule_compareStacks;
                                        }
                                        else {
                                            comparer_mut = comparer;
                                            l1_mut = l1;
                                            l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2_6)), t2_8)));
                                            continue SetTreeModule_compareStacks;
                                        }
                                    }
                                    case 2: {
                                        throw (new Error("unexpected state in SetTree.compareStacks"));
                                    }
                                }
                            }
                        }
                        else {
                            const c_3 = comparer.Compare(SetTreeLeaf$1__get_Key(x1_3), SetTreeLeaf$1__get_Key(x2_3)) | 0;
                            if (c_3 !== 0) {
                                return c_3 | 0;
                            }
                            else {
                                comparer_mut = comparer;
                                l1_mut = matchValue[0].tail;
                                l2_mut = matchValue[1].tail;
                                continue SetTreeModule_compareStacks;
                            }
                        }
                    }
                    else {
                        const x2 = matchValue[1].head;
                        const matchValue_1 = [l1, l2];
                        let pattern_matching_result_3, t1_2, x1, t2_2, x2_1;
                        if (matchValue_1[0].tail != null) {
                            if (matchValue_1[0].head != null) {
                                pattern_matching_result_3 = 0;
                                t1_2 = matchValue_1[0].tail;
                                x1 = matchValue_1[0].head;
                            }
                            else if (matchValue_1[1].tail != null) {
                                if (matchValue_1[1].head != null) {
                                    pattern_matching_result_3 = 1;
                                    t2_2 = matchValue_1[1].tail;
                                    x2_1 = matchValue_1[1].head;
                                }
                                else {
                                    pattern_matching_result_3 = 2;
                                }
                            }
                            else {
                                pattern_matching_result_3 = 2;
                            }
                        }
                        else if (matchValue_1[1].tail != null) {
                            if (matchValue_1[1].head != null) {
                                pattern_matching_result_3 = 1;
                                t2_2 = matchValue_1[1].tail;
                                x2_1 = matchValue_1[1].head;
                            }
                            else {
                                pattern_matching_result_3 = 2;
                            }
                        }
                        else {
                            pattern_matching_result_3 = 2;
                        }
                        switch (pattern_matching_result_3) {
                            case 0: {
                                if (x1 instanceof SetTreeNode$1) {
                                    comparer_mut = comparer;
                                    l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x1), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x1), SetTreeModule_empty(), SetTreeNode$1__get_Right(x1), 0), t1_2)));
                                    l2_mut = l2;
                                    continue SetTreeModule_compareStacks;
                                }
                                else {
                                    comparer_mut = comparer;
                                    l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x1)), t1_2)));
                                    l2_mut = l2;
                                    continue SetTreeModule_compareStacks;
                                }
                            }
                            case 1: {
                                if (x2_1 instanceof SetTreeNode$1) {
                                    comparer_mut = comparer;
                                    l1_mut = l1;
                                    l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2_1), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x2_1), SetTreeModule_empty(), SetTreeNode$1__get_Right(x2_1), 0), t2_2)));
                                    continue SetTreeModule_compareStacks;
                                }
                                else {
                                    comparer_mut = comparer;
                                    l1_mut = l1;
                                    l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2_1)), t2_2)));
                                    continue SetTreeModule_compareStacks;
                                }
                            }
                            case 2: {
                                throw (new Error("unexpected state in SetTree.compareStacks"));
                            }
                        }
                    }
                }
                else if (matchValue[0].head != null) {
                    const x1_1 = matchValue[0].head;
                    const matchValue_2 = [l1, l2];
                    let pattern_matching_result_4, t1_4, x1_2, t2_4, x2_2;
                    if (matchValue_2[0].tail != null) {
                        if (matchValue_2[0].head != null) {
                            pattern_matching_result_4 = 0;
                            t1_4 = matchValue_2[0].tail;
                            x1_2 = matchValue_2[0].head;
                        }
                        else if (matchValue_2[1].tail != null) {
                            if (matchValue_2[1].head != null) {
                                pattern_matching_result_4 = 1;
                                t2_4 = matchValue_2[1].tail;
                                x2_2 = matchValue_2[1].head;
                            }
                            else {
                                pattern_matching_result_4 = 2;
                            }
                        }
                        else {
                            pattern_matching_result_4 = 2;
                        }
                    }
                    else if (matchValue_2[1].tail != null) {
                        if (matchValue_2[1].head != null) {
                            pattern_matching_result_4 = 1;
                            t2_4 = matchValue_2[1].tail;
                            x2_2 = matchValue_2[1].head;
                        }
                        else {
                            pattern_matching_result_4 = 2;
                        }
                    }
                    else {
                        pattern_matching_result_4 = 2;
                    }
                    switch (pattern_matching_result_4) {
                        case 0: {
                            if (x1_2 instanceof SetTreeNode$1) {
                                comparer_mut = comparer;
                                l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x1_2), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x1_2), SetTreeModule_empty(), SetTreeNode$1__get_Right(x1_2), 0), t1_4)));
                                l2_mut = l2;
                                continue SetTreeModule_compareStacks;
                            }
                            else {
                                comparer_mut = comparer;
                                l1_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x1_2)), t1_4)));
                                l2_mut = l2;
                                continue SetTreeModule_compareStacks;
                            }
                        }
                        case 1: {
                            if (x2_2 instanceof SetTreeNode$1) {
                                comparer_mut = comparer;
                                l1_mut = l1;
                                l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1__get_Left(x2_2), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeNode$1_$ctor_Z6E7BE5F7(SetTreeLeaf$1__get_Key(x2_2), SetTreeModule_empty(), SetTreeNode$1__get_Right(x2_2), 0), t2_4)));
                                continue SetTreeModule_compareStacks;
                            }
                            else {
                                comparer_mut = comparer;
                                l1_mut = l1;
                                l2_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeModule_empty(), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1_$ctor_2B595(SetTreeLeaf$1__get_Key(x2_2)), t2_4)));
                                continue SetTreeModule_compareStacks;
                            }
                        }
                        case 2: {
                            throw (new Error("unexpected state in SetTree.compareStacks"));
                        }
                    }
                }
                else {
                    comparer_mut = comparer;
                    l1_mut = matchValue[0].tail;
                    l2_mut = matchValue[1].tail;
                    continue SetTreeModule_compareStacks;
                }
            }
            else {
                return 1;
            }
        }
        else if (matchValue[1].tail == null) {
            return 0;
        }
        else {
            return -1;
        }
        break;
    }
}

function SetTreeModule_compare(comparer, t1, t2) {
    if (t1 == null) {
        if (t2 == null) {
            return 0;
        }
        else {
            return -1;
        }
    }
    else if (t2 == null) {
        return 1;
    }
    else {
        return SetTreeModule_compareStacks(comparer, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(t1, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List()), new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(t2, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List())) | 0;
    }
}

function SetTreeModule_choose(s) {
    return SetTreeModule_minimumElement(s);
}

function SetTreeModule_toList(t) {
    const loop = (t$0027_mut, acc_mut) => {
        loop:
        while (true) {
            const t$0027 = t$0027_mut, acc = acc_mut;
            if (t$0027 != null) {
                const t2 = t$0027;
                if (t2 instanceof SetTreeNode$1) {
                    t$0027_mut = SetTreeNode$1__get_Left(t2);
                    acc_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1__get_Key(t2), loop(SetTreeNode$1__get_Right(t2), acc)));
                    continue loop;
                }
                else {
                    return new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List(SetTreeLeaf$1__get_Key(t2), acc);
                }
            }
            else {
                return acc;
            }
            break;
        }
    };
    return loop(t, new _Types_js__WEBPACK_IMPORTED_MODULE_2__.List());
}

function SetTreeModule_copyToArray(s, arr, i) {
    let j = i | 0;
    SetTreeModule_iter((x) => {
        arr[j] = x;
        j = (j + 1);
    }, s);
}

function SetTreeModule_toArray(s) {
    const n = SetTreeModule_count(s) | 0;
    const res = new Array(n);
    SetTreeModule_copyToArray(s, res, 0);
    return res;
}

function SetTreeModule_mkFromEnumerator(comparer_mut, acc_mut, e_mut) {
    SetTreeModule_mkFromEnumerator:
    while (true) {
        const comparer = comparer_mut, acc = acc_mut, e = e_mut;
        if (e["System.Collections.IEnumerator.MoveNext"]()) {
            comparer_mut = comparer;
            acc_mut = SetTreeModule_add(comparer, e["System.Collections.Generic.IEnumerator`1.get_Current"](), acc);
            e_mut = e;
            continue SetTreeModule_mkFromEnumerator;
        }
        else {
            return acc;
        }
        break;
    }
}

function SetTreeModule_ofSeq(comparer, c) {
    const ie = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.getEnumerator)(c);
    try {
        return SetTreeModule_mkFromEnumerator(comparer, SetTreeModule_empty(), ie);
    }
    finally {
        ie.Dispose();
    }
}

function SetTreeModule_ofArray(comparer, l) {
    return (0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.fold)((acc, k) => SetTreeModule_add(comparer, k, acc), SetTreeModule_empty(), l);
}

class FSharpSet {
    constructor(comparer, tree) {
        this.comparer = comparer;
        this.tree = tree;
    }
    GetHashCode() {
        const this$ = this;
        return FSharpSet__ComputeHashCode(this$) | 0;
    }
    Equals(that) {
        const this$ = this;
        return (that instanceof FSharpSet) ? (SetTreeModule_compare(FSharpSet__get_Comparer(this$), FSharpSet__get_Tree(this$), FSharpSet__get_Tree(that)) === 0) : false;
    }
    toString() {
        const this$ = this;
        return ("set [" + (0,_String_js__WEBPACK_IMPORTED_MODULE_5__.join)("; ", (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.map)((x) => {
            let copyOfStruct = x;
            return (0,_Types_js__WEBPACK_IMPORTED_MODULE_2__.toString)(copyOfStruct);
        }, this$))) + "]";
    }
    get [Symbol.toStringTag]() {
        return "FSharpSet";
    }
    CompareTo(that) {
        const s = this;
        return SetTreeModule_compare(FSharpSet__get_Comparer(s), FSharpSet__get_Tree(s), FSharpSet__get_Tree(that)) | 0;
    }
    ["System.Collections.Generic.ICollection`1.Add2B595"](x) {
        throw (new Error("ReadOnlyCollection"));
    }
    ["System.Collections.Generic.ICollection`1.Clear"]() {
        throw (new Error("ReadOnlyCollection"));
    }
    ["System.Collections.Generic.ICollection`1.Remove2B595"](x) {
        throw (new Error("ReadOnlyCollection"));
    }
    ["System.Collections.Generic.ICollection`1.Contains2B595"](x) {
        const s = this;
        return SetTreeModule_mem(FSharpSet__get_Comparer(s), x, FSharpSet__get_Tree(s));
    }
    ["System.Collections.Generic.ICollection`1.CopyToZ2E171D71"](arr, i) {
        const s = this;
        SetTreeModule_copyToArray(FSharpSet__get_Tree(s), arr, i);
    }
    ["System.Collections.Generic.ICollection`1.get_IsReadOnly"]() {
        return true;
    }
    ["System.Collections.Generic.ICollection`1.get_Count"]() {
        const s = this;
        return FSharpSet__get_Count(s) | 0;
    }
    ["System.Collections.Generic.IReadOnlyCollection`1.get_Count"]() {
        const s = this;
        return FSharpSet__get_Count(s) | 0;
    }
    GetEnumerator() {
        const s = this;
        return SetTreeModule_mkIEnumerator(FSharpSet__get_Tree(s));
    }
    [Symbol.iterator]() {
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.toIterator)(this.GetEnumerator());
    }
    ["System.Collections.IEnumerable.GetEnumerator"]() {
        const s = this;
        return SetTreeModule_mkIEnumerator(FSharpSet__get_Tree(s));
    }
    get size() {
        const s = this;
        return FSharpSet__get_Count(s) | 0;
    }
    add(k) {
        const s = this;
        throw (new Error("Set cannot be mutated"));
        return s;
    }
    clear() {
        throw (new Error("Set cannot be mutated"));
    }
    delete(k) {
        throw (new Error("Set cannot be mutated"));
        return false;
    }
    has(k) {
        const s = this;
        return FSharpSet__Contains(s, k);
    }
    keys() {
        const s = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.map)((x) => x, s);
    }
    values() {
        const s = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.map)((x) => x, s);
    }
    entries() {
        const s = this;
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.map)((v) => [v, v], s);
    }
    forEach(f, thisArg) {
        const s = this;
        (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.iterate)((x) => {
            f(x, x, s);
        }, s);
    }
}

function FSharpSet$reflection(gen0) {
    return (0,_Reflection_js__WEBPACK_IMPORTED_MODULE_0__.class_type)("Set.FSharpSet", [gen0], FSharpSet);
}

function FSharpSet_$ctor(comparer, tree) {
    return new FSharpSet(comparer, tree);
}

function FSharpSet__get_Comparer(set$) {
    return set$.comparer;
}

function FSharpSet__get_Tree(set$) {
    return set$.tree;
}

function FSharpSet_Empty(comparer) {
    return FSharpSet_$ctor(comparer, SetTreeModule_empty());
}

function FSharpSet__Add(s, value) {
    return FSharpSet_$ctor(FSharpSet__get_Comparer(s), SetTreeModule_add(FSharpSet__get_Comparer(s), value, FSharpSet__get_Tree(s)));
}

function FSharpSet__Remove(s, value) {
    return FSharpSet_$ctor(FSharpSet__get_Comparer(s), SetTreeModule_remove(FSharpSet__get_Comparer(s), value, FSharpSet__get_Tree(s)));
}

function FSharpSet__get_Count(s) {
    return SetTreeModule_count(FSharpSet__get_Tree(s));
}

function FSharpSet__Contains(s, value) {
    return SetTreeModule_mem(FSharpSet__get_Comparer(s), value, FSharpSet__get_Tree(s));
}

function FSharpSet__Iterate(s, x) {
    SetTreeModule_iter(x, FSharpSet__get_Tree(s));
}

function FSharpSet__Fold(s, f, z) {
    const f_1 = f;
    return SetTreeModule_fold((x, z_1) => f_1(z_1, x), z, FSharpSet__get_Tree(s));
}

function FSharpSet__get_IsEmpty(s) {
    return FSharpSet__get_Tree(s) == null;
}

function FSharpSet__Partition(s, f) {
    if (FSharpSet__get_Tree(s) == null) {
        return [s, s];
    }
    else {
        const patternInput = SetTreeModule_partition(FSharpSet__get_Comparer(s), f, FSharpSet__get_Tree(s));
        return [FSharpSet_$ctor(FSharpSet__get_Comparer(s), patternInput[0]), FSharpSet_$ctor(FSharpSet__get_Comparer(s), patternInput[1])];
    }
}

function FSharpSet__Filter(s, f) {
    if (FSharpSet__get_Tree(s) == null) {
        return s;
    }
    else {
        return FSharpSet_$ctor(FSharpSet__get_Comparer(s), SetTreeModule_filter(FSharpSet__get_Comparer(s), f, FSharpSet__get_Tree(s)));
    }
}

function FSharpSet__Map(s, f, comparer) {
    return FSharpSet_$ctor(comparer, SetTreeModule_fold((acc, k) => SetTreeModule_add(comparer, f(k), acc), SetTreeModule_empty(), FSharpSet__get_Tree(s)));
}

function FSharpSet__Exists(s, f) {
    return SetTreeModule_exists(f, FSharpSet__get_Tree(s));
}

function FSharpSet__ForAll(s, f) {
    return SetTreeModule_forall(f, FSharpSet__get_Tree(s));
}

function FSharpSet_op_Subtraction(set1, set2) {
    if (FSharpSet__get_Tree(set1) == null) {
        return set1;
    }
    else if (FSharpSet__get_Tree(set2) == null) {
        return set1;
    }
    else {
        return FSharpSet_$ctor(FSharpSet__get_Comparer(set1), SetTreeModule_diff(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set1), FSharpSet__get_Tree(set2)));
    }
}

function FSharpSet_op_Addition(set1, set2) {
    if (FSharpSet__get_Tree(set2) == null) {
        return set1;
    }
    else if (FSharpSet__get_Tree(set1) == null) {
        return set2;
    }
    else {
        return FSharpSet_$ctor(FSharpSet__get_Comparer(set1), SetTreeModule_union(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set1), FSharpSet__get_Tree(set2)));
    }
}

function FSharpSet_Intersection(a, b) {
    if (FSharpSet__get_Tree(b) == null) {
        return b;
    }
    else if (FSharpSet__get_Tree(a) == null) {
        return a;
    }
    else {
        return FSharpSet_$ctor(FSharpSet__get_Comparer(a), SetTreeModule_intersection(FSharpSet__get_Comparer(a), FSharpSet__get_Tree(a), FSharpSet__get_Tree(b)));
    }
}

function FSharpSet_IntersectionMany(sets) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.reduce)((s1, s2) => FSharpSet_Intersection(s1, s2), sets);
}

function FSharpSet_Equality(a, b) {
    return SetTreeModule_compare(FSharpSet__get_Comparer(a), FSharpSet__get_Tree(a), FSharpSet__get_Tree(b)) === 0;
}

function FSharpSet_Compare(a, b) {
    return SetTreeModule_compare(FSharpSet__get_Comparer(a), FSharpSet__get_Tree(a), FSharpSet__get_Tree(b));
}

function FSharpSet__get_Choose(x) {
    return SetTreeModule_choose(FSharpSet__get_Tree(x));
}

function FSharpSet__get_MinimumElement(x) {
    return SetTreeModule_minimumElement(FSharpSet__get_Tree(x));
}

function FSharpSet__get_MaximumElement(x) {
    return SetTreeModule_maximumElement(FSharpSet__get_Tree(x));
}

function FSharpSet__IsSubsetOf(x, otherSet) {
    return SetTreeModule_subset(FSharpSet__get_Comparer(x), FSharpSet__get_Tree(x), FSharpSet__get_Tree(otherSet));
}

function FSharpSet__IsSupersetOf(x, otherSet) {
    return SetTreeModule_subset(FSharpSet__get_Comparer(x), FSharpSet__get_Tree(otherSet), FSharpSet__get_Tree(x));
}

function FSharpSet__IsProperSubsetOf(x, otherSet) {
    return SetTreeModule_properSubset(FSharpSet__get_Comparer(x), FSharpSet__get_Tree(x), FSharpSet__get_Tree(otherSet));
}

function FSharpSet__IsProperSupersetOf(x, otherSet) {
    return SetTreeModule_properSubset(FSharpSet__get_Comparer(x), FSharpSet__get_Tree(otherSet), FSharpSet__get_Tree(x));
}

function FSharpSet__ToList(x) {
    return SetTreeModule_toList(FSharpSet__get_Tree(x));
}

function FSharpSet__ToArray(x) {
    return SetTreeModule_toArray(FSharpSet__get_Tree(x));
}

function FSharpSet__ComputeHashCode(this$) {
    let res = 0;
    const enumerator = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.getEnumerator)(this$);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const x_1 = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            res = (((res << 1) + (0,_Util_js__WEBPACK_IMPORTED_MODULE_6__.structuralHash)(x_1)) + 631);
        }
    }
    finally {
        enumerator.Dispose();
    }
    return Math.abs(res) | 0;
}

function isEmpty(set$) {
    return FSharpSet__get_IsEmpty(set$);
}

function contains(element, set$) {
    return FSharpSet__Contains(set$, element);
}

function add(value, set$) {
    return FSharpSet__Add(set$, value);
}

function singleton(value, comparer) {
    return FSharpSet__Add(FSharpSet_Empty(comparer), value);
}

function remove(value, set$) {
    return FSharpSet__Remove(set$, value);
}

function union(set1, set2) {
    return FSharpSet_op_Addition(set1, set2);
}

function unionMany(sets, comparer) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.fold)((s1, s2) => FSharpSet_op_Addition(s1, s2), FSharpSet_Empty(comparer), sets);
}

function intersect(set1, set2) {
    return FSharpSet_Intersection(set1, set2);
}

function intersectMany(sets) {
    return FSharpSet_IntersectionMany(sets);
}

function iterate(action, set$) {
    FSharpSet__Iterate(set$, action);
}

function empty(comparer) {
    return FSharpSet_Empty(comparer);
}

function forAll(predicate, set$) {
    return FSharpSet__ForAll(set$, predicate);
}

function exists(predicate, set$) {
    return FSharpSet__Exists(set$, predicate);
}

function filter(predicate, set$) {
    return FSharpSet__Filter(set$, predicate);
}

function partition(predicate, set$) {
    return FSharpSet__Partition(set$, predicate);
}

function fold(folder, state, set$) {
    return SetTreeModule_fold(folder, state, FSharpSet__get_Tree(set$));
}

function foldBack(folder, set$, state) {
    return SetTreeModule_foldBack(folder, FSharpSet__get_Tree(set$), state);
}

function map(mapping, set$, comparer) {
    return FSharpSet__Map(set$, mapping, comparer);
}

function count(set$) {
    return FSharpSet__get_Count(set$);
}

function ofList(elements, comparer) {
    return FSharpSet_$ctor(comparer, SetTreeModule_ofSeq(comparer, elements));
}

function ofArray(array, comparer) {
    return FSharpSet_$ctor(comparer, SetTreeModule_ofArray(comparer, array));
}

function toList(set$) {
    return FSharpSet__ToList(set$);
}

function toArray(set$) {
    return FSharpSet__ToArray(set$);
}

function toSeq(set$) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.map)((x) => x, set$);
}

function ofSeq(elements, comparer) {
    return FSharpSet_$ctor(comparer, SetTreeModule_ofSeq(comparer, elements));
}

function difference(set1, set2) {
    return FSharpSet_op_Subtraction(set1, set2);
}

function isSubset(set1, set2) {
    return SetTreeModule_subset(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set1), FSharpSet__get_Tree(set2));
}

function isSuperset(set1, set2) {
    return SetTreeModule_subset(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set2), FSharpSet__get_Tree(set1));
}

function isProperSubset(set1, set2) {
    return SetTreeModule_properSubset(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set1), FSharpSet__get_Tree(set2));
}

function isProperSuperset(set1, set2) {
    return SetTreeModule_properSubset(FSharpSet__get_Comparer(set1), FSharpSet__get_Tree(set2), FSharpSet__get_Tree(set1));
}

function minElement(set$) {
    return FSharpSet__get_MinimumElement(set$);
}

function maxElement(set$) {
    return FSharpSet__get_MaximumElement(set$);
}

function createMutable(source, comparer) {
    return (0,_MutableSet_js__WEBPACK_IMPORTED_MODULE_7__.HashSet_$ctor_Z6150332D)(source, comparer);
}

function distinct(xs, comparer) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.delay)(() => {
        const set$ = (0,_MutableSet_js__WEBPACK_IMPORTED_MODULE_7__.HashSet_$ctor_Z6150332D)((0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.empty)(), comparer);
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.collect)((x) => ((0,_MutableSet_js__WEBPACK_IMPORTED_MODULE_7__.HashSet__Add_2B595)(set$, x) ? (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.singleton)(x) : (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.empty)()), xs);
    });
}

function distinctBy(projection, xs, comparer) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.delay)(() => {
        const set$ = (0,_MutableSet_js__WEBPACK_IMPORTED_MODULE_7__.HashSet_$ctor_Z6150332D)((0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.empty)(), comparer);
        return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.collect)((x) => ((0,_MutableSet_js__WEBPACK_IMPORTED_MODULE_7__.HashSet__Add_2B595)(set$, projection(x)) ? (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.singleton)(x) : (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.empty)()), xs);
    });
}

function unionWith(s1, s2) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.fold)((acc, x) => acc.add(x), s1, s2);
}

function intersectWith(s1, s2, comparer) {
    const s2_1 = ofSeq(s2, comparer);
    const enumerator = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.getEnumerator)(s1.keys());
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const x = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            if (!FSharpSet__Contains(s2_1, x)) {
                void s1.delete(x);
            }
        }
    }
    finally {
        enumerator.Dispose();
    }
}

function exceptWith(s1, s2) {
    const enumerator = (0,_Seq_js__WEBPACK_IMPORTED_MODULE_3__.getEnumerator)(s2);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            void s1.delete(enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]());
        }
    }
    finally {
        enumerator.Dispose();
    }
}

function isSubsetOf(s1, s2, comparer) {
    return isSubset(ofSeq(s1.values(), comparer), ofSeq(s2, comparer));
}

function isSupersetOf(s1, s2, comparer) {
    return isSuperset(ofSeq(s1.values(), comparer), ofSeq(s2, comparer));
}

function isProperSubsetOf(s1, s2, comparer) {
    return isProperSubset(ofSeq(s1.values(), comparer), ofSeq(s2, comparer));
}

function isProperSupersetOf(s1, s2, comparer) {
    return isProperSuperset(ofSeq(s1.values(), comparer), ofSeq(s2, comparer));
}



/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "singleton": () => (/* binding */ singleton),
/* harmony export */   "cons": () => (/* binding */ cons),
/* harmony export */   "head": () => (/* binding */ head),
/* harmony export */   "tryHead": () => (/* binding */ tryHead),
/* harmony export */   "tail": () => (/* binding */ tail),
/* harmony export */   "last": () => (/* binding */ last),
/* harmony export */   "tryLast": () => (/* binding */ tryLast),
/* harmony export */   "compareWith": () => (/* binding */ compareWith),
/* harmony export */   "foldIndexedAux": () => (/* binding */ foldIndexedAux),
/* harmony export */   "foldIndexed": () => (/* binding */ foldIndexed),
/* harmony export */   "fold": () => (/* binding */ fold),
/* harmony export */   "reverse": () => (/* binding */ reverse),
/* harmony export */   "foldBack": () => (/* binding */ foldBack),
/* harmony export */   "toSeq": () => (/* binding */ toSeq),
/* harmony export */   "ofSeq": () => (/* binding */ ofSeq),
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "foldIndexed2Aux": () => (/* binding */ foldIndexed2Aux),
/* harmony export */   "foldIndexed2": () => (/* binding */ foldIndexed2),
/* harmony export */   "fold2": () => (/* binding */ fold2),
/* harmony export */   "foldBack2": () => (/* binding */ foldBack2),
/* harmony export */   "unfold": () => (/* binding */ unfold),
/* harmony export */   "foldIndexed3Aux": () => (/* binding */ foldIndexed3Aux),
/* harmony export */   "foldIndexed3": () => (/* binding */ foldIndexed3),
/* harmony export */   "fold3": () => (/* binding */ fold3),
/* harmony export */   "scan": () => (/* binding */ scan),
/* harmony export */   "scanBack": () => (/* binding */ scanBack),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "collect": () => (/* binding */ collect),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mapIndexed": () => (/* binding */ mapIndexed),
/* harmony export */   "indexed": () => (/* binding */ indexed),
/* harmony export */   "map2": () => (/* binding */ map2),
/* harmony export */   "mapIndexed2": () => (/* binding */ mapIndexed2),
/* harmony export */   "map3": () => (/* binding */ map3),
/* harmony export */   "mapIndexed3": () => (/* binding */ mapIndexed3),
/* harmony export */   "mapFold": () => (/* binding */ mapFold),
/* harmony export */   "mapFoldBack": () => (/* binding */ mapFoldBack),
/* harmony export */   "iterate": () => (/* binding */ iterate),
/* harmony export */   "iterate2": () => (/* binding */ iterate2),
/* harmony export */   "iterateIndexed": () => (/* binding */ iterateIndexed),
/* harmony export */   "iterateIndexed2": () => (/* binding */ iterateIndexed2),
/* harmony export */   "ofArrayWithTail": () => (/* binding */ ofArrayWithTail),
/* harmony export */   "ofArray": () => (/* binding */ ofArray),
/* harmony export */   "isEmpty": () => (/* binding */ isEmpty),
/* harmony export */   "tryPickIndexedAux": () => (/* binding */ tryPickIndexedAux),
/* harmony export */   "tryPickIndexed": () => (/* binding */ tryPickIndexed),
/* harmony export */   "tryPick": () => (/* binding */ tryPick),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "tryFindIndexed": () => (/* binding */ tryFindIndexed),
/* harmony export */   "tryFind": () => (/* binding */ tryFind),
/* harmony export */   "findIndexed": () => (/* binding */ findIndexed),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "findBack": () => (/* binding */ findBack),
/* harmony export */   "tryFindBack": () => (/* binding */ tryFindBack),
/* harmony export */   "tryFindIndex": () => (/* binding */ tryFindIndex),
/* harmony export */   "tryFindIndexBack": () => (/* binding */ tryFindIndexBack),
/* harmony export */   "findIndex": () => (/* binding */ findIndex),
/* harmony export */   "findIndexBack": () => (/* binding */ findIndexBack),
/* harmony export */   "item": () => (/* binding */ item),
/* harmony export */   "tryItem": () => (/* binding */ tryItem),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "partition": () => (/* binding */ partition),
/* harmony export */   "choose": () => (/* binding */ choose),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "except": () => (/* binding */ except),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "replicate": () => (/* binding */ replicate),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "reduceBack": () => (/* binding */ reduceBack),
/* harmony export */   "forAll": () => (/* binding */ forAll),
/* harmony export */   "forAll2": () => (/* binding */ forAll2),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "exists2": () => (/* binding */ exists2),
/* harmony export */   "unzip": () => (/* binding */ unzip),
/* harmony export */   "unzip3": () => (/* binding */ unzip3),
/* harmony export */   "zip": () => (/* binding */ zip),
/* harmony export */   "zip3": () => (/* binding */ zip3),
/* harmony export */   "sort": () => (/* binding */ sort),
/* harmony export */   "sortBy": () => (/* binding */ sortBy),
/* harmony export */   "sortDescending": () => (/* binding */ sortDescending),
/* harmony export */   "sortByDescending": () => (/* binding */ sortByDescending),
/* harmony export */   "sortWith": () => (/* binding */ sortWith),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "sumBy": () => (/* binding */ sumBy),
/* harmony export */   "maxBy": () => (/* binding */ maxBy),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "minBy": () => (/* binding */ minBy),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "average": () => (/* binding */ average),
/* harmony export */   "averageBy": () => (/* binding */ averageBy),
/* harmony export */   "permute": () => (/* binding */ permute),
/* harmony export */   "chunkBySize": () => (/* binding */ chunkBySize),
/* harmony export */   "skip": () => (/* binding */ skip),
/* harmony export */   "skipWhile": () => (/* binding */ skipWhile),
/* harmony export */   "takeSplitAux": () => (/* binding */ takeSplitAux),
/* harmony export */   "take": () => (/* binding */ take),
/* harmony export */   "takeWhile": () => (/* binding */ takeWhile),
/* harmony export */   "truncate": () => (/* binding */ truncate),
/* harmony export */   "splitAt": () => (/* binding */ splitAt),
/* harmony export */   "outOfRange": () => (/* binding */ outOfRange),
/* harmony export */   "getSlice": () => (/* binding */ getSlice),
/* harmony export */   "distinctBy": () => (/* binding */ distinctBy),
/* harmony export */   "distinct": () => (/* binding */ distinct),
/* harmony export */   "exactlyOne": () => (/* binding */ exactlyOne),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "countBy": () => (/* binding */ countBy),
/* harmony export */   "where": () => (/* binding */ where),
/* harmony export */   "pairwise": () => (/* binding */ pairwise),
/* harmony export */   "windowed": () => (/* binding */ windowed),
/* harmony export */   "splitInto": () => (/* binding */ splitInto),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _Option_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _Seq_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _Array_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/* harmony import */ var _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(27);
/* harmony import */ var _MapUtil_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _MutableMap_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(25);










function empty() {
    return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
}

function singleton(x) {
    return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, empty());
}

function cons(x, xs) {
    return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, xs);
}

function head(_arg1) {
    if (_arg1.tail != null) {
        return _arg1.head;
    }
    else {
        throw (new Error("List was empty"));
    }
}

function tryHead(_arg1) {
    if (_arg1.tail != null) {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(_arg1.head);
    }
    else {
        return void 0;
    }
}

function tail(_arg1) {
    if (_arg1.tail != null) {
        return _arg1.tail;
    }
    else {
        throw (new Error("List was empty"));
    }
}

function last(_arg1_mut) {
    last:
    while (true) {
        const _arg1 = _arg1_mut;
        if (_arg1.tail != null) {
            if (_arg1.tail.tail == null) {
                return _arg1.head;
            }
            else {
                _arg1_mut = _arg1.tail;
                continue last;
            }
        }
        else {
            throw (new Error("List was empty"));
        }
        break;
    }
}

function tryLast(_arg1_mut) {
    tryLast:
    while (true) {
        const _arg1 = _arg1_mut;
        if (_arg1.tail != null) {
            if (_arg1.tail.tail == null) {
                return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(_arg1.head);
            }
            else {
                _arg1_mut = _arg1.tail;
                continue tryLast;
            }
        }
        else {
            return void 0;
        }
        break;
    }
}

function compareWith(comparer, xs, ys) {
    if (xs === ys) {
        return 0;
    }
    else {
        const loop = (xs_1_mut, ys_1_mut) => {
            loop:
            while (true) {
                const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
                const matchValue = [xs_1, ys_1];
                if (matchValue[0].tail != null) {
                    if (matchValue[1].tail != null) {
                        const matchValue_1 = comparer(matchValue[0].head, matchValue[1].head) | 0;
                        if (matchValue_1 === 0) {
                            xs_1_mut = matchValue[0].tail;
                            ys_1_mut = matchValue[1].tail;
                            continue loop;
                        }
                        else {
                            return matchValue_1 | 0;
                        }
                    }
                    else {
                        return 1;
                    }
                }
                else if (matchValue[1].tail == null) {
                    return 0;
                }
                else {
                    return -1;
                }
                break;
            }
        };
        return loop(xs, ys) | 0;
    }
}

function foldIndexedAux(f_mut, i_mut, acc_mut, _arg1_mut) {
    foldIndexedAux:
    while (true) {
        const f = f_mut, i = i_mut, acc = acc_mut, _arg1 = _arg1_mut;
        if (_arg1.tail != null) {
            f_mut = f;
            i_mut = (i + 1);
            acc_mut = f(i, acc, _arg1.head);
            _arg1_mut = _arg1.tail;
            continue foldIndexedAux;
        }
        else {
            return acc;
        }
        break;
    }
}

function foldIndexed(f, state, xs) {
    return foldIndexedAux(f, 0, state, xs);
}

function fold(f_mut, state_mut, xs_mut) {
    fold:
    while (true) {
        const f = f_mut, state = state_mut, xs = xs_mut;
        if (xs.tail != null) {
            f_mut = f;
            state_mut = f(state, xs.head);
            xs_mut = xs.tail;
            continue fold;
        }
        else {
            return state;
        }
        break;
    }
}

function reverse(xs) {
    return fold((acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs);
}

function foldBack(f, xs, state) {
    return fold((acc, x) => f(x, acc), state, reverse(xs));
}

function toSeq(xs) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.map)((x) => x, xs);
}

function ofSeq(xs) {
    return reverse((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.fold)((acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs));
}

function concat(lists) {
    return reverse((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.fold)((state, xs) => fold((acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc)), state, xs), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), lists));
}

function foldIndexed2Aux(f_mut, i_mut, acc_mut, bs_mut, cs_mut) {
    foldIndexed2Aux:
    while (true) {
        const f = f_mut, i = i_mut, acc = acc_mut, bs = bs_mut, cs = cs_mut;
        const matchValue = [bs, cs];
        let pattern_matching_result, x, xs, y, ys;
        if (matchValue[0].tail != null) {
            if (matchValue[1].tail != null) {
                pattern_matching_result = 1;
                x = matchValue[0].head;
                xs = matchValue[0].tail;
                y = matchValue[1].head;
                ys = matchValue[1].tail;
            }
            else {
                pattern_matching_result = 2;
            }
        }
        else if (matchValue[1].tail == null) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 2;
        }
        switch (pattern_matching_result) {
            case 0: {
                return acc;
            }
            case 1: {
                f_mut = f;
                i_mut = (i + 1);
                acc_mut = f(i, acc, x, y);
                bs_mut = xs;
                cs_mut = ys;
                continue foldIndexed2Aux;
            }
            case 2: {
                throw (new Error("Lists had different lengths"));
            }
        }
        break;
    }
}

function foldIndexed2(f, state, xs, ys) {
    return foldIndexed2Aux(f, 0, state, xs, ys);
}

function fold2(f, state, xs, ys) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.fold2)(f, state, xs, ys);
}

function foldBack2(f, xs, ys, state) {
    return (0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.foldBack2)(f, xs, ys, state);
}

function unfold(f, state) {
    const unfoldInner = (acc_mut, state_1_mut) => {
        unfoldInner:
        while (true) {
            const acc = acc_mut, state_1 = state_1_mut;
            const matchValue = f(state_1);
            if (matchValue != null) {
                acc_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(matchValue[0], acc));
                state_1_mut = matchValue[1];
                continue unfoldInner;
            }
            else {
                return reverse(acc);
            }
            break;
        }
    };
    return unfoldInner(new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), state);
}

function foldIndexed3Aux(f_mut, i_mut, acc_mut, bs_mut, cs_mut, ds_mut) {
    foldIndexed3Aux:
    while (true) {
        const f = f_mut, i = i_mut, acc = acc_mut, bs = bs_mut, cs = cs_mut, ds = ds_mut;
        const matchValue = [bs, cs, ds];
        let pattern_matching_result, x, xs, y, ys, z, zs;
        if (matchValue[0].tail != null) {
            if (matchValue[1].tail != null) {
                if (matchValue[2].tail != null) {
                    pattern_matching_result = 1;
                    x = matchValue[0].head;
                    xs = matchValue[0].tail;
                    y = matchValue[1].head;
                    ys = matchValue[1].tail;
                    z = matchValue[2].head;
                    zs = matchValue[2].tail;
                }
                else {
                    pattern_matching_result = 2;
                }
            }
            else {
                pattern_matching_result = 2;
            }
        }
        else if (matchValue[1].tail == null) {
            if (matchValue[2].tail == null) {
                pattern_matching_result = 0;
            }
            else {
                pattern_matching_result = 2;
            }
        }
        else {
            pattern_matching_result = 2;
        }
        switch (pattern_matching_result) {
            case 0: {
                return acc;
            }
            case 1: {
                f_mut = f;
                i_mut = (i + 1);
                acc_mut = f(i, acc, x, y, z);
                bs_mut = xs;
                cs_mut = ys;
                ds_mut = zs;
                continue foldIndexed3Aux;
            }
            case 2: {
                throw (new Error("Lists had different lengths"));
            }
        }
        break;
    }
}

function foldIndexed3(f, seed, xs, ys, zs) {
    return foldIndexed3Aux(f, 0, seed, xs, ys, zs);
}

function fold3(f, state, xs, ys, zs) {
    return foldIndexed3((_arg1, acc, x, y, z) => f(acc, x, y, z), state, xs, ys, zs);
}

function scan(f, state, xs) {
    return ofSeq((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.scan)(f, state, xs));
}

function scanBack(f, xs, state) {
    return ofSeq((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.scanBack)(f, xs, state));
}

function length(xs) {
    return fold((acc, _arg1) => (acc + 1), 0, xs);
}

function append(xs, ys) {
    return fold((acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc)), ys, reverse(xs));
}

function collect(f, xs) {
    return ofSeq((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.collect)(f, xs));
}

function map(f, xs) {
    return reverse(fold((acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(x), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs));
}

function mapIndexed(f, xs) {
    return reverse(foldIndexed((i, acc, x) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(i, x), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs));
}

function indexed(xs) {
    return mapIndexed((i, x) => [i, x], xs);
}

function map2(f, xs, ys) {
    return reverse(fold2((acc, x, y) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(x, y), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs, ys));
}

function mapIndexed2(f, xs, ys) {
    return reverse(foldIndexed2((i, acc, x, y) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(i, x, y), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs, ys));
}

function map3(f, xs, ys, zs) {
    return reverse(fold3((acc, x, y, z) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(x, y, z), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs, ys, zs));
}

function mapIndexed3(f, xs, ys, zs) {
    return reverse(foldIndexed3((i, acc, x, y, z) => (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(i, x, y, z), acc)), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs, ys, zs));
}

function mapFold(f, s, xs) {
    const patternInput_1 = fold((tupledArg, x) => {
        const patternInput = f(tupledArg[1], x);
        return [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(patternInput[0], tupledArg[0]), patternInput[1]];
    }, [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), s], xs);
    return [reverse(patternInput_1[0]), patternInput_1[1]];
}

function mapFoldBack(f, xs, s) {
    return mapFold((s_1, v) => f(v, s_1), s, reverse(xs));
}

function iterate(f, xs) {
    return fold((unitVar0, x) => {
        f(x);
    }, void 0, xs);
}

function iterate2(f, xs, ys) {
    return fold2((unitVar0, x, y) => {
        f(x, y);
    }, void 0, xs, ys);
}

function iterateIndexed(f, xs) {
    return foldIndexed((i, unitVar1, x) => {
        f(i, x);
    }, void 0, xs);
}

function iterateIndexed2(f, xs, ys) {
    return foldIndexed2((i, unitVar1, x, y) => {
        f(i, x, y);
    }, void 0, xs, ys);
}

function ofArrayWithTail(xs, tail_1) {
    let res = tail_1;
    for (let i = (0,_Util_js__WEBPACK_IMPORTED_MODULE_3__.count)(xs) - 1; i >= 0; i--) {
        res = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(xs[i], res));
    }
    return res;
}

function ofArray(xs) {
    return ofArrayWithTail(xs, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List());
}

function isEmpty(_arg1) {
    if (_arg1.tail == null) {
        return true;
    }
    else {
        return false;
    }
}

function tryPickIndexedAux(f_mut, i_mut, _arg1_mut) {
    tryPickIndexedAux:
    while (true) {
        const f = f_mut, i = i_mut, _arg1 = _arg1_mut;
        if (_arg1.tail != null) {
            const result = f(i, _arg1.head);
            if (result == null) {
                f_mut = f;
                i_mut = (i + 1);
                _arg1_mut = _arg1.tail;
                continue tryPickIndexedAux;
            }
            else {
                return result;
            }
        }
        else {
            return void 0;
        }
        break;
    }
}

function tryPickIndexed(f, xs) {
    return tryPickIndexedAux(f, 0, xs);
}

function tryPick(f, xs) {
    return tryPickIndexed((_arg1, x) => f(x), xs);
}

function pick(f, xs) {
    const matchValue = tryPick(f, xs);
    if (matchValue != null) {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(matchValue);
    }
    else {
        throw (new Error("List did not contain any matching elements"));
    }
}

function tryFindIndexed(f, xs) {
    return tryPickIndexed((i, x) => (f(i, x) ? (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(x) : (void 0)), xs);
}

function tryFind(f, xs) {
    return tryPickIndexed((_arg1, x) => (f(x) ? (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.some)(x) : (void 0)), xs);
}

function findIndexed(f, xs) {
    const matchValue = tryFindIndexed(f, xs);
    if (matchValue != null) {
        return (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(matchValue);
    }
    else {
        throw (new Error("List did not contain any matching elements"));
    }
}

function find(f, xs) {
    return findIndexed((_arg1, x) => f(x), xs);
}

function findBack(f, xs) {
    return find(f, reverse(xs));
}

function tryFindBack(f, xs) {
    return tryFind(f, reverse(xs));
}

function tryFindIndex(f, xs) {
    return tryPickIndexed((i, x) => (f(x) ? i : (void 0)), xs);
}

function tryFindIndexBack(f, xs) {
    return (0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.tryFindIndexBack)(f, Array.from(xs));
}

function findIndex(f, xs) {
    const matchValue = tryFindIndex(f, xs);
    if (matchValue != null) {
        return matchValue | 0;
    }
    else {
        throw (new Error("List did not contain any matching elements"));
    }
}

function findIndexBack(f, xs) {
    return (0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.findIndexBack)(f, Array.from(xs));
}

function item(n, xs) {
    return findIndexed((i, _arg1) => (n === i), xs);
}

function tryItem(n, xs) {
    return tryFindIndexed((i, _arg1) => (n === i), xs);
}

function filter(f, xs) {
    return reverse(fold((acc, x) => (f(x) ? (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc)) : acc), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs));
}

function partition(f, xs) {
    return fold((0,_Util_js__WEBPACK_IMPORTED_MODULE_3__.uncurry)(2, (tupledArg) => {
        const lacc = tupledArg[0];
        const racc = tupledArg[1];
        return (x) => (f(x) ? [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, lacc), racc] : [lacc, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, racc)]);
    }), [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List()], reverse(xs));
}

function choose(f, xs) {
    return reverse(fold((acc, x) => {
        const matchValue = f(x);
        return (matchValue == null) ? acc : (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List((0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(matchValue), acc));
    }, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs));
}

function contains(value, list, eq) {
    const loop = (xs_mut) => {
        loop:
        while (true) {
            const xs = xs_mut;
            if (xs.tail != null) {
                if (eq.Equals(value, xs.head)) {
                    return true;
                }
                else {
                    xs_mut = xs.tail;
                    continue loop;
                }
            }
            else {
                return false;
            }
            break;
        }
    };
    return loop(list);
}

function except(itemsToExclude, array, eq) {
    if (isEmpty(array)) {
        return array;
    }
    else {
        const cached = new _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__.HashSet(itemsToExclude, eq);
        return filter((arg00) => (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.addToSet)(arg00, cached), array);
    }
}

function initialize(n, f) {
    let xs = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    for (let i = 0; i <= (n - 1); i++) {
        xs = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(f(i), xs));
    }
    return reverse(xs);
}

function replicate(n, x) {
    return initialize(n, (_arg1) => x);
}

function reduce(f, _arg1) {
    if (_arg1.tail != null) {
        return fold(f, _arg1.head, _arg1.tail);
    }
    else {
        throw (new Error("List was empty"));
    }
}

function reduceBack(f, _arg1) {
    if (_arg1.tail != null) {
        return foldBack(f, _arg1.tail, _arg1.head);
    }
    else {
        throw (new Error("List was empty"));
    }
}

function forAll(f, xs) {
    return fold((acc, x) => (acc ? f(x) : false), true, xs);
}

function forAll2(f, xs, ys) {
    return fold2((acc, x, y) => (acc ? f(x, y) : false), true, xs, ys);
}

function exists(f_mut, _arg1_mut) {
    exists:
    while (true) {
        const f = f_mut, _arg1 = _arg1_mut;
        if (_arg1.tail != null) {
            if (f(_arg1.head)) {
                return true;
            }
            else {
                f_mut = f;
                _arg1_mut = _arg1.tail;
                continue exists;
            }
        }
        else {
            return false;
        }
        break;
    }
}

function exists2(f_mut, bs_mut, cs_mut) {
    exists2:
    while (true) {
        const f = f_mut, bs = bs_mut, cs = cs_mut;
        const matchValue = [bs, cs];
        let pattern_matching_result, x, xs, y, ys;
        if (matchValue[0].tail != null) {
            if (matchValue[1].tail != null) {
                pattern_matching_result = 1;
                x = matchValue[0].head;
                xs = matchValue[0].tail;
                y = matchValue[1].head;
                ys = matchValue[1].tail;
            }
            else {
                pattern_matching_result = 2;
            }
        }
        else if (matchValue[1].tail == null) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 2;
        }
        switch (pattern_matching_result) {
            case 0: {
                return false;
            }
            case 1: {
                if (f(x, y)) {
                    return true;
                }
                else {
                    f_mut = f;
                    bs_mut = xs;
                    cs_mut = ys;
                    continue exists2;
                }
            }
            case 2: {
                throw (new Error("Lists had different lengths"));
            }
        }
        break;
    }
}

function unzip(xs) {
    return foldBack((tupledArg, tupledArg_1) => [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(tupledArg[0], tupledArg_1[0]), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(tupledArg[1], tupledArg_1[1])], xs, [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List()]);
}

function unzip3(xs) {
    return foldBack((tupledArg, tupledArg_1) => [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(tupledArg[0], tupledArg_1[0]), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(tupledArg[1], tupledArg_1[1]), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(tupledArg[2], tupledArg_1[2])], xs, [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List()]);
}

function zip(xs, ys) {
    return map2((x, y) => [x, y], xs, ys);
}

function zip3(xs, ys, zs) {
    return map3((x, y, z) => [x, y, z], xs, ys, zs);
}

function sort(xs, comparer) {
    let xs_1;
    return ofArray((xs_1 = Array.from(xs), (xs_1.sort(((x, y) => comparer.Compare(x, y))), xs_1)));
}

function sortBy(projection, xs, comparer) {
    let xs_1;
    return ofArray((xs_1 = Array.from(xs), (xs_1.sort(((x, y) => comparer.Compare(projection(x), projection(y)))), xs_1)));
}

function sortDescending(xs, comparer) {
    let xs_1;
    return ofArray((xs_1 = Array.from(xs), (xs_1.sort(((x, y) => (comparer.Compare(x, y) * -1))), xs_1)));
}

function sortByDescending(projection, xs, comparer) {
    let xs_1;
    return ofArray((xs_1 = Array.from(xs), (xs_1.sort(((x, y) => (comparer.Compare(projection(x), projection(y)) * -1))), xs_1)));
}

function sortWith(comparer, xs) {
    let comparer_1, xs_1;
    return ofArray((comparer_1 = comparer, (xs_1 = Array.from(xs), (xs_1.sort(comparer_1), xs_1))));
}

function sum(xs, adder) {
    return fold((acc, x) => adder.Add(acc, x), adder.GetZero(), xs);
}

function sumBy(f, xs, adder) {
    return fold((acc, x) => adder.Add(acc, f(x)), adder.GetZero(), xs);
}

function maxBy(projection, xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(projection(y), projection(x)) > 0) ? y : x), xs);
}

function max(li, comparer) {
    return reduce((x, y) => ((comparer.Compare(y, x) > 0) ? y : x), li);
}

function minBy(projection, xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(projection(y), projection(x)) > 0) ? x : y), xs);
}

function min(xs, comparer) {
    return reduce((x, y) => ((comparer.Compare(y, x) > 0) ? x : y), xs);
}

function average(xs, averager) {
    return averager.DivideByInt(fold((acc, x) => averager.Add(acc, x), averager.GetZero(), xs), length(xs));
}

function averageBy(f, xs, averager) {
    return averager.DivideByInt(fold((acc, x) => averager.Add(acc, f(x)), averager.GetZero(), xs), length(xs));
}

function permute(f, xs) {
    return ofArray((0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.permute)(f, Array.from(xs)));
}

function chunkBySize(chunkSize, xs) {
    return map((xs_2) => ofArray(xs_2), ofArray((0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.chunkBySize)(chunkSize, Array.from(xs))));
}

function skip(i, xs) {
    const skipInner = (i_1_mut, xs_1_mut) => {
        skipInner:
        while (true) {
            const i_1 = i_1_mut, xs_1 = xs_1_mut;
            const matchValue = [i_1, xs_1];
            if (matchValue[0] === 0) {
                return xs_1;
            }
            else if (matchValue[1].tail != null) {
                i_1_mut = (i_1 - 1);
                xs_1_mut = matchValue[1].tail;
                continue skipInner;
            }
            else {
                throw (new Error("The input sequence has an insufficient number of elements."));
            }
            break;
        }
    };
    const matchValue_1 = [i, xs];
    if (matchValue_1[0] < 0) {
        throw (new Error("The input must be non-negative."));
    }
    else {
        let pattern_matching_result, i_4, xs_4;
        if (matchValue_1[0] === 0) {
            pattern_matching_result = 0;
        }
        else if (matchValue_1[0] === 1) {
            if (matchValue_1[1].tail != null) {
                pattern_matching_result = 1;
            }
            else {
                pattern_matching_result = 2;
                i_4 = matchValue_1[0];
                xs_4 = matchValue_1[1];
            }
        }
        else {
            pattern_matching_result = 2;
            i_4 = matchValue_1[0];
            xs_4 = matchValue_1[1];
        }
        switch (pattern_matching_result) {
            case 0: {
                return xs;
            }
            case 1: {
                return matchValue_1[1].tail;
            }
            case 2: {
                return skipInner(i_4, xs_4);
            }
        }
    }
}

function skipWhile(predicate_mut, xs_mut) {
    skipWhile:
    while (true) {
        const predicate = predicate_mut, xs = xs_mut;
        let pattern_matching_result, h_1, t_1;
        if (xs.tail != null) {
            if (predicate(xs.head)) {
                pattern_matching_result = 0;
                h_1 = xs.head;
                t_1 = xs.tail;
            }
            else {
                pattern_matching_result = 1;
            }
        }
        else {
            pattern_matching_result = 1;
        }
        switch (pattern_matching_result) {
            case 0: {
                predicate_mut = predicate;
                xs_mut = t_1;
                continue skipWhile;
            }
            case 1: {
                return xs;
            }
        }
        break;
    }
}

function takeSplitAux(error_mut, i_mut, acc_mut, xs_mut) {
    takeSplitAux:
    while (true) {
        const error = error_mut, i = i_mut, acc = acc_mut, xs = xs_mut;
        const matchValue = [i, xs];
        if (matchValue[0] === 0) {
            return [reverse(acc), xs];
        }
        else if (matchValue[1].tail != null) {
            error_mut = error;
            i_mut = (i - 1);
            acc_mut = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(matchValue[1].head, acc));
            xs_mut = matchValue[1].tail;
            continue takeSplitAux;
        }
        else if (error) {
            throw (new Error("The input sequence has an insufficient number of elements."));
        }
        else {
            return [reverse(acc), xs];
        }
        break;
    }
}

function take(i, xs) {
    const matchValue = [i, xs];
    if (matchValue[0] < 0) {
        throw (new Error("The input must be non-negative."));
    }
    else {
        let pattern_matching_result, i_3, xs_1;
        if (matchValue[0] === 0) {
            pattern_matching_result = 0;
        }
        else if (matchValue[0] === 1) {
            if (matchValue[1].tail != null) {
                pattern_matching_result = 1;
            }
            else {
                pattern_matching_result = 2;
                i_3 = matchValue[0];
                xs_1 = matchValue[1];
            }
        }
        else {
            pattern_matching_result = 2;
            i_3 = matchValue[0];
            xs_1 = matchValue[1];
        }
        switch (pattern_matching_result) {
            case 0: {
                return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
            }
            case 1: {
                return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(matchValue[1].head, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List());
            }
            case 2: {
                return takeSplitAux(true, i_3, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs_1)[0];
            }
        }
    }
}

function takeWhile(predicate, xs) {
    if (xs.tail != null) {
        if (xs.tail.tail == null) {
            if (predicate(xs.head)) {
                return xs;
            }
            else {
                return xs.tail;
            }
        }
        else if (!predicate(xs.head)) {
            return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
        }
        else {
            return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(xs.head, takeWhile(predicate, xs.tail));
        }
    }
    else {
        return xs;
    }
}

function truncate(i, xs) {
    const matchValue = [i, xs];
    if (matchValue[0] < 0) {
        throw (new Error("The input must be non-negative."));
    }
    else {
        let pattern_matching_result, i_3, xs_1;
        if (matchValue[0] === 0) {
            pattern_matching_result = 0;
        }
        else if (matchValue[0] === 1) {
            if (matchValue[1].tail != null) {
                pattern_matching_result = 1;
            }
            else {
                pattern_matching_result = 2;
                i_3 = matchValue[0];
                xs_1 = matchValue[1];
            }
        }
        else {
            pattern_matching_result = 2;
            i_3 = matchValue[0];
            xs_1 = matchValue[1];
        }
        switch (pattern_matching_result) {
            case 0: {
                return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
            }
            case 1: {
                return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(matchValue[1].head, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List());
            }
            case 2: {
                return takeSplitAux(false, i_3, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs_1)[0];
            }
        }
    }
}

function splitAt(i, xs) {
    const matchValue = [i, xs];
    if (matchValue[0] < 0) {
        throw (new Error("The input must be non-negative."));
    }
    else {
        let pattern_matching_result, i_3, xs_2;
        if (matchValue[0] === 0) {
            pattern_matching_result = 0;
        }
        else if (matchValue[0] === 1) {
            if (matchValue[1].tail != null) {
                pattern_matching_result = 1;
            }
            else {
                pattern_matching_result = 2;
                i_3 = matchValue[0];
                xs_2 = matchValue[1];
            }
        }
        else {
            pattern_matching_result = 2;
            i_3 = matchValue[0];
            xs_2 = matchValue[1];
        }
        switch (pattern_matching_result) {
            case 0: {
                return [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs];
            }
            case 1: {
                return [new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(matchValue[1].head, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List()), matchValue[1].tail];
            }
            case 2: {
                return takeSplitAux(true, i_3, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs_2);
            }
        }
    }
}

function outOfRange() {
    throw (new Error("Index out of range"));
}

function getSlice(lower, upper, xs) {
    const lower_1 = (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.defaultArg)(lower, 0) | 0;
    const hasUpper = upper != null;
    if (lower_1 < 0) {
        return outOfRange();
    }
    else if (hasUpper ? ((0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(upper) < lower_1) : false) {
        return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    }
    else {
        let lastIndex = -1;
        const res = foldIndexed((i, acc, x) => {
            lastIndex = i;
            if ((lower_1 <= i) ? ((!hasUpper) ? true : (i <= (0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(upper))) : false) {
                return new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(x, acc);
            }
            else {
                return acc;
            }
        }, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(), xs);
        if ((lower_1 > (lastIndex + 1)) ? true : (hasUpper ? ((0,_Option_js__WEBPACK_IMPORTED_MODULE_1__.value)(upper) > lastIndex) : false)) {
            outOfRange();
        }
        return reverse(res);
    }
}

function distinctBy(projection, xs, eq) {
    const hashSet = new _MutableSet_js__WEBPACK_IMPORTED_MODULE_5__.HashSet([], eq);
    return filter((arg) => (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.addToSet)(projection(arg), hashSet), xs);
}

function distinct(xs, eq) {
    return distinctBy((x) => x, xs, eq);
}

function exactlyOne(xs) {
    if (xs.tail != null) {
        if (xs.tail.tail != null) {
            throw (new Error("Input list too long\\nParameter name: list"));
        }
        else {
            return xs.head;
        }
    }
    else {
        throw (new Error("The input sequence was empty\\nParameter name: list"));
    }
}

function groupBy(projection, xs, eq) {
    const dict = new _MutableMap_js__WEBPACK_IMPORTED_MODULE_7__.Dictionary([], eq);
    let keys = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    iterate((v) => {
        const key = projection(v);
        let matchValue;
        let outArg = null;
        matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.tryGetValue)(dict, key, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.FSharpRef(() => outArg, (v_1) => {
            outArg = v_1;
        })), outArg];
        if (matchValue[0]) {
            dict.set(key, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(v, matchValue[1]));
        }
        else {
            (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.addToDict)(dict, key, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(v, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List()));
            keys = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(key, keys));
        }
    }, xs);
    let result = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    iterate((key_1) => {
        result = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List([key_1, reverse((0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.getItemFromDict)(dict, key_1))], result));
    }, keys);
    return result;
}

function countBy(projection, xs, eq) {
    const dict = new _MutableMap_js__WEBPACK_IMPORTED_MODULE_7__.Dictionary([], eq);
    let keys = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    iterate((v) => {
        const key = projection(v);
        let matchValue;
        let outArg = 0;
        matchValue = [(0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.tryGetValue)(dict, key, new _Types_js__WEBPACK_IMPORTED_MODULE_0__.FSharpRef(() => outArg, (v_1) => {
            outArg = v_1;
        })), outArg];
        if (matchValue[0]) {
            dict.set(key, matchValue[1] + 1);
        }
        else {
            dict.set(key, 1);
            keys = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(key, keys));
        }
    }, xs);
    let result = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    iterate((key_1) => {
        result = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List([key_1, (0,_MapUtil_js__WEBPACK_IMPORTED_MODULE_6__.getItemFromDict)(dict, key_1)], result));
    }, keys);
    return result;
}

function where(predicate, source) {
    return filter(predicate, source);
}

function pairwise(source) {
    return ofSeq((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.pairwise)(source));
}

function windowed(windowSize, source) {
    if (windowSize <= 0) {
        throw (new Error("windowSize must be positive"));
    }
    let res = new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List();
    for (let i = length(source); i >= windowSize; i--) {
        res = (new _Types_js__WEBPACK_IMPORTED_MODULE_0__.List(getSlice(i - windowSize, i - 1, source), res));
    }
    return res;
}

function splitInto(chunks, source) {
    return map((xs_1) => ofArray(xs_1), ofArray((0,_Array_js__WEBPACK_IMPORTED_MODULE_4__.splitInto)(chunks, Array.from(source))));
}

function transpose(lists) {
    return ofSeq((0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.map)((xs) => ofSeq(xs), (0,_Seq_js__WEBPACK_IMPORTED_MODULE_2__.transpose)(lists)));
}



/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enumerate": () => (/* binding */ enumerate),
/* harmony export */   "genDesc": () => (/* binding */ genDesc),
/* harmony export */   "genRuleParams": () => (/* binding */ genRuleParams),
/* harmony export */   "genTerm": () => (/* binding */ genTerm),
/* harmony export */   "genBinder": () => (/* binding */ genBinder),
/* harmony export */   "genBody": () => (/* binding */ genBody),
/* harmony export */   "genBodies": () => (/* binding */ genBodies),
/* harmony export */   "generateRule": () => (/* binding */ generateRule),
/* harmony export */   "generateRules": () => (/* binding */ generateRules),
/* harmony export */   "generateGrammar": () => (/* binding */ generateGrammar)
/* harmony export */ });
/* harmony import */ var _fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _fable_fable_library_3_1_5_Option_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);




function enumerate(xs) {
    return (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.zip)((0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.rangeNumber)(1, 1, (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.length)(xs)), xs);
}

function genDesc(desc) {
    if (desc == null) {
        return "";
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("(%P())", [(0,_fable_fable_library_3_1_5_Option_js__WEBPACK_IMPORTED_MODULE_2__.value)(desc)]));
    }
}

function genRuleParams(ps) {
    if (ps.length === 0) {
        return "";
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\u003c%P()\u003e", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", ps)]));
    }
}

function genTerm(t) {
    switch (t.tag) {
        case 1: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(" | ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((t_2) => genTerm(t_2), t.fields[0]));
        }
        case 2: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()*", [genTerm(t.fields[0])]));
        }
        case 3: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()+", [genTerm(t.fields[0])]));
        }
        case 4: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()?", [genTerm(t.fields[0])]));
        }
        case 5: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("~%P()", [genTerm(t.fields[0])]));
        }
        case 6: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\u0026%P()", [genTerm(t.fields[0])]));
        }
        case 7: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("#%P()", [genTerm(t.fields[0])]));
        }
        case 8: {
            const t_9 = t.fields[0];
            const ps = t.fields[1];
            if (ps.length === 0) {
                return t_9;
            }
            else {
                return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()\u003c%P()\u003e", [t_9, (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((t_10) => genTerm(t_10), ps))]));
            }
        }
        case 9: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()..%P()", [JSON.stringify(t.fields[0]), JSON.stringify(t.fields[1])]));
        }
        case 10: {
            return JSON.stringify(t.fields[0]);
        }
        case 11: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("(%P())", [genTerm(t.fields[0])]));
        }
        default: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(" ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((t_1) => genTerm(t_1), t.fields[0]));
        }
    }
}

function genBinder(b) {
    if (b.tag === 1) {
        return genTerm(b.fields[0]);
    }
    else {
        return genTerm(b.fields[1]);
    }
}

function genBody(n, b) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()  -- alt%P()\n", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(" ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((b_1) => genBinder(b_1), b.Terms)), n]));
}

function genBodies(b) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)(" | ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((tupledArg) => genBody(tupledArg[0], tupledArg[1]), enumerate(b)));
}

function generateRule(rule) {
    switch (rule.tag) {
        case 1: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()%P() := %P()", [rule.fields[1], genRuleParams(rule.fields[2]), genBodies(rule.fields[3])]));
        }
        case 2: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()%P() += %P()", [rule.fields[1], genRuleParams(rule.fields[2]), genBodies(rule.fields[3])]));
        }
        default: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("%P()%P() %P() = %P()", [rule.fields[1], genRuleParams(rule.fields[2]), genDesc(rule.fields[3]), genBodies(rule.fields[4])]));
        }
    }
}

function generateRules(rules) {
    return (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_0__.map)((rule) => generateRule(rule), rules);
}

function generateGrammar(g) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.interpolate)("\r\n  %P() {\r\n    %P()\r\n  }\r\n  ", [g.Name, (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_1__.join)("\n\n", generateRules(g.Rules))]));
}

//# sourceMappingURL=OhmCodegen.js.map


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "id": () => (/* binding */ id),
/* harmony export */   "down": () => (/* binding */ down),
/* harmony export */   "up": () => (/* binding */ up),
/* harmony export */   "typeName": () => (/* binding */ typeName),
/* harmony export */   "varName": () => (/* binding */ varName),
/* harmony export */   "genTypeApp": () => (/* binding */ genTypeApp),
/* harmony export */   "genField": () => (/* binding */ genField),
/* harmony export */   "genFields": () => (/* binding */ genFields),
/* harmony export */   "generateType": () => (/* binding */ generateType),
/* harmony export */   "genRecord": () => (/* binding */ genRecord),
/* harmony export */   "genVariant": () => (/* binding */ genVariant),
/* harmony export */   "generateTypes": () => (/* binding */ generateTypes),
/* harmony export */   "isSingletonRule": () => (/* binding */ isSingletonRule),
/* harmony export */   "isImmaterial": () => (/* binding */ isImmaterial),
/* harmony export */   "genVisitorBinder": () => (/* binding */ genVisitorBinder),
/* harmony export */   "genVisitorParams": () => (/* binding */ genVisitorParams),
/* harmony export */   "genTypeName": () => (/* binding */ genTypeName),
/* harmony export */   "genExpr": () => (/* binding */ genExpr),
/* harmony export */   "genVisitorEffect": () => (/* binding */ genVisitorEffect),
/* harmony export */   "genAltVisitor": () => (/* binding */ genAltVisitor),
/* harmony export */   "genRuleVisitor": () => (/* binding */ genRuleVisitor),
/* harmony export */   "genVisitor": () => (/* binding */ genVisitor),
/* harmony export */   "generateVisitors": () => (/* binding */ generateVisitors),
/* harmony export */   "generate": () => (/* binding */ generate)
/* harmony export */ });
/* harmony import */ var _fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var _fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);
/* harmony import */ var _OhmCodegen_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(30);
/* harmony import */ var _fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);






function id(n) {
    return n;
}

function down(n) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.substring)(n, 0, 1).toLocaleLowerCase() + (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.substring)(n, 1);
}

function up(n) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.substring)(n, 0, 1).toLocaleUpperCase() + (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.substring)(n, 1);
}

function typeName(n) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.replace)(down(n), "_", "-").toLocaleLowerCase();
}

function varName(n) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.replace)(up(n.toLocaleLowerCase()), "_", "-");
}

function genTypeApp(t_mut) {
    genTypeApp:
    while (true) {
        const t = t_mut;
        switch (t.tag) {
            case 1: {
                t_mut = t.fields[0];
                continue genTypeApp;
            }
            case 2: {
                return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("%P()--%P()", [genTypeApp(t.fields[0]), typeName(t.fields[1])]));
            }
            case 3: {
                return "tuple";
            }
            case 4: {
                return "any";
            }
            default: {
                return typeName(t.fields[0]);
            }
        }
        break;
    }
}

function genField(_arg1) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("%P() is %P()", [typeName(_arg1.fields[0]), genTypeApp(_arg1.fields[1])]));
}

function genFields(fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((arg00$0040) => genField(arg00$0040), fs));
}

function generateType(t) {
    if (t.tag === 1) {
        const n_1 = t.fields[0];
        const variants = (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((arg10$0040) => genVariant(n_1, arg10$0040), t.fields[2]);
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("abstract %P() is node;%P()%P()", [typeName(n_1), "\n", (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)("\n", variants)]));
    }
    else {
        return genRecord(t.fields[0], t.fields[2]);
    }
}

function genRecord(n, fs) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("type %P() is node(%P());", [typeName(n), genFields(fs)]));
}

function genVariant(p, _arg1) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("type %P()--%P() is %P()(%P());", [typeName(p), typeName(_arg1.fields[0]), typeName(p), genFields(_arg1.fields[1])]));
}

function generateTypes(ts) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)("\n\n", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((t) => generateType(t), ts));
}

function isSingletonRule(b) {
    if (b.Terms.length === 1) {
        return b.Expr == null;
    }
    else {
        return false;
    }
}

function isImmaterial(t) {
    switch (t.tag) {
        case 5: {
            return true;
        }
        case 6: {
            return true;
        }
        default: {
            return false;
        }
    }
}

function genVisitorBinder(n, b) {
    let pattern_matching_result;
    if (b.tag === 0) {
        if (isImmaterial(b.fields[1])) {
            pattern_matching_result = 0;
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_2__.empty)();
        }
        case 1: {
            let pattern_matching_result_1;
            if (b.tag === 1) {
                if (isImmaterial(b.fields[0])) {
                    pattern_matching_result_1 = 0;
                }
                else {
                    pattern_matching_result_1 = 1;
                }
            }
            else {
                pattern_matching_result_1 = 1;
            }
            switch (pattern_matching_result_1) {
                case 0: {
                    return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_2__.empty)();
                }
                case 1: {
                    if (b.tag === 1) {
                        return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_2__.singleton)("_");
                    }
                    else {
                        return (0,_fable_fable_library_3_1_5_List_js__WEBPACK_IMPORTED_MODULE_2__.singleton)(varName(b.fields[0]));
                    }
                }
            }
        }
    }
}

function genVisitorParams(binders) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.collect)((tupledArg) => genVisitorBinder(tupledArg[0], tupledArg[1]), (0,_OhmCodegen_js__WEBPACK_IMPORTED_MODULE_3__.enumerate)(binders)));
}

function genTypeName(e) {
    switch (e.tag) {
        case 3: {
            return typeName(e.fields[0]);
        }
        case 2: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("%P()--%P()", [genTypeName(e.fields[0]), typeName(e.fields[1])]));
        }
        default: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toFail)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.printf)("Not a valid type constructor"));
        }
    }
}

function genExpr(e) {
    switch (e.tag) {
        case 1: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("(new %P()(%P())) ", [genTypeName(e.fields[0]), (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((e_1) => genExpr(e_1), e.fields[1]))]));
        }
        case 2: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("((%P()).%P())", [genExpr(e.fields[0]), typeName(e.fields[1])]));
        }
        case 3: {
            return varName(e.fields[0]);
        }
        case 4: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("[%P()]", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((e_2) => genExpr(e_2), e.fields[0]))]));
        }
        case 5: {
            return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("([%P()] ++ %P())", [(0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)(", ", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((e_3) => genExpr(e_3), e.fields[0])), genExpr(e.fields[1])]));
        }
        case 6: {
            return "nothing";
        }
        default: {
            return "(#lingua interval: Node)";
        }
    }
}

function genVisitorEffect(n, expr) {
    if (expr != null) {
        return genExpr(expr);
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("assert not \"Undefined rule %P()\";", [n]));
    }
}

function genAltVisitor(tk, n, i, b) {
    const name = JSON.stringify(((n + "_alt") + (0,_fable_fable_library_3_1_5_Types_js__WEBPACK_IMPORTED_MODULE_4__.toString)(i)));
    if (tk) {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("  %P() -\u003e #lingua visitor-source,", [name]));
    }
    else if (isSingletonRule(b)) {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("  %P() -\u003e #lingua visitor-singleton,", [name]));
    }
    else {
        return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("  %P() -\u003e #lingua visitor-lambda: { Node, %P() in %P() },", [name, genVisitorParams(b.Terms), genVisitorEffect(n, b.Expr)]));
    }
}

function genRuleVisitor(tk, n, b) {
    return ((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("  %P() -\u003e #lingua visitor-identity,", [JSON.stringify(n)])) + "\n") + (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)("\n", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((tupledArg) => genAltVisitor(tk, n, tupledArg[0], tupledArg[1]), (0,_OhmCodegen_js__WEBPACK_IMPORTED_MODULE_3__.enumerate)(b)));
}

function genVisitor(rule) {
    switch (rule.tag) {
        case 1: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[3]);
        }
        case 2: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[3]);
        }
        default: {
            return genRuleVisitor(rule.fields[0], rule.fields[1], rule.fields[4]);
        }
    }
}

function generateVisitors(g) {
    return (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.join)("\n", (0,_fable_fable_library_3_1_5_Seq_js__WEBPACK_IMPORTED_MODULE_1__.map)((rule) => genVisitor(rule), g.Rules));
}

function generate(g) {
    return "% crochet" + (0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.toText)((0,_fable_fable_library_3_1_5_String_js__WEBPACK_IMPORTED_MODULE_0__.interpolate)("\r\n// This file is generated from Lingua\r\n\r\nopen crochet.text.parsing.lingua;\r\n\r\n// Type definitions\r\nabstract node;\r\n%P()\r\n\r\n// Grammar definition\r\ndefine grammar = lazy (#lingua grammar: %P());\r\n\r\ndefine to-ast = lazy ((force grammar) semantics: [\r\n%P()\r\n]);\r\n  ", [generateTypes(g.Types), JSON.stringify((0,_OhmCodegen_js__WEBPACK_IMPORTED_MODULE_3__.generateGrammar)(g)), generateVisitors(g)]));
}

//# sourceMappingURL=CrochetCodegen.js.map


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _build_source_App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
const fs = __webpack_require__(1);
const path = __webpack_require__(2);


const [file, target0] = process.argv.slice(2);
const target = target0 ?? "typescript";

if (file == null) {
  console.error(`Usage: lingua <file.lingua> [typescript | crochet]`);
  process.exit(1);
}

const source = fs.readFileSync(file, "utf8");
const ast = _build_source_App__WEBPACK_IMPORTED_MODULE_0__.parse(source)(file);

switch (target) {
  case "typescript": {
    const out = _build_source_App__WEBPACK_IMPORTED_MODULE_0__.generate(ast);
    console.log(out);
    break;
  }
  case "crochet": {
    const out = _build_source_App__WEBPACK_IMPORTED_MODULE_0__.generateCrochet(ast);
    console.log(out);
    break;
  }
  default:
    throw new Error(`Unknown target ${target}`);
}
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;