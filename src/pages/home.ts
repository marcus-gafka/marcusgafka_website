import { profile, type HeroLink } from "../data/profile";
import { recentProjects } from "../data/projects/projects";
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

/** Wraps the lead in a span; the dash bullet hangs off it so it stays centered on the lead. */
function withLead(text: string, { lead, extraClass = "" }: { lead?: string; extraClass?: string } = {}): string {
    const [leadText, rest] = splitLead(text, lead);
    return `<span class="hero-lead ${extraClass}">${escapeHtml(leadText)}</span>${escapeHtml(rest)}`;
}

function heroLink({ text, section, lead }: HeroLink): string {
    return `
        <li>
            <a class="hero-link" href="#/${encodeURIComponent(section)}">${withLead(text, { lead, extraClass: "hero-link-first" })}</a>
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
                    <li class="hero-intro">${withLead(profile.heroIntro)}</li>
                    ${profile.heroLinks.map(heroLink).join("")}
                </ul>
            </div>
        </section>
    `;

    const featured = recentProjects(3);
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
