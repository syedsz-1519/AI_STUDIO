# Technical Requirements Document (TRD) — Simple AI

This document details the software specifications, API schemas, browser API implementations, and performance standards required for the **Simple AI** platform.

---

## 1. Environment & Platform Requirements

### 1.1. Backend Runtime Environment
- **Node.js**: Version `18.x` or higher (LTS recommended).
- **TypeScript**: Version `~5.8.2` or higher (strict checking enabled in `tsconfig.json`).
- **NPM**: Version `9.x` or higher.

### 1.2. Client Execution Platform
- **Browser Compatibility**: Must support standard modern browsers (Chrome >= 95, Edge >= 95, Safari >= 15, Firefox >= 93).
- **Required Browser APIs**:
  - HTML5 **Web Audio API** (specifically `AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`, and `ScriptProcessorNode`).
  - HTML5 **Speech Synthesis API** (`window.speechSynthesis` and `SpeechSynthesisUtterance`).
  - HTML5 **LocalStorage** for user progress and preference storage.

---

## 2. Dependencies & Build Pipelines

All dependencies are defined in [package.json](file:///c:/Users/ASUS/Desktop/major%20project/AI_STUDIO/package.json):

### 2.1. Core Dependencies
- `@google/genai` (`^2.4.0`): Official Node client library for Google Gemini.
- `express` (`^4.21.2`): API proxy server framework.
- `react` / `react-dom` (`^19.0.1`): Reactive user interface framework.
- `@tailwindcss/vite` (`^4.1.14`): Native CSS utility styling integration.
- `motion` (`^12.23.24`): Frame and spring physics rendering.
- `lucide-react` (`^0.546.0`): Icon vector graphic files.

### 2.2. Compilation & Bundling Commands
- **Development**: `tsx server.ts` starts the Express server which embeds Vite middleware for direct hot-module loading in client-side.
- **Production Compilation**:
  1. Client static assets are compiled to `/dist` using `vite build`.
  2. Express TypeScript server is bundled into a single CommonJS asset using `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs`.

---

## 3. Backend API Endpoints & Request-Response Schemas

### 3.1. Health & Configuration Validation
- **Endpoint**: `/api/health`
- **Method**: `GET`
- **Response Schema**:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "timestamp": "2026-08-18T18:24:00.000Z"
}
```

### 3.2. Gemini Chat Hub (Proxy Router)
- **Endpoint**: `/api/gemini/chat`
- **Method**: `POST`
- **Request Parameters**:
```json
{
  "messages": [
    { "role": "user", "content": "Arey Bhai, RAG kya hota hai?" }
  ],
  "model": "gemini-3.5-flash",
  "systemInstruction": "Optional custom prompt...",
  "useSearch": true,
  "thinking": false,
  "language": "hyd"
}
```
- **Response Schema**:
```json
{
  "reply": "RAG bole to Retrieval-Augmented Generation...",
  "sources": [
    { "title": "Retrieval-Augmented Generation", "uri": "https://..." }
  ],
  "model": "gemini-3.5-flash",
  "grounded": true
}
```

### 3.3. Audio Voice-to-Text Transcription
- **Endpoint**: `/api/gemini/transcribe`
- **Method**: `POST`
- **Request Parameters**:
```json
{
  "audioBase64": "UklGRi...",
  "mimeType": "audio/webm",
  "language": "en",
  "prompt": "Listen carefully to this voice instruction..."
}
```
- **Response Schema**:
```json
{
  "transcript": "Hello, explain how neural networks learn."
}
```

### 3.4. Veo Video Asset Generator
- **Endpoint**: `/api/gemini/veo/generate`
- **Method**: `POST`
- **Request Parameters**:
```json
{
  "prompt": "A small stop-motion clay robot waving hello",
  "imageBase64": "Optional base64 image seeds...",
  "mimeType": "image/png",
  "aspectRatio": "16:9"
}
```
- **Response Schema**:
```json
{
  "operationName": "projects/.../operations/...",
  "done": false
}
```

### 3.5. Veo Video Status Poller
- **Endpoint**: `/api/gemini/veo/status`
- **Method**: `GET`
- **Query Parameters**: `operationName=projects/.../operations/...`
- **Response Schema (In Progress)**:
```json
{
  "done": false,
  "metadata": {}
}
```
- **Response Schema (Completed)**:
```json
{
  "done": true,
  "videoBase64": "data:video/mp4;base64,AAAAHGZ0eXBtcDQy..."
}
```

### 3.6. Concept Metaphor Explainer
- **Endpoint**: `/api/gemini/explain`
- **Method**: `POST`
- **Request Parameters**:
```json
{
  "topic": "Neural Network",
  "context": "Beginner AI course",
  "language": "en",
  "depth": "simple"
}
```
- **Response Schema**:
```json
{
  "explanation": "Metaphor: A kitchen recipe line...",
  "model": "gemini-3.1-flash-lite"
}
```

---

## 4. Audio Synthesis Spec details

All client audio generation is controlled in [audioEngine.ts](file:///c:/Users/ASUS/Desktop/major%20project/AI_STUDIO/src/lib/audioEngine.ts):

### 4.1. Web Audio Parameter Settings
- **Chord Oscs**: Triangle wave oscillators, detuned by up to `12` cents randomly.
- **LPF Filter**: `BiquadFilterNode` configured as a `lowpass` filter at `650Hz` with a resonance `Q` of `1.5`.
- **Flutter LFO**: Sine wave oscillator at `0.25Hz` (4-second cycle) connected to a gain node modulating filter cutoff frequency by `150Hz`.
- **Vinyl Crackle**: `ScriptProcessorNode` running at a buffer size of `4096`. Emits a base static gain of `0.003` with randomized click spikes up to `0.4` amplitude.

### 4.2. Text-to-Speech Utterance Tuning
- **Urdu/Hindi Voices**: Priority lookup for `ur-IN`, `hi-IN` neural/premium profiles. Defaults to `en-IN` profiles if absent. Pitch multiplier: `1.05`, Speech rate: `0.94`.
- **English Voices**: Priority lookup for `en-US` and `en-GB`. Pitch multiplier: `1.10`, Speech rate: `0.96`.
- **Safety**: Utterances are parsed to strip markdown formats (`*`, `_`, `` ` ``) before sending to `window.speechSynthesis.speak()`.

---

## 5. Security & Isolation Controls
- **API Key Masking**: No client script compiles or reads `GEMINI_API_KEY`. It is restricted to server-side environments.
- **Buffer Size Protection**: Node request parser limits are set to `50mb` to allow audio-payload transmissions while avoiding payload denial-of-service blockages.
- **XSS & Script Sanitation**: Custom content parsing removes dangerous characters from chat feeds.
