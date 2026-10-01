// Build and serve a local preview of the live or dev site.
//
//   npm run preview:live   the `live` branch, built exactly as it deploys (drafts hidden)
//   npm run preview:dev    your working copy, with drafts shown (what `dev` looks like)
//
// The live preview is built from a clean export of the branch (`git archive`), so it
// works from any branch and ignores uncommitted changes. Each uses its own port so
// both can run side by side.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";

const target = process.argv[2];
const configs = {
    live: { port: 4174, branch: "live", drafts: false },
    dev: { port: 4173, branch: null, drafts: true },
};
const config = configs[target];
if (!config) {
    console.error("Usage: node scripts/preview.mjs <live|dev>");
    process.exit(1);
}

const repo = process.cwd();
let root = repo;
if (config.branch) {
    root = resolve(repo, "node_modules/.cache/preview", config.branch);
    rmSync(root, { recursive: true, force: true });
    mkdirSync(root, { recursive: true });
    const archive = execFileSync("git", ["archive", "--format=tar", config.branch], { cwd: repo, maxBuffer: 1 << 30 });
    execFileSync("tar", ["-x", "-C", root], { input: archive });
    symlinkSync(resolve(repo, "node_modules"), resolve(root, "node_modules"), "dir");
    const commit = execFileSync("git", ["log", "-1", "--format=%h %s", config.branch], { cwd: repo }).toString().trim();
    console.log(`Previewing branch "${config.branch}" at ${commit}`);
}

const outDir = resolve(repo, "node_modules/.cache/preview", `dist-${target}`);
const vite = resolve(repo, "node_modules/.bin/vite");
const tsc = resolve(repo, "node_modules/.bin/tsc");
const env = { ...process.env, VITE_SHOW_DRAFTS: config.drafts ? "true" : "false" };

if (existsSync(resolve(root, "tsconfig.json"))) {
    execFileSync(tsc, [], { cwd: root, stdio: "inherit" });
}
execFileSync(vite, ["build", "--outDir", outDir, "--emptyOutDir"], { cwd: root, env, stdio: "inherit" });

console.log(`\n${target} preview${config.drafts ? " (drafts shown)" : ""}: http://localhost:${config.port}/\n`);
spawn(vite, ["preview", "--outDir", outDir, "--port", String(config.port), "--strictPort"], {
    cwd: root,
    env,
    stdio: "inherit",
}).on("exit", code => process.exit(code ?? 0));
