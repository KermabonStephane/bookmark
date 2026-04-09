import type { Bookmark, BookmarkId } from "@bookmark/domain";
import type { BookmarkPage, BookmarkQuery, CachePort } from "@bookmark/application";

const CACHE_KEY = "bm_cache_v1";
const LAST_SYNC_KEY = "bm_last_sync";

export class ChromeStorageCacheAdapter implements CachePort {
  async getAll(query: BookmarkQuery): Promise<BookmarkPage> {
    const bookmarks = await this.loadAll();

    let filtered = bookmarks;

    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toString().toLowerCase().includes(q) ||
          b.url.toString().toLowerCase().includes(q) ||
          b.tags.some((t) => t.name.toString().includes(q)),
      );
    }

    if (query.tags && query.tags.length > 0) {
      filtered = filtered.filter((b) =>
        query.tags!.every((tag) => b.tags.some((t) => t.name.equals(tag))),
      );
    }

    if (query.collection) {
      filtered = filtered.filter((b) =>
        b.collection.toString().startsWith(query.collection!.toString()),
      );
    }

    filtered.sort((a, b) => {
      let aVal: string | Date;
      let bVal: string | Date;
      if (query.sortBy === "title") {
        aVal = a.title.toString();
        bVal = b.title.toString();
      } else if (query.sortBy === "createdAt") {
        aVal = a.createdAt;
        bVal = b.createdAt;
      } else {
        aVal = a.updatedAt;
        bVal = b.updatedAt;
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return query.sortOrder === "asc" ? cmp : -cmp;
    });

    const start = (query.page - 1) * query.pageSize;
    const items = filtered.slice(start, start + query.pageSize);

    return {
      items,
      total: filtered.length,
      page: query.page,
      pageSize: query.pageSize,
      hasMore: start + query.pageSize < filtered.length,
    };
  }

  async getById(id: BookmarkId): Promise<Bookmark | null> {
    const bookmarks = await this.loadAll();
    return bookmarks.find((b) => b.id.equals(id)) ?? null;
  }

  async putAll(bookmarks: Bookmark[]): Promise<void> {
    await chrome.storage.local.set({ [CACHE_KEY]: this.serialize(bookmarks) });
  }

  async put(bookmark: Bookmark): Promise<void> {
    const existing = await this.loadAll();
    const idx = existing.findIndex((b) => b.id.equals(bookmark.id));
    if (idx >= 0) {
      existing[idx] = bookmark;
    } else {
      existing.push(bookmark);
    }
    await chrome.storage.local.set({ [CACHE_KEY]: this.serialize(existing) });
  }

  async remove(id: BookmarkId): Promise<void> {
    const existing = await this.loadAll();
    const filtered = existing.filter((b) => !b.id.equals(id));
    await chrome.storage.local.set({ [CACHE_KEY]: this.serialize(filtered) });
  }

  async clear(): Promise<void> {
    await chrome.storage.local.remove(CACHE_KEY);
  }

  async getLastSyncedAt(): Promise<Date | null> {
    const result = await chrome.storage.local.get(LAST_SYNC_KEY);
    const val = result[LAST_SYNC_KEY] as string | undefined;
    return val ? new Date(val) : null;
  }

  async setLastSyncedAt(date: Date): Promise<void> {
    await chrome.storage.local.set({ [LAST_SYNC_KEY]: date.toISOString() });
  }

  private async loadAll(): Promise<Bookmark[]> {
    const result = await chrome.storage.local.get(CACHE_KEY);
    const raw = result[CACHE_KEY] as SerializedBookmark[] | undefined;
    if (!raw) return [];
    return raw.map(deserializeBookmark);
  }

  private serialize(bookmarks: Bookmark[]): SerializedBookmark[] {
    return bookmarks.map(serializeBookmark);
  }
}

// Serialization helpers — chrome.storage stores plain objects, not class instances

interface SerializedBookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  notes: string;
  tags: string[];
  collection: string;
  faviconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

function serializeBookmark(b: Bookmark): SerializedBookmark {
  return {
    id: b.id.toString(),
    url: b.url.toString(),
    title: b.title.toString(),
    description: b.description,
    notes: b.notes,
    tags: b.tags.map((t) => t.name.toString()),
    collection: b.collection.toString(),
    faviconUrl: b.faviconUrl?.toString() ?? null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

import {
  Bookmark,
  BookmarkId,
  BookmarkUrl,
  BookmarkTitle,
  CollectionPath,
  FaviconUrl,
  Tag,
  TagName,
} from "@bookmark/domain";

function deserializeBookmark(raw: SerializedBookmark): Bookmark {
  return new Bookmark({
    id: BookmarkId.of(raw.id),
    url: BookmarkUrl.of(raw.url),
    title: BookmarkTitle.of(raw.title),
    description: raw.description,
    notes: raw.notes,
    tags: raw.tags.map((t) => new Tag(TagName.of(t))),
    collection: CollectionPath.of(raw.collection),
    faviconUrl: raw.faviconUrl ? FaviconUrl.of(raw.faviconUrl) : null,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  });
}
