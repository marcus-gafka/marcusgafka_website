/** The tag pills, or null when there are none (so no empty list is added) */
export function createTechTags(technologies: string[]): HTMLElement | null {
    if (technologies.length === 0) {
        return null;
    }
    const list = document.createElement("ul");
    list.className = "tech-tags";
    for (const tech of technologies) {
        const item = document.createElement("li");
        item.textContent = tech;
        list.appendChild(item);
    }
    return list;
}
