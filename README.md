# Aethergrid

Aethergrid is a cinematic developer identity experience built around a futuristic cyberpunk fantasy visual direction. It uses a full-screen Three.js scene, scroll-triggered storytelling, animated introduction text, staggered job experience reveals, animated skills, and a final contact section for email, GitHub, and LinkedIn.

The experience is designed so the owner can update the main content from one data file instead of editing rendering or animation code.

## Product Purpose

The site presents:

- Developer name and title.
- Three to four lines of self-introduction.
- Software development experience and total years.
- Job experience entries with bullet descriptions.
- Skills, designed to support 10 to 20+ items.
- Contact links for email, GitHub, and LinkedIn.

The goal is not a generic resume grid. The experience should feel like entering a neon fantasy-tech environment where the visitor scrolls through identity, experience, skills, and contact details.

## Tech Stack

- Vite
- TypeScript
- Three.js
- GSAP ScrollTrigger or equivalent scroll animation system
- HTML/CSS DOM overlays for readable content

## Planned Architecture

```txt
src/
  main.ts
  data/
    portfolioData.ts
  render/
    createRenderer.ts
    createScene.ts
    cameraRig.ts
    effects.ts
    particles.ts
  animation/
    scrollTimeline.ts
    typewriter.ts
  ui/
    sections.ts
    domBindings.ts
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

## Project Documents

- `fantasy-cyberpunk-portfolio-spec.md` contains the full product and implementation spec.
- `project-requirements-checklist.md` contains the batch-by-batch implementation checklist.

## Current Status

Batch 1 is complete. The repository now contains the Vite + TypeScript scaffold, core dependencies, starter source structure, editable portfolio data file, and planning documents.
