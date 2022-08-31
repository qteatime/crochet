import { contextBridge, ipcRenderer } from "electron";
import * as FS from "fs";
import { random_uuid } from "../utils/uuid";
import { CrochetLibrary } from "./crochet-library";
import { CrochetProject, PurrProject, PurrRepository } from "./repository";

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
  const repo = PurrRepository.at_default_location();
  const library = new CrochetLibrary(repo);
  library.refresh();

  return {
    crochet_library: {
      refresh() {
        library.refresh();
        return null;
      },

      read_metadata() {
        return library.read_metadata();
      },
    },

    projects: {
      list() {
        const projects = repo.projects();
        return projects.map((x) => heap.allocate(x));
      },

      async import() {
        const result = await ipcRenderer.invoke("purr:import-project-dialog");
        if (!result || result.length !== 1) {
          throw new Error(`invalid selection`);
        }
        const project = await repo.import_project(result[0]);
        if (project == null) {
          throw new Error(`invalid project`);
        }
        return heap.allocate(project);
      },

      async read_metadata(x: string) {
        const project: PurrProject = heap.typed_deref(PurrProject as any, x);
        const meta = await project.read_metadata();
        return meta;
      },

      async update_project_metadata(x: string, updates: any, changelog: any) {
        const project: PurrProject = heap.typed_deref(PurrProject as any, x);
        await project.update_project_meta(updates, changelog);
        return null;
      },

      async read_cover_image(x: string) {
        const project: PurrProject = heap.typed_deref(PurrProject as any, x);
        const image = await project.read_cover_image();
        return image;
      },

      async remove_cover_image(x: string) {
        const project: PurrProject = heap.typed_deref(PurrProject as any, x);
        await project.remove_cover_image();
        return null;
      },

      async update_cover_image(x: string) {
        const project: PurrProject = heap.typed_deref(PurrProject as any, x);
        const image = await ipcRenderer.invoke(
          "purr:select-image-dialog",
          "Choose a cover image",
          "Use image"
        );
        if (image == null) {
          throw new Error(`invalid image`);
        }
        await project.update_cover_image(image);
        return null;
      },

      async add_provided_capability(x: string, capability: any) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.add_provided_capability(capability);
        return null;
      },

      async add_capability(x: string, capability: any, kind: string) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.add_capability(capability, kind);
        return null;
      },

      async update_capability(
        x: string,
        name: string,
        reason: string,
        kind: string
      ) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.update_capability(name, reason, kind);
        return null;
      },

      async update_provided_capability(x: string, capability: any) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.update_provided_capability(capability);
        return null;
      },

      async remove_capability(x: string, name: string, kind: string) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.remove_capability(name, kind);
        return null;
      },

      async remove_provided_capability(x: string, name: string) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.remove_provided_capability(name);
        return null;
      },

      async add_dependency(x: string, dep: any) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.add_dependency(dep);
        return null;
      },

      async update_dependency(x: string, dep: any) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.update_dependency(dep);
        return null;
      },

      async remove_dependency(x: string, name: string) {
        const project = heap.typed_deref(CrochetProject, x);
        await project.remove_dependency(name);
        return null;
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
