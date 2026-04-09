import { BookmarkId } from "../value-objects/BookmarkId.js";
import { BookmarkTitle } from "../value-objects/BookmarkTitle.js";
import { BookmarkUrl } from "../value-objects/BookmarkUrl.js";
import { CollectionPath } from "../value-objects/CollectionPath.js";
import { FaviconUrl } from "../value-objects/FaviconUrl.js";
import { TagName } from "../value-objects/TagName.js";
import { Tag } from "./Tag.js";

export interface BookmarkProps {
  id: BookmarkId;
  url: BookmarkUrl;
  title: BookmarkTitle;
  description: string;
  notes: string;
  tags: Tag[];
  collection: CollectionPath;
  faviconUrl: FaviconUrl | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkUpdateFields {
  title?: BookmarkTitle;
  description?: string;
  notes?: string;
  collection?: CollectionPath;
  faviconUrl?: FaviconUrl | null;
}

export class Bookmark {
  readonly id: BookmarkId;
  readonly url: BookmarkUrl;
  title: BookmarkTitle;
  description: string;
  notes: string;
  private _tags: Tag[];
  collection: CollectionPath;
  faviconUrl: FaviconUrl | null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: BookmarkProps) {
    this.id = props.id;
    this.url = props.url;
    this.title = props.title;
    this.description = props.description;
    this.notes = props.notes;
    this._tags = [...props.tags];
    this.collection = props.collection;
    this.faviconUrl = props.faviconUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get tags(): ReadonlyArray<Tag> {
    return this._tags;
  }

  static create(props: Omit<BookmarkProps, "id" | "createdAt" | "updatedAt">): Bookmark {
    const now = new Date();
    return new Bookmark({
      ...props,
      id: BookmarkId.generate(),
      createdAt: now,
      updatedAt: now,
    });
  }

  addTag(tag: Tag): void {
    if (!this._tags.some((t) => t.name.equals(tag.name))) {
      this._tags.push(tag);
      this.touch();
    }
  }

  removeTag(tagName: TagName): void {
    const before = this._tags.length;
    this._tags = this._tags.filter((t) => !t.name.equals(tagName));
    if (this._tags.length !== before) {
      this.touch();
    }
  }

  moveTo(collection: CollectionPath): void {
    this.collection = collection;
    this.touch();
  }

  update(fields: BookmarkUpdateFields): void {
    if (fields.title !== undefined) this.title = fields.title;
    if (fields.description !== undefined) this.description = fields.description;
    if (fields.notes !== undefined) this.notes = fields.notes;
    if (fields.collection !== undefined) this.collection = fields.collection;
    if ("faviconUrl" in fields) this.faviconUrl = fields.faviconUrl ?? null;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
