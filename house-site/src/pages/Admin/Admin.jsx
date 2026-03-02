import TextEditor from "./TextEditor";
import PhotoUploader from "./PhotoUploader";
import { logout } from "../../firebase/auth";

export default function Admin() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ marginTop: 0 }}>Admin</h1>
        <button
          onClick={logout}
          style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
        >
          Log out
        </button>
      </div>

      <TextEditor />
      <hr style={{ margin: "24px 0" }} />
      <PhotoUploader />
    </main>
  );
}