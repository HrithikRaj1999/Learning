export default function Navbar() {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1.5rem", background: "#1a1a2e", color: "#fff" }}>
      <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>MyApp</span>
      <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>Home</a>
      <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>About</a>
      <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>Contact</a>
      <span style={{ marginLeft: "auto", fontSize: "0.9rem" }}>👤 User</span>
    </nav>
  );
}
