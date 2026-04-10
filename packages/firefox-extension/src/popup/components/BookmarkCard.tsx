import type { Bookmark } from "@bookmark/domain";
import type { Container } from "../../composition/container.js";

interface BookmarkCardProps {
  bookmark: Bookmark;
  container: Container;
  onDeleted: () => void;
}

export function BookmarkCard({ bookmark, container, onDeleted }: BookmarkCardProps) {
  async function handleDelete(e: Event) {
    e.preventDefault();
    if (!confirm(`Delete "${bookmark.title.toString()}"?`)) return;
    try {
      await container.deleteBookmark.execute({ id: bookmark.id });
      onDeleted();
    } catch (err) {
      alert(`Failed to delete: ${err}`);
    }
  }

  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <a
          href={bookmark.url.toString()}
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 500, color: "#1d4ed8", textDecoration: "none", flex: 1 }}
        >
          {bookmark.faviconUrl && (
            <img
              src={bookmark.faviconUrl.toString()}
              width={14}
              height={14}
              style={{ marginRight: 4, verticalAlign: "middle" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          {bookmark.title.toString()}
        </a>
        <button onClick={handleDelete} style={{ marginLeft: 8, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
          ×
        </button>
      </div>
      {bookmark.tags.length > 0 && (
        <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {bookmark.tags.map((t) => (
            <span
              key={t.name.toString()}
              style={{ fontSize: 11, background: "#eff6ff", color: "#3b82f6", padding: "1px 6px", borderRadius: 10 }}
            >
              {t.name.toString()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
