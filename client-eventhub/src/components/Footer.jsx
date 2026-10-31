function Footer() {
  return (
    <footer style={footer}>
      <div style={container}>
        <h3 style={{ margin: 0 }}>EventHub</h3>
        <p style={text}>© 2026 EventHub. All rights reserved.</p>
        <div style={links}>
          <span style={link}>Privacy</span>
          <span style={link}>Terms</span>
          <span style={link}>Contact</span>
        </div>
      </div>
    </footer>
  )
}

const footer = {
  background: "#111827",
  color: "#fff",
  padding: "20px 30px",
  marginTop: "40px",
}

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
}

const text = { fontSize: "14px", color: "#9ca3af" }

const links = { display: "flex", gap: "15px" }

const link = { fontSize: "14px", cursor: "pointer", color: "#d1d5db" }

export default Footer