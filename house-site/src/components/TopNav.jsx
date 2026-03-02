import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        background: "#fff",
        borderBottom: "1px solid #eee",
        zIndex: 10,
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}>
          Home
        </Link>
        <Link to="/gallery" style={{ textDecoration: "none", color: "#111" }}>
          Gallery
        </Link>
        <Link to="/admin" style={{ textDecoration: "none", color: "#111" }}>
          Admin
        </Link>
      </nav>
    </header>
  );
}