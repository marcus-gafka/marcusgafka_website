import type { Section } from "../data/sections";
import { projectsInSection } from "../data/projects/projects";
import { createProjectCard } from "../components/projectCard";
import { createLinkList } from "../components/linkList";
import { escapeHtml } from "../utils/html";

export function renderSection(section: Section): HTMLElement {
    const page = document.createElement("div");
    page.className = "section-page";
    page.innerHTML = `
        <header class="section-header">
            <h1>${escapeHtml(section.title)}</h1>
            <p class="subtitle">${escapeHtml(section.intro)}</p>
        </header>
    `;

    if (section.links?.length) {
        page.querySelector(".section-header")?.appendChild(createLinkList(section.links));
    }

    const projects = projectsInSection(section.id);
    if (projects.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Coming soon.";
        page.appendChild(empty);
        return page;
    }

    const grid = document.createElement("div");
    grid.className = "project-grid";
    projects.forEach(project => grid.appendChild(createProjectCard(project)));
    page.appendChild(grid);

    return page;
}
