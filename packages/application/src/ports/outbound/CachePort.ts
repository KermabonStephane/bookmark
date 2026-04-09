import type { Bookmark, BookmarkId } from "@bookmark/domain";
import type { BookmarkPage } from "../../dto/BookmarkPage.js";
import type { BookmarkQuery } from "../../dto/BookmarkQuery.js";

export interface CachePort {
  getAll(query: BookmarkQuery): Promise<BookmarkPage>;
  getById(id: BookmarkId): Promise<Bookmark | null>;
  putAll(bookmarks: Bookmark[]): Promise<void>;
  put(bookmark: Bookmark): Promise<void>;
  remove(id: BookmarkId): Promise<void>;
  clear(): Promise<void>;
  getLastSyncedAt(): Promise<Date | null>;
  setLastSyncedAt(date: Date): Promise<void>;
}
