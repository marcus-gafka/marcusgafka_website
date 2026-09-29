import type { Project } from "../data/projects/projects";
import type { Section } from "../data/sections";
import { createTechTags } from "../components/techTags";
import { createLinkList } from "../components/linkList";
import { renderMarkdown } from "../utils/markdown";
import { escapeHtml } from "../utils/html";

export function renderProjectDetail(project: Project, section: Section): HTMLElement {
    const page = document.createElement("article");
    page.className = "project-detail";

    const meta = [project.date, project.role].filter(Boolean).map(value => escapeHtml(value!));

    page.innerHTML = `
        <a class="back-link" href="#/${encodeURIComponent(section.id)}">&larr; ${escapeHtml(section.title)}</a>
        <header class="project-header">
            <span class="project-date">${meta.join(" · ")}</span>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="subtitle">${escapeHtml(project.summary)}</p>
        </header>
    `;

    const header = page.querySelector(".project-header")!;
    header.appendChild(createTechTags(project.technologies));
    if (project.links?.length) {
        header.appendChild(createLinkList(project.links));
    }

    page.appendChild(renderMarkdown(project.content));
    return page;
}
