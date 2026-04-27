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

export const createFoundationMarkup = (data: PortfolioData) => {
  const introLines = data.intro
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

  const contactLinks = [
    `<a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>`,
    `<a href="${escapeHtml(data.contact.githubUrl)}" target="_blank" rel="noreferrer">GitHub</a>`,
    `<a href="${escapeHtml(data.contact.linkedInUrl)}" target="_blank" rel="noreferrer">LinkedIn</a>`
  ].join("");

  return `
    <main class="foundation-shell">
      <section class="foundation-hero" aria-labelledby="intro-title">
        <p class="eyebrow">Aethergrid foundation</p>
        <h1 id="intro-title">${escapeHtml(data.name)}</h1>
        <p class="title">${escapeHtml(data.title)}</p>
        <div class="intro-lines">${introLines}</div>
        <nav class="contact-links" aria-label="Contact links">
          ${contactLinks}
        </nav>
      </section>
    </main>
  `;
};
