import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Center burst with pastel & gold colors
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f472b6', '#fbbf24', '#f59e0b', '#ec4899', '#60a5fa', '#a78bfa', '#34d399'],
    disableForReducedMotion: true
  });
}

/**
 * High-density, one-time celebratory screen burst immediately upon opening the gift box.
 * Combines a massive center velocity explosion, shimmering star bursts, and side cannon volleys
 * for a stunning screen-filling effect.
 */
export function fireGiftBurstConfetti() {
  const festiveColors = ['#f472b6', '#fbbf24', '#f59e0b', '#ec4899', '#38bdf8', '#c084fc', '#a855f7', '#fb7185', '#ffffff'];

  // 1. Core high-velocity center blast
  confetti({
    particleCount: 130,
    spread: 110,
    startVelocity: 48,
    origin: { x: 0.5, y: 0.52 },
    colors: festiveColors,
    ticks: 240,
    gravity: 0.9,
    scalar: 1.15,
    disableForReducedMotion: true
  });

  // 2. High-speed star and golden glitter burst
  confetti({
    particleCount: 65,
    spread: 360,
    startVelocity: 36,
    origin: { x: 0.5, y: 0.52 },
    shapes: ['star', 'circle'],
    colors: ['#fde047', '#fbbf24', '#ffffff', '#f472b6', '#fed7aa'],
    scalar: 1.25,
    ticks: 180,
    disableForReducedMotion: true
  });

  // 3. Wide angled dual-cannons for complete screen coverage
  confetti({
    particleCount: 75,
    angle: 55,
    spread: 60,
    startVelocity: 58,
    origin: { x: 0.1, y: 0.62 },
    colors: festiveColors,
    ticks: 240,
    gravity: 0.95,
    disableForReducedMotion: true
  });

  confetti({
    particleCount: 75,
    angle: 125,
    spread: 60,
    startVelocity: 58,
    origin: { x: 0.9, y: 0.62 },
    colors: festiveColors,
    ticks: 240,
    gravity: 0.95,
    disableForReducedMotion: true
  });
}

export function fireGrandFinaleConfetti() {
  const end = Date.now() + 2.5 * 1000;
  const colors = ['#f472b6', '#fbbf24', '#f59e0b', '#ec4899', '#38bdf8', '#c084fc', '#4ade80'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function fireSparkleBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 35,
    spread: 360,
    startVelocity: 15,
    ticks: 60,
    origin: { x, y },
    shapes: ['star', 'circle'],
    colors: ['#fbbf24', '#fde68a', '#f472b6', '#fed7aa', '#ffffff']
  });
}
