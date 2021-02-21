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
} from "../generated/crochet-grammar";
import * as rt from "../runtime";
import { CrochetType } from "../runtime";
import * as IR from "../runtime/ir";
import * as Logic from "../runtime/logic";

// -- Utilities
function parseInteger(x: string): bigint {
  return BigInt(x.replace(/_/g, ""));
}

export function typeFromName(x: string): CrochetType {
  switch (x) {
    case "true":
      return rt.True;
    case "false":
      return rt.False;
    case "integer":
      return rt.CrochetInteger;
    case "text":
      return rt.CrochetText;
    case "record":
      return rt.CrochetRecord;
    case "stream":
      return rt.CrochetStream;
    default: {
      throw new Error(`Unknown native type ${x}`);
    }
  }
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

export function compilePattern(p: Pattern) {
  return p.match<Logic.Pattern>({
    Lit(lit) {
      return new Logic.ValuePattern(literalToValue(lit));
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
    Variable(_, name) {
      return new IR.EVariable(name.name);
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
    Return(_, value) {
      return new IR.SReturn(compileExpression(value));
    },
    Expr(value) {
      return new IR.SExpression(compileExpression(value));
    },
  });
}

// -- Declaration

export function compileTypeApp(x: TypeApp): rt.DispatchType {
  return x.match<rt.DispatchType>({
    Named(_, name) {
      return new rt.DTTyped(typeFromName(name.name));
    },

    Parens(_, type) {
      return compileTypeApp(type);
    },

    Union(_, l, r) {
      return new rt.DTUnion(
        [compileTypeApp(l), compileTypeApp(r)].flatMap((x) => {
          if (x instanceof rt.DTUnion) {
            return x.types;
          } else {
            return [x];
          }
        })
      );
    },
  });
}

export function compileParameter(x: Parameter) {
  return x.match<{ type: rt.DispatchType; parameter: string }>({
    Typed(_, name, type) {
      return {
        type: compileTypeApp(type),
        parameter: name.name,
      };
    },

    Untyped(_, name) {
      return {
        type: new rt.DTAny(),
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

export function compileDeclaration(d: Declaration) {
  return d.match<IR.Declaration>({
    Do(_, body) {
      return new IR.DDo(body.map(compileStatement));
    },

    Predicate(_, sig, clauses) {
      const name = signatureName(sig);
      const params = signatureValues(sig).map((x) => x.name);
      const procedure = new Logic.PredicateProcedure(
        name,
        params,
        clauses.map(compilePredicateClause)
      );
      return new IR.DPredicate(name, procedure);
    },

    Relation(_, sig) {
      const types = signatureValues(sig);
      return new IR.DRelation(signatureName(sig), compileRelationTypes(types));
    },

    ForeignCommand(meta, sig, foreign_name, args0) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      const args = args0.map((x) => parameters.indexOf(x.name));
      return new IR.DForeignCommand(
        name,
        types,
        compileNamespace(foreign_name),
        args
      );
    },

    Command(meta, sig, body) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      return new IR.DCrochetCommand(
        name,
        parameters,
        types,
        body.map(compileStatement)
      );
    },
  });
}

export function compileProgram(p: Program) {
  return p.declarations.map(compileDeclaration);
}
