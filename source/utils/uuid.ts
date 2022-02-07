export function random_uuid(): string {
  if (typeof window != "undefined") {
    return (crypto as any).randomUUID();
  } else {
    const crypto = "crypto";
    return require(crypto).randomUUID();
  }
}
