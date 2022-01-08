# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

- Changed `crochet.debug`'s API to require tags for all logging entries (required for proper tracing).

### Added

- Added support for named and extending `new` operations. I.e.: `new point(x -> 1, y -> 2)` and `new point(P with y -> 3)` - [45](https://github.com/qteatime/crochet/pull/45);

- Added highlights to keyword command names in VSCode to make them easier to tell apart from other syntactical elements;

- Added tracing support for the functional part of the VM, allowing users to build their own debugging tools - [#43](https://github.com/qteatime/crochet/pull/43);

- Added debug representations with multiple perspectives - [#37](https://github.com/qteatime/crochet/pull/37);

- Added `_ empty` command to `set`;

- Added `_ from-nullable: _` command to `result`;

- Added `_ collect-fold-from: _ with: _` and `_ collect-fold-right-from: _ with: _` commands to `foldable-collection`;

- Added `_ find-first: _` and indexing commands (`_ second`, `_ third`, ...) to `finite-sequence`;

- Added support for sealing and unsealing types through `unknown`;

- Added Documentation section to launcher, which exposes the command line `docs` command in the launcher as well.

### Fixed

- Improved launcher's design---playground is now more responsive;

- Fixed the port of the launcher server when running from the CLI;

- Support running the `docs` command on packages that have `prelude` declarations.

## [0.13.0] - 2021-12-25

First public (experimental) release.
