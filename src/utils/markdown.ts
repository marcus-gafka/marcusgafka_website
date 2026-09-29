import showdown from "showdown";
// Common languages only; import more from "highlight.js/lib/languages/*" if needed.
import hljs from "highlight.js/lib/common";

const converter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true,
    tasklists: true,
    strikethrough: true,
});

/** The video id from a YouTube watch, short-link, Shorts, or embed URL, or null */
export function youTubeId(url: string): string | null {
    const match = url.match(
        /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
    );
    return match ? match[1] : null;
}

function escapeAttribute(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * `![Caption](https://www.youtube.com/watch?v=...)` on its own line becomes an
 * embedded player, so videos are written the same way as images.
 */
function embedVideos(source: string): string {
    return source.replace(/^!\[([^\]]*)\]\((\S+)\)[ \t]*$/gm, (line, caption: string, url: string) => {
        const id = youTubeId(url);
        if (!id) {
            return line;
        }
        const title = escapeAttribute(caption || "YouTube video");
        return [
            `<figure class="video-embed">`,
            `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy"`,
            ` allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`,
            ` referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
            caption ? `<figcaption>${escapeAttribute(caption)}</figcaption>` : "",
            `</figure>`,
        ].join("");
    });
}

export function renderMarkdown(source: string): HTMLElement {
    const container = document.createElement("div");
    container.className = "markdown-body";
    container.innerHTML = converter.makeHtml(embedVideos(source));

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
