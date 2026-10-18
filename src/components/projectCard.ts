import type { Project } from "../data/projects/projects";
import { escapeHtml } from "../utils/html";
import { assetUrl, projectHref } from "../utils/urls";
import { createTechTags } from "./techTags";

export function createProjectCard(project: Project): HTMLElement {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = projectHref(project);

    if (project.image) {
        const img = document.createElement("img");
        img.className = "project-card-image";
        img.src = assetUrl(project.image);
        img.alt = "";
        img.loading = "lazy";
        card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "project-card-body";
    body.innerHTML = `
        ${project.date ? `<span class="project-date">${escapeHtml(project.date)}</span>` : ""}
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
    `;
    const tags = createTechTags(project.technologies);
    if (tags) {
        body.appendChild(tags);
    }

    card.appendChild(body);
    return card;
}
