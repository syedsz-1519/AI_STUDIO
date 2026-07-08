# Product Requirements Document (PRD) — Simple AI

An interactive, beginner-safe editorial journal designed to demystify modern artificial intelligence, machine learning, and generative systems through clean, intuitive visual logic.

---

## 1. Executive Summary & Value Proposition

**Simple AI** is a tactical, highly interactive single-screen web journal aimed at complete beginners. Modern AI educational materials are often either overly simplistic (non-interactive) or highly intimidating (math/code-heavy). 

Simple AI occupies the sweet spot: a **highly visual, tactile, and sensory-friendly guide** that explains AI through:
1. **Calm Analogies**: Explaining neural structures like teaching a child what a "dog" is.
2. **Interactive Sandboxes**: Letting users step through complex mechanics (like LLM token prediction probabilities and RAG document fetching) in real time.
3. **Inclusive Localization**: Offering a complete, culturally authentic translation toggle between English and Hyderabadi Urdu (Roman script) to make AI relatable and funny.
4. **Procedural Lo-Fi Synthesizer**: Providing an immersive learning environment with responsive synthesized beats and TTS (Text-to-Speech) audio narration.

---

## 2. Target Audience & Personas

- **The Absolute Beginner**: Believes AI is "magic" or "thinking software". Needs to understand that AI is mathematical pattern-matching.
- **The Non-Technical Builder**: Wants to leverage AI tools but gets confused by acronyms like LLM, RAG, and Transformer.
- **The Regional Learner**: Connects deeply with conversational, local slang. The **Hyderabadi Roman Urdu** translation makes complex engineering topics approachable and incredibly fun.

---

## 3. High-Level Feature Specifications

### 3.1. Structured Learning Path (The Four Layers)
The page layout is structured as a vertical progressive narrative. Each layer builds directly upon the concepts taught in the previous layer:
- **Layer 1: The Basics (What is AI?)** — Defines AI, provides an everyday analogy, outlines a chronological timeline of computer science, and highlights where AI resides in daily life.
- **Layer 2: Core Concepts (The AI Family Tree & Generative AI)** — Uses a beautiful nested concentric circle model to explain AI, Machine Learning (ML), Deep Learning (DL), and Generative AI.
- **Layer 3: Practical Application (Prompting & RAG)** — Breaks down prompting paradigms (Zero-shot, Few-shot) and demonstrates Retrieval-Augmented Generation to prevent model hallucinations.
- **Layer 4: Collapsible Deeper Glossary** — Houses 85+ key AI terms organized into 12 structured learning sections with checkboxes, interactive quizzes, and expandable advanced concepts (Agents, Fine-tuning, Embeddings, Ethics).

### 3.2. Tactile Interactive Components
- **Clay, the Explainer Bot**: A friendly stop-motion-style mascot that guides the user, blinks dynamically, and speaks audible lessons when clicked.
- **Dynamic Token Predictor Sandbox**: A live visualization of how a Large Language Model works. Users choose a starting prompt, see calculated probability weights for next-words (tokens), and watch the model build sentences.
- **RAG Simulator**: Users select a highly specific question, and watch step-by-step as a search query is dispatched, context is retrieved from a simulated DB, and an accurate, hallucination-free summary is formed.
- **Interactive Progress & Checklist System**: Users can check off glossary terms as they read. Progress is tracked via a persistent progress bar showing percentage mastery, saved in the browser's `localStorage`.

### 3.3. Dual-Language Translation Engine
- Supports seamless real-time toggle between **English** and **Hyderabadi (Roman Urdu)**.
- Features highly authentic, warm, and humorous Hyderabadi translations (e.g., "Arey Yaaron, AI Bole to Asal mein kya hai?", "Dimaag ki dahi kare bina samjhata hai").

### 3.4. Procedural Audio Engine
- **Procedural Lo-Fi beats**: Web Audio API generates smooth ambient waves and beats to assist focus without heavy file downloads.
- **Speech Synthesis Integration**: A fully functional Text-to-Speech engine converts lessons into audio narrations hosted by Clay.

---

## 4. Technical Architecture Overview

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **State Management**: React Hooks (State, Effects) and Custom Context (`LanguageProvider`).
- **Animations**: `motion/react` (Framer Motion) for spring physics, toggles, layout shifts, and sliding panels.
- **Icons**: `lucide-react` for responsive SVG vectors.
- **Sound**: Native HTML5 Web Audio API and Web Speech API.

---

## 5. Success Metrics & Usability Guidelines

- **Desktop-First Precision**: Gorgeous wide layouts utilizing columns, grid gaps, and interactive hover tooltips.
- **Mobile Fluidity**: Responsive scaling to fit mobile displays seamlessly with touch-safe tap targets (minimum 44px).
- **Instant Response**: Real-time updates without database query bottlenecks (utilizing local state & static data files).
- **100% Beginner-Safe**: Zero mathematical equations, code blocks, or technical intimidation in the primary flow.
