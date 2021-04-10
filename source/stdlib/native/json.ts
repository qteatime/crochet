import {
  CrochetInteger,
  CrochetText,
  CrochetValue,
  ForeignInterface,
  json_to_crochet,
} from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

export function json_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.formats.json:json")
    .defun("parse", [CrochetText, CrochetValue], (text) => {
      return json_to_crochet(JSON.parse(text.value));
    })
    .defun("serialise", [CrochetValue], (value) => {
      return new CrochetText(JSON.stringify(value.to_json()));
    })
    .defun("pretty-print", [CrochetValue, CrochetInteger], (value, indent) => {
      return new CrochetText(
        JSON.stringify(value.to_json(), null, Number(indent.value))
      );
    });
}

export default [json_ffi];
