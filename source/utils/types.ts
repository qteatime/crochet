export type Union<Ts> = Ts extends [infer T]
  ? T
  : Ts extends [infer T, ...infer Rs]
  ? T | Union<Rs>
  : never;

export type AnyClass = {
  new (...args: any[]): any;
};
