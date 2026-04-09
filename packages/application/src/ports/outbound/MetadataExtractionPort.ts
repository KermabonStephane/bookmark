import type { BookmarkUrl } from "@bookmark/domain";

export interface PageMetadata {
  title: string | null;
  description: string | null;
  faviconUrl: string | null;
  ogImage: string | null;
}

export interface MetadataExtractionPort {
  extractFromUrl(url: BookmarkUrl): Promise<PageMetadata>;
}
