export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  idToken: string;
}

export class ChromeIdentityClient {
  constructor(private readonly clientId: string) {}

  async launchFlow(): Promise<OAuthTokens> {
    const redirectUrl = chrome.identity.getRedirectURL();
    const authUrl = this.buildAuthUrl(redirectUrl);

    const responseUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        { url: authUrl, interactive: true },
        (responseUrl) => {
          if (chrome.runtime.lastError || !responseUrl) {
            reject(chrome.runtime.lastError ?? new Error("No response URL"));
          } else {
            resolve(responseUrl);
          }
        },
      );
    });

    const code = this.extractCode(responseUrl);
    return this.exchangeCode(code, redirectUrl);
  }

  private buildAuthUrl(redirectUrl: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUrl,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  private extractCode(responseUrl: string): string {
    const url = new URL(responseUrl);
    const code = url.searchParams.get("code");
    if (!code) throw new Error("No authorization code in response URL");
    return code;
  }

  private async exchangeCode(code: string, redirectUrl: string): Promise<OAuthTokens> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.clientId,
        code,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${await response.text()}`);
    }

    const data = await response.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      id_token: string;
    };

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      idToken: data.id_token,
    };
  }
}
