import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../SnapRouter/snap-link.js"

let globalDeferredPrompt: Event;

@customElement("snap-pwa-install")
export default class SnapPWAInstall extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      background: var(--color-blue-light);
      border-radius: var(--s);
    }

    button, snap-link {
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
      font-family: 'Material Symbols Sharp';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;  /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      font-variation-settings: 'FILL' 1;
      padding: var(--m);
      border-left: var(--xxxs) dotted #fff;
    }
  `;

  @state() deferredPrompt: any;

  constructor() {
    super();
    if (!globalDeferredPrompt) {
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        this.deferredPrompt = e;
        globalDeferredPrompt = e;
        this.requestUpdate();
      });
    } else {
      this.deferredPrompt = globalDeferredPrompt;
    }
  }

  override render() {
    if (!this.deferredPrompt) return;
    return html`<button @click=${() => this.deferredPrompt.prompt()}>Zum Startbildschirm hinzufügen</button><snap-link href="/install-pwa"><i class="material-icon">info</i></snap-link>`;
  }
}