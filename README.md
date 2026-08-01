# 🎬 IMDb Search URL Generator (macOS Native Style)

An ultra-sleek, native Apple macOS System Settings styled web & desktop application designed to build precise, custom IMDb Advanced Search URLs. Filter movies and series effortlessly by language, format, custom plot keywords, release dates, adult content preferences, and streaming providers.

---

## ✨ Features

- ** Authentic macOS System Settings Aesthetics**: Built with Apple SF font typography, clean borderless card sections, native segmented controls, and high-contrast vector controls.
- **🌐 Preferred Language Targeting**: Instant filtering for Hindi, English, and Bengali titles.
- **🎬 Format & Exclusions**: Filter by Feature Films, TV Series, or Both. Short films and documentaries are automatically excluded (`!short, !documentary`).
- **🏷️ Intelligent Genre & Keyword Routing**:
  - Direct taxonomy mapping for standard IMDb genres (`Mystery`, `Action`, `Thriller`, `Sci-Fi`, `Horror`, etc.).
  - Automatic keyword routing for custom search tags (e.g. `suspense`, `superhero`, `detective`) so custom queries never break IMDb results.
- **🔞 Adult Content Controls**: Explicitly toggle between **Exclude** (`adult=exclude`, default) and **Include** (`adult=include`).
- **📺 Instant Watch Options**: Filter directly for **Amazon Prime Video (India)** and **Amazon Prime Video (UK)**.
- **⚡ Single-Line Action Bar**:
  - Live generated URL display with syntax color highlighting.
  - **Copy URL**: One-click clipboard copy.
  - **Open in IMDb**: Opens search directly in a new browser tab.
  - **Save Search**: Save preset searches locally without duplicate entries.
- **💾 Preset & Search History**: Save frequent searches with human-readable titles, timestamps, and one-click reload or deletion.
- **🖥️ Native macOS Application Integration**: Includes a Swift launcher script to package and run the application directly from macOS Launchpad, Spotlight, and `~/Applications/` with a custom full-bleed IMDb app icon.

---

## 🚀 Quick Start

### 1. Local Development

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production

```bash
npm run build
```

The production output will be generated in the `dist/` directory.

---

## 🖥️ Install as a Native macOS Application

You can package and install this project as a standalone macOS application running directly in `~/Applications/`:

```bash
# Run the automated installer
bash install_mac_app.sh
```

This script will:
1. Compile the Swift background launcher (`launcher.swift`).
2. Generate `AppIcon.icns` from high-resolution artwork.
3. Install **IMDb Search URL Generator.app** into your macOS `~/Applications/` folder.
4. Allow launching directly via **Spotlight** (`Cmd + Space`), **Launchpad**, or the **Finder Apps menu**.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Apple macOS System Settings Design Token Palette)
- **Desktop Packaging**: Swift (`swiftc`), `iconutil`, macOS App Bundle Structure

---

## 📜 License

MIT License. Designed with ❤️ for cinephiles and power searchers.
