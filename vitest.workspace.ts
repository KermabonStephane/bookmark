import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/domain/vitest.config.ts",
  "packages/application/vitest.config.ts",
  "packages/github-storage/vitest.config.ts",
]);
