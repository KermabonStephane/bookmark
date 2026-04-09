import type { Collection } from "@bookmark/domain";

export interface ListCollectionsUseCase {
  execute(): Promise<Collection[]>;
}
