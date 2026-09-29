import { describe, expect, it } from "vitest";
import { renderMarkdown, youTubeId } from "../src/utils/markdown";

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
