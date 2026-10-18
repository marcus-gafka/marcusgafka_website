import { existsSync } from "node:fs";
import { resolve } from "node:path";
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
        expect([...links.map(l => l.label), ...missing].sort()).toEqual(["Email", "LinkedIn", "Portfolio", "Resume", "YouTube"]);
        links.forEach(l => expect(l.href).not.toBe(""));
    });

    it("opens the portfolio PDF in a new tab, and the file exists", () => {
        const page = renderAbout();
        const link = [...page.querySelectorAll<HTMLAnchorElement>(".about-links a")].find(a => a.textContent === "Portfolio");
        expect(link?.getAttribute("href")).toBe(`/${profile.portfolioPdf}`);
        expect(link?.target).toBe("_blank");
        expect(existsSync(resolve("public", profile.portfolioPdf))).toBe(true);
    });
});
