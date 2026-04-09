import { DomainValidationError } from "../errors/DomainValidationError.js";

export class BookmarkUrl {
  private constructor(private readonly value: string) {}

  static of(value: string): BookmarkUrl {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      throw new DomainValidationError("BookmarkUrl", "must be a valid URL");
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new DomainValidationError(
        "BookmarkUrl",
        "must use http or https protocol",
      );
    }
    return new BookmarkUrl(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: BookmarkUrl): boolean {
    return this.value === other.value;
  }
}
