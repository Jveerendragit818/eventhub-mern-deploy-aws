import { useState } from "react"

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("")

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <input
      type="text"
      placeholder="Search events..."
      value={value}
      onChange={handleChange}
      style={{
        padding: "10px",
        width: "100%",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxSizing: "border-box",
      }}
    />
  )
}

export default SearchBar