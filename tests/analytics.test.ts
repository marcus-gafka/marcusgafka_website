import { afterEach, describe, expect, it, vi } from "vitest";
import { initAnalytics, pathFromHash, trackPageView } from "../src/utils/analytics";

afterEach(() => {
    delete window.goatcounter;
    document.head.innerHTML = "";
    window.location.hash = "";
});

describe("pathFromHash", () => {
    it("turns hash routes into paths", () => {
        expect(pathFromHash("#/wpi/rbe3002")).toBe("/wpi/rbe3002");
        expect(pathFromHash("#/")).toBe("/");
        expect(pathFromHash("")).toBe("/");
    });
});

describe("initAnalytics", () => {
    it("does nothing without a code", () => {
        initAnalytics("");
        expect(document.querySelector("script[data-goatcounter]")).toBeNull();
        expect(window.goatcounter).toBeUndefined();
    });

    it("loads the script for the given site with automatic counting off", () => {
        initAnalytics("example");
        const script = document.querySelector<HTMLScriptElement>("script[data-goatcounter]");
        expect(script?.dataset.goatcounter).toBe("https://example.goatcounter.com/count");
        expect(window.goatcounter?.no_onload).toBe(true);
    });
});

describe("trackPageView", () => {
    it("reports the current route as a path", () => {
        const count = vi.fn();
        window.goatcounter = { count };
        window.location.hash = "#/190/snapback";
        trackPageView();
        expect(count).toHaveBeenCalledWith(expect.objectContaining({ path: "/190/snapback" }));
    });

    it("is safe before the script has loaded", () => {
        expect(() => trackPageView()).not.toThrow();
    });
});
