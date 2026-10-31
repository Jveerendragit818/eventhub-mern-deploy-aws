const categories = ["All", "Workshops", "Tech Talks", "Cultural", "Sports"]

function CategoryFilter({ selected, setSelected }) {
  return (
    <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "20px",
            background: selected === cat ? "#2563eb" : "#e5e7eb",
            color: selected === cat ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: selected === cat ? "600" : "400",
            transition: "0.2s",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter