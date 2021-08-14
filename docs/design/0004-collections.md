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

### Containers

- **container** (a collection of items)
  - (list, linked-list, map, range, set, record)
  - contains:
- **countable container** (a collection of items with a known finite amount)
  - (list, linked-list, map, range, set, record)
  - count, is-empty^
- **modifiable container** (a collection of items that can be changed)
  - (list, linked-list, set)
  - add:, remove:
- **mapped container** (a collection of items identified by keys)
  - (record, map)
  - at:, at:default:, contains-key:
- **modifiable mapped container** (a mapped container that can change)
  - (record, map)
  - at:put:, at:update:, remove-at:
- **mergeable mapped container**
  - (record, map)
  - merge:

### Sequences

- **sequence** (a collection of ordered items)
  : list, linked-list, stream, range
  - first, rest
- **appendable sequence** (a weaker modifiable sequence that only allows changes at boundaries)
  : list, linked-list, stream
  - append:, prepend:, ++
- **finite sequence** (a collection of ordered items with a known finite amount)
  : list, linked-list, range
  - last, without-last
- **indexed sequence** (a collection of ordered items that allows referring to items by their order)
  : list, linked-list
  - at:
- **modifiable indexed sequence** (an indexed sequence that can change)
  : list, linked-list
  - at:put:
- **growable indexed sequence** (an indexed sequence that can grow/shrink)
  : list, linked-list
  - remove-at:, at:insert-before:, at:insert-after:
- **sortable sequence** (a sequence that can have its order changed)
  : list, linked-list
  - sort-by:, sort^
- **reversible sequence** (a sequence that can go backwards)
  : list, linked-list, range
  - reverse
- **sliceable sequences** (a sequence that supports slices)
  : list, linked-list
  - slice-from:to:

### Sets

- **set algebra** (a collection that supports set operations)
  : set
  - union:, intersection:, complement:

### Iteration

- **transformable collection** (a collection that supports map)
  : list, linked-list, stream, range, set, map, record
  - map:
- **chainable collection** (a collection that supports flatmap)
  : list, linked-list, stream, set
  - flat-map:
- **foldable collection** (a collection that supports fold)
  : list, linked-list, stream, range, set, map, record
  - fold:with:, fold-right:with:
- **zippable collection**
  : list, linked-list, stream
  - zip:with:
- **filterable collection**
  : list, linked-list, stream, set, map, record
  - filter:

## Available operations
