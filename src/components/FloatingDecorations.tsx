import React from 'react';

interface FloatingDecorationsProps {
  density?: 'normal' | 'high';
}

export const FloatingDecorations: React.FC<FloatingDecorationsProps> = ({ density = 'normal' }) => {
  const balloons = [
    { left: '5%', top: '12%', size: 'w-14 h-18 sm:w-18 sm:h-22', color: 'from-pink-400 to-rose-300', delay: '0s', anim: 'animate-float-1' },
    { left: '88%', top: '16%', size: 'w-16 h-20 sm:w-20 sm:h-26', color: 'from-amber-300 to-yellow-400', delay: '1.2s', anim: 'animate-float-2' },
    { left: '10%', top: '68%', size: 'w-12 h-16 sm:w-16 sm:h-20', color: 'from-fuchsia-300 to-pink-300', delay: '2.5s', anim: 'animate-float-2' },
    { left: '84%', top: '62%', size: 'w-14 h-18 sm:w-18 sm:h-22', color: 'from-rose-400 to-pink-500', delay: '0.8s', anim: 'animate-float-1' },
    { left: '3%', top: '40%', size: 'w-10 h-14 sm:w-12 sm:h-16', color: 'from-amber-200 to-amber-400', delay: '3.1s', anim: 'animate-float-1' },
    { left: '92%', top: '44%', size: 'w-11 h-15 sm:w-14 sm:h-18', color: 'from-sky-300 to-indigo-300', delay: '1.8s', anim: 'animate-float-2' },
    { left: '22%', top: '85%', size: 'w-9 h-12 sm:w-12 sm:h-15', color: 'from-violet-300 to-fuchsia-300', delay: '2.1s', anim: 'animate-float-1' },
    { left: '76%', top: '82%', size: 'w-10 h-13 sm:w-13 sm:h-17', color: 'from-pink-300 to-orange-300', delay: '0.4s', anim: 'animate-float-2' },
  ];

  const sparkles = [
    { left: '18%', top: '24%', delay: '0.2s', size: 'text-amber-400 text-xl sm:text-2xl' },
    { left: '82%', top: '14%', delay: '1.5s', size: 'text-pink-400 text-lg sm:text-xl' },
    { left: '26%', top: '78%', delay: '2.2s', size: 'text-yellow-400 text-base sm:text-lg' },
    { left: '74%', top: '76%', delay: '0.9s', size: 'text-purple-400 text-lg sm:text-xl' },
    { left: '50%', top: '8%', delay: '1.8s', size: 'text-amber-300 text-2xl sm:text-3xl' },
    { left: '8%', top: '88%', delay: '1.1s', size: 'text-rose-400 text-lg sm:text-xl' },
    { left: '94%', top: '75%', delay: '2.8s', size: 'text-amber-400 text-xl sm:text-2xl' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Festive warm ambient glow spots */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[750px] h-[500px] bg-gradient-to-b from-pink-300/40 via-amber-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-[350px] h-[350px] bg-gradient-to-r from-rose-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-gradient-to-l from-amber-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 w-[500px] h-[400px] bg-gradient-to-t from-pink-200/40 via-rose-100/30 to-transparent rounded-full blur-3xl" />

      {/* Floating Background Balloons */}
      {balloons.map((b, i) => (
        <div
          key={`balloon-${i}`}
          className={`absolute ${b.anim} opacity-65 sm:opacity-85 transition-opacity`}
          style={{
            left: b.left,
            top: b.top,
            animationDelay: b.delay
          }}
        >
          {/* Balloon Oval */}
          <div className={`${b.size} rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${b.color} shadow-md relative backdrop-blur-sm border border-white/40`}>
            {/* Balloon Light Glint */}
            <div className="absolute top-2 left-2.5 w-3 h-4 bg-white/60 rounded-full rotate-[-25deg] blur-[0.5px]" />
            {/* Balloon Knot */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-pink-600/60 rounded-sm" />
            {/* Balloon String */}
            <svg
              className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-12 stroke-stone-400/40 fill-none"
              viewBox="0 0 16 48"
            >
              <path d="M 8 0 Q 3 14 9 26 T 7 48" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      ))}

      {/* Twinkling Sparkles & Stars */}
      {sparkles.map((s, i) => (
        <div
          key={`sparkle-${i}`}
          className={`absolute ${s.size} animate-pulse select-none`}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: '2.5s'
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};
