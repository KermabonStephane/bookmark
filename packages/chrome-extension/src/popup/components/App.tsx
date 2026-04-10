import { useState } from "preact/hooks";
import type { Container } from "../../composition/container.js";
import { QuickSave } from "./QuickSave.js";
import { SearchBar } from "./SearchBar.js";
import { BookmarkList } from "./BookmarkList.js";
import { ConfigTab } from "./ConfigTab.js";
import type { Bookmark } from "@bookmark/domain";
import type { BookmarkQuery } from "@bookmark/application";
import { DEFAULT_QUERY } from "@bookmark/application";

type Tab = "search" | "add" | "config";

interface AppProps {
  container?: Container;
  initialTab?: Tab;
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="17" y1="17" x2="22" y2="22" />
    </svg>
  );
}

function IconAdd() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}

function IconConfig() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const TAB_ICONS: Record<Tab, () => preact.JSX.Element> = {
  search: IconSearch,
  add: IconAdd,
  config: IconConfig,
};

export function App({ container, initialTab = "search" }: AppProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [results, setResults] = useState<Bookmark[]>([]);
  const [total, setTotal] = useState(0);

  async function handleSearch(query: BookmarkQuery) {
    if (!container) return;
    const page = await container.searchBookmarks.execute(query);
    setResults(page.items);
    setTotal(page.total);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <main style={{ flex: 1, overflow: "auto", padding: "12px" }}>
        {tab === "search" && container && (
          <>
            <SearchBar defaultQuery={DEFAULT_QUERY} onSearch={handleSearch} />
            <BookmarkList
              bookmarks={results}
              total={total}
              container={container}
              onDeleted={() => handleSearch(DEFAULT_QUERY)}
            />
          </>
        )}
        {tab === "add" && container && <QuickSave container={container} />}
        {tab === "config" && <ConfigTab />}
      </main>

      <nav style={{
        display: "flex",
        borderTop: "1px solid #e5e7eb",
        background: "#fff",
      }}>
        {(["search", "add", "config"] as Tab[]).map((t) => {
          const Icon = TAB_ICONS[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: active ? "#2563eb" : "#9ca3af",
                borderTop: active ? "2px solid #2563eb" : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                transition: "color 0.15s",
              }}
            >
              <Icon />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
