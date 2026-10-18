import { projectMeta, type Project } from "../data/projects/projects";
import type { Section } from "../data/sections";
import { createTechTags } from "../components/techTags";
import { createLinkList } from "../components/linkList";
import { createProjectNav } from "../components/projectNav";
import { renderMarkdown } from "../utils/markdown";
import { escapeHtml } from "../utils/html";
import { sectionHref } from "../utils/urls";

export function renderProjectDetail(project: Project, section: Section): HTMLElement {
    const page = document.createElement("div");
    page.className = "project-page with-aside";

    const article = document.createElement("article");
    article.className = "project-detail main-column";
    page.append(article, createProjectNav(section, project.id));

    article.innerHTML = `
        <a class="back-link" href="${sectionHref(section.id)}">&larr; ${escapeHtml(section.title)}</a>
        <header class="project-header">
            <span class="project-date">${escapeHtml(projectMeta(project))}</span>
            <h1>${escapeHtml(project.title)}</h1>
            ${project.hideSummaryOnPage ? "" : `<p class="subtitle">${escapeHtml(project.summary)}</p>`}
        </header>
    `;

    const header = article.querySelector(".project-header")!;
    const tags = createTechTags(project.technologies);
    if (tags) {
        header.appendChild(tags);
    }
    if (project.links?.length) {
        header.appendChild(createLinkList(project.links));
    }

    article.appendChild(renderMarkdown(project.content));
    return page;
}
