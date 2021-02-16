window.OrangesUI = (vm, ffi, display) => {
  const global = vm.global;

  // FFI
  async function show_database(vmi) {
    console.log(vm.database.all_facts());
    return vmi.nothing;
  }

  ffi.add("show-database", 0, show_database);

  async function wait_click(vmi) {
    await display.click_to_continue();
    return vmi.nothing;
  }

  ffi.add("wait-click", 0, wait_click);

  // Hooks
  function shuffle(xs) {
    return xs.sort((a, b) => Math.random() - 0.5);
  }

  function partition(xs, p) {
    return [xs.filter(p), xs.filter((x) => !p(x))];
  }

  async function pick(vmi, actions) {
    if (actions.length === 0) {
      return null;
    }

    const [sticky, non_sticky] = partition(actions, (x) => {
      return x.action.tags.has("sticky");
    });

    const options = [...shuffle(non_sticky).slice(0, 5), ...sticky];

    return await display.show_menu(
      options.map((x) => ({ title: x.title, value: x }))
    );
  }

  vm.on_pick(pick);
};
