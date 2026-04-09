import type { Bookmark, BookmarkId, BookmarkUrl, Collection, CollectionPath, Tag } from "@bookmark/domain";
import type { BookmarkPage } from "../../dto/BookmarkPage.js";
import type { BookmarkQuery } from "../../dto/BookmarkQuery.js";
import type { ImportResult } from "../../dto/ImportResult.js";

export interface StoragePort {
  findById(id: BookmarkId): Promise<Bookmark | null>;
  findAll(query: BookmarkQuery): Promise<BookmarkPage>;
  save(bookmark: Bookmark): Promise<void>;
  delete(id: BookmarkId): Promise<void>;
  exists(url: BookmarkUrl): Promise<boolean>;

  findCollections(): Promise<Collection[]>;
  saveCollection(collection: Collection): Promise<void>;
  deleteCollection(path: CollectionPath): Promise<void>;

  findAllTags(): Promise<Tag[]>;

  exportAll(): Promise<Bookmark[]>;
  importAll(bookmarks: Bookmark[]): Promise<ImportResult>;
}
