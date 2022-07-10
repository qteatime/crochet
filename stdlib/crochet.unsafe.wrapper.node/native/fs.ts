import type { ForeignInterface } from "../../../build/crochet";
import * as FS from "fs/promises";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("fs.read-file", function* (path0, encoding0) {
    const path = ffi.text_to_string(path0);
    const encoding = ffi.text_to_string(encoding0) as BufferEncoding;
    const result = yield ffi.await(
      FS.readFile(path, { encoding }).then((x) => ffi.text(x))
    );
    return result;
  });
};
