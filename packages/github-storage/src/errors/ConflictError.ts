export class ConflictError extends Error {
  constructor(public readonly path: string) {
    super(`Conflict writing to ${path}: sha is stale, file was modified remotely`);
    this.name = "ConflictError";
  }
}
