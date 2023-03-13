import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { Start } from "../../types";
import { when } from "lit/directives/when.js";

@customElement("snap-startlist-start")
export default class SnapStartlistStart extends LitElement {

  static override styles = css`
    :host {
      line-height: 1.2;
    }

    #wrapper {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto max-content;
      grid-template-areas: "time category" "actName actName" "names names";
      gap: 0 var(--s);
      padding: var(--s) var(--m);
    }

    #face {
      grid-area: face;
      border-radius: 50%;
      width: var(--xxl);
      height: var(--xxl);
      object-fit: cover;
      border: var(--xxxs) solid var(--text-color-sidebar);
      align-self: center;
    }

    #actName {
      grid-area: actName;
      font-weight: bold;
      font-size: var(--l);
    }

    #names {
      grid-area: names;
      list-style: none;
      padding: 0;
      margin: 0;
      column-width: 12rem;
      display: flex;
      gap: 0 var(--s);
      flex-wrap: wrap;
    }

    #time {
      grid-area: time;
    }

    #category {
      grid-area: category;
    }

    #time, #category {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .number {
      font-variant-numeric: tabular-nums;
    }

    .number::before {
      content: "#";
    }

    :host([shortened]) #actName {
      overflow: hidden; 
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  `;

  @property({ attribute: false }) start?: Start;

  override render() {
    if (!this.start) return html``;
    const starters = this.start.starters.sort((a, b) => a.number - b.number);
    return html`
      <div id="wrapper">
        <span id="actName">${this.start.name}</span>
        <ul id="names">${when(
      ["einzel", "paar"].some(type => type === this.start?.type),
      () => repeat(
        starters,
        starter => starter.number,
        starter => html`
              <li><span class="number">${starter.number}</span> <span class="name">${starter.name}</span></li>`
      )
    )}</ul>
        <span id="time">${this.start.time}</span>
        <span id="category">${this.start.category}</span>
      </div>
    `;
  }
}
