import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../src/utils/markdown";

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
