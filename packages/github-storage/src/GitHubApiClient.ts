import { GitHubApiError } from "./errors/GitHubApiError.js";
import { RateLimitError } from "./errors/RateLimitError.js";
import { ConflictError } from "./errors/ConflictError.js";

export interface GitHubConfig {
  owner: string;
  repo: string;
  pat: string;
  branch?: string;
}

export interface FileContent {
  content: string;
  sha: string;
  path: string;
}

export interface WriteResult {
  sha: string;
}

export class GitHubApiClient {
  private readonly baseUrl: string;
  private readonly branch: string;

  constructor(private readonly config: GitHubConfig) {
    this.baseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}`;
    this.branch = config.branch ?? "main";
  }

  async getFile(path: string): Promise<FileContent | null> {
    const response = await this.request("GET", `/contents/${path}?ref=${this.branch}`);
    if (response.status === 404) return null;
    await this.assertOk(response, `/contents/${path}`);
    const data = await response.json() as { content: string; sha: string; path: string };
    return {
      content: atob(data.content.replace(/\n/g, "")),
      sha: data.sha,
      path: data.path,
    };
  }

  async putFile(path: string, content: string, sha: string | null, message: string): Promise<WriteResult> {
    const body: Record<string, unknown> = {
      message,
      content: btoa(content),
      branch: this.branch,
    };
    if (sha !== null) body["sha"] = sha;

    const response = await this.request("PUT", `/contents/${path}`, body);

    if (response.status === 409) {
      throw new ConflictError(path);
    }
    await this.assertOk(response, `/contents/${path}`);

    const data = await response.json() as { content: { sha: string } };
    return { sha: data.content.sha };
  }

  async deleteFile(path: string, sha: string, message: string): Promise<void> {
    const response = await this.request("DELETE", `/contents/${path}`, {
      message,
      sha,
      branch: this.branch,
    });
    await this.assertOk(response, `/contents/${path}`);
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.pat}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 403 || response.status === 429) {
      const resetHeader = response.headers.get("X-RateLimit-Reset");
      const resetAt = resetHeader ? new Date(Number(resetHeader) * 1000) : new Date();
      throw new RateLimitError(resetAt);
    }

    return response;
  }

  private async assertOk(response: Response, endpoint: string): Promise<void> {
    if (!response.ok) {
      const text = await response.text();
      throw new GitHubApiError(response.status, endpoint, text);
    }
  }
}
