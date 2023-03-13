import { customElement, query } from "lit/decorators.js";
import { html, LitElement } from "lit";
import styles from "lightning-lit:./snap-ripple.css";

@customElement("snap-ripple")
export default class SnapRipple extends LitElement {
  static override styles = styles;

  @query("#ripple") rippleDiv?: HTMLDivElement;
  @query("#wrapper") wrapper?: HTMLDivElement;

  override render() {
    return html`
      <div id="wrapper" @click=${this.ripple}><slot></slot><div id="ripple"></div></div>
    `;
  }

  ripple(e: MouseEvent) {
    if (!this.rippleDiv || !this.wrapper) return;

    const size = this.getRippleSize(e.clientX, e.clientY);
    this.setRippleProps(e.clientX, e.clientY, size);
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

  getRippleSize(x: number, y: number) {
    if (!this.wrapper) return 0;
    const clientRect = this.wrapper.getBoundingClientRect();

    const maxDX = Math.max(
      x - clientRect.left,
      clientRect.left + clientRect.width - x
    );
    const maxDY = Math.max(
      y - clientRect.top,
      clientRect.top + clientRect.height - y
    );

    return Math.sqrt((maxDX ** 2) + (maxDY ** 2)) * 2;
  }

  setRippleProps(x: number, y: number, size: number) {
    if (!this.wrapper || !this.rippleDiv) return;
    const clientRect = this.wrapper.getBoundingClientRect();
    this.rippleDiv.style.width = `${size}px`;
    this.rippleDiv.style.height = `${size}px`;
    this.rippleDiv.style.left = `${x - clientRect.x}px`;
    this.rippleDiv.style.top = `${y - clientRect.y}px`;
  }
}
