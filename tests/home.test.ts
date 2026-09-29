import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderHome, splitLead } from "../src/pages/home";
import { profile } from "../src/data/profile";
import { sections } from "../src/data/sections";

describe("home hero", () => {
    it("links each hero line to a real section", () => {
        const sectionIds = sections.map(section => section.id);
        profile.heroLinks.forEach(link => expect(sectionIds).toContain(link.section));
    });

    it("wraps each hero link's lead for the hover effect", () => {
        const links = renderHome().querySelectorAll<HTMLAnchorElement>(".hero-link");
        expect(links).toHaveLength(profile.heroLinks.length);

        links.forEach((link, i) => {
            const { text, section, lead } = profile.heroLinks[i];
            const [leadText] = splitLead(text, lead);
            expect(link.getAttribute("href")).toBe(`#/${section}`);
            expect(link.querySelector(".hero-link-first")?.textContent).toBe(leadText);
        });
    });

    it("only uses a lead that the text actually starts with", () => {
        profile.heroLinks.forEach(({ text, lead }) => {
            if (lead) expect(text.startsWith(lead), text).toBe(true);
        });
    });

    it("splits multi-word leads and falls back to the first word", () => {
        expect(splitLead("Worcester Polytechnic Institute student", "Worcester Polytechnic Institute"))
            .toEqual(["Worcester Polytechnic Institute", " student"]);
        expect(splitLead("Intern at DEKA")).toEqual(["Intern", " at DEKA"]);
    });

    it("leaves trailing punctuation out of the highlighted word", () => {
        expect(splitLead("Tinkerer, maker, and curious problem solver"))
            .toEqual(["Tinkerer", ", maker, and curious problem solver"]);
    });

    it("renders each hero line's text unchanged around the highlight", () => {
        const items = [...renderHome().querySelectorAll(".hero-list li")].map(li => li.textContent!.replace(/\s+/g, " ").trim());
        expect(items).toEqual([profile.heroIntro, ...profile.heroLinks.map(link => link.text)]);
    });
});

describe("profile", () => {
    it("points at headshot images that exist", () => {
        for (const path of [profile.headshot, profile.headshotSmall]) {
            expect(existsSync(resolve(__dirname, "../public", path)), path).toBe(true);
        }
    });
});
