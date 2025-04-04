import {html, css, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.0/core/lit-core.min.js';

export class SimpleGreeting extends LitElement {
  static get styles() {
    return css`p { color: blue }`;
  }

  static get properties() {
    return {
      name: {type: String}
    }
  }

  constructor() {
    super();
    this.name = 'Somebody';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
