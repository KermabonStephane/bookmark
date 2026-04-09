import { Bookmark, CollectionPath } from "@bookmark/domain";
import type { SaveBookmarkCommand } from "../dto/SaveBookmarkCommand.js";
import type { SaveBookmarkUseCase } from "../ports/inbound/SaveBookmarkUseCase.js";
import type { CachePort } from "../ports/outbound/CachePort.js";
import type { StoragePort } from "../ports/outbound/StoragePort.js";

export class SaveBookmarkService implements SaveBookmarkUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly cache: CachePort,
  ) {}

  async execute(command: SaveBookmarkCommand): Promise<Bookmark> {
    const bookmark = Bookmark.create({
      url: command.url,
      title: command.title,
      description: command.description ?? "",
      notes: command.notes ?? "",
      tags: command.tags ?? [],
      collection: command.collection ?? CollectionPath.ROOT,
      faviconUrl: command.faviconUrl ?? null,
    });

    await this.storage.save(bookmark);
    await this.cache.put(bookmark);

    return bookmark;
  }
}
