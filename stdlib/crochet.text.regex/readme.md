The `Text.Regex` package provides functionality for using regular expression
patterns to look for and extract certain parts of a piece of text.

# Before you use this package

You probably want to use `Text.Parsing.Lingua` instead of this package.
Regular expressions are widely used in computing, but they're very limited,
and it's extremely difficult to reason about the behaviour and performance
of a regular expression. Often regular expressions are also not maintainable.

That said, you might already have regular expressions provided from some
other place, or you might want to let the user provide a regular expression
pattern and then use that to operate on text. In those very restricted cases
this package might come in handy.

# How to use this package

You use regular expressions by first constructing a pattern, then compiling
this pattern, and finally using the compiled pattern's commands to operate
on pieces of text. This package is restricted to trusted pieces of text.

You may construct a pattern from a textual representation of the
regular expression (this package follows the same syntax as JavaScript's
regular expressions). This form is restricted to [type:static-text]:

    let Pattern = regex from-text: "\[a-z\]+";

Or by using the regular expression combinators:

    let Pattern = regex
                    | character-between: "a" and: "z"
                    | one-or-more;

In both cases you start from the singleton type [type:regex] and
end up with a value of type [type:regex-pattern]. You can then use
the [command:_ compile] command to turn it into a [type:compiled-regex-pattern].
This will allow you to use commands that operate on pieces of text with
the regular expression:

    let Regex = Pattern compile;
    // This would succeed because there are many letters in the text
    assert Regex can-match: "word";
    // This would fail because there are no letters in the text
    assert not (Regex can-match: "123456");

# Combining patterns

Note that there are only commands for constructing regular expressions
from literal pieces of text. You cannot write things like:

    let Word = "\[a-z\]+";
    let Number = "\[0-9\]+";
    let Pattern = Regex from-text: "[Word]|[Number]";

But you can combine regular expressions with the combinator commands.
For example, the intention above could be captured with:

    let Word = Regex from-text: "\[a-z\]+";
    let Number = Regex from-text: "\[0-9\]+";
    let Pattern = Word or Number;

This ensures that all regular expressions you combine maintain the
same semantics they had _before_ you combined them. For example, consider:

    let Pattern = "[Word][Number]";

This might seem innocent at first, "give me a word followed by a number,"
you think. But if `Word` contained `\\` and `Number` contained `\\d`,
we would be _changing_ the semantics of `Number` from something that
"matches any digit" to something that "matches a backslash followed by
the letter d". The combinator methods ensure that the semantics of each
individual piece is preserved:

    let Word = regex exactly: "\\";
    let Number = regex digit;
    let Pattern = Word or Number;

Would make the `Pattern` equivalent to the regular expression `\\\d`,
which is exactly what we expect—a backslash followed by a single digit.
