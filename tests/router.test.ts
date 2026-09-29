import { beforeEach, describe, expect, it } from "vitest";
import { handleRoute, parseHash, resolveRoute } from "../src/router";
import { projects } from "../src/data/projects/projects";

describe("parseHash", () => {
    it("splits a hash into path segments", () => {
        expect(parseHash("#/projects/example-project")).toEqual(["projects", "example-project"]);
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

    it("renders a project detail page by id", () => {
        const project = projects[0];
        const route = resolveRoute(`#/projects/${project.id}`);
        expect(route.section).toBe("projects");
        expect(route.page.querySelector("h1")?.textContent).toBe(project.title);
    });

    it("shows not found for an unknown project", () => {
        const route = resolveRoute("#/projects/does-not-exist");
        expect(route.page.classList.contains("not-found")).toBe(true);
    });

    it("shows not found for an unknown page", () => {
        expect(resolveRoute("#/nope").page.classList.contains("not-found")).toBe(true);
    });
});

describe("handleRoute", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <a class="nav-link" data-section="home"></a>
            <a class="nav-link" data-section="about"></a>
            <main id="content"></main>
        `;
    });

    it("mounts the page and highlights the active nav link", () => {
        window.location.hash = "#/about";
        handleRoute();

        expect(document.querySelector("#content .about-page")).not.toBeNull();
        expect(document.querySelector('[data-section="about"]')?.classList.contains("active")).toBe(true);
        expect(document.querySelector('[data-section="home"]')?.classList.contains("active")).toBe(false);
    });
});
