import { profile } from "../data/profile";

export function renderResume(): HTMLElement {
    const page = document.createElement("div");
    page.className = "resume-page";

    if (!profile.resumePdf) {
        page.innerHTML = `
            <h1>Resume</h1>
            <p class="subtitle">Resume available on request. Meanwhile, <a href="#/about">About Me</a> covers my education, experience, and skills.</p>
        `;
        return page;
    }

    const pdfUrl = `${import.meta.env.BASE_URL}${profile.resumePdf}`;

    page.innerHTML = `
        <div class="resume-header">
            <h1>Resume</h1>
            <a class="btn btn-primary" href="${pdfUrl}" download>Download PDF</a>
        </div>
        <object class="resume-embed" data="${pdfUrl}" type="application/pdf">
            <p>Your browser can't display the PDF inline. <a href="${pdfUrl}">Open it here</a>.</p>
        </object>
    `;

    return page;
}
