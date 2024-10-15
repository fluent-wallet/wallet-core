import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

const transitions = {
  'en': {
    title: 'create your password',
    tip: 'Choose a password to protect and lock your wallet.',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    wrongPassword: 'Password not match',
    setPassword: 'Set Password',
  },
  'zh': {
    title: '创建您的密码',
    tip: '选择一个密码来保护和锁定您的钱包。',
    password: '密码',
    confirmPassword: '确认密码',
    wrongPassword: '密码不匹配',
    setPassword: '设置密码',
  },
} as const;

const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('initialize-password')
export class InitializePassword extends LitElement {
  @state() public password: string = '12345678';
  @state() private confirmPassword: string = '12345678';
  @state() private passwordsMatch: boolean = true;

  private handleClickBackButton(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onClickBackButton', { bubbles: true, composed: true }));
  }

  private handleClickSetButton(evt: MouseEvent) {
    if (this.password !== this.confirmPassword) {
      this.passwordsMatch = false;
      this.shadowRoot?.querySelector<HTMLInputElement>('#confirm-password')?.focus();
    } else {
      evt.stopPropagation();
      this.dispatchEvent(new Event('onClickSetButton', {
        bubbles: true,
        composed: true
      }));
    }
  }

  private handlePasswordInput(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
    this.passwordsMatch = true;
  }

  private handleConfirmPasswordInput(e: Event) {
    this.confirmPassword = (e.target as HTMLInputElement).value;
    this.passwordsMatch = true;
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="back-button" @click="${this.handleClickBackButton}">←</div>
        <p class="title">${i18n.title}</p>
        <p class="notice">${i18n.tip}</p>
          
        <div class="input-group">
          <label for="password">${i18n.password}</label>
          <div class="input-wrapper">
            <input type="text" id="password" placeholder="${i18n.password}" .value=${this.password} @input=${this.handlePasswordInput} autocomplete="off" >
          </div>
        </div>
        
        <div class="input-group">
          <label for="confirm-password">${i18n.confirmPassword}</label>
          <div class="input-wrapper">
            <input type="text" id="confirm-password" placeholder="${i18n.confirmPassword}" .value=${this.confirmPassword} @input=${this.handleConfirmPasswordInput} autocomplete="off">
          </div>
        </div>
        
        <p class="error-message" style=${this.passwordsMatch ? 'opacity: 0' : ''}>${i18n.wrongPassword}</p>
        <button class="btn" @click="${this.handleClickSetButton}">${i18n.setPassword}</button>
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

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 24px;
      cursor: pointer;
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

    .error-message {
      color: #ff4d4f;
      font-size: 14px;
      margin-top: -10px;
      margin-bottom: 10px;
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
    'initialize-password': InitializePassword;
  }

  namespace JSX {
    interface IntrinsicElements {
      'initialize-password': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['initialize-password']>,
        HTMLElementTagNameMap['initialize-password']
      >;
    }
  }
}