import type { Link } from "../data/types";

/** A button-styled link; external ones open in a new tab */
export function createButtonLink(label: string, href: string, { external = true, download = false } = {}): HTMLAnchorElement {
    const link = document.createElement("a");
    link.className = "btn btn-secondary";
    link.href = href;
    link.textContent = label;
    if (external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
    if (download) {
        link.setAttribute("download", "");
    }
    return link;
}

export function createLinkList(links: Link[]): HTMLElement {
    const list = document.createElement("div");
    list.className = "link-list";
    for (const { label, url } of links) {
        list.appendChild(createButtonLink(label, url));
    }
    return list;
}
