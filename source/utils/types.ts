export type Union<Ts> =
  Ts extends [infer T, ...infer Rs] ? T | Union<Rs>
: Ts extends [infer T] ? T
: never;

