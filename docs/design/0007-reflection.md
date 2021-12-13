# [#0001] - Runtime reflection

|                  |                    |
| ---------------- | ------------------ |
| **Authors**      | Q.                 |
| **Last updated** | 13rd December 2021 |
| **Status**       | Draft              |

## Summary

Runtime reflection is a terrible idea. Even if you properly protect it with capabilities. You should never add this to your language. And with that out of the way let's look at why Crochet will have a library that adds just that.

VM introspection is useful for debugging tools (and debugging tools only!), if we aim to move debugging tools to user-land. Crochet actually does **not** aim to do that---debugging is provided by the Purr IDE through a language-agnostic VM introspection service. But until we get there (there's a lot of work to be done), a reflection library approximates it. So long as Crochet never allows reflection to be used outside of debugging.

## Reflection for debugging

Crochet's VM follows a very capability-based architecture, where capabilities flow downwards through the hierarchy. In Crochet, the separation happens at the Package level (from a static capability point of view). However, Crochet also has several different namespaces, and we want to make sure that access is only granted to the correct ones.

To do so, the reflection library uses one static capability (`vm-introspection`), and allows all types flowing from that to act as a more restricted capability to some resource. The important thing to note here is that these more restricted capabilities can **never** return a capability for a more powerful resource! For example, if I give you the reference to a specific type, then you should not be able to get the package that type is contained in, because you'd have materialised access to many types (and commands, and a whole lot of other stuff I did not give you access to).

This restriction seems obvious, but it makes designing _usable_ APIs more difficult. For example, if one has a capability to a world---meaning they have access to pretty much all of the entities in the runtime---, then it's not unreasonable to expect the following piece of code to work:

    world types keep-if: { Type in Type package name starts-with: "crochet.text." };

To get all types from packages included in the standard distribution that deal with text. But with capabilities that only propagate downwards, we would force a user to rethink how they approach this problem and write the following instead:

    world
      | packages
      | keep-if: { Package in Package name starts-with: "crochet.text." }
      | map: (_ types)

Now, this isn't the end of the world. It still reads reasonably---even if it requires jumping through some hoops to get the same result. Of course, the problem is that cumbersome bits here and there always add up when things start composing, and that may "inspire" people to come up with less safe APIs that are _more ergonomic_, which would then obviously get all of the adoption---undestandably so, who wants to use something that is frustrating to do?

So the way this library approaches that is that restricted capabilities _may_ point to entities above them, as long as they don't grant any additional capabilities over resources. By introducing a more restricted type for each entity, it's possible to write the first example _without_ allowing the same user to, later on, use:

    world types keep-if: { Type in Type package commands };

## API entities

```
type vm {
  world -> world;
}

type world {
  packages -> list<package>;
  types -> list<type>;
  traits -> list<trait>;
  commands -> list<command>;
}

type package {
  name -> text;
  description -> text;
  file -> restricted-file;
  meta-data -> package-metadata;
  types -> list<type>;
  traits -> list<trait>;
  commands -> list<command>;
  capabilities -> list<capability>;
  definitions -> list<binding>;
  native-functions -> map<text, native-function>;
  granted-capabilities -> set<restricted-capability>;
  modules -> list<module>;
  dependencies -> list<restricted-package>;
}

type module {
  name -> text;
  documentation -> text;
  file -> restricted-file;
  types -> list<type>;
  definitions -> list<binding>;
  open-packages -> list<open-package>;
}

type type {
  name -> text;
  documentation -> text;
  parent -> restricted-type | nothing;
  is-sealed -> boolean;
  is-static -> boolean;
  sub-types -> set<restricted-type>;
  traits -> set<restricted-trait>;
  protected-by -> set<restricted-capability>;
  module -> restricted-module | nothing;
  fields -> list<field>;
}

type binding {
  name -> text;
  value -> restricted-value;
}

type field {
  name -> text;
  index -> integer;
  constraint -> type-constraint;
}

type type-constraint {
  type -> restricted-type;
  traits -> set<restricted-trait>;
}

type capability {
  name -> text;
  documentation -> text;
  module -> restricted-module | nothing;
}

type trait {
  name -> text;
  documentation -> text;
  module -> restricted-module | nothing;
  implemented-by -> set<restricted-typ>;
  protected-by -> set<restricted-capability>;
}

type command {
  name -> text;
  arity -> integer;
  branches -> list<command-branch>;
}

type command-branch {
  name -> text;
  documentation -> text;
  arity -> integer;
  module -> restricted-module;
  parameters -> list<parameter>;
}

type parameter {
  name -> text;
  index -> integer;
  constraint -> type-constraint;
}

type native-function {
  name -> text;
  arity -> integer;
  package -> restricted-package;
}

```
