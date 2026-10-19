import showdown from "showdown";
// Common languages only; import more from "highlight.js/lib/languages/*" if needed.
import hljs from "highlight.js/lib/common";
import { escapeHtml } from "./html";

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
    // (Synced clips turn autoplay off and are started by syncClips instead.)
    video.addEventListener(
        "loadeddata",
        () => {
            if (video.autoplay) {
                void video.play().catch(() => {});
            }
        },
        { once: true },
    );
}

/**
 * Clips in a `<div class="video-sync">` play as one: they start once all can play,
 * and a clip that finishes first holds its last frame until the rest finish, then
 * all restart together. (Make them the same length for a seamless loop.)
 */
export function syncClips(videos: HTMLVideoElement[]): void {
    if (videos.length < 2) {
        return;
    }
    const playAll = () =>
        videos.forEach(video => {
            video.currentTime = 0;
            void video.play().catch(() => {});
        });
    for (const video of videos) {
        video.loop = false;
        video.autoplay = false;
        video.removeAttribute("autoplay");
        video.preload = "auto";
        video.addEventListener("ended", () => {
            if (videos.every(v => v.ended)) {
                playAll();
            }
        });
    }
    const ready = videos.map(video =>
        video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
            ? Promise.resolve()
            : new Promise(resolve => video.addEventListener("canplay", resolve, { once: true })),
    );
    void Promise.all(ready).then(playAll);
}

/** A clip's still frame, saved next to it: "clip.mp4" -> "clip-poster.jpg" */
export function clipPoster(src: string): string {
    return src.replace(/\.(mp4|webm)$/i, "-poster.jpg");
}

/**
 * A short, silent, looping clip (like a moving photo) for a video file on the site.
 * `label` describes it for screen readers (defaults to the caption).
 */
export function videoClipHtml(
    src: string,
    { caption = "", label = caption, poster = "" }: { caption?: string; label?: string; poster?: string } = {},
): string {
    return [
        `<figure class="video-clip">`,
        `<video src="${escapeHtml(src)}"${poster ? ` poster="${escapeHtml(poster)}"` : ""}`,
        ` autoplay muted loop playsinline preload="metadata"`,
        label ? ` aria-label="${escapeHtml(label)}"` : "",
        `></video>`,
        caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "",
        `</figure>`,
    ].join("");
}

/**
 * Videos are written the same way as images, on their own line (also inside a
 * figure-row <div>): `![Caption](clip.mp4)` becomes a looping clip hosted on the
 * site, with its `-poster.jpg` still, and `![Caption](https://www.youtube.com/watch?v=...)`
 * becomes an embedded player. An optional `"description"` after the URL is the
 * clip's screen-reader label when it should differ from the caption (or there is none).
 */
function embedVideos(source: string): string {
    return source.replace(/^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)[ \t]*$/gm, (line, caption: string, url: string, label?: string) => {
        if (/\.(mp4|webm)$/i.test(url)) {
            return videoClipHtml(url, { caption, label: label || caption, poster: clipPoster(url) });
        }
        const id = youTubeId(url);
        if (!id) {
            return line;
        }
        const title = escapeHtml(label || caption || "YouTube video");
        return [
            `<figure class="video-embed">`,
            `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy"`,
            ` allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`,
            ` referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
            caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "",
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
    return `<${tag} class="math${display ? " math-display" : ""}" data-tex="${escapeHtml(tex)}">${escapeHtml(tex)}</${tag}>`;
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
    if (!reduceMotion) {
        container.querySelectorAll(".video-sync").forEach(group => {
            syncClips([...group.querySelectorAll<HTMLVideoElement>(".video-clip video")]);
        });
    }

    return container;
}
