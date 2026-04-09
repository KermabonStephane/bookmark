import type { SyncResult } from "../outbound/SyncPort.js";

export interface SyncUseCase {
  execute(): Promise<SyncResult>;
}
