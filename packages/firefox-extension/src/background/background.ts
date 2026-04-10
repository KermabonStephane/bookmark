/**
 * Manifest V3 background script — ephemeral, all state persisted to browser.storage.local.
 */
import browser from "webextension-polyfill";
import { createContainer } from "../composition/container.js";
import { SyncScheduler } from "./SyncScheduler.js";
import { MessageHandler, type Message } from "./MessageHandler.js";

async function loadConfig() {
  const result = await browser.storage.local.get("bm_config");
  return result["bm_config"] as {
    github: { owner: string; repo: string; pat: string };
    firebaseApiKey: string;
  } | undefined;
}

browser.runtime.onInstalled.addListener(() => {
  const scheduler = new SyncScheduler();
  scheduler.start();
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  const scheduler = new SyncScheduler();
  if (!scheduler.isSync(alarm.name)) return;

  const config = await loadConfig();
  if (!config?.github.pat) return;

  const container = createContainer(config);
  try {
    await container.sync.execute();
  } catch (err) {
    console.error("Background sync failed:", err);
  }
});

browser.runtime.onMessage.addListener((message) => {
  return (async () => {
    const config = await loadConfig();
    if (!config) return { error: "Not configured" };

    const container = createContainer(config);
    const handler = new MessageHandler(container);
    return handler.handle(message as Message);
  })();
});
