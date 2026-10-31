import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import AttendeeHome from "./pages/attendee/AttendeeHome"
import MySchedule from "./pages/attendee/MySchedule"

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard"
import CreateEvent from "./pages/organizer/CreateEvent"
import EditEvent from "./pages/organizer/EditEvent"

import EventDetails from "./pages/EventDetails"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ minHeight: "90vh" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute role="attendee">
                <AttendeeHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myschedule"
            element={
              <ProtectedRoute role="attendee">
                <MySchedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute role="organizer">
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute role="organizer">
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}

export default App