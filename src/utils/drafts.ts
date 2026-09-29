/**
 * Drafts (placeholder projects and empty paragraph posts) show while working
 * locally (`npm run dev`) and are hidden in the production build that deploys
 * to the live site. Build with VITE_SHOW_DRAFTS=true to include them anyway.
 */
export const SHOW_DRAFTS: boolean = import.meta.env.DEV || import.meta.env.VITE_SHOW_DRAFTS === "true";

export function withoutDrafts<T>(items: T[], isDraft: (item: T) => boolean, showDrafts = SHOW_DRAFTS): T[] {
    return showDrafts ? items : items.filter(item => !isDraft(item));
}
