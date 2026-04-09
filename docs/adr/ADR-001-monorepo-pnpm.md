# ADR-001: Monorepo with pnpm workspaces

**Date**: 2026-04-09
**Status**: Accepted

## Context

The bookmark application has distinct layers (domain, application, adapters, UI) that must remain decoupled. The domain and application layers need to be reusable by future UIs (web app, mobile, CLI) without code duplication.

## Decision

Use a pnpm workspace monorepo. Each layer is a separate package (`@bookmark/domain`, `@bookmark/application`, etc.) with its own `package.json` and `tsconfig.json`.

## Consequences

**Positive:**
- Shared TypeScript and ESLint config across all packages.
- Atomic commits across layer boundaries.
- Local package linking via `workspace:*` — no publishing needed during development.
- Future UIs can declare `@bookmark/domain` and `@bookmark/application` as dependencies and immediately share the same domain model.

**Negative:**
- Build tooling is slightly more complex (need `vitest.workspace.ts`, per-package build scripts).
- Chrome Extension bundle must tree-shake aggressively — addressed by Vite's code splitting.
