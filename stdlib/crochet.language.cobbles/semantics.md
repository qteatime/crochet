# Cobbles minimal semantics

The minimal semantics for Cobbles includes only describing data
representations and their serialisation/memory layout, but not
contracts and evolution.

## The language

The description language is as follows:

```
Module :: <Decl...>

Decl ::
  | type <name> { <Field...> }
  | union <name> { <Decl...> }

Field :: field <name> : <TypeExpr>
```

## Representation semantics

Given a type such as:

```
type Point2d {
  field x: integer;
  field y: integer;
}
```

Cobbles will always serialise them as a packed byte sequence using the
order in which fields are declared. So, in this case, the value would
be serialised as `<0><x:bigint><y:bigint>`, not tagged, but versioned.
Little endian encoding is always used.

For unions, the serialisation includes a tag for the specific union
case, so it can deserialise it later:

```
union Shape {
  type Square { field side: integer }
  type Circle { field radius: integer }
}
```

So given a value like `Square { side: 10 }` the serialisation would
end up like `<0><0><10>`, where the second `0` is the tag for `Square`
in this union.

Evolution in Cobbles is _not_ done with optional fields, but rather with
new schemas and type versioning.

## Common types

```
Integer (arbitrary size), Integer32, Integer16, Integer8
Boolean (1 bit)
Text (arbitrary size)
List<T> (size(T) * length(list))
Float64, Float32
```
