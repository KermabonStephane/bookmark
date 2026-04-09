export class GitHubApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    message: string,
  ) {
    super(`GitHub API error ${status} on ${endpoint}: ${message}`);
    this.name = "GitHubApiError";
  }
}
