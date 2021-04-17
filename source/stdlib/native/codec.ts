import {
  ForeignInterface,
  from_integer,
  from_string,
  get_integer,
  get_string,
} from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

export function codec_base64(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.codec.basic:base64")
    .defun1("encode", (x) => {
      return from_string(Buffer.from(get_string(x)).toString("base64"));
    })
    .defun1("decode", (x) => {
      return from_string(
        Buffer.from(get_string(x), "base64").toString("utf-8")
      );
    });
}

export function codec_hex(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.codec.basic:hex")
    .defun1("encode", (x) => {
      return from_string(Buffer.from(get_string(x)).toString("hex"));
    })
    .defun1("encode-int", (x) => {
      return from_string(get_integer(x).toString(16));
    })
    .defun1("decode", (x) => {
      return from_string(Buffer.from(get_string(x), "hex").toString("utf-8"));
    })
    .defun1("decode-int", (x) => {
      return from_integer(BigInt(`0x${get_string(x)}`));
    });
}

export default [codec_base64, codec_hex];
