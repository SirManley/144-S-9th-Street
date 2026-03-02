import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase/auth";

export default function Login() {
  const nav = useNavigate();

  async function handleLogin() {
    await loginWithGoogle();
    nav("/admin");
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Admin Login</h1>
      <p>Sign in to upload photos and edit the house page.</p>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </main>
  );
}