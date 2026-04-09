export interface FirebaseSignInResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

export interface FirebaseRefreshResponse {
  id_token: string;
  refresh_token: string;
  expires_in: string;
  user_id: string;
}

export class FirebaseAuthClient {
  constructor(private readonly apiKey: string) {}

  async signInWithEmailPassword(
    email: string,
    password: string,
  ): Promise<FirebaseSignInResponse> {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    if (!response.ok) {
      const error = await response.json() as { error: { message: string } };
      throw new Error(`Firebase sign-in failed: ${error.error.message}`);
    }

    return response.json() as Promise<FirebaseSignInResponse>;
  }

  async refreshToken(refreshToken: string): Promise<FirebaseRefreshResponse> {
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to refresh Firebase token");
    }

    return response.json() as Promise<FirebaseRefreshResponse>;
  }
}
