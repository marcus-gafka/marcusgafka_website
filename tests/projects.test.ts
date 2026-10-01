import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "../src/data/projects/projects";
import { sections } from "../src/data/sections";

const publicDir = resolve(__dirname, "../public");

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

    it("gives every project a write-up", () => {
        projects.forEach(project => expect(project.content.trim()).not.toBe(""));
    });

    it("only references images that exist", () => {
        for (const project of projects) {
            const paths = [
                ...(project.image ? [`/${project.image}`] : []),
                ...[...project.content.matchAll(/src="([^"]+)"/g)].map(match => match[1]),
            ];
            paths.forEach(path => expect(existsSync(`${publicDir}${path}`), `${project.id}: ${path}`).toBe(true));
        }
    });
});
