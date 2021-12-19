import type { ForeignInterface } from "../../../build/crochet";
import * as Path from "path";
import * as FS from "fs";

export default (ffi: ForeignInterface) => {
  ffi.defun("path.basename", (p) => {
    return ffi.text(Path.basename(ffi.text_to_string(p)));
  });

  ffi.defun("path.basename-ext", (p, ext) => {
    return ffi.text(
      Path.basename(ffi.text_to_string(p), ffi.text_to_string(ext))
    );
  });

  ffi.defun("path.delimiter", () => ffi.text(Path.delimiter));

  ffi.defun("path.dirname", (p) => {
    return ffi.text(Path.dirname(ffi.text_to_string(p)));
  });

  ffi.defun("path.extname", (p) => {
    return ffi.text(Path.extname(ffi.text_to_string(p)));
  });

  ffi.defun("path.is-absolute", (p) => {
    return ffi.boolean(Path.isAbsolute(ffi.text_to_string(p)));
  });

  ffi.defun("path.join", (x0, x1) => {
    return ffi.text(Path.join(ffi.text_to_string(x0), ffi.text_to_string(x1)));
  });

  ffi.defun("path.normalise", (p) => {
    return ffi.text(Path.normalize(ffi.text_to_string(p)));
  });

  ffi.defun("path.relative", (from, to) => {
    return ffi.text(
      Path.relative(ffi.text_to_string(from), ffi.text_to_string(to))
    );
  });

  ffi.defun("path.resolve", (x0) => {
    return ffi.text(Path.resolve(ffi.text_to_string(x0)));
  });

  ffi.defun("path.separator", () => {
    return ffi.text(Path.sep);
  });

  // == FS
  ffi.defun("fs.append-file-text", (path, data) => {
    FS.appendFileSync(ffi.text_to_string(path), ffi.text_to_string(data));
    return ffi.nothing;
  });

  ffi.defun("fs.copy-file", (from, to) => {
    FS.copyFileSync(ffi.text_to_string(from), ffi.text_to_string(to));
    return ffi.nothing;
  });

  ffi.defun("fs.exists", (path) => {
    return ffi.boolean(FS.existsSync(ffi.text_to_string(path)));
  });

  ffi.defun("fs.mkdir", (path, rec) => {
    FS.mkdirSync(ffi.text_to_string(path), {
      recursive: ffi.to_js_boolean(rec),
    });
    return ffi.nothing;
  });

  ffi.defun("fs.mkdir-tmp", (path) => {
    const result = FS.mkdtempSync(ffi.text_to_string(path));
    return ffi.text(result);
  });

  ffi.defun("fs.readdir", (path) => {
    const xs = FS.readdirSync(ffi.text_to_string(path)).map((x) => ffi.text(x));
    return ffi.list(xs);
  });

  ffi.defun("fs.read-file-text", (path) => {
    return ffi.untrusted_text(
      FS.readFileSync(ffi.text_to_string(path), "utf-8")
    );
  });

  ffi.defun("fs.real-path", (path) => {
    return ffi.text(FS.realpathSync(ffi.text_to_string(path)));
  });

  ffi.defun("fs.rename", (from, to) => {
    FS.renameSync(ffi.text_to_string(from), ffi.text_to_string(to));
    return ffi.nothing;
  });

  ffi.defun("fs.rmdir", (path, rec) => {
    FS.rmdirSync(ffi.text_to_string(path), {
      recursive: ffi.to_js_boolean(rec),
    });
    return ffi.nothing;
  });

  ffi.defun("fs.rm", (path, force, rec) => {
    FS.rmSync(ffi.text_to_string(path), {
      force: ffi.to_js_boolean(force),
      recursive: ffi.to_js_boolean(rec),
    });
    return ffi.nothing;
  });

  ffi.defun("fs.write-file-text", (path, data) => {
    FS.writeFileSync(ffi.text_to_string(path), ffi.text_to_string(data));
    return ffi.nothing;
  });

  ffi.defun("fs.is-file", (path) => {
    return ffi.boolean(FS.statSync(ffi.text_to_string(path)).isFile());
  });

  ffi.defun("fs.is-directory", (path) => {
    return ffi.boolean(FS.statSync(ffi.text_to_string(path)).isDirectory());
  });
};
