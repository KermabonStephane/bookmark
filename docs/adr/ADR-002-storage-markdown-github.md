# ADR-002: GitHub Markdown as first storage backend

**Date**: 2026-04-09
**Status**: Accepted

## Context

Need a storage backend that is free, version-controlled, accessible via API without a server, and human-readable.

## Decision

One `.md` file per bookmark with YAML frontmatter. An `index.json` manifest at the repo root enables fast enumeration and search without fetching every file individually. Uses GitHub REST API (no local git required).

## Consequences

**Positive:**
- Free tier. No server infrastructure needed.
- Human-readable, diff-able history via git.
- GitHub API is well-documented and stable.

**Negative:**
- Rate limit: 5000 requests/hour for authenticated users.
- Search is local/client-side (no server-side full-text). For large collections (10k+ bookmarks), the index.json manifest approach will need pagination.
- Two writes per bookmark mutation (update `.md` + update `index.json`). Mitigated by using GitHub's `sha`-based conflict detection.
