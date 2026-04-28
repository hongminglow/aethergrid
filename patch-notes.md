=== THREE.JS CYBERPUNK PORTFOLIO — FULL IMPLEMENTATION BRIEF ===

You are building a dark cyberpunk-themed personal portfolio website in vanilla HTML/CSS/JS (or React if preferred) using Three.js as the primary visual engine. The site must feel like a living, breathing 3D environment — not a flat page with a 3D decoration.

GLOBAL DESIGN LANGUAGE

- Color palette: bg #050510, cards #0a0a1a, accent cyan #00ffff, accent magenta #ff00aa, text #e0e0e0, muted #666688
- Font: JetBrains Mono or Fira Code for ALL text (headings, body, labels)
- All section headings use trailing underscore convention: "skills*", "experience*", "work\_"
- Border style: 1px solid rgba(0,255,255,0.15) everywhere, glows to rgba(0,255,255,0.6) on hover

——————————————————————————
FEATURE 1: INTERACTIVE 3D HERO BACKGROUND
——————————————————————————
Using Three.js, create a full-viewport interactive 3D background scene:

- WebGLRenderer canvas: position fixed, z-index 0, covers 100% viewport
- All other content: position relative, z-index 10+, pointer-events on HTML, pointer-events: none on canvas
- PerspectiveCamera fov 60; OrbitControls with only rotation enabled (no pan, no zoom)
- Auto-rotate when idle (autoRotateSpeed 0.4); pause on pointerdown, resume on pointerup

MAIN OBJECT ("Cyber Core"):

- Outer shell: large wireframe IcosahedronGeometry (radius 80, detail 1), MeshBasicMaterial cyan wireframe
- Inner core: OctahedronGeometry (radius 40) with ShaderMaterial — vertex shader passes position to fragment, fragment shader uses uTime uniform to pulse emissive cyan color: vec3(0.0, 1.0, 0.9) _ (0.6 + 0.4 _ sin(uTime \* 2.0))
- 3 orbital rings: TorusGeometry on X, Y, and diagonal axes, each rotating at different speeds per frame (0.008, 0.005, 0.003)

PARTICLE FIELD:

- 4000 particles in a sphere of radius 400 using BufferGeometry + PointsMaterial (color 0x4488ff, size 1.2)
- Entire particle system rotates slowly on Y axis each frame

FLOATING NODES:

- 20 small glowing spheres scattered in space, connected by LineSegments to any node within distance 120
- Each node bobs using Math.sin(clock.elapsedTime + index) \* 8

LIGHTING: AmbientLight #001133, PointLight cyan at origin, PointLight magenta at offset position

——————————————————————————
FEATURE 2: SCROLL-TRIGGERED SKILLS REVEAL
——————————————————————————

- CSS grid of skill cards (repeat(auto-fit, minmax(160px, 1fr)))
- All cards start: opacity 0, transform translateY(40px) scale(0.95)
- IntersectionObserver (threshold 0.15) fires per card individually
- On enter: opacity 1, transform none, transition with cubic-bezier(0.34, 1.56, 0.64, 1) — spring pop feel
- Stagger: each card gets animation-delay of (index \* 120)ms
- After card appears: animate bottom progress bar from 0 to proficiency % over 800ms ease-out
- Hover: border glows, icon scales 1.15

——————————————————————————
FEATURE 3: WORK EXPERIENCE SCROLL TIMELINE
——————————————————————————

- Vertical timeline with a centre line that GROWS in height as user scrolls through the section
- Line height = clamp(0, (scrollY - sectionTop) / sectionHeight, 1) \* totalLineHeight, updated via rAF
- Line gradient: top cyan (#00ffff) to bottom magenta (#ff00aa)
- Job cards alternate left/right, each with connector dot on the line (8px glowing cyan circle)
- Cards reveal via IntersectionObserver: left cards translateX(-30px)→0, right cards translateX(30px)→0
- Global reading progress bar: 3px fixed bar at top of viewport, fills as user scrolls entire page

——————————————————————————
FEATURE 4: THREE.JS SHOWCASE SECTION
——————————————————————————
3 independent mini Three.js canvases in cards (280px tall each):

Canvas 1 — Particle Morph:

- 3000 particles lerping between sphere and torus position arrays every 3s
- Cyan-to-magenta color gradient by Y position

Canvas 2 — Shader Wave:

- PlaneGeometry 80x80 segments, vertex shader: Y = sin(x*2+uTime)*cos(z*2+uTime)*8
- Fragment shader colors by height from deep blue to bright cyan
- 0.2 opacity wireframe overlay

Canvas 3 — Glitch Cube:

- BoxGeometry with EdgesGeometry overlay in cyan
- Random vertex offset glitch every 0.5s (±2–5 units on random axis)
- Canvas element has CSS hue-rotate animation (360deg / 4s)

All 3 share one rAF loop. Pause rendering when canvas not in viewport.

——————————————————————————
FEATURE 5: GLOBAL POLISH
——————————————————————————
Custom cursor:

- cursor: none on body
- .cursor-dot: 6px filled cyan, follows mouse exactly
- .cursor-ring: 28px cyan border, follows with lerp 0.12 smoothing
- Hover interactive elements: ring expands to 48px, fills rgba(0,255,255,0.1)
- Click: dot pulses to 2.5x scale

Loading screen:

- Full-viewport dark overlay, rotating wireframe icosahedron SVG, "initialising\_" blinking text
- Fades out after Three.js renders 5+ frames

Performance:

- canvas: pointer-events: none
- devicePixelRatio capped at 2
- powerPreference: 'high-performance' in renderer

Section headings: clip-path wipe-in from left on IntersectionObserver trigger

=== END OF BRIEF ===
