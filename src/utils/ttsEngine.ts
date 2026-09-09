// Web Speech API text-to-speech engine for read-aloud letter narration
// Uses phrase-level chunking to avoid Chrome's silent resume bug
// while providing seamless, in-place continuation on Pause and Resume.

export interface TTSState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
}

export interface SpeechSegment {
  itemIndex: number;
  text: string;
}

/**
 * Splits text into natural, bite-sized spoken phrases (4-8 words).
 * This ensures that when paused and resumed, speech continues right from
 * the current phrase rather than restarting the whole paragraph from the top,
 * and avoids the browser's silent-freeze bug with native SpeechSynthesis.resume().
 */
function splitTextIntoSegments(items: string[]): SpeechSegment[] {
  const segments: SpeechSegment[] = [];

  items.forEach((item, itemIndex) => {
    const trimmed = item.trim();
    if (!trimmed) return;

    // Split into sentences first
    const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [trimmed];

    for (const sentence of sentences) {
      const s = sentence.trim();
      if (!s) continue;

      const words = s.split(/\s+/);
      // If the sentence is short (up to 7 words), keep it as a single segment
      if (words.length <= 7) {
        segments.push({ itemIndex, text: s });
        continue;
      }

      // If longer, split along punctuation clauses (commas, semicolons, dashes)
      const clauses = s.match(/[^,;:—\-]+[,;:—\-]+|[^,;:—\-]+$/g) || [s];
      let currentChunk: string[] = [];

      for (const clause of clauses) {
        const cWords = clause.trim().split(/\s+/).filter(Boolean);
        if (cWords.length === 0) continue;

        if (currentChunk.length + cWords.length <= 8) {
          currentChunk.push(clause.trim());
        } else {
          if (currentChunk.length > 0) {
            segments.push({ itemIndex, text: currentChunk.join(' ') });
            currentChunk = [];
          }

          // If an individual clause itself is unusually long (> 8 words), chunk by words
          if (cWords.length > 8) {
            for (let i = 0; i < cWords.length; i += 6) {
              const slice = cWords.slice(i, i + 6).join(' ');
              segments.push({ itemIndex, text: slice });
            }
          } else {
            currentChunk.push(clause.trim());
          }
        }
      }

      if (currentChunk.length > 0) {
        segments.push({ itemIndex, text: currentChunk.join(' ') });
      }
    }
  });

  return segments;
}

export class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private segments: SpeechSegment[] = [];
  private onStateChange: ((state: TTSState) => void) | null = null;
  private currentSegmentIdx = -1;
  private isPlayingState = false;
  private isPausedState = false;
  private stepTimeout: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Pre-warm voices
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          // Voices available
        };
      }
    }
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public subscribe(callback: (state: TTSState) => void) {
    this.onStateChange = callback;
    this.emitState();
  }

  private emitState() {
    if (this.onStateChange) {
      const currentItemIdx = 
        this.currentSegmentIdx >= 0 && this.currentSegmentIdx < this.segments.length
          ? this.segments[this.currentSegmentIdx].itemIndex
          : -1;

      this.onStateChange({
        isSupported: this.isAvailable(),
        isPlaying: this.isPlayingState,
        isPaused: this.isPausedState,
        currentParagraphIndex: currentItemIdx
      });
    }
  }

  private clearStepTimeout() {
    if (this.stepTimeout !== null) {
      clearTimeout(this.stepTimeout);
      this.stepTimeout = null;
    }
  }

  public startReading(items: string[], startIndex = 0) {
    if (!this.synth) return;
    this.stop();

    this.segments = splitTextIntoSegments(items);
    if (this.segments.length === 0) return;

    // Find first segment corresponding to startIndex item
    const targetSegmentIdx = this.segments.findIndex(s => s.itemIndex >= startIndex);
    this.currentSegmentIdx = targetSegmentIdx !== -1 ? targetSegmentIdx : 0;

    this.isPlayingState = true;
    this.isPausedState = false;
    this.emitState();

    this.clearStepTimeout();
    this.stepTimeout = window.setTimeout(() => {
      this.speakSegment(this.currentSegmentIdx);
    }, 40);
  }

  private getPreferredVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    try {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return null;

      const preferredVoice = voices.find(
        v => v.lang.startsWith('en') && (
          v.name.includes('Natural') || 
          v.name.includes('Google') || 
          v.name.includes('Samantha') || 
          v.name.includes('Karen') ||
          v.name.includes('Female')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      return preferredVoice || voices[0] || null;
    } catch {
      return null;
    }
  }

  private speakSegment(index: number) {
    if (!this.synth || !this.isPlayingState || this.isPausedState) {
      return;
    }

    if (index >= this.segments.length) {
      this.stop();
      return;
    }

    this.currentSegmentIdx = index;
    const segment = this.segments[index];

    // Ensure audio channel is clean
    try {
      this.synth.cancel();
    } catch {
      // Ignore
    }

    const utterance = new SpeechSynthesisUtterance(segment.text);
    this.currentUtterance = utterance;

    const voice = this.getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.02;

    utterance.onend = () => {
      if (!this.isPlayingState || this.isPausedState) return;

      const nextIdx = index + 1;
      if (nextIdx < this.segments.length) {
        // If next segment belongs to a different paragraph/item, add a slight conversational pause
        const isNextParagraph = this.segments[nextIdx].itemIndex !== segment.itemIndex;
        const delay = isNextParagraph ? 350 : 40;

        this.clearStepTimeout();
        this.stepTimeout = window.setTimeout(() => {
          if (this.isPlayingState && !this.isPausedState) {
            this.speakSegment(nextIdx);
          }
        }, delay);
      } else {
        this.stop();
      }
    };

    utterance.onerror = (e) => {
      // Interrupted or canceled is expected during pause/stop
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      
      // On other errors, smoothly advance to next phrase
      if (this.isPlayingState && !this.isPausedState) {
        this.clearStepTimeout();
        this.stepTimeout = window.setTimeout(() => {
          this.speakSegment(index + 1);
        }, 50);
      }
    };

    this.emitState();

    try {
      this.synth.speak(utterance);
    } catch {
      // Graceful fallback
    }
  }

  public pause() {
    if (!this.synth || !this.isPlayingState) return;
    this.clearStepTimeout();

    this.isPausedState = true;
    this.isPlayingState = false;

    // Immediately stop current audio
    try {
      this.synth.cancel();
    } catch {
      // Ignore
    }

    this.emitState();
  }

  public resume() {
    if (!this.synth || !this.isPausedState) return;
    this.clearStepTimeout();

    this.isPlayingState = true;
    this.isPausedState = false;
    this.emitState();

    // Small delay ensures the browser audio pipeline is reset and fresh for speak()
    this.stepTimeout = window.setTimeout(() => {
      if (this.isPlayingState && !this.isPausedState) {
        this.speakSegment(this.currentSegmentIdx >= 0 ? this.currentSegmentIdx : 0);
      }
    }, 60);
  }

  public stop() {
    this.clearStepTimeout();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore
      }
    }
    this.isPlayingState = false;
    this.isPausedState = false;
    this.currentSegmentIdx = -1;
    this.segments = [];
    this.emitState();
  }
}

export const ttsEngine = new TTSEngine();
