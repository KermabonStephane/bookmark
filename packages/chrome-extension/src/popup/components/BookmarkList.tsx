import type { Bookmark } from "@bookmark/domain";
import type { Container } from "../../composition/container.js";
import { BookmarkCard } from "./BookmarkCard.js";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  total: number;
  container: Container;
  onDeleted: () => void;
}

export function BookmarkList({ bookmarks, total, container, onDeleted }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <p style={{ color: "#6b7280", textAlign: "center", padding: "24px 0" }}>No bookmarks found.</p>;
  }

  return (
    <div>
      <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>{total} bookmark{total !== 1 ? "s" : ""}</p>
      {bookmarks.map((b) => (
        <BookmarkCard key={b.id.toString()} bookmark={b} container={container} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
