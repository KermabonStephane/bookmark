import { describe, expect, it } from "vitest";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { TagName } from "./TagName.js";

describe("TagName", () => {
  it("accepts lowercase alphanumeric", () => {
    expect(TagName.of("typescript").toString()).toBe("typescript");
  });

  it("accepts hyphenated names", () => {
    expect(TagName.of("clean-arch").toString()).toBe("clean-arch");
  });

  it("normalizes to lowercase", () => {
    expect(TagName.of("TypeScript").toString()).toBe("typescript");
  });

  it("rejects spaces", () => {
    expect(() => TagName.of("my tag")).toThrow(DomainValidationError);
  });

  it("rejects leading hyphens", () => {
    expect(() => TagName.of("-tag")).toThrow(DomainValidationError);
  });

  it("rejects names over 50 chars", () => {
    expect(() => TagName.of("a".repeat(51))).toThrow(DomainValidationError);
  });
});
