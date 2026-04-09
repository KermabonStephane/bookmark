import type { BookmarkPage } from "../dto/BookmarkPage.js";
import type { BookmarkQuery } from "../dto/BookmarkQuery.js";
import type { SearchBookmarksUseCase } from "../ports/inbound/SearchBookmarksUseCase.js";
import type { CachePort } from "../ports/outbound/CachePort.js";

export class SearchBookmarksService implements SearchBookmarksUseCase {
  constructor(private readonly cache: CachePort) {}

  async execute(query: BookmarkQuery): Promise<BookmarkPage> {
    return this.cache.getAll(query);
  }
}
