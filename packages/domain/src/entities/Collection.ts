import { CollectionPath } from "../value-objects/CollectionPath.js";

export class Collection {
  constructor(
    public readonly path: CollectionPath,
    public name: string,
    public readonly parentPath: CollectionPath | null,
    public readonly createdAt: Date,
  ) {}

  equals(other: Collection): boolean {
    return this.path.equals(other.path);
  }
}
