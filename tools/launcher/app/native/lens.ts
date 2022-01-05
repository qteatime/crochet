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
    const bounds = svg.getBBox({ stroke: true, fill: true });
    svg.setAttribute("width", `${bounds.x + bounds.width}px`);
    svg.setAttribute("height", `${bounds.y + bounds.height}px`);
    measure.remove();
    return svg;
  }

  function compile_point2d(data: any, unit = compile_unit) {
    if (data.tag !== "point-2d") {
      throw ffi.panic("invalid-type", `Expected point2d`);
    }
    return {
      x: unit(data.x),
      y: unit(data.y),
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

  function compile_font_presentation(data: any) {
    if (data.tag !== "font-presentation") {
      throw ffi.panic("invalid-type", "Expected font-presentation");
    }
    return {
      family: compile_font_family(data.family),
      size: compile_unit(data.size),
      colour: compile_colour(data.colour),
      style: compile_font_style(data.style),
      weight: compile_font_weight(data.weight),
      decoration: compile_font_decoration(data.decoration),
    };
  }

  function compile_font_family(data: any) {
    switch (data) {
      case "inherit":
      case "serif":
      case "sans-serif":
      case "monospace":
        return data;

      default:
        throw ffi.panic("invalid-value", `Invalid font family ${data}`);
    }
  }

  function compile_font_style(data: any) {
    switch (data) {
      case "inherit":
      case "italic":
      case "normal":
        return data;

      default:
        throw ffi.panic("invalid-value", `Invalid font style ${data}`);
    }
  }

  function compile_font_weight(data: any) {
    switch (data) {
      case "lighter":
      case "light":
      case "regular":
      case "bold":
      case "bolder":
      case "inherit":
        return data;

      default:
        throw ffi.panic("invalid-value", `Invalid font weight ${data}`);
    }
  }

  function compile_font_decoration(data: any) {
    switch (data) {
      case "inherit":
      case "underline":
      case "line-through":
      case "overline":
      case "none":
        return data;

      default:
        throw ffi.panic("invalid-value", `Invalid font decoration ${data}`);
    }
  }

  function compile_scroll_presentation(data: any) {
    if (data.tag !== "scroll-style") {
      throw ffi.panic("invalid-type", "Expected scroll-presentation");
    }
    return {
      horizontally: compile_scroll(data["horizontally"]),
      vertically: compile_scroll(data["vertically"]),
    };
  }

  function compile_scroll(data: any) {
    switch (data) {
      case "visible":
        return "scroll";

      case "hidden":
      case "auto":
        return data;

      default:
        throw ffi.panic("invalid-value", "Expected visible, hidden, or auto");
    }
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

  function compile_pixel_unit(data: any) {
    if (data == null) {
      return "0";
    } else {
      switch (data.unit) {
        case "pixel":
          return String(data.value);
        default:
          throw ffi.panic(
            "invalid-unit",
            `Only pixels are allowed, got ${data.unit}`
          );
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

  function compile_borders(data: any) {
    if (data.tag !== "borders") {
      throw ffi.panic("invalid-type", "Expected borders");
    }
    return {
      top: compile_border(data.top),
      right: compile_border(data.right),
      bottom: compile_border(data.bottom),
      left: compile_border(data.left),
    };
  }

  function compact_border(data: any) {
    return `${data.width ?? ""} ${data.colour ?? ""} ${
      data.style ?? "none"
    }`.trim();
  }

  function compact_borders(data: any) {
    return {
      top: compact_border(data.top),
      right: compact_border(data.right),
      bottom: compact_border(data.bottom),
      left: compact_border(data.left),
    };
  }

  function compile_border(data: any) {
    if (data.tag !== "border") {
      throw ffi.panic("invalid-type", "Expected border");
    }
    return {
      width: compile_unit(data.width),
      colour: compile_colour(data.colour),
      style: compile_border_style(data.style),
    };
  }

  function compile_border_style(data: any) {
    switch (data) {
      case "none":
      case "hidden":
      case "dotted":
      case "dashed":
      case "solid":
        return data;

      default:
        throw ffi.panic("invalid-value", `Not a valid border style ${data}`);
    }
  }

  function compile_background(data: any) {
    if (data.tag !== "background") {
      throw ffi.panic("invalid-value", `Expected background`);
    }
    return {
      colour: compile_colour(data.colour),
    };
  }

  function compile_padding(data: any) {
    if (data.tag !== "padding") {
      throw ffi.panic("invalid-value", `Expected padding`);
    }
    return compile_rectangle_units(data);
  }

  function compile_margin(data: any) {
    if (data.tag !== "margin") {
      throw ffi.panic("invalid-value", `Expected margin`);
    }
    return compile_rectangle_units(data);
  }

  function compile_rectangle_units(data: any) {
    return {
      top: compile_unit(data.top),
      right: compile_unit(data.right),
      bottom: compile_unit(data.bottom),
      left: compile_unit(data.left),
    };
  }

  function make_timeline(frames: any[]) {
    let current = -1;
    const rframes = frames.map((x, i) =>
      h(
        "div",
        {
          class: "value-lens-timeline-frames-entry",
          "data-index": String(i),
        },
        [render(x, false, "timeline")]
      )
    );
    const time = h(
      "input",
      {
        class: "value-lens-timeline-control-time",
        type: "range",
        min: "0",
        max: String(frames.length - 1),
        step: "1",
        value: "0",
      },
      []
    ) as HTMLInputElement;
    const prev = h(
      "button",
      { class: "value-lens-timeline-control-button", title: "Previous frame" },
      [h("i", { class: "fas fa-angle-left" }, [])]
    );
    const next = h(
      "button",
      { class: "value-lens-timeline-control-button", title: "Next frame" },
      [h("i", { class: "fas fa-angle-right" }, [])]
    );
    const container = h("div", { class: "value-lens-timeline" }, [
      h("div", { class: "value-lens-timeline-frames" }, rframes),
      h("div", { class: "value-lens-timeline-controls" }, [prev, time, next]),
    ]);

    function select(index: number) {
      if (rframes[current]) {
        rframes[current].classList.remove("show");
      }
      current = index;
      if (rframes[current]) {
        rframes[current].classList.add("show");
      }
    }

    time.addEventListener("input", (ev) => {
      select(Number(time.value));
    });
    prev.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      time.stepDown();
      select(Number(time.value));
    });
    next.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      time.stepUp();
      select(Number(time.value));
    });
    select(0);

    return container;
  }

  function render(
    data: any,
    compact: boolean,
    context: string | null
  ): Element {
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
              h("div", { class: "value-lens-list-item" }, [
                render(x, true, "list"),
              ])
            )
          );

        case "table":
          return h("div", { class: "value-lens-table" }, [
            h(
              "div",
              { class: "value-lens-table-header" },
              data.header.map((x: any) =>
                h("div", { class: "value-lens-table-cell" }, [
                  render(x, true, "table"),
                ])
              )
            ),
            ...data.rows.map((x: any) =>
              h(
                "div",
                { class: "value-lens-table-row" },
                x.map((y: any) =>
                  h("div", { class: "value-lens-table-cell" }, [
                    render(y, true, "table"),
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
              h("div", { class: "value-lens-flow-item" }, [
                render(x, compact, "flow"),
              ])
            )
          );

        case "flex-row":
          return h(
            "div",
            {
              class: "value-lens-flex-row",
              style: { gap: compile_unit(data.gap) },
            },
            data.items.map((x: any) => render(x, compact, "flex-row"))
          );

        case "flex-column":
          return h(
            "div",
            {
              class: "value-lens-flex-column",
              style: { gap: compile_unit(data.gap) },
            },
            data.items.map((x: any) => render(x, compact, "flex-column"))
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
            data.items.map((x: any) => render(x, compact, "fixed-layout"))
          );

        case "position": {
          let style;
          if (context === "fixed-layout") {
            style = {
              top: compile_unit(data.position.y),
              left: compile_unit(data.position.x),
            };
          } else {
            console.warn(
              `Not making document absolute positioned, as it's not included in a fixed-layout context.`,
              {
                document: data,
                context: context,
              }
            );
            style = {
              position: "unset",
            };
          }
          return h(
            "div",
            {
              class: "value-lens-position",
              style: style,
            },
            [render(data.content, compact, "position")]
          );
        }

        case "scroll-view": {
          const scroll = compile_scroll_presentation(data.scroll);
          const bounds = compile_dimension(data.bounds);
          return h(
            "div",
            {
              class: "value-lens-scroll-view",
              style: {
                maxWidth: bounds.width ?? "auto",
                maxHeight: bounds.height ?? "auto",
                overflowX: scroll.horizontally,
                overflowY: scroll.vertically,
              },
            },
            [render(data.content, compact, "scroll-view")]
          );
        }

        case "format-text": {
          const font = compile_font_presentation(data.formatting);
          return h(
            "div",
            {
              class: "value-lens-format-text",
              style: {
                fontFamily: font.family,
                fontSize: font.size,
                color: font.colour,
                fontStyle: font.style,
                fontWeight: font.weight,
                textDecoration: font.decoration,
              },
            },
            [render(data.content, compact, context)]
          );
        }

        case "box": {
          const borders = compact_borders(compile_borders(data.borders));
          const background = compile_background(data.background);
          const padding = compile_padding(data.padding);
          const margin = compile_margin(data.margin);

          return h(
            "div",
            {
              class: "value-lens-box",
              style: {
                borderTop: borders.top || "none",
                borderRight: borders.right || "none",
                borderBottom: borders.bottom || "none",
                borderLeft: borders.left || "none",
                backgroundColor: background.colour ?? "unset",
                paddingLeft: padding.left ?? "0px",
                paddingRight: padding.right ?? "0px",
                paddingTop: padding.top ?? "0px",
                paddingBottom: padding.bottom ?? "0px",
                marginTop: margin.top ?? "0px",
                marginRight: margin.right ?? "0px",
                marginBottom: margin.bottom ?? "0px",
                marginLeft: margin.left ?? "0px",
              },
            },
            [render(data.content, compact, "box")]
          );
        }

        case "timeline": {
          return make_timeline(data.frames);
        }

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
              render(data.content, compact, "typed"),
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
                  render(data.compact, true, context),
                ]),
                h("div", { class: "value-lens-group-expanded" }, [
                  render(data.expanded, false, context),
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
            .map((x) => compile_point2d(x, compile_pixel_unit))
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
            .map((x) => compile_point2d(x, compile_pixel_unit))
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
    return ffi.box(
      h("div", { class: "value-lens-container" }, [render(data, false, null)])
    );
  });
};
