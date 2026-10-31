import { useState } from "react"

function CommentSection() {
  const [comments, setComments] = useState([])
  const [text, setText] = useState("")

  const addComment = () => {
    if (!text.trim()) return
    setComments([...comments, text])
    setText("")
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          onClick={addComment}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        {comments.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#f1f5f9",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection