/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const backendApi = env.VITE_API_URL || "";
    const proxyTarget = backendApi ? backendApi.replace(/\/api\/?$/, "") : "";

    return {
        test: {
            environment: "jsdom",
            globals: true,
            setupFiles: "./src/test/setup.ts",
            exclude: ["**/node_modules/**", "**/dist/**", "tests/e2e/**"],
        },
        plugins: [
            react(),
            tailwindcss(),
            svgr({
                svgrOptions: {
                    icon: true,
                },
            }),
        ],
        define: {
            global: "globalThis",
        },
        server: {
            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                },
                "/storage": {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                }
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                "@/features": path.resolve(__dirname, "./src/features"),
                "@/shared": path.resolve(__dirname, "./src/shared"),
                "@/pages": path.resolve(__dirname, "./src/pages"),
                "@/config": path.resolve(__dirname, "./src/config"),
                "@/layouts": path.resolve(__dirname, "./src/layouts"),
                "@/routes": path.resolve(__dirname, "./src/routes"),
                react: path.resolve("./node_modules/react"),
                "react-dom": path.resolve("./node_modules/react-dom"),
            },
            mainFields: ["browser", "module", "main"],
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".svg"],
        },
        optimizeDeps: {
            exclude: ["lucide-react"],
        },
    };
});
