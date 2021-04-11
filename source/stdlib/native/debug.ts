import {
  CrochetText,
  CrochetValue,
  ForeignInterface,
  _push,
} from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

export function debug_transcript(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.debug:transcript")
    .defun("write", [CrochetValue, CrochetText], (self, text) => {
      console.log(text.value);
      return self;
    })
    .defun("write-inspect", [CrochetValue, CrochetValue], (self, value) => {
      console.log(value.to_text());
      return value;
    });
}

export default [debug_transcript];
