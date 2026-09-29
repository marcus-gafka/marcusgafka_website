import { describe, expect, it } from "vitest";
import { renderHome } from "../src/pages/home";
import { profile } from "../src/data/profile";
import { sections } from "../src/data/sections";

describe("home hero", () => {
    it("links each hero line to a real section", () => {
        const sectionIds = sections.map(section => section.id);
        profile.heroLinks.forEach(link => expect(sectionIds).toContain(link.section));
    });

    it("wraps the first word of each hero link for the hover effect", () => {
        const links = renderHome().querySelectorAll<HTMLAnchorElement>(".hero-link");
        expect(links).toHaveLength(profile.heroLinks.length);

        links.forEach((link, i) => {
            const { text, section } = profile.heroLinks[i];
            expect(link.getAttribute("href")).toBe(`#/${section}`);
            expect(link.querySelector(".hero-link-first")?.textContent).toBe(text.split(" ")[0]);
        });
    });
});
