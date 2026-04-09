export class BookmarkNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Bookmark not found: ${id}`);
    this.name = "BookmarkNotFoundError";
  }
}
