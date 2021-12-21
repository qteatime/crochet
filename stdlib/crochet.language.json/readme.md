The `Language.JSON` package provides ways of parsing and writing
JSON-formatted data.

The entry point of all operations is the [type:json] singleton type.
This allows one to parse an JSON piece of text (through [command:_ parse: _]),
or write some Crochet data as a JSON piece of text (through
[command:_ serialise: _] and [command:_ pretty-print: _ indentation: _]).

# Trusted and untrusted text

It's possible to parse JSON from untrusted text---in this case all pieces
of text in the resulting Crochet value will also be untrusted.

Likewise, when writing JSON from Crochet values, any untrusted piece of
text present in the input will taint the output, making it likewise untrusted.

# Serialisable types

Only types that have strictly equivalent semantics to JavaScript's
implementation of JSON are allowed to be written as JSON. That means
[type:float], [type:text], [type:boolean], [type:list], and [type:record].
Note that [type:integer] is not serialisable by default! That's because JSON's
numeric type is often interpreted with a 64-bit floating point number semantics,
and that would be unsafe here.

In the future there will be a trait for describing serialisation and parsing
semantics for custom types.
