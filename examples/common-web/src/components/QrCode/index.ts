import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as QrCodeLib from 'qrcode'

@customElement('qr-code')
export class QrCode extends LitElement {
	@property() value?: string
	@property() color?: 'light' | 'dark'
	@property() errorCorrectionLevel: 'low' | 'medium' | 'quartile' | 'high' = 'high'
	@property({ type: Number }) version?: number

	protected get data() {
		return this.value ?? this.textContent ?? undefined
	}

	@query('canvas') protected readonly canvasElement?: HTMLCanvasElement
	private resizeObserver?: ResizeObserver

	render() {
		return html` 
			<canvas class="qr-code-canvas"></canvas>
    `;
	}

	static styles = css`
		:host {
			display: inline-flex;
			width: 100%;
			height: 100%;
		}
		
		.qr-code-canvas {
			width: 100%;
			height: 100%;
		}
	`

	protected override firstUpdated() {
		this.resizeObserver = new ResizeObserver(() => this.updateQrCode())
		this.resizeObserver.observe(this)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.resizeObserver?.disconnect()
	}

	protected override updated(props: PropertyValues) {
		super.updated(props)
		this.updateQrCode()
	}

	private updateQrCode() {
		if (this.data && this.canvasElement) {
			const isDark = this.color === undefined
				? window.matchMedia('(prefers-color-scheme: dark)').matches
				: this.color === 'dark'

			const size = Math.min(this.clientWidth, this.clientHeight)
			this.canvasElement.width = size
			this.canvasElement.height = size

			QrCodeLib.toCanvas(this.canvasElement, this.data, {
				width: size,
				margin: 0,
				color: {
					dark: isDark ? '#000000ff' : '#ffffffff',
					light: isDark ? '#ffffffff' : '#00000000',
				},
				errorCorrectionLevel: this.errorCorrectionLevel,
				version: this.version,
			})
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'qr-code': QrCode;
	}
}
