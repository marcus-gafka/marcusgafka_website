import type { Section } from "../data/sections";
import { projectsInSection, type Project } from "../data/projects/projects";
import { escapeHtml } from "../utils/html";

const HIGHLIGHT_MS = 1600;

/**
 * Right-hand panel listing a section's projects as thumbnails, grouped when the
 * section has groups. On a section page (no activeId) clicking an item scrolls
 * to its post in the feed; on a project page the current project is highlighted
 * and items link to their own pages.
 */
export function createProjectNav(section: Section, activeId?: string): HTMLElement {
    const nav = document.createElement("aside");
    nav.className = "project-nav";
    nav.setAttribute("aria-label", `${section.title} projects`);

    const projects = projectsInSection(section.id);
    const groups = section.groups
        ? section.groups.map(group => ({ title: group.title, items: projects.filter(p => p.group === group.id) }))
        : [{ title: "", items: projects }];

    for (const { title, items } of groups) {
        if (items.length === 0) {
            continue;
        }
        const block = document.createElement("div");
        block.className = "project-nav-group";
        if (title) {
            block.innerHTML = `<h3>${escapeHtml(title)}</h3>`;
        }
        const list = document.createElement("ul");
        items.forEach(project => list.appendChild(createNavItem(project, project.id === activeId, !activeId)));
        block.appendChild(list);
        nav.appendChild(block);
    }

    return nav;
}

function createNavItem(project: Project, active: boolean, scrollToPost: boolean): HTMLElement {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "project-nav-item";
    link.href = `#/${encodeURIComponent(project.section)}/${encodeURIComponent(project.id)}`;
    if (active) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }

    const thumb = project.image
        ? `<img class="project-nav-thumb" src="${import.meta.env.BASE_URL}${project.image}" alt="" loading="lazy" />`
        : `<span class="project-nav-thumb project-nav-thumb-empty" aria-hidden="true">${escapeHtml(project.title.charAt(0))}</span>`;

    link.innerHTML = `
        ${thumb}
        <span class="project-nav-text">
            <span class="project-nav-title">${escapeHtml(project.title)}</span>
            ${project.date ? `<span class="project-nav-date">${escapeHtml(project.date)}</span>` : ""}
        </span>
    `;

    if (scrollToPost) {
        link.addEventListener("click", event => {
            // Let ctrl/cmd/shift/middle clicks open the project page as usual.
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            const post = document.getElementById(`post-${project.id}`);
            if (!post) {
                return;
            }
            event.preventDefault();
            post.scrollIntoView?.({ behavior: "smooth", block: "start" });
            post.classList.remove("post-highlight");
            void post.offsetWidth; // restart the highlight animation
            post.classList.add("post-highlight");
            window.setTimeout(() => post.classList.remove("post-highlight"), HIGHLIGHT_MS);
        });
    }

    item.appendChild(link);
    return item;
}
