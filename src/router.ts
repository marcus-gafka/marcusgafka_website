import { renderHome } from "./pages/home";
import { renderProjects } from "./pages/projects";
import { renderProjectDetail } from "./pages/projectDetail";
import { renderAbout } from "./pages/about";
import { renderResume } from "./pages/resume";
import { renderNotFound } from "./pages/notFound";
import { findProject } from "./data/projects/projects";
import { profile } from "./data/profile";

export interface Route {
    /** Top-level section used to highlight the nav, e.g. "projects" */
    section: string;
    page: HTMLElement;
    title?: string;
}

/** "#/projects/foo" -> ["projects", "foo"] */
export function parseHash(hash: string): string[] {
    return hash
        .replace(/^#\/?/, "")
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent);
}

export function resolveRoute(hash: string): Route {
    const [section = "home", id] = parseHash(hash);

    switch (section) {
        case "home":
            return { section, page: renderHome() };
        case "projects": {
            if (!id) {
                return { section, page: renderProjects(), title: "Projects" };
            }
            const project = findProject(id);
            return project
                ? { section, page: renderProjectDetail(project), title: project.title }
                : { section, page: renderNotFound(), title: "Not Found" };
        }
        case "about":
            return { section, page: renderAbout(), title: "About" };
        case "resume":
            return { section, page: renderResume(), title: "Resume" };
        default:
            return { section: "", page: renderNotFound(), title: "Not Found" };
    }
}

export function handleRoute(): void {
    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    const { section, page, title } = resolveRoute(window.location.hash);

    page.classList.add("page");
    content.replaceChildren(page);
    window.scrollTo(0, 0);

    document.title = title ? `${title} | ${profile.name}` : profile.name;

    document.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.section === section);
    });

    requestAnimationFrame(() => page.classList.add("visible"));
}

export function initRouter(): void {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}
