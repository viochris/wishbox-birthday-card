<div align="center">

# 🎁 WishBox — Interactive Birthday Card

**A festive, four-step interactive birthday celebration experience, built for the browser.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-wishbox--birthday--card.vercel.app-ec4899?style=for-the-badge)](https://wishbox-birthday-card.vercel.app/)
[![Vibe Coded](https://img.shields.io/badge/Vibe%20Coded-Google%20AI%20Studio%20%2B%20Gemini-4285F4?style=for-the-badge)](https://ai.studio)

**[🎈 Live Demo](https://wishbox-birthday-card.vercel.app/)** · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [How It Works](#-how-it-works) · [Personalization](#-personalization)

</div>

---

## 📖 Overview

**WishBox** is a small, self-contained web app designed to turn a plain birthday greeting into an actual, interactive mini-celebration. Instead of sending a flat text message, the recipient opens a link and walks through four short "rituals" that mirror a real birthday: making a wish and blowing out a candle, unwrapping a gift, and reading a heartfelt letter — all wrapped in warm, festive animation, ambient music, and confetti.

The project was **vibe-coded end-to-end in [Google AI Studio](https://ai.studio) using Gemini**, starting from a written Product Requirements Document (PRD) that defined the screen flow, acceptance criteria, and constraints (most notably: this had to feel like a genuine, relationship-agnostic **birthday** celebration — not a relationship-milestone or anniversary card, and not gated behind a login or database).

It is part of a broader personal portfolio effort to demonstrate applied "vibe coding" ability — building a complete, polished, front-end-heavy interactive product with AI-assisted development tools — outside of my primary technical focus areas (Data Science, NLP, and GenAI/LLM agent engineering).

**Live demo:** **https://wishbox-birthday-card.vercel.app/**

---

## ✨ Features

### The Four-Screen Celebration Flow
The app walks the recipient through a fixed sequence, each screen a small self-contained "scene":

1. **🎉 Cover** — A warm, animated landing screen ("It's Your Day!") with floating balloons and confetti drifting in the background, and a single call-to-action to begin the celebration.
2. **🕯️ Make a Wish** — An animated birthday cake with a lit candle. The candle can be extinguished two ways:
   - **Real microphone-based blow detection** — the app requests microphone access and uses the Web Audio API to analyze live audio input, detecting an actual "blow" sound to snuff the candle out, just like a real candle.
   - A **tap/click fallback** for users who deny microphone permission or are on a device where this isn't practical, so the experience never gets stuck.
3. **🎁 Gift Box** — An animated wrapped gift box with a bow. Tapping/clicking it triggers an unwrap animation (bow untying, lid opening) before revealing the final screen.
4. **💌 The Letter** — A long, personal birthday letter revealed gradually (paragraph by paragraph), closing with a birthday message, a signature, and a celebratory confetti burst.

### Beyond the Core Flow
- **🎙️ Real candle-blow detection** — a custom `BlowDetector` utility opens a live microphone stream, runs it through a Web Audio `AnalyserNode`, and pattern-matches sustained volume spikes to distinguish an intentional "blow" from background noise or silence.
- **🔊 Synthesized ambient music** — rather than relying on a pre-recorded audio file or an external AI music-generation API, the background melody is **generated in real time in the browser** using the Web Audio API: a small hand-written synthesizer plays a warm, looping pentatonic arpeggio progression (C major / G / Am / F), with separate gain nodes for music and sound effects so either can be muted independently.
- **🗣️ Read-aloud letter narration** — the closing letter can be read aloud using the browser's native **Web Speech API** (`SpeechSynthesis`). Text is intelligently chunked into short, natural phrase-level segments (4–8 words) rather than whole paragraphs, which avoids a well-known Chrome bug where `speechSynthesis.resume()` silently fails after being paused for too long, and allows pause/resume to continue from the current phrase instead of restarting the whole paragraph.
- **🎊 Canvas-based confetti & floating decorations** — celebratory bursts are rendered using the `canvas-confetti` library, layered with custom animated floating balloons and sparkle decorations that adapt in density depending on which screen is active (a denser celebration effect on the final Letter screen).
- **🎬 Smooth, physics-based transitions** — all screen transitions and micro-interactions (button presses, modal open/close, step changes) are animated using **Motion** (the modern successor to Framer Motion), giving the app a fluid, native-app feel rather than abrupt state changes.
- **🎨 Personalization modal** — an in-app modal lets the sender customize the recipient's name and the closing signature on the fly, then generates a shareable link with those values encoded as URL query parameters — so a sender can personalize and share a unique link without touching any code or redeploying the app.
- **🔇 Persistent audio controls** — a small floating header lets the visitor toggle background music on/off and mute all sound entirely, without interrupting the current screen or animation state.

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | TypeScript |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| **Animation** | [Motion](https://motion.dev/) (`motion/react`) for screen/UI transitions |
| **Confetti** | [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) |
| **Icons** | [`lucide-react`](https://lucide.dev/) |
| **Audio Synthesis** | Native **Web Audio API** (hand-written oscillator-based synth for music & SFX) |
| **Speech** | Native **Web Speech API** (`SpeechSynthesis`) for letter read-aloud |
| **Microphone Input** | Native **`getUserMedia`** + Web Audio `AnalyserNode` for real-time blow detection |
| **Server (dev/local only)** | Express (used by the Vite dev tooling; the deployed app is a static, client-side bundle) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **Development Environment** | [Google AI Studio](https://ai.studio) (Build mode, powered by Gemini) |

**Notably, WishBox requires no backend and no database.** Every feature — including personalization, audio, speech, and microphone-based interaction — runs entirely client-side in the browser. This was an intentional constraint from the project's PRD: as a personal, single-use (or link-shared) greeting, there was no need for persistent server-side storage, user accounts, or authentication.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (or an equivalent package manager — the project also ships a `bun.lock`, so [Bun](https://bun.sh/) works too)

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/viochris/wishbox-birthday-card.git
cd wishbox-birthday-card

# 2. Install dependencies
npm install

# 3. Run the app locally
npm run dev
```

The app will be available at `http://localhost:3000` by default.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with hot module reloading |
| `npm run build` | Builds an optimized static production bundle into `dist/` |
| `npm run preview` | Serves the production build locally for a final check before deploying |
| `npm run lint` | Runs a TypeScript type-check (`tsc --noEmit`) without emitting output |
| `npm run clean` | Removes the `dist/` build output |

### Deployment
The live demo is deployed on **Vercel** as a static site — since the app has no backend or database dependency, it can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) by simply running `npm run build` and serving the resulting `dist/` folder.

---

## 🗂️ Project Structure

```
wishbox-birthday-card/
├── src/
│   ├── components/
│   │   ├── ScreenCover.tsx        # Screen 1 — Cover / opening screen
│   │   ├── ScreenWish.tsx         # Screen 2 — Make a Wish (candle-blow interaction)
│   │   ├── ScreenGift.tsx         # Screen 3 — Gift Box (unwrap interaction)
│   │   ├── ScreenLetter.tsx       # Screen 4 — The Letter (reveal + read-aloud)
│   │   ├── HeaderControls.tsx     # Floating music/mute toggle controls
│   │   ├── FloatingDecorations.tsx# Ambient floating balloons/sparkles background
│   │   └── PersonalizeModal.tsx   # Modal for customizing recipient/sender + share link
│   ├── config/
│   │   └── birthdayConfig.ts      # Default recipient/sender/letter copy configuration
│   ├── data/
│   │   └── letterData.ts          # Resolves letter content from env vars / URL params / defaults
│   ├── utils/
│   │   ├── soundEngine.ts         # Web Audio API music synthesizer & sound effects
│   │   ├── ttsEngine.ts           # Web Speech API read-aloud engine (phrase-chunked)
│   │   ├── microphone.ts          # BlowDetector — real microphone-based candle-blow detection
│   │   └── confetti.ts            # canvas-confetti wrapper/presets
│   ├── types.ts                   # Shared TypeScript types (ScreenStep, LetterContent, etc.)
│   ├── App.tsx                    # Root component — manages the 4-screen step sequence
│   ├── main.tsx                   # React app entry point
│   └── index.css                  # Global styles / Tailwind entry
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
└── metadata.json                  # AI Studio app metadata
```

---

## ⚙️ How It Works

### Screen Flow
`App.tsx` holds a single piece of state, `currentStep`, which drives which of the four screens is rendered (`cover → wish → gift → letter`), transitioning via `motion`'s `AnimatePresence` for smooth cross-fades between steps. Each screen is a self-contained component that receives only the props it needs (e.g. the recipient's name) and calls a callback (`onStart`, `onWishCompleted`, `onGiftOpened`, `onReplay`) to advance the flow — there is no global routing library involved, since the experience is intentionally linear and single-page.

### Candle-Blow Detection
The `BlowDetector` class in `utils/microphone.ts` requests microphone access via `navigator.mediaDevices.getUserMedia`, pipes the resulting audio stream into a Web Audio `AnalyserNode`, and continuously samples the frequency/volume data on each animation frame. A sustained volume spike above a calibrated threshold, held for a short duration, is interpreted as a "blow" and triggers the candle-out animation. If microphone access is denied, unsupported, or simply not used, the screen still offers a manual tap/click button, so the experience is never blocked.

### Ambient Music Without an External API
Rather than shipping an audio file or calling an AI music-generation service, `utils/soundEngine.ts` defines a small hand-written synthesizer: a 4-measure warm pentatonic arpeggio progression (encoded as arrays of frequencies) is played back through chained `OscillatorNode`/`GainNode` graphs on a loop, with independent gain control for music versus sound effects (button pops, confetti pops, etc.), and a master mute switch.

### Letter Read-Aloud
`utils/ttsEngine.ts` wraps the browser's native `SpeechSynthesis` API. Rather than feeding it whole paragraphs (which can trigger a known Chrome bug where `resume()` silently does nothing after a long pause), the letter text is split into short, natural phrase-level segments of roughly 4–8 words each. This lets playback pause and resume precisely from the current phrase, rather than restarting an entire paragraph, and keeps the read-aloud experience smooth across browsers.

### Personalization Without a Backend
There are two layers of personalization, both fully client-side:
1. **Build-time defaults** — `src/config/birthdayConfig.ts` holds the default recipient name, sender name/signature, and letter paragraphs, which can be overridden at build time via environment variables (`VITE_BIRTHDAY_RECIPIENT_NAME`, `VITE_BIRTHDAY_SENDER_NAME`, `VITE_BIRTHDAY_MESSAGE`, etc.) — useful when deploying a dedicated instance for one specific recipient.
2. **Share-time personalization** — the in-app `PersonalizeModal` lets a sender fill in a recipient name and signature, then generates a shareable URL with those values encoded as query parameters (e.g. `?to=Alex&from=With%20love`). `src/data/letterData.ts` reads these parameters on load (falling back to the environment/config defaults if absent), so a single deployed instance of the app can generate many different personalized links without any redeploy or backend storage.

---

## 🎨 Design Philosophy

The visual language leans into a **festive-but-tender** palette — soft pink, cream, and gold tones rather than a purely playful/childish "party" look — since the intended emotional register sits between celebratory and heartfelt. Motion is used deliberately: transitions are smooth and weighted rather than snappy, decorations (balloons, sparkles) drift gently in the background rather than looping mechanically, and the letter's gradual paragraph-by-paragraph reveal is paced to feel like reading something someone actually wrote, rather than a wall of text appearing all at once.

A deliberate product constraint (carried over from the project's PRD) was to keep the tone **relationship-agnostic** — default copy avoids romance-specific language (e.g. "Happy Birthday, [Name]" rather than "Happy Birthday, My Love") so the same experience can be personalized and sent to a partner, a close friend, or a family member alike.

---

## 🙋 Personalization

Want to send this to someone? You don't need to touch any code:

1. Open the [live demo](https://wishbox-birthday-card.vercel.app/).
2. Use the in-app personalize option to set the recipient's name and your signature.
3. Copy the generated link (it will look like `https://wishbox-birthday-card.vercel.app/?to=Alex&from=With+love`) and send it directly.

Alternatively, for a fully dedicated deployment (e.g. your own fork with your own default recipient baked in), set the following environment variables before building:

```bash
VITE_BIRTHDAY_RECIPIENT_NAME="Alex"
VITE_BIRTHDAY_SENDER_NAME="Jordan"
VITE_BIRTHDAY_SENDER_SIGNATURE="With all my warmest wishes"
VITE_BIRTHDAY_COVER_TITLE="It's Your Day!"
VITE_BIRTHDAY_LETTER_TITLE="Happy Birthday!"
VITE_BIRTHDAY_DATE="2026-01-01"
VITE_BIRTHDAY_MESSAGE="First paragraph of the letter|Second paragraph|Third paragraph"
```

---

## 📌 Project Background

This project was built as part of a personal portfolio series exploring **"vibe coding"** — using AI-assisted, prompt-driven development tools (in this case, Google AI Studio's Build mode with Gemini) to design and ship complete, polished small products outside of my primary technical specialization. The full process for this project started with a written Product Requirements Document covering the problem statement, objectives, constraints, acceptance criteria, user stories, screen-by-screen wireframes, and technical/data structure notes — which was then handed to Gemini as the basis for implementation, followed by iterative rounds of bug fixes and feature refinement (including the real microphone-based candle detection, the personalization system, and UI polish).

---

## 📄 License

This project is available for personal reference and learning purposes. Feel free to fork it and adapt it for your own birthday celebrations!

---

<div align="center">

**Made with 🎂 and vibe coding**

[Live Demo](https://wishbox-birthday-card.vercel.app/) · [Report an Issue](https://github.com/viochris/wishbox-birthday-card/issues)

</div>
