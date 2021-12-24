The `Lingua` package provides the Lingua DSL---a small language for
describing parsers based on the
[link:https://en.wikipedia.org/wiki/Parsing_expression_grammar | Parsing Expression Grammar (PEG)]
formalism.

The current implementation of Lingua uses the
[link:https://ohmlang.github.io/ | Ohm] library under the hood, so
much of the syntax and semantics are similar---this will change in future
versions. Ohm extends the usual PEG formalism with support for left recursion
and incremental parsing.

# Using this library

To use Lingua you first need to write a grammar. A grammar is a Crochet
module written in the Lingua language (your file will have the `.lingua`
extension, and use the Lingua syntax), it goes in the list of modules
of your package configuration just like normal Crochet modules do.
Crochet takes care of compiling this for you at runtime so you don't
have to worry about generated files.

A simple grammar in Lingua looks like this:

    type line(start: point, stop: point)
    type point(x: number, y: number)
    type number(value: text)

    grammar lines : line[] {
      File =
        | lines:Line* end -> lines

      Line =
        | start:Point "->" stop:Point -> line(start, stop)

      Point =
        | x:Number "," y:Number -> point(x, y)

      Number =
        | value:number -> number(value)

      token number = digit+
    }

Having this module included in your package, you'll be able to use the
`lines` type to parse some text. For example, if given the following:

    lines
      | parse: "3,5 -> 8,5
                1,2 -> 10,10
                4,6 -> 4,8"
      | value-or-panic: "syntax error";

We'll get back a Crochet value that looks like this:

    [
      new line(
        new point(new number("3"), new number("5")),
        new point(new number("8"), new number("5"))
      ),
      new line(
        new point(new number("1"), new number("2")),
        new point(new number("10"), new number("10"))
      ),
      new line(
        new point(new number("4"), new number("6")),
        new point(new number("4"), new number("8"))
      ),
    ]

# The Lingua language

Lingua modules are made out of two things:

- The **Types** section, which describes the values that can be produced by
  the parser when analysing some piece of text.

- The **Grammar** section, which describes the patterns that the text is
  expected to contain, and extracts portions of that text to construct the
  values returned.

## Type declarations

The type declarations in Lingua are slightly different from the declarations
in Crochet, this is a legacy syntax that will change in the future. A type
is introduced with the `type` declaration. In its basic form it looks like
this:

    type point(x: number, y: number)

A declaration like this is converted to the following Crochet type declaration:

    local abstract ast-node is node;
    type point(x is number, y is number) is ast-node;

The `ast-node` type sits atop the whole hierarchy of the grammar types, and
it extends the base `node` type from the Lingua runtime---the root of all
AST hierarchies.

Lingua also makes it possible to declare a type that can have multiple
concretisations, which is often called an "algebraic data type" in programming.
The syntax looks like this:

    type literal =
      | text(value: text)
      | number(value: text)

And it gets converted to the following Crochet declarations:

    local abstract ast-node is node;
    type literal--text(value: text) is ast-node;
    type literal--number(value: text) is ast-node;

Singleton types are still expressed in the same syntax as the simple type
above, just with no arguments:

    type zero()

And it gets converted to the following Crochet declaration:

    local abstract ast-node is node;
    singleton zero is ast-node;

### Referring to types

Unlike Crochet, Lingua actually requires all arguments to a type to **be**
of some type. It uses this to make sure that the input is parsed to the
correct semantics, even when crossing language boundaries (i.e.: it should
still behave in the same way, and tell you _why_ things are wrong, even if
you try to use it in a language that does not have types, or has a different
idea of types).

The basic types in Lingua have the same name as they do in Crochet, and
are limited to the following:

- `nothing`

- `text`

- `interval` -- this is the type of Lingua's ideas of match intervals, discussed
  more later in this page.

On top of this, Lingua accepts a few complex types, which combine these in
some form:

- `Type?` -- means that the value can either fit `Type` or be `nothing`.
  For example, `text?` would mean `text or nothing`.

- `Type[]` -- means a list of values that fit `Type`. For example,
  `text[]` would mean `list<text>`.

All other types must be ones you declare in your grammar. And note that,
unlike Crochet, there's no way of referring to concretisations of an
algebraic data type. In the example in the previous section, it would
only be possible to refer to `literal` as a type, not to the `number`
concretisation under it.

### Match intervals

An interval represents the portion of the input that was matched by
a rule. Having intervals in your types means that you can relate the
information you extracted back to its source---this is very important
if you want to explain to the user how you've got some value, or why
a certain value is incorrect (and how the user could fix it).

Intervals ultimately end up as the [type:interval] type in the Lingua
runtime, which gives you commands to get the position of the value
in the original input, the range of characters that it refers to,
and the complete matched input.

### Identifier restrictions

Names in Lingua are currently expressed with the legacy syntax that
uses `_` (underscores) in the name, instead of Crochet's `-` (hyphen).
When Lingua modules are compiled to Crochet, the underscores are
replaced by hyphens, thus:

    type day_of_week(value: text)

Would become:

    type day-of-week(value is text) is ast-node;

## Grammar declarations

A Lingua grammar consists of three things:

- The name of the grammar (in our initial example, `lines`). This becomes a
  singleton type in the module that is used to expose the `_ parse: _` command;

- The return type of the grammar (in our initial example, `line[]`). This is
  used to verify that, when we parse some text input, the grammar truly
  produces the output that we expect; and

- The rules of the grammar (in our initial example, `File`, `Line`, `Point`,
  etc). These are what look for patterns in the input to extract information
  from it.

### Rules

There are three main types of rules:

- **Lexical rules** (whose name start with a lower-case letter) are rules
  with strict patterns---they match exactly what the rules say. These are
  often used to break the input into slightly bigger pieces than single
  characters.

- **Syntax rules** (whose names start with an upper-case letter) are rules
  with looser patterns---they match what the rules say, but allow "spaces"
  to be skipped between any of the patterns. What "spaces" means is defined
  the the `space` lexical rule, and often also includes things like comments.

- **Token rules** (lexical rules preceded with the `token` keyword) are a
  special kind of lexical rule that, instead of allowing us to extract
  pieces matched by its patterns to a type, simply return the whole matched
  input as a single piece of text.

A rule is declared by having its name followed by `=`, a sequence of
alternatives, and maybe some semantic actions. We'll see what all of
this means shortly. It's important to note two rules cannot have the
same name (Lingua is case sensitive, so `number` and `Number` are still okay).
This also goes for rules that have the same name as a _built-in_ rule.

For the cases where a built-in rule is to be replaced (this is often the
case for the `space` rule), they can be followed by `:=` instead of `=`. So
the following would replace the built-in `space` rule to not consider new
lines:

    space := " " | "\t"

### Parameterised rules

Rules in Lingua (just like in Ohm) can be parameterised. In that case
they work like a command, and you can "configure" the rule when you
use it. For example:

    keyword<word> =
      | ~reserved word

Is a parameterised rule that, when applied, will make sure that the
pattern captured by the `word` parameter will not be a reserved word.
One could use it as such:

    Type =
      | keyword<"type"> Name

### Built-in rules

Lingua defines several built-in rules that can be used in your grammar
without having to re-declare them. These are also mostly inherited from
Ohm:

- `nonemptyListOf<Pattern, Separator>` -- A list of items described by
  `Pattern`, with `Separator` between them. At least one match is needed.

- `listOf<Pattern, Separator>` -- A list of items described by `Pattern`,
  with `Separator` between them. If nothing matches, it still succeeds with
  an empty list as a result.

- `alnum` -- an alpha-numeric character (letter or digit).

- `letter` -- any unicode character classified as "letter".

- `digit` -- a digit from "0" to "9".

- `hexDigit` -- a hexadecimal digit: `"0".."9" | "a".."f" | "A".."F"`.

### Alternatives

The body of a rule is a sequence of alternatives. That simply means a
number of patterns that are preceded by `|`. For example, a rule that
matches digits or letters would look like this:

    token digits-or-letters =
      | digit+
      | letter+

Alternatives in Lingua, like in other PEG libraries, are tried in the
order they appear. In this case we would only try `letter+` if we fail
to match `digit+`.

This is often a reasonable behaviour, however it _can_ hide some
ambiguities in the grammar that will only be uncovered by careful
analysis or testing.

### Bindings and semantic actions

Alternatives also support bindings semantic actions.

A binding is a way of capturing what a pattern has matched into
a name. This name can then be referred to later in a semantic action.

A semantic action is a piece of code that Lingua executes to
put the information the patterns have extracted from the input
into one of the types declared by the grammar.

Together they look like this:

    | x:Number "," y:Number -> point(x, y)

Which means that first we look for something that can be matched
by the `Number` pattern---if we succeed, we'll call that match `x`.
Then we look for a single comma (`,`). And finally we look for
another thing that matches `Number`---and call that match `y`.
If all goes well we then put `x` and `y` together in the `point`
type.

Semantic actions are written in _Lingua Expressions_. These are
a very restricted language that only allow constructing the types
already declared, and some of the built-in ones.

To create a value of a type, the syntax is similar to Crochet's,
but without the `new` keyword:

    point(x, y)

To create a value of a concretisation of an algebraic type, we
separate the algebraic type name from its concretisation's name
with a `.` (dot):

    literal.text(value)

We refer to bindings by the same name they have in the pattern:

    x

To construct a list, we can use the bracket (`[]`) syntax, like
in Crochet:

    [x, y]

A list can be added to another list using the `...` operator. The
following would result in a list containing the values `x`, `y`,
and followed by all values in the list `rest`:

    [x, y, ...rest]

The special `null` value stands for Crochet's `nothing`:

    null

The special `meta` value stands for the match interval of the current
rule:

    meta

### Patterns

Lingua uses the same patterns Ohm does, which are all similar in one
way or another to the syntax other PEG libraries and Regular Expression
libraries use.

#### Primary patterns

- `rule_name` -- simply mentioning the name of a rule means applying it.
  That is, we'll try to match the body of that rule at the current point
  in the input. Binding this pattern will give you the result of its
  semantic action.

- `rule_name<P1, P2, ...>` -- parameterised rules can be applied by providing
  patterns between angle brackets. The patterns are used in the body of that
  rule to match the input, and it otherwise works as the simpler application
  above. E.g.: `listOf<digit, ",">` would result in the `listOf` rule
  applying `digit` with commas in-between them.

- `"text"` -- will match exactly the text between quotes. Binding this
  pattern will give you that text as well, but this is generally not useful.

- `"a".."z"` -- will match the range of characters described (inclusive
  on both ends). Binding this pattern will give you the character matched
  as a piece of text.

- `(P1 P2 P3 ...)` -- patterns can be used for grouping, which reduces the need
  of creating a new rule for the patterns. Since parenthesis cannot have
  semantic actions, however, it's not possible to bind this pattern.

#### Alternative patterns

- `Pattern1 | Pattern2` -- will try to match `Pattern1`. If it doesn't succeed,
  it will try to match `Pattern2`. It fails if both of them fail. Because
  alternatives do not have a semantic action, you cannot bind this pattern.

#### Sequencing patterns

- `Pattern1 Pattern2 Pattern3 ...` -- the sequence of patterns simply matches
  them one after the other. When these happen in a Syntax Rule context,
  there will be a `space*` rule between each of these patterns as well.

- `Pattern*` -- matches the pattern zero or more times, it will consume
  input for as long as the pattern can be matched. Binding this pattern
  gives you a list of the successful matches.

- `Pattern+` -- matches the pattern one or more times, it will consume
  input for as long as the pattern can be matched. Binding this pattern
  gives you a list of the successful matches.

- `Pattern?` -- matches the pattern zero or one times. It will try to
  match the pattern, but still succeed if it can't. Binding this pattern
  will give you either `nothing` or the successful match.

#### Assertion patterns

- `~Pattern` -- will allow the parser to continue if the pattern cannot
  match, but cause it to fail otherwise. You cannot bind this pattern as
  it has no actual value, and it doesn't consume any input.

- `&Pattern` -- Will allow the parser to continue if the pattern can
  match, but cause it to fail otherwise. It does not consume any input.
  You cannot bind this pattern as it has no actual value.

#### Lexing patterns

- `#Pattern` -- Will force a Syntax Rule to be treated as a Lexical Rule,
  so it won't be inserting `space*` between the patterns.
