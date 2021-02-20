module Linguist.AST

type Grammar = {
  Name: string
  Top: TypeApp
  Rules: Rule[]
  Types: Type[]
}

and Rule =
  | RDefine of isToken: bool * name:string * formals:string[] * desc:string Option * RuleBody[]
  | ROverride of isToken: bool * name:string * formals:string[] * RuleBody[]
  | RExtend of isToken: bool * name:string * formals:string[] * RuleBody[]

and RuleBody = {
  Terms: Binder[]
  Expr: Expr Option
}

and Binder =
  | BBound of string * Term
  | BUnbound of Term

and Term =
  | TSeq of Term[]
  | TAlt of Term[]
  | TStar of Term
  | TPlus of Term
  | TOpt of Term
  | TNot of Term
  | TLookahead of Term
  | TLex of Term
  | TApply of string * args:Term[]
  | TRange of string * string
  | TTerminal of string
  | TParens of Term

and Expr =
  | AMeta
  | AMake of ctor:Expr * args:Expr[]
  | AProject of Expr * field:string
  | AVar of name:string
  | AList of Expr[]
  | ACons of Expr[] * Expr
  | ANull

and Type =
  | TRecord of name:string * formals:string[] * fields:Field[]
  | TUnion of name:string * formals:string[] * variants:Variant[]

and Variant =
  | Variant of name:string * fields:Field[]

and Field =
  | Field of name:string * typ:TypeApp

and TypeApp =
  | TAName of name:string
  | TAApply of TypeApp * args:TypeApp[]
  | TAProject of TypeApp * field:string
  | TAList of TypeApp
  | TAMaybe of TypeApp

let grammar n rs t ts : Grammar = {
  Name = n
  Top = t
  Rules = rs
  Types = ts
}

let body t a : RuleBody = {
  Terms = t
  Expr = a
}

let makeToken r =
  match r with
  | RDefine (tk, n, f, d, b) ->
      RDefine (true, n, f, d, b)
  | ROverride (tk, n, f, b) ->
      ROverride (true, n, f, b)
  | RExtend (tk, n, f, b) ->
      RExtend (true, n, f, b)