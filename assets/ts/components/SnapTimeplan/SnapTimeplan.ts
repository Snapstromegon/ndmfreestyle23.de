import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Starter, Timeplan, TimeplanEntry } from "../../types";
import { repeat } from "lit/directives/repeat.js";
import "./SnapTimeplanEntry.js";
import { classMap } from "lit/directives/class-map.js";

const fixDates = (entry: TimeplanEntry): TimeplanEntry => {
  if (entry.earliest_start) {
    entry.earliest_start = new Date(entry.earliest_start);
  }
  entry.estimated_start = new Date(entry.estimated_start);
  entry.planned_start = new Date(entry.planned_start);
  return entry;
};

@customElement("snap-timeplan")
export default class SnapTimeplan extends LitElement {
  @property({ type: Array })
  public timeplan: Timeplan = [];

  updateInterval: number | undefined;

  @property({ type: Boolean })
  public expanded = false;

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

    #upcoming {
      display: none;
      flex-shrink: 1;
      overflow: auto;
    }

    #upcoming
      snap-timeplan-entry.event_type_act
      + snap-timeplan-entry.event_type_act::before {
      content: "";
      width: 100%;
      position: absolute;
      top: 0;
      height: 1px;
      background: #fff2;
    }

    #upcoming snap-timeplan-entry {
      position: relative;
    }

    :host-context(aside[expanded]) #upcoming {
      display: block;
    }

    :host-context(aside[expanded]) #header input[type="search"] {
      transform: translateY(0%);
    }

    :host-context(aside[expanded]) #header snap-timeplan-entry {
      transform: translateY(-100%);
    }

    #header {
      display: grid;
      grid-template-columns: 1fr auto;
      background: var(--color-blue-light);
      overflow: hidden;
    }

    #header snap-timeplan-entry {
      flex-grow: 1;
      grid-column: 1;
      grid-row: 1;
      transform: translateY(0%);
      transition: transform 0.5s;
    }

    #header input[type="search"] {
      grid-column: 1;
      grid-row: 1;
      padding: var(--s);
      border: none;
      background: var(--color-blue-light);
      transform: translateY(100%);
      transition: transform 0.5s;
      color: var(--text-color-sidebar);
      font-size: var(--l);
    }

    #header input[type="search"]::placeholder {
      color: #aaa;
    }

    #toggleExpand {
      transform: rotate(180deg);
      width: var(--xxxl);
      border: none;
      background: var(--color-blue-light);
      color: var(--text-color-sidebar);
    }

    @media (min-width: 60rem) {
      #upcoming {
        display: block;
      }

      #toggleExpand {
        display: none;
      }

      #header input[type="search"] {
        transform: translateY(0%);
      }
      #header snap-timeplan-entry {
        transform: translateY(-100%);
      }
    }
  `;

  public override connectedCallback(): void {
    super.connectedCallback();
    this.updateInterval = window.setInterval(() => {
      this.updateTimeplan();
    }, 10000);
    this.updateTimeplan();
  }

  async updateTimeplan() {
    const response = await fetch(
      "https://startlist.uberspace.ndmfreestyle23.de/upcoming/all"
    );
    const timeplan = await response.json();
    this.timeplan = timeplan.map(fixDates);
  }

  get allStarters(): Starter[] {
    const result = new Map<number, Starter>();
    for (const entry of this.timeplan) {
      for (const starter of entry.start?.starters || []) {
        result.set(starter.id, starter);
      }
    }
    return Array.from(result.values());
  }

  get allStarterNames(): string[] {
    return this.allStarters
      .map((starter) => `${starter.firstname} ${starter.lastname}`)
      .sort();
  }

  get allClubNames(): string[] {
    return [
      ...new Set(
        this.allStarters
          .map((starter) => starter.club)
          .filter((x) => x)
          .sort()
      ),
    ];
  }

  get allActNames(): string[] {
    return this.timeplan
      .filter((entry) => entry.event_type === "act" && entry.start)
      .map((entry) => entry.start?.name)
      .filter((x) => x)
      .sort() as string[];
  }

  get allTeamNames(): string[] {
    return [
      ...new Set(
        this.timeplan
          .filter((entry) => entry.event_type === "act" && entry.start)
          .map((entry) => entry.start?.teamname)
          .filter((x) => x)
          .sort() as string[]
      ).values(),
    ];
  }

  @property({ type: String })
  public search = "";

  entryMatchesSearch(entry: TimeplanEntry): boolean {
    if (!this.search) return true;
    const lowerSearch = this.search.toLocaleLowerCase();
    if (entry.event_type === "act") {
      // act search
      if (entry.label?.toLocaleLowerCase().includes(lowerSearch)) {
        return true;
      }
      if (entry.start_group?.toLocaleLowerCase().includes(lowerSearch)) {
        return true;
      }
      if (entry.start) {
        if (
          entry.start.event?.toLocaleLowerCase().includes(lowerSearch) ||
          entry.start.name?.toLocaleLowerCase().includes(lowerSearch) ||
          entry.start.category?.toLocaleLowerCase().includes(lowerSearch) ||
          entry.start.teamname?.toLocaleLowerCase().includes(lowerSearch)
        ) {
          return true;
        }
        for (const starter of entry.start.starters) {
          if (
            `${starter.firstname} ${starter.lastname}`
              ?.toLocaleLowerCase()
              .includes(lowerSearch) ||
            starter.club?.toLocaleLowerCase().includes(lowerSearch)
          ) {
            return true;
          }
        }
      }
    } else {
      return (entry.label || entry.event_name || "")
        .toLocaleLowerCase()
        .includes(lowerSearch);
    }
    return false;
  }

  get filteredTimeplan(): TimeplanEntry[] {
    console.log("Searching", this.search);
    if (!this.search) return this.timeplan;
    return this.timeplan.filter((entry) => this.entryMatchesSearch(entry));
  }

  public override render() {
    if (!this.timeplan.length) return html``;
    return html`<datalist id="searchComplete">
        <optgroup label="Starter">
          ${repeat(
            this.allStarterNames,
            (starter) => starter,
            (starter) => html`<option value="${starter}"></option>`
          )}
        </optgroup>
        <optgroup label="Kür">
          ${repeat(
            this.allActNames,
            (actName) => actName,
            (actName) => html`<option value="${actName}"></option>`
          )}
        </optgroup>
        <optgroup label="Verein">
          ${repeat(
            this.allClubNames,
            (clubName) => clubName,
            (clubName) => html`<option value="${clubName}"></option>`
          )}
        </optgroup>
        <optgroup label="Team">
          ${repeat(
            this.allTeamNames,
            (teamName) => teamName,
            (teamName) => html`<option value="${teamName}"></option>`
          )}
        </optgroup>
      </datalist>
      <div id="header">
        <snap-timeplan-entry
          class="no-background"
          .timeplanEntry=${this.timeplan?.[0]}
          .canStar=${false}
        ></snap-timeplan-entry>
        <input
          type="search"
          id="search"
          placeholder="Suche"
          list="searchComplete"
          @input=${(e: InputEvent) => {
            this.search = (e.target as HTMLInputElement).value;
          }}
        />
        <button
          @click=${this.toggleExpanded}
          id="toggleExpand"
          class="material-icon"
        >
          ${this.expanded ? "expand_less" : "expand_more"}
        </button>
      </div>
      <div id="upcoming">
        ${repeat(
          this.filteredTimeplan,
          (entry) => entry.order + (entry.start?.name || "") + entry.event_name,
          (entry) =>
            html`<snap-timeplan-entry
              class=${classMap({
                [`event_type_${entry.event_type}`]: true,
              })}
              .timeplanEntry=${entry}
            ></snap-timeplan-entry>`
        )}
      </div>`;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      document.querySelector("aside")?.setAttribute("expanded", "expanded");
    } else {
      document.querySelector("aside")?.removeAttribute("expanded");
    }
  }
}
