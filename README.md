# Reel Analyzer (Chrome Side Panel Extension)

A powerful Chrome Extension running in Chrome's native **Side Panel** designed to analyze Instagram Reels, extract actionable insights via **Google Gemini Web**, **ChatGPT Web**, or **Meta AI Web**, and effortlessly manage your Saved Reels collections.

---

## 🌟 Persistent Chrome Side Panel
Instead of a temporary popup that closes when you click away, **Reel Analyzer** runs in Chrome's native **Side Panel** (just like *Ask Gemini* or *Copilot*):
- 📌 **Always Docked**: Stays open on the right side while you browse Instagram or watch Reels.
- 🔄 **Real-Time Progress**: Track live summaries, timers, and execution logs in real time.
- ⚡ **Multi-Tab Orchestration**: Connects your Instagram tab directly to your active AI tab seamlessly.

---

## 🎯 Key Features

1. **Instagram 1-Click Navigation**:
   - Auto-detects your logged-in `@username` (or enter it manually).
   - 1-click jump to **Saved Reels** (`/username/saved/all-posts/`) or **Reels Feed** (`/reels/`).
2. **Multi-AI Engine Support**:
   - **Google Gemini Web (`gemini.google.com`)**: Comprehensive prompt injection & live status tracking.
   - **ChatGPT Web (`chatgpt.com`)**: Full context & structured takeaway extraction.
   - **Meta AI Web (`meta.ai`)**: Native Instagram URL link summarizer with zero setup.
3. **Automated Continuous Processing**:
   - Set target count, cooldown delay, and optional **Auto-Unsave** after processing.
   - Runs in the background service worker — keeps running even if you switch tabs.
4. **Dedicated Unsave Cleaner**:
   - Clean up saved posts with flexible Skip (Offset) and Count parameters.
5. **Clean Exports**:
   - Export processed summaries anytime to **Markdown** or **CSV**.

---

## 🛠️ Installation & Setup

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the address bar.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select this directory (`Instagram-Reels-Summarizer`).
5. Click the **Reel Analyzer** extension icon or open Chrome's Side Panel to start!

---

## 🚀 How to Use

1. Open **Instagram** and log into your account.
2. Open the **Reel Analyzer** side panel.
3. Choose your AI Engine (**Gemini**, **ChatGPT**, or **Meta AI**) and make sure that AI tab is open.
4. Open your **Saved Reels** or **Reels Feed**.
5. Select a reel, set how many you want to process, and click **`▶ Start Auto-Process`**!

---

## 📂 File Architecture
- [manifest.json](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/manifest.json): Manifest V3 setup
- [content_ig.js](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/content_ig.js): Instagram DOM extractor & reel navigator
- [content_gemini.js](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/content_gemini.js): Gemini prompt injector & completion detector
- [service_worker.js](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/service_worker.js): Background batch orchestrator & dynamic poller
- [popup.html](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/popup.html) / [popup.js](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/popup.js) / [styles.css](file:///c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/styles.css): Batch dashboard UI with live progress bar and stats
