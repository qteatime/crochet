function h(spec, attrs, children) {
  const [tag, ...classes] = spec.split(".");
  const element = document.createElement(tag || "div");
  for (const klass of classes) {
    element.classList.add(klass);
  }
  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v);
  }
  for (const child of children) {
    element.append(child);
  }
  return element;
}

function link(text, on_click) {
  const element = h("a", { href: "#" }, [text]);
  element.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    on_click();
  });
  return element;
}

function breadcrumbs(data, items) {
  return h(".breadcrumbs", {}, [
    h(".breadcrumb-item.breadcrumb-home", {}, [
      link(data.package.meta.name, () => render(index(data))),
    ]),
    ...items.map((x) => h(".breadcrumb-item", {}, [x])),
  ]);
}

function type_page(type, data) {
  return h(".doc-page.page-type", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [type.name]),
      h("h1.title", {}, [h(".page-type-tag", {}, "Type"), type.name]),
    ]),
    h(".source-code-caption", {}, type.location),
    h(".source-code.declaration-code", {}, [type.declaration]),
    h(".overview-text", {}, [type.documentation]),
    type_fields(type, data),
    type_subtypes(type.subtypes, data),
  ]);
}

function type_fields(type, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Fields"]),
    h(
      ".doc-section-summary.summary-fields.summary-table",
      {},
      type.fields.map((f) => do_type_field(f, type, data))
    ),
  ]);
}

function do_type_field(field, type, data) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [field.name]),
    h(".doc-summary-entry-description.full-description", {}, [
      field.constraint,
    ]),
  ]);
}

function type_subtypes(subtypes, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Subtypes"]),
    h(
      ".doc-section-summary.summary-types",
      {},
      subtypes
        .map((n) => data.types.find((t) => t.full_name === n) ?? { name: n })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_type_summary(t, data))
    ),
  ]);
}

function type_summary(data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Types"]),
    h(
      ".doc-section-summary.summary-types",
      {},
      data.types
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_type_summary(t, data))
    ),
  ]);
}

function do_type_summary(type, data) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [
      link(type.name, () => render(type_page(type, data))),
    ]),
    h(".doc-summary-entry-description", {}, [
      type.documentation || "(no documentation)",
    ]),
  ]);
}

function pkg_overview(data) {
  return h(".doc-page.package-overview", {}, [
    h(".heading", {}, [
      h("h1.title", {}, [data.package.meta.name]),
      h(".heading-meta", {}, [
        h(".heading-meta-item", {}, [
          h("strong", {}, ["Stability"]),
          h(".heading-meta-contents", {}, [
            data.package.meta.stability ?? "(experimental)",
          ]),
        ]),
        h(".heading-meta-item", {}, [
          h("strong", {}, ["Target"]),
          h(".heading-meta-contents", {}, [data.package.target]),
        ]),
        h(".heading-meta-item", {}, [
          h("strong", {}, ["Version"]),
          h(".heading-meta-contents", {}, [
            data.package.meta.version ?? "(not yet published)",
          ]),
        ]),
      ]),
    ]),
    h(".overview-text", {}, [data.package.overview]),
    h(".package-contents", {}, [type_summary(data)]),
  ]);
}

function index(data) {
  return h(".doc-container", {}, [pkg_overview(data)]);
}

function main() {
  const source =
    document.querySelector("script[data-id='docs']")?.textContent ?? "";
  const data = JSON.parse(source);
  const page = index(data);
  render(page);
}

function render(page) {
  const root = document.querySelector("#doc-root");
  root.textContent = "";
  root.append(page);
}

main();
