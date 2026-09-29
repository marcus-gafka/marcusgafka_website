import { profile } from "../data/profile";

export function renderResume(): HTMLElement {
    const page = document.createElement("div");
    page.className = "resume-page";

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
