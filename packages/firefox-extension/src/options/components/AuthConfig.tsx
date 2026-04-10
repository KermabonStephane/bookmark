import browser from "webextension-polyfill";
import { useState } from "preact/hooks";

export function AuthConfig() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleEmailSignIn(e: Event) {
    e.preventDefault();
    setStatus("Signing in...");
    try {
      const response = await browser.runtime.sendMessage({ type: "SIGN_IN_EMAIL", email, password }) as { error?: string };
      setStatus(response?.error ? `Error: ${response.error}` : "Signed in.");
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleSignOut() {
    await browser.runtime.sendMessage({ type: "SIGN_OUT" });
    setStatus("Signed out.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontSize: 16 }}>Authentication</h2>
      <p style={{ color: "#6b7280" }}>
        Authentication identifies you within the app. Your GitHub PAT (set in Storage) is used independently for repository access.
      </p>
      <form onSubmit={handleEmailSignIn} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>
      <button onClick={handleSignOut} style={{ color: "#ef4444" }}>Sign out</button>
      {status && <p>{status}</p>}
    </div>
  );
}
