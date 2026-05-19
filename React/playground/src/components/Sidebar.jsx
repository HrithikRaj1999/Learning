export default function Sidebar() {
  const items = ["Dashboard", "Projects", "Settings", "Analytics", "Help"];

  return (
    <ul style={{ listStyle: "none", padding: "1rem", margin: 0 }}>
      {items.map((item) => (
        <li key={item} style={{ padding: "0.5rem 0.75rem", cursor: "pointer", borderRadius: "4px" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
