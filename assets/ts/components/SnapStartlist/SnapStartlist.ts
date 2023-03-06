import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./snap-startlist-start.js";

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
      font-family: 'Material Symbols Sharp';
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
      font-variation-settings: 'FILL' 1;
    }

    snap-startlist-start {
      border-bottom: var(--xxxs) solid var(--color-middle-gray);
      display: block;
    }

    snap-startlist-start:last-child {
      border-bottom: none;
    }

    #starts {
      overflow-y: auto;
      height: 100%;
      display: none;
      grid-area: content;
    }

    #preview {
      grid-area: content;
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

    #preview, #search {
      border-right: var(--xxxs) dotted var(--text-color-sidebar);
    }

    .startgroup-label {
      position: sticky;
      top: 0;
      padding: var(--s) var(--m);
      background: var(--color-blue);
      z-index: 1;
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

  @state() startlist;
  updateInterval?: number;

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
      return
    }
    return html`
      <header>
        <div id="preview">
          <snap-startlist-start shortened .start=${this.startlist?.[0]?.starts[0]}></snap-startlist-start>
        </div>
        <div id="search">
          <snap-ripple><input type="search" id="searchInput" placeholder="Suchen" aria-label="Start Suchen"></snap-ripple>
        </div>
        <button class="material-icon" id="expand-button" @click=${this.toggleExpanded}>expand_more</button>
      </header>
      <div id="starts">
        ${this.startlist?.map(startgroup => html`
          <div class="startgroup">
            <p class="startgroup-label">${startgroup.category}</p>
            ${startgroup.starts.map(start => html`<snap-startlist-start .start=${start}></snap-startlist-start>`)}
          </div>`)
        }
      </div>
    `;
  }

  toggleExpanded() {
    document.querySelector("aside")?.toggleAttribute("expanded");
  }

  async updateStartlist() {
    // const response = await fetch("/startlist.json");
    // const startlist = await response.json();
    // this.startlist = startlist;
  }
}