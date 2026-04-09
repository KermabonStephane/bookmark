/**
 * Content script — minimal, runs on every page.
 * Extracts page metadata and responds to GET_PAGE_METADATA messages from the popup.
 */
import type { PageMetadata } from "@bookmark/application";

function extractMetadata(): PageMetadata {
  const title = document.title || null;

  const descriptionMeta =
    document.querySelector<HTMLMetaElement>('meta[name="description"]') ??
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]');

  const ogImageMeta = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');

  const faviconLink =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
    document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');

  const faviconUrl = faviconLink?.href
    ? new URL(faviconLink.href, window.location.origin).toString()
    : `${window.location.origin}/favicon.ico`;

  return {
    title,
    description: descriptionMeta?.content ?? null,
    faviconUrl,
    ogImage: ogImageMeta?.content ?? null,
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_METADATA") {
    sendResponse(extractMetadata());
  }
});
