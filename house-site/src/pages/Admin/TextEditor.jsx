import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { HOUSE_ID } from "../../data/houseId";

export default function TextEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!mounted) return;
        setStatus("Loading…");

        const ref = doc(db, "houses", HOUSE_ID);
        const snap = await getDoc(ref);

        if (!mounted) return;

        if (snap.exists()) {
          const d = snap.data();
          setTitle(d.title || "");
          setDescription(d.description || "");
        } else {
          // Not an error: doc just doesn't exist yet.
          setStatus("");
        }

        setStatus("");
      } catch (err) {
        console.error("Load failed:", err);
        if (!mounted) return;
        setStatus(`Load error: ${err?.code || err?.message || "unknown"}`);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    try {
      setStatus("Saving…");

      const ref = doc(db, "houses", HOUSE_ID);
      await setDoc(
        ref,
        {
          title: title.trim(),
          description: description.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setStatus("Saved ✅");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error("Save failed:", err);
      setStatus(`Save error: ${err?.code || err?.message || "unknown"}`);
    }
  }

  const saving = status === "Saving…";
  const loading = status === "Loading…";

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0 }}>Home Page Text</h2>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 14, color: "#444" }}>Title</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My House"
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            opacity: loading ? 0.7 : 1,
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 14, color: "#444" }}>Description</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write anything you want here…"
          rows={7}
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            opacity: loading ? 0.7 : 1,
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={save}
          disabled={saving || loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: saving || loading ? "not-allowed" : "pointer",
            opacity: saving || loading ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <div style={{ fontSize: 14, color: "#555", wordBreak: "break-word" }}>
          {status}
        </div>
      </div>
    </section>
  );
}