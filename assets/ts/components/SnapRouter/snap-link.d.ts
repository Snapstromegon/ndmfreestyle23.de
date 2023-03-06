import SnapLink from "./snap-link.js";

declare global {
  interface HTMLElementTagNameMap {
    "snap-link": SnapLink;
  }
}
