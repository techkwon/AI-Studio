export enum SoundType {
  DROP = 'drop',
  MERGE = 'merge',
  GAME_OVER = 'game_over',
  SCORE_UP = 'score_up',
  NEW_DISCOVERY = 'new_discovery',
  ENCYCLOPEDIA_SELECT = 'encyclopedia_select',
  BUTTON_CLICK = 'button_click',
  BACKGROUND_MUSIC_START = 'bgm_start', 
  BACKGROUND_MUSIC_STOP = 'bgm_stop',   
}

const SFX_ENABLED_KEY = 'transportationGameSfxEnabled_v1';
const BGM_ENABLED_KEY = 'transportationGameBgmEnabled_v1';


class SoundServiceController {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null; 
  private isMuted: boolean = false; // Master mute, not currently exposed via UI but kept for potential use
  private backgroundMusicSource: AudioBufferSourceNode | null = null;
  private backgroundMusicPlaying: boolean = false;
  private musicInitialized: boolean = false; 

  private sfxEnabled: boolean;
  private bgmEnabled: boolean;
  private defaultMusicVolume = 0.08; // Reduced default music volume

  constructor() {
    const sfxStored = localStorage.getItem(SFX_ENABLED_KEY);
    this.sfxEnabled = sfxStored !== null ? JSON.parse(sfxStored) : true;

    const bgmStored = localStorage.getItem(BGM_ENABLED_KEY);
    this.bgmEnabled = bgmStored !== null ? JSON.parse(bgmStored) : true;

    // Call _getAudioContext to initialize nodes if possible, it will handle suspended state.
    // Actual audio play will also trigger this if not yet initialized.
     this._getAudioContext(); 
  }

  private _getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = this.isMuted ? 0 : 1;
        
        this.musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.masterGain); 
        this.musicGain.gain.value = this.bgmEnabled ? this.defaultMusicVolume : 0;

      } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        return null;
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(e => console.error("Error resuming AudioContext in _getAudioContext:", e));
    }
    return this.audioContext;
  }
  
  private _playBeep(type: SoundType) {
    const context = this._getAudioContext();
    if (!context || !this.masterGain) {
      return;
    }
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain(); 

    gainNode.connect(this.masterGain); 
    oscillator.connect(gainNode);

    let freq = 440; 
    let duration = 0.1;
    gainNode.gain.setValueAtTime(0.1, context.currentTime); 

    switch(type) {
      case SoundType.DROP:
        freq = 300;
        gainNode.gain.setValueAtTime(0.08, context.currentTime);
        break;
      case SoundType.MERGE:
        freq = 600;
        duration = 0.15;
        gainNode.gain.setValueAtTime(0.12, context.currentTime);
        break;
      case SoundType.SCORE_UP:
        freq = 800;
        duration = 0.05;
        gainNode.gain.setValueAtTime(0.05, context.currentTime);
        break;
      case SoundType.NEW_DISCOVERY:
        freq = 900; 
        duration = 0.3;
        oscillator.frequency.setValueAtTime(700, context.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, context.currentTime + duration * 0.8);
        gainNode.gain.setValueAtTime(0.15, context.currentTime);
        break;
      case SoundType.GAME_OVER:
        freq = 200;
        duration = 0.5;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.1, context.currentTime);
        break;
      case SoundType.ENCYCLOPEDIA_SELECT:
        freq = 523.25; 
        gainNode.gain.setValueAtTime(0.07, context.currentTime);
        break;
      case SoundType.BUTTON_CLICK:
        freq = 440; 
        gainNode.gain.setValueAtTime(0.06, context.currentTime);
        duration = 0.08;
        break;
      default:
        return;
    }

    if (type !== SoundType.NEW_DISCOVERY) { 
        oscillator.frequency.setValueAtTime(freq, context.currentTime);
    }
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  }

  private _initializeMusic() {
    if (this.backgroundMusicSource) {
        try {
            this.backgroundMusicSource.stop();
        } catch (e) { /* Ignore */ }
        this.backgroundMusicSource.disconnect(); 
        this.backgroundMusicSource = null;
    }

    const context = this._getAudioContext();
    if (!context || !this.musicGain) {
        this.musicInitialized = false; 
        return;
    }

    const baseTempo = 140; 
    const eighthNoteTime = 60 / baseTempo / 2;
    const sequence = [
        { note: 261.63, duration: eighthNoteTime }, // C4
        { note: 329.63, duration: eighthNoteTime }, // E4
        { note: 392.00, duration: eighthNoteTime }, // G4
        { note: 493.88, duration: eighthNoteTime }, // B4
        { note: 392.00, duration: eighthNoteTime }, // G4
        { note: 329.63, duration: eighthNoteTime }, // E4
    ];
    let totalTime = sequence.reduce((sum, val) => sum + val.duration, 0);
    
    const buffer = context.createBuffer(1, context.sampleRate * totalTime, context.sampleRate);
    const channelData = buffer.getChannelData(0);

    let currentTimeInSamples = 0; 
    for (const item of sequence) {
        const attackSamples = Math.floor(0.01 * context.sampleRate);
        const itemDurationSamples = Math.floor(item.duration * context.sampleRate);
        const decaySamples = Math.floor(item.duration * 0.8 * context.sampleRate) - attackSamples;
        const releaseSamples = itemDurationSamples - attackSamples - decaySamples;

        for (let i = 0; i < itemDurationSamples; i++) {
            const t_local = i / context.sampleRate; 
            let envelope = 0;
            if (i < attackSamples) { 
                envelope = i / attackSamples;
            } else if (i < attackSamples + decaySamples) { 
                envelope = 1 - ( (i - attackSamples) / decaySamples ) * 0.5; 
            } else { 
                if (releaseSamples > 0) {
                   envelope = 0.5 * (1 - (i - attackSamples - decaySamples) / releaseSamples);
                } else {
                   envelope = 0.5; 
                }
            }
            envelope = Math.max(0, envelope);
            
            const sampleIdx = currentTimeInSamples + i;
            if (sampleIdx < channelData.length) {
                 channelData[sampleIdx] += Math.sin(item.note * 2 * Math.PI * t_local) * envelope * 0.5;
            }
        }
        currentTimeInSamples += itemDurationSamples;
    }
    
    this.backgroundMusicSource = context.createBufferSource();
    this.backgroundMusicSource.buffer = buffer;
    this.backgroundMusicSource.loop = true;
    this.backgroundMusicSource.connect(this.musicGain);
    this.musicInitialized = true; 
  }

  public playSound(type: SoundType): void {
    if (!this.sfxEnabled || this.isMuted) return; // Check sfxEnabled and master mute
    this._playBeep(type);
  }

  public startBackgroundMusic(): void {
    const context = this._getAudioContext();
    if (!context || !this.musicGain || this.isMuted) { // Check master mute
      if (this.backgroundMusicPlaying) this.pauseBackgroundMusic();
      return;
    }

    if (!this.bgmEnabled) {
      if (this.backgroundMusicPlaying) this.pauseBackgroundMusic();
      return;
    }

    if (this.backgroundMusicPlaying) return;

    // Ensure musicGain volume is correct if it was previously set to 0 by toggleBgmEnabled
    if (this.musicGain.gain.value === 0 && this.bgmEnabled) {
       this.musicGain.gain.value = this.defaultMusicVolume;
    }
    
    if (!this.backgroundMusicSource || !this.musicInitialized) {
      this._initializeMusic();
    }

    if (!this.backgroundMusicSource || !this.musicInitialized) {
      console.error("BGM: Failed to initialize or re-initialize music source.");
      return;
    }

    const playLogic = () => {
      if (this.backgroundMusicSource && !this.backgroundMusicPlaying && this.musicInitialized && this.bgmEnabled && !this.isMuted) {
        try {
          this.backgroundMusicSource.start(0);
          this.backgroundMusicPlaying = true;
        } catch (e) {
          console.error("BGM: Error on start(). This might indicate an issue with source state.", e);
          this.backgroundMusicPlaying = false;
          this.musicInitialized = false; 
          if (this.backgroundMusicSource) {
            try { this.backgroundMusicSource.disconnect(); } catch(errD) { /* ignore */ }
          }
          this.backgroundMusicSource = null; 
        }
      }
    };

    if (context.state === 'suspended') {
      context.resume().then(() => {
        playLogic();
      }).catch(e => console.error("BGM: Error resuming AudioContext:", e));
    } else {
      playLogic();
    }
  }

  public pauseBackgroundMusic(): void {
    if (this.backgroundMusicSource && this.backgroundMusicPlaying) {
      try {
        this.backgroundMusicSource.stop();
      } catch (e) { /* Ignore */ }
    }
    this.backgroundMusicPlaying = false;
    this.musicInitialized = false; 
    if (this.backgroundMusicSource) {
        try { this.backgroundMusicSource.disconnect(); } catch (e) { /* ignore */ }
        this.backgroundMusicSource = null; 
    }
  }

  public stopBackgroundMusic(): void {
    this.pauseBackgroundMusic(); 
  }

  // Master Mute - not actively used by UI but available
  public toggleMute(): void {
    const context = this._getAudioContext();
    if (!context || !this.masterGain) return;

    this.isMuted = !this.isMuted;
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, context.currentTime);
    
    if (this.isMuted) { // If master muted, ensure BGM is paused
        if(this.backgroundMusicPlaying) this.pauseBackgroundMusic();
    } else { // If master unmuted, and BGM should be playing, try starting it
        if(this.bgmEnabled) this.startBackgroundMusic();
    }
  }
  public getIsMuted(): boolean {
      return this.isMuted;
  }

  // SFX Toggle
  public toggleSfxEnabled(): void {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem(SFX_ENABLED_KEY, JSON.stringify(this.sfxEnabled));
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  // BGM Toggle
  public toggleBgmEnabled(): void {
    const context = this._getAudioContext();
    this.bgmEnabled = !this.bgmEnabled;
    localStorage.setItem(BGM_ENABLED_KEY, JSON.stringify(this.bgmEnabled));

    if (context && this.musicGain) {
      if (this.bgmEnabled && !this.isMuted) { // Also check master mute
        this.musicGain.gain.setValueAtTime(this.defaultMusicVolume, context.currentTime);
        // GameScreen will call startBackgroundMusic if game is active
      } else {
        this.musicGain.gain.setValueAtTime(0, context.currentTime);
        if (this.backgroundMusicPlaying) {
            this.pauseBackgroundMusic(); // Stop and release resources if disabling BGM
        }
      }
    }
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }
}

const SoundService = new SoundServiceController();
export default SoundService;