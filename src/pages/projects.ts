import { projects } from "../data/projects/projects";
import { createProjectCard } from "../components/projectCard";

export function renderProjects(): HTMLElement {
    const page = document.createElement("div");
    page.className = "projects-page";
    page.innerHTML = `<h1>Projects</h1>`;

    const grid = document.createElement("div");
    grid.className = "project-grid";
    projects.forEach(project => grid.appendChild(createProjectCard(project)));

    page.appendChild(grid);
    return page;
}
