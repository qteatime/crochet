import {
  box,
  CrochetUnknown,
  ForeignInterface,
  from_string,
  get_array,
  get_map,
  get_string,
  unbox_typed,
} from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

type ListFormatPart =
  | { type: "element"; value: string }
  | { type: "literal"; value: string };

type ListFormat = {
  format(list: string[]): string;
  formatToParts(list: string[]): ListFormatPart[];
};

type IntlE = typeof globalThis.Intl & {
  ListFormat: {
    new (
      locales: any,
      options: { localeMatcher: string; type: string; style: string }
    ): ListFormat;
  };
  Locale: {
    new (tag: string): unknown;
  };
};

declare var Intl: IntlE;

export function intl_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.text.internationalisation:intl")
    .defun1("make-locale", (tag) => {
      return box(new Intl.Locale(get_string(tag)));
    })
    .defun1("make-list-formatter", (locale, matcher, type, style) => {
      const formatter = new Intl.ListFormat(get_string(locale), {
        localeMatcher: get_string(matcher),
        type: get_string(type),
        style: get_string(style),
      });
      return box(formatter);
    })
    .defun1("format-list", (formatter0, list) => {
      const formatter = unbox_typed(Intl.ListFormat, formatter0);
      const items = get_array(list).map((x) => get_string(x));
      return from_string(formatter.format(items));
    });
}

export default [intl_ffi];
