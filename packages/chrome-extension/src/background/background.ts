/**
 * Manifest V3 service worker — ephemeral, all state persisted to chrome.storage.local.
 */
import { createContainer } from "../composition/container.js";
import { SyncScheduler } from "./SyncScheduler.js";
import { MessageHandler } from "./MessageHandler.js";

async function loadConfig() {
  const result = await chrome.storage.local.get("bm_config");
  return result["bm_config"] as {
    github: { owner: string; repo: string; pat: string };
    googleClientId: string;
    firebaseApiKey: string;
  } | undefined;
}

chrome.runtime.onInstalled.addListener(async () => {
  const scheduler = new SyncScheduler();
  scheduler.start();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "bookmark-sync") return;

  const config = await loadConfig();
  if (!config?.github.pat) return;

  const container = createContainer(config);
  try {
    await container.sync.execute();
  } catch (err) {
    console.error("Background sync failed:", err);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    const config = await loadConfig();
    if (!config) {
      sendResponse({ error: "Not configured" });
      return;
    }
    const container = createContainer(config);
    const handler = new MessageHandler(container);
    handler.register();
  })();
  return true;
});
