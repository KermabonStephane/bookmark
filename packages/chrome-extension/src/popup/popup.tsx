import { render } from "preact";
import { App } from "./components/App.js";
import { createContainer } from "../composition/container.js";

async function init(): Promise<void> {
  const result = await chrome.storage.local.get("bm_config");
  const config = result["bm_config"] as Parameters<typeof createContainer>[0] | undefined;

  if (!config) {
    render(<App initialTab="config" />, document.getElementById("app")!);
    return;
  }

  const container = createContainer(config);
  render(<App container={container} />, document.getElementById("app")!);
}

void init();
