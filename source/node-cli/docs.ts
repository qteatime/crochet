import * as Path from "path";
import * as FS from "fs";
import * as Package from "../pkg";
import { CrochetForNode, build, build_file } from "../targets/node";
import type { BootedCrochet, CrochetValue } from "../crochet";
import {
  CrochetCommand,
  CrochetCommandBranch,
  CrochetModule,
  CrochetPackage,
  CrochetTrait,
  CrochetType,
  Metadata,
} from "../vm";
import {
  module_location,
  simple_value,
  trait_name,
  type_constraint_name,
  type_name,
} from "../vm/primitives/location";
import { get_annotated_source, get_source_slice } from "../vm/primitives/meta";
import type * as Express from "express";

const doc_root = Path.resolve(__dirname, "../../tools/docs");

function get_source(meta: number | null, module: CrochetModule | null) {
  if (meta != null && module != null && module.metadata != null) {
    return (
      get_source_slice(meta, module.metadata)?.trim() ??
      "(no source code available)"
    );
  } else {
    return "(no source code available)";
  }
}

function mapmap<K, V, U>(m: Map<K, V>, fn: (k: K, v: V) => U): U[] {
  const result = [];
  for (const [k, v] of m.entries()) {
    result.push(fn(k, v));
  }
  return result;
}

function template(title0: string, data: any) {
  const title = title0.replace(/[^\w\d.\-]/g, "");
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - Crochet Documentation</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="./fa-solid.css" />
    <link rel="stylesheet" href="./fontawesome.min.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="doc-root"></div>
    <script type="text/json" data-id="docs">
${JSON.stringify(data)}
    </script>
    <script src="docs.js"></script>
  </body>
</html>  
  `;
}

export async function serve_docs(
  port: number,
  filename: string,
  target0: Package.Target | null
) {
  const crochet = new CrochetForNode(false, [], new Set([]), false);
  const pkg = crochet.read_package_from_file(filename);
  const target = target0 ?? pkg.meta.target;
  await crochet.boot(pkg, target);

  const data = generate_docs(pkg, crochet.system);
  const index = template(pkg.meta.name, data);

  const express = require("express") as typeof Express;
  const app = express();
  app.get("/", async (req, res) => {
    res.send(index);
  });
  app.use("/", express.static(doc_root));
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

function generate_docs(pkg: Package.Package, sys: BootedCrochet) {
  const types = mapmap(sys.universe.world.types.bindings, type_doc);
  const traits = mapmap(sys.universe.world.traits.bindings, trait_doc);
  const commands = mapmap(sys.universe.world.commands.bindings, command_doc);
  const globals = mapmap(sys.universe.world.definitions.bindings, global_doc);
  return {
    package: {
      meta: pkg.meta,
      target: pkg.meta.target.toString(),
      overview: package_readme(pkg),
    },
    types,
    traits,
    commands,
    globals,
  };
}

function package_readme(pkg: Package.Package) {
  const readme = Path.join(Path.dirname(pkg.filename), "readme.md");
  if (FS.existsSync(readme)) {
    return FS.readFileSync(readme, "utf-8");
  } else {
    return "";
  }
}

function type_doc(name: string, typ: CrochetType) {
  return {
    full_name: name,
    name: typ.name,
    static_full_name: full_static_type_name(typ),
    signature: type_name(typ),
    documentation: typ.documentation,
    is_sealed: typ.sealed,
    is_static: typ.is_static,
    module: typ.module?.filename ?? "(intrinsic)",
    package: typ.module?.pkg.name ?? "crochet.core",
    fields: type_fields(typ),
    parents: type_parents(typ.parent),
    traits: [...new Set(all_implemented_traits(typ))].map((t) =>
      full_trait_name(t)
    ),
    capabilities: [...typ.protected_by].map((c) => c.full_name),
    subtypes: [...typ.sub_types].map((t) => full_type_name(t)),
    declaration: get_source(typ.meta, typ.module),
    location: typ.module ? module_location(typ.module) : "(intrinsic)",
  };
}

function trait_doc(name: string, trait: CrochetTrait) {
  return {
    full_name: name,
    name: trait.name,
    documentation: trait.documentation,
    location: trait.module ? module_location(trait.module) : "(intrinsic)",
    declaration: get_source(trait.meta, trait.module),
    implemented_by: [...trait.implemented_by].map((t) => full_type_name(t)),
    protected_by: [...trait.protected_by].map((c) => c.full_name),
    package: trait.module?.pkg.name ?? "crochet.core",
    module: trait.module?.filename ?? "(intrinsic)",
  };
}

function command_doc(name: string, command: CrochetCommand) {
  return {
    name: name,
    arity: command.arity,
    branches: command.branches.map(command_branch_doc),
  };
}

function command_branch_doc(branch: CrochetCommandBranch) {
  return {
    name: branch.name,
    module: branch.module.filename,
    package: branch.module.pkg.name,
    documentation: branch.documentation,
    parameters: branch.parameters,
    types: branch.types.map((c) => ({
      type: full_type_name(c.type),
      traits: c.traits.map((t) => full_trait_name(t)),
      signature: type_constraint_name(c),
    })),
    location: module_location(branch.module),
    declaration: get_source(branch.meta, branch.module),
  };
}

function global_doc(name: string, value: CrochetValue) {
  return {
    full_name: name,
    name: name.split("/").slice(-1)[0],
    value: simple_value(value),
    type: full_type_name(value.type),
    package: name.split("/")[0],
  };
}

function type_parents(typ: CrochetType | null): string[] {
  if (typ == null) {
    return [];
  } else {
    return [full_type_name(typ), ...type_parents(typ.parent)];
  }
}

function all_implemented_traits(typ: CrochetType | null): CrochetTrait[] {
  if (typ == null) {
    return [];
  } else {
    return [...typ.traits, ...all_implemented_traits(typ.parent)];
  }
}

function type_fields(typ: CrochetType) {
  return typ.fields.map((name, i) => {
    const constraint = typ.types[i];
    return {
      name,
      constraint: type_constraint_name(constraint),
    };
  });
}

function full_type_name(typ: CrochetType) {
  return `${typ.module?.pkg.name ?? "crochet.core"}/${typ.name}`;
}

function full_static_type_name(typ: CrochetType) {
  return `${typ.module?.pkg.name ?? "crochet.core"}/#${typ.name}`;
}

function full_trait_name(trait: CrochetTrait) {
  return `${trait.module?.pkg.name ?? "crochet.core"}/${trait.name}`;
}
