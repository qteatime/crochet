# [#0007] - Debug Representations

|                  |                    |
| ---------------- | ------------------ |
| **Authors**      | Niini              |
| **Last updated** | 30th December 2021 |
| **Status**       | Draft              |

## Summary

In order to properly debug things, we might want to look at values
from different perspectives to try to understand what's happening.
Currently the debugging representation just dumps the internals of
the object, and this is often very unhelpful.

But having the object define a single representation is also often
unhelpful. This document proposes the idea of "perspectives", which
allows objects to define multiple (contextual) representations.
This fits well with multi-methods and can be made trivially
capability-secure.

## The proposal

The idea behind this proposal consists of a Document language, which
can describe a (possibly interactive) representation of a value; and
a Perspective language, which allows describing multiple representations
securely and in an extensible way (without requiring any coordination).

For example:

    type date-perspective is perspective;
    type timestamp-perspective is perspective;

    command date-perspective name = "Date";
    command timestamp-perspective name = "Timestamp";

    command debug-representation for: (X is instant) perspective: date-perspective =
      self text: (X to-iso8601-text)
        | typed: #instant;

    command debug-representation for: (X is instant) perspective: timestamp-perspective =
      self number: (X to-milliseconds-since-unix-epoch)
        | typed: #instant;

Here the code introduces two new perspective (they're nullary types):
`date-perspective` and `timestamp-perspective`. The only thing they need
is to provide a `name` field.

It then proceeds to provide a Document for how the `instant` type can
be looked at given each of these perspectives. Any other piece of code,
of course, can define its own perspective types (or reuse other
perspective types), and then provide debug-representation commands for
those.

In order to make this work without coordination, it's necessary to
allow one to find all debug representation branches for a particular
type, and construct the required perspective types from the branch's
constraints (hence why they need to be nullary). Because this feature
is meant for debugging _only_, it can be done in debugging tools with
minimal support from the VM, and that way it needs not be exposed
as a regular reflection API.

## Documents

A document is a restricted and declarative language for providing
representations for a value. It's loosely based on HTML but with
a simpler layouting system (it requires a flex-box model, however).

The language is as follows:

    number(value: numeric)    -- any number
    text(value: text)         -- any text
    boolean(value: boolean)   -- any boolean

    plain-text(content: text) -- text with no semantics
    code(content: text)       -- text, but monospaced

    list(values: document[])
    table(header: document[], rows: document[][])

    flow(items: document[])
    row(items: document[])
    column(items: document[])

    fixed(width: integer, height: integer, content: document)
    positioned(position: point2d, content: document)

    group(collapsed: document, expanded: document)

    circle, ellipse, rectangle, line, polygon, polyline   -- svg shapes

> **NOTE:**
>
> Future versions of document _will_ include interactivity, but that needs
> a more well thought-out language because it brings in more threats.
> Interactivity is the base of allowing user-defined debugging tools for
> their own types, however.

The `group` layout is used in a similar fashion to Wadler's idea of layout
unions in the [A Prettier Printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)
paper, but in a slightly simpler and more restricted fashion. One can
provide a collapsed and an expanded representation, which the renderer
then decides on based on the current rendering context. This is intended
as a temporary layout document that should be replaced by a more generic
one based on goals and constraints in the future---since documents are
not yet intended to be stored, the risk of doing this is small.

Documents can be safely serialised as JSON to send to different processes,
and this is an _explicit goal_ of this document language. You should be able
to pass documents across processes and render them safely, which means that
you could use this to debug systems remotely as well.

## Threat model

Debug representations are important for allowing developers to debug
programs, however it can just as easily be used by attackers to circumvent
privacy protections. This proposal considers any piece of code included
in a program to be a potential attacker, so mitigations primarily address that.

Since we treat any piece of code as a potential attacker, that means that
no piece of code should have access to _read_ the contents of a `document`.
That makes `document`, as a Crochet type, essentially write-only from the
program's perspective. It's an opaque blob that you put things in and send
somewhere for rendering. This keeps the privacy guarantees that regular
Crochet code has today.

The other problem is with packages adding new perspectives to
`debug-representation` on types that they don't own. This is already a
problem in Crochet, and will be handled in terms of static analysis instead.
The VM will warn you of packages that add commands to types they don't
own so that you can have more control over it. In this case the problem
is worsened by debug-representations being ran automatically by the VM
when serialising a value for representation, however the use of capabilities
already mitigates the impact of possible attacks (these packages cannot
elevate their privileges).

Packages can create debug representations that are computationally
innefficient (on purpose or not). This proposal does not protect against
that. However, since the only use of this feature is in debugging tools,
in the playground, a "denial of service" attack at most can be the cause
of annoyance. The current proposal does not address ways of debugging
and finding these cases, as it needs to be tackled in a more generalised
way in a separate proposal.

This proposal does not change anything about who gets a constructing
capability and can, thus, invoke the debug representations. The proposal
is to add this to the VM itself, so whoever controls the VM also gets
the power of generating and reading debug representations. Because we
avoid any reflection features exposed to Crochet (or native) code,
this does not add any new ways of doing privilege escalation. The
command itself also does not receive any powerful capabilities, so
it's not possible to acquire more privileges from its execution.
