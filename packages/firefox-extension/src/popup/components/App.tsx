import { useState } from "preact/hooks";
import type { Container } from "../../composition/container.js";
import { QuickSave } from "./QuickSave.js";
import { SearchBar } from "./SearchBar.js";
import { BookmarkList } from "./BookmarkList.js";
import type { Bookmark } from "@bookmark/domain";
import type { BookmarkQuery } from "@bookmark/application";
import { DEFAULT_QUERY } from "@bookmark/application";

interface AppProps {
  container: Container;
}

export function App({ container }: AppProps) {
  const [view, setView] = useState<"save" | "search">("save");
  const [results, setResults] = useState<Bookmark[]>([]);
  const [total, setTotal] = useState(0);

  async function handleSearch(query: BookmarkQuery) {
    const page = await container.searchBookmarks.execute(query);
    setResults(page.items);
    setTotal(page.total);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <header style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
        <button onClick={() => setView("save")} style={{ fontWeight: view === "save" ? "bold" : "normal" }}>
          Save
        </button>
        <button onClick={() => setView("search")} style={{ fontWeight: view === "search" ? "bold" : "normal" }}>
          Search
        </button>
      </header>

      <main style={{ flex: 1, overflow: "auto", padding: "12px" }}>
        {view === "save" ? (
          <QuickSave container={container} />
        ) : (
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
      </main>
    </div>
  );
}
