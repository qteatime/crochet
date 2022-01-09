import * as VM from "../../../../build/vm";
import type {
  CrochetForBrowser,
  Package,
} from "../../../../build/targets/browser";
import * as UUID from "uuid";
import { defer } from "./helpers";
import { compile } from "./repl";
declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
};

export interface PlaygroundProcess {
  vm: CrochetForBrowser;
  module: VM.CrochetModule;
  environment: VM.Environment;
}

export class Client {
  private methods: Map<string, (...args: any[]) => Promise<any>> = new Map();
  private instances: Map<string, PlaygroundProcess> = new Map();

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
    this.methods.set("spawn-playground", this.spawn_playground.bind(this));
    this.methods.set("run-snippet", this.run_snippet.bind(this));
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

  async spawn_playground({ id }: { id: string }) {
    const instance = await this.instantiate();
    const pkg = instance.system.graph.get_package(instance.root.meta.name);
    const cpkg = instance.system.universe.world.packages.get(pkg.name)!;
    const module = new VM.CrochetModule(cpkg, "(playground)", null);
    const environment = new VM.Environment(null, null, module, null);
    this.instances.set(id, {
      vm: instance,
      module: module,
      environment: environment,
    });
    this.post_message("playground-ready", { id });
  }

  async run_snippet({
    id,
    sid,
    code,
  }: {
    id: string;
    sid: string;
    code: string;
  }) {
    const instance = this.instances.get(id)!;
    const client = {
      id,
      sid,
      post_message: (method: string, data: any) => {
        this.post_message(method, { ...data, id, sid });
      },
    };
    try {
      const ast = compile(code);
      await ast.evaluate(client, instance);
    } catch (error) {
      console.error(error);
      client.post_message("playground/error", {
        message: String(error),
      });
    }
  }
}

export interface SnippetClient {
  readonly id: string;
  readonly sid: string;
  post_message(method: string, data: any): void;
}

async function main() {
  const query = new URL(document.location.href).searchParams;
  const capabilities = (query.get("capabilities") || "")
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x != "");
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
