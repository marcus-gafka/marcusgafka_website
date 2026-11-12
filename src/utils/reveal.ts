/**
 * Feed posts and cards fade/slide in as they scroll into view. Progressive: the
 * hidden starting state (.reveal) is only applied when IntersectionObserver
 * exists and motion is allowed, and anything already on screen shows at once.
 */
const SELECTOR = ".post, .project-pager";

let observer: IntersectionObserver | undefined;

export function observeReveals(root: HTMLElement): void {
    if (typeof IntersectionObserver === "undefined"
        || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
        return;
    }
    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer?.unobserve(entry.target);
            }
        }
    }, { rootMargin: "0px 0px -8% 0px" });

    root.querySelectorAll<HTMLElement>(SELECTOR).forEach(el => {
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight) {
            return; // already visible: no animation
        }
        el.classList.add("reveal");
        observer!.observe(el);
    });
}
