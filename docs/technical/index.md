# Technical Documentation

## Architecture

See [PLAN.md](../../PLAN.md) for the full architecture diagram and decision log.

The system uses Hexagonal Architecture (Ports and Adapters):

```
chrome-extension   →   application (use cases)   →   domain
github-storage     →   application (StoragePort)
auth-google        →   application (AuthPort)
auth-email         →   application (AuthPort)
```

## Package Dependencies

```
@bookmark/domain           (no deps)
@bookmark/application      → @bookmark/domain
@bookmark/github-storage   → @bookmark/application, @bookmark/domain, gray-matter
@bookmark/auth-google      → @bookmark/application
@bookmark/auth-email       → @bookmark/application
@bookmark/chrome-extension → all of the above
```

## Data Model

### Bookmark (Markdown file)

Stored as `bookmarks/collections/{path}/{id}.md` or `bookmarks/uncategorized/{id}.md`.

```markdown
---
id: "uuid-v4"
url: "https://example.com"
title: "Page Title"
tags: ["tag1", "tag2"]
collection: "dev/typescript"
favicon_url: "https://example.com/favicon.ico"
created_at: "2026-01-01T00:00:00Z"
updated_at: "2026-04-09T12:00:00Z"
---

## Description
Optional short description.

## Notes
Free-form markdown notes.
```

### Index Manifest (`bookmarks/index.json`)

```json
[
  {
    "id": "uuid",
    "url": "https://example.com",
    "title": "Page Title",
    "tags": ["tag1"],
    "collection": "dev/typescript",
    "updatedAt": "2026-04-09T12:00:00Z",
    "sha": "github-file-sha",
    "path": "bookmarks/collections/dev/typescript/uuid.md"
  }
]
```

## Chrome Extension Entry Points

| File | Role |
|---|---|
| `src/background/background.ts` | Service worker: sync scheduler, message handler |
| `src/popup/popup.ts` | Popup entry: QuickSave + Search |
| `src/options/options.ts` | Options page: GitHub config, auth, sync |
| `src/content/content.ts` | Content script: page metadata extraction |
| `src/composition/container.ts` | Composition root: wires all adapters + use cases |

## Configuration

Stored in `chrome.storage.local` under `bm_config`:

```typescript
{
  github: {
    owner: string,
    repo: string,
    pat: string,
    branch: string  // default: "main"
  },
  googleClientId: string,
  firebaseApiKey: string
}
```

## Security Notes

- GitHub PAT stored in `chrome.storage.local` (not `sync` — not uploaded to Google).
- Auth tokens stored in `chrome.storage.local`.
- Phase 2: evaluate `SubtleCrypto` for at-rest encryption of sensitive values.
