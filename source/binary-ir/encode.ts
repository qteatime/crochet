import { Hash } from "crypto";
import {
  CrochetModule,
  IR,
  TreeType,
  TreeTypeTag,
  TTMany,
  TTOne,
} from "../runtime";
import { DeclarationTag, Interval, Metadata } from "../runtime/ir";
import { force_cast, unreachable } from "../utils";
import { BinaryWriter, BinSpec } from "./binary";
import { hash_file } from "./hash";

interface Context {
  source: string;
}

enum Section {
  DECLARATION = 1,
  SOURCE_INFO = 2,
}

export class CrochetIREncoder {
  private meta2id = new Map<Metadata, number>();
  private id2meta = new Map<number, Metadata>();
  private next_id = 0;

  constructor(
    readonly declarations: IR.Declaration[],
    readonly context: Context
  ) {}

  register_meta(m: Metadata) {
    if (m instanceof Interval) {
      const old = this.meta2id.get(m);
      if (old != null) {
        return old;
      } else {
        const id = this.next_id++;
        this.id2meta.set(id, m);
        this.meta2id.set(m, id);
        return id;
      }
    } else {
      return 0;
    }
  }

  encode(w: BinaryWriter) {
    w.text("CROC");
    w.uint16(1);
    w.bytes(hash_file(this.context.source));

    this.encode_declarations(w);
  }

  private encode_declarations(w: BinaryWriter) {
    w.uint8(Section.DECLARATION);
    for (const x of this.declarations) {
      this.encode_declaration(w, x);
    }
  }

  private encode_declaration(w: BinaryWriter, x: IR.Declaration) {
    w.uint8(x.tag);

    switch (x.tag) {
      case DeclarationTag.RELATION: {
        force_cast<IR.DRelation>(x);
        this.encode_position(w, x.position);
        w.string(x.name);
        this.encode_tree_type(w, x.type);
        break;
      }

      case DeclarationTag.PREDICATE: {
        throw new Error(`FIXME`);
      }

      case DeclarationTag.DO: {
        force_cast<IR.DDo>(x);
        this.encode_position(w, x.position);
      }

      default:
        throw unreachable(x.tag, "Declaration");
    }
  }

  private encode_position(w: BinaryWriter, p: Metadata) {
    const id = this.register_meta(p);
    w.uint32(id);
  }

  private encode_tree_type(w: BinaryWriter, x: TreeType) {
    w.uint8(x.tag);
    switch (x.tag) {
      case TreeTypeTag.ONE: {
        force_cast<TTOne>(x);
        this.encode_tree_type(w, x.next);
        break;
      }

      case TreeTypeTag.MANY: {
        force_cast<TTMany>(x);
        this.encode_tree_type(w, x.next);
        break;
      }

      case TreeTypeTag.END: {
        break;
      }

      default:
        throw unreachable(x.tag, "TreeType");
    }
  }
}

// export function section_declaration(xs: IR.Declaration[], context: Context) {
//   return BinSpec.uint8(Section.DECLARATION).list(
//     xs.map((x) => encode_declaration(x, context))
//   );
// }
//
// export function section_source_info(xs: IR.Declaration[], context: Context) {
//   return BinSpec.uint8(Section.SOURCE_INFO).string(context.source);
// }
