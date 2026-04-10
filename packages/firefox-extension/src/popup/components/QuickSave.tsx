import browser from "webextension-polyfill";
import { useEffect, useState } from "preact/hooks";
import type { Container } from "../../composition/container.js";
import { BookmarkTitle, BookmarkUrl } from "@bookmark/domain";

interface QuickSaveProps {
  container: Container;
}

export function QuickSave({ container }: QuickSaveProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      if (tab?.url) setUrl(tab.url);
      if (tab?.title) setTitle(tab.title);
    });
  }, []);

  async function handleSave(e: Event) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      await container.saveBookmark.execute({
        url: BookmarkUrl.of(url),
        title: BookmarkTitle.of(title),
        tags: [],
        description: "",
      });
      setStatus("saved");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label>
        URL
        <input
          type="url"
          value={url}
          onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
          required
          style={{ display: "block", width: "100%", marginTop: 4 }}
        />
      </label>
      <label>
        Title
        <input
          type="text"
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          required
          style={{ display: "block", width: "100%", marginTop: 4 }}
        />
      </label>
      <label>
        Tags (comma separated)
        <input
          type="text"
          value={tags}
          placeholder="typescript, architecture"
          onInput={(e) => setTags((e.target as HTMLInputElement).value)}
          style={{ display: "block", width: "100%", marginTop: 4 }}
        />
      </label>
      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save Bookmark"}
      </button>
      {status === "saved" && <p style={{ color: "green" }}>Saved!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
