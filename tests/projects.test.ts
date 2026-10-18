import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { allProjects, projects, writeUpIds } from "../src/data/projects/projects";
import { sections } from "../src/data/sections";
import { profile } from "../src/data/profile";
import aboutMd from "../src/data/about.md?raw";

const publicDir = resolve(__dirname, "../public");

/** Site files a write-up points at: HTML src/poster attributes and Markdown images or clips */
function mediaPaths(markdown: string): string[] {
    return [
        ...[...markdown.matchAll(/\b(?:src|poster)="([^"]+)"/g)].map(match => match[1]),
        ...[...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map(match => match[1]),
    ].filter(path => !/^https?:/.test(path));
}

function expectInPublic(path: string, where: string) {
    expect(existsSync(resolve(publicDir, path.replace(/^\//, ""))), `${where}: ${path}`).toBe(true);
}

describe("sections data", () => {
    it("puts every text post in a real group", () => {
        for (const section of sections) {
            const groupIds = section.groups?.map(g => g.id) ?? [];
            section.textPosts?.forEach(post => {
                if (post.group) expect(groupIds, post.id).toContain(post.group);
                if (post.before) {
                    const target = projects.find(p => p.id === post.before);
                    expect(target?.section, post.id).toBe(section.id);
                    expect(target?.group, post.id).toBe(post.group);
                }
            });
        }
    });

    it("has unique, URL-safe ids that don't clash with fixed pages", () => {
        const ids = sections.map(section => section.id);
        expect(new Set(ids).size).toBe(ids.length);
        ids.forEach(id => {
            expect(id).toMatch(/^[a-z0-9-]+$/);
            expect(["home", "about", "resume"]).not.toContain(id);
        });
    });
});

describe("projects data", () => {
    it("has unique, URL-safe ids", () => {
        const ids = projects.map(project => project.id);
        expect(new Set(ids).size).toBe(ids.length);
        ids.forEach(id => expect(id).toMatch(/^[a-z0-9-]+$/));
    });

    it("puts every project in a real section", () => {
        const sectionIds = sections.map(section => section.id);
        projects.forEach(project => expect(sectionIds).toContain(project.section));
    });

    it("puts projects in grouped sections into a real group", () => {
        for (const project of projects) {
            const section = sections.find(s => s.id === project.section)!;
            if (section.groups) {
                expect(section.groups.map(g => g.id), project.id).toContain(project.group);
            } else {
                expect(project.group, project.id).toBeUndefined();
            }
        }
    });

    it("uses YYYY-MM sort dates", () => {
        projects.forEach(project => {
            if (project.sortDate) expect(project.sortDate, project.id).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        });
    });

    it("gives every finished project its own write-up folder", () => {
        projects.forEach(project => expect(project.content.trim()).not.toBe(""));
        allProjects.filter(project => !project.draft).forEach(project => expect(writeUpIds, project.id).toContain(project.id));
    });

    it("names every write-up folder after a project id", () => {
        const ids = allProjects.map(project => project.id);
        writeUpIds.forEach(id => expect(ids, `src/data/projects/${id}/`).toContain(id));
    });

    it("only references images and clips that exist", () => {
        for (const project of projects) {
            if (project.image) expectInPublic(project.image, project.id);
            mediaPaths(project.content).forEach(path => expectInPublic(path, project.id));
        }
    });
});

describe("site media", () => {
    it("has every file the sections, text posts, and profile point at", () => {
        for (const section of sections) {
            section.logos?.forEach(logo => expectInPublic(logo.src, section.id));
            section.textPosts?.forEach(post => mediaPaths(post.body).forEach(path => expectInPublic(path, post.id)));
        }
        mediaPaths(aboutMd).forEach(path => expectInPublic(path, "about"));
        [profile.headshot, profile.headshotSmall, profile.resumePdf, profile.portfolioPdf]
            .filter(Boolean)
            .forEach(path => expectInPublic(path, "profile"));
    });

    it("finds paths in every form a write-up uses", () => {
        const md = '<video src="/a.mp4" poster="/a-poster.jpg"></video>\n![Clip](/b.mp4)\n![Video](https://youtu.be/x)';
        expect(mediaPaths(md)).toEqual(["/a.mp4", "/a-poster.jpg", "/b.mp4"]);
    });
});
