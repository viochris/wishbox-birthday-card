<div align="center">

# 🎁 WishBox, Interactive Birthday Card

**A festive, four-step interactive birthday celebration experience, built for the browser.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-wishbox--birthday--card.vercel.app-ec4899?style=for-the-badge)](https://wishbox-birthday-card.vercel.app/)
[![Vibe Coded](https://img.shields.io/badge/Vibe%20Coded-Google%20AI%20Studio%20%2B%20Gemini-4285F4?style=for-the-badge)](https://ai.studio)

**[🎈 Live Demo](https://wishbox-birthday-card.vercel.app/)** · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [How It Works](#how-it-works) · [Personalization](#personalization)

</div>

---

## 📖 Overview

**WishBox** is a small, self-contained web app designed to turn a plain birthday greeting into an actual, interactive mini-celebration. Instead of sending a flat text message, the recipient opens a link and walks through four short "rituals" that mirror a real birthday, making a wish and blowing out a candle, unwrapping a gift, and reading a heartfelt letter, all wrapped in warm, festive animation, ambient music, and confetti.

The project was **vibe-coded end-to-end in [Google AI Studio](https://ai.studio) using Gemini**, starting from a written Product Requirements Document (PRD) that defined the screen flow, acceptance criteria, and constraints (most notably, this had to feel like a genuine, relationship-agnostic **birthday** celebration, not a relationship-milestone or anniversary card, and not gated behind a login or database).

It is part of a broader personal portfolio effort to demonstrate applied "vibe coding" ability, building a complete, polished, front-end-heavy interactive product with AI-assisted development tools, outside of my primary technical focus areas (Data Science, NLP, and GenAI/LLM agent engineering).

**Live demo** **https://wishbox-birthday-card.vercel.app/**

---

## Features

### The Four-Screen Celebration Flow
The app walks the recipient through a fixed sequence, with each screen a small self-contained "scene".

1. **🎉 Cover**, a warm, animated landing screen ("It's Your Day!") with floating balloons and confetti drifting in the background, and a single call-to-action to begin the celebration.
2. **🕯️ Make a Wish**, an animated birthday cake with a lit candle. The candle can be extinguished two ways.
   - **Real microphone-based blow detection**, the app requests microphone access and uses the Web Audio API to analyze live audio input, detecting an actual "blow" sound to snuff the candle out, just like a real candle.
   - A **tap/click fallback** for users who deny microphone permission or are on a device where this isn't practical, so the experience never gets stuck.
3. **🎁 Gift Box**, an animated wrapped gift box with a bow. Tapping/clicking it triggers an unwrap animation (bow untying, lid opening) before revealing the final screen.
4. **💌 The Letter**, a long, personal birthday letter revealed gradually (paragraph by paragraph), closing with a birthday message, a signature, and a celebratory confetti burst.

### Beyond the Core Flow
- **🎙️ Real candle-blow detection**, a custom `BlowDetector` utility opens a live microphone stream, runs it through a Web Audio `AnalyserNode`, and pattern-matches sustained volume spikes to distinguish an intentional "blow" from background noise or silence.
- **🔊 Synthesized ambient music**, rather than relying on a pre-recorded audio file or an external AI music-generation API, the background melody is **generated in real time in the browser** using the Web Audio API. A small hand-written synthesizer plays a warm, looping pentatonic arpeggio progression (C major / G / Am / F), with separate gain nodes for music and sound effects so either can be muted independently.
- **🗣️ Read-aloud letter narration**, the closing letter can be read aloud using the browser's native **Web Speech API** (`SpeechSynthesis`). Text is intelligently chunked into short, natural phrase-level segments (4 to 8 words) rather than whole paragraphs, which avoids a well-known Chrome bug where `speechSynthesis.resume()` silently fails after being paused for too long, and allows pause/resume to continue from the current phrase instead of restarting the whole paragraph.
- **🎊 Canvas-based confetti & floating decorations**, celebratory bursts are rendered using the `canvas-confetti` library, layered with custom animated floating balloons and sparkle decorations that adapt in density depending on which screen is active (a denser celebration effect on the final Letter screen).
- **🎬 Smooth, physics-based transitions**, all screen transitions and micro-interactions (button presses, modal open/close, step changes) are animated using **Motion** (the modern successor to Framer Motion), giving the app a fluid, native-app feel rather than abrupt state changes.
- **🎨 Personalization via URL and build-time config**, the recipient name and sender signature can be set either through URL query parameters (`?to=Alex&from=With+love`) or through environment variables at build time, so a single deployed instance can be personalized without touching the app's source code. A `PersonalizeModal` component exists in the codebase for an in-app personalization UI, but it is not currently wired up to any button in the live app, so for now personalization has to be done via URL parameters or environment variables rather than an in-app control.
- **🔇 Persistent audio controls**, a small floating header lets the visitor toggle background music on/off and mute all sound entirely, without interrupting the current screen or animation state.

---

## Tech Stack

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
| **Server (dev/local only)** | Express (used by the Vite dev tooling, the deployed app is a static, client-side bundle) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **Development Environment** | [Google AI Studio](https://ai.studio) (Build mode, powered by Gemini) |

**Notably, WishBox requires no backend and no database.** Every feature, including personalization, audio, speech, and microphone-based interaction, runs entirely client-side in the browser. This was an intentional constraint from the project's PRD, as a personal, single-use (or link-shared) greeting there was no need for persistent server-side storage, user accounts, or authentication.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (or an equivalent package manager, the project also ships a `bun.lock`, so [Bun](https://bun.sh/) works too)

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
The live demo is deployed on **Vercel** as a static site, and since the app has no backend or database dependency, it can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) by simply running `npm run build` and serving the resulting `dist/` folder.

---

## Project Structure

```
wishbox-birthday-card/
├── src/
│   ├── components/
│   │   ├── ScreenCover.tsx        # Screen 1, Cover / opening screen
│   │   ├── ScreenWish.tsx         # Screen 2, Make a Wish (candle-blow interaction)
│   │   ├── ScreenGift.tsx         # Screen 3, Gift Box (unwrap interaction)
│   │   ├── ScreenLetter.tsx       # Screen 4, The Letter (reveal + read-aloud)
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
│   │   ├── microphone.ts          # BlowDetector, real microphone-based candle-blow detection
│   │   └── confetti.ts            # canvas-confetti wrapper/presets
│   ├── types.ts                   # Shared TypeScript types (ScreenStep, LetterContent, etc.)
│   ├── App.tsx                    # Root component, manages the 4-screen step sequence
│   ├── main.tsx                   # React app entry point
│   └── index.css                  # Global styles / Tailwind entry
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
└── metadata.json                  # AI Studio app metadata
```

---

## How It Works

### Screen Flow
`App.tsx` holds a single piece of state, `currentStep`, which drives which of the four screens is rendered (`cover → wish → gift → letter`), transitioning via `motion`'s `AnimatePresence` for smooth cross-fades between steps. Each screen is a self-contained component that receives only the props it needs (e.g. the recipient's name) and calls a callback (`onStart`, `onWishCompleted`, `onGiftOpened`, `onReplay`) to advance the flow, and there is no global routing library involved, since the experience is intentionally linear and single-page.

### Candle-Blow Detection
The `BlowDetector` class in `utils/microphone.ts` requests microphone access via `navigator.mediaDevices.getUserMedia`, pipes the resulting audio stream into a Web Audio `AnalyserNode`, and continuously samples the frequency/volume data on each animation frame. A sustained volume spike above a calibrated threshold, held for a short duration, is interpreted as a "blow" and triggers the candle-out animation. If microphone access is denied, unsupported, or simply not used, the screen still offers a manual tap/click button, so the experience is never blocked.

### Ambient Music Without an External API
Rather than shipping an audio file or calling an AI music-generation service, `utils/soundEngine.ts` defines a small hand-written synthesizer, a 4-measure warm pentatonic arpeggio progression (encoded as arrays of frequencies) is played back through chained `OscillatorNode`/`GainNode` graphs on a loop, with independent gain control for music versus sound effects (button pops, confetti pops, etc.), and a master mute switch.

### Letter Read-Aloud
`utils/ttsEngine.ts` wraps the browser's native `SpeechSynthesis` API. Rather than feeding it whole paragraphs (which can trigger a known Chrome bug where `resume()` silently does nothing after a long pause), the letter text is split into short, natural phrase-level segments of roughly 4 to 8 words each. This lets playback pause and resume precisely from the current phrase, rather than restarting an entire paragraph, and keeps the read-aloud experience smooth across browsers.

### Personalization Without a Backend
There are two layers of personalization, both fully client-side.
1. **Build-time defaults**, `src/config/birthdayConfig.ts` holds the default recipient name, sender name/signature, and letter paragraphs, which can be overridden at build time via environment variables (`VITE_BIRTHDAY_RECIPIENT_NAME`, `VITE_BIRTHDAY_SENDER_NAME`, `VITE_BIRTHDAY_MESSAGE`, etc.), useful when deploying a dedicated instance for one specific recipient.
2. **Share-time personalization**, the in-app `PersonalizeModal` lets a sender fill in a recipient name and signature, then generates a shareable URL with those values encoded as query parameters (e.g. `?to=Alex&from=With%20love`). `src/data/letterData.ts` reads these parameters on load (falling back to the environment/config defaults if absent), so a single deployed instance of the app can generate many different personalized links without any redeploy or backend storage.

---

## 🎨 Design Philosophy

The visual language leans into a **festive-but-tender** palette, soft pink, cream, and gold tones rather than a purely playful/childish "party" look, since the intended emotional register sits between celebratory and heartfelt. Motion is used deliberately, transitions are smooth and weighted rather than snappy, decorations (balloons, sparkles) drift gently in the background rather than looping mechanically, and the letter's gradual paragraph-by-paragraph reveal is paced to feel like reading something someone actually wrote, rather than a wall of text appearing all at once.

A deliberate product constraint (carried over from the project's PRD) was to keep the tone **relationship-agnostic**, default copy avoids romance-specific language (e.g. "Happy Birthday, [Name]" rather than "Happy Birthday, My Love") so the same experience can be personalized and sent to a partner, a close friend, or a family member alike.

---

## Personalization

There are two different ways to personalize this card for someone, and they solve two different situations.

**Option A, quick link personalization (no rebuild, no redeploy).** Use this when you just want to send the existing live app to one person right now, without setting anything up. It works by adding query parameters to the URL, which `src/data/letterData.ts` reads directly in the browser when the page loads.

1. Take the live demo URL, `https://wishbox-birthday-card.vercel.app/`.
2. Add `?to=RecipientName&from=YourSignature` to the end of it, replacing the values with the actual recipient's name and your own signature (spaces can be written as `+` or `%20`).
3. Copy the resulting link (e.g. `https://wishbox-birthday-card.vercel.app/?to=Alex&from=With+love`) and send it directly.

This is the fastest option, and the same single deployment can generate a different personalized link for as many different recipients as you want, since nothing is rebuilt or redeployed, the personalization lives entirely in the URL itself. The trade off is that the link looks a bit less clean (it has a visible `?to=...&from=...` part), and only the recipient name and signature can be personalized this way, not the letter's paragraphs, the cover title, or the birthday date.

This can also be done in-app instead of editing the URL by hand, a "Personalize" button in the header (next to the music and mute controls) opens a form where you can set the recipient name and your signature, preview the change immediately on the current screen, and copy a ready-to-share link generated from those values.

**Option B, a fully dedicated, permanently personalized deployment.** Use this when you want your own separate copy of the app where the recipient's name, the letter content, and other details are baked in as the actual defaults, so the plain URL (with no query parameters at all) already shows the personalized version, and every field can be customized, not just the name and signature. This is done through environment variables, which `src/data/letterData.ts` reads at build time via `import.meta.env`, and which are defined like this.

```bash
VITE_BIRTHDAY_RECIPIENT_NAME="Alex"
VITE_BIRTHDAY_SENDER_NAME="Jordan"
VITE_BIRTHDAY_SENDER_SIGNATURE="With all my warmest wishes"
VITE_BIRTHDAY_COVER_TITLE="It's Your Day!"
VITE_BIRTHDAY_LETTER_TITLE="Happy Birthday!"
VITE_BIRTHDAY_DATE="2026-01-01"
VITE_BIRTHDAY_MESSAGE="First paragraph of the letter|Second paragraph|Third paragraph"
```

Where exactly each of these lines goes depends on whether you are running the app locally or deploying it.

*Running locally.* This project does not currently ship a `.env` or `.env.local` file, so you need to create one yourself. In the project's root folder (the same folder as `package.json` and `vite.config.ts`), create a new file named `.env.local`, and paste the variables above into it, with your own values. Vite automatically loads this file and exposes any variable prefixed with `VITE_` to the app through `import.meta.env`, no extra configuration is needed. This file should never be committed to GitHub, since it is meant to hold your own local/personal values, add `.env.local` to a `.gitignore` file at the project root if one does not already exist.

*Deploying your own copy (e.g. on Vercel).* A `.env.local` file on your own computer has no effect on a deployed build, since it is not part of the repository. Instead, add the same variables through your hosting provider's dashboard. On Vercel specifically, that means going to your project, then Settings, then Environment Variables, and adding each `VITE_BIRTHDAY_...` name and value there, then triggering a new deployment (redeploying is required, since these values are baked in at build time, not read at runtime).

Only the letter's message field works a little differently from the others, `VITE_BIRTHDAY_MESSAGE` expects all of the letter's paragraphs joined into one single value, separated by a `|` character (as shown in the example above), which `src/data/letterData.ts` then splits back into an array of separate paragraphs.

If you want both a personalized default (Option B) and the ability to occasionally override the recipient name for one specific shared link (Option A), you can actually use both together, the URL query parameters, when present, take priority over whatever is set through environment variables.

---

## 📌 Project Background and Vibe Coding Process

This project was built as part of a personal portfolio series exploring **"vibe coding"**, using AI-assisted, prompt-driven development tools to design and ship complete, polished small products outside of my primary technical specialization (Data Science, NLP, and GenAI/LLM agent engineering). Below is the actual sequence followed to go from an idea to this finished, deployed app.

### 1. Ideation
The starting point was a broader goal, building a small set of portfolio side projects that show range beyond my core field through "vibe coding" in Google AI Studio. A handful of ideas were brainstormed across web, mobile, and game development, including a Supabase-backed dashboard, a link-in-bio page, a quiz app, and a birthday greeting card. The birthday card was picked first since it was judged the simplest and fastest to complete, needing no backend, no database, and no complex state management, making it a good warm-up project before attempting something more involved.

### 2. Drafting the PRD
Rather than jumping straight into prompting, a full written Product Requirements Document was drafted first, in the same structured format used across all of these portfolio projects, a problem statement, objectives, key constraints, acceptance criteria, user stories, screen-by-screen wireframes tied to a fixed user flow, and a technical details section covering the sequence diagram and the client-side data structure. Writing the PRD first, rather than describing the idea loosely in a single prompt, was meant to give the AI a much clearer and more complete specification to build from.

### 3. Refining the Scope
An earlier draft of the concept included extra screens, an interactive "do you like me" question, a photo gallery, and a small quiz, aimed more at a romantic partner than a general recipient. After review, that scope was deliberately trimmed down. The question, gallery, and quiz screens were removed, and the tone was made relationship-agnostic (for example, "Happy Birthday, [Name]" instead of "Happy Birthday, My Love"), so the same card could be sent to a partner, a friend, or family, and so the first build would stay small and achievable. This is reflected directly in the PRD's Key Constraints section.

### 4. Prompting and Building in Google AI Studio
With the PRD finalized, a detailed build prompt was written that explicitly pointed to each relevant PRD section (the wireframes and flow, the acceptance criteria, the data structure, and the notes on key interactions) rather than restating every requirement inline, to avoid duplication and keep the AI's output consistent with a single source of truth. This prompt, along with the PRD document, was given to Gemini inside Google AI Studio's Build mode, which generated the initial working version of the app directly from the specification.

### 5. Iterative Bug Fixing and Feature Requests
The first generated build was tested directly, and a number of follow-up prompts were written to fix issues and add features as they were found, including wiring up the real microphone-based candle-blow detection properly, refining the letter's read-aloud behavior, and general polish passes. Each fix was scoped narrowly to the specific problem observed, rather than asking for a broad rewrite, to avoid unintended regressions elsewhere in the app.

### 6. Deployment
Once the build was stable, it was deployed to **Vercel** as a static site, taking advantage of the fact that the app has no backend or database dependency, resulting in the live version at **https://wishbox-birthday-card.vercel.app/**.

### 7. Testing the Live App and Fact-Checking the Documentation
Once deployed, the live app itself was tested directly, going through the full cover, wish, gift, and letter sequence to confirm it behaved and looked as intended. Separately, when it came time to write this documentation, the exported source code was checked to make sure the write-up matched what was actually implemented rather than just the original prompt. This turned up a few real discrepancies worth correcting, the background music turned out to be a hand-written Web Audio API synthesizer rather than an AI-generated track, the letter's read-aloud used the browser's native Web Speech API rather than a Gemini speech model, and a `PersonalizeModal` component existed in the code but was never actually wired up to a visible button in the app. Each of these was corrected in the documentation rather than left as an inaccurate claim.

### 8. Documentation and GitHub Setup
Finally, the repository was set up on GitHub with a name, description, and topic tags chosen to accurately reflect the finished app's real tech stack and feature set (updated after the code review in step 7, not just the original plan), and this README was written to document the tech stack, project structure, inner workings of each major feature, and this development process itself, for anyone (including a future version of myself) looking back at how the project was actually built.

---

## 📄 License

This project is available for personal reference and learning purposes. Feel free to fork it and adapt it for your own birthday celebrations!

---

<div align="center">

**Made with 🎂 and vibe coding**

[Live Demo](https://wishbox-birthday-card.vercel.app/) · [Report an Issue](https://github.com/viochris/wishbox-birthday-card/issues)

</div>
