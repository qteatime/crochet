# Crochet's Roadmap

This is a very high-level overview of the direction I aim to push Crochet
towards. The overall design goal is to build a tool that fosters a
remixing community, where people can collaborate and experiment with
other people's code without having to worry about their security and
privacy; and that includes non-professional programmers.

The following sections are divided into milestones.

## 0. Crochet for Interactive Fiction

The initial design goal for Crochet was to build a tool for writing
interactive fiction. This is still a main goal, and it's the goal of
the first public (stable) release.

At this point I'm less interested in proving security properties, and
more interested in exploring ways in which the tool can feel nice to
use for this goal.

The rough expectations here are:

- [ ] A fully-functioning Crochet VM (see core language in the language overview);
- [ ] A tool for managing Crochet projects, CLI-based (compiling, REPL, running, templating);
- [ ] A reasonable collection of basic packages (mostly wrapping JS ones):
  - [ ] Core types (tuple, record, boolean, integer, float, result, function, text, thunk);
  - [ ] Collections (linked lists, sets, maps);
  - [ ] Mathematics (trigonometry, geometry);
  - [x] PRNG (currently a xorshift);
  - [x] Debugging (transcript, tracing, timing);
  - [ ] An HTML-based UI for interactive fiction (including images and animation);

## 1. Crochet for Language Tools

This step will have Crochet acquire some better support for writing
language tools. The reason this comes very early is because I envision
a Crochet ecosystem mostly made up of DSLs, and in order for this to
work writing and using DSLs must be a very low-effort activity (and
deliver consistent experience!).

The aim here overlaps a lot with language workbench tools. We want things
like syntax highlighting, structual editing, REPLs, and etc. to be automatically
derived from language definitions and be consistent across all different DSLs.

Rough expectations:

- [ ] A parser generator for Crochet (PEG w/ left-recursion, compositional);
- [ ] Support for common formats (JSON, YAML, XML, Esqueleto\*);
- [ ] Composable schemas;
- [ ] Generic tree-based selection and transformation + zippers;
- [ ] Support for incremental patterns (both in parsing and compilation);
- [ ] Support for binary data;
- [ ] Proper pretty-printing (this has to work with non-fixed width, so constraint-based);
- [ ] A safe imperative dialect for native extensions;
- [ ] A safe dialect for command line interfaces;
- [ ] A safe dialect for defining serialisation and deserialisation of binary data;
- [ ] A rich REPL in addition to the console one;
- [ ] Algebraic effects;

## 2. Crochet for Automation

This step will improve Crochet's support for automating tasks. This is
actually important before Crochet can be used for software verification, as
models will be verified out-of-process.

Rough expectations, cross-platform:

- [ ] "safe" shell execution;
- [ ] Sandboxed and non-sandboxed file systems;
- [ ] Safe http and websockets clients;
- [ ] Proper temporal support;
- [ ] Proper internationalisation support;
- [ ] OS introspection;
- [ ] Generic I/O (i.e.: not restricted to terminal, automatically adaptable to context);

## 3. Crochet for Software Verification

This step will improve Crochet's usage for software verification, which also
happens to be an important part of writing AI-heavy interactive fiction (you
want to explore different play throughs of the game and ensure that players
won't get stuck---continuation issues are, of course, out of scope).

Rough expectations are:

- [ ] Proper support for property-based testing;
- [ ] Support for bounded exhaustive testing;

## 4. Crochet for UI

This step will improve Crochet's usage for building more flexible kinds of
user interfaces. This is important in order to move more tools to be written
in Crochet, and allow a Crochet IDE to be truly safe in the presence of
arbitrary extensions.

Rough expectations are:

- [ ] Active views (e.g.: values in synchronous languages like Lucid);
- [ ] A functional, declarative UI language with dynamically scoped effects;
- [ ] HTML and (limited) terminal support for renderers;
- [ ] Restricted constraint-based layouting with a flex-box approach;
- [ ] Electron support;
- [ ] Structural editors for Crochet's CLI tools;
- [ ] A Crochet IDE with safe user-written extensions;

## 5. Crochet for 2d games

This step will aim to allow Crochet to be used for more general 2d games
that want a safe and flexible approach to both writing the game itself
or integrating dialogue/AI.

Rough expectations are:

- [ ] (possibly) A Rust-based VM for integration outside of the browser;
- [ ] A proper specification for the core language;
- [ ] Optimisation efforts (tree prunning, incremental execution, message splitting, PICs, etc.);
- [ ] Wrapper over PIXI as the primary renderer supported (small API surface means it's easier to audit :x);
- [ ] (possibly) integrations with common engines like Phaser, GDevelop, but no guarantees of safety there;
