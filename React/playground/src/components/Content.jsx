export default function Content() {
  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the main content area. It can hold any JSX passed into the layout slot.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
        <div style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h3>Card 1</h3>
          <p>Some metric: 128</p>
        </div>
        <div style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h3>Card 2</h3>
          <p>Some metric: 64</p>
        </div>
        <div style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h3>Card 3</h3>
          <p>Some metric: 256</p>
        </div>
      </div>
    </div>
  );
}
