import * as Ohm from 'ohm-js';
export const grammar = Ohm.grammar("Crochet {\n  program =\n    | header declaration* space* end\n\n  declaration =\n    | commandDeclaration\n    | doDeclaration\n    | sceneDeclaration\n    | actorDeclaration\n    | relationDeclaration\n    | actionDeclaration\n    | contextDeclaration\n    \n  doDeclaration =\n    | do_ statementBlock\n\n  sceneDeclaration =\n    | scene_ atom statementBlock\n\n  contextDeclaration =\n    | context_ atom s<\"{\"> hookDeclaration+ s<\"}\">\n\n  hookDeclaration =\n    | when_ predicate statementBlock\n\n  actorDeclaration =\n    | actor_ actorName actorRoles actorInitialisation\n\n  actorRoles =\n    | s<\"::\"> nonemptyListOf<atom, s<\",\">>    -- roles\n    |                                         -- no_roles\n\n  actorInitialisation =\n    | s<\"{\"> actorFact+ s<\"}\">     -- init\n    | \";\"                          -- no_init\n\n  actorFact =\n    | factSignaturePair+ s<\";\">    -- keyword\n    | atom s<\";\">                  -- unary\n\n  relationDeclaration =\n    | relation_ relationSignature s<\";\">\n\n  relationSignature =\n    | relationVariable relationSignaturePair+   -- keyword\n    | relationVariable atom                     -- unary\n\n  relationVariable =\n    | name s<\"*\">  -- many\n    | name         -- one\n\n  relationSignaturePair =\n    | keyword relationVariable\n\n  commandDeclaration =\n    | command_ commandSignature s<\"=\"> atom s<\"(\"> listOf<name, s<\",\">> s<\")\"> s<\";\">  -- ffi\n    | command_ commandSignature statementBlock                                         -- local\n\n  commandSignature =\n    | name infix_symbol name           -- infix\n    | name keywordSignaturePair+       -- self\n    | name atom                        -- unary\n    | keywordSignaturePair+            -- prefix\n    | atom                             -- nullary\n  \n  keywordSignaturePair =\n    | keyword name\n\n  actionDeclaration =\n    | repeatableMark action_ interpolateText<variable> actionTags when_ predicate statementBlock\n\n  repeatableMark =\n    | repeatable_     -- mark\n    |                 -- no_mark\n\n  actionTags =\n    | s<\"::\"> nonemptyListOf<atom, \",\">    -- tagged\n    |                                   -- untagged\n\n  predicate =\n    | nonemptyListOf<searchRelation, s<\",\">> if_ constraint    -- constrained\n    | nonemptyListOf<searchRelation, s<\",\">>                   -- unconstrained\n\n  constraint =\n    | constraint and_ constraint    -- conjunction\n    | constraint or_ constraint     -- disjunction\n    | not_ constraint               -- negate\n    | constraintEq\n\n  constraintEq =\n    | constraintPrimary s<\"===\"> constraintPrimary   -- eq\n    | constraintPrimary s<\"=/=\"> constraintPrimary   -- neq\n    | constraintPrimary s<\">\"> constraintPrimary     -- gt\n    | constraintPrimary s<\">=\"> constraintPrimary    -- gte\n    | constraintPrimary s<\"<\"> constraintPrimary     -- lt\n    | constraintPrimary s<\"<=\"> constraintPrimary    -- lte\n    | constraintPrimary s<\"::\"> atom                 -- role\n    | constraintPrimary\n\n  constraintPrimary =\n    | integer                     -- integer\n    | name                        -- variable\n    | actorName                   -- actor\n    | s<\"(\"> constraint s<\")\">    -- group\n\n  statement =\n    | returnStatement\n    | gotoStatement\n    | letStatement\n    | factStatement\n    | forgetStatement\n    | triggerAction\n    | triggerStatement\n    | expression s<\";\">   -- expr\n\n  triggerAction =\n    | trigger_ action_ s<\";\">\n\n  triggerStatement =\n    | trigger_ atom s<\";\">\n\n  returnStatement =\n    | return_ expression s<\";\">  -- with_value\n    | return_ s<\";\">             -- naked\n\n  gotoStatement =\n    | goto_ atom s<\";\">\n\n  letStatement =\n    | let_ name s<\"=\"> expression s<\";\">\n\n  factStatement =\n    | fact_ factUseSignature s<\";\">\n\n  forgetStatement =\n    | forget_ factUseSignature s<\";\">\n\n  factUseSignature =\n    | primaryExpression factSignaturePair+    -- keyword\n    | primaryExpression atom                  -- unary\n\n  factSignaturePair =\n    | keyword primaryExpression\n\n  statementBlock =\n    | s<\"{\"> statement* s<\"}\">\n\n  expression =\n    | searchExpression\n    | ifExpression\n\n  ifExpression =\n    | if_ invokeInfix then_ expression else_ expression\n\n  searchExpression =\n    | search_ predicate   -- search\n    | invokeInfix\n\n  searchRelation =\n    | not_ searchSignature     -- negated\n    | searchSignature          -- has\n\n  searchSignature =\n    | searchSegment searchSignaturePair+  -- keyword\n    | searchSegment atom                  -- unary\n\n  searchSignaturePair =\n    | keyword searchSegment\n\n  searchSegment =\n    | actorName               -- actor\n    | integer                 -- integer\n    | float                   -- float\n    | text                    -- text\n    | boolean                 -- boolean\n    | nothing                 -- nothing\n    | name                    -- variable\n\n  invokeInfix =\n    | invokeMixfix infix_symbol invokeMixfix  -- infix\n    | invokeMixfix\n\n  invokeMixfix =\n    | invokePostfix invokePair+         -- self\n    | invokePair+                       -- prefix\n    | invokePostfix\n\n  invokePair =\n    | keyword invokePostfix\n\n  invokePostfix =\n    | invokePostfix atom        -- postfix\n    | memberExpression\n\n  memberExpression =\n    | memberExpression \".\" text   -- project\n    | primaryExpression\n\n  primaryExpression =\n    | matchExpression\n    | interpolateText<expression>\n    | number\n    | boolean\n    | nothing\n    | variable\n    | atom                      -- atom\n    | actorName                 -- actor\n    | s<\"(\"> expression s<\")\">  -- group\n\n  matchExpression =\n    | match_ s<\"{\"> matchClause+ s<\"}\">\n\n  matchClause =\n    | when_ predicate statementBlock  -- when\n    | else_ statementBlock            -- default\n\n  variable = name\n\n  number = integer | float\n  text = s<t_text>\n  integer = s<t_integer>\n  float = s<t_float>\n  boolean = t_boolean\n  name = s<t_name>\n  atom = space* ~reserved t_atom ~\":\"\n  keyword = s<t_keyword>\n  actorName = s<t_actor_name>\n  nothing = nothing_\n  infix_symbol = s<t_infix_symbol>\n\n  interpolateTextPart<p> =\n    | \"\\\\\" any                   -- escape\n    | \"[\" s<p> s<\"]\">            -- interpolate\n    | ~\"\\\"\" any                  -- character\n\n  interpolateText<p> (a text with interpolation) =\n    | s<\"\\\"\"> interpolateTextPart<p>* \"\\\"\"\n\n  s<p> = space* p\n  // -- Lexical rules -------------------------------------------------\n  header (a file header) = \"%\" hs* \"crochet\" nl\n  hs = \" \" | \"\\t\"\n  nl = \"\\n\" | \"\\r\"\n  line = (~nl any)*\n  comment (a comment) = \"//\" line\n  space += comment\n\n  atom_start = \"a\"..\"z\"\n  atom_rest = letter | digit | \"-\"\n  t_atom (an atom) = atom_start atom_rest*\n\n  t_keyword (a keyword) = t_atom \":\"\n\n  t_actor_name (an actor name) = \"#\" t_atom\n\n  name_start = \"A\"..\"Z\" | \"_\"\n  name_rest = letter | digit | \"-\"\n  t_name (a name) = name_start name_rest*\n\n  t_infix_symbol =\n    | \"+\" | \"-\" | \"*\" | \"/\"\n    | \"<\" | \">\" | \"<=\" | \">=\"\n    | \"===\" | \"=/=\"\n\n  dec_digit = \"0\"..\"9\" | \"_\"\n  t_integer (an integer) = ~\"_\" dec_digit+\n  t_float (a floating-point number) = ~\"_\" dec_digit+ \".\" dec_digit+\n\n\n  text_character =\n    | \"\\\\\" \"\\\"\"     -- escape\n    | ~\"\\\"\" any     -- regular\n  t_text (a text) =\n    | \"\\\"\" text_character* \"\\\"\"\n\n  t_boolean (a boolean) =\n    | true_  -- true\n    | false_ -- false\n\n  kw<word> = s<word> ~atom_rest\n\n  true_ = kw<\"true\">\n  false_ = kw<\"false\">\n  nothing_ = kw<\"nothing\">\n  scene_ = kw<\"scene\">\n  command_ = kw<\"command\">\n  do_ = kw<\"do\">\n  return_ = kw<\"return\">\n  goto_ = kw<\"goto\">\n  let_ = kw<\"let\">\n  end_ = kw<\"end\">\n  actor_ = kw<\"actor\">\n  relation_ = kw<\"relation\">\n  fact_ = kw<\"fact\">\n  forget_ = kw<\"forget\">\n  search_ = kw<\"search\">\n  action_ = kw<\"action\">\n  when_ = kw<\"when\">\n  choose_ = kw<\"choose\">\n  if_ = kw<\"if\">\n  and_ = kw<\"and\">\n  or_ = kw<\"or\">\n  not_ = kw<\"not\">\n  context_ = kw<\"context\">\n  trigger_ = kw<\"trigger\">\n  then_ = kw<\"then\">\n  else_ = kw<\"else\">\n  match_ = kw<\"match\">\n  repeatable_ = kw<\"repeatable\">\n\n  reserved =\n    | true_ | false_ | nothing_ \n    | scene_ | command_ | do_ | return_ | goto_ | let_ | end_\n    | actor_ | relation_ | fact_ | search_ | forget_ | action_\n    | when_ | choose_ | if_ | and_ | or_ | not_ | context_ | trigger_\n    | then_ | else_ | match_ | repeatable_\n}");
const unimplemented = {};

export interface Wrapper<A, B> {
  visit(visitor: AbstractCrochetVisitor<A, B>, context: A): B;
  child(idx: number): Wrapper<A, B>;
  isTerminal(): boolean;
  isIteration(): boolean;
  children: Wrapper<A, B>[];
  ctorName: string;
  source: Ohm.Interval;
  sourceString: string;
  numChildren: number;
  isOptional: boolean;
  primitiveValue: string;
}

export function visit<A, B>(result: Ohm.MatchResult, visitor: AbstractCrochetVisitor<A, B>, context: A): B {
  return semantics(result).visit(visitor, context);
}

const semantics = grammar.createSemantics();
semantics.addOperation('visit(visitor, context)', <any>{
  _terminal() { return this.primitiveValue; },
  _nonterminal(children: any) {
    const { visitor, context } = this.args;
    if (!this.isLexical()) {
      throw new Error("Missing visitor implementation for " + this._node.ctorName);
    }
    if (typeof visitor[this._node.ctorName] !== 'function') {
      throw new Error("Missing visitor implementation for " + this._node.ctorName);
    }
    const result = visitor[this._node.ctorName](this, children, context);
    if (result === unimplemented) {
      return this.sourceString;
    } else {
      return result;
    }
  },
  _iter(children: any[]) {
    const { visitor, context } = this.args;
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].visit(visitor, context);
      }
    }

    return children.map(x => x.visit(visitor, context));
  },
  NonemptyListOf(first: any, sep: any, rest: any) {
    const { visitor, context } = this.args;
    return [first.visit(visitor, context)].concat(rest.visit(visitor, context));
  },
  EmptyListOf() { return []; },
  nonemptyListOf(first: any, sep: any, rest: any) {
    const { visitor, context } = this.args;
    return [first.visit(visitor, context)].concat(rest.visit(visitor, context));
  },
  emptyListOf() { return []; },
  listOf(alt: any) { return alt.visit(this.args.visitor, this.args.context) },
  ListOf(alt: any) { return alt.visit(this.args.visitor, this.args.context) }
});


export abstract class AbstractProtoBuiltInRulesVisitor<A, B> {
  any<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  end<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  caseInsensitive<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  lower<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  upper<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  unicodeLtmo<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  spaces<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  space<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }
}

export abstract class AbstractBuiltInRulesVisitor<A, B> extends AbstractProtoBuiltInRulesVisitor<A, B> {
  alnum<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  letter<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  digit<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  hexDigit<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }
}

export abstract class AbstractCrochetVisitor<A, B> extends AbstractBuiltInRulesVisitor<A, B> {
  program<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  declaration<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  doDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  sceneDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  contextDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  hookDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  actorDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  actorRoles_roles<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  actorRoles_no_roles<T extends Wrapper<A, B>>(node: T, children: [], context: A): B {
    return <any>unimplemented;
  }

  actorRoles<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actorInitialisation_init<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  actorInitialisation_no_init<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actorInitialisation<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actorFact_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  actorFact_unary<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  actorFact<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  relationDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  relationSignature_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  relationSignature_unary<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  relationSignature<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  relationVariable_many<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  relationVariable_one<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  relationVariable<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  relationSignaturePair<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  commandDeclaration_ffi<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T, T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  commandDeclaration_local<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  commandDeclaration<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature_infix<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature_self<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature_unary<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature_prefix<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature_nullary<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  commandSignature<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  keywordSignaturePair<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  actionDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  repeatableMark_mark<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  repeatableMark_no_mark<T extends Wrapper<A, B>>(node: T, children: [], context: A): B {
    return <any>unimplemented;
  }

  repeatableMark<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actionTags_tagged<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  actionTags_untagged<T extends Wrapper<A, B>>(node: T, children: [], context: A): B {
    return <any>unimplemented;
  }

  actionTags<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  predicate_constrained<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  predicate_unconstrained<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  predicate<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraint_conjunction<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraint_disjunction<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraint_negate<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  constraint<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_eq<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_neq<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_gt<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_gte<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_lt<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_lte<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq_role<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintEq<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraintPrimary_integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraintPrimary_variable<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraintPrimary_actor<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  constraintPrimary_group<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  constraintPrimary<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  statement_expr<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  statement<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  triggerAction<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  triggerStatement<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  returnStatement_with_value<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  returnStatement_naked<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  returnStatement<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  gotoStatement<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  letStatement<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  factStatement<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  forgetStatement<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  factUseSignature_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  factUseSignature_unary<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  factUseSignature<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  factSignaturePair<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  statementBlock<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  expression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  ifExpression<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  searchExpression_search<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  searchExpression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchRelation_negated<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  searchRelation_has<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchRelation<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSignature_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  searchSignature_unary<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  searchSignature<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSignaturePair<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_actor<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_float<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_text<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_boolean<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_nothing<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment_variable<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  searchSegment<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  invokeInfix_infix<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  invokeInfix<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  invokeMixfix_self<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  invokeMixfix_prefix<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  invokeMixfix<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  invokePair<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  invokePostfix_postfix<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  invokePostfix<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  memberExpression_project<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  memberExpression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  primaryExpression_atom<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  primaryExpression_actor<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  primaryExpression_group<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  primaryExpression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  matchExpression<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  matchClause_when<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  matchClause_default<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  matchClause<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  variable<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  number<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  text<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  float<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  boolean<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  name<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  atom<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  keyword<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actorName<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  nothing<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  infix_symbol<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  interpolateTextPart_escape<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  interpolateTextPart_interpolate<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  interpolateTextPart_character<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  interpolateTextPart<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  interpolateText<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  s<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  header<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B {
    return <any>unimplemented;
  }

  hs<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  nl<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  line<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  comment<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  space<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  atom_start<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  atom_rest<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_atom<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  t_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  t_actor_name<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  name_start<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  name_rest<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_name<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  t_infix_symbol<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  dec_digit<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_float<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  text_character_escape<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B {
    return <any>unimplemented;
  }

  text_character_regular<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  text_character<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_text<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B {
    return <any>unimplemented;
  }

  t_boolean_true<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_boolean_false<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  t_boolean<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  kw<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  true_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  false_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  nothing_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  scene_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  command_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  do_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  return_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  goto_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  let_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  end_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  actor_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  relation_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  fact_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  forget_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  search_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  action_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  when_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  choose_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  if_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  and_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  or_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  not_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  context_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  trigger_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  then_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  else_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  match_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  repeatable_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }

  reserved<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return <any>unimplemented;
  }
}
