# [#0012] - Revisiting effect handler abstractions

|                  |                    |
| ---------------- | ------------------ |
| **Authors**      | Niini              |
| **Last updated** | 19th February 2022 |
| **Status**       | Draft              |

## Summary

Crochet has effects and effect handlers in a somewhat similar way to Eff
and other languages that allow users to define their own custom handlers.
However, Crochet's effects and handlers are primarily meant as a way of
capturing and describing external/non-deterministic operations, and only
incidentally a control flow abstraction, due to the choice of using
one-shot delimited continuations for it.

The current abstraction pattern of defining a function that installs
the handler and takes a lambda that will be invoked within that context,
as much as it's directly influenced by Eff, poses a few significant problems
here. First it leads to code that looks like this:

    command main-html: Root secret: Secret do
      let Purr = purr-app instantiate: Secret;
      purr-app purr: Purr with-real-handlers: {
        websocket-handler with-real-handlers: {
          timer with-real-timer: {
            agata-dom with-root: Root do: {
              for Page in #purr-page pages do
                agata register-page: Page;
              end
            }
          }
        }
      }
    end

Most of these handler installations require no real configuration, but
you need to install them at the top level anyway to get anything done.
This will cause users to skip on defining proper effects and handlers
for the external interactions, and as a result the whole idea of Crochet's
durable and accurate traces for time-travelling falls apart.

The second problem is that the code creates an unintentional nesting of
handlers, which describes that one has a specific instantiation of effects
such as: `Purr (WebSocket (Timer (Agata-UI)))`, which must be distinct from
a separate instantiation such as: `Agata-UI (Timer (WebSocket (Purr)))`—
and this might come into play if code within these handlers may perform
effects of a separate handler, creating confusing experiences for the
programmer trying to debug what exactly is wrong with this dynamic
configuration.

Now, the specific problem of these instantiations is that they are not
_really_ desirable. What we want is rather an instantiation where all
of these effects exist in parallel (and can mutually reference each other).
This is to say that Crochet rejects the idea of "algebraic" in algebraic
effect handlers, and rather sees effects and handlers as a form of external
signal or operation for which a runtime may provide an implementation of,
but does not really support these to influence the semantics of execution
in any significant way. That is, we want to move away from effect handlers
as a control flow abstraction.

Ideally, the first example should be able to be rewritten as follows:

    command main-html: Root secret: Secret do
      let Purr = purr-app instantiate: Secret;
      handle
        for Page in #purr-page pages do
          agata register-page: Page;
        end
      with
        use purr-app-handler purr: Purr;
        use agata-dom-handler root: Root;
      end
    end

Where both the WebSocket and Time packages will have defined zero-configuration
handlers that are automatically installed at the top-level:

    handler real-websocket-handler with
      on ...
    end

    default handler real-websocket-handler;

    handler real-timer-handler with
      on ...
    end

    default handler real-timer-handler;

The other semantics remain untouched. It'll continue to be based on
one-shot delimited continuations, and will continue to (incidentally)
support minimal control-flow abstraction. Continuations are well
understood and studied, and they have worked well for Crochet so far.

## Language changes

The change proposed here is primarily in how handlers are abstracted over.
We want to introduce a new way of describing handlers---so they become
a first-class concept you can name and reference. And we want a way of
referencing and installing handlers. This comes both with the `default handler`
and `use` operations.

In essence, the language changes as follows:

    Declaration d ::=
      + handler <name> {<parameters>} {do <stmt+>} with <handle-spec> end     -- named handler
      + default handler <name>                                                -- auto install

    Handler-spec h ::=
      + use <name> {<arguments>} ;

    Protect p ::=
      + protect handler <signature> ;

No other language changes are necessary.

## Semantics

In order to implement this, a new namespace for handlers needs to be created. Handlers are uniquely identified by their signature, which also includes the
name portion, and they're prefixed by the package they're in.

A `default handler` can only happen at the top level for handlers defined in
that package, and which do not take any configuration. Any other case has to
be covered by the `use` handler spec.

A `use` handler will configure the handler with the given parameters, executing the body in a new environment, and saving that environment for the handler specs defined within the referenced handler. These specs are then transplanted to the handler stack, sharing the entry with everything else in the handle block.
