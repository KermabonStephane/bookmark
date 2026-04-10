# Bookmark Manager

A pluggable bookmark management system. Store and browse your bookmarks with swappable storage backends and UI frontends.

## Architecture

- **Storage**: Pluggable via `StoragePort`. First backend: Markdown files in a GitHub repository.
- **UI**: Pluggable frontends. Chrome Extension and Firefox Extension (TypeScript + Preact).
- **Auth**: Pluggable via `AuthPort`. Google OAuth and Email/Password.

Built with Hexagonal Architecture — the domain layer has zero external dependencies.

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Build all packages
pnpm build

# Build Chrome Extension (development mode with watch)
pnpm --filter @bookmark/chrome-extension dev

# Build Firefox Extension (development mode with watch)
pnpm --filter @bookmark/firefox-extension dev

# Run Firefox Extension in Firefox (requires web-ext)
pnpm --filter @bookmark/firefox-extension run:firefox
```

See [How to install the Firefox extension](./technical/firefox-extension.md) for step-by-step instructions.

## Documentation

- [Functional Documentation](./functional/index.md)
- [Technical Documentation](./technical/index.md)
- [Architecture Decision Records](./adr/)

## Packages

| Package | Description |
|---|---|
| `@bookmark/domain` | Core entities, value objects, domain errors |
| `@bookmark/application` | Use cases and port interfaces |
| `@bookmark/github-storage` | GitHub Markdown storage adapter |
| `@bookmark/auth-google` | Google OAuth adapter (Chrome Identity API) |
| `@bookmark/auth-email` | Email/Password adapter (Firebase Auth REST) |
| `@bookmark/chrome-extension` | Chrome Extension UI (Preact, Manifest V3) |
| `@bookmark/firefox-extension` | Firefox Extension UI (Preact, Manifest V3, Firefox 121+) |
