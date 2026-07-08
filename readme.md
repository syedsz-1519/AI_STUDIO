# Simple AI — Interactive Educational Journal

An elegant, beginner-safe, tactile editorial journal written in React, TypeScript, and Tailwind CSS. This website is built to demystify complex artificial intelligence and machine learning structures through clean visual logic, fun simulators, and dual-language localization (English and Hyderabadi Roman Urdu).

---

## 📂 Key Architecture & Code Directory

Below is the directory roadmap highlighting all the critical files and folders that power the application's backend logic, state managers, custom audio engine, and bento components:

```
├── README.md               # Repository welcome and configuration overview
├── design.md               # Visual system, typography, colors, and UI layout rules
├── roadmap.md              # Detailed curriculum, 12 glossary sections, and 85+ terms
├── prd.md                  # Product Requirements Document (Personas, Scope, Specs)
├── package.json            # NPM dependencies, compilation commands, and build configurations
├── tsconfig.json           # TypeScript configuration and rules
├── index.html              # Core single-page entry layout
├── src/
│   ├── main.tsx            # Initial mounting point of the React app
│   ├── App.tsx             # Main container, layout flow, and footer component
│   ├── index.css           # Global Tailwind classes, skeuomorphic shadows, and custom fonts
│   ├── types.ts            # Global TypeScript types and interfaces
│   ├── components/         # Modular interactive UI widgets
│   │   ├── ClayLogo.tsx         # Hand-crafted stop-motion bot avatar vector logo
│   │   ├── FloatingNav.tsx      # Tactile header navigation with reading time calculators
│   │   ├── LanguageToggle.tsx   # Dual-mode language toggle pill + floating screen bubble
│   │   ├── Hero.tsx             # Welcome hero card with active pattern nodes
│   │   ├── WhatIsAI.tsx         # What is AI lesson card and pocket utility guide
│   │   ├── AITimeline.tsx       # Expandable history milestones grid
│   │   ├── ClayExplainer.tsx    # Multi-scene stop-motion storyboard player for Clay
│   │   ├── AIFamilyTree.tsx     # Interactive Concentric nested circle map visualization
│   │   ├── GenerativeAI.tsx     # Generative AI, LLM weights and token sandboxes
│   │   ├── PromptingAndRAG.tsx  # Prompt styles, RAG simulators and flows
│   │   ├── AIToolsList.tsx      # Curated 40+ free AI tools directory (with copy triggers)
│   │   └── ClosingAndDeeper.tsx # Layer 4 glossary milestone checklist, progress tracker & quizzes
│   ├── data/               # Static dataset configurations
│   │   └── roadmapTerms.ts      # Structured data for 12 sections, terms, and test-yourself answers
│   ├── hooks/              # Custom state triggers and contexts
│   │   ├── useLanguage.tsx      # Translation context with full English/Hyderabadi dictionary
│   │   └── useScrollProgress.ts # Hook for calculating scroll progress percentages
│   └── lib/                # Custom helper files and core mechanics
│       └── audioEngine.ts       # Procedural audio synthesizers & Web Speech controllers
```

---

## ⚡ Running & Developing Locally

### 1. Install Dependencies
To install all required packages:
```bash
npm install
```

### 2. Run the Dev Server
To start the live-reloading local development server:
```bash
npm run dev
```
*The application runs on port `3000` behind a local proxy container layer.*

### 3. Verify Code Quality (Linting)
Ensure code conforms to TypeScript and strict formatting standards:
```bash
npm run lint
```

### 4. Build for Production
To bundle and compile the application for high-performance static hosting:
```bash
npm run build
```
The output static HTML/CSS/JS bundles will be generated cleanly inside the `/dist` directory.

---

## 💎 Key Highlights & Interactive Engagements

- **Clay the Explainer Mascot**: A cute stop-motion character built with custom turnarounds, blinking eyeballs, and procedural mouth-talk synchronizations.
- **Synthesized Study Room**: Integrates a procedural Web Audio lo-fi sound synthesizer. It generates calming chord waves and drum hums on-the-fly to facilitate focused reading.
- **Interactive Sandbox & Simulators**: Word-prediction probability weight simulators and Retrieval-Augmented Generation context simulators.
- **Hyderabadi Roman Urdu Support**: A humorous, engaging, and culturally relevant Romanized translation engine (e.g., swapping standard tech jargon for friendly Hyderabad slangs like *"Miya"* and *"Arey Bhai"*).
