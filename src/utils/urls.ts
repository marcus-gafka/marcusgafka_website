/** "wpi" -> "#/wpi" */
export function sectionHref(sectionId: string): string {
    return `#/${encodeURIComponent(sectionId)}`;
}

/** A project's page, e.g. "#/wpi/rbe3002" */
export function projectHref(project: { section: string; id: string }): string {
    return `${sectionHref(project.section)}/${encodeURIComponent(project.id)}`;
}

/** A file under public/, e.g. "assets/profile/headshot.jpg", as a URL on the site */
export function assetUrl(path: string): string {
    return `${import.meta.env.BASE_URL}${path}`;
}
