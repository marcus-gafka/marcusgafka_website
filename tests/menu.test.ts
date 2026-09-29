import { beforeEach, describe, expect, it } from "vitest";
import { createSidebar } from "../src/components/sidebar";
import { createProjectNav } from "../src/components/projectNav";
import { sections } from "../src/data/sections";
import { projectsInSection } from "../src/data/projects/projects";

describe("phone menu", () => {
    let sidebar: HTMLElement;
    let toggle: HTMLButtonElement;

    beforeEach(() => {
        document.body.innerHTML = "";
        sidebar = createSidebar();
        document.body.appendChild(sidebar);
        toggle = sidebar.querySelector<HTMLButtonElement>(".menu-toggle")!;
    });

    it("starts closed and opens and closes with the button", () => {
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        toggle.click();
        expect(sidebar.classList.contains("menu-open")).toBe(true);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        toggle.click();
        expect(sidebar.classList.contains("menu-open")).toBe(false);
    });

    it("closes after choosing a page", () => {
        toggle.click();
        sidebar.querySelector<HTMLAnchorElement>(".nav-link")!.click();
        expect(sidebar.classList.contains("menu-open")).toBe(false);
    });

    it("closes with Escape", () => {
        toggle.click();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(sidebar.classList.contains("menu-open")).toBe(false);
    });

    it("keeps every page link inside the menu", () => {
        const menu = sidebar.querySelector(`#${toggle.getAttribute("aria-controls")}`)!;
        expect(menu.querySelectorAll(".nav-link").length).toBe(sections.length + 2);
        expect(menu.querySelector(".btn-email")).not.toBeNull();
    });
});

describe("project strip label", () => {
    const section = sections.find(s => projectsInSection(s.id).length > 0)!;

    it("says Jump to on section pages", () => {
        expect(createProjectNav(section).querySelector(".project-nav-label")?.textContent).toBe("Jump to");
    });

    it("says More in <section> on project pages", () => {
        const first = projectsInSection(section.id)[0];
        expect(createProjectNav(section, first.id).querySelector(".project-nav-label")?.textContent)
            .toBe(`More in ${section.title}`);
    });
});
