// Renders scripts/og/og-image.html with headless Chrome → public/og-image.jpg (the link-preview card).
// Run after changing the card: `node scripts/og-image.mjs`. Needs google-chrome and Python with Pillow
// (pass its path as OG_PYTHON, e.g. a scratch venv) to convert the PNG screenshot to a JPEG.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const tmp = mkdtempSync(join(tmpdir(), "og-"));
const png = join(tmp, "og.png");
const out = join(root, "public/og-image.jpg");
try {
    execFileSync("google-chrome", [
        "--headless=new", `--user-data-dir=${join(tmp, "profile")}`, "--disable-gpu", "--hide-scrollbars",
        "--allow-file-access-from-files", "--window-size=1200,630", "--timeout=2000",
        `--screenshot=${png}`, pathToFileURL(join(root, "scripts/og/og-image.html")).href,
    ], { stdio: "ignore" });
    execFileSync(process.env.OG_PYTHON || "python3", ["-c",
        "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=88)",
        png, out]);
    console.log(`Wrote ${out}`);
} finally {
    rmSync(tmp, { recursive: true, force: true });
}
