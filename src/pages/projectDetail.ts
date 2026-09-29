import type { Project } from "../data/projects/projects";
import { createTechTags } from "../components/techTags";
import { renderMarkdown } from "../utils/markdown";
import { escapeHtml } from "../utils/html";

export function renderProjectDetail(project: Project): HTMLElement {
    const page = document.createElement("article");
    page.className = "project-detail";

    const links: string[] = [];
    if (project.githubUrl) {
        links.push(`<a class="btn btn-secondary" href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer">Source Code</a>`);
    }
    if (project.demoUrl) {
        links.push(`<a class="btn btn-primary" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Live Demo</a>`);
    }

    page.innerHTML = `
        <a class="back-link" href="#/projects">&larr; All projects</a>
        <header class="project-header">
            <span class="project-date">${escapeHtml(project.date)}</span>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="subtitle">${escapeHtml(project.summary)}</p>
            <div class="project-links">${links.join("")}</div>
        </header>
    `;

    page.querySelector(".project-header")?.appendChild(createTechTags(project.technologies));
    page.appendChild(renderMarkdown(project.content));
    return page;
}
