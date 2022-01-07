# [#0008] - Tracing

|                  |                  |
| ---------------- | ---------------- |
| **Authors**      | Q.               |
| **Last updated** | 7th January 2022 |
| **Status**       | Draft            |

## Summary

Crochet needs a way of letting people understand the execution of their
programs over time. Tracing has long since been used for this, and this
document proposes a way of adding tracing to Crochet.

For example, let's say you want to understand how a certain value evolves
over time. You could write the following:

    open crochet.debug;
    open crochet.debug.tracing;

    singleton player-coordinates;

    type player(x, y, speed, gravity);

    command player update do
      self.x <- self.x value + self.speed;
      self.y <- self.y value + self.gravity;
      transcript tag: player-coordinates inspect: [x -> self.x value, y -> self.y value];
    end

And then record the program and format the trace visualisation:

    let Constraint = #trace-constraint has-tag: player-coordinates;
    let Trace = trace record: Constraint in: {
      let P = new player(#cell with-value: 0, #cell with-value: 0, 2, 1);
      for I in 1 to: 100 do P update end
    };

    Trace events
      | map: { Event in let Coords = Event value as record; // otherwise sealed
                        #document fixed-width: 250 height: 200 with: [
                          #document circle
                            | center: (#doc-point2d x: Coords.x y: Coords.y)
                            | radius: 10
                            | style: { S in S fill-colour: "#000000" }
                        ]}
      | timeline;

This should result in a _timeline_ in the playground that lets you step
forward and backwards in time, with the position of the player being
plotted in a 250x200 canvas at each step. With a bit more of effort, one
could fold over the events and display an onion-skin of the trajectory
of the player. And once the document language supports interactive elements,
these frames could even support direct and immediate manipulation of the
underlying code.

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

    command list sort: (Lt is ((A, A) -> boolean)) -> list<A> do
      condition
        when self is-empty => [];
        otherwise do
          let X = self first;
          let Less-than = self rest keep-if: { Y in Lt(X, X) };
          let Greater-than = self rest keep-if: { Y in not Lt(X, Y) };
          (Less-than sort: Lt) ++ [X] ++ (Greater-than sort: Lt);
        end
      end
    end

Understanding this function requires understanding how all of the calls
to `_ sort-by: _` nest, but that wouldn't be visible from a regular
trace---this is one of the problems with printf-debugging. So this
document proposes nestable spans (which roughly map to stack frames here)
to keep the context of each of these traces, and their relations to the
program's execution.

With this we have:

    let Constraint = #trace-constraint command: "_ sort: _";
    let Trace = trace record: Constraint in: {
      [3, 5, 1, 2, 6, 9, 7] sort: (_ <= _)
    };
    Trace events
      | correlate-returns
      | hierarchy;

This can then be rendered as a tree of states, rather than a linear timeline.
It's important that this work as a tree because here each step of `_ sort: _`
makes two separate calls to itself. A linear timeline would lose that
relationship, and thus make it harder to understand what was going on with
the program.

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

The choice of implementation here is to allow the span to be either a
user-defined first-class span (created through the tracing API), or
an activation record (implicitly created by the VM). Locations may or
may not exist, as having traces that hold on to the activation records
for too long in all cases would make it difficult to optimise the
execution---recorded frames could never be garbage collected.

It's not as much of a problem since tracing is meant primarily for debugging,
not production. But the more flexible location makes it usable in production
as well, with reduced accuracy for implicit hierarchies.

## Library support

`crochet.debug.tracing` should be the entry point of all tracing
interactions with the user. The operations it supports are:

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
