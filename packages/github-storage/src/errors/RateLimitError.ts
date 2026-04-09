export class RateLimitError extends Error {
  constructor(public readonly resetAt: Date) {
    super(`GitHub API rate limit exceeded. Resets at ${resetAt.toISOString()}`);
    this.name = "RateLimitError";
  }
}
