import { describe, expect, it } from "vitest";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { BookmarkUrl } from "./BookmarkUrl.js";

describe("BookmarkUrl", () => {
  it("accepts https URL", () => {
    const url = BookmarkUrl.of("https://example.com/path?q=1");
    expect(url.toString()).toBe("https://example.com/path?q=1");
  });

  it("accepts http URL", () => {
    expect(() => BookmarkUrl.of("http://example.com")).not.toThrow();
  });

  it("rejects ftp protocol", () => {
    expect(() => BookmarkUrl.of("ftp://example.com")).toThrow(DomainValidationError);
  });

  it("rejects malformed URL", () => {
    expect(() => BookmarkUrl.of("not a url")).toThrow(DomainValidationError);
  });

  it("equals same URL", () => {
    const a = BookmarkUrl.of("https://example.com");
    const b = BookmarkUrl.of("https://example.com");
    expect(a.equals(b)).toBe(true);
  });
});
