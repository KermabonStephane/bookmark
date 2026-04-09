# Bookmark Application — Implementation Plan

## Core Concept

A pluggable bookmark management system with three independently swappable layers:

- **Storage layer**: Pluggable backends via `StoragePort`. First implementation: Markdown files in a GitHub repository.
- **UI layer**: Pluggable frontends. First implementation: Chrome Extension (TypeScript + Preact).
- **Auth layer**: Pluggable auth via `AuthPort`. First implementations: Google OAuth and Email/Password.

---

## 1. Architecture Diagram

```
+------------------------------------------------------------------+
|                        INTERFACE LAYER                           |
|  +------------------------+   +--------------------------------+ |
|  |  Chrome Extension UI   |   |  (Future: Web App / Mobile)   | |
|  |  - Popup               |   |                                | |
|  |  - Options Page        |   |                                | |
|  |  - Background Worker   |   |                                | |
|  +----------+-------------+   +---------------+----------------+ |
+-------------|----------------------------------|------------------+
              |  calls                          |  calls
+------------------------------------------------------------------+
|                       APPLICATION LAYER                          |
|                  (Use Cases / Inbound Ports)                     |
|                                                                  |
|  SaveBookmarkUseCase       SearchBookmarksUseCase                |
|  DeleteBookmarkUseCase     ListCollectionsUseCase                |
|  UpdateBookmarkUseCase     SyncUseCase                           |
|  AuthenticateUseCase       ImportBookmarksUseCase                |
|                                                                  |
|  +-----------+   +------------+   +-----------+                 |
|  | StoragePort|  |  AuthPort  |   |  SyncPort |  (Outbound)    |
|  +-----------+   +------------+   +-----------+                 |
+---|----------------|----------------|---------------------------+
    |                |                |  implemented by
+------------------------------------------------------------------+
|                    INFRASTRUCTURE LAYER                          |
|                        (Adapters)                                |
|                                                                  |
|  +----------------------+  +------------------+                  |
|  | GitHubMarkdownAdapter|  | GoogleAuthAdapter|                  |
|  | (StoragePort impl)   |  | (AuthPort impl)  |                  |
|  +----------------------+  +------------------+                  |
|  +----------------------+  +------------------+                  |
|  | ChromeStorageCache   |  | EmailPasswordAuth|                  |
|  | (local cache/sync)   |  | Adapter          |                  |
|  +----------------------+  +------------------+                  |
|                                                                  |
|           (Future: NotionAdapter, SQLiteAdapter)                 |
+------------------------------------------------------------------+
|                        DOMAIN LAYER                              |
|                  (Entities & Value Objects)                      |
|                                                                  |
|  Bookmark         Collection         Tag                         |
|  BookmarkId       BookmarkUrl        TagName                     |
|  BookmarkTitle    FaviconUrl         CollectionPath              |
+------------------------------------------------------------------+
```

**Dependency rule**: Domain has zero imports. Application imports only Domain. Infrastructure imports Application + Domain. Interface imports Application only.

---

## 2. Domain Model

### Entities

**Bookmark** (aggregate root)
- `id: BookmarkId` — UUID v4
- `url: BookmarkUrl` — validated http/https URL
- `title: BookmarkTitle` — non-empty, max 500 chars
- `description: string`
- `notes: string` — markdown body
- `tags: Tag[]`
- `collection: CollectionPath` — slash-separated path (e.g. `dev/typescript`)
- `faviconUrl: FaviconUrl | null`
- `createdAt: Date`, `updatedAt: Date`

**Collection** — `path`, `name`, `parentPath`, `createdAt`

**Tag** — `name: TagName` (lowercase, alphanumeric + hyphens), `color: string | null`

### Value Objects

| Value Object   | Invariants                                       |
|----------------|--------------------------------------------------|
| BookmarkId     | Valid UUID v4                                    |
| BookmarkUrl    | Valid URL, http/https only                       |
| BookmarkTitle  | Non-empty, max 500 chars                         |
| TagName        | Lowercase, alphanumeric + hyphens, max 50 chars  |
| CollectionPath | Slash-separated, no leading/trailing slashes     |
| FaviconUrl     | Valid URL or null                                |

All value objects are immutable and throw `DomainValidationError` on invalid input.

### Domain Events
`BookmarkCreated`, `BookmarkUpdated`, `BookmarkDeleted`, `BookmarkTagged`

---

## 3. Port Definitions

### StoragePort (outbound)
```typescript
interface StoragePort {
  findById(id: BookmarkId): Promise<Bookmark | null>
  findAll(query: BookmarkQuery): Promise<BookmarkPage>
  save(bookmark: Bookmark): Promise<void>
  delete(id: BookmarkId): Promise<void>
  exists(url: BookmarkUrl): Promise<boolean>
  findCollections(): Promise<Collection[]>
  saveCollection(collection: Collection): Promise<void>
  deleteCollection(path: CollectionPath): Promise<void>
  findAllTags(): Promise<Tag[]>
  exportAll(): Promise<Bookmark[]>
  importAll(bookmarks: Bookmark[]): Promise<ImportResult>
}
```

### AuthPort (outbound)
```typescript
interface AuthPort {
  signIn(credentials: AuthCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  refreshSession(session: AuthSession): Promise<AuthSession>
  getCurrentSession(): Promise<AuthSession | null>
  isAuthenticated(): Promise<boolean>
}
```

### SyncPort (outbound)
```typescript
interface SyncPort {
  sync(): Promise<SyncResult>
  getLastSyncedAt(): Promise<Date | null>
  getSyncStatus(): Promise<SyncStatus>
}
```

---

## 4. Adapter Implementations

### GitHubMarkdownAdapter
- One `.md` file per bookmark with YAML frontmatter
- `index.json` manifest at repo root for fast listing (stores lightweight record per bookmark)
- Uses GitHub REST API (`GET/PUT/DELETE /repos/{owner}/{repo}/contents/{path}`)
- `sha`-based conflict detection (GitHub returns HTTP 409 on stale sha)
- Local in-memory/cache search over fetched index

**File format:**
```markdown
---
id: "abc-123-uuid"
url: "https://example.com"
title: "My Article"
tags: ["typescript", "architecture"]
collection: "dev/typescript"
favicon_url: "https://example.com/favicon.ico"
created_at: "2026-01-15T10:30:00Z"
updated_at: "2026-04-09T08:00:00Z"
---

## Description
...

## Notes
Personal notes, markdown supported.
```

**Repo layout:**
```
bookmarks/
  index.json
  collections/
    dev/typescript/
      abc-123.md
    personal/reading/
      ghi-789.md
  uncategorized/
    jkl-012.md
```

### ChromeStorageCacheAdapter
- Wraps `chrome.storage.local`
- Stores full bookmark objects, index sha, last sync timestamp, config, auth session
- Implements `CachePort` (separate from `StoragePort`)

### GoogleAuthAdapter
- `chrome.identity.launchWebAuthFlow` → Google OAuth2
- Scopes: `openid email profile`
- Tokens stored (encrypted) in `chrome.storage.local`

### EmailPasswordAuthAdapter
- Firebase Auth REST API (no Firebase SDK — bundle size)
- `POST identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`
- Refresh token stored in `chrome.storage.local`

---

## 5. Project Structure

```
bookmark/
  package.json                    # pnpm workspace root
  pnpm-workspace.yaml
  tsconfig.base.json
  vitest.workspace.ts
  .gitignore

  packages/
    domain/                       # @bookmark/domain
    application/                  # @bookmark/application
    github-storage/               # @bookmark/github-storage
    auth-google/                  # @bookmark/auth-google
    auth-email/                   # @bookmark/auth-email
    chrome-extension/             # @bookmark/chrome-extension

  docs/
    README.md
    functional/index.md
    technical/index.md
    adr/
      ADR-001-monorepo-pnpm.md
      ADR-002-storage-markdown-github.md
      ADR-003-ui-preact-not-react.md
      ADR-004-auth-email-firebase-vs-custom-jwt.md
      ADR-005-sync-strategy-last-write-wins.md
      ADR-006-manifest-v3-service-worker.md
      ADR-007-index-json-manifest.md
```

---

## 6. Architecture Decision Records

### ADR-001: Monorepo with pnpm workspaces
**Decision**: pnpm workspaces. Domain and application are shared packages reusable by future UIs.
**Why**: Keeps everything in sync with atomic commits. Tree-shakeable by Vite.

### ADR-002: GitHub Markdown as first storage backend
**Decision**: One `.md` file per bookmark + `index.json` manifest for fast enumeration.
**Why**: Free, versioned, human-readable, API-accessible with no server infrastructure.
**Tradeoff**: Client-side search only; rate limit 5000 req/hr.

### ADR-003: Preact instead of React
**Decision**: Preact 10 with `preact/compat`.
**Why**: 4KB vs 45KB gzipped — critical for popup open time in Chrome Extension.

### ADR-004: Email/Password via Firebase Auth REST (no SDK)
**Decision**: Direct REST calls to `identitytoolkit.googleapis.com`.
**Why**: Zero server infra; no SDK bundle bloat; Firebase handles security.

### ADR-005: Sync — last-write-wins with conflict surfacing
**Decision**: `updatedAt` comparison; conflicts stored in `SyncResult.conflicts` for UI resolution.
**Why**: Simple enough for single-user; explicit conflict handling for multi-device use.

### ADR-006: Chrome Extension Manifest V3
**Decision**: MV3 + Service Worker exclusively.
**Why**: MV2 deprecated since mid-2024. All persistent state must go to `chrome.storage.local`.

### ADR-007: index.json manifest for fast listing
**Decision**: Lightweight manifest (`{ id, url, title, tags, collection, updatedAt, sha, path }`) per bookmark.
**Why**: Single API call to list/search vs O(n) calls to fetch every `.md` file.

---

## 7. Phased Roadmap

### Phase 1 — MVP (Weeks 1–6)
| Week | Deliverable |
|------|-------------|
| 1–2  | `@bookmark/domain`: entities, value objects, domain errors, 100% unit tests |
| 3    | `@bookmark/application`: port interfaces, use case services, mock adapter tests |
| 4    | `@bookmark/github-storage`: GitHubApiClient, MarkdownSerializer, IndexManifest, GitHubMarkdownAdapter |
| 5    | `@bookmark/chrome-extension`: MV3 skeleton, ChromeStorageCacheAdapter, background worker, container.ts |
| 6    | Extension UI: popup (QuickSave + Search), options page (GitHub config), content script |

**Phase 1 delivers**: Working extension that saves/searches bookmarks synced to a GitHub repo via PAT.

### Phase 2 — Auth + Polish (Weeks 7–11)
| Week | Deliverable |
|------|-------------|
| 7    | `@bookmark/auth-google`: Google OAuth via chrome.identity |
| 8    | `@bookmark/auth-email`: Firebase Auth REST, session refresh in service worker |
| 9    | Conflict resolution UI, Chrome bookmarks import, sync error notifications |
| 10   | Tag autocomplete, collection browser, bookmark edit view, keyboard shortcuts |
| 11   | Docs, CI/CD pipeline, Chrome Web Store submission assets |

### Phase 3 — Future (Backlog)
- `NotionAdapter`, `LocalSQLiteAdapter`
- Web app (Next.js) reusing `@bookmark/domain` + `@bookmark/application`
- Firefox/Safari extension

---

## 8. Tech Stack

| Layer          | Technology                    | Justification                                        |
|----------------|-------------------------------|------------------------------------------------------|
| Language       | TypeScript 5.x (strict)       | Single language; enforces domain invariants          |
| Package manager| pnpm 9 + workspaces           | Fast, strict, excellent monorepo support             |
| Build tool     | Vite 5 + @crxjs/vite-plugin   | Best HMR for extensions; tree-shaking for bundle size|
| Extension UI   | Preact 10                     | 4KB vs 45KB React                                    |
| Markdown       | gray-matter                   | YAML frontmatter parsing; zero runtime deps          |
| Testing        | Vitest                        | Native ESM; same Vite pipeline                       |
| Linting        | ESLint 9 + typescript-eslint  | Enforce no cross-layer imports                       |
| Auth (email)   | Firebase Auth REST API        | No server; no SDK bloat                              |
| Auth (Google)  | chrome.identity API           | Native to extension platform                         |
| CI/CD          | GitHub Actions                | Free; native GitHub API integration                  |
| CSS            | CSS Modules                   | Scoped styles; no host page leakage                  |

---

## Cross-Cutting Concerns

- **Error handling**: Use cases return `Result<T, AppError>` (discriminated union) — no throwing across layers.
- **Logging**: `Logger` interface in `@bookmark/application`; `ConsoleLogger` in extension; Sentry adapter possible later.
- **Security**: PAT and auth tokens in `chrome.storage.local` (not `sync`). Phase 2 evaluates `SubtleCrypto` encryption.
- **DI**: Manual constructor injection in `composition/container.ts` — the only file that imports from infrastructure.
- **Testing pyramid**: Domain (pure unit, 100%) → Application (unit with stubs) → Infrastructure (integration against real APIs) → UI (component tests with @testing-library/preact).
