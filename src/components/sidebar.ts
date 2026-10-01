import { profile } from "../data/profile";
import { sections } from "../data/sections";
import { createContactLinks } from "./contactLinks";

const navItems = [
    { section: "home", label: "Home", href: "#/" },
    ...sections.map(section => ({ section: section.id, label: section.label, href: `#/${section.id}` })),
    { section: "about", label: "About Me", href: "#/about" },
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

    // On phones the nav and contact links collapse into a menu behind the ☰ button;
    // on larger screens the wrapper is transparent and the sidebar looks as before.
    const menu = document.createElement("div");
    menu.className = "sidebar-menu";
    menu.id = "sidebar-menu";
    menu.append(nav, createContactLinks());

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "menu-toggle";
    toggle.setAttribute("aria-controls", menu.id);
    toggle.innerHTML = `
        <svg class="icon-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        <svg class="icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    `;

    const setOpen = (open: boolean) => {
        sidebar.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    setOpen(false);

    toggle.addEventListener("click", () => setOpen(!sidebar.classList.contains("menu-open")));
    // Close after choosing a page, or with Escape.
    menu.addEventListener("click", event => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
    });
    window.addEventListener("hashchange", () => setOpen(false));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar.classList.contains("menu-open")) {
            setOpen(false);
            toggle.focus();
        }
    });

    sidebar.append(brand, toggle, menu);
    return sidebar;
}
