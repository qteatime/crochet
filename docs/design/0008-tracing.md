# [#0008] - Tracing

|                  |                  |
| ---------------- | ---------------- |
| **Authors**      | Q.               |
| **Last updated** | 3rd January 2022 |
| **Status**       | Draft            |

## Summary

Crochet needs a way of letting people understand the execution of their
programs over time. Tracing has long since been used for this, and this
document proposes a way of adding tracing to Crochet.

For example, let's say you want to understand how a certain value evolves
over time. You could write the following:

    open crochet.debug;

    singleton player-coordinates;

    command player update do
      self.x <- self.x value + self.speed;
      condition
        when not self is-touching-ground do
          self.y <- self.y value - self.gravity;
        end
      end
      transcript inspect: [x -> self.x, y -> self.y] tag: player-coordinates;
    end

And then record the program and format the trace visualisation:

    let Trace = trace record
                  | timeout: 30 seconds;
    Trace
      | select: player-coordinates
      | map: { Coords0 in let Coords = Coords0 as record; // otherwise sealed
                          #document fixed-width: 500 height: 500 with: [
                            #document circle
                              | center: (#doc-point2d x: Coords.x y: Coords.y)
                              | radius: 10
                          ]};

This should result in a _timeline_ in the playground that lets you step
forward and backwards in time, with the position of the player being
plotted in a 500x500 canvas at each step. In the future the trace and
document languages should be able to support more advanced uses, e.g.:
folding this trace over a sliding window so that you can display an
onion-skin trajectory of the player. Or provide enough information that
allows this document to both relate to the original source code and
modify it---e.g.: by providing an interactive curve of the trajectory
that the user can modify by directly interacting with the curve or the
player coordinates at each step.

But that's out of the scope for _this_ proposal, because it requires
careful consideration of the capabilities that should be involved in
this---even though debugging features are not available for production
builds anyway.

Another example, a bit more complex, is trying to understand what a
recursive function is doing. In this case the way traces nest is
really important, and ideally we'd like to do all of this without
modifying any source code---because it's not maintainable or feasible
to always be modifying your functions (particularly since, going forward,
Crochet will just forbid doing that without creating a complete new
version of the function, and then things are bound to get _confusing_).

Consider:

    command list<A> sort-by: (Lt is (A -> B)) -> list<B> do
      let Less-than = self rest filter: { X in Lt(X) };
      let Greater-than = self rest filter: { X in not Lt(X) };
      (Less-than sort-by: Lt) ++ [self first] ++ (Greater-than sort-by: Lt);
    end

Understanding this function requires understanding how all of the calls
to `_ sort-by: _` nest, but that wouldn't be visible from a regular
trace---this is one of the problems with printf-debugging. So this
document proposes nestable spans (which roughly map to stack frames here)
to keep the context of each of these traces, and their relations to the
program's execution.

With this we have:

    let Tracer = trace observe: (trace-constraint command: "_ sort-by: _");
    let Trace = trace span: { [3, 5, 1, 2, 6, 9, 7] sort-by: (_ <= _) };
    Trace
      | select: Tracer
      | map: { Call in [in -> Call parameters first, out -> Call result] };

This can then be rendered as a tree of states, rather than a linear timeline.
It's important that this work as a tree because here each step of `_ sort-by: _`
makes two separate calls to itself. A linear timeline would lose that
relationship, and thus make it harder to understand what was going on with
the program.

The top-level span here is added by the user, but all other spans in this
example are handled by the VM, based on how the activation frames nest
during the program's execution.

## Traces and spans

The primitives of this proposal are traces and spans. A trace is a typed
stream of all things that happened during the execution of the program over
a certain period of time. Spans, on the other hand, are a way of classifying
how all of these typed trace entries relate to each other---in a similar way
to distributed tracing spans.

This gives rise to the following language:

    span(parent: span | nothing)

    trace-entry ::
      | log(span, tag, message)
      | call(span, method, arguments)
      | return(span, value)

    trace(stream<trace-entry>)

Notice how spans naturally organise the relations of the entries in ways that
capture how they nested during runtime, making it possible to build more useful
visualisations that account for these relationships. Spans also quite naturally
mimic actual activation frames.

## VM support

In order for this to work the VM needs to support tracing in its core---it
would be very hard to properly trace things like function calls or type
constructions otherwise. The VM currently has minimal support for tracing,
based on recordable streams with constraint-based selections. This is similar
to the tracing mechanisms of the BEAM VM.

More work is needed to relate these recorded traces to spans, though, as the
VM does not have any concept of spans currently.

## Library support

`crochet.debug` should be the entry point of all tracing interactions with
the user. The operations it supports are:

- Marking a region of code as a trace span (i.e.: all code within ran from
  that dynamic region will get tagged with the same span);
- Adding constraints to the VM trace recorder;
- Querying traces and spans (which is how you get a portion of a trace, safely);
- Transforming traces (which is needed for building visualisations with them);

## Reflection issues

Because traces allow you to inspect any piece of code, anywhere, that would
mean that they also contain enough power to subvert all of the privacy and
security guarantees Crochet provides---the usual issues with reflection.
This proposal mitigates this in two ways:

- Access to the tracing facility is gated through a powerful `tracing`
  capability. This is granted to playgrounds automatically, but only for
  the top-level package.

- All values in the traces are sealed---users are required to unseal them
  if they want to do anything besides dumping the trace (with the default
  value's visualisations) on the screen. This allows us to maintain the
  privacy guarantees because unsealing requires access to the type one's
  casting to, and that goes through the regular capability checks.
