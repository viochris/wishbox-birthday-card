import React from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

interface HeaderControlsProps {
  isMusicPlaying: boolean;
  isMuted: boolean;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  onOpenPersonalize: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  isMusicPlaying,
  isMuted,
  onToggleMusic,
  onToggleMute,
  onOpenPersonalize
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-end">
        {/* Right Action Audio & Personalize Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Personalize Button */}
          <button
            id="btn-open-personalize"
            onClick={onOpenPersonalize}
            title="Personalize birthday card"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-full border border-pink-200/80 bg-white/85 hover:bg-white text-stone-700 hover:text-pink-600 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Personalize</span>
          </button>

          {/* Music Play / Pause */}
          <button
            id="btn-toggle-music"
            onClick={onToggleMusic}
            title={isMusicPlaying ? "Pause celebration music" : "Play celebration music"}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-full border shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap ${
              isMusicPlaying
                ? 'bg-pink-500 text-white border-pink-600 shadow-pink-200'
                : 'bg-white/85 text-stone-700 border-pink-200/80 hover:bg-white backdrop-blur-md'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
            <span>{isMusicPlaying ? 'Music On' : 'Play Music'}</span>
          </button>

          {/* Mute Toggle */}
          <button
            id="btn-toggle-mute"
            onClick={onToggleMute}
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="p-2 bg-white/85 hover:bg-white text-stone-700 hover:text-pink-600 rounded-full border border-pink-200/80 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-stone-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
