# Functional Documentation

## User Personas

**Personal user** — An individual developer or power user who wants to save, organize, and search their bookmarks. Accesses bookmarks via Chrome Extension. Values owning their data (stored in their own GitHub repo).

## Core Features

### Save a Bookmark
- Click the extension icon while on any page
- Title and URL are pre-filled from the current tab
- User can add tags and select a collection before saving
- Bookmark is saved to GitHub and cached locally

### Search Bookmarks
- Full-text search across title, URL, and tags
- Filter by tag(s) or collection
- Results displayed in the popup, sorted by recency

### Manage Collections
- Hierarchical collections (e.g. `dev/typescript`, `personal/reading`)
- Move bookmarks between collections

### Sync
- Automatic background sync every 15 minutes
- Manual "Sync Now" in the options page
- Conflict resolution: last-write-wins with user notification on conflict

### Authentication
- Google OAuth: sign in with your Google account
- Email/Password: sign up/in via Firebase Authentication

## Business Rules

1. A bookmark URL must be a valid `http` or `https` URL.
2. A bookmark title must not be empty.
3. Tags are lowercase, alphanumeric, hyphen-separated (e.g. `clean-arch`).
4. Collection paths are slash-separated, lowercase (e.g. `dev/typescript`).
5. Duplicate URLs are detected and flagged at save time.
6. The GitHub PAT is stored only in local Chrome storage — never synced to Google.

## User Journeys

### First-time Setup
1. Install the extension.
2. Open Options → Storage: enter GitHub owner, repo, branch, PAT.
3. Open Options → Auth: sign in with Google or email.
4. Return to any tab and click the extension icon to save your first bookmark.

### Daily Use
1. Browse to a page you want to save.
2. Click the extension icon → "Save" tab.
3. Confirm or edit the pre-filled title. Add tags if needed. Click "Save Bookmark".
4. To find a saved bookmark, click the extension icon → "Search" tab. Type a keyword.
