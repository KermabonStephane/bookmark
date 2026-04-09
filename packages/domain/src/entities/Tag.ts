import { TagName } from "../value-objects/TagName.js";

export class Tag {
  constructor(
    public readonly name: TagName,
    public color: string | null = null,
  ) {}

  equals(other: Tag): boolean {
    return this.name.equals(other.name);
  }
}
