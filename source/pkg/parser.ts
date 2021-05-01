import {
  capabilities,
  capability,
  Capability,
  dependency,
  file,
  Package,
  pkg,
  target_any,
  target_node,
  target_web,
} from "./ir";
import {
  anyOf,
  AnySpec,
  array,
  equal,
  map_spec,
  optional,
  spec,
  string,
} from "../utils/spec";
import * as Spec from "../utils/spec";

function set<T>(x: AnySpec<T>) {
  return map_spec(array(x), (xs) => new Set(xs));
}

export const target_spec = anyOf([
  map_spec(equal("*"), () => target_any()),
  map_spec(equal("node"), () => target_node()),
  map_spec(equal("browser"), () => target_web()),
]);

export const file_spec = anyOf([
  map_spec(string, (x) => file({ filename: x, target: target_any() })),
  spec(
    {
      filename: string,
      target: target_spec,
    },
    (x) => file(x)
  ),
]);

export const capability_spec = map_spec(string, capability);

export const capabilities_spec = spec(
  {
    requires: set(capability_spec),
    provides: set(capability_spec),
  },
  (x) => capabilities(x)
);

export const dependency_spec = anyOf([
  map_spec(string, (x) =>
    dependency({
      name: x,
      capabilities: new Set<Capability>(),
      target: target_any(),
    })
  ),
  spec(
    {
      name: string,
      capabilities: optional(set(capability_spec), new Set<Capability>()),
      target: optional(target_spec, target_any()),
    },
    (x) => dependency(x)
  ),
]);

export const package_spec = spec(
  {
    name: string,
    target: optional(target_spec, target_any()),
    sources: array(file_spec),
    native_sources: optional(array(file_spec), []),
    dependencies: optional(array(dependency_spec), []),
    capabilities: optional(
      capabilities_spec,
      capabilities({
        requires: new Set<Capability>(),
        provides: new Set<Capability>(),
      })
    ),
  },
  (x) => (filename: string) => pkg(filename, x)
);

export function parse(x: unknown, filename: string): Package {
  const result = Spec.try_parse(x, package_spec);
  if (result instanceof Spec.Ok) {
    return result.value(filename);
  } else {
    throw new Error(
      `Could not read the package at ${filename}:\n  - ${result.reason.format()}`
    );
  }
}
