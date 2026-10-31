import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import { EventProvider } from "./context/EventContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <EventProvider>
        <App />
      </EventProvider>
    </AuthProvider>
  </React.StrictMode>
)