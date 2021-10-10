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
  private _test: CrochetForBrowser | null = null;

  async test() {
    if (this._test != null) {
      return this._test;
    }
    this._test = await this.instantiate();
    return this._test;
  }

  private async instantiate() {
    const crochet = new Crochet.CrochetForBrowser(
      `/${this.id}/library`,
      new Set(this.capabilities),
      false
    );
    await crochet.boot_from_file(
      `/${this.id}/app/crochet.json`,
      Crochet.Package.target_web()
    );
    return crochet;
  }

  constructor(
    readonly id: string,
    readonly root: string,
    readonly capabilities: Set<string>,
    readonly origin: string
  ) {
    this.methods.set("spawn-testing", this.spawn_testing.bind(this));
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

  async spawn_testing(_: {}) {
    await this.test();
    this.post_message("ready-for-testing", {});
  }

  async run_tests(_: {}) {
    const test = await this.test();
    this.post_message("testing-started", {});
  }
}

const query = parse_query(document.location.search);
const capabilities = (query.get("capabilities") || "").split(",");
const client = new Client(
  query.get("id")!,
  query.get("root")!,
  new Set(capabilities),
  query.get("origin")!
);

client.listen();
client.post_message("ready", {});
