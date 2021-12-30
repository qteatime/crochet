import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function h(
    tag: string,
    attrs: { [key: string]: string },
    children: (Node | string)[]
  ) {
    const element = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      element.setAttribute(k, v);
    }
    for (const x of children) {
      element.append(x);
    }
    return element;
  }

  function render(data: any): HTMLElement {
    if (data == null) {
      return h("div", { class: "value-lens-nothing" }, []);
    } else {
      switch (data.tag) {
        case "empty":
          return h("div", { class: "value-lens-empty" }, []);

        case "number":
          return h("div", { class: "value-lens-number" }, [data.value]);

        case "text":
          return h(
            "div",
            { class: "value-lens-text", "data-untrusted": data.untrusted },
            [data.value]
          );

        case "boolean":
          return h("div", { class: "value-lens-boolean" }, [
            String(data.value),
          ]);

        case "plain-text":
          return h("div", { class: "value-lens-plain-text" }, [data.value]);

        case "list":
          return h(
            "div",
            { class: "value-lens-list" },
            data.items.map((x: any) => render(x))
          );

        case "table":
          return h("div", { class: "value-lens-table" }, [
            h(
              "div",
              { class: "value-lens-table-header" },
              data.header.map((x: any) => render(x))
            ),
            ...data.rows.map((x: any) =>
              h(
                "div",
                { class: "value-lens-table-row" },
                x.map((y: any) =>
                  h("div", { class: "value-lens-table-cell" }, [render(y)])
                )
              )
            ),
          ]);

        case "flow":
          return h(
            "div",
            { class: "value-lens-flow" },
            data.items.map((x: any) => render(x))
          );

        case "flex-row":
          return h(
            "div",
            { class: "value-lens-flex-row" },
            data.items.map((x: any) => render(x))
          );

        case "flex-column":
          return h(
            "div",
            { class: "value-lens-flex-column" },
            data.items.map((x: any) => render(x))
          );

        case "fixed-layout":
          return h(
            "div",
            { class: "value-lens-fixed-layout" },
            data.items.map((x: any) => render(x))
          );

        case "position":
          return h("div", { class: "value-lens-position" }, [
            render(data.content),
          ]);

        case "typed":
          return h("div", { class: "value-lens-typed" }, [
            h("div", { class: "value-lens-typed-type" }, [
              h("div", { class: "value-lens-typed-type-name" }, [
                data["type-name"],
              ]),
              h("div", { class: "value-lens-typed-type-package" }, [
                data["package-name"],
              ]),
            ]),
            h("div", { class: "value-lens-typed-value" }, [
              render(data.content),
            ]),
          ]);

        default:
          return h("div", { class: "value-lens-unknown" }, [
            JSON.stringify(data),
          ]);
      }
    }
  }

  ffi.defun("lens.render", (json) => {
    const data = JSON.parse(ffi.text_to_string(json));
    return ffi.box(render(data));
  });
};
