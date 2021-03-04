export type Style_t = {
  id?: string;
  classes?: string[];
};

export class HTMLStyle {
  constructor(readonly style: Style_t) {}

  apply(element: HTMLElement) {
    element.setAttribute("id", this.style.id ?? "");
    element.setAttribute("class", (this.style.classes ?? []).join(" "));
  }
}
