import type {
  CrochetForBrowser,
  Package,
} from "../../../../build/targets/browser";
import * as UUID from "uuid";
import { defer, parse_query } from "./helpers";
declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
};

export class Client {
  private methods: Map<string, (...args: any[]) => Promise<any>> = new Map();

  async instantiate() {
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

  async run_tests({ id }: { id: string }) {
    this.post_message("testing-started", { id });
    // TODO: handle errors here
    const instance = await this.instantiate();
    const handler = instance.test_report.subscribe((message) => {
      if (message.id !== id) {
        return;
      }

      switch (message.tag) {
        case "started": {
          break;
        }

        case "test-started": {
          this.post_message("test-started", {
            id: message.id,
            "test-id": message.test_id,
            package: message.pkg,
            module: message.module,
            title: message.name,
          });
          break;
        }

        case "test-skipped": {
          this.post_message("test-skipped", {
            id: message.id,
            "test-id": message.test_id,
          });
          break;
        }

        case "test-passed": {
          this.post_message("test-passed", {
            id: message.id,
            "test-id": message.test_id,
          });
          break;
        }

        case "test-failed": {
          this.post_message("test-failed", {
            id: message.id,
            "test-id": message.test_id,
            message: message.message,
          });
          break;
        }

        case "finished": {
          break;
        }
      }
    });
    const result = await instance.run_tests(id, () => true);
    instance.test_report.unsubscribe(handler);
    this.post_message("testing-finished", {
      id,
      passed: result.passed,
      failed: result.failed,
      skipped: result.skipped,
      total: result.total,
      duration: result.finished - result.started,
    });
  }
}

async function main() {
  const query = parse_query(document.location.search);
  const capabilities = (query.get("capabilities") || "native").split(",");
  const client = new Client(
    query.get("id")!,
    new Set(capabilities),
    query.get("origin")!
  );

  client.listen();
  client.post_message("ready", {});
}

main().catch((e) => {
  console.log(e);
});
