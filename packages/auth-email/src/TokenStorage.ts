import type { AuthSession } from "@bookmark/application";

const SESSION_KEY = "bm_auth_session_email";
const REFRESH_KEY = "bm_auth_refresh_email";

/**
 * Minimal async key-value storage interface.
 * Implemented by chrome.storage.local and browser.storage.local (webextension-polyfill).
 */
export interface BrowserStorage {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

export class TokenStorage {
  constructor(private readonly storage: BrowserStorage) {}

  async saveSession(session: AuthSession): Promise<void> {
    await this.storage.set({ [SESSION_KEY]: session });
  }

  async loadSession(): Promise<AuthSession | null> {
    const result = await this.storage.get(SESSION_KEY);
    return (result[SESSION_KEY] as AuthSession | undefined) ?? null;
  }

  async saveRefreshToken(token: string): Promise<void> {
    await this.storage.set({ [REFRESH_KEY]: token });
  }

  async loadRefreshToken(): Promise<string | null> {
    const result = await this.storage.get(REFRESH_KEY);
    return (result[REFRESH_KEY] as string | undefined) ?? null;
  }

  async clear(): Promise<void> {
    await this.storage.remove([SESSION_KEY, REFRESH_KEY]);
  }
}
