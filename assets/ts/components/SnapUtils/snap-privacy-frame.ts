import "./snap-privacy-frame-origins.js";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("snap-privacy-frame")
export default class SnapPrivacyFrame extends LitElement {
  static override styles = css`
    :host {
      display: block;
      background-color: var(--color-background-nuanced);
    }

    :host([hidden]) {
      display: none;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    button {
      display: flex;
      flex-direction: column;
      place-content: center;
      align-items: center;
      gap: var(--s);
      height: 100%;
      width: 100%;
      border: none;
      background: none;
      appearance: none;
      font-size: var(--m);
      cursor: pointer;
      --dot-size: 0.05rem;
      --dot-space: var(--s);
      background: radial-gradient(
          circle at center,
          var(--color-background-nuanced) 66%,
          transparent
        ),
        radial-gradient(
          circle at center,
          var(--color-blue-light) var(--dot-size),
          transparent var(--dot-size)
        ),
        var(--color-background-nuanced);
      background-size: cover, var(--dot-space) var(--dot-space), cover;
      background-position: center center;
    }

    button::before {
      content: "web_asset_off";
      font-family: "Material Symbols Sharp";
      font-weight: normal;
      font-style: normal;
      font-size: var(--xxl); /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      font-variation-settings: "FILL" 1;
      color: var(--color-red);
    }

    #origin {
      font-weight: bold;
    }
  `;

  @property({ type: String }) src?: string;

  override render() {
    if (this.isFrameAllowed) {
      return html`
        <iframe part="iframe" loading="lazy" src=${this.src || ""}></iframe>
      `;
    }
    const { hostname } = new URL(this.src || "", window.location.href);
    return html`<button @click=${this.allowOrigin}>
      Klicken um externe Inhalte von
      <span id="origin">${hostname}</span> anzuzeigen.
    </button> `;
  }

  get isFrameAllowed() {
    return this.allowedOrigins.includes(new URL(this.src || "").origin);
  }

  get allowedOrigins() {
    return JSON.parse(
      window.localStorage.getItem("snap-privacy-frame-origins") || "[]"
    );
  }

  allowOrigin() {
    const origins = this.allowedOrigins;
    origins.push(new URL(this.src || "").origin);
    window.localStorage.setItem(
      "snap-privacy-frame-origins",
      JSON.stringify(origins)
    );
    this.requestUpdate();
  }
}
