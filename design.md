# Design System & Visual Architecture — Simple AI

This document details the visual style, color palettes, skeuomorphic structures, typography rules, and audio mechanics that define the user experience of Simple AI.

---

## 1. Visual Ethos & Style Concept

Simple AI is styled like a premium, tactile, and highly responsive **"Tactile Bento-Grid Editorial Journal"**. 

Unlike standard "flat" Web 2.0 designs or dark, neon-soaked AI tech-sites, Simple AI utilizes a **warm, organic, and academic physical paper** feel. It pairs display-heavy typography with skeuomorphic elevations to make elements look like real, touchable modules.

### Core Visual Principles
- **Aesthetic Pairings**: Pairing warm, off-white card backgrounds with deep charcoal text and bold amber accents.
- **Dimensionality**: Subtle double-borders, soft custom shadows, and inset inner shadows to give elements physical depth.
- **Micro-Animations**: Layout transitions, hover rotations, sliding indicators, and elastic spring buttons that make clicking feel delightful.
- **Zero Tech-Clutter**: No mock server logs, telemetry, or unrequested terminal screens. Standard, warm, human labeling.

---

## 2. Color Palette & Palette Tokens

All colors are configured dynamically via CSS Variables in `/src/index.css` inside the `@theme` block:

| Token Name | Hex Value | Visual Purpose |
| :--- | :--- | :--- |
| `cream` | `#F5F2ED` | Primary background color. Mimics warm archival editorial paper. |
| `sand` | `#EBE7E0` | Sidebar, drawer backgrounds, and borders. Soft physical depth. |
| `amber` | `#d97706` | Primary brand accent. Guides attention, labels active sections. |
| `amber-dark` | `#b45309` | Hover states and deep emphasis borders. |
| `amber-light` | `#fef3c7` | Soft glowing backgrounds for highlights and active tags. |
| `slate` | `#475569` | Secondary body text, captions, and muted icons. |
| `charcoal` | `#2D2D2D` | Primary headings, titles, and body text. Provides superb high-contrast readability. |
| `muted` | `#5E5A54` | Labels, tags, and tertiary metadata. |

---

## 3. Typography System

We pair distinct typefaces to convey a "tech-meets-editorial" personality:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

1. **Primary Body: Inter** (`font-sans`) — Highly legible, modern, neutral sans-serif designed for long-form reading on digital monitors.
2. **Display Headings: Sora** (`font-display`) — A geometric display font with soft curves, giving headings an organic, friendly, yet high-tech presence.
3. **Data & Codes: JetBrains Mono** (`font-mono`) — Used for labels, progress trackers, counts, and step prefixes to ground the interface in a clean, technical grid.

---

## 4. Skeuomorphic & Tactile Components

To break the monotony of flat UI, Simple AI implements custom skeuomorphic layers:

### 4.1. Neumorphic Skeuo-Raised Cards
Used for major modules like the 12 glossary sections. They use outer offset light/dark shadows to look elevated above the paper canvas:
```css
.skeuo-raised {
  background: #F5F2ED;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  box-shadow: 8px 8px 16px #dcd9d4, -8px -8px 16px #ffffff;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 4.2. Neumorphic Skeuo-Pressed Inputs & Wells
Used for interactive text entry wells, progress tracks, and search bars to look engraved or sunk into the paper background:
```css
.skeuo-pressed {
  background: #F5F2ED;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: inset 4px 4px 8px #dcd9d4, inset -4px -4px 8px #ffffff;
}
```

### 4.3. Glassmorphic Overlays
Used for the floating nav bar and floating controls, letting the text and diagrams scroll beautifully behind with a Gaussian blur backdrop filter:
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
```

---

## 5. Audio Synthesizer Mechanics (`audioEngine.ts`)

To create an immersive, calm sensory experience, Simple AI includes a **fully custom Web Audio synthesis engine**. It does not download external audio files, avoiding network latency and keeping the bundle lightweight.

### 5.1. Procedural Lo-Fi Beats
- **Tone Generators (Oscillators)**: Utilizes low-frequency sine wave oscillators to synthesis sweet, ambient bass hums and chord progressions.
- **Filter Envelopes**: Adds a low-pass filter to soften frequencies, resulting in a cozy, warm acoustic texture.
- **LFO (Low Frequency Oscillator)**: Modulates volumes and filter cutoffs over time to mimic the warbling pitch-drift of cassette tapes.

### 5.2. Audible Narrative (Web Speech Synthesis)
- Directly maps the textual content of Clay's lesson guide to the browser's native speech synthesizer (`window.speechSynthesis`).
- Modulates the speech rate (slowing down slightly to `0.95` or `0.9`) to sound friendly, calm, and deliberate.
- Integrates callback hooks to animate Clay's facial expressions (eyeballs shifting and mouth talking) while voice narration is active.
