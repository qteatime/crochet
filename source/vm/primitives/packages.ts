import { ErrArbitrary } from "../errors";
import { CrochetPackage, Universe } from "../intrinsics";

export function is_open_allowed(pkg: CrochetPackage, namespace: string) {
  return pkg.dependencies.has(namespace);
}

export function assert_open_allowed(pkg: CrochetPackage, namespace: string) {
  if (!is_open_allowed(pkg, namespace)) {
    throw new ErrArbitrary(
      "no-open-capability",
      `Cannot open name ${namespace} from ${pkg.name} because it's not declared as a dependency`
    );
  }
}
