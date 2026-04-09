import { DomainValidationError } from "../errors/DomainValidationError.js";

export class FaviconUrl {
  private constructor(private readonly value: string) {}

  static of(value: string): FaviconUrl {
    try {
      new URL(value);
    } catch {
      throw new DomainValidationError("FaviconUrl", "must be a valid URL");
    }
    return new FaviconUrl(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: FaviconUrl): boolean {
    return this.value === other.value;
  }
}
