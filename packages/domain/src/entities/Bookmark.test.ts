import { describe, expect, it } from "vitest";
import { Bookmark } from "./Bookmark.js";
import { Tag } from "./Tag.js";
import { BookmarkTitle } from "../value-objects/BookmarkTitle.js";
import { BookmarkUrl } from "../value-objects/BookmarkUrl.js";
import { CollectionPath } from "../value-objects/CollectionPath.js";
import { TagName } from "../value-objects/TagName.js";

function makeBookmark(): Bookmark {
  return Bookmark.create({
    url: BookmarkUrl.of("https://example.com"),
    title: BookmarkTitle.of("Example"),
    description: "A description",
    notes: "",
    tags: [],
    collection: CollectionPath.ROOT,
    faviconUrl: null,
  });
}

describe("Bookmark", () => {
  it("creates with generated id and timestamps", () => {
    const b = makeBookmark();
    expect(b.id.toString()).toMatch(/^[0-9a-f-]{36}$/);
    expect(b.createdAt).toBeInstanceOf(Date);
    expect(b.updatedAt).toBeInstanceOf(Date);
  });

  it("adds a tag", () => {
    const b = makeBookmark();
    b.addTag(new Tag(TagName.of("typescript")));
    expect(b.tags).toHaveLength(1);
  });

  it("does not add duplicate tags", () => {
    const b = makeBookmark();
    b.addTag(new Tag(TagName.of("typescript")));
    b.addTag(new Tag(TagName.of("typescript")));
    expect(b.tags).toHaveLength(1);
  });

  it("removes a tag", () => {
    const b = makeBookmark();
    b.addTag(new Tag(TagName.of("typescript")));
    b.removeTag(TagName.of("typescript"));
    expect(b.tags).toHaveLength(0);
  });

  it("moves to a new collection", () => {
    const b = makeBookmark();
    b.moveTo(CollectionPath.of("dev/ts"));
    expect(b.collection.toString()).toBe("dev/ts");
  });

  it("updates fields", () => {
    const b = makeBookmark();
    const newTitle = BookmarkTitle.of("Updated Title");
    b.update({ title: newTitle, description: "New desc" });
    expect(b.title.toString()).toBe("Updated Title");
    expect(b.description).toBe("New desc");
  });

  it("updatedAt changes on mutation", async () => {
    const b = makeBookmark();
    const before = b.updatedAt.getTime();
    await new Promise((r) => setTimeout(r, 5));
    b.addTag(new Tag(TagName.of("new-tag")));
    expect(b.updatedAt.getTime()).toBeGreaterThan(before);
  });
});
