// Web Audio API Synthesizer for Background Music and Celebration Sound Effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isPlayingMusic = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentStep = 0;

  // Tender, warm, upbeat instrumental arpeggio progression (C major / G / Am / F warm pentatonic lullaby)
  private readonly melodyNotes = [
    // Measure 1: C - E - G - B - C5
    [261.63, 329.63, 392.00, 493.88, 523.25],
    // Measure 2: G - B - D - G4 - B4
    [196.00, 246.94, 293.66, 392.00, 493.88],
    // Measure 3: A - C - E - A4 - C5
    [220.00, 261.63, 329.63, 440.00, 523.25],
    // Measure 4: F - A - C - F4 - A4
    [174.61, 220.00, 261.63, 349.23, 440.00],
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlayingMusic(): boolean {
    return this.isPlayingMusic;
  }

  public startMusic() {
    this.initContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Play tender note every 340ms (relaxing & upbeat birthday music-box vibe)
    let chordIndex = 0;
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingMusic || !this.ctx || !this.musicGain) return;

      const chord = this.melodyNotes[chordIndex];
      const freq = chord[noteIndex];

      this.playMusicBoxNote(freq);

      // Play soft warm bass pad on root notes
      if (noteIndex === 0) {
        this.playWarmBassNote(chord[0] / 2);
      }

      noteIndex++;
      if (noteIndex >= chord.length) {
        noteIndex = 0;
        chordIndex = (chordIndex + 1) % this.melodyNotes.length;
      }
    };

    playNextNote();
    this.musicInterval = window.setInterval(playNextNote, 320);
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  private playMusicBoxNote(freq: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with soft harmonic overtone for music-box chime effect
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // AudioContext state error safety
    }
  }

  private playWarmBassNote(freq: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // Audio safety
    }
  }

  // --- SOUND EFFECTS ---

  public playCandleBlowSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // White noise buffer for wind puff
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.6);

      // Magical sparkle chime immediately following
      setTimeout(() => this.playSparkleChime(), 200);
    } catch {
      // ignore
    }
  }

  public playSparkleChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime + i * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.75);
      });
    } catch {
      // ignore
    }
  }

  public playGiftUnwrapSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Ribbon slide sound (filtered noise)
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.linearRampToValueAtTime(3200, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.4);

      // Pop / celebration chime
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const chimeNow = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, chimeNow);
        osc.frequency.exponentialRampToValueAtTime(880, chimeNow + 0.12);

        oscGain.gain.setValueAtTime(0.25, chimeNow);
        oscGain.gain.exponentialRampToValueAtTime(0.001, chimeNow + 0.5);

        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.start(chimeNow);
        osc.stop(chimeNow + 0.55);

        this.playSparkleChime();
      }, 250);
    } catch {
      // ignore
    }
  }

  public playConfettiFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const fanfare = [
        { freq: 523.25, delay: 0 },
        { freq: 659.25, delay: 0.1 },
        { freq: 783.99, delay: 0.2 },
        { freq: 1046.50, delay: 0.35 }
      ];

      fanfare.forEach(note => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime + note.delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.85);
      });
    } catch {
      // ignore
    }
  }

  public playButtonPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
