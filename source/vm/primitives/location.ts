import {
  CrochetCommand,
  CrochetCommandBranch,
  CrochetModule,
  CrochetType,
  CrochetValue,
} from "../intrinsics";

export function module_location(x: CrochetModule) {
  return `module ${x.filename} in ${x.pkg.name}`;
}

export function branch_name(x: CrochetCommandBranch) {
  return command_signature(x.name, x.types);
}

export function branch_location(x: CrochetCommandBranch) {
  return module_location(x.module);
}

export function branch_name_location(x: CrochetCommandBranch) {
  return `${branch_name(x)}, from ${branch_location(x)}`;
}

export function command_signature(name: string, types: CrochetType[]) {
  let i = 0;
  return name.replace(/_/g, (_) => `(${type_name(types[i++])})`);
}

export function type_name(x: CrochetType) {
  if (x.module != null) {
    return `${x.name} (from ${x.module.pkg})`;
  } else {
    return x.name;
  }
}

export function simple_value(x: CrochetValue) {
  return "FIXME";
}
