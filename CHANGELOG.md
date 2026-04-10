# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Popup redesigned with a 3-tab layout and a bottom tab bar (search, add, config) for both Chrome and Firefox extensions
- `ConfigTab` component — inline GitHub PAT configuration directly in the popup (no need to open the options page for initial setup)
- SVG icons for each tab: magnifying glass (search), bookmark-with-plus (add), gear (config)

### Fixed
- `ChromeMetadataExtractor`: `BookmarkUrl` was imported from `@bookmark/application` instead of `@bookmark/domain`
- `ChromeStorageCacheAdapter`: `Bookmark`/`BookmarkId` were `import type` but used as values (`new Bookmark`, `BookmarkId.of`)

### Changed
- Popup header toggle (Save / Search) replaced by bottom navigation tab bar
- `@bookmark/firefox-extension` package — MV3 Firefox extension (Firefox 121+) with Preact popup, options page, background script, and content script
- `FirefoxStorageCacheAdapter` — `browser.storage.local` cache adapter for Firefox
- `FirefoxMetadataExtractor` — active tab metadata extraction via `browser.tabs`
- Email/password authentication in Firefox options (Google OAuth deferred — see issue #1)
- `webextension-polyfill` integration for unified `browser.*` API across the extension

### Initial scaffold
- Monorepo with 6 packages: `domain`, `application`, `github-storage`, `auth-google`, `auth-email`, `chrome-extension`
- Domain layer: `Bookmark` entity, value objects, domain errors — fully tested
- Application layer: use cases and port interfaces (`StoragePort`, `AuthPort`, `SyncPort`, `CachePort`)
- Chrome Extension MV3: Preact popup, options page, background service worker, content script
- GitHub storage adapter: one Markdown file per bookmark + `index.json` manifest
- Google OAuth adapter via `chrome.identity` API
- Firebase Auth REST adapter (no SDK) for email/password authentication
