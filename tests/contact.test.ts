import { describe, expect, it } from "vitest";
import { createSidebar } from "../src/components/sidebar";
import { profile } from "../src/data/profile";

describe("sidebar contact", () => {
    it("has an Email me button that opens a message to the profile email", () => {
        const button = createSidebar().querySelector<HTMLAnchorElement>(".btn-email");
        expect(button?.textContent).toBe("Email me");
        expect(button?.getAttribute("href")).toBe(`mailto:${profile.links.email}`);
    });

    it("hides links that are left empty", () => {
        const labels = [...createSidebar().querySelectorAll(".contact-link")].map(a => a.textContent);
        if (!profile.links.github) expect(labels).not.toContain("GitHub");
        if (!profile.links.linkedin) expect(labels).not.toContain("LinkedIn");
    });
});
