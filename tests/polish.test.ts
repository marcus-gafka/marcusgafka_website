import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { renderProjectDetail, createPager } from "../src/pages/projectDetail";
import { renderSection } from "../src/pages/section";
import { createProjectCard } from "../src/components/projectCard";
import { allProjects, findProject, projectsInSection } from "../src/data/projects/projects";
import { findSection, sections } from "../src/data/sections";

const robotics = findSection("robotics")!;
const snapback = findProject("robotics", "snapback")!;

describe("project spec sheet", () => {
    it("shows role and tools, but not the result", () => {
        const page = renderProjectDetail(snapback, robotics);
        const labels = [...page.querySelectorAll(".spec-sheet dt")].map(dt => dt.textContent);
        expect(labels).toEqual(["Role", "Tools"]);
        expect(page.querySelector(".spec-sheet")!.textContent).not.toContain(snapback.result!);
    });

    it("tags the page heading for the title morph", () => {
        const h1 = renderProjectDetail(snapback, robotics).querySelector("h1")!;
        expect(h1.dataset.projectTitle).toBe("snapback");
    });
});

describe("prev/next pager", () => {
    it("links neighbours in feed order and nothing past the ends", () => {
        for (const section of sections) {
            const list = projectsInSection(section.id);
            if (list.length < 2) continue;
            const first = createPager(list[0], section)!;
            expect(first.querySelector(".pager-prev")).toBeNull();
            expect(first.querySelector(".pager-next")!.getAttribute("href")).toContain(list[1].id);
            const last = createPager(list[list.length - 1], section)!;
            expect(last.querySelector(".pager-next")).toBeNull();
        }
    });
});

describe("results on cards", () => {
    it("shows a project's result on its card and feed post", () => {
        expect(createProjectCard(snapback).querySelector(".project-result")!.textContent).toBe(snapback.result);
        const post = renderSection(robotics).querySelector("#post-snapback")!;
        expect(post.querySelector(".project-result")!.textContent).toBe(snapback.result);
    });

    it("omits the line when there's no result", () => {
        const plain = allProjects.find(p => !p.result)!;
        expect(createProjectCard(plain).querySelector(".project-result")).toBeNull();
    });
});

describe("card logos", () => {
    it("every cardLogo file exists and shows on a backdrop", () => {
        for (const project of allProjects.filter(p => p.cardLogo)) {
            expect(existsSync(resolve("public", project.cardLogo!)), project.cardLogo).toBe(true);
            expect(createProjectCard(project).querySelector("img.is-logo")).not.toBeNull();
        }
    });
});

describe("link previews", () => {
    it("index.html points og:image and twitter:image at the card in public/", async () => {
        const { readFileSync } = await import("node:fs");
        const html = readFileSync(resolve("index.html"), "utf8");
        for (const tag of ['property="og:image"', 'name="twitter:image"']) {
            const match = html.match(new RegExp(`${tag} content="https://marcusgafka\\.com/([^"]+)"`));
            expect(match, tag).not.toBeNull();
            expect(existsSync(resolve("public", match![1])), match![1]).toBe(true);
        }
        expect(html).toContain('name="twitter:card" content="summary_large_image"');
    });
});
