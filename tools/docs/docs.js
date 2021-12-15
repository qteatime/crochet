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
      h("h1.title", {}, [h(".page-type-tag", {}, ["Type"]), type.name]),
    ]),
    h(".overview-text", {}, [type.documentation]),
    h(".doc-section", {}, [
      h("h2.subtitle", {}, ["Source code"]),
      h(".source-code-caption", {}, [type.location]),
      h(".source-code.declaration-code", {}, [type.declaration]),
    ]),
    type_fields(type, data),
    type_hierarchy(type, data),
    type_implemented_traits(type, data),
    branches_summary_for(
      (c) => c.type === type.full_name || c.type === type.static_full_name,
      data
    ),
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
        .filter((t) => t.package === data.package.meta.name)
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
      h("h1.title", {}, [h(".page-type-tag", {}, ["Trait"]), trait.name]),
    ]),
    h(".overview-text", {}, [trait.documentation]),
    h(".doc-section", {}, [
      h("h2.subtitle", {}, ["Source code"]),
      h(".source-code-caption", {}, [trait.location]),
      h(".source-code.declaration-code", {}, [trait.declaration]),
    ]),
    trait_implementers(trait, data),
    branches_summary_for(
      (c) => c.traits.some((t) => trait.full_name === t),
      data
    ),
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
        .filter((t) => t.package === data.package.meta.name)
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

function command_summary(commands, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", { id: "commands" }, ["Commands"]),
    h(
      ".doc-command-list",
      {},
      commands
        .map((c) => ({
          ...c,
          branches: c.branches.filter(
            (b) => b.package === data.package.meta.name
          ),
        }))
        .filter((c) => c.branches.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) =>
          h(".doc-command-entry", {}, [
            link(`${c.name} (${c.branches.length} branches)`, () =>
              render(command_page(c, data))
            ),
          ])
        )
    ),
  ]);
}

function command_page(command, data) {
  return h(".doc-page.page-type", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [command.name]),
      h("h1.title", {}, [h(".page-type-tag", {}, ["Command"]), command.name]),
      command_branches(command, data),
    ]),
  ]);
}

function command_branches(command, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Branches"]),
    h(
      ".doc-section-summary.summary-branches",
      {},
      command.branches.map((b) => do_branch_summary(command, b, data))
    ),
  ]);
}

function do_branch_summary(command, branch, data) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [
      link(full_branch_name(branch, data), () =>
        render(branch_page(command, branch, data))
      ),
    ]),
    h(".doc-summary-entry-description", {}, [
      branch.documentation || "(no documentation)",
    ]),
  ]);
}

function branches_summary_for(predicate, data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Relevant command branches"]),
    h(
      ".doc-section-summary.summary-branches",
      {},
      data.commands
        .flatMap((c) => c.branches.map((b) => ({ command: c, branch: b })))
        .filter((b) => b.branch.types.some((c) => predicate(c)))
        .sort((a, b) => a.branch.name.localeCompare(b.branch.name))
        .map((b) => do_branch_summary(b.command, b.branch, data))
    ),
  ]);
}

function branch_page(command, branch, data) {
  return h(".doc-page.page-branch", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [
        link(command.name, () => render(command_page(command, data))),
      ]),
      h("h1.title", {}, [
        h(".page-type-tag", {}, ["Command branch"]),
        full_branch_name(branch, data),
      ]),
    ]),
    h(".overview-text", {}, [branch.documentation]),
    h(".doc-section", {}, [
      h("h2.subtitle", {}, ["Source code"]),
      h(".source-code-caption", {}, [branch.location]),
      h(".source-code.declaration-code", {}, [branch.declaration]),
    ]),
  ]);
}

function full_branch_name(branch, data) {
  const holes = branch.types.map((t) => short_constraint_name(t, data));
  return branch.name.replace(/_/g, (_) => {
    return holes.shift() ?? "_";
  });
}

function short_constraint_name(constraint, data) {
  if (constraint.traits.length === 0) {
    return unambiguous_type_name(constraint.type, data);
  } else {
    const type = unambiguous_type_name(constraint.type);
    const traits = constraint.traits.map((t) =>
      unambiguous_trait_name(t, data)
    );
    return `(${type} has ${traits.join(", ")})`;
  }
}

function unambiguous_type_name(name, data) {
  const search = name.replace(/#/, "");
  const type = data.types.find((t) => t.full_name === search);
  if (!type) {
    return name;
  } else {
    const types = data.types.filter((t) => t.name === type.name);
    if (types.length === 1 && types[0] === type) {
      return /#/.test(name) ? `#${type.name}` : type.name;
    } else {
      return type.full_name;
    }
  }
}

function unambiguous_trait_name(name, data) {
  const trait = data.traits.find((t) => t.full_name === name);
  if (!trait) {
    return name;
  } else {
    const traits = data.traits.filter((t) => t.name === trait.name);
    if (traits.length === 1 && traits[0] === trait) {
      return trait.name;
    } else {
      return trait.full_name;
    }
  }
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
    h(".package-contents", {}, [
      globals_summary(data),
      type_summary(data),
      trait_summary(data),
      command_summary(data.commands, data),
    ]),
  ]);
}

function globals_summary(data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", { id: "globals" }, ["Global definitions"]),
    h(
      ".doc-section-summary.summary-globals",
      {},
      data.globals
        .filter((t) => t.package === data.package.meta.name)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => do_global_summary(t, data))
    ),
  ]);
}

function do_global_summary(global, data) {
  const type = data.types.find((t) => t.full_name === global.type);
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [
      global.name === type.name
        ? link(type.name, () => render(type_page(type, data)))
        : (global.name,
          " is ",
          link(type.name, () => render(type_page(type, data)))),
    ]),
    h(".doc-summary-entry-description", {}, [
      type.documentation || "(no documentation)",
    ]),
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
