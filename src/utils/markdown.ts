import showdown from "showdown";
// Common languages only; import more from "highlight.js/lib/languages/*" if needed.
import hljs from "highlight.js/lib/common";

const converter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true,
    tasklists: true,
    strikethrough: true,
});

export function renderMarkdown(source: string): HTMLElement {
    const container = document.createElement("div");
    container.className = "markdown-body";
    container.innerHTML = converter.makeHtml(source);

    container.querySelectorAll<HTMLElement>("pre code").forEach(block => {
        hljs.highlightElement(block);
    });

    // External links open in a new tab; in-site (#/...) links stay put.
    container.querySelectorAll<HTMLAnchorElement>("a[href^='http']").forEach(link => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    container.querySelectorAll("img").forEach(img => {
        img.loading = "lazy";
    });

    return container;
}
