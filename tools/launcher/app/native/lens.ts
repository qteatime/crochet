import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const svgNS = "http://www.w3.org/2000/svg";
  function h(
    tag: string,
    attrs: {
      [key: string]:
        | string
        | { [key: string]: string | null }
        | undefined
        | null;
      style?: { [key: string]: string | null };
    },
    children: (Node | string)[],
    ns: string | null = null
  ) {
    const element = ns
      ? document.createElementNS(ns, tag)
      : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) {
        continue;
      } else if (typeof v === "string") {
        element.setAttribute(k, v);
      } else if (k === "style" && element instanceof HTMLElement) {
        for (const [k, x] of Object.entries(v)) {
          if (x != null) {
            element.style[k as any] = x;
          }
        }
      } else {
        throw ffi.panic("internal", `Invalid attribute ${k}`);
      }
    }
    for (const x of children) {
      element.append(x);
    }
    return element;
  }

  function make_svg() {
    const element = document.createElementNS(svgNS, "svg");
    return element;
  }

  function fix_svg_box(svg: SVGSVGElement) {
    const measure = h(
      "div",
      {
        style: {
          position: "absolute",
          top: "-1000px",
          height: "-1000px",
          width: "1px",
          overflow: "hidden",
          visibility: "hidden",
        },
      },
      []
    );
    document.body.append(measure);
    measure.append(svg);
    const bounds = svg.getBBox();
    svg.setAttribute("width", `${bounds.width}px`);
    svg.setAttribute("height", `${bounds.height}px`);
    measure.remove();
    return svg;
  }

  function compile_point2d(data: any) {
    if (data.tag !== "point-2d") {
      throw ffi.panic("invalid-type", `Expected point2d`);
    }
    return {
      x: compile_unit(data.x),
      y: compile_unit(data.y),
    };
  }

  function compile_dimension(data: any) {
    if (data.tag !== "dimension") {
      throw ffi.panic("invalid-type", `Expected dimension`);
    }
    return {
      width: compile_unit(data.width),
      height: compile_unit(data.height),
    };
  }

  function compile_presentation(data: any) {
    if (data.tag !== "presentation") {
      throw ffi.panic("invalid-type", `Expected presentation`);
    }
    return {
      stroke_colour: compile_colour(data["stroke-colour"]),
      stroke_width: compile_unit(data["stroke-width"]),
      fill_colour: compile_colour(data["fill-colour"]),
    };
  }

  function svg_presentation(presentation: any) {
    return {
      fill: presentation.fill_colour ?? "none",
      stroke: presentation.stroke_colour ?? "none",
      "stroke-width": presentation.stroke_width ?? "0",
    };
  }

  function compile_colour(data: any) {
    if (data == null) {
      return null;
    } else {
      switch (data.tag) {
        case "rgba":
          return `rgba(${data.red}, ${data.green}, ${data.blue}, ${
            data.alpha / 255
          })`;
        default:
          throw ffi.panic("invalid-type", `Unknown colour tag ${data.tag}`);
      }
    }
  }

  function compile_unit(data: any) {
    if (data == null) {
      return null;
    }

    switch (data.unit) {
      case "em":
        return `${data.value}em`;
      case "percent":
        return `${data.value}%`;
      case "pixel":
        return `${data.value}px`;
      default:
        throw ffi.panic("invalid-type", `Unknown unit tag ${data.unit}`);
    }
  }

  function render(data: any, compact = false): Element {
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

        case "code":
          return h("div", { class: "value-lens-code" }, [data.value]);

        case "list":
          return h(
            "div",
            { class: "value-lens-list" },
            data.items.map((x: any) =>
              h("div", { class: "value-lens-list-item" }, [render(x, true)])
            )
          );

        case "table":
          return h("div", { class: "value-lens-table" }, [
            h(
              "div",
              { class: "value-lens-table-header" },
              data.header.map((x: any) =>
                h("div", { class: "value-lens-table-cell" }, [render(x, true)])
              )
            ),
            ...data.rows.map((x: any) =>
              h(
                "div",
                { class: "value-lens-table-row" },
                x.map((y: any) =>
                  h("div", { class: "value-lens-table-cell" }, [
                    render(y, true),
                  ])
                )
              )
            ),
          ]);

        case "flow":
          return h(
            "div",
            { class: "value-lens-flow" },
            data.items.map((x: any) =>
              h("div", { class: "value-lens-flow-item" }, [render(x, compact)])
            )
          );

        case "flex-row":
          return h(
            "div",
            {
              class: "value-lens-flex-row",
              style: { gap: compile_unit(data.gap) },
            },
            data.items.map((x: any) => render(x, compact))
          );

        case "flex-column":
          return h(
            "div",
            {
              class: "value-lens-flex-column",
              style: { gap: compile_unit(data.gap) },
            },
            data.items.map((x: any) => render(x, compact))
          );

        case "fixed-layout":
          return h(
            "div",
            {
              class: "value-lens-fixed-layout",
              style: {
                width: compile_unit(data.width) ?? "0px",
                height: compile_unit(data.height) ?? "0px",
              },
            },
            data.items.map((x: any) => render(x, compact))
          );

        case "position":
          return h(
            "div",
            {
              class: "value-lens-position",
              style: {
                top: compile_unit(data.position.y),
                left: compile_unit(data.position.x),
              },
            },
            [render(data.content, compact)]
          );

        case "typed":
          return h("div", { class: "value-lens-typed" }, [
            h("div", { class: "value-lens-typed-type" }, [
              h("div", { class: "value-lens-typed-type-name" }, [
                data["type-name"],
              ]),
              " in ",
              h("div", { class: "value-lens-typed-type-package" }, [
                data["package-name"],
              ]),
            ]),
            h("div", { class: "value-lens-typed-value" }, [
              render(data.content, compact),
            ]),
          ]);

        case "group": {
          let state = compact;
          const button = h("div", { class: "value-lens-group-button" }, [
            h("i", { class: "fas fa-plus" }, []),
          ]);
          const element = h(
            "div",
            { class: "value-lens-group", "data-compact": String(state) },
            [
              button,
              h("div", { class: "value-lens-group-contents" }, [
                h("div", { class: "value-lens-group-compact" }, [
                  render(data.compact),
                ]),
                h("div", { class: "value-lens-group-expanded" }, [
                  render(data.expanded),
                ]),
              ]),
            ]
          );
          button.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            state = !state;
            const icon = state ? "fa-plus" : "fa-minus";
            element.setAttribute("data-compact", String(state));
            button.querySelector("i")!.className = `fas ${icon}`;
          });
          return element;
        }

        case "circle": {
          const svg = make_svg();
          const center = compile_point2d(data.center);
          const circle = h(
            "circle",
            {
              cx: center.x ?? "0px",
              cy: center.y ?? "0px",
              r: compile_unit(data.radius) ?? "0px",
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(circle);
          return fix_svg_box(svg);
        }

        case "ellipse": {
          const svg = make_svg();
          const center = compile_point2d(data.center);
          const radius = compile_point2d(data.radius);
          const circle = h(
            "ellipse",
            {
              cx: center.x ?? "0px",
              cy: center.y ?? "0px",
              rx: radius.x ?? "0px",
              ry: radius.y ?? "0px",
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(circle);
          return fix_svg_box(svg);
        }

        case "rectangle": {
          const svg = make_svg();
          const roundness = compile_point2d(data.roundness);
          const rect = h(
            "rect",
            {
              ...compile_point2d(data.origin),
              ...compile_dimension(data.size),
              rx: roundness.x,
              ry: roundness.y,
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(rect);
          return fix_svg_box(svg);
        }

        case "line": {
          const svg = make_svg();
          const from = compile_point2d(data.from);
          const to = compile_point2d(data.to);
          const line = h(
            "line",
            {
              x1: from.x ?? "0px",
              y1: from.y ?? "0px",
              x2: to.x ?? "0px",
              y2: to.y ?? "0px",
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(line);
          return fix_svg_box(svg);
        }

        case "polygon": {
          const svg = make_svg();
          const points = (data.points as any[])
            .map(compile_point2d)
            .map((p) => (p == null ? null : `${p.x},${p.y}`))
            .filter((x) => x != null);
          const polygon = h(
            "polygon",
            {
              points: points.join(" "),
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(polygon);
          return fix_svg_box(svg);
        }

        case "polyline": {
          const svg = make_svg();
          const points = (data.points as any[])
            .map(compile_point2d)
            .map((p) => (p == null ? null : `${p.x},${p.y}`))
            .filter((x) => x != null);
          const polygon = h(
            "polyline",
            {
              points: points.join(" "),
              ...svg_presentation(compile_presentation(data.presentation)),
            },
            [],
            svgNS
          );
          svg.append(polygon);
          return fix_svg_box(svg);
        }

        default:
          return h("div", { class: "value-lens-unknown" }, [
            JSON.stringify(data, null, 2),
          ]);
      }
    }
  }

  ffi.defun("lens.render", (json) => {
    const data = JSON.parse(ffi.text_to_string(json));
    return ffi.box(h("div", { class: "value-lens-container" }, [render(data)]));
  });
};
