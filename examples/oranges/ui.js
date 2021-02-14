window.OrangesUI = (vm, ffi, display) => {
  const global = vm.global;
  const Lin = global.get_actor("lin");
  const Awra = global.get_actor("awra");
  const Player = global.get_actor("player");
  let player = Lin;

  // FFI
  async function choose_player(vmi) {
    player = await display.show_menu([
      { title: "Lin, the awkward girl", value: Lin },
      { title: "Awra, the cheerful girl", value: Awra },
    ]);
    return player;
  }

  ffi.add("choose-player", 0, choose_player);

  async function get_player(vmi, actor) {
    if (actor === player) {
      return Player;
    } else {
      return actor;
    }
  }

  ffi.add("get-player", 1, get_player);

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
