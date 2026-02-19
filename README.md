# Xai – Intelligence Workspace

A high-fidelity, interactive product prototype demonstrating how Xai turns raw data into structured intelligence.

![NextJS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ThreeJS](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)


## Overview

This project is a response to the "Frontend Challenge: Xai Product Experience Prototype". The goal was to build a product-quality interface that feels calm, powerful, and technically confident—visualizing the transformation of data into actionable insights through intentional motion and 3D depth.

**Figma Design:** (https://www.figma.com/design/mqJ7F5XF91jFP4XQr6XIV8/RACO-AI-Interview-Submission-Mojtoba-Zaman-Mantaka?node-id=0-1&t=fe9cMYVMoztmH02O-1)

## Core Narrative

The experience visually guides the user through the Xai pipeline through stacking cards:
1.  **Raw Data (Ingest):** Represented by chaotic particles and a spinning DNA Figure.
2.  **Structured Intelligence (Analyze):** The particles morph into an organized Torus/Grid structure.
3.  **Actionable Insight (Insight):** The system crystallizes into a perfect Sphere, ready for automation.

## Technology Stack

I used the following technologies to build this project:

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **3D & WebGL:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/)
-   **UI Animations:** [Framer Motion](https://www.framer.com/motion/) (Layout & Micro-interactions)
-   **Scroll Choreography:** [GSAP](https://gsap.com/) + ScrollTrigger (Timeline control)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first, CSS Variables)
-   **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)

## Key Animation & Interaction Decisions

> **[🎥 Watch the Video Walkthrough](To be uploaded)**  
> *A short explanation of the key animation and interaction decisions behind this project.*

### 1. Signature Interaction: Morphing Data Cluster (`MorphingGeometry.js`)
I implemented a real-time **WebGL particle system** (12,000 instanced points) that reacts to scroll.
-   **Why:** To symbolize the transformation of "Raw Chaos" into "Ordered Insight" dynamically as the user explores the pipeline.
-   **Technique:** Custom Vertex Shader with `mix()` functions to interpolate between three geometric states (Chaos, Torus, Sphere).
-   **Performance:** All animation logic runs on the GPU. The CPU only passes a single `uProgress` uniform via a `useFrame` loop, ensuring 60fps even during complex morphs.
-   **Visuals:** Uses additive blending and phase-based coloring (Amber -> Cyan -> Purple) to represent the "heating up" of data processing.

### 2. The Hero: Ambient Intelligence (`BlockGlobe.js`)
A calm, always-on data visualization.
-   **Why:** To reinforce the idea that Xai is constantly monitoring global data streams in real-time.
-   **Interaction:** The globe spins at a constant, reliable pace (representing uptime).
-   **Typography:** The "turn raw data..." headline uses a custom **Line-by-Word Reveal** animation with a metallic shine effect on hover, reinforcing the "polished/premium" feel of the platform without being distracting.
-   **Parallax:** Subtle mouse-movement parallax adds depth without feeling motion-sick.

### 3. Glassmorphism & Layout
-   **Material:** Used `backdrop-blur-3xl` and `bg-black/80` to ensure text remains legible while keeping the 3D context visible underneath.
-   **Grid:** A subtle background grid provides technical structure, ensuring the app feels like a "workspace" rather than just a landing page.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/itszaman7/xai-workspace.git
    cd xai-workspace
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```bash
src/
├── app/                  # Next.js App Router (Pages & Layout)
├── components/
│   ├── canvas/           # R3F / Three.js Components (Globe, Morphing Particles)
│   ├── layout/           # Shared UI (Navbar, Footer, SmoothScroll)
│   ├── sections/         # Page Sections (Hero, Pipeline, Dashboard)
│   └── ui/               # Reusable Atoms (Buttons, Cards)
└── hooks/                # Custom React Hooks
```

---

*Designed and engineered by Mojtoba Zaman Mantaka.*
