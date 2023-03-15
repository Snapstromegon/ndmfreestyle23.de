import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("snap-privacy-frame-origins")
export default class SnapPrivacyFrameOrigins extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    button.material-icon {
      background: none;
      border: none;
      appearance: none;
      font-family: "Material Symbols Sharp";
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      font-variation-settings: "FILL" 1;
      cursor: pointer;
    }

    button.material-icon:hover {
      color: var(--color-red);
    }

    li {
      display: flex;
    }

    #reset-all {
      appearance: none;
      background: none;
      border: var(--xxxs) solid var(--color-red);
      color: var(--color-red);
      border-radius: var(--s);
      padding: var(--s);
    }

    #reset-all:hover {
      background-color: var(--color-red);
      color: var(--text-color-sidebar);
    }
  `;

  @property({ type: String }) src?: string;

  override render() {
    if (this.allowedOrigins.length === 0) return html`<p>Es sind keine Inhalte von externen Anbietern aktiviert.</p>`;
    return html`
      <button id="reset-all" @click=${() => this.resetAllowedOrigins()}>
        Alle externen Inhalte deaktivieren
      </button>
      <p>Externe Inhalte von diesen Anbietern sind aktiviert:</p>
      <ul>
        ${repeat(
          this.allowedOrigins,
          (origin) => origin,
          (origin) =>
            html`<li>
              <button class="material-icon" @click=${() => this.removeOrigin(origin)}>delete</button> ${origin}
            </li>`
        )}
      </ul>
    `;
  }

  get allowedOrigins(): string[] {
    return JSON.parse(
      window.localStorage.getItem("snap-privacy-frame-origins") ?? "[]"
    ) as string[];
  }

  removeOrigin(origin: string) {
    const origins = this.allowedOrigins.filter((o) => o !== origin);
    window.localStorage.setItem(
      "snap-privacy-frame-origins",
      JSON.stringify(origins)
    );
    this.requestUpdate();
  }

  resetAllowedOrigins() {
    window.localStorage.removeItem("snap-privacy-frame-origins");
    this.requestUpdate();
  }
}
