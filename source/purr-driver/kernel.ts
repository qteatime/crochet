import { contextBridge, ipcRenderer } from "electron";
import * as FS from "fs";
import { random_uuid } from "../utils/uuid";
import * as Projects from "./projects";

const configp = ipcRenderer.invoke("purr:get-config");

class Heap {
  private heap = new Map<string, unknown>();

  allocate(x: unknown): string {
    const id = random_uuid();
    if (this.heap.has(id)) {
      return this.allocate(x);
    }
    this.heap.set(id, x);
    return id;
  }

  deref(id: string): unknown {
    if (!this.heap.has(id)) {
      throw new Error(`invalid reference ${id}`);
    }
    return this.heap.get(id);
  }

  typed_deref<T>(type: { new (...args: any[]): T }, id: string): T {
    const value = this.deref(id);
    if (value instanceof type) {
      return value as any;
    } else {
      throw new Error(`reference ${id} has invalid type`);
    }
  }
}

function make_purr() {
  const heap = new Heap();

  return {
    projects: {
      list() {
        const files = Projects.projects.list_examples();
        return files.map((x) => heap.allocate(x));
      },

      async import() {
        const result = await ipcRenderer.invoke("purr:import-project-dialog");
        if (!result || result.length !== 1) {
          throw new Error(`invalid selection`);
        }
        const project = new Projects.CrochetProject(result[0]);
        await project.read_metadata();
        return heap.allocate(project);
      },

      async read_metadata(x: string) {
        const project = heap.typed_deref(Projects.CrochetProject, x);
        const meta = await project.read_metadata();
        return meta;
      },
    },
  };
}

contextBridge.exposeInMainWorld("Purr", {
  async connect(token: string) {
    const session_id = (await configp).session_id;
    if (token !== session_id) {
      throw new Error(
        `Cannot connect to the Purr driver: invalid authentication`
      );
    }

    return make_purr();
  },
});
