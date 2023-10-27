import "./SnapTimeplanEntry.js";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Starter, Timeplan, TimeplanEntry } from "../../types";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";

const fixDates = (entry: TimeplanEntry): TimeplanEntry => {
  if (entry.earliest_start) {
    entry.earliest_start = new Date(entry.earliest_start); // eslint-disable-line camelcase
  }
  entry.estimated_start = new Date(entry.estimated_start); // eslint-disable-line camelcase
  entry.planned_start = new Date(entry.planned_start); // eslint-disable-line camelcase
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

    :host([expanded]) #upcoming {
      display: block;
    }

    :host([expanded]) #header input[type="search"] {
      transform: translateY(0%);
    }

    :host([expanded]) #header snap-timeplan-entry {
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
      this.updateTimeplan().catch(console.error);
    }, 10000);
    this.updateTimeplan().catch(console.error);
  }

  async updateTimeplan() {
    const response = await fetch(
      "https://startlist.uberspace.ndmfreestyle23.de/upcoming/allToday"
    );
    const timeplan = await response.json() as TimeplanEntry[];
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

  stringsMatchSearch(search: string, strings: (string | undefined)[]): boolean {
    const lowerSearch = search.toLocaleLowerCase();
    return (strings.filter(x => x) as string[]).some((string) => string.toLocaleLowerCase().includes(lowerSearch));
  }

  entryMatchesSearch(entry: TimeplanEntry): boolean {
    if (!this.search) return true;
    if (entry.event_type === "act") {
      // act search
      if (this.stringsMatchSearch(this.search, [
        entry.label,
        entry.start_group,
        entry.start?.name,
        entry.start?.category,
        entry.start?.teamname,
        ...entry.start?.starters.map((starter) => [`${starter.firstname} ${starter.lastname}`, starter.club]).flat() || []
      ])) {
        return true;
      }
    } else {
      return this.stringsMatchSearch(this.search, [entry.label, entry.event_name]);
    }
    return false;
  }

  get filteredTimeplan(): TimeplanEntry[] {
    console.log("Searching", this.search);
    if (!this.search) return this.timeplan;
    return this.timeplan.filter((entry) => this.entryMatchesSearch(entry));
  }

  // eslint-disable-next-line max-lines-per-function
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
          @click=${() => this.toggleExpanded()}
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
      this.setAttribute("expanded", "expanded");
    } else {
      document.querySelector("aside")?.removeAttribute("expanded");
      this.removeAttribute("expanded");
    }
  }
}
