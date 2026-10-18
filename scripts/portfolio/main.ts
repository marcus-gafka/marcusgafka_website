// The portfolio PDF page: the live site's content (drafts hidden), laid out for print. Built by scripts/portfolio.mjs.
import { profile } from "../../src/data/profile";
import { sections, visibleTextPosts, type Section, type TextPost } from "../../src/data/sections";
import type { Link } from "../../src/data/types";
import { projectMeta, projectsInSection, type Project } from "../../src/data/projects/projects";
import { clipPoster, renderMarkdown, youTubeId } from "../../src/utils/markdown";
import { escapeHtml } from "../../src/utils/html";
import { projectHref } from "../../src/utils/urls";
import aboutMd from "../../src/data/about.md?raw";
import "./print.css";

const SITE = "https://marcusgafka.com";
// Page numbers found by an earlier render (see scripts/portfolio.mjs), passed back as ?pages={"id":n,...}
const params = new URLSearchParams(location.search);
const pages: Record<string, number> = JSON.parse(params.get("pages") || "{}");
// Image scale per project, from earlier renders that found it spilling onto a nearly empty page
const shrink: Record<string, number> = JSON.parse(params.get("shrink") || "{}");
// The final render leaves out the markers so they don't end up in the PDF's text
const final = params.has("final");

interface TocEntry { id: string; title: string; level: 1 | 2 | 3 }
const toc: TocEntry[] = [];  // level 2 = group heading, linked when a post stands in for it

const doc = document.getElementById("doc")!;

function el(html: string): HTMLElement {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild as HTMLElement;
}

/** Invisible text that pdftotext can find, to learn which page an entry landed on */
function marker(id: string): string {
    return final ? "" : `<span class="marker">@@P:${id}@@</span>`;
}

function shortUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function linkList(links: Link[]): string {
    return `<div class="links">${links.map(l =>
        `<a href="${escapeHtml(l.url)}"><span class="link-label">${escapeHtml(l.label)}</span></a>`).join("")}</div>`;
}

function tags(list: string[]): string {
    return list.length ? `<ul class="tags">${list.map(t => `<li>${escapeHtml(t)}</li>`).join("")}</ul>` : "";
}

/** The site's Markdown, adapted for paper: clips become their poster frames, YouTube players become linked thumbnails */
function body(md: string): HTMLElement {
    const root = renderMarkdown(md);
    root.querySelectorAll("img").forEach(img => img.removeAttribute("loading"));
    root.querySelectorAll<HTMLVideoElement>("figure.video-clip video").forEach(video => {
        const src = video.getAttribute("src") || "";
        const poster = video.getAttribute("poster") || clipPoster(src);
        const img = document.createElement("img");
        img.src = poster;
        img.alt = video.getAttribute("aria-label") || "";
        const figure = video.closest("figure")!;
        figure.classList.add("from-video");
        video.replaceWith(img);
    });
    root.querySelectorAll<HTMLIFrameElement>("figure.video-embed iframe").forEach(frame => {
        const id = youTubeId(frame.src.replace("youtube-nocookie.com/embed/", "youtube.com/embed/"));
        if (!id) return;
        const url = `https://www.youtube.com/watch?v=${id}`;
        frame.closest(".video-frame")!.replaceWith(el(
            `<a class="yt" href="${url}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span class="play"></span><span class="yt-url">${shortUrl(url)}</span></a>`));
    });
    return root;
}

function meta(project: Project): string {
    return escapeHtml(projectMeta(project));
}

// ---- Cover ----
doc.appendChild(el(`
<section class="cover">
    <div class="cover-photo"><img src="/${profile.headshot}" alt=""></div>
    <div class="cover-text">
        <p class="eyebrow">Engineering Portfolio</p>
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="cover-intro">${escapeHtml(profile.heroIntro)}</p>
        <ul class="cover-lines">${profile.heroLinks
            .filter(line => sections.some(s => s.id === line.section))
            .map(line => `<li>${escapeHtml(line.text)}</li>`).join("")}</ul>
        <div class="cover-contact">
            <a href="mailto:${profile.links.email}">${profile.links.email}</a>
            <a href="${SITE}">marcusgafka.com</a>
            <a href="${profile.links.linkedin}">${shortUrl(profile.links.linkedin)}</a>
            <a href="${profile.links.youtube}">${shortUrl(profile.links.youtube)}</a>
        </div>
        <p class="updated">Updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
    </div>
</section>`));

// ---- Contents (filled in once every entry is known) ----
const contents = doc.appendChild(el(`<section class="contents page"><h1>Contents</h1><ol class="toc"></ol></section>`));

// ---- About ----
toc.push({ id: "about", title: "About Me", level: 1 });
const about = doc.appendChild(el(`<section class="about page" id="about">${marker("about")}</section>`));
about.appendChild(body(aboutMd));

// ---- Sections, in sidebar order, posts grouped and ordered like the site feed ----
function textPost(post: TextPost, groupTitle: string): HTMLElement {
    const article = el(`<article class="text-post" id="note-${post.id}">${marker(`note-${post.id}`)}
        <h2 class="post-title">${escapeHtml(post.hideTitle ? groupTitle : post.title)}</h2></article>`);
    // A post titled by its group heading is listed under that heading instead of twice
    const heading = toc[toc.length - 1];
    if (post.hideTitle && heading?.level === 2 && !heading.id) heading.id = `note-${post.id}`;
    else toc.push({ id: `note-${post.id}`, title: post.hideTitle ? groupTitle : post.title, level: 3 });
    const b = article.appendChild(body(post.body));
    if (post.links?.length) b.insertAdjacentHTML("beforeend", linkList(post.links));
    return article;
}

function projectPage(project: Project, groupTitle?: string): HTMLElement {
    toc.push({ id: project.id, title: project.title, level: 3 });
    const page = el(`
<article class="project page" id="${project.id}">
    ${marker(project.id)}
    <header>
        ${groupTitle ? `<p class="eyebrow">${escapeHtml(groupTitle)}</p>` : ""}
        <h1>${escapeHtml(project.title)}</h1>
        <p class="meta">${meta(project)}${meta(project) ? " · " : ""}<a class="online" href="${SITE}/${projectHref(project)}">marcusgafka.com/${projectHref(project)}</a></p>
        <p class="summary">${escapeHtml(project.summary)}</p>
        ${tags(project.technologies)}
    </header>
</article>`);
    page.appendChild(body(project.content));
    if (project.links?.length) {
        page.insertAdjacentHTML("beforeend", `<footer class="project-links"><h3>Links</h3>${linkList(project.links)}</footer>`);
    }
    return page;
}

function renderSection(section: Section) {
    toc.push({ id: `section-${section.id}`, title: section.title, level: 1 });
    const intro = doc.appendChild(el(`
<section class="section-intro page" id="section-${section.id}">
    ${marker(`section-${section.id}`)}
    <div class="section-title-row">
        <h1>${escapeHtml(section.title)}</h1>
        ${section.logos?.map(l => `<img class="section-logo" src="/${l.src}" alt="${escapeHtml(l.alt)}">`).join("") ?? ""}
    </div>
    ${section.intro ? `<p class="subtitle">${escapeHtml(section.intro)}</p>` : ""}
    ${section.highlights?.length ? `<ul class="highlights">${section.highlights
        .map(h => `<li><strong>${escapeHtml(h.value)}</strong><span>${escapeHtml(h.label)}</span></li>`).join("")}</ul>` : ""}
</section>`));

    const projects = projectsInSection(section.id);
    const posts = visibleTextPosts(section);
    // Text posts sit on the section's opening page; each project gets its own page
    let onIntro = true;
    const add = (node: HTMLElement) => {
        if (onIntro && node.classList.contains("text-post")) intro.appendChild(node);
        else {
            // A section opening with no text posts shares its page with the first project
            if (onIntro && intro.children.length <= 3 && !intro.querySelector(".text-post")) node.classList.add("continue");
            onIntro = false;
            doc.appendChild(node);
        }
    };
    posts.filter(p => !p.group).forEach(p => add(textPost(p, "")));
    if (!section.groups) {
        projects.forEach(p => add(projectPage(p)));
        return;
    }
    for (const group of section.groups) {
        const groupPosts = posts.filter(p => p.group === group.id);
        const groupProjects = projects.filter(p => p.group === group.id);
        if (!groupPosts.length && !groupProjects.length) continue;
        toc.push({ id: "", title: group.title, level: 2 });
        groupPosts.filter(p => !p.before).forEach(p => add(textPost(p, group.title)));
        groupProjects.forEach(project => {
            groupPosts.filter(p => p.before === project.id).forEach(p => add(textPost(p, group.title)));
            add(projectPage(project, group.title));
        });
    }
}
sections.forEach(renderSection);

// ---- Fill the contents ----
const list = contents.querySelector(".toc")!;
for (const entry of toc) {
    const n = entry.id ? pages[entry.id] : undefined;
    list.insertAdjacentHTML("beforeend", entry.id
        ? `<li class="l${entry.level}"><a href="#${entry.id}"><span class="t">${escapeHtml(entry.title)}</span><span class="dots"></span><span class="n">${n ?? ""}</span></a></li>`
        : `<li class="l${entry.level}"><span class="t">${escapeHtml(entry.title)}</span></li>`);
}

// Tell the printer when every image has loaded
Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })))
    .then(() => document.fonts.ready)
    .then(fitProjects)
    .then(() => document.querySelectorAll<HTMLElement>(".project").forEach(project => {
        if (shrink[project.id]) project.style.setProperty("--s", String(shrink[project.id]));
        const s = project.style.getPropertyValue("--s") || "1";
        if (!final) project.insertAdjacentHTML("beforeend", `<span class="marker end">@@E:${project.id}:${s}@@</span>`);
    }))
    .then(() => document.body.setAttribute("data-ready", "1"));

/**
 * A project that runs just past one page shrinks its images until it fits,
 * rather than leaving a few stray lines on a page of their own.
 */
function fitProjects() {
    const pageHeight = 9.75 * 96 - 4;
    document.querySelectorAll<HTMLElement>(".project").forEach(project => {
        const extra = project.classList.contains("continue")
            ? project.getBoundingClientRect().top - (project.previousElementSibling as HTMLElement).getBoundingClientRect().top
            : 0;
        const height = () => project.getBoundingClientRect().height + extra;
        // Pages it would take, and the page count to aim for if the last one is mostly empty
        const pagesNeeded = Math.ceil(height() / pageHeight);
        const spill = height() - (pagesNeeded - 1) * pageHeight;
        if (pagesNeeded <= 1 || spill > pageHeight * 0.4) return;
        const target = (pagesNeeded - 1) * pageHeight - (pagesNeeded - 1) * 60;
        for (let s = 0.95; s >= 0.6 && height() > target; s -= 0.05) {
            project.style.setProperty("--s", s.toFixed(2));
        }
    });
}
