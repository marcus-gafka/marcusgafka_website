/**
 * Click a photo in a write-up to see it full-size: a <dialog> with the image and
 * its caption. Closes on click anywhere, Escape, or the close button. Logos,
 * linked images, and clips are left alone.
 */
const ZOOMABLE = ".markdown-body figure:not(.logo):not(.logo-inline) img";

export function initLightbox(root: HTMLElement): void {
    let dialog: HTMLDialogElement | undefined;

    const open = (img: HTMLImageElement) => {
        if (!dialog) {
            dialog = document.createElement("dialog");
            dialog.className = "lightbox";
            dialog.innerHTML = `
                <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
                <figure><img alt="" /><figcaption></figcaption></figure>
            `;
            dialog.addEventListener("click", () => dialog!.close());
            document.body.appendChild(dialog);
        }
        const big = dialog.querySelector("img")!;
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        const caption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? "";
        const figcaption = dialog.querySelector("figcaption")!;
        figcaption.textContent = caption;
        figcaption.hidden = !caption;
        dialog.showModal();
    };

    root.addEventListener("click", event => {
        const img = (event.target as HTMLElement).closest<HTMLImageElement>(ZOOMABLE);
        if (!img || img.closest("a") || typeof HTMLDialogElement === "undefined") {
            return;
        }
        event.preventDefault();
        open(img);
    });
}
