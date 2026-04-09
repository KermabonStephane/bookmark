import { describe, expect, it } from "vitest";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { CollectionPath } from "./CollectionPath.js";

describe("CollectionPath", () => {
  it("root path from empty string", () => {
    expect(CollectionPath.of("").isRoot()).toBe(true);
  });

  it("root path from slash", () => {
    expect(CollectionPath.of("/").isRoot()).toBe(true);
  });

  it("parses a nested path", () => {
    const path = CollectionPath.of("dev/typescript");
    expect(path.toString()).toBe("dev/typescript");
    expect(path.depth).toBe(2);
  });

  it("strips leading/trailing slashes", () => {
    expect(CollectionPath.of("/dev/ts/").toString()).toBe("dev/ts");
  });

  it("rejects uppercase segments", () => {
    expect(() => CollectionPath.of("Dev/Ts")).toThrow(DomainValidationError);
  });

  it("gets parent", () => {
    expect(CollectionPath.of("dev/typescript").parent.toString()).toBe("dev");
  });

  it("builds child path", () => {
    expect(CollectionPath.of("dev").child("typescript").toString()).toBe("dev/typescript");
  });
});
