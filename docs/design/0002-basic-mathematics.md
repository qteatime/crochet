# [#0002] - Basic Mathematics

|                  |                 |
| ---------------- | --------------- |
| **Authors**      | Niini           |
| **Last updated** | 3rd August 2021 |
| **Status**       | Draft           |

## Summary

Crochet is not designed for heavy numeric analysis, however it will need to support a reasonable numeric tower none the less. This document describes an initial mathematical support that is possible to extend later by user-defined packages.

## Core types

As the core numeric types, Crochet chooses:

- Arbitrary-precision integers (`123_456_678_901_234_567_890`)
- 64-bit floating point values (`123.0`)

The reason for this choice is that they have a direct (and thus efficient) encoding in JavaScript, which is the primary runtime for Crochet; and they cover most of the common use cases. Rationals and decimals can be later on tacked on top of this same hierarchy.

More efficient numeric encodings will need a bit more work, but that work is not contemplated by this document.

## The tower

Crochet will define the following type hierarchy:

    numeric                     (The base of all numbers)
      |
      |--- fractional           (The base of fractional numbers)
      |      |
      |      `--- float         (64-bit floats)
      |
      `--- integral             (The base of integral numbers)
             |
             `--- integer       (Arbitrary-precision integers)

Types are preserved when all numeric types involved in an expression are consistent. So `integer + integer` will yield an `integer`. Mixed numeric types involve a conversion to a common supertype, which _may_ incur in loss of precision. There may be types in the tower that forbid mixed numeric operations altogether (as is planned for strict efficient numeric encodings, such as `32-bit-integer`), but those are out of scope in this document.

In general:

- Mixed integral types yield the highest precision integer that is guaranteed to hold the resulting value precisely.

- Mixed fractional types, similarly, yield the highest precision fractional type that will hold the result (although loss of precision may happen, as would be the case in mixing rationals with floats, for example---the result will be a lossy float).

- Mixed integral/fractional types will yield the highest precision fractional type that will hold the result, generally with loss of precision.

As we currently only have arbitrary-precision integers and 64-bit floating floating points, this means that all mixed numeric operations will yield lossy 64-bit floating points.

## Traits

Both concrete numeric types in this document implement the same base traits:

- Arithmetic:

  - Addition (`_ + _`)
  - Subtraction (`_ - _`)
  - Multiplication (`_ * _`)
  - Truncating division (`_ divided-by: _`) --- can be integral
  - Division (`_ / _`) --- always fractional
  - Remainder (`_ % _`)
  - Exponentiation (`_ ** _`) --- exponents are always integers

- Equality:

  - Type-strict equality (`_ === _`)
  - Type-strict not equals (`_ =/= _`) --- derived from `_ === _` if consistent

- Ordering:
  - Less than (`_ < _`)
  - Greater than (`_ > _`)
  - Less or equal to (`_ <= _`) --- can be derived from `_ < _` and `_ === _`
  - Greater or equal to (`_ >= _`) --- can be derived from `_ > _` and `_ === _`
  - The minimum of two values (`lesser-of: _ and: _`) --- can be derived from `_ < _`
  - The maximum of two values (`greater-of: _ and: _`) --- can be derived from `_ > _`

Integral types additionally implement:

- Discrete enumeration:
  - Successor of a value (`_ successor`)
  - Predecessor of a value (`_ predecessor`)
  - Inclusive arithmetic sequence (`_ to: _`) --- (from, to)
  - End-exclusive arithmetic sequence (`_ until: _`) --- (from, to(

Fractional types additionally implement:

- Rounding strategies:
  - Truncating (`_ truncate`)
  - Rounding down (`_ floor`)
  - Rounding up (`_ ceiling`)
  - Rounding to the nearest integer (`_ round`)

## IEEE-754 floating point specifics

Floating points will agree to the IEEE-754 specification, and as such will require additional properties. They get the following commands:

- Testing for NaN (`float is-nan`)
- Testing for finiteness (`float is-finite`)
- Constructing silent NaNs (`#float nan`)
- Constructing infinities (`#float positive-infinity`, `#float negative-infinity`)

## Strictness of division

The IEEE-754 implementations generally permit division by zero, propagating the error of such as NaNs. In order to be consistent with other types such division is ruled out by Crochet's contract for `_ / _`. This means that `A / B` where `B` is zero may be caught either during compilation or (more likely here) runtime, depending on what the static contract checker knows about the expression ahead of time.

## Overflows and underflows

Arbitrary precision integers cannot overflow or underflow, and floating points should be handled in the same way IEEE-754 specifies, and they will return infinities or zero respectively.
