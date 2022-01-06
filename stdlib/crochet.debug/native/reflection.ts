import type { ForeignInterface } from "../../../build/crochet";
import type {
  CrochetCommandBranch,
  CrochetTypeConstraint,
  CrochetValue,
} from "../../../build/vm";

export default (ffi: ForeignInterface) => {
  function get_branch(x: CrochetValue): CrochetCommandBranch {
    return ffi.unbox(x) as CrochetCommandBranch;
  }

  function get_constraint(x: CrochetValue): CrochetTypeConstraint {
    return ffi.unbox(x) as CrochetTypeConstraint;
  }

  ffi.defun("reflection.branch-name", (b) => {
    const branch = get_branch(b);
    return ffi.text(branch.name);
  });

  ffi.defun("reflection.branch-parameters", (b) => {
    const branch = get_branch(b);
    const params = branch.parameters.map((p, i) => {
      return ffi.record(
        new Map([
          ["name", ffi.text(p)],
          ["constraint", ffi.box(branch.types[i])],
        ])
      );
    });
    return ffi.list(params);
  });

  ffi.defun("reflection.constraint-accepts", (c, t) => {
    const constraint = get_constraint(c);
    const type = ffi.static_type_to_type(ffi.get_type(t));
    if (type == null) {
      throw ffi.panic("internal", `No static-type -> type mapping available`);
    }
    const stype = ffi.get_type(t);
    const ok =
      ffi.is_subtype(type, constraint.type) ||
      ffi.is_subtype(stype, constraint.type);
    return ffi.boolean(ok);
  });
};
