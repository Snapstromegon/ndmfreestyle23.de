import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import SnapLink from "./snap-link";

@customElement("snap-routed")
export default class SnapRouted extends LitElement {

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", (e) => {
      this.navigate((e.state || { url: '/' }).url);
    });
    this.navigate(window.location.pathname);
  }

  async navigate(url: string) {
    if(history.state.url === url) return;
    
    const resp = await fetch(`/pages/${url}`);
    const text = await resp.text();

    if(text.includes("__MAGIC_INDEX_VALUE__")) {
      await this.navigate('/404');
      return;
    }

    this.innerHTML = text;
    this.updateLinks();
  }

  async go(url: string) {
    history.pushState({ url }, url, url);
    return this.navigate(url);
  }

  updateLinks() {
    (document.querySelectorAll('snap-link') as NodeListOf<SnapLink>).forEach((link) => {
      const url = new URL(link.href, window.location.href);
      link.active = window.location.href == url.href;
    });
  }
}