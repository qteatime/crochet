import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function parse_meta(x0: CrochetValue) {
    const x = ffi.unbox(x0) as any;
    return ffi.record(
      new Map<string, CrochetValue>([
        ["title", ffi.text(x.purr.title)],
        ["description", ffi.text(x.purr.description)],
        [
          "meta",
          ffi.record(
            new Map<string, CrochetValue>([
              ["kind", ffi.text(x.purr.project.kind)],
              ["source", ffi.text(x.crochet)],
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

  ffi.defun("driver.crochet-library.find-all-packages", (driver0) => {
    const driver = ffi.unbox(driver0) as any;
    return ffi.list(
      driver.crochet_library.read_metadata().map((x: any) => ffi.text(x))
    );
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

  ffi.defmachine(
    "driver.projects.update-meta",
    function* (driver0, id0, meta0, changelog0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const meta = JSON.parse(ffi.text_to_string(meta0));
      const changelog = JSON.parse(ffi.text_to_string(changelog0));
      yield ffi.await(
        driver.projects
          .update_project_metadata(id, meta, changelog)
          .then((_: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.update-linked-meta",
    function* (driver0, id0, meta0, changelog0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const meta = JSON.parse(ffi.text_to_string(meta0));
      const changelog = JSON.parse(ffi.text_to_string(changelog0));
      yield ffi.await(
        driver.projects
          .update_linked_metadata(id, meta, changelog)
          .then((_: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.update-cover-image",
    function* (driver0, id0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      yield ffi.await(
        driver.projects.update_cover_image(id).then((_: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.remove-cover-image",
    function* (driver0, id0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      yield ffi.await(
        driver.projects.remove_cover_image(id).then((_: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine("driver.projects.read-cover-image", function* (driver0, id0) {
    const driver = ffi.unbox(driver0) as any;
    const id = ffi.text_to_string(id0);
    const result: any = ffi.unbox(
      yield ffi.await(
        driver.projects.read_cover_image(id).then((x: any) => ffi.box(x))
      )
    );
    if (result == null) {
      return ffi.nothing;
    } else {
      return ffi.record(
        new Map<string, CrochetValue>([
          ["mime", ffi.text(result.mime)],
          ["data", ffi.byte_array(result.data)],
        ])
      );
    }
  });

  ffi.defmachine(
    "driver.projects.add-provided-capability",
    function* (driver0, id0, cap0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const cap = JSON.parse(ffi.text_to_string(cap0));
      yield ffi.await(
        driver.projects
          .add_provided_capability(id, cap)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.add-capability",
    function* (driver0, id0, cap0, kind0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const cap = JSON.parse(ffi.text_to_string(cap0));
      const kind = ffi.text_to_string(kind0);
      yield ffi.await(
        driver.projects
          .add_capability(id, cap, kind)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.update-capability",
    function* (driver0, id0, name0, reason0, kind0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const name = ffi.text_to_string(name0);
      const reason = ffi.text_to_string(reason0);
      const kind = ffi.text_to_string(kind0);
      yield ffi.await(
        driver.projects
          .update_capability(id, name, reason, kind)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.update-provided-capability",
    function* (driver0, id0, cap0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const cap = JSON.parse(ffi.text_to_string(cap0));
      yield ffi.await(
        driver.projects
          .update_provided_capability(id, cap)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.remove-capability",
    function* (driver0, id0, name0, kind0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const name = ffi.text_to_string(name0);
      const kind = ffi.text_to_string(kind0);
      yield ffi.await(
        driver.projects
          .remove_capability(id, name, kind)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.remove-provided-capability",
    function* (driver0, id0, name0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const name = ffi.text_to_string(name0);
      yield ffi.await(
        driver.projects
          .remove_provided_capability(id, name)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.remove-dependency",
    function* (driver0, id0, name0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const name = ffi.text_to_string(name0);
      yield ffi.await(
        driver.projects
          .remove_dependency(id, name)
          .then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.update-dependency",
    function* (driver0, id0, dep0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const dep = JSON.parse(ffi.text_to_string(dep0));
      yield ffi.await(
        driver.projects.update_dependency(id, dep).then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );

  ffi.defmachine(
    "driver.projects.add-dependency",
    function* (driver0, id0, dep0) {
      const driver = ffi.unbox(driver0) as any;
      const id = ffi.text_to_string(id0);
      const dep = JSON.parse(ffi.text_to_string(dep0));
      yield ffi.await(
        driver.projects.add_dependency(id, dep).then((x: any) => ffi.nothing)
      );
      return ffi.nothing;
    }
  );
};
