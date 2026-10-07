# 🌏 AkehBoso — Nusantara-Connected Multi-Language & Technical Studio

A high-performance, elegant React web application for bidirectional real-time multi-language translation and technical equipment inspection, designed with a warm, archipelago-inspired Nusantara aesthetic.

---

## ✨ Features

- **Rebranded to AkehBoso**:
  - Warm golden-amber and tropical jade/emerald palette honoring Indonesian Nusantara heritage.
  - Bespoke dark-slate canvas (`#070d14`) with subtle ambient glow highlights.
- **4-Way Simultaneous Translation Grid**:
  - Default pairing: 🇺🇸 English (EN), 🇩🇪 German (DE), 🇳🇱 Dutch (NL), 🇮🇩 Indonesian (ID).
  - **Dynamic Language Selector Dropdowns**: Swap any of the 4 boxes on the fly between 16 international languages (Spanish, French, Japanese, Korean, Arabic, and more).
- **Expanded 1,000-Character Capacity**:
  - Auto-expanding textareas comfortably handle long technical documents, operational manuals, and paragraphs without breaking layout.
- **Type Anywhere (Bidirectional Real-Time)**:
  - Type or paste text into **ANY** active card — it instantly synchronizes and translates into the other 3 cards in real time.
- **Zero Cursor Jumps & Loop-Free State Management**:
  - Synchronous local state updates preserve immediate caret responsiveness.
  - Directional one-way debounce prevents recursive update loops (A → B → C → A).
  - Outdated network requests are safely cancelled with `AbortController`.
- **Dynamic Visual Reference & Equipment Inspector**:
  - Automatically queries and visualizes relevant technical imagery, equipment previews, and multilingual nomenclature cards as you type.
  - Multi-industry filter: Construction 🏗️, Manufacturing 🏭, Laboratory 🔬, Electrical ⚡.
- **Feedback & Feature Suggestion Modal**:
  - Built-in feedback dialog with category filtering (Feature Request, Bug Report, Language Suggestion, General Feedback) and local persistence.
- **Text-To-Speech & Voice Dictation**:
  - Native speech synthesis with natural accent articulation.
  - Voice dictation via Web Speech API (`webkitSpeechRecognition`).
- **Multi-Engine Translation Architecture**:
  1. **Free Public API (Default)**: Powered by MyMemory API.
  2. **Offline Dictionary & Fallback**: Fast local dictionary for technical and everyday terminology.
  3. **LibreTranslate**: Connect to self-hosted or public LibreTranslate instances.
  4. **DeepL API**: Plug in DeepL Free or Pro authentication keys.
  5. **In-Memory LRU Cache**: Avoids duplicate network calls and delivers instant results.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the directory
cd "d:/Code Antigravity/Language Translation"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Modern iconography)
- **Web Speech API** (SpeechSynthesis & SpeechRecognition)
