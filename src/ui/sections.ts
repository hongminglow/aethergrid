import type { PortfolioData } from "../data/portfolioData";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });

const renderIntroLines = (lines: readonly string[]) =>
  lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

const renderExperienceEntries = (experiences: PortfolioData["experiences"]) =>
  experiences
    .map((experience, index) => {
      const description = experience.description
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      return `
        <article class="experience-entry" data-entry-index="${index + 1}">
          <div class="experience-entry__meta">
            <span>${escapeHtml(experience.period)}</span>
            <span>${String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3>${escapeHtml(experience.role)}</h3>
          <p class="experience-entry__company">${escapeHtml(experience.company)}</p>
          <ul>${description}</ul>
        </article>
      `;
    })
    .join("");

const renderSkills = (skills: PortfolioData["skills"]) =>
  skills
    .map(
      (skill, index) =>
        `<li class="skill-chip" data-skill-index="${index + 1}">${escapeHtml(skill)}</li>`
    )
    .join("");

const renderContactLinks = (data: PortfolioData["contact"]) =>
  [
    `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`,
    `<a href="${escapeHtml(data.githubUrl)}" target="_blank" rel="noreferrer">GitHub</a>`,
    `<a href="${escapeHtml(data.linkedInUrl)}" target="_blank" rel="noreferrer">LinkedIn</a>`
  ].join("");

export const createPortfolioMarkup = (data: PortfolioData) => {
  const introLines = renderIntroLines(data.intro);
  const contactLinks = renderContactLinks(data.contact);

  return `
    <div id="scene-host" class="scene-host" aria-hidden="true"></div>
    <p id="webgl-fallback" class="webgl-fallback" role="status" hidden>
      WebGL scene unavailable. Portfolio content remains available below.
    </p>
    <main class="portfolio-shell">
      <section class="hero-section page-section" aria-labelledby="intro-title">
        <p class="eyebrow">Aethergrid foundation</p>
        <h1 id="intro-title">${escapeHtml(data.name)}</h1>
        <p class="title">${escapeHtml(data.title)}</p>
        <div class="intro-lines">${introLines}</div>
        <nav class="contact-links contact-links--inline" aria-label="Primary contact links">
          ${contactLinks}
        </nav>
      </section>

      <section class="experience-section page-section" aria-labelledby="experience-title">
        <div class="section-heading">
          <p class="eyebrow">Experience signal</p>
          <h2 id="experience-title">${escapeHtml(data.experienceSummary.totalYears)}</h2>
          <p>${escapeHtml(data.experienceSummary.headline)}</p>
        </div>
        <div class="experience-list">
          ${renderExperienceEntries(data.experiences)}
        </div>
      </section>

      <section class="skills-section page-section" aria-labelledby="skills-title">
        <div class="section-heading">
          <p class="eyebrow">Skill matrix</p>
          <h2 id="skills-title">Core Capabilities</h2>
        </div>
        <ul class="skill-grid" aria-label="Skills">
          ${renderSkills(data.skills)}
        </ul>
      </section>

      <section class="contact-section page-section" aria-labelledby="contact-title">
        <div class="section-heading">
          <p class="eyebrow">Open channel</p>
          <h2 id="contact-title">Reach Out</h2>
          <p>Use any active signal below to connect.</p>
        </div>
        <nav class="contact-links contact-links--final" aria-label="Final contact links">
          ${contactLinks}
        </nav>
      </section>
    </main>
  `;
};
