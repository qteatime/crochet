import { CrochetModule, CrochetType } from "../intrinsics";

export function module_location(x: CrochetModule) {
  return `module ${x.filename} in ${x.pkg.name}`;
}

export function type_name(x: CrochetType) {
  if (x.module != null) {
    return `${x.name} (from ${x.module.pkg})`;
  } else {
    return x.name;
  }
}
