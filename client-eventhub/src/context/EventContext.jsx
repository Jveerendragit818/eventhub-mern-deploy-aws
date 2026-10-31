/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  return (
    <EventContext.Provider value={{}}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvent = () => useContext(EventContext)