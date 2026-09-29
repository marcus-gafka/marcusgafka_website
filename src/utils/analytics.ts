import { profile } from "../data/profile";

interface GoatCounter {
    no_onload?: boolean;
    count?: (vars: { path: string; title?: string }) => void;
}

declare global {
    interface Window {
        goatcounter?: GoatCounter;
    }
}

/** "#/wpi/rbe3002" -> "/wpi/rbe3002"; no hash -> "/" */
export function pathFromHash(hash: string): string {
    const path = hash.replace(/^#/, "");
    return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Loads GoatCounter. Pages change by hash without reloading, so automatic
 * counting is turned off and every route change is reported by trackPageView.
 */
export function initAnalytics(code = profile.goatcounterCode): void {
    if (!code || window.goatcounter) {
        return;
    }
    window.goatcounter = { no_onload: true };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    // The first page view happened before the script loaded, so count it now.
    script.addEventListener("load", () => trackPageView());
    document.head.appendChild(script);
}

/** Reports the current page. Does nothing until GoatCounter has loaded. */
export function trackPageView(): void {
    window.goatcounter?.count?.({
        path: pathFromHash(window.location.hash),
        title: document.title,
    });
}
