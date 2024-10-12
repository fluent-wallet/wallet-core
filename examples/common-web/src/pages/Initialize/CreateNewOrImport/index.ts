import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const transitions = {
  'en': {
    'title': 'XXX Wallet',
    'subtitle': 'Explore the new wolrd of blockchain',
    'create-new-wallet': 'Create New Wallet',
    'import-existed-wallet': 'Import Existed Wallet',
  },
  'zh': {
    'title': 'XXX Wallet',
    'subtitle': '探索区块链的新世界',
    'create-new-wallet': '创建新钱包',
    'import-existed-wallet': '导入现有钱包',
  },
} as const;

const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('initialize-create-or-import')
export class CreateOrImport extends LitElement {
  private handleClickCreateNew(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickCreateNew', { bubbles: true, composed: true }));
  }

  private handleClickImportExist(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickImportExist', { bubbles: true, composed: true }));
  }
  render() {
    return html` 
      <div class="wrapper">
        <p class="title">${i18n['title']}</p>
        <p class="subtitle">${i18n['subtitle']}</p>

        <button class="btn" @click="${this.handleClickCreateNew}">
          ${i18n['create-new-wallet']}
        </button>
        <button class="btn" @click="${this.handleClickImportExist}">
          ${i18n['import-existed-wallet']}
        </button>
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
      user-select: none;
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
    'initialize-create-or-import': CreateOrImport;
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