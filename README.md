# 🌐 OmniLingo 4X — Real-Time Multi-Language Translation Web App

A modern, high-performance, responsive React web application for bidirectional real-time multi-language translation between **English**, **German**, **Dutch**, and **Indonesian**.

---

## ✨ Features

- **4-Way Simultaneous Translation**:
  - 🇺🇸 **English (EN)**
  - 🇩🇪 **German (Deutsch - DE)**
  - 🇳🇱 **Dutch (Nederlands - NL)**
  - 🇮🇩 **Indonesian (Bahasa Indonesia - ID)**
- **Type Anywhere**: Type or paste text into **ANY** of the 4 cards — it instantly synchronizes and translates into the other 3 languages in real time.
- **Zero Cursor Jumps & Loop-Free State Management**:
  - Synchronous local state updates preserve immediate caret and typing responsiveness.
  - Directional one-way debounce prevents recursive update loops (A → B → C → A).
  - Outdated requests are safely cancelled with `AbortController`.
- **"Clear All" & Individual Card Clear**: One-click wipe of all 4 boxes or targeted clearing of individual cards.
- **Copy with Instant Feedback**: Copy button on each card with a 2-second visual confirmation ("Copied!").
- **Text-To-Speech (Pronunciation)**: Native speech synthesis (`SpeechSynthesisUtterance`) with the correct accents for `en-US`, `de-DE`, `nl-NL`, and `id-ID`.
- **Voice Dictation (Speech-To-Text)**: Speak directly into any box using Web Speech Recognition (`webkitSpeechRecognition`).
- **Multi-Engine Translation Architecture**:
  1. **Free Public API (Default)**: Powered by MyMemory API (no key required for up to 5,000 words/day).
  2. **Offline Dictionary & Fallback**: Fast local dictionary covering common phrases, greetings, questions, and core vocabulary with zero network requirements.
  3. **LibreTranslate**: Connect to self-hosted or public LibreTranslate instances with optional API keys.
  4. **DeepL API**: Plug in DeepL Free or Pro authentication keys for neural translation quality.
  5. **In-Memory LRU Cache**: Avoids duplicate network calls and delivers instant results.
- **Auto-Expanding Textareas**: Smooth automatic resizing using modern CSS (`field-sizing: content`) with dynamic height calculation fallbacks.
- **Dark / Light Mode**: Beautiful theme toggle with system preference detection and `localStorage` persistence.
- **Quick Sample Phrases Bar**: Interactive chips to test translations with a single click.

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

## 🔑 Scaling Up & API Key Configuration

The app comes out-of-the-box with **free public translation (no setup needed)** and an offline dictionary fallback.

To scale up or use a proprietary translation API:
1. Click the **Settings** (⚙️) icon in the top header.
2. Select your provider:
   - **MyMemory**: Add your email address to raise daily limits to 50,000 characters/day for free.
   - **LibreTranslate**: Enter your custom endpoint URL and API key.
   - **DeepL API**: Enter your DeepL Auth Key (supports both Free `:fx` keys and Pro keys).
   - **Offline Mode**: Restrict to local dictionary (0 network requests).
3. Adjust the typing debounce delay (200ms – 900ms) to your preference.
4. Settings are automatically saved to `localStorage`.

Code annotations are provided in [`src/services/translator.ts`](file:///d:/Code%20Antigravity/Language%20Translation/src/services/translator.ts).

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Modern iconography)
- **Web Speech API** (SpeechSynthesis & SpeechRecognition)
