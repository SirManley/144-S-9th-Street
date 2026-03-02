import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db } from "../../firebase/db";
import { storage } from "../../firebase/storage";
import { HOUSE_ID } from "../../data/houseId";

export default function PhotoUploader() {
  const [heroUrl, setHeroUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("");

  async function load() {
    try {
      setStatus("Loading images…");

      const houseSnap = await getDoc(doc(db, "houses", HOUSE_ID));
      if (houseSnap.exists()) setHeroUrl(houseSnap.data().heroUrl || "");

      const q = query(collection(db, "houses", HOUSE_ID, "photos"), orderBy("order"));
      const snap = await getDocs(q);
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus(`Load error: ${err?.code || err?.message || "unknown"}`);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadHero(file) {
    try {
      setStatus("Uploading hero…");

      const path = `houses/${HOUSE_ID}/hero/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, path);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await setDoc(
        doc(db, "houses", HOUSE_ID),
        { heroUrl: url, updatedAt: serverTimestamp() },
        { merge: true }
      );

      setHeroUrl(url);
      setStatus("Hero uploaded ✅");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setStatus(`Hero upload error: ${err?.code || err?.message || "unknown"}`);
    }
  }

  async function uploadGallery(fileList) {
    try {
      setStatus("Uploading gallery…");

      const maxOrder = photos.reduce((m, p) => Math.max(m, Number(p.order || 0)), 0);
      let order = maxOrder + 1;

      for (const file of fileList) {
        const path = `houses/${HOUSE_ID}/gallery/${Date.now()}-${file.name}`;
        const fileRef = ref(storage, path);

        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        await addDoc(collection(db, "houses", HOUSE_ID, "photos"), {
          url,
          caption: "",
          order,
          createdAt: serverTimestamp(),
        });

        order += 1;
      }

      await load();
      setStatus("Gallery uploaded ✅");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setStatus(`Gallery upload error: ${err?.code || err?.message || "unknown"}`);
    }
  }

  async function removePhoto(photoId) {
    try {
      setStatus("Deleting…");
      await deleteDoc(doc(db, "houses", HOUSE_ID, "photos", photoId));
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus(`Delete error: ${err?.code || err?.message || "unknown"}`);
    }
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Uploads</h2>
      {status ? <div style={{ fontSize: 14, color: "#555" }}>{status}</div> : null}

      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Hero image</h3>
        {heroUrl ? (
          <img src={heroUrl} alt="Hero" style={{ width: "100%", borderRadius: 12, marginBottom: 10 }} />
        ) : (
          <div style={{ padding: 10, border: "1px dashed #ccc", borderRadius: 12, marginBottom: 10 }}>
            No hero image yet.
          </div>
        )}

        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])} />
      </div>

      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Gallery images</h3>

        <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadGallery(e.target.files)} />

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 10,
              }}
            >
              <img src={p.url} alt="" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#666" }}>order: {p.order}</div>
                <div style={{ fontSize: 14 }}>{p.caption || "(no caption)"}</div>
              </div>
              <button
                onClick={() => removePhoto(p.id)}
                style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}