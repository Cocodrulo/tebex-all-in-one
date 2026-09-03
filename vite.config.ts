// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            include: ["src"],
            entryRoot: "src",
        }),
    ],
    build: {
        lib: {
            entry: {
                react: resolve(__dirname, "src/react/index.ts"),
                angular: resolve(__dirname, "src/angular/index.ts"),
                webComponents: resolve(__dirname, "src/web-components/index.ts"),
            },
            formats: ["es", "cjs"],
            fileName: (format, entryName) =>
                `${entryName}/index.${format === "es" ? "mjs" : "cjs"}`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "@angular/core", "@angular/common"],
            output: {
                preserveModules: false,
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
