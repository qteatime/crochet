# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added debug representations with multiple perspectives [#37](https://github.com/qteatime/crochet/pull/37);

- Added `_ empty` command to `set`;

- Added Documentation section to launcher, which exposes the command line `docs` command in the launcher as well.

### Fixed

- Fixed the port of the launcher server when running from the CLI [6ac17ac704be634751a21006a387f413f94622c3](https://github.com/qteatime/crochet/commit/6ac17ac704be634751a21006a387f413f94622c3);

- Support running the `docs` command on packages that have `prelude` declarations.

## [0.13.0] - 2021-12-25

First public (experimental) release.
