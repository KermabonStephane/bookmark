# ADR-006: Chrome Extension Manifest V3 with Service Worker

**Date**: 2026-04-09
**Status**: Accepted

## Context

Manifest V2 background pages were deprecated and unsupported in Chrome from mid-2024. All new and updated extensions must use Manifest V3.

## Decision

Target Manifest V3 exclusively. Background logic runs in a service worker (`background.ts`). All persistent state is stored in `chrome.storage.local` before the service worker may be terminated.

## Consequences

**Positive:**
- Future-proof. Passes Chrome Web Store review without MV2 deprecation warnings.
- Service workers use less memory than persistent background pages.

**Negative:**
- Service workers are terminated when idle (typically after 30 seconds of inactivity). All state that must survive termination must be explicitly persisted to `chrome.storage.local` after every mutation.
- Long-running operations (e.g., syncing 1000 bookmarks) must be designed to survive service worker termination — implemented by checkpointing progress in `chrome.storage.local`.
