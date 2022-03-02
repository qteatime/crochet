# Cobbles

Cobbles is a small language for describing data, their semantics,
and their evolution. Un a way that allows this data to be serialised and
shared while maintaining all of these definitions, everywhere.

## Contracts

Schema programming languages generally only allow you to describe
the shape of the structure, so you can control exactly how it's represented
in storage. That way, if you had to, for example, define a `Range` type
in ProtoBuf, you'd end up with the following definition:

    message Range {
      required int32 start = 1;
      required int32 stop = 2;
    }

This tells you that `Range` has two components, `start` and `stop`, which
both contain a 32-bit integer. You can reason about the memory layout of
this data, but not really about its _usage_.

Consider the case where `Range` has further restrictions: `stop` must be
greater or equal to `start`---that is, ranges can only grow towards positive
infinity. The way you achieve this in Schema languages is generally by
adding a comment and hoping that everyone who uses it abides by those rules:

    /* `stop` must be greater or equal to `start` */
    message Range {
      required int32 start = 1;
      required int32 stop = 2;
    }

But this often leads to communication problems, and it's difficult to
understand how these semantics got broken---and if one forgets to check
them, it could cause data to be corrupted.

Cobbles, instead, allows these representation descriptions to be enriched
with contracts---descriptions of the semantics of these values, and how
they relate to values around them. The equivalent Cobbles definition
would be:

    type Range {
      field start: integer;
      field stop: integer;

      invariant grow: stop >= start;
    }

`grow` is now checked by the Cobbles implementation, and guaranteed to
be enforced everywhere that uses `Range`.

## Type versioning

Many schema languages that are designed for evolution deal with the
problem by allowing things to be added (but not removed!) from existing
types. Cobbles takes a different approach: explicit versioning and
migrations.

For example, imagine we define the type of a query for a list of packages.
It could initially look like this:

    type Query {
      field search-for: text;
    }

Later on we realise that it would be better to have this paginated, so it
may be tempting to extend the `Query` type as follows:

    type Query {
      field search-for: text;
      field page: integer as p if p >= 0;
      field results-per-page: integer;
    }

This is not possible in Cobbles; all types are effectively final and
immutable once they're defined. You cannot extend them. There's no such
thing as "optional" fields, as you'd have in ProtoBuf. Instead, what you
do is create a new type: a new version of `Query`:

    type Query {
      field search-for: text;
    }

    type Query @ 2 {
      + field page: integer as p if p >= 0;
      + field results-per-page: integer;
    }

Versions are expressed as a diff, and here we're declaring that we make
a new version of `Query` by adding two new fields to it. This _does_
effectively leave us with two (2) `Query` types. One that only has one
field, and one that has three fields. `Query @ 2` can only serialise
and parse values of type `Query @ 2`, likewise, `Query` can only serialise
and parse the first version. So, from here, these types act as entirely
distinct, unrelated entities. In order to make them related we need to
include some "migrations": behaviours that allow us to move between
these types.

Revisiting our definition we end up with the following:

    type Query {
      field search-for: text;
    }

    type Query @ 2 {
      + field page: integer as p if p >= 0;
      + field results-per-page: integer;

      upgrade {
        page = 1;
        results-per-page = 10;
      }

      downgrade {}
    }

Now the `upgrade` block allows us to move from version 1 to version 2 by
setting some default values. Whenever parsing encounters a version 1 and
a version 2 is expected, the upgrade will kick in automatically once the
initial `Query` is constructed.

The `downgrade` allows data to move in a different direction, so that users
that are still relying on an older version of the type can use it.

It's important to note that `Query` and `Query @ 2` are still two entirely
distinct types, even with the migration blocks. The only thing we've added
is enough knowledge for the Cobbles runtime to automatically convert between
them if the context requires. This is important because Cobbles is designed
for _cold storage_---it's designed mainly for serialising program data and
code and allowing future VMs, uncoordinated, years from now, to always be
able to decode past versions and do something useful with it, regardless
of how these formats may have changed in the meantime.

These kind of issues tend to happen more when semantics of fields change.
For example, we might realise that `integer` is a bit too broad of a type
for the `results-per-page` field:

    type Query {
      field search-for: text;
    }

    type Query @ 2 {
      + field page: integer as p if p >= 0;
      + field results-per-page: integer;

      upgrade { page = 0; results-per-page = 10 }
      downgrade {}
    }

    type Query @ 3 {
      ! field results-per-page: integer as r if r in (10, 20, 50);

      upgrade from 1 { page = 0; results-per-page = 10 }
      downgrade { }
    }

This time there's no automatic upgrade from `2` to `3`. We've forked the
space of types, and applications need to deal with the legacy version 2
in the way they see fit in their context, as a transition to version 3
cannot be safely done in all cases.
