import type { AuthCredentials, AuthPort, AuthSession } from "@bookmark/application";
import { FirebaseAuthClient } from "./FirebaseAuthClient.js";
import { TokenStorage } from "./TokenStorage.js";
import type { BrowserStorage } from "./TokenStorage.js";

export interface EmailAuthConfig {
  firebaseApiKey: string;
  storage: BrowserStorage;
}

export class EmailPasswordAuthAdapter implements AuthPort {
  private readonly client: FirebaseAuthClient;
  private readonly storage: TokenStorage;

  constructor(config: EmailAuthConfig) {
    this.client = new FirebaseAuthClient(config.firebaseApiKey);
    this.storage = new TokenStorage(config.storage);
  }

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    if (credentials.type !== "email") {
      throw new Error("EmailPasswordAuthAdapter only handles email credentials");
    }

    const data = await this.client.signInWithEmailPassword(
      credentials.email,
      credentials.password,
    );

    const session: AuthSession = {
      userId: data.localId,
      provider: "email",
      accessToken: data.idToken,
      expiresAt: new Date(Date.now() + Number(data.expiresIn) * 1000),
    };

    await this.storage.saveSession(session);
    await this.storage.saveRefreshToken(data.refreshToken);

    return session;
  }

  async signOut(): Promise<void> {
    await this.storage.clear();
  }

  async refreshSession(session: AuthSession): Promise<AuthSession> {
    const refreshToken = await this.storage.loadRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const data = await this.client.refreshToken(refreshToken);

    const newSession: AuthSession = {
      userId: data.user_id,
      provider: "email",
      accessToken: data.id_token,
      expiresAt: new Date(Date.now() + Number(data.expires_in) * 1000),
    };

    await this.storage.saveSession(newSession);
    await this.storage.saveRefreshToken(data.refresh_token);

    return newSession;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const session = await this.storage.loadSession();
    if (!session) return null;
    if (new Date(session.expiresAt) <= new Date()) {
      return this.refreshSession(session).catch(() => null);
    }
    return session;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentSession()) !== null;
  }
}
