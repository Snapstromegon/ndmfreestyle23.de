import { LitElement, html } from "lit";
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
      this.navigate((e.state || { url: '/' }).url);
    });
    this.navigate(window.location.pathname, true);
  }

  async navigate(url: string, force: boolean = false) {
    if (this.currentUrl == url && !force) {
      console.log("skipping navigate to", url, this.isCurrentUrl(url), force);
      return;
    }
    this.currentUrl = url;
    this.updateLinks();

    const resp = await fetch(`/pages/${url}`);
    const newHTML = await resp.text();

    if (newHTML.includes("__MAGIC_INDEX_VALUE__")) {
      await this.navigate('/404');
      return;
    }

    this.updateView(newHTML);
  }

  async go(url: string) {
    history.pushState({ url }, url, url);
    return this.navigate(url);
  }

  updateLinks() {
    for (const link of document.querySelectorAll('snap-link') as NodeListOf<SnapLink>) {
      link.active = this.isCurrentUrl(link.href);
    }
  }

  isCurrentUrl(url: string) {
    return window.location.href == new URL(url, window.location.href).href;
  }

  updateView(newHTML: string) {
    if (!document.startViewTransition) {
      this.innerHTML = newHTML;
      return;
    }

    document.startViewTransition(() => this.innerHTML = newHTML);
  }
}