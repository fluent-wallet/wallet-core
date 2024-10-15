import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

const transitions = {
  'en': {
    title: 'Welcome to XXX wallet',
    tip: 'Please enter your password to unlock your wallet.',
    password: 'Password',
    unlock: 'Unlock',
  },
  'zh': {
    title: 'XXX 钱包',
    tip: '请输入你的密码以解锁钱包',
    password: '密码',
    unlock: '解锁',
  },
} as const;

const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('wallet-unlock')
export class WalletUnlock extends LitElement {
  @state() public password: string = '12345678';

  private handlePasswordInput(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
  }


  private handleClickUnlockButton() {
    this.dispatchEvent(new Event('onClickUnlockButton', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="wrapper">
        <p class="title">${i18n.title}</p>
        <p class="notice">${i18n.tip}</p>
          
        <div class="input-group">
          <label for="password">${i18n.password}</label>
          <div class="input-wrapper">
            <input type="text" id="password" placeholder="${i18n.password}" .value=${this.password} @input=${this.handlePasswordInput} autocomplete="off">
          </div>
        </div>
        
        <button class="btn" @click="${this.handleClickUnlockButton}">${i18n.unlock}</button>
      </div>
    `
  }


  static styles = css`
    .wrapper {
      position: relative;
      margin: 24px auto;
      padding: 24px;
      width: 360px;
      height: 600px;
      border-radius: 32px;
      background-color: rgb(27, 28, 30);
      overflow: hidden;
      color: white;
      font-family: Arial, sans-serif;
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


    .input-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    .input-wrapper {
      position: relative;
    }

    input {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #444;
      background-color: transparent;
      color: white;
    }

    .btn {
      all: unset;
      width: 280px;
      margin: 0 auto;
      margin-top: 120px;
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'wallet-unlock': WalletUnlock;
  }

  namespace JSX {
    interface IntrinsicElements {
      'wallet-unlock': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['wallet-unlock']>,
        HTMLElementTagNameMap['wallet-unlock']
      >;
    }
  }
}