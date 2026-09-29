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
});
