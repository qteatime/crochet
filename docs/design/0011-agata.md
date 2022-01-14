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

    effect todo with
      add(title is text);
      remove(id is todo-id);
      mark(id is todo-id, done is boolean);
    end

    implement to-widget for todo;
    command todo as widget do
      let Input = agata reference: "input";
      let Add = agata reference: "add";
      handle
        commit: (
          flex-column: [
            ...self.items,
            card: [
              flex-row: [
                icon: "plus",
                text-input placeholder: "I need to..." | reference: Input
                  | grow: 1,
                text-button: "Add" | reference: Add
              ]
            ]
          ]
          | gap: { G in G horizontal: 0.5 em }
        );
      with
        on agata.key-up(Key) for Input do
          condition
            when Key is key-return => perform todo.add(Input materialise value);
            otherwise => nothing;
          end
          continue with nothing;
        end

        on agata.button-clicked() for Add do
          perform todo.add(Input materialise value);
          continue with nothing;
        end
      end
    end

    implement to-widget for todo-item;
    command todo-item as widget do
      let Checkbox = agata reference: "checkbox";
      let Delete = agata reference: "delete";
      handle
        commit: (
          card: [
            flex-row: [
              checkbox | reference: Checkbox,
              flex-child: self.title
                | grow: 1,
              icon-button: "trash" | reference: Delete,
            ]
          ]
        );
      with
        on agata.checkbox-toggled(Value) for Checkbox do
          perform todo.mark(self.id, Value);
          continue with nothing;
        end

        on agata.button-clicked() for Delete do
          perform todo.remove(self.id);
          continue with nothing;
        end
      end
    end

Note that most of the code here is really just checking for actions and
propagating them. But this isn't a complete application yet, one would
also need to keep the state around and handle the todo efffects:

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
      let State = #observable with: new todo([]);
      handle
        State
      with
        on todo.add(Title) do
          let New-item = #todo-item title: Title;
          State <- State value add: New-item;
          continue with New-item;
        end

        on todo.delete(Id) do
          State <- State value remove: Id;
          continue with nothing;
        end

        on todo.mark(Id, Done) do
          State <- State value mark: Id done: Done;
          continue with nothing;
        end
      end
    end

Here, the app uses an `observable` value (a reactive mutable cell) as an
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

    let Counter = agata reference: "counter";
    let State = #observable with: 0;

    handle
      flex-column: [
        "The button was clicked [State] times!",
        "Increases: [State from: [] fold: (_ append: _)]",
        text-button: "Click me!" | reference: Counter
      ]
    with
      on agata.button-clicked() for Counter do
        State <- State value + 1;
        continue with nothing;
      end
    end

Which would, after 3 clicks, render something like:

    The button was clicked 3 times!
    Increases: [1, 1, 1]
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
