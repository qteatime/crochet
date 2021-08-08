# [#0003] - Booleans

|                  |                 |
| ---------------- | --------------- |
| **Authors**      | Q.              |
| **Last updated** | 8th August 2021 |
| **Status**       | Draft           |

## Summary

Crochet chooses to adopt first-order logic for contracts and simulations, and it needs to do something about control flow. Booleans are already commonly used for all these three everywhere else, so Crochet just rolls with them for simplicity and familiarity.

## Core language

```
b in {true, false}

Expression e ::=
  | if e_1 then e_2 else e_3      -- conditional
  | e_1 and e_2                   -- conjunction
  | e_1 or e_2                    -- disjunction
  | not e                         -- negation
  | assert e                      -- truthness check
  | b
```

The semantics are pretty much the same as the common encodings of boolean algebra. Crochet chooses to have `_ and _`, `_ or _` and `not _` operators as methods, but `if _ then _ else _` and `assert _` are both static language constructs. The reason for this choice is just consistency: all other operators in the language are methods.

The `assert _` expression is a contract enforcement which evaluates its expression to a boolean, and stops the program if the boolean value is `false`. This allows first-order logic to be used anywhere to encode program invariants, and is ultimately the basis of higher-level Surface Crochet contracts, such as `requires` and `ensures` clauses in functions.

Simulations and search rely on similar semantics, but deviate slightly in certain places. We don't discuss search in this document.

## Why a two-valued logic?

The two main reasons are simplicity and familiarity. Almost every other programming language out there that isn't designed for non-deterministic programs uses a two-valued logic, and supplements it with different types on a need-by-need basis. E.g.: a three-valued logic can be encoded in Haskell by combining Booleans with the Maybe type.

Likewise, while three-valued logic would make sense in Crochet for certain operations, the language expects people to supplement it by, for example, combining `boolean` and `nothing`, or combining `boolean` and `result`. Which combination makes sense will vary between different contexts. Crochet's aggressive value tagging (in its semantics, not necessarily implementation) guarantees that these can be safely combined in all cases.

But what about many-valued logics with more than three states, or even fuzzy logics? Crochet isn't a probabilistic language, so it doesn't make as much sense to have such support directly in the language core---it would require people to think about their programs in probabilistic terms _even_ when an execution is deterministic. And deterministic programs are the norm in Crochet.

## Boolean algebra

Because conjunction, disjunction, and negation are specified as methods in Crochet, they are described in a trait:

- Boolean algebra
  - `_ and _` -- conjunction
  - `_ or _` -- disjunction
  - `not _` -- negation

The traits specify laws for these operations from abstract algebra, so it's a fair game for any other type to implement these operations if they can fulfill all of the laws---abstract algebra and category theory are both a blessing and a curse here.

## Implications of a static branching operation

Given that Crochet uses multi-methods dispatching on the value types, there was no strict need of introducing a static branching operation to the language. `if _ then _ else` could have been just a method:

```
command if true then F else G = F();
command if false then F else G = G();

command if ok then F else G = F();
command if error then F else G = G();

// definitions for other types could follow here
```

This works semantically, but there are two problems with it:

- Crochet is gradually typed. At compile-time the compiler does not always know the concrete types of the arguments to a method, and thus cannot specialise it in all cases. Where we cannot specialise `if _ then _ else _` we would need to reify the branches in a closure so they can be passed over to the method, and that's expensive. Also, if we choose to optimise the method on booleans specifically, what do we do if they're overriden by the user? And if more `if _ then _ else _` implementations are defined at runtime---a common occurrence in Crochet---then we'd need to throw away a lot of previously compiled code and try compiling again. The costs of this quickly stack up and the benefits don't make up for it.

- Crochet has a special search DSL based on classical symbolic logic. This is the more important issue: this logic DSL does not work with the multi-method system, and it provides its own intrinsic operators, one of which is a constraint `if` clause. Not only that, but the evaluation semantics of this logic DSL are more similar to Prolog, hence completely different from regular Crochet. Requiring Crochet code to be called from the logic DSL would, for example, would impose a specific evaluation order and prevent many important optimisations on to prune the search space.

A worse consequence of these problems is that, for consistency, assertions and search would need to be able to understand arbitrary values through a two-valued logic, requiring significantly more method invocations. The intrinsic equality operator (`=:=`) is static to make things consistent across all these three languages, and any deviation causes confusion and performance issues.

Because of this, logic tests are restricted to booleans specifically, and thus branching and other logical constructs are also restricted to booleans specifically.
