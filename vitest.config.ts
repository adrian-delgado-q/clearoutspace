import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // mirrors the "@/*": ["./*"] path mapping in tsconfig.json
            "@": resolve(__dirname, "."),
        },
    },
    test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./tests/setup.tsx"],
        include: ["tests/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
        },
    },
});
