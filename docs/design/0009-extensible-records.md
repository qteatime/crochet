# [#0009] - Extensible typed data

|                  |                  |
| ---------------- | ---------------- |
| **Authors**      | Q.               |
| **Last updated** | 8th January 2022 |
| **Status**       | Draft            |

## Summary

Constructing typed data currently only allows positional arguments. As
types grow more complex, they also become unreadable in the constructor:

    type player(x, y, speed, visible);

    new player(0, 0, 2, true); // what does this even mean???

Though this can be addressed with tooling to some extent, allowing users
to provide named parameters would be an immediate help:

    new player(x -> 0, y -> 0, speed -> 2, visible -> true);

And this opens the possibility for extensible typed data. Due to all
types in Crochet being effectively immutable, any changes to a type
require reconstructing it. For larger types this becomes cumbersome
again:

    command player x: New-x =
      new player(New-x, self.y, self.speed, self.visible);

Adding new fields to types is also problematic, as you now need to
change every construction site, even if the new field is mostly
irrelevant in this case.

Once we have named parameters, we can also base the new type on a
small difference provided by the user:

    command player x: New-x =
      new player(self with x -> New-x);

## Language

This proposal extends the expression language with the following:

    Expression e ++=
      | extend-instance(type : Type, instance : CrochetValue, fields : Pair[])
      | extend-record(instance : CrochetValue<Record>, fields : Pair[])
      | new-named(type : Type, fields : Pair[])

With the following (very roughly written) semantics:

    eval(extend-instance e) =
      assert capabilities for constructing e.type
      assert e.instance is e.type
      assert all keys of e.fields are valid in e.type
      instantiate e.type, using e.instance for base values
      override the instance slots with the ones given by e.fields

    eval(extend-record e) =
      e.instance merge: (record from e.fields)

    eval(new-named e) =
      assert capabilities for constructing e.type
      construct a base instance of e.type
      populate instance slots by looking up e.fields in the layout

## Discussion

This proposal is very limited. You need to know the type of the value you're
constructing in order to construct it. The reason for this is to aid
static analysis, not for capability security---we could just check if one
has the constructing capability for the underlying type at instantiation
time (and we do exactly that here already).

There are no real changes to the powers granted to programs. Rather, this
proposal provides a set of conveniences for achieving things that are already
possible today.

The addition of `extend-record` here is just so we can _actually_ move to
extensible records in a future version. Records in Crochet are currently
too powerful (and not powerful enough! they're basically a worse `map<k, v>`),
and the current reflection API on them causes problems for both type
checking and security.

Plus, by having records be less dynamic we'll be able to extend dispatch to
include record _shapes_, too, in unambiguous ways.

## Optimisation

The initial implementation of this proposal will not bother with optimisations,
however, given the static nature of Crochet's types, a closed-world compiler
can optimise construction of known types at compile time, translating all
`new-named` and `extend-instance` instructions into plain `new` instructions,
which means figuring field saturation and layout needs not be performed at
runtime.
