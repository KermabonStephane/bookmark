import browser from "webextension-polyfill";
import type { BookmarkUrl, MetadataExtractionPort, PageMetadata } from "@bookmark/application";

export class FirefoxMetadataExtractor implements MetadataExtractionPort {
  async extractFromUrl(url: BookmarkUrl): Promise<PageMetadata> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab?.id || tab.url !== url.toString()) {
      return { title: null, description: null, faviconUrl: null, ogImage: null };
    }

    try {
      const response = await browser.tabs.sendMessage(tab.id, { type: "GET_PAGE_METADATA" }) as PageMetadata | undefined;
      return response ?? { title: tab.title ?? null, description: null, faviconUrl: tab.favIconUrl ?? null, ogImage: null };
    } catch {
      return { title: tab.title ?? null, description: null, faviconUrl: tab.favIconUrl ?? null, ogImage: null };
    }
  }
}
