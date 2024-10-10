import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('initialize-create-or-import')
export class CreateOrImportPage extends LitElement {
  render() {
    return html` 
      <div class="wrapper">
        <p class="title">XXX Wallet</p>
        <p class="subtitle">Explore the new wolrd of blockchain</p>

        <button class="btn">Create New Wallet</button>
        <button class="btn">Import Existed Wallet</button>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      margin: 24px auto;
      width: 360px;
      height: 600px;
      border-radius: 32px;
      background-color: rgb(27, 28, 30);
      overflow: hidden;
    }

    .title {
      margin-top: 60px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }

    .subtitle {
      margin-top: 2px;
      margin-bottom: 260px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      opacity: 0.6;
    }

    .btn {
      all: unset;
      width: 280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      border-radius: 9999px;
      border-width: 1px;
      border-color: rgba(255, 255, 255, 0.03);
      border-style: solid;
      background-color: rgb(36, 37, 41);
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      outline: none;
      cursor: pointer;
    }

    .btn:hover {
      background-color: rgb(46, 47, 51);
    }

    .btn + .btn {
      margin-top: 24px;
    }

    p {
      margin: 0;
      padding: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'initialize-create-or-import': CreateOrImportPage;
  }

  namespace JSX {
    interface IntrinsicElements {
      'initialize-create-or-import': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['initialize-create-or-import']>,
        HTMLElementTagNameMap['initialize-create-or-import']
      >;
    }
  }
}
