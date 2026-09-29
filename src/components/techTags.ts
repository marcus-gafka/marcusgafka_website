export function createTechTags(technologies: string[]): HTMLElement {
    const list = document.createElement("ul");
    list.className = "tech-tags";
    for (const tech of technologies) {
        const item = document.createElement("li");
        item.textContent = tech;
        list.appendChild(item);
    }
    return list;
}
