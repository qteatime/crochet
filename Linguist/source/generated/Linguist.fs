// This code was automatically generated from a grammar definition by Fohm.
module Fohm.Generated.Linguist

type Offset = 
  { line: int; column: int }

type OffsetRecord<'a> =
  { start: 'a; ``end``: 'a }

type Position = 
  {
    offset: unit -> OffsetRecord<int>
    position: unit -> OffsetRecord<Offset>
    sourceSlice: string
    sourceString: string
    filename: string option
  }

type Meta = 
  { source: Position; children: Position[] }

type ParseOptions =
  { filename: string option }


open Fable.Core
open Linguist.AST

[<Emit("JSON.parse($0)")>]
let parseJson s : string = jsNative

let parseString (s:string) =
  parseJson ((s.Replace("\r\n", "\\n")).Replace("\n", "\\n"))



open Fable.Core
open Fable.Core.JsInterop

[<Import("makeParser", from="./fohm-runtime.js")>]
let private makeParser (source: string, visitor: obj): obj = jsNative

let private visitor = 
  createObj [
    "TypeDecl_alt0" ==> fun (meta:Meta) _0 n f _3 p _5 ->
       TRecord(n, f, p) 
              
    "TypeDecl_alt1" ==> fun (meta:Meta) _0 n f _3 _4 p ->
       TUnion(n, f, p) 
              
    "TypeVariant_alt0" ==> fun (meta:Meta) n _1 p _3 ->
       Variant(n, p) 
              
    "TypeField_alt0" ==> fun (meta:Meta) n _1 t ->
       Field(n, t) 
              
    "TypeApp_alt0" ==> fun (meta:Meta) t _1 ->
       TAList t 
              
    "TypeApp_alt1" ==> fun (meta:Meta) t _1 ->
       TAMaybe t 
              
    "TypeApp2_alt0" ==> fun (meta:Meta) t _1 ps _3 ->
       TAApply(t, ps) 
              
    "TypeApp3_alt0" ==> fun (meta:Meta) t _1 n ->
       TAProject(t, n) 
              
    "TypeApp4_alt0" ==> fun (meta:Meta) n ->
       TAName n 
              
    "TypeApp4_alt1" ==> fun (meta:Meta) _0 t _2 ->
       t 
              
    "Grammar_alt0" ==> fun (meta:Meta) ts _1 n _3 t _5 rs _7 ->
       grammar n rs t ts 
              
    "Rule_alt0" ==> fun (meta:Meta) _0 r ->
       makeToken r 
              
    "Rule_alt1" ==> fun (meta:Meta) n p d _3 b ->
       RDefine(false, n, p, d, b) 
              
    "Rule_alt2" ==> fun (meta:Meta) n p _2 b ->
       ROverride(false, n, p, b) 
              
    "Rule_alt3" ==> fun (meta:Meta) n p _2 b ->
       RExtend(false, n, p, b) 
              
    "RuleBody_alt0" ==> fun (meta:Meta) _0 bs ->
       bs 
              
    "TopLevelTerm_alt0" ==> fun (meta:Meta) t _1 e ->
       body t (Some e) 
              
    "TopLevelTerm_alt1" ==> fun (meta:Meta) t ->
       body t None 
              
    "Binder_alt0" ==> fun (meta:Meta) n _1 t ->
       BBound(n, t) 
              
    "Binder_alt1" ==> fun (meta:Meta) t ->
       BUnbound(t) 
              
    "Action_alt0" ==> fun (meta:Meta) e _1 xs _3 ->
       AMake(e, xs) 
              
    "ActionProject_alt0" ==> fun (meta:Meta) a _1 n ->
       AProject(a, n) 
              
    "ActionPrimary_alt0" ==> fun (meta:Meta) _0 ->
       AMeta 
              
    "ActionPrimary_alt1" ==> fun (meta:Meta) n ->
       AVar n 
              
    "ActionPrimary_alt2" ==> fun (meta:Meta) _0 ->
       ANull 
              
    "ActionPrimary_alt4" ==> fun (meta:Meta) _0 x _2 ->
       x 
              
    "ActionList_alt0" ==> fun (meta:Meta) _0 xs _2 _3 x _5 ->
       ACons(xs, x) 
              
    "ActionList_alt1" ==> fun (meta:Meta) _0 xs _2 ->
       AList xs 
              
    "Formals_alt0" ==> fun (meta:Meta) _0 xs _2 ->
       xs 
              
    "Formals_alt1" ==> fun (meta:Meta)  ->
       [||] 
              
    "Params_alt0" ==> fun (meta:Meta) _0 xs _2 ->
       xs 
              
    "Params_alt1" ==> fun (meta:Meta)  ->
       [||] 
              
    "Alt_alt0" ==> fun (meta:Meta) xs ->
       TAlt xs 
              
    "Seq_alt0" ==> fun (meta:Meta) xs ->
       TSeq xs 
              
    "Iter_alt0" ==> fun (meta:Meta) t _1 ->
       TStar t 
              
    "Iter_alt1" ==> fun (meta:Meta) t _1 ->
       TPlus t 
              
    "Iter_alt2" ==> fun (meta:Meta) t _1 ->
       TOpt t 
              
    "Pred_alt0" ==> fun (meta:Meta) _0 t ->
       TNot t 
              
    "Pred_alt1" ==> fun (meta:Meta) _0 t ->
       TLookahead t 
              
    "Lex_alt0" ==> fun (meta:Meta) _0 t ->
       TLex t 
              
    "Base_alt0" ==> fun (meta:Meta) n p ->
       TApply(n, p) 
              
    "Base_alt1" ==> fun (meta:Meta) l _1 e ->
       TRange(l, e) 
              
    "Base_alt2" ==> fun (meta:Meta) t ->
       TTerminal t 
              
    "Base_alt3" ==> fun (meta:Meta) _0 t _2 ->
       TParens t 
              
    "ruleDescr_alt0" ==> fun (meta:Meta) _0 d _2 ->
       String.concat "" d 
              
    "terminal_alt0" ==> fun (meta:Meta) t ->
       parseString t 
              
    "oneCharTerminal_alt0" ==> fun (meta:Meta) t ->
       parseString t 
              
  ]

let private primParser: obj  =
  makeParser(
    """
    Linguist {
      TypeDecl =
        | type_ Name Formals "(" NonemptyListOf<TypeField, ","> ")" -- alt0
        | type_ Name Formals "=" "|"? NonemptyListOf<TypeVariant, "|"> -- alt1
              
      
      TypeVariant =
        | Name "(" NonemptyListOf<TypeField, ","> ")" -- alt0
              
      
      TypeField =
        | Name ":" TypeApp -- alt0
              
      
      TypeApp =
        | TypeApp2 "[]" -- alt0
        | TypeApp2 "?" -- alt1
        | TypeApp2 -- alt2
              
      
      TypeApp2 =
        | TypeApp3 "<" NonemptyListOf<TypeApp, ","> ">" -- alt0
        | TypeApp3 -- alt1
              
      
      TypeApp3 =
        | TypeApp3 "." Name -- alt0
        | TypeApp4 -- alt1
              
      
      TypeApp4 =
        | Name -- alt0
        | "(" TypeApp ")" -- alt1
              
      
      Grammar =
        | TypeDecl* grammar_ Name ":" TypeApp "{" Rule* "}" -- alt0
              
      
      Rule =
        | token_ Rule -- alt0
        | ident Formals ruleDescr? "=" RuleBody -- alt1
        | ident Formals ":=" RuleBody -- alt2
        | ident Formals? "+=" RuleBody -- alt3
              
      
      RuleBody =
        | "|"? NonemptyListOf<TopLevelTerm, "|"> -- alt0
              
      
      TopLevelTerm =
        | Binder* "->" Action -- alt0
        | Binder* -- alt1
              
      
      Binder =
        | Name ":" Iter -- alt0
        | Iter -- alt1
              
      
      Action =
        | ActionProject "(" NonemptyListOf<Action, ","> ")" -- alt0
        | ActionProject -- alt1
              
      
      ActionProject =
        | ActionProject "." Name -- alt0
        | ActionPrimary -- alt1
              
      
      ActionPrimary =
        | meta_ -- alt0
        | Name -- alt1
        | null_ -- alt2
        | ActionList -- alt3
        | "(" Action ")" -- alt4
              
      
      ActionList =
        | "[" NonemptyListOf<Action, ","> "," "..." Action "]" -- alt0
        | "[" ListOf<Action, ","> "]" -- alt1
              
      
      Formals =
        | "<" ListOf<ident, ","> ">" -- alt0
        |  -- alt1
              
      
      Params =
        | "<" ListOf<Seq, ","> ">" -- alt0
        |  -- alt1
              
      
      Alt =
        | NonemptyListOf<Seq, "|"> -- alt0
              
      
      Seq =
        | Iter* -- alt0
              
      
      Iter =
        | Pred "*" -- alt0
        | Pred "+" -- alt1
        | Pred "?" -- alt2
        | Pred -- alt3
              
      
      Pred =
        | "~" Lex -- alt0
        | "&" Lex -- alt1
        | Lex -- alt2
              
      
      Lex =
        | "#" Base -- alt0
        | Base -- alt1
              
      
      Base =
        | ~reserved ident Params ~(ruleDescr? "=" | ":=" | "+=") -- alt0
        | oneCharTerminal ".." oneCharTerminal -- alt1
        | terminal -- alt2
        | "(" Alt ")" -- alt3
              
      
      ruleDescr (a,r,u,l,e,d,e,s,c,r,i,p,t,i,o,n) =
        | "(" ruleDescrText ")" -- alt0
              
      
      ruleDescrText =
        | (~")" any)* -- alt0
              
      
      name (a,n,a,m,e) =
        | nameFirst nameRest* -- alt0
              
      
      nameFirst =
        | "_" -- alt0
        | letter -- alt1
              
      
      nameRest =
        | "_" -- alt0
        | alnum -- alt1
              
      
      ident (a,n,i,d,e,n,t,i,f,i,e,r) =
        | name -- alt0
              
      
      terminal =
        | t_terminal -- alt0
              
      
      t_terminal =
        | "\"" terminalChar* "\"" -- alt0
              
      
      oneCharTerminal =
        | t_oneCharTerminal -- alt0
              
      
      t_oneCharTerminal =
        | "\"" terminalChar "\"" -- alt0
              
      
      terminalChar =
        | escapeChar -- alt0
        | ~"\\" ~"\"" ~"\n" any -- alt1
              
      
      escapeChar (a,n,e,s,c,a,p,e,s,e,q,u,e,n,c,e) =
        | "\\\\" -- alt0
        | "\\\"" -- alt1
        | "\\b" -- alt2
        | "\\n" -- alt3
        | "\\r" -- alt4
        | "\\t" -- alt5
        | "\\u" hexDigit hexDigit hexDigit hexDigit -- alt6
        | "\\x" hexDigit hexDigit -- alt7
              
      
      space +=
        | comment -- alt0
              
      
      comment =
        | "//" (~"\n" any)* "\n" -- alt0
        | "/*" (~"*/" any)* "*/" -- alt1
              
      
      tokens =
        | token* -- alt0
              
      
      token =
        | comment -- alt0
        | ident -- alt1
        | operator -- alt2
        | punctuation -- alt3
        | terminal -- alt4
        | any -- alt5
              
      
      operator =
        | "<:" -- alt0
        | "=" -- alt1
        | ":=" -- alt2
        | "+=" -- alt3
        | "*" -- alt4
        | "+" -- alt5
        | "?" -- alt6
        | "~" -- alt7
        | "&" -- alt8
              
      
      punctuation =
        | "<" -- alt0
        | ">" -- alt1
        | "," -- alt2
        | "--" -- alt3
              
      
      kw<k> =
        | k ~nameRest -- alt0
              
      
      type_ =
        | kw<"type"> -- alt0
              
      
      grammar_ =
        | kw<"grammar"> -- alt0
              
      
      meta_ =
        | kw<"meta"> -- alt0
              
      
      null_ =
        | kw<"null"> -- alt0
              
      
      token_ =
        | kw<"token"> -- alt0
              
      
      reserved =
        | type_ -- alt0
        | grammar_ -- alt1
        | meta_ -- alt2
        | null_ -- alt3
        | token_ -- alt4
              
      
      Name =
        | ~reserved name -- alt0
              
    }
      
    """, 
    visitor
  )

let parse (rule: string) (source: string) (options: ParseOptions): Result<Grammar, string> = 
  let (success, value) = !!(primParser$(source, rule, options))
  if success then Ok(!!value)
  else Error(!!value)
  