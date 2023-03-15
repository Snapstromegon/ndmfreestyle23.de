import SnapRipple from "./snap-ripple.js";

declare global {
  export interface HTMLElementTagNameMap {
    "snap-ripple": SnapRipple;
  }
}
