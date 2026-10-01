import { defineConfig } from "vitest/config";

export default defineConfig({
    // Served from the root of marcusgafka.com
    base: "/",
    test: {
        environment: "happy-dom",
        // main.ts adds the GoatCounter <script>; don't try to fetch it in tests
        environmentOptions: {
            happyDOM: { settings: { disableJavaScriptFileLoading: true, handleDisabledFileLoadingAsSuccess: true } },
        },
    },
});
