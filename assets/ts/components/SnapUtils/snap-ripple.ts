import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement('snap-ripple')
export default class SnapRipple extends LitElement {
  static override styles = css`
    :host() {
      display: contents;
    }
    #wrapper {
      position: relative;
      overflow: hidden;
      height: 100%;
    }
    #ripple {
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      position: absolute;
      z-index: 1;
      pointer-events: none;
    }

  `;

  @query('#ripple') rippleDiv?: HTMLDivElement;

  override render() {
    return html`
      <div id="wrapper" @click=${this.ripple}><slot></slot><div id="ripple"></div></div>
    `;
  }

  ripple(e: MouseEvent) {
    if(!this.rippleDiv) return;
    const clientRect = this.getBoundingClientRect();

    const maxDX = Math.max(
      e.clientX - clientRect.left,
      clientRect.left + clientRect.width - e.clientX
    );
    const maxDY = Math.max(
      e.clientY - clientRect.top,
      clientRect.top + clientRect.height - e.clientY
    );

    const size = Math.sqrt(maxDX ** 2 + maxDY ** 2) * 2;
    this.rippleDiv.style.width = size + 'px';
    this.rippleDiv.style.height = size + 'px';
    this.rippleDiv.style.left = e.clientX - clientRect.x + 'px';
    this.rippleDiv.style.top = e.clientY - clientRect.y + 'px';
    const rippleAnimation = this.rippleDiv.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
      ],
      {
        fill: 'forwards',
        easing: 'ease-out',
        duration: 300
      }
    );

    // rippleAnimation.onfinish = () => this._wrapper.removeChild(ripple);
  }
}
