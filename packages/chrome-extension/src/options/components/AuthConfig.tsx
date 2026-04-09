import { useState } from "preact/hooks";

export function AuthConfig() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setStatus("Opening Google sign-in...");
    try {
      const response = await chrome.runtime.sendMessage({ type: "SIGN_IN_GOOGLE" });
      setStatus(response?.error ? `Error: ${response.error}` : "Signed in with Google.");
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleSignOut() {
    await chrome.runtime.sendMessage({ type: "SIGN_OUT" });
    setStatus("Signed out.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontSize: 16 }}>Authentication</h2>
      <p style={{ color: "#6b7280" }}>
        Authentication identifies you within the app. Your GitHub PAT (set in Storage) is used independently for repository access.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <button onClick={handleSignOut} style={{ color: "#ef4444" }}>Sign out</button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}
