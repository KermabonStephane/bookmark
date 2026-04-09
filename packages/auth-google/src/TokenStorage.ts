import type { AuthSession } from "@bookmark/application";

const STORAGE_KEY = "bm_auth_session_google";

export class TokenStorage {
  async save(session: AuthSession): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: session });
  }

  async load(): Promise<AuthSession | null> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as AuthSession | undefined) ?? null;
  }

  async clear(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY);
  }
}
