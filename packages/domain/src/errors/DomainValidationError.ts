export class DomainValidationError extends Error {
  constructor(
    public readonly field: string,
    public readonly reason: string,
  ) {
    super(`Validation failed for '${field}': ${reason}`);
    this.name = "DomainValidationError";
  }
}
