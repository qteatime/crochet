# crochet.core

The `Core` library provides the most basic features of Crochet,
which are likely to be used by every program in the language.

Several of these features will be extended _outside_ of the `Core`
library. For example, while `Core` will provide basic support
for numeric operations, such as arithmetic, the `Mathematics`
packages will extend this support to geometry, set theory, and
other more specific areas.

## Safety

All of the features provided by the `Core` package are safe
and "pure" (they compute new values, but do not cause any
observable effect, such as outputting things on the screen or
download/upload things to the internet).

Because of this, `Core` is included by default in every Crochet
program without any required additional effort, and without
creating any opportunities for attackers to mess up with
your computer or steal your data.
