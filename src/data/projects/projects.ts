import exampleProject from "./example-project/ExampleProject.md?raw";

export interface Project {
    /** URL slug, e.g. #/projects/example-project */
    id: string;
    title: string;
    summary: string;
    date: string;
    technologies: string[];
    /** Markdown body shown on the project's detail page */
    content: string;
    githubUrl?: string;
    demoUrl?: string;
    /** Path under public/, e.g. "assets/projects/example.jpg" */
    image?: string;
    /** Shown on the home page */
    featured?: boolean;
}

// Projects appear on the site in this order.
export const projects: Project[] = [
    {
        id: "example-project",
        title: "Example Project",
        summary: "A placeholder project. Copy this entry and its folder to add your own.",
        date: "2026",
        technologies: ["TypeScript", "Vite"],
        content: exampleProject,
        githubUrl: "https://github.com/marcus-gafka",
        featured: true,
    },
];

export function findProject(id: string): Project | undefined {
    return projects.find(project => project.id === id);
}
