The `Time` package allows dealing with dates, points in time, and durations.
It's largely based on
[link:https://tc39.es/proposal-temporal/docs | JavaScript's Temporal API],
but currently missing many features needed for dealing with _dates_
correctly (in locale and culture-aware ways).

Unfortunately, due to the heavily multi-cultural and human-controlled aspect
of dates, they are an extremely complex topic. You should consider reading
the Temporal docs above and acquainting yourself with all of the ways in
which dates may work in ways you did not expect when considering its
human aspects.

# Structure of this package

Currently, `Time` provides two main types:

- [type:instant] is used to represent a fixed point in time, disregarding
  any concept of calendars, time-zones, and other cultural aspects of dates.
  You can think of this as "UTC timestamps", in a sense.

- [type:plain-date-time] is used to represent an instant as an UTC date-time
  in the Gregorian calendar (which is commonly used internationally). It cannot
  represent anything else as it has no concept of time-zones.

- [type:duration] is used to represent specific periods of time. Like
  "3 days and 5 minutes" or "35 seconds". Durations likewise have no concept
  of calendars. You cannot have something like "3 months" as a duration
  because there is simply no Calendar-agnostic concept of what "3 months"
  should mean.

# Constructing instants

You can construct instants from UTC ISO date-time pieces of text. For example:

    #instant from-iso8601: "2021-12-23T18:00:00.000Z";

You can also construct instants from the number of milliseconds since
1st January of 1970 at 00:00 UTC (the Unix epoch). In that case you'd use:

    #instant from-milliseconds-since-unix-epoch: 1_640_282_400_000;

Finally, if you acquire the [capability:wall-clock] capability, you can also
construct an instant from the current system's clock. The reason this is gated
behind a capability, despite being so commonly used in other languages, is
that access to this capability allows attackers to perform timing attacks.
In this case you'd need the [type:wall-clock] type to construct the instant:

    wall-clock now;

# Constructing Gregorian date-times

You can construct a [type:plain-date-time] by first constructing an instant
and then converting it:

    #instant from-milliseconds-since-unix-epoch: 1_640_282_400_000
      | to-plain-date-time;

Plain (Gregorian) date-times allow you to figure out how that instant in time
translates to a Gregorian date (e.g.: which month and year it occurred), but
since it does not have any concept of time-zones, it can't be used to derive
new dates from durations. That is, a `Gregorian-date + 3 hours` operation
would make no sense because it couldn't possibly deal with the idea of
time-zones, and thus would yield an incorrect date.

# Constructing durations

Durations can be constructed through either the type [type:duration], or
more commonly by using the extended methods in the type [type:integer].
For example, a duration of "3 days, 15 minutes, and 50 seconds" can be
expressed as this:

    3 days + 15 minutes + 50 seconds;

Durations can be used to operate on instants. For example:

    (#instant from-iso8601: "2021-12-23T18:00:00.000Z") + 3 days + 50 seconds;

Would be equivalent to:

    (#instant from-iso8601: "2021-12-26T18:00:50.000Z");

Currently the lowest duration is on the milliseconds level, so you cannot
create a duration in e.g.: microseconds.

It's important to note that a duration of `3 days + 15 minutes` represents
**exactly** 3 days and 15 minutes. It may be tempting to think it would be
the same as `4_335 minutes`, but that is not correct. They may be _equivalent_
in some contexts, but that equivalence is not the default behaviour, and using
durations to operate on dates relies on the _original_ units.

This also means that `3 days + 25 hours` means exactly "3 days and 25 hours",
which is not the same as "4 days and 1 hour". This is an important distinction
when thinking about time-zones and DST.

Durations can be "balanced"---in the sense that smaller units that overflow
their conventional maximum value are promoted to larger units.
`3 days + 25 hours | balanced` does indeed result into `4 days + 1 hour`.
