import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import SnapLink from "./snap-link";

@customElement("snap-routed")
export default class SnapRouted extends LitElement {
  currentUrl?: string;

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", (e) => {
      this.navigate((e.state || { url: "/" }).url);
    });
    this.navigate(window.location.pathname, true);
  }

  async navigate(url: string, force: boolean = false): Promise<void> {
    document.querySelector("aside")?.removeAttribute("expanded");
    if (this.currentUrl === url && !force) return;

    this.currentUrl = url;
    this.updateLinks();

    const resp = await fetch(`/pages/${url}`.replaceAll("//", "/"));
    const newHTML = await resp.text();

    if (this.is404(newHTML)) return this.navigate("/404");

    this.updateView(newHTML);
  }

  is404(rawHtml: string) {
    return rawHtml.includes("__MAGIC_INDEX_VALUE__");
  }

  go(url: string) {
    history.pushState({ url }, url, url);
    return this.navigate(url);
  }

  updateLinks() {
    for (const link of [...document.querySelectorAll("snap-link")] as SnapLink[]) {
      link.active = this.isCurrentUrl(link.href);
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

    document.startViewTransition(() => {
      this.innerHTML = newHTML;
    });
  }
}
