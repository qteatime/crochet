export function unreachable(x: never, message: string) {
  console.error(message, x);
  throw new Error(message);
}
