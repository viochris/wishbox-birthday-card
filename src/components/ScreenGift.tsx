import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { fireSparkleBurst, fireGiftBurstConfetti } from '../utils/confetti';

interface ScreenGiftProps {
  recipientName: string;
  onGiftOpened: () => void;
}

export const ScreenGift: React.FC<ScreenGiftProps> = ({ recipientName, onGiftOpened }) => {
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleUnwrap = () => {
    if (isUnwrapping || isOpened) return;

    setIsUnwrapping(true);
    soundEngine.playGiftUnwrapSFX();
    
    // High-density screen burst and sparkles immediately upon opening
    setTimeout(() => {
      fireSparkleBurst(0.5, 0.45);
      fireGiftBurstConfetti();
      setIsOpened(true);
    }, 450);

    // Smooth transition to Letter screen
    timerRef.current = window.setTimeout(() => {
      onGiftOpened();
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      id="screen-gift"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 w-full max-w-lg mx-auto text-center px-4 flex flex-col items-center justify-center min-h-[75vh]"
    >
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <span className="text-xs font-bold tracking-widest text-pink-700 uppercase bg-pink-100/90 border border-pink-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-pink-600" />
          The Unwrapping
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-3"
      >
        One More Thing... 🎁
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-stone-600 text-sm sm:text-base max-w-sm mx-auto mb-6"
      >
        {isOpened
          ? `Opening your special birthday card, ${recipientName}...`
          : 'A parcel wrapped with care, holding words written just for you.'}
      </motion.p>

      {/* Gift Box Interactive Stage */}
      <div
        id="gift-box-stage"
        onClick={handleUnwrap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUnwrap(); }}
        aria-label="Tap to open gift box"
        className={`relative my-4 cursor-pointer select-none transition-transform duration-300 ${!isUnwrapping && !isOpened ? 'hover:scale-105 active:scale-95' : ''}`}
      >
        {/* Golden Radiant Light Burst when opened */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.8, opacity: [0, 0.9, 0.5] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-amber-300 via-pink-300 to-yellow-200 opacity-60 blur-2xl pointer-events-none -z-10"
            />
          )}
        </AnimatePresence>

        {/* Gift Box Container */}
        <div className="relative w-52 sm:w-60 h-52 sm:h-60 flex flex-col items-center justify-center">
          
          {/* TOP RIBBON BOW (Unties & flies off on unwrap) */}
          <motion.div
            animate={
              isUnwrapping
                ? { y: -80, opacity: 0, scale: 0.5, rotate: -25 }
                : { y: [0, -4, 0], scale: [1, 1.02, 1] }
            }
            transition={
              isUnwrapping
                ? { duration: 0.5, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }
            className="absolute -top-6 z-30 flex items-center justify-center pointer-events-none"
          >
            {/* Left Bow Loop */}
            <div className="w-9 h-7 bg-gradient-to-br from-amber-300 to-amber-500 rounded-[50%_10%_50%_40%] -rotate-25 shadow-md border border-amber-200/80 -mr-2" />
            {/* Center Bow Knot */}
            <div className="w-5 h-5 bg-amber-400 rounded-full shadow-lg z-10 border border-amber-200" />
            {/* Right Bow Loop */}
            <div className="w-9 h-7 bg-gradient-to-bl from-amber-300 to-amber-500 rounded-[10%_50%_40%_50%] rotate-25 shadow-md border border-amber-200/80 -ml-2" />
          </motion.div>

          {/* GIFT BOX LID */}
          <motion.div
            animate={
              isUnwrapping
                ? { y: -50, rotate: -12, opacity: 0.9, scale: 1.05 }
                : { y: 0, rotate: 0 }
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-8 z-20 w-48 sm:w-56 h-12 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-t-xl shadow-lg border-2 border-pink-300/80 flex items-center justify-center"
          >
            {/* Vertical Golden Ribbon on Lid */}
            <div className="w-8 h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-sm border-x border-amber-400/50" />
            {/* Lid Rim Highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-xl" />
          </motion.div>

          {/* GIFT BOX BODY */}
          <div className="relative top-6 z-10 w-44 sm:w-52 h-36 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-b-2xl shadow-2xl border-x-2 border-b-2 border-pink-400/80 overflow-hidden flex items-center justify-center">
            {/* Vertical Ribbon */}
            <div className="w-8 h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md border-x border-amber-400/50" />
            {/* Horizontal Ribbon */}
            <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-sm border-y border-amber-400/50" />

            {/* Hidden Letter Peeking Inside when unboxed */}
            {isOpened && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -10, opacity: 1 }}
                className="absolute inset-4 bg-amber-50 rounded-lg shadow-inner flex flex-col items-center justify-center p-2 text-center"
              >
                <Sparkles className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-[11px] font-bold text-stone-700 mt-1">Letter Revealed!</span>
              </motion.div>
            )}

            {/* Box Texture & Highlights */}
            <div className="absolute top-0 inset-x-0 h-2 bg-pink-700/30" />
          </div>

          {/* Shadow underneath */}
          <div className="absolute -bottom-2 w-48 sm:w-56 h-4 bg-stone-900/15 rounded-full blur-md" />
        </div>

        {/* Tap badge */}
        {!isUnwrapping && !isOpened && (
          <div className="mt-4 text-xs text-stone-600 flex items-center justify-center gap-1.5 font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Tap the box to unwrap!</span>
          </div>
        )}
      </div>

      {/* Button fallback / Next Action */}
      <div className="w-full max-w-sm mt-4 flex flex-col items-center">
        {!isOpened ? (
          <button
            id="btn-unwrap-gift"
            onClick={handleUnwrap}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-pink-300/60 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 animate-pulse-glow"
          >
            <Gift className="w-5 h-5" />
            <span>Unwrap the Gift</span>
          </button>
        ) : (
          <button
            id="btn-open-letter-now"
            onClick={onGiftOpened}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold text-base rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Read Birthday Letter</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
