# Crochet Benchmarks

The main goal of these benchmarks is to compare Crochet's VM performance
on idiomatic Crochet code and relevant areas against a baseline JavaScript
implementation.

Benchmarks are described as a JSON file with the following structure:

```ts
type Version = string; // "<major>.<minor>.<patch>"
type Filename = string;

interface Variant {
  tag: string;
  source: Filename;
}

interface Benchmark {
  title: string;
  // The Crochet benchmarks, with a minimum-version constraint
  versions: { [version: Version]: Filename | Variant[] };
  // The baseline JS implementation
  baseline: Filename;
  // An 32-bit integer seed to initialise the PRNG
  seed: number;
  // A list of Crochet packages from stdlib that we depend on
  dependencies: string[];
}
```

## Micro-benchmarks

These small fabricated tasks can test specific features. It's currently mostly derived from the [Are We Fast Yet](https://github.com/smarr/are-we-fast-yet) set of benchmarks, unless otherwise noted.

- **bounce/** -- Simulates a ball bouncing within a box. This gives us an idea of how Crochet copes with more complex stateful simulations.

- **maze/** -- (Crochet-specific) simulates a maze generation algorithm.
