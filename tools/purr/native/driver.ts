import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
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
      driver.projects.read_metadata(id).then((x: string) => ffi.text(x))
    );
    return meta;
  });
};
