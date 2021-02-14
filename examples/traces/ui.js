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
  async function pick(vmi, actions) {
    if (actions.length === 0) {
      return null;
    }

    return await display.show_menu(
      actions.map((x) => ({ title: x.title, value: x }))
    );
  }

  vm.on_pick(pick);
};
