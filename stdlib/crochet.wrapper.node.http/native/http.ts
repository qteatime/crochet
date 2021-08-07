import type { CrochetValue, ForeignInterface } from "../../../build/crochet";
import * as Http from "http";

export default (ffi: ForeignInterface) => {
  function to_dict(map: Map<string, CrochetValue>) {
    const result = Object.create(null);
    for (const [k, v] of map.entries()) {
      result[k] = ffi.text_to_string(v);
    }
    return result;
  }

  function from_dict(x: Object) {
    const result = new Map<string, unknown>();
    for (const [k, v] of Object.entries(x)) {
      result.set(k, v);
    }
    return result;
  }

  function make_options(map: Map<string, CrochetValue>) {
    function maybe_set(key: string, transform: (_: CrochetValue) => any) {
      const value = map.get(key);
      if (value != null) {
        options[key] = transform(value);
      }
    }

    const options = Object.create(null);
    maybe_set("auth", (x) => ffi.text_to_string(x));
    maybe_set("headers", (x) => to_dict(ffi.record_to_map(x)));
    maybe_set("method", (x) => ffi.text_to_string(x));
    maybe_set("timeout", (x) => Number(ffi.integer_to_bigint(x)));

    return options;
  }

  async function request(
    url: string,
    data: string,
    options: any
  ): Promise<CrochetValue> {
    return new Promise<CrochetValue>((resolve, reject) => {
      if (data != "") {
        options.headers["Content-Length"] = Buffer.byteLength(data);
      }
      const req = Http.request(url, options, (res) => {
        const result = new Map<string, CrochetValue>();
        result.set("status-code", ffi.integer(BigInt(res.statusCode!)));
        result.set("headers", ffi.from_plain_native(from_dict(res.headers)));

        res.setEncoding("utf8");
        const chunks: string[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          result.set("body", ffi.text(chunks.join("")));
          resolve(
            ffi.record(
              new Map([
                ["success", ffi.boolean(true)],
                ["response", ffi.record(result)],
              ])
            )
          );
        });
      });
      req.on("error", (error) => {
        resolve(
          ffi.record(
            new Map([
              ["success", ffi.boolean(false)],
              ["message", ffi.text(error.message ?? "")],
            ])
          )
        );
      });
      if (data != "") {
        req.write(data);
      }
      req.end();
    });
  }

  ffi.defmachine("http.request", function* (url0, data0, options0) {
    const url = ffi.text_to_string(url0);
    const data = ffi.text_to_string(data0);
    const options = make_options(ffi.record_to_map(options0));
    const result = yield ffi.await(request(url, data, options));
    return result;
  });
};
