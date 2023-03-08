import "../SnapRouter/snap-link.js";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

let globalDeferredPrompt: Event;

@customElement("snap-pwa-install")
export default class SnapPWAInstall extends LitElement {
  static override styles = css`
    #wrapper {
      display: flex;
      background: var(--color-blue-light);
      border-radius: var(--s);
      opacity: 0;
      transition: opacity 0.3s;
      visibility: hidden;
    }

    #wrapper.visible {
      opacity: 1;
      visibility: visible;
    }

    button,
    snap-link {
      color: #fff;
      display: flex;
    }

    button {
      flex-grow: 1;
      background-color: transparent;
      border: none;
      padding: var(--s);
      font-size: var(--l);
      display: block;
      cursor: pointer;
    }

    snap-link {
      color: #fff;
    }

    .material-icon {
      font-family: "Material Symbols Sharp";
      font-weight: normal;
      font-style: normal;
      font-size: 24px; /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      font-variation-settings: "FILL" 1;
      padding: var(--m);
      border-left: var(--xxxs) dotted #fff;
    }
  `;

  @state() deferredPrompt?: any;

  constructor() {
    super();
    if (globalDeferredPrompt) {
      this.deferredPrompt = globalDeferredPrompt;
    } else {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        globalDeferredPrompt = e;
        this.requestUpdate();
      });
    }
  }

  override render() {
    return html`<div
      id="wrapper"
      class=${classMap({ visible: Boolean(this.deferredPrompt) })}
    >
      <button @click=${() => this.deferredPrompt.prompt()}>
        Zum Startbildschirm hinzufügen
      </button>
      <snap-link href="/install-pwa">
        <i class="material-icon">help</i>
      </snap-link>
    </div>`;
  }
}
