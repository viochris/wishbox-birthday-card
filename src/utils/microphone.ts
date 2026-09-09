// Microphone blow detection helper

export class BlowDetector {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private isListening = false;
  private onBlowDetected: (() => void) | null = null;
  private blowThresholdCount = 0;

  public async start(onBlow: () => void): Promise<'granted' | 'denied' | 'unsupported'> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return 'unsupported';
    }

    this.onBlowDetected = onBlow;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;

      source.connect(this.analyser);
      this.isListening = true;
      this.blowThresholdCount = 0;
      this.listenLoop();

      return 'granted';
    } catch {
      this.stop();
      return 'denied';
    }
  }

  private listenLoop = () => {
    if (!this.isListening || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate energy in low-to-mid turbulence frequencies (blowing creates broad low frequency air pressure)
    let lowEnergy = 0;
    for (let i = 2; i < 20; i++) {
      lowEnergy += dataArray[i];
    }
    const avgLowEnergy = lowEnergy / 18;

    // Check if sound volume exceeds blow threshold consistently
    if (avgLowEnergy > 85) {
      this.blowThresholdCount++;
      if (this.blowThresholdCount >= 4) {
        if (this.onBlowDetected) {
          this.onBlowDetected();
          this.stop();
          return;
        }
      }
    } else {
      this.blowThresholdCount = Math.max(0, this.blowThresholdCount - 1);
    }

    this.animFrameId = requestAnimationFrame(this.listenLoop);
  };

  public stop() {
    this.isListening = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
  }
}
