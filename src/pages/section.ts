import { visibleTextPosts, type Section, type TextPost } from "../data/sections";
import { projectsInSection, type Project } from "../data/projects/projects";
import { createProjectNav } from "../components/projectNav";
import { createTechTags } from "../components/techTags";
import { createLinkList } from "../components/linkList";
import { renderMarkdown } from "../utils/markdown";
import { escapeHtml } from "../utils/html";

/**
 * A section as a blog: posts in the middle (grouped like the right panel, newest
 * first within each group), project thumbnails on the right. Text posts appear
 * only in the feed: at the top, at the start of their group, or before a given project.
 */
export function renderSection(section: Section): HTMLElement {
    const page = document.createElement("div");
    page.className = "section-page with-aside";

    const main = document.createElement("div");
    main.className = "main-column";
    main.innerHTML = `
        <header class="section-header">
            <div class="section-title-row">
                <h1>${escapeHtml(section.title)}</h1>
                ${section.logos?.length ? `<div class="section-logos">${section.logos
                    .map(logo => `<img src="${import.meta.env.BASE_URL}${logo.src}" alt="${escapeHtml(logo.alt)}" />`)
                    .join("")}</div>` : ""}
            </div>
            ${section.intro ? `<p class="subtitle">${escapeHtml(section.intro)}</p>` : ""}
        </header>
    `;
    const header = main.querySelector(".section-header")!;
    if (section.highlights?.length) {
        const list = document.createElement("ul");
        list.className = "section-highlights";
        list.innerHTML = section.highlights
            .map(h => `<li><strong>${escapeHtml(h.value)}</strong><span>${escapeHtml(h.label)}</span></li>`)
            .join("");
        header.appendChild(list);
    }
    if (section.links?.length) {
        header.appendChild(createLinkList(section.links));
    }
    page.appendChild(main);

    const projects = projectsInSection(section.id);
    const textPosts = visibleTextPosts(section);
    if (projects.length === 0 && textPosts.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Coming soon.";
        main.appendChild(empty);
        return page;
    }

    const feed = document.createElement("div");
    feed.className = "feed";
    textPosts.filter(post => !post.group).forEach(post => feed.appendChild(createTextPost(post)));

    if (section.groups) {
        for (const group of section.groups) {
            const groupPosts = textPosts.filter(post => post.group === group.id);
            const groupProjects = projects.filter(project => project.group === group.id);
            if (groupPosts.length === 0 && groupProjects.length === 0) {
                continue;
            }
            const heading = document.createElement("h2");
            heading.className = "feed-group-title";
            heading.textContent = group.title;
            feed.appendChild(heading);
            groupPosts.filter(post => !post.before).forEach(post => feed.appendChild(createTextPost(post)));
            groupProjects.forEach(project => {
                groupPosts.filter(post => post.before === project.id).forEach(post => feed.appendChild(createTextPost(post)));
                feed.appendChild(createPost(project));
            });
        }
    } else {
        projects.forEach(project => feed.appendChild(createPost(project)));
    }
    main.appendChild(feed);

    if (projects.length > 0) {
        page.appendChild(createProjectNav(section));
    }
    return page;
}

function createTextPost(textPost: TextPost): HTMLElement {
    const post = document.createElement("article");
    post.className = "post post-text";
    post.id = `note-${textPost.id}`;
    post.innerHTML = `<h2 class="post-title">${escapeHtml(textPost.title)}</h2>`;
    post.appendChild(renderMarkdown(textPost.body.trim() || "*Coming soon.*"));
    return post;
}

function createPost(project: Project): HTMLElement {
    const href = `#/${encodeURIComponent(project.section)}/${encodeURIComponent(project.id)}`;
    const meta = [project.date, project.role].filter(Boolean).map(value => escapeHtml(value!)).join(" · ");

    const post = document.createElement("article");
    post.className = "post";
    post.id = `post-${project.id}`;
    post.innerHTML = `
        ${project.image ? `
            <a class="post-image" href="${href}" tabindex="-1" aria-hidden="true">
                <img src="${import.meta.env.BASE_URL}${project.image}" alt="" loading="lazy" />
            </a>` : ""}
        <div class="post-body">
            ${meta ? `<span class="project-date">${meta}</span>` : ""}
            <h2 class="post-title"><a href="${href}">${escapeHtml(project.title)}</a></h2>
            <p class="post-summary">${escapeHtml(project.summary)}</p>
        </div>
    `;

    const body = post.querySelector(".post-body")!;
    if (project.technologies.length > 0) {
        body.appendChild(createTechTags(project.technologies));
    }
    const more = document.createElement("a");
    more.className = "read-more";
    more.href = href;
    more.innerHTML = `Read more <span aria-hidden="true">&rarr;</span>`;
    body.appendChild(more);

    return post;
}
