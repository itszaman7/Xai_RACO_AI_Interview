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

### What is Xai? 
Xai is a conceptual **Intelligence Workspace**. Rather than presenting another flat, traditional dashboard, Xai is designed as a spatial, deeply immersive 3D environment. It visualizes the complex journey of unifying raw data streams, processing them through agentic AI, and outputting clear decision metrics—functioning less like a standard SaaS page and more like a next-generation command center.

### Why will anyone use it? 
Users interacting with AI often struggle with the "black box" problem—they see inputs and outputs, but not the work in between. Xai solves this through its **"Chaos to Clarity" visual narrative**. 
By using an interactive 3D particle system that physically morphs along with the user's scroll depth—from an unstructured data cloud (Ingest), to a structured neural helix (Analyze), and finally into a distilled, perfect sphere (Insight)—the interface inherently builds user trust. The design demystifies AI by giving users a tangible, interactive metaphor for how their data is actively being optimized and transformed.

### Who is it for?
The interface is tailored for **data scientists, AI engineers, and enterprise decision-makers** who manage massive data pipelines. The intense dark-mode aesthetic, glowing glassmorphism, monospace technical typography (JetBrains Mono), and integrated "Live Logs" cater to power users. It is explicitly designed for professionals who demand precision, high information density, and an environment that feels computationally formidable.

**Figma Design:** (https://www.figma.com/design/mqJ7F5XF91jFP4XQr6XIV8/RACO-AI-Interview-Submission-Mojtoba-Zaman-Mantaka?node-id=0-1&t=fe9cMYVMoztmH02O-1)

## Core Narrative & Execution

The experience visually guides the user through the Xai pipeline via stacking cards that drive a global WebGL background (`InsightMatrix.js`):
1.  **Raw Data (Ingest):** Represented by an unstructured, diffuse data cloud floating in.
2.  **Structured Intelligence (Analyze):** The particles morph into an organized, twisting DNA Helix.
3.  **Actionable Insight (Insight):** The system crystallizes into a solid, glowing Sphere, ready for automation.

All transitions are heavily orchestrated using **GSAP + ScrollTrigger**, ensuring the motion is completely deterministic, smooth, and intimately tied to the user's scrolling pace.

## Technology Stack & Engineering Quality

Built with a strict focus on a clean component structure, reusable UI elements, and a scalable architecture.

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
-   **3D & WebGL (Signature Interaction):** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/). Driven by an optimized `InstancedMesh`.
-   **Scroll Choreography:** [GSAP](https://gsap.com/) + ScrollTrigger (Advanced timelines mapping scroll depth to 3D phase interpolation).
-   **UI Animations:** [Framer Motion](https://www.framer.com/motion/) (Layout spacing, hover feedbacks, entrance transitions).
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first, CSS Variables).
-   **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)

## Key Evaluative Decisions

> **[🎥 Watch the Video Walkthrough](To be uploaded)**  
> *A short explanation of the key animation and interaction decisions behind this project.*

### 1. Signature Interaction: Morphing Data Cluster (`InsightMatrix.js`)
I implemented a real-time **WebGL particle system** consisting of 12,000 instanced points that mathematically reacts to scroll depth.
-   **Why:** To solve the challenge's request for an impressive 3D morphology that represents data transformation.
-   **Technique:** Rather than using heavy GLTF models, all geometry (Data Cloud, DNA Helix, Sphere) is calculated purely via mathematics in Javascript arrays upon load. GSAP's `ScrollTrigger` scrubs a global `progress` variable spanning 0.0 to 1.0. A custom `useFrame` loop interpolates every single particle's X/Y/Z vector between these phases using `THREE.MathUtils.lerp`. 
-   **Result:** Flawlessly smooth, uninterrupted 3D morphing at 60fps that feels native and responsive to the user, not pre-rendered.

### 2. UI / UX Clarity & Hierarchy
-   **Visual Hierarchy:** Clean, atomic component structure (`Button.js`, `Badge.js`, `Reveal.js`). The Intelligence Dashboard uses subtle internal borders (`border-white/10`) layered over `backdrop-blur-3xl` glassmorphism to separate navigation from data visualization clearly. 
-   **Micro-Interactions:** The interactive Insight Flow features hover state lifts, magnetic glowing "probe" cursors that intelligently stick to the tensor grid bounds, and SVG data charts that animate in real-time within the dashboard preview using Framer Motion.
-   **Typography & Polish:** JetBrains Mono provides technical precision, paired with a Line-by-Word Hero reveal animation. The design applies professional restraint—avoiding overly colorful marketing fluff in favor of a specialized, computational aesthetic.

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
