import type { BookmarkUrl, MetadataExtractionPort, PageMetadata } from "@bookmark/application";

export class ChromeMetadataExtractor implements MetadataExtractionPort {
  async extractFromUrl(url: BookmarkUrl): Promise<PageMetadata> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab?.id || tab.url !== url.toString()) {
      return { title: null, description: null, faviconUrl: null, ogImage: null };
    }

    return new Promise((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: "GET_PAGE_METADATA" },
        (response: PageMetadata | undefined) => {
          if (chrome.runtime.lastError || !response) {
            resolve({ title: tab.title ?? null, description: null, faviconUrl: tab.favIconUrl ?? null, ogImage: null });
          } else {
            resolve(response);
          }
        },
      );
    });
  }
}
