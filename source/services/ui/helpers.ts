export function classes(
  ...xs: (string | (string | null | undefined)[] | null | undefined)[]
): string {
  return xs
    .flatMap((x) => (Array.isArray(x) ? [classes(...x)] : x != null ? [x] : []))
    .join(" ");
}
