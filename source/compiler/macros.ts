import * as IR from "../ir";
import * as Ast from "../generated/crochet-grammar";
import {
  parseInteger,
  parseNumber,
  parseString,
  signatureName,
  signatureValues,
} from "./utils";

const plugins = new Map(
  Object.entries({
    "derive: _": derive_plugin,
  })
);

export function run_plugin(
  signature: Ast.Signature<Ast.Literal>,
  declarations: IR.Declaration[]
) {
  const name = signatureName(signature);
  const values = signatureValues(signature).map((x) => literal_to_js(x)) as any;
  const plugin = plugins.get(name);
  if (plugin == null) {
    throw new Error(`Unknown plugin ${name}`);
  } else {
    return plugin(values, declarations);
  }
}

export function derive_plugin([trait]: [string], ast: IR.Declaration[]) {
  switch (trait) {
    case "equality":
      return derive_equality(ast);

    default:
      throw new Error(`Unknown derivation ${trait}`);
  }
}

export function derive_equality(ast: IR.Declaration[]) {
  function do_derive(type: IR.DType) {
    const meta = type.meta;
    const tname = new IR.LocalType(meta, type.name);
    return [
      new IR.DImplementTrait(meta, new IR.LocalTrait(meta, "equality"), tname),
      new IR.DCommand(
        meta,
        "True if both values are equal",
        "_ === _",
        ["L", "R"],
        [
          new IR.TypeConstraintType(meta, tname),
          new IR.TypeConstraintType(meta, tname),
        ],
        new IR.BasicBlock([
          new IR.PushLiteral(new IR.LiteralTrue()),
          ...type.fields.flatMap((field) => [
            new IR.PushVariable(meta, "L"),
            new IR.ProjectStatic(meta, field),
            new IR.Duplicate(meta),
            new IR.PushVariable(meta, "R"),
            new IR.ProjectStatic(meta, field),
            new IR.Duplicate(meta),
            new IR.TraitTest(meta, new IR.LocalTrait(meta, "equality")),
            new IR.Dig(meta, 2),
            new IR.TraitTest(meta, new IR.LocalTrait(meta, "equality")),
            new IR.Invoke(meta, "_ and _", 2),
            new IR.Branch(
              meta,
              new IR.BasicBlock([new IR.Invoke(meta, "_ === _", 2)]),
              new IR.BasicBlock([new IR.IntrinsicEqual(meta)])
            ),
            new IR.Invoke(meta, "_ and _", 2),
          ]),
          new IR.Return(meta),
        ])
      ),
    ];
  }

  const types = ast.flatMap((x) => (x instanceof IR.DType ? [x] : []));
  return [...ast, ...types.flatMap((x) => do_derive(x))];
}

export function literal_to_js(x: Ast.Literal): any {
  return x.match<any>({
    False: (_) => false,
    True: (_) => true,
    Float: (_, digits) => parseNumber(digits),
    Integer: (_, digits) => parseInteger(digits),
    Text: (_, x) => parseString(x),
    Nothing: (_) => null,
  });
}
