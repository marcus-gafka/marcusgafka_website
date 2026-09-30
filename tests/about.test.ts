import { describe, expect, it } from "vitest";
import { aboutLinks, renderAbout } from "../src/pages/about";
import { profile } from "../src/data/profile";

describe("about page", () => {
    it("puts the contact links below the blurb", () => {
        const page = renderAbout();
        expect(page.lastElementChild?.classList.contains("about-links")).toBe(true);
        expect(page.querySelector(".markdown-body h2")?.textContent).toBe("About Me");
    });

    it("links email with mailto and skips links that aren't set", () => {
        const { links, missing } = aboutLinks();
        expect(links.find(l => l.label === "Email")?.href).toBe(`mailto:${profile.links.email}`);
        expect([...links.map(l => l.label), ...missing].sort()).toEqual(["Email", "LinkedIn", "Resume", "YouTube"]);
        links.forEach(l => expect(l.href).not.toBe(""));
    });
});
