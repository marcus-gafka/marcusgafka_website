import type { Project } from "../data/projects/projects";
import { escapeHtml } from "../utils/html";
import { assetUrl } from "../utils/urls";

/**
 * A project's card/thumbnail image as HTML (or "" when it has none). A transparent
 * `cardLogo` wins over `image` and sits on a soft sage backdrop (class `is-logo`).
 */
export function projectImageHtml(project: Project, className: string, { lazy = true } = {}): string {
    const src = project.cardLogo ?? project.image;
    if (!src) {
        return "";
    }
    const classes = escapeHtml(project.cardLogo ? `${className} is-logo` : className);
    return `<img class="${classes}" src="${assetUrl(src)}" alt=""${lazy ? ' loading="lazy"' : ""} />`;
}

/** The one-line outcome under a card's summary, or "" */
export function projectResultHtml(project: Project): string {
    return project.result ? `<p class="project-result">${escapeHtml(project.result)}</p>` : "";
}
