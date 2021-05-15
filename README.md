# Crochet

> **NOTE:** Crochet is in early stages of development, there will be a lot
> of breaking changes here as I figure out what kind of language fits the
> games I want to create, and how to generalise that.

Crochet is a small engine for building, mainly, story and AI-driven simulations,
particularly turn-based and text-based ones. This means that Crochet would work
great for building Interactive Fiction games with AI-controlled NPCs, as well as
Rogue-like games with a large amount of procedurally-generated content.

The goal is to have Crochet eventually support building games that are less
turn-based as well, such as The Sims-style games, but that's not currently
feasible.

## Documentation

There's not much documentation on Crochet currently (there will be more efforts
towards this before the public release), but you can read:

- [An overview of Crochet](./docs/README.md)
- [A technical overview of Crochet (for professional programmers)](./docs/technical-overview.md)
- [The (tentative) project roadmap](./docs/ROADMAP.md)

## Running

For now, you can install Crochet from npm:

```shell
$ npm install @origamitower/crochet
```

See `crochet --help` (or `./node_modules/.bin/crochet --help` if you've installed it locally)
for usage information.

## REPL

There's a basic command-line based REPL currently which you can run with:

```shell
$ crochet repl <path/to/your/crochet.json>
```

You do need to specify a package currently because that's how Crochet tracks
dependencies and capabilities. All code you type in the REPL will be executed
in the context of the given package. And all dependencies of that package
will be loaded first.

The REPL accepts both declarations and statements/expressions. Multi-line
input currently works by allowing the reporting of a parser error to be
delayed until an empty line is entered.

E.g.: if you type `define hello =` and press return, you'll get a "continuation
input" (marked with `...`), since that piece of text is not a complete `define`
declaration. Typing the rest of it, e.g.: `"hello";` will then allow the
declaration to be executed. Entering an empty line by just pressing return
will accept the partial declaration and present the parser error on the screen.

## Building

Crochet is written in TypeScript, so you'll need Node installed. To build
Crochet, run the following at the root of the repository:

```shell
$ npm install
$ npm run build
```

To make sure you've got Crochet built correctly, you can run any of the
examples in `examples/features`:

```shell
$ node crochet.js run examples/features/search.crochet
```

Try also running some of the web games with:

```
$ node crochet.js run-web examples/web-games/cloak-of-darkness
```

## Licence

Copyright (c) 2021 Q.  
Licensed under the permissive MIT licence.
