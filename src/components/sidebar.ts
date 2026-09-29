import { profile } from "../data/profile";
import { createContactLinks } from "./contactLinks";

const navItems = [
    { section: "home", label: "Home", href: "#/" },
    { section: "projects", label: "Projects", href: "#/projects" },
    { section: "about", label: "About", href: "#/about" },
    { section: "resume", label: "Resume", href: "#/resume" },
];

export function createSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";

    const brand = document.createElement("a");
    brand.className = "brand";
    brand.href = "#/";
    brand.textContent = profile.name;

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
