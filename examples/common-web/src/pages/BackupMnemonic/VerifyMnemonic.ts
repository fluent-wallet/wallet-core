import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { random, shuffle } from 'radash';
import { wordlist as englishWordList } from '@scure/bip39/wordlists/english';

const transitions = {
  'en': {
    title: 'Verify your mnemonic',
    word: 'Word',
    confirm: 'confirm',
  },
  'zh': {
    title: '验证你的助记词',
    word: '单词',
    confirm: '确认',
  },
} as const;


const i18n = transitions[globalThis.walletConfig?.language ?? 'en'];

@customElement('backup-verify-mnemonic')
export class VerifyMnemonic extends LitElement {
  @property() value: string = null!;

  private get phrase() {
    return this.value.split(' ');
  }

  private get mixers() {
    const phrasesWithIndex = this.phrase.map((word, originIndex) => ({ word, originIndex }));
    const randomWithIndex = shuffle(phrasesWithIndex).slice(0, 3).sort((a, b) => a.originIndex - b.originIndex);
    return randomWithIndex.map(({ word, originIndex }) => {
      const mixer: Array<string> = [word];
      while (mixer.length < 3) {
        const randomIndex = random(0, englishWordList.length - 1);
        const randomWord = englishWordList[randomIndex];
        if (mixer.includes(randomWord)) continue;
        mixer.push(randomWord);
      }
      return { word, originIndex, mixer: shuffle(mixer) };
    });
  }

  private selectedWords: Array<string | null> = [];

  private isAllSelected() {
    return this.selectedWords.every((word) => !!word);
  }

  private isAllCorrect() {
    return this.selectedWords.every((word, index) => word === this.mixers[index].word);
  }

  private handleWordClick(index: number, word: string) {
    const newSelectedWords = [...this.selectedWords];
    newSelectedWords[index] = newSelectedWords[index] === word ? null : word;
    this.selectedWords = newSelectedWords;
    this.requestUpdate();
  }

  private handleClickConfirmButton(evt: MouseEvent) {
    evt.stopPropagation();
    if (this.isAllCorrect()) {
      this.handleConfirmSucess(evt);
    } else {
      this.handleConfirmFailed(evt);
    }
  }

  private handleConfirmSucess(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onConfirmSucess', { bubbles: true, composed: true }));
  }

  private handleConfirmFailed(evt: MouseEvent) {
    evt.stopPropagation();
    this.dispatchEvent(new Event('onConfirmFailed', { bubbles: true, composed: true }));
  }


  render() {
    return html` 
      <div class="wrapper">
        <p class="title">${i18n['title']}</p>
        ${this.mixers.map(({ originIndex, mixer }, index) => html`
          <div>
            <p class="word-label">${i18n['word']} #${originIndex + 1}</p>
            <div class="words-wrapper">
              ${mixer.map((word) => html`
                <button
                  class="word-button ${this.selectedWords[index] === word ? 'selected' : ''}"
                  @click=${() => this.handleWordClick(index, word)}
                >
                  ${word}
                </button>
              `)}
            </div>
          </div>
        `)}
        <button
          class="btn"
          @click="${this.handleClickConfirmButton}"
          ?disabled="${!this.isAllSelected()}"
        >
        ${i18n['confirm']}
      </button>
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: rgb(36, 37, 41);
    }

    .btn:disabled:hover {
      background-color: rgb(36, 37, 41);
    }

    p {
      color: #fff;
      margin: 0;
      padding: 0;
    }
    
    span {
      color: #fff;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'backup-verify-mnemonic': VerifyMnemonic;
  }

  namespace JSX {
    interface IntrinsicElements {
      'backup-verify-mnemonic': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['backup-verify-mnemonic']>,
        HTMLElementTagNameMap['backup-verify-mnemonic']
      >;
    }
  }
}
