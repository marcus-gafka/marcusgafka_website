import aboutMarkdown from "../data/about.md?raw";
import { profile } from "../data/profile";
import { renderMarkdown } from "../utils/markdown";
import { SHOW_DRAFTS } from "../utils/drafts";

interface AboutLink {
    label: string;
    href: string;
    /** Opens in a new tab (everything but email and the resume download) */
    external: boolean;
}

/** LinkedIn, YouTube, Email, Resume, in that order; unset ones are skipped. */
export function aboutLinks(): { links: AboutLink[]; missing: string[] } {
    const { linkedin, youtube, email } = profile.links;
    const candidates: [string, string, boolean][] = [
        ["LinkedIn", linkedin, true],
        ["YouTube", youtube, true],
        ["Email", email ? `mailto:${email}` : "", false],
        ["Resume", profile.resumePdf ? `${import.meta.env.BASE_URL}${profile.resumePdf}` : "", false],
    ];
    return {
        links: candidates.filter(([, href]) => href).map(([label, href, external]) => ({ label, href, external })),
        missing: candidates.filter(([, href]) => !href).map(([label]) => label),
    };
}

export function renderAbout(): HTMLElement {
    const page = document.createElement("div");
    page.className = "about-page";
    page.appendChild(renderMarkdown(aboutMarkdown));

    const { links, missing } = aboutLinks();
    const nav = document.createElement("nav");
    nav.className = "about-links";
    nav.setAttribute("aria-label", "Find me elsewhere");

    for (const { label, href, external } of links) {
        const link = document.createElement("a");
        link.className = "btn btn-secondary";
        link.href = href;
        link.textContent = label;
        if (external) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
        if (label === "Resume") {
            link.setAttribute("download", "");
        }
        nav.appendChild(link);
    }

    // Locally, show reminders for links that still need a URL.
    if (SHOW_DRAFTS) {
        for (const label of missing) {
            const reminder = document.createElement("span");
            reminder.className = "btn about-link-missing";
            reminder.textContent = `${label} (add link)`;
            nav.appendChild(reminder);
        }
    }

    page.appendChild(nav);
    return page;
}
