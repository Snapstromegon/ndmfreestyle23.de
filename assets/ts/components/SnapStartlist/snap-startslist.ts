import "./snap-startlist-start.js";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { Startlist } from "../../types";

@customElement("snap-startslist")
export default class SnapStartslist extends LitElement {
  static override styles = css`
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    .startgroup-label {
      position: sticky;
      top: 0;
      padding: var(--s) var(--m);
      background: var(--color-blue);
      z-index: 1;
    }

    snap-startlist-start {
      border-bottom: var(--xxxs) solid var(--color-middle-gray);
      display: block;
    }

    snap-startlist-start:last-child {
      border-bottom: none;
    }
  `;

  @property({ attribute: false }) startlist?: Startlist;

  override render() {
    return html`${repeat(
      this.startlist || [],
      (startgroup) => html` <div class="startgroup">
        <p class="startgroup-label">${startgroup.category}</p>
        ${repeat(
          startgroup.starts,
          (start) =>
            html`<snap-startlist-start .start=${start}></snap-startlist-start>`
        )}
      </div>`
    )}`;
  }
}
