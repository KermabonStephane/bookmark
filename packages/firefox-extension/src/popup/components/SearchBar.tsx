import { useState } from "preact/hooks";
import type { BookmarkQuery } from "@bookmark/application";

interface SearchBarProps {
  defaultQuery: BookmarkQuery;
  onSearch: (query: BookmarkQuery) => void;
}

export function SearchBar({ defaultQuery, onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    setSearch(value);
    onSearch({ ...defaultQuery, search: value, page: 1 });
  }

  return (
    <input
      type="search"
      placeholder="Search bookmarks..."
      value={search}
      onInput={handleInput}
      style={{ width: "100%", padding: "6px 8px", marginBottom: 12, border: "1px solid #d1d5db", borderRadius: 4 }}
    />
  );
}
