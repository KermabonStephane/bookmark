import type { CollectionPath, TagName } from "@bookmark/domain";

export interface BookmarkQuery {
  search?: string;
  tags?: TagName[];
  collection?: CollectionPath;
  page: number;
  pageSize: number;
  sortBy: "createdAt" | "updatedAt" | "title";
  sortOrder: "asc" | "desc";
}

export const DEFAULT_QUERY: BookmarkQuery = {
  page: 1,
  pageSize: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
};
