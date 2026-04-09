import type { Bookmark } from "@bookmark/domain";

export interface BookmarkPage {
  items: Bookmark[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
