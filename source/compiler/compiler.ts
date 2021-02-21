import {
  Constraint,
  Declaration,
  Expression,
  Literal,
  Namespace,
  Parameter,
  Pattern,
  Predicate,
  PredicateClause,
  PredicateEffect,
  PredicateRelation,
  Program,
  RelationPart,
  Signature,
  Statement,
  TypeApp,
  TypeDef,
} from "../generated/crochet-grammar";
import * as rt from "../runtime";
import { CrochetType } from "../runtime";
import * as IR from "../runtime/ir";
import * as Logic from "../runtime/logic";
import { cast } from "../utils/utils";

// -- Utilities
function parseInteger(x: string): bigint {
  return BigInt(x.replace(/_/g, ""));
}

export function literalToValue(lit: Literal) {
  return lit.match<rt.CrochetValue>({
    False(_) {
      return rt.bfalse;
    },

    True(_) {
      return rt.btrue;
    },

    Text(_, value) {
      return new rt.CrochetText(JSON.parse(value));
    },

    Integer(_, digits) {
      return new rt.CrochetInteger(parseInteger(digits));
    },
  });
}

export function signatureName(sig: Signature<any>): string {
  return sig.match({
    Keyword(_meta, _self, pairs) {
      const names = pairs.map((x) => x.key.name);
      return `_ ${names.join("")}`;
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

    Unary(_meta, self, _name) {
      return [self];
    },

    Binary(_meta, _op, l, r) {
      return [l, r];
    },
  });
}

export function compileNamespace(x: Namespace) {
  return x.names.map((x) => x.name).join(".");
}

// -- Logic
export function compileRelationTypes(types: RelationPart[]): Logic.TreeType {
  return types.reduceRight((p, t) => {
    return t.match<Logic.TreeType>({
      Many(_meta, _name) {
        return new Logic.TTMany(p);
      },

      One(_meta, _name) {
        return new Logic.TTOne(p);
      },
    });
  }, new Logic.TTEnd() as Logic.TreeType);
}

export function compilePattern(p: Pattern): Logic.Pattern {
  return p.match<Logic.Pattern>({
    HasRole(_, type, name) {
      return new Logic.RolePattern(compilePattern(name), type.name);
    },

    HasType(_, type, name) {
      return new Logic.TypePattern(compilePattern(name), compileTypeApp(type));
    },

    Variant(_, type, variant) {
      return new Logic.VariantPattern(type.name, variant.name);
    },

    Lit(lit) {
      return new Logic.ValuePattern(literalToValue(lit));
    },

    Global(_, name) {
      return new Logic.GlobalPattern(name.name);
    },

    Variable(_, name) {
      return new Logic.VariablePattern(name.name);
    },

    Wildcard(_) {
      return new Logic.WildcardPattern();
    },
  });
}

export function compilePredicateRelation(r: PredicateRelation) {
  return r.match<Logic.Relation>({
    Has(_, sig) {
      return new Logic.Relation(
        signatureName(sig),
        signatureValues(sig).map(compilePattern)
      );
    },

    Not(_, sig) {
      // TODO:
      throw new Error(`todo`);
    },
  });
}

export function compileConstraint(c: Constraint): Logic.Constraint.Constraint {
  return c.match<Logic.Constraint.Constraint>({
    And(_, l, r) {
      return new Logic.Constraint.And(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Not(_, c) {
      return new Logic.Constraint.Not(compileConstraint(c));
    },

    Or(_, l, r) {
      return new Logic.Constraint.Or(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Equal(_, l, r) {
      return new Logic.Constraint.Equals(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Variable(_, name) {
      return new Logic.Constraint.Variable(name.name);
    },

    Lit(l) {
      return new Logic.Constraint.Value(literalToValue(l));
    },

    Parens(_, c) {
      return compileConstraint(c);
    },
  });
}

export function compilePredicateEffect(eff: PredicateEffect) {
  return eff.match({
    Trivial() {
      return new Logic.Effect.Trivial();
    },
  });
}

export function compilePredicate(p: Predicate) {
  return new Logic.Predicate(
    p.relations.map(compilePredicateRelation),
    compileConstraint(p.constraint)
  );
}

export function compilePredicateClause(p: PredicateClause) {
  return new Logic.PredicateClause(
    compilePredicate(p.predicate),
    compilePredicateEffect(p.effect)
  );
}

// -- Expression
export function literalToExpression(lit: Literal) {
  return lit.match<IR.Expression>({
    False(_) {
      return new IR.EFalse();
    },

    True(_) {
      return new IR.ETrue();
    },

    Text(_, value) {
      return new IR.EText(JSON.parse(value));
    },

    Integer(_, digits) {
      return new IR.EInteger(parseInteger(digits));
    },
  });
}

export function compileExpression(expr: Expression): IR.Expression {
  return expr.match<IR.Expression>({
    Search(_, pred) {
      return new IR.ESearch(compilePredicate(pred));
    },

    Invoke(_, sig) {
      const name = signatureName(sig);
      const args = signatureValues(sig).map(compileExpression);
      return new IR.EInvoke(name, args);
    },

    Variable(_, name) {
      return new IR.EVariable(name.name);
    },

    Global(_, name) {
      return new IR.EGlobal(name.name);
    },

    Self(_) {
      return new IR.ESelf();
    },

    New(_, type) {
      return new IR.ENew(type.name);
    },

    NewVariant(_, type, variant) {
      return new IR.ENewVariant(type.name, variant.name);
    },

    Parens(_, value) {
      return compileExpression(value);
    },

    Lit(lit) {
      return literalToExpression(lit);
    },
  });
}

// -- Statement
export function compileStatement(stmt: Statement) {
  return stmt.match<IR.Statement>({
    Let(_, name, value) {
      return new IR.SLet(name.name, compileExpression(value));
    },

    Fact(_, sig) {
      return new IR.SFact(
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Forget(_, sig) {
      return new IR.SForget(
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Expr(value) {
      return new IR.SExpression(compileExpression(value));
    },
  });
}

// -- Declaration
export function compileTypeApp(x: TypeApp): IR.Type {
  return x.match<IR.Type>({
    Named(_, name) {
      return new IR.TNamed(name.name);
    },

    Parens(_, type) {
      return compileTypeApp(type);
    },

    Union(_, l, r) {
      return new IR.TUnion(compileTypeApp(l), compileTypeApp(r));
    },
  });
}

export function compileParameter(x: Parameter) {
  return x.match<{ type: IR.Type; parameter: string }>({
    Typed(_, name, type) {
      return {
        type: compileTypeApp(type),
        parameter: name.name,
      };
    },

    TypedOnly(_, type) {
      return {
        type: compileTypeApp(type),
        parameter: "_",
      };
    },

    Untyped(_, name) {
      return {
        type: new IR.TAny(),
        parameter: name.name,
      };
    },
  });
}

export function compileParameters(xs0: Parameter[]) {
  const xs = xs0.map(compileParameter);
  return {
    types: xs.map((x) => x.type),
    parameters: xs.map((x) => x.parameter),
  };
}

export function compileTypeDef(t: TypeDef) {
  return new IR.DType(
    t.name.name,
    t.roles.map((x) => x.name)
  );
}

export function compileDeclaration(d: Declaration): IR.Declaration[] {
  return d.match<IR.Declaration[]>({
    Do(_, body) {
      return [new IR.DDo(body.map(compileStatement))];
    },

    Predicate(_, sig, clauses) {
      const name = signatureName(sig);
      const params = signatureValues(sig).map((x) => x.name);
      const procedure = new Logic.PredicateProcedure(
        name,
        params,
        clauses.map(compilePredicateClause)
      );
      return [new IR.DPredicate(name, procedure)];
    },

    Relation(_, sig) {
      const types = signatureValues(sig);
      return [
        new IR.DRelation(signatureName(sig), compileRelationTypes(types)),
      ];
    },

    ForeignCommand(meta, sig, foreign_name, args0) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      const args = args0.map((x) => parameters.indexOf(x.name));
      return [
        new IR.DForeignCommand(
          name,
          types,
          compileNamespace(foreign_name),
          args
        ),
      ];
    },

    Command(meta, sig, body) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      return [
        new IR.DCrochetCommand(
          name,
          parameters,
          types,
          body.map(compileStatement)
        ),
      ];
    },

    Role(_, name) {
      return [new IR.DRole(name.name)];
    },

    // FIXME: make sure no further possible instantiations of this type exist
    SingletonType(_, type0) {
      const type = compileTypeDef(type0);
      return [
        new IR.DType(type.name, type.roles),
        new IR.DDefine(type.name, new IR.ENew(type.name)),
      ];
    },

    Type(_, t) {
      return [compileTypeDef(t)];
    },

    Enum(_, name, variants) {
      return [
        new IR.DEnum(
          name.name,
          variants.map((x) => ({
            name: x.name.name,
            roles: x.roles.map((z) => z.name),
          }))
        ),
      ];
    },

    Define(_, name, value) {
      return [new IR.DDefine(name.name, compileExpression(value))];
    },
  });
}

export function compileProgram(p: Program) {
  return p.declarations.flatMap(compileDeclaration);
}
