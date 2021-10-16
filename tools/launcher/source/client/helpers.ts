export function parse_query(query: string) {
  const pairs = query.replace(/^\?/, "").split("&");
  const result = new Map<string, string>();
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    result.set(decodeURIComponent(key), decodeURIComponent(value));
  }
  return result;
}

export type Deferred<T> = {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: Promise<T>;
};

export function defer<T>() {
  const deferred: Deferred<T> = Object.create(null);
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
