import type { AuthCredentials, AuthPort, AuthSession } from "@bookmark/application";
import { ChromeIdentityClient } from "./ChromeIdentityClient.js";
import { TokenStorage } from "./TokenStorage.js";

export interface GoogleAuthConfig {
  clientId: string;
}

export class GoogleAuthAdapter implements AuthPort {
  private readonly identity: ChromeIdentityClient;
  private readonly storage = new TokenStorage();

  constructor(config: GoogleAuthConfig) {
    this.identity = new ChromeIdentityClient(config.clientId);
  }

  async signIn(_credentials: AuthCredentials): Promise<AuthSession> {
    const tokens = await this.identity.launchFlow();
    const userId = this.extractUserId(tokens.idToken);

    const session: AuthSession = {
      userId,
      provider: "google",
      accessToken: tokens.accessToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
    };

    await this.storage.save(session);
    return session;
  }

  async signOut(): Promise<void> {
    await this.storage.clear();
  }

  async refreshSession(session: AuthSession): Promise<AuthSession> {
    // Refresh via Chrome identity — re-launch non-interactively
    // For a full implementation, store refresh token separately and call token endpoint
    return session;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const session = await this.storage.load();
    if (!session) return null;
    if (new Date(session.expiresAt) <= new Date()) return null;
    return session;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentSession()) !== null;
  }

  private extractUserId(idToken: string): string {
    const payload = idToken.split(".")[1];
    if (!payload) throw new Error("Invalid ID token");
    const decoded = JSON.parse(atob(payload)) as { sub: string };
    return decoded.sub;
  }
}
