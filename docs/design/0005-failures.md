# [#0005] - Failures

|                  |                     |
| ---------------- | ------------------- |
| **Authors**      | Q.                  |
| **Last updated** | 10th September 2021 |
| **Status**       | Draft               |

## Summary

Computations in Crochet are not guaranteed to be total, so we need some principled way of dealing with the failures that will arise in user code. For this, however, we first need a taxonomy of failures, since different failures and contexts will require different mechanisms of dealing with them.

- **Non-totality due to type system limitations**: Some functions are non-total, and their non-totality can be expressed as a set of pre-conditions on the requirement type. In reality, what this means is that our type system is too limited for people to express these requirements in the types.

  The idea of "recovering" does not always make sense here because these are explicitly unsupported. Crochet provides contract pre-conditions for this case.

- **Unaccounted execution semantics**: Some functions will have implementation bugs that will lead to non-predicted semantics. These may exist in the function itself or in more complex interactions of the function with the rest of the program.

  We can't really "recover" from these failures because it was a result of a concrete execution unaccounted for in the design phase, so the only thing we can do is stop execution to prevent further damage. Data corruption may also lead to this. Crochet provides invariant assertions and post-condition contracts for this case.

- **Invalid composition**: Some failures happen because the program was composed in an incorrect way to begin with. This might be because there was a missing import, a typo in a variable name, a method that wasn't already defined, a capability that hasn't been provided.

  Here we want, as much as possible, to be able to check these statically and in the editing loop, such that users can have immediate and constant feedback about how the tools are understanding their programs. Sometimes these might spill to runtime because we don't have enough information to check it at compile time (or because we're not operating under closed-world assumptions). In such cases, this is considered an unrecoverable error UNLESS the programmer is in the loop to manually fix it.

- **Supported failure modes**: Some functions are non-total in theory, but made total in practice by reifying their possible failures. For example, reading a file from the file system is non-total, but the function may be implemented in such a way that failure states are communicated to the caller. So it may return either a file or an error state such as `file does not exist` or `insufficient permissions`.

  The failure modes for these functions _are_ part of their design, and need to be communicated to callers of it in a clear way. Callers are expected to deal with these potential failures in a way that makes sense in their context. So we likewise need first-class support for propagating these errors.

- **Exhausting resources**: Crochet's semantics assume an infinite supply of computational resources for simplicity, but practical computers have computational limits. Although Crochet may try to mitigate and fairly use these resources, there's still the potential that the computer will run out of them.

  There's not much we can do from Crochet itself if a computer does not provide the necessary computational resources for executing a program. There's no recovery from this, but we might actually want to isolate these failures and not allow them to take down the entire application, if possible---that's because we might want to compartmentalise untrusted code and give them limited resources to mitigate the damage they can cause if they misbehave.

## The tools

Given the categories above, Crochet provides the following tools to handle failures:

- **Static analysis**: where possible, Crochet will provide tools that help users discover mistakes early, while they're editing a program. This includes type systems, but also soft-contract checking, live and incremental parsing, reference analysis, etc. Static analysis primarily targets **invalid composition** failures, but varying degrees of static analysis tools can provide support for other failure categories (e.g.: resource analysis can warn against potentials of resource exhaustion).

  Static analysis support for Crochet is currently non-existent and very fuzzy, so we won't cover it in this document.

- **Contracts**: it should be possible for programmers to provide invariants and pre/post conditions that are required for the model a program uses to make practical sense---to be correct. Contracts handle **non-totality**, and invariants cover some **unaccounted execution**. Contracts will be covered in a separate document.

- **Panic**: at any point in time, a program can be halted with a panic message. This happens because we've realised that something went very wrong and we do not know how to fix it programmatically. This covers the remaining portion of **unaccounted execution** cases.

- **Result**: for **supported failure modes**, we need a way of reifying them and differentiating normal completion from errors. Results allow that while also mitigating issues with predicting the current program state after an error---since they don't bubble up the dynamic stack like exception handlers do.

- **Algebraic Effects**: sometimes it can be useful to compartmentalise larger portions of the program and decide how failures in general will be handled within this "box". Exception handlers do this in some languages, Crochet generalises that with algebraic effects. This accounts for the remaining cases of **supported failure modes**.

- **Zones**: sometimes the compartmentalisation of portions of a program need to be a bit more strict and strong isolation is required, because they contain untrusted code. Zones (similar to E's Vats) allow us to have that strong isolation, and address the issues of **resource exhaustion**. Zones and actors are largely a work in progress and will not be discussed in this document.

## Panic

Programs may sometimes enter states where we can't reason about what the program should be doing anymore. In these cases, the only sensible thing to do is to stop everything and let programmers deal manually with it. For this Crochet provides a "panic" API.

A "panic" is a form of exception propagated upwards through the dynamic stack, but which cannot be trapped by common means. We still need to be able to trap panics from tools and sometimes programmatically from things like tests, but regular code execution should never be able to trap a panic message.

Towards the user, we expose a single API: `panic tag: text message: text`. For convenience, methods accepting text-only interpolations and no tags should also be provided.

## Result

Results reify failures as first-class values. The API is inspired by Rust, Haskell, and Scala. Here we use `type Result v e = Ok v | Error e`.

Technically the only thing needed here is the type hierarchy and a way to dispatch on them, but it's useful to provide a few common operations on these types. The following are mostly lifted from other functional and OO languages:

- Constructors:
  - `#result ok: _`
  - `#result error: _`
- Projection of results:
  - `ok value`
  - `error reason`
  - `result value-or-reason`
  - `result value-or-default: _`
  - `result value-or-else: _`
  - `result value-or-panic: _`
- Transformation of results:
  - `result map: _`
  - `result map-error: _`
- Sequencing of result-yielding computations:
  - `result then: _`
- Recovering from errors:
  - `result recover: _`
- Combination of results:
  - `result and result` -- propagates the latter success
  - `result or result` -- propagates the first success
