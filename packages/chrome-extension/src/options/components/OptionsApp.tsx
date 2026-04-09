import { useState } from "preact/hooks";
import { StorageConfig } from "./StorageConfig.js";
import { AuthConfig } from "./AuthConfig.js";
import { SyncStatus } from "./SyncStatus.js";

type Section = "storage" | "auth" | "sync";

export function OptionsApp() {
  const [section, setSection] = useState<Section>("storage");

  return (
    <div>
      <h1>Bookmark Manager</h1>
      <nav style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
        {(["storage", "auth", "sync"] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{ fontWeight: section === s ? "bold" : "normal", background: "none", border: "none", cursor: "pointer", textTransform: "capitalize" }}
          >
            {s}
          </button>
        ))}
      </nav>
      {section === "storage" && <StorageConfig />}
      {section === "auth" && <AuthConfig />}
      {section === "sync" && <SyncStatus />}
    </div>
  );
}
