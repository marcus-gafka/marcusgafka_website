import { projectsInSection, type Project } from "../data/projects/projects";
import type { Section } from "../data/sections";
import { createTechTags } from "../components/techTags";
import { createLinkList } from "../components/linkList";
import { createProjectNav } from "../components/projectNav";
import { projectImageHtml } from "../components/projectImage";
import { renderMarkdown } from "../utils/markdown";
import { escapeHtml } from "../utils/html";
import { projectHref, sectionHref } from "../utils/urls";

export function renderProjectDetail(project: Project, section: Section): HTMLElement {
    const page = document.createElement("div");
    page.className = "project-page with-aside";

    const article = document.createElement("article");
    article.className = "project-detail main-column";
    page.append(article, createProjectNav(section, project.id));

    article.innerHTML = `
        <a class="back-link" href="${sectionHref(section.id)}">&larr; ${escapeHtml(section.title)}</a>
        <header class="project-header">
            ${project.date ? `<span class="project-date">${escapeHtml(project.date)}</span>` : ""}
            <h1 data-project-title="${escapeHtml(project.id)}">${escapeHtml(project.title)}</h1>
            ${project.hideSummaryOnPage ? "" : `<p class="subtitle">${escapeHtml(project.summary)}</p>`}
        </header>
    `;

    const header = article.querySelector(".project-header")!;
    const spec = createSpecSheet(project);
    if (spec) {
        header.appendChild(spec);
    }
    if (project.links?.length) {
        header.appendChild(createLinkList(project.links));
    }

    article.appendChild(renderMarkdown(project.content));

    const pager = createPager(project, section);
    if (pager) {
        article.appendChild(pager);
    }
    return page;
}

/**
 * The "datasheet" under the title: role and tools at a glance. Rows
 * without data are left out; returns null when there's nothing to show.
 */
export function createSpecSheet(project: Project): HTMLElement | null {
    const rows: [string, string | HTMLElement][] = [];
    if (project.role) rows.push(["Role", project.role]);
    const tags = createTechTags(project.technologies);
    if (tags) rows.push(["Tools", tags]);
    if (rows.length === 0) {
        return null;
    }

    const list = document.createElement("dl");
    list.className = "spec-sheet";
    for (const [label, value] of rows) {
        const row = document.createElement("div");
        row.className = "spec-row";
        const term = document.createElement("dt");
        term.textContent = label;
        const detail = document.createElement("dd");
        detail.append(value);
        row.append(term, detail);
        list.appendChild(row);
    }
    return list;
}

/** Previous / next project in the section, in the same order as the section feed */
export function createPager(project: Project, section: Section): HTMLElement | null {
    const projects = projectsInSection(section.id);
    const index = projects.findIndex(p => p.id === project.id);
    if (index === -1 || projects.length < 2) {
        return null;
    }
    const prev = projects[index - 1];
    const next = projects[index + 1];

    const nav = document.createElement("nav");
    nav.className = "project-pager";
    nav.setAttribute("aria-label", "More projects");
    const link = (p: Project | undefined, dir: "prev" | "next") => p ? `
        <a class="pager-link pager-${dir}" href="${projectHref(p)}" rel="${dir}">
            ${projectImageHtml(p, "pager-thumb")}
            <span class="pager-text">
                <span class="pager-label">${dir === "prev" ? "&larr; Previous" : "Next &rarr;"}</span>
                <span class="pager-title">${escapeHtml(p.title)}</span>
            </span>
        </a>` : `<span class="pager-spacer"></span>`;
    nav.innerHTML = link(prev, "prev") + link(next, "next");
    return nav;
}
