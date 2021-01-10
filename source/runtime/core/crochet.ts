import { CrochetDialogue } from "../dialogue/dialogue";
import { delay } from "../util/promise";

export class Crochet {
  ms_per_frame = 1000 / 60;

  constructor(readonly renderer: CrochetRenderer, readonly input: CrochetInput, readonly dialogue: CrochetDialogue) {

  }

  async run() {
    console.log("\nCrochet\n-------\n");
    this.input.init();
    this.loop();
  }

  async loop() {
    let previous = new Date().getTime();
    let lag = 0;
    while (true) {
      const now = new Date().getTime();
      const elapsed = now - previous;
      previous = now;
      lag += elapsed;

      while (lag >= this.ms_per_frame) {
        this.update();
        lag -= this.ms_per_frame;
      }

      this.render();
      await delay(this.ms_per_frame - lag);
    }
  }

  render() {
    this.dialogue.render(this);
  }

  update() {
    this.dialogue.update(this);
    this.handle_input();
    this.input.update();
  }

  exit() {
    process.exit();
  }

  handle_input() {
    if (this.input.is_down("exit")) {
      process.exit();
    }
  }
}

export class CrochetRenderer {
  draw_text(value: string) {
    process.stdout.write(value);
  }
}

export type Key = "exit" | "return" | "escape";
export enum KeyState {
  UP,
  DOWN
}

export class CrochetInput {
  key_table = new Map<string, Key>([
    ["\u0003", "exit"], // ctrl-c
    ["\r", "return"],
    ["\u0027", "escape"]
  ])

  key_state = new Map<Key, KeyState>([
    ["exit", KeyState.UP],
    ["return", KeyState.UP],
    ["escape", KeyState.UP]
  ]);
  
  init() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", this.handle_input);
  }

  update() {
    for (const key of this.key_state.keys()) {
      this.key_state.set(key, KeyState.UP);
    }
  }

  is_down(key: Key) {
    return this.key_state.get(key) === KeyState.DOWN;
  }

  is_up(key: Key) {
    return this.key_state.get(key) === KeyState.UP;
  }

  handle_input = (key0: string) => {
    const key = this.key_table.get(key0);
    if (key != null) {
      this.key_state.set(key, KeyState.DOWN);
    }
  }
}