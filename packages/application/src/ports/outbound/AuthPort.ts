export type AuthCredentials =
  | { type: "google" }
  | { type: "email"; email: string; password: string };

export interface AuthSession {
  userId: string;
  provider: "google" | "email";
  accessToken: string;
  expiresAt: Date;
}

export interface AuthPort {
  signIn(credentials: AuthCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  refreshSession(session: AuthSession): Promise<AuthSession>;
  getCurrentSession(): Promise<AuthSession | null>;
  isAuthenticated(): Promise<boolean>;
}
