import { useEffect, useState } from "preact/hooks";

export function SyncStatus() {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get("bm_last_sync", (r) => {
      const val = r["bm_last_sync"] as string | undefined;
      setLastSync(val ? new Date(val).toLocaleString() : null);
    });
  }, []);

  async function handleSyncNow() {
    setSyncing(true);
    setResult(null);
    try {
      const res = await chrome.runtime.sendMessage({ type: "SYNC_NOW" }) as {
        created: number; updated: number; syncedAt: string;
      };
      setLastSync(new Date(res.syncedAt).toLocaleString());
      setResult(`Sync complete — ${res.created} created, ${res.updated} updated.`);
    } catch (err) {
      setResult(`Sync failed: ${err}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ fontSize: 16 }}>Sync</h2>
      <p>Last synced: {lastSync ?? "Never"}</p>
      <p style={{ color: "#6b7280", fontSize: 12 }}>Auto-syncs every 15 minutes when the extension is active.</p>
      <button onClick={handleSyncNow} disabled={syncing}>
        {syncing ? "Syncing..." : "Sync Now"}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}
