Pickles is a small language for parsing schema-less structured data into
a different structure that's easier to process in the usage context.

## Types

Pickles concerns itself first and foremost with basic structured types,
like those found in JSON, and provides an extension point for converting
these into arbitrary types in the host language, as commonly found in parser
combinator libraries.

The types provided in Pickles are:

- `Integer` --- arbitrary-precision integer;
- `Float-64bit` --- floating point (double-precision);
- `Boolean` --- true or false;
- `Nothing` --- aka null;
- `Anything` --- aka any;
- `Text` --- UTF-8 strings;
- `List(T)` --- sequence of type T;
- `T | U` --- either type `T` or `U`, with PEG ordered-choice semantics.

## Schemas

Schemas describe operations for both extracting values and pointing them
into a different structure. Schemas might look like this:

    let File = {
      path: Text at filename,
      mime: Text at mime-type | Nothing
    };

This means that the following JSON blob:

    {
      "filename": "assets/cg.png",
      "mime-type": "image/png"
    }

Would result in the following record structure:

    {path: "assets/cg.png", mime: "image/png"}

And the following JSON blob:

    {
      "filename": "assets/cg.png"
    }

Would result in the following record structure:

    {path: "assets/cg.png", mime: nothing}

## Operators

Operators are the core primitive of parsing in Pickles. Types are a primitive
operator, and they accept transformations. The following are valid
transformations on primitive parsers:

- `<parser> at <path>` --- dives into `<path>` before applying the parser.

- `match <parser> with ... end` --- basic pattern matching on the result of the parser.
