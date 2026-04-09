import { BookmarkNotFoundError } from "@bookmark/domain";
import type { Bookmark } from "@bookmark/domain";
import type { UpdateBookmarkCommand, UpdateBookmarkUseCase } from "../ports/inbound/UpdateBookmarkUseCase.js";
import type { CachePort } from "../ports/outbound/CachePort.js";
import type { StoragePort } from "../ports/outbound/StoragePort.js";

export class UpdateBookmarkService implements UpdateBookmarkUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly cache: CachePort,
  ) {}

  async execute(command: UpdateBookmarkCommand): Promise<Bookmark> {
    const bookmark = await this.storage.findById(command.id);
    if (bookmark === null) {
      throw new BookmarkNotFoundError(command.id.toString());
    }

    bookmark.update(command.fields);

    await this.storage.save(bookmark);
    await this.cache.put(bookmark);

    return bookmark;
  }
}
