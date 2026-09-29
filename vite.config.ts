import { defineConfig } from "vitest/config";

export default defineConfig({
    // Served from the root of marcusgafka.com
    base: "/",
    test: {
        environment: "happy-dom",
    },
});
