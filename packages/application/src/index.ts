// Outbound ports (interfaces for adapters to implement)
export type { StoragePort } from "./ports/outbound/StoragePort.js";
export type { AuthPort, AuthCredentials, AuthSession } from "./ports/outbound/AuthPort.js";
export type { SyncPort, SyncResult, SyncStatus, SyncConflict } from "./ports/outbound/SyncPort.js";
export type { MetadataExtractionPort, PageMetadata } from "./ports/outbound/MetadataExtractionPort.js";
export type { CachePort } from "./ports/outbound/CachePort.js";

// Inbound ports (use case interfaces consumed by UI)
export type { SaveBookmarkUseCase } from "./ports/inbound/SaveBookmarkUseCase.js";
export type { SearchBookmarksUseCase } from "./ports/inbound/SearchBookmarksUseCase.js";
export type { DeleteBookmarkUseCase, DeleteBookmarkCommand } from "./ports/inbound/DeleteBookmarkUseCase.js";
export type { UpdateBookmarkUseCase, UpdateBookmarkCommand } from "./ports/inbound/UpdateBookmarkUseCase.js";
export type { SyncUseCase } from "./ports/inbound/SyncUseCase.js";
export type { AuthenticateUseCase } from "./ports/inbound/AuthenticateUseCase.js";
export type { ListCollectionsUseCase } from "./ports/inbound/ListCollectionsUseCase.js";

// DTOs
export type { BookmarkQuery } from "./dto/BookmarkQuery.js";
export { DEFAULT_QUERY } from "./dto/BookmarkQuery.js";
export type { BookmarkPage } from "./dto/BookmarkPage.js";
export type { SaveBookmarkCommand } from "./dto/SaveBookmarkCommand.js";
export type { ImportResult } from "./dto/ImportResult.js";

// Use case implementations
export { SaveBookmarkService } from "./use-cases/SaveBookmarkService.js";
export { SearchBookmarksService } from "./use-cases/SearchBookmarksService.js";
export { DeleteBookmarkService } from "./use-cases/DeleteBookmarkService.js";
export { UpdateBookmarkService } from "./use-cases/UpdateBookmarkService.js";
export { AuthenticateService } from "./use-cases/AuthenticateService.js";
export { SyncService } from "./use-cases/SyncService.js";
export { ListCollectionsService } from "./use-cases/ListCollectionsService.js";
