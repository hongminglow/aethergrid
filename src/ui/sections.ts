import type { PortfolioData } from "../data/portfolioData";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const getSkillMeta = (skill: string, index: number) => {
  const clean = skill.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
  const entryVectors = [
    { rotate: "-14deg", x: "-220px", y: "96px" },
    { rotate: "-8deg", x: "-92px", y: "156px" },
    { rotate: "8deg", x: "98px", y: "156px" },
    { rotate: "14deg", x: "226px", y: "96px" },
    { rotate: "-11deg", x: "-172px", y: "-92px" },
    { rotate: "11deg", x: "172px", y: "-92px" },
  ];
  const icon = clean
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const proficiency = Math.max(68, 96 - (index % 8) * 4);
  const entryVector = entryVectors[index % entryVectors.length];

  return { entryVector, icon: icon || "SK", proficiency };
};

const renderTypewriterLines = (lines: readonly string[]) =>
  lines
    .map(
      (line) => `
        <p class="typewriter-line" data-typewriter-line data-text="${escapeHtml(line)}" aria-label="${escapeHtml(line)}">
          <span data-typewriter-text aria-hidden="true"></span>
          <span class="sr-only">${escapeHtml(line)}</span>
        </p>
      `,
    )
    .join("");

const renderSkills = (skills: PortfolioData["skills"]) =>
  skills
    .map((skill, index) => {
      const { entryVector, icon, proficiency } = getSkillMeta(skill, index);

      return `
        <li class="skill-card" data-skill-card style="--delay: ${index * 86}ms; --proficiency: ${proficiency}%; --start-x: ${entryVector.x}; --start-y: ${entryVector.y}; --start-rotate: ${entryVector.rotate};">
          <span class="skill-card__chrome">
            <span class="skill-card__icon">${escapeHtml(icon)}</span>
            <span class="skill-card__index">skill_${String(index + 1).padStart(2, "0")}</span>
          </span>
          <span class="skill-card__name">${escapeHtml(skill)}</span>
          <span class="skill-card__bar" aria-hidden="true"><span></span></span>
        </li>
      `;
    })
    .join("");

const renderExperienceEntries = (experiences: PortfolioData["experiences"]) =>
  experiences
    .map((experience, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const bullets = experience.description
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      return `
        <article class="timeline-card timeline-card--${side}" data-experience-card>
          <span class="timeline-card__dot" aria-hidden="true"></span>
          <div class="timeline-card__inner">
            <div class="timeline-card__meta">
              <span>${escapeHtml(experience.period)}</span>
              <span>${String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>${escapeHtml(experience.role)}</h3>
            <p class="timeline-card__company">${escapeHtml(experience.company)}</p>
            <ul>${bullets}</ul>
          </div>
        </article>
      `;
    })
    .join("");

const renderContactLinks = (data: PortfolioData["contact"]) => `
  <button class="contact-link contact-link--button" type="button" data-copy-email="${escapeHtml(data.email)}">
    <span>email_</span>
    <strong>${escapeHtml(data.email)}</strong>
  </button>
  <a class="contact-link" href="${escapeHtml(data.githubUrl)}" target="_blank" rel="noreferrer">
    <span>github_</span>
    <strong>GitHub</strong>
  </a>
  <a class="contact-link" href="${escapeHtml(data.linkedInUrl)}" target="_blank" rel="noreferrer">
    <span>linkedin_</span>
    <strong>LinkedIn</strong>
  </a>
`;

export const createPortfolioMarkup = (data: PortfolioData) => `
  <div class="loading-screen" data-loading-screen>
    <svg class="loading-screen__core" viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 8 104 36 90 96 30 96 16 36Z" />
      <path d="M60 8 60 112M16 36 90 96M104 36 30 96M16 36 104 36M30 96 90 96" />
      <path d="M60 28 82 44 74 76 46 76 38 44Z" />
    </svg>
    <span>initialising_</span>
  </div>
  <div class="cursor-dot" data-cursor-dot></div>
  <div class="cursor-ring" data-cursor-ring></div>
  <div class="reading-progress" aria-hidden="true">
    <span data-reading-progress></span>
  </div>
  <div class="signal-toast" data-signal-toast role="status" aria-live="polite" aria-atomic="true">
    <span>email copied_to_clipboard_</span>
  </div>
  <a class="skip-link" href="#content">skip_to_content_</a>
  <div id="scene-host" class="scene-host" aria-hidden="true"></div>
  <p id="webgl-fallback" class="webgl-fallback" role="status" hidden>
    WebGL scene unavailable. Portfolio content remains available below.
  </p>
  <main id="content" class="portfolio-shell" tabindex="-1">
    <section class="hero-section" aria-labelledby="intro-title">
      <div class="hero-copy">
        <p class="eyebrow">cyber_core_</p>
        <h1 id="intro-title">${escapeHtml(data.name.toUpperCase())}</h1>
        <p class="hero-title">${escapeHtml(data.title)}</p>
        <div class="hero-actions">
          <a href="#identity">read_signal_</a>
          <a href="#contact">contact_signal_</a>
        </div>
      </div>
      <div class="hero-status" aria-hidden="true">
        <span>manual orbit enabled</span>
        <span>drag to rotate core</span>
        <span>5200 particle field</span>
      </div>
    </section>

    <section class="identity-section" id="identity" aria-labelledby="identity-title" data-typewriter-section>
      <div class="identity-copy">
        <p class="eyebrow">identity_signal_</p>
        <h2 id="identity-title">introduction_</h2>
        <div class="identity-typewriter" data-typewriter>
          ${renderTypewriterLines(data.intro)}
        </div>
      </div>
    </section>

    <section class="content-section skills-section" id="skills" aria-labelledby="skills-title">
      <div class="section-heading" data-section-heading>
        <p class="eyebrow">capability grid_</p>
        <h2 id="skills-title">skills_</h2>
      </div>
      <ul class="skills-grid" aria-label="Skills">
        ${renderSkills(data.skills)}
      </ul>
    </section>

    <section class="content-section experience-section" id="experience" aria-labelledby="experience-title" data-experience-section>
      <div class="section-heading" data-section-heading>
        <p class="eyebrow">${escapeHtml(data.experienceSummary.totalYears)}</p>
        <h2 id="experience-title">experience_</h2>
        <p>${escapeHtml(data.experienceSummary.headline)}</p>
      </div>
      <div class="timeline">
        <span class="timeline__line" aria-hidden="true">
          <span data-timeline-fill></span>
        </span>
        ${renderExperienceEntries(data.experiences)}
      </div>
    </section>

    <section class="content-section showcase-section" id="work" aria-labelledby="work-title">
      <div class="section-heading" data-section-heading>
        <p class="eyebrow">three.js proof_</p>
        <h2 id="work-title">work_</h2>
        <p>Three compact WebGL studies running independently from the hero scene.</p>
      </div>
      <div class="showcase-grid">
        <article class="showcase-card">
          <div class="showcase-card__canvas">
            <canvas data-showcase-canvas="particle-morph" aria-label="Particle morph WebGL canvas"></canvas>
          </div>
          <h3>particle morph_</h3>
          <p>3000 points shift between sphere and torus fields.</p>
        </article>
        <article class="showcase-card">
          <div class="showcase-card__canvas">
            <canvas data-showcase-canvas="shader-wave" aria-label="Shader wave WebGL canvas"></canvas>
          </div>
          <h3>shader wave_</h3>
          <p>Vertex displacement and height-color fragment shading.</p>
        </article>
        <article class="showcase-card showcase-card--glitch">
          <div class="showcase-card__canvas">
            <canvas data-showcase-canvas="glitch-cube" aria-label="Glitch cube WebGL canvas"></canvas>
          </div>
          <h3>glitch cube_</h3>
          <p>Edges, vertex jitter, and chromatic CSS hue cycling.</p>
        </article>
      </div>
    </section>

    <section class="content-section contact-section" id="contact" aria-labelledby="contact-title">
      <div class="section-heading" data-section-heading>
        <p class="eyebrow">open channel_</p>
        <h2 id="contact-title">contact_</h2>
      </div>
      <nav class="contact-links" aria-label="Contact links">
        ${renderContactLinks(data.contact)}
      </nav>
    </section>
  </main>
`;
