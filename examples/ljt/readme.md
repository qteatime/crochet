# LJT

LJT (pronounced /ˈla.ʒɔ.ta/) is a language for defining efficient serialisable formats that can evolve over _long_ periods of time—in the range of several years. It's suited for building serialisers and parsers for data formats that may outlive you, such as those for images, audio files, and programming language snapshots.

## Why another serialisation format?

LJT makes very different tradeoffs compared to tools that are meant to serialise shorter-lived data. For example, ProtoBuf is a wire serialisation format, and it optimises for cases where clients and producers can quickly synchronise and upgrade their schemas, so that older data formats might actually die.

LJT cannot "let older data formats die" because no one can control the rate at which clients upgrade their serialised data. Rather, it needs to be able to "upgrade just-in-time", such that applications can work on as few data formats as possible while _also_ supporting any historical formats that it has ever produced.

To do so, LJT borrows the prevalent concept of database migrations, and makes it available in the schema. This means that every type in the schema is fully versioned and immutable—once a type is declared it can never be removed or changed. Rather, changes are done by creating a new version of the type and, possibly, defining a migration strategy for it, if it can be migrated.

Not all types can be automatically migrated, so LJT also supports having multiple concurrent versions of a type at the same time, leaving it up to the application the task of facilitating the migration with user input.

Like in database migrations, the feature in LJT can both migrate older data to newer versions (so users can upgrade their application without losing access to their existing data), and migrate newer data to a restricted form in older versions (so users can take newly produced data and use it in older applications with a limited experience).

## Etymology

LJT (pronounced /ˈla.ʒɔ.ta/) stands for "Lightweight Just-in-Time Codec", but coined as a backronym over the source word "lajota". In Brazilian Portuguese, lajota" is often used to describe little flat stones that are used together, in a mosaic, to cover floors and what-not.

It's meant to keep the theme of Crochet's languages being derived from latin roots (although "Crochet" itself is Norse!), while also alluding to the idea of describing efficient serialisation as tiny components that can be put together to build complete codecs :>
