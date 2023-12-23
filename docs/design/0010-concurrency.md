# [#0009] - Concurrency primitives

|                  |                   |
| ---------------- | ----------------- |
| **Authors**      | Niini             |
| **Last updated** | 13th January 2022 |
| **Status**       | Draft             |

## Summary

Crochet's concurrency is mostly based on cooperative processes, with
preemptive concurrency being entirely isolated with Zones (similar to
E's vats, which can also be distributed easily).

This document describes some of the cooperative concurrency primitives.
In particular, Crochet takes the following approach to concurrency:

- State machines are modelled as `actors` (which belong to Zones and
  can migrate between them);

- Tasks are modelled with `task`, `deferred`, and `promise`. This includes
  capabilities to cancel and asynchronous resource handling.

- Producing values and communicating within a zone is modelled with
  CSP `channel`s, which allows backpressure handling.

- Broadcasting values is modelled with reactive `event-stream`s and
  `observable`s. This does not support backpressure, but supports
  multiple listeners. And they're the core features of reactive
  capabilities in Crochet.

## Actors

Actors in Crochet are state machines. They're modelled as a type
that holds a mailbox **and** a current state. The current state
is a type that implements `actor-state`, a trait that allows the
state to define which messages it accepts and handles.

This gives you the following:

    singleton idle-phone is actor-state;
    type connected-phone(connected-to) is actor-state;


    command idle-phone accepts: connect = true;
    command idle-phone handle: (M is connect) =
      self transition-to: new connected-phone(M.target);


    command connected-phone accepts: receive = true;
    command connected-phone handle: (M is receive) = ...;

    command connected-phone accepts: send = true;
    command connected-phone handle: (M is send) = ...;

    command connected-phone accepts: hang-up = true;
    command connected-phone handle: (M is hang-up) =
      self transition-to: idle-phone;


    define actor = #actor with-state: idle-phone;

This is a state machine with two states: phones can be either idle
or connected. When a phone is idle, the only thing it can do is
accept incoming connections. When a phone is connected it can't
accept incoming connections before hanging up. If this actor receives
a message that the current state can't handle, it just sits in the
mailbox until it transitions to a state that does accept it. The idea
is similar to Erlang's `receive` block, just done with commands and
types instead of functions and pattern matching.

## Tasks, Deferreds, Promises

These are modelled after the previous work on Folktale's concurrency
primitives: https://folktale.origamitower.com/api/v2.3.0/en/folktale.concurrency.html

However, as they do not have a formal model of concurrency specified
yet (unlike actors that are more well understood), there needs to
be some work in drafting a formal model for it. That work will be
done in a future proposal.

## Channels

CSP channels are a well-understood formal model for concurrency.
Crochet's implementation however takes inspiration from Clojure's
core.async, which is **not** the same as Hoare's original formulation.

In particular, Channels are given a bit more flexibility by allowing
one to specify the backing buffering storage of the channel (and this
in turn controls how and when synchronisation happens). And they are
also given a more first-class and functional API.

## Events and observables

Event streams are roughly based on Rx's Observables idea. They're
a push-based, unbuffered (by default) stream that has a functional
API on top.

Observables, on the other hand, are roughly based on synchronous
variables from data-flow/synchronous languages, such as Lucid.
In this case, each observable _is_ a stream (it's potentially
many different values), but it also includes a cursor to some
point of this stream.

This means that you can have something like:

    let Seen = search Player at: Where, Who at: Where, if Who =/= Player
                 | observable;
    ui show: "You see [Seen]";

In this example, it looks like we're getting just one value
at a particular point in time and outputting on the screen, but
given how interpolations and observables work, this is actually
an _active_ value---the text on the screen is automatically
updated every time the facts in the database change, and the
search can be ran entirely incrementally.
