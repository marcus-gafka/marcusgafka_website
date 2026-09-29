import type { Project } from "../data/projects/projects";
import { escapeHtml } from "../utils/html";
import { createTechTags } from "./techTags";

export function createProjectCard(project: Project): HTMLElement {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = `#/projects/${encodeURIComponent(project.id)}`;

    if (project.image) {
        const img = document.createElement("img");
        img.className = "project-card-image";
        img.src = `${import.meta.env.BASE_URL}${project.image}`;
        img.alt = "";
        img.loading = "lazy";
        card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "project-card-body";
    body.innerHTML = `
        <span class="project-date">${escapeHtml(project.date)}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
    `;
    body.appendChild(createTechTags(project.technologies));

    card.appendChild(body);
    return card;
}
