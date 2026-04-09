# ADR-003: Preact instead of React for Chrome Extension UI

**Date**: 2026-04-09
**Status**: Accepted

## Context

Chrome Extension popup bundles are served from a `chrome-extension://` origin. Smaller bundle size = faster popup open time. React + ReactDOM = ~45KB gzipped. Preact = ~4KB gzipped with an identical component API.

## Decision

Use Preact 10 with the `preact/compat` alias for any React-compatible libraries. JSX is compiled with `jsxImportSource: "preact"`.

## Consequences

**Positive:**
- Popup opens significantly faster (~10x smaller JS to parse).
- Extension passes Chrome Web Store size guidelines comfortably.
- Component code is identical to React — no learning curve.

**Negative:**
- Some React ecosystem libraries may not work with Preact's compat shim (must be individually vetted).
- Tooling (e.g., React DevTools) requires the Preact DevTools extension instead.
