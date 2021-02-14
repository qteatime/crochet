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

  async function pause(vmi) {
    await display.show_menu([{ title: "Continue...", value: null }]);
    return vmi.nothing;
  }

  ffi.add("pause", 0, pause);

  async function show_database(vmi) {
    console.log(vm.database.all_facts());
    return vmi.nothing;
  }

  ffi.add("show-database", 0, show_database);

  // Hooks
  async function pick(vmi, actions) {
    if (actions.length === 0) {
      return null;
    }

    const [env] = vmi.search("_ turn", [vmi.pvar("Actor")]);
    const actor = env.get("Actor");
    let chosen;
    if (actor === player) {
      chosen = await display.show_menu(
        actions.map((x) => ({ title: x.title, value: x }))
      );
    } else {
      chosen = actions[Math.floor(Math.random() * actions.length)];
    }
    console.log("[action chosen]", actor.name, chosen.title);
    return chosen;
  }

  vm.on_pick(pick);
};
