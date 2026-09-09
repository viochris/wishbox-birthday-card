import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Copy, 
  Check, 
  Eye
} from 'lucide-react';
import { LetterContent } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { fireGrandFinaleConfetti } from '../utils/confetti';
import { ttsEngine, TTSState } from '../utils/ttsEngine';

interface ScreenLetterProps {
  letterContent: LetterContent;
  onReplay: () => void;
}

export const ScreenLetter: React.FC<ScreenLetterProps> = ({
  letterContent,
  onReplay
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [copiedCard, setCopiedCard] = useState(false);
  const [ttsState, setTtsState] = useState<TTSState>({
    isSupported: false,
    isPlaying: false,
    isPaused: false,
    currentParagraphIndex: -1
  });
  const letterRef = useRef<HTMLDivElement>(null);

  const paragraphs = letterContent.letterParagraphs;

  // Complete speech items starting from "Dear [Name]," through all paragraphs to the closing
  const readingItems: string[] = [
    `Dear ${letterContent.recipientName},`,
    ...paragraphs,
    `Happy Birthday, ${letterContent.recipientName}! With love, ${letterContent.senderSignature}`
  ];

  // Stagger reveal of paragraphs every 1.1s or on user action
  useEffect(() => {
    // Grand celebration fanfare sound & confetti on letter open
    soundEngine.playConfettiFanfare();
    fireGrandFinaleConfetti();

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < paragraphs.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1100);

    // Subscribe to TTS updates
    ttsEngine.subscribe((state) => {
      setTtsState(state);
      // If reading a paragraph (index 1 to paragraphs.length), ensure it's revealed on screen
      if (state.currentParagraphIndex >= 1) {
        const paraIndex = state.currentParagraphIndex - 1;
        setVisibleCount(prev => Math.max(prev, paraIndex + 1));
      }
    });

    return () => {
      clearInterval(interval);
      ttsEngine.stop();
    };
  }, [paragraphs.length]);

  const handleRevealAll = () => {
    setVisibleCount(paragraphs.length);
    soundEngine.playButtonPop();
  };

  const handleToggleTTS = () => {
    soundEngine.playButtonPop();
    if (ttsState.isPlaying) {
      ttsEngine.pause();
    } else if (ttsState.isPaused) {
      ttsEngine.resume();
    } else {
      ttsEngine.startReading(readingItems, 0);
    }
  };

  const handleStopTTS = () => {
    soundEngine.playButtonPop();
    ttsEngine.stop();
  };

  const handleCopyCard = () => {
    soundEngine.playButtonPop();
    const fullCardText = [
      `Dear ${letterContent.recipientName},`,
      '',
      ...paragraphs,
      '',
      `Happy Birthday, ${letterContent.recipientName}! With love,`,
      letterContent.senderSignature
    ].join('\n\n');

    navigator.clipboard.writeText(fullCardText).then(() => {
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2500);
    });
  };

  return (
    <motion.div
      id="screen-letter"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center"
    >
      {/* Celebration Header Banner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-6"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-semibold tracking-wider uppercase border border-amber-300 shadow-xs mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          The Grand Celebration
        </span>

        <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
          {letterContent.letterTitle || 'Happy Birthday! 🎂'}
        </h1>
        <p className="text-pink-600 font-serif-title italic text-xl sm:text-2xl mt-1">
          For {letterContent.recipientName}
        </p>
      </motion.div>

      {/* Main Letter Stationery Card */}
      <div
        ref={letterRef}
        id="birthday-letter-card"
        className="w-full bg-[#fdfbf7] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-200/90 relative overflow-hidden text-stone-800"
      >
        {/* Decorative Golden Border Frame */}
        <div className="absolute inset-2 sm:inset-3 border border-amber-300/40 rounded-2xl pointer-events-none" />
        <div className="absolute top-4 left-4 text-amber-400/40 text-lg select-none">✦</div>
        <div className="absolute top-4 right-4 text-amber-400/40 text-lg select-none">✦</div>
        <div className="absolute bottom-4 left-4 text-amber-400/40 text-lg select-none">✦</div>
        <div className="absolute bottom-4 right-4 text-amber-400/40 text-lg select-none">✦</div>

        {/* Top Letter Toolbar (TTS Read-Aloud & Fast Reveal) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-amber-100 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
              Personal Letter
            </span>
            {visibleCount < paragraphs.length && (
              <span className="text-[11px] bg-pink-100 text-pink-700 font-medium px-2 py-0.5 rounded-full animate-pulse">
                Revealing {visibleCount} of {paragraphs.length}...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Reveal All Button */}
            {visibleCount < paragraphs.length && (
              <button
                id="btn-reveal-all"
                onClick={handleRevealAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                title="Show full letter immediately"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Show All</span>
              </button>
            )}

            {/* TTS Read-Aloud Button */}
            {ttsState.isSupported && (
              <div className="flex items-center gap-1">
                <button
                  id="btn-tts-read-aloud"
                  onClick={handleToggleTTS}
                  title={ttsState.isPlaying ? "Pause voice narration" : ttsState.isPaused ? "Resume voice narration" : "Read letter aloud from the top"}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-xs transition-colors ${
                    ttsState.isPlaying
                      ? 'bg-pink-500 text-white border-pink-600 shadow-pink-200'
                      : ttsState.isPaused
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  {ttsState.isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : ttsState.isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-pink-500" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>

                {(ttsState.isPlaying || ttsState.isPaused) && (
                  <button
                    id="btn-tts-stop"
                    onClick={handleStopTTS}
                    title="Stop narration"
                    className="p-1.5 text-stone-500 hover:text-stone-800 bg-white border border-amber-200 rounded-lg hover:bg-amber-50"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Salutation (Reads from the very top) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-5 transition-all duration-300 rounded-lg px-2 py-1 -mx-2 ${
            (ttsState.isPlaying || ttsState.isPaused) && ttsState.currentParagraphIndex === 0
              ? 'bg-amber-100/80 border-l-2 border-pink-500 shadow-xs font-bold text-stone-950'
              : ''
          }`}
        >
          <p className="font-serif-title text-xl sm:text-2xl text-stone-900 font-semibold">
            Dear {letterContent.recipientName},
          </p>
        </motion.div>

        {/* Paragraphs with sequential fade-in and TTS highlight */}
        <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
          {paragraphs.slice(0, visibleCount).map((para, idx) => {
            // Index 0 is "Dear...", paragraphs are index 1 to paragraphs.length
            const isCurrentlyReading = (ttsState.isPlaying || ttsState.isPaused) && ttsState.currentParagraphIndex === (idx + 1);

            return (
              <motion.p
                key={`para-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className={`transition-all duration-300 rounded-lg px-2 py-1 -mx-2 ${
                  isCurrentlyReading
                    ? 'bg-amber-100/70 border-l-2 border-pink-500 shadow-xs text-stone-950 font-medium'
                    : 'text-stone-700'
                }`}
              >
                {para}
              </motion.p>
            );
          })}
        </div>

        {/* Closing & Handwritten Signature */}
        {visibleCount >= paragraphs.length && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`mt-8 pt-6 border-t border-amber-200/80 flex flex-col items-end text-right transition-all duration-300 rounded-lg px-2 ${
              (ttsState.isPlaying || ttsState.isPaused) && ttsState.currentParagraphIndex === (paragraphs.length + 1)
                ? 'bg-amber-100/60 border-r-2 border-pink-500'
                : ''
            }`}
          >
            <div className="mb-2">
              <span className="font-serif-title text-xl sm:text-2xl font-bold text-pink-600 inline-flex items-center gap-1.5">
                Happy Birthday, {letterContent.recipientName}! 🎂💖
              </span>
            </div>

            {/* Hand-drawn Calligraphy Signature */}
            <div className="mt-1">
              <span className="font-handwriting text-3xl sm:text-4xl text-amber-900 leading-none select-none block hover:scale-105 transition-transform origin-right">
                {letterContent.senderSignature}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Controls (Clean, no customize name option) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-full mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        {/* Replay Button */}
        <button
          id="btn-replay-celebration"
          onClick={() => {
            soundEngine.playButtonPop();
            onReplay();
          }}
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-xl border border-stone-300 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-pink-600" />
          <span>Replay the Celebration</span>
        </button>

        {/* Copy Card Button */}
        <button
          id="btn-copy-card"
          onClick={handleCopyCard}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          {copiedCard ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Card Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Copy Card</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};
