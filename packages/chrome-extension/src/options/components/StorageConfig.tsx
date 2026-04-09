import { useEffect, useState } from "preact/hooks";

interface GitHubConfig {
  owner: string;
  repo: string;
  pat: string;
  branch: string;
}

export function StorageConfig() {
  const [config, setConfig] = useState<GitHubConfig>({ owner: "", repo: "", pat: "", branch: "main" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("bm_config", (result) => {
      const stored = result["bm_config"] as { github?: GitHubConfig } | undefined;
      if (stored?.github) setConfig(stored.github);
    });
  }, []);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const current = await new Promise<Record<string, unknown>>((r) =>
      chrome.storage.local.get("bm_config", r),
    );
    await chrome.storage.local.set({
      bm_config: { ...(current["bm_config"] ?? {}), github: config },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function field(key: keyof GitHubConfig) {
    return (e: Event) => setConfig({ ...config, [key]: (e.target as HTMLInputElement).value });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ fontSize: 16 }}>GitHub Repository</h2>
      <label>
        Owner (username or org)
        <input type="text" value={config.owner} onInput={field("owner")} required style={{ display: "block", width: "100%", marginTop: 4 }} />
      </label>
      <label>
        Repository name
        <input type="text" value={config.repo} onInput={field("repo")} required style={{ display: "block", width: "100%", marginTop: 4 }} />
      </label>
      <label>
        Branch
        <input type="text" value={config.branch} onInput={field("branch")} required style={{ display: "block", width: "100%", marginTop: 4 }} />
      </label>
      <label>
        Personal Access Token (PAT)
        <input type="password" value={config.pat} onInput={field("pat")} required style={{ display: "block", width: "100%", marginTop: 4 }} />
        <small style={{ color: "#6b7280" }}>Needs repo read/write scope. Stored locally, never synced.</small>
      </label>
      <button type="submit">Save</button>
      {saved && <p style={{ color: "green" }}>Configuration saved.</p>}
    </form>
  );
}
