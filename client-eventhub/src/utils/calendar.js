export const downloadICS = (event) => {
  const formatDate = (date) => {
    return new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0]
  }

  const content = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDate(event.date)}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`

  const blob = new Blob([content], { type: "text/calendar" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "event.ics"
  link.click()
}