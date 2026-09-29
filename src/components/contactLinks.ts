import { profile } from "../data/profile";

export function createContactLinks(): HTMLElement {
    const list = document.createElement("div");
    list.className = "contact-links";

    const { github, linkedin, email } = profile.links;

    if (email) {
        const button = document.createElement("a");
        button.className = "btn-email";
        button.href = `mailto:${email}`;
        button.textContent = "Email me";
        list.appendChild(button);
    }

    const entries: [string, string][] = [];
    if (github) entries.push(["GitHub", github]);
    if (linkedin) entries.push(["LinkedIn", linkedin]);

    for (const [label, href] of entries) {
        const link = document.createElement("a");
        link.className = "contact-link";
        link.href = href;
        link.textContent = label;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        list.appendChild(link);
    }

    return list;
}
