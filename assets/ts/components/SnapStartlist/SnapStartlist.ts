import "../SnapUtils/snap-ripple.js";
import "./snap-startlist-start.js";
import "./snap-startslist.js";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { Startlist } from "../../types.js";

@customElement("snap-startlist")
export default class SnapStartlist extends LitElement {
  static override styles = css`
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    :host {
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr;
      grid-template-areas: "header" "content";
    }

    :host([hidden]) {
      display: none;
    }

    header {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-areas: "content expand-button";
      background: var(--color-blue-light);
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
    }

    #starts {
      overflow-y: auto;
      height: 100%;
      display: none;
      grid-area: content;
      overscroll-behavior: contain;
    }

    #preview {
      grid-area: content;
      transform: translateY(0%);
      transition: transform 0.3s;
    }

    #preview snap-startlist-start {
      flex-shrink: 1;
    }

    #search {
      grid-area: content;
      height: 100%;
      display: grid;
      align-items: center;
      transform: translateY(100%);
      transition: transform 0.3s;
    }

    #search snap-ripple {
      display: block;
    }

    #searchInput {
      appearance: none;
      width: 100%;
      height: 100%;
      background: none;
      border: none;
      padding: var(--m);
      color: var(--text-color-sidebar);
      font-size: var(--l);
    }

    #searchInput::placeholder {
      color: var(--text-color-sidebar);
    }

    #expand-button {
      border: none;
      background: none;
      grid-area: expand-button;
      transform: rotate(180deg);
      padding: var(--m);
      transition: transform 0.3s;
      color: var(--text-color-sidebar);
    }

    #preview,
    #search {
      border-right: var(--xxxs) dotted var(--text-color-sidebar);
    }

    :host-context(aside[expanded]) #expand-button {
      transform: none;
    }

    :host-context(aside[expanded]) #preview {
      transform: translateY(-100%);
      height: 0;
      overflow: hidden;
    }

    :host-context(aside[expanded]) #search {
      transform: translateY(0%);
    }

    :host-context(aside[expanded]) #starts {
      display: block;
    }

    @media (min-width: 60rem) {
      #starts {
        display: block;
      }

      #preview {
        display: none;
      }

      #search {
        transform: translateY(0%);
        border: none;
      }

      #expand-button {
        display: none;
      }
    }
  `;

  @state() startlist?: Startlist;
  updateInterval?: ReturnType<typeof setInterval>;

  override connectedCallback() {
    super.connectedCallback();
    this.updateInterval = setInterval(() => this.updateStartlist(), 10000);
    this.updateStartlist();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.updateInterval);
  }

  override render() {
    if (!this.startlist?.length) {
      return;
    }
    return html`
      <header>
        <div id="preview" @click=${this.toggleExpanded}>
          <snap-startlist-start
            shortened
            .start=${this.startlist?.[0]?.starts[0]}
          ></snap-startlist-start>
        </div>
        <div id="search">
          <snap-ripple
            ><input
              type="search"
              list="search_options"
              id="searchInput"
              placeholder="Suchen"
              aria-label="Start Suchen"
          /></snap-ripple>
        </div>
        <button
          class="material-icon"
          id="expand-button"
          @click=${this.toggleExpanded}
        >
          expand_more
        </button>
      </header>
      <snap-startslist
        id="starts"
        .startlist=${this.startlist}
      ></snap-startslist>
      ${this.renderDataList()}
    `;
  }

  renderDataList() {
    return html`
      <datalist id="search_options">
        <optgroup label="Starter">
          ${repeat(
            this.starterNames,
            (starter) => html`<option value="${starter}"></option>`
          )}
        </optgroup>
        <optgroup label="Kürname">
          ${repeat(this.startlist || [], (startgroup) =>
            repeat(
              startgroup.starts,
              (start) => html`<option value="${start.name}"></option>`
            )
          )}
        </optgroup>
        <optgroup label="Gruppenname"></optgroup>
      </datalist>
    `;
  }

  get starterNames() {
    return [
      ...new Set(
        this.startlist
          ?.flatMap((startgroup) => startgroup.starts)
          .flatMap((start) => start.starters)
          .map((starter) => starter.name) || []
      ),
    ];
  }

  toggleExpanded() {
    document.querySelector("aside")?.toggleAttribute("expanded");
  }

  async updateStartlist() {
    const response = await fetch("/startlist.json");
    const startlist = await response.json();
    this.startlist = startlist;
  }
}
