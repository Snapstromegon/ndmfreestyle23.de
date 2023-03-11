import { customElement, query } from "lit/decorators.js";
import { html, LitElement } from "lit";
import styles from "lightning-lit:./snap-ripple.css";

@customElement("snap-ripple")
export default class SnapRipple extends LitElement {
  static override styles = styles;

  @query("#ripple") rippleDiv?: HTMLDivElement;

  override render() {
    return html`
      <div id="wrapper" @click=${this.ripple}><slot></slot><div id="ripple"></div></div>
    `;
  }

  ripple(e: MouseEvent) {
    if (!this.rippleDiv) return;
    const clientRect = this.getBoundingClientRect();

    const maxDX = Math.max(
      e.clientX - clientRect.left,
      clientRect.left + clientRect.width - e.clientX
    );
    const maxDY = Math.max(
      e.clientY - clientRect.top,
      clientRect.top + clientRect.height - e.clientY
    );

    const size = Math.sqrt((maxDX ** 2) + (maxDY ** 2)) * 2;
    this.rippleDiv.style.width = `${size}px`;
    this.rippleDiv.style.height = `${size}px`;
    this.rippleDiv.style.left = `${e.clientX - clientRect.x}px`;
    this.rippleDiv.style.top = `${e.clientY - clientRect.y}px`;
    this.rippleDiv.animate(
      [
        {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(0)",
        },
        {
          opacity: 0,
          transform: "translate(-50%, -50%) scale(1)",
        }
      ],
      {
        duration: 300,
        easing: "ease-out",
        fill: "forwards",
      }
    );
  }
}
