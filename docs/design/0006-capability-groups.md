# [#0006] - Capability Groups

|                  |                     |
| ---------------- | ------------------- |
| **Authors**      | Q.                  |
| **Last updated** | 26th September 2021 |
| **Status**       | Draft               |

## Summary

Crochet uses types as capabilities, but initial capability grants are static, and described in linking constraints. This works nicely for more coarse grained capabilities, but ends up being too complicated to manage more fine-grained ones. We can see this even in the currently experimental standard library.

For example, `random` provides a means of having a dynamically global (global within a particular dynamic stack scope) random instance by defining a function that wraps a nullary block with an effect handler for providing the random instance. But this means that if `f` calls `g` and `g` calls `h`, then it's entirely possible that `g` could override this global instance for `h`---a powerful action that we might not want to allow.

Sadly, the only way of addressing it currently is moving the handler definition to a separate package, because capability grants use a strict package boundary. This is what was done with the `wall-clock` type, for example, which _should_ have been a part of the `crochet.time` package.

The additional intricacies of figuring out how to communicate between these packages, and how to maintain these separate packages, and how to distribute these separate packages, and---well, and so on. All of these tiny details will mean that people will almost certainly not care about separating powerful objects from static packages, and Crochet's security guarantees will suffer as a result.

So some usability improvements are in order here. For this problem, this document suggests adding more fine-grained capability controls _within_ a package. That's now called a "capability group".

## Capability groups

A capability group is a strong capability that controls access to a group of types within a package. For example, if we go back to our previous examples, then we would be able to use capability groups to protect access to types within the same package as follows:

    capability global-random;

    abstract random;
    singleton global-random;

    effect random with
      get-random();
    end

    protect type global-random with global-random;
    protect effect random with global-random;

    command global-random with-source: (Instance is random) do: (Block is (() -> nothing)) do
      ...
    end

    command #random shared-instance = perform random.get-random();

What this means is that now we have a capability group called "global-random". It protects access to the type `global-random` and the effect `random`. So a package that just states a dependency on `crochet.random` will be able to request a shared instance, but not to provide one. In order to be able to provide global random instances, it would need to also state that it uses the capability `crochet.random/global-random`.

Likewise, wall-clocks may be moved back into `crochet.time` by adding a new capability group:

    capability wall-clock;
    singleton wall-clock;
    protect type wall-clock with wall-clock;

This lets us kill a 4-lines-of-code package, and makes users' lives less painful.

### Fine-grained control

Capability groups also address a different problem here: more fine-grained control over which capabilities are granted. This is relevant for things like the file system package, where we may choose differing degrees of power depending on how much we trust a package.

For example, one definition could be as follows:

    capability full-access;
    capability read-only;

    singleton file-system;
    singleton read-only-file-system;

    protect file-system with full-access;
    protect read-only-file-system with full-access;

    protect read-only-file-system with read-only;

In this case, `full-access` gives you access to all file system objects, but `read-only` only gives you access to the `read-only-file-system`.

### What about commands?

Commands are currently not part of any sort of capability system, but capability groups would allow access to specific methods to be protected as well in a reasonable manner. More investigation needs to be done here in order to figure out how exactly this would work, however. For example, if one passes an object around because they want to provide dynamic capabilities, does that mean that static capabilities could override that decision?

Likewise, if we were to check capabilities on every method invocation, things could get quite expensive. Almost every expression in Crochet is already a method invocation.

## Semantics

Given the simplified AST as follows:

```
Declaration d ::=
  | define x = e
  | type x(...) is t
  | effect x with ... end
  | capability x
  | protect d with c

Expression e ::=
  | x
  | #x
  | new x(...)
  | perform x(...)
  | handle e with x -> ... end
```

Then the following semantics apply:

```
eval(C, x):
  let D = lookup-definition(C, x)
  assert-capabilities(read, C, D)
  eval-expr(D.e)

eval(C, #x):
  let T = lookup-type(C, x)
  assert-capabilities(read | static, C, T)
  static-type(T)

eval(C, new x(...)):
  let T = lookup-type(C, x)
  assert-capabilities(read | new, C, T)
  make-instance(T, [...])

eval(C, perform x(...)):
  let E = lookup-effect(C, x)
  assert-capabilities(read | perform, C, E)
  perform(E, [...])

eval(C, handle e with x(...) -> ... end):
  let E = lookup-effect(C, x)
  assert-capabilities(read | handle, C, E)
  trap(e, \k v. if v is E -> ... else raise v)
```

In essence, a package has a set of declarations: definitions, types, effects, capability groups, and protection relationships. The protection relationships tell us how capabilities affect access to each package declaration, in a static sense. What we're trying to prevent here is to have any (contextual) references to these declarations from other packages, but still let some of them have it as a privilege.

So each package also declares which capability groups it requires in order to run. Some of these capability groups may be optional---in which case the package can still work without having access to it, it'll just have more restricted functions.

The capability checks for Crochet remain largely static: at compile time we check each package and ensure that no access can happen unless the package has the capability to do so (or the declaration is unprotected).
