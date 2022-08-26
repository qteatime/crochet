import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function parse_meta(x0: CrochetValue) {
    const x = ffi.unbox(x0) as any;
    return ffi.record(
      new Map<string, CrochetValue>([
        ["title", ffi.text(x.title)],
        ["description", ffi.text(x.description)],
        [
          "meta",
          ffi.record(
            new Map<string, CrochetValue>([
              ["kind", ffi.text(x.meta.kind)],
              ["source", ffi.text(x.meta.source)],
            ])
          ),
        ],
      ])
    );
  }

  ffi.defun("driver.projects.list", (driver0) => {
    const driver = ffi.unbox(driver0) as any;
    return ffi.list(driver.projects.list().map((x: any) => ffi.text(x)));
  });

  ffi.defmachine("driver.projects.import", function* (driver0) {
    const driver = ffi.unbox(driver0) as any;
    const project = yield ffi.await(
      driver.projects.import().then((x: any) => ffi.text(x))
    );
    return project;
  });

  ffi.defmachine("driver.projects.read-metadata", function* (driver0, id0) {
    const driver = ffi.unbox(driver0) as any;
    const id = ffi.text_to_string(id0);
    const meta = yield ffi.await(
      driver.projects.read_metadata(id).then((x: string) => ffi.box(x))
    );
    return parse_meta(meta);
  });
};
