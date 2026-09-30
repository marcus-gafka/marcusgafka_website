import { renderHome } from "./pages/home";
import { renderSection } from "./pages/section";
import { renderProjectDetail } from "./pages/projectDetail";
import { renderAbout } from "./pages/about";
import { renderResume } from "./pages/resume";
import { renderNotFound } from "./pages/notFound";
import { findSection, sectionAliases } from "./data/sections";
import { findProject } from "./data/projects/projects";
import { profile } from "./data/profile";
import { trackPageView } from "./utils/analytics";

export interface Route {
    /** Top-level section used to highlight the nav, e.g. "wpi" */
    section: string;
    page: HTMLElement;
    title?: string;
}

/** "#/wpi/rbe3002" -> ["wpi", "rbe3002"] */
export function parseHash(hash: string): string[] {
    return hash
        .replace(/^#\/?/, "")
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent);
}

const notFound = (): Route => ({ section: "", page: renderNotFound(), title: "Not Found" });

export function resolveRoute(hash: string): Route {
    const [sectionId = "home", id] = parseHash(hash);

    if (sectionId === "home") {
        return { section: sectionId, page: renderHome() };
    }
    if (sectionId === "about") {
        return { section: sectionId, page: renderAbout(), title: "About" };
    }
    if (sectionId === "resume") {
        return { section: "about", page: renderResume(), title: "Resume" };
    }

    const section = findSection(sectionId);
    if (!section) {
        return notFound();
    }
    if (!id) {
        return { section: section.id, page: renderSection(section), title: section.title };
    }

    const project = findProject(section.id, id);
    return project
        ? { section: section.id, page: renderProjectDetail(project, section), title: project.title }
        : notFound();
}

export function handleRoute(): void {
    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    // Old links (e.g. #/190/snapback) forward to the section's current URL.
    const [first, ...rest] = parseHash(window.location.hash);
    if (first && sectionAliases[first]) {
        window.location.replace(`#/${[sectionAliases[first], ...rest].map(encodeURIComponent).join("/")}`);
        return;
    }

    const { section, page, title } = resolveRoute(window.location.hash);

    page.classList.add("page");
    content.replaceChildren(page);
    window.scrollTo(0, 0);

    document.title = title ? `${title} | ${profile.name}` : profile.name;
    trackPageView();

    document.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.section === section);
    });

    requestAnimationFrame(() => page.classList.add("visible"));
}

export function initRouter(): void {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}
