import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";

import { db } from "../firebase/db";
import { HOUSE_ID } from "../data/houseId";

import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(-1);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    async function load() {
      try {
        setStatus("Loading…");
        const q = query(collection(db, "houses", HOUSE_ID, "photos"), orderBy("order"));
        const snap = await getDocs(q);
        setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStatus("");
      } catch (err) {
        console.error(err);
        setStatus(`Error: ${err?.code || err?.message || "unknown"}`);
      }
    }
    load();
  }, []);

  // We don't know image dimensions yet; Lightbox doesn't require them.
  const albumPhotos = photos.map((p) => ({
    src: p.url,
    width: 1600,
    height: 1067,
    alt: p.caption || "House photo",
  }));

  const slides = albumPhotos.map((p) => ({ src: p.src, alt: p.alt }));

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ marginTop: 0 }}>Gallery</h1>
        <Link to="/" style={{ textDecoration: "none" }}>
          ← Home
        </Link>
      </div>

      {status ? <div style={{ color: "#666", marginBottom: 12 }}>{status}</div> : null}

      {photos.length ? (
        <>
          <PhotoAlbum layout="rows" photos={albumPhotos} targetRowHeight={220} onClick={({ index }) => setIndex(index)} />

          <Lightbox
            open={index >= 0}
            close={() => setIndex(-1)}
            index={index}
            slides={slides}
            plugins={[Zoom]}
            zoom={{ maxZoomPixelRatio: 4 }}
          />
        </>
      ) : (
        <div style={{ padding: 16, border: "1px dashed #ccc", borderRadius: 12 }}>
          No gallery photos yet. Upload some in Admin.
        </div>
      )}
    </main>
  );
}