import type { BookmarkTitle, BookmarkUrl, CollectionPath, FaviconUrl, Tag } from "@bookmark/domain";

export interface SaveBookmarkCommand {
  url: BookmarkUrl;
  title: BookmarkTitle;
  description?: string;
  notes?: string;
  tags?: Tag[];
  collection?: CollectionPath;
  faviconUrl?: FaviconUrl | null;
}
