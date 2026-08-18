# Development Phases & Lifecycle — Simple AI

This document details the step-by-step evolutionary milestones of the **Simple AI** platform, from initial product planning to production verification.

---

## Phase 1: Planning, Tech Stack Selection & Core Design (Complete)
- **Concept Definition**: Defined the value proposition: a highly interactive, lo-fi audio-infused, bilingual AI tutorial journal for absolute beginners.
- **Tech Stack Initialization**:
  - Selected React 19, TypeScript, and Vite for a fast client build.
  - Chose Tailwind CSS v4 for modern HSL custom variables and layouts.
  - Selected Express with tsx/esbuild for the backend API proxy to safely use the Google Gen AI SDK.
- **Visual Design Tokens**: Drafted the warm paper skeuomorphic layout (cream backgrounds, sand borders, amber highlights, deep charcoal text).

---

## Phase 2: Curriculum Structure & Translation Engine (Complete)
- **Pedagogical Mapping**: Outlined a 12-section progressive curriculum covering 85+ terms, moving sequentially from "What is AI" to "Deep Learning", "RAG", and "Ethics".
- **Bilingual Translation Schema**:
  - Created a static translation dictionary supporting English and Romanized Hyderabadi Urdu (warm, humorous regional slang).
  - Implemented the `useLanguage` React Context to wrap the application and allow real-time language toggling without reloads.

---

## Phase 3: Interactive Bento Sandboxes & Mascot Creation (Complete)
- **Clay, the Explainer Mascot**:
  - Developed the `ClayLogo` vector graphics and `ClayExplainer` stop-motion frame sequences.
  - Implemented randomized animation cycles (blinking, looking around, talking states).
- **Interactive Sandboxes**:
  - Built the **LLM Token Predictor Sandbox** allowing users to select prompts and visualize next-token generation curves.
  - Built the **RAG Simulator** to illustrate data indexing, vector database search, context binding, and hallucination reduction.
- **Mastery Tracker**: Implemented a checklist system synced with `window.localStorage` to display dynamic progress percentages.

---

## Phase 4: Backend API Proxy & Gemini Integrations (Complete)
- **Express Proxy Setup**: Programmed a secure Express node server using `@google/genai` to manage credentials in server-side memory.
- **Multi-turn Chat & Search Grounding**: Exposed `/api/gemini/chat` supporting:
  - System Instructions setting Clay's personality.
  - Search Grounding toggles (`googleSearch` tool config).
  - High-Thinking Mode (`gemini-3.1-pro-preview` with `ThinkingLevel.HIGH` and configuration settings).
- **Transcription Endpoint**: Exposed `/api/gemini/transcribe` for voice speech-to-text.
- **Veo Video API**: Programmed a polling controller for `veo-3.1-fast-generate-preview` to generate video clips and fetch base64 binary chunks.

---

## Phase 5: Procedural Audio Synthesizer (Complete)
- **Web Audio API Synth**:
  - Written a purely procedural, zero-assets audio synthesizer (`audioEngine.ts`) in JavaScript.
  - Programmed lowpass-filtered triangle wave chord progressions.
  - Engineered LFO-driven tape wow-and-flutter and custom noise-generator crackles.
  - Programmed drum sequence timers (kick, snare, hi-hat).
- **Speech Synthesis Integration**:
  - Integrated the native browser SpeechSynthesis API.
  - Mapped English and Urdu translations to regional Indian voices with optimized pitch and speaking rates.
  - Synchronized speech start/end events with Clay's animated mouth-talk state.

---

## Phase 6: QA, Optimization & Production Polish (Complete)
- **Icon Resolution**: Fixed missing icon dependencies (resolved runtime issues like the `BookOpen` import error in `WhatIsAI.tsx`).
- **Strict Lint Checks**: Configured strict TypeScript checks (`tsc --noEmit`) to verify component props and function signatures.
- **Production Bundling**:
  - Configured `vite build` and `esbuild server.ts --bundle` compiling the client to static assets and the server to a single CJS bundle (`dist/server.cjs`).
  - Successfully tested compilation times (average ~5 seconds) and validated build paths.
