import * as Parser from "./syntax/parser";
import * as Fs from "fs";
import * as Path from "path";
import { Program } from "./syntax/ast";
import { Module } from "../ir/operations";

export function parse(filename: string) {
  const source = Fs.readFileSync(filename, "utf8");
  const ast = Parser.parse(filename, source);
  return ast;
}

export function compile(ast: Program) {
  return ast.compile();
}

export function serialise(module: Module) {
  return JSON.stringify(module.toJSON());
}

export function compile_file(filename: string) {
  return compile(parse(filename));
}
