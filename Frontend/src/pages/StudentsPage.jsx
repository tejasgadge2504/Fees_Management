export default function StudentsPage({ dark }) {
  const text = dark ? "#fff" : "#111827";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "700", color: text }}>
        Hii — Students
      </h1>
    </div>
  );
}
