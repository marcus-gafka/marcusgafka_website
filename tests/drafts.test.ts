import { describe, expect, it } from "vitest";
import { withoutDrafts } from "../src/utils/drafts";
import { allProjects } from "../src/data/projects/projects";

describe("withoutDrafts", () => {
    const items = [{ id: "done" }, { id: "todo", draft: true }];

    it("keeps drafts when showing drafts (local development)", () => {
        expect(withoutDrafts(items, i => !!i.draft, true).map(i => i.id)).toEqual(["done", "todo"]);
    });

    it("drops drafts for the live site", () => {
        expect(withoutDrafts(items, i => !!i.draft, false).map(i => i.id)).toEqual(["done"]);
    });
});

describe("live site content", () => {
    const live = withoutDrafts(allProjects, p => !!p.draft, false);

    it("still has finished projects", () => {
        expect(live.length).toBeGreaterThan(0);
        live.forEach(p => expect(p.content).not.toContain("Write-up coming soon"));
    });

    it("hides every placeholder", () => {
        allProjects.filter(p => p.content.includes("Write-up coming soon")).forEach(p => {
            expect(live, p.id).not.toContain(p);
        });
    });
});
