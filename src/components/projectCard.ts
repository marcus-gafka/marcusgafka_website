import type { Project } from "../data/projects/projects";
import { escapeHtml } from "../utils/html";
import { projectHref } from "../utils/urls";
import { createTechTags } from "./techTags";
import { projectImageHtml, projectResultHtml } from "./projectImage";

export function createProjectCard(project: Project): HTMLElement {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = projectHref(project);

    // Wrapped so the photo can zoom on hover inside its frame
    const image = projectImageHtml(project, "project-card-image");
    if (image) {
        card.insertAdjacentHTML("beforeend", `<div class="project-card-media">${image}</div>`);
    }

    const body = document.createElement("div");
    body.className = "project-card-body";
    body.innerHTML = `
        ${project.date ? `<span class="project-date">${escapeHtml(project.date)}</span>` : ""}
        <h3 data-project-title="${escapeHtml(project.id)}">${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
        ${projectResultHtml(project)}
    `;
    const tags = createTechTags(project.technologies);
    if (tags) {
        body.appendChild(tags);
    }

    card.appendChild(body);
    return card;
}
