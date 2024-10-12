import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const transitions = {
  'en': {
    'title': 'Before you start, please back up your mnemonic',
    'info-item-1': `It's important to write down and store your mnemonic somewhere safe.`,
    'info-item-2': 'Your mnemonic is the only way to restore your account and funds.',
    'info-item-3': 'Anyone with your mnemonic can access your entire wallet.',
    'reveal-button': 'Reveal your seed phrase',
    'wallet-link': 'Take me to my wallet',
  },
  'zh': {
    'title': '开始之前，请备份您的助记词',
    'info-item-1': '将您的助记词写下来并存储在安全的地方很重要。',
    'info-item-2': '您的助记词是恢复您的账户和资金的唯一方式。',
    'info-item-3': '任何拥有您的助记词的人都可以使用您的账户。',
    'reveal-button': '显示您的恢复短语',
    'wallet-link': '带我去我的钱包',
  },
} as const;

const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('initialize-backup-prompt')
export class BackupPrompt extends LitElement {
  private handleClickBackButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickBackButton', { bubbles: true, composed: true }));
  }

  private handleClickRevealButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickRevealButton', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="back-button" @click="${this.handleClickBackButton}">←</div>
        <div class="content">
          <div class="warning-icon">!</div>
          <h1>${i18n['title']}</h1>
          <div class="info-item">
            <span class="icon pencil">✎</span>
            <p>${i18n['info-item-1']}</p>
          </div>
          <div class="info-item">
            <span class="icon warning">⚠</span>
            <p>${i18n['info-item-2']}</p>
          </div>
          <div class="info-item">
            <span class="icon lock">🔓</span>
            <p>${i18n['info-item-3']}</p>
          </div>
          <button class="btn" @click="${this.handleClickRevealButton}">${i18n['reveal-button']}</button>
          <a href="#" class="wallet-link">${i18n['wallet-link']}</a>
        </div>
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
      color: white;
      font-family: Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 24px;
      cursor: pointer;
    }

    .content {
      padding: 40px 20px;
      text-align: center;
    }

    .warning-icon {
      background-color: #ff6b35;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      margin: 0 auto 20px;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 30px;
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      text-align: left;
    }

    .icon {
      margin-right: 10px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .pencil { color: #3498db; }
    .warning { color: #f39c12; }
    .lock { color: #e74c3c; }

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

    .wallet-link {
      display: block;
      margin-top: 20px;
      color: #3498db;
      text-decoration: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'initialize-backup-prompt': BackupPrompt
  }

  namespace JSX {
    interface IntrinsicElements {
      'initialize-backup-prompt': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElementTagNameMap['initialize-backup-prompt']>, HTMLElementTagNameMap['initialize-backup-prompt']>;
    }
  }
}