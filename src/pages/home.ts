import { profile, type HeroLink } from "../data/profile";
import { projectsById } from "../data/projects/projects";
import { createProjectCard } from "../components/projectCard";
import { escapeHtml } from "../utils/html";

/**
 * Splits off the lead: the given `lead` if the text starts with it, else the
 * first word without trailing punctuation. The rest keeps its leading space or
 * punctuation, e.g. "Tinkerer, maker" -> ["Tinkerer", ", maker"].
 */
export function splitLead(text: string, lead?: string): [string, string] {
    const leadText = lead && text.startsWith(lead)
        ? lead
        : text.split(" ")[0].replace(/[,.;:!?]+$/, "");
    return [leadText, text.slice(leadText.length)];
}

/** Wraps each highlighted word/phrase (whole words only) in a span that grows on hover. */
function withHighlights(text: string, highlight: string[]): string {
    let html = escapeHtml(text);
    for (const phrase of highlight) {
        const escaped = escapeHtml(phrase).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        html = html.replace(new RegExp(`(^|[^\\w>])(${escaped})(?![\\w<])`, "g"), '$1<span class="hero-link-first">$2</span>');
    }
    return html;
}

/**
 * Wraps the lead in a span (the dash bullet hangs off it so it stays centered)
 * and marks the words that grow on hover: `highlight`, or else the lead.
 */
function withLead(text: string, { lead, highlight }: { lead?: string; highlight?: string[] } = {}): string {
    const [leadText, rest] = splitLead(text, lead);
    const words = highlight ?? [leadText];
    const leadClass = words.includes(leadText) ? "hero-lead hero-link-first" : "hero-lead";
    const others = words.filter(word => word !== leadText);
    return `<span class="${leadClass}">${escapeHtml(leadText)}</span>${withHighlights(rest, others)}`;
}

function heroLink({ text, section, lead, highlight }: HeroLink): string {
    return `
        <li>
            <a class="hero-link" href="#/${encodeURIComponent(section)}">${withLead(text, { lead, highlight })}</a>
        </li>
    `;
}

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "home";

    page.innerHTML = `
        <section class="hero">
            <div class="hero-text">
                <p class="hero-greeting">Hi! I'm</p>
                <h1>${escapeHtml(profile.name)}, a:</h1>
                <ul class="hero-list">
                    <li class="hero-intro">${withLead(profile.heroIntro, { highlight: [] })}</li>
                    ${profile.heroLinks.map(heroLink).join("")}
                </ul>
            </div>
        </section>
    `;

    const featured = projectsById(profile.featured);
    if (featured.length > 0) {
        const section = document.createElement("section");
        section.className = "featured";
        section.innerHTML = `<h2>Featured Projects</h2>`;

        const grid = document.createElement("div");
        grid.className = "project-grid";
        featured.forEach(project => grid.appendChild(createProjectCard(project)));

        section.appendChild(grid);
        page.appendChild(section);
    }

    return page;
}
