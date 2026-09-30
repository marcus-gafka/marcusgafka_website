import { beforeEach, describe, expect, it } from "vitest";
import { renderSection } from "../src/pages/section";
import { renderProjectDetail } from "../src/pages/projectDetail";
import { projectsInSection, sortNewestFirst, type Project } from "../src/data/projects/projects";
import { sections } from "../src/data/sections";

const withProjects = sections.filter(section => projectsInSection(section.id).length > 0);

/** Feed order: by group (in the section's group order), newest first within each */
function expectedOrder(sectionId: string): string[] {
    const section = sections.find(s => s.id === sectionId)!;
    const list = projectsInSection(sectionId);
    const ordered = section.groups
        ? section.groups.flatMap(group => list.filter(p => p.group === group.id))
        : list;
    return ordered.map(p => `post-${p.id}`);
}

describe("sortNewestFirst", () => {
    it("orders by date descending and puts undated projects last", () => {
        const make = (id: string, sortDate?: string) => ({ id, sortDate }) as Project;
        const sorted = sortNewestFirst([make("a"), make("b", "2024-01"), make("c", "2025-06"), make("d")]);
        expect(sorted.map(p => p.id)).toEqual(["c", "b", "a", "d"]);
    });
});

describe("section page", () => {
    it.each(withProjects.map(s => s.id))("%s shows one post per project, grouped and newest first", id => {
        const page = renderSection(sections.find(s => s.id === id)!);
        const postIds = [...page.querySelectorAll(".post:not(.post-text)")].map(post => post.id);
        expect(postIds).toEqual(expectedOrder(id));
    });

    it("shows text posts in the feed but not in the right panel", () => {
        for (const section of sections.filter(s => s.textPosts?.length)) {
            const page = renderSection(section);
            section.textPosts!.forEach(post => {
                const el = page.querySelector(`#note-${post.id}`);
                expect(el, post.id).not.toBeNull();
                expect(page.querySelector(".project-nav")?.textContent).not.toContain(post.title);
            });
        }
    });

    it("puts a text post with `before` directly ahead of that project's post", () => {
        for (const section of sections) {
            for (const post of section.textPosts?.filter(p => p.before) ?? []) {
                const next = renderSection(section).querySelector(`#note-${post.id}`)!.nextElementSibling;
                expect(next?.id, post.id).toBe(`post-${post.before}`);
            }
        }
    });

    it("puts a grouped text post right after its group heading", () => {
        for (const section of sections.filter(s => s.textPosts?.some(p => p.group))) {
            const page = renderSection(section);
            for (const post of section.textPosts!.filter(p => p.group && !p.before)) {
                const group = section.groups!.find(g => g.id === post.group)!;
                const prev = page.querySelector(`#note-${post.id}`)!.previousElementSibling;
                expect(prev?.textContent).toBe(group.title);
            }
        }
    });

    it("links each post's image and title to the project page", () => {
        const section = withProjects[0];
        const project = projectsInSection(section.id)[0];
        const post = renderSection(section).querySelector(`#post-${project.id}`)!;
        const href = `#/${section.id}/${project.id}`;
        expect(post.querySelector(".post-title a")?.getAttribute("href")).toBe(href);
        if (project.image) {
            expect(post.querySelector(".post-image")?.getAttribute("href")).toBe(href);
        }
    });

    it("groups the right panel using the section's groups", () => {
        const section = sections.find(s => s.id === "robotics")!;
        const headings = [...renderSection(section).querySelectorAll(".project-nav h3")].map(h => h.textContent);
        const withProjectsInGroup = section.groups!.filter(g => projectsInSection(section.id).some(p => p.group === g.id));
        expect(headings).toEqual(withProjectsInGroup.map(g => g.title));
    });

    describe("right panel click", () => {
        beforeEach(() => {
            document.body.innerHTML = "";
        });

        it("scrolls to the post instead of navigating", () => {
            const section = withProjects[0];
            const project = projectsInSection(section.id)[0];
            document.body.appendChild(renderSection(section));

            const link = document.querySelector<HTMLAnchorElement>(`.project-nav a[href="#/${section.id}/${project.id}"]`)!;
            const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
            link.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(true);
            expect(document.getElementById(`post-${project.id}`)?.classList.contains("post-highlight")).toBe(true);
        });
    });
});

describe("project page", () => {
    it("keeps the right panel and highlights the current project", () => {
        const section = withProjects[0];
        const [first, second] = projectsInSection(section.id);
        const page = renderProjectDetail(first, section);

        const active = page.querySelectorAll(".project-nav-item.active");
        expect(active).toHaveLength(1);
        expect(active[0].getAttribute("href")).toBe(`#/${section.id}/${first.id}`);
        if (second) {
            expect(page.querySelector(`.project-nav a[href="#/${section.id}/${second.id}"]`)).not.toBeNull();
        }
    });
});

describe("section highlights", () => {
    it("renders the WPI hero facts as cards", () => {
        const wpi = sections.find(s => s.id === "wpi")!;
        const cards = renderSection(wpi).querySelectorAll(".section-highlights li");
        expect(cards).toHaveLength(wpi.highlights!.length);
        expect(cards[0].querySelector("strong")?.textContent).toBe(wpi.highlights![0].value);
    });

    it("omits the intro paragraph when a section has none", () => {
        const wpi = sections.find(s => s.id === "wpi")!;
        expect(wpi.intro).toBe("");
        expect(renderSection(wpi).querySelector(".section-header .subtitle")).toBeNull();
    });

    it("shows WPI groups in order: honor society, current, completed", () => {
        const wpi = sections.find(s => s.id === "wpi")!;
        expect(wpi.groups!.map(g => g.id)).toEqual(["honor-society", "current", "completed"]);
    });
});
