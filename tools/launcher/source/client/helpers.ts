export function parse_query(query: string) {
  const pairs = query.replace(/^\?/, "").split("&");
  const result = new Map<string, string>();
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    result.set(decodeURIComponent(key), decodeURIComponent(value));
  }
  return result;
}
