The `Debug` package provides very basic support for trace-based
debugging, although currently there are no tools to properly
support this.

# Print-based debugging

The [type:transcript] global provides an interface to the execution
transcript—a thing that records all events that happened during the
execution of the program. The manipulation of the transcript is
currently limited to writing messages to it.

[command:_ write: _] is used for writing plain text messages, and
[command:_ inspect: _] supports writing arbitrary values (these can
be inspected with the rich transcript inspector in the web runtime,
but are simply pretty-printed in the console runtime).

# Benchmarking

The [type:benchmark] global provides a minimal interface to time
the execution of pieces of Crochet. It provides only the
[command:_ block: _], and the output ends up in the transcript—for
security reasons, there is no way of inspecting the from the
program itself.

Using the benchmark feature looks like the following:

    benchmark block: {
      let Numbers = (1 to: 1000)
                      | map: (_ + 1);
    };
