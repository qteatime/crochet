# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

- Changed `crochet.debug`'s API to require tags for all logging entries (required for proper tracing);

- Renamed `float` to `float-64bit`, and FFI's `float` to `float_64`, to make it more explicit that these are sized types - [#50](https://github.com/qteatime/crochet/pull/50);

- Dynamic operations on records has been removed from the language - [#52](https://github.com/qteatime/crochet/pull/52);

- The DSL sub-language has been removed as well - [#54](https://github.com/qteatime/crochet/pull/54);

- Removed the previous launcher ([#66](https://github.com/qteatime/crochet/pull/66)) and replaced it with a new Playground tool that covers the use case of interactive programming ([#71](https://github.com/qteatime/crochet/pull/71)). The new Playground tool also supports running Node projects ([#73](https://github.com/qteatime/crochet/pull/73));

- Changed `enum` semantics so that they're qualified by default, and added a `_ to-enum-text` and `_ from-enum-text: _` commands to enums - [#70](https://github.com/qteatime/crochet/pull/70);

### Added

- The launcher will now ask the user to trust new or modified capabilities for a package - [#46](https://github.com/qteatime/crochet/pull/46);

- Added support for named and extending `new` operations. I.e.: `new point(x -> 1, y -> 2)` and `new point(P with y -> 3)` - [#45](https://github.com/qteatime/crochet/pull/45);

- Added highlights to keyword command names in VSCode to make them easier to tell apart from other syntactical elements;

- Added tracing support for the functional part of the VM, allowing users to build their own debugging tools - [#43](https://github.com/qteatime/crochet/pull/43);

- Added debug representations with multiple perspectives - [#37](https://github.com/qteatime/crochet/pull/37);

- Added `_ empty` command to `set`;

- Added `_ from-nullable: _` command to `result`;

- Added `_ collect-fold-from: _ with: _` and `_ collect-fold-right-from: _ with: _` commands to `foldable-collection`;

- Added `_ find-first: _` and indexing commands (`_ second`, `_ third`, ...) to `finite-sequence`;

- Added support for sealing and unsealing types through `unknown`;

- Added Documentation section to launcher, which exposes the command line `docs` command in the launcher as well;

- Added basic support for concurrency - [#49](https://github.com/qteatime/crochet/pull/49);

- Added a data-flow-based UI library called Agata, currently only supporting WebBrowser rendering - [#55](https://github.com/qteatime/crochet/pull/55);

- Added a safe URL type - [#58](https://github.com/qteatime/crochet/pull/58);

- Added an HTTP client for WebBrowser contexts, based on `fetch` - [#59](https://github.com/qteatime/crochet/pull/59);

- Added custom serialisation and parsing support to the JSON package with an extended form of JSON - [#60](https://github.com/qteatime/crochet/pull/60);

- Added an intrinsic `internal` capability to all packages, along with the internal `package` type, which allows packages to better deal with protecting and accessing their resources - [#61](https://github.com/qteatime/crochet/pull/61);

- Added minimal support for compiler plugins, currently in the form of compiler-defined macros - [#62](https://github.com/qteatime/crochet/pull/62);

- Added a WebSockets client for WebBrowser contexts - [#63](https://github.com/qteatime/crochet/pull/63);

- Added support for extensible records, but without the expected memory optimisations (they do a full copy of the previous value) - [#65](https://github.com/qteatime/crochet/pull/65);

- Added a new type for marking and sealing secret data, reducing the likelyhood of leaking them - [#59](https://github.com/qteatime/crochet/pull/59);

- Added support for optional capabilities, allowing packages to work with smaller sets of capabilities by default, and avoiding the cases of requiring a capability just to propagate it to an underlying package, even when you don't rely on any of the capability-protected features - [#67](https://github.com/qteatime/crochet/pull/67);

- Added a new abstraction for effect handlers, which should replace the idea of using functions to abstract over them. The new abstraction supports merging handlers and automatically installing them, as well as more direct control through capabilities - [#68](https://github.com/qteatime/crochet/pull/68);

- Added minimal support for local aliases for types and traits. This will be expanded in the future - [#69](https://github.com/qteatime/crochet/pull/69);

### Fixed

- Capabilities, types and traits can now be defined out of order/circularly within a package - [#47](https://github.com/qteatime/crochet/pull/47), [#48](https://github.com/qteatime/crochet/pull/48);

- Improved launcher's design---playground is now more responsive;

- Fixed the port of the launcher server when running from the CLI;

- Support running the `docs` command on packages that have `prelude` declarations.

## [0.13.0] - 2021-12-25

First public (experimental) release.
