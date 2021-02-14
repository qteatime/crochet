window.TicTacToeUI = (vm, ffi, display) => {
  const global = vm.global;
  const Erin = global.get_actor("erin");
  const Saga = global.get_actor("saga");
  let player = Erin;

  // FFI
  async function choose_player(vmi) {
    player = await display.show_menu([
      { title: "Erin (O)", value: Erin },
      { title: "Saga (X)", value: Saga },
    ]);
  }

  ffi.add("choose-player", 0, choose_player);

  // Hooks
  async function pick(vmi, actions) {
    const [env] = vmi.search("_ turn", [vmi.pvar("Actor")]);
    const actor = env.get("Actor");
    if (actor === player) {
      return await display.show_menu(
        actions.map((x) => ({ title: x.title, value: x }))
      );
    } else {
      return actions[Math.floor(Math.random() * actions.length)];
    }
  }

  vm.on_pick(pick);
};
