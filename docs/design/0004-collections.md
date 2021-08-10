# [#0004] - Collections

|                  |                 |
| ---------------- | --------------- |
| **Authors**      | Q.              |
| **Last updated** | 8th August 2021 |
| **Status**       | Draft           |

## Summary

A lot of interesting computations happen with collections of values, and Crochet is no exception to that, so a good collection definition is essential to make people productive with a programming language.

Crochet has to keep a few things in mind here:

- **The language must favour immutability**. This has nothing to do with trying to be a functional language, but rather derives from the fact that trace debugging and time-travelling with deterministic exploration both backwards (through histories) and forwards (through especulative execution) would be impractical without heavily controlled mutation. We need to keep the histories to a reasonable size to conserve memory while tracing execution. Functional structures just make it a lot easier to reconstruct past computations from very discrete snapshots. Also, snapshotting functional structures is cheap---we just keep them away from GC by having a reference to it; no copies are necessary.

- **Most people programming in Crochet will likely not be professional programmers**. Or programming enthusiasts for that matter. The system is designed primarily for writers and artists that want to create games and other interactive content with a computer. Anything that comes out of this collection design needs to be explorable, and use language that does not require a PhD in abstract mathematics. Or computer science. People should be able to reason about costs without having a full understanding of common approaches to cost semantics, such as Big O or combinatorial mathematics. Ideally, they shouldn't _need_ to make many performance decisions upfront. If they ever need to make them, they should be helped by the debugging tools _and_ it should require very few changes to the code.

- **Inductive data should not rely on pattern matching**. A bit of an odd requirement, but pattern matching gets a bit annoying once you cannot have ubiquitous reflection on all data structures; and Crochet must prevent that to uphold its privacy and security guarantees. A privacy-preserving form of pattern matching for Crochet still needs to be devised. (Note that [Extractors](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5295&rep=rep1&type=pdf) are the wrong solution here)

## The hierarchy

Unlike most object-oriented (or hirerarchy-oriented) languages, Crochet does not use a complex hierarchy for collections. Instead, concepts that make up different collection types are defined as traits and implemented where things make sense. In this way, we define:

```
  - collection            -- The root of the collection hierarchy
  |
  |--- linked-list        -- cons-cell based linked list
  |--- map                -- hash-trie map
  |--- record             -- extensible records
  |--- set                -- hash set
  |--- stream             -- possibly infinite sequence, procedural
  |--- range              -- a numeric range
  `--- list               -- trie-based vector, the default data structure
```

And the traits:

- indexed (`_ at: _`, `_ at: _ put: _`)
- finite (`_ count`, `_ is-empty`)
- ordered (`_ first`, `_ rest`, `_ append: _`, `_ prepend: _`)
- indexed-and-ordered (`_ insert: _ after: _`, `_ insert: _ before: _`)
- collection (`_ contains: _`, `_ remove: _`, `_ find: _`)
- unordered-collection (`_ add: _`)
- mappable (`_ map: _`)
- foldable (`_ fold: _ from: _`, `_ fold-right: _ from: _`)
-

Operations:

    # Sequences
      ## Sequence (linked-list, range, list, stream)
      _ first
      _ second
      _ third
      _ rest

      ## Appendable sequence (linked-list, list, stream)
      _ append: X
      _ prepend: X
      _ ++ Xs

      ## Finite sequence (linked-list, range, list)
      _ without-last
      _ last

      ## Indexed sequence (linked-list, list)
      _ at: I/K
      _ at: I/K put: X
      _ before: I insert: X
      _ after: I insert: X
      _ remove-at: I

      ## Sliceable indexed sequence (linked-list, list)
      _ slice-from: I
      - slice-to: I
      _ slice-from: I to: J
      _ slice-from: I until: J

    # Containers
      ## Container (linked-list, set, list)
      _ remove: X
      _ contains: X

      ## Countable container (linked-list, map, set, range, list, record)
      _ count
      _ is-empty

      ## Unordered container (set)
      _ add: X

      ## Keyed container (map, record)
      _ at: K
      _ at: K put: V
      _ remove-at: K
      _ merge: C


    # Set algebra (set)
    _ union: Xs
    _ intersection: Xs
    _ complement: Xs

    # Iterable sequence (linked-list, list, stream)
    _ take-while: F
    _ drop-while: F
    _ enumerate

    # Filterable collection (linked-list, map, set, stream, list)
    _ keep-if: F
    _ remove-if: F

    # Transformable collection (linked-list, map, set, stream, list)
    _ map: F

    # Monadic sequence (linked-list, stream, list)
    _ flat-map: F
    _ flatten-once

    # Foldable sequence (linked-list, map, set, stream, list, range)
    _ fold-from: Z with: F
    _ fold-right-from: Z with: F
    _ fold-with: F
    _ fold-right-with: F
    _ some: F
    _ all: F
    _ all-true
    _ some-true
    _ sum
    _ product
    _ average
    _ maximum
    _ minimum

    # Zippable sequence (linked-list, stream, list)
    _ zip: Xs with: F
    _ zip: Xs

    # Sortable sequence (linked-list, list)
    _ reverse
    _ sort-by: F
    _ sort
