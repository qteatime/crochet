module Linguist.Parser

open Fohm.Generated
open Linguist.AST

let parse source filename =
  match Linguist.parse "Grammar" source { filename = filename } with
  | Ok v -> v
  | Error e -> failwithf "%s" e