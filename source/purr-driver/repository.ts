import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";
import * as Spec from "../utils/spec";
import * as Pkg from "../pkg";
import { random_uuid } from "../utils/uuid";
import { AuditLog } from "./audit";

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

  get meta_file() {
    return Path.join(this.repo.project_dir(this), "purr.json");
  }

  project_meta() {
    const meta0 = JSON.parse(FS.readFileSync(this.meta_file, "utf-8"));
    return Spec.parse(meta0, PurrProject.project_spec);
  }

  update_project_meta(new_meta0: any, changelog: any[]) {
    const base_meta = this.project_meta();
    const new_meta = Spec.parse(new_meta0, PurrProject.project_change_spec);
    base_meta.title = new_meta.title;
    base_meta.description = new_meta.description;
    this.repo.audit_log.append(this, "purr.metadata.changed", {
      changelog,
    });
    FS.writeFileSync(this.meta_file, JSON.stringify(new_meta, null, 2));
    this.update_linked_meta(new_meta.meta);
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

  filename() {
    return this.project_meta().project.file;
  }

  async update_linked_meta(new_meta0: any) {
    const new_meta = Spec.parse(new_meta0, CrochetProject.change_spec);
    const file = this.filename();
    FS.writeFileSync(file, JSON.stringify(new_meta, null, 2));
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

  static change_spec = Spec.spec(
    {
      name: Spec.string,
      title: Spec.string,
      description: Spec.string,
      target: Spec.anyOf([
        Spec.equal("any" as const),
        Spec.equal("*" as const),
        Spec.equal("browser" as const),
        Spec.equal("node" as const),
      ]),
      stability: Spec.anyOf([
        Spec.equal("experimental" as const),
        Spec.equal("stable" as const),
        Spec.equal("frozen" as const),
        Spec.equal("deprecated" as const),
        Spec.equal("unknown" as const),
      ]),
      capabilities: Spec.spec(
        {
          required: Spec.array(CrochetProject.capability_request_spec),
          optional: Spec.array(CrochetProject.capability_request_spec),
          trusted: Spec.array(CrochetProject.capability_request_spec),
          provided: Spec.array(CrochetProject.capability_provide_spec),
        },
        (x) => x
      ),
    },
    (x) => x
  );
}
