import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TimeplanEntry } from "../../types";
import { when } from "lit/directives/when.js";
import { classMap } from "lit/directives/class-map.js";

const EVENT_SHORT_MAP: { [key: string]: string } = {
  Einzelkür: "E",
  Paarkür: "P",
  Kleingruppe: "KG",
  "Kader Kleingruppe": "KG",
  Großgruppe: "GG",
  "Kader Großgruppe": "GG",
};

@customElement("snap-timeplan-entry")
export default class SnapTimeplanEntry extends LitElement {
  @property({ type: Object })
  public timeplanEntry?: TimeplanEntry;

  @property({ type: Boolean })
  public canStar = true;

  static override styles = css`
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
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

    #wrapper {
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr auto auto;
      grid-template-areas: "start_name time star" "starter group star";
      gap: var(--xxxs) var(--s);
      padding: var(--s);
    }

    #starter {
      grid-area: starter;
    }

    #name {
      grid-area: start_name;
      font-weight: bold;
      font-size: var(--l);
    }

    #time {
      grid-area: time;
      text-align: right;
    }

    #group {
      grid-area: group;
      text-align: right;
    }

    #star,
    #star-fake {
      grid-area: star;
      border: none;
      background: none;
      width: var(--xxl);
    }
    #star {
      cursor: pointer;
      color: #fff4;
    }

    #star.starred {
      color: var(--color-yellow);
    }

    .event_type_act {
      background: var(--color-background-secondary);
    }

    .event_type_ceremony {
      background: var(--color-yellow);
      color: var(--text-color);
    }

    .event_type_break {
      background: var(--color-blue);
    }

    :host(.no-background) #wrapper {
      background: none;
    }
  `;

  get starters(): string {
    if (this.timeplanEntry?.event_type !== "act") {
      return "";
    }
    if (!this.timeplanEntry.start) {
      return "";
    }
    const starters = this.timeplanEntry.start.starters;
    if (starters.length > 2) {
      return this.timeplanEntry.start.teamname || "";
    }
    return starters
      .map((starter) => `${starter.firstname} ${starter.lastname}`)
      .join(" und ");
  }

  get name(): string {
    if (this.timeplanEntry?.event_type !== "act") {
      return this.timeplanEntry?.event_name || "";
    }
    if (!this.timeplanEntry.start) {
      return this.timeplanEntry.label;
    }
    return this.timeplanEntry.start.name;
  }

  get time(): string {
    const dateFormatter = new Intl.DateTimeFormat("de-DE", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    });
    console.log(this.timeplanEntry?.estimated_start);
    return dateFormatter.format(
      this.timeplanEntry?.estimated_start || new Date()
    );
  }

  get event_type(): string {
    if (this.timeplanEntry?.event_type === "act") {
      return "act";
    }
    if (this.timeplanEntry?.event_type.startsWith("break:ceremony")) {
      return "ceremony";
    }
    if (this.timeplanEntry?.event_type.startsWith("break")) {
      return "break";
    }
    return "unknown";
  }

  get group(): string {
    if (this.timeplanEntry?.event_type !== "act") {
      return "";
    }
    if (!this.timeplanEntry.start) {
      return this.timeplanEntry.start_group;
    }
    return (
      EVENT_SHORT_MAP[this.timeplanEntry.start.event] +
      " " +
      this.timeplanEntry.start.category
    );
  }

  get isStarred(): boolean {
    if (!this.timeplanEntry) return false;
    const starred = JSON.parse(window.localStorage.getItem("starred") || "[]");
    return starred.includes(this.timeplanEntry.order);
  }

  public override render() {
    return html`
      <div
        id="wrapper"
        class=${classMap({
          ["event_type_" + this.event_type]: true,
        })}
      >
        <p id="starter">${this.starters}</p>
        <p id="name">${this.name}</p>
        <p id="time">${this.time}</p>
        <p id="group">${this.group}</p>
        ${when(
          this.canStar && this.timeplanEntry?.event_type === "act",
          () =>
            html`<button
              id="star"
              class="material-icon ${classMap({ starred: this.isStarred })}"
              @click=${this.star}
            >
              star
            </button>`,
          () => (this.canStar ? html`<div id="star-fake"></div>` : "")
        )}
      </div>
    `;
  }

  star() {
    if (!this.timeplanEntry) return;
    const starred = JSON.parse(window.localStorage.getItem("starred") || "[]");
    if (this.isStarred) {
      starred.splice(starred.indexOf(this.timeplanEntry.order), 1);
    } else {
      starred.push(this.timeplanEntry.order);
    }
    window.localStorage.setItem("starred", JSON.stringify(starred));
    this.requestUpdate();
  }
}
