import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const transitions = {
  'en': {
    title: 'Backup',
    notice: 'Notice:',
    tip1: `If you lose your seed phrase or private key, you won’t be able to recover you wallet.`,
    tip2: `Obtaining seed phrase or private key means owning all assets.`,
    tip3: `Please protect them carefully`,
    next: 'Next',
  },
  'zh': {
    title: '备份',
    notice: '注意:',
    tip1: `如果您丢失了助记词或私钥，将无法恢复您的钱包。`,
    tip2: `获取助记词或私钥意味着拥有所有资产。`,
    tip3: `请妥善保管。`,
    next: '下一步',
  },
} as const;

const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('backup-lose-tip')
export class LoseTip extends LitElement {
  private handleClickNextButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickNextButton', { bubbles: true, composed: true }));
  }

  render() {
    return html` 
      <div class="wrapper">
        <p class="title">${i18n.title}</p>
        <p class="notice">${i18n.notice}</p>
        <p class="tip">${i18n.tip1}</p>
        <p class="tip">${i18n.tip2}</p>
        <p class="tip">${i18n.tip3}</p>
        <button class="btn" @click="${this.handleClickNextButton}">${i18n.next}</button>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      margin: 24px auto;
      padding: 24px;
      width: 360px;
      height: 600px;
      border-radius: 32px;
      background-color: rgb(27, 28, 30);
      overflow: hidden;
    }

    .title {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
    }

    .notice {
      margin-top: 24px;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 500;
    }

    .tip {
      font-size: 14px;
      font-weight: 400;
    }

    .tip + .tip {
      margin-top: 12px;
    }

    .btn {
      all: unset;
      width: 280px;
      margin: 0 auto;
      margin-top: 280px;
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

    p {
      color: #fff;
      margin: 0;
      padding: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'backup-lose-tip': LoseTip;
  }

  namespace JSX {
    interface IntrinsicElements {
      'backup-lose-tip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['backup-lose-tip']>,
        HTMLElementTagNameMap['backup-lose-tip']
      >;
    }
  }
}