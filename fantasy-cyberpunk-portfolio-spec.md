# Fantasy Cyberpunk Three.js Portfolio - First Requirements Draft

## Project Goal

Build a visually stunning personal portfolio website using vanilla Three.js, TypeScript, and Vite. The experience should feel futuristic, cyberpunk, and fantasy-inspired while still functioning as a clear software developer portfolio.

The AI agent should decide the final presentation, layout, animation timing, and section placement based on the content provided by the portfolio owner. The user will later edit one constant data file to update personal information, job experience, skills, LinkedIn URL, GitHub URL, and email.

## Target Experience

The portfolio should feel like entering a neon fantasy terminal city or arcane cyber realm. It should combine:

- Futuristic cyberpunk lighting, neon accents, holographic panels, and scanline-like atmosphere.
- Fantasy mood through floating runes, energy particles, portal-like transitions, glowing sigils, or magical-tech motifs.
- Smooth scroll-driven storytelling.
- Three.js visual depth without sacrificing readability.
- Minimal persistent UI so the 3D scene remains the main visual anchor.

The website should not feel like a normal card-grid portfolio. It should feel like a cinematic interactive profile reveal.

## Core Technology Requirements

- Use Vite + TypeScript.
- Use vanilla Three.js for direct scene, camera, renderer, animation loop, and post-processing control.
- Use DOM overlays for readable portfolio text and controls.
- Use Three.js canvas for background scene, particles, lighting, camera movement, portals, holograms, and visual effects.
- Keep portfolio data in a single editable constant/config file.
- Use GSAP ScrollTrigger or an equivalent scroll-triggered animation system.
- Keep animation and rendering modules separate from portfolio content data.
- Keep the experience responsive across desktop and mobile.

## Architecture Requirements

Recommended source structure:

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

### Boundaries

- `data/portfolioData.ts` owns all editable user content.
- `render/` owns Three.js scene, camera, lights, meshes, materials, particles, resize, and cleanup.
- `animation/` owns scroll timelines, stagger effects, typewriter effects, and DOM/scene synchronization.
- `ui/` owns section markup, DOM rendering, and accessibility-friendly text.
- No hardcoded personal portfolio content should be scattered across rendering modules.

## Editable Portfolio Data File

Create one constant file that the user can update later:

```ts
export const portfolioData = {
  name: "Your Name",
  title: "Software Developer",
  intro: [
    "Line one of short self introduction.",
    "Line two of short self introduction.",
    "Line three of short self introduction.",
    "Optional fourth line."
  ],
  contact: {
    email: "your.email@example.com",
    githubUrl: "https://github.com/your-username",
    linkedInUrl: "https://www.linkedin.com/in/your-profile"
  },
  experienceSummary: {
    totalYears: "3+ years",
    headline: "Building scalable web applications and immersive digital products."
  },
  experiences: [
    {
      role: "Frontend Developer",
      company: "Company Name",
      period: "2023 - Present",
      description: [
        "Built responsive and performant application interfaces.",
        "Integrated APIs and improved user workflows.",
        "Collaborated with designers and backend engineers."
      ]
    }
  ],
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Three.js",
    "PostgreSQL",
    "REST APIs",
    "Git",
    "UI Engineering"
  ]
} as const;
```

The user should be able to change name, title, intro, job experience, total years, descriptions, skills, LinkedIn URL, GitHub URL, and email without touching animation or Three.js code.

## Required Portfolio Sections

### 1. Opening Identity Scene

Content:

- Name.
- Title.
- Three to four lines of brief self-introduction.

Behavior:

- Use a cinematic first viewport.
- Show the name as the strongest first visual signal.
- Reveal intro lines with a typewriter effect.
- Use ScrollTrigger so text can appear, separate, or transform as the user begins scrolling.
- Three.js background should already feel alive: glowing particles, cyber grid, animated portal, holographic depth, floating glyphs, or similar.

Possible visual direction:

- Name appears in front of a glowing cyber-fantasy portal.
- Intro lines type in as if projected by a holographic terminal.
- Camera slowly pushes through a neon mist field while text reveals.

### 2. Experience Scroll Sequence

Content:

- Total years of experience.
- Job experience entries.
- Role, company, period, and bullet descriptions.

Behavior:

- Experience should reveal through scroll-triggered animation.
- Entries should appear staggered rather than all at once.
- The background scene should react to the active experience entry.
- Each experience can feel like a holographic memory panel, timeline node, floating data shard, or cyber rune archive.

Expected animation:

- As the user scrolls, the camera moves through a futuristic corridor or data tunnel.
- Each job entry enters with depth, glow, or parallax.
- Bullet points reveal one by one.
- Active entry has stronger lighting or focus.

### 3. Skills Scroll Sequence

Content:

- 10 to 20+ skills.
- Skills should be easy to update through the constant data file.

Behavior:

- Skills should be scroll-triggered.
- Skills should animate in one by one.
- Use stagger, pop, orbit, grid formation, or floating hologram effects.
- Must handle a larger number of skills without breaking layout.

Possible visual direction:

- Skills appear as floating chips around a rotating energy core.
- Skills assemble into a constellation or tech magic circle.
- Skills rise from a neon grid as holographic tags.

### 4. Contact / Reach-Out Section

Content:

- Email.
- GitHub URL.
- LinkedIn URL.

Behavior:

- Contact links should be visible near the end of the portfolio as the final call-to-action.
- A compact persistent contact cluster can also appear after the opening scene or in a corner on desktop, as long as it does not distract from the 3D scene.
- Links should be rendered as semantic anchors in DOM, not inside WebGL.
- Email should use a `mailto:` link.
- External profile links should open safely with `target="_blank"` and `rel="noreferrer"`.

Possible visual direction:

- Final section feels like reaching a neon gateway or signal terminal.
- Contact links appear as three precise command buttons or holographic signal nodes.
- The 3D scene can form a portal, constellation, or energy lock behind the links.

## Visual Design Requirements

- Theme: futuristic cyberpunk fantasy.
- Mood: polished, cinematic, high-energy, developer-focused.
- Palette: dark base with neon cyan, magenta, electric blue, acid green, and selective warm highlights.
- Avoid a single-color purple/blue-only palette.
- Use readable typography with strong hierarchy.
- Avoid large generic cards.
- Use glass/holographic surfaces only where they support content readability.
- Maintain enough contrast for portfolio text.
- Scene should feel dynamic even before scroll interaction begins.

## Three.js Scene Requirements

The Three.js layer should include several of the following:

- Animated particle field.
- Neon grid or cyber floor.
- Floating holographic panels or shards.
- Portal, energy core, or abstract fantasy-tech object.
- Camera movement synchronized with scroll progress.
- Bloom or glow-like effects, kept readable and performant.
- Subtle mouse movement parallax.
- Responsive resize handling.
- WebGL context loss handling or graceful fallback message.

The scene should not contain long readable text. Main text should remain in DOM overlays.

## Animation Requirements

- Use scroll-triggered sections.
- Opening intro uses typewriter animation.
- Experience entries reveal staggerly while scrolling.
- Experience bullet points reveal staggerly within each entry.
- Skills reveal one by one during the skills section.
- Contact links reveal near the final scroll section with a concise call-to-action.
- Three.js camera or scene elements should react to scroll progress.
- Motion must be smooth and not overwhelming.
- Respect `prefers-reduced-motion` with a simpler animation path.

## Responsiveness Requirements

- Desktop should emphasize cinematic depth and larger 3D visual scale.
- Mobile should preserve content readability and avoid tiny floating text.
- Text must not overlap or overflow containers.
- Skills must wrap or reorganize cleanly for 10 to 20+ items.
- Performance should remain acceptable on mid-range devices.

## Accessibility Requirements

- Keep actual portfolio text in semantic HTML.
- Maintain keyboard-accessible content flow.
- Avoid requiring WebGL interaction to read the portfolio.
- Provide meaningful fallback if WebGL fails.
- Respect reduced motion settings.
- Ensure color contrast is readable.

## Performance Requirements

- Keep geometry count and draw calls controlled.
- Use instancing where useful for repeated particles or shards.
- Keep post-processing optional and measurable.
- Avoid uncompressed huge textures.
- Pause or reduce expensive animation when tab is hidden.
- Use requestAnimationFrame loop with clear ownership.

## Out of Scope for First Version

- Backend or CMS.
- Blog system.
- Contact form with email delivery.
- Complex 3D character animation.
- Heavy physics simulation.
- Authentication.
- Admin editor.

## Implementation Acceptance Criteria

The first version is acceptable when:

- The site runs locally with Vite.
- The first viewport shows name, title, and animated intro.
- Portfolio data is controlled from one constant file.
- Contact email, GitHub, and LinkedIn are controlled from the same data file and rendered as working links.
- Experience section scroll animation works with staggered entries and bullet reveals.
- Skills section supports 10 to 20+ skills and reveals them through scroll animation.
- Three.js background is clearly futuristic, cyberpunk, and fantasy-inspired.
- The scene resizes correctly on desktop and mobile.
- The site remains readable if animations are reduced.
- Build completes without TypeScript errors.

## AI Agent System Instruction Prompt

Use this prompt as the high-level instruction for the implementation agent:

```txt
You are building a cinematic software developer portfolio using Vite, TypeScript, vanilla Three.js, and DOM overlays. The portfolio must feel futuristic, cyberpunk, and fantasy-inspired. Prioritize a visually stunning first impression, scroll-driven storytelling, clean data-driven content, and readable portfolio information.

Use Three.js for the immersive visual layer: particles, portal or energy core, neon grid, holographic shards, lighting, camera movement, and post-processing. Use DOM/HTML for all readable portfolio text and contact links. Keep portfolio content in one editable constant file so the owner can update name, title, intro lines, experience entries, total years, descriptions, skills, LinkedIn URL, GitHub URL, and email without touching rendering code.

Implement scroll-triggered animation for the intro, job experience, skills, and final contact section. The intro should use a typewriter-style reveal. Experience entries should appear staggerly while scrolling, with bullet points revealing one by one. Skills should support 10 to 20+ items and animate into view one by one. Contact links should appear as the final reach-out moment and remain easy to click.

Keep architecture clean: data, rendering, animation, UI, and styles should be separated. Make the site responsive, performant, accessible, and respectful of reduced-motion preferences. Avoid generic portfolio card layouts. The final result should feel like entering a neon fantasy-tech environment built for a software developer.
```

## AI Agent Implementation Prompt

Use this prompt when asking the coding agent to build the first version:

```txt
Build the first version of the fantasy cyberpunk Three.js portfolio described in fantasy-cyberpunk-portfolio-spec.md.

Requirements:
- Use Vite + TypeScript + vanilla Three.js.
- Use GSAP ScrollTrigger or an equivalent scroll animation approach.
- Create a single editable data file at src/data/portfolioData.ts.
- Render name, title, intro, experience, skills, LinkedIn URL, GitHub URL, and email from that data file.
- Build a full-screen Three.js background with cyberpunk fantasy visuals.
- Add a typewriter reveal for the intro.
- Add scroll-triggered stagger animation for experience entries and bullets.
- Add scroll-triggered stagger animation for 10 to 20+ skills.
- Add a final contact section with email, GitHub, and LinkedIn links.
- Keep readable text in DOM overlays, not inside WebGL.
- Add responsive styling for desktop and mobile.
- Add reduced-motion handling.
- Verify with a local build.

Do not ask for final personal copy yet. Use tasteful placeholder content in the data file so the owner can replace it later.
```

## AI Agent Visual Direction Prompt

Use this prompt if the implementation needs stronger art direction:

```txt
Create a visual direction for a cyberpunk fantasy software developer portfolio. The scene should feel like a neon arcane operating system: a dark futuristic environment, electric cyan and magenta light, selective acid green highlights, floating holographic shards, particle streams, a glowing portal or energy core, and subtle camera movement through depth.

The first viewport must make the developer name the main signal. Intro text should appear like a holographic terminal typing into existence. Experience should feel like scrolling through memory archives or data shards. Skills should assemble like a constellation, tech magic circle, or orbiting holographic chip system.

Avoid generic cards, flat gradients, simple starfields, and static portfolio templates. The final direction should be immersive but still readable and professional.
```

## AI Agent QA Prompt

Use this prompt after implementation:

```txt
Review the implemented portfolio against the spec.

Check:
- Does the first viewport immediately show the name, title, and intro?
- Is the theme clearly futuristic, cyberpunk, and fantasy-inspired?
- Is all portfolio content editable from src/data/portfolioData.ts?
- Are email, GitHub, and LinkedIn editable from src/data/portfolioData.ts and rendered as working links?
- Are intro, experience, and skills animated by scroll or reveal timing as required?
- Do experience entries and bullet points stagger correctly?
- Do 10 to 20+ skills fit and reveal cleanly?
- Is readable text rendered in DOM rather than WebGL?
- Does the site work on desktop and mobile sizes?
- Does reduced motion reduce or simplify animations?
- Are there TypeScript, build, or runtime errors?
- Is performance acceptable, with no obvious frame drops from excessive geometry or post-processing?

List any issues by severity and fix all blocking issues before delivery.
```

## Open Questions for Next Requirement Pass

- What exact name, title, and intro copy should be used?
- How many experience entries should appear in the first version?
- Should the portfolio include projects or resume download?
- Should the page be one continuous scroll or include navigation anchors?
- Should the visual mood lean more fantasy, more cyberpunk, or exactly balanced?
- Should there be background music or sound effects, or should it stay silent?
- Should the project use React, or should it remain vanilla TypeScript as currently specified?
