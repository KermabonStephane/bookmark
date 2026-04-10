import browser from "webextension-polyfill";
import { render } from "preact";
import { App } from "./components/App.js";
import { createContainer } from "../composition/container.js";

async function init(): Promise<void> {
  const result = await browser.storage.local.get("bm_config");
  const config = result["bm_config"] as Parameters<typeof createContainer>[0] | undefined;

  if (!config) {
    document.getElementById("app")!.innerHTML =
      '<p style="padding:16px">Please configure your GitHub repository in the <a href="#" id="opts">options page</a>.</p>';
    document.getElementById("opts")?.addEventListener("click", () => browser.runtime.openOptionsPage());
    return;
  }

  const container = createContainer(config);
  render(<App container={container} />, document.getElementById("app")!);
}

void init();
