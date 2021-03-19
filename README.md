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

## Building

Crochet is written in TypeScript, but uses a small tool written in F# for
generating the typed PEG grammar. So you'll need both Node and .NET 5 installed.

First, build Linguist (the typed PEG grammar tool):

```shell
$ cd Linguist
$ dotnet restore
$ npm install
$ npm run build-grammar
$ npm run build
```

Then build Crochet (make sure you're back at the root of the repository):

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

## PL Details for PL People

The language Crochet uses is a mix of Logic, Functional, and Object Oriented
programming. In essence:

- There's a logic DSL featuring classic relational logic and a system of
  typing facts that treats them as a path in a tree, allowing users to
  declare the number of values allowed at each step. This mainly gets rid
  of the need to explicitly negate facts, as new facts automatically replace
  old ones for steps that only allow one value.

- There's a small "functional" language in the outer side: expression-based,
  mostly pure (the tree of facts is a global mutable database), based on
  continuations, and (eventually) supporting algebraic effect handlers for
  tracing, exploration, and re-playing games from traces.

  There are no lambdas, however, only a very restricted form of partial
  application. This is a conscious choice in order to more easily support
  an IDE that allows writers to live-program their games.

- Finally, a lot of the language is based on objects, subtyping, and
  multi-methods. There's no multi-inheritance, and dispatch chooses the
  most specific branch to evaluate.

There's a lot that still needs to happen on the language design front, but
I'm currently priorising finishing and publishing my games before I tackle
some of the more "interesting" problems.

The current VM implementation is pretty much a CESK machine on top of
JavaScript's weird delimited continuations (by way of generators) and
absolutely no optimisation whatsoever. There are a few optimisations that
I want to apply when I have the time, like using polymorphic inline caches
to support incremental searches, as most facts remain constant throughout
the game.

## Licence

Copyright (c) 2021 Q.  
Licensed under the permissive MIT licence.
