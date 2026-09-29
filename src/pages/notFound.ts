export function renderNotFound(): HTMLElement {
    const page = document.createElement("div");
    page.className = "not-found";
    page.innerHTML = `
        <h1>Page not found</h1>
        <p class="subtitle">That page doesn't exist.</p>
        <a class="btn btn-primary" href="#/">Back home</a>
    `;
    return page;
}
