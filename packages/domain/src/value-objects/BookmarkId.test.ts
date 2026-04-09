import { describe, expect, it } from "vitest";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { BookmarkId } from "./BookmarkId.js";

describe("BookmarkId", () => {
  it("accepts a valid UUID v4", () => {
    const id = BookmarkId.of("550e8400-e29b-41d4-a716-446655440000");
    expect(id.toString()).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("rejects an invalid UUID", () => {
    expect(() => BookmarkId.of("not-a-uuid")).toThrow(DomainValidationError);
  });

  it("generates a unique id", () => {
    const a = BookmarkId.generate();
    const b = BookmarkId.generate();
    expect(a.equals(b)).toBe(false);
  });

  it("equals itself", () => {
    const id = BookmarkId.generate();
    expect(id.equals(BookmarkId.of(id.toString()))).toBe(true);
  });
});
