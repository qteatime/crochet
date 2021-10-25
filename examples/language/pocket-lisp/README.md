# Pocket Lisp

An implementation of [Pocket Lisp](https://github.com/robotlolita/pocket-lisp), a toy Lisp dialect, implemented in Crochet. This example shows how one could approach parsing, testing, organisation, and modularity in Crochet.

The implementation is written in a "literate" style, where you're expected to read the commented source code as if it was a book, and is divided into four main parts:

- **The grammar** -- This defines how we should understand Pocket Lisp programs in text form and translate it to Crochet structures that we can use to make sense of the program. You'll want to start reading from `grammar/pocket-lisp.lingua` (`grammar/pocket-lisp.lingua.crochet` is automatically generated when you build or run the project---you might want to look at it if you're curious about how Lingua grammars translate into Crochet programs, but this file is not commented).

- **The virtual machine** -- This implementation of Pocket Lisp gives meaning to programs by specifying an imaginary Pocket Lisp computer---a "virtual machine". This machine works on representations of Pocket Lisp programs as trees. To understand the virtual machine you'll want to take a quick look at its internal data structures, in `source/0-types.crochet`, then read from `source/vm.crochet`.

- **The interactive shell** -- Or the REPL. This is a program that allows users to type Pocket Lisp programs interactively in the terminal, evaluate them, show the result, and then let users continue to provide more programs to it. Much like data science notebooks, but without graphical capabilities. The REPL shows some fun usages of algebraic effect handlers. You'll want to start reading from `source/repl.crochet`.

- **The command line interface (CLI)** -- In order to use any of these parts, users of the Pocket Lisp implementation would invoke them through the command line. The Pocket Lisp CLI is the thing that figures out what the user intended to invoke (by parsing the provided command) and translates that into the necessary actions to invoke the subcomponents. You'll want to start reading from `source/main.crochet`.

It's important to note that this example will assume basic familiarity with programming, parsing, recursion, multi-methods, [algebraic effects](https://robotlolita.me/diary/2018/10/why-pls-need-effects/), and [Crochet](https://github.com/qteatime/crochet/blob/main/docs/technical-overview.md).

> **NOTE:** The example is written in a functional style, as much of Crochet requires, but this functional style is significantly distinct from what is generally seen in languages like Haskell. This can be confusing if you're familiar with functional programming, but not object-oriented languages with heavy higher-order use. The problem is mostly due to Crochet's syntax and type system, but ideas they use are still the same.

## Running programs

You can run any example in the `examples/` folder as follows:

    $ crochet run crochet.json -- run examples/fibonacci.plisp

## The interactive shell

You can start an interactive shell for Pocket Lisp as follows:

    $ crochet run crochet.json -- repl

## Running tests

You can run the tests in the project as follows:

    $ crochet test crochet.json
