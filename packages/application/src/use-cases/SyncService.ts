import type { SyncUseCase } from "../ports/inbound/SyncUseCase.js";
import type { CachePort } from "../ports/outbound/CachePort.js";
import type { StoragePort } from "../ports/outbound/StoragePort.js";
import type { SyncResult } from "../ports/outbound/SyncPort.js";
import { DEFAULT_QUERY } from "../dto/BookmarkQuery.js";

export class SyncService implements SyncUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly cache: CachePort,
  ) {}

  async execute(): Promise<SyncResult> {
    const lastSync = await this.cache.getLastSyncedAt();

    const remoteAll = await this.storage.exportAll();
    const localPage = await this.cache.getAll({ ...DEFAULT_QUERY, pageSize: 10_000 });
    const localMap = new Map(localPage.items.map((b) => [b.id.toString(), b]));

    let created = 0;
    let updated = 0;

    for (const remote of remoteAll) {
      const local = localMap.get(remote.id.toString());
      if (local === undefined) {
        await this.cache.put(remote);
        created++;
      } else if (remote.updatedAt > local.updatedAt) {
        await this.cache.put(remote);
        updated++;
      }
    }

    const syncedAt = new Date();
    await this.cache.setLastSyncedAt(syncedAt);

    return { created, updated, deleted: 0, conflicts: [], syncedAt };
  }
}
