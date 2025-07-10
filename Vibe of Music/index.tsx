
/**
 * @fileoverview Control real time music with text prompts, generate album covers and lyrics.
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultGroup, html, LitElement, svg} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {
  GoogleGenAI,
  type LiveMusicGenerationConfig,
  type LiveMusicServerMessage,
  type LiveMusicSession,
  type GenerateContentResponse, 
} from '@google/genai';
import {decode, decodeAudioData} from './utils';

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
  apiVersion: 'v1alpha', 
});
let model = 'lyria-realtime-exp';
const imageModel = 'imagen-3.0-generate-002';
const textModel = 'gemini-2.5-flash-preview-04-17';


type PlaybackState = 'stopped' | 'playing' | 'loading' | 'paused';

function throttle(func: (...args: unknown[]) => void, delay: number) {
  let lastCall = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    if (timeSinceLastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
}

class IconButton extends LitElement {
  static override styles = css`
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    :host(:hover) svg {
      transform: scale(1.2);
    }
    svg {
      width: 100%;
      height: 100%;
      transition: transform 0.5s cubic-bezier(0.25, 1.56, 0.32, 0.99);
    }
    .hitbox {
      pointer-events: all;
      position: absolute;
      width: 65%;
      aspect-ratio: 1;
      top: 9%;
      border-radius: 50%;
      cursor: inherit; /* Inherit baton cursor */
    }
  ` as CSSResultGroup;

  protected renderIcon() {
    return svg``;
  }

  private renderSVG() {
    return html` <svg
      width="140"
      height="140"
      viewBox="0 -10 140 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="22"
        y="6"
        width="96"
        height="96"
        rx="48"
        fill="black"
        fill-opacity="0.05" />
      <rect
        x="23.5"
        y="7.5"
        width="93"
        height="93"
        rx="46.5"
        stroke="black"
        stroke-opacity="0.3"
        stroke-width="3" />
      <g filter="url(#filter0_ddi_1048_7373)">
        <rect
          x="25"
          y="9"
          width="90"
          height="90"
          rx="45"
          fill="url(#button-gradient)" 
          fill-opacity="0.9" 
          shape-rendering="crispEdges" />
      </g>
      ${this.renderIcon()}
      <defs>
        <linearGradient id="button-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4e54c8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8f94fb;stop-opacity:1" />
        </linearGradient>
        <filter
          id="filter0_ddi_1048_7373"
          x="0"
          y="0"
          width="140"
          height="140"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.2 0 0 0 0.25 0" /> 
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1048_7373" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy="16" />
          <feGaussianBlur stdDeviation="12.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.3 0 0 0 0.25 0" /> 
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1048_7373"
            result="effect2_dropShadow_1048_7373" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1048_7373"
            result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" /> 
          <feBlend
            mode="normal"
            in2="shape"
            result="effect3_innerShadow_1048_7373" />
        </filter>
      </defs>
    </svg>`;
  }

  override render() {
    return html`${this.renderSVG()}<div class="hitbox"></div>`;
  }
}

@customElement('play-pause-button')
export class PlayPauseButton extends IconButton {
  @property({type: String}) playbackState: PlaybackState = 'stopped';

  static override styles = [
    IconButton.styles,
    css`
      .loader {
        stroke: #ffffff;
        stroke-width: 3;
        stroke-linecap: round;
        animation: spin linear 1s infinite;
        transform-origin: center;
        transform-box: fill-box;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
    `,
  ];

  private renderPause() {
    return svg`<path
      d="M75.0037 69V39H83.7537V69H75.0037ZM56.2537 69V39H65.0037V69H56.2537Z"
      fill="#FEFEFE"
    />`;
  }

  private renderPlay() {
    return svg`<path d="M60 71.5V36.5L87.5 54L60 71.5Z" fill="#FEFEFE" />`;
  }

  private renderLoading() {
    return svg`<path shape-rendering="crispEdges" class="loader" d="M70,74.2L70,74.2c-10.7,0-19.5-8.7-19.5-19.5l0,0c0-10.7,8.7-19.5,19.5-19.5
            l0,0c10.7,0,19.5,8.7,19.5,19.5l0,0"/>`;
  }

  override renderIcon() {
    if (this.playbackState === 'playing') {
      return this.renderPause();
    } else if (this.playbackState === 'loading') {
      return this.renderLoading();
    } else {
      return this.renderPlay();
    }
  }
}

@customElement('reset-button')
export class ResetButton extends IconButton {
  private renderResetIcon() {
    return svg`<path fill="#fefefe" d="M71,77.1c-2.9,0-5.7-0.6-8.3-1.7s-4.8-2.6-6.7-4.5c-1.9-1.9-3.4-4.1-4.5-6.7c-1.1-2.6-1.7-5.3-1.7-8.3h4.7
      c0,4.6,1.6,8.5,4.8,11.7s7.1,4.8,11.7,4.8c4.6,0,8.5-1.6,11.7-4.8c3.2-3.2,4.8-7.1,4.8-11.7s-1.6-8.5-4.8-11.7
      c-3.2-3.2-7.1-4.8-11.7-4.8h-0.4l3.7,3.7L71,46.4L61.5,37l9.4-9.4l3.3,3.4l-3.7,3.7H71c2.9,0,5.7,0.6,8.3,1.7
      c2.6,1.1,4.8,2.6,6.7,4.5c1.9,1.9,3.4,4.1,4.5,6.7c1.1,2.6,1.7,5.3,1.7,8.3c0,2.9-0.6,5.7-1.7,8.3c-1.1,2.6-2.6,4.8-4.5,6.7
      s-4.1,3.4-6.7,4.5C76.7,76.5,73.9,77.1,71,77.1z"/>`;
  }

  override renderIcon() {
    return this.renderResetIcon();
  }
}

@customElement('toast-message')
class ToastMessage extends LitElement {
  static override styles = css`
    .toast {
      line-height: 1.6;
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0,0,0,0.85);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      min-width: 250px;
      max-width: 80vw;
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease-out;
      z-index: 1001; /* Ensure it's above notes and other elements */
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: 'Google Sans', sans-serif;
    }
    button {
      border-radius: 50%;
      width: 24px;
      height: 24px;
      border: none;
      background-color: rgba(255,255,255,0.2);
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: rgba(255,255,255,0.4);
    }
    .toast:not(.showing) {
      transition-duration: 1s;
      transform: translate(-50%, -200%);
      opacity: 0;
    }
  `;

  @property({type: String}) message = '';
  @property({type: Boolean}) showing = false;

  override render() {
    return html`<div class=${classMap({showing: this.showing, toast: true})}>
      <div class="message">${this.message}</div>
      <button @click=${this.hide}>✕</button>
    </div>`;
  }

  show(message: string) {
    this.showing = true;
    this.message = message;
    setTimeout(() => this.hide(), 5000);
  }

  hide() {
    this.showing = false;
  }
}

@customElement('settings-controller')
class SettingsController extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 2vmin;
      background-color: rgba(42, 42, 42, 0.85); /* Slightly transparent */
      backdrop-filter: blur(5px);
      color: #eee;
      box-sizing: border-box;
      border-radius: 8px; /* Increased border radius */
      font-family: 'Google Sans', sans-serif;
      font-size: 1.5vmin;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #8f94fb #1a1a1a; /* Brighter scrollbar thumb */
      transition: width 0.3s ease-out max-height 0.3s ease-out;
      width: 100%;
      border: 1px solid rgba(255,255,255,0.1);
    }
    :host([showadvanced]) {
      max-height: 40vmin;
    }
    :host::-webkit-scrollbar {
      width: 8px; /* Slightly thicker */
    }
    :host::-webkit-scrollbar-track {
      background: rgba(26, 26, 26, 0.5); /* Darker track */
      border-radius: 4px;
    }
    :host::-webkit-scrollbar-thumb {
      background-color: #8f94fb; /* Brighter scrollbar thumb */
      border-radius: 4px;
    }
    .setting {
      margin-bottom: 0.5vmin;
      display: flex;
      flex-direction: column;
      gap: 0.5vmin;
    }
    label {
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      user-select: none;
      color: #f0f0f0; /* Brighter label text */
    }
    label span:last-child {
      font-weight: normal;
      color: #ccc;
      min-width: 3em;
      text-align: right;
    }
    input[type='range'] {
      --track-height: 8px;
      --track-bg: rgba(0,0,0,0.5); /* Darker track background */
      --track-border-radius: 4px;
      --thumb-size: 18px; /* Slightly larger thumb */
      --thumb-bg: #8f94fb; /* Brighter thumb */
      --thumb-border-radius: 50%;
      --thumb-box-shadow: 0 0 5px rgba(143, 148, 251, 0.7); /* Glow effect */
      --value-percent: 0%;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: var(--track-height);
      background: transparent;
      cursor: inherit; /* Inherit baton cursor */
      margin: 0.5vmin 0;
      border: none;
      padding: 0;
      vertical-align: middle;
    }
    input[type='range']::-webkit-slider-runnable-track {
      width: 100%;
      height: var(--track-height);
      cursor: inherit;
      border: none;
      background: linear-gradient(
        to right,
        var(--thumb-bg) var(--value-percent),
        var(--track-bg) var(--value-percent)
      );
      border-radius: var(--track-border-radius);
    }
    input[type='range']::-moz-range-track {
      width: 100%;
      height: var(--track-height);
      cursor: inherit;
      background: var(--track-bg);
      border-radius: var(--track-border-radius);
      border: none;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: var(--thumb-size);
      width: var(--thumb-size);
      background: var(--thumb-bg);
      border-radius: var(--thumb-border-radius);
      box-shadow: var(--thumb-box-shadow);
      cursor: inherit;
      margin-top: calc((var(--thumb-size) - var(--track-height)) / -2);
    }
    input[type='range']::-moz-range-thumb {
      height: var(--thumb-size);
      width: var(--thumb-size);
      background: var(--thumb-bg);
      border-radius: var(--thumb-border-radius);
      box-shadow: var(--thumb-box-shadow);
      cursor: inherit;
      border: none;
    }
    input[type='number'],
    input[type='text'],
    select {
      background-color: rgba(42, 42, 42, 0.7); /* Slightly transparent */
      color: #eee;
      border: 1px solid #666;
      border-radius: 5px; /* Consistent border radius */
      padding: 0.5vmin; /* Increased padding */
      font-size: 1.5vmin;
      font-family: inherit;
      box-sizing: border-box;
    }
    input[type='number'] {
      width: 7em; /* Slightly wider */
    }
    input[type='text'] {
      width: 100%;
    }
    input[type='text']::placeholder {
      color: #888;
    }
    input[type='number']:focus,
    input[type='text']:focus,
    select:focus {
      outline: none;
      border-color: #8f94fb; /* Brighter focus color */
      box-shadow: 0 0 0 2px rgba(143, 148, 251, 0.4); /* Glow effect on focus */
    }
    select {
      width: 100%;
      cursor: inherit;
    }
    select option {
      background-color: #2a2a2a;
      color: #eee;
    }
    .checkbox-setting {
      flex-direction: row;
      align-items: center;
      gap: 1vmin;
    }
    input[type='checkbox'] {
      cursor: inherit;
      accent-color: #8f94fb; /* Brighter accent color */
      transform: scale(1.1); /* Slightly larger checkbox */
    }
    .core-settings-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 4vmin;
      margin-bottom: 1vmin;
      justify-content: space-evenly;
    }
    .core-settings-row .setting {
      min-width: 16vmin;
    }
    .core-settings-row label span:last-child {
      min-width: 2.5em;
    }
    .advanced-toggle {
      cursor: inherit;
      margin: 2vmin 0 1vmin 0;
      color: #bbb; /* Lighter toggle text */
      text-decoration: underline;
      user-select: none;
      font-size: 1.4vmin;
      width: fit-content;
      transition: color 0.2s;
    }
    .advanced-toggle:hover {
      color: #fff; /* Brighter hover color */
    }
    .advanced-settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10vmin, 1fr));
      gap: 3vmin;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transition:
        max-height 0.3s ease-out,
        opacity 0.3s ease-out;
    }
    .advanced-settings.visible {
      max-width: 120vmin;
      max-height: 40vmin; 
      opacity: 1;
    }
    hr.divider {
      display: none;
      border: none;
      border-top: 1px solid #666;
      margin: 2vmin 0;
      width: 100%;
    }
    :host([showadvanced]) hr.divider {
      display: block;
    }
    .auto-row {
      display: flex;
      align-items: center;
      gap: 0.5vmin;
    }
    .setting[auto='true'] input[type='range'] {
      pointer-events: none;
      filter: grayscale(80%) opacity(0.7); /* More subdued when auto */
    }
    .auto-row span {
      margin-left: auto;
    }
    .auto-row label {
      cursor: inherit;
    }
    .auto-row input[type='checkbox'] {
      cursor: inherit;
      margin: 0;
    }
  `;

  private readonly defaultConfig: LiveMusicGenerationConfig = {
    temperature: 1.1,
    topK: 40,
    guidance: 4.0,
    seed: undefined,
    bpm: undefined,
    density: undefined, 
    brightness: undefined, 
    scale: 'SCALE_UNSPECIFIED' as any, 
    muteBass: false,
    muteDrums: false,
    onlyBassAndDrums: false,
  };

  @state() private config: LiveMusicGenerationConfig = {...this.defaultConfig};
  @state() showAdvanced = false;
  @state() autoDensity = true;
  @state() lastDefinedDensity: number | undefined = 0.5; 
  @state() autoBrightness = true;
  @state() lastDefinedBrightness: number | undefined = 0.5; 


  public resetToDefaults() {
    this.config = {...this.defaultConfig};
    this.autoDensity = true;
    this.lastDefinedDensity = 0.5;
    this.autoBrightness = true;
    this.lastDefinedBrightness = 0.5;
    this.config.density = undefined;
    this.config.brightness = undefined;
    this.dispatchSettingsChange();
    this.requestUpdate(); 
  }

  private updateSliderBackground(inputEl: HTMLInputElement) {
    if (inputEl.type !== 'range') {
      return;
    }
    const min = Number(inputEl.min) || 0;
    const max = Number(inputEl.max) || 1; 
    let value = Number(inputEl.value);

    if (inputEl.id === 'density' && this.autoDensity) value = this.lastDefinedDensity ?? 0.5;
    if (inputEl.id === 'brightness' && this.autoBrightness) value = this.lastDefinedBrightness ?? 0.5;

    const percentage = ((value - min) / (max - min)) * 100;
    inputEl.style.setProperty('--value-percent', `${percentage}%`);
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement; 
    const key = target.id as keyof LiveMusicGenerationConfig | 'auto-density' | 'auto-brightness';
    let value: string | number | boolean | undefined = (target as HTMLInputElement).value; 

    const newConfig = { ...this.config };

    if (target.type === 'number' || target.type === 'range') {
        const numValue = (target as HTMLInputElement).value === '' ? undefined : Number((target as HTMLInputElement).value);
        if (target.type === 'range') {
            this.updateSliderBackground(target as HTMLInputElement);
        }
        (newConfig as any)[key] = numValue; 
        if (key === 'density' && numValue !== undefined) this.lastDefinedDensity = numValue;
        if (key === 'brightness' && numValue !== undefined) this.lastDefinedBrightness = numValue;

    } else if (target.type === 'checkbox') {
        const checked = (target as HTMLInputElement).checked;
        if (key === 'auto-density') {
            this.autoDensity = checked;
            newConfig.density = checked ? undefined : this.lastDefinedDensity;
        } else if (key === 'auto-brightness') {
            this.autoBrightness = checked;
            newConfig.brightness = checked ? undefined : this.lastDefinedBrightness;
        } else {
            (newConfig as any)[key] = checked; 
        }
    } else if (target.type === 'select-one') {
        const selectElement = target as HTMLSelectElement; 
        if (selectElement.value === "" || selectElement.options[selectElement.selectedIndex]?.disabled) {
            (newConfig as any)[key] = undefined; 
        } else {
            (newConfig as any)[key] = selectElement.value; 
        }
    } else {
         (newConfig as any)[key] = (target as HTMLInputElement).value; 
    }

    this.config = newConfig;
    this.dispatchSettingsChange();
  }

  override updated(changedProperties: Map<string | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('config') || changedProperties.has('autoDensity') || changedProperties.has('autoBrightness')) {
      this.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((slider: HTMLInputElement) => {
        const sliderId = slider.id as keyof LiveMusicGenerationConfig;
        let sliderValue = (this.config as any)[sliderId];

        if (sliderId === 'density') {
            sliderValue = this.autoDensity ? this.lastDefinedDensity : this.config.density;
            slider.disabled = this.autoDensity;
        } else if (sliderId === 'brightness') {
            sliderValue = this.autoBrightness ? this.lastDefinedBrightness : this.config.brightness;
            slider.disabled = this.autoBrightness;
        }
        
        slider.value = String(sliderValue ?? (sliderId === 'density' || sliderId === 'brightness' ? 0.5 : slider.defaultValue));
        this.updateSliderBackground(slider);
      });
    }
  }

  private dispatchSettingsChange() {
    this.dispatchEvent(
      new CustomEvent<LiveMusicGenerationConfig>('settings-changed', {
        detail: this.config,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private toggleAdvancedSettings() {
    this.showAdvanced = !this.showAdvanced;
  }

  override render() {
    const cfg = this.config;
    const advancedClasses = classMap({
      'advanced-settings': true,
      'visible': this.showAdvanced,
    });
    const scaleMap = new Map<string, string>([
      ['Auto', 'SCALE_UNSPECIFIED'],
      ['C Major / A Minor', 'C_MAJOR_A_MINOR'],
      ['C# Major / A# Minor', 'D_FLAT_MAJOR_B_FLAT_MINOR'],
      ['D Major / B Minor', 'D_MAJOR_B_MINOR'],
      ['D# Major / C Minor', 'E_FLAT_MAJOR_C_MINOR'],
      ['E Major / C# Minor', 'E_MAJOR_D_FLAT_MINOR'],
      ['F Major / D Minor', 'F_MAJOR_D_MINOR'],
      ['F# Major / D# Minor', 'G_FLAT_MAJOR_E_FLAT_MINOR'],
      ['G Major / E Minor', 'G_MAJOR_E_MINOR'],
      ['G# Major / F Minor', 'A_FLAT_MAJOR_F_MINOR'],
      ['A Major / F# Minor', 'A_MAJOR_G_FLAT_MINOR'],
      ['A# Major / G Minor', 'B_FLAT_MAJOR_G_MINOR'],
      ['B Major / G# Minor', 'B_MAJOR_A_FLAT_MINOR'],
    ]);

    return html`
      <div class="core-settings-row">
        <div class="setting">
          <label for="temperature"
            >Temperature<span>${Number(cfg.temperature ?? 1.1).toFixed(1)}</span></label
          >
          <input
            type="range"
            id="temperature"
            min="0"
            max="3"
            step="0.1"
            .value=${String(cfg.temperature ?? 1.1)}
            @input=${this.handleInputChange} />
        </div>
        <div class="setting">
          <label for="guidance"
            >Guidance<span>${Number(cfg.guidance ?? 4.0).toFixed(1)}</span></label
          >
          <input
            type="range"
            id="guidance"
            min="0"
            max="6"
            step="0.1"
            .value=${String(cfg.guidance ?? 4.0)}
            @input=${this.handleInputChange} />
        </div>
        <div class="setting">
          <label for="topK">Top K<span>${cfg.topK ?? 40}</span></label>
          <input
            type="range"
            id="topK"
            min="1"
            max="100"
            step="1"
            .value=${String(cfg.topK ?? 40)}
            @input=${this.handleInputChange} />
        </div>
      </div>
      <div class="advanced-toggle" @click=${this.toggleAdvancedSettings}>
        ${this.showAdvanced ? 'Hide' : 'Show'} Advanced Settings
      </div>
      <hr class="divider" />
      <div class=${advancedClasses}>
        <div class="setting">
          <label for="seed">Seed</label>
          <input
            type="number"
            id="seed"
            .value=${cfg.seed ?? ''}
            @input=${this.handleInputChange}
            placeholder="Auto" />
        </div>
        <div class="setting">
          <label for="bpm">BPM</label>
          <input
            type="number"
            id="bpm"
            min="60"
            max="180"
            .value=${cfg.bpm ?? ''}
            @input=${this.handleInputChange}
            placeholder="Auto (60-180)" />
        </div>
        <div class="setting" auto=${this.autoDensity}>
          <label for="density">Density</label>
          <input
            type="range"
            id="density"
            min="0"
            max="1"
            step="0.05"
            .value=${String(this.autoDensity ? this.lastDefinedDensity : cfg.density ?? 0.5)}
            ?disabled=${this.autoDensity}
            @input=${this.handleInputChange} />
          <div class="auto-row">
            <input
              type="checkbox"
              id="auto-density"
              .checked=${this.autoDensity}
              @change=${this.handleInputChange} />
            <label for="auto-density">Auto</label>
            <span>${(this.autoDensity ? this.lastDefinedDensity ?? 0.5 : cfg.density ?? 0.5).toFixed(2)}</span>
          </div>
        </div>
        <div class="setting" auto=${this.autoBrightness}>
          <label for="brightness">Brightness</label>
          <input
            type="range"
            id="brightness"
            min="0"
            max="1"
            step="0.05"
            .value=${String(this.autoBrightness ? this.lastDefinedBrightness : cfg.brightness ?? 0.5)}
            ?disabled=${this.autoBrightness}
            @input=${this.handleInputChange} />
          <div class="auto-row">
            <input
              type="checkbox"
              id="auto-brightness"
              .checked=${this.autoBrightness}
              @change=${this.handleInputChange} />
            <label for="auto-brightness">Auto</label>
            <span>${(this.autoBrightness ? this.lastDefinedBrightness ?? 0.5 : cfg.brightness ?? 0.5).toFixed(2)}</span>
          </div>
        </div>
        <div class="setting">
          <label for="scale">Scale</label>
          <select
            id="scale"
            .value=${cfg.scale || 'SCALE_UNSPECIFIED'}
            @change=${this.handleInputChange}>
            ${[...scaleMap.entries()].map(
              ([displayName, enumValue]) =>
                html`<option value=${enumValue}>${displayName}</option>`,
            )}
          </select>
        </div>
        <div class.setting>
          <div class="setting checkbox-setting">
            <input
              type="checkbox"
              id="muteBass"
              .checked=${!!cfg.muteBass}
              @change=${this.handleInputChange} />
            <label for="muteBass" style="font-weight: normal;">Mute Bass</label>
          </div>
          <div class="setting checkbox-setting">
            <input
              type="checkbox"
              id="muteDrums"
              .checked=${!!cfg.muteDrums}
              @change=${this.handleInputChange} />
            <label for="muteDrums" style="font-weight: normal;"
              >Mute Drums</label
            >
          </div>
          <div class="setting checkbox-setting">
            <input
              type="checkbox"
              id="onlyBassAndDrums"
              .checked=${!!cfg.onlyBassAndDrums}
              @change=${this.handleInputChange} />
            <label for="onlyBassAndDrums" style="font-weight: normal;"
              >Only Bass & Drums</label
            >
          </div>
        </div>
      </div>
    `;
  }
}

@customElement('prompt-dj')
class PromptDj extends LitElement {
  static override styles = css`
    :host {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 2vmin;
      position: relative;
      font-size: 1.8vmin; 
      gap: 1.5vmin; /* Adjusted gap for new layout */
      overflow-y: auto; 
      justify-content: flex-start; /* Content flows from top */
    }

    #background {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      z-index: -1;
      background: linear-gradient(135deg, #1a1a2e, #232a34, #4e54c8, #8f94fb, #f7797d, #6a11cb, #2575fc);
      background-size: 400% 400%; /* Increased size for smoother animation */
      animation: backgroundPan 25s ease infinite alternate; /* Slower, smoother pan */
      overflow: hidden; /* Contain notes */
    }

    @keyframes backgroundPan {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .music-note {
      position: absolute;
      pointer-events: none;
      user-select: none;
      text-shadow: 0 0 6px rgba(230, 230, 255, 0.4); /* Slightly stronger glow */
      animation: floatNoteDynamic infinite linear;
      opacity: 0; /* Start transparent, animation handles fade-in */
      will-change: transform, opacity; /* Optimize animation */
    }

    @keyframes floatNoteDynamic {
      0% {
        transform: translateY(15vh) translateX(var(--start-x, 0vw)) rotate(var(--start-rotate, 0deg));
        opacity: 0;
      }
      10%, 80% { /* Appear faster, stay longer */
        opacity: 0.65; /* Slightly more visible notes */
      }
      100% {
        transform: translateY(-120vh) translateX(var(--end-x, 0vw)) rotate(var(--end-rotate, 0deg));
        opacity: 0;
      }
    }

    .app-title {
      font-family: 'Google Sans', 'Orbitron', sans-serif; /* Adding Orbitron for a more 'vibe' feel */
      font-size: clamp(3vmin, 6vw, 7vmin); /* Responsive font size */
      font-weight: bold;
      text-align: center;
      color: #fff;
      margin-bottom: 2vmin;
      letter-spacing: 0.05em;
      animation: neonShine 2.5s infinite alternate ease-in-out;
      text-shadow: 
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 15px #00ffff, /* Cyan */
        0 0 20px #00ffff,
        0 0 25px #00ffff,
        0 0 30px #ff00ff, /* Magenta */
        0 0 35px #ff00ff;
      z-index: 10; /* Ensure title is above notes */
    }

    @keyframes neonShine {
      0%, 100% {
        text-shadow:
          0 0 5px #fff, 0 0 10px #fff,
          0 0 15px #00ffff, 0 0 20px #00ffff,
          0 0 25px #ff00ff, 0 0 30px #ff00ff;
        opacity: 0.85;
      }
      50% {
        text-shadow:
          0 0 10px #fff, 0 0 15px #fff,
          0 0 20px #00aaff, 0 0 25px #00aaff, /* Slightly different blue */
          0 0 30px #f000f0, 0 0 35px #f000f0; /* Slightly different magenta */
        opacity: 1;
      }
    }


    .main-content-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2vmin; 
      width: 100%;
      max-width: 800px; 
      flex-grow: 1; 
      padding-bottom: 2vmin; 
    }

    .input-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%; 
      gap: 1.5vmin; /* Increased gap */
    }

    #sentence-input {
      width: 100%;
      min-height: 10vmin; 
      padding: 1.8vmin; /* Increased padding */
      font-size: 2vmin; 
      border-radius: 10px; /* Increased border radius */
      border: 1px solid rgba(255,255,255,0.2); /* Lighter border */
      background-color: rgba(30, 30, 30, 0.8); /* Slightly transparent */
      backdrop-filter: blur(3px);
      color: #eee;
      font-family: 'Google Sans', sans-serif;
      box-sizing: border-box;
      resize: vertical;
      -webkit-font-smoothing: antialiased;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    #sentence-input::placeholder {
      color: #999; /* Lighter placeholder */
    }
    #sentence-input:focus {
      border-color: #8f94fb;
      box-shadow: 0 0 10px rgba(143, 148, 251, 0.5);
    }


    #generate-button {
      padding: 1.8vmin 3.5vmin; /* Increased padding */
      font-size: 2vmin; /* Increased font size */
      font-weight: bold;
      border-radius: 10px; /* Increased border radius */
      background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%); /* Vibrant gradient */
      color: white;
      border: none;
      cursor: inherit; /* Inherit baton cursor */
      transition: all 0.3s ease;
      align-self: stretch; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    #generate-button:hover:not(:disabled) {
      background-image: linear-gradient(to right, #2575fc 0%, #6a11cb 100%);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      transform: translateY(-2px);
    }
    #generate-button:active:not(:disabled) {
      transform: translateY(0px) scale(0.98);
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    #generate-button:disabled {
      background-image: none;
      background-color: #555; /* Darker disabled state */
      cursor: not-allowed;
      opacity: 0.7;
      box-shadow: none;
    }

    #settings-container {
      width: 100%; 
      margin-top: 1vmin; 
    }

    .playback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2vmin; 
      flex-shrink: 0; 
      margin-top: 1vmin;
    }

    play-pause-button,
    reset-button {
      width: 12vmin; 
      max-width: 80px; 
      min-width: 60px; /* ensure minimum size */
      flex-shrink: 0;
    }

    .generated-extras-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5vmin; /* Increased gap */
      width: 100%;
      margin-top: 1vmin; /* Adjusted margin */
      margin-bottom: 1vmin; /* Added margin bottom */
    }

    .generated-extras-container > * { /* Apply to direct children for animation */
      animation: fadeInScaleUp 0.6s ease-out forwards;
      opacity: 0; /* Start hidden for animation */
      will-change: transform, opacity;
    }

    @keyframes fadeInScaleUp {
      from {
        opacity: 0;
        transform: scale(0.92) translateY(15px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    #album-cover-image {
      max-width: 90%; /* Allow slightly larger on small screens */
      width: auto;
      max-height: 35vh; 
      height: auto;
      border-radius: 12px; /* Increased border radius */
      background-color: rgba(42, 42, 42, 0.7); 
      object-fit: contain; 
      box-shadow: 0 5px 20px rgba(0,0,0,0.4);
      border: 2px solid rgba(255,255,255,0.1);
    }

    .loading-placeholder, .empty-state-placeholder {
      color: #ccc; /* Lighter text for placeholders */
      font-style: italic;
      padding: 3vmin; /* Increased padding */
      background-color: rgba(42, 42, 42, 0.7); 
      backdrop-filter: blur(3px);
      border-radius: 10px; /* Increased border radius */
      text-align: center;
      width: 70%; /* Wider placeholder */
      min-height: 60px; /* Taller placeholder */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6vmin;
      line-height: 1.5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .loading-placeholder.anticipation-message {
        font-weight: bold;
        color: #e0e0ff; /* Light lavender text */
    }


    #lyrics-display {
      width: 100%;
      max-width: 600px; 
      background-color: rgba(30, 30, 30, 0.8); 
      backdrop-filter: blur(3px);
      color: #eee;
      padding: 2.5vmin; /* Increased padding */
      border-radius: 10px; /* Increased border radius */
      font-family: 'Google Sans', sans-serif;
      font-size: 1.7vmin; /* Slightly larger font */
      line-height: 1.7; /* Increased line height */
      white-space: pre-line; 
      max-height: 35vh; 
      overflow-y: auto;
      border: 1px solid rgba(255,255,255,0.2); /* Lighter border */
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      scrollbar-width: thin;
      scrollbar-color: #8f94fb #1a1a1a;
    }
    #lyrics-display::-webkit-scrollbar { width: 8px; }
    #lyrics-display::-webkit-scrollbar-track { background: rgba(26, 26, 26, 0.5); border-radius: 4px; }
    #lyrics-display::-webkit-scrollbar-thumb { background-color: #8f94fb; border-radius: 4px; }

    #lyrics-display p {
        margin-top: 0;
        margin-bottom: 1vmin;
        font-weight: bold;
        color: #bbb;
    }
    #lyrics-display div { 
        white-space: pre-wrap; 
    }
  `;

  private session?: LiveMusicSession;
  private readonly sampleRate = 48000;
  private audioContext = new (window.AudioContext || (window as any).webkitAudioContext)( 
    {sampleRate: this.sampleRate},
  );
  private outputNode: GainNode = this.audioContext.createGain();
  private nextStartTime = 0;
  private readonly bufferTime = 2; 

  @state() private currentSentence = '';
  @state() private playbackState: PlaybackState = 'stopped';
  
  @state() private isOverallLoading = false; 
  @state() private albumCoverUrl: string | null = null;
  @state() private isGeneratingImage = false;
  @state() private suggestedLyrics: string | null = null;
  @state() private isGeneratingLyrics = false;

  @state() private filteredReason: string | null = null; 

  private connectionError = true;

  @query('toast-message') private toastMessage!: ToastMessage;
  @query('settings-controller') private settingsController!: SettingsController;
  @query('#sentence-input') private sentenceInput!: HTMLTextAreaElement;

  constructor() {
    super();
    this.outputNode.connect(this.audioContext.destination);
  }

  private async connectToSession() {
    try {
      this.session = await ai.live.music.connect({
        model: model,
        callbacks: {
          onmessage: async (e: LiveMusicServerMessage) => {
            console.log('Received message from the server:', e);
            if (e.setupComplete) {
              this.connectionError = false;
            }
            if (e.filteredPrompt) {
              this.filteredReason = e.filteredPrompt.filteredReason;
              this.toastMessage.show(`프롬프트가 필터링되었습니다: ${e.filteredPrompt.filteredReason}`);
              this.currentSentence = ''; 
              if(this.sentenceInput) this.sentenceInput.value = ''; 
              this.stopAudio(); 
              this.isOverallLoading = false; 
            }
            if (e.serverContent?.audioChunks !== undefined) {
              if (
                this.playbackState === 'paused' ||
                this.playbackState === 'stopped'
              ) {
                return;
              }
              const audioBuffer = await decodeAudioData(
                decode(e.serverContent?.audioChunks[0].data),
                this.audioContext,
                this.sampleRate,
                2, 
              );
              const source = this.audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);

              const currentTime = this.audioContext.currentTime;
              if (this.nextStartTime === 0) { 
                this.nextStartTime = currentTime + this.bufferTime;
                setTimeout(() => {
                  if (this.playbackState === 'loading') { 
                     this.playbackState = 'playing';
                  }
                }, this.bufferTime * 1000);
              }

              if (this.nextStartTime < currentTime) {
                console.warn('Audio underrun, resetting nextStartTime');
                this.toastMessage.show('네트워크 지연으로 오디오 버퍼링 중...');
                this.playbackState = 'loading'; 
                this.nextStartTime = currentTime + this.bufferTime; 
              }
              source.start(this.nextStartTime);
              this.nextStartTime += audioBuffer.duration;
            }
          },
          onerror: (evt: ErrorEvent) => { 
            console.error('Error occurred:', evt);
            this.connectionError = true;
            this.stopAudio(); 
            this.isOverallLoading = false; 
            this.toastMessage.show('Lyria 연결 오류가 발생했습니다.');
          },
          onclose: (evt: CloseEvent) => { 
            console.log('Connection closed:', evt);
            if (!evt.wasClean) { 
              this.connectionError = true;
              this.stopAudio();
              this.isOverallLoading = false; 
              this.toastMessage.show('Lyria 연결이 예기치 않게 닫혔습니다.');
            }
          },
        },
      });
      this.connectionError = false; 
    } catch (error) {
        console.error("Failed to connect to session:", error);
        this.connectionError = true;
        throw error; 
    }
  }

  private setSessionPromptsThrottled = throttle(async () => {
    if (!this.session || this.currentSentence.trim() === '') {
      return;
    }
    if (this.filteredReason && this.currentSentence === '') {
        return;
    }

    try {
      await this.session.setWeightedPrompts({
        weightedPrompts: [{text: this.currentSentence, weight: 1.0}],
      });
      this.filteredReason = null; 
    } catch (e) {
      this.toastMessage.show(`프롬프트 설정 오류: ${e.message}`);
      this.pauseAudio(); 
      throw e; 
    }
  }, 200);

  private async setupAndPlayMusic(): Promise<void> {
    this.currentSentence = this.sentenceInput.value.trim();
    
    if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
    }
    this.outputNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    if (this.connectionError || !this.session) {
      try {
        await this.connectToSession();
      } catch (error) {
        this.playbackState = 'stopped'; 
        throw new Error(`Lyria 세션 연결 실패: ${error.message}`);
      }
    }
    
    this.nextStartTime = 0; 
    if (this.outputNode) { 
        this.outputNode.disconnect();
        this.outputNode = this.audioContext.createGain();
        this.outputNode.connect(this.audioContext.destination);
    }

    await this.setSessionPromptsThrottled(); 

    this.session?.play(); 
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.5); 
  }

  private async generateAlbumCover(): Promise<void> {
    if (!this.currentSentence) return;
    this.isGeneratingImage = true;
    let englishImagePrompt = '';

    try {
        const koreanImagePrompt = `앨범 커버 아트: "${this.currentSentence}". 시각적으로 인상적이고 분위기를 잘 나타내는 스타일. 밝고 즐거운 느낌.`;
        
        // 1. Translate Korean prompt to English
        try {
            const translationRequestPrompt = `Translate the following Korean text, which is a prompt for an image generation model, into a concise and effective English prompt. Preserve the artistic intent and descriptive elements. Korean text: '${koreanImagePrompt}'`;
            const translationResponse: GenerateContentResponse = await ai.models.generateContent({
                model: textModel,
                contents: translationRequestPrompt,
            });
            englishImagePrompt = translationResponse.text.trim();

            if (!englishImagePrompt) {
                throw new Error("프롬프트 번역 결과가 비어있습니다.");
            }
            console.log("Translated English Prompt:", englishImagePrompt);

        } catch (translationError) {
            console.error("앨범 커버 프롬프트 번역 실패:", translationError);
            this.toastMessage.show(`앨범 커버 프롬프트 번역 실패: ${translationError.message}`);
            this.albumCoverUrl = null;
            // Do not set isGeneratingImage to false here, finally block will handle it.
            return; // Stop further execution if translation fails
        }

        // 2. Generate image with the translated English prompt
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: englishImagePrompt,
            config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
        });

        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            this.albumCoverUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("생성된 이미지가 없습니다 (번역된 프롬프트 사용).");
        }
    } catch (error) {
        console.error("앨범 커버 생성 실패 (번역 후):", error);
        this.toastMessage.show(`앨범 커버 생성 실패: ${error.message}`);
        this.albumCoverUrl = null; 
    } finally {
        this.isGeneratingImage = false;
    }
  }

  private async generateLyrics(): Promise<void> {
    if (!this.currentSentence) return;
    this.isGeneratingLyrics = true;
    try {
        const lyricsPrompt = `다음 음악 설명에 어울리는 밝고 즐거운 노래 가사를 작성해주세요: "${this.currentSentence}". 음악의 분위기와 주제를 반영하고, 간결하게 몇 소절과 후렴구를 포함해주세요. 가사는 줄바꿈으로 구분됩니다.`;
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: textModel,
          contents: lyricsPrompt,
        });
        let lyricsText = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = lyricsText.match(fenceRegex);
        if (match && match[2]) {
            lyricsText = match[2].trim();
        }
        this.suggestedLyrics = lyricsText ?? "가사 생성에 실패했습니다.";
    } catch (error) {
        console.error("가사 생성 실패:", error);
        this.toastMessage.show(`가사 생성 실패: ${error.message}`);
        this.suggestedLyrics = "가사 생성 중 오류가 발생했습니다.";
    } finally {
        this.isGeneratingLyrics = false;
    }
  }

  private async handleGenerateMusic() {
    this.currentSentence = this.sentenceInput.value.trim();
    if (this.currentSentence === '') {
      this.toastMessage.show('음악을 생성하려면 문장을 입력하세요.');
      return;
    }

    this.isOverallLoading = true;
    this.playbackState = 'loading';
    this.albumCoverUrl = null;
    this.suggestedLyrics = null;
    this.filteredReason = null; 

    const musicSetupPromise = this.setupAndPlayMusic().catch(err => {
        console.error("음악 설정/재생 실패:", err);
        this.toastMessage.show(`음악 생성 실패: ${err.message}`);
        if(this.playbackState === 'loading') this.playbackState = 'stopped';
        return Promise.reject(err); 
    });
    const albumCoverPromise = this.generateAlbumCover(); 
    const lyricsPromise = this.generateLyrics(); 

    try {
        await Promise.allSettled([musicSetupPromise, albumCoverPromise, lyricsPromise]);
    } catch (error) {
        console.error("하나 이상의 생성 작업 중 오류 발생:", error);
    } finally {
        this.isOverallLoading = false;
        if (this.playbackState === 'loading' && (this.connectionError || this.filteredReason)) {
            this.playbackState = 'stopped';
        }
    }
  }

  private handleTogglePlayback = async () => {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    switch (this.playbackState) {
      case 'playing':
        this.pauseAudio();
        break;
      case 'paused':
        this.resumeAudio();
        break;
      case 'stopped':
        if (this.currentSentence.trim() !== '' && !this.isOverallLoading) {
          this.handleGenerateMusic();
        } else if (this.isOverallLoading) {
          this.toastMessage.show('현재 음악 생성 중입니다.');  
        } else {
          this.toastMessage.show('먼저 문장을 입력하고 생성 버튼을 누르세요.');
        }
        break;
      case 'loading':
        this.stopAudio(); 
        this.isOverallLoading = false; 
        this.toastMessage.show('음악 생성이 중단되었습니다.');
        break;
    }
  };

  private pauseAudio() {
    this.session?.pause();
    this.playbackState = 'paused';
    this.outputNode.gain.setValueAtTime(this.outputNode.gain.value, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
  }

  private resumeAudio() {
    if (!this.session) {
        this.toastMessage.show("세션이 없습니다. 새로 생성해주세요.");
        this.playbackState = 'stopped';
        return;
    }
    this.session.play(); 
    this.playbackState = 'playing'; 
    this.outputNode.gain.setValueAtTime(this.outputNode.gain.value, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.2);
  }

  private stopAudio() {
    this.session?.stop();
    this.playbackState = 'stopped';
    if (this.outputNode) { 
        this.outputNode.gain.setValueAtTime(this.outputNode.gain.value, this.audioContext.currentTime);
        this.outputNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
    }
    this.nextStartTime = 0;
  }

  private updateSettings = throttle(
    async (e: CustomEvent<LiveMusicGenerationConfig>) => {
      if (!this.session) {
        // Store settings for next session
      }
      try {
        await this.session?.setMusicGenerationConfig({ 
          musicGenerationConfig: e.detail,
        });
        if (this.session) {
            this.toastMessage.show('설정이 적용되었습니다. 다음 생성부터 반영됩니다.');
        }
      } catch (error) {
        this.toastMessage.show(`설정 적용 오류: ${error.message}`);
      }
    },
    200,
  );

  private async handleReset() {
    this.stopAudio(); 
    this.currentSentence = '';
    if(this.sentenceInput) this.sentenceInput.value = '';
    this.filteredReason = null;
    this.albumCoverUrl = null;
    this.suggestedLyrics = null;
    this.isGeneratingImage = false;
    this.isGeneratingLyrics = false;
    this.isOverallLoading = false;

    if (this.session && !this.connectionError) {
        try {
            await this.session.resetContext();
            this.toastMessage.show('세션 및 설정이 초기화되었습니다.');
        } catch (error) {
            this.toastMessage.show(`세션 초기화 오류: ${error.message}`);
            await this.session.close();
            this.session = undefined;
            this.connectionError = true;
        }
    }
    
    this.settingsController.resetToDefaults(); 
    this.playbackState = 'stopped';
  }

  private handleSentenceInputChange(e: Event) {
    // Current sentence is read directly from input on generate
  }

  private renderBackgroundNotes() {
    const noteTypes = ['♪', '♫', '♩', '♬', '♭', '♯', '𝅘𝅥𝅮', '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝆔', '𝆕'];
    const notes = [];
    const numNotes = 20; // 늘어난 음표 개수

    for (let i = 0; i < numNotes; i++) {
      const type = noteTypes[Math.floor(Math.random() * noteTypes.length)];
      const duration = 7 + Math.random() * 8; // 7~15초
      const delay = Math.random() * 15; // 0~15초 지연
      const hue = 180 + Math.random() * 150; // 180(cyan) ~ 330(magenta/pink)
      
      const style = `
        left: ${Math.random() * 100}%;
        font-size: ${1.8 + Math.random() * 2.2}vmin; /* 1.8 ~ 4.0 vmin */
        color: hsla(${hue}, 75%, 70%, 0.35); /* 더 다양한 색상, 약간 더 진하게 */
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --start-x: ${Math.random() * 50 - 25}vw; /* -25vw ~ +25vw */
        --end-x: ${Math.random() * 70 - 35}vw;   /* -35vw ~ +35vw */
        --start-rotate: ${Math.random() * 180 - 90}deg; /* -90deg ~ +90deg */
        --end-rotate: ${Math.random() * 720 - 360}deg; /* -360deg ~ +360deg */
      `;
      notes.push(html`<span class="music-note" style=${style}>${type}</span>`);
    }
    return notes;
  }

  override render() {
    return html`
      <div id="background">
        ${this.renderBackgroundNotes()}
      </div>
      <h1 class="app-title">바이브 오프 뮤직</h1>
      <div class="main-content-area">
        <div class="generated-extras-container">
          ${this.isGeneratingImage ? html`<div class="loading-placeholder anticipation-message">당신의 음악에 어울리는 환상적인 앨범 커버를 그리고 있어요! (프롬프트 번역 중...) 🎨✨</div>` : ''}
          ${!this.isGeneratingImage && this.albumCoverUrl ? html`<img id="album-cover-image" src="${this.albumCoverUrl}" alt="생성된 앨범 커버">` : ''}
          ${!this.isGeneratingImage && !this.albumCoverUrl && !this.isOverallLoading && (!this.currentSentence || this.playbackState === 'stopped') ? html`<div class="empty-state-placeholder">이곳에 멋진 앨범 커버가 나타날 거예요! 문장을 입력하고 음악을 생성해보세요. ✨</div>` : ''}
          ${!this.isGeneratingImage && !this.albumCoverUrl && this.isOverallLoading === false && this.currentSentence !== '' && this.playbackState !== 'stopped' && !this.isGeneratingImage ? html`<div class="empty-state-placeholder">앨범 커버를 표시할 공간입니다. 생성이 안되었거나 오류가 있을 수 있어요.</div>` : ''}


          ${this.isGeneratingLyrics ? html`<div class="loading-placeholder anticipation-message">음악의 스토리를 담아 가사를 작곡하고 있어요... 멜로디가 들리나요? 🎶📝</div>` : ''}
          ${!this.isGeneratingLyrics && this.suggestedLyrics ? html`<div id="lyrics-display"><p>추천 가사:</p><div .innerHTML=${this.suggestedLyrics.replace(/\n/g, '<br>')}></div></div>` : ''}
          ${!this.isGeneratingLyrics && !this.suggestedLyrics && !this.isOverallLoading && (!this.currentSentence || this.playbackState === 'stopped') ? html`<div class="empty-state-placeholder">음악에 생명을 불어넣을 가사가 여기에 준비될 거예요! 멜로디를 상상하며 만들어보세요. 🎤</div>` : ''}
          ${!this.isGeneratingLyrics && !this.suggestedLyrics && this.isOverallLoading === false && this.currentSentence !== '' && this.playbackState !== 'stopped' && !this.isGeneratingLyrics ? html`<div class="empty-state-placeholder">추천 가사를 표시할 공간입니다. 생성이 안되었거나 오류가 있을 수 있어요.</div>` : ''}
        </div>

        <div class="input-area">
          <textarea
            id="sentence-input"
            .value=${this.currentSentence}
            @input=${this.handleSentenceInputChange}
            placeholder="표현하고 싶은 음악을 문장으로 설명해주세요. (예: 밝고 신나는 K-Pop 댄스곡)"
            aria-label="음악 설명 입력"
            ?disabled=${this.isOverallLoading}
          ></textarea>
          <button 
            id="generate-button" 
            @click=${this.handleGenerateMusic}
            ?disabled=${this.isOverallLoading}
            aria-label="음악, 앨범 커버, 가사 생성 시작"
          >
            ${this.isOverallLoading ? '생성 중...' : '바이브 생성!'}
          </button>
        </div>

        <div id="settings-container">
          <settings-controller
            @settings-changed=${this.updateSettings}
          ></settings-controller>
        </div>

        <div class="playback-container">
          <play-pause-button
            @click=${this.handleTogglePlayback}
            .playbackState=${this.playbackState}
            aria-label=${this.playbackState === 'playing' ? '일시정지' : (this.playbackState === 'loading' ? '로딩 중' : '재생')}
          ></play-pause-button>
          <reset-button 
            @click=${this.handleReset}
            aria-label="입력, 음악, 앨범 커버, 가사 초기화"
            ?disabled=${this.isOverallLoading}
          ></reset-button>
        </div>
      </div>
      <toast-message></toast-message>
    `;
  }
}

function main(container: HTMLElement) {
  const app = new PromptDj();
  container.appendChild(app);
}

main(document.body);

declare global {
  interface HTMLElementTagNameMap {
    'prompt-dj': PromptDj;
    'settings-controller': SettingsController;
    'play-pause-button': PlayPauseButton;
    'reset-button': ResetButton;
    'toast-message': ToastMessage;
  }
  interface Window { 
    webkitAudioContext: typeof AudioContext;
  }
}
