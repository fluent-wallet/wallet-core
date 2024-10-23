import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../components/QrCode';

const transitions = {
  'en': {
    title: 'Write Down Your ',
    tip1: `Do NOT take a screenshot of this page`,
    tip2: `Writing down on paper is recommended`,
    tip3: `Or scan the QR code directly from the trusted app you wish to import to`,
    view: "Tap to view the ",
    viewTips: "Make sure your environment is safe",
    close: 'Close',
    next: 'Next',
  },
  'zh': {
    title: '請記下你的',
    tip1: `如果您丢失了助记词或私钥，将无法恢复您的钱包。`,
    tip2: `获取助记词或私钥意味着拥有所有资产。`,
    tip3: `请妥善保管。`,
    view: "点击查看",
    viewTips: "请确保你的环境安全",
    close: '关闭',
    next: '下一步',
  },
} as const;


const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('backup-show-mnemonic')
export class ShowMnemonic extends LitElement {
  @property() type: 'mnemonic' | 'privateKey' = null!;
  @property() value?: string = null!;
  @property({ type: Boolean }) showNextButton?: boolean = false;
  @property({ type: Boolean }) showCloseButton?: boolean = false;

  private get phrase() {
    return this.value?.split(' ');
  }

  private handleClickNextButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickNextButton', { bubbles: true, composed: true }));
  }

  private handleClickCloseButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickCloseButton', { bubbles: true, composed: true }));
  }


  render() {
    return html` 
      <div class="wrapper">
        <p class="title">${i18n['title']}</p>
        <p class="tip">${i18n['tip1']}</p>
        <p class="tip">${i18n['tip2']}</p>
        <p class="tip">${i18n['tip3']}</p>

        <div class="border-wrapper">
          ${this.type === 'mnemonic' && this.phrase
        ? html`<div class="mnemonic-wrapper">
              <div class="mnemonic-column">
                ${this.phrase?.slice(0, 6).map((word, index) => html`<span class="mnemonic-word">${index + 1}. ${word}</span>`)}
              </div>
              <div class="mnemonic-column">
              ${this.phrase?.slice(6).map((word, index) => html`<span class="mnemonic-word">${index + 7}. ${word}</span>`)}
              </div>
            </div>`
        : ''}
        </div>

        ${this.showNextButton
        ? html`<button class="btn" @click="${this.handleClickNextButton}">${i18n['next']}</button>`
        : ''}

        ${this.showCloseButton
        ? html`<button class="btn" @click="${this.handleClickCloseButton}">${i18n['close']}</button>`
        : ''}
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
      margin-bottom: 24px;
    }

    .tip {
      font-size: 14px;
      font-weight: 400;
    }

    .tip + .tip {
      margin-top: 12px;
    }

    .border-wrapper {
      margin-top: 24px;
      width: 270px;
      height: 270px;
      padding: 12px;
      border-radius: 12px;
      margin: 40px auto 0 auto;
      border: 1px solid #fff;
    }

    .mnemonic-wrapper {
      display: flex;
      gap: 8px;
    }

    .mnemonic-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mnemonic-word {
      display: block;
      padding: 8px 4px;
      border-radius: 8px;
      text-align: left;
      color: #000;
      background-color: #fff;
    }

    .btn {
      all: unset;
      width: 280px;
      margin: 0 auto;
      margin-top: 40px;
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
    'backup-show-mnemonic': ShowMnemonic;
  }

  namespace JSX {
    interface IntrinsicElements {
      'backup-show-mnemonic': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['backup-show-mnemonic']> & { showNextButton?: boolean; showCloseButton?: boolean },
        HTMLElementTagNameMap['backup-show-mnemonic']
      >;
    }
  }
}