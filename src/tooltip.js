import { css } from "./utils";

const template = ({ title, items }) => `
  <div class="tooltip-title">${title}</div>
  <ul class="tooltip-list">
    ${items
      .map(({ colorX, colorY, x, y }) => {
        return `<li class="tooltip-list-item">
        <div class="value" style="color: ${colorX}">X: ${x}</div>
        <div class="value" style="color: ${colorY}">Y: ${y}</div>
        </li>`;
      })
      .join("\n")}
  </ul>
`;

export function tooltip(el) {
  const clear = () => (el.innerHTML = "");
  return {
    show({ left, top }, data) {
      const { height, width } = el.getBoundingClientRect();
      clear();
      css(el, {
        display: "block",
        top: top - height + 200 + "px",
        left: left + width + 500 + "px",
      });
      el.insertAdjacentHTML("afterbegin", template(data));
    },
    hide() {
      css(el, { display: "none" });
    },
  };
}
