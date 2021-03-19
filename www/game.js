const root = document.querySelector("#crochet");
const game = new Crochet.Crochet(root);

void (async function () {
  try {
    await game.initialise();
    const data = await (await fetch("/game/crochet.json")).json();
    for (const source of data.sources) {
      await game.load_from_url(`/game/${source}`);
    }
    await game.run("main");
  } catch (error) {
    await game.show_error(error);
  }
})();
