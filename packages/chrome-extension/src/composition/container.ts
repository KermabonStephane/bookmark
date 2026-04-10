/**
 * Composition root — the ONLY file that imports from infrastructure packages.
 * Wire all adapters and use cases here.
 */
import { GitHubMarkdownAdapter } from "@bookmark/github-storage";
import type { GitHubConfig } from "@bookmark/github-storage";
import { GoogleAuthAdapter } from "@bookmark/auth-google";
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
import { ChromeStorageCacheAdapter } from "../adapters/ChromeStorageCacheAdapter.js";
import { ChromeMetadataExtractor } from "../adapters/ChromeMetadataExtractor.js";

export interface AppConfig {
  github: GitHubConfig;
  googleClientId: string;
  firebaseApiKey: string;
}

export function createContainer(config: AppConfig) {
  const cache = new ChromeStorageCacheAdapter();
  const storage = new GitHubMarkdownAdapter(config.github);
  const metadataExtractor = new ChromeMetadataExtractor();

  const googleAuth = new GoogleAuthAdapter({ clientId: config.googleClientId });
  const emailAuth = new EmailPasswordAuthAdapter({ firebaseApiKey: config.firebaseApiKey, storage: chrome.storage.local });

  return {
    // Use cases
    saveBookmark: new SaveBookmarkService(storage, cache),
    searchBookmarks: new SearchBookmarksService(cache),
    deleteBookmark: new DeleteBookmarkService(storage, cache),
    updateBookmark: new UpdateBookmarkService(storage, cache),
    listCollections: new ListCollectionsService(storage),
    sync: new SyncService(storage, cache),
    authenticateGoogle: new AuthenticateService(googleAuth),
    authenticateEmail: new AuthenticateService(emailAuth),

    // Adapters (for direct use in background/options)
    cache,
    storage,
    metadataExtractor,
    googleAuth,
    emailAuth,
  };
}

export type Container = ReturnType<typeof createContainer>;
