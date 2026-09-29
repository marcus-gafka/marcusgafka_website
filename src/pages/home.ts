import { profile } from "../data/profile";
import { projects } from "../data/projects/projects";
import { createProjectCard } from "../components/projectCard";
import { createContactLinks } from "../components/contactLinks";
import { escapeHtml } from "../utils/html";

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "home";

    page.innerHTML = `
        <section class="hero">
            <span class="hero-badge">${escapeHtml(profile.role)}</span>
            <h1>${escapeHtml(profile.name)}</h1>
            <p class="subtitle">${escapeHtml(profile.tagline)}</p>
            <div class="hero-actions">
                <a href="#/projects" class="btn btn-primary">Explore Projects</a>
                <a href="#/resume" class="btn btn-secondary">View Resume</a>
            </div>
        </section>
    `;
    page.querySelector(".hero")?.appendChild(createContactLinks());

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
