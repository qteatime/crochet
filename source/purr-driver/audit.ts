import * as FS from "fs";
import * as Path from "path";
import type { PurrProject } from "./repository";

export class AuditLog {
  readonly MAX_SIZE = 100 * 1024 * 1024; // 100mb

  constructor(private log_dir: string) {}

  private get file() {
    return Path.join(this.log_dir, "audit.json");
  }

  append(project: PurrProject, category: string, entry: any) {
    this.ensure_file();
    this.maybe_rotate();
    FS.appendFileSync(
      this.file,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        category: category,
        project: project.id,
        entry: entry,
      }) + "\n"
    );
  }

  private ensure_file() {
    if (!FS.existsSync(this.file)) {
      FS.writeFileSync(this.file, "");
    }
  }

  private maybe_rotate() {
    const stat = FS.statSync(this.file);
    if (stat.size > this.MAX_SIZE) {
      const name = `audit-${new Date().toISOString()}.json`;
      FS.renameSync(this.file, Path.join(this.log_dir, name));
    }
  }
}
