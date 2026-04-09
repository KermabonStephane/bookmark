import type { Bookmark } from "@bookmark/domain";

export interface IndexEntry {
  id: string;
  url: string;
  title: string;
  tags: string[];
  collection: string;
  updatedAt: string;
  sha: string;
  path: string;
}

export class IndexManifest {
  private entries: Map<string, IndexEntry>;

  constructor(entries: IndexEntry[] = []) {
    this.entries = new Map(entries.map((e) => [e.id, e]));
  }

  static fromJson(json: string): IndexManifest {
    const entries = JSON.parse(json) as IndexEntry[];
    return new IndexManifest(entries);
  }

  toJson(): string {
    return JSON.stringify(Array.from(this.entries.values()), null, 2);
  }

  upsert(bookmark: Bookmark, filePath: string, sha: string): void {
    this.entries.set(bookmark.id.toString(), {
      id: bookmark.id.toString(),
      url: bookmark.url.toString(),
      title: bookmark.title.toString(),
      tags: bookmark.tags.map((t) => t.name.toString()),
      collection: bookmark.collection.toString(),
      updatedAt: bookmark.updatedAt.toISOString(),
      sha,
      path: filePath,
    });
  }

  remove(id: string): void {
    this.entries.delete(id);
  }

  getAll(): IndexEntry[] {
    return Array.from(this.entries.values());
  }

  getById(id: string): IndexEntry | undefined {
    return this.entries.get(id);
  }

  search(query: { search?: string; tags?: string[]; collection?: string }): IndexEntry[] {
    return this.getAll().filter((entry) => {
      if (query.search) {
        const q = query.search.toLowerCase();
        const matches =
          entry.title.toLowerCase().includes(q) ||
          entry.url.toLowerCase().includes(q) ||
          entry.tags.some((t) => t.includes(q));
        if (!matches) return false;
      }
      if (query.tags && query.tags.length > 0) {
        if (!query.tags.every((t) => entry.tags.includes(t))) return false;
      }
      if (query.collection) {
        if (!entry.collection.startsWith(query.collection)) return false;
      }
      return true;
    });
  }
}
