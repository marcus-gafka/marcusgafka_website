import { describe, expect, it } from "vitest";
import { extractMath, renderMarkdown, renderMath, videoClipHtml, youTubeId } from "../src/utils/markdown";

describe("renderMarkdown", () => {
    it("converts markdown to HTML", () => {
        const el = renderMarkdown("## Title\n\nSome **bold** text");
        expect(el.querySelector("h2")?.textContent).toBe("Title");
        expect(el.querySelector("strong")?.textContent).toBe("bold");
    });

    it("syntax-highlights fenced code blocks", () => {
        const el = renderMarkdown("```python\nprint('hi')\n```");
        expect(el.querySelector("pre code")?.classList.contains("hljs")).toBe(true);
    });

    it("opens external links in a new tab but keeps in-site links in place", () => {
        const el = renderMarkdown("[ext](https://example.com) [int](#/about)");
        const [ext, int] = el.querySelectorAll("a");
        expect(ext.target).toBe("_blank");
        expect(int.target).toBe("");
    });
});

describe("YouTube embeds", () => {
    it("recognizes the common YouTube URL forms", () => {
        expect(youTubeId("https://www.youtube.com/watch?v=PdHmzXaJPoI")).toBe("PdHmzXaJPoI");
        expect(youTubeId("https://youtu.be/072Up5i1lFc")).toBe("072Up5i1lFc");
        expect(youTubeId("https://www.youtube.com/shorts/072Up5i1lFc")).toBe("072Up5i1lFc");
        expect(youTubeId("https://www.youtube.com/watch?t=5&v=PdHmzXaJPoI")).toBe("PdHmzXaJPoI");
        expect(youTubeId("https://example.com/photo.jpg")).toBeNull();
    });

    it("turns an image-style YouTube line into an embedded player with a caption", () => {
        const el = renderMarkdown("Intro\n\n![My caption](https://www.youtube.com/watch?v=PdHmzXaJPoI)\n\nAfter");
        const iframe = el.querySelector(".video-embed iframe");
        expect(iframe?.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/PdHmzXaJPoI");
        expect(iframe?.getAttribute("title")).toBe("My caption");
        expect(el.querySelector(".video-embed figcaption")?.textContent).toBe("My caption");
        expect(el.querySelectorAll("p")).toHaveLength(2);
    });

    it("leaves normal images alone", () => {
        const el = renderMarkdown("![A photo](photo.jpg)");
        expect(el.querySelector("img")?.getAttribute("src")).toBe("photo.jpg");
        expect(el.querySelector("iframe")).toBeNull();
    });
});

describe("video clips", () => {
    it("turns an image-style .mp4 line into a silent looping clip", () => {
        const el = renderMarkdown("![Rocket in motion](/assets/clip.mp4)");
        const video = el.querySelector<HTMLVideoElement>(".video-clip video");
        expect(video?.getAttribute("src")).toBe("/assets/clip.mp4");
        for (const attr of ["autoplay", "muted", "loop", "playsinline"]) {
            expect(video?.hasAttribute(attr), attr).toBe(true);
        }
        expect(el.querySelector(".video-clip figcaption")?.textContent).toBe("Rocket in motion");
    });

    it("adds a poster image when given one", () => {
        expect(videoClipHtml("/a.mp4", "Cap", "/a.jpg")).toContain('poster="/a.jpg"');
    });
});

describe("seamless clips", () => {
    it("strips all player chrome from clips", () => {
        const video = renderMarkdown("![Clip](/assets/clip.mp4)").querySelector<HTMLVideoElement>("video")!;
        expect(video.controls).toBe(false);
        expect(video.muted).toBe(true);
        expect(video.loop).toBe(true);
        expect(video.hasAttribute("disablepictureinpicture")).toBe(true);
        expect(video.getAttribute("controlslist")).toContain("nofullscreen");
    });

    it("also applies to clips written as HTML in a write-up", () => {
        const html = '<figure class="video-clip"><video src="/a.mp4" autoplay muted loop playsinline></video></figure>';
        const video = renderMarkdown(html).querySelector<HTMLVideoElement>("video")!;
        expect(video.hasAttribute("disableremoteplayback")).toBe(true);
        expect(video.tabIndex).toBe(-1);
    });
});

describe("math", () => {
    it("pulls out display and inline math but leaves escaped dollars alone", () => {
        const { text, math } = extractMath("Cost \\$30. Inline $x_i^2$ and\n\n$$G = [G_1 \\; G_2]$$");
        expect(math).toEqual([
            { tex: "G = [G_1 \\; G_2]", display: true },
            { tex: "x_i^2", display: false },
        ]);
        expect(text).toContain("\\$30");
    });

    it("leaves a lone dollar amount as text", () => {
        const el = renderMarkdown("A prototype for under $30 and a $5 part");
        expect(el.textContent).toContain("under $30 and a $5 part");
        expect(el.querySelector(".math")).toBeNull();
    });

    it("typesets math with KaTeX", async () => {
        const el = renderMarkdown("Energy $E = mc^2$\n\n$$\\sigma_{min}(G)$$");
        await renderMath(el);
        expect(el.querySelectorAll(".katex").length).toBe(2);
        expect(el.querySelector(".math-display .katex-display")).not.toBeNull();
    });
});
