import { describe, expect, it } from "vitest";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { BookmarkTitle } from "./BookmarkTitle.js";

describe("BookmarkTitle", () => {
  it("accepts a normal title", () => {
    expect(BookmarkTitle.of("My Article").toString()).toBe("My Article");
  });

  it("trims whitespace", () => {
    expect(BookmarkTitle.of("  Hello  ").toString()).toBe("Hello");
  });

  it("rejects empty string", () => {
    expect(() => BookmarkTitle.of("   ")).toThrow(DomainValidationError);
  });

  it("rejects title over 500 chars", () => {
    expect(() => BookmarkTitle.of("a".repeat(501))).toThrow(DomainValidationError);
  });
});
