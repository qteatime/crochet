import type {
  CrochetForBrowser,
  Package,
} from "../../../../build/targets/browser";
import { parse_query } from "./helpers";
declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
};

export class Client {
  private methods: Map<string, (...args: any[]) => Promise<any>> = new Map();
  private _instance: CrochetForBrowser | null = null;

  get instance() {
    if (this._instance != null) {
      return this._instance;
    } else {
      throw new Error(`Not yet instantiated.`);
    }
  }

  async initialise() {
    if (this._instance != null) {
      throw new Error(`Already initialised`);
    }

    const crochet = new Crochet.CrochetForBrowser(
      `/${this.id}/library`,
      new Set(this.capabilities),
      false
    );
    await crochet.boot_from_file(
      `/${this.id}/app/crochet.json`,
      Crochet.Package.target_web()
    );
    this._instance = crochet;
  }

  constructor(
    readonly id: string,
    readonly capabilities: Set<string>,
    readonly origin: string
  ) {
    this.methods.set("run-tests", this.run_tests.bind(this));
  }

  post_message(method: string, data: any) {
    window.parent.postMessage({ method, id: this.id, data }, this.origin);
  }

  private dispatch(data: any) {
    const method = this.methods.get(data.method);
    if (method != null) {
      method(data.data);
    } else {
      console.log(`Unhandled message:`, this.id, data);
    }
  }

  listen() {
    window.addEventListener("message", (ev) => {
      if (ev.origin !== this.origin || ev.data.id !== this.id) {
        console.log(`Unhandled message:`, this.id, ev.data, ev.origin);
        return;
      }

      this.dispatch(ev.data);
    });
  }

  async run_tests(_: {}) {
    this.post_message("testing-started", {});
  }
}

async function main() {
  const query = parse_query(document.location.search);
  const capabilities = (query.get("capabilities") || "").split(",");
  const client = new Client(
    query.get("id")!,
    new Set(capabilities),
    query.get("origin")!
  );

  client.listen();
  try {
    await client.initialise();
    client.post_message("ready", {});
  } catch (e) {
    client.post_message("failed-to-start", {
      message: String(e),
    });
  }
}

main().catch((e) => {
  console.log(e);
});
