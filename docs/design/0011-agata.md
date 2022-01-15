# [#0011] - Agata, a safe UI runtime

|                  |                   |
| ---------------- | ----------------- |
| **Authors**      | Q.                |
| **Last updated** | 14th January 2022 |
| **Status**       | Draft             |

## Summary

The IDE for Crochet will be built in Crochet, and will be extensible by
users. This poses a problem: if users can extend the IDE, they would be
able to blur the line between trusted and untrusted components. This
could have effects ranging from confusing to extremely dangerous
(e.g.: when dynamic grants for capabilities are implemented, we must
ensure that packages are _not_ able to impersonate kernel dialogues!)

So the design for Agata focuses on extensibility and safety. However,
it ends up touching a few other areas by necessity of being debuggable
as well---for example, the entire runtime is based on synchronous/reactive
languages' ideas of UI, which is a bit more composable and modular than
functional programming takes on this, such as FRP.

## Language

Agata's language has a few core components:

- **References** are unforgeable identifiers that can be attached to objects.
  The primary reason for this is to be able to talk about elements deeply
  nested in the tree without giving users any reflection capability (as
  that would otherwise leak data between trust boundaries);

- **Active cells** are dynamic components that are rendered based on some
  stream of changing state (or "synchronous variables" in synchronous
  literature). This is pretty much just data-flow based.

- **Widgets** are types that represent something that can be displayed and
  interacted with by the user (this also includes layouting widgets). Similar
  to other UI libraries.

  Widgets can be "committed" (rendered) and passed around. Commiting widgets
  is important when effect handlers are involved, because they would
  otherwise execute outside of the known dynamic scope.

- **Effects** components communicate with each other by performing effects.
  This is just provided by the Crochet runtime. And it means that hooks
  just follow the dynamic configuration of the program.

For example, a "to-do list" component could be written as follows:

    type todo-id;
    type todo(items is cell<list<todo-item>>);
    type todo-item(id is todo-id, title is text, done is boolean);
    singleton new-todo;

    effect todo-ui with
      add(title is text);
      remove(id is todo-id);
      mark(id is todo-id, done is boolean);
    end

    implement to-widget for new-todo;
    command new-todo as widget do
      let New-title = #observable-cell with-value: "";

      card: (
        flex-row: (
          text-input
            | placeholder: "Add a task"
            | value: New-title,
          icon-button: "plus"
            | disabled: (New-title map: (_ =/= ""))
            | clicked: { S in
                S listener subscribe: { _ in
                  perform todo-ui.add(New-title value)
                }
              }
        )
      );
    end

    implement to-widget for todo;
    command todo as widget do
      flex-column: self.items
        | gap: { G in G horizontal: (0.5 as em) }
    end

    implement to-widget for todo-item;
    command todo-item as widget do
      let Done = #observable-cell with-value: self.done;
      Done stream subscribe: { X in perform todo-ui.mark(self.id, X) };

      card: (
        flex-row: [
          checkbox | checked: Done,
          flex-child: self.title
            | grow: 1,
          icon-button: "trash"
            | clicked: { S in
                S listener subscribe: { _ in
                  perform todo-ui.remove(self.id)
                }
              }
        ]
      )
    end

The state is propagated and synchronised with the dataflow-based
observable cells, and actions that require intervention from outside
(such as marking todos as done or removing them, as you may want to
persist those changes somewhere) are communicated through effects.

So, in the outer level, we need to handle these effects:

    singleton todo-app;

    command todo add: (Item is todo-item) =
      new todo(self.items append: Item);

    command todo-item title: (Title is text) do
      new todo-item(new todo-id, Title, false);

    command todo remove: (Id is todo-id) =
      new todo(self.items remove-if: { X in X.id =:= Id });

    command todo mark: (Id is todo-id) done: (Done is boolean) =
      new todo(self.items map: { X in
        condition
          when X.id =:= Id => new todo-item(X with done -> Done);
          otherwise => X;
        end
      });

    command todo-app render do
      let Todo = #observable-cell with: new todo([]);
      handle
        commit: (flex-column: [
          Todo,
          divider: "half",
          new-todo
        ])
      with
        on todo.add(Title) do
          let New-item = #todo-item title: Title;
          Todo <- Todo value add: New-item;
          continue with nothing;
        end

        on todo.delete(Id) do
          Todo <- Todo value remove: Id;
          continue with nothing;
        end

        on todo.mark(Id, Done) do
          Todo <- Todo value mark: Id done: Done;
          continue with nothing;
        end
      end
    end

The app uses a `observable` values (a reactive mutable cell) as an
active view. Changes to this value are re-rendered by the runtime, so the
code just needs to care about updating its top-level state and letting
the results trickle down the rendering tree.

### More on active views

Active views are really just reactive mutable cells---a push-based reactive
stream that has a _known_ "current value". This is provided by the concurrency
library, and Agata just defines a rendering command for it, by implementing
`to-widget`. Which in turn means that active views can be seamlessly
used in the UI code as if they were just regular widgets.

This also goes for other basic values, which means one can write the following:

    let Clicks = #event-stream empty;
    let Total = #observable-cell
                  from-stream: (Clicks from: 0 fold: { N, _ in N + 1 })
                  initial-value: 0;

    flex-column: [
      "The button was clicked [Total] times!",
      text-button: "Click me!"
        | clicked: Clicks
    ]

Which would, after 3 clicks, render something like:

    The button was clicked 3 times!
    <Click me!>

Basing this on observables also means that we can make this work with the
database effortlessly, by turning the database into a reactive value (which
is on the roadmap for performance reasons---searches need to be incremental).
With that we could get:

    relation Who at: Where;

    command game render do
      let People = search Player at: Where,
                          Who at: Where,
                          if not (Who =:= Player);
      "You're at [People.Where first]. You see [english list: People.Who]";
    end

Then as the player interacts with the game, and facts are added, removed,
and changed from this database, the rendered game screen would automatically
update with the new facts, possibly giving you this after a while:

    You're at the park. You see Alice, Clara, and Bob.
