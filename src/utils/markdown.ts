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
 * Makes a clip behave like a moving image rather than a video player: silent,
 * inline, looping, with no controls, fullscreen, picture-in-picture, casting,
 * or download menu, and not tappable.
 */
export function makeSeamless(video: HTMLVideoElement): void {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("disableremoteplayback", "");
    video.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback noplaybackrate");
    video.tabIndex = -1;
    video.addEventListener("contextmenu", event => event.preventDefault());
    // Some browsers skip the autoplay attribute on videos added after load.
    video.addEventListener("loadeddata", () => void video.play().catch(() => {}), { once: true });
}

/** A short, silent, looping clip (like a moving photo) for a video file on the site */
export function videoClipHtml(src: string, caption = "", poster = ""): string {
    return [
        `<figure class="video-clip">`,
        `<video src="${escapeAttribute(src)}"${poster ? ` poster="${escapeAttribute(poster)}"` : ""}`,
        ` autoplay muted loop playsinline preload="metadata"`,
        caption ? ` aria-label="${escapeAttribute(caption)}"` : "",
        `></video>`,
        caption ? `<figcaption>${escapeAttribute(caption)}</figcaption>` : "",
        `</figure>`,
    ].join("");
}

/**
 * Videos are written the same way as images, on their own line:
 * `![Caption](clip.mp4)` becomes a looping clip hosted on the site, and
 * `![Caption](https://www.youtube.com/watch?v=...)` becomes an embedded player.
 */
function embedVideos(source: string): string {
    return source.replace(/^!\[([^\]]*)\]\((\S+)\)[ \t]*$/gm, (line, caption: string, url: string) => {
        if (/\.(mp4|webm)$/i.test(url)) {
            return videoClipHtml(url, caption);
        }
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

/**
 * Math: `$$...$$` (display) and `$...$` (inline) are pulled out before Markdown
 * conversion, so underscores and backslashes in TeX aren't mangled, then
 * restored as placeholders that KaTeX renders. `\$` stays a literal dollar sign.
 */
export function extractMath(source: string): { text: string; math: { tex: string; display: boolean }[] } {
    const math: { tex: string; display: boolean }[] = [];
    const token = (tex: string, display: boolean) => {
        math.push({ tex: tex.trim(), display });
        return `MATHTOKEN${math.length - 1}END`;
    };
    let text = source.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => `\n\n${token(tex, true)}\n\n`);
    text = text.replace(/(^|[^\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g, (_, pre: string, tex: string) => pre + token(tex, false));
    return { text, math };
}

function restoreMath(html: string, math: { tex: string; display: boolean }[]): string {
    return html
        .replace(/<p>\s*MATHTOKEN(\d+)END\s*<\/p>/g, (_, i: string) => mathHtml(math[Number(i)]))
        .replace(/MATHTOKEN(\d+)END/g, (_, i: string) => mathHtml(math[Number(i)]));
}

function mathHtml({ tex, display }: { tex: string; display: boolean }): string {
    const tag = display ? "div" : "span";
    return `<${tag} class="math${display ? " math-display" : ""}" data-tex="${escapeAttribute(tex)}">${escapeAttribute(tex)}</${tag}>`;
}

/** Typesets any math placeholders; KaTeX is only downloaded when a page has math. */
export async function renderMath(container: HTMLElement): Promise<void> {
    const nodes = [...container.querySelectorAll<HTMLElement>(".math[data-tex]")];
    if (nodes.length === 0) {
        return;
    }
    const [{ default: katex }] = await Promise.all([import("katex"), import("katex/dist/katex.min.css")]);
    for (const node of nodes) {
        node.innerHTML = katex.renderToString(node.dataset.tex!, {
            displayMode: node.classList.contains("math-display"),
            throwOnError: false,
        });
    }
}

export function renderMarkdown(source: string): HTMLElement {
    const container = document.createElement("div");
    container.className = "markdown-body";
    const { text, math } = extractMath(embedVideos(source));
    container.innerHTML = restoreMath(converter.makeHtml(text), math);
    void renderMath(container);

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

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    container.querySelectorAll<HTMLVideoElement>(".video-clip video").forEach(video => {
        if (reduceMotion) {
            // Respect "reduce motion": no autoplay; show the still frame with play controls.
            video.removeAttribute("autoplay");
            video.controls = true;
            return;
        }
        makeSeamless(video);
    });

    return container;
}
