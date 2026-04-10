import { useEffect, useState } from "preact/hooks";

interface GitHubConfig {
  owner: string;
  repo: string;
  pat: string;
  branch: string;
}

export function ConfigTab() {
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
    const trimmed = {
      ...config,
      owner: config.owner.trim(),
      repo: config.repo.trim(),
      branch: config.branch.trim(),
      pat: config.pat.trim(),
    };
    const current = await new Promise<Record<string, unknown>>((r) => chrome.storage.local.get("bm_config", r));
    await new Promise<void>((r) => chrome.storage.local.set({ bm_config: { ...(current["bm_config"] ?? {}), github: trimmed } }, r));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function field(key: keyof GitHubConfig) {
    return (e: Event) => setConfig({ ...config, [key]: (e.target as HTMLInputElement).value });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>GitHub Access</h2>
      <label style={{ fontSize: 13 }}>
        Owner
        <input type="text" value={config.owner} onInput={field("owner")} required placeholder="username or org"
          style={{ display: "block", width: "100%", marginTop: 3, padding: "5px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }} />
      </label>
      <label style={{ fontSize: 13 }}>
        Repository
        <input type="text" value={config.repo} onInput={field("repo")} required placeholder="repo-name"
          style={{ display: "block", width: "100%", marginTop: 3, padding: "5px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }} />
      </label>
      <label style={{ fontSize: 13 }}>
        Branch
        <input type="text" value={config.branch} onInput={field("branch")} required
          style={{ display: "block", width: "100%", marginTop: 3, padding: "5px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }} />
      </label>
      <label style={{ fontSize: 13 }}>
        Personal Access Token
        <input type="password" value={config.pat} onInput={field("pat")} required placeholder="ghp_..."
          style={{ display: "block", width: "100%", marginTop: 3, padding: "5px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }} />
        <small style={{ color: "#6b7280" }}>Needs repo read/write scope.</small>
      </label>
      <button type="submit" style={{ padding: "7px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
        Save
      </button>
      {saved && <p style={{ color: "#16a34a", fontSize: 13, margin: 0 }}>Saved.</p>}
    </form>
  );
}
