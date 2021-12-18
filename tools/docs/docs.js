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
    h(".overview-text", {}, [md_to_html(type.documentation)]),
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
    h(".overview-text", {}, [md_to_html(trait.documentation)]),
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
    h(".overview-text", {}, [md_to_html(branch.documentation)]),
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
    const type = unambiguous_type_name(constraint.type, data);
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

function capability_page(capability, data) {
  return h(".doc-page.page-capability", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [capability.name]),
      h("h1.title", {}, [
        h(".page-type-tag", {}, ["Capability"]),
        capability.name,
      ]),
    ]),
    h(".overview-text", {}, [md_to_html(capability.documentation)]),
    h(".doc-section", {}, [
      h("h2.subtitle", {}, ["Source code"]),
      h(".source-code-caption", {}, [capability.location]),
      h(".source-code.declaration-code", {}, [capability.declaration]),
    ]),
    h(".doc-section", {}, [
      h("h2.subtitle", {}, ["Accesses granted"]),
      h(
        ".doc-access-list",
        {},
        capability.protecting
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((x) => do_access_granted_summary(x, data))
      ),
    ]),
  ]);
}

function do_access_granted_summary(x, data) {
  if (x.type === "global") {
    return h(".doc-access-item", {}, [h("strong", {}, "global "), x.name]);
  } else if (x.type === "type") {
    const type = data.types.find((t) => t.full_name === x.name) ?? {
      name: x.name,
    };
    return h(".doc-access-item", {}, [
      h("strong", {}, "type "),
      type.full_name
        ? link(type.full_name, () => render(type_page(type, data)))
        : type.name,
    ]);
  } else {
    return h(".error", {}, [`Unknown ${x.type}`]);
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
    h(".overview-text", {}, [md_to_html(data.package.overview)]),
    h(".package-contents", {}, [
      capability_summary(data),
      globals_summary(data),
      type_summary(data),
      trait_summary(data),
      command_summary(data.commands, data),
    ]),
  ]);
}

function capability_summary(data) {
  return h(".doc-section", {}, [
    h("h2.subtitle", { id: "capabilities" }, ["Capabilities"]),
    h(
      ".doc-section-summary.summary-capabilities",
      {},
      data.capabilities
        .filter((c) => c.package === data.package.meta.name)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => do_capability_summary(c, data))
    ),
  ]);
}

function do_capability_summary(capability, data) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [
      link(capability.name, () => render(capability_page(capability, data))),
    ]),
    h(".doc-summary-entry-description", {}, [
      capability.documentation || "(no documentation)",
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
      ...(type == null
        ? [global.name, " is ", global.type]
        : global.name === type.name
        ? [link(type.name, () => render(type_page(type, data)))]
        : [
            global.name,
            " is ",
            link(type.name, () => render(type_page(type, data))),
          ]),
    ]),
    h(".doc-summary-entry-description", {}, [
      type?.documentation || "(no documentation)",
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

function md_to_html(text) {
  function render_inline(text) {
    const html0 = h("div.cmd", {}, [text]).innerHTML;
    const html = html0
      .replace(/`(.+?)`/g, (_, x) => h("code", {}, [x]).outerHTML)
      .replace(
        /\[([^\]]+)\]/g,
        (_, x) =>
          h("a.inner-link", { "data-target": x, href: "#" }, [
            h("code", {}, [x]),
          ]).outerHTML
      )
      .replace(/\*\*(.+?)\*\*/g, (_, x) => h("strong", {}, [x]).outerHTML)
      .replace(/\*(.+?)\*/g, (_, x) => h("em", {}, [x]).outerHTML);
    const element = h("div.cmd", {}, []);
    element.innerHTML = html;
    return element;
  }

  function reify(block) {
    if (block == null) {
      return "";
    } else if (block instanceof Node) {
      return block;
    } else if (block.type === "paragraph") {
      return h("p", {}, [render_inline(block.contents.join("\n"))]);
    } else {
      throw new Error(`invalid block`);
    }
  }

  function push(blocks, content) {
    if (content == null) {
      return blocks;
    } else {
      blocks.push(reify(content));
      return blocks;
    }
  }

  function push_many(blocks, contents) {
    return contents.reduce((b, c) => push(b, c), blocks);
  }

  function push_paragraph(blocks, current, line) {
    if (current != null && current.type === "paragraph") {
      return {
        blocks: blocks,
        current: {
          type: "paragraph",
          contents: [...current.contents, line],
        },
      };
    } else {
      return {
        blocks: push(blocks, current),
        current: {
          type: "paragraph",
          contents: [line],
        },
      };
    }
  }

  function handle_line({ blocks, current }, line) {
    if (/^#+\s*\S/.test(line)) {
      const [_, level, text] = line.match(/^(#+)\s*(.*)/);
      return {
        blocks: push_many(blocks, [
          current,
          h(`h${level.length + 1}.md-title`, {}, [text]),
        ]),
        current: null,
      };
    } else if (/^\s*$/.test(line)) {
      return {
        blocks: push(blocks, current),
        current: null,
      };
    } else {
      return push_paragraph(blocks, current, line);
    }
  }
  const lines = text.split(/\r\n|\r|\n/);
  const result = lines.reduce(handle_line, { blocks: [], current: null });
  const blocks = push(result.blocks, result.current);
  return h("div.crochet-md", {}, blocks);
}

main();
