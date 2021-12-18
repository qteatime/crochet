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

function link(text, on_click_fn) {
  const element = h("a", { href: "#" }, [text]);
  on_click(element, on_click_fn);
  return element;
}

function on_click(e, fn) {
  e.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    fn();
  });
}

function section(title, contents) {
  return h(".doc-section", {}, [h("h2.subtitle", {}, [title]), contents]);
}

function summary(entries) {
  return h(".doc-section-summary", {}, entries);
}

function command_list(entries) {
  return h(".doc-command-list", {}, entries);
}

function summary_table(entries) {
  return h(".doc-section-summary.summary-table", {}, entries);
}

function summary_entry({ title, description }) {
  return h(".doc-summary-entry", {}, [
    h(".doc-summary-entry-title", {}, [title]),
    h(".doc-summary-entry-description", {}, [description]),
  ]);
}

function heading({ breadcrumbs, tag, title }) {
  return h(".heading", {}, [
    breadcrumbs,
    h("h1.title", {}, [h(".page-type-tag", {}, [tag]), title]),
  ]);
}

function source_code(location, declaration) {
  return h(".doc-section", {}, [
    h("h2.subtitle", {}, ["Source code"]),
    h(".source-code-caption", {}, [location]),
    h(".source-code.declaration-code", {}, [declaration]),
  ]);
}

function meta(entries) {
  return h(".heading-meta", {}, entries);
}

function meta_entry(title, contents) {
  return h(".heading-meta-item", {}, [
    h("strong", {}, [title]),
    h(".heading-meta-contents", {}, [contents]),
  ]);
}

function hseq(contents) {
  return h(".hseq", {}, contents);
}

function breadcrumbs(data, items) {
  return h(".breadcrumbs", {}, [
    h(".breadcrumb-item.breadcrumb-home", {}, [
      link(data.package.meta.name, () => render(index(data))),
    ]),
    ...items.map((x) => h(".breadcrumb-item", {}, [x])),
  ]);
}

function tab_panel(tabs) {
  function select(tab) {
    Array.from(contents.querySelectorAll(".tab-panel-content")).forEach((x) =>
      x.classList.remove("selected")
    );
    Array.from(header.querySelectorAll(".tab-panel-button")).forEach((x) =>
      x.classList.remove("selected")
    );
    header
      .querySelector(`.tab-panel-button[data-id="${tab.id}"]`)
      .classList.add("selected");
    contents
      .querySelector(`.tab-panel-content[data-id="${tab.id}"]`)
      .classList.add("selected");
  }

  const contents = h(
    ".tab-panel-contents",
    {},
    tabs.map((t) => h(".tab-panel-content", { "data-id": t.id }, [t.contents]))
  );

  const header = h(
    ".tab-panel-header",
    {},
    tabs.map((t) =>
      h(".tab-panel-button", { "data-id": t.id }, [
        link(t.title, () => select(t)),
      ])
    )
  );

  select(tabs[0]);

  return h(".tab-panel", {}, [header, contents]);
}

function tab(id, title, contents) {
  return { id, title, contents };
}

function effect_page(effect, data) {
  return h(".doc-page.page-effect", {}, [
    heading({
      breadcrumbs: breadcrumbs(data, [effect.name]),
      tag: "Effect",
      title: effect.name,
    }),
    h(".overview-text", {}, [md_to_html(effect.documentation, data)]),
    source_code(effect.location, effect.declaration),
    tab_panel([
      tab(
        1,
        "Operations",
        summary(
          effect.operations.map((x) => effect_op_summary_entry(x, effect, data))
        )
      ),
      tab(2, "Protected by", summary(type_capability_summary(effect, data))),
    ]),
  ]);
}

function effect_op_page(operation, effect, data) {
  return h(".doc-page", {}, [
    heading({
      breadcrumbs: breadcrumbs(data, [
        link(effect.name, () => render(effect_page(effect, data))),
        operation.name,
      ]),
      tag: "Effect operation",
      title: operation.name,
    }),
    h(".overview-text", {}, [md_to_html(operation.documentation, data)]),
    source_code(operation.location, operation.declaration),
    section("Fields", summary_table(type_field_summary(operation, data))),
  ]);
}

function effect_op_summary_entry(operation, effect, data) {
  return summary_entry({
    title: link(operation.name, () =>
      render(effect_op_page(operation, effect, data))
    ),
    description: operation.documentation || "(no documentation)",
  });
}

function effect_summary_entry(effect, data) {
  return summary_entry({
    title: link(effect.name, () => render(effect_page(effect, data))),
    description: effect.documentation || "(no documentation)",
  });
}

function type_page(type, data) {
  return h(".doc-page.page-type", {}, [
    heading({
      breadcrumbs: breadcrumbs(data, [type.name]),
      tag: "Type",
      title: type.name,
    }),
    h(".overview-text", {}, [md_to_html(type.documentation, data)]),
    source_code(type.location, type.declaration),
    tab_panel([
      tab(1, "Fields", summary_table(type_field_summary(type, data))),
      tab(2, "Hierarchy", type_hierarchy(type, data)),
      tab(
        3,
        "Traits implemented",
        summary(type_implemented_traits(type, data))
      ),
      tab(
        4,
        "Relevant commands",
        summary(
          branches_summary_for(
            (c) =>
              c.type === type.full_name || c.type === type.static_full_name,
            data
          )
        )
      ),
      tab(5, "Protected by", summary(type_capability_summary(type, data))),
    ]),
  ]);
}

function type_capability_summary(type, data) {
  return type.capabilities
    .map(
      (tc) => data.capabilities.find((c) => c.full_name === tc) ?? { name: tc }
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => capability_summary_entry(c, data));
}

function type_field_summary(type, data) {
  return type.fields.map((f) => type_field_summary_entry(f, type, data));
}

function type_field_summary_entry(field, type, data) {
  return summary_entry({
    title: field.name,
    description: field.constraint,
  });
}

function type_hierarchy(type, data) {
  const parent_hierarchy = type.parents
    .slice()
    .reverse()
    .map((n) => data.types.find((t) => t.full_name === n ?? { name: n }))
    .map((t) =>
      h(".type-hierarchy-item", {}, [
        t.signature
          ? link(t.signature, () => render(type_page(t, data)))
          : t.name,
      ])
    );
  const subtypes = type.subtypes
    .map((n) => data.types.find((t) => t.full_name === n) ?? { name: n })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => type_summary_entry(t, data));

  return h(".type-hierarchy-section", {}, [
    h("h3.mini-title", {}, ["Parent types"]),
    h(".type-hierarchy", {}, [
      h(".type-hierarchy-parents", {}, parent_hierarchy),
      h(".type-hierarchy-current", {}, [type.signature]),
    ]),
    h("h3.mini-title", {}, ["Sub types"]),
    h(".doc-section-summary.summary-types", {}, subtypes),
  ]);
}

function type_implemented_traits(type, data) {
  return type.traits
    .map((n) => data.traits.find((t) => t.full_name === n) ?? { name: n })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => trait_summary_entry(t, data));
}

function type_summary(data) {
  return data.types
    .filter((t) => t.package === data.package.meta.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => type_summary_entry(t, data));
}

function type_summary_entry(type, data) {
  return summary_entry({
    title: type.full_name
      ? link(type.name, () => render(type_page(type, data)))
      : type.name,
    description: type.documentation || "(no documentation)",
  });
}

function trait_page(trait, data) {
  return h(".doc-page.page-trait", {}, [
    heading({
      breadcrumbs: breadcrumbs(data, [trait.name]),
      tag: "Trait",
      title: trait.name,
    }),
    h(".overview-text", {}, [md_to_html(trait.documentation, data)]),
    source_code(trait.location, trait.declaration),
    tab_panel([
      tab(1, "Implemented by", summary(trait_implementers(trait, data))),
      tab(
        2,
        "Relevant commands",
        summary(
          branches_summary_for(
            (c) => c.traits.some((t) => trait.full_name === t),
            data
          )
        )
      ),
    ]),
  ]);
}

function trait_implementers(trait, data) {
  return trait.implemented_by
    .map((n) => data.types.find((t) => t.full_name === n) ?? { name: n })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => type_summary_entry(t, data));
}

function trait_summary(data) {
  return data.traits
    .filter((t) => t.package === data.package.meta.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => trait_summary_entry(t, data));
}

function trait_summary_entry(trait, data) {
  return summary_entry({
    title: trait.full_name
      ? link(trait.name, () => render(trait_page(trait, data)))
      : trait.name,
    description: trait.documentation || "(no documentation)",
  });
}

function command_summary(commands, data) {
  return commands
    .map((c) => ({
      ...c,
      branches: c.branches.filter((b) => b.package === data.package.meta.name),
    }))
    .filter((c) => c.branches.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => command_summary_entry(c, data));
}

function command_summary_entry(command, data) {
  return h(".doc-command-entry", {}, [
    link(`${command.name} (${command.branches.length} branches)`, () =>
      render(command_page(command, data))
    ),
  ]);
}

function command_page(command, data) {
  return h(".doc-page.page-type", {}, [
    h(".heading", {}, [
      breadcrumbs(data, [command.name]),
      h("h1.title", {}, [h(".page-type-tag", {}, ["Command"]), command.name]),
      section("Branches", summary(command_branches(command, data))),
    ]),
  ]);
}

function command_branches(command, data) {
  return command.branches.map((b) => branch_summary_entry(command, b, data));
}

function branch_summary_entry(command, branch, data) {
  return summary_entry({
    title: link(full_branch_name(branch, data), () =>
      render(branch_page(command, branch, data))
    ),
    description: branch.documentation || "(no documentation)",
  });
}

function branches_summary_for(predicate, data) {
  return data.commands
    .flatMap((c) => c.branches.map((b) => ({ command: c, branch: b })))
    .filter((b) => b.branch.types.some((c) => predicate(c)))
    .sort((a, b) => a.branch.name.localeCompare(b.branch.name))
    .map((b) => branch_summary_entry(b.command, b.branch, data));
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
    h(".overview-text", {}, [md_to_html(branch.documentation, data)]),
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
    heading({
      breadcrumbs: breadcrumbs(data, [capability.name]),
      tag: "Capability",
      title: capability.name,
    }),
    h(".overview-text", {}, [md_to_html(capability.documentation, data)]),
    source_code(capability.location, capability.declaration),
    tab_panel([
      tab(1, "Accesses granted", capability_access_summary(capability, data)),
    ]),
  ]);
}

function capability_access_summary(capability, data) {
  return h(
    ".doc-access-list",
    {},
    capability.protecting
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((x) => do_access_granted_summary(x, data))
  );
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
      meta([
        meta_entry(
          "Stability",
          data.package.meta.stability ?? "(experimental)"
        ),
        meta_entry("Target", data.package.target),
        meta_entry(
          "Version",
          data.package.meta.version ?? "(not yet published)"
        ),
      ]),
    ]),
    h(".overview-text", {}, [md_to_html(data.package.overview, data)]),
    h(".package-contents", {}, [
      tab_panel([
        tab(1, "Capabilities", summary(capability_summary(data))),
        tab(2, "Global definitions", summary(globals_summary(data))),
        tab(3, "Effects", summary(effects_summary(data))),
        tab(4, "Types", summary(type_summary(data))),
        tab(5, "Traits", summary(trait_summary(data))),
        tab(6, "Commands", command_list(command_summary(data.commands, data))),
      ]),
    ]),
  ]);
}

function capability_summary(data) {
  return data.capabilities
    .filter((c) => c.package === data.package.meta.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => capability_summary_entry(c, data));
}

function capability_summary_entry(capability, data) {
  return summary_entry({
    title: capability.full_name
      ? link(capability.name, () => render(capability_page(capability, data)))
      : capability.name,
    description: capability.documentation || "(no documentation)",
  });
}

function globals_summary(data) {
  return data.globals
    .filter((t) => t.package === data.package.meta.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => global_summary_entry(t, data));
}

function global_summary_entry(global, data) {
  const type = data.types.find((t) => t.full_name === global.type);
  return summary_entry({
    title: hseq([
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
    description: type?.documentation || "(no documentation)",
  });
}

function effects_summary(data) {
  return data.effects
    .filter((t) => t.package === data.package.meta.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => effect_summary_entry(t, data));
}

function index(data) {
  return h(".doc-container", { id: "page-root" }, [pkg_overview(data)]);
}

function main() {
  const source =
    document.querySelector("script[data-id='docs']")?.textContent ?? "";
  const data = JSON.parse(source);
  const page = index(data);
  render(page, "#doc-root");
}

function render(page, selector = "#page-root") {
  const root = document.querySelector(selector);
  root.textContent = "";
  root.append(page);
}

function md_to_html(text, data) {
  function parse_link(text) {
    const m1 = text.match(/^(\w+):(.+)/);
    if (m1 == null) {
      return {
        tag: "link",
        text: text,
        target: "#",
      };
    } else {
      const [_, type, line] = m1;
      const [name, desc0] = line.split(/\s*\|\s*/);
      const desc = desc0 || name;
      return {
        tag: type,
        text: desc,
        target: name,
      };
    }
  }

  function reify_links(root) {
    const links = Array.from(
      root.querySelectorAll("a.inner-link[data-target]")
    );
    links.forEach((link) => {
      const target = link.getAttribute("data-target");
      switch (link.getAttribute("data-tag")) {
        case "type": {
          const type = try_find_item(data.types, target, data);
          if (type != null) {
            on_click(link, () => render(type_page(type, data)));
          } else {
            link.classList.add("broken-link");
          }
          break;
        }
        case "effect": {
          const effect = try_find_item(data.effects, target, data);
          if (effect != null) {
            on_click(link, () => render(effect_page(effect, data)));
          } else {
            link.classList.add("broken-link");
          }
          break;
        }
        case "trait": {
          const trait = try_find_item(data.traits, target, data);
          if (trait != null) {
            on_click(link, () => render(trait_page(trait, data)));
          } else {
            link.classList.add("broken-link");
          }
          break;
        }
        case "command": {
          const command = try_find_item(data.commands, target, data);
          if (command != null) {
            on_click(link, () => render(command_page(command, data)));
          } else {
            link.classList.add("broken-link");
          }
          break;
        }
        case "capability": {
          const capability = try_find_item(data.capabilities, target, data);
          if (capability != null) {
            on_click(link, () => render(capability_page(capability, data)));
          } else {
            link.classList.add("broken-link");
          }
          break;
        }
        default:
          link.classList.add("broken-link");
      }
    });
  }

  function render_inline(text) {
    const html0 = h("div.cmd", {}, [text]).innerHTML;
    const html = html0
      .replace(/`(.+?)`/g, (_, x) => h("code", {}, [x]).outerHTML)
      .replace(/\[([^\]]+)\]/g, (_, x) => {
        const { tag, text, target } = parse_link(x);
        return h(
          "a.inner-link",
          { "data-target": target, href: "#", "data-tag": tag },
          [h("code", {}, [text])]
        ).outerHTML;
      })
      .replace(/\*\*(.+?)\*\*/g, (_, x) => h("strong", {}, [x]).outerHTML)
      .replace(/\*(.+?)\*/g, (_, x) => h("em", {}, [x]).outerHTML);
    const element = h("div.cmd", {}, []);
    element.innerHTML = html;
    reify_links(element);
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

function try_find_item(items, name, data) {
  const full_name = name.includes("/")
    ? name
    : `${data.package.meta.name}/${name}`;
  return (
    items.find((i) => i.full_name === full_name) ??
    items.find(
      (i) => full_name !== name && i.full_name === `crochet.core/${name}`
    )
  );
}

main();
