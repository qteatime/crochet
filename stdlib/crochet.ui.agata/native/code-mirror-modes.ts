import type { ForeignInterface, CrochetValue } from "../../../build/crochet";
import type * as CM from "codemirror";

declare var CodeMirror: typeof CM & {
  defineSimpleMode(mode: string, definition: {}): void;
};

export default (ffi: ForeignInterface) => {
  const crochet_common = [
    {
      regex:
        /(?<![a-zA-Z0-9\-\.\^'])(relation|predicate|when|do|command|action|type|enum|define|singleton|goto|call|let|return|fact|forget|new|search|if|simulate|true|false|not|and|or|is|self|as|event|quiescence|for|until|in|foreign|on|always|match|then|else|condition|end|with|prelude|rank|tags|abstract|lazy|force|context|sample|of|open|local|test|assert|requires|ensures|nothing|handle|effect|continue|perform|has|trait|implement|public|capability|protect|global|otherwise|handler|default|use|alias)(?![a-zA-Z0-9\-:])/,
      token: "keyword",
    },
    {
      regex: /(?<![a-zA-Z0-9\-])(true|false)(?![a-zA-Z0-9_])/,
      token: "builtin",
    },
    { regex: /(?<![a-zA-Z0-9\-])[\-\+]?[0-9][0-9_]*/, token: "number" },
    {
      regex:
        /(?<![a-zA-Z0-9\-])[\-\+]?[0-9][0-9_]*(\.[0-9][0-9_]*)?([eE][\-\+]?[0-9][0-9_]*)?/,
      token: "number",
    },
    {
      regex: /(?<![a-zA-Z0-9\-])([a-z\-][a-zA-Z0-9\-]*:)/,
      token: "variable-2",
    },
    { regex: /(?<![a-zA-Z0-9\-])[A-Z][a-zA-Z0-9\-]*|_/, token: "variable" },
    { regex: /\/\/.*/, token: "comment" },
    { regex: /"/, token: "string", next: "string" },
    { regex: /[\(\)\[\]\{\};,]/, token: "punctuation" },
  ];

  CodeMirror.defineSimpleMode("crochet", {
    start: [{ regex: /^%[ \t]*crochet/, token: "comment" }, ...crochet_common],
    string: [
      { regex: /\[/, token: "string", push: "interpolation" },
      { regex: /"/, token: "string", next: "start" },
      { regex: /[^\\["\\]+/, token: "string" },
      {
        regex: /\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|u\{[0-9A-Fa-f]+\}|.|$)/,
        token: "string-2",
      },
      { regex: /./, token: "error" },
    ],
    interpolation: [
      { regex: /\]/, token: "string", pop: true },
      ...crochet_common,
    ],
  });
};
