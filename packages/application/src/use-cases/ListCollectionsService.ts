import type { Collection } from "@bookmark/domain";
import type { ListCollectionsUseCase } from "../ports/inbound/ListCollectionsUseCase.js";
import type { StoragePort } from "../ports/outbound/StoragePort.js";

export class ListCollectionsService implements ListCollectionsUseCase {
  constructor(private readonly storage: StoragePort) {}

  async execute(): Promise<Collection[]> {
    return this.storage.findCollections();
  }
}
