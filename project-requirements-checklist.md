# Fantasy Cyberpunk Portfolio - Requirement Checklist

Use this checklist to track implementation by batch. Each batch should be completed and verified before moving too far into the next one.

## Batch 1 - Project Foundation

- [x] Create Vite + TypeScript project scaffold.
- [x] Install core dependencies: `three`, `gsap`, and required TypeScript tooling.
- [x] Set up base folder structure:
  - [x] `src/data/`
  - [x] `src/render/`
  - [x] `src/animation/`
  - [x] `src/ui/`
  - [x] `src/styles/`
- [x] Create `src/data/portfolioData.ts`.
- [x] Add placeholder portfolio data for name, title, intro, contact, experience, and skills.
- [x] Confirm the app runs locally.

## Batch 2 - Data-Driven Portfolio Content

- [x] Render name from `portfolioData`.
- [x] Render title from `portfolioData`.
- [x] Render three to four intro lines from `portfolioData`.
- [x] Render total years and experience summary from `portfolioData`.
- [x] Render all job experience entries from `portfolioData`.
- [x] Render all experience bullet descriptions from `portfolioData`.
- [x] Render 10 to 20+ skills from `portfolioData`.
- [x] Render email, GitHub, and LinkedIn from `portfolioData`.
- [x] Ensure no portfolio content is hardcoded inside render or animation modules.

## Batch 3 - Three.js Visual Foundation

- [x] Create Three.js renderer, scene, camera, and animation loop.
- [x] Add responsive canvas sizing.
- [x] Add cyberpunk fantasy background visuals.
- [x] Add animated particle field.
- [x] Add neon grid, portal, energy core, holographic shards, or equivalent focal object.
- [x] Add lighting and material treatment that supports the cyberpunk fantasy mood.
- [x] Add subtle mouse or pointer parallax.
- [x] Keep readable text outside WebGL.
- [x] Add graceful fallback message for WebGL failure.

## Batch 4 - Opening Identity Scene

- [ ] Make the first viewport cinematic and visually strong.
- [ ] Show developer name as the dominant first signal.
- [ ] Show title clearly near the name.
- [ ] Implement typewriter reveal for intro lines.
- [ ] Synchronize opening text reveal with subtle scene motion.
- [ ] Ensure first viewport remains readable on desktop and mobile.

## Batch 5 - Scroll-Triggered Experience Sequence

- [ ] Set up scroll-trigger animation system.
- [ ] Animate transition from opening scene into experience section.
- [ ] Reveal experience entries staggerly during scroll.
- [ ] Reveal bullet points one by one inside each experience entry.
- [ ] Highlight active experience entry.
- [ ] Make Three.js background react to experience scroll progress.
- [ ] Ensure experience content remains readable and accessible.

## Batch 6 - Scroll-Triggered Skills Sequence

- [ ] Build flexible skills layout for 10 to 20+ items.
- [ ] Animate skills into view one by one.
- [ ] Use a visual metaphor such as holographic chips, constellation nodes, orbiting tags, or magic-tech circle.
- [ ] Prevent skill text from overlapping on small screens.
- [ ] Ensure skill animation still works after changing the skills array length.

## Batch 7 - Contact / Reach-Out Section

- [ ] Add final contact section near the end of the scroll experience.
- [ ] Render email as a working `mailto:` link.
- [ ] Render GitHub as an external link.
- [ ] Render LinkedIn as an external link.
- [ ] Use safe external link attributes: `target="_blank"` and `rel="noreferrer"`.
- [ ] Animate contact links into view as the final call-to-action.
- [ ] Optionally add a compact desktop contact cluster if it does not distract from the scene.
- [ ] Confirm all links are keyboard accessible.

## Batch 8 - Responsive, Accessibility, and Reduced Motion

- [ ] Verify desktop layout.
- [ ] Verify tablet layout.
- [ ] Verify mobile layout.
- [ ] Ensure text never overlaps or overflows its container.
- [ ] Add `prefers-reduced-motion` handling.
- [ ] Keep semantic HTML for all readable content.
- [ ] Ensure keyboard navigation reaches contact links.
- [ ] Ensure color contrast is readable.
- [ ] Confirm portfolio content remains understandable without relying on WebGL text.

## Batch 9 - Performance and Technical Hardening

- [ ] Keep draw calls and geometry count controlled.
- [ ] Avoid unnecessarily large textures.
- [ ] Keep post-processing optional and performant.
- [ ] Pause or reduce expensive updates when the tab is hidden.
- [ ] Handle resize cleanly.
- [ ] Avoid memory leaks from abandoned geometries, materials, or event listeners.
- [ ] Run TypeScript/build verification.
- [ ] Fix runtime console errors.

## Batch 10 - Final QA and Delivery

- [ ] Compare implementation against `fantasy-cyberpunk-portfolio-spec.md`.
- [ ] Confirm all required sections exist.
- [ ] Confirm data file edits update the UI correctly.
- [ ] Confirm first viewport shows name, title, and intro.
- [ ] Confirm experience scroll animation works.
- [ ] Confirm skills scroll animation works with 10 to 20+ skills.
- [ ] Confirm contact links work.
- [ ] Confirm visual direction is clearly cyberpunk, futuristic, and fantasy-inspired.
- [ ] Confirm production build succeeds.
- [ ] Document how to run and edit the project in `README.md`.
