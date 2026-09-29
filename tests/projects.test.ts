import { describe, expect, it } from "vitest";
import { projects } from "../src/data/projects/projects";

describe("projects data", () => {
    it("has unique, URL-safe ids", () => {
        const ids = projects.map(project => project.id);
        expect(new Set(ids).size).toBe(ids.length);
        ids.forEach(id => expect(id).toMatch(/^[a-z0-9-]+$/));
    });

    it("gives every project a write-up", () => {
        projects.forEach(project => expect(project.content.trim()).not.toBe(""));
    });
});
