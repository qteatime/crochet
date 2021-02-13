type Content = Element | string;

export function h(
  tag: string,
  attributes: { [key: string]: any },
  ...contents: Content[]
) {
  const element = document.createElement(tag);
  for (const [k, v] of Object.entries(attributes)) {
    element.setAttribute(k, v);
  }
  for (const x of contents) {
    if (typeof x === "string") {
      element.appendChild(document.createTextNode(x));
    } else {
      element.appendChild(x);
    }
  }
  return element;
}
