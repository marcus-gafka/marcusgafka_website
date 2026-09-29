import type { Link } from "../data/sections";

export function createLinkList(links: Link[]): HTMLElement {
    const list = document.createElement("div");
    list.className = "link-list";
    for (const { label, url } of links) {
        const link = document.createElement("a");
        link.className = "btn btn-secondary";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        list.appendChild(link);
    }
    return list;
}
