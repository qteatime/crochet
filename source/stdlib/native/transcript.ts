import {
  CrochetText,
  CrochetValue,
  False,
  foreign,
  foreign_namespace,
  machine,
} from "../../runtime";
import { cast, logger } from "../../utils";

@foreign_namespace("crochet.transcript:transcript")
export class TranscriptFfi {
  static buffer: string[] = [];

  @foreign("flush")
  @machine()
  static flush(self: CrochetValue) {
    if (TranscriptFfi.buffer.length === 0) {
      logger.debug(`Flushing transcript with empty buffer`);
    } else {
      console.log(TranscriptFfi.buffer.join(""));
      TranscriptFfi.buffer = [];
    }
    return self;
  }

  @foreign("write")
  @machine()
  static write(self: CrochetValue, value: CrochetValue) {
    const text = cast(value, CrochetText);
    TranscriptFfi.buffer.push(text.value);
    return self;
  }

  @foreign("write-inspect")
  @machine()
  static inspect(self: CrochetValue, value: CrochetValue) {
    TranscriptFfi.buffer.push(value.to_text());
    return self;
  }
}

export default [TranscriptFfi];
