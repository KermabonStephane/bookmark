import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import preact from "@preact/preset-vite";
import manifest from "./public/manifest.json";
import { resolve } from "path";

// Resolve workspace packages from their TypeScript source directly,
// so we don't need to pre-build them before building the extension.
const workspacePackages: Record<string, string> = {
  "@bookmark/domain": resolve(__dirname, "../domain/src/index.ts"),
  "@bookmark/application": resolve(__dirname, "../application/src/index.ts"),
  "@bookmark/github-storage": resolve(__dirname, "../github-storage/src/index.ts"),
  "@bookmark/auth-google": resolve(__dirname, "../auth-google/src/index.ts"),
  "@bookmark/auth-email": resolve(__dirname, "../auth-email/src/index.ts"),
};

export default defineConfig({
  plugins: [
    preact(),
    crx({ manifest }),
  ],
  resolve: {
    alias: workspacePackages,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
