export function byte_equals(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) {
    return false;
  }
  for (const [x, y] of zip(a, b)) {
    if (x !== y) {
      return false;
    }
  }
  return true;
}

export function* enumerate<A>(xs: Iterable<A>) {
  let index = 0;
  for (const x of xs) {
    yield [index, x] as const;
    index += 1;
  }
}

export function* iterator<A>(x: Iterable<A>) {
  yield* x;
}

export function* zip<A, B>(a0: Iterable<A>, b0: Iterable<B>) {
  const a = iterator(a0);
  const b = iterator(b0);
  while (true) {
    const va = a.next();
    const vb = b.next();
    if (va.done && vb.done) {
      break;
    }
    if (!va.done && !vb.done) {
      yield [va.value, vb.value] as const;
      continue;
    }
    throw new Error(`Mismatched iterable lengths`);
  }
}

export function bytes_to_hex(x: Uint8Array) {
  return Array.from(x)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join(" ");
}

export function unreachable(x: never, message: string) {
  throw new Error(`Unhandled case: ${x} (${message})`);
}
