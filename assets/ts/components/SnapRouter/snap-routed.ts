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
      window.navigation.addEventListener("navigate", (e) => {
        this.navigate(e);
      });
    }
  }

  navigate(event: NavigateEvent) {
    if (!event.canIntercept) return;

    document.querySelector("aside")?.removeAttribute("expanded");
    const url = new URL(event.destination.url);
    if (url.href.endsWith("/") || url.href.endsWith(".html")) {
      event.intercept({
        handler: async () => {
          this.updateLinks();
          const resp = await fetch(
            `/pages/${url.pathname}`.replaceAll("//", "/")
          );
          if (resp.ok) {
            const newHTML = await resp.text();
            this.updateView(newHTML);
          } else if (resp.status === 404) {
            const newHTML = await (await fetch("/pages/404.html")).text();
            this.updateView(newHTML);
          } else {
            this.updateView("Ein Fehler ist aufgetreten.");
          }
        },
      });
    }
  }

  updateLinks() {
    for (const link of [...document.querySelectorAll("a"),] as HTMLAnchorElement[]) {
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
