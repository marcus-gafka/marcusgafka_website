// Build a PDF portfolio from the site's content (what the live site shows: drafts hidden).
//
//   npm run portfolio               → planning/MarcusPortfolio_<M.D.YY>.pdf, plus the site's copy
//                                     (public/portfolio/, linked from About; commit it to publish)
//   npm run portfolio -- out.pdf    → out.pdf only
//
// The page itself is scripts/portfolio/ (index.html, main.ts, print.css). This builds
// it with Vite, prints it with headless Chrome, and re-prints until no project spills a
// few lines onto a nearly empty page (shrinking that project's images) and the contents
// has page numbers. Ghostscript then downsamples images to 220 dpi to keep it under 5 MB.
// Needs google-chrome, pdftotext (poppler-utils), and gs on the PATH.
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { build, preview } from "vite";

const repo = process.cwd();
const now = new Date();
const stamp = `${now.getMonth() + 1}.${now.getDate()}.${String(now.getFullYear()).slice(2)}`;
const out = resolve(process.argv[2] ?? `planning/MarcusPortfolio_${stamp}.pdf`);
// Keep in sync with profile.portfolioPdf
const siteCopy = process.argv[2] ? null : resolve(repo, "public/portfolio/Marcus_Gafka_Portfolio.pdf");
const cache = resolve(repo, "node_modules/.cache/portfolio");
const outDir = resolve(cache, "dist");
const draft = resolve(cache, "pass.pdf");
const port = 4187;

const config = {
    root: resolve(repo, "scripts/portfolio"),
    base: "/",
    publicDir: resolve(repo, "public"),
    logLevel: "warn",
    configFile: false,
    build: { outDir, emptyOutDir: true, chunkSizeWarningLimit: 5000 },
    preview: { port, strictPort: true },
};
mkdirSync(cache, { recursive: true });
await build(config);
const server = await preview(config);

// Async, so the preview server in this process can answer Chrome while it prints
async function print(params, file) {
    const url = `http://localhost:${port}/?${new URLSearchParams(params)}`;
    await promisify(execFile)("google-chrome", [
        "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=30000",
        "--run-all-compositor-stages-before-draw", `--print-to-pdf=${file}`, url,
    ]);
}

/**
 * Where each entry starts (from the page's @@P:id@@ markers), and a smaller image scale
 * for every project whose end marker (@@E:id:scale@@) landed in the top third of a later page.
 */
function analyze(file, shrink) {
    const xml = execFileSync("pdftotext", ["-bbox", file, "-"], { maxBuffer: 1 << 28 }).toString();
    const starts = {};
    let changed = false;
    xml.split("<page ").slice(1).forEach((page, i) => {
        const height = Number(page.match(/height="([\d.]+)"/)[1]);
        for (const [, y, word] of page.matchAll(/yMin="([\d.]+)"[^>]*>([^<]*)<\/word>/g)) {
            const start = word.match(/^@@P:([\w-]+)@@$/);
            const end = word.match(/^@@E:([\w-]+):([\d.]+)@@$/);
            if (start) starts[start[1]] ??= i + 1;
            if (end && (starts[end[1]] ?? i + 1) < i + 1 && Number(y) < height * 0.33 && Number(end[2]) > 0.55) {
                shrink[end[1]] = Math.round((Number(end[2]) - 0.06) * 100) / 100;
                changed = true;
            }
        }
    });
    return { starts, changed };
}

try {
    let pages = {};
    const shrink = {};
    for (let pass = 1; pass <= 6; pass++) {
        await print({ pages: JSON.stringify(pages), shrink: JSON.stringify(shrink) }, draft);
        const result = analyze(draft, shrink);
        pages = result.starts;
        if (!result.changed && pass > 1) break;
    }
    // Final render without the markers, so they don't end up in the PDF's text
    await print({ final: "1", pages: JSON.stringify(pages), shrink: JSON.stringify(shrink) }, draft);
    mkdirSync(dirname(out), { recursive: true });
    execFileSync("gs", [
        "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/printer",
        "-dDownsampleColorImages=true", "-dColorImageDownsampleType=/Bicubic", "-dColorImageResolution=220",
        "-dDownsampleGrayImages=true", "-dGrayImageResolution=220", "-dDetectDuplicateImages=true",
        `-sOutputFile=${out}`, draft,
    ]);
    const info = execFileSync("pdfinfo", [out]).toString();
    const count = info.match(/Pages:\s+(\d+)/)[1];
    const size = (Number(execFileSync("stat", ["-c", "%s", out]).toString()) / 1e6).toFixed(1);
    console.log(`Portfolio: ${out} (${count} pages, ${size} MB)`);
    if (siteCopy) {
        mkdirSync(dirname(siteCopy), { recursive: true });
        copyFileSync(out, siteCopy);
        console.log(`Site copy: ${siteCopy}`);
    }
} finally {
    await new Promise(done => server.httpServer.close(done));
    rmSync(draft, { force: true });
}
