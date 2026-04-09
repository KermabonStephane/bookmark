import { DomainValidationError } from "../errors/DomainValidationError.js";

const MAX_LENGTH = 500;

export class BookmarkTitle {
  private constructor(private readonly value: string) {}

  static of(value: string): BookmarkTitle {
    if (value.trim().length === 0) {
      throw new DomainValidationError("BookmarkTitle", "must not be empty");
    }
    if (value.length > MAX_LENGTH) {
      throw new DomainValidationError(
        "BookmarkTitle",
        `must not exceed ${MAX_LENGTH} characters`,
      );
    }
    return new BookmarkTitle(value.trim());
  }

  toString(): string {
    return this.value;
  }

  equals(other: BookmarkTitle): boolean {
    return this.value === other.value;
  }
}
