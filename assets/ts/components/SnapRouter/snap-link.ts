import "../SnapUtils/snap-ripple";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import SnapRouted from "./snap-routed";

@customElement("snap-link")
export default class SnapLink extends LitElement {

  static override styles = css`
    a {
      display: block;
      color: inherit;
    }

    snap-ripple {
      display: block;
      width: 100%;
    }
  `;

  @property({ type: String }) href = "";
  @property({ type: String }) target = "";
  @property({ reflect: true, type: Boolean }) active = false;

  override firstUpdated(): void {
    const routed = document.querySelector("snap-routed") as SnapRouted;
    if (routed) {
      this.active = routed.isCurrentUrl(this.href);
      this.requestUpdate("active", false);
    }
  }

  override render() {
    return html`
      <snap-ripple><a href="${this.href}" target=${this.target} @click=${this.clicked} part="a"><slot></slot></a></snap-ripple>
    `;
  }

  clicked(e: Event) {
    if (this.target === "_blank") return;
    e.preventDefault();
    const routed = document.querySelector("snap-routed") as SnapRouted;
    routed?.go(this.href);
  }
}
