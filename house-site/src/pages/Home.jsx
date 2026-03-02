import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase/db";
import { HOUSE_ID } from "../data/houseId";

export default function Home() {
  const [data, setData] = useState({ title: "", description: "", heroUrl: "" });
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    async function load() {
      try {
        setStatus("Loading…");
        const snap = await getDoc(doc(db, "houses", HOUSE_ID));
        if (snap.exists()) {
          const d = snap.data();
          setData({
            title: d.title || "",
            description: d.description || "",
            heroUrl: d.heroUrl || "",
          });
        }
        setStatus("");
      } catch (err) {
        console.error(err);
        setStatus(`Error: ${err?.code || err?.message || "unknown"}`);
      }
    }
    load();
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{data.title || "My House"}</h1>

      {status ? <div style={{ color: "#666", marginBottom: 12 }}>{status}</div> : null}

      {data.heroUrl ? (
        <Link to="/gallery" style={{ textDecoration: "none" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.10)" }}>
            <img src={data.heroUrl} alt="Hero" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ marginTop: 8, color: "#555", fontSize: 14 }}>Click the photo to view the gallery →</div>
        </Link>
      ) : (
        <div style={{ padding: 16, border: "1px dashed #ccc", borderRadius: 12 }}>
          No hero image yet. Upload one in Admin.
        </div>
      )}

      <div style={{ marginTop: 18, lineHeight: 1.6 }}>
        {(data.description || "").split("\n").map((p, i) => (
          <p key={i} style={{ margin: "0 0 12px" }}>
            {p}
          </p>
        ))}
      </div>
    </main>
  );
}