import "./styles/main.css";
import "highlight.js/styles/github-dark.css";

import { createSidebar } from "./components/sidebar";
import { initRouter } from "./router";
import { initAnalytics } from "./utils/analytics";

const app = document.getElementById("app");

if (!app) {
    throw new Error("Missing #app element");
}

const layout = document.createElement("div");
layout.className = "layout";

const content = document.createElement("main");
content.id = "content";

layout.append(createSidebar(), content);
app.appendChild(layout);

initAnalytics();
initRouter();
