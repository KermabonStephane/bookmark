import type { AuthSession } from "@bookmark/application";

const SESSION_KEY = "bm_auth_session_email";
const REFRESH_KEY = "bm_auth_refresh_email";

export class TokenStorage {
  async saveSession(session: AuthSession): Promise<void> {
    await chrome.storage.local.set({ [SESSION_KEY]: session });
  }

  async loadSession(): Promise<AuthSession | null> {
    const result = await chrome.storage.local.get(SESSION_KEY);
    return (result[SESSION_KEY] as AuthSession | undefined) ?? null;
  }

  async saveRefreshToken(token: string): Promise<void> {
    await chrome.storage.local.set({ [REFRESH_KEY]: token });
  }

  async loadRefreshToken(): Promise<string | null> {
    const result = await chrome.storage.local.get(REFRESH_KEY);
    return (result[REFRESH_KEY] as string | undefined) ?? null;
  }

  async clear(): Promise<void> {
    await chrome.storage.local.remove([SESSION_KEY, REFRESH_KEY]);
  }
}
