The `Core` package provides the most basic features of Crochet,
and is likely to be used by every other program in the language.

It is expected that many of the types and features introduced
here will be extended _outside_ of the `Core` package. For
example, while here we provide basic support for numeric
operations, such as arithmetic, the `Mathematics` packages
will extend this support to geometry, set theory, and other
more specific areas.

# Structure

Because `Core` isn't focused on solving a specific problem, but
rather provide a set of building blocks that are common to many
applications, it may feel confusing and overwhelming to just look
at the types and commands defined here. So understanding how things
are structured is the first step.

`Core` is divided into several _categories_. Each of these categories
provides basic support for some specific problem.

## Numeric modelling

`Core` provides a very basic support for dealing with numbers. The
root of this modelling is [type:numeric], and all numeric types are
expected to extend it.

Within [type:numeric] we have two broader categories of types:

- [type:integral] is the base type for all whole numbers, such as `1234`.
  There's only one integral type that `Core` provides: [type:integer].
  The integer type represents any whole number precisely, at the cost of
  using more memory and computational power.

- [type:fractional] is the base type for all numbers that may contain
  fractions, such as `1234.5`. There's only one fractional type that
  `Core` provides: [type:float]. This is a 64-bit IEEE-754 floating
  point value—it supports representing many numbers, but as
  approximations. And these approximations become less and less
  precise as the number grows bigger, just so we can guarantee that
  it'll use a fixed amount of memory (64-bits).

## Textual modelling

Support for text is likewise very basic in `Core`. The root of this
modelling is [type:unsafe-arbitrary-text], which represents any piece
of text as an opaque blob. Core then divides text further into a
**trust hierarchy**—granting some protection against potentially
malicious pieces of text.

Text coming from the outside should be regarded (and represented) as
[type:untrusted-text]. This means that the piece of text is potentially
malicious, and extra care needs to be taken when using it.

Text originating from inside of the Crochet program is represented as
[type:text]. With text that exists as a literal in the program ending
as the type [type:static-text], and text that is computed while the
program executes being given the type [type:dynamic-text]. These are
considered **trusted** pieces of text, as they originate from a known
source.

When untrusted pieces of text are involved, the only affordances that
Crochet gives are either passing them around, or combinining them. Either
through the [command:_ ++ _] command or the interpolation syntax (e.g.:
`"here: [some-text]"`). Both result in an [type:interpolation] being
constructed.

### Textual views

For trusted pieces of text, more affordances are given. However, because
pieces of text can have very different semantics, in order to work with
them one must first acquire a "text view". Which basically means the
semantics we expect are more explicit. `Core` provides the following
views:

- [command:_ ascii] creates a [type:ascii-view]. This assumes that the
  text only contains characters that are within the ASCII subset, so
  even text in, e.g.: Portuguese, would likely be rejected by it. Many
  pieces of text meant only for computers can be considered ASCII-only,
  and some operations only make sense in that case.

- [command:_ lines] yields a list of text for each line in the input.

- [command:_ unicode-code-points] yields a list of unicode code-points
  for the input.

### Managing trust

Whenever you have [type:untrusted-text], you'll need to make it trusted
before you'll be able to operate on it. One way to do so is to use any
of the `Parsing` packages in Crochet to make sure the semantics of the
piece of text are known and fixed.

It's also possible to acquire the [capability:untainting] capability
and use the [type:untaint] global binding to turn an untrusted piece of
text into a trusted piece of text. But special care needs to be given
here as many security vulnerabilities arise from allowing untrusted
text to be mixed with trusted text without full control and knowledge
of its semantics.

## Logic and ordering

Crochet makes heavy use of boolean logic, [type:boolean] is the
root of this hierarchy, which also contains [type:true] and
[type:false] as distinct singleton types.

Functions that consider ordering of values are, likewise, served
by the more restricted type [type:ordering].

## Handling errors

Crochet makes several distinctions about what an "error" means in a
program. For describing unsupported operations or values, the recommended
way is to model it as a Contract, through pre and post-conditions. These
more readily communicate the intent to users of the operation, as well as
to the Crochet compiler.

Sometimes, writing a good contract isn't really feasible. The remaining
unsupported operations and values can be handled by halting the program
with a panic message. The singleton type [type:panic] provides commands
for this.

Some errors are, however, _expected_. For these cases Crochet encourages
representing them explicitly in a type hierarchy. The type [type:result]
exists to simplify this when special semantics are not needed. A result
can either be of type [type:ok], if everything went as expected, or type
[type:error], if something went wrong.

## Collections

`Core` provides very basic support for common collections. All of the
collections provided by this package are persistent—meaning that
you can only change the collection by creating a new one, and the
implementation makes this as efficient as possible.

The following collections are provided:

- [type:list] is a persistent vector, with support for appending and
  prepending items efficiently, as well as accessing items in any order.

- [type:record] is an immutable, extensible record—all keys are plain
  pieces of text. The current implementation does not support efficient
  changes, and requires duplicating the whole record.

- [type:set] is a persistent set, with support for efficiently adding
  items and testing if an item exists in the set.

- [type:map] is a persistent mapping of keys to values, with support for
  arbitrary keys, and efficient adding or accessing of key/value pairs.

- [type:stream] is a persistent stream, currently implemented as a lazy
  linked list (in [type:linked-stream]). Streams naturally fuse their
  operations and use constant memory, but cannot be changed.

- [type:linked-list] is a persistent linked-list, with support for
  more efficient prepending of items, but requires accessing items in
  the way they're ordered.

## Mutable state

`Core` is mostly a pure library, but it provides support for (local)
mutable state through the type [type:cell]. A cell is a small piece
of memory that can be changed at will, through [command:_ <- _] or
[command:_ compare: _ and-set: _]. Both are guaranteed to happen
atomically.

These values in the cell can be passed along as regular immutable
values, or the cell can be passed around in read-only mode, by
constructing a [type:read-only-cell]. This allows others to observe
the changes in the value, but not affect it.

## Traits

`Core` ships with an extensive selection of basic traits, which all
have implementations for the basic types.

- [trait:equality] and [trait:total-ordering] deal with comparing values.

- [trait:bounds] and [trait:enumeration] deal with the idea of sequential
  values and ranges.

- [trait:boolean-algebra] deals with logical comparisons and combinations.

- [trait:arithmetic] and [trait:rounding-strategies] deal with numbers.

- [trait:container], [trait:countable-container], [trait:modifiable-container],
  [trait:mapped-container], [trait:modifiable-mapped-container], and
  [trait:mergeable-mapped-container] deal with the idea of arbitrary
  collections of values, like maps, sets, and lists.

- [trait:sequence], [trait:appendable-sequence], [trait:finite-sequence],
  [trait:indexed-sequence], [trait:modifiable-indexed-sequence],
  [trait:growable-indexed-sequence], [trait:sortable-sequence],
  [trait:reversible-sequence], and [trait:sliceable-sequence] deal with
  the idea of collections of _ordered_ values, like lists, but unlike
  sets or maps.

- [trait:foldable-collection], [trait:filterable-collection],
  [trait:mappable-collection], [trait:chainable-collection],
  and [trait:zippable-collection] deal with the idea of collection in
  terms of _operations_, rather than their concept. This is more in
  line with mathematical ideas from abstract algebra, where we think
  about things in more abstract terms consisting of laws and operations,
  rather than their _meaning_. So these generally apply to all collection
  types, but may vary wildly on what you should expect—each implementation
  can _re-interpret_ the meaning.

- [trait:set-algebra] deals with the idea of sets, and things that can be
  viewed as sets in a reasonable way.
