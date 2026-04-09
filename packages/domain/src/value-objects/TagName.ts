import { DomainValidationError } from "../errors/DomainValidationError.js";

const TAG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_LENGTH = 50;

export class TagName {
  private constructor(private readonly value: string) {}

  static of(value: string): TagName {
    const normalized = value.toLowerCase().trim();
    if (!TAG_REGEX.test(normalized)) {
      throw new DomainValidationError(
        "TagName",
        "must contain only lowercase alphanumeric characters and hyphens",
      );
    }
    if (normalized.length > MAX_LENGTH) {
      throw new DomainValidationError(
        "TagName",
        `must not exceed ${MAX_LENGTH} characters`,
      );
    }
    return new TagName(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TagName): boolean {
    return this.value === other.value;
  }
}
