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
import { observeReveals } from "./utils/reveal";

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
        return { section: sectionId, page: renderAbout(), title: "About Me" };
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
    const [, newProjectId] = parseHash(window.location.hash);
    const oldProjectId = content.querySelector<HTMLElement>("h1[data-project-title]")?.dataset.projectTitle;

    const swap = (animate: boolean) => {
        page.classList.add("page");
        content.replaceChildren(page);
        window.scrollTo(0, 0);

        document.title = title ? `${title} | ${profile.name}` : profile.name;
        trackPageView();

        document.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach(link => {
            link.classList.toggle("active", link.dataset.section === section);
        });

        // The new page's title takes over the morph from the old one (see below)
        tagMorphTitle(content, newProjectId ?? oldProjectId);
        observeReveals(page);

        if (animate) {
            page.classList.add("visible");
        } else {
            requestAnimationFrame(() => page.classList.add("visible"));
        }
    };

    // Smooth cross-fade between pages where supported; a project's title morphs
    // from its card/post into the page heading (and back). Otherwise: the CSS fade-in.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (typeof document.startViewTransition === "function" && !reduceMotion && content.firstElementChild) {
        tagMorphTitle(content, newProjectId ?? oldProjectId);
        document.startViewTransition(() => swap(true));
    } else {
        swap(false);
    }
}

/**
 * Gives the title of the given project (a card, feed post, or page heading) the
 * shared view-transition name, and clears it from everything else. Only a
 * title that's on screen morphs, so off-screen ones don't fly in from afar.
 */
function tagMorphTitle(root: HTMLElement, projectId: string | undefined): void {
    root.querySelectorAll<HTMLElement>("[data-project-title]").forEach(el => {
        el.style.viewTransitionName = "";
    });
    if (!projectId) {
        return;
    }
    const target = [...root.querySelectorAll<HTMLElement>("[data-project-title]")]
        .find(el => el.dataset.projectTitle === projectId);
    if (!target) {
        return;
    }
    const box = target.getBoundingClientRect();
    const onScreen = box.bottom > 0 && box.top < window.innerHeight;
    if (onScreen || target.tagName === "H1") {
        target.style.viewTransitionName = "project-title";
    }
}

export function initRouter(): void {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}
