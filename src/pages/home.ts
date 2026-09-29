import { profile } from "../data/profile";
import { projects } from "../data/projects/projects";
import { sections } from "../data/sections";
import { createProjectCard } from "../components/projectCard";
import { createContactLinks } from "../components/contactLinks";
import { escapeHtml } from "../utils/html";

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "home";

    const heroImage = profile.heroImage
        ? `<img class="hero-image" src="${import.meta.env.BASE_URL}${profile.heroImage}" alt="Team 190's robot on the competition field" />`
        : "";

    const resumeButton = profile.resumePdf
        ? `<a href="#/resume" class="btn btn-secondary">View Resume</a>`
        : "";

    page.innerHTML = `
        <section class="hero">
            <div class="hero-text">
                <span class="hero-badge">${escapeHtml(profile.role)}</span>
                <h1>${escapeHtml(profile.name)}</h1>
                <p class="subtitle">${escapeHtml(profile.tagline)}</p>
                <div class="hero-actions">
                    <a href="#/work" class="btn btn-primary">See My Work</a>
                    <a href="#/about" class="btn btn-secondary">About Me</a>
                    ${resumeButton}
                </div>
            </div>
            ${heroImage}
        </section>
    `;
    page.querySelector(".hero-text")?.appendChild(createContactLinks());

    const sectionNav = document.createElement("section");
    sectionNav.className = "section-tiles";
    sectionNav.innerHTML = sections
        .map(section => `
            <a class="section-tile" href="#/${encodeURIComponent(section.id)}">
                <h3>${escapeHtml(section.title)}</h3>
                <p>${escapeHtml(section.blurb)}</p>
            </a>
        `)
        .join("");
    page.appendChild(sectionNav);

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
