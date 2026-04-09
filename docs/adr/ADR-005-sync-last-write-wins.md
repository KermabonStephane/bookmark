# ADR-005: Sync strategy — last-write-wins with conflict surfacing

**Date**: 2026-04-09
**Status**: Accepted

## Context

The Chrome Extension caches bookmarks locally in `chrome.storage.local` and syncs to GitHub. Conflicts can arise when the same bookmark is edited on two devices before either syncs.

## Decision

`updatedAt` timestamp comparison:
- If `remote.updatedAt > local.updatedAt` → remote wins, update local cache.
- If both changed since last sync → conflict. Surface in `SyncResult.conflicts` for user to resolve manually.

## Consequences

**Positive:**
- Simple to implement and reason about.
- Works correctly for single-user, single-device usage (the primary use case).

**Negative:**
- Timestamp drift across devices could cause incorrect resolution. Mitigated by always using UTC ISO 8601.
- Not suitable for collaborative multi-user editing.
- True conflict resolution UI is deferred to Phase 2.
