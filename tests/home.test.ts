import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
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
            const { text, section, lead, highlight } = profile.heroLinks[i];
            const [leadText] = splitLead(text, lead);
            expect(link.getAttribute("href")).toBe(`#/${section}`);
            const grown = [...link.querySelectorAll(".hero-link-first")].map(el => el.textContent);
            expect(grown).toEqual(highlight ?? [leadText]);
        });
    });

    it("highlights only DEKA and NASA on the work line", () => {
        const link = renderHome().querySelector<HTMLAnchorElement>('.hero-link[href="#/work"]')!;
        expect(link.textContent!.replace(/\s+/g, " ").trim()).toBe("DEKA Research and NASA JSC Intern");
        expect([...link.querySelectorAll(".hero-link-first")].map(el => el.textContent)).toEqual(["DEKA", "NASA"]);
    });

    it("never highlights the intro line", () => {
        expect(renderHome().querySelector(".hero-intro .hero-link-first")).toBeNull();
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

describe("featured projects", () => {
    it("shows the hand-picked projects, in order", () => {
        const titles = [...renderHome().querySelectorAll(".featured .project-card h3")].map(h => h.textContent);
        expect(titles).toHaveLength(profile.featured.length);
        expect(titles[0]).toContain("DEKA");
        expect(titles[1]).toContain("NASA");
        expect(titles[2]).toContain("IQP");
    });
});

describe("live site (drafts hidden)", () => {
    it("hides draft sections from the sidebar and their hero lines", async () => {
        vi.resetModules();
        vi.doMock("../src/utils/drafts", async importOriginal => {
            const actual = await importOriginal<typeof import("../src/utils/drafts")>();
            return {
                ...actual,
                SHOW_DRAFTS: false,
                withoutDrafts: <T>(items: T[], isDraft: (item: T) => boolean) => actual.withoutDrafts(items, isDraft, false),
            };
        });
        const { sections: liveSections } = await import("../src/data/sections");
        const { renderHome: renderLiveHome } = await import("../src/pages/home");
        const { createSidebar } = await import("../src/components/sidebar");

        expect(liveSections.map(s => s.id)).not.toContain("personal");
        expect(renderLiveHome().querySelector('.hero-link[href="#/personal"]')).toBeNull();
        expect(createSidebar().querySelector('.nav-link[data-section="personal"]')).toBeNull();

        vi.doUnmock("../src/utils/drafts");
        vi.resetModules();
    });
});
