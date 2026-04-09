import { BookmarkNotFoundError } from "@bookmark/domain";
import type { DeleteBookmarkCommand, DeleteBookmarkUseCase } from "../ports/inbound/DeleteBookmarkUseCase.js";
import type { CachePort } from "../ports/outbound/CachePort.js";
import type { StoragePort } from "../ports/outbound/StoragePort.js";

export class DeleteBookmarkService implements DeleteBookmarkUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly cache: CachePort,
  ) {}

  async execute(command: DeleteBookmarkCommand): Promise<void> {
    const existing = await this.storage.findById(command.id);
    if (existing === null) {
      throw new BookmarkNotFoundError(command.id.toString());
    }

    await this.storage.delete(command.id);
    await this.cache.remove(command.id);
  }
}
