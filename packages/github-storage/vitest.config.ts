import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "github-storage",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
