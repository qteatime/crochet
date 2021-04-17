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
