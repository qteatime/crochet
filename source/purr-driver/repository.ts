import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";
import * as Spec from "../utils/spec";
import * as Pkg from "../pkg";
import { random_uuid } from "../utils/uuid";

const repo_base =
  OS.platform() === "darwin"
    ? Path.join(OS.homedir(), "Library")
    : OS.platform() === "win32"
    ? Path.join(OS.homedir(), "AppData", "Local")
    : Path.join(OS.homedir(), ".local", "share");

const repo_dir = Path.join(repo_base, "Purr");
FS.mkdirSync(Path.join(repo_dir, "projects"), { recursive: true }); // FIXME: remove

type Unarray<T> = T extends (infer U)[] ? U : never;
type Instance<T> = T extends { new (...args: any[]): infer U } ? U : never;

export class PurrRepository {
  constructor(readonly root: string) {}

  static at_default_location() {
    return new PurrRepository(repo_dir);
  }

  projects() {
    const files = FS.readdirSync(Path.join(this.root, "projects"));
    const projects: PurrProject[] = [];
    for (const id of files) {
      const project = PurrProject.make_from_root(
        this,
        Path.join(this.root, "projects", id)
      );
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
    const project = parser.make_link(this, id, filename);
    if (project == null) {
      console.warn(
        `Failed to read a project configuration for ${filename} with ${parser.kind}`
      );
      return null;
    }

    await this.create(project);
    return project;
  }

  private async create(project: PurrProject) {
    const root = this.project_root(project);
    if (FS.existsSync(root)) {
      throw new Error(
        `internal: Could not create ${project.meta.id}: id already exists`
      );
    }
    FS.mkdirSync(root, { recursive: true });
    FS.writeFileSync(
      Path.join(root, "purr.json"),
      JSON.stringify(project.meta)
    );
  }

  project_root(project: PurrProject) {
    return Path.join(this.root, "projects", project.meta.id);
  }
}

export abstract class PurrProject {
  abstract kind: string;
  abstract meta: { id: string; title: string };
  abstract read_metadata(): Promise<{
    title: string;
    meta: {
      kind: string;
      source: string;
    };
  }>;

  static make_from_root(
    repo: PurrRepository,
    file: string
  ): Instance<Unarray<typeof PurrProject["parsers"]>> {
    const source = FS.readFileSync(Path.join(file, "purr.json"), "utf-8");
    const meta = JSON.parse(source);
    const kind = meta.project.kind;

    const parser = this.parsers.find((x) => x.kind === kind);
    if (parser == null) {
      throw new Error(`internal: Corrupted project ${file}`);
    } else {
      return parser.from_meta(repo, meta);
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
}

export class CrochetProject extends PurrProject {
  static readonly kind = "crochet";
  readonly kind = "crochet";

  constructor(
    readonly repo: PurrRepository,
    readonly meta: Spec.SpecType<typeof CrochetProject["spec"]>
  ) {
    super();
  }

  async read_metadata() {
    return {
      id: this.meta.id,
      title: this.meta.title,
      description: this.meta.description,
      meta: {
        kind: this.kind,
        source: FS.readFileSync(this.meta.project.root, "utf-8"),
      },
    };
  }

  static accepts(file: string) {
    return Path.basename(file) === "crochet.json";
  }

  static from_meta(repo: PurrRepository, meta0: any) {
    const meta = Spec.parse(meta0, CrochetProject.spec);
    return new CrochetProject(repo, meta);
  }

  static make_link(repo: PurrRepository, id: string, file: string) {
    try {
      const source = FS.readFileSync(file, "utf-8");
      const pkg = Pkg.parse_from_string(source, file);
      return new CrochetProject(repo, {
        id: id,
        title: pkg.meta.title || pkg.meta.name,
        description: pkg.meta.description || "",
        project: {
          kind: "crochet",
          root: file,
        },
      });
    } catch (e) {
      return null;
    }
  }

  static spec = Spec.spec(
    {
      id: Spec.string,
      title: Spec.string,
      description: Spec.string,
      project: Spec.spec(
        {
          kind: Spec.equal("crochet" as const),
          root: Spec.string,
        },
        (x) => x
      ),
    },
    (x) => x
  );
}
