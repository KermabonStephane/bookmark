# ADR-007: index.json manifest for fast bookmark listing

**Date**: 2026-04-09
**Status**: Accepted

## Context

The GitHub REST API returns file contents one file at a time. Fetching every `.md` file on popup open is impractical: O(n) API calls, slow, wastes rate limit budget.

## Decision

Maintain a `bookmarks/index.json` file at the repo root containing a lightweight record per bookmark:

```json
{
  "id": "uuid",
  "url": "https://...",
  "title": "...",
  "tags": ["..."],
  "collection": "dev/typescript",
  "updatedAt": "ISO timestamp",
  "sha": "github-file-sha",
  "path": "bookmarks/collections/dev/typescript/uuid.md"
}
```

All list and search operations use this index (single API call). Full `.md` files are fetched only when viewing or editing a specific bookmark's notes field.

## Consequences

**Positive:**
- Popup search is fast regardless of collection size (single API call to fetch index).
- The `sha` field doubles as a quick-access cache for write operations (no extra GET needed).

**Negative:**
- Every bookmark write requires two API calls: update the `.md` file AND update `index.json`.
- Race condition risk: two concurrent devices writing `index.json` simultaneously will cause a GitHub 409 conflict (stale sha). The adapter surfaces this as a `ConflictError` to be retried.
