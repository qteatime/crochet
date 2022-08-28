import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";
import * as Spec from "../utils/spec";
import * as Pkg from "../pkg";
import { random_uuid } from "../utils/uuid";
import { AuditLog } from "./audit";
import { mime } from "./mime";

const repo_base =
  OS.platform() === "darwin"
    ? Path.join(OS.homedir(), "Library")
    : OS.platform() === "win32"
    ? Path.join(OS.homedir(), "AppData", "Local")
    : Path.join(OS.homedir(), ".local", "share");

const repo_dir = Path.join(repo_base, "Purr");
FS.mkdirSync(Path.join(repo_dir, "projects"), { recursive: true }); // FIXME: remove
FS.mkdirSync(Path.join(repo_dir, "audit"), { recursive: true });

type Unarray<T> = T extends (infer U)[] ? U : never;
type Instance<T> = T extends { new (...args: any[]): infer U } ? U : never;

export class PurrRepository {
  constructor(readonly root: string) {}

  static at_default_location() {
    return new PurrRepository(repo_dir);
  }

  get audit_log() {
    return new AuditLog(Path.join(this.root, "audit"));
  }

  projects() {
    const files = FS.readdirSync(Path.join(this.root, "projects"));
    const projects: PurrProject[] = [];
    for (const id of files) {
      const project = PurrProject.parse_with_id(this, id);
      projects.push(project);
    }
    return projects;
  }

  async import_project(filename: string) {
    const parser = PurrProject.find_parser(filename);
    if (parser == null) {
      console.warn(`No suitable project parser for ${filename}`);
      return null;
    }
    const id = random_uuid();
    const base_meta = parser.infer_initial_metadata(filename);
    if (base_meta == null) {
      console.warn(
        `Failed to read a project configuration for ${filename} with ${parser.kind}`
      );
      return null;
    }

    await this.create(parser.kind, id, base_meta, filename);
    const project = parser.make_project(this, id);
    this.audit_log.append(project, "purr.projects.imported", {
      id: id,
      title: base_meta.title,
      path: filename,
    });
    return project;
  }

  private async create(
    kind: string,
    id: string,
    base_meta: { title: string; description: string },
    file: string
  ) {
    const root = Path.join(this.projects_dir, id);
    if (FS.existsSync(root)) {
      throw new Error(`internal: Could not create ${id}: id already exists`);
    }
    FS.mkdirSync(root, { recursive: true });
    FS.writeFileSync(
      Path.join(root, "purr.json"),
      JSON.stringify(
        {
          title: base_meta.title,
          description: base_meta.description,
          cover: "",
          project: {
            kind: kind,
            file: file,
          },
        },
        null,
        2
      )
    );
  }

  read_project_meta_file(id: string) {
    const source = FS.readFileSync(
      Path.join(this.projects_dir, id, "purr.json"),
      "utf-8"
    );
    const meta0 = JSON.parse(source);
    const meta = Spec.parse(meta0, PurrProject.project_spec);
    return meta;
  }

  get projects_dir() {
    return Path.join(this.root, "projects");
  }

  project_dir(project: PurrProject) {
    return Path.join(this.root, "projects", project.id);
  }
}

export abstract class PurrProject {
  abstract repo: PurrRepository;
  abstract kind: string;
  abstract id: string;
  abstract read_metadata(): Promise<any>;
  abstract update_linked_meta(meta: any): Promise<void>;

  get dir() {
    return this.repo.project_dir(this);
  }

  get meta_file() {
    return Path.join(this.dir, "purr.json");
  }

  get cover_file() {
    return Path.join(this.dir, "cover");
  }

  project_meta() {
    const meta0 = JSON.parse(FS.readFileSync(this.meta_file, "utf-8"));
    return Spec.parse(meta0, PurrProject.project_spec);
  }

  update_project_meta(new_meta0: any, changelog: any[]) {
    const meta = this.project_meta();
    const new_meta = Spec.parse(new_meta0, PurrProject.project_change_spec);
    meta.title = new_meta.title;
    meta.description = new_meta.description;
    this.repo.audit_log.append(this, "purr.project.metadata.changed", {
      changelog,
    });
    this.update_linked_meta(new_meta.meta);
    FS.writeFileSync(this.meta_file, JSON.stringify(meta, null, 2));
  }

  update_cover_image(filename: string) {
    const type = mime[Path.extname(filename)] ?? null;
    if (type == null) {
      throw new Error(`invalid image`);
    }
    this.repo.audit_log.append(this, "purr.project.cover.changed", {
      source: filename,
    });
    FS.copyFileSync(filename, this.cover_file);
    const meta = this.project_meta();
    meta.cover = type;
    FS.writeFileSync(this.meta_file, JSON.stringify(meta, null, 2));
  }

  remove_cover_image() {
    const meta = this.project_meta();
    if (!meta.cover) {
      return;
    }
    this.repo.audit_log.append(this, "purr.project.cover.removed", {});
    FS.unlinkSync(this.cover_file);
    meta.cover = "";
    FS.writeFileSync(this.meta_file, JSON.stringify(meta, null, 2));
  }

  read_cover_image() {
    const meta = this.project_meta();
    if (!meta.cover) {
      return null;
    } else {
      const data = FS.readFileSync(this.cover_file);
      return {
        mime: meta.cover,
        data: new Uint8Array(data),
      };
    }
  }

  static parse_with_id(
    repo: PurrRepository,
    id: string
  ): Instance<Unarray<typeof PurrProject["parsers"]>> {
    const meta = repo.read_project_meta_file(id);
    const kind = meta.project.kind;

    const parser = this.parsers.find((x) => x.kind === kind);
    if (parser == null) {
      throw new Error(`internal: Corrupted project ${id}`);
    } else {
      return parser.make_project(repo, id);
    }
  }

  static find_parser(
    file: string
  ): Unarray<typeof PurrProject["parsers"]> | null {
    return this.parsers.find((x) => x.accepts(file)) ?? null;
  }

  static get parsers() {
    return [CrochetProject];
  }

  static project_change_spec = Spec.spec(
    {
      title: Spec.string,
      description: Spec.string,
      meta: Spec.anything,
    },
    (x) => x
  );

  static project_spec = Spec.spec(
    {
      title: Spec.string,
      description: Spec.string,
      cover: Spec.string,
      project: Spec.spec(
        {
          kind: Spec.string,
          file: Spec.string,
        },
        (x) => x
      ),
    },
    (x) => x
  );
}

export class CrochetProject extends PurrProject {
  static readonly kind = "crochet";
  readonly kind = "crochet";

  constructor(readonly repo: PurrRepository, readonly id: string) {
    super();
  }

  async read_metadata() {
    const meta = this.project_meta();
    return {
      purr: meta,
      crochet: FS.readFileSync(meta.project.file, "utf-8"),
    };
  }

  linked_metadata() {
    return Spec.parse(
      JSON.parse(FS.readFileSync(this.filename(), "utf-8")),
      CrochetProject.meta_spec
    );
  }

  filename() {
    return this.project_meta().project.file;
  }

  async update_linked_meta(new_meta0: any) {
    const new_meta = Spec.parse(new_meta0, CrochetProject.meta_spec);
    const file = this.filename();
    FS.writeFileSync(file, JSON.stringify(new_meta, null, 2));
  }

  async remove_capability(name: string, kind0: string) {
    const kind = Spec.parse(kind0, CrochetProject.capability_kind_spec);
    const meta = this.linked_metadata();
    if (!meta.capabilities[kind].some((x) => x.name === name)) {
      throw new Error(`internal: capability does not exist ${name}`);
    }
    meta.capabilities[kind] = meta.capabilities[kind].filter(
      (x) => x.name !== name
    );
    this.repo.audit_log.append(this, "purr.project.capabilities.removed", {
      kind: kind,
      name: name,
    });
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  async add_capability(new_cap0: any, kind0: string) {
    const new_cap = Spec.parse(
      new_cap0,
      CrochetProject.capability_request_spec
    );
    const kind = Spec.parse(kind0, CrochetProject.capability_kind_spec);
    const meta = this.linked_metadata();
    if (meta.capabilities[kind].some((x) => x.name === new_cap.name)) {
      throw new Error(`internal: capability already exists ${new_cap.name}`);
    }
    meta.capabilities[kind].push(new_cap);
    this.repo.audit_log.append(this, "purr.project.capabilities.added", {
      kind: kind,
      capability: new_cap,
    });
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  async update_capability(name: string, reason: string, kind0: string) {
    const kind = Spec.parse(kind0, CrochetProject.capability_kind_spec);
    const new_cap = Spec.parse(
      { name, reason },
      CrochetProject.capability_request_spec
    );
    const meta = this.linked_metadata();
    if (!meta.capabilities[kind].some((x) => x.name === new_cap.name)) {
      throw new Error(`internal: capability does not exist ${name}`);
    }
    meta.capabilities[kind] = meta.capabilities[kind].map((x) =>
      x.name === name ? new_cap : x
    );
    this.repo.audit_log.append(this, "purr.project.capabilities.updated", {
      kind: kind,
      capability: new_cap,
    });
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  async add_provided_capability(new_cap0: any) {
    const new_cap = Spec.parse(
      new_cap0,
      CrochetProject.capability_provide_spec
    );
    const meta = this.linked_metadata();
    if (meta.capabilities.provides.some((x) => x.name === new_cap.name)) {
      throw new Error(`internal: capability already exists ${new_cap.name}`);
    }
    meta.capabilities.provides.push(new_cap);
    this.repo.audit_log.append(
      this,
      "purr.project.provided-capabilities.added",
      {
        capability: new_cap,
      }
    );
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  async remove_provided_capability(name: string) {
    const meta = this.linked_metadata();
    if (!meta.capabilities.provides.some((x) => x.name === name)) {
      throw new Error(`internal: capability does not exist ${name}`);
    }
    meta.capabilities.provides = meta.capabilities.provides.filter(
      (x) => x.name !== name
    );
    this.repo.audit_log.append(
      this,
      "purr.project.provided-capabilities.removed",
      {
        name: name,
      }
    );
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  async update_provided_capability(new_cap0: any) {
    const new_cap = Spec.parse(
      new_cap0,
      CrochetProject.capability_provide_spec
    );
    const meta = this.linked_metadata();
    if (!meta.capabilities.provides.some((x) => x.name === new_cap.name)) {
      throw new Error(`internal: capability does not exist ${name}`);
    }
    meta.capabilities.provides = meta.capabilities.provides.map((x) =>
      x.name === new_cap.name ? new_cap : x
    );
    this.repo.audit_log.append(
      this,
      "purr.project.provided-capabilities.updated",
      {
        capability: new_cap,
      }
    );
    FS.writeFileSync(this.filename(), JSON.stringify(meta, null, 2));
  }

  static accepts(file: string) {
    return Path.basename(file) === "crochet.json";
  }

  static make_project(repo: PurrRepository, id: string) {
    return new CrochetProject(repo, id);
  }

  static infer_initial_metadata(file: string) {
    try {
      const source = FS.readFileSync(file, "utf-8");
      const pkg = Pkg.parse_from_string(source, file);
      return {
        title: pkg.meta.title || pkg.meta.name,
        description: pkg.meta.description || "",
      };
    } catch (e) {
      return null;
    }
  }

  static capability_request_spec = Spec.spec(
    {
      name: Spec.string,
      reason: Spec.string,
    },
    (x) => x
  );

  static capability_kind_spec = Spec.anyOf([
    Spec.map_spec(Spec.equal("required" as const), (_) => "requires" as const),
    Spec.equal("optional" as const),
    Spec.equal("trusted" as const),
  ]);

  static capability_provide_spec = Spec.spec(
    {
      name: Spec.string,
      title: Spec.string,
      description: Spec.string,
      risk: Spec.anyOf([
        Spec.equal("low" as const),
        Spec.equal("medium" as const),
        Spec.equal("high" as const),
        Spec.equal("critical" as const),
        Spec.equal("unknown" as const),
      ]),
    },
    (x) => x
  );

  static target_spec = Spec.anyOf([
    Spec.equal("any" as const),
    Spec.equal("*" as const),
    Spec.equal("browser" as const),
    Spec.equal("node" as const),
  ]);

  static meta_spec = Spec.spec(
    {
      name: Spec.string,
      title: Spec.string,
      description: Spec.string,
      target: CrochetProject.target_spec,
      stability: Spec.anyOf([
        Spec.equal("experimental" as const),
        Spec.equal("stable" as const),
        Spec.equal("frozen" as const),
        Spec.equal("deprecated" as const),
        Spec.equal("unknown" as const),
      ]),
      sources: Spec.array(
        Spec.spec(
          {
            filename: Spec.string,
            target: CrochetProject.target_spec,
          },
          (x) => x
        )
      ),
      native_sources: Spec.array(
        Spec.spec(
          {
            filename: Spec.string,
            target: CrochetProject.target_spec,
          },
          (x) => x
        )
      ),
      assets: Spec.array(
        Spec.spec({ path: Spec.string, mime: Spec.string }, (x) => x)
      ),
      dependencies: Spec.array(
        Spec.spec(
          {
            name: Spec.string,
            capabilities: Spec.array(Spec.string),
            target: CrochetProject.target_spec,
          },
          (x) => x
        )
      ),
      capabilities: Spec.spec(
        {
          requires: Spec.array(CrochetProject.capability_request_spec),
          optional: Spec.array(CrochetProject.capability_request_spec),
          trusted: Spec.array(CrochetProject.capability_request_spec),
          provides: Spec.array(CrochetProject.capability_provide_spec),
        },
        (x) => x
      ),
    },
    (x) => x
  );
}
