import { beforeEach, describe, expect, it } from "vitest";
import { handleRoute, parseHash, resolveRoute } from "../src/router";
import { projects } from "../src/data/projects/projects";
import { sections } from "../src/data/sections";

describe("parseHash", () => {
    it("splits a hash into path segments", () => {
        expect(parseHash("#/wpi/rbe3002")).toEqual(["wpi", "rbe3002"]);
    });

    it("treats an empty hash as no segments", () => {
        expect(parseHash("")).toEqual([]);
        expect(parseHash("#/")).toEqual([]);
    });
});

describe("resolveRoute", () => {
    it("defaults to home", () => {
        expect(resolveRoute("").section).toBe("home");
    });

    it.each(sections.map(section => section.id))("renders the %s section page", id => {
        const route = resolveRoute(`#/${id}`);
        expect(route.section).toBe(id);
        expect(route.page.classList.contains("section-page")).toBe(true);
    });

    it("renders every project's detail page under its section", () => {
        for (const project of projects) {
            const route = resolveRoute(`#/${project.section}/${project.id}`);
            expect(route.section).toBe(project.section);
            expect(route.page.querySelector("h1")?.textContent).toBe(project.title);
        }
    });

    it("shows not found for a project under the wrong section", () => {
        const project = projects.find(p => p.section !== "work")!;
        expect(resolveRoute(`#/work/${project.id}`).page.classList.contains("not-found")).toBe(true);
    });

    it("shows not found for an unknown page", () => {
        expect(resolveRoute("#/nope").page.classList.contains("not-found")).toBe(true);
    });

    it("shows an empty state for a section with no projects", () => {
        const empty = sections.find(s => !projects.some(p => p.section === s.id));
        if (empty) {
            expect(resolveRoute(`#/${empty.id}`).page.querySelector(".empty-state")).not.toBeNull();
        }
    });
});

describe("handleRoute", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <a class="nav-link" data-section="home"></a>
            <a class="nav-link" data-section="wpi"></a>
            <main id="content"></main>
        `;
    });

    it("keeps the section highlighted on a project page", () => {
        window.location.hash = "#/wpi/rbe3002";
        handleRoute();

        expect(document.querySelector("#content .project-detail")).not.toBeNull();
        expect(document.querySelector('[data-section="wpi"]')?.classList.contains("active")).toBe(true);
        expect(document.querySelector('[data-section="home"]')?.classList.contains("active")).toBe(false);
    });
});

describe("section aliases", () => {
    it("forwards old #/190 links to #/robotics", () => {
        document.body.innerHTML = `<main id="content"></main>`;
        window.location.hash = "#/190/snapback";
        handleRoute();
        expect(window.location.hash).toBe("#/robotics/snapback");
    });
});
