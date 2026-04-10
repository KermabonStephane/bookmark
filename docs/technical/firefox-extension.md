# Firefox Extension — Installation Guide

## Requirements

- Firefox 121 or later
- Node.js 20+, pnpm 9+

## 1. Build the extension

```bash
# From the repository root
pnpm install
pnpm --filter @bookmark/firefox-extension build
```

The compiled extension is output to `packages/firefox-extension/dist/`.

## 2. Load in Firefox (development / testing)

### Option A — Temporary install via `about:debugging`

This is the quickest way to test without signing the extension. The extension is removed when Firefox restarts.

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Browse to `packages/firefox-extension/dist/` and select `manifest.json`
4. The extension icon appears in the toolbar

### Option B — Run with `web-ext` (recommended for development)

`web-ext` launches a clean Firefox profile with the extension pre-loaded and reloads it automatically on file changes.

```bash
# Build in watch mode (terminal 1)
pnpm --filter @bookmark/firefox-extension dev

# Launch Firefox with the extension (terminal 2)
pnpm --filter @bookmark/firefox-extension run:firefox
```

Firefox opens automatically. Any change to the source triggers a rebuild and the extension reloads in place.

### Option C — Persistent install via `about:config` (unsigned, advanced)

Firefox normally requires extensions to be signed by Mozilla. To install an unsigned extension permanently:

1. Navigate to `about:config`
2. Search for `xpinstall.signatures.required` and set it to `false`
   > This option is only available in **Firefox Developer Edition** and **Firefox Nightly**. It is not available in standard Firefox releases.
3. Navigate to `about:addons` → gear icon → **Install Add-on From File…**
4. Select the `dist/` directory or a packaged `.zip` file

## 3. Configure the extension

Once loaded, click the extension icon or go to **Preferences / Options**:

1. **GitHub Repository** — enter your GitHub username/org, repository name, branch (default: `main`), and a Personal Access Token with `repo` read/write scope
2. **Authentication** — sign in with your email and password (Firebase Auth)

Configuration is stored in `browser.storage.local` on your device — it is never uploaded or synced.

## 4. Package for distribution (`.xpi`)

To produce a signed `.xpi` for submission to [addons.mozilla.org](https://addons.mozilla.org):

```bash
pnpm --filter @bookmark/firefox-extension build
npx web-ext build --source-dir packages/firefox-extension/dist --artifacts-dir packages/firefox-extension/web-ext-artifacts
```

The `.zip` artifact in `web-ext-artifacts/` can be submitted to AMO for signing and publication.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Extension icon missing after build | Verify `public/icons/` contains the four PNG sizes (16, 32, 48, 128 px) |
| `browser is not defined` at runtime | Ensure `webextension-polyfill` is bundled — check `vite.config.ts` aliases |
| Options page does not open | Firefox 121+ is required; check `browser_specific_settings.gecko.strict_min_version` in `manifest.json` |
| Sync fails silently | Check the browser console in `about:debugging` → Inspect → Console tab |
