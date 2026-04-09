import matter from "gray-matter";
import {
  Bookmark,
  BookmarkId,
  BookmarkTitle,
  BookmarkUrl,
  CollectionPath,
  FaviconUrl,
  Tag,
  TagName,
} from "@bookmark/domain";

export class MarkdownSerializer {
  serialize(bookmark: Bookmark): string {
    const frontmatter = {
      id: bookmark.id.toString(),
      url: bookmark.url.toString(),
      title: bookmark.title.toString(),
      tags: bookmark.tags.map((t) => t.name.toString()),
      collection: bookmark.collection.toString() || null,
      favicon_url: bookmark.faviconUrl?.toString() ?? null,
      created_at: bookmark.createdAt.toISOString(),
      updated_at: bookmark.updatedAt.toISOString(),
    };

    const sections: string[] = [];
    if (bookmark.description) {
      sections.push(`## Description\n${bookmark.description}`);
    }
    if (bookmark.notes) {
      sections.push(`## Notes\n${bookmark.notes}`);
    }

    return matter.stringify(sections.join("\n\n"), frontmatter);
  }

  deserialize(raw: string): Bookmark {
    const { data, content } = matter(raw);

    const description = this.extractSection(content, "Description");
    const notes = this.extractSection(content, "Notes");

    return new Bookmark({
      id: BookmarkId.of(String(data["id"])),
      url: BookmarkUrl.of(String(data["url"])),
      title: BookmarkTitle.of(String(data["title"])),
      description: description ?? "",
      notes: notes ?? "",
      tags: (Array.isArray(data["tags"]) ? data["tags"] : []).map(
        (t: unknown) => new Tag(TagName.of(String(t))),
      ),
      collection: data["collection"]
        ? CollectionPath.of(String(data["collection"]))
        : CollectionPath.ROOT,
      faviconUrl: data["favicon_url"] ? FaviconUrl.of(String(data["favicon_url"])) : null,
      createdAt: new Date(String(data["created_at"])),
      updatedAt: new Date(String(data["updated_at"])),
    });
  }

  private extractSection(content: string, heading: string): string | null {
    const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = regex.exec(content.trim());
    return match?.[1]?.trim() ?? null;
  }
}
