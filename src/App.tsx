/**
 * WishBox — Interactive Birthday Card (v2)
 * Follows 4-screen sequence: Cover → Make a Wish → Gift Box → Letter
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ScreenStep, LetterContent } from './types';
import { getInitialLetterContent } from './data/letterData';
import { soundEngine } from './utils/soundEngine';

import { HeaderControls } from './components/HeaderControls';
import { PersonalizeModal } from './components/PersonalizeModal';
import { FloatingDecorations } from './components/FloatingDecorations';
import { ScreenCover } from './components/ScreenCover';
import { ScreenWish } from './components/ScreenWish';
import { ScreenGift } from './components/ScreenGift';
import { ScreenLetter } from './components/ScreenLetter';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('cover');
  const [letterContent, setLetterContent] = useState<LetterContent>(getInitialLetterContent);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync sound engine state
  const handleToggleMusic = () => {
    const newState = soundEngine.toggleMusic();
    setIsMusicPlaying(newState);
  };

  const handleToggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundEngine.setMute(newMute);
  };

  // Personalization updates
  const handleSavePersonalize = (updated: Partial<LetterContent>) => {
    setLetterContent(prev => {
      const nextContent = {
        ...prev,
        ...updated
      };
      // Keep URL search params updated so current link/bookmarks stay synchronized
      try {
        const url = new URL(window.location.href);
        if (nextContent.recipientName) {
          url.searchParams.set('to', nextContent.recipientName);
        }
        if (nextContent.senderSignature) {
          url.searchParams.set('from', nextContent.senderSignature);
        }
        window.history.replaceState(null, '', url.toString());
      } catch {
        // Safe fallback in sandboxed iframes
      }
      return nextContent;
    });
  };

  // Step transitions
  const handleStartCelebration = () => {
    setIsMusicPlaying(soundEngine.getIsPlayingMusic());
    setCurrentStep('wish');
  };

  const handleWishCompleted = () => {
    setCurrentStep('gift');
  };

  const handleGiftOpened = () => {
    setCurrentStep('letter');
  };

  const handleReplay = () => {
    setCurrentStep('cover');
  };

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-b from-amber-50/70 via-rose-50/50 to-pink-50/80 flex flex-col justify-between overflow-x-hidden pt-16 pb-8">
      {/* Background Floating Balloons, Sparkles & Ambient Glow */}
      <FloatingDecorations density={currentStep === 'letter' ? 'high' : 'normal'} />

      {/* Top Floating Header Controls (Personalize, Music toggle, Mute) */}
      <HeaderControls
        isMusicPlaying={isMusicPlaying}
        isMuted={isMuted}
        onToggleMusic={handleToggleMusic}
        onToggleMute={handleToggleMute}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
      />

      {/* Personalize Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        letterContent={letterContent}
        onSave={handleSavePersonalize}
      />

      {/* Main 4-Screen Step Sequence Container */}
      <div className="w-full max-w-3xl mx-auto px-4 my-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 'cover' && (
            <ScreenCover
              key="step-cover"
              recipientName={letterContent.recipientName}
              coverTitle={letterContent.coverTitle}
              onStart={handleStartCelebration}
            />
          )}

          {currentStep === 'wish' && (
            <ScreenWish
              key="step-wish"
              recipientName={letterContent.recipientName}
              onWishCompleted={handleWishCompleted}
            />
          )}

          {currentStep === 'gift' && (
            <ScreenGift
              key="step-gift"
              recipientName={letterContent.recipientName}
              onGiftOpened={handleGiftOpened}
            />
          )}

          {currentStep === 'letter' && (
            <ScreenLetter
              key="step-letter"
              letterContent={letterContent}
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding Note */}
      <footer className="relative z-10 text-center text-xs text-stone-600 mt-6 pointer-events-none">
        <p>WishBox Interactive Birthday Card • Made with care & celebration</p>
      </footer>
    </main>
  );
}
