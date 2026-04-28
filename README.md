# Aethergrid

Aethergrid is a dark cyberpunk developer identity experience built around Three.js as the primary visual engine. It uses an interactive full-viewport Cyber Core, a live particle field, floating node network, scroll-aware skill and experience sections, three independent WebGL showcase canvases, and a final contact section for email, GitHub, and LinkedIn.

The experience is designed so the owner can update the main content from one data file instead of editing rendering or animation code.

## Product Purpose

The site presents:

- Developer name and title.
- Three to four lines of self-introduction.
- Software development experience and total years.
- Job experience entries with bullet descriptions.
- Skills, designed to support 10 to 20+ items.
- Contact links for email, GitHub, and LinkedIn.

The goal is not a generic resume grid. The experience should feel like entering a neon technical environment where the 3D work is part of the product, not a decorative background.

## Tech Stack

- Vite
- TypeScript
- Three.js
- OrbitControls
- IntersectionObserver and requestAnimationFrame-driven UI effects
- HTML/CSS DOM overlays for readable content

## Architecture

```txt
src/
  main.ts
  data/
    portfolioData.ts
  render/
    cyberCoreScene.ts
    showcaseScenes.ts
  ui/
    sections.ts
    interactions.ts
  styles/
    global.css
```

## Content Editing

Portfolio content should live in:

```txt
src/data/portfolioData.ts
```

That file should control:

- Name
- Title
- Intro lines
- Email
- GitHub URL
- LinkedIn URL
- Experience summary
- Job experience entries
- Skills

## Run Locally

Install dependencies once:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```
