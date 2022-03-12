# [#0012] - Marquesa

|                  |                |
| ---------------- | -------------- |
| **Authors**      | Q.             |
| **Last updated** | 9th March 2022 |
| **Status**       | Draft          |

## Summary

Crochet users need a way of expressing free-form documentation, however,
as with any other kind of tech documentation, these pieces will have
additional needs of cross-linking entities, guaranteeing some form of
synchronisation with the underlying system, having interactive examples,
etc.

Given that Crochet is an extensible _programming system_, we don't always
know which form each of these needs will take. A user should be able to
build a new DSL, integrate it in a Crochet system, and interact with it
in semantically meaningful ways from within regular documentation files.
This means that any documentation language we choose has to, likewise,
be extensible. ReStructuredText and Scribble are two of the few systems
that achieve this, however ReStructuredText does not have consistent
composition, favouring specialised blocks instead---this, in turn,
prevents proper extensibility in the presence of uncoordinated actors,
which is the primary means of extensibility in Crochet. Scribble does
not suffer from the same directly, but it's very tied to Racket's
semantics, which are not really shared in Crochet.

So, instead, this document proposes the creation of a new external
DSL called Marquesa, which takes inspiration from Markdown for its
regular syntax, and from both Scribble and HTML for its extensible
blocks. Blocks in Marquesa are a form of function, like in Scribble,
but they may result in either inline or block-based layouts, like
in HTML.

A similar system has been in place, ad-hoc, in Crochet's `docs` tool
in the past, so we do not propose any significant deviation of the
existing syntax.

## Example

    % marquesa/base

    The `Random` package provides basic support for **predictable**
    pseudo-random number generation, as needed by video games and
    stochastic model checking.

    # Predictable randomness

    The [type:random] type provides the entry-point for predictable
    random number generation. All random number generators spawned
    from this type follow the [trait:predictable-rng] trait, but
    the only concrete implementation is currently on the [type:xor-shift]
    type.

    @example(language: "crochet"):
      let Random1 = #random with-seed: 123456;
      let Result1 = Random1 between: 1 and: 10;
      let N1 = Result1 value;

      let Result2 = Result1 random between: 1 and: 10;
      let N2 = Result2 value;

This example shows some inline formatting notation, simple inline blocks
between square brackets, block-level markup such as titles and paragraphs,
and block-level functions such as `@example(...):`. The `marquesa/base`
identifier describes the language, which in this case also works to define
its global environment of functions (such as `example`, `type`, etc.)

## Formal language

The underlying language for Marquesa consists of the following:

    b in {true, false}
    i in integers
    f in floats
    t in texts
    p in namespace identifier
    n in names

    Expr e ::=
      | use p as n in e                             -- qualified import
      | use p exposing (...) excluding (...) in e   -- restricted import
      | use p in e                                  -- unpack import
      | e1; ...; eN                                 -- sequence
      | eH n1:e1 ... nN:eN                          -- application
      | e.n                                         -- projection
      | n                                           -- variable dereference
      | letrec n1 = e1, ..., nN = eN in e           -- variable introduction
      | fun(n1 = e1, ..., nN = eN): e               -- lambda abstraction
      | nothing | b | i | f | t                     -- values

Marquesa is a call-by-value, applicative-order, strict language. Semantics
follow the normal call-by-value constructs, with the exception that
`sequence` here means something similar to `vector`---it yields all of the
sub-values, not just the last one. Modules are first-class, non-parametric
namespaces.

## Surface syntax

Marquesa's surface syntax is influenced by Markdown, however we use only
a restricted form of it that does not require as much record-keeping on
indentation. This in turn means that indented blocks in Marquesa cannot
be nested.

The grammar is defined as follows:

    Program =
      | "%" <language header> Block*

    Block =
      | Heading
      | List
      | Quote
      | Divider
      | Paragraph
      | Break
      | Block-application
      | Application

    Heading =
      | "#"+ Line Break

    List =
      | List-item+ Break

    List-item =
      | "-" Run-paragraph Break

    Quote =
      | (">" Line New-line)+ Break

    Divider =
      | "---" "-"* Break

    Paragraph =
      | (Word+ New-line)+ Break

    Block-application =
      | "@" Expr Arguments ":" <indented>(Block) Break

    Application =
      | "@" Expr Arguments

    Word =
      | Inline
      | Application
      | Non-special+
      | "\\" char

    Inline =
      | Bold
      | Italic
      | Code
      | Link

    Bold =
      | "**" Word+ "**"

    Italic =
      | "_" Word+ "_"

    Code =
      | "`" ("\\`" | !"`")+ "`"

    Link =
      | "[" Member ":" Text "]"
