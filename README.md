# 🏛️ Stonehenge 3D: Interactive Historical Timeline

🔴 **[Live Demo: Explore Stonehenge 3D Here](https://karkirijan38.github.io/Stonehenge_evolution-/)**

An immersive, WebGL-powered 3D museum exhibit that allows users to explore the five archaeological phases of Stonehenge. Built with **Three.js** and **WebXR**, this project features interactive 3D models, cinematic atmospheric effects, and virtual reality support directly in the browser.

## ✨ Features

* **Interactive 3D Exploration:** Seamlessly orbit, zoom, and pan around highly detailed 3D diorama models of Stonehenge across 5 distinct historical phases (Origins to Present Day).
* **🥽 Virtual Reality (VR) Ready:** Full WebXR integration allows users to step inside the monument using VR headsets with a single click.
* **🎬 Cinematic Atmosphere:** * Procedural rolling mist and fog.
  * Ancient floating fireflies/dust particles with soft radial glows.
  * Sunset/Dawn sky gradients.
  * PCF Soft Shadows for realistic lighting and depth.
* **🔊 Audio Narration:** Built-in modular audio system with glassmorphic UI controls to play historical voiceovers for each phase.
* **✨ Polished UI/UX:** Smooth CSS-driven "Museum Fade-In" loading screens and elegant slide-up info cards.

## 🛠️ Tech Stack

* **HTML5 & CSS3** (Custom UI, Glassmorphism, Animations)
* **JavaScript (ES6 Modules)**
* **[Three.js](https://threejs.org/)** (WebGL 3D Rendering Engine)
* **GLTFLoader** (Importing `.glb` 3D models)
* **WebXR API** (Virtual Reality Support)

## 📂 Project Structure

```text
├── index.html          # Main landing page / Hub
├── phase1.html         # Phase 1: Origins (3000 BCE)
├── phase2.html         # Phase 2: First Stones (2500 BCE)
├── phase3.html         # Phase 3: The Sarsen Circle
├── phase4.html         # Phase 4: The Completed Monument
├── phase5.html         # Phase 5: Present Day (2026 CE)
├── *.glb               # 3D model files for each phase (Located in the main folder)
├── css/
│   └── style.css       # UI animations and styling
├── js/
│   ├── viewer.js       # Core Three.js 3D engine, environment, and VR setup
│   └── audio.js        # Standalone audio player plugin for voiceovers
└── audio/              # Directory for MP3 narration files

```

### How to Run Locally
## If you want to clone this repository and run it locally, it must be run on a local web server to avoid CORS errors with the 3D models.
## VS Code Live Server
1. Open this project folder in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click index.html and select "Open with Live Server".
