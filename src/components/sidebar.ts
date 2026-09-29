import { profile } from "../data/profile";
import { sections } from "../data/sections";
import { createContactLinks } from "./contactLinks";

const navItems = [
    { section: "home", label: "Home", href: "#/" },
    ...sections.map(section => ({ section: section.id, label: section.label, href: `#/${section.id}` })),
    { section: "about", label: "About", href: "#/about" },
];

export function createSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";

    const brand = document.createElement("a");
    brand.className = "brand";
    brand.href = "#/";
    brand.innerHTML = `
        <picture>
            <source media="(max-width: 760px)" srcset="${import.meta.env.BASE_URL}${profile.headshotSmall}" />
            <img class="headshot" src="${import.meta.env.BASE_URL}${profile.headshot}" alt="" />
        </picture>
        <span class="brand-name"></span>
    `;
    brand.querySelector(".brand-name")!.textContent = profile.name;

    const nav = document.createElement("nav");
    for (const item of navItems) {
        const link = document.createElement("a");
        link.className = "nav-link";
        link.href = item.href;
        link.dataset.section = item.section;
        link.textContent = item.label;
        nav.appendChild(link);
    }

    sidebar.append(brand, nav, createContactLinks());
    return sidebar;
}
