import * as Ohm from 'ohm-js';
export const grammar = Ohm.grammar("Crochet {\n  program =\n    | header declaration* space* end\n\n  declaration =\n    | doDeclaration\n\n  doDeclaration =\n    | do_ block<statement>\n\n  statement =\n    | returnStatement\n    | expression        -- expression\n\n  returnStatement =\n    | return_ expression\n  \n  expression =\n    | primaryExpression\n\n  primaryExpression =\n    | literal   -- expression\n    | variable\n  \n  literal =\n    | text\n    | boolean\n\n\n  block<t> =\n    | s<\"{\"> nonemptyListOf<t, s<\";\">> s<\";\"> s<\"}\">\n\n/*\n  declaration =\n    | commandDeclaration\n    | doDeclaration\n    | sceneDeclaration\n    | actorDeclaration\n    | relationDeclaration\n    | actionDeclaration\n    | contextDeclaration\n    \n  doDeclaration =\n    | do_ statementBlock\n\n  sceneDeclaration =\n    | scene_ atom statementBlock\n\n  contextDeclaration =\n    | context_ atom s<\"{\"> hookDeclaration+ s<\"}\">\n\n  hookDeclaration =\n    | when_ predicate statementBlock\n\n  actorDeclaration =\n    | actor_ actorName actorRoles actorInitialisation\n\n  actorRoles =\n    | s<\"::\"> nonemptyListOf<atom, s<\",\">>    -- roles\n    |                                         -- no_roles\n\n  actorInitialisation =\n    | s<\"{\"> actorFact+ s<\"}\">     -- init\n    | \";\"                          -- no_init\n\n  actorFact =\n    | factSignaturePair+ s<\";\">    -- keyword\n    | atom s<\";\">                  -- unary\n\n  relationDeclaration =\n    | relation_ relationSignature s<\";\">\n\n  relationSignature =\n    | relationVariable relationSignaturePair+   -- keyword\n    | relationVariable atom                     -- unary\n\n  relationVariable =\n    | name s<\"*\">  -- many\n    | name         -- one\n\n  relationSignaturePair =\n    | keyword relationVariable\n\n  commandDeclaration =\n    | command_ commandSignature s<\"=\"> atom s<\"(\"> listOf<name, s<\",\">> s<\")\"> s<\";\">  -- ffi\n    | command_ commandSignature statementBlock                                         -- local\n\n  commandSignature =\n    | name infix_symbol name           -- infix\n    | name keywordSignaturePair+       -- self\n    | name atom                        -- unary\n    | keywordSignaturePair+            -- prefix\n    | atom                             -- nullary\n  \n  keywordSignaturePair =\n    | keyword name\n\n  actionDeclaration =\n    | repeatableMark action_ interpolateText<variable> actionTags when_ predicate statementBlock\n\n  repeatableMark =\n    | repeatable_     -- mark\n    |                 -- no_mark\n\n  actionTags =\n    | s<\"::\"> nonemptyListOf<atom, \",\">    -- tagged\n    |                                   -- untagged\n\n  predicate =\n    | nonemptyListOf<searchRelation, s<\",\">> if_ constraint    -- constrained\n    | nonemptyListOf<searchRelation, s<\",\">>                   -- unconstrained\n\n  constraint =\n    | constraint and_ constraint    -- conjunction\n    | constraint or_ constraint     -- disjunction\n    | not_ constraint               -- negate\n    | constraintEq\n\n  constraintEq =\n    | constraintPrimary s<\"===\"> constraintPrimary   -- eq\n    | constraintPrimary s<\"=/=\"> constraintPrimary   -- neq\n    | constraintPrimary s<\">\"> constraintPrimary     -- gt\n    | constraintPrimary s<\">=\"> constraintPrimary    -- gte\n    | constraintPrimary s<\"<\"> constraintPrimary     -- lt\n    | constraintPrimary s<\"<=\"> constraintPrimary    -- lte\n    | constraintPrimary s<\"::\"> atom                 -- role\n    | constraintPrimary\n\n  constraintPrimary =\n    | integer                     -- integer\n    | name                        -- variable\n    | actorName                   -- actor\n    | s<\"(\"> constraint s<\")\">    -- group\n\n  statement =\n    | returnStatement\n    | gotoStatement\n    | letStatement\n    | factStatement\n    | forgetStatement\n    | triggerAction\n    | triggerStatement\n    | expression s<\";\">   -- expr\n\n  triggerAction =\n    | trigger_ action_ s<\";\">\n\n  triggerStatement =\n    | trigger_ atom s<\";\">\n\n  returnStatement =\n    | return_ expression s<\";\">  -- with_value\n    | return_ s<\";\">             -- naked\n\n  gotoStatement =\n    | goto_ atom s<\";\">\n\n  letStatement =\n    | let_ name s<\"=\"> expression s<\";\">\n\n  factStatement =\n    | fact_ factUseSignature s<\";\">\n\n  forgetStatement =\n    | forget_ factUseSignature s<\";\">\n\n  factUseSignature =\n    | primaryExpression factSignaturePair+    -- keyword\n    | primaryExpression atom                  -- unary\n\n  factSignaturePair =\n    | keyword primaryExpression\n\n  statementBlock =\n    | s<\"{\"> statement* s<\"}\">\n\n  expression =\n    | searchExpression\n    | ifExpression\n\n  ifExpression =\n    | if_ invokeInfix then_ expression else_ expression\n\n  searchExpression =\n    | search_ predicate   -- search\n    | invokeInfix\n\n  searchRelation =\n    | not_ searchSignature     -- negated\n    | searchSignature          -- has\n\n  searchSignature =\n    | searchSegment searchSignaturePair+  -- keyword\n    | searchSegment atom                  -- unary\n\n  searchSignaturePair =\n    | keyword searchSegment\n\n  searchSegment =\n    | actorName               -- actor\n    | integer                 -- integer\n    | float                   -- float\n    | text                    -- text\n    | boolean                 -- boolean\n    | nothing                 -- nothing\n    | name                    -- variable\n\n  invokeInfix =\n    | invokeMixfix infix_symbol invokeMixfix  -- infix\n    | invokeMixfix\n\n  invokeMixfix =\n    | invokePostfix invokePair+         -- self\n    | invokePair+                       -- prefix\n    | invokePostfix\n\n  invokePair =\n    | keyword invokePostfix\n\n  invokePostfix =\n    | invokePostfix atom        -- postfix\n    | memberExpression\n\n  memberExpression =\n    | memberExpression \".\" text   -- project\n    | primaryExpression\n\n  primaryExpression =\n    | matchExpression\n    | interpolateText<expression>\n    | number\n    | boolean\n    | nothing\n    | variable\n    | atom                      -- atom\n    | actorName                 -- actor\n    | s<\"(\"> expression s<\")\">  -- group\n\n  matchExpression =\n    | match_ s<\"{\"> matchClause+ s<\"}\">\n\n  matchClause =\n    | when_ predicate statementBlock  -- when\n    | else_ statementBlock            -- default\n\n*/\n\n  variable = name\n\n  number = integer | float\n  text = s<t_text>\n  integer = s<t_integer>\n  float = s<t_float>\n  boolean = t_boolean\n  name = s<t_name>\n  atom = space* ~reserved t_atom ~\":\"\n  keyword = s<t_keyword>\n  actorName = s<t_actor_name>\n  nothing = nothing_\n  infix_symbol = s<t_infix_symbol>\n\n  interpolateTextPart<p> =\n    | \"\\\\\" any                   -- escape\n    | \"[\" s<p> s<\"]\">            -- interpolate\n    | ~\"\\\"\" any                  -- character\n\n  interpolateText<p> (a text with interpolation) =\n    | s<\"\\\"\"> interpolateTextPart<p>* \"\\\"\"\n\n  s<p> = space* p\n\n\n  // -- Lexical rules -------------------------------------------------\n  header (a file header) = \"%\" hs* \"crochet\" nl\n  hs = \" \" | \"\\t\"\n  nl = \"\\n\" | \"\\r\"\n  line = (~nl any)*\n  comment (a comment) = \"//\" line\n  space += comment\n\n  atom_start = \"a\"..\"z\"\n  atom_rest = letter | digit | \"-\"\n  t_atom (an atom) = atom_start atom_rest*\n\n  t_keyword (a keyword) = t_atom \":\"\n\n  t_actor_name (an actor name) = \"#\" t_atom\n\n  name_start = \"A\"..\"Z\" | \"_\"\n  name_rest = letter | digit | \"-\"\n  t_name (a name) = name_start name_rest*\n\n  t_infix_symbol =\n    | \"+\" | \"-\" | \"*\" | \"/\"\n    | \"<\" | \">\" | \"<=\" | \">=\"\n    | \"===\" | \"=/=\"\n\n  dec_digit = \"0\"..\"9\" | \"_\"\n  t_integer (an integer) = ~\"_\" dec_digit+\n  t_float (a floating-point number) = ~\"_\" dec_digit+ \".\" dec_digit+\n\n\n  text_character =\n    | \"\\\\\" \"\\\"\"     -- escape\n    | ~\"\\\"\" any     -- regular\n  t_text (a text) =\n    | \"\\\"\" text_character* \"\\\"\"\n\n  t_boolean (a boolean) =\n    | true_  -- true\n    | false_ -- false\n\n  kw<word> = s<word> ~atom_rest\n\n  true_ = kw<\"true\">\n  false_ = kw<\"false\">\n  nothing_ = kw<\"nothing\">\n  scene_ = kw<\"scene\">\n  command_ = kw<\"command\">\n  do_ = kw<\"do\">\n  return_ = kw<\"return\">\n  goto_ = kw<\"goto\">\n  let_ = kw<\"let\">\n  end_ = kw<\"end\">\n  actor_ = kw<\"actor\">\n  relation_ = kw<\"relation\">\n  fact_ = kw<\"fact\">\n  forget_ = kw<\"forget\">\n  search_ = kw<\"search\">\n  action_ = kw<\"action\">\n  when_ = kw<\"when\">\n  choose_ = kw<\"choose\">\n  if_ = kw<\"if\">\n  and_ = kw<\"and\">\n  or_ = kw<\"or\">\n  not_ = kw<\"not\">\n  context_ = kw<\"context\">\n  trigger_ = kw<\"trigger\">\n  then_ = kw<\"then\">\n  else_ = kw<\"else\">\n  match_ = kw<\"match\">\n  repeatable_ = kw<\"repeatable\">\n\n  reserved =\n    | true_ | false_ | nothing_ \n    | scene_ | command_ | do_ | return_ | goto_ | let_ | end_\n    | actor_ | relation_ | fact_ | search_ | forget_ | action_\n    | when_ | choose_ | if_ | and_ | or_ | not_ | context_ | trigger_\n    | then_ | else_ | match_ | repeatable_\n}");
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
  ListOf(alt: any) { return alt.visit(this.args.visitor, this.args.context) },
  "program": function(_0: any, _1: any, _2: any, _3: any) {
    const { visitor, context } = this.args;
    return visitor["program"](this, [_0, _1, _2, _3], context);
  },
  "declaration": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["declaration"](this, [_0], context);
  },
  "doDeclaration": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["doDeclaration"](this, [_0, _1], context);
  },
  "statement_expression": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["statement_expression"](this, [_0], context);
  },
  "statement": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["statement"](this, [_0], context);
  },
  "returnStatement": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["returnStatement"](this, [_0, _1], context);
  },
  "expression": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["expression"](this, [_0], context);
  },
  "primaryExpression_expression": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["primaryExpression_expression"](this, [_0], context);
  },
  "primaryExpression": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["primaryExpression"](this, [_0], context);
  },
  "literal": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["literal"](this, [_0], context);
  },
  "block": function(_0: any, _1: any, _2: any, _3: any) {
    const { visitor, context } = this.args;
    return visitor["block"](this, [_0, _1, _2, _3], context);
  },
  "variable": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["variable"](this, [_0], context);
  },
  "number": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["number"](this, [_0], context);
  },
  "text": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["text"](this, [_0], context);
  },
  "integer": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["integer"](this, [_0], context);
  },
  "float": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["float"](this, [_0], context);
  },
  "boolean": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["boolean"](this, [_0], context);
  },
  "name": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["name"](this, [_0], context);
  },
  "atom": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["atom"](this, [_0, _1], context);
  },
  "keyword": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["keyword"](this, [_0], context);
  },
  "actorName": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["actorName"](this, [_0], context);
  },
  "nothing": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["nothing"](this, [_0], context);
  },
  "infix_symbol": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["infix_symbol"](this, [_0], context);
  },
  "interpolateTextPart_escape": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["interpolateTextPart_escape"](this, [_0, _1], context);
  },
  "interpolateTextPart_interpolate": function(_0: any, _1: any, _2: any) {
    const { visitor, context } = this.args;
    return visitor["interpolateTextPart_interpolate"](this, [_0, _1, _2], context);
  },
  "interpolateTextPart_character": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["interpolateTextPart_character"](this, [_0], context);
  },
  "interpolateTextPart": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["interpolateTextPart"](this, [_0], context);
  },
  "interpolateText": function(_0: any, _1: any, _2: any) {
    const { visitor, context } = this.args;
    return visitor["interpolateText"](this, [_0, _1, _2], context);
  },
  "s": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["s"](this, [_0, _1], context);
  },
  "header": function(_0: any, _1: any, _2: any, _3: any) {
    const { visitor, context } = this.args;
    return visitor["header"](this, [_0, _1, _2, _3], context);
  },
  "hs": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["hs"](this, [_0], context);
  },
  "nl": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["nl"](this, [_0], context);
  },
  "line": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["line"](this, [_0], context);
  },
  "comment": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["comment"](this, [_0, _1], context);
  },
  "atom_start": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["atom_start"](this, [_0], context);
  },
  "atom_rest": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["atom_rest"](this, [_0], context);
  },
  "t_atom": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["t_atom"](this, [_0, _1], context);
  },
  "t_keyword": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["t_keyword"](this, [_0, _1], context);
  },
  "t_actor_name": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["t_actor_name"](this, [_0, _1], context);
  },
  "name_start": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["name_start"](this, [_0], context);
  },
  "name_rest": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["name_rest"](this, [_0], context);
  },
  "t_name": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["t_name"](this, [_0, _1], context);
  },
  "t_infix_symbol": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["t_infix_symbol"](this, [_0], context);
  },
  "dec_digit": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["dec_digit"](this, [_0], context);
  },
  "t_integer": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["t_integer"](this, [_0], context);
  },
  "t_float": function(_0: any, _1: any, _2: any) {
    const { visitor, context } = this.args;
    return visitor["t_float"](this, [_0, _1, _2], context);
  },
  "text_character_escape": function(_0: any, _1: any) {
    const { visitor, context } = this.args;
    return visitor["text_character_escape"](this, [_0, _1], context);
  },
  "text_character_regular": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["text_character_regular"](this, [_0], context);
  },
  "text_character": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["text_character"](this, [_0], context);
  },
  "t_text": function(_0: any, _1: any, _2: any) {
    const { visitor, context } = this.args;
    return visitor["t_text"](this, [_0, _1, _2], context);
  },
  "t_boolean_true": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["t_boolean_true"](this, [_0], context);
  },
  "t_boolean_false": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["t_boolean_false"](this, [_0], context);
  },
  "t_boolean": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["t_boolean"](this, [_0], context);
  },
  "kw": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["kw"](this, [_0], context);
  },
  "true_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["true_"](this, [_0], context);
  },
  "false_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["false_"](this, [_0], context);
  },
  "nothing_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["nothing_"](this, [_0], context);
  },
  "scene_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["scene_"](this, [_0], context);
  },
  "command_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["command_"](this, [_0], context);
  },
  "do_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["do_"](this, [_0], context);
  },
  "return_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["return_"](this, [_0], context);
  },
  "goto_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["goto_"](this, [_0], context);
  },
  "let_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["let_"](this, [_0], context);
  },
  "end_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["end_"](this, [_0], context);
  },
  "actor_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["actor_"](this, [_0], context);
  },
  "relation_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["relation_"](this, [_0], context);
  },
  "fact_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["fact_"](this, [_0], context);
  },
  "forget_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["forget_"](this, [_0], context);
  },
  "search_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["search_"](this, [_0], context);
  },
  "action_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["action_"](this, [_0], context);
  },
  "when_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["when_"](this, [_0], context);
  },
  "choose_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["choose_"](this, [_0], context);
  },
  "if_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["if_"](this, [_0], context);
  },
  "and_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["and_"](this, [_0], context);
  },
  "or_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["or_"](this, [_0], context);
  },
  "not_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["not_"](this, [_0], context);
  },
  "context_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["context_"](this, [_0], context);
  },
  "trigger_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["trigger_"](this, [_0], context);
  },
  "then_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["then_"](this, [_0], context);
  },
  "else_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["else_"](this, [_0], context);
  },
  "match_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["match_"](this, [_0], context);
  },
  "repeatable_": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["repeatable_"](this, [_0], context);
  },
  "reserved": function(_0: any) {
    const { visitor, context } = this.args;
    return visitor["reserved"](this, [_0], context);
  }
});


export abstract class AbstractProtoBuiltInRulesVisitor<A, B> {

}

export abstract class AbstractBuiltInRulesVisitor<A, B> extends AbstractProtoBuiltInRulesVisitor<A, B> {

}

export abstract class AbstractCrochetVisitor<A, B> extends AbstractBuiltInRulesVisitor<A, B> {
  abstract program<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B;

  abstract declaration<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract doDeclaration<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract statement_expression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  statement<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract returnStatement<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract expression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract primaryExpression_expression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  primaryExpression<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  literal<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract block<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B;

  abstract variable<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  number<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract text<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract float<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract boolean<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract name<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract atom<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract keyword<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract actorName<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract nothing<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract infix_symbol<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract interpolateTextPart_escape<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract interpolateTextPart_interpolate<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B;

  abstract interpolateTextPart_character<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  interpolateTextPart<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract interpolateText<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B;

  abstract s<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract header<T extends Wrapper<A, B>>(node: T, children: [T, T, T, T], context: A): B;

  hs<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  nl<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract line<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract comment<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract atom_start<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  atom_rest<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract t_atom<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract t_keyword<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract t_actor_name<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  name_start<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  name_rest<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract t_name<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  t_infix_symbol<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  dec_digit<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract t_integer<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract t_float<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B;

  abstract text_character_escape<T extends Wrapper<A, B>>(node: T, children: [T, T], context: A): B;

  abstract text_character_regular<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  text_character<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract t_text<T extends Wrapper<A, B>>(node: T, children: [T, T, T], context: A): B;

  abstract t_boolean_true<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract t_boolean_false<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  t_boolean<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }

  abstract kw<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract true_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract false_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract nothing_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract scene_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract command_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract do_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract return_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract goto_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract let_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract end_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract actor_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract relation_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract fact_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract forget_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract search_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract action_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract when_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract choose_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract if_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract and_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract or_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract not_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract context_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract trigger_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract then_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract else_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract match_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  abstract repeatable_<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B;

  reserved<T extends Wrapper<A, B>>(node: T, children: [T], context: A): B {
    return children[0].visit(<any>this, context);
  }
}
