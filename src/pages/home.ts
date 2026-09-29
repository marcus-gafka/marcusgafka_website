import { profile } from "../data/profile";
import { projects } from "../data/projects/projects";
import { createProjectCard } from "../components/projectCard";
import { createContactLinks } from "../components/contactLinks";
import { escapeHtml } from "../utils/html";

function heroLink(text: string, section: string): string {
    const [first, ...rest] = text.split(" ");
    return `
        <li>
            <a class="hero-link" href="#/${encodeURIComponent(section)}">
                <span class="hero-link-first">${escapeHtml(first)}</span> ${escapeHtml(rest.join(" "))}
            </a>
        </li>
    `;
}

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "home";

    const heroImage = profile.heroImage
        ? `<img class="hero-image" src="${import.meta.env.BASE_URL}${profile.heroImage}" alt="Team 190's robot on the competition field" />`
        : "";

    page.innerHTML = `
        <section class="hero">
            <div class="hero-text">
                <p class="hero-greeting">Hi, I'm</p>
                <h1>${escapeHtml(profile.name)}, a:</h1>
                <ul class="hero-list">
                    <li class="hero-intro">${escapeHtml(profile.heroIntro)}</li>
                    ${profile.heroLinks.map(({ text, section }) => heroLink(text, section)).join("")}
                </ul>
            </div>
            ${heroImage}
        </section>
    `;
    page.querySelector(".hero-text")?.appendChild(createContactLinks());

    const featured = projects.filter(project => project.featured);
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
