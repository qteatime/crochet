import {
  Namespace,
  Signature,
  String as CString,
  PartialSignature,
  Name,
} from "../generated/crochet-grammar";

// -- Utilities
export function parseInteger(x: string): bigint {
  return BigInt(x.replace(/_/g, ""));
}

export function parseNumber(x: string): number {
  return Number(x.replace(/_/g, ""));
}

export function parseString(x: CString): string {
  const column = x.pos.position.column + 1;
  const indent = new RegExp(`(\r\n|\r|\n)[ \t]{0,${column}}`, "g");
  const text = x.text
    .replace(indent, (_, newline) => {
      return newline;
    })
    .replace(/^[ \t]*(\r\n|\r|\n)/g, (_, nl) => "")
    .replace(/(\r\n|\r|\n)[ \t]*$/g, (_, nl) => "")
    .replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, e) => {
      return resolve_escape(e);
    });

  return text.replace(/^"|"$/g, "");
}

export function resolve_escape(escape: string) {
  if (escape.length === 1) {
    switch (escape) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      default:
        return escape;
    }
  } else if (escape.startsWith("u") && escape.length === 5) {
    return String.fromCodePoint(Number("0x" + escape.slice(1)));
  } else if (escape.startsWith("x") && escape.length === 3) {
    return String.fromCharCode(Number("0x" + escape.slice(1)));
  } else {
    throw new Error(`Invalid escape sequence \\${escape}`);
  }
}

export function signatureName(sig: Signature<any>): string {
  return sig.match({
    Keyword(_meta, _self, pairs) {
      const names = pairs.map((x) => x.key.name + " _");
      return `_ ${names.join(" ")}`;
    },

    KeywordSelfless(_meta, pairs) {
      const names = pairs.map((x) => x.key.name + " _");
      return names.join(" ");
    },

    Unary(_meta, _self, name) {
      return `_ ${name.name}`;
    },

    Binary(_meta, op, _l, _r) {
      return `_ ${op.name} _`;
    },
  });
}

export function signatureValues<T>(sig: Signature<T>): T[] {
  return sig.match({
    Keyword(_meta, self, pairs) {
      return [self, ...pairs.map((x) => x.value)];
    },

    KeywordSelfless(_meta, pairs) {
      return pairs.map((x) => x.value);
    },

    Unary(_meta, self, _name) {
      return [self];
    },

    Binary(_meta, _op, l, r) {
      return [l, r];
    },
  });
}

export function materialiseSignature<T>(
  self: T,
  signature: PartialSignature<T>
): Signature<T> {
  return signature.match<Signature<T>>({
    Unary(meta, name) {
      return new Signature.Unary(meta, self, name);
    },

    Binary(meta, op, right) {
      return new Signature.Binary(meta, op, self, right);
    },

    Keyword(meta, pairs) {
      return new Signature.Keyword(meta, self, pairs);
    },
  });
}

export function compileNamespace(x: Namespace) {
  return x.names.join(".");
}
export function compileRepl(x: any): any {
  throw new Error(`to be removed`);
}

export function compileProgram(p: any): any {
  throw new Error(`to be removed`);
}

export function handlerName(name: Name, sig: Signature<unknown> | null) {
  if (sig == null) {
    return name.name;
  } else {
    return `${name.name} ${signatureName(sig)}`;
  }
}

export function handlerArgs<T>(sig: Signature<T> | null): T[] {
  return sig == null ? [] : signatureValues(sig);
}
