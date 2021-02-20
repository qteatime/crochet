module Linguist.Codegen

open Fable.Core
open Linguist.AST

let enumerate xs =
  Seq.zip {1..(Seq.length xs)} xs

let ident n = n

[<Emit("JSON.stringify($0)")>]
let toString (s:string) = jsNative

// == Type language
let genParam p = p  

let genParams ps =
  if Array.isEmpty ps then
    ""
  else
    let ps = Seq.map genParam ps |> String.concat ", "
    $"<{ps}>"

let rec genTypeApp t =
  match t with
  | TAName n -> n
  | TAApply (n, ps) ->
      if Array.isEmpty ps then
        n
      else
        let ps = Seq.map genTypeApp ps |> String.concat ", "
        $"{n}<{ps}>"
  | TAProject (t, f) ->
      $"{genTypeApp t}.{f}"
  | TAList t ->
      $"{genTypeApp t}[]"
  | TAMaybe t ->
      $"({genTypeApp t} | null)"

let genField (Field (n, t)) =
  $"{n}: {genTypeApp t}"

let genFields fs =
  Seq.map genField fs |> String.concat ", "

let genFieldInit fs =
  let gen f = $"readonly {genField f}"
  Seq.map gen fs |> String.concat ", "

let rec generateType t =
  match t with
  | TRecord (n, ps, fs) -> genRecord n ps fs
  | TUnion (n, ps, vs) ->
      let ps = genParams ps
      let variantGetters = Seq.map (genVariantGetter ps) vs
      let variants = Seq.map (genVariant n ps) vs
      $"""
      const {n} = function() {{
        abstract class {n}{ps} extends Node {{
          abstract tag: string;
          {String.concat "\n" variantGetters}
          
          static has_instance(x: any) {{
            return x instanceof {n};
          }}
        }}
   
        {String.concat "\n\n" variants}


        return {n};
      }}();
      """

and genRecord n ps fs =
  $"""
  export class {n}{genParams ps} extends Node {{
    readonly tag = "{n}"

    constructor({genFieldInit fs}) {{
      super();
      {genInitAsserts fs}
    }}

    static has_instance(x: any) {{
      return x instanceof {n};
    }}
  }}
  """

and genVariant p ps (Variant (n, fs)) =
  $"""
  class {n}{ps} extends {p} {{
    readonly tag = "{n}";

    constructor({genFieldInit fs}) {{
      super();
      {genInitAsserts fs}
    }}

    static has_instance(x: any) {{
      return x instanceof {n};
    }}
  }}
  """

and genVariantGetter ps (Variant (n, fs)) =
  $"""
  get {n}() {{
    return {n}
  }}
  """

and genInitAsserts fs =
  Seq.map genInitAssert fs |> String.concat "; "

and genInitAssert (Field (n, t)) =
  genAssert n t

and genAssert x t =
  $"""($assert_type<{genTypeApp t}>({x}, "{genTypeApp t}", {genTypeAssert t}))"""

and genTypeAssert t =
  match t with
  | TAName "string" -> """$is_primitive("string")"""
  | TAName "number" -> """$is_primitive("number")"""
  | TAName "bigint" -> """$is_primitive("bigint")"""
  | TAName "boolean" -> """$is_primitive("boolean")"""
  | TAName "null" -> """$is_null"""
  | TAName name -> name
  | TAApply (t, _) -> t
  | TAProject (t, f) -> $"{genTypeAssert t}.{f}"
  | TAList t -> $"$is_array({genTypeAssert t})"
  | TAMaybe t -> $"$is_maybe({genTypeAssert t})"


let generateTypes ts =
  ts |> Seq.map generateType 
     |> String.concat "\n\n"

// == Grammar language
let genDesc desc =
  match desc with
  | Some x -> $"({x})"
  | None -> ""

let genRuleParams ps =
  if Array.isEmpty ps then
    ""
  else
    $"""<{String.concat ", " ps}>"""

let rec genTerm t =
  match t with
  | TSeq ts -> Seq.map genTerm ts |> String.concat " "
  | TAlt ts -> Seq.map genTerm ts |> String.concat " | "
  | TStar t -> $"{genTerm t}*"
  | TPlus t -> $"{genTerm t}+"
  | TOpt t -> $"{genTerm t}?"
  | TNot t -> $"~{genTerm t}"
  | TLookahead t -> $"&{genTerm t}"
  | TLex t -> $"#{genTerm t}"
  | TApply (t, ps) ->
      if Array.isEmpty ps then
        t
      else
        $"""{t}<{String.concat ", " (Seq.map genTerm ps)}"""
  | TRange (a, b) ->
      $"{toString a}..{toString b}"
  | TTerminal t ->
      toString t
  | TParens t ->
      $"({genTerm t})"

let genBinder b =
  match b with
  | BBound (_, t) -> genTerm t
  | BUnbound t -> genTerm t

let genBody (n: int, b:RuleBody) =
  let s = Seq.map genBinder b.Terms |> String.concat " "
  $"{s}  -- alt{n}"

let genBodies b =
  Seq.map genBody (enumerate b) |> String.concat " | "

let generateRule rule =
  match rule with
  | RDefine(_, n, ps, desc, b) ->
      $"{n}{genRuleParams ps} {genDesc desc} = {genBodies b}"
  | ROverride(_, n, ps, b) ->
      $"{n}{genRuleParams ps} := {genBodies b}"
  | RExtend(_, n, ps, b) ->
      $"{n}{genRuleParams ps} += {genBodies b}"

let generateRules rules =
  Seq.map generateRule rules

let generateGrammar (g:Grammar) =
  let rules = generateRules g.Rules
  $"""
  grammar {g.Name} {{
    {String.concat "\n\n" rules}
  }}
  """

let topType (g:Grammar) =
  genTypeApp g.Top

// == Visitor semantics
let builtinVisitors =
  """
  _terminal() {
    return this.primitiveValue
  },

  _iter(children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST();
      }

      return children.map(x => x.toAST());
    }
  },

  listOf(node) {
    if (node.children.length === 0) {
      return [];
    } else if (node.children.length === 1) {
      return [node.children[0].toAST()];
    } else {
      const [first, _, rest] = node.children;
      return [first.toAST(), ...rest.toAST()];
    }
  },

  NonemptyListOf(first, _, rest) {
    return [first.toAST(), ...rest.toAST()];
  },

  EmptyListOf() {
    return [];
  },
  """

let genVisitorBinder (n, b) =
  match b with
  | BBound (name, _) -> $"{name}$0: Ohm.Node"
  | BUnbound (_) -> $"_{n}: Ohm.Node"

let genVisitorParams binders =
  Seq.map genVisitorBinder (enumerate binders)
  |> String.concat ", "

let resolveVisitorBinder b =
  match b with
  | BBound (name, _) -> $"const {name} = {name}$0.toAST()"
  | BUnbound _ -> ""

let resolveVisitorBinders binders =
  Seq.map resolveVisitorBinder binders
  |> String.concat "; "

let genBinderRecordBinder binder =
  match binder with
  | BBound (name, _) -> $"{name}, "
  | BUnbound _ -> ""

let genBinderRecord binders =
  Seq.map genBinderRecordBinder binders |> String.concat ""

let rec genExpr e =
  match e with
  | AMeta -> "$meta(this)"
  | AMake (c, args) -> 
      $"""(new ({genExpr c})({Seq.map genExpr args |> String.concat ", "}))"""
  | AProject (o, f) ->
      $"""(({genExpr o}).{f})"""
  | AVar n ->
      ident n
  | AList xs ->
      $"""[{Seq.map genExpr xs |> String.concat ", "}]"""
  | ACons (hd, tl) ->
      $"""[{Seq.map genExpr hd |> String.concat ", "}, ...{genExpr tl}]"""
  | ANull ->
      "null"
  

let genVisitorEffect n expr =
  match expr with
  | None -> $"(() => {{ throw new Error(`Undefined rule {n}`) }})()"
  | Some e ->
      genExpr e

let isSingletonRule (b:RuleBody) =
  (Array.length b.Terms = 1) && (Option.isNone b.Expr)

let genAltVisitor tk n (i, b:RuleBody) =
  if tk then
    $"""
    {n}_alt{i}({genVisitorParams b.Terms}) {{
      return this.sourceString;
    }},
    """
  else if isSingletonRule b then
    $"""
    {n}_alt{i}({genVisitorParams b.Terms}) {{
      return this.children[0].toAST();
    }},
    """
  else
    $"""
    {n}_alt{i}({genVisitorParams b.Terms}) {{
      {resolveVisitorBinders b.Terms}
      return {genVisitorEffect n b.Expr}
    }},
    """

let genRuleVisitor tk n b =
  $"""
  {n}(x: Ohm.Node) {{
    return x.toAST();
  }},
  """
  + (Seq.map (genAltVisitor tk n) (enumerate b)
    |> String.concat "")

let genVisitor rule =
  match rule with
  | RDefine(tk, n, _, _, b) -> genRuleVisitor tk n b
  | ROverride (tk, n, _, b) -> genRuleVisitor tk n b
  | RExtend (tk, n, _, b) -> genRuleVisitor tk n b

let genVisitors (g:Grammar) =
  Seq.map genVisitor g.Rules |> String.concat ""

let generateAstVisitor (g:Grammar) =
  $"""
  {{ 
    {builtinVisitors}
    {genVisitors g}
  }}
  """

// == Top
let prelude =
  """
type Result<A> =
  { ok: true, value: A }
| { ok: false, error: string };

type Meta = {
  source: string;
  position: {
    start_index: number
    end_index: number
  }
};

function $meta(x: Ohm.Node): Meta {
  return {
    source: x.sourceString,
    position: {
      start_index: x.source.startIdx,
      end_index: x.source.endIdx
    }
  };
}

type Typed =
  (_: x) => boolean
| { has_instance(x: any): boolean };

function $check_type(f: Typed) {
  return (x: any) => {
    if (typeof f.has_instance === "function") {
      return f.has_instance(x);
    } else {
      return f(x);
    }
  }
}

function $is_type(t: string) {
  return (x: any) => {
    return typeof x === t;
  };
}

function $is_array_of(f: Typed) {
  return (x: any) => {
    return Array.isArray(x) && x.every($check_type(f));
  };
}

function $is_maybe(f: Typed) {
  return (x: any) => {
    return x === null || $check_type(f)(x);
  };
}

function $is_null(x: any) {
  return x === null;
}

function $assert_type<T>(x: any, t: string, f: Typed): asserts x is T {
  if (!$check_type(f)(t)) {
    throw new TypeError(`Expected ${t}, but got ${x}`);
  }
}
  """

let generate (g:Grammar) =
  $"""
  // This file is generated from Linguist
  import * as Ohm from "ohm-js";

  {prelude}

  // == Type definitions ==============================================
  {generateTypes g.Types}

  // == Grammar definition ============================================
  const grammar = Ohm.grammar({toString (generateGrammar g)})

  // == Parsing =======================================================
  function parse(source: string, rule: string): Result<{topType g}> {{
    const result = grammar.match(source, rule);
    if (result.failed()) {{
      return {{ ok: false, error: result.message }};
    }} else {{
      const ast = toAst(result);
      {genAssert "ast" g.Top}
      return {{ ok: true, value: toAst(result) }};
    }}
  }}

  const semantics = grammar.createSemantics();
  const toAstVisitor = ({generateAstVisitor g});
  semantics.addOperation("toAST()", toAstVisitor);

  function toAst(result: Ohm.MatchResult) {{
    return semantics(result).toAST();
  }}
  """