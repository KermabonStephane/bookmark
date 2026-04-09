import { DomainValidationError } from "../errors/DomainValidationError.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class BookmarkId {
  private constructor(private readonly value: string) {}

  static of(value: string): BookmarkId {
    if (!UUID_REGEX.test(value)) {
      throw new DomainValidationError("BookmarkId", "must be a valid UUID v4");
    }
    return new BookmarkId(value);
  }

  static generate(): BookmarkId {
    return new BookmarkId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: BookmarkId): boolean {
    return this.value === other.value;
  }
}
