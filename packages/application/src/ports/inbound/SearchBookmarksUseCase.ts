import type { BookmarkPage } from "../../dto/BookmarkPage.js";
import type { BookmarkQuery } from "../../dto/BookmarkQuery.js";

export interface SearchBookmarksUseCase {
  execute(query: BookmarkQuery): Promise<BookmarkPage>;
}
