import { profile } from "../data/profile";

export function createContactLinks(): HTMLElement {
    const list = document.createElement("div");
    list.className = "contact-links";

    const { github, linkedin, email } = profile.links;
    const entries: [string, string][] = [];
    if (github) entries.push(["GitHub", github]);
    if (linkedin) entries.push(["LinkedIn", linkedin]);
    if (email) entries.push(["Email", `mailto:${email}`]);

    for (const [label, href] of entries) {
        const link = document.createElement("a");
        link.className = "contact-link";
        link.href = href;
        link.textContent = label;
        if (!href.startsWith("mailto:")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
        list.appendChild(link);
    }

    return list;
}
