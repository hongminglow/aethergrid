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
  lines
    .map(
      (line, index) =>
        `<p data-typewriter-line data-typewriter-text="${escapeHtml(line)}" style="--line-index: ${index}">${escapeHtml(line)}</p>`
    )
    .join("");

const renderExperienceEntries = (experiences: PortfolioData["experiences"]) =>
  experiences
    .map((experience, index) => {
      const description = experience.description
        .map(
          (item) =>
            `<li data-experience-bullet>${escapeHtml(item)}</li>`
        )
        .join("");

      return `
        <article class="experience-entry" data-experience-entry data-entry-index="${index + 1}">
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
        `<li class="skill-chip" data-skill-chip data-skill-index="${index + 1}" style="--skill-index: ${index}; --skill-count: ${skills.length}">${escapeHtml(skill)}</li>`
    )
    .join("");

const renderContactLinks = (
  data: PortfolioData["contact"],
  variant: "inline" | "final"
) => {
  const finalAttribute = variant === "final" ? " data-final-contact-link" : "";
  const links = [
    {
      className: "contact-link--email",
      href: `mailto:${data.email}`,
      label: data.email,
      meta: "Email",
      target: ""
    },
    {
      className: "contact-link--github",
      href: data.githubUrl,
      label: "GitHub",
      meta: "Code",
      target: ' target="_blank" rel="noreferrer"'
    },
    {
      className: "contact-link--linkedin",
      href: data.linkedInUrl,
      label: "LinkedIn",
      meta: "Network",
      target: ' target="_blank" rel="noreferrer"'
    }
  ];

  return links
    .map(
      (link) =>
        `<a class="contact-link ${link.className}" href="${escapeHtml(link.href)}"${link.target} data-contact-link${finalAttribute}>
          <span>${escapeHtml(link.meta)}</span>
          <strong>${escapeHtml(link.label)}</strong>
        </a>`
    )
    .join("");
};

export const createPortfolioMarkup = (data: PortfolioData) => {
  const introLines = renderIntroLines(data.intro);
  const inlineContactLinks = renderContactLinks(data.contact, "inline");
  const finalContactLinks = renderContactLinks(data.contact, "final");

  return `
    <div id="scene-host" class="scene-host" aria-hidden="true"></div>
    <p id="webgl-fallback" class="webgl-fallback" role="status" hidden>
      WebGL scene unavailable. Portfolio content remains available below.
    </p>
    <main class="portfolio-shell">
      <section class="hero-section page-section" aria-labelledby="intro-title">
        <div class="hero-orbital" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="eyebrow hero-eyebrow">Aethergrid identity uplink</p>
        <h1 id="intro-title">${escapeHtml(data.name)}</h1>
        <p class="title">${escapeHtml(data.title)}</p>
        <div class="intro-panel">
          <span class="intro-panel__label">initializing profile stream</span>
          <div class="intro-lines" data-typewriter-root>${introLines}</div>
        </div>
        <nav class="contact-links contact-links--inline" aria-label="Primary contact links">
          ${inlineContactLinks}
        </nav>
      </section>

      <section class="experience-section page-section" aria-labelledby="experience-title" data-experience-section>
        <div class="section-heading" data-experience-heading>
          <p class="eyebrow">Experience signal</p>
          <h2 id="experience-title">${escapeHtml(data.experienceSummary.totalYears)}</h2>
          <p>${escapeHtml(data.experienceSummary.headline)}</p>
        </div>
        <div class="experience-list">
          ${renderExperienceEntries(data.experiences)}
        </div>
      </section>

      <section class="skills-section page-section" aria-labelledby="skills-title" data-skills-section>
        <div class="section-heading" data-skills-heading>
          <p class="eyebrow">Skill matrix</p>
          <h2 id="skills-title">Core Capabilities</h2>
        </div>
        <div class="skills-stage" data-skills-stage>
          <span class="skills-stage__ring" aria-hidden="true"></span>
          <span class="skills-stage__core" aria-hidden="true"></span>
          <ul class="skill-grid" aria-label="Skills">
            ${renderSkills(data.skills)}
          </ul>
        </div>
      </section>

      <section class="contact-section page-section" aria-labelledby="contact-title" data-contact-section>
        <div class="section-heading" data-contact-heading>
          <p class="eyebrow">Open channel</p>
          <h2 id="contact-title">Reach Out</h2>
          <p>Use any active signal below to connect.</p>
        </div>
        <div class="contact-stage" data-contact-stage>
          <span class="contact-stage__beam" aria-hidden="true"></span>
          <span class="contact-stage__node" aria-hidden="true"></span>
          <nav class="contact-links contact-links--final" aria-label="Final contact links">
            ${finalContactLinks}
          </nav>
        </div>
      </section>
    </main>
  `;
};
