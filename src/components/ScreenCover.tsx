import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper, Heart, ArrowRight, Flame } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { fireCelebrationConfetti, fireSparkleBurst } from '../utils/confetti';

interface ScreenCoverProps {
  recipientName: string;
  coverTitle?: string;
  onStart: () => void;
}

interface InteractiveBalloon {
  id: number;
  emoji: string;
  color: string;
  label: string;
  popped: boolean;
  x: string;
  y: string;
}

export const ScreenCover: React.FC<ScreenCoverProps> = ({
  recipientName,
  coverTitle = "It's Your Day!",
  onStart
}) => {
  const [cakeTapped, setCakeTapped] = useState(false);
  const [balloons, setBalloons] = useState<InteractiveBalloon[]>([
    { id: 1, emoji: '🎈', color: 'bg-rose-400', label: 'Joy', popped: false, x: '-left-4 sm:-left-10', y: 'top-10' },
    { id: 2, emoji: '✨', color: 'bg-amber-400', label: 'Magic', popped: false, x: '-right-4 sm:-right-10', y: 'top-12' },
    { id: 3, emoji: '🎁', color: 'bg-pink-400', label: 'Surprise', popped: false, x: '-left-2 sm:-left-8', y: 'bottom-20' },
    { id: 4, emoji: '🍰', color: 'bg-purple-400', label: 'Sweet', popped: false, x: '-right-2 sm:-right-8', y: 'bottom-16' },
  ]);
  const [confettiCount, setConfettiCount] = useState(0);

  const handleStart = () => {
    soundEngine.playButtonPop();
    // Auto-start warm background music upon first interaction
    soundEngine.startMusic();
    onStart();
  };

  const handleTapCake = () => {
    setCakeTapped(true);
    soundEngine.playSparkleChime();
    fireSparkleBurst(0.5, 0.45);
    setTimeout(() => setCakeTapped(false), 800);
  };

  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    soundEngine.playButtonPop();
    fireCelebrationConfetti();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(50); } catch { /* ignore */ }
    }
  };

  const handleTossConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfettiCount(prev => prev + 1);
    soundEngine.playButtonPop();
    fireCelebrationConfetti();
  };

  const poppedCount = balloons.filter(b => b.popped).length;

  return (
    <motion.div
      id="screen-cover"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-2xl mx-auto text-center px-4 py-4 flex flex-col items-center justify-center min-h-[80vh]"
    >
      {/* Festive Pennant Banner / Garland at top */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-4 overflow-hidden select-none pointer-events-none">
        {['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#fb7185', '#facc15', '#f472b6', '#a78bfa'].map((color, idx) => (
          <motion.div
            key={`flag-${idx}`}
            animate={{ rotate: [idx % 2 === 0 ? -4 : 4, idx % 2 === 0 ? 4 : -4] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 + (idx * 0.2), ease: 'easeInOut' }}
            className="w-4 sm:w-6 h-6 sm:h-8"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backgroundColor: color,
              opacity: 0.85
            }}
          />
        ))}
      </div>

      {/* Celebration Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border border-pink-300/80 text-pink-700 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-xs mb-3"
      >
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span>A Special Birthday Celebration</span>
        <PartyPopper className="w-4 h-4 text-pink-500" />
      </motion.div>

      {/* Main Cover Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12] mb-2"
      >
        {coverTitle}{' '}
        <span className="inline-block hover:rotate-12 transition-transform duration-300 select-none cursor-default">
          🎉
        </span>
      </motion.h1>

      {/* Recipient Highlight */}
      {recipientName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-4"
        >
          <span className="font-serif-title text-2xl sm:text-3xl text-pink-600 font-semibold italic">
            Happy Birthday, {recipientName}!
          </span>
        </motion.div>
      )}

      {/* Festive Interactive Cake Centerpiece Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="relative my-2 w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-pink-200/90 shadow-lg shadow-pink-100/60"
      >
        {/* Floating Interactive Pop Balloons on the corners */}
        {balloons.map((b) => (
          <div
            key={b.id}
            className={`absolute ${b.x} ${b.y} z-20`}
          >
            <AnimatePresence>
              {!b.popped ? (
                <motion.button
                  onClick={(e) => handlePopBalloon(b.id, e)}
                  title={`Tap to pop ${b.label} balloon!`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.8 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4 + b.id * 0.3, ease: 'easeInOut' }}
                  className="w-11 h-11 rounded-full bg-white/95 shadow-md border border-pink-200 flex items-center justify-center text-lg cursor-pointer hover:bg-pink-50 transition-colors"
                >
                  <span>{b.emoji}</span>
                </motion.button>
              ) : (
                <motion.span
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="text-pink-500 font-bold text-xs"
                >
                  💥 Pop!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Cake Visual Illustration (Clickable!) */}
        <div
          onClick={handleTapCake}
          title="Tap the cake for birthday sparkles!"
          className={`cursor-pointer select-none transition-transform duration-300 flex flex-col items-center justify-center py-2 ${
            cakeTapped ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          {/* Glowing Candle Flame */}
          <div className="relative mb-1 flex flex-col items-center">
            <motion.div
              animate={{
                scale: [1, 1.15, 0.95, 1.1],
                rotate: [-2, 2, -1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <Flame className="w-7 h-7 text-amber-500 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            </motion.div>
            {/* Candle Stick */}
            <div className="w-2 h-7 bg-gradient-to-b from-pink-300 to-rose-400 rounded-xs shadow-xs border border-pink-400/40" />
          </div>

          {/* Birthday Cake Tiers */}
          <div className="relative flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-28 h-9 rounded-t-xl bg-gradient-to-r from-pink-100 via-white to-pink-100 border border-pink-200 shadow-sm relative flex items-center justify-around px-2">
              <span className="text-xs">🍓</span>
              <span className="text-xs">✨</span>
              <span className="text-xs">🍓</span>
              {/* Cream Drips */}
              <div className="absolute -bottom-1.5 inset-x-0 flex justify-around">
                <div className="w-3 h-2 bg-white rounded-b-full shadow-xs" />
                <div className="w-3 h-3 bg-white rounded-b-full shadow-xs" />
                <div className="w-3 h-2 bg-white rounded-b-full shadow-xs" />
              </div>
            </div>

            {/* Bottom Tier */}
            <div className="w-40 h-12 rounded-b-2xl bg-gradient-to-r from-rose-200 via-pink-100 to-amber-100 border-x border-b border-pink-300/80 shadow-md flex items-center justify-around px-4">
              <span className="text-xs">🧁</span>
              <span className="text-xs font-serif-title font-bold text-pink-600 tracking-wider">CELEBRATE</span>
              <span className="text-xs">🧁</span>
            </div>

            {/* Cake Plate Stand */}
            <div className="w-48 h-3 bg-gradient-to-r from-stone-200 via-white to-stone-200 rounded-full shadow-md border border-stone-300/60 -mt-0.5" />
          </div>

          <span className="text-[11px] font-medium text-pink-500 mt-2.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Tap the cake for birthday sparkles
          </span>
        </div>

        {/* Mini interactive balloon hint */}
        {poppedCount < balloons.length ? (
          <p className="text-[11px] text-stone-500 mt-1">
            🎈 Pop the floating balloons: <span className="font-semibold text-pink-600">{poppedCount}/{balloons.length}</span> popped
          </p>
        ) : (
          <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> All balloons popped! You are ready to celebrate!
          </p>
        )}
      </motion.div>

      {/* Sub-text description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed my-4"
      >
        A personalized interactive celebration made just for you. Blow out the candle, unwrap your gift, and read your special letter.
      </motion.p>

      {/* Action Buttons Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-3 mt-1"
      >
        {/* Main Start Button */}
        <motion.button
          id="btn-start-celebration"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="group px-8 py-3.5 font-semibold text-base sm:text-lg rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg hover:shadow-pink-300/60 transition-all duration-300 flex items-center gap-3 cursor-pointer animate-pulse-glow"
        >
          <span className="tracking-wide">Start the Celebration</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Fun Toss Confetti Button */}
        <motion.button
          id="btn-toss-confetti"
          onClick={handleTossConfetti}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3.5 font-medium text-xs sm:text-sm rounded-2xl bg-white/90 hover:bg-white text-stone-700 border border-pink-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <PartyPopper className="w-4 h-4 text-pink-500" />
          <span>Toss Confetti ({confettiCount})</span>
        </motion.button>
      </motion.div>

      {/* Subtle Sound Hint */}
      <p className="mt-5 text-xs text-stone-500 flex items-center gap-1.5">
        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
        Turn on your sound for the background music & celebratory sound effects
      </p>
    </motion.div>
  );
};
