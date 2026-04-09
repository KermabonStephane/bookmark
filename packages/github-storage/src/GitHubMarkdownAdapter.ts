import {
  Bookmark,
  BookmarkId,
  BookmarkUrl,
  Collection,
  CollectionPath,
  Tag,
  TagName,
} from "@bookmark/domain";
import type {
  BookmarkPage,
  BookmarkQuery,
  ImportResult,
  StoragePort,
} from "@bookmark/application";
import { GitHubApiClient, type GitHubConfig } from "./GitHubApiClient.js";
import { IndexManifest } from "./IndexManifest.js";
import { MarkdownSerializer } from "./MarkdownSerializer.js";

const INDEX_PATH = "bookmarks/index.json";

export class GitHubMarkdownAdapter implements StoragePort {
  private readonly api: GitHubApiClient;
  private readonly serializer = new MarkdownSerializer();
  private manifest: IndexManifest | null = null;
  private manifestSha: string | null = null;

  constructor(config: GitHubConfig) {
    this.api = new GitHubApiClient(config);
  }

  private async loadManifest(): Promise<IndexManifest> {
    if (this.manifest !== null) return this.manifest;

    const file = await this.api.getFile(INDEX_PATH);
    if (file === null) {
      this.manifest = new IndexManifest();
      this.manifestSha = null;
    } else {
      this.manifest = IndexManifest.fromJson(file.content);
      this.manifestSha = file.sha;
    }
    return this.manifest;
  }

  private async saveManifest(manifest: IndexManifest): Promise<void> {
    const result = await this.api.putFile(
      INDEX_PATH,
      manifest.toJson(),
      this.manifestSha,
      "chore: update bookmark index",
    );
    this.manifestSha = result.sha;
  }

  private bookmarkPath(bookmark: Bookmark): string {
    const collection = bookmark.collection.toString();
    const dir = collection
      ? `bookmarks/collections/${collection}`
      : "bookmarks/uncategorized";
    return `${dir}/${bookmark.id.toString()}.md`;
  }

  async findById(id: BookmarkId): Promise<Bookmark | null> {
    const manifest = await this.loadManifest();
    const entry = manifest.getById(id.toString());
    if (!entry) return null;

    const file = await this.api.getFile(entry.path);
    if (!file) return null;

    return this.serializer.deserialize(file.content);
  }

  async findAll(query: BookmarkQuery): Promise<BookmarkPage> {
    const manifest = await this.loadManifest();

    const results = manifest.search({
      search: query.search,
      tags: query.tags?.map((t) => t.toString()),
      collection: query.collection?.toString(),
    });

    const sorted = results.sort((a, b) => {
      const field = query.sortBy === "title" ? "title" : "updatedAt";
      const aVal = a[field];
      const bVal = b[field];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return query.sortOrder === "asc" ? cmp : -cmp;
    });

    const start = (query.page - 1) * query.pageSize;
    const pageEntries = sorted.slice(start, start + query.pageSize);

    const items = await Promise.all(
      pageEntries.map(async (entry) => {
        const file = await this.api.getFile(entry.path);
        return file ? this.serializer.deserialize(file.content) : null;
      }),
    );

    const validItems = items.filter((b): b is Bookmark => b !== null);

    return {
      items: validItems,
      total: sorted.length,
      page: query.page,
      pageSize: query.pageSize,
      hasMore: start + query.pageSize < sorted.length,
    };
  }

  async save(bookmark: Bookmark): Promise<void> {
    const manifest = await this.loadManifest();
    const path = this.bookmarkPath(bookmark);
    const existingEntry = manifest.getById(bookmark.id.toString());
    const existingSha = existingEntry?.sha ?? null;

    const content = this.serializer.serialize(bookmark);
    const result = await this.api.putFile(
      path,
      content,
      existingSha,
      `bookmark: save ${bookmark.title.toString()}`,
    );

    manifest.upsert(bookmark, path, result.sha);
    await this.saveManifest(manifest);
  }

  async delete(id: BookmarkId): Promise<void> {
    const manifest = await this.loadManifest();
    const entry = manifest.getById(id.toString());
    if (!entry) return;

    await this.api.deleteFile(entry.path, entry.sha, `bookmark: delete ${id.toString()}`);
    manifest.remove(id.toString());
    await this.saveManifest(manifest);
  }

  async exists(url: BookmarkUrl): Promise<boolean> {
    const manifest = await this.loadManifest();
    return manifest.getAll().some((e) => e.url === url.toString());
  }

  async findCollections(): Promise<Collection[]> {
    const manifest = await this.loadManifest();
    const paths = new Set(manifest.getAll().map((e) => e.collection).filter(Boolean));

    return Array.from(paths).map((p) => {
      const path = CollectionPath.of(p);
      return new Collection(path, path.toString().split("/").at(-1) ?? p, path.parent.isRoot() ? null : path.parent, new Date());
    });
  }

  async saveCollection(_collection: Collection): Promise<void> {
    // Collections are implicit (derived from bookmark paths); no-op here
  }

  async deleteCollection(_path: CollectionPath): Promise<void> {
    // Collections are implicit; moving all bookmarks out would remove the collection
  }

  async findAllTags(): Promise<Tag[]> {
    const manifest = await this.loadManifest();
    const tagNames = new Set(manifest.getAll().flatMap((e) => e.tags));
    return Array.from(tagNames).map((name) => new Tag(TagName.of(name)));
  }

  async exportAll(): Promise<Bookmark[]> {
    const manifest = await this.loadManifest();
    const all = await Promise.all(
      manifest.getAll().map(async (entry) => {
        const file = await this.api.getFile(entry.path);
        return file ? this.serializer.deserialize(file.content) : null;
      }),
    );
    return all.filter((b): b is Bookmark => b !== null);
  }

  async importAll(bookmarks: Bookmark[]): Promise<ImportResult> {
    let created = 0;
    let skipped = 0;
    const errors: { url: string; reason: string }[] = [];

    for (const bookmark of bookmarks) {
      try {
        const alreadyExists = await this.exists(bookmark.url);
        if (alreadyExists) {
          skipped++;
          continue;
        }
        await this.save(bookmark);
        created++;
      } catch (err) {
        errors.push({ url: bookmark.url.toString(), reason: String(err) });
      }
    }

    return { created, skipped, failed: errors.length, errors };
  }
}
