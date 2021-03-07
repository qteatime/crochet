const root = document.querySelector("#crochet");
const game = new Crochet.Crochet(root);

void (async function () {
  try {
    await game.initialise();
    await game.load_from_url("/game.crochet");
    await game.run("main");
  } catch (error) {
    await game.show_error(error);
  }
})();
