# [#0001] - Typed data and commands

|                  |                |
| ---------------- | -------------- |
| **Authors**      | Q.             |
| **Last updated** | 31st July 2021 |
| **Status**       | Draft          |

## Summary

Crochet needs to provide a way of manipulating data in a way that is discoverable in an interactive environment, and respects both security and privacy. The ways of manipulating data should be collaboratively extensible---even externally to the defining source. And different security policies should apply to code existing in different trust zones.

In order to deal with all of this, this document proposes an idea of typed data as strong capabilities, a subtyping hierarchy, multi-methods, and traits.

## Core language

```
x in Variables
s in Symbols
v in Values

Declaration d ::=
  | type x_0(l_1, ..., l_n) is x_1              -- type declaration
  | trait x                                     -- trait declaration
  | command x(x_1 : t_1, ..., x_n : t_n) = e    -- command declaration
  | seal x                                      -- make type unconstructable
  | static x                                    -- refer to the static type of x
  | implement x_0 for x_1                       -- attach trait x_0 to type x_1

Type t ::=
  | x                   -- is subtype of x
  | static x            -- is the exact static type of x
  | has x_1, ...        -- has traits x_1, ...
  | x_0 has x_1, ...    -- is subtype of x_0, has traits x_1, ...

Expression e ::=
  | new x(e_1, ..., e_n)    -- construction
  | e_1.x                   -- projection
  | x(e_1, ..., e_n)        -- command invocation
```

Types define a data layout which is then filled upon construction. Type, traits, and command names are unique and unforgeable, however command invocations selects between all commands that share a common name. In that sense, most of the security guarantees really are driven by types and traits.

Fields may be projected out of a typed data only where the calling code has the capabilities to do so. Same goes for type construction. But these capabilities are not discussed in this document, as they depend on details of Crochet packages.

A common type declaration and usage may go as such:

    type point2d(x, y);

    trait equality with
      command _ === _;
      command _ =/= _;
    end

    command (A has equality) =/= (B has equality) =
      not (A === B);

    implement arithmetic for point2d;

    command (A is point2d) === (B is point2d) =
      A.x === B.x and A.y === B.y;

    let P1 = new point2d(1, 2);
    let P2 = new point2d(1, 2);
    P1 === P2;

Note that traits only list expectations, and default implementations are provided as regular multi-method declarations.

### Types

Types are a collection of fields with an unique, unforgeable name, introduced through a `type` declaration, and bound to data by a `new` construction.

Types may be part of a static hierarchy (`type x is y` makes `x` a subtype of `y`), but the hierarchy only matters for dispatch. Data is never inherited in Crochet.

#### Sealing

Types can be constructed as long as they're unsealed. Sealing pretty much models the idea of abstract types; types which only exist to define an hierarchy, but for which there are no useful values to be constructed. Sealing also enforces constraints such as "singleton types", for which there can be exactly one constructed value globally in the system.

#### Static types

Sometimes it makes sense to be able to use types as an unique name AND as a value constructor. Static types exist for this reason, as a way of treating a type only as an unique name. Static types have no hierarchy, and cannot be constructed, inherited, abstracted over, or have their static types taken.

### Traits

A trait is a collection of behavioural requirements that can be implemented by types. Traits have two main purposes: to make it explicit what behavioural requirements are (and possibly provide default implementations to some of these), and to be able to write generic code regarding concepts rather than hierarchies---dispatching on traits, not types.

Traits make intentional reuse easier, but they should not play a role in unintentional reuse---that's still up to type extensions. It's expected that, eventually, unintentional reuse can be refactored into intentional reuse without large ripple effects, because all components here (types, traits, and commands) are entirely decoupled. This is why traits can (and will likely be) defined after the fact, when patterns are noticed, retroactively applying to all types complying to its requirements.

### Commands

A command is a multi-method that dispatches on both type hierarchies and
traits. For example:

    type coordinate;
    type point2d(x, y) is coordinate;
    type point3d(x, y, z) is coordinate;
    trait equality with
      command _ === _;
      command _ =/= _;
    end

    // Dispatch on traits
    command (A has equality) =/= (B has equality) =
      not (A === B);

    // Dispatch on type hierarchies
    command (A is point2d) === (B is point2d) =
      (A.x === B.x) and (A.y === B.y);

    command (A is point3d) === (B is point3d) =
      (A.x === B.x) and (A.y === B.y) and (A.z === B.z);

    implement equality for point2d;
    implement equality for point3d;

Here we have two commands with the same name `_ === _`, and the system will select them based which one has the most specific fit based on the type of the values flowing into it. The dispatch uses the following algorithm to determine "fitness":

#### Fitness algorithm

Given an invocation:

    x(x_1 : t_1, ..., x_n : t_n)

And a set of commands:

    c_1(ct_1, ..., ct_n), ..., c_n(ct_1, ..., ct_n)

Then we compute the distance of the actual arguments towards each of the commands' signatures as a tuple. The reason for a tuple is that we disambiguate dispatch favouring specific types to the left.

    distance(command) =
      [ type_distance(t_1, ct_1), ..., type_distance(t_n, ct_n) ]

We compute the type distance by computing the number of steps from the actual type up to the target type, walking the hierarchy upwards (so subtypes are more specific). Each step on the hierarchy counts as two distance steps because we count "is Type has Trait" as slightly more specific than "is Type".

    type_distance(t_1, t_2 has tr_1, ..., tr_n)
      if t_1 === t2 and has(t_1, [tr_1, ..., tr_n]) = 1

    type_distance(t_1, t_2) if t_1 === t_2 = 0;

    type_distance(t_1, any) = error: not in the hierarchy

    type_distance(t_1, t_2) = 2 + type_distance(parent(t_1), t_2);

Where `parent(t)` gets the immediate supertype of `t`, and `has(t, [a, ...])` succeeds if type `t` is marked as implementing all of the specified traits (we do not check trait conformance at dispatch time because it would be very expensive to do so).

Commands candidates for which the actual argument types is not in the expected hierarchy of the expected parameters will be removed from the candidate pool.

#### Choice and disambiguation

To choose a command we pick the single most specific command such that:

    distance(chosen)[0] < distance(others)[0]
      and ...
      and distance(chosen)[n] < distance(others[n])

Of course, this can (and should) be optimised to a proper decision tree that collapses all of these comparisons. But the semantics that should hold is that chosen commands are disambiguated left-to-right. In case there are more than one command that could be selected (more than one command in the candidate pool), the chosen one will be that which the types on the left more specifically match (i.e.: have a shorter distance to) the expected parameter type.

It is always an error if the system cannot determine a **single** most specific command to invoke. Be that because there are no commands to invoke or because more than one matching command have the same specificity.

#### Fully ambiguous declarations

Because disambiguation only considers left-to-right specificity, Crochet must disallow any commands that _cannot_ be disambiguated. That is, the following declarations should be forbidden at declaration analysis time:

    command (A is point2d) === (B is point2d) =
      (A.x === B.x) and (A.y === B.y);

    command (A is point2d) === (B is point2d) =
      (A.y === B.y) and (B.x === A.x);

It is simply not possible to disambiguate these two commands as they have the exact same specificity and match the exact same arguments.

Traits make this more complicated, however:

    command (A has equality) =/= (B has equality) = not (A === B);
    command (A has other-trait) =/= (B has other-trait) = false;

In this case both commands have the same specificity, but they don't necessarily match the same set of arguments. So the declaration analysis can be a bit more forgiving and emit a warning (with specific action points if it can find type sets for which `equality` and `other-trait` match), leaving the forbidding of ambiguous invocation up to runtime.
