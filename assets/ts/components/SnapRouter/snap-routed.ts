import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("snap-routed")
export default class SnapRouted extends LitElement {
  currentUrl?: string;

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (window.navigation) {
      window.navigation.addEventListener("navigate", (e: CustomEvent) => {
        this.navigate(e);
      });
    }
  }

  navigate(event) {
    if (!event.canIntercept) return;

    document.querySelector("aside")?.removeAttribute("expanded");
    const url = new URL(event.destination.url);
    event.intercept({
      handler: async () => {
        this.updateLinks();
        const resp = await fetch(`/pages/${url.pathname}`.replaceAll("//", "/"));
        const newHTML = await resp.text();
        this.updateView(newHTML);
      }
    });
  }

  updateLinks() {
    for (const link of [...document.querySelectorAll("a")] as HTMLAnchorElement[]) {
      if (this.isCurrentUrl(link.href)) {
        link.setAttribute("active", "");
      } else {
        link.removeAttribute("active");
      }
    }
  }

  isCurrentUrl(url: string) {
    return window.location.href === new URL(url, window.location.href).href;
  }

  updateView(newHTML: string) {
    if (!document.startViewTransition) {
      this.innerHTML = newHTML;
      return;
    }

    return document.startViewTransition(() => {
      this.innerHTML = newHTML;
    });
  }
}
