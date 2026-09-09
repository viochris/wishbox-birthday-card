import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, MicOff, Wind, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { fireSparkleBurst } from '../utils/confetti';
import { BlowDetector } from '../utils/microphone';

interface ScreenWishProps {
  recipientName: string;
  onWishCompleted: () => void;
}

export const ScreenWish: React.FC<ScreenWishProps> = ({ recipientName, onWishCompleted }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [micStatus, setMicStatus] = useState<'off' | 'listening' | 'denied' | 'unsupported'>('off');
  const [showSuccessText, setShowSuccessText] = useState(false);
  const blowDetectorRef = useRef<BlowDetector | null>(null);
  const autoNextTimerRef = useRef<number | null>(null);

  // Initialize blow detector on mount if user chooses or offer mic button
  const handleBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    
    // Stop microphone if active
    if (blowDetectorRef.current) {
      blowDetectorRef.current.stop();
      setMicStatus('off');
    }

    // Play sounds
    soundEngine.playCandleBlowSFX();
    
    // Tactile Vibration Feedback for mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 80]);
      } catch {
        // Fallback gracefully if vibration is not permitted
      }
    }

    // Fire celebratory sparkle burst
    fireSparkleBurst(0.5, 0.45);

    setShowSuccessText(true);

    // Auto transition to Screen 3 after 2.8s
    autoNextTimerRef.current = window.setTimeout(() => {
      onWishCompleted();
    }, 2800);
  };

  const handleToggleMic = async () => {
    if (micStatus === 'listening') {
      blowDetectorRef.current?.stop();
      setMicStatus('off');
      return;
    }

    blowDetectorRef.current = new BlowDetector();
    const result = await blowDetectorRef.current.start(() => {
      handleBlowOut();
    });

    if (result === 'granted') {
      setMicStatus('listening');
    } else if (result === 'denied') {
      setMicStatus('denied');
    } else {
      setMicStatus('unsupported');
    }
  };

  useEffect(() => {
    return () => {
      if (blowDetectorRef.current) {
        blowDetectorRef.current.stop();
      }
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      id="screen-wish"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 w-full max-w-lg mx-auto text-center px-4 flex flex-col items-center justify-center min-h-[75vh]"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-100/90 border border-amber-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          The Birthday Wish
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-3"
      >
        Make a Wish ✨🕯️
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-stone-600 text-sm sm:text-base max-w-sm mx-auto mb-8"
      >
        {isBlown
          ? 'Your wish has been cast into the universe!'
          : 'Close your eyes, think of something wonderful, and blow out your birthday candle.'}
      </motion.p>

      {/* Birthday Cake & Candle Interactive Stage */}
      <div 
        id="cake-interactive-stage"
        onClick={!isBlown ? handleBlowOut : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBlowOut(); }}
        aria-label="Tap to blow out candle"
        className={`group relative my-4 cursor-pointer select-none transition-transform duration-300 ${!isBlown ? 'hover:scale-105 active:scale-95' : ''}`}
      >
        {/* Glow Halo behind flame */}
        <AnimatePresence>
          {!isBlown && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
              exit={{ scale: 0.2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-t from-amber-300/40 via-yellow-200/30 to-transparent blur-xl pointer-events-none group-hover:scale-125 group-hover:opacity-100 transition-all duration-300"
            />
          )}
        </AnimatePresence>

        {/* Cake Container */}
        <div className="relative w-56 sm:w-64 flex flex-col items-center">
          
          {/* CANDLE ASSEMBLY */}
          <div className="relative flex flex-col items-center mb-[-2px] z-20">
            {/* Candle Flame & Smoke */}
            <div className="h-14 flex items-end justify-center relative">
              <AnimatePresence>
                {!isBlown ? (
                  <motion.div
                    key="flame"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{
                      scale: [1, 1.4, 0],
                      opacity: [1, 0.8, 0],
                      y: -10
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative flex items-center justify-center animate-flame group-hover-flame-intense"
                  >
                    {/* Outer orange flame */}
                    <div className="w-4 h-9 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-[50%_50%_20%_20%/60%_60%_40%_40%] shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                    {/* Inner bright yellow-white core */}
                    <div className="absolute bottom-1 w-2 h-5 bg-gradient-to-t from-yellow-100 to-white rounded-full blur-[0.5px]" />
                    {/* Blue base spark */}
                    <div className="absolute bottom-0 w-2.5 h-1.5 bg-blue-400/80 rounded-full blur-[0.3px]" />
                  </motion.div>
                ) : (
                  /* Smoke Wisps rising after blow */
                  <motion.div
                    key="smoke"
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      y: -35,
                      x: [-4, 6, -2],
                      scale: [0.6, 1.3, 1.8]
                    }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    className="flex flex-col items-center pointer-events-none"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-400/60 blur-[1px] mb-1" />
                    <div className="w-3.5 h-3.5 rounded-full bg-stone-300/40 blur-[2px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Candle Wick */}
            <div className="w-0.5 h-2.5 bg-stone-800 rounded-t-sm" />

            {/* Candle Stick */}
            <div className="w-3.5 h-14 rounded-t-sm bg-gradient-to-r from-pink-300 via-pink-100 to-pink-300 shadow-sm relative overflow-hidden border border-pink-400/30">
              {/* Gold Spirals */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_4px,transparent_4px,transparent_8px)]" />
            </div>
          </div>

          {/* CAKE TOP LAYER (White Frosting & Gold Drips) */}
          <div className="relative w-36 h-12 bg-gradient-to-b from-amber-50 to-pink-50 rounded-t-2xl border-t-2 border-x-2 border-pink-200/90 shadow-sm flex items-center justify-around px-3 z-10">
            {/* Frosting Scallops */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-5 h-3.5 bg-amber-50 rounded-b-full border-b border-pink-200 shadow-xs" />
              ))}
            </div>
            {/* Colorful Sprinkles */}
            <span className="w-1.5 h-1 bg-pink-400 rounded-full rotate-45" />
            <span className="w-1.5 h-1 bg-amber-400 rounded-full -rotate-12" />
            <span className="w-1.5 h-1 bg-rose-400 rounded-full rotate-90" />
            <span className="w-1.5 h-1 bg-purple-400 rounded-full -rotate-45" />
          </div>

          {/* CAKE MAIN TIER (Warm Sponge Cake with Cream Layer) */}
          <div className="relative w-48 h-20 bg-gradient-to-b from-rose-100 via-pink-100 to-amber-100 rounded-xl border border-pink-200 shadow-md flex flex-col justify-between p-2 overflow-hidden">
            {/* Middle Strawberry Cream Ribbon */}
            <div className="w-full h-2.5 bg-pink-300/80 rounded-full shadow-inner flex items-center justify-around px-2">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>

            {/* Bottom Frosting Pearls */}
            <div className="flex justify-between items-center px-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full shadow-xs border border-pink-100" />
              ))}
            </div>
          </div>

          {/* CAKE STAND / PLATTER (Golden Rim Plate) */}
          <div className="w-56 sm:w-64 h-3 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-full border border-amber-300 shadow-lg mt-1" />
          <div className="w-24 h-3.5 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-md shadow-md mx-auto" />
        </div>

        {/* Tap indicator badge */}
        {!isBlown && (
          <div className="mt-3 text-xs text-stone-600 flex items-center justify-center gap-1 font-medium animate-pulse">
            <span>👉 Tap cake to blow candle</span>
          </div>
        )}
      </div>

      {/* Completion Banner or Action Controls */}
      <div className="w-full max-w-sm mt-4 flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          {!isBlown ? (
            <motion.div
              key="blow-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-2.5"
            >
              {/* Primary Blow Button */}
              <button
                id="btn-blow-candle"
                onClick={handleBlowOut}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-base rounded-2xl shadow-md hover:shadow-pink-200/80 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98"
              >
                <Wind className="w-5 h-5 animate-pulse" />
                <span>Blow Out the Candle</span>
              </button>

              {/* Optional Microphone Blow Feature */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <button
                  id="btn-mic-blow"
                  onClick={handleToggleMic}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                    micStatus === 'listening'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse'
                      : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {micStatus === 'listening' ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Listening... Blow now into mic!</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-stone-500" />
                      <span>Blow via Microphone</span>
                    </>
                  )}
                </button>
              </div>

              {micStatus === 'denied' && (
                <p className="text-[11px] text-amber-700">
                  Microphone access wasn&apos;t granted — no worries! Just tap the button above to blow.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-amber-200 shadow-md flex flex-col items-center gap-3 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif-title text-xl font-bold text-stone-900">
                  Your wish is on its way... ✨
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  May every dream you hold close unfold beautifully this year, {recipientName}!
                </p>
              </div>

              <button
                id="btn-next-to-gift"
                onClick={onWishCompleted}
                className="mt-1 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold text-sm rounded-xl shadow transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Gift Box</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
