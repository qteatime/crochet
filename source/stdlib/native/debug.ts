import {
  CrochetText,
  CrochetValue,
  ForeignInterface,
  _push,
} from "../../runtime";
import { logger } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function debug_transcript(ffi: ForeignInterface) {
  let buffer: string[] = [];

  new ForeignNamespace(ffi, "crochet.debug:transcript")
    .defun("flush", [CrochetValue], (self) => {
      if (buffer.length === 0) {
        logger.debug(`Flushing transcript with empty buffer`);
      } else {
        console.log(buffer.join(""));
        buffer = [];
      }
      return self;
    })
    .defun("write", [CrochetValue, CrochetText], (self, text) => {
      buffer.push(text.value);
      return self;
    })
    .defun("write-inspect", [CrochetValue, CrochetValue], (self, value) => {
      buffer.push(value.to_text());
      return self;
    });
}

export default [debug_transcript];
