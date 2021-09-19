# A Technical Overview of Crochet

Crochet is a programming system that contains many programming languages.
The core languages in this system are, incidentally, also called Crochet.

## Project goals

The primary goal of Crochet is to have a secure programming platform that
can both be used by non-professional programmers, and allow a community
of creative remixing of programs to flourish. The premisse here is that
creative collaboration and remixing requires security.

While Crochet can be classified as a "general-purpose programming system",
it's more useful to think of Crochet as specialising in the following
domains:

- Interactive fiction (IF, visual novels, RPGs, etc)
- Software verification (stochastic and bounded model checking)
- Cross-platform automation (including connecting online services/apps)
- Procedural generation (roguelikes, Twitter bots, etc)
- Language tools (parsers, compilers, IDEs, REPLs, etc)

## The Crochet languages

The Crochet project has a few main programming languages, since it relies
on the idea of language-based programming (where languages are DSLs):

- Lingua (a language for describing parsers using PEG)
- Clara (a language for describing command line interfaces)
- Novella (a language for describing interactive fiction UI)
- Esqueleto (a language for describing tree-based content)
- Finé (a language for safely describing interactions between language boundaries)
- Ágata (a language for describing UIs)
- Neve (a closed world, typed language for describing low level computations)
- Surface Crochet (the main Crochet language exposed to users)
- Core Crochet (the language executed by the Crochet VM)

As the first four in that list are still not very well-developed, this
document will instead focus on Surface and Core Crochet, which will be
called just "Crochet" for the rest of this document.

## Crochet in a Nutshell

Crochet is a programming language with features influenced by
functional programming, object-oriented programming, and relational logic
programming.

In essence, Crochet has:

- Types and objects (roughly similar to classes and objects);
- Multi-methods (methods that dispatch on all arguments, not just "this");
- First-class functions (and closures, but closures are avoided to support live programming);
- Cute-based partial application (e.g.: `(2 - _)(1)` is the same as `2 - 1`);
- First-order and higher-order contracts (higher-order not implemented yet);
- Parametric polymorphism (not implemented yet);
- A gradual type system that favours concrete witness-based error reports;
- Object-capability security and a static form of capability security;
- Algebraic effect handlers (not implemented yet);
- Tail calls (not implemented yet, but the stack is infinitely growable);
- Selective laziness (with explicit lazy/force);
- Arbitrary precision arithmetic by default (better numeric tower eventually);
- First-class interpolation (i.e.: interpolation does not collapse to strings);

The less common features of Crochet are in its relational logic part, which is
still largely a work in progress. Currently it contains:

- A global database of facts, organised as a tree with steps having typed multiplicities;
- A native search operator for this database based on an extended relational logic (which sadly prevents backwards chaining);
- A system of describing actions, events, goals, and invariants (invariants are not implemented yet);
- A simulation system that allows goals to be explored based on described actions and events;

## Crochet's values

By default, Crochet provides:

- Arbitrary precision integers: `1_000_000_000_000_000_000` (`integer`);
- IEEE-754 64-bit floating points: `1_000.05` (`float`);
- Booleans as an ADT: `true` and `false` are singleton types extending `boolean`;
- A somewhat opaque textual type (`text`);
- A first-class interpolation type (`interpolation`);
- First-class function types (`function`, and the specific `function-<N>`, where `<N>` is the arity);
- Fixed-size sequences of mixed types: `[1, "2", true, 4]` (`tuple`);
- Extensible records: `[a -> 1, "hello" -> 2, B -> 3]` (`record`);
- The no-useful-value type (`nothing`, a singleton);
- The gradual un-types (`any` accepts anything, `unknown` boxes generic things);
- The lazy computation type (`thunk`);

Core additionally provides a mutable cell (`cell`) and a result ADT (`result` with `ok` and `error` cases). Along with a `representation` module.

## Crochet's types

Crochet's idea of a type is a bit different from most languages. In Crochet,
a "type" is:

- A way of granting _dynamic_ capabilities---types are the sole grantors
  of dynamic capabilities. What a piece of code can do depends entirely
  on which types it has access to.

- A way of doing dispatch (selecting which operation to execute). This
  means that commands are namespaced by the collection of types they
  require (and that's also the sum of the capabilities they require to
  run). It also means that types work as modules naturally.

- A way of classifying a sum and product of data---a runtime tag.
  One-of (sums) are modelled through inheritance
  (which gives you open sums), and
  records (products) are modelled as types with arguments. Secure
  field access is a work in progress as currently you can only
  grant capabilities on the whole type basis;

- A description of coercion rules: Functions may declare that they
  accept values "coercible to" a type, and any type `T` with the `T as U`
  capability may be used where a `coercible to U` is expected. Coercion
  rules are implemented, but coercible dispatch is not currently implemented.

- A description of refinement rules (refinement contracts). A type like
  `integer` represents all possible integers. But a type like
  `i:integer if i >= 0 and i <= 255` only covers integers that are
  on the byte range. Refinements are not currently implemented, but
  are planned.

### Type declarations

The simplest type declaration is as such:

```
type my-type;
```

And this can be instantiated as such:

```
let Value = new my-type;
```

A type that has fields looks like this:

```
type my-type(arg1, arg2 is integer);
```

Likewise, this can be instantiated as such (named fields are planned, but
not yet implemented):

```
let Value = new my-type("hello", 1);
```

In this case, because `arg1` does not have an explicit contract annotation,
it gets assigned the contract `any`, and thus accepts any value to be stored.
Note that annotations are _contracts_, not _types_. Contracts are extensions
to types which play no role on capabilities or dispatch. Therefore, it's legal
(though not yet implemented) to have a contract such as `arg2 is integer | float`
for a field that accepts one or the other. As is valid to have something such
as `arg2 is i:integer if i >= 0 and i <= 255`.

An hierarchy of types may be created by extending a type. Hierarchies are
mostly relevant for dispatch, as the dispatch rules will pick the single
most specific type (and allow no ambiguous dispatch).

```
type result;
type ok is result(value);
type error is result(reason);
```

Again, these are instantiated as before:

```
let Ok = new ok(1);
let Error = new error("nope");
```

This is similar to Haskell's `data Result = Ok any | Error any`, with the
difference that `Ok` and `Error` are fully fledged types, rather than just
tags inside of the `Result` type.

### Abstract types

When creating hierarchies of types, it's often useful to disallow people
from instantiating non-useful types. In the previous example, a more idiomatic
way would be to mark `result` as an abstract type, which allows no instantiation:

```
abstract result;
type ok is result(value);
type error is result(reason);
```

No other piece of code needs to change, as the semantics of other types are
not affected. However, from here on any instance of `new result` would be
disallowed, throwing an error at runtime (or showing the error in static
checking mode---not implemented yet).

### Foreign types

Types may be provided by native extensions as well---they are forced to
follow the same semantics, so really the only reason here is to have types
that an extension knows about, in which case it's possible to write typed
code _inside_ of the extension as well.

A foreign type is declared as such:

```
type my-type = foreign namespace.my-type;
```

Foreign types (and foreign declarations in general) are made less unsafe by
restricting the namespaces that a module sees to the ones introduced by the
native sources of the package itself. Thus it's not possible, for example,
for a `random.package1` to abuse this feature to access
`crochet.file-system` types, getting around not being granted file system
capabilities.

### Singleton types

A singleton type is a pattern where there is only one useful, global instance
of a type. Non-parametric modules/namespaces are a common example. In the
standard library, the type `representation` works precisely like this. It
only exists for the purpose of namespacing commands that compute a textual
(or other) representation of a value, for things like showing it in the REPL.

Singleton types could be written as such:

```
type representation;
define representation = new representation;
```

But Crochet has a declaration syntax for them:

```
singleton representation;
```

Will desugar to roughly the above (with the addition of sealing the type to
prevent further instantiation).

Singleton types may also optionally take a block of facts and
commands. This can make writing some modules less of a chore by not
having to type the name of the module all the time.

```
singleton my-module with
  command one = 1;
  command two = self one + 1;
end
```

Will desugar to:

```
type my-module;
define my-module = new my-module;
seal my-module;

command my-module one = 1;
command my-module two = self one + 1;
```

### Static types

Mostly, types are instantiated. But sometimes it's useful to treat types as
a value as well. Static types exist for this, and also work with abstract
types. They cover patterns like making modules of static/constructor functions
that are better attached to an abstract type.

Consider our result type:

```
abstract result;
type ok is result(value);
type error is result(value);
```

We may want to provide constructors for `ok` and `error` rather than exposing
the `new` capability on them. But `result` is an abstract type, so there's no
instance of it that we could use for dispatch. We _could_ create a separate
singleton type to host those commands, but this generally increases the surface
of capabilities one has to reason about, so this should be more of an intentional
separation of capabilities than an accidental "forced by my language's limitations"
one. The solution in Crochet is to use static types for dispatch:

```
command #result ok: Value = new ok(Value);
command #result error: Reason = new error(Reason);
```

The `#` sign in front of a type just tells Crochet to treat the type itself
as a value. In this sense, static types don't belong to any hierarchy. That
is, there's no `#ok is #result` relationship, nor a `result is #result` one.

### Local types

Types are "global" by default. Meaning that they're attached to the global
definition under the package, and exposed to any piece of code that has
a capability for the package defining the type.

However, because types grant capabilities, this means that any package that
depends on the one defining a type acquires an unrestricted, life-long
capability to that type. Sometimes this isn't _desirable_, because we may
want to have a tighter control over capabilities, and we may want to only
disclose parts of the capabilities dynamically (as object-capability security
does by passing objects around). In this case, local types can be used to
define types that are only visible within the module or package (package-local
types are not supported yet).

For example, let's say you're designing a file system library. Your library
may need access to the entire file system, but you may prefer to, instead of
granting arbitrary access to the entire file system to thirdy-party packages,
only grant them access to sandboxed slices of the file system.

```
local type file-system;
local type sandboxed-file-system(sandbox);

command file-system sandbox: Path =
  new sandboxed-file-system(seal Path);

command file-system-sandbox read: Path =
  read-path: Path inside-sandbox: unseal self.sandbox;
```

Where, for example, if the sandbox was constructed for the path
`/opt/sandbox`, then the command `read-path:inside-sandbox:` would make sure
that the arbitrary path provided did not break out of that directory,
effectively restricting access of anyone who had got their hands on
the sandboxed file system to operations inside `/opt/sandbox` and inside
that directory only.

### Fields and projection

Currently, fields in types have not been given love in terms of capability
awareness. They exist in a flat, global namespace, and can be accessed by
anyone who has got their hands on the value, and knows the static name
of the field.

Fields will acquire capabilities in the future, allowing one to restrict
who can access a field (and further grant that capability of access
dynamically, in a similar fashion to what is done with types), but how
that will happen is still not really decided. It's likely to be similar
to the idea of [capability symbols](https://github.com/origamitower/purr/blob/master/design/idea/0001-data.md#names-and-symbols) that I've toyed with
before in Purr.

Anyway! One can project fields with `value.field`:

```
type point2d(x is integer, y is integer);

prelude
  let P = new point2d(1, 2);
  assert P.x === 1;
  assert P.y === 2;
end
```

Selections are also supported, and result in a record:

```
let P = new point2d(3, 4);
assert P.(x as my-y, y as my-x) === [
  my-x -> 4,
  my-y -> 3,
];
```

(Whether selections will survive as a feature remains to be seen...)

## Commands

A command is a method with multi-dispatch. In other words, some piece of
code that has multiple branches, and which branch it chooses to execute
depends on the types of its arguments.

They're declared like this:

```
type point2d(x is integer, y is integer);

command (X is point2d) + (Y is point2d) =
  new point2d(X.x + Y.x, X.y + Y.y);
```

This will create a new command `_ + _` that takes two arguments (denoted by
the two `_` in the name), both of these arguments must have at least the
type `point2d`, and the arguments of this command are bound to the variables
`X` and `Y`.

A command can also be defined in its longer form:

```
command (X is point2d) + (Y is point2d) do
  new point2d(X.x + Y.y, X.y + Y.y);
end
```

### Signatures

Command names in Crochet are inspired by Lisp, Bash, and Smalltalk. There
are four types of command names (or "signatures"). In general, you should
expect the way you define a command and the way you use a command to have
roughly the same syntax.

When defining a command, you may specify a name and a type: `(Name is type)`,
in which case the value is bound to `Name` and the command is selected if
the argument is of of type `type`; you can specify only the name, without
parenthesis, `Name`, in which case the type is assumed to be `any`; and you
can specify only the type, as in `type`, in which case the value is not
bound to any variable.

#### Postfix command (`_ name`)

These are commands like: `1 second`, `x value`, and `[3, 1, 2} sort`. The
name can be any atomic identifier (words can be separated by hyphens (`-`)).

```
// Defining
command text echo = self;

prelude
  // Using
  "hello" echo;
end
```

#### Infix command (`_ + _`)

These are commands like: `1 + 2`, `32 as text`, `true and false`. The name
has to be one the infix operators, and it's not possible to define your own
infix operators.

The infix operators are:

- `_ ++ _`
- `_ + _`
- `_ <- _`
- `_ - _`
- `_ ** _`
- `_ * _`
- `_ / _`
- `_ <= _`
- `_ < _`
- `_ >= _`
- `_ > _`
- `_ === _`
- `_ =/= _`
- `_ % _`
- `_ and _`
- `_ or _`
- `_ as _`

And its usage looks like:

```
// Defining
command integer + integer = "numbers were added!";

prelude
  // Using
  3 + 2;
end
```

#### Mixfix command (`_ this: _ is: _ a: _ name: _`)

Mixfix commands look like: `2 between: 0 and: 10`, `#point2d x: 1 y: 2`,
and `3 divided-by: 2`. They may also not include a leading value, such
as `panic: "Oh noes" tag: "ded"` (`panic: _ tag: _` --- note the lack of
a leading `_` in the name).

Each part of the name (with the exception of the leading value, if present)
must be a `keyword: Value` pair. The keyword can be any atomic identifier
with words separated by hyphens (`-`).

```
// Defining
command say: Message to: Who = "[Message], [Who]";

command Who says: Message = "[Who]: [Message]";

prelude
  // Using
  say: "Hello" to: "Awra";

  "Hye" says: "Hi!";
end
```

#### Prefix commands (`not _`)

Currently `not _` is the only prefix command supported.

```
// Defining
command not true = false;

prelude
  // Using
  let X = true;
  not X;
end
```

### Dispatch rules

When one invokes a command, such as `1 + 2`, first the system will lookup
the command by its name. The name, in this case, is `_ + _` (names of
crochet commands simply have the argument positions replaced by `_`).
This may yield several `_ + _` commands, as they can be defined anywhere,
by any package.

After getting the available commands, Crochet will perform a "selection",
which means it'll look at all of the available commands and pick the
single most specific one.

Let's say we have the following commands defined:

```
 a. _ + _ (any, any)
 b. _ + _ (integer, numeric)
 c. _ + _ (numeric, integer)
 d. _ + _ (integer, integer)
 e. _ + _ (float, float)
```

Our two integer arguments are accepted by `a`, because `any` accepts any
value; `b` and `c`, because `integer` is a subtype of `numeric`; and `d`
because that's the specific type. It's not accepted by `e` because `integer`
is not a `float`.

In this case, we would pick the command `d`, because it's the command
with the most specific type scoring (both types are an exact match!).

But what would happen if we had the following commands instead?

```
 a. _ + _ (any, any)
 b. _ + _ (integer, numeric)
 c. _ + _ (numeric, integer)
 e. _ + _ (float, float)
```

Now we don't have an exact match anymore, and both `b` and `c` seem to
have a similar scoring: one of the type is an exact match, and the other
is a supertype with the exact same distance. In these cases Crochet
disambiguates from left to right, and thus `b` is picked.

This kind of ambiguity may be a compiler warning in the future, however.

### Contracts

Commands allow pre and post conditions to be specified. These are checked
when the command is applied (different runtime modes and soft-contract
checking, where contracts are partially checked at compile time, are
planned).

Consider the following:

```
command numeric absolute -> integer
requires
  integer :: self is integer;
ensures
  non-negativity :: return >= 0;
do
  condition
    when self >= 0 => self;
    always => self negate;
  end
end
```

Pre-conditions are specified with the `requires` keyword. They're checked
before executing the body of the command. Post-conditions are specified with
the `ensures` keyword, and are checked after the body of the command has been
executed. Post-conditions can use the `return` keyword to describe properties
about the result.

The `-> type` syntax is actually a post-condition in disguise. It is implemented
as a runtime type check currently, with plans to solve most of them statically
once soft contracts are implemented.

Contracts can be used to enforce complex properties about a function:

```
command tuple sort -> tuple
ensures
  // The output should be the same size as the input
  same-size :: self count === return count;

  // The output should contain the same elements as the input, in any order
  same-elements :: self count-elements === return count-elements;

  // The output should be ordered
  ordered :: self pairwise all-true: (_ <= _);
do
  condition
    when self is-empty => [];
    always do
      let Lesser = self filter: (_ < self first);
      let Greater = self filter: (_ >= self first);
      Lesser sort ++ [self first] ++ Greater sort;
    end
  end
end

// yields a map of (element -> number of occurrences)
command tuple count-elements -> record do
  self fold-from: #map empty
       with: { Map, X in
         Map update: X with: (_ + 1) default: 0
       }
end
```

### Assertions

Besides pre and post-conditions, invariants within the body of a command
may also be expressed through explicit `assertion` expressions. One
can write an assertion like this:

```
assert (1 + 2) === 3;
```

A failed assertion gives the values of its sub-expressions along with
the original expression:

```
>>> assert (1 + 2) === 4;

assertion-failed: assert (1 + 2) === 4
With values:
  - 3
  - 4
```

### Tests

Commands also support embedding tests directly on them. Along with contracts
and assertions, this makes testing complex functions, often, just a matter of
calling it. Or calling it and comparing with an output.

For example:

```
// yields a map of (element -> number of occurrences)
command tuple count-elements -> record do
  self fold-from: #map empty
       with: { Map, X in
         Map update: X with: (_ + 1) default: 0
       }
end

command tuple sort -> tuple
ensures
  // The output should be the same size as the input
  same-size :: self count === return count;

  // The output should contain the same elements as the input, in any order
  same-elements :: self count-elements === return count-elements;

  // The output should be ordered
  ordered :: self pairwise all-true: (_ <= _);
do
  condition
    when self is-empty => [];
    always do
      let Lesser = self filter: (_ < self first);
      let Greater = self filter: (_ >= self first);
      Lesser sort ++ [self first] ++ Greater sort;
    end
  end
test
  // implicit assertions based on the properties of the function
  [] sort;
  [1] sort;
  [1, 3, 3] sort;

  assert [2, 1, 2, 4] sort === [1, 2, 2, 4];
end
```

It's also possible to use the stand-alone `test` declaration if one needs
to specify tests that encompass multiple commands:

```
test "encoding a value then decoding it yields the same value" do
  assert (#base64 encode: "hello" | to-text) === "hello";
end
```

### Why are commands global?

Commands are flat and global by default. That is, any declared command is
accessible from _anywhere_ in Crochet, whether the calling code has or
not a capability for the package that defines the command. This is an
important and deliberate choice because the lack of global commands
leads to global incoherence, where the behaviour of the program depends
on finicky details of how capabilities were distributed, and semantics
can't be reasoned about in a higher level---everything is contextual.

Global incoherence can be an annoyance, and it certainly makes debugging
applications difficult (not great properties when your language targets
non-professional programmers, who are mostly artists and writers). But
it also makes reasoning about security more difficult. You can't reason
about the program as a whole anymore.

The caveat of this decision is that types are the sole things
that can gate capabilities. It means that, for example, a command
added to the `integer` type will grant that capability to every piece
of code in the system, because `integer` is an universal capability by
default.

## Packages

Crochet's types are not readily accessible in some sort of global namespace,
and one cannot do anything without having access to types. So how does one
get their hands on types anyway? The answer in Crochet is packages.

Packages in Crochet allow one to configure an application and decide how
capabilities should flow through the program, in a static sense. Being
a static configuration means that tools can better provide overviews of
what capabilities are being used, where they're being used, and possibly
provide insights on why they're being used, which can be helpful in audits.

The way you define packages is still pretty under-developed, but currently
a package is a folder with a `crochet.json` file at the root. This file
has the following structure:

```ts
type capability = string; // a Crochet capability
type filepath = string; // relative path to a file

type dependency =
  | string
  | {
      name: string;
      target: "*" | "browser" | "node";
      capabilities: capability[];
    };

type package = {
  name: string;
  target: "*" | "browser" | "node";
  sources: filepath[]; // crochet files
  native_sources: filepath[]; // JS/native files
  dependencies: dependency[];
  capabilities: {
    requires: capability[];
    provides: capability[];
  };
};
```

### Targets

A `target` in Crochet is an execution goal. Currently this is limited to
platforms (`browser`, `node`, or all (`*`)), but the plan is to have this
as an arbitrary constraint such that a package may declare that, e.g.:
it can only be used in
"node 15.x+, running on linux, if it's running in either development or
test mode".

### Sources

Crochet does not allow mutual recursion in the package resolution phase.
It still allows mutually recursive definitions to reference each other
however. But what this means is that users need to manually linearise
their source definitions, by listing the files in the order their
definitions should be loaded.

### Native sources

Crochet allows a package to load native JavaScript files **if** it has
the "native" capability. Other forms of less-powerful native extensions
will be provided in the future, but the way this will happen right now
is not entirely clear (especially since SES seems to be in some
transition state right now).

### Dependencies

Dependencies are sandboxed by default. That is, none of the capabilities
the current package has been granted are automatically propagated to the
dependencies. Instead, the package must explicitly grant these capabilities
when specifying the dependencies.

### Capabilities

A package has a set of capabilities it requires in order to work. These are
the capabilities that it either needs to pass down to a dependency, or
a "built-in" capability that unlocks some Crochet feature (currently only
the "native" capability is built-in).

Packages may also _provide_ new capabilities. If the package is used to
construct powerful objects, then it can declare such in the provided
capabilities list.

Any package that wishes to depend on another must provide the sum of
required and provided capabilities to successfully load the package.
In the future, however, packages will be allwoed to specify optional
capabilities, which can be used to make it more or less powerful.
Optional capabilities still need to be consistent within an
application, however, as packages are globally instantiated
and definitions are also globally instantiated.

But, for example, one use for optional capabilities could be to
load a native module if a user wishes for more performance, while
falling back to a Crochet implementation that doesn't require any
powerful capability.

### Using a package

In order to use a package in Crochet one needs to first "open" it. And in
order to "open" a package one needs to have a capability for it. The
capability, in this case, is specified in terms of package dependencies.
Thus, if a package depends on `crochet.time.wall-clock`, then:

```
open crochet.time.wall-clock;
```

Will allow the module to use any of the types provided by
`crochet.time.wall-clock`:

```
wall-clock now + 30 minutes;
```

Qualified acccess (not implemented yet) can also be used. The following
is equivalent:

```
crochet.time.wall-clock/wall-clock now + 30 minutes;
```

Finally, qualified open (not implemented yet) allows one to shorten this
a bit:

```
open crochet.time.wall-clock as w;

prelude
  w/wall-clock now + 30 minutes;
end
```

Qualified access is mostly relevant when there's a risk of ambiguity in
the names of the types, as packages that are opened later will shadow
packages that are opened earlier.

More control over what types are brought into scope will be implemented
eventually.

## Definitions

Crochet allows global value definitions, but a definition must be atomic.
That is, the expression must be able to be evaluated without the possibility
of failure---this means that invoking commands is not possible in a `define`
block.

`define` can be used for specifying global data structures that you only
want to be evaluated once:

```
define colours = [
  "blue",
  "pink",
  "green",
  "purple",
  "yellow"
];
```

When combined with `lazy` evaluation, it's possible to use `define` to build
complex computations that are guaranteed to be evaluated at most once:

```
define grammar = lazy grammar from: "...";

command parse: (Source is text) =
  (force grammar) parse: Source;
```

Note that when dealing with lazy evaluation one must explicitly `force` the
evaluation of the expression.

## Relational logic support

Crochet's "distinctive" feature is integrating a Tree-based database of
facts, along with allowing this tree to be searched, updated, and influence
the program's execution through relational logic operators.

Crochet does _not_ implement relational logic. It's definitely influenced
by it and modal logics, but there's no single formal logic system that
underlies its deisgn (will there ever be? who knows `¯\_(ツ)_/¯`).

### The Tree of Facts

The tree of facts forms a global database of things that are known to be
true in the program. The database consists of a collection of **relations**,
which are declared like this:

```
relation Person* at: Location;
```

This introduces a new `_ at: _` relation (the syntax is similar to commands,
but restricted to postfix and mixfix signatures), and this relation also
specifies that each step of this relation can hold any type of values
(denoted by it not being constrained to a type), and that the first step
of this relation can hold multiple values, whereas the second step of this
relation can only hold one.

The "how many values can this step hold?" denotation (which Crochet calls
"multiplicities") is important for games and any other system that varies
through time. Consider the following example:

```
fact "alice" at: "garden";
fact "dorothy" at: "castle";
fact "alice" at: "castle";
```

The `fact` expression adds a new Fact to the tree. So, here, we're adding
three facts: `alice is at the garden`, `dorothy is at the castle`, and
`alice is at the castle`. Of course, it's generally not possible for
someone to be at two places at the same time. Propositional logic would
require one to express this program as:

```
alice is at the garden.
dorothy is at the castle.
alice is not at the garden, alice is at the castle.
```

Which is all fine, but when most of your program consists of rules that override
previous facts, this framing pattern everywhere gets out of hand. Some modal
logics will tackle this in different ways. Temporal logic allows one to also
describe when a fact is true, allowing time to be used in the modelling. Linear
logic will model things as resources that can be consumed and introduced.

In the case of Crochet, it's assumed that most of these facts and
transformations will be discrete, observable timesteps. So, instead, Crochet
chooses the idea of multiplicity.

Again, here `Person` (the first step) has mutiplicity `*` (many), and the
second step has multiplicity ` ` (one). You can read the relation
`Person* at: Location` as "There can be **many** Persons. Any Person can be in
**one** Location at any given discrete timestep."

Thus, we evaluate the sequence of fact expressions as follows:

```
fact "alice" at: "garden";
// database: (alice is at the garden)

fact "dorothy" at: "castle";
// database: (alice is at the garden, dorothy is at the castle)

fact "alice" at: "castle";
// database: (alice is at the castle, dorothy is at the castle)
```

When we evaluate the last expression, `alice is at the castle` replaces
`alice is at the garden`, because it knows that `alice` can only ever be
at one location at any point in time. So, in this sense, relation declarations
are a form of describing, in typed constraints, what relationships are valid
as facts and automatically correcting facts to agree with those constraints.

### Timesteps and facts

Again, Crochet models the program as a set of discrete timesteps. This is
the same as with imperative programming languages---and it's why Crochet
needs to be a strict language (with explicit laziness) with well-defined
evaluation rules in order for one to be able to reason about the program.

The two main operations to manipulate the fact tree are `fact` and `forget`.
A `fact` expression will add a new fact to the tree, as we've seen before,
while a `forget` expression will negate facts in the tree.

Consider:

```
fact "alice" at: "garden";
// database: (alice is at the garden)

fact "dorothy" at: "castle";
// database: (alice is at the garden, dorothy is at the castle)

fact "alice" at: "castle";
// database: (alice is at the castle, dorothy is at the castle)

forget "dorothy" at: "castle";
// database: (alice is at the castle)
```

Though not implemented yet, `forget` does not need to work on concrete values.
For example, the following would remove all facts about people at the castle:

```
// database: (
//   alice is at the castle,
//   dorothy is at the castle,
//   emilia is at the garden,
// )

forget _ at: "castle";

// database: (emilia is at the garden)
```

### Search

The tree of facts is a database, that means it must support searching facts as
well. For the query language, Crochet uses a language inspired by relational
logic.

For example, consider the following arrangement:

```
relation Person* at: Location;
relation Person* likes: Person*;

prelude
  fact "lielle" at: "garden";
  fact "karis" at: "garden";
  fact "ange" at: "garden";

  fact "lielle" likes: "karis";
  fact "karis" likes: "lielle";
  fact "karis" likes: "ange";

  let May-become-a-couple =
    search PersonA at: Location,
           PersonB at: Location,
           if PersonA =/= PersonB,
           PersonA likes: PersonB,
           PersonB likes: PersonA;

  assert May-become-a-couple === [
    [ PersonA -> "lielle", PersonB -> "karis", Location -> "garden" ],
    [ PersonA -> "karis", PersonB -> "lielle", location -> "garden" ]
  ];
end
```

Here the query is "Two distinct people who are at the same location, and
like each other". The `,` operator (logical conjunction or "and") allows
one to express a query that depends on the results of a previous query.
In this case, Crochet will use a depth-first search approach to explore
the tree and find facts that match the query. A variable, such as `PersonA`
will match the exact same fact it has matched before (or anything, if
it's still "fresh"). And `if` allows one to provide an arbitrary constraint
as a boolean Crochet expression. Here, `PersonA =/= PersonB` is actually
evaluating the `_ =/= _` command, thus constraints cannot be evaluated
through backwards chaining.

The query DSL consists of the following:

#### The trivial query

The query `always` will always succeed, but bind nothing. That is:

```
assert (search always) === [
  [->]
];
```

Note that the single empty record there means "This query has succeeded,
but it did not bind any variables".

#### Relation queries

A relation query is something like `PersonA at: Location` (again, the syntax
is similar to how you would declare the relation).

Each variable portion of the relation query allows an unification pattern.
Unification patterns can be:

- `Variable` -- unifies against the variable. Matches what has been previously
  matched, or matches anything if this is the first time we're unifying it.

- Atomic values (`global`, `self`, `2`) -- matches the same value.

- Wildcards (`_`) -- matches anything.

- Type tests (`X is type`) -- first matches the unification pattern (in this
  case the variable `X`), then restrict the matches to values that are of the
  given type.

#### Conjunctions

A query such as `A, B` means that we first perform the query `A`, then for
every result of `A` we also perform the query `B`.

Consider:

```
// database: (
//   alice at garden, dorothy at garden,
//   alice wears a red dress, dorothy wears a blue dress
// )

assert (search Who at: "garden", Who wears: "blue dress") === [
  [Who -> "dorothy"]
];
```

The way we evaluate this query is equivalent to:

```
--> Who at: "garden"
    :: "alice" at: "garden" (Who = "alice")
       --> Who wears: "blue dress" (Who = "alice")
           :: "alice" wears: "red dress"
              --> fail
           :: "dorothy" wears: "blue dress"
              --> fail (Who is not "dorothy")
    :: "dorothy" at: "garden" (Who = "dorothy")
       --> Who wears: "blue dress" (Who = "dorothy")
           :: "alice" wears: "red dress"
              --> fail (Who is not "alice", wears is not "blue dres")
           :: "dorothy" wears: "blue dress"
              --> succeed (Who = "dorothy")
```

#### Disjunctions

A query such as `A | B` means that we first perform the query `A`, and continue
with its results if it succeeds. If it fails, then we try to perform query `B`.

Consider:

```
// database: (
//   alice at garden, dorothy at garden,
//   alice wears a red dress, dorothy wears a blue dress
// )

assert (
  search Who at: "garden",
         (Who wears: "blue dress" | Who wears: "red dress")
) === [
  [Who -> "alice", Who -> "dorothy"]
];
```

The way we evaluate this query is equivalent to:

```
--> Who at: "garden"
    :: "alice" at: "garden" (Who = "alice")
       --> Who wears: "blue dress" (Who = "alice")
           :: "alice" wears: "red dress"
              --> fail (wears not a blue dress)
                  --> Who wears: "red dress"
                      --> succeed (Who = "alice")
           :: "dorothy" wears: "blue dress"
              --> fail (Who is not "dorothy")
                  --> Who wears: "red dress"
                      --> fail (Who is not "dorothy", wears not a red dress)
    :: "dorothy" at: "garden" (Who = "dorothy")
       --> Who wears: "blue dress" (Who = "dorothy")
           :: "alice" wears: "red dress"
              --> fail (Who is not "alice", wears is not a blue dress)
                  --> Who wears: "red dress"
                      --> fail (Who is not "alice")
           :: "dorothy" wears: "blue dress"
              --> succeed (Who = "dorothy")
```

#### Type queries

A query in the form of `X is some-type` (where `X` is a variable) will yield all
registered values of type `some-type`. For example, given:

```
enum direction = north, east, south, west;
```

Then the following query would yield all directions:

```
assert (search X is direction) === [
  north,
  east,
  south,
  west
];
```

Note that this only yields _registered_ values for the type. By default,
singleton and enum types are registered, but values constructed with `new`
are not. Thus in:

```
type person;

prelude
  let Alice = new person;
  let Dorothy = new person;

  assert (search X is person) === [];
end
```

The query returns the empty list. One may register values that they want to
retrieve in queries, but note that registered values are never garbage
collected (this may change in the future and they may end up not in GC root).

```
type person;

prelude
  let Alice = new person;
  let Dorothy = new person;
  register Alice;
  register Dorothy;

  assert (search X is person) === [Alice, Dorothy];
end
```

#### Sampling queries

Relation and type queries will generally yield all possible values, and thus
cause Crochet's search algorithm to explore all possibilities. While some of
this can be optimised through tree-prunning and better solvers, for games you
generally cannot afford having performance be non-deterministic and very
difficult to reason about.

Therefore, as a compromise, Crochet provides "sampling" queries. These are
the same Relation and Type queries as above, but they're bounded (that is,
Crochet will explore at most N possibilities), and they're stochastic
(that is, Crochet will sample random values, rather than take the first
entries).

The stochastic nature of sampling makes things less deterministic in the
game. This is generally alright in game AIs. For sampling, Crochet uses
a PRNG algorithm that is deterministic if given a particular seed. There
will be ways of providing contextual seeds in the future, but currently
Crochet uses one seed per application execution.

A sampling query looks like:

```
enum direction = north, east, south, west;
relation Direction* opposite: Direction;

prelude
  fact north opposite: south;
  fact east opposite: west;
  fact south opposite: north;
  fact west opposite: east;

  (sample 2 of X is direction) === [
    north,
    south,
  ];

  (sample 2 of Direction opposite: Opposite) === [
    [Direction -> west, Opposite -> east],
    [Direction -> north, Opposite -> south],
  ];
end
```

### Constraints and Let-expressions

The query language described above is pure and allows searches to be
performed in any direction (i.e.: starting from any sub-query, and allowing
backwards chaining in addition to forward chaining).

Crochet makes the choice of making queries flexible and simpler to write
rather than provable and optimisable, therefore the constraints it provides
are not pure, and require a strict ordering in the search.

A constraint is a query in the form `<Query>, if <Expression>`. A Let-expression
is a query in the form `let <Name> = <Expression>`. Constraints take the results
of a previous query and filters it down to the results for which the arbitrary
expression is true. The Let query evaluates an arbitrary expression and extends
the results by binding the value to some variable.

Because both of these queries allow arbitrary Crochet expressions to be used,
they create an evaluation boundary in the entire query. After a constraint or
let query, it's not possible to do backwards chaining. And it's not possible to
re-order queries across expression boundaries, as expressions may have
side-effects.

### Predicates

Queries mostly work on relations. Predicates allow one to abstract over
relations in a procedural manner (i.e.: trading space (explicit facts) for
CPU time (computed facts)).

For example, consider how one could model the idea of opposite directions:

```
enum direction = north, east, south, west;

relation Direction* opposite: OppositeDirection;

prelude
  fact north opposite: south;
  fact east opposite: west;
  fact south opposite: north;
  fact west opposite: east;
end
```

While this is reasonable for smaller relations, some relations may end up
taking too much space if eagerly computed. In that case, predicates allow
one to compute them on-demand:

```
predicate Direction opposite: Opposite do
  when Direction =:= north, Opposite =:= south;
  when Direction =:= east, Opposite =:= west;
  when Direction =:= south, Opposite =:= north;
  when Direction =:= west, Opposite =:= east;
end
```

The names of predicates follow the same signatures as the names of relations,
and the bodies of predicates are a series of `when` clauses, which are
modelled as simple disjunctions. There's no distinction between using a
predicate and using a relation in a search. From the user's point of view
they're strictly equivalent. Of course `fact` and `forget` expressions only
work with relations.

## Simulations

The other "distinctive" feature of Crochet is its first-class support for
stochastic model simulations.

In Crochet simulations are desribed by Actions and Events, which may be
grouped into Contexts, and can be directed throug Simulations.

A simulation is turn-based, and is described like so:

```
simulate
  for [A, B, C]
  in Context
  until Goal;
```

The `for` clause describes the turns of the simulation, as an expression that
yields a tuple. Each value in the tuple will be used to identify the turn, so
something like `for ["alice", "dorothy"]` will run a two-turn simulation where
the value `"alice"` will describe the first turn, and the value `"dorothy"`
will describe the second turn.

Simulations will take into consideration all actions and events within a
given `Context`. If the `in Context` clause is omitted, then only global
actions and events will be considered (i.e.: actions not in a context).

Finally, simulations will run `until` a `Goal` is reached. The goal may
be `quiescence` (i.e.: until no more actions or events are available);
`event quiescence` or `action quiescence` are partial forms of quiescence
that check only events or only actions. Finally, a `Goal` can be an arbitrary
query expression, such as `until player at: castle, player has: sword`;

Once a simulation has run through all of the turns, it starts a new _round_,
where it'll run through all of the turns again, in the same order. Rounds
can be queried in actions and events through the `_ simulate-rounds-elapsed`
relation. The current turn can also be queried through the `_ simulate-turn`
relation. These relations are only available from inside of a simulation,
and they properly nest if you have nested simulations.

### Actions

An action in Crochet describes an affordance that can be taken by a simulation.
For example, consider a simulation of two people meeting each other. They
come together in a particular place, they greet each other, and then they
leave.

In this case each person has three affordances: entering the location,
greeting the other person, and leaving.

```
enum person = lielle, karis;
enum location = garden;

relation Person* at: Location;
relation Person* greeted: Other*;

action (Person is person) enter-location
when not Person at: garden
do
  transcript write: "[Person] arrives at the garden";
  fact Person at: garden;
end

action (Person is person) greet: (Other is person)
when
  Person at: garden,
  Other at: garden,
  if Person =/= Other
do
  transcript write: "[Person] greets [Other]";
end

action (Person is person) leave
when
  Person at: garden,
  Person greeted: Other
do
  transcript write: "[Person] leaves the garden";
  forget Person at: garden;
end
```

#### Pre-conditions

Actions may have restrictions on who can perform them. In this
case, `(Person is person) enter-location` means that `enter-location`
can only be performed when the current turn is performed by a `person`
value---Crochet's simulation is turn-based.

They can also have restrictions of _when_ they're available. The `when`
clause allows one to use queries to describe affordances. Note that a
`when` clause doesn't just describe a "this action is available", but
rather it describes "these actions are available", as it yields copies
of the actions with different bindings for all of the search results.

In this sense, an action like:

```
enum direction = north, east, south, west;
singleton player;

action player move: Direction
when
  Direction is direction
do
  transcript write: "Player moves [Direction]";
end
```

Will actually yield 4 distinct actions: `player move: north`,
`player move: east`, `player move: south`, and `player move: west`.

#### Ranking

Actions can be have a ranking function. When present, Crochet's simulation
will use the ranking to perform a weighted stochastic choice between the
avaialble actions.

Consider:

```
enum location = foyer, cloakroom, bar;
singleton player;

relation Who* at: Place;
relation Who* visited: Place;

action player visit: Place
when
  Place is location,
  not player at: Place
rank
  match
    when player visited: Place => 1;
    always => 5;
  end
do
  transcript write: "Player visits [Place]";
  fact player at: Place;
  fact Player visited: Place;
end
```

In this case the simulation will be 5x more likely to pick a place that
has not been visited before over a place that has been visited.

### Events

When Crochet runs a turn it first picks an action suitable for the current
turn, then it runs all events whose preconditions hold before moving on
to the next turn.

An event is described as such:

```
enum location = foyer, bar, cloakroom;
singleton player;
singleton cloak;

relation Who* at: Location;
relation Who* wears: What*;

when
  player at: bar,
  player wears: cloak
do
  transcript write:
    "The bar is too dark. Maybe it's not a good idea to be here...";
  fact player at: foyer;
end
```

With this event, whenever a turn would end up with the player at the bar
while wearing a cloak they would be moved right back to to the foyer.
In this sense, events model reactions.

### Contexts

By default actions and events are globally accessible, that means that all
simulations would see those actions. Actions and events can also be grouped
into contexts. Contexts help with more complex simulations by reducing the
amount of necessary pre-conditions.

Contexts are not very well-developed right now, and there's no way of
combining contexts. Automatically provided contexts may also be a
thing explored in the future.

## Scenes

Scenes provide imperative entry-points to a program, modelled after similar
concepts in visual novels. In that sense, a `scene` is just a procedure that
takes no arguments, with the addition of supporting `goto` expressions for
control flow.

```
scene main do
  transcript write: "This is the start";
  call the-middle;
  transcript write: "You will never see this...";
end

scene the-middle do
  transcript write: "This is the middle";
  goto the-end;
end

scene the-end do
  transcript write: "And this is the end";
end
```

The `call` control flow works in a similar way to invoking procedures,
transferring control back to the calling scene once the called scene
finishes being evaluated.

## Expressions

The functional part of Crochet is an expression-based language. Expressions
can be evaluated at any point if they're atomic (i.e.: a literal or guaranteed
value), but otherwise can only be evaluated after all the definitions have
been resolved.

### Manipulating the tree of facts

Syntax:

```
fact relation-signature<primary-expr>
forget relation-signature<primary-expr>
```

For example:

```
fact X at: Y;
fact Turn rounds;

forget X at: Y;
forget Turn rounds;
```

`fact` will add facts to the global tree, and `forget` will remove facts
from the tree.

### Scene control flow

Syntax:

```
call <scene-name>
goto <scene-name>
```

For example:

```
call some-scene;
goto some-scene;
```

The difference between `call` and `goto` is that the latter will perform
a tail call, and thus prevent the VM from returning to the calling scene.

### Introducing variables

Syntax:

```
let <name> = <expression>
let _ = <expression>
```

For example:

```
let Hello = "hello";
let _ = "this is evaluated and discarded and not bound to anything";
```

Let expressions introduce a variable in the current environment. Variables
always have the first letter in upper-case.

Note that unlike ML-dialect languages, `let` does not introduce a new
scoping environment for the following expressions. Rather it introduces
a new binding on the function/block-level environment, like JavaScript's
`const` does.

### Simulations

Syntax:

```
simulate:
  simulate for <expression> until <goal> <signal ...>
  simulate for <expression> in <context> until <goal> <signal ...>

goal:
  quiescence
  action quiescence
  event quiescence
  <search-query>

context:
  <atom>

signal:
  on pick-action: <parameter> for: <parameter> do <expression ...> end
```

For example:

```
simulate for [lielle, karis] until action quiescence
  on pick-action: Actions for: Turn do
    condition
      when Turn =:= karis => random choice: Actions;
      when Turn =:= lielle => show-menu: Actions;
    end
  end;
```

Signals in the simulation allow control over certain aspects of the simulation.
Currently the only signal supported is `_ pick-action: _ for: _`, which allows
one to control the algorithm for selecting an action for a particular turn,
by replacing the default weighted random choice with an arbitrary procedure.

### Assertions

Syntax:

```
assert <expression>
```

For example:

```
assert 1 === 1
```

Assertions are checked at runtime and will stop the program if they fail.

### Instantiation

Syntax:

```
new <type-expression>
new <type-expression>(<expression , ...>)
```

For example:

```
new some-type;
new other-type(1, 2, 3, 4);
```

Instantiations yield a new object of the given type that has a _distinct_
identity. This means that `new some-type =:= new some-type` will always
be false. This is important for upholding the idea of types (and objects)
as capabilities, since they **must** be unforgeable---that is, it should
be impossible for any code not _explicitly_ granted such capabilities to
produce something that can act as one.

### Invocations

Syntax:

```
<expr> <atom : expr ...>
<atom : expr ...>
<expr> <infix> <expr>
<expr> <atom>
not <expr>
```

For example:

```
1 between: 0 and: 10;
panic: "Oh no!";
2 + 3;
not true;
```

This will lookup a procedure with the given name in the global namespace.
It'll then perform selection and dispatch (see the Command section).

The first argument of the invocation will be bound the the special receiver
field in the environment, allowing it to be retrieved with `self`.

### Definitions

Syntax:

```
<atom>
<namespace>/<atom>
```

For example:

```
some-global-definition;
some.package.name/some-definition;
```

Global definitions are looked up in the module, package, or lastly in the
global namespace. Qualified definitions are always looked up on the given
package directly.

Note that definitions are subject to capabilities, so one is only able to
access definitions that the calling package has access to.

### Variables

Syntax:

```
<name>
```

For example:

```
Some-long-variable;
```

Variables will be looked upwards through the static environment chain,
as they are lexically scoped. Closures are supported.

### Self

Syntax:

```
self
```

This will retrieve the value of the receiver argument (the first argument
to a procedure) if it exists. Not all environments get a receiver. For
example, receivers make no sense in definitions, so `self` is not available
there.

### Tuples

Syntax:

```
[]
[ <expression , ...> ]
```

For example:

```
[];
[1, 2, 3, 4];
```

Produces a fixed-size sequence. This can be atomic if all values of the tuple
are also atomic.

### Records

Syntax:

```
record:
  [->]
  [ <<key> -> <expression> ...> ]

key:
  <atom>
  <name>
  <text>
  [ <expression> ]
```

For example:

```
[->];
[ a -> 1, "b" -> 2, C -> 3, ["D"] -> 4];
```

### Search

Syntax:

```
search <query>
```

For example:

```
search X at: Y, X has: _;
```

See the Logic section.

### Match search

Syntax:

```
match:
  match <match-clause ...> end

match-clause:
  when <query> do <expression ...> end
  always do <expression ...> end
  when <query> => <expression> ;
  always <query> => <expression> ;
```

For example:

```
match
  when X at: garden => "Ah, the garden";
  always => "Oh well, elsewhere";
end
```

Queries are evaluated in the same way as in search, but clauses are
tried in the order they're listed. The first query that returns results
has its body evaluated _for each result it yields_.

### Projection

Syntax:

```
<expression> . <atom>
<expression> . <name>
<expression> . <text>
<expression> . [ <expression> ]
```

For example:

```
Some-value.x;
Some-value.Red;
Some-value."Some Key";
Some-value.[3 to-text];
```

Projection works on any type that supports the projection protocol. Currently
this is regular types, records, and tuples.

For tuples, this means that projection will be propagated to all of its
items. For example:

```
let Xs = [
  [x -> 1, y -> 2],
  [x -> 3, y -> 4],
  [x -> 5, y -> 6]
];

assert Xs.x === [1, 3, 5];
```

Which is the equivalent of:

```
for X in Xs do X.x end
```

### Selection

Syntax:

```
selection:
  <expression> . ( <selection-field> , ... )

selection-field:
  <field> as <field>
  <field>

field:
  <atom> | <name> | <text> | [ <expression> ]
```

For example:

```
let Xs = [
  [x -> 1, y -> 2],
  [x -> 3, y -> 4],
  [x -> 5, y -> 6],
];

assert Xs.(x as left, y as top) === [
  [left -> 1, top -> 2],
  [left -> 3, top -> 4],
  [left -> 5, top -> 6],
]
```

Selection is a form of projection where you can both retrieve a subset
of the pairs in the original value, and also rename keys. It otherwise
has the same behaviour as projection.

### List comprehensions

Syntax:

```
for:
  for <clause> do <expression> end

clause:
  <name> in <expression> , <clause>
  <name> in <expression> if <expression>
  <name> in <expression>
```

For example:

```
for Y in Rows, X in Columns if X =/= Y do
  [X, Y];
end
```

Not really significantly different than other languages'. Basically
ends up as a set of flatmaps.

### Block expressions

Syntax:

```
do <expression ...> end
```

For example:

```
assert
  (do
    transcript write: "One expression";
    transcript write: "Two expressions";
    transcript write: "Three expressions, wow";
    3;
   end)
  === 3;
```

This pretty much just evaluates the expressions in sequence and returns
the result of the last one.

### Function application

Syntax:

```
<expression> ( <expression , ...> )
```

For example:

```
F(1, 2, 3);
```

Treats the expression as a function and applies it to the given arguments.
Arities must strictly match.

### Pipe

Syntax:

```
<expression> |> <expression>
```

For example:

```
input
  |> _ lines
  |> _ map: (_ ascii uppercase);
```

Treats the second expression as an unary function, then applies it to
the evaluated argument on the left. The left side of the pipe is evaluated
first.

### Pipe invocation

Syntax:

```
<expression> | <keyword : expression ...>
<expression> | <atom>
```

For example:

```
input
  | lines
  | map: (integer parse: _)
  | filter: (_ > 3);
```

The equivalent of OOP's `input().lines().map(_.ascii().uppercase())`,
allows you to get rid of parenthesis in an invocation.

### Interpolation

For example:

```
"It's known that [Thing] has [Property]";
```

The `[<expression>]` parts allow one to evaluate and put an expression
at a certain point in the interpolation. It is important to note that
this is **not** equivalent to the common string interpolation features
in languages. It does not mean
`"It's known that " ++ Thing ++ " has " ++ Property`, but is rather
close to JavaScript's tagged template literals.

Crochet has a first-class interpolation type. This means that at runtime,
which portions of the interpolation are statically known (i.e.: exist
in the source program) and which are dynamically computed (i.e.: have
been evaluated at runrime) is contained in the type. It's not just
mashed together into a string getting rid of all that context.

The reason for having a first-class interpolation type is that it's
very common to have something like this:

```
file-system file: "[home]/.crochet/[config]" | read;
```

If Crochet just mashed all that interpolation together as a string,
then there would be no hope of ever being able to avoid people from
falling for different kinds of injection attacks (XSS, shell injections,
etc).

Instead, with a first-class interpolation type, it's possible for the
usage site to implement a safe parser that contextually handles dynamic
parts with absolute knowledge that static parts are safe. This means
that the expression above would rather be interpreted as:

```
file-system file: (#path from: [
  dynamic: home,
  static: "/.crochet/",
  dynamic: config
])
| read;
```

And then the #path parser can enforce that both `home` and `config`
stand for either proper path objects, or strings that are a single
path _segment_ (rather than an entire path).

You can think of first-class interpolation types as something similar
to how free monads allow return-type polymorphism in dynamic languages.
First-class interpolation types allow contextual templates to
be resolved at the use site (not the declaration site) properly and safely.

### Conditions

Syntax:

```
condition:
  condition <clause ...> end

clause:
  when <expression> do <expression ...> end
  when <expression> => <expression> ;
  always do <expression ...> end
  always => <expression> ;
```

For example:

```
condition
  when X < 0    => -1;
  when X === 0  =>  0;
  when X > 0    =>  1;
end
```

Evaluated sequentially, like a series of if/else expressions.

### Contract validity

Syntax:

```
is:
  <expression> is <contract>
```

For example:

```
12 is integer;
```

True if the contract would hold for the given expression's value.

### Explicit lazyness

Syntax:

```
lazy <expression>
force <expression>
```

For example:

```
let A = lazy transcript write: "Later";
transcript write: "first";
force A;
```

`lazy` will suspend an expression into a thunk, `force` will evaluate
it if it hasn't been evaluated before.

### Cute partial application

Syntax: put `_` in any sub-expression. The parent expression is now a
function with arity equal to the number of `_` sub-expressions.

For example:

```
(_ + 2)(1);  // same as `(do let A = 2; { X in X + A } end)(1)`
```

Partial application without the necessity of having a lambda, which means
that things can still be properly handled in hot-patching and live
programming scenarios.

Note that the non-holes are actually evaluated _before_ constructing the
function, so they're evaluated only once (not "once every time this function
is called"). And they're evaluated even if you never call the function (again,
this is important for hot-patching). Hence "cute".

Why "cute"? See [SRFI-26](https://srfi.schemers.org/srfi-26/srfi-26.html)

### Type expressions

Syntax: `#type`

Gives you a static type. See the type section.

### Lambdas

Syntax:

```
{ <expression> }
{ <name , ...> in <expression> }
```

For example:

```
assert { 1 + 2 }() === 3;
assert { A, B in A + B }(1, 2) === 3;
```

Regular closures. Lambdas support no dispatching, cannot have type annotations,
and have strict arities.

### Intrinsic equality

Syntax:

```
<expression> =:= <expression>
```

For example:

```
23 =:= 23;
```

The intrinsic equality algorithm of Crochet exposed. This has to be exposed
anyway since the unification algorithm has to leak it.
