import { Types, Values, Location } from "./primitives";
import { Universe, CrochetValue, CrochetType } from "./intrinsics";
import { run_command } from "./run";

export function debug_perspectives(universe: Universe, value: CrochetValue) {
  const type = value.type;
  const debug_module = universe.world.types.try_lookup_namespaced(
    "crochet.core",
    "debug-representation"
  );
  const perspective = universe.world.types.try_lookup_namespaced(
    "crochet.core",
    "perspective"
  );
  const command = universe.world.commands.try_lookup("_ for: _ perspective: _");
  if (debug_module == null || perspective == null || command == null) {
    return [];
  } else {
    const branches = command.branches.filter((branch) => {
      return (
        branch.types[0].type === debug_module &&
        Types.is_subtype(type, branch.types[1].type) &&
        Types.is_subtype(branch.types[2].type, perspective)
      );
    });
    return [...new Set(branches.map((branch) => branch.types[2].type))];
  }
}

export async function debug_representations(
  universe: Universe,
  value: CrochetValue,
  perspectives0: CrochetType[]
) {
  const debug_module = universe.world.definitions.try_lookup_namespaced(
    "crochet.core",
    "debug-representation"
  );
  const root_perspective = universe.world.types.try_lookup_namespaced(
    "crochet.core",
    "perspective"
  );
  const debug_serialisation_type = universe.world.types.try_lookup_namespaced(
    "crochet.core",
    "debug-serialisation"
  );
  if (
    debug_module == null ||
    root_perspective == null ||
    debug_serialisation_type == null
  ) {
    return [
      {
        name: "Internal",
        document: {
          tag: "code",
          value: Location.simple_value(value),
        },
      },
    ];
  }

  const debug_serialisation = Values.instantiate(debug_serialisation_type, []);

  const perspectives1 = await Promise.all(
    perspectives0.map(async (perspective) => {
      if (!Types.is_subtype(perspective, root_perspective)) {
        console.warn(
          `Skipping ${Location.type_name(
            perspective
          )} in debug representation: not a perspective`
        );
        return null;
      }
      if (perspective.fields.length !== 0) {
        console.warn(
          `Skipping ${Location.type_name(
            perspective
          )} in debug representation: not a nullary type`
        );
        return null;
      }

      const name = await run_command(universe, "_ name", [
        Values.instantiate(perspective, []),
      ]);
      return {
        name: name,
        type: perspective,
        instance: Values.instantiate(perspective, []),
      };
    })
  );
  const perspectives = perspectives1.filter((x) => x != null).map((x) => x!);

  const repr0 = await Promise.all(
    perspectives.map(async (perspective) => {
      try {
        const doc = await run_command(universe, "_ for: _ perspective: _", [
          debug_module,
          value,
          perspective.instance,
        ]);
        const json = await run_command(universe, "_ for: _", [
          debug_serialisation,
          doc,
        ]);
        return {
          name: Values.text_to_string(perspective.name),
          document: Values.to_plain_json_object(json),
        };
      } catch (error: any) {
        console.warn(
          `Skipping ${Location.type_name(
            perspective.type
          )} for debug representation: an error occurred when computing the representation.\n\n${
            error?.stack ?? error
          }`
        );
        return null;
      }
    })
  );

  return [
    ...repr0.filter((x) => x !== null).map((x) => x!),
    {
      name: "Internal",
      document: {
        tag: "code",
        value: Location.simple_value(value),
      },
    },
  ];
}
