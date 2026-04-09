export type SyncStatus = "idle" | "syncing" | "error" | "never";

export interface SyncConflict {
  bookmarkId: string;
  localUpdatedAt: Date;
  remoteUpdatedAt: Date;
}

export interface SyncResult {
  created: number;
  updated: number;
  deleted: number;
  conflicts: SyncConflict[];
  syncedAt: Date;
}

export interface SyncPort {
  sync(): Promise<SyncResult>;
  getLastSyncedAt(): Promise<Date | null>;
  getSyncStatus(): Promise<SyncStatus>;
}
