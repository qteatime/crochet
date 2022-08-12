const builtins = [
  "assert",
  "assert/strict",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "crypto",
  "dns",
  "events",
  "fs",
  "fs/promises",
  "http",
  "http2",
  "https",
  "inspector",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "dgram",
  "url",
  "util",
  "vm",
  "wasi",
  "node:stream/web",
  "worker_threads",
  "zlib",
];

export function make_restricted_require(root: string) {
  const all = new Set(builtins);
  return (id: string) => {
    if (all.has(id)) {
      return require(id);
    } else {
      throw new Error(`Loading ${id} from ${root} is not allowed.`);
    }
  };
}
