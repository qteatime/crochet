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
    type_hierarchy(type, data),
    type_implemented_traits(type, data),
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

function type_hierarchy(type, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Hierarchy"]),
    h(".type-hierarchy", {}, [
      h(
        ".type-hierarchy-parents",
        {},
        type.parents
          .slice()
          .reverse()
          .map((n) => data.types.find((t) => t.full_name === n ?? { name: n }))
          .map((t) =>
            h(".type-hierarchy-item", {}, [
              t.signature
                ? link(t.signature, () => render(type_page(t, data)))
                : t.name,
            ])
          )
      ),
      h(".type-hierarchy-current", {}, [type.signature]),
    ]),
    h("h3.minititle", {}, ["Sub types"]),
    h(
      ".doc-section-summary.summary-types",
      {},
      type.subtypes
        .map((n) => data.types.find((t) => t.full_name === n) ?? { name: n })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_type_summary(t, data))
    ),
  ]);
}

function type_implemented_traits(type, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Traits implemented"]),
    h(
      ".doc-section-summary.summary-traits",
      {},
      type.traits
        .map((n) => data.traits.find((t) => t.full_name === n) ?? { name: n })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_trait_summary(t, data))
    ),
  ]);
}

function type_summary(data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", { id: "types" }, ["Types"]),
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
      type.full_name
        ? link(type.name, () => render(type_page(type, data)))
        : type.name,
    ]),
    h(".doc-summary-entry-description", {}, [
      type.documentation || "(no documentation)",
    ]),
  ]);
}

function trait_page(trait, data) {
  return h(".doc-page.page-trait", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [trait.name]),
      h("h1.title", {}, [h(".page-type-tag", {}, "Trait"), trait.name]),
    ]),
    h(".source-code-caption", {}, trait.location),
    h(".source-code.declaration-code", {}, [trait.declaration]),
    h(".overview-text", {}, [trait.documentation]),
    trait_implementers(trait, data),
  ]);
}

function trait_implementers(trait, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Implemented By"]),
    h(
      ".doc-section-summary.summary-types",
      {},
      trait.implemented_by
        .map((n) => data.types.find((t) => t.full_name === n) ?? { name: n })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_type_summary(t, data))
    ),
  ]);
}

function trait_summary(data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", { id: "traits" }, ["Traits"]),
    h(
      ".doc-section-summary.summary-traits",
      {},
      data.traits
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_trait_summary(t, data))
    ),
  ]);
}

function do_trait_summary(trait, data) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [
      trait.full_name
        ? link(trait.name, () => render(trait_page(trait, data)))
        : trait.name,
    ]),
    h(".doc-summary-entry-description", {}, [
      trait.documentation || "(no documentation)",
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
    h(".package-contents", {}, [type_summary(data), trait_summary(data)]),
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
