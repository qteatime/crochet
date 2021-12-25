# Crochet

> **NOTE:** Crochet is in early stages of development, there will be a lot
> of breaking changes here as I figure out what kind of language fits the
> games I want to create, and how to generalise that.

Crochet is a tool designed for creating and remixing interactive media safely.
It is best thought as targeting the domains of Interactive Fiction, Simulation
Games, Software Verification, and Interactive/Live Language Tooling.

## Documentation

The documentation books on Crochet are a work in progress, you can find
them in [the Crochet documentation website](https://crochet.qteati.me/docs/).

Currently there's:

- A reference book, which discusses the concepts and design philosophy of Crochet;
- A syntax cheatsheet, which just lists all syntactical forms with examples; and
- A contribution book, which describes how to contribute to Crochet.

## Installing Crochet

For now, you can install Crochet from npm. You want the `@origamitower/crochet`
package with the experimental flag:

```shell
$ npm install @origamitower/crochet@experimental
```

You can also compile it from source:

```shell
$ git clone https://github.com/qteatime/crochet.git
$ cd crochet
$ npm install
$ node make build
```

See `crochet --help` (or `./node_modules/.bin/crochet --help` if you've installed it locally) for usage information.

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

## API Reference

You can get a reference documentation page on any package by using the
`docs` command. E.g.:

```shell
$ crochet docs <path/to/crochet.core/crochet.json>
```

You'll be able to navigate through the documentation by accessing
http://localhost:8080 in your browser.

## Running packages

You can run a Crochet package on the terminal by using the `run` command.
E.g.:

```shell
$ crochet run <path/to/your/crochet.json> -- argument1 argument2
```

Anything after `--` is passed as the invocation arguments as-is to your
package. You must provide a command called `main: _`, where the only
parameter will be this list of command line arguments.

## Licence

Copyright (c) 2021 Q.  
Licensed under the permissive MIT licence.
