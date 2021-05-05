import { Universe, CrochetTest } from "../intrinsics";

export function add_test(universe: Universe, test: CrochetTest) {
  universe.world.tests.push(test);
}

export function filter_grouped_tests(
  tests: Map<string, Map<string, CrochetTest[]>>,
  filter: (_: CrochetTest) => boolean
) {
  let total = 0;
  let skipped = 0;
  const result = new Map<string, Map<string, CrochetTest[]>>();
  for (const [group, modules] of tests) {
    const group_tests = new Map<string, CrochetTest[]>();
    for (const [module, tests] of modules) {
      const valid_tests = tests.filter(filter);
      if (valid_tests.length !== 0) {
        group_tests.set(module, valid_tests);
      }
      skipped += tests.length - valid_tests.length;
      total += valid_tests.length;
    }
    if (group_tests.size !== 0) {
      result.set(group, group_tests);
    }
  }
  return { total, skipped, tests: result };
}

export function grouped_tests(universe: Universe) {
  const groups = new Map<string, Map<string, CrochetTest[]>>();
  for (const test of universe.world.tests) {
    const key = test.module.pkg.name;
    const module_key = test.module.filename;
    const modules = groups.get(key) ?? new Map();
    const tests = modules.get(module_key) ?? [];
    tests.push(test);
    modules.set(module_key, tests);
    groups.set(key, modules);
  }
  return groups;
}
