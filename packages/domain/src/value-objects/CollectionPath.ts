import { DomainValidationError } from "../errors/DomainValidationError.js";

const SEGMENT_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class CollectionPath {
  static readonly ROOT = new CollectionPath([]);

  private constructor(private readonly segments: string[]) {}

  static of(value: string): CollectionPath {
    if (value === "" || value === "/") {
      return CollectionPath.ROOT;
    }
    const normalized = value.replace(/^\/|\/$/g, "");
    const parts = normalized.split("/");
    for (const part of parts) {
      if (!SEGMENT_REGEX.test(part)) {
        throw new DomainValidationError(
          "CollectionPath",
          `segment '${part}' must contain only lowercase alphanumeric characters and hyphens`,
        );
      }
    }
    return new CollectionPath(parts);
  }

  get parent(): CollectionPath {
    if (this.segments.length === 0) return CollectionPath.ROOT;
    return new CollectionPath(this.segments.slice(0, -1));
  }

  get depth(): number {
    return this.segments.length;
  }

  isRoot(): boolean {
    return this.segments.length === 0;
  }

  child(segment: string): CollectionPath {
    return CollectionPath.of([...this.segments, segment].join("/"));
  }

  toString(): string {
    return this.segments.join("/");
  }

  equals(other: CollectionPath): boolean {
    return this.toString() === other.toString();
  }
}
