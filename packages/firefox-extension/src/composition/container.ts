/**
 * Composition root — the ONLY file that imports from infrastructure packages.
 * Wire all adapters and use cases here.
 *
 * Note: Google OAuth is not supported in the Firefox extension (deferred).
 * Authentication is handled via email/password (Firebase Auth REST).
 */
import browser from "webextension-polyfill";
import { GitHubMarkdownAdapter } from "@bookmark/github-storage";
import type { GitHubConfig } from "@bookmark/github-storage";
import { EmailPasswordAuthAdapter } from "@bookmark/auth-email";
import {
  SaveBookmarkService,
  SearchBookmarksService,
  DeleteBookmarkService,
  UpdateBookmarkService,
  AuthenticateService,
  SyncService,
  ListCollectionsService,
} from "@bookmark/application";
import { FirefoxStorageCacheAdapter } from "../adapters/FirefoxStorageCacheAdapter.js";
import { FirefoxMetadataExtractor } from "../adapters/FirefoxMetadataExtractor.js";

export interface AppConfig {
  github: GitHubConfig;
  firebaseApiKey: string;
}

export function createContainer(config: AppConfig) {
  const cache = new FirefoxStorageCacheAdapter();
  const storage = new GitHubMarkdownAdapter(config.github);
  const metadataExtractor = new FirefoxMetadataExtractor();

  const emailAuth = new EmailPasswordAuthAdapter({ firebaseApiKey: config.firebaseApiKey, storage: browser.storage.local });

  return {
    // Use cases
    saveBookmark: new SaveBookmarkService(storage, cache),
    searchBookmarks: new SearchBookmarksService(cache),
    deleteBookmark: new DeleteBookmarkService(storage, cache),
    updateBookmark: new UpdateBookmarkService(storage, cache),
    listCollections: new ListCollectionsService(storage),
    sync: new SyncService(storage, cache),
    authenticateEmail: new AuthenticateService(emailAuth),

    // Adapters (for direct use in background/options)
    cache,
    storage,
    metadataExtractor,
    emailAuth,
  };
}

export type Container = ReturnType<typeof createContainer>;
