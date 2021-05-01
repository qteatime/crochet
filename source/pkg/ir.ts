export type PackageMeta = {
  readonly name: string;
  readonly target: Target;
  readonly sources: File[];
  readonly native_sources: File[];
  readonly dependencies: Dependency[];
  readonly capabilities: Capabilities;
};
export type Package = {
  readonly filename: string;
  readonly meta: PackageMeta;
};

export enum TargetTag {
  ANY,
  NODE,
  WEB,
}

export type Target = TargetAny | TargetNode | TargetWeb;

export type TargetAny = {
  readonly tag: TargetTag.ANY;
};
export type TargetNode = {
  readonly tag: TargetTag.NODE;
};
export type TargetWeb = {
  readonly tag: TargetTag.WEB;
};

export type Dependency = {
  readonly name: string;
  readonly capabilities: Set<Capability>;
  readonly target: Target;
};

export type File = {
  readonly filename: string;
  readonly target: Target;
};

export type Capabilities = {
  readonly requires: Set<Capability>;
  readonly provides: Set<Capability>;
};

export type Capability = string;

export function pkg(filename: string, meta: PackageMeta): Package {
  return { filename, meta };
}

export function file(x: File): File {
  return x;
}

export function target_any(): TargetAny {
  return { tag: TargetTag.ANY };
}
export function target_node(): TargetNode {
  return { tag: TargetTag.NODE };
}
export function target_web(): TargetWeb {
  return { tag: TargetTag.WEB };
}

export function dependency(x: Dependency): Dependency {
  return x;
}

export function capability(x: Capability): Capability {
  return x;
}

export function capabilities(x: Capabilities): Capabilities {
  return x;
}
