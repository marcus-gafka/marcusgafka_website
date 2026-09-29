import aboutMarkdown from "../data/about.md?raw";
import { renderMarkdown } from "../utils/markdown";

export function renderAbout(): HTMLElement {
    const page = document.createElement("div");
    page.className = "about-page";
    page.appendChild(renderMarkdown(aboutMarkdown));
    return page;
}
